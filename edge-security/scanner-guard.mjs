// Static web projects: server-side request protection. No browser secrets.
export const POLICY_VERSION = 'scanner-2026-11-04';
export const BLOCKED_IPS = new Set(['93.123.109.247', '192.253.209.46', '185.177.72.70']);
const SCANNERS = ['tlm-audit-scanner', 'sqlmap', 'nikto', 'nuclei', 'zgrab', 'masscan'];
const PRIVATE_PATHS = ['/.env', '/.git', '/.svn', '/.hg', '/.aws/', '/.terraform/', '/.kube/', '/phpunit/'];
const PRIVATE_FILES = new Set(['/config.yml', '/config.yaml', '/serverless.yaml', '/serverless.yml', '/sam-template.yaml', '/__debug', '/.htpasswd', '/.gitconfig']);

function normalizedPath(url) {
  let path = new URL(url).pathname;
  for (let i = 0; i < 2; i++) {
    try { const decoded = decodeURIComponent(path); if (decoded === path) break; path = decoded; }
    catch (_) { break; }
  }
  return path.replaceAll('\\', '/').toLowerCase();
}

export function scannerBlockReason(request) {
  // Cloudflare sets this header; X-Forwarded-For and client-supplied form fields are not trusted.
  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (BLOCKED_IPS.has(ip)) return 'blocked-source';
  // Use provider verification when available, never a claimed Googlebot user-agent.
  if (request.cf?.botManagement?.verifiedBot === true) return null;
  const agent = (request.headers.get('User-Agent') || '').toLowerCase();
  if (SCANNERS.some(signature => agent.includes(signature))) return 'scanner';
  const path = normalizedPath(request.url);
  if (PRIVATE_PATHS.some(signature => path.includes(signature)) || PRIVATE_FILES.has(path)
      || path.startsWith('/wp-') || /\.(?:php|asp|aspx|cgi|jsp)(?:\/|$)/.test(path)) return 'private-path';
  return null;
}

export function scannerResponse(request) {
  if (!scannerBlockReason(request)) return null;
  return new Response('Access denied.\n', { status: 403, headers: {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Robots-Tag': 'noindex',
    'X-Project-Guard': POLICY_VERSION
  } });
}
