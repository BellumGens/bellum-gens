/**
 * Applies Bulgarian translations for the 48 newly added placeholder entries.
 * For strings with inline <x .../> elements the source XML is preserved verbatim
 * and only the surrounding text is translated.
 */
const fs = require('fs');
const bgPath = 'projects/bellumgens/src/locale/messages.bg.xlf';
let bg = fs.readFileSync(bgPath, 'utf8');

// Map of id -> Bulgarian target text (inline <x .../> tags copied verbatim from source)
const translations = {
  // ── Hero / stats strip ─────────────────────────────────────────────────────
  '5336894661585606222':
    'Премиер LAN събитие, където древната история се среща с esports от световна класа — 16 от най-добрите StarCraft II играчи се борят за слава и €10 000.',
  '5999334860671753594': 'Награден фонд €10 000',
  '520815396619748953':  '16 Играча',
  '8885548938431055381': '4–7 юни 2025',
  '5105991103504996112': 'Виж играчите',
  '4593436872335895837': 'Шампион 2025',
  '8921695041094295962': 'Награден фонд',
  '3215516821442781611': '4–7 юни 2025',
  '3739446176754569090': 'Основно събитие',

  // ── Venue section ───────────────────────────────────────────────────────────
  '5216942087616864337':
    'The <x id="START_TAG_SPAN" ctype="x-span" equiv-text="&lt;span class=&quot;highlight&quot;&gt;"/>Летен театър в Стара Загора<x id="CLOSE_TAG_SPAN" ctype="x-span" equiv-text="&lt;/span&gt;"/> се намира в подножието на най-големия градски парк в България. Този открит шедьовър съчетава природата и древните традиции с модерната архитектура в уникално преживяване.',
  '2686278515067882461':
    'Играчите се сблъскват като гладиатори на открития сцена на този прекрасен театър, а вие имате шанс да се срещнете лице в лице с любимите си про играчи по алеите на красивия парк.',
  '2663666363609066444':
    'Градът домакин на това събитие има повече от <x id="START_TAG_SPAN" ctype="x-span" equiv-text="&lt;span class=&quot;highlight&quot;&gt;"/>8 000 години история<x id="CLOSE_TAG_SPAN" ctype="x-span" equiv-text="&lt;/span&gt;"/>. Древни форуми, римски стенописи и мозайки, 2 000-годишни театри, бани и акведукти — всичко е под краката ви и около вас!',

  // ── BGE Balkan Circuit ──────────────────────────────────────────────────────
  '1882262510593998151':
    '<x id="START_TAG_SPAN" ctype="x-span" equiv-text="&lt;span class=&quot;highlight&quot;&gt;"/>Bellum Gens Elite Balkan<x id="CLOSE_TAG_SPAN" ctype="x-span" equiv-text="&lt;/span&gt;"/> е седмична онлайн верига, която дава на всеки балкански играч възможността да участва в седмични мачове и да натрупва точки за парични награди.',
  '6481260934539937324':
    'Онлайн веригата стартира <x id="START_TAG_SPAN" ctype="x-span" equiv-text="&lt;span class=&quot;highlight&quot;&gt;"/><x id="INTERPOLATION" equiv-text="{{ &apos;2024-11-30&apos; | date: &apos;longDate&apos; }}"/><x id="CLOSE_TAG_SPAN" ctype="x-span" equiv-text="&lt;/span&gt;"/>',
  '4133468691967704032':
    'Участвайте седмично за <x id="START_TAG_SPAN" ctype="x-span" equiv-text="&lt;span class=&quot;highlight&quot;&gt;"/>ежемесечни парични награди<x id="CLOSE_TAG_SPAN" ctype="x-span" equiv-text="&lt;/span&gt;"/>',

  // ── Past Events — 2025 ──────────────────────────────────────────────────────
  '9093258495981730316': 'BGE — Стара Загора 2025',
  '4911987879323962897':
    'Игра: <x id="START_TAG_SPAN" ctype="x-span" equiv-text="&lt;span class=&quot;highlight&quot;&gt;"/>StarCraft II<x id="CLOSE_TAG_SPAN" ctype="x-span" equiv-text="&lt;/span&gt;"/>',
  '6798225141227673565':
    'Дата: <x id="START_TAG_SPAN" ctype="x-span" equiv-text="&lt;span class=&quot;highlight&quot;&gt;"/>4–7 юни 2025<x id="CLOSE_TAG_SPAN" ctype="x-span" equiv-text="&lt;/span&gt;"/>',
  '1971945046433074102':
    'Награден фонд: <x id="START_TAG_SPAN" ctype="x-span" equiv-text="&lt;span class=&quot;highlight&quot;&gt;"/>€10 000<x id="CLOSE_TAG_SPAN" ctype="x-span" equiv-text="&lt;/span&gt;"/> + 1 място на EWC',
  '1380837019808396374':
    'Квалификация за EWC: <x id="START_TAG_SPAN" ctype="x-span" equiv-text="&lt;span class=&quot;highlight&quot;&gt;"/>ShoWTimE<x id="CLOSE_TAG_SPAN" ctype="x-span" equiv-text="&lt;/span&gt;"/>',
  '8759920691444590262':
    'Шампион: <x id="START_TAG_SPAN" ctype="x-span" equiv-text="&lt;span class=&quot;highlight&quot;&gt;"/>Clem<x id="CLOSE_TAG_SPAN" ctype="x-span" equiv-text="&lt;/span&gt;"/>',

  // ── Past Events — 2024 ──────────────────────────────────────────────────────
  '4669876095087490612': 'BGE — Стара Загора 2024',
  '7258497818967864436':
    'Дата: <x id="START_TAG_SPAN" ctype="x-span" equiv-text="&lt;span class=&quot;highlight&quot;&gt;"/>4–8 септември 2024<x id="CLOSE_TAG_SPAN" ctype="x-span" equiv-text="&lt;/span&gt;"/>',
  '2890286882416011617':
    'Играчи: <x id="START_TAG_SPAN" ctype="x-span" equiv-text="&lt;span class=&quot;highlight&quot;&gt;"/>16<x id="CLOSE_TAG_SPAN" ctype="x-span" equiv-text="&lt;/span&gt;"/>',
  '4686207990368830957':
    'Награден фонд: <x id="START_TAG_SPAN" ctype="x-span" equiv-text="&lt;span class=&quot;highlight&quot;&gt;"/>€10 000<x id="CLOSE_TAG_SPAN" ctype="x-span" equiv-text="&lt;/span&gt;"/>',
  '6420289489038313708':
    'Място: <x id="START_TAG_SPAN" ctype="x-span" equiv-text="&lt;span class=&quot;highlight&quot;&gt;"/>Летен театър — Стара Загора<x id="CLOSE_TAG_SPAN" ctype="x-span" equiv-text="&lt;/span&gt;"/>',

  // ── Past Events — 2020 ──────────────────────────────────────────────────────
  '79610840571993492': 'BGE — Стара Загора 2020',
  '4048800135516160343':
    '<x id="START_TAG_SPAN" ctype="x-span" equiv-text="&lt;span class=&quot;highlight&quot;&gt;"/>Bellum Gens Elite — Стара Загора 2020<x id="CLOSE_TAG_SPAN" ctype="x-span" equiv-text="&lt;/span&gt;"/> събра най-добрите Counter-Strike таланти в региона да се надпреварват под един покрив за награден фонд от $10 000!',
  '5160228428885622504':
    'Едно от малкото LAN събития, проведени през 2020 г. Въпреки ограниченията за пътуване заради Covid-19, 10 отбора се надпреварваха в LAN финалите.',

  // ── Sponsorship ─────────────────────────────────────────────────────────────
  '1715844071247509962':
    'Bellum Gens предлага широка видимост на спонсори и партньори чрез дигитални канали и на място по време на офлайн събития.',
  '6144363855277174673':
    '<x id="START_LINK" ctype="x-a" equiv-text="&lt;a href=&quot;mailto:info@bellumgens.com&quot;&gt;"/>Свържете се с нас<x id="CLOSE_LINK" ctype="x-a" equiv-text="&lt;/a&gt;"/> ако желаете да спонсорирате това или друго събитие на Bellum Gens. Контактите ни в социалните мрежи са в долния колонтитул.',

  // ── Partners ────────────────────────────────────────────────────────────────
  '7104177141976931052': 'Българска StarCraft Лига',
  '2968665029315048820': 'Община Стара Загора',

  // ── Home page carousel / about ──────────────────────────────────────────────
  '5505648376206290209':
    'Esports Business League е гейминг събитие за вашия офис! Изградете по-добри екипни връзки чрез приятелски или конкурентен гейминг, или накарайте вашия екип да се надбива с отбори от други компании.',
  '3853349505898786088':
    'Наберете вашия отбор, управлявайте роли, стратегии, времена за тренировки и много повече. Единственият безплатен онлайн редактор на Counter-Strike стратегии, достъпен за всички!',
  '7436996661568033362': 'За Bellum Gens',
  '6372921677673118464':
    'Bellum Gens е организатор на гейминг и esports събития и консултант, фокусиран върху развитието и популяризирането на esports в България. Помагаме на брандове да се свържат с гейминг аудитории чрез турнири, стриймове и дигитални канали. <x id="START_LINK" ctype="x-a" equiv-text="&lt;a href=&quot;mailto:info@bellumgens.com&quot;&gt;"/>Свържете се с нас<x id="CLOSE_LINK" ctype="x-a" equiv-text="&lt;/a&gt;"/> за повече информация за наличните възможности.',
  '7578543956227710715':
    'Организатор на премиер <x id="START_TAG_SPAN" ctype="x-span" equiv-text="&lt;span class=&quot;highlight&quot;&gt;"/>Bellum Gens Elite<x id="CLOSE_TAG_SPAN" ctype="x-span" equiv-text="&lt;/span&gt;"/> LAN събитие по StarCraft II — топ играчи от целия свят се борят за <x id="START_TAG_SPAN" ctype="x-span" equiv-text="&lt;span class=&quot;highlight&quot;&gt;"/>€10 000<x id="CLOSE_TAG_SPAN" ctype="x-span" equiv-text="&lt;/span&gt;"/> награден фонд на Летен театър в Стара Загора.',
  '2690119124558896720': 'Изграждане на екип &amp; гейминг',
  '526332915777904914':
    'Организатор на <x id="START_TAG_SPAN" ctype="x-span" equiv-text="&lt;span class=&quot;highlight&quot;&gt;"/>Esports Business League<x id="CLOSE_TAG_SPAN" ctype="x-span" equiv-text="&lt;/span&gt;"/> — конкурентно гейминг събитие за офиса. Множество компании се надпреварваха в различни сезони за забавление, екипен дух и право на похвала!',
  '8993625035612590666':
    'Платформа за намиране и управление на Counter-Strike отбори — намерете отбори, подходящи за вашето ниво, управлявайте съставите, стратегиите и графиците. Защото Counter-Strike е отборна игра!',

  // ── Social links (proper names — unchanged) ─────────────────────────────────
  '8790918354594417962': 'Facebook',
  '1715373473261069991': 'Twitter',
  '3080109816219994129': 'Instagram',
  '8401085193044135025': 'YouTube',
  '4440081753597585133': 'LinkedIn',
  '3400027835914346369': 'Discord',
  '2044436736853242257': 'Twitch',
};

let replaced = 0;
for (const [id, bgText] of Object.entries(translations)) {
  // Match the trans-unit by id and replace its <target> content
  const unitRe = new RegExp(
    '(<trans-unit id="' + id + '"[\\s\\S]*?<target>)([\\s\\S]*?)(<\\/target>)'
  );
  if (unitRe.test(bg)) {
    bg = bg.replace(unitRe, (_, open, _old, close) => open + bgText + close);
    replaced++;
  } else {
    console.warn('Unit not found or no <target>:', id);
  }
}

fs.writeFileSync(bgPath, bg, 'utf8');
console.log(`Done. Translated ${replaced} / ${Object.keys(translations).length} units.`);
