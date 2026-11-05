// Exercise the actual audit helper without running its filesystem-dependent top-level audit.
const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');
const source=fs.readFileSync('site/scripts/audit-seo-contract.cjs','utf8');
const helper=source.match(/function attribute\(tag, name\) \{[\s\S]*?\n\}/)[0];
const attribute=vm.runInNewContext('('+helper+')');
assert.equal(attribute('<meta content="A studio\'s real work">','content'),"A studio's real work");
assert.equal(attribute("<meta content='A \"quoted\" example'>",'content'),'A "quoted" example');
assert.equal(attribute('<meta content = "spaced">','content'),'spaced');
assert.equal(attribute('<meta name="description">','content'),'');
console.log('SEO attribute parser: mixed quotes, whitespace and missing attributes passed.');
