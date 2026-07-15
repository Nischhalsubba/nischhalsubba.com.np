import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const xml = fs.readFileSync(path.resolve('dist/sitemap.xml'), 'utf8');
const routes = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname