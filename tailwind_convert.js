const fs = require('fs');
const path = require('path');

const tsxPath = path.join(__dirname, 'src/app/WesAssociates.tsx');
let tsx = fs.readFileSync(tsxPath, 'utf8');

// Replacement mappings
const classMappings = [
    { from: /\bcontainer\b/g, to: 'max-w-[1160px] w-[calc(100%-32px)] mx-auto' },
    { from: /\bgrid four\b/g, to: 'grid gap-[22px] grid-cols-1 md:grid-cols-2 lg:grid-cols-4' },
    { from: /\bgrid three\b/g, to: 'grid gap-[22px] grid-cols-1 md:grid-cols-3' },
    { from: /\bgrid two\b/g, to: 'grid gap-[22px] grid-cols-1 md:grid-cols-2' },
    { from: /\bgrid\b/g, to: 'grid gap-[22px]' }, // Apply base grid after specific ones
    
    // Clean up if "grid gap-[22px]" was duplicated (like "grid gap-[22px] gap-[22px]")
    { from: /grid gap-\[22px\] gap-\[22px\]/g, to: 'grid gap-[22px]' },
    { from: /grid gap-\[22px\] grid-cols-1/g, to: 'grid gap-[22px] grid-cols-1' }, // Ensure no mess up
    
    // Structural
    { from: /\bsection-soft\b/g, to: 'bg-[#f7f8fa]' },
    { from: /\bsection-dark\b/g, to: 'bg-[#080b12] text-white' },
    { from: /\bsection-head\b/g, to: 'flex items-end justify-between gap-7 mb-8' },
    
    // Components
    { from: /\bcard\b/g, to: 'bg-white border border-[#e8ebf0] rounded-lg p-6 shadow-[0_10px_25px_rgba(17,24,39,0.04)] transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(17,24,39,0.1)] hover:border-[#e01f26]/20' },
    { from: /\bicon\b/g, to: 'w-12 h-12 flex items-center justify-center rounded-lg mb-4 text-white bg-[#e01f26] font-black' },
    { from: /\bbtn secondary\b/g, to: 'inline-flex items-center justify-center gap-2 min-h-[46px] px-4 py-3 rounded-md border-2 border-[#cfd5df] text-[#111827] bg-white font-extrabold transition-all hover:border-[#e01f26] hover:text-[#e01f26]' },
    { from: /\bbtn\b/g, to: 'inline-flex items-center justify-center gap-2 min-h-[46px] px-4 py-3 rounded-md bg-[#e01f26] text-white font-extrabold transition-all hover:bg-[#bd1118] hover:-translate-y-0.5 hover:shadow-lg' },
    { from: /\bquote-card\b/g, to: 'bg-white border border-[#e8ebf0] rounded-lg p-6 shadow-sm' },
    { from: /\blist\b/g, to: 'grid gap-3 mt-4 list-none p-0' },
    
    // Typography
    { from: /\bkicker\b/g, to: 'text-[#e01f26] font-black text-[13px] uppercase tracking-widest mb-2.5' },
    { from: /\blead\b/g, to: 'text-[#667085] text-[17px] max-w-[650px] m-0' },
    { from: /\bmuted\b/g, to: 'text-[#667085] m-0' },
    
    // Custom section specifics that might break layout if unstyled
    { from: /\bstats-wrap\b/g, to: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-white border border-[#e8ebf0] rounded-lg shadow-[0_18px_45px_rgba(17,24,39,0.1)] overflow-hidden' },
    { from: /\bstat\b/g, to: 'p-7 border-r border-[#e8ebf0] last:border-0 hover:bg-[#fff8f8] transition-all cursor-default' },
    { from: /\bjourney-map\b/g, to: 'relative overflow-hidden min-h-[520px] p-[34px] rounded-lg border border-[#e8ebf0] bg-gradient-to-br from-[#0f3557]/95 to-[#e01f26]/82 bg-[#0f3557] text-white shadow-[0_18px_45px_rgba(17,24,39,0.1)]' },
    { from: /\bjourney-content\b/g, to: 'relative z-10 grid grid-cols-1 gap-[26px] items-center min-h-[450px]' },
    { from: /\bjourney-panel\b/g, to: 'text-white' },
    { from: /\bjourney-stage\b/g, to: 'grid grid-cols-[1fr_auto_1fr] items-center gap-[18px] mt-[28px] max-w-[980px]' },
    { from: /\bjourney-location\b/g, to: 'min-h-[142px] grid content-center gap-2 p-5 rounded-lg bg-white/10 border border-white/20 backdrop-blur-md transition-all hover:bg-white/20 hover:-translate-y-1.5' },
    { from: /\broute-line\b/g, to: 'relative w-[230px] h-[74px] grid place-items-center hidden md:grid' },
    { from: /\bjourney-steps\b/g, to: 'relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px] mt-[26px]' },
    { from: /\bjourney-step\b/g, to: 'p-4 rounded-lg bg-white/95 text-[#111827] border border-white/20 transition-all hover:-translate-y-1 hover:shadow-xl' },
    
    // Timeline
    { from: /\btimeline\b/g, to: 'grid gap-4' },
    { from: /\btimeline-item\b/g, to: 'grid grid-cols-[66px_1fr] gap-[18px]' },
];

let modifiedTsx = tsx;

// Apply only within className=""
modifiedTsx = modifiedTsx.replace(/className="([^"]+)"/g, (match, classList) => {
    let classes = classList;
    for (const mapping of classMappings) {
        classes = classes.replace(mapping.from, mapping.to);
    }
    
    // Fix duplicate btn mapping logic issue (btn secondary -> btn styles inside)
    if(classes.includes('btn') && classes.includes('btn secondary')) {
        // btn secondary mapping handles everything
        classes = classes.replace(/\bbtn\b/g, ''); 
        classes = classes.replace(/\s+/g, ' ').trim();
    }
    
    return `className="${classes}"`;
});

// Since list items have custom ::before in CSS which tailwind can't directly target by classname (unless we use arbitrary variants), let's add it via arbitrary class to li directly inside .list
// But the list class itself is converted. Instead, let's map list items to have that red dot.
modifiedTsx = modifiedTsx.replace(/<li>/g, '<li className="relative pl-7 text-[#667085] before:content-[\'\'] before:absolute before:left-0 before:top-2.5 before:w-2 before:h-2 before:rounded-full before:bg-[#e01f26] before:shadow-[0_0_0_5px_rgba(224,31,38,0.12)]">');

fs.writeFileSync(tsxPath, modifiedTsx);
console.log("Tailwind conversion completed successfully.");
