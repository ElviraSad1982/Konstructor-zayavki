<header class="top"><div class="wrap top-in">
  <div class="brand"><img class="brand-img" src="hero.webp" alt=""><div class="brand-text"><small>Испытательная лаборатория ООО «Викинг»</small><h1>Конструктор заявки</h1></div></div>
  <nav class="tabs" role="tablist" aria-label="Разделы">
    <button class="tab" role="tab" data-tab="zakazchik" aria-selected="true"><span class="n">1</span>Заказчик</button>
    <button class="tab" role="tab" data-tab="vybor" aria-selected="false"><span class="n">2</span>Что проверяем</button>
    <button class="tab" role="tab" data-tab="zayavka" aria-selected="false"><span class="n">3</span>Готовая заявка <span id="cnt" class="chip" hidden></span></button>
    <button class="tab sec" role="tab" data-tab="pamyatka" aria-selected="false">Памятка</button>
    <button class="tab sec" role="tab" data-tab="lab" aria-selected="false">Для лаборатории</button>
  </nav>
</div></header>

<main class="wrap">

<section id="p-zakazchik" class="sect" role="tabpanel">
  <div><h2>Шаг 1. Данные заказчика</h2>
  <p class="lead">Эти сведения попадут и в заявку (Word), и в акт отбора (Excel), поэтому вводить их нужно один раз. Поля с примером можно просто заменить.</p></div>
  <div id="exbanner" class="note" hidden>Сейчас в форме пример с вымышленной организацией. <button class="btn sm" data-act="clear-example">Очистить пример</button></div>
  <div class="card"><div class="grid2">
    <div class="field"><label for="c_org">Наименование организации</label><input type="text" id="c_org" data-c="org" autocomplete="organization"><span class="help">Полное и(или) краткое, как в договоре. Например: Общество с ограниченной ответственностью «Пример» (ООО «Пример»).</span></div>
    <div class="field"><label for="c_inn">ИНН</label><input type="text" id="c_inn" data-c="inn" inputmode="numeric" maxlength="12" pattern="\d{10}|\d{12}" minlength="10" required><span class="help" id="innHelp">10 цифр у организации (ООО/АО) или 12 цифр у ИП.</span></div>
    <div class="field full"><label for="c_legal">Юридический адрес</label><input type="text" id="c_legal" data-c="legal"><span class="help">Как в выписке из ЕГРЮЛ или ЕГРИП. Начните с почтового индекса (6 цифр); если в выписке индекса нет — возьмите его на почте России по адресу.</span></div>
    <div class="field full"><label for="c_actual">Фактический адрес</label><input type="text" id="c_actual" data-c="actual"><span class="help">Адрес места осуществления деятельности (производство, офис, объект). Этот адрес попадёт в акт отбора. <button class="btn sm ghost" data-act="same-addr">Совпадает с юридическим</button></span></div>
    <div class="field full"><label for="c_contact">Кто согласует заявку</label><input type="text" id="c_contact" data-c="contact"><span class="help">ФИО, должность, телефон, e-mail.</span></div>
    <div class="field"><label for="c_cno">Номер договора</label><input type="text" id="c_cno" data-c="cno" placeholder="например, 123/2026-ТД"><span class="help">Номер и дату договора возьмите в своём экземпляре договора.</span></div>
    <div class="field"><label for="c_cdate">Дата договора</label><input type="text" id="c_cdate" data-c="cdate" placeholder="дд.мм.гггг"><span class="help">В формате дд.мм.гггг, например 15.04.2026.</span></div>
  </div></div>
  <div class="card"><div class="grid2">
    <div class="field full"><span class="legend">Цель испытаний</span><div class="choices" id="g_purpose"></div><span class="help">От цели зависит редакция ГОСТ для Salmonella и Listeria в заявке: «Декларирование» → ГОСТ 31659-2012 и ГОСТ 32031-2012; «Производственный контроль» и другие → ГОСТ 31659-2024 и ГОСТ 32031-2022 (информационное письмо ИЛ ООО «ВИКИНГ» № 19/02-03/2026 от 19.02.2026).</span></div>
    <div class="field"><span class="legend">Кто отберёт пробы</span><div class="choices" id="g_sampler"></div><span class="help">Если отбор ваш, лаборатория не несёт ответственность за стадию отбора и доставки.</span></div>
    <div class="field"><span class="legend">Методики испытаний</span><span class="help">Методики подбирает лаборатория и согласует с вами в заявке. Вы отвечаете за выбор показателей и нормативов. НД на отбор проб заполнятся автоматически.</span></div>
    <div class="field full"><label for="c_place">Адрес места отбора проб или проведения измерений</label><input type="text" id="c_place" data-c="place"><span class="help">Заполняется, если пробы отбирает специалист ИЛ. Укажите адрес, этаж/помещение, кто встретит и его телефон. Обычно совпадает с фактическим адресом. <button class="btn sm ghost" data-act="place-actual">Как фактический адрес</button></span></div>
  </div></div>
  <div class="card"><h3 style="margin-top:0">Раздел IV. Согласование с заказчиком</h3>
    <p class="help" style="color:var(--muted);font-size:13px;margin:0 0 10px">По умолчанию все галочки проставлены ☒ — так заявка сразу готова к печати. Снимите те пункты, с которыми не согласны.</p>
    <div style="display:flex;flex-direction:column;gap:8px">
      <label class="cb"><input type="checkbox" data-ag="oa" checked><span>Ознакомлен с областью аккредитации ИЛ ООО «Викинг» (<a href="https://pub.fsa.gov.ru/ral/view/16581/current-aa" target="_blank" rel="noopener">pub.fsa.gov.ru/ral/view/16581</a>)</span></label>
      <label class="cb"><input type="checkbox" data-ag="meth" checked><span>Ознакомлен с выбранными методами испытаний (измерений) и отбора проб</span></label>
      <label class="cb"><input type="checkbox" data-ag="color" checked><span>Согласен на оформление результатов цветности воды без указания температуры пробы (п. 4.5 ГОСТ 31868-2012). <span class="help" style="color:var(--muted);font-size:12.5px">Снимите, если проводите испытания воды с указанием T.</span></span></label>
      <label class="cb"><input type="checkbox" data-ag="samples" checked><span>Ознакомлен о необходимом количестве образцов для проведения испытаний</span></label>
      <label class="cb"><input type="checkbox" data-ag="pay" checked><span>Гарантирую оплату по проведению лабораторных испытаний (измерений)</span></label>
      <label class="cb"><input type="checkbox" data-ag="terms" checked><span>Уведомлён о сроках проведения лабораторных испытаний (измерений)</span></label>
      <label class="cb"><input type="checkbox" data-ag="return" checked><span>Ознакомлен с порядком возврата (списания) образцов продукции: образцы после микробиологических испытаний, скоропортящейся продукции и образцы, подвергшиеся разрушающим методам воздействия, возврату не подлежат</span></label>
      <div class="field" style="margin-left:28px">
        <span class="legend">Образцы списать</span>
        <div class="choices" id="g_discardMode"></div>
      </div>
      <label class="cb"><input type="checkbox" data-ag="pdn" checked><span>Даю согласие на обработку персональных данных (ФЗ от 27.07.2006 № 152-ФЗ)</span></label>
    </div>
    <div class="field" style="margin-top:14px">
      <span class="legend">С вышеперечисленными условиями проведения испытаний (измерений)</span>
      <div class="choices" id="g_consent"></div>
    </div>
  </div>

  <div class="row"><button class="btn pri" data-act="goto" data-to="vybor">Далее: что проверяем</button></div>
</section>

<section id="p-vybor" class="sect" role="tabpanel" hidden>
  <div><h2>Шаг 2. Что проверяем</h2>
  <p class="lead">Выберите, что проверять, или введите название продукта. Показатели, методы и нормативные документы заполняются автоматически. Лишнее можно снять галочкой.</p></div>
  <div class="tiles" id="tiles"></div>
  <div id="browse"></div>
</section>

<section id="p-zayavka" class="sect" role="tabpanel" hidden>
  <div><h2>Шаг 3. Готовая заявка</h2>
  <p class="lead">Бланк заявки (Word) не меняется: копируйте данные и вставляйте в утверждённую форму. Акт отбора ведётся в Excel.</p></div>
  <div id="final"></div>
</section>

<section id="p-pamyatka" class="sect doc" role="tabpanel" hidden>__MEMO__</section>
<section id="p-lab" class="sect doc" role="tabpanel" hidden>__LAB__</section>
</main>

<div class="bar" id="bar" hidden><div class="wrap">
  <span id="barText"></span>
  <span class="row"><button class="btn pri" data-act="goto" data-to="zayavka">Показать заявку</button></span>
</div></div>
<div class="toast" id="toast" role="status" hidden></div>
<div id="printWrap" hidden><div class="pbar">
  <span><button class="btn" id="btnPrint">Печать</button> <button class="btn ghost" id="btnPrintClose">Закрыть</button></span>
  <span class="ph">A4, альбомная ориентация. Нажмите «Печать» или Ctrl+P / ⌘+P в браузере.</span>
</div><div id="printArea" aria-label="Печатная заявка"></div></div>
