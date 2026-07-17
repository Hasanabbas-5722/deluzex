const fs = require('fs');

function rgbaToHex(color) {
    if (!color) return 'transparent';
    const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
    const a = color.a < 1 ? Math.round(color.a * 255).toString(16).padStart(2, '0') : '';
    return `#${r}${g}${b}${a}`;
}

function extractPaints(paints) {
    if (!paints || paints.length === 0) return 'none';
    return paints.filter(p => p.visible !== false).map(p => {
        if (p.type === 'SOLID') {
            return rgbaToHex(p.color) + (p.opacity !== undefined ? ` (opacity: ${p.opacity})` : '');
        } else if (p.type === 'IMAGE') {
            return `IMAGE (${p.imageRef})`;
        } else if (p.type && p.type.includes('GRADIENT')) {
            return p.type;
        }
        return p.type;
    }).join(', ');
}

function traverse(node, depth = 0) {
    const indent = "  ".repeat(depth);
    let output = `${indent}[${node.type}] ${node.name} (ID: ${node.id})\n`;
    
    // Bounding Box
    if (node.absoluteBoundingBox) {
        output += `${indent}  - Bounds: w=${node.absoluteBoundingBox.width}, h=${node.absoluteBoundingBox.height}\n`;
    }
    
    // Layout & Flex
    let layoutProps = [];
    if (node.layoutMode) layoutProps.push(`layoutMode: ${node.layoutMode}`);
    if (node.primaryAxisAlignItems) layoutProps.push(`justifyContent: ${node.primaryAxisAlignItems}`);
    if (node.counterAxisAlignItems) layoutProps.push(`alignItems: ${node.counterAxisAlignItems}`);
    if (node.itemSpacing !== undefined) layoutProps.push(`gap: ${node.itemSpacing}px`);
    if (node.paddingTop !== undefined) layoutProps.push(`padding: ${node.paddingTop}px ${node.paddingRight}px ${node.paddingBottom}px ${node.paddingLeft}px`);
    if (node.cornerRadius) layoutProps.push(`borderRadius: ${node.cornerRadius}px`);
    if (layoutProps.length > 0) {
        output += `${indent}  - Layout: ${layoutProps.join(', ')}\n`;
    }

    // Styles (Fill, Stroke, Effects)
    if (node.fills && node.fills.length > 0) {
        output += `${indent}  - Fill: ${extractPaints(node.fills)}\n`;
    }
    if (node.strokes && node.strokes.length > 0) {
        output += `${indent}  - Stroke: ${extractPaints(node.strokes)} (weight: ${node.strokeWeight})\n`;
    }
    if (node.effects && node.effects.length > 0) {
        output += `${indent}  - Effects: ${node.effects.filter(e => e.visible !== false).map(e => e.type).join(', ')}\n`;
    }

    // Text Properties
    if (node.type === 'TEXT') {
        output += `${indent}  - Text: "${node.characters.replace(/\n/g, '\\n')}"\n`;
        if (node.style) {
            output += `${indent}  - Font: ${node.style.fontFamily} ${node.style.fontWeight}, ${node.style.fontSize}px\n`;
            output += `${indent}  - LineHeight: ${node.style.lineHeightPx}px\n`;
            output += `${indent}  - LetterSpacing: ${node.style.letterSpacing}px\n`;
            output += `${indent}  - TextAlign: ${node.style.textAlignHorizontal} / ${node.style.textAlignVertical}\n`;
        }
    }

    // Recursion
    if (node.children) {
        node.children.forEach(child => {
            output += traverse(child, depth + 1);
        });
    }
    
    return output;
}

try {
    console.log("Loading figma_dump.json...");
    let rawData = fs.readFileSync('figma_dump.json', 'utf8');
    if (rawData.charCodeAt(0) === 0xFEFF) rawData = rawData.slice(1);
    const data = JSON.parse(rawData);

    console.log("Searching for node 1080405:2...");
    
    let targetNode = null;
    
    function search(node) {
        if (node.id === '1080405:2' || node.id === '1080405-2') {
            targetNode = node;
            return true;
        }
        if (node.children) {
            for (let child of node.children) {
                if (search(child)) return true;
            }
        }
        return false;
    }
    
    search(data.document);
    
    if (targetNode) {
        console.log("Found node, extracting layout...");
        const result = traverse(targetNode);
        fs.writeFileSync('detailed_layout.txt', result, 'utf8');
        console.log("Written to detailed_layout.txt");
    } else {
        console.log("Node not found!");
    }
} catch (e) {
    console.error(e);
}
