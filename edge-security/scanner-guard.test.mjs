import {test} from 'node:test';
import assert from 'node:assert/strict';
import {scannerBlockReason, scannerResponse, BLOCKED_IPS} from './scanner-guard.mjs';
const req=(path='/',headers={})=>new Request('https://project.example'+path,{headers:{'User-Agent':'Mozilla/5.0','CF-Connecting-IP':'195.16.79.238',...headers}});
test('confirmed sources are denied even on a normal page; forwarding headers cannot override them',()=>{
  for(const ip of BLOCKED_IPS){assert.equal(scannerBlockReason(req('/',{'CF-Connecting-IP':ip,'X-Forwarded-For':'195.16.79.238'})),'blocked-source');assert.equal(scannerResponse(req('/',{'CF-Connecting-IP':ip})).status,403);}
});
test('scanner tools are denied independently of source IP',()=>{
  for(const ua of ['TLM-Audit-Scanner/2.0','sqlmap/1.0','Nikto','Nuclei - scanner','zgrab/0.x','masscan'])assert.equal(scannerBlockReason(req('/',{'User-Agent':ua})),'scanner');
});
test('secret and exploit probes remain denied when the agent claims to be Googlebot',()=>{
  for(const path of ['/.env','/node-api/.env.production','/.git/config','/app/.terraform/terraform.tfstate','/public_html/.env','/config.yml','/wp-admin/install.php','/lib/vendor/phpunit/phpunit/src/Util/PHP/eval-stdin.php','/~/.aws/config','/package-updates/download.cgi','/%2eenv','/%252eenv','/%2egit/config','/ENV/../.env','/.ENV','/x.php/extra'])assert.equal(scannerBlockReason(req(path,{'User-Agent':'Googlebot'})),'private-path',path);
});
test('public pages, game assets, SEO files, form and verification paths pass through',()=>{
  for(const path of ['/','/about/','/services/landing-page-design/','/privacy/','/robots.txt','/sitemap.xml','/api/contact','/assets/config.json','/models/Monk.glb','/assets/ship.webp','/scene.js','/mp3.worker.js','/.well-known/acme-challenge/token','/cdn-cgi/rum'])for(const ua of ['Mozilla/5.0','Googlebot','bingbot','Applebot','curl/8.7.1'])assert.equal(scannerBlockReason(req(path,{'User-Agent':ua})),null,path+' '+ua);
});
test('provider-verified bots pass probes, while a known blocked source remains blocked',()=>{
  const verified=req('/.git/config');Object.defineProperty(verified,'cf',{value:{botManagement:{verifiedBot:true}}});assert.equal(scannerBlockReason(verified),null);
  const denied=req('/',{'CF-Connecting-IP':'93.123.109.247'});Object.defineProperty(denied,'cf',{value:{botManagement:{verifiedBot:true}}});assert.equal(scannerBlockReason(denied),'blocked-source');
});
