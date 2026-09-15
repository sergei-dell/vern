window.ПАНЕЛИ = (function () {
const НАСТРОЙКИ = window.МИР_НАСТРОЙКИ;
const МИР = window.МИР_ДАННЫЕ;
const $ = (ид) => document.getElementById(ид);
let подсказкаУшла = false;
let прежнийДом = null, прежняяКарта = null, прежнийЗвук = null;
function полосаЛавок() {
  const т = МИР.тексты, п = НАСТРОЙКИ.панели;
  const полоса = $('места-лавок');
  полоса.textContent = '';
  const заголовок = document.createElement('span');
  заголовок.className = 'места-заголовок';
  заголовок.textContent = т.места_заголовок;
  полоса.appendChild(заголовок);
  for (const дом of МИР.дома) {
    if (дом.состояние !== МИР.состояния.открыт || !дом.место) continue;
    const кн = document.createElement('button');
    кн.className = 'место-лавки';
    кн.dataset.дом = дом.ключ;
    кн.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="' + п.приставкаЗнака + дом.занятие + '"/></svg>';
    const имя = document.createElement('span');
    имя.textContent = дом.имя;
    кн.appendChild(имя);
    кн.addEventListener('click', (с) => {
      с.stopPropagation();
      window.ЗВУК.щелчок();
      if (window.ХОЛСТ.раскрытаЛи()) window.ХОЛСТ.свернутьМини();
      window.КАРТА.кДому(дом.ключ);
    });
    полоса.appendChild(кн);
  }
}
function подписи() {
  const т = МИР.тексты;
  $('подсказка').textContent = т.подсказка_ходьба;
  $('кн-ворота').title = т.кн_ворота;
  $('кн-экран').title = т.кн_экран;
  $('кн-ворота').setAttribute('aria-label', т.кн_ворота);
  $('кн-экран').setAttribute('aria-label', т.кн_экран);
  if (!document.documentElement.requestFullscreen) $('кн-экран').hidden = true;
}
function переключитьКарту() {
  window.ЗВУК.щелчок();
  if (window.ХОЛСТ.раскрытаЛи()) window.ХОЛСТ.свернутьМини();
  else window.ХОЛСТ.раскрытьМини();
}
function воВесьЭкран() {
  window.ЗВУК.щелчок();
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  else document.documentElement.requestFullscreen().catch(() => {});
}
function кадр() {
  const т = МИР.тексты;
  const раскрыта = window.ХОЛСТ.раскрытаЛи();
  if (раскрыта !== прежняяКарта) {
    прежняяКарта = раскрыта;
    $('кн-карта').classList.toggle('улица', раскрыта);
    $('кн-карта-слово').textContent = раскрыта ? т.кн_улица : т.кн_карта;
    $('кн-карта').title = раскрыта ? т.кн_улица_подсказка : т.кн_карта_подсказка;
  }
  const тихо = window.ЗВУК.тихо();
  if (тихо !== прежнийЗвук) {
    прежнийЗвук = тихо;
    $('кн-звук').classList.toggle('тихо', тихо);
    $('кн-звук').title = тихо ? т.кн_звук_включить : т.кн_звук_выключить;
    $('кн-звук').setAttribute('aria-label', $('кн-звук').title);
  }
  const идёт = window.КАРТА.идётКДому();
  if (идёт !== прежнийДом) {
    прежнийДом = идёт;
    document.querySelectorAll('#места-лавок [data-дом]').forEach((кн) =>
      кн.classList.toggle('выбрано', кн.dataset.дом === идёт));
  }
  const где = window.КАРТА.где();
  if (где) {
    window.ЗВУК.пройдено(где.пройдено);
    if (где.идёт && !подсказкаУшла) {
      подсказкаУшла = true;
      $('подсказка').classList.add('ушла');
    }
  }
  requestAnimationFrame(кадр);
}
function вошли() { window.ЗВУК.дверь(); }
function запуск() {
  подписи();
  полосаЛавок();
  $('кн-карта').addEventListener('click', (с) => { с.stopPropagation(); переключитьКарту(); });
  $('кн-звук').addEventListener('click', (с) => { с.stopPropagation(); window.ЗВУК.переключить(); });
  $('кн-экран').addEventListener('click', (с) => { с.stopPropagation(); воВесьЭкран(); });
  $('двор').addEventListener('pointerdown', () => {
    window.ЗВУК.завести();
    window.ЗВУК.щелчок();
  }, true);
  window.addEventListener('keydown', (с) => {
    if (с.code !== НАСТРОЙКИ.карта.клавиши.карта || $('э-карта').hidden) return;
    if (с.target.closest && с.target.closest('input, textarea')) return;
    переключитьКарту();
  });
  requestAnimationFrame(кадр);
}
document.addEventListener('DOMContentLoaded', запуск);
return { вошли: вошли };
})();
