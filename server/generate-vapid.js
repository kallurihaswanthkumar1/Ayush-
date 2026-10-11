import 'dotenv/config';
import fs from 'node:fs/promises';
import webpush from 'web-push';

const file = new URL('../.env', import.meta.url);
let source = '';
try { source = await fs.readFile(file, 'utf8'); } catch { /* create the local file */ }
const values = Object.fromEntries(source.split(/\r?\n/).filter((line) => /^[A-Z_]+=/.test(line)).map((line) => { const i = line.indexOf('='); return [line.slice(0, i), line.slice(i + 1)]; }));
if (values.VAPID_PUBLIC_KEY && values.VAPID_PRIVATE_KEY) {
  console.log('VAPID keys are already configured in .env.');
} else {
  const keys = webpush.generateVAPIDKeys();
  values.VAPID_PUBLIC_KEY = keys.publicKey;
  values.VAPID_PRIVATE_KEY = keys.privateKey;
  values.VAPID_SUBJECT ||= 'mailto:support@healthcopilot.local';
  const keysToWrite = new Set(['VAPID_PUBLIC_KEY', 'VAPID_PRIVATE_KEY', 'VAPID_SUBJECT']);
  const lines = source.split(/\r?\n/).filter((line) => !keysToWrite.has(line.split('=')[0]));
  while (lines.length && !lines.at(-1)) lines.pop();
  lines.push(...[...keysToWrite].map((key) => `${key}=${values[key]}`));
  await fs.writeFile(file, `${lines.join('\n')}\n`, { encoding: 'utf8', mode: 0o600 });
  console.log('VAPID keys were generated in the ignored local .env file. Set the same values as server environment variables in Render for production push.');
}
