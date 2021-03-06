//Polyfill for querySelectorAll and querySelector for IE6,IE7
/*@cc_on
document.querySelectorAll||(document.querySelectorAll=function(e){var t,n=document.createElement('style'),o=[];for(document.documentElement.firstChild.appendChild(n),document._qsa=[],n.styleSheet.cssText=e+'{x-qsa:expression(document._qsa && document._qsa.push(this))}',window.scrollBy(0,0),n.parentNode.removeChild(n);document._qsa.length;)(t=document._qsa.shift()).style.removeAttribute('x-qsa'),o.push(t);return document._qsa=null,o}),document.querySelector||(document.querySelector=function(e){var t=document.querySelectorAll(e);return t.length?t[0]:null});
@*/
//Polyfill for classList old browser
!function(){var e=function(e){return e.replace(/^\s+|\s+$/g,"")},t=function(e){return new RegExp("(^|\\s+)"+e+"(\\s+|$)")},n=function(e,t,n){for(var s=0;s<e.length;s++)t.call(n,e[s])};function s(e){this.element=e}s.prototype={add:function(){n(arguments,function(t){this.contains(t)||(this.element.className=e(this.element.className+" "+t))},this)},remove:function(){n(arguments,function(n){this.element.className=e(this.element.className.replace(t(n)," "))},this)},toggle:function(e){return this.contains(e)?(this.remove(e),!1):(this.add(e),!0)},contains:function(e){return t(e).test(this.element.className)},item:function(e){return this.element.className.split(/\s+/)[e]||null},replace:function(e,t){this.remove(e),this.add(t)}},"classList"in Element.prototype||Object.defineProperty(Element.prototype,"classList",{get:function(){return new s(this)}}),window.DOMTokenList&&!DOMTokenList.prototype.replace&&(DOMTokenList.prototype.replace=s.prototype.replace)}();
//Polyfill for array indexOf
Array.prototype.indexOf||(Array.prototype.indexOf=function(r,t){"use strict";var e;if(null==this)throw new TypeError('"this" is null or not defined');var n=Object(this),i=n.length>>>0;if(0===i)return-1;var o=0|t;if(o>=i)return-1;for(e=Math.max(o>=0?o:i-Math.abs(o),0);e<i;e++)if(e in n&&n[e]===r)return e;return-1});

