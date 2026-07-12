const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const email='hinischalsubba@gmail.com';

function bodyClasses(html,classes){return html.replace(/<body(?:\s+class="([^"]*)")?([^>]*)>/i,(_m,current='',rest='')=>{const set=new Set(`${current} ${classes}`.trim().split(/\s+/).filter(Boolean));return `<body class="${[...set].join(' '