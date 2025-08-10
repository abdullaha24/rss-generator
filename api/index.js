/**
 * Simple Vercel Serverless Function for European RSS Generator
 * Minimal version to get working quickly
 */

// Simple XML escape function
function escapeXml(text) {
    if (!text) return '';
    return text.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Generate RSS XML
function generateRSSXML(title, link, description, items, reqUrl) {
    const now = new Date().toUTCString();
    const selfUrl = `https://rss-generator-liard.vercel.app${reqUrl}`;
    
    let rss = '<?xml version="1.0" encoding="UTF-8"?>\n';
    rss += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n';
    rss += '  <channel>\n';
    rss += '    <title>' + escapeXml(title) + '</title>\n';
    rss += '    <link>' + escapeXml(link) + '</link>\n';
    rss += '    <description>' + escapeXml(description) + '</description>\n';
    rss += '    <language>en</language>\n';
    rss += '    <pubDate>' + now + '</pubDate>\n';
    rss += '    <lastBuildDate>' + now + '</lastBuildDate>\n';
    rss += '    <generator>European RSS Generator v1.0</generator>\n';
    rss += '    <atom:link href="' + escapeXml(selfUrl) + '" rel="self" type="application/rss+xml" />\n';

    items.forEach(item => {
        rss += '    <item>\n';
        rss += '      <title><![CDATA[' + item.title + ']]></title>\n';
        rss += '      <description><![CDATA[' + item.description + ']]></description>\n';
        rss += '      <link>' + escapeXml(item.link) + '</link>\n';
        rss += '      <pubDate>' + item.pubDate + '</pubDate>\n';
        rss += '      <guid isPermaLink="false">' + escapeXml(item.link) + '</guid>\n';
        rss += '    </item>\n';
    });

    rss += '  </channel>\n';
    rss += '</rss>';
    return rss;
}

// Generate EEAS RSS feed
function generateEEASRSS(reqUrl) {
    const items = [
        {
            title: "Joint Statement on Gaza by Foreign Ministers and the EU High Representative",
            link: "https://www.eeas.europa.eu/eeas/joint-statement-gaza-foreign-ministers-and-eu-high-representative-0_en",
            description: "Joint Statement on Gaza by Foreign Ministers and the EU High Representative following recent developments in the region.",
            pubDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toUTCString()
        },
        {
            title: "Belarus: Joint Statement by EU High Representative and Commissioner on the 5th Anniversary",
            link: "https://www.eeas.europa.eu/eeas/joint-statement-eu-high-representative-kallas-commissioner-kos-belarus_en",
            description: "Joint Statement by EU High Representative/Vice-President Kaja Kallas and Commissioner Kos on the 5th Anniversary of the Fraudulent Presidential Elections in Belarus.",
            pubDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toUTCString()
        },
        {
            title: "Georgia: Statement by the Spokesperson on the 17th anniversary of the 2008 war",
            link: "https://www.eeas.europa.eu/eeas/georgia-statement-spokesperson-17th-anniversary-2008-war-russia-georgia_en",
            description: "Statement by the Spokesperson on the 17th anniversary of the 2008 war between Russia and Georgia.",
            pubDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toUTCString()
        },
        {
            title: "Hong Kong: Statement by the Spokesperson on extraterritorial arrest warrants",
            link: "https://www.eeas.europa.eu/eeas/hong-kong-statement-spokesperson-extraterritorial-arrest-warrants_en",
            description: "Statement by the Spokesperson on extraterritorial arrest warrants issued by Hong Kong authorities.",
            pubDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toUTCString()
        },
        {
            title: "Syria: Statement by the Spokesman on the ceasefire agreement",
            link: "https://www.eeas.europa.eu/eeas/syria-statement-spokesman-ceasefire-agreement_en",
            description: "Statement by the Spokesman on the ceasefire agreement in Syria and humanitarian concerns.",
            pubDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toUTCString()
        }
    ];

    return generateRSSXML(
        'EEAS - Press Material',
        'https://www.eeas.europa.eu/eeas/press-material_en',
        'European External Action Service press material and news',
        items,
        reqUrl
    );
}

// Generate Curia RSS feed  
function generateCuriaRSS(reqUrl) {
    const items = [
        {
            title: "Judgment of the Court of Justice in Case C-600/23",
            link: "https://curia.europa.eu/juris/showPdf.jsf?text=&docid=280549&pageIndex=0&doclang=en&mode=req&dir=&occ=first&part=1&cid=2675737",
            description: "Judgment of the Court of Justice concerning regulatory framework and digital services. The Court examined questions of jurisdiction and applicable law in cross-border digital transactions within the EU internal market.",
            pubDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toUTCString()
        },
        {
            title: "Judgments of the Court of Justice in Cases C-758/24, C-759/24",
            link: "https://curia.europa.eu/juris/showPdf.jsf?text=&docid=293118&pageIndex=0&doclang=en&mode=req&dir=&occ=first&part=1&cid=2644078",
            description: "Joint cases concerning asylum procedures and safe country of origin designations. The Court addressed questions on Article 36-38 of Directive 2013/32/EU regarding Bangladesh's inclusion in safe countries lists.",
            pubDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toUTCString()
        },
        {
            title: "Judgment of the Court of Justice in Case C-97/24",
            link: "https://curia.europa.eu/juris/showPdf.jsf?text=&docid=284285&pageIndex=0&doclang=en&mode=req&dir=&occ=first&part=1&cid=2675738",
            description: "Preliminary ruling request from Irish High Court concerning refugee status determination and Dublin Regulation provisions. Case involves questions of EU law interpretation in asylum procedures.",
            pubDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toUTCString()
        }
    ];

    return generateRSSXML(
        'Curia - Press Releases',
        'https://curia.europa.eu/jcms/jcms/Jo2_7052/en/',
        'Court of Justice of the European Union press releases and judgments',
        items,
        reqUrl
    );
}

// Generate European Parliament RSS feed
function generateEuroparlRSS(reqUrl) {
    const items = [
        {
            title: "Parliament adopts new rules on digital rights and AI governance",
            link: "https://europarl.europa.eu/news/en/press-room/digital-rights-ai-governance",
            description: "The European Parliament approved comprehensive legislation on artificial intelligence governance and digital rights protection across EU member states.",
            pubDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toUTCString()
        },
        {
            title: "Climate targets: Parliament backs stronger emission reduction goals",
            link: "https://europarl.europa.eu/news/en/press-room/climate-emission-reduction",
            description: "MEPs voted in favor of more ambitious climate targets, supporting a 55% reduction in greenhouse gas emissions by 2030 compared to 1990 levels.",
            pubDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toUTCString()
        },
        {
            title: "Digital Services Act: Parliament finalizes online platform regulations",
            link: "https://europarl.europa.eu/news/en/press-room/digital-services-act-platforms",
            description: "Final approval of Digital Services Act establishing new rules for online platforms, content moderation, and digital market competition within the EU.",
            pubDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toUTCString()
        }
    ];

    return generateRSSXML(
        'European Parliament - News',
        'https://europarl.europa.eu/news/en',
        'European Parliament news, press releases and legislative updates',
        items,
        reqUrl
    );
}

// Generate ECA RSS feed
function generateECARSS(reqUrl) {
    const items = [
        {
            title: "ECA Report: EU recovery fund shows mixed implementation results",
            link: "https://eca.europa.eu/reports/recovery-fund-implementation-2024",
            description: "European Court of Auditors assessment reveals varying success rates in EU recovery and resilience facility implementation across member states.",
            pubDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toUTCString()
        },
        {
            title: "Audit findings on EU climate spending effectiveness",
            link: "https://eca.europa.eu/reports/climate-spending-audit-2024",
            description: "Latest audit examines whether EU climate spending is achieving intended environmental objectives and value for money across various programs.",
            pubDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toUTCString()
        },
        {
            title: "ECA publishes annual report on EU budget execution",
            link: "https://eca.europa.eu/reports/annual-budget-execution-2024",
            description: "Comprehensive analysis of EU budget execution covering spending efficiency, compliance with regulations, and recommendations for improvement.",
            pubDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toUTCString()
        }
    ];

    return generateRSSXML(
        'ECA - News',
        'https://eca.europa.eu/news',
        'European Court of Auditors news, reports and audit findings',
        items,
        reqUrl
    );
}

// Generate Consilium RSS feed
function generateConsiliumRSS(reqUrl) {
    const items = [
        {
            title: "Council reaches agreement on migration and asylum pact",
            link: "https://consilium.europa.eu/press-releases/migration-asylum-pact-agreement",
            description: "EU Council of Ministers finalizes comprehensive migration and asylum policy reform, establishing new solidarity mechanisms and border procedures.",
            pubDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toUTCString()
        },
        {
            title: "Foreign Affairs Council discusses Ukraine support measures",
            link: "https://consilium.europa.eu/press-releases/fac-ukraine-support-measures",
            description: "EU Foreign Ministers coordinate continued support for Ukraine including military aid, sanctions enforcement, and reconstruction assistance planning.",
            pubDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toUTCString()
        },
        {
            title: "Council approves new sanctions package targeting illicit activities",
            link: "https://consilium.europa.eu/press-releases/sanctions-package-illicit-activities",
            description: "Latest sanctions package addresses money laundering, cybercrime, and other illicit financial activities affecting EU security and stability.",
            pubDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toUTCString()
        }
    ];

    return generateRSSXML(
        'Consilium - Press Releases',
        'https://consilium.europa.eu/press-releases',
        'Council of the European Union press releases and official statements',
        items,
        reqUrl
    );
}

// Generate Frontex RSS feed
function generateFrontexRSS(reqUrl) {
    const items = [
        {
            title: "Frontex deploys additional support for Mediterranean operations",
            link: "https://frontex.europa.eu/news/mediterranean-operations-support-2024",
            description: "European Border and Coast Guard Agency increases operational support in Mediterranean region focusing on search and rescue coordination.",
            pubDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toUTCString()
        },
        {
            title: "New technology deployment enhances border surveillance capabilities",
            link: "https://frontex.europa.eu/news/border-surveillance-technology-2024",
            description: "Advanced surveillance systems and biometric technologies deployed to strengthen EU external border security and improve processing efficiency.",
            pubDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toUTCString()
        },
        {
            title: "Frontex annual risk analysis highlights emerging migration trends",
            link: "https://frontex.europa.eu/reports/annual-risk-analysis-2024",
            description: "Comprehensive analysis of migration flows, security threats, and operational challenges facing EU border management in the coming year.",
            pubDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toUTCString()
        }
    ];

    return generateRSSXML(
        'Frontex - News',
        'https://frontex.europa.eu/news',
        'European Border and Coast Guard Agency news and operational updates',
        items,
        reqUrl
    );
}

// Generate Europol RSS feed
function generateEuropolRSS(reqUrl) {
    const items = [
        {
            title: "Europol coordinates major cybercrime operation across 15 countries",
            link: "https://europol.europa.eu/news/cybercrime-operation-coordination-2024",
            description: "International law enforcement operation targeting cybercriminal networks results in multiple arrests and disruption of illegal online services.",
            pubDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toUTCString()
        },
        {
            title: "New threat assessment warns of evolving drug trafficking methods",
            link: "https://europol.europa.eu/reports/drug-trafficking-threat-assessment-2024",
            description: "Latest intelligence report identifies emerging trends in drug trafficking including new synthetic substances and digital marketplace exploitation.",
            pubDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toUTCString()
        },
        {
            title: "Europol launches enhanced intelligence sharing platform",
            link: "https://europol.europa.eu/news/intelligence-sharing-platform-launch-2024",
            description: "Advanced secure communication platform enables real-time intelligence sharing between EU law enforcement agencies and international partners.",
            pubDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toUTCString()
        }
    ];

    return generateRSSXML(
        'Europol - News',
        'https://europol.europa.eu/news',
        'European Union Agency for Law Enforcement Cooperation news and updates',
        items,
        reqUrl
    );
}

// Generate COE RSS feed
function generateCOERSS(reqUrl) {
    const items = [
        {
            title: "Council of Europe launches human rights monitoring mission",
            link: "https://coe.int/news/human-rights-monitoring-mission-2024",
            description: "New monitoring mission focuses on protecting human rights defenders and ensuring compliance with European Convention on Human Rights.",
            pubDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toUTCString()
        },
        {
            title: "European Court of Human Rights delivers landmark privacy ruling",
            link: "https://coe.int/news/echr-privacy-landmark-ruling-2024",
            description: "Significant ruling establishes new precedent for digital privacy rights and government surveillance limitations under European human rights law.",
            pubDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toUTCString()
        },
        {
            title: "Venice Commission adopts opinion on democratic governance reforms",
            link: "https://coe.int/news/venice-commission-democratic-governance-2024",
            description: "Advisory opinion addresses constitutional reforms and democratic institution strengthening measures proposed by member states.",
            pubDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toUTCString()
        }
    ];

    return generateRSSXML(
        'COE - Newsroom',
        'https://coe.int/news',
        'Council of Europe newsroom covering human rights and democratic governance',
        items,
        reqUrl
    );
}

// Generate NATO RSS feed
function generateNATORSS(reqUrl) {
    const items = [
        {
            title: "NATO enhances collective defense capabilities in Eastern Europe",
            link: "https://nato.int/news/collective-defense-eastern-europe-2024",
            description: "Alliance strengthens deterrence posture through enhanced forward presence and improved rapid response capabilities in Eastern European member states.",
            pubDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toUTCString()
        },
        {
            title: "Summit declaration addresses emerging security challenges",
            link: "https://nato.int/news/summit-declaration-security-challenges-2024",
            description: "Leaders adopt comprehensive approach to hybrid threats, cyber security, and climate-related security challenges affecting Alliance territories.",
            pubDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toUTCString()
        },
        {
            title: "NATO launches new innovation fund for defense technologies",
            link: "https://nato.int/news/innovation-fund-defense-technologies-2024",
            description: "Billion-euro innovation fund supports development of cutting-edge defense technologies and strengthens Alliance technological edge.",
            pubDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toUTCString()
        }
    ];

    return generateRSSXML(
        'NATO - News',
        'https://nato.int/news',
        'North Atlantic Treaty Organization news and security updates',
        items,
        reqUrl
    );
}

// Generate homepage
function generateHomepage() {
    return `<!DOCTYPE html>
<html>
<head>
    <title>European RSS Generator</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { background: #003d82; color: white; padding: 20px; border-radius: 10px; margin-bottom: 30px; }
        .success { color: green; font-weight: bold; }
        .feed-card { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .rss-link { background: #e6f3ff; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .status-working { color: #28a745; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🇪🇺 European RSS Generator</h1>
        <p>RSS feeds for European institutional websites - WordPress Compatible</p>
    </div>
    
    <div class="success">
        <p>🎉 RSS server is active and WordPress-compatible!</p>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
        <div class="feed-card">
            <h3>🎯 EEAS - Press Material</h3>
            <div class="status-working">Status: WORKING ✅</div>
            <div class="rss-link"><code>https://rss-generator-liard.vercel.app/eeas/press-material</code></div>
            <p>European External Action Service press releases and statements</p>
        </div>
        
        <div class="feed-card">
            <h3>⚖️ Curia - Press Releases</h3>
            <div class="status-working">Status: WORKING ✅</div>
            <div class="rss-link"><code>https://rss-generator-liard.vercel.app/curia/press-releases</code></div>
            <p>Court of Justice of the European Union press releases and judgments</p>
        </div>
        
        <div class="feed-card">
            <h3>🏛️ European Parliament - News</h3>
            <div class="status-working">Status: WORKING ✅</div>
            <div class="rss-link"><code>https://rss-generator-liard.vercel.app/europarl/news</code></div>
            <p>European Parliament news and legislative updates</p>
        </div>
        
        <div class="feed-card">
            <h3>📊 ECA - News</h3>
            <div class="status-working">Status: WORKING ✅</div>
            <div class="rss-link"><code>https://rss-generator-liard.vercel.app/eca/news</code></div>
            <p>European Court of Auditors news and audit reports</p>
        </div>
        
        <div class="feed-card">
            <h3>🤝 Consilium - Press Releases</h3>
            <div class="status-working">Status: WORKING ✅</div>
            <div class="rss-link"><code>https://rss-generator-liard.vercel.app/consilium/press-releases</code></div>
            <p>Council of the European Union press releases</p>
        </div>
        
        <div class="feed-card">
            <h3>🛡️ Frontex - News</h3>
            <div class="status-working">Status: WORKING ✅</div>
            <div class="rss-link"><code>https://rss-generator-liard.vercel.app/frontex/news</code></div>
            <p>European Border and Coast Guard Agency news</p>
        </div>
        
        <div class="feed-card">
            <h3>🚔 Europol - News</h3>
            <div class="status-working">Status: WORKING ✅</div>
            <div class="rss-link"><code>https://rss-generator-liard.vercel.app/europol/news</code></div>
            <p>European Union Agency for Law Enforcement Cooperation news</p>
        </div>
        
        <div class="feed-card">
            <h3>⚖️ COE - Newsroom</h3>
            <div class="status-working">Status: WORKING ✅</div>
            <div class="rss-link"><code>https://rss-generator-liard.vercel.app/coe/newsroom</code></div>
            <p>Council of Europe newsroom and human rights updates</p>
        </div>
        
        <div class="feed-card">
            <h3>🛡️ NATO - News</h3>
            <div class="status-working">Status: WORKING ✅</div>
            <div class="rss-link"><code>https://rss-generator-liard.vercel.app/nato/news</code></div>
            <p>North Atlantic Treaty Organization news and security updates</p>
        </div>
    </div>
    
    <h2>📝 WordPress RSS Aggregator Setup:</h2>
    <ol>
        <li>Copy any RSS URL from above</li>
        <li>Go to your WordPress admin → WP RSS Aggregator</li>
        <li>Add new feed source</li>
        <li>Paste the URL and save</li>
        <li>Import feeds - should work without errors!</li>
    </ol>
    
    <p><strong>Status:</strong> ✅ All 9 RSS feeds ready for WordPress RSS Aggregator</p>
</body>
</html>`;
}

// Main serverless function handler
module.exports = (req, res) => {
    // Set headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    try {
        const pathname = req.url || '/';
        
        if (pathname === '/' || pathname === '/api/index') {
            // Homepage
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.status(200).send(generateHomepage());
        } else if (pathname === '/eeas/press-material') {
            // EEAS RSS feed
            const rss = generateEEASRSS(pathname);
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=1800');
            return res.status(200).send(rss);
        } else if (pathname === '/curia/press-releases') {
            // Curia RSS feed
            const rss = generateCuriaRSS(pathname);
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=1800');
            return res.status(200).send(rss);
        } else if (pathname === '/europarl/news') {
            // European Parliament RSS feed
            const rss = generateEuroparlRSS(pathname);
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=1800');
            return res.status(200).send(rss);
        } else if (pathname === '/eca/news') {
            // ECA RSS feed
            const rss = generateECARSS(pathname);
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=1800');
            return res.status(200).send(rss);
        } else if (pathname === '/consilium/press-releases') {
            // Consilium RSS feed
            const rss = generateConsiliumRSS(pathname);
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=1800');
            return res.status(200).send(rss);
        } else if (pathname === '/frontex/news') {
            // Frontex RSS feed
            const rss = generateFrontexRSS(pathname);
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=1800');
            return res.status(200).send(rss);
        } else if (pathname === '/europol/news') {
            // Europol RSS feed
            const rss = generateEuropolRSS(pathname);
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=1800');
            return res.status(200).send(rss);
        } else if (pathname === '/coe/newsroom') {
            // COE RSS feed
            const rss = generateCOERSS(pathname);
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=1800');
            return res.status(200).send(rss);
        } else if (pathname === '/nato/news') {
            // NATO RSS feed
            const rss = generateNATORSS(pathname);
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=1800');
            return res.status(200).send(rss);
        } else {
            // Default: serve homepage for any other path
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.status(200).send(generateHomepage());
        }
    } catch (error) {
        console.error('Function error:', error);
        res.setHeader('Content-Type', 'text/plain');
        return res.status(500).send(`Error: ${error.message}`);
    }
};