var CookieScript = function () {
  this.onAcceptAll = function () {}

  this.onAccept = function () {}

  this.onReject = function () {}

  this.onClose = function () {}

  this.currentState = function () {
    var data = {action: _readInnerCookieParam('action')};
      data.categories = _readCategoriesCheckboxesFromCookies();
      return data;
  }

  this.expireDays = function () {
    return expireDays;
  }

  this.show = function () {
    _showBanner();
  }

  this.hide = function () {
    _hideBanner();
    _showBadge();
  }

  this.categories = function () {
    return allCategory;
  }

  this.dispatchEventNames = [];

  this.acceptAllAction = function () {
    _setAllCheckboxesValue(true);

      var analyticsType = 'acceptall';
    var cookiesCategoriesForTrack =  _cookiesCategoriesWithoutStrict(allCategory);
    _hideBanner();

    _writeInnerCookieParam('action', 'accept');
          _allowCookies();
      _setReportPagesCheckboxes(allCategory);
      _resetCookies(allCategory);
      _writeInnerCookieParam('categories', JSON.stringify(cookiesCategoriesForTrack));
    
    _sendCollectConsents('accept', cookiesCategoriesForTrack.join(','));
    _sendAnalytics(analyticsType, '');
    _setConsentCheckbox(true);
    _showBadge();
    _dispatchAcceptAllEvent();
    _reloadPage();
    }

  this.acceptAction = function (outerCategories) {
            var allowCategory;
      if(typeof outerCategories === 'undefined') {
        allowCategory = _readCategoriesCheckboxesFromUI();
        _setReportPagesCheckboxes(allowCategory);
      } else {
        if(isPresentStrictly) {
          outerCategories.push('strict');
        }
        allowCategory = _uniqueArray(outerCategories);
        _setCheckboxesByCategories(allowCategory);
      }
      var cookiesCategoriesForTrack =  _cookiesCategoriesWithoutStrict(allowCategory);
      if(allowCategory.length === allCategory.length) {
        _allowCookies();
      } else {
        _allowCookies(allowCategory);
      }
      _resetCookies(allowCategory);

      // Remove cookies that now allow
      _rejectCookies(allowCategory);
      if(cookiesCategoriesForTrack.length > 0) {
        _writeInnerCookieParam('action', 'accept');
        _writeInnerCookieParam('categories', JSON.stringify(cookiesCategoriesForTrack));
        _sendCollectConsents('accept', cookiesCategoriesForTrack.join(','));
        _sendAnalytics('accept', cookiesCategoriesForTrack.join(','));
      } else {
        _writeInnerCookieParam('action', 'reject');
        _writeInnerCookieParam('categories', []);
        _sendCollectConsents('reject', '');
        _sendAnalytics('reject', '');
      }

      _hideBanner();
      _setConsentCheckbox(allowCategory.length === allCategory.length);
      _showBadge();
      _dispatchAcceptEvent(allowCategory);
      _reloadPage();
        }

  this.rejectAllAction = function () {
    _setAllCheckboxesValue(false);
    _setReportPagesCheckboxes([]);

      _sendAnalytics('reject', '');
    _writeInnerCookieParam('action', 'reject');
    _writeInnerCookieParam('categories', JSON.stringify([]));
    _sendCollectConsents('reject', '');
    _rejectCookies();
    _hideBanner();
    _setConsentCheckbox(false);
    _showBadge();
    _dispatchRejectEvent();
    _reloadPage();
    }

  this.demoLoadView = function () {
      _log('Warning is real site script');
    }

  /* Private variable */
  var _this = this;
  var css = "\n    <style data-type=\"cookiescriptstyles\">\n      #cookiescript_injected {\r\n    background-color: #2a88cf;\r\n    z-index: 999997;\r\n    opacity: 1;\r\n    font-size: 14px;\r\n    font-weight: normal;\r\n    font-family: 'Open Sans', Arial, 'Trebuchet MS', 'Segoe UI', 'Helvetica', sans-serif;\r\n    box-shadow: 1px 2px 8px 0 rgba(0, 0, 0, 0.35);\r\n    color: #FFFFFF;\r\n    box-sizing: border-box;\r\n}\r\n.cookiescript_checkbox_label {\r\n    cursor: pointer;\r\n    display: flex;\r\n    align-items: center;\r\n    padding:0 4px;\r\n    line-height: 1.5;\r\n    margin:0;\r\n}\r\n#cookiescript_close {\r\n    position: absolute;\r\n    top: 10px;\r\n    right: 10px;\r\n    font-size: 29px;\r\n    line-height: 13px;\r\n    cursor: pointer;\r\n    color: #FFFFFF;\r\n    height: 15px;\r\n    width: 15px;\r\n    margin: 0;\r\n    padding: 0;\r\n    overflow: hidden;\r\n    letter-spacing: 0;\r\n    font-family: 'Trebuchet MS', 'Arial', sans-serif;\r\n    font-weight: 100;\r\n    opacity: 0.85;\r\n    z-index: 999999;\r\n}\r\n\r\n#cookiescript_buttons {\r\n    display: flex;\r\n    flex-direction: row;\r\n    font-weight: 700;\r\n}\r\n#cookiescript_manage_wrap {\r\n    text-transform: uppercase;\r\n    text-align: center;\r\n    font-size: 11px;\r\n    letter-spacing: 0.1px;\r\n    font-weight: 500;\r\n}\r\n#cookiescript_manage {\r\n    display: inline;\r\n    cursor: pointer;\r\n    color: #FFFFFF;\r\n    opacity:0.85;\r\n}\r\n#cookiescript_manage #cookiescript_manageicon .cookiescript_gear {\r\n    fill: #FFFFFF;\r\n}\r\n#cookiescript_manage:hover #cookiescript_manageicon .cookiescript_gear {\r\n    fill: #015fa7;;\r\n}\r\n\r\nsvg#cookiescript_manageicon {\r\n    width: 15px;\r\n    height: 15px;\r\n    display: inline;\r\n    margin: 0 5px 0 0;\r\n    padding: 0;\r\n    position: relative;\r\n    top: 3px;\r\n}\r\n#cookiescript_header {\r\n    background-color: transparent;\r\n    z-index: 999998;\r\n    color: #FFFFFF;\r\n    font-size: 17px;\r\n    line-height: 1.3;\r\n    font-weight: 600;\r\n    letter-spacing: 0.4px;\r\n    opacity:1;\r\n}\r\n.cookiescript_checkbox {\r\n    display: flex;\r\n    flex-direction: row;\r\n}\r\ninput.cookiescript_checkbox_input {\r\n}\r\nspan.cookiescript_checkbox_text {\r\n    display: inline-block;\r\n    font-size: 11px;\r\n    margin: 0;\r\n    text-transform: uppercase;\r\n    font-weight: 500;\r\n    color: #FFFFFF;\r\n}\r\n#cookiescript_accept,\r\n#cookiescript_save {\r\n    border: 0;\r\n    transition: all 0.25s ease 0s;\r\n    background-color: #015fa7;\r\n    color: #FFFFFF;\r\n    text-transform: uppercase;\r\n    font-size: 11px;\r\n    text-align: center;\r\n    line-height: 3.3;\r\n    letter-spacing: 0.4px;\r\n}\r\n\/*IE 9 fixes*\/\r\n@media screen and (min-width:0\\0) and (min-resolution: .001dpcm) {\r\n    .cookiescript_checkbox_label {\r\n        position: relative;\r\n        top:-10px;\r\n    }\r\n    #cookiescript_accept, #cookiescript_reject, #cookiescript_save{\r\n    \tdisplay: inline-block;\r\n    }\r\n    #cookiescript_buttons{\r\n    \ttext-align:center;\r\n    }\r\n}\r\n#cookiescript_save{\r\n    display: none;\r\n}\r\n#cookiescript_reject {\r\n    border: 1px solid #FFFFFF;\r\n    text-align: center;\r\n    line-height: 3;\r\n    font-size: 11px;\r\n    text-transform: uppercase;\r\n    letter-spacing: 0.4px;\r\n    color: #FFFFFF;\r\n    background: #2d2d2d;\r\n}\r\n\r\n\r\n#cookiescript_accept, #cookiescript_reject, #cookiescript_save {\r\n    font-weight: 500;\r\n    cursor: pointer;\r\n    white-space: nowrap;\r\n    transition-duration: 100ms;\r\n    transition-timing-function: ease-in-out;\r\n    min-width: 103px;\r\n}\r\n.cookiescript_bigger {\r\n    transform: scale(1.1);\r\n}\r\n#cookiescript_link {\r\n    text-decoration: none;\r\n    color: #FFFFFF;\r\n    font-size: 9px;\r\n    text-align: center;\r\n    font-weight: 400;\r\n    text-transform: uppercase;\r\n    opacity: 0.8;\r\n}\r\n\r\n#cookiescript_readmore,\r\n#cookiescript_reportlink,\r\n#cookiescript_cookiescriptlink {\r\n    border: 0;\r\n    padding: 0;\r\n    cursor: pointer;\r\n    margin: 0;\r\n    transition: all 100ms ease 0s;\r\n    background-color: transparent;\r\n    color: #FFFFFF;\r\n    display: inline;\r\n    font-size: 11px;\r\n}\r\n\r\n#cookiescript_description {\r\n    color: #FFFFFF;\r\n    font-size: 11px;\r\n    letter-spacing: 0.3px;\r\n    line-height: 1.8;\r\n    font-weight: 400;\r\n    opacity: 0.85;\r\n}\r\n#cookiescript_checkboxs {\r\n}\r\n#cookiescript_close:hover,\r\n#cookiescript_manage:hover,\r\n#cookiescript_link:hover\r\n{\r\n    opacity: 1;\r\n}\r\n#cookiescript_badge {\r\n    position: fixed;\r\n    line-height: 0;\r\n    cursor: pointer;\r\n    z-index: 99999;\r\n    font-size: 0;\r\n    color: #999;\r\nleft: 10px;\r\n    display: flex;\r\n    flex-direction: row;\r\n    opacity: 1;\r\n}\r\n\r\n#cookiescript_badgetext{\r\n    text-transform: uppercase;\r\n    font-weight: 600;\r\n    font-family: 'Open Sans', Arial, 'Trebuchet MS', 'Segoe UI', 'Helvetica', sans-serif;\r\n    overflow: hidden;\r\n    transition-duration: 500ms;\r\n    white-space: nowrap;\r\n    padding-right: 0;\r\n    color: #FFFFFF;\r\n}\r\n\r\n#cookiescript_badgesvg{\r\n    width:40px;\r\n    height: 40px;\r\n}\r\n\r\n\r\n\r\n#cookiescript_badge {\r\nbottom: 0;\r\n    border-top-left-radius: 15px;\r\n    border-top-right-radius: 15px;\r\n    padding-top:10px;\r\n    padding-bottom: 8px;\r\n    padding-left:12px;\r\n    padding-right:12px;\r\n    transition-duration: 200ms;\r\n    box-shadow: 1px 2px 8px 0 rgba(0, 0, 0, 0.2);\r\n    background: #2a88cf;\r\n}\r\n#cookiescript_badgetext {\r\n    font-size: 11px;\r\n    line-height: 1;\r\n}\r\n#cookiescript_badge:hover{\r\n    padding-bottom: 13px;\r\n}\r\n@media only screen and (max-width: 414px) {\r\n    #cookiescript_badge {\r\n        border-top-left-radius: 10px;\r\n        border-top-right-radius: 10px;\r\n    }\r\n}\r\n\r\n@media print{\r\n    #cookiescript_injected{\r\n        display:none;\r\n    }\r\n}\r\n\r\n.cookiescript_fullreport,\r\n.cookiescript_fullreport tbody,\r\n.cookiescript_fullreport thead,\r\n.cookiescript_fullreport tr,\r\n.cookiescript_fullreport th,\r\n.cookiescript_fullreport td {\r\n  margin: 0;\r\n  padding: 0;\r\n  border: 0;\r\n  font-size: 100%;\r\n  font: inherit;\r\n  vertical-align: baseline;\r\n}\r\ntable.cookiescript_fullreport {\r\n  border-collapse: collapse;\r\n  border-spacing: 0;\r\n}\r\n\r\n\r\n#cookiescript_maintabs {\r\n\tdisplay: flex;\r\n\tjustify-content: space-around;\r\n\tbackground: rgba(193, 193, 193, 0.6);\r\n\talign-items: stretch;\r\n\toverflow: hidden;\r\n\tmin-height: 36px;\r\n}\r\n\r\n#cookiescript_categories {\r\n\tdisplay: flex;\r\n\tjustify-content: center;\r\n\tpadding: 7px 0;\r\n\tborder-bottom: 1px solid #F1F1F1;\r\n\tflex-wrap: wrap;\r\n}\r\n\r\n#cookiescript_cookietablewrap {\r\n\tmax-width: 1140px;\r\n\toverflow: hidden;\r\n\tmin-height: 216px;\r\n\t-webkit-background-clip: padding-box;\r\n\tbackground-clip: padding-box;\r\n\tmax-height: 300px;\r\n\tbox-sizing: border-box;\r\n\twidth: 100%;\r\n\tposition: relative;\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n}\r\n\r\n#cookiescript_cookietablewrap.cookiescript_hidden {\r\n\topacity: 0.0;\r\n\theight: 0;\r\n\tmin-height: 0;\r\n\tmax-height: 0;\r\n\tmargin: 0;\r\n}\r\n\r\n#cookiescript_reportwrap {\r\n\theight: 137px;\r\n\toverflow: auto;\r\n}\r\n\r\n#cookiescript_reportwrap > div {\r\n\ttransition: opacity 200ms 0ms, height 0ms 200ms;\r\n}\r\n\r\n.cookiescript_category_description {\r\n\tpadding: 7px 10px;\r\n\tfont-size: 11px;\r\n\ttext-align: left;\r\n\tfont-weight: normal;\r\n\tline-height: 1.5;\r\n\tcolor: #6f6f6f;\r\n\tmargin: 0;\r\n}\r\n\r\n.cookiescript_fullreport th {\r\n\tbackground: #F5F5F5;\r\n\tcolor: #4b4b4b;\r\n}\r\n\r\n#cookiescript_categories > div {\r\n\tcursor: pointer;\r\n\tpadding: 0 9px;\r\n\tfont-size: 11px;\r\n\tfont-weight: 600;\r\n\tbackground: #f5f5f5;\r\n\tcolor: #4b4b4b;\r\n\tline-height: 2;\r\n\tmargin: 3px 5px;\r\n\twhite-space: nowrap;\r\n}\r\n\r\n#cookiescript_maintabs > div {\r\n\tcursor: pointer;\r\n\twidth: 50%;\r\n\ttransition: all 300ms ease 0s;\r\n\ttext-transform: uppercase;\r\n\tfont-size: 12px;\r\n\ttext-align: center;\r\n\tline-height: 1.5;\r\n\tfont-weight: 500;\r\n\tcolor: #FEFEFE;\r\n\tpadding: 9px 0;\r\n\tposition: relative;\r\n}\r\n\r\n#cookiescript_maintabs .cookiescript_active {\r\n\tbackground: #fefefe;\r\n\tcolor: #015fa7;\r\n}\r\n\r\n#cookiescript_declarationwrap {\r\n\tbackground: #FEFEFE;\r\n\ttransition: opacity 200ms 0ms, height 0ms 200ms;\r\n}\r\n\r\n#cookiescript_categories .cookiescript_active {\r\n\tbackground: #015fa7;\r\n\tcolor: #FEFEFE;\r\n}\r\n\r\n#cookiescript_reportwrap::-webkit-scrollbar-track,\r\n#cookiescript_aboutwrap::-webkit-scrollbar-track {\r\n\tbackground-color: #DADADA;\r\n}\r\n\r\n#cookiescript_reportwrap::-webkit-scrollbar,\r\n#cookiescript_aboutwrap::-webkit-scrollbar {\r\n\twidth: 6px;\r\n\theight: 6px;\r\n}\r\n\r\n#cookiescript_reportwrap::-webkit-scrollbar-thumb,\r\n#cookiescript_aboutwrap::-webkit-scrollbar-thumb {\r\n\tbackground-color: #015fa7;\r\n}\r\n\r\n.cookiescript_fullreport {\r\n\tborder-collapse: collapse;\r\n\twidth: 100%;\r\n\t}\r\n\r\n.cookiescript_fullreport td:nth-child(1) {\r\n\tfont-weight: 600;\r\n}\r\n\r\n.cookiescript_fullreport td:nth-child(3), .cookiescript_fullreport th:nth-child(3) {\r\n\ttext-align: center;\r\n}\r\n\r\n.cookiescript_fullreport td, .cookiescript_fullreport th {\r\n\twhite-space: normal;\r\n\tpadding: 0 8px;\r\n\tfont-size: 11px;\r\n\tfont-weight: 600;\r\n\ttext-align: left;\r\n\tline-height: 3;\r\n\tmargin: 0;\r\n}\r\n\r\n.cookiescript_fullreport td {\r\n\tpadding: 7px 8px;\r\n\tline-height: 1.3;\r\n\tvertical-align: top;\r\n\tfont-weight: 400;\r\n\tborder-bottom: 1px solid #F1F1F1;\r\n\tborder-top: 0;\r\n\tborder-left: 0;\r\n\tborder-right: 0;\r\n\tcolor: #6f6f6f;\r\n\tbackground: transparent;\r\n}\r\n\r\n.cookiescript_fullreport td:last-child, .cookiescript_fullreport th:last-child {\r\n\tpadding-right: 18px;\r\n}\r\n\r\n.cookiescript_fullreport td:nth-child(1), .cookiescript_fullreport th:nth-child(1) {\r\n\tpadding-left: 18px;\r\n\tword-break: normal;\r\n}\r\n\r\n#cookiescript_aboutwrap {\r\n\tpadding: 7px 18px;\r\n\tfont-size: 12px;\r\n\ttext-align: left;\r\n\tfont-weight: normal;\r\n\tline-height: 1.5;\r\n\tbackground-color: #fefefe;\r\n\tbox-sizing: border-box;\r\n\tcolor: #6f6f6f;\r\n\ttransition: opacity 200ms 0ms;\r\n\toverflow: auto;\r\n\tflex-grow: 0;\r\n\theight: 180px;\r\n}\r\n\r\n#cookiescript_aboutwrap.cookiescript_hidden {\r\n\topacity: 0;\r\n\theight: 0;\r\n\toverflow: hidden;\r\n\tpadding: 0;\r\n}\r\n\r\n#cookiescript_declarationwrap.cookiescript_hidden {\r\n\topacity: 0;\r\n\theight: 0;\r\n\toverflow: hidden;\r\n}\r\n\r\n#cookiescript_tabscontent {\r\n\tbackground: #FEFEFE;\r\n\toverflow: hidden;\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n}\r\n\r\n#cookiescript_reportwrap .cookiescript_hidden {\r\n\topacity: 0;\r\n\theight: 0;\r\n\ttransition: opacity 200ms 0ms, height 0ms 200ms;\r\n\toverflow: hidden;\r\n}\r\n#cookiescript_reportdate{\r\n\tfont-size: 11px;\r\n\ttext-align: right;\r\n\topacity: 0.9;\r\n\tpadding: 0 10px;\r\n\tmargin: 0;\r\n}\r\n\r\n#cookiescript_injected.hascookiereport #cookiescript_copyright{\r\n\tdisplay: none;\r\n}\r\n\r\n\r\n@media only screen and (max-width: 414px) {\r\n\t.cookiescript_fullreport thead {\r\n\t\tdisplay: none;\r\n\t}\r\n\r\n\t.cookiescript_fullreport td {\r\n\t\tdisplay: flex;\r\n\t}\r\n\r\n\t.cookiescript_fullreport td::before {\r\n\t\tcontent: attr(label);\r\n\t\tfont-weight: bold;\r\n\t\twidth: 120px;\r\n\t\tmin-width: 120px;\r\n\t}\r\n\r\n\t.cookiescript_category_description,\r\n\t.cookiescript_fullreport td,\r\n\t.cookiescript_fullreport td:nth-child(1),\r\n\t.cookiescript_fullreport td:nth-child(3) {\r\n\t\tpadding: 7px 10px;\r\n\t\ttext-align: left;\r\n\t}\r\n\r\n\t.cookiescript_fullreport td:last-child {\r\n\t\tborder-bottom: none;\r\n\t}\r\n\r\n\t.cookiescript_fullreport tr:nth-child(even) {\r\n\t\tbackground: #f5f5f5;\r\n\t}\r\n\r\n.cookiescript_fullreport tr:nth-child(even) td {\r\n    border-bottom: 1px solid #FFF;\r\n\t}\r\n}\r\n\r\n\r\n@media screen and (min-width:0\\0) and (min-resolution: .001dpcm) {\r\n\t#cookiescript_maintabs > div{\r\n\t\tdisplay:block;\r\n\t\tfloat:left;\r\n\t}\r\n\t#cookiescript_categories > div{\r\n\t\tdisplay:inline-block;\r\n\t}\r\n\r\n}\r\n\r\n\r\n#cookiescript_categories > div {\r\n\tborder-radius: 20px;\r\n}\r\n#cookiescript_reportwrap::-webkit-scrollbar-track,\r\n#cookiescript_aboutwrap::-webkit-scrollbar-track {\r\n\tborder-radius: 6px;\r\n}\r\n#cookiescript_reportwrap::-webkit-scrollbar-thumb,\r\n#cookiescript_aboutwrap::-webkit-scrollbar-thumb {\r\n\tborder-radius: 5px;\r\n}\r\n#cookiescript_maintabs {\r\n\tborder-top-left-radius: 10px;\r\n\tborder-top-right-radius: 10px;\r\n}\r\n#cookiescript_tabscontent {\r\n\t\r\n\tborder-bottom-right-radius: 10px;\r\n\tborder-bottom-left-radius: 10px;\r\n}\r\n\r\n.mdc-checkbox{\r\n    box-sizing: content-box !important;\r\n}\r\n.mdc-checkbox__native-control {\r\n    z-index: 1;\r\n}\r\n.mdc-checkbox .mdc-checkbox__native-control:focus~.mdc-checkbox__background::before, .mdc-checkbox .mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background::before {\r\n    background-color: var(--mdc-theme-secondary, #FFFFFF);\r\n}\r\n\r\n.mdc-checkbox{display:inline-block;position:relative;flex:0 0 18px;box-sizing:content-box;width:18px;height:18px;line-height:0;white-space:nowrap;cursor:pointer;vertical-align:bottom;padding:11px}.mdc-checkbox .mdc-checkbox__native-control:checked~.mdc-checkbox__background::before,.mdc-checkbox .mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background::before{background-color:#FFFFFF}@supports not (-ms-ime-align:auto){.mdc-checkbox .mdc-checkbox__native-control:checked~.mdc-checkbox__background::before,.mdc-checkbox .mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background::before{background-color:var(--mdc-theme-secondary, #FFFFFF)}}.mdc-checkbox .mdc-checkbox__background{top:11px;left:11px}.mdc-checkbox .mdc-checkbox__background::before{top:-13px;left:-13px;width:40px;height:40px}.mdc-checkbox .mdc-checkbox__native-control{top:0;right:0;left:0;width:40px;height:40px}.mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background{border-color:#FFFFFF;background-color:transparent}.mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,.mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background{border-color:#FFFFFF;background-color:#FFFFFF}.mdc-checkbox__native-control[disabled]:not(:checked):not(:indeterminate)~.mdc-checkbox__background{border-color:rgba(255,255,255,0.26);background-color:transparent}.mdc-checkbox__native-control[disabled]:checked~.mdc-checkbox__background,.mdc-checkbox__native-control[disabled]:indeterminate~.mdc-checkbox__background{border-color:transparent;background-color:rgba(255,255,255,0.26)}.mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:#2a88cf}.mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:#2a88cf}.mdc-checkbox__background{display:inline-flex;position:absolute;align-items:center;justify-content:center;box-sizing:border-box;width:18px;height:18px;border:2px solid #FFFFFF;border-radius:2px;background-color:transparent;pointer-events:none;will-change:background-color,border-color;transition:background-color 90ms 0s cubic-bezier(.4,0,.6,1),border-color 90ms 0s cubic-bezier(.4,0,.6,1)}.mdc-checkbox__background .mdc-checkbox__background::before{background-color:#000}@supports not (-ms-ime-align:auto){.mdc-checkbox__background .mdc-checkbox__background::before{background-color:var(--mdc-theme-on-surface,#000)}}.mdc-checkbox__checkmark{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;opacity:0;transition:opacity 180ms 0s cubic-bezier(.4,0,.6,1)}.mdc-checkbox__checkmark-path{transition:stroke-dashoffset 180ms 0s cubic-bezier(.4,0,.6,1);stroke:currentColor;stroke-width:3.12px;stroke-dashoffset:29.7833385;stroke-dasharray:29.7833385}.mdc-checkbox__native-control:checked~.mdc-checkbox__background,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background{transition:border-color 90ms 0s cubic-bezier(0,0,.2,1),background-color 90ms 0s cubic-bezier(0,0,.2,1)}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark-path,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark-path{stroke-dashoffset:0}.mdc-checkbox__background::before{position:absolute;-webkit-transform:scale(0,0);transform:scale(0,0);border-radius:50%;opacity:0;pointer-events:none;content:\"\";will-change:opacity,transform;transition:opacity 90ms 0s cubic-bezier(.4,0,.6,1),-webkit-transform 90ms 0s cubic-bezier(.4,0,.6,1);transition:opacity 90ms 0s cubic-bezier(.4,0,.6,1),transform 90ms 0s cubic-bezier(.4,0,.6,1);transition:opacity 90ms 0s cubic-bezier(.4,0,.6,1),transform 90ms 0s cubic-bezier(.4,0,.6,1),-webkit-transform 90ms 0s cubic-bezier(.4,0,.6,1)}.mdc-checkbox__native-control:focus~.mdc-checkbox__background::before{-webkit-transform:scale(1);transform:scale(1);opacity:.12;transition:opacity 80ms 0s cubic-bezier(0,0,.2,1),-webkit-transform 80ms 0s cubic-bezier(0,0,.2,1);transition:opacity 80ms 0s cubic-bezier(0,0,.2,1),transform 80ms 0s cubic-bezier(0,0,.2,1);transition:opacity 80ms 0s cubic-bezier(0,0,.2,1),transform 80ms 0s cubic-bezier(0,0,.2,1),-webkit-transform 80ms 0s cubic-bezier(0,0,.2,1)}.mdc-checkbox__native-control{position:absolute;margin:0;padding:0;opacity:0;cursor:inherit}.mdc-checkbox__native-control:disabled{cursor:default;pointer-events:none}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark{transition:opacity 180ms 0s cubic-bezier(0,0,.2,1),-webkit-transform 180ms 0s cubic-bezier(0,0,.2,1);transition:opacity 180ms 0s cubic-bezier(0,0,.2,1),transform 180ms 0s cubic-bezier(0,0,.2,1);transition:opacity 180ms 0s cubic-bezier(0,0,.2,1),transform 180ms 0s cubic-bezier(0,0,.2,1),-webkit-transform 180ms 0s cubic-bezier(0,0,.2,1);opacity:1}.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark{-webkit-transform:rotate(45deg);transform:rotate(45deg);opacity:0;transition:opacity 90ms 0s cubic-bezier(.4,0,.6,1),-webkit-transform 90ms 0s cubic-bezier(.4,0,.6,1);transition:opacity 90ms 0s cubic-bezier(.4,0,.6,1),transform 90ms 0s cubic-bezier(.4,0,.6,1);transition:opacity 90ms 0s cubic-bezier(.4,0,.6,1),transform 90ms 0s cubic-bezier(.4,0,.6,1),-webkit-transform 90ms 0s cubic-bezier(.4,0,.6,1)}.mdc-checkbox{-webkit-tap-highlight-color:transparent}\r\n#cookiescript_injected {\r\nbottom: 0;\r\n    left: 0;\r\n    right: 0;\r\n    position: fixed;\r\n    padding: 15px 20px 10px 20px;\r\n    width: 100%;\r\n    display: flex;\r\n    flex-direction: column;\r\n    text-align: center;\r\n    margin: 0;\r\n    align-items: center;\r\n    max-height: 85%;\r\n    overflow-y: auto;\r\n}\r\n#cookiescript_copyright {\r\n    line-height: 1;\r\n    text-align: center;\r\n}\r\n#cookiescript_buttons {\r\n    justify-content: center;\r\n    flex-wrap: wrap;\r\n    margin: 0 0 5px 0;\r\n}\r\n#cookiescript_manage_wrap {\r\n    margin: 0 0 14px 0;\r\n}\r\n#cookiescript_header {\r\n    padding: 14px 0 12px;\r\n    margin: 0;\r\n    text-align: center;\r\n}\r\n#cookiescript_checkboxs {\r\n    margin: -5px auto 8px auto;\r\n    display: flex;\r\n    flex-wrap: wrap;\r\n}\r\n.cookiescript_checkbox {\r\n    margin: 0;\r\n}\r\n#cookiescript_accept, #cookiescript_reject, #cookiescript_save {\r\n    margin: 5px 7px;\r\n    flex-shrink: 1;\r\n    padding: 0 17px;\r\n    white-space: normal;\r\n}\r\n#cookiescript_description {\r\n    margin: 0 auto 8px;\r\n    text-align: center;\r\n    max-width: 600px;\r\n}\r\n\r\n.cookiescript_checkbox_label{\r\n    padding: 0;\r\n    margin: 0 10px 0 -2px;\r\n}\r\n#cookiescript_cookietablewrap {\r\n    transition: height 300ms 0ms, min-height 300ms 0ms, max-height 300ms 0ms, opacity 200ms 300ms;\r\n}\r\n#cookiescript_cookietablewrap.cookiescript_hidden {\r\n    transition: height 300ms 0ms, min-height 300ms 0ms, max-height 300ms 0ms, opacity 200ms 0ms;\r\n}\r\n@media only screen and (max-width: 414px) {\r\n    #cookiescript_injected{\r\n    bottom: 0;\r\n        left: 0;\r\n        width: 100%;\r\n        padding: 15px;\r\n        text-align:left;\r\n    }\r\n    #cookiescript_description{\r\n        text-align: left;\r\n    }\r\n    #cookiescript_description,\r\n    #cookiescript_buttons,\r\n    #cookiescript_manage_wrap,\r\n    #cookiescript_checkboxs\r\n    {\r\n        margin-bottom: 8px;\r\n    }\r\n    #cookiescript_header{\r\n        padding-top:5px;\r\n    }\r\n    #cookiescript_buttons {\r\n        flex-wrap: wrap;\r\n    }\r\n    #cookiescript_accept, #cookiescript_reject, #cookiescript_save {\r\n\t\twidth:100%;\r\n\t}\r\n\t#cookiescript_injected {\r\n\t\tmax-height: 100%;\r\n\t}\r\n}\r\n\r\n#cookiescript_accept, #cookiescript_reject, #cookiescript_save {\r\n\tborder-radius: 20px;\r\n}\r\n\/*IE 9 fixes*\/\r\n@media screen and (min-width:0\\0) and (min-resolution: .001dpcm) {\r\n\t.cookiescript_checkbox{\r\n\t\tdisplay: inline-block;\r\n\t}\r\n}\r\n@media screen and (min-width:0\\0) and (min-resolution: .001dpcm) and (min-width: 1140px) {\r\n\t#cookiescript_cookietablewrap {\r\n\t\tleft: calc(50% - 570px);\r\n\t}\r\n}\r\n\n    <\/style>\n  ";
  var html = "<div id=\"cookiescript_injected\">\n    <div id=\"cookiescript_header\" data-cs-i18n-text=\"[]\">\n    This website uses cookies  <\/div>\n  <div id=\"cookiescript_description\">\n    <span data-cs-i18n-text=\"[]\" data-cs-i18n-read=\"Site-ul nostru folose\u0219te modulele cookie pentru a \u00eembun\u0103t\u0103\u021bi experien\u021ba de utilizare, a personaliza con\u021binutul, pentru a oferi func\u021bii pentru re\u021belele sociale \u0219i pentru a analiza traficul. Face\u021bi clic mai jos pentru a fi de acord cu utilizarea acestei tehnologii\">\n      Site-ul nostru folose\u0219te modulele cookie pentru a \u00eembun\u0103t\u0103\u021bi experien\u021ba de utilizare, a personaliza con\u021binutul, pentru a oferi func\u021bii pentru re\u021belele sociale \u0219i pentru a analiza traficul. Face\u021bi clic mai jos pentru a fi de acord cu utilizarea acestei tehnologii    <\/span>\n\n    \n      \n      <a\n        id=\"cookiescript_readmore\"\n        data-cs-i18n-text=\"[]\"\n        data-cs-i18n-url=\"[]\"\n        href=\"https:\/\/kubex.ro\/politica-cookie.html\"\n        target=\"_blank\"\n      >\n        Citeste mai mult      <\/a>\n\n      <\/div>\n  <div id=\"cookiescript_checkboxs\">\n          \n            <div class=\"cookiescript_checkbox\">\n        <div class=\"mdc-checkbox\">\n          <input\n            id=\"cookiescript_category_strict\"\n            data-cookiescript=\"checkbox-input\"\n            type=\"checkbox\"\n            class=\"mdc-checkbox__native-control cookiescript_checkbox_input\"\n            value=\"strict\"\n            disabled checked          \/>\n          <div class=\"mdc-checkbox__background\">\n            <svg class=\"mdc-checkbox__checkmark\" viewBox=\"0 0 24 24\">\n              <path class=\"mdc-checkbox__checkmark-path\" fill=\"none\" d=\"M1.73,12.91 8.1,19.28 22.79,4.59\"\/>\n            <\/svg>\n          <\/div>\n        <\/div>\n        <label class=\"cookiescript_checkbox_label\" for=\"cookiescript_category_strict\">\n          <span\n            class=\"cookiescript_checkbox_text\"\n            data-cs-i18n-text=\"[]\"\n          >\n            Strict necesar          <\/span>\n        <\/label>\n      <\/div>\n\n          \n            <div class=\"cookiescript_checkbox\">\n        <div class=\"mdc-checkbox\">\n          <input\n            id=\"cookiescript_category_performance\"\n            data-cookiescript=\"checkbox-input\"\n            type=\"checkbox\"\n            class=\"mdc-checkbox__native-control cookiescript_checkbox_input\"\n            value=\"performance\"\n                      \/>\n          <div class=\"mdc-checkbox__background\">\n            <svg class=\"mdc-checkbox__checkmark\" viewBox=\"0 0 24 24\">\n              <path class=\"mdc-checkbox__checkmark-path\" fill=\"none\" d=\"M1.73,12.91 8.1,19.28 22.79,4.59\"\/>\n            <\/svg>\n          <\/div>\n        <\/div>\n        <label class=\"cookiescript_checkbox_label\" for=\"cookiescript_category_performance\">\n          <span\n            class=\"cookiescript_checkbox_text\"\n            data-cs-i18n-text=\"[]\"\n          >\n            Performanta          <\/span>\n        <\/label>\n      <\/div>\n\n          \n            <div class=\"cookiescript_checkbox\">\n        <div class=\"mdc-checkbox\">\n          <input\n            id=\"cookiescript_category_targeting\"\n            data-cookiescript=\"checkbox-input\"\n            type=\"checkbox\"\n            class=\"mdc-checkbox__native-control cookiescript_checkbox_input\"\n            value=\"targeting\"\n                      \/>\n          <div class=\"mdc-checkbox__background\">\n            <svg class=\"mdc-checkbox__checkmark\" viewBox=\"0 0 24 24\">\n              <path class=\"mdc-checkbox__checkmark-path\" fill=\"none\" d=\"M1.73,12.91 8.1,19.28 22.79,4.59\"\/>\n            <\/svg>\n          <\/div>\n        <\/div>\n        <label class=\"cookiescript_checkbox_label\" for=\"cookiescript_category_targeting\">\n          <span\n            class=\"cookiescript_checkbox_text\"\n            data-cs-i18n-text=\"[]\"\n          >\n            Targetare          <\/span>\n        <\/label>\n      <\/div>\n\n          \n            <div class=\"cookiescript_checkbox\">\n        <div class=\"mdc-checkbox\">\n          <input\n            id=\"cookiescript_category_functionality\"\n            data-cookiescript=\"checkbox-input\"\n            type=\"checkbox\"\n            class=\"mdc-checkbox__native-control cookiescript_checkbox_input\"\n            value=\"functionality\"\n                      \/>\n          <div class=\"mdc-checkbox__background\">\n            <svg class=\"mdc-checkbox__checkmark\" viewBox=\"0 0 24 24\">\n              <path class=\"mdc-checkbox__checkmark-path\" fill=\"none\" d=\"M1.73,12.91 8.1,19.28 22.79,4.59\"\/>\n            <\/svg>\n          <\/div>\n        <\/div>\n        <label class=\"cookiescript_checkbox_label\" for=\"cookiescript_category_functionality\">\n          <span\n            class=\"cookiescript_checkbox_text\"\n            data-cs-i18n-text=\"[]\"\n          >\n            Functionalitate          <\/span>\n        <\/label>\n      <\/div>\n\n            <\/div>\n  <div id=\"cookiescript_buttons\">\n          <div id=\"cookiescript_save\" tabindex=\"0\" role=\"button\" data-cs-i18n-text=\"[]\">\n        Salveaza si inchide      <\/div>\n              <div id=\"cookiescript_accept\" tabindex=\"0\" role=\"button\" data-cs-i18n-text=\"[]\">\n        Accepta      <\/div>\n              <div id=\"cookiescript_reject\" tabindex=\"0\" role=\"button\" data-cs-i18n-text=\"[]\">\n        Respinge      <\/div>\n      <\/div>\n  <div id=\"cookiescript_manage_wrap\" tabindex=\"0\" role=\"button\">\n    <div id=\"cookiescript_manage\">\n      <svg id=\"cookiescript_manageicon\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" viewBox=\"0 0 9.62 9.57\">\n        <g id=\"Layer_2\">\n          <g id=\"Layer_1-2\">\n            <path class=\"cookiescript_gear\" d=\"M9.46,6.06l-1.1-.78c0-.16.06-.31.06-.47a1.27,1.27,0,0,0-.06-.47L9.57,3.4l-1.15-2L7,1.93a2.74,2.74,0,0,0-.83-.47L6,0H3.61L3.35,1.46a7.14,7.14,0,0,0-.79.47L1.15,1.36,0,3.4l1.15.94c0,.16,0,.31,0,.47a1.51,1.51,0,0,0,0,.47l-1,.78A.75.75,0,0,0,0,6.17l1.15,2,1.41-.58a2.49,2.49,0,0,0,.84.47l.21,1.47H6a.53.53,0,0,1,0-.21L6.22,8.1a4,4,0,0,0,.84-.47l1.41.58,1.15-2A.75.75,0,0,0,9.46,6.06Zm-4.65.19A1.47,1.47,0,1,1,6.28,4.78,1.47,1.47,0,0,1,4.81,6.25Z\"><\/path>\n          <\/g>\n        <\/g>\n      <\/svg>\n      <span data-cs-show-title=\"cookie-script\" data-cs-i18n-text=\"[]\">\n        Mai multe detalii      <\/span>\n      <span style=\"display: none\" data-cs-hide-title=\"cookie-script\" data-cs-i18n-text=\"[]\">\n        Ascunde detalii      <\/span>\n    <\/div>\n  <\/div>\n\t<div class=\"cookiescript_hidden\" id=\"cookiescript_cookietablewrap\">\n\t\t\n    <div id=\"cookiescript_maintabs\" data-cs-maintabs=\"cookiescript\">\n      <div id=\"cookiescript_declaration\" class=\"cookiescript_active\" data-cs-maintab=\"declaration\" data-cs-i18n-text=\"[]\">\n        Cookie declaration      <\/div>\n      <div id=\"cookiescript_aboutcookies\" data-cs-maintab=\"aboutcookies\" data-cs-i18n-text=\"[]\">\n        Despre cookie-uri      <\/div>\n    <\/div>\n    <div id=\"cookiescript_tabscontent\">\n      <div id=\"cookiescript_declarationwrap\" data-cs-maintab-content=\"declaration\">\n        <div id=\"cookiescript_categories\" data-cs-tabs=\"cookiescript\">\n                      <div\n              class=\"cookiescript_category_strict  cookiescript_active\"\n              data-cs-tab=\"strict\"\n              data-cs-i18n-text=\"[]\"\n            >\n              Strict necesar            <\/div>\n                      <div\n              class=\"cookiescript_category_performance  \"\n              data-cs-tab=\"performance\"\n              data-cs-i18n-text=\"[]\"\n            >\n              Performanta            <\/div>\n                      <div\n              class=\"cookiescript_category_targeting  \"\n              data-cs-tab=\"targeting\"\n              data-cs-i18n-text=\"[]\"\n            >\n              Targetare            <\/div>\n                      <div\n              class=\"cookiescript_category_functionality  \"\n              data-cs-tab=\"functionality\"\n              data-cs-i18n-text=\"[]\"\n            >\n              Functionalitate            <\/div>\n                  <\/div>\n        <div id=\"cookiescript_reportwrap\">\n                                  <div\n              class=\"cookiescript_report_strict \"\n              data-cs-tab-content=\"strict\"\n            >\n              <div class=\"cookiescript_category_description\" data-cs-i18n-text=\"[]\">\n                Cookie-urile strict necesare permit func\u021bionalitatea principal\u0103 a site-ului web, cum ar fi autentificarea utilizatorului \u0219i gestionarea contului. Site-ul nu poate fi utilizat \u00een mod corespunz\u0103tor f\u0103r\u0103 cookie-uri strict necesare.              <\/div>\n              <div class=\"cookiescript_tablewrap\">\n                <table class=\"cookiescript_fullreport\" data-cs-table-report=\"cookiescript\">\n                  <thead>\n                  <tr>\n                    <th data-cs-i18n-text=\"[]\">\n                      Nume                    <\/th>\n                    <th data-cs-i18n-text=\"[]\">\n                      Domeniu                    <\/th>\n                    <th data-cs-i18n-text=\"[]\">\n                      Expirare                    <\/th>\n                    <th data-cs-i18n-text=\"[]\">\n                      Descriere                    <\/th>\n                  <\/tr>\n                  <\/thead>\n                  <tbody>\n                                      <tr>\n                      <td>productsToDisplay<\/td>\n                      <td>kubex.ro<\/td>\n                      <td data-cs-i18n-text=\"{&quot;bg&quot;:&quot;1 \\u0434\\u0435\\u043d&quot;,&quot;hr&quot;:&quot;1 dan&quot;,&quot;cs&quot;:&quot;1 den&quot;,&quot;da&quot;:&quot;1 dag&quot;,&quot;nl&quot;:&quot;1 dag&quot;,&quot;et&quot;:&quot;1 p\\u00e4ev&quot;,&quot;fi&quot;:&quot;1 p\\u00e4iv\\u00e4&quot;,&quot;fr&quot;:&quot;1 jour&quot;,&quot;de&quot;:&quot;1 Tag&quot;,&quot;el&quot;:&quot;1 \\u03bc\\u03ad\\u03c1\\u03b1&quot;,&quot;hu&quot;:&quot;1 nap&quot;,&quot;ga&quot;:&quot;1 l\\u00e1&quot;,&quot;it&quot;:&quot;1 giorno&quot;,&quot;lv&quot;:&quot;1 dienas&quot;,&quot;lt&quot;:&quot;1 diena&quot;,&quot;ru&quot;:&quot;1 \\u0434\\u0435\\u043d\\u044c&quot;,&quot;mt&quot;:&quot;\\u0121urnata&quot;,&quot;pl&quot;:&quot;1 dzie\\u0144&quot;,&quot;pt&quot;:&quot;1 dia&quot;,&quot;ro&quot;:&quot;1 zi&quot;,&quot;sk&quot;:&quot;de\\u0148&quot;,&quot;sl&quot;:&quot;1 dan&quot;,&quot;es&quot;:&quot;1 d\\u00eda&quot;,&quot;sv&quot;:&quot;1 dag&quot;,&quot;en&quot;:&quot;1 day&quot;}\">\n                        1 day                      <\/td>\n                      <td data-cs-i18n-text=\"\">\n                                              <\/td>\n                    <\/tr>\n                                      <tr>\n                      <td>ASPSESSIONIDQESRTQDS<\/td>\n                      <td>secure2.plationline.ro<\/td>\n                      <td data-cs-i18n-text=\"{&quot;bg&quot;:&quot;Session&quot;,&quot;hr&quot;:&quot;Session&quot;,&quot;cs&quot;:&quot;Session&quot;,&quot;da&quot;:&quot;Session&quot;,&quot;nl&quot;:&quot;Session&quot;,&quot;et&quot;:&quot;Session&quot;,&quot;fi&quot;:&quot;Session&quot;,&quot;fr&quot;:&quot;Session&quot;,&quot;de&quot;:&quot;Session&quot;,&quot;el&quot;:&quot;Session&quot;,&quot;hu&quot;:&quot;Session&quot;,&quot;ga&quot;:&quot;Session&quot;,&quot;it&quot;:&quot;Session&quot;,&quot;lv&quot;:&quot;Session&quot;,&quot;lt&quot;:&quot;Session&quot;,&quot;ru&quot;:&quot;Session&quot;,&quot;mt&quot;:&quot;Session&quot;,&quot;pl&quot;:&quot;Session&quot;,&quot;pt&quot;:&quot;Session&quot;,&quot;ro&quot;:&quot;Session&quot;,&quot;sk&quot;:&quot;Session&quot;,&quot;sl&quot;:&quot;Session&quot;,&quot;es&quot;:&quot;Session&quot;,&quot;sv&quot;:&quot;Session&quot;,&quot;en&quot;:&quot;Session&quot;}\">\n                        Session                      <\/td>\n                      <td data-cs-i18n-text=\"\">\n                                              <\/td>\n                    <\/tr>\n                                      <tr>\n                      <td>tawkUUID<\/td>\n                      <td>va.tawk.to<\/td>\n                      <td data-cs-i18n-text=\"{&quot;bg&quot;:&quot;6 \\u043c\\u0435\\u0441\\u0435\\u0446\\u0430&quot;,&quot;hr&quot;:&quot;6 mjeseci&quot;,&quot;cs&quot;:&quot;6 m\\u011bs\\u00edc\\u016f&quot;,&quot;da&quot;:&quot;6 m\\u00e5neder&quot;,&quot;nl&quot;:&quot;6 maanden&quot;,&quot;et&quot;:&quot;6 kuud&quot;,&quot;fi&quot;:&quot;6 kuukautta&quot;,&quot;fr&quot;:&quot;6 mois&quot;,&quot;de&quot;:&quot;6 Monate&quot;,&quot;el&quot;:&quot;6 \\u03bc\\u03ae\\u03bd\\u03b5\\u03c2&quot;,&quot;hu&quot;:&quot;6 h\\u00f3nap&quot;,&quot;ga&quot;:&quot;6 m\\u00ed&quot;,&quot;it&quot;:&quot;6 mesi&quot;,&quot;lv&quot;:&quot;6 m\\u0113ne\\u0161iem&quot;,&quot;lt&quot;:&quot;6 m\\u0117nesiai&quot;,&quot;ru&quot;:&quot;6 \\u043c\\u0435\\u0441\\u044f\\u0446\\u0435\\u0432&quot;,&quot;mt&quot;:&quot;6 xhur&quot;,&quot;pl&quot;:&quot;6 miesi\\u0119cy&quot;,&quot;pt&quot;:&quot;6 meses&quot;,&quot;ro&quot;:&quot;6 luni&quot;,&quot;sk&quot;:&quot;6 mesiacov&quot;,&quot;sl&quot;:&quot;6 mesecev&quot;,&quot;es&quot;:&quot;6 meses&quot;,&quot;sv&quot;:&quot;6 m\\u00e5nader&quot;,&quot;en&quot;:&quot;6 months&quot;}\">\n                        6 months                      <\/td>\n                      <td data-cs-i18n-text=\"\">\n                                              <\/td>\n                    <\/tr>\n                                      <tr>\n                      <td>TawkConnectionTime<\/td>\n                      <td>kubex.ro<\/td>\n                      <td data-cs-i18n-text=\"{&quot;bg&quot;:&quot;Session&quot;,&quot;hr&quot;:&quot;Session&quot;,&quot;cs&quot;:&quot;Session&quot;,&quot;da&quot;:&quot;Session&quot;,&quot;nl&quot;:&quot;Session&quot;,&quot;et&quot;:&quot;Session&quot;,&quot;fi&quot;:&quot;Session&quot;,&quot;fr&quot;:&quot;Session&quot;,&quot;de&quot;:&quot;Session&quot;,&quot;el&quot;:&quot;Session&quot;,&quot;hu&quot;:&quot;Session&quot;,&quot;ga&quot;:&quot;Session&quot;,&quot;it&quot;:&quot;Session&quot;,&quot;lv&quot;:&quot;Session&quot;,&quot;lt&quot;:&quot;Session&quot;,&quot;ru&quot;:&quot;Session&quot;,&quot;mt&quot;:&quot;Session&quot;,&quot;pl&quot;:&quot;Session&quot;,&quot;pt&quot;:&quot;Session&quot;,&quot;ro&quot;:&quot;Session&quot;,&quot;sk&quot;:&quot;Session&quot;,&quot;sl&quot;:&quot;Session&quot;,&quot;es&quot;:&quot;Session&quot;,&quot;sv&quot;:&quot;Session&quot;,&quot;en&quot;:&quot;Session&quot;}\">\n                        Session                      <\/td>\n                      <td data-cs-i18n-text=\"\">\n                                              <\/td>\n                    <\/tr>\n                                      <tr>\n                      <td>productsToDisplay<\/td>\n                      <td>www.kubex.ro<\/td>\n                      <td data-cs-i18n-text=\"{&quot;bg&quot;:&quot;1 \\u0434\\u0435\\u043d&quot;,&quot;hr&quot;:&quot;1 dan&quot;,&quot;cs&quot;:&quot;1 den&quot;,&quot;da&quot;:&quot;1 dag&quot;,&quot;nl&quot;:&quot;1 dag&quot;,&quot;et&quot;:&quot;1 p\\u00e4ev&quot;,&quot;fi&quot;:&quot;1 p\\u00e4iv\\u00e4&quot;,&quot;fr&quot;:&quot;1 jour&quot;,&quot;de&quot;:&quot;1 Tag&quot;,&quot;el&quot;:&quot;1 \\u03bc\\u03ad\\u03c1\\u03b1&quot;,&quot;hu&quot;:&quot;1 nap&quot;,&quot;ga&quot;:&quot;1 l\\u00e1&quot;,&quot;it&quot;:&quot;1 giorno&quot;,&quot;lv&quot;:&quot;1 dienas&quot;,&quot;lt&quot;:&quot;1 diena&quot;,&quot;ru&quot;:&quot;1 \\u0434\\u0435\\u043d\\u044c&quot;,&quot;mt&quot;:&quot;\\u0121urnata&quot;,&quot;pl&quot;:&quot;1 dzie\\u0144&quot;,&quot;pt&quot;:&quot;1 dia&quot;,&quot;ro&quot;:&quot;1 zi&quot;,&quot;sk&quot;:&quot;de\\u0148&quot;,&quot;sl&quot;:&quot;1 dan&quot;,&quot;es&quot;:&quot;1 d\\u00eda&quot;,&quot;sv&quot;:&quot;1 dag&quot;,&quot;en&quot;:&quot;1 day&quot;}\">\n                        1 day                      <\/td>\n                      <td data-cs-i18n-text=\"\">\n                                              <\/td>\n                    <\/tr>\n                                      <tr>\n                      <td>TawkConnectionTime<\/td>\n                      <td>www.kubex.ro<\/td>\n                      <td data-cs-i18n-text=\"{&quot;bg&quot;:&quot;Session&quot;,&quot;hr&quot;:&quot;Session&quot;,&quot;cs&quot;:&quot;Session&quot;,&quot;da&quot;:&quot;Session&quot;,&quot;nl&quot;:&quot;Session&quot;,&quot;et&quot;:&quot;Session&quot;,&quot;fi&quot;:&quot;Session&quot;,&quot;fr&quot;:&quot;Session&quot;,&quot;de&quot;:&quot;Session&quot;,&quot;el&quot;:&quot;Session&quot;,&quot;hu&quot;:&quot;Session&quot;,&quot;ga&quot;:&quot;Session&quot;,&quot;it&quot;:&quot;Session&quot;,&quot;lv&quot;:&quot;Session&quot;,&quot;lt&quot;:&quot;Session&quot;,&quot;ru&quot;:&quot;Session&quot;,&quot;mt&quot;:&quot;Session&quot;,&quot;pl&quot;:&quot;Session&quot;,&quot;pt&quot;:&quot;Session&quot;,&quot;ro&quot;:&quot;Session&quot;,&quot;sk&quot;:&quot;Session&quot;,&quot;sl&quot;:&quot;Session&quot;,&quot;es&quot;:&quot;Session&quot;,&quot;sv&quot;:&quot;Session&quot;,&quot;en&quot;:&quot;Session&quot;}\">\n                        Session                      <\/td>\n                      <td data-cs-i18n-text=\"\">\n                                              <\/td>\n                    <\/tr>\n                                    <\/tbody>\n                <\/table>\n              <\/div>\n            <\/div>\n                                  <div\n              class=\"cookiescript_report_performance cookiescript_hidden\"\n              data-cs-tab-content=\"performance\"\n            >\n              <div class=\"cookiescript_category_description\" data-cs-i18n-text=\"[]\">\n                Cookie-urile performante sunt utilizate pentru a vedea cum utilizatorii viziteaz\u0103 site-ul, de ex. cookie-uri de analiz\u0103. Aceste cookie-uri nu pot fi utilizate pentru a identifica direct un anumit vizitator.              <\/div>\n              <div class=\"cookiescript_tablewrap\">\n                <table class=\"cookiescript_fullreport\" data-cs-table-report=\"cookiescript\">\n                  <thead>\n                  <tr>\n                    <th data-cs-i18n-text=\"[]\">\n                      Nume                    <\/th>\n                    <th data-cs-i18n-text=\"[]\">\n                      Domeniu                    <\/th>\n                    <th data-cs-i18n-text=\"[]\">\n                      Expirare                    <\/th>\n                    <th data-cs-i18n-text=\"[]\">\n                      Descriere                    <\/th>\n                  <\/tr>\n                  <\/thead>\n                  <tbody>\n                                      <tr>\n                      <td>_ga<\/td>\n                      <td>.kubex.ro<\/td>\n                      <td data-cs-i18n-text=\"{&quot;bg&quot;:&quot;2 \\u0433\\u043e\\u0434\\u0438\\u043d\\u0438&quot;,&quot;hr&quot;:&quot;2 godine&quot;,&quot;cs&quot;:&quot;2 roky&quot;,&quot;da&quot;:&quot;2 \\u00e5r&quot;,&quot;nl&quot;:&quot;2 jaar&quot;,&quot;et&quot;:&quot;2 aastat&quot;,&quot;fi&quot;:&quot;2 vuotta&quot;,&quot;fr&quot;:&quot;2 ans&quot;,&quot;de&quot;:&quot;2 Jahre&quot;,&quot;el&quot;:&quot;2 \\u03c7\\u03c1\\u03cc\\u03bd\\u03b9\\u03b1&quot;,&quot;hu&quot;:&quot;2 \\u00e9v&quot;,&quot;ga&quot;:&quot;2 bliain&quot;,&quot;it&quot;:&quot;2 anni&quot;,&quot;lv&quot;:&quot;2 gadiem&quot;,&quot;lt&quot;:&quot;2 metai&quot;,&quot;ru&quot;:&quot;2 \\u0433\\u043e\\u0434\\u0430&quot;,&quot;mt&quot;:&quot;2 sni&quot;,&quot;pl&quot;:&quot;2 lata&quot;,&quot;pt&quot;:&quot;2 anos&quot;,&quot;ro&quot;:&quot;2 ani&quot;,&quot;sk&quot;:&quot;2 roky&quot;,&quot;sl&quot;:&quot;2 leti&quot;,&quot;es&quot;:&quot;2 a\\u00f1os&quot;,&quot;sv&quot;:&quot;2 \\u00e5r&quot;,&quot;en&quot;:&quot;2 years&quot;}\">\n                        2 years                      <\/td>\n                      <td data-cs-i18n-text=\"\">\n                        This cookie name is associated with Google Universal Analytics - which is a significant update to Google's more commonly used analytics service. This cookie is used to distinguish unique users by assigning a randomly generated number as a client identifier. It is included in each page request in a site and used to calculate visitor, session and campaign data for the sites analytics reports. By default it is set to expire after 2 years, although this is customisable by website owners.                      <\/td>\n                    <\/tr>\n                                      <tr>\n                      <td>_gid<\/td>\n                      <td>.kubex.ro<\/td>\n                      <td data-cs-i18n-text=\"{&quot;bg&quot;:&quot;1 \\u0434\\u0435\\u043d&quot;,&quot;hr&quot;:&quot;1 dan&quot;,&quot;cs&quot;:&quot;1 den&quot;,&quot;da&quot;:&quot;1 dag&quot;,&quot;nl&quot;:&quot;1 dag&quot;,&quot;et&quot;:&quot;1 p\\u00e4ev&quot;,&quot;fi&quot;:&quot;1 p\\u00e4iv\\u00e4&quot;,&quot;fr&quot;:&quot;1 jour&quot;,&quot;de&quot;:&quot;1 Tag&quot;,&quot;el&quot;:&quot;1 \\u03bc\\u03ad\\u03c1\\u03b1&quot;,&quot;hu&quot;:&quot;1 nap&quot;,&quot;ga&quot;:&quot;1 l\\u00e1&quot;,&quot;it&quot;:&quot;1 giorno&quot;,&quot;lv&quot;:&quot;1 dienas&quot;,&quot;lt&quot;:&quot;1 diena&quot;,&quot;ru&quot;:&quot;1 \\u0434\\u0435\\u043d\\u044c&quot;,&quot;mt&quot;:&quot;\\u0121urnata&quot;,&quot;pl&quot;:&quot;1 dzie\\u0144&quot;,&quot;pt&quot;:&quot;1 dia&quot;,&quot;ro&quot;:&quot;1 zi&quot;,&quot;sk&quot;:&quot;de\\u0148&quot;,&quot;sl&quot;:&quot;1 dan&quot;,&quot;es&quot;:&quot;1 d\\u00eda&quot;,&quot;sv&quot;:&quot;1 dag&quot;,&quot;en&quot;:&quot;1 day&quot;}\">\n                        1 day                      <\/td>\n                      <td data-cs-i18n-text=\"\">\n                        This cookie name is associated with Google Analytics. It is used by gtag.js and analytics.js scripts and according to Google Analytics this cookie is used to distinguish users.                      <\/td>\n                    <\/tr>\n                                      <tr>\n                      <td>_gat<\/td>\n                      <td>.kubex.ro<\/td>\n                      <td data-cs-i18n-text=\"{&quot;bg&quot;:&quot;1 \\u043c\\u0438\\u043d\\u0443\\u0442\\u0430&quot;,&quot;hr&quot;:&quot;1 minutu&quot;,&quot;cs&quot;:&quot;1 minuta&quot;,&quot;da&quot;:&quot;1 minut&quot;,&quot;nl&quot;:&quot;1 minuut&quot;,&quot;et&quot;:&quot;1 minut&quot;,&quot;fi&quot;:&quot;1 minuutti&quot;,&quot;fr&quot;:&quot;1 minute&quot;,&quot;de&quot;:&quot;1 Minute&quot;,&quot;el&quot;:&quot;1 \\u03bb\\u03b5\\u03c0\\u03c4\\u03cc&quot;,&quot;hu&quot;:&quot;1 perc&quot;,&quot;ga&quot;:&quot;1 n\\u00f3im\\u00e9ad&quot;,&quot;it&quot;:&quot;1 minuto&quot;,&quot;lv&quot;:&quot;1 min\\u016btes&quot;,&quot;lt&quot;:&quot;1 minut\\u0117&quot;,&quot;ru&quot;:&quot;1 \\u043c\\u0438\\u043d\\u0443\\u0442\\u0430&quot;,&quot;mt&quot;:&quot;minuta&quot;,&quot;pl&quot;:&quot;1 minuta&quot;,&quot;pt&quot;:&quot;1 minuto&quot;,&quot;ro&quot;:&quot;1 minut&quot;,&quot;sk&quot;:&quot;min\\u00fatu&quot;,&quot;sl&quot;:&quot;1 minuta&quot;,&quot;es&quot;:&quot;1 minuto&quot;,&quot;sv&quot;:&quot;1 minut&quot;,&quot;en&quot;:&quot;1 minute&quot;}\">\n                        1 minute                      <\/td>\n                      <td data-cs-i18n-text=\"\">\n                        This cookie name is associated with Google Universal Analytics, according to documentation it is used to throttle the request rate - limiting the collection of data on high traffic sites. It expires after 10 minutes.                      <\/td>\n                    <\/tr>\n                                    <\/tbody>\n                <\/table>\n              <\/div>\n            <\/div>\n                                  <div\n              class=\"cookiescript_report_targeting cookiescript_hidden\"\n              data-cs-tab-content=\"targeting\"\n            >\n              <div class=\"cookiescript_category_description\" data-cs-i18n-text=\"[]\">\n                Cookie-urile de targetare sunt utilizate pentru a identifica vizitatorii \u00eentre diferite site-uri web, de ex. parteneri de con\u021binut, re\u021bele de banner. Aceste cookie-uri pot fi utilizate de companii pentru a construi un profil de interese ale vizitatorilor sau pentru a afi\u0219a reclame relevante pe alte site-uri web.              <\/div>\n              <div class=\"cookiescript_tablewrap\">\n                <table class=\"cookiescript_fullreport\" data-cs-table-report=\"cookiescript\">\n                  <thead>\n                  <tr>\n                    <th data-cs-i18n-text=\"[]\">\n                      Nume                    <\/th>\n                    <th data-cs-i18n-text=\"[]\">\n                      Domeniu                    <\/th>\n                    <th data-cs-i18n-text=\"[]\">\n                      Expirare                    <\/th>\n                    <th data-cs-i18n-text=\"[]\">\n                      Descriere                    <\/th>\n                  <\/tr>\n                  <\/thead>\n                  <tbody>\n                                      <tr>\n                      <td>_fbp<\/td>\n                      <td>.kubex.ro<\/td>\n                      <td data-cs-i18n-text=\"{&quot;bg&quot;:&quot;3 \\u043c\\u0435\\u0441\\u0435\\u0446\\u0430&quot;,&quot;hr&quot;:&quot;3 mjeseca&quot;,&quot;cs&quot;:&quot;3 m\\u011bs\\u00edce&quot;,&quot;da&quot;:&quot;3 m\\u00e5neder&quot;,&quot;nl&quot;:&quot;3 maanden&quot;,&quot;et&quot;:&quot;3 kuud&quot;,&quot;fi&quot;:&quot;3 kuukautta&quot;,&quot;fr&quot;:&quot;3 mois&quot;,&quot;de&quot;:&quot;3 Monate&quot;,&quot;el&quot;:&quot;3 \\u03bc\\u03ae\\u03bd\\u03b5\\u03c2&quot;,&quot;hu&quot;:&quot;3 h\\u00f3nap&quot;,&quot;ga&quot;:&quot;3 m\\u00ed&quot;,&quot;it&quot;:&quot;3 mesi&quot;,&quot;lv&quot;:&quot;3 m\\u0113ne\\u0161iem&quot;,&quot;lt&quot;:&quot;3 m\\u0117nesiai&quot;,&quot;ru&quot;:&quot;3 \\u043c\\u0435\\u0441\\u044f\\u0446\\u0430&quot;,&quot;mt&quot;:&quot;3 xhur&quot;,&quot;pl&quot;:&quot;3 miesi\\u0105ce&quot;,&quot;pt&quot;:&quot;3 meses&quot;,&quot;ro&quot;:&quot;3 luni&quot;,&quot;sk&quot;:&quot;3 mesiace&quot;,&quot;sl&quot;:&quot;3 mesece&quot;,&quot;es&quot;:&quot;3 meses&quot;,&quot;sv&quot;:&quot;3 m\\u00e5nader&quot;,&quot;en&quot;:&quot;3 months&quot;}\">\n                        3 months                      <\/td>\n                      <td data-cs-i18n-text=\"\">\n                        Used by Facebook to deliver a series of advertisement products such as real time bidding from third party advertisers                      <\/td>\n                    <\/tr>\n                                      <tr>\n                      <td>fr<\/td>\n                      <td>.facebook.com<\/td>\n                      <td data-cs-i18n-text=\"{&quot;bg&quot;:&quot;3 \\u043c\\u0435\\u0441\\u0435\\u0446\\u0430&quot;,&quot;hr&quot;:&quot;3 mjeseca&quot;,&quot;cs&quot;:&quot;3 m\\u011bs\\u00edce&quot;,&quot;da&quot;:&quot;3 m\\u00e5neder&quot;,&quot;nl&quot;:&quot;3 maanden&quot;,&quot;et&quot;:&quot;3 kuud&quot;,&quot;fi&quot;:&quot;3 kuukautta&quot;,&quot;fr&quot;:&quot;3 mois&quot;,&quot;de&quot;:&quot;3 Monate&quot;,&quot;el&quot;:&quot;3 \\u03bc\\u03ae\\u03bd\\u03b5\\u03c2&quot;,&quot;hu&quot;:&quot;3 h\\u00f3nap&quot;,&quot;ga&quot;:&quot;3 m\\u00ed&quot;,&quot;it&quot;:&quot;3 mesi&quot;,&quot;lv&quot;:&quot;3 m\\u0113ne\\u0161iem&quot;,&quot;lt&quot;:&quot;3 m\\u0117nesiai&quot;,&quot;ru&quot;:&quot;3 \\u043c\\u0435\\u0441\\u044f\\u0446\\u0430&quot;,&quot;mt&quot;:&quot;3 xhur&quot;,&quot;pl&quot;:&quot;3 miesi\\u0105ce&quot;,&quot;pt&quot;:&quot;3 meses&quot;,&quot;ro&quot;:&quot;3 luni&quot;,&quot;sk&quot;:&quot;3 mesiace&quot;,&quot;sl&quot;:&quot;3 mesece&quot;,&quot;es&quot;:&quot;3 meses&quot;,&quot;sv&quot;:&quot;3 m\\u00e5nader&quot;,&quot;en&quot;:&quot;3 months&quot;}\">\n                        3 months                      <\/td>\n                      <td data-cs-i18n-text=\"\">\n                        Contains browser and user unique ID combinaton, used for targeted advertising.                      <\/td>\n                    <\/tr>\n                                      <tr>\n                      <td>ss<\/td>\n                      <td>va.tawk.to<\/td>\n                      <td data-cs-i18n-text=\"{&quot;bg&quot;:&quot;Session&quot;,&quot;hr&quot;:&quot;Session&quot;,&quot;cs&quot;:&quot;Session&quot;,&quot;da&quot;:&quot;Session&quot;,&quot;nl&quot;:&quot;Session&quot;,&quot;et&quot;:&quot;Session&quot;,&quot;fi&quot;:&quot;Session&quot;,&quot;fr&quot;:&quot;Session&quot;,&quot;de&quot;:&quot;Session&quot;,&quot;el&quot;:&quot;Session&quot;,&quot;hu&quot;:&quot;Session&quot;,&quot;ga&quot;:&quot;Session&quot;,&quot;it&quot;:&quot;Session&quot;,&quot;lv&quot;:&quot;Session&quot;,&quot;lt&quot;:&quot;Session&quot;,&quot;ru&quot;:&quot;Session&quot;,&quot;mt&quot;:&quot;Session&quot;,&quot;pl&quot;:&quot;Session&quot;,&quot;pt&quot;:&quot;Session&quot;,&quot;ro&quot;:&quot;Session&quot;,&quot;sk&quot;:&quot;Session&quot;,&quot;sl&quot;:&quot;Session&quot;,&quot;es&quot;:&quot;Session&quot;,&quot;sv&quot;:&quot;Session&quot;,&quot;en&quot;:&quot;Session&quot;}\">\n                        Session                      <\/td>\n                      <td data-cs-i18n-text=\"\">\n                        This cookie is associated with Eventbrite and is used to deliver content tailored to the end user's interests and improve content creation. This cookie is also used for event-booking purposes.                      <\/td>\n                    <\/tr>\n                                      <tr>\n                      <td>IDE<\/td>\n                      <td>.doubleclick.net<\/td>\n                      <td data-cs-i18n-text=\"{&quot;bg&quot;:&quot;1 \\u0433\\u043e\\u0434\\u0438\\u043d\\u0430&quot;,&quot;hr&quot;:&quot;1 godinu&quot;,&quot;cs&quot;:&quot;1 rok&quot;,&quot;da&quot;:&quot;1 \\u00e5r&quot;,&quot;nl&quot;:&quot;1 jaar&quot;,&quot;et&quot;:&quot;1 aasta&quot;,&quot;fi&quot;:&quot;1 vuosi&quot;,&quot;fr&quot;:&quot;1 an&quot;,&quot;de&quot;:&quot;1 Jahr&quot;,&quot;el&quot;:&quot;1 \\u03c7\\u03c1\\u03cc\\u03bd\\u03bf\\u03c2&quot;,&quot;hu&quot;:&quot;1 \\u00e9v&quot;,&quot;ga&quot;:&quot;1 bliain&quot;,&quot;it&quot;:&quot;1 anno&quot;,&quot;lv&quot;:&quot;1 gads&quot;,&quot;lt&quot;:&quot;1 metai&quot;,&quot;ru&quot;:&quot;1 \\u0433\\u043e\\u0434&quot;,&quot;mt&quot;:&quot;sena&quot;,&quot;pl&quot;:&quot;1 rok&quot;,&quot;pt&quot;:&quot;1 ano&quot;,&quot;ro&quot;:&quot;1 an&quot;,&quot;sk&quot;:&quot;rok&quot;,&quot;sl&quot;:&quot;1 leto&quot;,&quot;es&quot;:&quot;1 a\\u00f1o&quot;,&quot;sv&quot;:&quot;1 \\u00e5r&quot;,&quot;en&quot;:&quot;1 year&quot;}\">\n                        1 year                      <\/td>\n                      <td data-cs-i18n-text=\"\">\n                        This cookie carries out information about how the end user uses the website and any advertising that the end user may have seen before visiting the said website.                      <\/td>\n                    <\/tr>\n                                    <\/tbody>\n                <\/table>\n              <\/div>\n            <\/div>\n                                  <div\n              class=\"cookiescript_report_functionality cookiescript_hidden\"\n              data-cs-tab-content=\"functionality\"\n            >\n              <div class=\"cookiescript_category_description\" data-cs-i18n-text=\"[]\">\n                Cookie-urile de func\u021bionalitate sunt utilizate pentru a aminti informa\u021biile vizitatorilor de pe site-ul web, de ex. limb\u0103, fus orar, con\u021binut \u00eembun\u0103t\u0103\u021bit.              <\/div>\n              <div class=\"cookiescript_tablewrap\">\n                <table class=\"cookiescript_fullreport\" data-cs-table-report=\"cookiescript\">\n                  <thead>\n                  <tr>\n                    <th data-cs-i18n-text=\"[]\">\n                      Nume                    <\/th>\n                    <th data-cs-i18n-text=\"[]\">\n                      Domeniu                    <\/th>\n                    <th data-cs-i18n-text=\"[]\">\n                      Expirare                    <\/th>\n                    <th data-cs-i18n-text=\"[]\">\n                      Descriere                    <\/th>\n                  <\/tr>\n                  <\/thead>\n                  <tbody>\n                                      <tr>\n                      <td>__tawkuuid<\/td>\n                      <td>.kubex.ro<\/td>\n                      <td data-cs-i18n-text=\"{&quot;bg&quot;:&quot;6 \\u043c\\u0435\\u0441\\u0435\\u0446\\u0430&quot;,&quot;hr&quot;:&quot;6 mjeseci&quot;,&quot;cs&quot;:&quot;6 m\\u011bs\\u00edc\\u016f&quot;,&quot;da&quot;:&quot;6 m\\u00e5neder&quot;,&quot;nl&quot;:&quot;6 maanden&quot;,&quot;et&quot;:&quot;6 kuud&quot;,&quot;fi&quot;:&quot;6 kuukautta&quot;,&quot;fr&quot;:&quot;6 mois&quot;,&quot;de&quot;:&quot;6 Monate&quot;,&quot;el&quot;:&quot;6 \\u03bc\\u03ae\\u03bd\\u03b5\\u03c2&quot;,&quot;hu&quot;:&quot;6 h\\u00f3nap&quot;,&quot;ga&quot;:&quot;6 m\\u00ed&quot;,&quot;it&quot;:&quot;6 mesi&quot;,&quot;lv&quot;:&quot;6 m\\u0113ne\\u0161iem&quot;,&quot;lt&quot;:&quot;6 m\\u0117nesiai&quot;,&quot;ru&quot;:&quot;6 \\u043c\\u0435\\u0441\\u044f\\u0446\\u0435\\u0432&quot;,&quot;mt&quot;:&quot;6 xhur&quot;,&quot;pl&quot;:&quot;6 miesi\\u0119cy&quot;,&quot;pt&quot;:&quot;6 meses&quot;,&quot;ro&quot;:&quot;6 luni&quot;,&quot;sk&quot;:&quot;6 mesiacov&quot;,&quot;sl&quot;:&quot;6 mesecev&quot;,&quot;es&quot;:&quot;6 meses&quot;,&quot;sv&quot;:&quot;6 m\\u00e5nader&quot;,&quot;en&quot;:&quot;6 months&quot;}\">\n                        6 months                      <\/td>\n                      <td data-cs-i18n-text=\"\">\n                        This cookie is usually set by a website utilizing Taw.to, which is a Live chat service. This cookie remembers the end user so that past chat conversations can be identified to improve service.                      <\/td>\n                    <\/tr>\n                                    <\/tbody>\n                <\/table>\n              <\/div>\n            <\/div>\n                  <\/div>\n      <\/div>\n      <div id=\"cookiescript_aboutwrap\" class=\"cookiescript_hidden\" data-cs-maintab-content=\"aboutcookies\" data-cs-i18n-text=\"[]\">\n        Cookie-urile sunt mici fi\u0219iere text care sunt plasate pe computer de c\u0103tre site-urile web pe care le accesa\u021bi. Site-urile web folosesc cookie-uri pentru a ajuta utilizatorii s\u0103 navigheze eficient \u0219i s\u0103 \u00eendeplineasc\u0103 anumite func\u021bii. Cookie-urile care sunt necesare pentru ca site-ul web s\u0103 func\u021bioneze corespunz\u0103tor sunt permise s\u0103 fie setate f\u0103r\u0103 permisiunea dvs. Toate celelalte cookie-uri trebuie s\u0103 fie aprobate \u00eenainte de a putea fi setate \u00een browser.<br \/>\r\n<br \/>\r\nYou can change your consent to cookie usage at any time on our Privacy Policy page.      <\/div>\n    <\/div>\n\t<div id=\"cookiescript_reportdate\">Cookie <a id=\"cookiescript_reportlink\" href=\"https:\/\/cookie-script.com\/cookie-report?identifier=a10e3974425888d7d783fb410347a221\" target=\"_blank\">report<\/a> created on 2020-09-30  by <a href=\"https:\/\/cookie-script.com\" id=\"cookiescript_cookiescriptlink\" target=\"_blank\">Cookie-Script<\/a><\/div>\n\t<\/div>\n\t\n  <div id=\"cookiescript_close\" tabindex=\"0\" role=\"button\">\u00d7<\/div>\n<\/div>\n";
  var badgeHtml = "  \n  <div id=\"cookiescript_badge\">\n              <div id=\"cookiescript_badgetext\" data-cs-i18n-text=\"[]\">\n        Setari cookie      <\/div>\n      <\/div>\n";
  var cookieName = 'CookieScriptConsent';
  var expireDays = 30;
  var currentUrl = window.location.href;
  var cookieId = '2269cf42e26851d575bf54f957770aa7';
  var scrollFired = false;
  var groupedCookies = {"strict":["productsToDisplay","ASPSESSIONIDQESRTQDS","tawkUUID","TawkConnectionTime","productsToDisplay","TawkConnectionTime"],"performance":["_ga","_gid","_gat"],"targeting":["_fbp","fr","ss","IDE"],"functionality":["__tawkuuid"]};
  var groupedResetCookies = {"strict":[{"name":"productsToDisplay","domain":"kubex.ro","path":"\/","expire":"86399","same_site":null,"session":"0","secure":"0","value":"productsToDisplay="},{"name":"TawkConnectionTime","domain":"kubex.ro","path":"\/","expire":null,"same_site":null,"session":"1","secure":"0","value":"1601479683180"},{"name":"productsToDisplay","domain":"www.kubex.ro","path":"\/","expire":"86397","same_site":null,"session":"0","secure":"0","value":"productsToDisplay="},{"name":"TawkConnectionTime","domain":"www.kubex.ro","path":"\/","expire":null,"same_site":null,"session":"1","secure":"0","value":"1601479687988"}],"performance":[{"name":"_ga","domain":".kubex.ro","path":"\/","expire":"63071999","same_site":null,"session":"0","secure":"0","value":"GA1.2.654454903.1601479680"},{"name":"_gid","domain":".kubex.ro","path":"\/","expire":"86399","same_site":null,"session":"0","secure":"0","value":"GA1.2.1046388253.1601479680"},{"name":"_gat","domain":".kubex.ro","path":"\/","expire":"57","same_site":null,"session":"0","secure":"0","value":"1"}],"targeting":[{"name":"_fbp","domain":".kubex.ro","path":"\/","expire":"7775999","same_site":null,"session":"0","secure":"0","value":"fb.1.1601479680395.591784014"}],"functionality":[{"name":"__tawkuuid","domain":".kubex.ro","path":"\/","expire":"15551999","same_site":null,"session":"0","secure":"0","value":"e::kubex.ro::HM1tXqpCDba\/wi998OxEItI1Hfz+qJ1c1KHe22BPXliFXW2SOWq3Tih5ROy6lVjQ::2"}]};
  var allCookieNames = ["productsToDisplay","_ga","_gid","_gat","_fbp","fr","ASPSESSIONIDQESRTQDS","ss","tawkUUID","__tawkuuid","IDE","TawkConnectionTime","productsToDisplay","TawkConnectionTime"];
  var allCategory = ["strict","performance","targeting","functionality"];
  var isPresentStrictly = 1;
  var subDomainParent = '';
  var removeNameCookies = [];
  var removeCookies = {};

  /* Private function */

  var _callApplyCurrentCookiesState = function () {
    _applyCurrentCookiesState();
    //Sometimes need waiting
    setTimeout(function () {
      _applyCurrentCookiesState();
    }, 500);
  }

  var _applyCurrentCookiesState = function () {
    var loadAllow = function (outerCategories) {
          var categories = typeof outerCategories === 'undefined' ? allCategory : outerCategories;
      if(categories.length === allCategory.length) {
        _allowCookies();
      } else {
        _allowCookies(categories);
      }
      for (var i = 0; i < categories.length ; i++) {
        _dispatchCategoryEvent(categories[i]);
      }
      //Call this because need allow first-party cookie by category
      _rejectCookies(categories);
        }

    var loadReject = function () {
      _rejectCookies();
          _allowCookies(['strict']);
        }

    if(_isCookieScannerRequest()) {
      _allowCookies();

      for (var i = 0; i < allCategory.length ; i++) {
        _dispatchCategoryEvent(allCategory[i]);
      }
      _dispatchCategoryEvent('all');

      return true;
    }

    if(_isHasCookieAction()) {
       if(_isAcceptCookieAction()) {
          var categories = _readCategoriesCheckboxesFromCookies();
          loadAllow(categories);
          return true;
       } else {
         loadReject();
         _dispatchCategoryEvent('strict');
         return true;
       }
    } else {
          loadReject();
          return true;
    }
  }

  var _reloadPage = function () {
          return false;
      }

  var _applyTranslation = function () {
      return false;
    }

  var _addLabelToReportTable = function () {
    var tables = document.querySelectorAll('table[data-cs-table-report="cookiescript"]')
    Array.prototype.slice.call(tables).forEach(function (table) {
      var thEls = table.querySelectorAll('thead th');
      var tdLabels = [];
      Array.prototype.slice.call(thEls).forEach(function (element) {
        tdLabels.push(element.innerText);
      });
      var trEls = table.querySelectorAll('tbody tr');
      Array.prototype.slice.call(trEls).forEach(function (trEl) {
        Array.prototype.slice.call(trEl.children).forEach(function (td, ndx) {
          td.setAttribute('label', tdLabels[ndx])
        });
      });
    });
  }

  var _allowCookies = function (categories) {
      var attribute = categories && categories.length > 0
      ? '[data-cookiescript="accepted"][data-cookiecategory]'
      : '[data-cookiescript="accepted"]';

    _changeImgTags(attribute, categories);
    _changeScriptTags(attribute, categories);
    _changeIframeTags(attribute, categories);
    _changeEmbedTags(attribute, categories);
    _changeObjectTags(attribute, categories);
    _changeLinksTags(attribute, categories);
  
  }

  var _rejectCookies = function (allowCategories) {
      var cookies = _cookiesApi.get();
    for(var cookie in cookies) {
      if(cookie === cookieName || _isCookieNecessary(cookie) || _isCookiesAllow(cookie, allowCategories)){
        continue;
      }
      removeNameCookies.push(cookie);
      removeCookies[cookie] = cookies[cookie];

      _cookiesApi.remove(cookie);
      if(_cookiesApi.get(cookie) !== 'undefined') {
        var domainParts = window.location.hostname.split(".");
        while (domainParts.length > 0 && _cookiesApi.get(cookie) !== 'undefined') {
          var possibleDomain = domainParts.join('.');
          var pathParts = location.pathname.split('/');

          var possiblePath = '/'
          _cookiesApi.remove(cookie, { path: possiblePath, domain: possibleDomain });
          _cookiesApi.remove(cookie, { path: possiblePath, domain: '.' + possibleDomain });

          while (pathParts.length > 0 && _cookiesApi.get(cookie) !== 'undefined') {
            possiblePath = pathParts.join('/');
            _cookiesApi.remove(cookie, { path: possiblePath, domain: possibleDomain });
            _cookiesApi.remove(cookie, { path: possiblePath, domain: '.' + possibleDomain });
            pathParts.pop();
          }
          domainParts.shift();
        }
      }
    }
  
  }

  var _resetCookies = function (categories) {
            return false;
        }

  var _changeImgTags = function (attribute, categories) {
    var imgTags = document.querySelectorAll('img' + attribute);
    if(imgTags) {
      for (var i = 0; i < imgTags.length ; i++) {
        var imgTag = imgTags[i];
        if(categories && categories.length > 0) {
          var dataCategoryVal = imgTag.getAttribute('data-cookiecategory');
          if(dataCategoryVal) {
            categories.forEach(function (category) {
              dataCategoryVal = dataCategoryVal.replace(category, '').trim();
            })
            if(dataCategoryVal.length > 0) {
              continue;
            }
          }
        }

        imgTag.setAttribute('src', imgTag.getAttribute('data-src'));
        imgTag.removeAttribute('data-cookiescript');
      }
    }
  }

  var _changeScriptTags = function (attribute, categories) {
    var isDispatchDOMContentLoadedEvent = false;
    var scriptsTags = document.querySelectorAll('script' + '[type="text/plain"]' + attribute);
    if(scriptsTags) {
      for (var i = 0; i < scriptsTags.length ; i++) {
        var scriptsTag = scriptsTags[i];
        if(categories && categories.length > 0) {
          var dataCategoryVal = scriptsTag.getAttribute('data-cookiecategory');
          if(dataCategoryVal) {
            categories.forEach(function (category) {
              dataCategoryVal = dataCategoryVal.replace(category, '').trim();
            })
            if(dataCategoryVal.length > 0) {
              continue;
            }
          }
        }

        if(scriptsTag.getAttribute('data-reload') === 'true') {
          isDispatchDOMContentLoadedEvent = true
        }

        var newScriptTag = document.createElement('script');
        newScriptTag.innerHTML = scriptsTag.innerHTML;
        var attributes = Array.prototype.slice.call(scriptsTag.attributes);
        attributes.forEach(function (attr) {
          newScriptTag.setAttribute(attr.name, attr.value);
        })
        newScriptTag.setAttribute('type', 'text/javascript');
        newScriptTag.removeAttribute('data-cookiescript');
        _appendNodeAfterAndRemove(scriptsTag, newScriptTag)
      }
    }
    if(isDispatchDOMContentLoadedEvent) {
      _dispatchDOMContentLoadedEvent();
    }
  }

  var _changeIframeTags = function (attribute, categories) {
    var iframes = document.querySelectorAll('iframe' + attribute);
    if(iframes) {
      for (var i = 0; i < iframes.length ; i++) {
        var iframe = iframes[i];
        if(categories && categories.length > 0) {
          var dataCategoryVal = iframe.getAttribute('data-cookiecategory');
          if(dataCategoryVal) {
            categories.forEach(function (category) {
              dataCategoryVal = dataCategoryVal.replace(category, '').trim();
            })
            if(dataCategoryVal.length > 0) {
              continue;
            }
          }
        }

        iframe.setAttribute('src', iframe.getAttribute('data-src'));
        iframe.removeAttribute('data-cookiescript');
      }
    }
  }

  var _changeEmbedTags = function (attribute, categories) {
    var embedTags = document.querySelectorAll('embed' + attribute);
    if(embedTags) {
      for (var i = 0; i < embedTags.length; i++) {
        var embedTag = embedTags[i];
        if(categories && categories.length > 0) {
          var dataCategoryVal = embedTag.getAttribute('data-cookiecategory');
          if(dataCategoryVal) {
            categories.forEach(function (category) {
              dataCategoryVal = dataCategoryVal.replace(category, '').trim();
            })
            if(dataCategoryVal.length > 0) {
              continue;
            }
          }
        }

        embedTag.setAttribute('src', embedTag.getAttribute('data-src'));
        embedTag.removeAttribute('data-cookiescript');
        var outerHtml = embedTag.outerHTML;
        _appendAfterAndRemove(embedTag, outerHtml)
      }
    }
  }

  var _changeObjectTags = function (attribute, categories) {
    var objectTags = document.querySelectorAll('object' + attribute);
    if(objectTags) {
      for (var i = 0; i < objectTags.length; i++) {
        var objectTag = objectTags[i];
        if(categories && categories.length > 0) {
          var dataCategoryVal = objectTag.getAttribute('data-cookiecategory');
          if(dataCategoryVal) {
            categories.forEach(function (category) {
              dataCategoryVal = dataCategoryVal.replace(category, '').trim();
            })
            if(dataCategoryVal.length > 0) {
              continue;
            }
          }
        }

        objectTag.setAttribute('data', objectTag.getAttribute('data-data'));
        objectTag.removeAttribute('data-cookiescript');
        var outerHtml = objectTag.outerHTML;
        _appendAfterAndRemove(objectTag, outerHtml)
      }
    }
  }

  var _changeLinksTags = function (attribute, categories) {
    var linkTags = document.querySelectorAll('link' + attribute);
    if(linkTags) {
      for (var i = 0; i < linkTags.length ; i++) {
        var linkTag = linkTags[i];
        if(categories && categories.length > 0) {
          var dataCategoryVal = linkTag.getAttribute('data-cookiecategory');
          if(dataCategoryVal) {
            categories.forEach(function (category) {
              dataCategoryVal = dataCategoryVal.replace(category, '').trim();
            })
            if(dataCategoryVal.length > 0) {
              continue;
            }
          }
        }

        linkTag.setAttribute('href', linkTag.getAttribute('data-href'));
        linkTag.removeAttribute('data-cookiescript');
      }
    }
  }

  var _focusRestrict = function (event) {
      return false;
    }

  var _addListenerFocusRestrict = function () {
        return false;
      }

  var _removeListenerFocusRestrict = function () {
      return false;
    }

  var _loadCheckboxValues = function () {
            if(_isAcceptCookieAction()) {
        var categories = _readCategoriesCheckboxesFromCookies();
        _setCheckboxesByCategories(categories);
      }
    }

  var _showBanner = function () {
    _hideBadge()
    var banner = document.getElementById('cookiescript_injected');
    if(banner) {
      setTimeout(function () {
        _fadeIn(banner, 200)
      }, 200);
      _addListenerFocusRestrict();
    } else {
      setTimeout(function () {
        _addBanner()
      }, 150);
    }
  }

  var _hideBanner = function (delay) {
    var banner = document.getElementById('cookiescript_injected');
    if(banner) {
      _fadeOut(banner, delay || 200);
      _hideManage();
    }
    _removeListenerFocusRestrict();
  }

  var _showBadge = function () {
      var badge = document.getElementById('cookiescript_badge');
    if(badge) {
      setTimeout(function () {
        _fadeIn(badge, 200)
      }, 200);
    } else {
      _addBadge();
    }
    }

  var _hideBadge = function (delay) {
      var badge = document.getElementById('cookiescript_badge');
    if(badge) {
      _fadeOut(badge, delay || 200);
    }
    }

  var _showManage = function () {
      var content = document.getElementById('cookiescript_cookietablewrap');
    if(content && content.classList.contains('cookiescript_hidden')) {
      content.classList.remove('cookiescript_hidden');
    }
    var banner = document.getElementById('cookiescript_injected');
    if(banner) {
      banner.classList.add('hascookiereport');
    }
    _changeTitleManageButton(true);
    }

  var _hideManage = function () {
      var content = document.getElementById('cookiescript_cookietablewrap');
    if(content && !content.classList.contains('cookiescript_hidden')) {
      content.classList.add('cookiescript_hidden');
    }
    var banner = document.getElementById('cookiescript_injected');
    if(banner) {
      banner.classList.remove('hascookiereport');
    }
    _changeTitleManageButton(false);
    }

  var _changeTitleManageButton = function (isHide) {
      var showTitleEl = document.querySelector('#cookiescript_manage_wrap span[data-cs-show-title="cookie-script"]');
    var hideTitleEl = document.querySelector('#cookiescript_manage_wrap span[data-cs-hide-title="cookie-script"]');
    if(showTitleEl && hideTitleEl) {
      if(isHide) {
        _fadeOut(showTitleEl, 1);
        _fadeIn(hideTitleEl, 1);
      } else {
        _fadeOut(hideTitleEl, 1);
        _fadeIn(showTitleEl, 1);
      }
    }
    }

  var _tabClickEvent = function (event, nameTabAttr, nameTabContentAttr) {
    var target = event.target || event.srcElement;
    var typeTab = target.getAttribute(nameTabAttr);
    if (typeTab && typeTab.length > 0) {
      var tabsContent = document.querySelectorAll('div['+ nameTabContentAttr +']');
      if(tabsContent) {
        for (var i = 0; i < tabsContent.length ; i++) {
          var tabContent = tabsContent[i];
          var tabContentType = tabContent.getAttribute(nameTabContentAttr);
          var isNowActive = tabContentType && tabContentType === typeTab
          var tab = document.querySelector('div['+ nameTabAttr +'="'+ tabContentType +'"]');
          if(tab) {
            tab.classList.remove('cookiescript_active');
            isNowActive && tab.classList.add('cookiescript_active');
          }
          tabContent.classList.add('cookiescript_hidden');
          isNowActive && tabContent.classList.remove('cookiescript_hidden');

        }
      }
    }
  }

  var _addBanner = function () {
    _appendHtml(document.body, html);
    _applyTranslation();
    _addLabelToReportTable();
    var banner = document.getElementById('cookiescript_injected');
    _fadeIn(banner, 200);
    _loadCheckboxValues();

    var saveButton = document.getElementById('cookiescript_save');
    var acceptButton = document.getElementById('cookiescript_accept');
    var rejectButton = document.getElementById('cookiescript_reject');
    var closeButton = document.getElementById('cookiescript_close');

    _addEvent(saveButton, 'click', function () {
      _this.acceptAction();
    })
    _addEvent(saveButton, 'keydown', function (event) {
      if (event.key === " " || event.key === "Enter" || event.key === "Spacebar") {
        event.preventDefault();
        saveButton.click()
      }
    })

    _addEvent(acceptButton, 'click', function () {
      _this.acceptAllAction();
    })
    _addEvent(acceptButton, 'keydown', function (event) {
      if (event.key === " " || event.key === "Enter" || event.key === "Spacebar") {
        event.preventDefault();
        acceptButton.click()
      }
    })

    _addEvent(rejectButton, 'click', function () {
      _this.rejectAllAction();
    })
    _addEvent(rejectButton, 'keydown', function (event) {
      if (event.key === " " || event.key === "Enter" || event.key === "Spacebar") {
        event.preventDefault();
        rejectButton.click()
      }
    })

    _addEvent(document.getElementById('cookiescript_readmore'), 'click', function () {
      _sendAnalytics('readmore', '');
    })

    _addEvent(closeButton, 'click', function () {
      _hideBanner();
      _showBadge();
      _sendAnalytics('close', '');
      _dispatchCloseEvent();
    })

    _addEvent(closeButton, 'keydown', function (event) {
      if (event.key === " " || event.key === "Enter" || event.key === "Spacebar") {
        event.preventDefault();
        closeButton.click()
      }
    })

  
    var checkboxes = _categoriesCheckboxes();

    var callbackEvent = function () {
      var acceptButton = document.getElementById('cookiescript_accept');
      var saveButton = document.getElementById('cookiescript_save');
      if(!acceptButton.classList.contains('cookiescript_hidden')) {
        acceptButton.classList.add('cookiescript_hidden');
        acceptButton.classList.add('cookiescript_bigger');
        saveButton.classList.add('cookiescript_bigger');
        setTimeout(function () {
          acceptButton.style.display = 'none';
          saveButton.style.display = 'inline-block';
          saveButton.classList.remove('cookiescript_bigger');
        }, 100);
      }
    }

    for(var i = 0; i < checkboxes.length; i++) {
      var checkBox = checkboxes[i];
      _addEvent(checkBox, 'click', callbackEvent)
    }
  
      var showMangeButton = document.getElementById('cookiescript_manage_wrap');

    _addEvent(showMangeButton, 'click', function () {
      var content = document.getElementById('cookiescript_cookietablewrap');
      if(content) {
        if(content.classList.contains('cookiescript_hidden')) {
          _showManage();
        } else {
          _hideManage();
        }
      }
    })

    _addEvent(showMangeButton, 'keydown', function (event) {
      if (event.key === " " || event.key === "Enter" || event.key === "Spacebar") {
        event.preventDefault();
        showMangeButton.click()
      }
    })

    _addEvent(document.querySelectorAll('div[data-cs-maintabs="cookiescript"] > div'), 'click', function (event) {
      _tabClickEvent(event, 'data-cs-maintab', 'data-cs-maintab-content');
    }, true)

    _addEvent(document.querySelectorAll('div[data-cs-tabs="cookiescript"] > div'), 'click', function (event) {
      _tabClickEvent(event, 'data-cs-tab', 'data-cs-tab-content');
    }, true)

    _addListenerFocusRestrict();

    }

  var _addBadge = function () {
    if(badgeHtml.length > 0) {
      _appendHtml(document.body, badgeHtml);
      var badge = document.getElementById('cookiescript_badge');
      _applyTranslation();
      setTimeout(function () {
        _fadeIn(badge, 200)
      }, 200);

      _addEvent(badge, 'click', function () {
        _showBanner();
      })
    }
  }

  var _removeSelfHtml = function () {
    var css_element = document.querySelector('style[data-type="cookiescriptstyles"]');
    var banner_element = document.getElementById('cookiescript_injected');
    var badge_element = document.getElementById('cookiescript_badge');
    if(banner_element) {
      banner_element.parentNode.removeChild(banner_element);
    }
    if(badge_element) {
      badge_element.parentNode.removeChild(badge_element);
    }
    if(css_element) {
      css_element.parentNode.removeChild(css_element);
    }
    _removeListenerFocusRestrict()
  }

  var _setAltForIframes = function () {
    var iframeNodes = document.querySelectorAll('iframe[data-cookiescript="accepted"]');
    var iframes = Array.prototype.slice.call(iframeNodes);
    if(iframes.length > 0) {
      for(var i = 0; i < iframes.length; i++) {
        var iframe = iframes[i];
        if(!iframe.getAttribute('src')) {
          var alt = iframe.getAttribute('alt') || '';
          var imgAlt = iframe.getAttribute('data-alt-img');
          var writeParam = alt;
          if(imgAlt) {
            writeParam = '<img alt="'+ alt +'" src="'+ imgAlt +'" />'
          }
          var ifrm = (iframe.contentWindow) ? iframe.contentWindow : (iframe.contentDocument.document) ? iframe.contentDocument.document : iframe.contentDocument;
          ifrm.document.open();
          ifrm.document.write(writeParam);
          ifrm.document.close();
        }
      }
    }
  }

  // manage-consent-on-cookie-policy
  var _setConsentCheckbox = function (value) {
    var checkBox = document.getElementById('csconsentcheckbox');
    if(checkBox) {
      checkBox.checked = value;
    }
  }

  // manage-consent-on-cookie-policy
  var _setConsentCheckboxAndLinkEvent = function () {
    var checkBox = document.getElementById('csconsentcheckbox');
    _addEvent(checkBox, 'change', function (event) {
      var target = event.target || event.srcElement
      if(target.checked) {
        _this.acceptAllAction();
      } else {
        _this.rejectAllAction();
      }
    })

    var link = document.getElementById('csconsentlink');
    _addEvent(link, 'click', function () {
      _showBanner();
    })
  }

  var _setScrollEvent = function () {
      return false;
    }

    var _demoClickEvent = function () {
        return false;
    }

  var _callHideAfterEffect = function () {
      return false;
    }

  var _callAcceptCookiesAfterEffect = function () {
      return false;
    }

  var _callShowOncePageEffect = function () {
      return false;
    }

  var _isCookieNecessary = function (cookie) {
    var necessaryCookies = [];
    for (var i = 0; i < necessaryCookies.length ; i++) {
      var necessaryCookie = necessaryCookies[i];
      if(necessaryCookie.regexp) {
        var regexp = _regexParser(necessaryCookie.name)
        if(cookie.match(regexp)) {
          return true;
        }
      } else {
        if(cookie === necessaryCookie.name) {
          return true;
        }
      }
    }
    return false;
  }

  var _isCookiesAllow = function (cookie, allowCategories) {
      var categories = ['strict'];
    if(typeof allowCategories !== 'undefined') {
      categories = allowCategories.slice();
      categories.push('strict');
      categories = _uniqueArray(categories);
    }
      if(!_includes(allCookieNames, cookie)) {
      return true;
    }
  
    for (var i = 0; i < categories.length ; i++) {
      var cNames = groupedCookies[categories[i]];
      if(cNames) {
        if(_includes(cNames, cookie) || _isPatternCookie(cNames, cookie)) {
          return true;
        }
      }
    }
    return false;
    }

  var _isPatternCookie = function (cNames, cookie) {
    var patterns = [{"pattern":"^[a-f0-9]{32}$","name":"[abcdef0123456789]{32}"},{"pattern":"^PrestaShop-[a-f0-9]{32}$","name":"PrestaShop-[abcdef0123456789]{32}"},{"pattern":"^LF_session_[a-f0-9]{32}$","name":"LF_session_[abcdef0123456789]{32}"},{"pattern":"^cid_[a-f0-9]{32}$","name":"cid_[abcdef0123456789]{32}"},{"pattern":"^wp_woocommerce_session_[a-f0-9]{32}$","name":"wp_woocommerce_session_[abcdef0123456789]{32}"},{"pattern":"^visa_1_[a-f0-9]{32}$","name":"visa_1_[abcdef0123456789]{32}"},{"pattern":"^yith_wcwl_session_[a-f0-9]{32}$","name":"yith_wcwl_session_[abcdef0123456789]{32}"},{"pattern":"^mp_[a-f0-9]{32}_mixpanel$","name":"mp_[abcdef0123456789]{32}_mixpanel"},{"pattern":"^ps[a-f0-9]{24}$","name":"ps[abcdef0123456789]{24}"}];
    for (var i = 0; i < patterns.length ; i++) {
      var pattern = patterns[i]['pattern'];
      var regex = new RegExp(pattern, 'i')

      if(regex.test(cookie) && _includes(cNames, patterns[i]['name'])) {
        return true;
      }
    }
    return false;
  }

  var _isAcceptCookieAction = function () {
    var actionValue = _readInnerCookieParam('action');
    return Boolean(actionValue && actionValue === 'accept');
  }

  var _isAcceptCookieActionWithAllCategory = function () {
    var actionValue = _readInnerCookieParam('action');
      var categories = _readCategoriesCheckboxesFromCookies();
    return Boolean(actionValue && actionValue === 'accept' && categories.length === allCategory.length);
  
  }

  var _isHasCookieAction = function () {
    var actionValue = _readInnerCookieParam('action');
    return Boolean(actionValue && (actionValue === 'accept' || actionValue === 'reject'));
  }

  var _isCookieScannerRequest = function () {
    return _includes(window.location.hash, 'b01d052f340553efb58be19c7d3bc681') || _cookiesApi.get('CookieScriptScanner')
  }

  var _categoriesCheckboxes = function () {
    var checkboxNodes = document.querySelectorAll('input[data-cookiescript="checkbox-input"]');
    if(typeof checkboxNodes !== 'undefined') {
      return  Array.prototype.slice.call(checkboxNodes);
    }
    return [];
  }

  var _cookiesCategoriesWithoutStrict = function (categories) {
    var array = [];
    for (var i = 0; i < categories.length ; i++) {
      if(categories[i] !== 'strict') {
        array.push(categories[i]);
      }
    }
    return array;
  }

  var _setAllCheckboxesValue = function (value) {
    var checkboxes = _categoriesCheckboxes();
    for (var i = 0; i < checkboxes.length ; i++) {
      var checkbox = checkboxes[i];
      if(checkbox.value === 'strict') {
        checkbox.checked = true;
      } else {
        checkbox.checked = value;
      }
    }
  }

  var _setCheckboxesByCategories = function (categories) {
    var checkboxes = _categoriesCheckboxes();
    for (var i = 0; i < checkboxes.length ; i++) {
      var checkbox = checkboxes[i];
      if (checkbox.value === 'strict' || _includes(categories, checkbox.value)) {
        checkbox.checked = true;
      } else {
        checkbox.checked = false;
      }
    }
  }

  var _setReportPagesCheckboxes = function (categories) {
    if(typeof CookieScriptReport !== 'undefined' && CookieScriptReport.instance) {
      CookieScriptReport.instance.setStateCheckboxes(categories)
    }
  }

  var _readCategoriesCheckboxesFromUI = function () {
    var allowCategories = [];
    var checkboxes = _categoriesCheckboxes();
    for (var i = 0; i < checkboxes.length ; i++) {
      var checkbox = checkboxes[i];
      if(checkbox.checked || checkbox.value === 'strict') {
        allowCategories.push(checkbox.value)
      }
    }
    return _uniqueArray(allowCategories);
  }

  var _readCategoriesCheckboxesFromCookies = function () {
    var cookiesCategories = _readInnerCookieParam('categories');
    var defaultValue = [];
    if(isPresentStrictly) {
      defaultValue = ['strict'];
    }

    if(cookiesCategories) {
      try {
        var array = JSON.parse(cookiesCategories)
        if(isPresentStrictly) {
          array.push('strict');
        }
        return _uniqueArray(array);
      } catch (e) {
        return defaultValue;
      }
    }
    return defaultValue;
  }

  var _getCurrentDescription = function () {
    var element = document.querySelector('#cookiescript_description [data-cs-i18n-text]');
    if(element) {
      return element.getAttribute('data-cs-i18n-read');
    }
    return '';
  }

  var _request = function(params) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', params.url);
      xhr.onload = function() {
        if (xhr.status === 200) {
          try {
            var data = JSON.parse(xhr.responseText)
            params.done(data)
          } catch (e) {
            params.done(xhr.responseText)
          }

        } else {
          _log('ERROR: Request failed.  Returned status for '+ url +' of ' + xhr.status)
        }
      };
      xhr.send();
    } catch (e) {
      _log('ERROR: Yor browser not support request')
    }
  }

  var _writeInnerCookieParam = function (key, value) {
    var cookie_value = _readInnerCookie();
    cookie_value[key] = value;

    try {
      var newValue = JSON.stringify(cookie_value);
      _cookiesApi.set(cookieName, newValue, { expires: Number(expireDays), domain: _domainForInnerCookie });
    } catch (e) {
      _log('Error: Write ' + cookieName + 'value =>' + e);
    }
  }

  var _readInnerCookieParam = function (key) {
    var cookie_value = _readInnerCookie();
    return cookie_value[key];
  }

  var _readInnerCookie = function () {
    var value = _cookiesApi.get(cookieName, { domain: _domainForInnerCookie });
    try {
      return JSON.parse(value);
    } catch (e) {
      return  {};
    }
  }

  var _dispatchDOMContentLoadedEvent = function () {
    try {
      var event;
      if(typeof(Event) === 'function') {
        event = new Event('DOMContentLoaded', {bubbles: true, cancelable: true});
      }else{
        event = document.createEvent('Event');
        event.initEvent('DOMContentLoaded', true, true);
      }
      window.document.dispatchEvent(event);
    } catch (e) {
      _log('Warning: You browser not support dispatch event');
    }
  }

  var _dispatchAcceptAllEvent = function () {
    _this.onAcceptAll();
    _dispatchCustomEvent('CookieScriptAcceptAll');
    if(typeof allCategory !== 'undefined' && allCategory.length > 0) {
      for (var i = 0; i < allCategory.length ; i++) {
        _dispatchCategoryEvent(allCategory[i]);
      }
    } else {
      _dispatchCategoryEvent('all');
    }
  }

  var _dispatchAcceptEvent = function (categories) {
    var data = { categories: _uniqueArray(categories) }
    _this.onAccept(data);
    _dispatchCustomEvent('CookieScriptAccept', data);
    for (var i = 0; i < categories.length ; i++) {
      _dispatchCategoryEvent(categories[i]);
    }
  }

  var _dispatchRejectEvent = function () {
    _this.onReject();
    _dispatchCustomEvent('CookieScriptReject');
    _dispatchCategoryEvent('strict')
  }

  var _dispatchCloseEvent = function () {
    _this.onClose();
    _dispatchCustomEvent('CookieScriptClose');
  }

  var _dispatchCategoryEvent = function (category) {
    var eventName = 'CookieScriptCategory-' + category;
    if(_includes(_this.dispatchEventNames, eventName)) return;

    _this.dispatchEventNames.push(eventName);
    _this.dispatchEventNames = _uniqueArray(_this.dispatchEventNames);
    _dispatchCustomEvent(eventName);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': eventName
    });
  }

  var _domainForInnerCookie = function () {
      return null
    }()

  var _dispatchCustomEvent = function (eventName, data) {
    try {
      var event;
      if(typeof(Event) === 'function') {
        event = new CustomEvent(eventName, {bubbles: true, cancelable: true, detail: data });
      }else{
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, true, true, data);
      }
      window.document.dispatchEvent(event);
    } catch (e) {
      _log('Warning: You browser not support dispatch event');
    }
  }

  var _fadeIn = function ( element, duration ) {
    var opacityElement = _getStyle(element, 'opacity');
    var maxOpacity = opacityElement ? opacityElement : 1
    element.style.opacity = 0;
    element.style.display = '';
    var last = +new Date();
    var tick = function () {
      element.style.opacity = +element.style.opacity + ( new Date() - last ) / duration;
      last = +new Date();
      if ( +element.style.opacity < maxOpacity ) {
        ( window.requestAnimationFrame && requestAnimationFrame( tick ) ) || setTimeout( tick, 16 );
      } else {
        element.style.opacity = '';
      }
    };
    tick();
  }

  var _fadeOut = function ( element, duration ) {
    var opacityElement = _getStyle(element, 'opacity');
    element.style.opacity = opacityElement ? opacityElement : 1;
    var last = +new Date();
    var tick = function () {
      element.style.opacity = +element.style.opacity - ( new Date() - last ) / duration;
      last = +new Date();
      if ( +element.style.opacity > 0 ) {
        ( window.requestAnimationFrame && requestAnimationFrame( tick ) ) || setTimeout( tick, 16 );
      } else {
        element.style.display = 'none';
        element.style.opacity = '';
      }
    };
    tick();
  }

  var _includes = function(container, value) {
    var returnValue = false;
    var pos = container.indexOf(value);
    if (pos >= 0) {
      returnValue = true;
    }
    return returnValue;
  }

  var _appendNodeAfterAndRemove = function (selector, node) {
    selector.insertAdjacentElement('afterend', node);
    selector.parentNode.removeChild(selector);
  }

  var _appendAfterAndRemove = function (selector, text) {
    selector.insertAdjacentHTML('afterend', text);
    selector.parentNode.removeChild(selector);
  }

  var _appendHtml = function (selector, text) {
    selector.insertAdjacentHTML('beforeend', text);
  }

  var _uniqueArray = function (array) {
    var uniqArray = [];
    for (var i=0; i < array.length; i++) {
      if (uniqArray.indexOf(array[i]) === -1 && array[i] !== ''){
        uniqArray.push(array[i]);
      }
    }
    return uniqArray;
  }

  var _log = function(e) {
    console && ('function' == typeof console.warn ? console.warn(e) : console.log && console.log(e));
  }

  var _throwError = function (msg) {
    throw msg;
  }

  // Use this function for add listener event, because IE6-8 not support addEventListener
  var _addEvent = function( element, type, fn, multi ) {
    var addEvent = function (element, type, fn) {
      if(!element) return;
      try {
        if ( element.attachEvent ) {
          element['e'+type+fn] = fn;
          element[type+fn] = function(){element['e'+type+fn]( window.event );}
          element.attachEvent( 'on'+type, element[type+fn] );
        } else {
          element.addEventListener( type, fn, false );
        }
      } catch (e) {
      }
    }

    if(multi && element && element.length > 0) {
      for (var i = 0; i < element.length ; i++) {
        addEvent(element[i], type, fn)
      }
    } else {
      addEvent(element, type, fn)
    }
  }

  // Use this function for add listener event, because IE6-8 not support removeEventListener
  var _removeEvent = function( element, type, fn, multi ) {
    var removeEvent = function (element, type, fn) {
      if(!element) return;
      if ( element.detachEvent ) {
        element.detachEvent( 'on'+type, element[type+fn] );
        element[type+fn] = null;
      } else {
        element.removeEventListener( type, fn, false );
      }
    }

    if(multi && element && element.length > 0) {
      for (var i = 0; i < element.length ; i++) {
        removeEvent(element[i], type, fn)
      }
    } else {
      removeEvent(element, type, fn)
    }
  }

  var _getStyle = function (el, prop) {
    if (typeof getComputedStyle !== 'undefined') {
      return getComputedStyle(el, null).getPropertyValue(prop);
    } else {
      return el.currentStyle[prop];
    }
  }

  var _cookiesApi = function () {
    /*! js-cookie v3.0.0-rc.0 | MIT */
    function assign (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          target[key] = source[key];
        }
      }
      return target
    }
    var defaultConverter = {
      read: function (value) {
        return value.replace(/%3B/g, ';')
      },
      write: function (value) {
        return value.replace(/;/g, '%3B')
      }
    };
    function init (converter, defaultAttributes) {
      function set (key, value, attributes) {
        if (typeof document === 'undefined') {
          return
        }

        attributes = assign({}, defaultAttributes, attributes);

        if (typeof attributes.expires === 'number') {
          var dateExp = new Date();
          dateExp.setTime(dateExp.getTime() + attributes.expires * 864e5)
          attributes.expires = dateExp;
        }
        if (attributes.expires) {
          attributes.expires = attributes.expires.toUTCString();
        }

        key = defaultConverter.write(key).replace(/=/g, '%3D');

        value = converter.write(String(value), key);

        var stringifiedAttributes = '';
        for (var attributeName in attributes) {
          if (!attributes[attributeName]) {
            continue
          }

          stringifiedAttributes += '; ' + attributeName;

          if (attributes[attributeName] === true) {
            continue
          }

          stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
        }

        return (document.cookie = key + '=' + value + stringifiedAttributes)
      }
      function get (key) {
        if (typeof document === 'undefined' || (arguments.length && !key)) {
          return
        }

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all.
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        var jar = {};
        for (var i = 0; i < cookies.length; i++) {
          var parts = cookies[i].split('=');
          var value = parts.slice(1).join('=');
          var foundKey = defaultConverter.read(parts[0]).replace(/%3D/g, '=');
          jar[foundKey] = converter.read(value, foundKey);

          if (key === foundKey) {
            break
          }
        }

        return key ? jar[key] : jar
      }
      return Object.create(
        {
          set: set,
          get: get,
          remove: function (key, attributes) {
            set(
              key,
              '',
              assign({}, attributes, {
                expires: -1
              })
            );
          },
          withAttributes: function (attributes) {
            return init(this.converter, assign({}, this.attributes, attributes))
          },
          withConverter: function (converter) {
            return init(assign({}, this.converter, converter), this.attributes)
          }
        },
        {
          attributes: { value: Object.freeze(defaultAttributes) },
          converter: { value: Object.freeze(converter) }
        }
      )
    }


    var secure = window.location.protocol == 'https:'

    return init(defaultConverter, { path: '/', secure: secure });
  }()

  var _regexParser = function(input) {

    // Validate input
    if (typeof input !== "string") {
      return input
    }

    // Parse input
    var m = input.match(/(\/?)(.+)\1([a-z]*)/i);

    // Invalid flags
    if (m[3] && !/^(?!.*?(.).*?\1)[gmixXsuUAJ]+$/.test(m[3])) {
      return RegExp(input);
    }

    // Create the regular expression
    return new RegExp(m[2], m[3]);
  };

  var _isAuth = function () {
      return true;
    }

  var _sendAnalytics = function (action, categories) {
      return false;
    }

  var _sendCollectConsents = function (action, categories) {
  
    var desc = _getCurrentDescription();
    var dnt = 'yes' === navigator.doNotTrack || '1' === navigator.msDoNotTrack || '1' === navigator.doNotTrack || !1 === navigator.cookieEnabled
    _request({
      url: 'https://consent.cookie-script.com/collect?action='+action+'&time='+(new Date).getTime()+'&page='+encodeURIComponent(currentUrl)+'&dnt='+dnt+'&script='+cookieId+'&consenttext='+encodeURIComponent(desc)+'&category='+categories,
      done: function (data) {
        if(data !== null && data.key) {
          _writeInnerCookieParam('key', data.key);
        }
      }
    })
    };


  var _loadInit = function() {
    _removeSelfHtml();
    _appendHtml(document.body, css);

    //Maybe need apply cookie state when all script load
    if(!_isCookieScannerRequest()) {
      _callApplyCurrentCookiesState();
    }

    if(_isAcceptCookieActionWithAllCategory()) {
      _setConsentCheckbox(true)
    }

    if(_isHasCookieAction()) {
      _addBadge();
    } else {
      if(!_callShowOncePageEffect()) {
        _addBanner();
        _callHideAfterEffect();
        _callAcceptCookiesAfterEffect();
      }
    }

    _setAltForIframes();
    _setConsentCheckboxAndLinkEvent();
    _setScrollEvent();
    _dispatchCustomEvent('CookieScriptLoaded');
  };


  (function () {
    if(CookieScript.instance) return;

    
    //Apply cookie state when init script
    _callApplyCurrentCookiesState();
    if(document.readyState === 'complete') {
      _loadInit();
    } else {
      window.addEventListener('load', _loadInit);
    }
  }())

};

CookieScript.init = function () {
  if(CookieScript.instance) {
    return CookieScript.instance;
  }

  CookieScript.instance = new CookieScript();
  return CookieScript.instance;
}
CookieScript.init()
