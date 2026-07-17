const fs = require('fs');

try {
  let rawData = fs.readFileSync('figma_dump.json', 'utf8');
  if (rawData.charCodeAt(0) === 0xFEFF) rawData = rawData.slice(1);
  const data = JSON.parse(rawData);

  const designPage = data.document.children.find(p => p.name === 'Design');
  const homeFrame = designPage.children.find(f => f.name === 'Home page');

  let output = "";

  function traverse(node, depth) {
    const indent = "  ".repeat(depth);
    let info = `${indent}- [${node.type}] ${node.name} (w:${Math.round(node.absoluteBoundingBox?.width)} h:${Math.round(node.absoluteBoundingBox?.height)})`;
    
    let cssProps = [];
    if (node.layoutMode) cssProps.push(`flex:${node.layoutMode}`);
    if (node.itemSpacing !== undefined) cssProps.push(`gap:${node.itemSpacing}`);
    if (node.paddingTop !== undefined) cssProps.push(`pt:${node.paddingTop}`);
    if (node.paddingBottom !== undefined) cssProps.push(`pb:${node.paddingBottom}`);
    if (node.paddingLeft !== undefined) cssProps.push(`pl:${node.paddingLeft}`);
    if (node.paddingRight !== undefined) cssProps.push(`pr:${node.paddingRight}`);
    
    if (node.type === 'TEXT') {
       cssProps.push(`font:${node.style?.fontFamily} ${node.style?.fontSize}px ${node.style?.fontWeight}`);
       if (node.characters) {
           const textPreview = node.characters.replace(/\\n/g, ' ').substring(0, 30);
           cssProps.push(`text:"${textPreview}"`);
       }
    }

    if (cssProps.length > 0) info += ` { ${cssProps.join(', ')} }`;
    output += info + "\\n";

    if (node.children) {
      node.children.forEach(c => traverse(c, depth + 1));
    }
  }

  traverse(homeFrame, 0);
  fs.writeFileSync('home_layout.txt', output, 'utf8');
  console.log("Written to home_layout.txt");
} catch (e) {
  console.error(e);
}
