Project Summary:
Client Request: Create RSS feeds for 9 European institutional websites that lack RSS or have problematic feeds for WordPress RSS Aggregator plugin import.
Client Workflow: Uses WP RSS Aggregator to automatically pull RSS feeds → create WordPress draft posts → manual review/publish.
9 Target Sites:

EEAS press material (no RSS)
Curia press releases (no RSS, PDF content)
Europarl RSS (existing but PDF links need text extraction)
ECA news (no RSS)
Consilium press releases (no RSS)
Frontex RSS (exists but plugin incompatible)
Europol RSS (exists but partial content only)
COE newsroom (no RSS)
NATO news (no RSS)

Solution: RSSHub

Open-source RSS generation framework
Create custom scraping routes for each site
Handle PDF text extraction for sites 2,3
Fix existing feeds 6,7 with proper formatting
Deploy publicly for RSS URLs

Technical Approach:

Docker setup locally for development
Write JavaScript routes in /lib/routes/[sitename]/
Web scraping with Cheerio for HTML parsing
PDF text extraction for document-heavy sites
Deploy to Vercel (free tier) for public access

Deliverables: 9 working RSS feed URLs compatible with WP RSS Aggregator plugin
Timeline: Monday completion confirmed
Challenges Identified:

PDF content extraction (3 sites)
Plugin compatibility fixes (2 sites)
All technically feasible with RSSHub

Deployment: Vercel free tier sufficient for bandwidth needsRetryClaude can make mistakes. Please double-check responses.
