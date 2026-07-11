const fs = require('fs');

const html = fs.readFileSync('src/app/index.html', 'utf8');

const ids = [
    "about", "why", "countries", "usa-journey", "services", 
    "precess", "scholarships", "language", "visa", "success", 
    "appointment", "documents", "news", "contact"
];

let jsxOutput = "";

for (const id of ids) {
    const regex = new RegExp(`<section[^>]*id="${id}"[^>]*>[\\s\\S]*?<\\/section>`, 'i');
    const match = html.match(regex);
    if (match) {
        let sectionHtml = match[0];
        
        // Basic replacements
        sectionHtml = sectionHtml.replace(/class=/g, 'className=');
        sectionHtml = sectionHtml.replace(/for=/g, 'htmlFor=');
        sectionHtml = sectionHtml.replace(/tabindex=/g, 'tabIndex=');
        sectionHtml = sectionHtml.replace(/maxlength=/g, 'maxLength=');
        
        // Self-closing tags
        sectionHtml = sectionHtml.replace(/<(img|input|br|hr|source)([^>]*?)\/?>/g, (match, tag, attrs) => {
            return `<${tag}${attrs.endsWith('/') ? attrs.slice(0, -1) : attrs} />`;
        });
        
        // Comments
        sectionHtml = sectionHtml.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');
        
        // Inline styles (if any)
        sectionHtml = sectionHtml.replace(/style="([^"]*)"/g, (match, styleStr) => {
            const styles = styleStr.split(';').filter(s => s.trim());
            const styleObj = {};
            for (const s of styles) {
                const parts = s.split(':');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    const val = parts.slice(1).join(':').trim();
                    const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
                    styleObj[camelKey] = val;
                }
            }
            return `style={${JSON.stringify(styleObj)}}`;
        });
        
        jsxOutput += sectionHtml + "\n\n        ";
    } else {
        console.log(`Section ${id} not found.`);
    }
}

let tsx = fs.readFileSync('src/app/WesAssociates.tsx', 'utf8');
tsx = tsx.replace('{/* Note: In a production app, the remaining sections would follow this component pattern */}', jsxOutput);

fs.writeFileSync('src/app/WesAssociates.tsx', tsx);
console.log("Conversion completed.");
