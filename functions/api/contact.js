import { EmailMessage } from 'cloudflare:email';

const ALLOWED_ORIGINS = new Set([
  'https://nischhalsubba.com.np',
  'https://www.nischhalsubba.com.np',
]);
const DESTINATION_EMAIL = 'hinischalsubba@gmail.com';
const SENDER_EMAIL = 'portfolio@nischhalsubba.com.np';

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset