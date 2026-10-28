<meta charset="utf-8">
<title>Конструктор заявки</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/html-docx-js@0.3.1/dist/html-docx.js"></script>
<style>
[hidden]{display:none!important}
/* Layout: шаги сверху, ниже рабочая область; на телефоне всё в одну колонку. */
:root{
  --bg:#F3F6F7; --surface:#FFFFFF; --ink:#14212A; --muted:#566772; --line:#D3DCE1;
  --accent:#0E6B70; --accent-ink:#FFFFFF; --accent-soft:#DDEFEF; --warn:#8A5200; --warn-soft:#FFF1D6; --ok:#1E7A3C; --ok-soft:#E0F3E6; --focus:#0E6B70;
  --f-body:'IBM Plex Sans',system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;
  --f-mono:'IBM Plex Mono',ui-monospace,Menlo,Consolas,monospace;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --bg:#0F171C; --surface:#17232B; --ink:#E7EFF3; --muted:#9AAAB4; --line:#2C3D47;
  --accent:#55BDC2; --accent-ink:#06191B; --accent-soft:#16343A; --warn:#F2BC63; --warn-soft:#3A2F14; --ok:#6FD08C; --ok-soft:#173424; --focus:#55BDC2; color-scheme:dark}}
:root[data-theme="dark"]{
  --bg:#0F171C; --surface:#17232B; --ink:#E7EFF3; --muted:#9AAAB4; --line:#2C3D47;
  --accent:#55BDC2; --accent-ink:#06191B; --accent-soft:#16343A; --warn:#F2BC63; --warn-soft:#3A2F14; --ok:#6FD08C; --ok-soft:#173424; --focus:#55BDC2; color-scheme:dark}
*{box-sizing:border-box}
body{background:var(--bg);color:var(--ink);font-family:var(--f-body);font-size:15px;line-height:1.5}
button,input,select,textarea{font:inherit;color:inherit}
.wrap{max-width:1180px;margin-inline:auto;padding-inline:16px}
header.top{background:var(--surface);border-bottom:1px solid var(--line);position:sticky;top:env(safe-area-inset-top,0px);z-index:20}
.top-in{display:flex;flex-wrap:wrap;align-items:center;gap:10px 24px;padding-block:12px}
.brand{display:flex;align-items:center;gap:12px;min-width:0}
.brand-img{width:52px;height:52px;object-fit:contain;flex-shrink:0;filter:drop-shadow(0 2px 6px rgba(14,107,112,.15))}
.brand-text{min-width:0}
.brand small{display:block;color:var(--muted);font-size:12px;letter-spacing:.04em;text-transform:uppercase}
.brand h1{margin:0;font-size:20px;font-weight:600;text-wrap:balance}
@media (max-width:520px){.brand-img{width:40px;height:40px}}
nav.tabs{display:flex;flex-wrap:wrap;gap:6px;margin-left:auto}
.tab{border:1px solid var(--line);background:transparent;border-radius:999px;padding:7px 14px;cursor:pointer;display:inline-flex;gap:8px;align-items:center;white-space:nowrap}
.tab .n{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;background:var(--line);font-size:12px;font-weight:600}
.tab[aria-selected="true"]{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.tab[aria-selected="true"] .n{background:var(--accent-ink);color:var(--accent)}
.tab.sec{border-style:dashed}
:focus-visible{outline:2px solid var(--focus);outline-offset:2px}
main{padding-block:20px 96px}
h2{font-size:22px;margin:0 0 4px;font-weight:600;text-wrap:balance}
h3{font-size:16px;margin:0 0 8px;font-weight:600}
.lead{color:var(--muted);margin:0 0 16px;max-width:70ch}
.card{background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:16px}
.grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 16px}
@media (max-width:720px){.grid2{grid-template-columns:minmax(0,1fr)}}
.field{display:flex;flex-direction:column;gap:4px;min-width:0}
.field.full{grid-column:1/-1}
.field label,.legend{font-weight:500;font-size:13px}
.field .help{color:var(--muted);font-size:12.5px}
input[type=text],input[type=search],select,textarea{width:100%;background:var(--bg);border:1px solid var(--line);border-radius:4px;padding:8px 10px;min-width:0}
textarea{min-height:60px;resize:vertical}
.choices{display:flex;flex-wrap:wrap;gap:6px}
.choice{position:relative}
.choice input{position:absolute;opacity:0;inset:0;cursor:pointer}
.choice span{display:block;border:1px solid var(--line);border-radius:4px;padding:6px 12px;background:var(--bg)}
.choice input:checked+span{background:var(--accent-soft);border-color:var(--accent);font-weight:500}
.choice input:focus-visible+span{outline:2px solid var(--focus);outline-offset:2px}
.btn{border:1px solid var(--line);background:var(--surface);border-radius:4px;padding:8px 14px;cursor:pointer;font-weight:500}
.btn:hover{border-color:var(--accent)}
.btn.pri{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.btn.sm{padding:4px 10px;font-size:13px}
.btn.ghost{background:transparent}
.row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.spread{justify-content:space-between}
.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px;margin-bottom:16px}
.tile{text-align:left;border:1px solid var(--line);background:var(--surface);border-radius:6px;padding:10px 12px;cursor:pointer;display:flex;flex-direction:column;gap:2px;min-width:0}
.tile b{font-weight:600}
.tile small{color:var(--muted);font-size:12.5px}
.tile[aria-pressed="true"]{border-color:var(--accent);background:var(--accent-soft)}
.work{display:grid;grid-template-columns:minmax(260px,380px) minmax(0,1fr);gap:16px;align-items:start}
@media (max-width:860px){.work{grid-template-columns:minmax(0,1fr)}}
.list{display:flex;flex-direction:column;border:1px solid var(--line);border-radius:6px;background:var(--surface);max-height:560px;overflow:auto}
.li{text-align:left;border:0;border-bottom:1px solid var(--line);background:transparent;padding:9px 12px;cursor:pointer;display:block;width:100%}
.li:last-child{border-bottom:0}
.li[aria-current="true"]{background:var(--accent-soft)}
.li .t{display:block;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.li .m{display:block;color:var(--muted);font-size:12.5px}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px}
.chip{display:inline-block;font-size:12.5px;border:1px solid var(--line);border-radius:999px;padding:2px 10px;color:var(--muted);background:var(--bg);max-width:100%;overflow-wrap:anywhere}
.chip.ok{color:var(--ok);background:var(--ok-soft);border-color:transparent}
.chip.warn{color:var(--warn);background:var(--warn-soft);border-color:transparent}
/* Чипы-кнопки выбора категории: выбранная должна читаться сразу. */
button.chip{cursor:pointer;color:var(--ink);font-size:13px;padding:5px 13px}
button.chip:hover{border-color:var(--accent)}
button.chip[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:var(--accent-ink);font-weight:600}
.tw{overflow-x:auto;border:1px solid var(--line);border-radius:6px;background:var(--surface)}
table{border-collapse:collapse;width:100%}
th,td{padding:7px 10px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}
th{font-size:12.5px;color:var(--muted);font-weight:500;background:var(--bg);white-space:nowrap}
tr:last-child td{border-bottom:0}
td.mono,.mono{font-family:var(--f-mono);font-size:12.5px}
td.num{font-variant-numeric:tabular-nums;white-space:nowrap}
.note{background:var(--warn-soft);color:var(--ink);border-left:3px solid var(--warn);padding:8px 12px;border-radius:0 4px 4px 0;font-size:13.5px;margin:10px 0}
.info{background:var(--accent-soft);border-left:3px solid var(--accent);padding:8px 12px;border-radius:0 4px 4px 0;font-size:13.5px;margin:10px 0}
.bar{position:fixed;left:0;right:0;bottom:0;background:var(--surface);border-top:1px solid var(--line);padding:10px 16px calc(10px + env(safe-area-inset-bottom,0px));z-index:15}
.bar .wrap{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;justify-content:space-between;padding-inline:0}
.hl{background:var(--warn-soft);border-radius:2px}
.toast{position:fixed;left:50%;transform:translateX(-50%);bottom:76px;background:var(--ink);color:var(--bg);padding:8px 16px;border-radius:4px;z-index:40;font-size:14px;max-width:90vw}
.lwrap{position:fixed;inset:0;z-index:60;background:rgba(0,0,0,.5);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:24px 16px}
.lcard{background:var(--surface);color:var(--ink);border:1px solid var(--line);max-width:720px;width:100%;border-radius:8px;box-shadow:0 12px 44px rgba(0,0,0,.4);margin:auto}
.lhead{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 18px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--surface);border-radius:8px 8px 0 0}
.lhead b{font-size:15px}
.lbody{padding:16px 20px;line-height:1.5;font-size:14px}
.lbody p{margin:0 0 10px}
a.letterlink{color:var(--accent);text-decoration:underline;cursor:pointer}
.pv{padding:0}
.pv table{font-size:13px}
.pv td,.pv th{border:1px solid var(--line);white-space:pre-wrap}
.empty{color:var(--muted);padding:24px;text-align:center}
.item{border:1px solid var(--line);border-radius:6px;background:var(--surface);padding:12px;display:flex;flex-direction:column;gap:10px}
.items{display:flex;flex-direction:column;gap:12px}
.kv{display:grid;grid-template-columns:minmax(150px,260px) minmax(0,1fr) auto;gap:6px 12px;align-items:start;padding:6px 0;border-bottom:1px solid var(--line)}
.kv:last-child{border-bottom:0}
.kv .k{color:var(--muted);font-size:13px}
.kv .v{white-space:pre-wrap;overflow-wrap:anywhere;min-width:0}
@media (max-width:640px){.kv{grid-template-columns:minmax(0,1fr) auto}.kv .k{grid-column:1/-1}}
.sect{display:flex;flex-direction:column;gap:14px}
.two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
@media (max-width:860px){.two{grid-template-columns:minmax(0,1fr)}}
ul.clean{margin:0;padding-left:20px}
ul.clean li{margin:3px 0}
.doc h2{margin-top:8px}
.doc h3{margin-top:18px}
.doc p{max-width:75ch}
.cb{display:flex;gap:8px;align-items:flex-start}
.cb input{margin-top:4px}
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
</style>
