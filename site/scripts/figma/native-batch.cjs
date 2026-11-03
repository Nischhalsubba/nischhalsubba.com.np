/**
 * @fileoverview Generate a read-only native Figma PNG batch with source identity.
 * Purpose: Make parallel export attachments independently traceable to their frames.
 * Responsibilities: Validate identifiers and attach a reversible CRC-protected PNG text chunk.
 * Execution context: Called by an authorized MCP operator; returned code runs through use_figma.
 * Connected files: accept-native-batch.py, export.py, figma-screen-inventory.csv.
 * Maintenance: Maximum five images per call. Strip transport metadata before retaining original bytes.
 */
const assert = require('node:assert/strict');
/** Function contract: makeNativeBatchScript
 * Purpose: Generate native exports without changing any design node.
 * Inputs: file key, page ID and one to five frame IDs.
 * Side effects: none locally; generated code changes page context and exports temporary images.
 * Returns: Figma Plugin API JavaScript with no explicit text return, preserving image attachments.
 */
function makeNativeBatchScript(fileKey, pageId, nodeIds) {
  assert.match(fileKey, /^[A-Za-z0-9_-]+$/);
  assert.match(pageId, /^\d+:\d+$/);
  assert.ok(nodeIds.length > 0 && nodeIds.length <= 5);
  for (const id of nodeIds) assert.match(id, /^\d+:\d+$/);
  return `const sourceFile=${JSON.stringify(fileKey)}, sourcePage=${JSON.stringify(pageId)};
const page=await figma.getNodeByIdAsync(sourcePage);await figma.setCurrentPageAsync(page);
await Promise.all(${JSON.stringify(nodeIds)}.map(async id=>{
 const node=await figma.getNodeByIdAsync(id);
 const original=await node.exportAsync({format:'PNG',constraint:{type:'SCALE',value:1}});
 const text='NS_SOURCE\\0'+sourceFile+'|'+sourcePage+'|'+id+'|'+original.length;
 const data=Uint8Array.from(Array.from(text).map(c=>c.charCodeAt(0)));
 const chunk=new Uint8Array(data.length+12), view=new DataView(chunk.buffer);
 view.setUint32(0,data.length);chunk.set([116,69,88,116],4);chunk.set(data,8);
 let crc=0xffffffff;
 for(const byte of chunk.slice(4,8+data.length)){crc^=byte;for(let k=0;k<8;k++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}
 view.setUint32(data.length+8,(crc^0xffffffff)>>>0);
 const tagged=new Uint8Array(original.length+chunk.length);
 tagged.set(original.slice(0,-12));tagged.set(chunk,original.length-12);tagged.set(original.slice(-12),original.length-12+chunk.length);
 await figma.io.write('/tmp/native-'+id.replace(':','-')+'.png',tagged);
}));`;
}
module.exports = { makeNativeBatchScript };
