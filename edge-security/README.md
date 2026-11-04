# Request protection

## Shared scanner protection — 4 November 2026

Added Pages middleware covering all request paths, including technical Pages hosts. It blocks the three confirmed scanner IPs (93.123.109.247, 192.253.209.46, 185.177.72.70), known vulnerability-scanner signatures, secret/configuration probes and server-script paths that this static project does not use. Public pages, game files, SEO routes, verification paths and contact routes pass through. No game rendering or gameplay code changed. The middleware uses the ordinary Pages Functions quota; existing zone-level WAF rules reject these requests earlier on custom domains. Policy tests cover encoded probes, spoofed crawler agents, confirmed source IPs and legitimate routes. Deployment and live verification are recorded after publication.

This policy is for the current static web build. When a future project adds a real PHP/WordPress or other server route, review and narrow the matching paths before enabling it. Do not add country-wide, browser-wide, or blanket crawler blocks. Do not treat historical HTTP requests as distinct human visitors.
