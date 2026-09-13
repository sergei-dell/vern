'use strict';
(function () {
const $ = (ид) => document.getElementById(ид);
const ДОМА = ['дом-сборки', 'дом-мира'];
function показатьДом(ид) {
  ДОМА.forEach((д) => { $(д).hidden = (д !== ид); });
  window.scrollTo(0, 0);
}
function вСборку() {
  показатьДом('дом-сборки');
  СБОРКА.показать();
}
function воВорота() {
  показатьДом('дом-мира');
  ХОД.воВорота();
}
function вМир() {
  ХОД.перечитатьГероя();
  показатьДом('дом-мира');
  ХОД.вКарту();
}
function запуск() {
  СБОРКА.запуск();
  ХОД.запуск();
  СБОРКА.когдаГотов(вМир);
  $('к-войти').addEventListener('click', вСборку);
  $('к-переделать').addEventListener('click', вСборку);
  $('плашка-героя').addEventListener('click', вСборку);
  $('к-в-мир').addEventListener('click', вМир);
  if (СБОРКА.поломка()) вСборку();
  else if (СБОРКА.есть()) вМир();
  else воВорота();
}
document.addEventListener('DOMContentLoaded', запуск);
})();
