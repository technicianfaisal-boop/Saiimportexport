const fs = require('fs');
const content = fs.readFileSync('js/product-data.js', 'utf8');
const modifiedContent = content.replace('const PRODUCT_DETAILS_STATIC =', 'module.exports = ');
fs.writeFileSync('temp_product_data.js', modifiedContent);

const PRODUCT_DETAILS_STATIC = require('./temp_product_data.js');

let html = `<html><head><title>SAI Import Export Agro - Product Catalog</title>
<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap");
*{margin:0;padding:0;box-sizing:border-box;font-family:"Inter",sans-serif}
body{padding:20px;color:#333;background:#fff;}
.header{text-align:center;padding:30px 0;border-bottom:3px solid #2d5a3c;margin-bottom:30px}
.header h1{color:#2d5a3c;font-size:28px;margin-bottom:5px}
.header p{color:#666;font-size:14px}
.product{display:flex;gap:20px;padding:18px 0;border-bottom:1px solid #eee;page-break-inside:avoid}
.product img{width:100px;height:100px;object-fit:cover;border-radius:10px}
.product h3{color:#2d5a3c;font-size:16px;margin-bottom:4px}
.product .tag{background:#e8f0ea;color:#2d5a3c;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600}
.product .price{color:#c87533;font-weight:700;font-size:15px;margin-top:4px}
.product .desc{color:#666;font-size:12px;margin-top:4px}
.specs{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.spec{background:#f5f5f5;padding:2px 8px;border-radius:6px;font-size:11px;color:#555}
.footer{text-align:center;margin-top:30px;padding-top:15px;border-top:2px solid #2d5a3c;font-size:12px;color:#888}
</style></head><body>`;

html += `<div class="header"><h1>🌾 SAI Import Export Agro</h1><p>Premium Indian Rice Exporter | Product Catalog ${new Date().getFullYear()}</p><p style="margin-top:4px;font-size:12px">📧 admin@saiimportexportagro.com | 📱 +91 8595827184</p></div>`;

Object.values(PRODUCT_DETAILS_STATIC).forEach(p => {
  let specsHtml = '';
  if (p.specs) {
    Object.keys(p.specs).forEach(k => {
      if (k !== 'price') specsHtml += `<span class="spec"><strong>${k}:</strong> ${p.specs[k]}</span>`;
    });
  }
  let imgStr = p.image || p.img || '';
  let imgSrc = imgStr.startsWith('http') ? imgStr : 'file:///' + __dirname.replace(/\\/g, '/') + '/' + imgStr;
  let priceStr = p.specs && p.specs.price ? p.specs.price : 'Contact for Price';
  let descStr = p.shortDesc || p.short_desc || p.description || '';
  
  html += `<div class="product"><img src="${imgSrc}" alt="${p.name}"><div><span class="tag">${p.tag}</span><h3>${p.name}</h3><div class="price">${priceStr}</div><p class="desc">${descStr}</p><div class="specs">${specsHtml}</div></div></div>`;
});

html += `<div class="footer"><p>© ${new Date().getFullYear()} SAI Import Export Agro. All rights reserved. | saiimportexport.vercel.app</p></div></body></html>`;

fs.writeFileSync('temp_catalog.html', html);
console.log('temp_catalog.html created successfully');
