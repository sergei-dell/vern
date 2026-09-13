window.ЛАВКИ = (function () {
'use strict';
const НАСТРОЙКИ = window.МИР_НАСТРОЙКИ;
const ДЕЛА      = window.ДЕЛА;
const $ = (ид) => document.getElementById(ид);
let открытое = null;
function числоДня(когда) {
  return когда.getFullYear() + '-' + (когда.getMonth() + 1) + '-' + когда.getDate();
}
function свернуть(строка) {
  const о = НАСТРОЙКИ.лавки.хеш.основание;
  let х = 0;
  for (const знак of строка) х = (х * о + знак.charCodeAt(0)) >>> 0;
  return х;
}
function поток(зерно) {
  const р = НАСТРОЙКИ.лавки.разброс;
  let с = зерно >>> 0;
  return () => {
    с = (с * р.множитель + р.слагаемое) >>> 0;
    return с / р.предел;
  };
}
function ктоГадает() {
  const з = window.ХОД && window.ХОД.герой ? window.ХОД.герой() : null;
  return з && з.зерно !== undefined ? String(з.зерно) : '';
}
function показать(имя, о, оговорка) {
  $('имя-дела').textContent = имя;
  $('о-деле').textContent = о;
  $('оговорка-дела').textContent = ДЕЛА.тексты.оговорка;
  $('оговорка-дела').hidden = !оговорка;
  $('дело').textContent = '';
  window.ХОД.вДело();
}
async function шахматы(дом) {
  const т = ДЕЛА.тексты;
  показать(дом.имя, т.шахматы_о, false);
  const поле = document.createElement('div');
  поле.className = 'доска-лавки';
  const подпись = document.createElement('div');
  подпись.className = 'чей-ход';
  const заново = кнопка(т.шахматы_заново, () => поставитьДоску(дом, поле, подпись));
  $('дело').append(подпись, поле, заново);
  if (!await подтянутьШахматы()) return;
  поставитьДоску(дом, поле, подпись);
}
async function подтянутьШахматы() {
  if (window.ШАХМАТЫ) return true;
  try {
    await import('./шахматы.0f79be29.js');
    return Boolean(window.ШАХМАТЫ);
  } catch (е) {
    return false;
  }
}
function поставитьДоску(дом, поле, подпись) {
  const т = window.МИР_ДАННЫЕ.тексты;
  const скажи = () => {
    const сторона = window.ШАХМАТЫ.чейХод() === 0 ? т.шахматы_белые : т.шахматы_чёрные;
    подпись.textContent = window.МИР_ДАННЫЕ.тексты.стол_ход
      ? подставить(window.МИР_ДАННЫЕ.тексты.стол_ход, { кто: сторона }) : сторона;
  };
  window.ШАХМАТЫ.поставить(поле, скажи, дом.ключ);
  скажи();
}
function подставить(шаблон, значения) {
  return шаблон.replace(/\{([^{}]+)\}/g, (всё, ключ) =>
    (ключ in значения) ? значения[ключ] : всё);
}
function таро(дом) {
  const т = ДЕЛА.тексты;
  показать(дом.имя, т.таро_о, true);
  const заголовок = document.createElement('h2');
  заголовок.textContent = т.таро_выбери;
  const ряд = document.createElement('div');
  ряд.className = 'ряд';
  for (const р of ДЕЛА.расклады) {
    const б = document.createElement('div');
    б.className = 'вар';
    б.innerHTML = р.имя + '<small>' + р.о + '</small>';
    б.addEventListener('click', () => разложить(р, поле));
    ряд.appendChild(б);
  }
  const поле = document.createElement('div');
  поле.className = 'расклад';
  $('дело').append(заголовок, ряд, поле);
}
function вытянуть(расклад) {
  const дальше = поток(свернуть(числоДня(new Date()) + ':' +
                                ктоГадает() + ':' + расклад.ключ));
  const колода = ДЕЛА.голоса.map((г, и) => и);
  for (let и = колода.length - 1; и > 0; и--) {
    const ж = Math.floor(дальше() * (и + 1));
    [колода[и], колода[ж]] = [колода[ж], колода[и]];
  }
  return колода.slice(0, расклад.карт).map((номер) => ({
    голос: ДЕЛА.голоса[номер],
    наоборот: дальше() < НАСТРОЙКИ.лавки.долиПеревёрнутых
  }));
}
function разложить(расклад, поле) {
  const т = ДЕЛА.тексты;
  поле.textContent = '';
  const карты = вытянуть(расклад);
  карты.forEach((к, и) => {
    const место = document.createElement('div');
    место.className = 'голос' + (к.наоборот ? ' наоборот' : '');
    const подпись = document.createElement('div');
    подпись.className = 'место-голоса';
    подпись.textContent = расклад.места[и];
    const рубашка = document.createElement('button');
    рубашка.className = 'рубашка';
    рубашка.textContent = т.таро_нажми;
    const лицо = document.createElement('div');
    лицо.className = 'лицо-голоса';
    лицо.hidden = true;
    лицо.innerHTML = знакГолоса(к.голос) +
      '<b>' + к.голос.имя + '</b>' +
      (к.наоборот ? '<i>' + т.таро_перевёрнут + '</i>' : '') +
      '<p>' + (к.наоборот ? к.голос.наоборот : к.голос.прямо) + '</p>';
    рубашка.addEventListener('click', () => {
      рубашка.hidden = true;
      лицо.hidden = false;
    });
    место.append(подпись, рубашка, лицо);
    поле.appendChild(место);
  });
}
function знакГолоса(голос) {
  const л = НАСТРОЙКИ.лавки;
  return '<svg class="знак-голоса" viewBox="0 0 ' + л.знакШирина + ' ' + л.знакВысота +
    '" width="' + л.знакШирина + '" height="' + л.знакВысота +
    '" fill="none" stroke-width="' + л.знакТолщина +
    '" stroke-linejoin="round" stroke-linecap="round">' + голос.знак + '</svg>';
}
function круг(дом) {
  const т = ДЕЛА.тексты;
  показать(дом.имя, т.круг_о, true);
  const заголовок = document.createElement('h2');
  заголовок.textContent = т.круг_спроси;
  const строка = document.createElement('div');
  строка.className = 'строка-даты';
  const поле = document.createElement('input');
  поле.type = 'date';
  const ответ = document.createElement('div');
  ответ.className = 'ответ-круга';
  const узнать = кнопка(т.круг_узнать, () => показатьКруг(поле.value, ответ));
  строка.append(поле, узнать);
  $('дело').append(заголовок, строка, ответ, сегодняшнее());
}
function показатьКруг(значение, куда) {
  const т = ДЕЛА.тексты;
  куда.textContent = '';
  const дата = разобратьДату(значение);
  if (!дата) { куда.textContent = т.круг_не_вышло; return; }
  const знак = знакПоДате(дата);
  куда.innerHTML =
    '<h2>' + т.круг_твой_знак + '</h2>' +
    '<div class="знак-года"><b>' + знак.имя + '</b><p>' + знак.о + '</p></div>' +
    '<h2>' + т.круг_на_сегодня + '</h2>' +
    '<p class="слово-дня">' + словоДня(знак) + '</p>';
}
function разобратьДату(значение) {
  if (!значение) return null;
  const д = new Date(значение);
  return isNaN(д.getTime()) ? null : д;
}
function знакПоДате(дата) {
  const месяц = дата.getMonth() + 1, день = дата.getDate();
  for (const з of ДЕЛА.зодиак) {
    const [мс, дс] = з.с, [мп, дп] = з.по;
    const после = месяц > мс || (месяц === мс && день >= дс);
    const до = месяц < мп || (месяц === мп && день <= дп);
    if (мс <= мп ? (после && до) : (после || до)) return з;
  }
  return ДЕЛА.зодиак[0];
}
function словоДня(знак) {
  const д = ДЕЛА.день;
  const сегодня = new Date();
  const номер = деньГода(сегодня) + знак.сдвиг;
  return [д.утро[номер % д.утро.length],
          д.дело[(номер + знак.сдвиг) % д.дело.length],
          д.встреча[(номер + знак.сдвиг + знак.сдвиг) % д.встреча.length]].join(' ');
}
function деньГода(когда) {
  const л = НАСТРОЙКИ.лавки;
  const начало = Date.UTC(когда.getFullYear(), 0, 1);
  const этот = Date.UTC(когда.getFullYear(), когда.getMonth(), когда.getDate());
  return Math.floor((этот - начало) / л.луна.сутокМс);
}
function сегодняшнее() {
  const т = ДЕЛА.тексты, л = НАСТРОЙКИ.лавки;
  const сейчас = new Date();
  const прошло = деньГода(сейчас);
  const месяц = ДЕЛА.месяцы[Math.min(Math.floor(прошло / л.год.сутокВМесяце),
                                     ДЕЛА.месяцы.length - 1)];
  const число = (прошло % л.год.сутокВМесяце) + 1;
  const фаза = фазаЛуны(сейчас);
  const узел = document.createElement('div');
  узел.className = 'круг-низ';
  узел.innerHTML =
    '<h2>' + т.круг_месяц + '</h2>' +
    '<p class="месяц-вэрна"><b>' + месяц.имя + '</b>, ' + число + '<br>' +
    '<span class="тускло мелко">' + месяц.погода + '</span></p>' +
    '<h2>' + т.круг_луна + '</h2>' +
    '<p class="луна-вэрна"><b>' + фаза.имя + '</b><br>' +
    '<span class="тускло мелко">' + фаза.о + '</span></p>';
  return узел;
}
function фазаЛуны(когда) {
  const л = НАСТРОЙКИ.лавки.луна;
  const суток = (когда.getTime() - л.началоОтсчёта) / л.сутокМс;
  const доля = ((суток / л.месяцСуток) % 1 + 1) % 1;
  return ДЕЛА.луна[Math.round(доля * ДЕЛА.луна.length) % ДЕЛА.луна.length];
}
function кнопка(подпись, что) {
  const б = document.createElement('button');
  б.className = 'кн тихая';
  б.textContent = подпись;
  б.addEventListener('click', что);
  return б;
}
const ДЕЛАТЕЛИ = { шахматы: шахматы, таро: таро, круг: круг };
return {
  есть: (занятие) => Boolean(НАСТРОЙКИ.лавки.чем[занятие]),
  открыть: function (дом) {
    const ключ = НАСТРОЙКИ.лавки.чем[дом.занятие];
    if (!ключ) return;
    открытое = ключ;
    ДЕЛАТЕЛИ[ключ](дом);
  },
  какое: () => открытое
};
})();
