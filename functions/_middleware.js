import { scannerResponse } from '../edge-security/scanner-guard.mjs';

export function onRequest(context) {
  return scannerResponse(context.request) || context.next();
}
