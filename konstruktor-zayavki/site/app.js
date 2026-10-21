(function(){
'use strict';
var FOOD=__FOOD__, TR=__TR__, ENV=__ENV__;
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var norm=function(s){return String(s||'').toLowerCase().replace(/ё/g,'е')};

var ALL=[];
// FOOD: has obj field (list of mode ids where this food appears)
FOOD.forEach(function(f){ALL.push({kind:'food',cat:f.cat,obj:f.obj||['prod','horeca'],name:f.name,nd:f.nd||'Выдать фактический результат без указания норматива',decl:!!f.decl,vid:f.vid||'Микробиология',samp:f.samp||'ГОСТ 31904-2012',form:f.form||'Пищевая продукция',note:f.note||'',items:f.items.map(function(i){return {ind:i.ind,meth:i.meth||'Выбирает ИЛ',norm:i.norm,on:i.on!==false}})})});
// ENV: has obj field
ENV.forEach(function(e){ALL.push({kind:'env',cat:e.cat,obj:e.obj||[],name:e.name,nd:e.nd,decl:false,vid:e.vid,samp:e.samp,form:e.form,note:e.note||'',items:e.items.map(function(i){return {ind:i.ind,meth:i.meth,norm:i.norm,on:i.on!==false}})})});
ALL.forEach(function(a,i){a.id=i;a.hay=norm(a.name+' '+a.nd+' '+a.cat+' '+a.items.map(function(x){return x.ind}).join(' '))});

// Modes = types of objects/customers
var MODES=[
 {id:'food',t:'HoReCa / общепит / пищеблоки',d:'Готовые кулинарные изделия/блюда, продукция в упаковке, смывы, вода',hero:'🍽'},
 {id:'med',t:'Медицина (ЛПУ с лицензией)',d:'Воздух, смывы, стерильность, биотесты, эндоскопы',hero:'🏥'},
 {id:'kosm',t:'Косметология, парикмахерские',d:'Без лицензии и с мед. лицензией',hero:'💇'},
 {id:'pool',t:'Бассейны, аквапарки, фитнес',d:'Вода, смывы, паразитология',hero:'🏊'},
 {id:'cold',t:'Холодильные / морозильные камеры',d:'Воздух и соскобы на плесневые грибы',hero:'❄'},
 {id:'ff',t:'Физические факторы (отдельно)',d:'Если нужны только измерения — микроклимат, свет, шум',hero:'📊'},
 {id:'tr',t:'Не нашли продукт?',d:'Подбор по ТР ТС 021 или свой документ (ТУ/СТО)',hero:'🔎'}
];

// Sub-sections inside each mode: filter by env category or special "food"
var SUBS={
 food:[
  {id:'food',t:'Пищевая продукция и блюда',hint:'Готовые блюда и кулинария (для общепита) + продукция в потребительской упаковке (для производства и декларирования)'},
  {id:'Смывы',t:'Смывы и биоплёнки',hint:'Пищеблок (МР 4.2.0220-20), оборудование производства, биоплёнки на оборудовании, паразитология, петрифильмы'},
  {id:'Вода',t:'Вода',hint:'Питьевая ЦВС, НЦВС, кулер, бутилированная, технологическая'},
  {id:'Воздух',t:'Воздух',hint:'Воздух холодильных камер и цехов'},
  {id:'Физические факторы',t:'Физические факторы',hint:'Микроклимат, освещённость, шум, вибрация, ЭМП, температура воды'},
  {id:'Дезинфекция',t:'Дезсредства',hint:'Контроль концентрации рабочего раствора'},
 ],
 med:[
  {id:'Воздух',t:'Воздух помещений',hint:'С классом чистоты А/Б и без класса'},
  {id:'Смывы',t:'Смывы, эндоскопы, биоплёнки',hint:'С мед. лицензией; эндоскопы, биоплёнки'},
  {id:'Стерильность',t:'Стерильность ИМН',hint:'Изделия медицинского назначения'},
  {id:'Биотесты',t:'Биотесты стерилизаторов и дезкамер',hint:'Пар, воздух, плазма, дезкамера'},
  {id:'Вода',t:'Вода',hint:'Питьевая вода, лёд'},
  {id:'Физические факторы',t:'Физические факторы',hint:'Микроклимат, освещённость'},
  {id:'Дезинфекция',t:'Дезсредства',hint:'Контроль рабочего раствора'},
 ],
 kosm:[
  {id:'Воздух',t:'Воздух помещений',hint:'Косметология/парикмахерская'},
  {id:'Смывы',t:'Смывы',hint:'Без лицензии и с лицензией'},
  {id:'Стерильность',t:'Стерильность инструментов',hint:'Маникюр, косметология'},
  {id:'Биотесты',t:'Биотесты стерилизаторов',hint:'Пар, воздух'},
  {id:'Вода',t:'Вода',hint:'Питьевая вода'},
  {id:'Физические факторы',t:'Физические факторы',hint:'Освещённость, микроклимат'},
  {id:'Дезинфекция',t:'Дезсредства',hint:'Контроль рабочего раствора'},
 ],
 pool:[
  {id:'Вода',t:'Вода бассейна и питьевая',hint:'Микро, ФХО, органолептика'},
  {id:'Смывы',t:'Смывы и паразитология',hint:'Борта, обходные дорожки, душевые'},
  {id:'Физические факторы',t:'Физические факторы',hint:'Температура воды, микроклимат раздевалок'},
  {id:'Дезинфекция',t:'Дезсредства',hint:'Контроль рабочего раствора хлорирования'},
 ],
 cold:[
  {id:'Воздух',t:'Воздух камер',hint:'Плесневые грибы'},
  {id:'Смывы',t:'Соскобы со стен',hint:'Плесневые грибы, БГКП, Listeria'},
  {id:'Дезинфекция',t:'Дезсредства',hint:'Контроль рабочего раствора'},
 ],
 ff:[
  {id:'Физические факторы',t:'Все физические факторы',hint:'Микроклимат, освещённость, шум, ЭМП, вибрация, температура воды'},
 ],
};

function modeFilter(mode,subId){
  return ALL.filter(function(a){
    if(a.obj&&a.obj.indexOf(mode)<0)return false;
    if(!subId)return true;
    if(subId==='food')return a.kind==='food';
    return a.cat===subId;
  });
}

var S={tab:'zakazchik',mode:'food',sub:'',sq:'',sel:null,checks:null,basket:[],uid:1,example:true,trSel:{},trGrp:'',trInd:'',trQ:'',cust:{name:'',nd:'',qty:'',note:'',inds:''},
 c:{org:'ООО «Пример» (вымышленная организация)',inn:'0000000000',legal:'101000, г. Москва, ул. Примерная, д. 1',actual:'101000, г. Москва, ул. Примерная, д. 1',contact:'Иванова Мария Петровна, технолог, +7 900 000-00-00, example@example.ru',cno:'00/00-01/2026',cdate:'01.01.2026',place:'101000, г. Москва, ул. Примерная, д. 1 (проходная, Иванова М. П., +7 900 000-00-00)',purpose:'Производственный контроль',sampler:'lab',methods:'lab',unc:'Нет',concl:'Нет',agree:{oa:true,meth:true,color:true,samples:true,pay:true,terms:true,return:true,pdn:true},discardMode:'without',consent:'yes'}};

var CH={
 g_purpose:{k:'purpose',o:['Производственный контроль','Входной контроль','Декларирование','Прочее']},
 g_sampler:{k:'sampler',o:[['lab','Специалист ИЛ'],['cust','Заказчик']]},
 g_discardMode:{k:'discardMode',o:[['without','Без присутствия заказчика'],['with','В присутствии заказчика']]},
 g_consent:{k:'consent',o:[['yes','Согласен'],['no','Не согласен']]}
};
function renderChoices(){
  Object.keys(CH).forEach(function(id){
    var g=CH[id],h='';
    g.o.forEach(function(o){var v=Array.isArray(o)?o[0]:o,t=Array.isArray(o)?o[1]:o;
      h+='<label class="choice"><input type="radio" name="'+id+'" value="'+esc(v)+'"'+(S.c[g.k]===v?' checked':'')+'><span>'+esc(t)+'</span></label>'});
    $('#'+id).innerHTML=h;
  });
}
function fillInputs(){$$('[data-c]').forEach(function(i){i.value=S.c[i.getAttribute('data-c')]||''});renderChoices();$$('[data-ag]').forEach(function(i){i.checked=S.c.agree[i.getAttribute('data-ag')]!==false});$('#exbanner').hidden=!S.example}

/* tabs */
function setTab(t,noHash){
  S.tab=t;
  $$('.tab').forEach(function(b){b.setAttribute('aria-selected',b.getAttribute('data-tab')===t?'true':'false')});
  $$('[role=tabpanel]').forEach(function(p){p.hidden=(p.id!=='p-'+t)});
  if(t==='vybor')renderBrowse();
  if(t==='zayavka')renderFinal();
  updateBar();
  window.scrollTo(0,0);
  if(!noHash){try{history.replaceState(null,'','#'+t)}catch(e){}}
}

/* tiles */
function renderTiles(){
  $('#tiles').innerHTML=MODES.map(function(m){return '<button class="tile" data-act="mode" data-m="'+m.id+'" aria-pressed="'+(S.mode===m.id)+'"><b>'+esc(m.t)+'</b><small>'+esc(m.d)+'</small></button>'}).join('');
}
function stems(q){return norm(q).split(/[^а-яa-z0-9]+/).filter(Boolean).map(function(w){return w.length>=6?w.slice(0,w.length-2):(w.length>=4?w.slice(0,w.length-1):w)})}
function matches(hay,st){for(var i=0;i<st.length;i++){if(hay.indexOf(st[i])<0)return false}return true}

function renderBrowse(){
  renderTiles();
  var m=MODES.filter(function(x){return x.id===S.mode})[0];
  var box=$('#browse');
  if(m.id==='tr'){renderTR(box);return}
  var subs=SUBS[m.id]||[];
  // ensure current sub exists for this mode
  if(subs.length){
    if(!S.sub||!subs.some(function(s){return s.id===S.sub}))S.sub=subs[0].id;
  }else S.sub='';
  var st=stems(S.sq);
  var list=modeFilter(m.id,S.sub).filter(function(a){return matches(a.hay,st)});
  // sub chips
  var html='<div class="chips" style="margin-bottom:10px">';
  subs.forEach(function(s){html+='<button class="chip" data-act="sub" data-s="'+esc(s.id)+'" aria-pressed="'+(S.sub===s.id)+'">'+esc(s.t)+'</button>'});
  html+='</div>';
  var curSub=subs.filter(function(s){return s.id===S.sub})[0];
  if(curSub&&curSub.hint)html+='<div class="info">'+esc(curSub.hint)+'</div>';
  html+='<div class="field" style="margin-bottom:12px"><label for="sq">Поиск по названию или показателю</label><input type="search" id="sq" value="'+esc(S.sq)+'" placeholder="Например: салат, молоко, БГКП, микроклимат" autocomplete="off"></div>';
  html+='<div class="work"><div><div class="help" style="color:var(--muted);font-size:12.5px;margin-bottom:6px">Найдено наборов: '+list.length+'</div><div class="list" id="lst">';
  if(!list.length)html+='<div class="empty">В этой подкатегории ничего не найдено. Проверьте поиск или откройте «Не нашли?» для подбора по ТР ТС / своему НД.</div>';
  list.slice(0,300).forEach(function(a){var sub=a.cat;html+='<button class="li" data-act="pick" data-id="'+a.id+'" aria-current="'+(S.sel===a.id)+'"><span class="t">'+esc(a.name)+'</span><span class="m">'+esc(sub)+' · показателей: '+a.items.length+'</span></button>'});
  html+='</div></div><div id="det"></div></div>';
  box.innerHTML=html;
  if(S.sel!==null&&!list.some(function(a){return a.id===S.sel}))S.sel=null;
  renderDetail();
}
function renderDetail(){
  var det=$('#det');if(!det)return;
  if(S.sel===null){det.innerHTML='<div class="card empty">Выберите строку слева. Здесь появятся показатели, методы и нормативы.</div>';return}
  var a=ALL[S.sel];
  if(!S.checks||S.checks.id!==a.id){var kk=catKind(a);S.checks={id:a.id,on:a.items.map(function(i){return i.on}),qty:'',note:'',qhint:qtyExample(kk),nhint:noteExample(kk)}}
  var n=S.checks.on.filter(Boolean).length;
  var h='<div class="card"><h3>'+esc(a.name)+'</h3><div class="chips"><span class="chip">НД: '+esc(a.nd)+'</span>';
  if(a.kind==='env')h+='<span class="chip">бланк акта: '+esc(a.form)+'</span>';
  h+='</div><div class="tw"><table><tr><th></th><th>Показатель</th><th>Норматив</th><th>Метод</th></tr>';
  a.items.forEach(function(it,i){h+='<tr><td><input type="checkbox" data-act="chk" data-i="'+i+'" id="ck'+i+'" aria-label="включить"'+(S.checks.on[i]?' checked':'')+'></td><td><label for="ck'+i+'">'+esc(it.ind)+'</label></td><td>'+esc(it.norm||'')+'</td><td class="mono">'+esc(applyMethPolicy(it.ind,it.meth))+'</td></tr>'});
  h+='</table></div>';
  var hasSalLis=a.items.some(function(x){return /Salmonella|Listeria/i.test(x.ind)});
  if(hasSalLis){
    var p=S.c.purpose;
    var decl=p==='Декларирование';
    h+='<div class="note"><b>Методика для Salmonella и Listeria зависит от цели испытаний</b> (шаг 1): сейчас выбрано «'+esc(p)+'» → '+(decl?'ГОСТ 31659-2012 и ГОСТ 32031-2012 (для декларирования)':'ГОСТ 31659-2024 и ГОСТ 32031-2022 (для ППК и прочих целей)')+'. Основание — информационное письмо ИЛ ООО «ВИКИНГ» № 19/02-03/2026 от 19.02.2026.</div>';
  }
  if(a.note)h+='<div class="note">'+esc(a.note)+'</div>';
  h+='<div class="grid2" style="margin-top:12px"><div class="field"><label for="dqty">Количество образцов / измерений</label><input type="text" id="dqty" data-dq="qty" value="'+esc(S.checks.qty)+'" placeholder="'+esc(S.checks.qhint)+'"></div><div class="field"><label for="dnote">Примечание</label><input type="text" id="dnote" data-dq="note" value="'+esc(S.checks.note)+'" placeholder="'+esc(S.checks.nhint)+'"><span class="help">Место отбора (цех, посуда, кабинет) или марка стерилизатора и объём камеры.</span></div></div>';
  h+='<div class="row" style="margin-top:12px"><button class="btn pri" data-act="add" data-id="'+a.id+'">Добавить в заявку ('+n+' показ.)</button><span style="color:var(--muted);font-size:13px">Метод отбора: '+esc(a.samp)+'</span></div></div>';
  det.innerHTML=h;
}

/* TR 021 picker */
var TRGROUPS=[];TR.forEach(function(r){if(TRGROUPS.indexOf(r.grp)<0)TRGROUPS.push(r.grp)});
var TRINDS=[['','Любой показатель'],['КМАФАнМ','КМАФАнМ'],['БГКП','БГКП'],['Staphylococcus','S. aureus'],['Salmonella','Salmonella'],['Listeria','Listeria'],['Escherichia','E. coli'],['Proteus','Proteus'],['Дрожжи','Дрожжи'],['Плесени','Плесени'],['Сульфитредуц','Клостридии'],['cereus','B. cereus']];
function methodFor(l){
  if(/КМАФАнМ/.test(l))return 'ГОСТ 10444.15-94';
  if(/БГКП/.test(l))return 'ГОСТ 31747-2012';
  if(/S\. aureus/.test(l))return 'ГОСТ 31746-2012';
  if(/E\.coli/.test(l))return 'ГОСТ 30726-2001';
  if(/Proteus/.test(l))return 'ГОСТ 28560-90';
  if(/Salmonella/.test(l))return 'ГОСТ 31659-2024 (ISO 6579-1:2017) (п. 9.1, п. 9.2, п. 9.3.2, п. 9.4.2, п. 9.5)';
  if(/Listeria/.test(l))return 'ГОСТ 32031-2022';
  if(/Дрожжи|Плесени/.test(l))return 'ГОСТ 10444.12-2013';
  if(/Сульфитредуц/.test(l))return 'ГОСТ 29185-2014';
  if(/B\. cereus/.test(l))return 'ГОСТ 10444.8-2013';
  return 'Выбирает ИЛ';
}
function hl(text,st){var t=esc(text);st.forEach(function(s){if(s.length<3)return;var re=new RegExp('('+s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'[а-яa-z0-9]*)','ig');t=t.replace(re,'<span class="hl">$1</span>')});return t}
function trFiltered(){
  var st=stems(S.trQ);
  var out=[];
  for(var i=0;i<TR.length;i++){var r=TR[i];
    if(S.trGrp&&r.grp!==S.trGrp)continue;
    if(S.trInd&&r.line.indexOf(S.trInd)<0&&r.ind.indexOf(S.trInd)<0)continue;
    if(st.length&&!matches(norm(r.prod+' '+r.grp),st))continue;
    out.push(i)}
  return {idx:out,st:st};
}
function renderTR(box){
  var h='<div class="choices" style="margin-bottom:12px"><label class="choice"><input type="radio" name="trsub" value="tr21"'+(S.sub==='tr21'?' checked':'')+'><span>Подбор по ТР ТС 021</span></label><label class="choice"><input type="radio" name="trsub" value="custom"'+(S.sub==='custom'?' checked':'')+'><span>Свой документ (ТУ, СТО и т. п.)</span></label></div>';
  if(S.sub==='custom'){
    var c=S.cust;
    h+='<div class="info">Если проверяете продукцию на соответствие собственному ТУ или СТО (или другому вашему НД), заполните поля ниже. Методики испытаний подбирает ИЛ после получения заявки.</div>';
    h+='<div class="grid2"><div class="field full"><label for="cn">Наименование продукции (как в маркировке/спецификации)</label><input type="text" id="cn" data-cu="name" value="'+esc(c.name)+'" placeholder="Например: Соус томатный «Пример», ТМ «Моя Марка»"></div>';
    h+='<div class="field full"><label for="cnd">НД, на соответствие которому проводятся испытания</label><input type="text" id="cnd" data-cu="nd" value="'+esc(c.nd)+'" placeholder="Например: ТУ 10.11.30-001-12345678-2024"><span class="help">ТУ, СТО, ГОСТ, ТР ТС и т. п. Если документа нет — напишите «Выдать фактический результат без указания норматива».</span></div>';
    h+='<div class="field full"><label for="cind">Перечень определяемых показателей</label><textarea id="cind" data-cu="inds" placeholder="Один показатель на строку. Например:&#10;Массовая доля белка&#10;Массовая доля жира&#10;Массовая доля углеводов" rows="6">'+esc(c.inds)+'</textarea><span class="help">Один показатель на строку. Методику ИЛ подберёт под каждый показатель и согласует с вами в заявке.</span></div>';
    h+='<div class="field"><label for="cq">Количество образцов / измерений</label><input type="text" id="cq" data-cu="qty" value="'+esc(c.qty)+'" placeholder="Например: 3 шт × 200 г"></div>';
    h+='<div class="field"><label for="cm">Примечание</label><input type="text" id="cm" data-cu="note" value="'+esc(c.note)+'" placeholder="Партия, срок годности, точка отбора"></div></div>';
    var ok=c.name.trim()&&c.inds.trim();
    h+='<div class="row" style="margin-top:12px"><button class="btn pri" data-act="cuadd"'+(ok?'':' disabled')+'>Добавить в заявку</button><span style="color:var(--muted);font-size:13px">НД отбора: ГОСТ 31904-2012 (микробиология) / ГОСТ Р 54607.1-2011 (органолептика), подбирает ИЛ</span></div>';
    box.innerHTML=h;
    return;
  }
  var f=trFiltered();
  h+='<div class="info">Введите название продукта: покажем, в какую группу ТР ТС 021 он входит и в какой навеске нормируется каждый показатель. Отметьте нужные строки и добавьте их в заявку.</div>';
  h+='<div class="grid2" style="margin-bottom:12px"><div class="field full"><label for="trq">Название продукта</label><input type="search" id="trq" value="'+esc(S.trQ)+'" placeholder="Например: котлеты, пельмени, пирожное, сок, колбаса" autocomplete="off"></div>';
  h+='<div class="field"><label for="trg">Группа продукции</label><select id="trg"><option value="">Все группы</option>'+TRGROUPS.map(function(g){return '<option value="'+esc(g)+'"'+(S.trGrp===g?' selected':'')+'>'+esc(g.length>90?g.slice(0,88)+'…':g)+'</option>'}).join('')+'</select></div>';
  h+='<div class="field"><label for="tri">Показатель</label><select id="tri">'+TRINDS.map(function(x){return '<option value="'+esc(x[0])+'"'+(S.trInd===x[0]?' selected':'')+'>'+esc(x[1])+'</option>'}).join('')+'</select></div></div>';
  var shown=f.idx.slice(0,150),sel=Object.keys(S.trSel).length;
  h+='<div class="row spread" style="margin-bottom:8px"><span style="color:var(--muted);font-size:13px">Найдено строк: '+f.idx.length+(f.idx.length>150?' (показаны первые 150, уточните запрос)':'')+'</span><button class="btn pri" data-act="tradd"'+(sel?'':' disabled')+'>Добавить выбранные в заявку ('+sel+')</button></div>';
  if(!shown.length)h+='<div class="card empty">Ничего не найдено. Попробуйте другое слово, например «колбаса» вместо «сосиски».</div>';
  else{
    h+='<div class="tw"><table><tr><th></th><th>Показатель</th><th>Норматив</th><th>Для каких продуктов</th></tr>';
    shown.forEach(function(i){var r=TR[i];
      h+='<tr><td><input type="checkbox" data-act="trchk" data-i="'+i+'" id="t'+i+'" aria-label="выбрать"'+(S.trSel[i]?' checked':'')+'></td><td><label for="t'+i+'">'+esc(r.line)+'</label><div class="mono" style="color:var(--muted)">'+esc(r.ref)+'</div></td><td class="num">'+esc(r.norm)+'</td><td>'+hl(r.prod.length>320?r.prod.slice(0,318)+'…':r.prod,f.st)+'</td></tr>'});
    h+='</table></div>';
  }
  box.innerHTML=h;
}
function trAdd(){
  var groups={};
  Object.keys(S.trSel).forEach(function(i){var r=TR[+i];(groups[r.grp]=groups[r.grp]||[]).push(r)});
  var n=0;
  Object.keys(groups).forEach(function(g){
    var rows=groups[g],r0=rows[0];
    var seen={};var inds=[];
    rows.forEach(function(r){var k=r.line;if(seen[k])return;seen[k]=1;inds.push({ind:r.line,meth:methodFor(r.line),norm:r.norm,on:true})});
    var ref=r0.app==='1'?'ТР ТС 021/2011, Приложение 1':'ТР ТС 021/2011, '+r0.ref;
    var name=g.replace(/^\d+\.\d+\.\s*/,'').replace(/^Приложение 1 — /,'');
    if(S.basket.some(function(b){return b.name===name&&b.nd===ref})){return}
    S.basket.push({uid:S.uid++,kind:'food',name:name,qty:'',di:'',note:'',vid:'Микробиология',nd:ref,samp:'ГОСТ 31904-2012',form:'Пищевая продукция',inds:inds,hint:noteExample('food'),qhint:qtyExample('food')});n++});
  S.trSel={};toast('Добавлено строк в заявку: '+n);renderBrowse();updateBar();
}

/* basket */
function catKind(a){var c=a.cat||'';if(c==='Смывы')return 'smyv';if(c==='Вода')return 'water';if(c==='Воздух')return 'air';if(c==='Медицина')return 'med';if(c==='Холодильные камеры')return 'cold';if(c==='Физические факторы')return 'phys';if(c==='Дезинфекция')return 'dez';return 'food'}
function qtyExample(k){return {food:'Например: 3 шт × 200 г',smyv:'Например: 10 смывов',water:'Например: 2 пробы по 500 мл',air:'Например: 5 проб воздуха',med:'Например: 5 единиц ИМН',cold:'Например: 1 камера, 3 точки',phys:'Например: 5 РМ или 3 помещения',dez:'Например: 1 образец (концентрат) 100 мл'}[k]||'Число образцов, масса или объём'}
function noteExample(k){return {food:'Партия, срок годности, точка отбора',smyv:'Точки смывов: цех, посуда, инвентарь, руки персонала',water:'Точки отбора: ЦВС на входе, точка разбора, после фильтра',air:'Точки отбора воздуха: кабинет №, холодильная камера №, высота 1,5 м',med:'Что отбирается: инструмент, биотест, эндоскоп. Способ стерилизации',cold:'Номер камеры, что хранится, температура',phys:'РМ или помещение (укажите), адрес (кабинет, цех, номер), число точек',dez:'Торговая марка, изготовитель, концентрация, форма (концентрат/рабочий раствор), НД на средство'}[k]||'Пояснения к образцу'}
function sameItem(a){for(var i=0;i<S.basket.length;i++){var b=S.basket[i];if(b.name===a.name&&b.nd===a.nd)return b}return null}
function addItem(a,on,extras){
  var dup=sameItem(a);
  if(dup){toast('Этот набор уже в заявке — изменить его можно ниже'); return dup}
  var inds=[];a.items.forEach(function(it,i){if(on[i])inds.push({ind:it.ind,meth:it.meth,norm:it.norm,on:true})});
  var k=catKind(a);
  extras=extras||{};
  var it={uid:S.uid++,kind:k,name:a.name,qty:extras.qty||'',di:'',note:extras.note||'',vid:a.vid,nd:a.nd,samp:a.samp,form:a.form,inds:inds,hint:noteExample(k),qhint:qtyExample(k)};
  S.basket.push(it); return it;
}
function totals(){var rows=S.basket.length,ind=0;S.basket.forEach(function(b){b.inds.forEach(function(x){if(x.on)ind++})});return {rows:rows,ind:ind}}
function plural(n,a,b,c){var m=n%10,k=n%100;return (m===1&&k!==11)?a:((m>=2&&m<=4&&(k<10||k>=20))?b:c)}
function updateBar(){
  var t=totals(),cnt=$('#cnt');
  cnt.hidden=!t.rows;cnt.textContent=t.rows;
  var bar=$('#bar');
  var show=t.rows>0&&S.tab!=='zayavka'&&S.tab!=='pamyatka'&&S.tab!=='lab';
  bar.hidden=!show;
  $('#barText').innerHTML='В заявке <b>'+t.rows+'</b> '+plural(t.rows,'строка','строки','строк')+', <b>'+t.ind+'</b> '+plural(t.ind,'показатель','показателя','показателей')+'. Счёт выставляется по показателям.';
}

/* Декларирование → ГОСТ 31659-2012 / ГОСТ 32031-2012; другие цели → 2024/2022 */
function methByPurpose(meth,purpose){
  var decl=purpose==='Декларирование';
  if(/Salmonella|рода\s*Salmonella/i.test(meth)||/ГОСТ\s*31659/i.test(meth)){
    return decl ? 'ГОСТ 31659-2012' : 'ГОСТ 31659-2024 (ISO 6579-1:2017) (п. 9.1, п. 9.2, п. 9.3.2, п. 9.4.2, п. 9.5)';
  }
  if(/ГОСТ\s*32031/i.test(meth)){
    return decl ? 'ГОСТ 32031-2012' : 'ГОСТ 32031-2022';
  }
  return meth;
}
function applyMethPolicy(ind,meth){
  // ind может быть сальмонеллой/листерией; тогда подставляем правильный ГОСТ
  var p=S.c.purpose;
  if(/Salmonella|рода\s*Salmonella/i.test(ind))return methByPurpose('ГОСТ 31659-X',p);
  if(/Listeria/i.test(ind))return methByPurpose('ГОСТ 32031-X',p);
  return methByPurpose(meth,p);
}

/* builders */
function rowData(b,n){
  var c=S.c,on=b.inds.filter(function(x){return x.on});
  var obj=b.name+(b.di?'\nД.и. '+b.di:'');
  var samp=c.sampler==='lab'?b.samp:'Отбор выполнен заказчиком (акт отбора № ___ от ___)';
  return {n:String(n),obj:obj,qty:b.qty,vid:b.vid,ind:on.map(function(x){return x.ind}).join('\n'),meth:on.map(function(x){return applyMethPolicy(x.ind,x.meth)}).join('\n'),samp:samp,nd:b.nd,note:b.note};
}
var HEAD=['№ п/п','Объект испытаний (измерений)','Кол-во образцов / измерений','Вид испытаний','Перечень определяемых показателей','Метод (методика) испытаний (измерений)','Метод (методика) отбора образца(ов)','НД, устанавливающий допустимый уровень','Примечания'];
function tableHTML(rows,withHead){
  var st='border:1px solid #000;padding:4px;vertical-align:top;font-size:10pt';
  var h='<table style="border-collapse:collapse;border:1px solid #000">';
  if(withHead){h+='<tr>'+HEAD.map(function(x){return '<th style="'+st+'">'+esc(x)+'</th>'}).join('')+'</tr>'}
  rows.forEach(function(r){h+='<tr>'+['n','obj','qty','vid','ind','meth','samp','nd','note'].map(function(k){return '<td style="'+st+'">'+esc(r[k]).replace(/\n/g,'<br>')+'</td>'}).join('')+'</tr>'});
  return h+'</table>';
}
function tableText(rows,withHead){
  var q=function(s){s=String(s||'');return /[\t\n"]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s};
  var lines=[];if(withHead)lines.push(HEAD.join('\t'));
  rows.forEach(function(r){lines.push(['n','obj','qty','vid','ind','meth','samp','nd','note'].map(function(k){return q(r[k])}).join('\t'))});
  return lines.join('\n');
}
function sectionI(){
  var c=S.c;
  return [['Наименование организации и ИНН заказчика',c.org+(c.inn?', ИНН '+c.inn:'')],['Юридический адрес заказчика',c.legal],['Фактический адрес заказчика',c.actual],['Контактные данные заказчика для согласования заявки',c.contact]];
}
function sectionII(){
  var c=S.c;
  return [['Цель проведения испытаний (измерений)',c.purpose],['Отбор образца(ов) осуществит',c.sampler==='lab'?'Специалист ИЛ ООО «ВИКИНГ»':'Заказчик'],['Информация о месте отбора образца(ов) и/или проведения измерений',c.sampler==='lab'?c.place:'—'],['Оптимальные методы (методики) испытаний (измерений) выбирает','☒ ИЛ ООО «ВИКИНГ» (методики указываются сотрудником ИЛ и согласовываются с заказчиком)\n☐ Заказчик (методики указываются заказчиком и согласовываются с ИЛ)'],['Необходимость расчета неопределенности измерений',c.unc]];
}
function kvHTML(pairs){var st='border:1px solid #000;padding:4px;font-size:10pt;vertical-align:top';return '<table style="border-collapse:collapse;border:1px solid #000">'+pairs.map(function(p){return '<tr><td style="'+st+'">'+esc(p[0])+'</td><td style="'+st+'">'+esc(p[1]).replace(/\n/g,'<br>')+'</td></tr>'}).join('')+'</table>'}
function kvText(pairs){return pairs.map(function(p){return p[0]+'\t'+String(p[1]).replace(/\n/g,' ')}).join('\n')}

function aktGeneral(){
  var c=S.c;
  return [
   ['1. Заказчик (наименование организации)',c.org,1],['1.1. ИНН заказчика',c.inn,1],['1.2. Юридический адрес заказчика',c.legal,1],['1.3. Фактический адрес заказчика',c.actual,1],
   ['2. Основание для испытаний (заявка): №','присваивает ИЛ',1],['4. Место фактического отбора образца(ов)',c.place||c.actual,1],
   ['7. Отбор осуществил',c.sampler==='lab'?'Специалист по отбору проб ИЛ ООО «ВИКИНГ»':'Заказчик (представитель заказчика)',1],['8. Цель проведения испытаний',c.purpose,1],
   ['9. Информация для оценки неопределённости',c.unc==='Да'?'Нужна оценка неопределённости измерений':'Не требуется',1]
  ];
}
function aktItem(b,n){
  var r=rowData(b,n);
  var out=[['Наименование образца',b.name+(b.di?'':''),1],['Количество и масса (объём) образца, информация о партии',b.qty,1]];
  if(b.di)out.push(['Дата и время выработки (и/или упаковки) образца',b.di,0]);
  out.push(['Вид испытаний',b.vid,1],['НД, устанавливающий допустимый уровень',b.nd,1],['Перечень требуемых показателей',r.ind,1],['НД на метод отбора',b.samp,1]);
  if(b.note)out.push(['Примечание',b.note,1]);
  return out;
}
function kvRows(list,prefix){
  return list.map(function(f,i){return '<div class="kv"><div class="k">'+esc(f[0])+(f[2]?' <span class="chip">как в заявке</span>':'')+'</div><div class="v">'+(f[1]?esc(f[1]):'<span style="color:var(--muted)">заполните на шаге 1 или 3</span>')+'</div><button class="btn sm" data-act="cp" data-v="'+esc(f[1])+'">Копировать</button></div>'}).join('');
}

function renderFinal(){
  var box=$('#final');
  if(!S.basket.length){box.innerHTML='<div class="card empty">В заявке пока нет строк. <button class="btn pri" data-act="goto" data-to="vybor">Выбрать, что проверять</button></div>';return}
  var t=totals(),rows=S.basket.map(function(b,i){return rowData(b,i+1)});
  var h='<div class="info">Строк: <b>'+t.rows+'</b>, показателей: <b>'+t.ind+'</b>. Счёт выставляется по каждому показателю, проверьте список перед отправкой.</div>';
  /* items editor */
  h+='<h3>Строки заявки</h3><div class="items">';
  S.basket.forEach(function(b,i){
    var qh=b.qhint||qtyExample(b.kind), nh=b.hint||noteExample(b.kind), showDate=b.kind==='food';
    h+='<div class="item"><div class="row spread"><b>'+(i+1)+'. '+esc(b.name)+'</b><button class="btn sm ghost" data-act="del" data-u="'+b.uid+'">Удалить из заявки</button></div>';
    h+='<div class="grid2"><div class="field"><label for="n'+b.uid+'">Название по этикетке или ТУ</label><input type="text" id="n'+b.uid+'" data-b="name" data-u="'+b.uid+'" value="'+esc(b.name)+'"></div>';
    h+='<div class="field"><label for="q'+b.uid+'">Количество (число образцов, масса или объём)</label><input type="text" id="q'+b.uid+'" data-b="qty" data-u="'+b.uid+'" value="'+esc(b.qty)+'" placeholder="'+esc(qh)+'"></div>';
    if(showDate)h+='<div class="field"><label for="d'+b.uid+'">Дата изготовления</label><input type="text" id="d'+b.uid+'" data-b="di" data-u="'+b.uid+'" value="'+esc(b.di)+'" placeholder="дд.мм.гггг"></div>';
    h+='<div class="field'+(showDate?'':' full')+'"><label for="m'+b.uid+'">Примечания</label><input type="text" id="m'+b.uid+'" data-b="note" data-u="'+b.uid+'" value="'+esc(b.note)+'" placeholder="'+esc(nh)+'"></div>';
    h+='<div class="field full"><label for="nd'+b.uid+'">НД, устанавливающий допустимый уровень</label><input type="text" id="nd'+b.uid+'" data-b="nd" data-u="'+b.uid+'" value="'+esc(b.nd)+'"><span class="help">Если проверка на соответствие собственным ТУ или СТО — замените этот текст на ваш НД (например: ТУ 10.11.30-001-12345678-2024).</span></div></div>';
    h+='<div class="tw"><table><tr><th></th><th>Показатель</th><th>Норматив</th><th>Метод</th></tr>';
    b.inds.forEach(function(x,j){h+='<tr><td><input type="checkbox" data-act="bchk" data-u="'+b.uid+'" data-j="'+j+'" id="k'+b.uid+'_'+j+'" aria-label="включить"'+(x.on?' checked':'')+'></td><td><label for="k'+b.uid+'_'+j+'">'+esc(x.ind)+'</label></td><td>'+esc(x.norm||'')+'</td><td class="mono">'+esc(applyMethPolicy(x.ind,x.meth))+'</td></tr>'});
    h+='</table></div><div class="chips"><span class="chip">отбор: '+esc(b.samp)+'</span><span class="chip">бланк акта: '+esc(b.form)+'</span></div>';
    h+='<div class="note" style="margin:8px 0 0">Что указать в примечании: '+esc(nh)+'.</div></div>';
  });
  h+='</div><div class="row"><button class="btn" data-act="goto" data-to="vybor">Добавить ещё</button></div>';
  /* Что дальше */
  h+='<h3 style="margin-top:8px">Что делать дальше</h3><div class="info">Проверьте список выше — он равен тому, что будет напечатано. Ниже две равнозначные дороги: распечатать прямо отсюда или скопировать в ваш Word-бланк. Выберите удобную.</div>';
  /* print */
  h+='<div class="card" style="margin-top:12px"><b>Способ 1. Скачать Word-файл</b><p class="help" style="color:var(--muted);font-size:13px;margin:4px 0 10px">Готовая заявка в формате .docx: откройте в Word, при необходимости поправьте, напечатайте и подпишите. A4, альбомная ориентация.</p><div class="row"><button class="btn pri" data-act="docx">Скачать Word (.docx)</button></div></div>';
  h+='<div class="card" style="margin-top:12px"><b>Способ 2. Напечатать прямо из браузера</b><p class="help" style="color:var(--muted);font-size:13px;margin:4px 0 10px">Откроется печатный вид в утверждённой форме. Нажмите «Печать» или Ctrl+P / ⌘+P. В окне печати можно выбрать «Сохранить как PDF».</p><div class="row"><button class="btn" data-act="print">Открыть вид для печати</button></div></div>';
  /* word */
  h+='<div class="card" style="margin-top:12px"><b>Способ 3. Скопировать в ваш Word-бланк вручную</b><p class="help" style="color:var(--muted);font-size:13px;margin:4px 0 10px">Это для тех, кто хочет вставить готовый текст в утверждённую форму в Word. Откройте ваш Word-бланк, установите курсор в нужный раздел и нажмите соответствующую кнопку. Вставка: Ctrl+V (⌘+V). Если Word вставил только текст без таблицы — попробуйте «Специальная вставка → Форматированный текст (RTF)».</p>';
  h+='<div class="two"><div><b style="font-size:13px">Раздел I. Информация о заказчике</b><div class="row" style="margin-top:4px"><button class="btn" data-act="cp1">Копировать раздел I</button></div></div>';
  h+='<div><b style="font-size:13px">Раздел II. Цель, отбор, методики</b><div class="row" style="margin-top:4px"><button class="btn" data-act="cp2">Копировать раздел II</button></div></div></div>';
  h+='<div style="margin-top:10px"><b style="font-size:13px">Раздел III. Строки с объектами испытаний</b><div class="row" style="margin-top:4px"><button class="btn pri" data-act="cp3">Копировать строки</button><button class="btn" data-act="cp3h">С заголовком таблицы</button></div><div class="help" style="color:var(--muted);font-size:12.5px;margin-top:4px">«Копировать строки» — для вставки в уже готовую таблицу бланка. «С заголовком» — если таблицы ещё нет.</div></div></div>';
  h+='<div class="tw pv" style="margin-top:12px">'+tableHTML(rows,true)+'</div>';
  /* agreement */
  h+='<h3 style="margin-top:16px">Приложение для согласования показателей</h3><p class="lead" style="margin-bottom:8px">Отдельный лист, он не входит в утверждённый бланк. Отправляется вместе с заявкой, чтобы заказчик видел и согласовал показатели и нормативы.</p><div class="info">'+esc(AGREE_TXT)+'</div>'+agreeView()+'<div class="row" style="margin:10px 0"><button class="btn pri" data-act="cpAgree">Копировать таблицу согласования</button><span style="color:var(--muted);font-size:13px">Вставить в Word: Ctrl+V. Если вставилось текстом — Специальная вставка → RTF.</span></div>';
  /* akt */
  h+='<h3 style="margin-top:16px">Данные для акта отбора (для специалиста ИЛ)</h3><p class="lead" style="margin-bottom:8px">Это заготовка полей для акта отбора в Excel: заказчик заполнять не обязан. Специалист ИЛ открывает нужный бланк акта (указан на карточке образца), нажимает «Копировать» рядом с полем и вставляет значение в соответствующую ячейку бланка. Поля с меткой «как в заявке» уже есть в вашей Word-заявке.</p>';
  h+='<div class="card"><div class="row spread"><b>Общая часть (одинакова для всех образцов)</b><button class="btn sm" data-act="cpAktG">Копировать всё</button></div>'+kvRows(aktGeneral())+'</div>';
  S.basket.forEach(function(b,i){
    h+='<div class="card" style="margin-top:12px"><div class="row spread"><b>Образец '+(i+1)+': '+esc(b.name)+'</b><button class="btn sm" data-act="cpAktI" data-u="'+b.uid+'">Копировать всё</button></div><div class="chips"><span class="chip warn">бланк: «'+esc(b.form)+'»</span></div>'+kvRows(aktItem(b,i+1))+'<p class="help" style="color:var(--muted);font-size:12.5px;margin:8px 0 0">Остальные поля акта (дата и время отбора, изготовитель, НД на образец, срок годности, вид упаковки, условия транспортировки) заполняются по самому образцу.</p></div>';
  });
  /* Итог */
  h+='<h3 style="margin-top:16px">Итог</h3><div class="card"><ol style="margin:0;padding-left:22px;line-height:1.6"><li>Распечатайте заявку (Способ 1) или вставьте её в Word-бланк и распечатайте (Способ 2).</li><li>Подпишите у руководителя или уполномоченного лица, поставьте печать.</li><li>Пришлите нам сканом на почту <b>info@laboratoriya-viking.ru</b> или привезите оригинал. Контакты и адрес — на сайте <a href="https://www.laboratoriya-viking.ru/" target="_blank" rel="noopener">laboratoriya-viking.ru</a>.</li><li>Специалист лаборатории проверит заявку, при необходимости свяжется с вами и согласует правило принятия решения (заключение о соответствии), если оно нужно.</li><li>Никаких данных страница вам не отправляет и не сохраняет: после закрытия вкладки введённое пропадает. Если нужно вернуться — распечатайте заявку заранее.</li></ol></div>';
  box.innerHTML=h;
}


var AGREE_TXT='Перечень показателей и допустимых уровней определён Заказчиком и согласован им; ответственность за выбор показателей и нормативов несёт Заказчик. Методы (методики) испытаний подбирает и применяет ИЛ ООО «ВИКИНГ».';
function agreeRows(){var out=[];S.basket.forEach(function(b,i){b.inds.filter(function(x){return x.on}).forEach(function(x,j){out.push([j===0?(i+1)+'. '+b.name:'',x.ind,x.norm||'—',applyMethPolicy(x.ind,x.meth),j===0?b.nd:''])})});return out}
var AH=['Образец / группа продукции','Показатель','Допустимый уровень (норматив)','Метод (подбирает ИЛ)','НД на норматив'];
function agreeHTML(){var st='border:1px solid #000;padding:4px;vertical-align:top;font-size:10pt';var h='<p style="font-size:10pt"><b>Перечень показателей для согласования</b></p><table style="border-collapse:collapse;border:1px solid #000"><tr>'+AH.map(function(x){return '<th style="'+st+'">'+esc(x)+'</th>'}).join('')+'</tr>';agreeRows().forEach(function(r){h+='<tr>'+r.map(function(c){return '<td style="'+st+'">'+esc(c)+'</td>'}).join('')+'</tr>'});return h+'</table><p style="font-size:10pt">'+esc(AGREE_TXT)+'</p>'}
function agreeText(){return 'Перечень показателей для согласования\n'+AH.join('\t')+'\n'+agreeRows().map(function(r){return r.join('\t')}).join('\n')+'\n'+AGREE_TXT}
function agreeView(){
  var h='<div class="tw"><table><tr>'+AH.map(function(x){return '<th>'+esc(x)+'</th>'}).join('')+'</tr>';
  agreeRows().forEach(function(r){h+='<tr>'+r.map(function(c,k){return '<td'+(k===3?' class="mono"':'')+'>'+esc(c)+'</td>'}).join('')+'</tr>'});
  return h+'</table></div>';
}

/* print view */
function cb(on){return on?'<span class="ck">☒</span>':'<span class="ck">☐</span>'}
function or(v,ph){return v?esc(v):'<span style="color:#888">'+esc(ph||'—')+'</span>'}
function printHTML(){
  var c=S.c,rows=S.basket.map(function(b,i){return rowData(b,i+1)});
  var h='<div class="reg">Регистрационный номер<br>№ ________________________<br><span class="sub">(заполняет специалист ИЛ ООО «ВИКИНГ»)</span></div>';
  h+='<h1>ЗАЯВКА<sup>1</sup> НА ПРОВЕДЕНИЕ ИСПЫТАНИЙ (ИЗМЕРЕНИЙ) ПО ДОГОВОРУ № '+or(c.cno,'______')+' от '+or(c.cdate,'__________')+'</h1>';
  h+='<h2>I. Информация о Заказчике:</h2><table class="pt"><col style="width:48%"><col>';
  h+='<tr><td>Наименование организации и ИНН заказчика</td><td>'+or(c.org+(c.inn?', ИНН '+c.inn:''))+'</td></tr>';
  h+='<tr><td>Юридический адрес заказчика<br><span class="sub">(в соответствии с записью в ЕГРЮЛ, ЕГРИП)</span></td><td>'+or(c.legal)+'</td></tr>';
  h+='<tr><td>Фактический адрес заказчика<br><span class="sub">(место осуществления деятельности)</span></td><td>'+or(c.actual)+'</td></tr>';
  h+='<tr><td>Контактные данные заказчика для согласования заявки<br><span class="sub">(телефон, е-mail, ФИО, должность)</span></td><td>'+or(c.contact)+'</td></tr></table>';
  h+='<h2>II. Заказчик просит провести лабораторные испытания (измерения):</h2><table class="pt"><col style="width:48%"><col>';
  var pur=['Производственный контроль','Входной контроль','Декларирование','Прочее'];
  h+='<tr><td>Цель проведения испытаний (измерений)<br><span class="sub">(отметить нужное)</span></td><td>'+pur.map(function(x){return cb(c.purpose===x)+' '+x}).join('&nbsp;&nbsp;&nbsp;')+'</td></tr>';
  h+='<tr><td>Отбор образца(ов) осуществит<br><span class="sub">(отметить нужное)</span></td><td>'+cb(c.sampler==='lab')+' Специалист ИЛ ООО «ВИКИНГ» &nbsp;&nbsp;&nbsp; '+cb(c.sampler==='cust')+' Заказчик<sup>2</sup></td></tr>';
  h+='<tr><td>Информация о месте отбора образца(ов) и/или проведения измерений<br><span class="sub">(заполняется заказчиком в случае выезда специалиста ИЛ ООО «ВИКИНГ»)</span></td><td>'+or(c.sampler==='lab'?c.place:'—')+'</td></tr>';
  h+='<tr><td>Оптимальные методы (методики) испытаний (измерений) выбирает</td><td>☒ ИЛ ООО «ВИКИНГ» <span class="sub">(в этом случае методики указываются в заявке сотрудником лаборатории и согласовываются с заказчиком)</span><br>☐ Заказчик <span class="sub">(в этом случае методики указываются в заявке заказчиком и согласовываются сотрудником лаборатории)</span></td></tr>';
  h+='<tr><td>Необходимость расчета неопределенности измерений</td><td>'+cb(c.unc==='Да')+' Да &nbsp;&nbsp;&nbsp; '+cb(c.unc==='Нет')+' Нет</td></tr></table>';
  h+='<p class="fn"><sup>1</sup> Заказчик несёт ответственность за достоверность всей предоставленной в заявке информации и документов, а также гарантирует, что предоставленные им документы в бумажном и электронном виде идентичны, и согласен, что они будут храниться в ИЛ ООО «ВИКИНГ» и возврату не подлежат.</p>';
  h+='<p class="fn"><sup>2</sup> Заказчик, в случае самостоятельного проведения отбора образца(ов), уведомлён о необходимости соблюдения правил отбора образца(ов), сроков и условий транспортировки образца(ов) в ИЛ и несёт ответственность за их выполнение. В этом случае ответственность ИЛ ООО «ВИКИНГ» не распространяется на выполнение требований раздела «Отбор проб» методик, указанных в протоколе испытаний. Акт(ы) отбора образца(ов) оформляются Заказчиком самостоятельно.</p>';
  h+='<h2>III. Информация об объекте испытаний (измерений):</h2><table class="pt obj"><colgroup><col class="c1"><col class="c2"><col class="c3"><col class="c4"><col class="c5"><col class="c6"><col class="c7"><col class="c8"><col class="c9"></colgroup>';
  h+='<tr><th>№ п/п</th><th>Объект испытаний</th><th>Кол-во образцов</th><th>Вид испытаний</th><th>Перечень показателей</th><th>Метод (методика) испытаний</th><th>Метод отбора<sup>3</sup></th><th>НД на допустимый уровень</th><th>Прим.</th></tr>';
  if(!rows.length){h+='<tr>'+Array(9).join('</td><td>&nbsp;').replace(/^.{5}/,'<td>')+'</td></tr>'}
  rows.forEach(function(r){h+='<tr>'+['n','obj','qty','vid','ind','meth','samp','nd','note'].map(function(k){return '<td>'+esc(r[k]).replace(/\n/g,'<br>')+'</td>'}).join('')+'</tr>'});
  h+='</table><p class="fn"><sup>3</sup> При отборе образца(ов) заказчиком — графа заполняется ссылкой на акт отбора заказчика.</p>';
  // IV. Согласование с заказчиком — все галочки по умолчанию ☒ (заказчик может снять через UI)
  var A=c.agree||{};
  function ac(k){return (A[k]!==false)?'☒':'☐'}
  var disc=(c.discardMode==='with')?'в его присутствии':'без его присутствия';
  var consent=(c.consent==='no')?'☐ Согласен &nbsp;&nbsp;&nbsp; ☒ Не согласен':'☒ Согласен &nbsp;&nbsp;&nbsp; ☐ Не согласен';
  h+='<h2>IV. Согласование с заказчиком:</h2><table class="pt agr"><col style="width:42%"><col>';
  h+='<tr><td>Заказчик подтверждает, что<br><span class="sub">(необходимо поставить галочки)</span></td><td>';
  h+=ac('oa')+' ознакомлен с областью аккредитации ИЛ ООО «ВИКИНГ» (https://pub.fsa.gov.ru/ral/view/16581/current-aa);<br>';
  h+=ac('meth')+' ознакомлен с выбранными методами испытаний (измерений) и отбора проб в случае предоставления права выбора лаборатории;<br>';
  h+=ac('color')+' согласен на оформление результатов цветности воды без указания температуры анализируемой пробы, в соответствии с п. 4.5 ГОСТ 31868-2012, поскольку проведение испытаний в ИЛ ООО «ВИКИНГ» осуществляется при постоянной комнатной температуре (20±5) °C. Регистрация температуры осуществляется в журнале установленной формы ф.002 (И-001);<br>';
  h+=ac('samples')+' ознакомлен о необходимом количестве образцов для проведения испытаний;<br>';
  h+=ac('pay')+' гарантирует оплату по проведению лабораторных испытаний (измерений);<br>';
  h+=ac('terms')+' уведомлён о сроках проведения лабораторных испытаний (измерений);<br>';
  h+=ac('return')+' ознакомлен с порядком возврата (списания) образцов продукции: образцы после микробиологических испытаний, скоропортящейся продукции и образцы, подвергшиеся разрушающим методам воздействия, возврату не подлежат. Заказчик просит списать <b>'+disc+'</b>;<br>';
  h+=ac('pdn')+' даёт согласие на обработку персональных данных, указанных в заявке и прилагаемых документах, в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».';
  h+='</td></tr>';
  h+='<tr><td>С вышеперечисленными условиями проведения испытаний (измерений) '+consent+'<br><span class="sub">(Должность / ФИО / подпись)</span></td><td style="height:18mm">&nbsp;</td></tr>';
  h+='</table>';
  h+='<h2>V. Анализ заявки (заполняется лабораторией):</h2><table class="pt agr">';
  h+='<tr><td style="width:25%">Наличие персонала для проведения испытаний (измерений):<br>☐ Да &nbsp;&nbsp; ☐ Нет</td>';
  h+='<td style="width:25%">Соответствует области аккредитации ИЛ ООО «ВИКИНГ»:<br>☐ Да &nbsp;&nbsp; ☐ Нет</td>';
  h+='<td style="width:25%">Соответствие материально-технической базы ИЛ требованиям методик выполнения испытаний (измерений):<br>☐ Да &nbsp;&nbsp; ☐ Нет</td>';
  h+='<td style="width:25%">Работа может быть выполнена в установленный срок:<br>☐ Да &nbsp;&nbsp; ☐ Нет</td></tr>';
  h+='<tr><td>Конфликт интересов обнаружен:<br>☐ Да &nbsp;&nbsp; ☐ Нет</td>';
  h+='<td>Документы предоставлены (копия ТУ, СТО, тех. карта):<br>☐ В полном объёме &nbsp;&nbsp; ☐ Частично &nbsp;&nbsp; ☐ Отсутствуют</td>';
  h+='<td>Необходимость привлечения субподрядной лаборатории:<br>☐ Да &nbsp;&nbsp; ☐ Нет</td>';
  h+='<td>Решение по анализу заявки:<br>☐ Принято в работу &nbsp;&nbsp; ☐ Отклонено</td></tr>';
  h+='<tr><td colspan="4" style="height:14mm">Замечания и условия согласования:</td></tr>';
  h+='<tr><td colspan="4">Исполнитель: Должность _________________ ФИО _________________ Подпись _________________ Дата __________</td></tr>';
  h+='</table>';
  return h;
}
function openPrint(){var w=$('#printWrap');$('#printArea').innerHTML=printHTML();w.hidden=false;document.body.style.overflow='hidden';window.scrollTo(0,0)}
function closePrint(){$('#printWrap').hidden=true;document.body.style.overflow=''}
var TNR='font-family:"Times New Roman",Times,serif';
var DOC_CSS='@page{size:A4 landscape;margin:1cm}body,p,div,span,td,th,h1,h2,h3,h4,table,tr,li,ol,ul,sup,sub{'+TNR+'}body{font-size:11pt;line-height:1.25;color:#000}h1{font-size:12pt;text-align:center;margin:0 0 10px;font-weight:bold}h2{font-size:11pt;margin:12px 0 4px;font-weight:bold}table{border-collapse:collapse;width:100%;margin:4px 0}table.pt td,table.pt th{border:1px solid #000;padding:3px 5px;vertical-align:top;font-size:10pt}table.pt th{background:#efefef;font-weight:bold;text-align:center;font-size:10pt}table.obj td{font-size:9pt;padding:3px 4px;line-height:1.25}table.obj th{font-size:10pt;line-height:1.2;background:#efefef;font-weight:bold;text-align:center}table.agr td,table.agr th{font-size:9pt;padding:3px 5px}table.agr th{font-size:9pt;background:#efefef;font-weight:bold;text-align:center}.reg{border:1px solid #000;padding:6px 10px;width:62mm;margin-left:auto;margin-bottom:10px;font-size:10pt}.fn{font-size:9pt;margin:6px 0;font-style:italic}.sub{font-size:9pt;font-style:italic}.sig{margin-top:14px;font-size:10pt}.sig .ln{display:inline-block;border-bottom:1px solid #000;min-width:60mm}.agrs{font-size:9pt;margin:4px 0}';
var STYLES_XML='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">\
 <w:docDefaults>\
  <w:rPrDefault><w:rPr>\
   <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman"/>\
   <w:sz w:val="22"/><w:szCs w:val="22"/>\
   <w:lang w:val="ru-RU" w:eastAsia="ru-RU" w:bidi="ar-SA"/>\
  </w:rPr></w:rPrDefault>\
  <w:pPrDefault><w:pPr><w:spacing w:after="0" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault>\
 </w:docDefaults>\
 <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/></w:rPr></w:style>\
 <w:style w:type="character" w:default="1" w:styleId="DefaultParagraphFont"><w:name w:val="Default Paragraph Font"/><w:uiPriority w:val="1"/><w:semiHidden/><w:unhideWhenUsed/></w:style>\
 <w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style>\
 <w:style w:type="numbering" w:default="1" w:styleId="NoList"><w:name w:val="No List"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/></w:style>\
</w:styles>';
function buildDocHTML(){return '<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Заявка на испытания</title><style>'+DOC_CSS+'</style></head><body>'+printHTML()+'</body></html>'}
var HEADER_XML='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">\
 <w:tbl>\
  <w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblLayout w:type="fixed"/><w:tblLook w:val="04A0"/></w:tblPr>\
  <w:tblGrid><w:gridCol w:w="3200"/><w:gridCol w:w="7600"/><w:gridCol w:w="3200"/></w:tblGrid>\
  <w:tr>\
   <w:tc><w:tcPr><w:tcW w:w="3200" w:type="dxa"/></w:tcPr>\
    <w:p><w:pPr><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>ООО «ВИКИНГ»</w:t></w:r></w:p>\
   </w:tc>\
   <w:tc><w:tcPr><w:tcW w:w="7600" w:type="dxa"/></w:tcPr>\
    <w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve">ф.003 (И-010)   Заявка на проведение испытаний и измерений</w:t></w:r></w:p>\
    <w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>Администрация и СМК</w:t></w:r></w:p>\
   </w:tc>\
   <w:tc><w:tcPr><w:tcW w:w="3200" w:type="dxa"/></w:tcPr>\
    <w:p><w:pPr><w:jc w:val="right"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>Ред. 4</w:t></w:r></w:p>\
    <w:p><w:pPr><w:jc w:val="right"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve">Стр. </w:t></w:r>\
     <w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r>\
     <w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve"> из </w:t></w:r>\
     <w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> NUMPAGES </w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r>\
    </w:p>\
   </w:tc>\
  </w:tr>\
 </w:tbl>\
 <w:p><w:pPr><w:spacing w:after="0"/></w:pPr></w:p>\
</w:hdr>';

async function injectHeader(blob){
  if(typeof JSZip==='undefined')return blob;
  try{
    var ab=await blob.arrayBuffer();
    var zip=await JSZip.loadAsync(ab);
    zip.file('word/header1.xml',HEADER_XML);
    // force Times New Roman as default font
    try{
      var hadStyles=!!zip.file('word/styles.xml');
      zip.file('word/styles.xml',STYLES_XML);
      if(!hadStyles){
        var ct0=await zip.file('[Content_Types].xml').async('string');
        if(ct0.indexOf('styles+xml')<0){
          ct0=ct0.replace('</Types>','<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>');
          zip.file('[Content_Types].xml',ct0);
        }
        var rels0=await zip.file('word/_rels/document.xml.rels').async('string');
        if(rels0.indexOf('/styles"')<0){
          var sId='rIdStyles';
          rels0=rels0.replace('</Relationships>','<Relationship Id="'+sId+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>');
          zip.file('word/_rels/document.xml.rels',rels0);
        }
      }
    }catch(e){}
    // rels
    var relsPath='word/_rels/document.xml.rels';
    var rels=await zip.file(relsPath).async('string');
    var max=0;rels.replace(/Id="rId(\d+)"/g,function(_,n){var i=parseInt(n,10);if(i>max)max=i;return _});
    var newId='rId'+(max+1);
    rels=rels.replace('</Relationships>','<Relationship Id="'+newId+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/></Relationships>');
    zip.file(relsPath,rels);
    // content types
    var ct=await zip.file('[Content_Types].xml').async('string');
    if(ct.indexOf('header+xml')<0){
      ct=ct.replace('</Types>','<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/></Types>');
      zip.file('[Content_Types].xml',ct);
    }
    // document.xml: add headerReference inside sectPr and widen top margin
    var doc=await zip.file('word/document.xml').async('string');
    var ref='<w:headerReference xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" w:type="default" r:id="'+newId+'"/>';
    if(/<w:sectPr(\s[^>]*)?\s*\/>/.test(doc)){
      doc=doc.replace(/<w:sectPr(\s[^>]*)?\s*\/>/,'<w:sectPr$1>'+ref+'</w:sectPr>');
    }else{
      doc=doc.replace(/<w:sectPr(\s[^>]*)?>/,'<w:sectPr$1>'+ref);
    }
    // make sure header has room
    if(/<w:pgMar[^\/]*\/>/.test(doc)){
      doc=doc.replace(/<w:pgMar([^\/]*)\/>/,function(_,attrs){
        attrs=attrs.replace(/\sw:top="\d+"/,' w:top="1600"').replace(/\sw:header="\d+"/,'');
        if(attrs.indexOf('w:top=')<0)attrs+=' w:top="1600"';
        return '<w:pgMar'+attrs+' w:header="500"/>';
      });
    }
    zip.file('word/document.xml',doc);
    return await zip.generateAsync({type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
  }catch(e){console.warn('header inject failed',e);return blob}
}

function saveDocx(){
  if(typeof htmlDocx==='undefined'){toast('Библиотека для Word ещё грузится, попробуйте через несколько секунд');return}
  var blob;
  try{blob=htmlDocx.asBlob(buildDocHTML(),{orientation:'landscape',margins:{top:1600,right:720,bottom:720,left:720,header:500,footer:500}})}
  catch(e){toast('Не удалось собрать Word-файл: '+(e&&e.message||e));return}
  var fn='Заявка '+(S.c.org||'без имени').replace(/[\\\/:*?"<>|]/g,'').slice(0,80)+'.docx';
  injectHeader(blob).then(function(finalBlob){
    var p=window.claude&&window.claude.use?window.claude.use('downloads'):null;
    Promise.resolve(p).then(function(dl){
      if(!dl){
        try{var a=document.createElement('a');a.href=URL.createObjectURL(finalBlob);a.download=fn;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},2000);toast('Если файл не сохранился, воспользуйтесь «Открыть вид для печати» → «Сохранить как PDF».')}catch(e){toast('Скачивание недоступно в этом окне. Откройте «Вид для печати» и сохраните как PDF.')}
        return;
      }
      dl.save({filename:fn,data:finalBlob}).then(function(){toast('Файл сохранён')},function(e){if(!e||e.code!=='declined')toast('Не удалось сохранить файл ('+(e&&e.code||'ошибка')+')')});
    });
  });
}

/* clipboard */
function toast(m){var t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(function(){t.hidden=true},2200)}
function copyText(text,msg){
  var fb=function(){var ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;left:-9999px;top:0';document.body.appendChild(ta);ta.select();var ok=false;try{ok=document.execCommand('copy')}catch(e){}ta.remove();toast(ok?(msg||'Скопировано'):'Не удалось скопировать, выделите текст вручную')};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){toast(msg||'Скопировано')},fb)}else fb();
}
function copyRich(html,text,msg){
  if(navigator.clipboard&&window.ClipboardItem){
    try{navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([html],{type:'text/html'}),'text/plain':new Blob([text],{type:'text/plain'})})]).then(function(){toast(msg||'Скопировано')},function(){copyText(text,msg)});return}catch(e){}
  }
  copyText(text,msg);
}
function allRows(){return S.basket.map(function(b,i){return rowData(b,i+1)})}

/* events */
document.addEventListener('click',function(e){
  var pb=e.target.closest('#btnPrint,#btnPrintClose');
  if(pb){if(pb.id==='btnPrint'){try{window.print()}catch(x){}setTimeout(function(){toast('Если окно печати не открылось, нажмите Ctrl+P или Cmd+P')},400)}else{closePrint()}return}
  var t=e.target.closest('[data-act],[data-tab]');if(!t)return;
  var tab=t.getAttribute('data-tab');
  if(tab){setTab(tab);return}
  var act=t.getAttribute('data-act');
  if(act==='print'){openPrint();return}
  if(act==='docx'){saveDocx();return}
  if(act==='goto'){setTab(t.getAttribute('data-to'))}
  else if(act==='mode'){S.mode=t.getAttribute('data-m');S.sub='';S.sel=null;S.sq='';renderBrowse()}
  else if(act==='sub'){S.sub=t.getAttribute('data-s');S.sel=null;renderBrowse()}
  else if(act==='pick'){S.sel=+t.getAttribute('data-id');S.checks=null;$$('#lst .li').forEach(function(b){b.setAttribute('aria-current',String(b===t))});renderDetail();if(window.innerWidth<=860){var d=$('#det');if(d)d.scrollIntoView({block:'start'})}}
  else if(act==='add'){var a=ALL[+t.getAttribute('data-id')];addItem(a,S.checks.on,{qty:S.checks.qty,note:S.checks.note});S.checks=null;toast('Добавлено в заявку');renderDetail();updateBar()}
  else if(act==='tradd'){trAdd()}
  else if(act==='cuadd'){var c=S.cust;if(!c.name.trim()||!c.inds.trim())return;var inds=c.inds.split(/\n/).map(function(x){return x.trim()}).filter(Boolean).map(function(x){return {ind:x,meth:'Выбирает ИЛ',norm:'Выдать фактический результат / согласовать с ИЛ','on':true}});S.basket.push({uid:S.uid++,kind:'food',name:c.name.trim(),qty:c.qty||'',di:'',note:c.note||'',vid:'Выбирает ИЛ',nd:c.nd||'Выдать фактический результат без указания норматива',samp:'Выбирает ИЛ',form:'Пищевая продукция',inds:inds,hint:noteExample('food'),qhint:qtyExample('food')});S.cust={name:'',nd:'',qty:'',note:'',inds:''};toast('Добавлено в заявку');renderBrowse();updateBar();return}
  else if(act==='del'){var u=+t.getAttribute('data-u');S.basket=S.basket.filter(function(b){return b.uid!==u});renderFinal();updateBar()}
  else if(act==='cp'){copyText(t.getAttribute('data-v')||'')}
  else if(act==='cp3'){var r=allRows();copyRich(tableHTML(r,false),tableText(r,false),'Строки раздела III скопированы')}
  else if(act==='cp3h'){var r2=allRows();copyRich(tableHTML(r2,true),tableText(r2,true),'Таблица с заголовком скопирована')}
  else if(act==='cp1'){var p=sectionI();copyRich(kvHTML(p),kvText(p),'Раздел I скопирован')}
  else if(act==='cp2'){var p2=sectionII();copyRich(kvHTML(p2),kvText(p2),'Раздел II скопирован')}
  else if(act==='cpAgree'){copyRich(agreeHTML(),agreeText(),'Таблица согласования скопирована')}
  else if(act==='cpAktG'){copyText(aktGeneral().map(function(f){return f[0]+'\t'+f[1]}).join('\n'),'Общая часть акта скопирована')}
  else if(act==='cpAktI'){var u2=+t.getAttribute('data-u');var idx=S.basket.map(function(b){return b.uid}).indexOf(u2);copyText(aktItem(S.basket[idx],idx+1).map(function(f){return f[0]+'\t'+String(f[1]).replace(/\n/g,'; ')}).join('\n'),'Образец скопирован')}
  else if(act==='same-addr'){S.c.actual=S.c.legal;fillInputs()}
  else if(act==='place-actual'){S.c.place=S.c.actual;fillInputs()}
  else if(act==='clear-example'){S.c={org:'',inn:'',legal:'',actual:'',contact:'',cno:'',cdate:'',place:'',purpose:'Производственный контроль',sampler:'lab',methods:'lab',unc:'Нет',concl:'Нет'};S.basket=[];S.example=false;fillInputs();updateBar()}
});
document.addEventListener('input',function(e){
  var t=e.target;
  if(t.hasAttribute('data-c')){S.c[t.getAttribute('data-c')]=t.value;if(S.example){S.example=false;$('#exbanner').hidden=true}
    if(t.getAttribute('data-c')==='inn'){var v=(t.value||'').replace(/\D/g,'');var ok=v.length===10||v.length===12;var h=$('#innHelp');if(h){if(v.length>0&&!ok){h.textContent='ИНН должен содержать 10 цифр (ООО/АО) или 12 цифр (ИП). Сейчас — '+v.length+'.';h.style.color='var(--warn)'}else{h.textContent='10 цифр у организации (ООО/АО) или 12 цифр у ИП.';h.style.color=''}}}
    return}
  if(t.hasAttribute('data-b')){var b=S.basket.filter(function(x){return x.uid===+t.getAttribute('data-u')})[0];if(b){b[t.getAttribute('data-b')]=t.value}return}
  if(t.hasAttribute('data-dq')&&S.checks){S.checks[t.getAttribute('data-dq')]=t.value;return}
  if(t.hasAttribute('data-cu')){S.cust[t.getAttribute('data-cu')]=t.value;var btn=document.querySelector('[data-act=cuadd]');if(btn){var ok=S.cust.name.trim()&&S.cust.inds.trim();if(ok)btn.removeAttribute('disabled');else btn.setAttribute('disabled','')}return}
  if(t.id==='sq'){S.sq=t.value;var pos=t.selectionStart;renderBrowse();var q=$('#sq');q.focus();try{q.setSelectionRange(pos,pos)}catch(x){}}
  if(t.id==='trq'){S.trQ=t.value;var pos2=t.selectionStart;renderBrowse();var q2=$('#trq');q2.focus();try{q2.setSelectionRange(pos2,pos2)}catch(x){}}
});
document.addEventListener('change',function(e){
  var t=e.target;
  if(t.type==='radio'&&CH[t.name]){S.c[CH[t.name].k]=t.value;S.example=false;$('#exbanner').hidden=true;if(CH[t.name].k==='purpose'){if(S.tab==='vybor')renderDetail();if(S.tab==='zayavka')renderFinal()}return}
  if(t.type==='checkbox'&&t.hasAttribute('data-ag')){S.c.agree[t.getAttribute('data-ag')]=t.checked;S.example=false;$('#exbanner').hidden=true;return}
  if(t.name==='trsub'){S.sub=t.value;S.sel=null;renderBrowse()}
  if(t.id==='trg'){S.trGrp=t.value;renderBrowse()}
  if(t.id==='tri'){S.trInd=t.value;renderBrowse()}
  var act=t.getAttribute&&t.getAttribute('data-act');
  if(act==='chk'){S.checks.on[+t.getAttribute('data-i')]=t.checked;renderDetail()}
  if(act==='trchk'){var i=t.getAttribute('data-i');if(t.checked)S.trSel[i]=1;else delete S.trSel[i];renderBrowse()}
  if(act==='bchk'){var b=S.basket.filter(function(x){return x.uid===+t.getAttribute('data-u')})[0];b.inds[+t.getAttribute('data-j')].on=t.checked;renderFinal();updateBar()}
});

window.addEventListener('hashchange',function(){var h=(location.hash||'').replace('#','');if(['zakazchik','vybor','zayavka','pamyatka','lab'].indexOf(h)>=0&&h!==S.tab)setTab(h,true)});
/* init */
function seed(){
  // seed 2 example items so Готовая заявка не пустая при первом открытии
  var f=ALL.filter(function(a){return a.kind==='food'&&/Салаты/i.test(a.cat)})[0];
  var e=ALL.filter(function(a){return a.cat==='Смывы'&&/общепите/.test(a.name)})[0];
  if(f){addItem(f,f.items.map(function(){return true}));S.basket[0].qty='2 образца по 200 г';S.basket[0].di='01.01.2026'}
  if(e){addItem(e,e.items.map(function(i){return i.on}));var last=S.basket[S.basket.length-1];last.qty='10 смывов';last.note='цех, посуда, инвентарь, руки персонала'}
}
fillInputs();seed();updateBar();
var h=(location.hash||'').replace('#','');
if(['zakazchik','vybor','zayavka','pamyatka','lab'].indexOf(h)>=0)setTab(h,true);
})();
