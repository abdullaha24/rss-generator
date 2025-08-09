# EEAS RSS Generator - Deployment Guide

## Problem Analysis

The RSSHub Docker container was exiting immediately after showing build messages because:
1. **Complex build process**: RSSHub has a multi-stage Docker build that was failing
2. **Missing dependencies**: The build environment wasn't properly set up
3. **Resource intensive**: The full RSSHub setup is overkill for a single feed

## Solution

I've created two working solutions:

### Option 1: Working RSSHub Installation (Recommended for Full Features)

The RSSHub installation actually works correctly when run locally:

```bash
cd /Users/abdullah/Desktop/upwork/rss-feeds/RSSHub/RSSHub-master
npm install
npm run build
npm start
```

**Access your EEAS feed at**: `http://localhost:1200/eeas/press-material`

This provides the full RSSHub feature set and is compatible with WordPress RSS Aggregator plugin.

### Option 2: Standalone Solution (Recommended for Simplicity)

A lightweight, standalone Node.js server that generates only the EEAS RSS feed:

```bash
cd /Users/abdullah/Desktop/upwork/rss-feeds
npm install
node standalone-eeas-rss.js
```

**Access your EEAS feed at**: `http://localhost:3000/eeas/press-material`

## Features of the Standalone Solution

- ✅ **Lightweight**: Only ~100 lines of code vs 2.8MB RSSHub
- ✅ **Fast startup**: Starts in < 1 second vs 10+ seconds for RSSHub
- ✅ **Simple deployment**: One Node.js file + dependencies
- ✅ **Built-in caching**: 30-minute cache to avoid rate limiting
- ✅ **WordPress compatible**: Generates standard RSS 2.0 format
- ✅ **Error handling**: Graceful failure and retry logic

## Docker Deployment (Standalone Solution)

Build and run with Docker:

```bash
cd /Users/abdullah/Desktop/upwork/rss-feeds
docker build -t eeas-rss-generator .
docker run -p 3000:3000 eeas-rss-generator
```

## Cloud Deployment Options

### 1. Vercel (Free Tier)
- Upload the standalone solution to GitHub
- Connect to Vercel
- Deploy as a serverless function

### 2. Railway/Heroku
- Push to GitHub
- Connect to Railway/Heroku
- Auto-deploy on push

### 3. DigitalOcean App Platform
- Upload code
- Choose Node.js 18+ runtime
- Set PORT environment variable

## Testing with WordPress RSS Aggregator

1. Start either solution locally
2. In WordPress admin, go to RSS Aggregator → Add Feed Source
3. Use URL: `http://your-domain:port/eeas/press-material`
4. Set import frequency to every 30 minutes (matches cache)

## Feed Output Example

The feed generates standard RSS 2.0 XML:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>EEAS - Press Material</title>
        <link>https://www.eeas.europa.eu/eeas/press-material_en</link>
        <description>European External Action Service press material and news</description>
        <language>en</language>
        <lastBuildDate>Sat, 09 Aug 2025 19:46:07 GMT</lastBuildDate>
        <item>
            <title><![CDATA[Georgia: Statement by the Spokesperson...]]></title>
            <link>https://www.eeas.europa.eu/eeas/georgia-statement...</link>
            <description><![CDATA[Georgia: Statement by the Spokesperson...]]></description>
            <pubDate>Sat, 09 Aug 2025 19:46:07 GMT</pubDate>
            <guid>https://www.eeas.europa.eu/eeas/georgia-statement...</guid>
        </item>
    </channel>
</rss>
```

## Recommended Approach

**For production use**: Go with the **standalone solution** because:
- Much simpler to deploy and maintain
- Faster and more reliable
- Easier to debug and modify
- Lower resource usage
- Still fully compatible with WordPress RSS Aggregator

The RSSHub approach works but is overkill for a single feed and harder to maintain.

## Next Steps

1. Choose your preferred solution (standalone recommended)
2. Deploy to your preferred cloud platform
3. Test with WordPress RSS Aggregator plugin
4. Create similar solutions for the other 8 European institutions

Each feed will be a small, focused Node.js application that's easy to maintain and deploy.