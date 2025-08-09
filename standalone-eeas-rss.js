#!/usr/bin/env node

const http = require('http');
const https = require('https');
const cheerio = require('cheerio');
const url = require('url');

/**
 * Standalone EEAS RSS Generator
 * Simple alternative to RSSHub for generating EEAS press material RSS feed
 */

class EEASRSSGenerator {
    constructor() {
        this.port = process.env.PORT || 3000;
        this.cache = new Map();
        this.cacheExpiry = 30 * 60 * 1000; // 30 minutes
    }

    async fetchWithHeaders(targetUrl) {
        return new Promise((resolve, reject) => {
            const options = {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                }
            };

            https.get(targetUrl, options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(data));
            }).on('error', reject);
        });
    }

    async generateEEASRSS() {
        const cacheKey = 'eeas-rss';
        const cached = this.cache.get(cacheKey);
        
        if (cached && (Date.now() - cached.timestamp < this.cacheExpiry)) {
            return cached.data;
        }

        try {
            const rootUrl = 'https://www.eeas.europa.eu';
            
            // Try multiple URLs to get press releases
            const urls = [
                `${rootUrl}/filter-page/press-material_en?f%5B0%5D=pm_category%3APress%20release`,
                `${rootUrl}/filter-page/press-material_en?f%5B0%5D=pm_category%3AStatement/Declaration`,
                `${rootUrl}/eeas/press-material_en?f%5B0%5D=press_site%3AEEAS`
            ];
            
            let items = [];
            
            for (const targetUrl of urls) {
                console.log(`Fetching: ${targetUrl}`);
                try {
                    const html = await this.fetchWithHeaders(targetUrl);
                    const $ = cheerio.load(html);
                    
                    // Extract items from this URL
                    const pageItems = this.extractItemsFromPage($, rootUrl);
                    items = items.concat(pageItems);
                    
                    console.log(`Found ${pageItems.length} items from ${targetUrl}`);
                } catch (error) {
                    console.log(`Failed to fetch ${targetUrl}:`, error.message);
                }
            }
            
            // Remove duplicates and limit
            items = items.filter((item, index, self) => 
                index === self.findIndex(t => t.guid === item.guid)
            ).slice(0, 20);
            
            console.log(`Total unique items: ${items.length}`);
            
            const rss = this.generateRSSXML(items);
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: rss,
                timestamp: Date.now()
            });
            
            return rss;
            
        } catch (error) {
            console.error('Error generating EEAS RSS:', error);
            throw error;
        }
    }
    
    extractItemsFromPage($, rootUrl) {
            
        // Find press release links using various selectors
        const pressPatterns = [
            /statement/i,
            /joint.*statement/i,
            /press.*release/i,
            /communique/i,
            /declaration/i
        ];
        
        let items = [];
        
        // Try different link selectors
        const linkSelectors = [
            'a[href*="/eeas/"]',
            'a[href*="statement"]',
            'a[href*="press"]',
            '.view-content a',
            '.views-row a'
        ];
        
        linkSelectors.forEach(selector => {
            $(selector).each((i, element) => {
                const href = $(element).attr('href');
                const title = $(element).text().trim();
                
                if (!href || !title) return;
                
                // Skip navigation and non-content links
                if (title.length < 15 || 
                    href.includes('_fr') || 
                    href.includes('_de') || 
                    href.includes('_es') ||
                    href.includes('press-material') ||
                    href.includes('about-') ||
                    href.includes('creation-') ||
                    href.includes('structure-') ||
                    href.includes('annual-reports') ||
                    href.includes('high-representative') ||
                    title.toLowerCase().includes('français') ||
                    title.toLowerCase().includes('deutsch') ||
                    title.toLowerCase().includes('español') ||
                    title.toLowerCase().includes('read more') ||
                    title.toLowerCase().includes('filter')) {
                    return;
                }
                
                // Check if this is likely a press release/statement
                const isPress = pressPatterns.some(pattern => pattern.test(title)) ||
                              title.toLowerCase().includes('georgia') ||
                              title.toLowerCase().includes('belarus') ||
                              title.toLowerCase().includes('gaza') ||
                              title.toLowerCase().includes('ukraine') ||
                              title.toLowerCase().includes('china') ||
                              title.toLowerCase().includes('russia') ||
                              title.toLowerCase().includes('syria') ||
                              title.toLowerCase().includes('hong kong') ||
                              title.toLowerCase().includes('macao') ||
                              title.toLowerCase().includes('bosnia') ||
                              title.toLowerCase().includes('myanmar') ||
                              title.toLowerCase().includes('venezuela') ||
                              title.toLowerCase().includes('afghanistan');
                
                if (isPress) {
                    // Handle relative URLs
                    let fullUrl;
                    if (href.startsWith('http')) {
                        fullUrl = href;
                    } else if (href.startsWith('/')) {
                        fullUrl = rootUrl + href;
                    } else {
                        fullUrl = new URL(href, rootUrl).href;
                    }
                    
                    items.push({
                        title: title,
                        link: fullUrl,
                        description: title,
                        pubDate: new Date().toUTCString(),
                        guid: fullUrl
                    });
                }
            });
        });
        
        return items;
    }

    generateRSSXML(items) {
        const now = new Date().toUTCString();
        
        let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>EEAS - Press Material</title>
        <link>https://www.eeas.europa.eu/eeas/press-material_en</link>
        <description>European External Action Service press material and news</description>
        <language>en</language>
        <lastBuildDate>${now}</lastBuildDate>
        <atom:link href="http://localhost:${this.port}/eeas/press-material" rel="self" type="application/rss+xml" />
        <generator>Standalone EEAS RSS Generator</generator>
`;

        items.forEach(item => {
            rss += `        <item>
            <title><![CDATA[${item.title}]]></title>
            <link>${item.link}</link>
            <description><![CDATA[${item.description}]]></description>
            <pubDate>${item.pubDate}</pubDate>
            <guid>${item.guid}</guid>
        </item>
`;
        });

        rss += `    </channel>
</rss>`;

        return rss;
    }

    start() {
        const server = http.createServer(async (req, res) => {
            const parsedUrl = url.parse(req.url);
            
            // CORS headers
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            
            if (parsedUrl.pathname === '/eeas/press-material') {
                try {
                    const rss = await this.generateEEASRSS();
                    res.writeHead(200, {
                        'Content-Type': 'application/xml; charset=utf-8',
                        'Cache-Control': 'public, max-age=1800' // 30 minutes
                    });
                    res.end(rss);
                } catch (error) {
                    console.error('Error:', error);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                }
            } else if (parsedUrl.pathname === '/') {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>Standalone EEAS RSS Generator</title>
</head>
<body>
    <h1>Standalone EEAS RSS Generator</h1>
    <p>Available RSS feeds:</p>
    <ul>
        <li><a href="/eeas/press-material">EEAS Press Material</a></li>
    </ul>
    <p>Status: Running on port ${this.port}</p>
</body>
</html>
                `);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            }
        });

        server.listen(this.port, () => {
            console.log(`🎉 Standalone EEAS RSS Generator running on port ${this.port}`);
            console.log(`🔗 Local: http://localhost:${this.port}`);
            console.log(`📡 RSS Feed: http://localhost:${this.port}/eeas/press-material`);
        });

        return server;
    }
}

// Start the server if this file is run directly
if (require.main === module) {
    const generator = new EEASRSSGenerator();
    generator.start();
}

module.exports = EEASRSSGenerator;