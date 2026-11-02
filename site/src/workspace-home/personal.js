/* @fileoverview Project index dialog and scope label interactions
Purpose: Serve Nischhal’s approved workspace portfolio.
Responsibilities: Preserve identity, keyboard interactions, local assets and the approved layout.
Execution context: Browser; installed by the final production build stage.
Connected files: scripts/install-workspace-home.cjs, scripts/audit-workspace-home.cjs, src/workspace-home/index.html.
Maintenance: Keep assets under /workspace-home and verify behavior after edits.
*/
/** Callback contract: Initialize project browsing and scope labels. Inputs: Browser DOM. Side effects: Registers local UI event handlers. Returns: Nothing. */
(/** Callback contract: Initialize the project dialog. Inputs: DOM. Side effects: Registers interaction handlers. Returns: Nothing. */ ()=>{const d=document.getElementById('projectIndex'),o=document.getElementById('openIndex'),c=document.getElementById('closeIndex');o?.addEventListener('click',()=>d.showModal());c?.addEventListener('click',()=>d.close());d?.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}});d?.addEventListener('wheel',e=>e.stopPropagation(),{passive:true});document.querySelector('.pr-cur')?.replaceChildren(document.createTextNode('CUSTOM SCOPE · QUOTE AFTER DISCOVERY'));document.getElementById('prTot')?.replaceChildren(document.createTextNode('Select a service'));})();
