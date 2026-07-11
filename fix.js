const fs = require('fs');

const html = fs.readFileSync('src/app/index.html', 'utf8');
const regex = new RegExp(`<section[^>]*id="process"[^>]*>[\\s\\S]*?<\\/section>`, 'i');
const match = html.match(regex);

let processSectionHtml = "";
if (match) {
    let sectionHtml = match[0];
    sectionHtml = sectionHtml.replace(/class=/g, 'className=');
    sectionHtml = sectionHtml.replace(/for=/g, 'htmlFor=');
    sectionHtml = sectionHtml.replace(/tabindex=/g, 'tabIndex=');
    sectionHtml = sectionHtml.replace(/maxlength=/g, 'maxLength=');
    
    sectionHtml = sectionHtml.replace(/<(img|input|br|hr|source)([^>]*?)\/?>/g, (match, tag, attrs) => {
        return `<${tag}${attrs.endsWith('/') ? attrs.slice(0, -1) : attrs} />`;
    });
    sectionHtml = sectionHtml.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');
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
    processSectionHtml = sectionHtml;
} else {
    console.log("Process section not found!");
}

let tsx = fs.readFileSync('src/app/WesAssociates.tsx', 'utf8');

// Insert process section after services section
tsx = tsx.replace(/(<section[^>]*id="services"[^>]*>[\s\S]*?<\/section>)/i, `$1\n\n        ${processSectionHtml}`);

// Fix unescaped entities
tsx = tsx.replace(/"The team helped me/g, '&quot;The team helped me');
tsx = tsx.replace(/result."/g, 'result.&quot;');
tsx = tsx.replace(/"My documents and/g, '&quot;My documents and');
tsx = tsx.replace(/session."/g, 'session.&quot;');
tsx = tsx.replace(/"I got a full checklist/g, '&quot;I got a full checklist');
tsx = tsx.replace(/application."/g, 'application.&quot;');

// Remove unused state
tsx = tsx.replace(/const \[isMenuOpen, setIsMenuOpen\] = useState\(false\);/, '');

fs.writeFileSync('src/app/WesAssociates.tsx', tsx);
console.log("Fixed unused variables, quotes, and injected process section.");
