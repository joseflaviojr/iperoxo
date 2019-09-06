//! Bootstrap-select 1.13.9 (https://developer.snapappointments.com/bootstrap-select)
//! Versão adaptada de defaults-pt_BR.js
(function (root, factory) {
  if (root === undefined && window !== undefined) root = window;
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["jquery"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    factory(root["jQuery"]);
  }
}(this, function (jQuery) {

(function ($) {
  $.fn.selectpicker.defaults = {
    noneSelectedText: '&#8709;',
    noneResultsText: '&#8708; {0}',
    countSelectedText: '{0} &#8804; {1}',
    maxOptionsText: ['&#62; {n}', '&#62; {n}'],
    multipleSeparator: ', ',
    selectAllText: '&#128504;',
    deselectAllText: '&#128500;'
  };
})(jQuery);


}));
