/*! UIkit 2.27.5 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(core) {

    var uikit;

    if (!window.jQuery) {
        throw new Error('UIkit 2.x requires jQuery');
    } else {
        uikit = core(window.jQuery);
    }

    if (typeof define == 'function' && define.amd) { // AMD

        define('uikit', function(){

            uikit.load = function(res, req, onload, config) {

                var resources = res.split(','), load = [], i, base = (config.config && config.config.uikit && config.config.uikit.base ? config.config.uikit.base : '').replace(/\/+$/g, '');

                if (!base) {
                    throw new Error('Please define base path to UIkit in the requirejs config.');
                }

                for (i = 0; i < resources.length; i += 1) {
                    var resource = resources[i].replace(/\./g, '/');
                    load.push(base+'/components/'+resource);
                }

                req(load, function() {
                    onload(uikit);
                });
            };

            return uikit;
        });
    }

})(function($) {

    "use strict";

    if (window.UIkit2) {
        return window.UIkit2;
    }

    var UI = {}, _UI = window.UIkit || undefined;

    UI.version = '2.27.5';

    UI.noConflict = function() {
        // restore UIkit version
        if (_UI) {
            window.UIkit = _UI;
            $.UIkit      = _UI;
            $.fn.uk      = _UI.fn;
        }

        return UI;
    };

    window.UIkit2 = UI;

    if (!_UI) {
        window.UIkit = UI;
    }

    // cache jQuery
    UI.$ = $;

    UI.$doc  = UI.$(document);
    UI.$win  = UI.$(window);
    UI.$html = UI.$('html');

    UI.support = {};
    UI.support.transition = (function() {

        var transitionEnd = (function() {

            var element = document.body || document.documentElement,
                transEndEventNames = {
                    WebkitTransition : 'webkitTransitionEnd',
                    MozTransition    : 'transitionend',
                    OTransition      : 'oTransitionEnd otransitionend',
                    transition       : 'transitionend'
                }, name;

            for (name in transEndEventNames) {
                if (element.style[name] !== undefined) return transEndEventNames[name];
            }
        }());

        return transitionEnd && { end: transitionEnd };
    })();

    UI.support.animation = (function() {

        var animationEnd = (function() {

            var element = document.body || document.documentElement,
                animEndEventNames = {
                    WebkitAnimation : 'webkitAnimationEnd',
                    MozAnimation    : 'animationend',
                    OAnimation      : 'oAnimationEnd oanimationend',
                    animation       : 'animationend'
                }, name;

            for (name in animEndEventNames) {
                if (element.style[name] !== undefined) return animEndEventNames[name];
            }
        }());

        return animationEnd && { end: animationEnd };
    })();

    // requestAnimationFrame polyfill
    //https://github.com/darius/requestAnimationFrame
    (function() {

        Date.now = Date.now || function() { return new Date().getTime(); };

        var vendors = ['webkit', 'moz'];
        for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
            var vp = vendors[i];
            window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
            window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                                       || window[vp+'CancelRequestAnimationFrame']);
        }
        if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
            || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
            var lastTime = 0;
            window.requestAnimationFrame = function(callback) {
                var now = Date.now();
                var nextTime = Math.max(lastTime + 16, now);
                return setTimeout(function() { callback(lastTime = nextTime); },
                                  nextTime - now);
            };
            window.cancelAnimationFrame = clearTimeout;
        }
    }());

    UI.support.touch = (
        ('ontouchstart' in document) ||
        (window.DocumentTouch && document instanceof window.DocumentTouch)  ||
        (window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 0) || //IE 10
        (window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 0) || //IE >=11
        false
    );

    UI.support.mutationobserver = (window.MutationObserver || window.WebKitMutationObserver || null);

    UI.Utils = {};

    UI.Utils.isFullscreen = function() {
        return document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.fullscreenElement || false;
    };

    UI.Utils.str2json = function(str, notevil) {
        try {
            if (notevil) {
                return JSON.parse(str
                    // wrap keys without quote with valid double quote
                    .replace(/([\$\w]+)\s*:/g, function(_, $1){return '"'+$1+'":';})
                    // replacing single quote wrapped ones to double quote
                    .replace(/'([^']+)'/g, function(_, $1){return '"'+$1+'"';})
                );
            } else {
                return (new Function('', 'var json = ' + str + '; return JSON.parse(JSON.stringify(json));'))();
            }
        } catch(e) { return false; }
    };

    UI.Utils.debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    UI.Utils.throttle = function (func, limit) {
        var wait = false;
        return function () {
            if (!wait) {
                func.call();
                wait = true;
                setTimeout(function () {
                    wait = false;
                }, limit);
            }
        }
    };

    UI.Utils.removeCssRules = function(selectorRegEx) {
        var idx, idxs, stylesheet, _i, _j, _k, _len, _len1, _len2, _ref;

        if(!selectorRegEx) return;

        setTimeout(function(){
            try {
              _ref = document.styleSheets;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                stylesheet = _ref[_i];
                idxs = [];
                stylesheet.cssRules = stylesheet.cssRules;
                for (idx = _j = 0, _len1 = stylesheet.cssRules.length; _j < _len1; idx = ++_j) {
                  if (stylesheet.cssRules[idx].type === CSSRule.STYLE_RULE && selectorRegEx.test(stylesheet.cssRules[idx].selectorText)) {
                    idxs.unshift(idx);
                  }
                }
                for (_k = 0, _len2 = idxs.length; _k < _len2; _k++) {
                  stylesheet.deleteRule(idxs[_k]);
                }
              }
            } catch (_error) {}
        }, 0);
    };

    UI.Utils.isInView = function(element, options) {

        var $element = $(element);

        if (!$element.is(':visible')) {
            return false;
        }

        var window_left = UI.$win.scrollLeft(), window_top = UI.$win.scrollTop(), offset = $element.offset(), left = offset.left, top = offset.top;

        options = $.extend({topoffset:0, leftoffset:0}, options);

        if (top + $element.height() >= window_top && top - options.topoffset <= window_top + UI.$win.height() &&
            left + $element.width() >= window_left && left - options.leftoffset <= window_left + UI.$win.width()) {
          return true;
        } else {
          return false;
        }
    };

    UI.Utils.checkDisplay = function(context, initanimation) {

        var elements = UI.$('[data-uk-margin], [data-uk-grid-match], [data-uk-grid-margin], [data-uk-check-display]', context || document), animated;

        if (context && !elements.length) {
            elements = $(context);
        }

        elements.trigger('display.uk.check');

        // fix firefox / IE animations
        if (initanimation) {

            if (typeof(initanimation)!='string') {
                initanimation = '[class*="uk-animation-"]';
            }

            elements.find(initanimation).each(function(){

                var ele  = UI.$(this),
                    cls  = ele.attr('class'),
                    anim = cls.match(/uk-animation-(.+)/);

                ele.removeClass(anim[0]).width();

                ele.addClass(anim[0]);
            });
        }

        return elements;
    };

    UI.Utils.options = function(string) {

        if ($.type(string)!='string') return string;

        if (string.indexOf(':') != -1 && string.trim().substr(-1) != '}') {
            string = '{'+string+'}';
        }

        var start = (string ? string.indexOf("{") : -1), options = {};

        if (start != -1) {
            try {
                options = UI.Utils.str2json(string.substr(start));
            } catch (e) {}
        }

        return options;
    };

    UI.Utils.animate = function(element, cls) {

        var d = $.Deferred();

        element = UI.$(element);

        element.css('display', 'none').addClass(cls).one(UI.support.animation.end, function() {
            element.removeClass(cls);
            d.resolve();
        });

        element.css('display', '');

        return d.promise();
    };

    UI.Utils.uid = function(prefix) {
        return (prefix || 'id') + (new Date().getTime())+"RAND"+(Math.ceil(Math.random() * 100000));
    };

    UI.Utils.template = function(str, data) {

        var tokens = str.replace(/\n/g, '\\n').replace(/\{\{\{\s*(.+?)\s*\}\}\}/g, "{{!$1}}").split(/(\{\{\s*(.+?)\s*\}\})/g),
            i=0, toc, cmd, prop, val, fn, output = [], openblocks = 0;

        while(i < tokens.length) {

            toc = tokens[i];

            if(toc.match(/\{\{\s*(.+?)\s*\}\}/)) {
                i = i + 1;
                toc  = tokens[i];
                cmd  = toc[0];
                prop = toc.substring(toc.match(/^(\^|\#|\!|\~|\:)/) ? 1:0);

                switch(cmd) {
                    case '~':
                        output.push('for(var $i=0;$i<'+prop+'.length;$i++) { var $item = '+prop+'[$i];');
                        openblocks++;
                        break;
                    case ':':
                        output.push('for(var $key in '+prop+') { var $val = '+prop+'[$key];');
                        openblocks++;
                        break;
                    case '#':
                        output.push('if('+prop+') {');
                        openblocks++;
                        break;
                    case '^':
                        output.push('if(!'+prop+') {');
                        openblocks++;
                        break;
                    case '/':
                        output.push('}');
                        openblocks--;
                        break;
                    case '!':
                        output.push('__ret.push('+prop+');');
                        break;
                    default:
                        output.push('__ret.push(escape('+prop+'));');
                        break;
                }
            } else {
                output.push("__ret.push('"+toc.replace(/\'/g, "\\'")+"');");
            }
            i = i + 1;
        }

        fn  = new Function('$data', [
            'var __ret = [];',
            'try {',
            'with($data){', (!openblocks ? output.join('') : '__ret = ["Not all blocks are closed correctly."]'), '};',
            '}catch(e){__ret = [e.message];}',
            'return __ret.join("").replace(/\\n\\n/g, "\\n");',
            "function escape(html) { return String(html).replace(/&/g, '&amp;').replace(/\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');}"
        ].join("\n"));

        return data ? fn(data) : fn;
    };

    UI.Utils.focus = function(element, extra) {

        element = $(element);

        if (!element.length) {
            return element;
        }

        var autofocus = element.find('[autofocus]:first'), tabidx;

        if (autofocus.length) {
            return autofocus.focus();
        }

        autofocus = element.find(':input'+(extra && (','+extra) || '')).first();

        if (autofocus.length) {
            return autofocus.focus();
        }

        if (!element.attr('tabindex')) {
            tabidx = 1000;
            element.attr('tabindex', tabidx);
        }

        element[0].focus();

        if (tabidx) {
            element.attr('tabindex', '');
        }

        return element;
    }

    UI.Utils.events       = {};
    UI.Utils.events.click = UI.support.touch ? 'tap' : 'click';

    // deprecated

    UI.fn = function(command, options) {

        var args = arguments, cmd = command.match(/^([a-z\-]+)(?:\.([a-z]+))?/i), component = cmd[1], method = cmd[2];

        if (!UI[component]) {
            $.error('UIkit component [' + component + '] does not exist.');
            return this;
        }

        return this.each(function() {
            var $this = $(this), data = $this.data(component);
            if (!data) $this.data(component, (data = UI[component](this, method ? undefined : options)));
            if (method) data[method].apply(data, Array.prototype.slice.call(args, 1));
        });
    };

    $.UIkit          = UI;
    $.fn.uk          = UI.fn;

    UI.langdirection = UI.$html.attr("dir") == "rtl" ? "right" : "left";

    UI.components    = {};

    UI.component = function(name, def, override) {

        if (UI.components[name] && !override) {
            return UI.components[name];
        }

        var fn = function(element, options) {

            var $this = this;

            this.UIkit   = UI;
            this.element = element ? UI.$(element) : null;
            this.options = $.extend(true, {}, this.defaults, options);
            this.plugins = {};

            if (this.element) {
                this.element.data(name, this);
            }

            this.init();

            (this.options.plugins.length ? this.options.plugins : Object.keys(fn.plugins)).forEach(function(plugin) {

                if (fn.plugins[plugin].init) {
                    fn.plugins[plugin].init($this);
                    $this.plugins[plugin] = true;
                }

            });

            this.trigger('init.uk.component', [name, this]);

            return this;
        };

        fn.plugins = {};

        $.extend(true, fn.prototype, {

            defaults : {plugins: []},

            boot: function(){},
            init: function(){},

            on: function(a1,a2,a3){
                return UI.$(this.element || this).on(a1,a2,a3);
            },

            one: function(a1,a2,a3){
                return UI.$(this.element || this).one(a1,a2,a3);
            },

            off: function(evt){
                return UI.$(this.element || this).off(evt);
            },

            trigger: function(evt, params) {
                return UI.$(this.element || this).trigger(evt, params);
            },

            find: function(selector) {
                return UI.$(this.element ? this.element: []).find(selector);
            },

            proxy: function(obj, methods) {

                var $this = this;

                methods.split(' ').forEach(function(method) {
                    if (!$this[method]) $this[method] = function() { return obj[method].apply(obj, arguments); };
                });
            },

            mixin: function(obj, methods) {

                var $this = this;

                methods.split(' ').forEach(function(method) {
                    if (!$this[method]) $this[method] = obj[method].bind($this);
                });
            },

            option: function() {

                if (arguments.length == 1) {
                    return this.options[arguments[0]] || undefined;
                } else if (arguments.length == 2) {
                    this.options[arguments[0]] = arguments[1];
                }
            }

        }, def);

        this.components[name] = fn;

        this[name] = function() {

            var element, options;

            if (arguments.length) {

                switch(arguments.length) {
                    case 1:

                        if (typeof arguments[0] === 'string' || arguments[0].nodeType || arguments[0] instanceof jQuery) {
                            element = $(arguments[0]);
                        } else {
                            options = arguments[0];
                        }

                        break;
                    case 2:

                        element = $(arguments[0]);
                        options = arguments[1];
                        break;
                }
            }

            if (element && element.data(name)) {
                return element.data(name);
            }

            return (new UI.components[name](element, options));
        };

        if (UI.domready) {
            UI.component.boot(name);
        }

        return fn;
    };

    UI.plugin = function(component, name, def) {
        this.components[component].plugins[name] = def;
    };

    UI.component.boot = function(name) {

        if (UI.components[name].prototype && UI.components[name].prototype.boot && !UI.components[name].booted) {
            UI.components[name].prototype.boot.apply(UI, []);
            UI.components[name].booted = true;
        }
    };

    UI.component.bootComponents = function() {

        for (var component in UI.components) {
            UI.component.boot(component);
        }
    };


    // DOM mutation save ready helper function

    UI.domObservers = [];
    UI.domready     = false;

    UI.ready = function(fn) {

        UI.domObservers.push(fn);

        if (UI.domready) {
            fn(document);
        }
    };

    UI.on = function(a1,a2,a3){

        if (a1 && a1.indexOf('ready.uk.dom') > -1 && UI.domready) {
            a2.apply(UI.$doc);
        }

        return UI.$doc.on(a1,a2,a3);
    };

    UI.one = function(a1,a2,a3){

        if (a1 && a1.indexOf('ready.uk.dom') > -1 && UI.domready) {
            a2.apply(UI.$doc);
            return UI.$doc;
        }

        return UI.$doc.one(a1,a2,a3);
    };

    UI.trigger = function(evt, params) {
        return UI.$doc.trigger(evt, params);
    };

    UI.domObserve = function(selector, fn) {

        if(!UI.support.mutationobserver) return;

        fn = fn || function() {};

        UI.$(selector).each(function() {

            var element  = this,
                $element = UI.$(element);

            if ($element.data('observer')) {
                return;
            }

            try {

                var observer = new UI.support.mutationobserver(UI.Utils.debounce(function(mutations) {
                    fn.apply(element, [$element]);
                    $element.trigger('changed.uk.dom');
                }, 50), {childList: true, subtree: true});

                // pass in the target node, as well as the observer options
                observer.observe(element, { childList: true, subtree: true });

                $element.data('observer', observer);

            } catch(e) {}
        });
    };

    UI.init = function(root) {

        root = root || document;

        UI.domObservers.forEach(function(fn){
            fn(root);
        });
    };

    UI.on('domready.uk.dom', function(){

        UI.init();

        if (UI.domready) UI.Utils.checkDisplay();
    });

    document.addEventListener('DOMContentLoaded', function(){

        var domReady = function() {

            UI.$body = UI.$('body');

            UI.trigger('beforeready.uk.dom');

            UI.component.bootComponents();

            // custom scroll observer
            var rafToken = requestAnimationFrame((function(){

                var memory = {dir: {x:0, y:0}, x: window.pageXOffset, y:window.pageYOffset};

                var fn = function(){
                    // reading this (window.page[X|Y]Offset) causes a full page recalc of the layout in Chrome,
                    // so we only want to do this once
                    var wpxo = window.pageXOffset;
                    var wpyo = window.pageYOffset;

                    // Did the scroll position change since the last time we were here?
                    if (memory.x != wpxo || memory.y != wpyo) {

                        // Set the direction of the scroll and store the new position
                        if (wpxo != memory.x) {memory.dir.x = wpxo > memory.x ? 1:-1; } else { memory.dir.x = 0; }
                        if (wpyo != memory.y) {memory.dir.y = wpyo > memory.y ? 1:-1; } else { memory.dir.y = 0; }

                        memory.x = wpxo;
                        memory.y = wpyo;

                        // Trigger the scroll event, this could probably be sent using memory.clone() but this is
                        // more explicit and easier to see exactly what is being sent in the event.
                        UI.$doc.trigger('scrolling.uk.document', [{
                            dir: {x: memory.dir.x, y: memory.dir.y}, x: wpxo, y: wpyo
                        }]);
                    }

                    cancelAnimationFrame(rafToken);
                    rafToken = requestAnimationFrame(fn);
                };

                if (UI.support.touch) {
                    UI.$html.on('touchmove touchend MSPointerMove MSPointerUp pointermove pointerup', fn);
                }

                if (memory.x || memory.y) fn();

                return fn;

            })());

            // run component init functions on dom
            UI.trigger('domready.uk.dom');

            if (UI.support.touch) {

                // remove css hover rules for touch devices
                // UI.Utils.removeCssRules(/\.uk-(?!navbar).*:hover/);

                // viewport unit fix for uk-height-viewport - should be fixed in iOS 8
                if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {

                    UI.$win.on('load orientationchange resize', UI.Utils.debounce((function(){

                        var fn = function() {
                            $('.uk-height-viewport').css('height', window.innerHeight);
                            return fn;
                        };

                        return fn();

                    })(), 100));
                }
            }

            UI.trigger('afterready.uk.dom');

            // mark that domready is left behind
            UI.domready = true;

            // auto init js components
            if (UI.support.mutationobserver) {

                var initFn = UI.Utils.debounce(function(){
                    requestAnimationFrame(function(){ UI.init(document.body);});
                }, 10);

                (new UI.support.mutationobserver(function(mutations) {

                    var init = false;

                    mutations.every(function(mutation){

                        if (mutation.type != 'childList') return true;

                        for (var i = 0, node; i < mutation.addedNodes.length; ++i) {

                            node = mutation.addedNodes[i];

                            if (node.outerHTML && node.outerHTML.indexOf('data-uk-') !== -1) {
                                return (init = true) && false;
                            }
                        }
                        return true;
                    });

                    if (init) initFn();

                })).observe(document.body, {childList: true, subtree: true});
            }
        };

        if (document.readyState == 'complete' || document.readyState == 'interactive') {
            setTimeout(domReady);
        }

        return domReady;

    }());

    // add touch identifier class
    UI.$html.addClass(UI.support.touch ? 'uk-touch' : 'uk-notouch');

    // add uk-hover class on tap to support overlays on touch devices
    if (UI.support.touch) {

        var hoverset = false,
            exclude,
            hovercls = 'uk-hover',
            selector = '.uk-overlay, .uk-overlay-hover, .uk-overlay-toggle, .uk-animation-hover, .uk-has-hover';

        UI.$html.on('mouseenter touchstart MSPointerDown pointerdown', selector, function() {

            if (hoverset) $('.'+hovercls).removeClass(hovercls);

            hoverset = $(this).addClass(hovercls);

        }).on('mouseleave touchend MSPointerUp pointerup', function(e) {

            exclude = $(e.target).parents(selector);

            if (hoverset) {
                hoverset.not(exclude).removeClass(hovercls);
            }
        });
    }

    return UI;
});

//  Based on Zeptos touch.js
//  https://raw.github.com/madrobby/zepto/master/src/touch.js
//  Zepto.js may be freely distributed under the MIT license.

;(function($){

  if ($.fn.swipeLeft) {
    return;
  }


  var touch = {}, touchTimeout, tapTimeout, swipeTimeout, longTapTimeout, longTapDelay = 750, gesture;
  var hasTouchEvents = 'ontouchstart' in window,
      hasPointerEvents = window.PointerEvent,
      hasTouch = hasTouchEvents
      || window.DocumentTouch && document instanceof DocumentTouch
      || navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 // IE 10
      || navigator.pointerEnabled && navigator.maxTouchPoints > 0; // IE >=11

  function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
  }

  function longTap() {
    longTapTimeout = null;
    if (touch.last) {
      if ( touch.el !== undefined ) touch.el.trigger('longTap');
      touch = {};
    }
  }

  function cancelLongTap() {
    if (longTapTimeout) clearTimeout(longTapTimeout);
    longTapTimeout = null;
  }

  function cancelAll() {
    if (touchTimeout)   clearTimeout(touchTimeout);
    if (tapTimeout)     clearTimeout(tapTimeout);
    if (swipeTimeout)   clearTimeout(swipeTimeout);
    if (longTapTimeout) clearTimeout(longTapTimeout);
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
    touch = {};
  }

  function isPrimaryTouch(event){
    return event.pointerType == event.MSPOINTER_TYPE_TOUCH && event.isPrimary;
  }

  $(function(){
    var now, delta, deltaX = 0, deltaY = 0, firstTouch;

    if ('MSGesture' in window) {
      gesture = new MSGesture();
      gesture.target = document.body;
    }

    $(document)
      .on('MSGestureEnd gestureend', function(e){

        var swipeDirectionFromVelocity = e.originalEvent.velocityX > 1 ? 'Right' : e.originalEvent.velocityX < -1 ? 'Left' : e.originalEvent.velocityY > 1 ? 'Down' : e.originalEvent.velocityY < -1 ? 'Up' : null;

        if (swipeDirectionFromVelocity && touch.el !== undefined) {
          touch.el.trigger('swipe');
          touch.el.trigger('swipe'+ swipeDirectionFromVelocity);
        }
      })
      // MSPointerDown: for IE10
      // pointerdown: for IE11
      .on('touchstart MSPointerDown pointerdown', function(e){

        if(e.type == 'MSPointerDown' && !isPrimaryTouch(e.originalEvent)) return;

        firstTouch = (e.type == 'MSPointerDown' || e.type == 'pointerdown') ? e : e.originalEvent.touches[0];

        now      = Date.now();
        delta    = now - (touch.last || now);
        touch.el = $('tagName' in firstTouch.target ? firstTouch.target : firstTouch.target.parentNode);

        if(touchTimeout) clearTimeout(touchTimeout);

        touch.x1 = firstTouch.pageX;
        touch.y1 = firstTouch.pageY;

        if (delta > 0 && delta <= 250) touch.isDoubleTap = true;

        touch.last = now;
        longTapTimeout = setTimeout(longTap, longTapDelay);

        // adds the current touch contact for IE gesture recognition
        if (e.originalEvent && e.originalEvent.pointerId && gesture && ( e.type == 'MSPointerDown' || e.type == 'pointerdown' || e.type == 'touchstart' ) ) {
          gesture.addPointer(e.originalEvent.pointerId);
        }

      })
      // MSPointerMove: for IE10
      // pointermove: for IE11
      .on('touchmove MSPointerMove pointermove', function(e){

        if (e.type == 'MSPointerMove' && !isPrimaryTouch(e.originalEvent)) return;

        firstTouch = (e.type == 'MSPointerMove' || e.type == 'pointermove') ? e : e.originalEvent.touches[0];

        cancelLongTap();
        touch.x2 = firstTouch.pageX;
        touch.y2 = firstTouch.pageY;

        deltaX += Math.abs(touch.x1 - touch.x2);
        deltaY += Math.abs(touch.y1 - touch.y2);
      })
      // MSPointerUp: for IE10
      // pointerup: for IE11
      .on('touchend MSPointerUp pointerup', function(e){

        if (e.type == 'MSPointerUp' && !isPrimaryTouch(e.originalEvent)) return;

        cancelLongTap();

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) || (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)){

          swipeTimeout = setTimeout(function() {
            if ( touch.el !== undefined ) {
              touch.el.trigger('swipe');
              touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
            }
            touch = {};
          }, 0);

        // normal tap
        } else if ('last' in touch) {

          // don't fire tap when delta position changed by more than 30 pixels,
          // for instance when moving to a point and back to origin
          if (isNaN(deltaX) || (deltaX < 30 && deltaY < 30)) {
            // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
            // ('tap' fires before 'scroll')
            tapTimeout = setTimeout(function() {

              // trigger universal 'tap' with the option to cancelTouch()
              // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
              var event = $.Event('tap');
              event.cancelTouch = cancelAll;
              if ( touch.el !== undefined ) touch.el.trigger(event);

              // trigger double tap immediately
              if (touch.isDoubleTap) {
                if ( touch.el !== undefined ) touch.el.trigger('doubleTap');
                touch = {};
              }

              // trigger single tap after 250ms of inactivity
              else {
                touchTimeout = setTimeout(function(){
                  touchTimeout = null;
                  if ( touch.el !== undefined ) touch.el.trigger('singleTap');
                  touch = {};
                }, 250);
              }
            }, 0);
          } else {
            touch = {};
          }
          deltaX = deltaY = 0;
        }
      })
      // when the browser window loses focus,
      // for example when a modal dialog is shown,
      // cancel all ongoing events
      .on('touchcancel MSPointerCancel pointercancel', function(e){

        // Ignore pointercancel if the event supports touch events, to prevent pointercancel in swipe gesture
        if ((e.type == 'touchcancel' && hasTouchEvents && hasTouch) || (!hasTouchEvents && e.type == 'pointercancel' && hasPointerEvents)) {
          cancelAll();
        }

    });

    // scrolling the window indicates intention of the user
    // to scroll, not tap or swipe, so cancel all ongoing events
    $(window).on('scroll', cancelAll);
  });

  ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
    $.fn[eventName] = function(callback){ return $(this).on(eventName, callback); };
  });
})(jQuery);

(function(UI) {

    "use strict";

    var stacks = [];

    UI.component('stackMargin', {

        defaults: {
            cls: 'uk-margin-small-top',
            rowfirst: false,
            observe: false
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$('[data-uk-margin]', context).each(function() {

                    var ele = UI.$(this);

                    if (!ele.data('stackMargin')) {
                        UI.stackMargin(ele, UI.Utils.options(ele.attr('data-uk-margin')));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            UI.$win.on('resize orientationchange', (function() {

                var fn = function() {
                    $this.process();
                };

                UI.$(function() {
                    fn();
                    UI.$win.on('load', fn);
                });

                return UI.Utils.debounce(fn, 20);
            })());

            this.on('display.uk.check', function(e) {
                if (this.element.is(':visible')) this.process();
            }.bind(this));

            if (this.options.observe) {

                UI.domObserve(this.element, function(e) {
                    if ($this.element.is(':visible')) $this.process();
                });
            }

            stacks.push(this);
        },

        process: function() {

            var $this = this, columns = this.element.children();

            UI.Utils.stackMargin(columns, this.options);

            if (!this.options.rowfirst || !columns.length) {
                return this;
            }

            // Mark first column elements
            var group = {}, minleft = false;

            columns.removeClass(this.options.rowfirst).each(function(offset, $ele){

                $ele = UI.$(this);

                if (this.style.display != 'none') {
                    offset = $ele.offset().left;
                    ((group[offset] = group[offset] || []) && group[offset]).push(this);
                    minleft = minleft === false ? offset : Math.min(minleft, offset);
                }
            });

            UI.$(group[minleft]).addClass(this.options.rowfirst);

            return this;
        }

    });


    // responsive element e.g. iframes

    (function(){

        var elements = [], check = function(ele) {

            if (!ele.is(':visible')) return;

            var width  = ele.parent().width(),
                iwidth = ele.data('width'),
                ratio  = (width / iwidth),
                height = Math.floor(ratio * ele.data('height'));

            ele.css({height: (width < iwidth) ? height : ele.data('height')});
        };

        UI.component('responsiveElement', {

            defaults: {},

            boot: function() {

                // init code
                UI.ready(function(context) {

                    UI.$('iframe.uk-responsive-width, [data-uk-responsive]', context).each(function() {

                        var ele = UI.$(this), obj;

                        if (!ele.data('responsiveElement')) {
                            obj = UI.responsiveElement(ele, {});
                        }
                    });
                });
            },

            init: function() {

                var ele = this.element;

                if (ele.attr('width') && ele.attr('height')) {

                    ele.data({
                        width : ele.attr('width'),
                        height: ele.attr('height')
                    }).on('display.uk.check', function(){
                        check(ele);
                    });

                    check(ele);

                    elements.push(ele);
                }
            }
        });

        UI.$win.on('resize load', UI.Utils.debounce(function(){

            elements.forEach(function(ele){
                check(ele);
            });

        }, 15));

    })();


    // helper

    UI.Utils.stackMargin = function(elements, options) {

        options = UI.$.extend({
            cls: 'uk-margin-small-top'
        }, options);

        elements = UI.$(elements).removeClass(options.cls);

        var min = false;

        elements.each(function(offset, height, pos, $ele){

            $ele   = UI.$(this);

            if ($ele.css('display') != 'none') {

                offset = $ele.offset();
                height = $ele.outerHeight();
                pos    = offset.top + height;

                $ele.data({
                    ukMarginPos: pos,
                    ukMarginTop: offset.top
                });

                if (min === false || (offset.top < min.top) ) {

                    min = {
                        top  : offset.top,
                        left : offset.left,
                        pos  : pos
                    };
                }
            }

        }).each(function($ele) {

            $ele   = UI.$(this);

            if ($ele.css('display') != 'none' && $ele.data('ukMarginTop') > min.top && $ele.data('ukMarginPos') > min.pos) {
                $ele.addClass(options.cls);
            }
        });
    };

    UI.Utils.matchHeights = function(elements, options) {

        elements = UI.$(elements).css('min-height', '');
        options  = UI.$.extend({ row : true }, options);

        var matchHeights = function(group){

            if (group.length < 2) return;

            var max = 0;

            group.each(function() {
                max = Math.max(max, UI.$(this).outerHeight());
            }).each(function() {

                var element = UI.$(this),
                    height  = max - (element.css('box-sizing') == 'border-box' ? 0 : (element.outerHeight() - element.height()));

                element.css('min-height', height + 'px');
            });
        };

        if (options.row) {

            elements.first().width(); // force redraw

            setTimeout(function(){

                var lastoffset = false, group = [];

                elements.each(function() {

                    var ele = UI.$(this), offset = ele.offset().top;

                    if (offset != lastoffset && group.length) {

                        matchHeights(UI.$(group));
                        group  = [];
                        offset = ele.offset().top;
                    }

                    group.push(ele);
                    lastoffset = offset;
                });

                if (group.length) {
                    matchHeights(UI.$(group));
                }

            }, 0);

        } else {
            matchHeights(elements);
        }
    };

    (function(cacheSvgs){

        UI.Utils.inlineSvg = function(selector, root) {

            var images = UI.$(selector || 'img[src$=".svg"]', root || document).each(function(){

                var img = UI.$(this),
                    src = img.attr('src');

                if (!cacheSvgs[src]) {

                    var d = UI.$.Deferred();

                    UI.$.get(src, {nc: Math.random()}, function(data){
                        d.resolve(UI.$(data).find('svg'));
                    });

                    cacheSvgs[src] = d.promise();
                }

                cacheSvgs[src].then(function(svg) {

                    var $svg = UI.$(svg).clone();

                    if (img.attr('id')) $svg.attr('id', img.attr('id'));
                    if (img.attr('class')) $svg.attr('class', img.attr('class'));
                    if (img.attr('style')) $svg.attr('style', img.attr('style'));

                    if (img.attr('width')) {
                        $svg.attr('width', img.attr('width'));
                        if (!img.attr('height'))  $svg.removeAttr('height');
                    }

                    if (img.attr('height')){
                        $svg.attr('height', img.attr('height'));
                        if (!img.attr('width')) $svg.removeAttr('width');
                    }

                    img.replaceWith($svg);
                });
            });
        };

        // init code
        UI.ready(function(context) {
            UI.Utils.inlineSvg('[data-uk-svg]', context);
        });

    })({});

    UI.Utils.getCssVar = function(name) {

        /* usage in css:  .var-name:before { content:"xyz" } */

        var val, doc = document.documentElement, element = doc.appendChild(document.createElement('div'));

        element.classList.add('var-'+name);

        try {
            val = JSON.parse(val = getComputedStyle(element, ':before').content.replace(/^["'](.*)["']$/, '$1'));
        } catch (e) {
            val = undefined;
        }

        doc.removeChild(element);

        return val;
    }

})(UIkit2);

(function(UI) {

    "use strict";

    UI.component('smoothScroll', {

        boot: function() {

            // init code
            UI.$html.on('click.smooth-scroll.uikit', '[data-uk-smooth-scroll]', function(e) {
                var ele = UI.$(this);

                if (!ele.data('smoothScroll')) {
                    var obj = UI.smoothScroll(ele, UI.Utils.options(ele.attr('data-uk-smooth-scroll')));
                    ele.trigger('click');
                }

                return false;
            });
        },

        init: function() {

            var $this = this;

            this.on('click', function(e) {
                e.preventDefault();
                scrollToElement(UI.$(this.hash).length ? UI.$(this.hash) : UI.$('body'), $this.options);
            });
        }
    });

    function scrollToElement(ele, options) {

        options = UI.$.extend({
            duration: 1000,
            transition: 'easeOutExpo',
            offset: 0,
            complete: function(){}
        }, options);

        // get / set parameters
        var target    = ele.offset().top - options.offset,
            docheight = UI.$doc.height(),
            winheight = window.innerHeight;

        if ((target + winheight) > docheight) {
            target = docheight - winheight;
        }

        // animate to target, fire callback when done
        UI.$('html,body').stop().animate({scrollTop: target}, options.duration, options.transition).promise().done(options.complete);
    }

    UI.Utils.scrollToElement = scrollToElement;

    if (!UI.$.easing.easeOutExpo) {
        UI.$.easing.easeOutExpo = function(x, t, b, c, d) { return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b; };
    }

})(UIkit2);

(function(UI) {

    "use strict";

    var $win           = UI.$win,
        $doc           = UI.$doc,
        scrollspies    = [],
        checkScrollSpy = function() {
            for(var i=0; i < scrollspies.length; i++) {
                window.requestAnimationFrame.apply(window, [scrollspies[i].check]);
            }
        };

    UI.component('scrollspy', {

        defaults: {
            target     : false,
            cls        : 'uk-scrollspy-inview',
            initcls    : 'uk-scrollspy-init-inview',
            topoffset  : 0,
            leftoffset : 0,
            repeat     : false,
            delay      : 0
        },

        boot: function() {

            // listen to scroll and resize
            $doc.on('scrolling.uk.document', checkScrollSpy);
            $win.on('load resize orientationchange', UI.Utils.debounce(checkScrollSpy, 50));

            // init code
            UI.ready(function(context) {

                UI.$('[data-uk-scrollspy]', context).each(function() {

                    var element = UI.$(this);

                    if (!element.data('scrollspy')) {
                        var obj = UI.scrollspy(element, UI.Utils.options(element.attr('data-uk-scrollspy')));
                    }
                });
            });
        },

        init: function() {

            var $this = this, inviewstate, initinview, togglecls = this.options.cls.split(/,/), fn = function(){

                var elements     = $this.options.target ? $this.element.find($this.options.target) : $this.element,
                    delayIdx     = elements.length === 1 ? 1 : 0,
                    toggleclsIdx = 0;

                elements.each(function(idx){

                    var element     = UI.$(this),
                        inviewstate = element.data('inviewstate'),
                        inview      = UI.Utils.isInView(element, $this.options),
                        toggle      = element.attr('data-uk-scrollspy-cls') || togglecls[toggleclsIdx].trim();

                    if (inview && !inviewstate && !element.data('scrollspy-idle')) {

                        if (!initinview) {
                            element.addClass($this.options.initcls);
                            $this.offset = element.offset();
                            initinview = true;

                            element.trigger('init.uk.scrollspy');
                        }

                        element.data('scrollspy-idle', setTimeout(function(){

                            element.addClass('uk-scrollspy-inview').toggleClass(toggle).width();
                            element.trigger('inview.uk.scrollspy');

                            element.data('scrollspy-idle', false);
                            element.data('inviewstate', true);

                        }, $this.options.delay * delayIdx));

                        delayIdx++;
                    }

                    if (!inview && inviewstate && $this.options.repeat) {

                        if (element.data('scrollspy-idle')) {
                            clearTimeout(element.data('scrollspy-idle'));
                            element.data('scrollspy-idle', false);
                        }

                        element.removeClass('uk-scrollspy-inview').toggleClass(toggle);
                        element.data('inviewstate', false);

                        element.trigger('outview.uk.scrollspy');
                    }

                    toggleclsIdx = togglecls[toggleclsIdx + 1] ? (toggleclsIdx + 1) : 0;

                });
            };

            fn();

            this.check = fn;

            scrollspies.push(this);
        }
    });


    var scrollspynavs = [],
        checkScrollSpyNavs = function() {
            for(var i=0; i < scrollspynavs.length; i++) {
                window.requestAnimationFrame.apply(window, [scrollspynavs[i].check]);
            }
        };

    UI.component('scrollspynav', {

        defaults: {
            cls          : 'uk-active',
            closest      : false,
            topoffset    : 0,
            leftoffset   : 0,
            smoothscroll : false
        },

        boot: function() {

            // listen to scroll and resize
            $doc.on('scrolling.uk.document', checkScrollSpyNavs);
            $win.on('resize orientationchange', UI.Utils.debounce(checkScrollSpyNavs, 50));

            // init code
            UI.ready(function(context) {

                UI.$('[data-uk-scrollspy-nav]', context).each(function() {

                    var element = UI.$(this);

                    if (!element.data('scrollspynav')) {
                        var obj = UI.scrollspynav(element, UI.Utils.options(element.attr('data-uk-scrollspy-nav')));
                    }
                });
            });
        },

        init: function() {

            var ids     = [],
                links   = this.find("a[href^='#']").each(function(){ if(this.getAttribute('href').trim()!=='#') ids.push(this.getAttribute('href')); }),
                targets = UI.$(ids.join(",")),

                clsActive  = this.options.cls,
                clsClosest = this.options.closest || this.options.closest;

            var $this = this, inviews, fn = function(){

                inviews = [];

                for (var i=0 ; i < targets.length ; i++) {
                    if (UI.Utils.isInView(targets.eq(i), $this.options)) {
                        inviews.push(targets.eq(i));
                    }
                }

                if (inviews.length) {

                    var navitems,
                        scrollTop = $win.scrollTop(),
                        target = (function(){
                            for(var i=0; i< inviews.length;i++){
                                if (inviews[i].offset().top - $this.options.topoffset >= scrollTop){
                                    return inviews[i];
                                }
                            }
                        })();

                    if (!target) return;

                    if ($this.options.closest) {
                        links.blur().closest(clsClosest).removeClass(clsActive);
                        navitems = links.filter("a[href='#"+target.attr('id')+"']").closest(clsClosest).addClass(clsActive);
                    } else {
                        navitems = links.removeClass(clsActive).filter("a[href='#"+target.attr("id")+"']").addClass(clsActive);
                    }

                    $this.element.trigger('inview.uk.scrollspynav', [target, navitems]);
                }
            };

            if (this.options.smoothscroll && UI.smoothScroll) {
                links.each(function(){
                    UI.smoothScroll(this, $this.options.smoothscroll);
                });
            }

            fn();

            this.element.data('scrollspynav', this);

            this.check = fn;
            scrollspynavs.push(this);

        }
    });

})(UIkit2);

(function(UI){

    "use strict";

    var toggles = [];

    UI.component('toggle', {

        defaults: {
            target    : false,
            cls       : 'uk-hidden',
            animation : false,
            duration  : 200
        },

        boot: function(){

            // init code
            UI.ready(function(context) {

                UI.$('[data-uk-toggle]', context).each(function() {
                    var ele = UI.$(this);

                    if (!ele.data('toggle')) {
                        var obj = UI.toggle(ele, UI.Utils.options(ele.attr('data-uk-toggle')));
                    }
                });

                setTimeout(function(){

                    toggles.forEach(function(toggle){
                        toggle.getToggles();
                    });

                }, 0);
            });
        },

        init: function() {

            var $this = this;

            this.aria = (this.options.cls.indexOf('uk-hidden') !== -1);

            this.on('click', function(e) {

                if ($this.element.is('a[href="#"]')) {
                    e.preventDefault();
                }

                $this.toggle();
            });

            toggles.push(this);
        },

        toggle: function() {

            this.getToggles();

            if(!this.totoggle.length) return;

            if (this.options.animation && UI.support.animation) {

                var $this = this, animations = this.options.animation.split(',');

                if (animations.length == 1) {
                    animations[1] = animations[0];
                }

                animations[0] = animations[0].trim();
                animations[1] = animations[1].trim();

                this.totoggle.css('animation-duration', this.options.duration+'ms');

                this.totoggle.each(function(){

                    var ele = UI.$(this);

                    if (ele.hasClass($this.options.cls)) {

                        ele.toggleClass($this.options.cls);

                        UI.Utils.animate(ele, animations[0]).then(function(){
                            ele.css('animation-duration', '');
                            UI.Utils.checkDisplay(ele);
                        });

                    } else {

                        UI.Utils.animate(this, animations[1]+' uk-animation-reverse').then(function(){
                            ele.toggleClass($this.options.cls).css('animation-duration', '');
                            UI.Utils.checkDisplay(ele);
                        });

                    }

                });

            } else {
                this.totoggle.toggleClass(this.options.cls);
                UI.Utils.checkDisplay(this.totoggle);
            }

            this.updateAria();

        },

        getToggles: function() {
            this.totoggle = this.options.target ? UI.$(this.options.target):[];
            this.updateAria();
        },

        updateAria: function() {
            if (this.aria && this.totoggle.length) {
                this.totoggle.not('[aria-hidden]').each(function(){
                    UI.$(this).attr('aria-hidden', UI.$(this).hasClass('uk-hidden'));
                });
            }
        }
    });

})(UIkit2);

(function(UI) {

    "use strict";

    UI.component('alert', {

        defaults: {
            fade: true,
            duration: 200,
            trigger: '.uk-alert-close'
        },

        boot: function() {

            // init code
            UI.$html.on('click.alert.uikit', '[data-uk-alert]', function(e) {

                var ele = UI.$(this);

                if (!ele.data('alert')) {

                    var alert = UI.alert(ele, UI.Utils.options(ele.attr('data-uk-alert')));

                    if (UI.$(e.target).is(alert.options.trigger)) {
                        e.preventDefault();
                        alert.close();
                    }
                }
            });
        },

        init: function() {

            var $this = this;

            this.on('click', this.options.trigger, function(e) {
                e.preventDefault();
                $this.close();
            });
        },

        close: function() {

            var element       = this.trigger('close.uk.alert'),
                removeElement = function () {
                    this.trigger('closed.uk.alert').remove();
                }.bind(this);

            if (this.options.fade) {
                element.css('overflow', 'hidden').css("max-height", element.height()).animate({
                    height         : 0,
                    opacity        : 0,
                    paddingTop    : 0,
                    paddingBottom : 0,
                    marginTop     : 0,
                    marginBottom  : 0
                }, this.options.duration, removeElement);
            } else {
                removeElement();
            }
        }

    });

})(UIkit2);

(function(UI) {

    "use strict";

    UI.component('buttonRadio', {

        defaults: {
            activeClass: 'uk-active',
            target: '.uk-button'
        },

        boot: function() {

            // init code
            UI.$html.on('click.buttonradio.uikit', '[data-uk-button-radio]', function(e) {

                var ele = UI.$(this);

                if (!ele.data('buttonRadio')) {

                    var obj    = UI.buttonRadio(ele, UI.Utils.options(ele.attr('data-uk-button-radio'))),
                        target = UI.$(e.target);

                    if (target.is(obj.options.target)) {
                        target.trigger('click');
                    }
                }
            });
        },

        init: function() {

            var $this = this;

            // Init ARIA
            this.find($this.options.target).attr('aria-checked', 'false').filter('.' + $this.options.activeClass).attr('aria-checked', 'true');

            this.on('click', this.options.target, function(e) {

                var ele = UI.$(this);

                if (ele.is('a[href="#"]')) e.preventDefault();

                $this.find($this.options.target).not(ele).removeClass($this.options.activeClass).blur();
                ele.addClass($this.options.activeClass);

                // Update ARIA
                $this.find($this.options.target).not(ele).attr('aria-checked', 'false');
                ele.attr('aria-checked', 'true');

                $this.trigger('change.uk.button', [ele]);
            });

        },

        getSelected: function() {
            return this.find('.' + this.options.activeClass);
        }
    });

    UI.component('buttonCheckbox', {

        defaults: {
            activeClass: 'uk-active',
            target: '.uk-button'
        },

        boot: function() {

            UI.$html.on('click.buttoncheckbox.uikit', '[data-uk-button-checkbox]', function(e) {
                var ele = UI.$(this);

                if (!ele.data('buttonCheckbox')) {

                    var obj    = UI.buttonCheckbox(ele, UI.Utils.options(ele.attr('data-uk-button-checkbox'))),
                        target = UI.$(e.target);

                    if (target.is(obj.options.target)) {
                        target.trigger('click');
                    }
                }
            });
        },

        init: function() {

            var $this = this;

            // Init ARIA
            this.find($this.options.target).attr('aria-checked', 'false').filter('.' + $this.options.activeClass).attr('aria-checked', 'true');

            this.on('click', this.options.target, function(e) {
                var ele = UI.$(this);

                if (ele.is('a[href="#"]')) e.preventDefault();

                ele.toggleClass($this.options.activeClass).blur();

                // Update ARIA
                ele.attr('aria-checked', ele.hasClass($this.options.activeClass));

                $this.trigger('change.uk.button', [ele]);
            });

        },

        getSelected: function() {
            return this.find('.' + this.options.activeClass);
        }
    });


    UI.component('button', {

        defaults: {},

        boot: function() {

            UI.$html.on('click.button.uikit', '[data-uk-button]', function(e) {
                var ele = UI.$(this);

                if (!ele.data('button')) {

                    var obj = UI.button(ele, UI.Utils.options(ele.attr('data-uk-button')));
                    ele.trigger('click');
                }
            });
        },

        init: function() {

            var $this = this;

            // Init ARIA
            this.element.attr('aria-pressed', this.element.hasClass("uk-active"));

            this.on('click', function(e) {

                if ($this.element.is('a[href="#"]')) e.preventDefault();

                $this.toggle();
                $this.trigger('change.uk.button', [$this.element.blur().hasClass('uk-active')]);
            });

        },

        toggle: function() {
            this.element.toggleClass('uk-active');

            // Update ARIA
            this.element.attr('aria-pressed', this.element.hasClass('uk-active'));
        }
    });

})(UIkit2);

(function(UI) {

    "use strict";

    var active = false, hoverIdle, flips = {
        x: {
            'bottom-left'   : 'bottom-right',
            'bottom-right'  : 'bottom-left',
            'bottom-center' : 'bottom-center',
            'top-left'      : 'top-right',
            'top-right'     : 'top-left',
            'top-center'    : 'top-center',
            'left-top'      : 'right-top',
            'left-bottom'   : 'right-bottom',
            'left-center'   : 'right-center',
            'right-top'     : 'left-top',
            'right-bottom'  : 'left-bottom',
            'right-center'  : 'left-center'
        },
        y: {
            'bottom-left'   : 'top-left',
            'bottom-right'  : 'top-right',
            'bottom-center' : 'top-center',
            'top-left'      : 'bottom-left',
            'top-right'     : 'bottom-right',
            'top-center'    : 'bottom-center',
            'left-top'      : 'left-bottom',
            'left-bottom'   : 'left-top',
            'left-center'   : 'left-center',
            'right-top'     : 'right-bottom',
            'right-bottom'  : 'right-top',
            'right-center'  : 'right-center'
        },
        xy: {
            'bottom-left'   : 'top-right',
            'bottom-right'  : 'top-left',
            'bottom-center' : 'top-center',
            'top-left'      : 'bottom-right',
            'top-right'     : 'bottom-left',
            'top-center'    : 'bottom-center',
            'left-top'      : 'right-bottom',
            'left-bottom'   : 'right-top',
            'left-center'   : 'right-center',
            'right-top'     : 'left-bottom',
            'right-bottom'  : 'left-top',
            'right-center'  : 'left-center'
        }
    };

    UI.component('dropdown', {

        defaults: {
           mode            : 'hover',
           pos             : 'bottom-left',
           offset          : 0,
           remaintime      : 800,
           justify         : false,
           boundary        : UI.$win,
           delay           : 0,
           dropdownSelector: '.uk-dropdown,.uk-dropdown-blank',
           hoverDelayIdle  : 250,
           preventflip     : false
        },

        remainIdle: false,

        boot: function() {

            var triggerevent = UI.support.touch ? 'click' : 'mouseenter';

            // init code
            UI.$html.on(triggerevent+'.dropdown.uikit focus pointerdown', '[data-uk-dropdown]', function(e) {

                var ele = UI.$(this);

                if (!ele.data('dropdown')) {

                    var dropdown = UI.dropdown(ele, UI.Utils.options(ele.attr('data-uk-dropdown')));

                    if (e.type=='click' || (e.type=='mouseenter' && dropdown.options.mode=='hover')) {
                        dropdown.element.trigger(triggerevent);
                    }

                    if (dropdown.dropdown.length) {
                        e.preventDefault();
                    }
                }
            });
        },

        init: function() {

            var $this = this;

            this.dropdown     = this.find(this.options.dropdownSelector);
            this.offsetParent = this.dropdown.parents().filter(function() {
                return UI.$.inArray(UI.$(this).css('position'), ['relative', 'fixed', 'absolute']) !== -1;
            }).slice(0,1);

            if (!this.offsetParent.length) {
                this.offsetParent = this.element;
            }

            this.centered  = this.dropdown.hasClass('uk-dropdown-center');
            this.justified = this.options.justify ? UI.$(this.options.justify) : false;

            this.boundary  = UI.$(this.options.boundary);

            if (!this.boundary.length) {
                this.boundary = UI.$win;
            }

            // legacy DEPRECATED!
            if (this.dropdown.hasClass('uk-dropdown-up')) {
                this.options.pos = 'top-left';
            }
            if (this.dropdown.hasClass('uk-dropdown-flip')) {
                this.options.pos = this.options.pos.replace('left','right');
            }
            if (this.dropdown.hasClass('uk-dropdown-center')) {
                this.options.pos = this.options.pos.replace(/(left|right)/,'center');
            }
            //-- end legacy

            // Init ARIA
            this.element.attr('aria-haspopup', 'true');
            this.element.attr('aria-expanded', this.element.hasClass('uk-open'));
            this.dropdown.attr('aria-hidden', 'true');

            if (this.options.mode == 'click' || UI.support.touch) {

                this.on('click.uk.dropdown', function(e) {

                    var $target = UI.$(e.target);

                    if (!$target.parents($this.options.dropdownSelector).length) {

                        if ($target.is("a[href='#']") || $target.parent().is("a[href='#']") || ($this.dropdown.length && !$this.dropdown.is(':visible')) ){
                            e.preventDefault();
                        }

                        $target.blur();
                    }

                    if (!$this.element.hasClass('uk-open')) {

                        $this.show();

                    } else {

                        if (!$this.dropdown.find(e.target).length || $target.is('.uk-dropdown-close') || $target.parents('.uk-dropdown-close').length) {
                            $this.hide();
                        }
                    }
                });

            } else {

                this.on('mouseenter', function(e) {

                    $this.trigger('pointerenter.uk.dropdown', [$this]);

                    if ($this.remainIdle) {
                        clearTimeout($this.remainIdle);
                    }

                    if (hoverIdle) {
                        clearTimeout(hoverIdle);
                    }

                    if (active && active == $this) {
                        return;
                    }

                    // pseudo manuAim
                    if (active && active != $this) {

                        hoverIdle = setTimeout(function() {
                            hoverIdle = setTimeout($this.show.bind($this), $this.options.delay);
                        }, $this.options.hoverDelayIdle);

                    } else {

                        hoverIdle = setTimeout($this.show.bind($this), $this.options.delay);
                    }

                }).on('mouseleave', function() {

                    if (hoverIdle) {
                        clearTimeout(hoverIdle);
                    }

                    $this.remainIdle = setTimeout(function() {
                        if (active && active == $this) $this.hide();
                    }, $this.options.remaintime);

                    $this.trigger('pointerleave.uk.dropdown', [$this]);

                }).on('click', function(e){

                    var $target = UI.$(e.target);

                    if ($this.remainIdle) {
                        clearTimeout($this.remainIdle);
                    }

                    if (active && active == $this) {
                        if (!$this.dropdown.find(e.target).length || $target.is('.uk-dropdown-close') || $target.parents('.uk-dropdown-close').length) {
                            $this.hide();
                        }
                        return;
                    }

                    if ($target.is("a[href='#']") || $target.parent().is("a[href='#']")){
                        e.preventDefault();
                    }

                    $this.show();
                });
            }
        },

        show: function(){

            UI.$html.off('click.outer.dropdown');

            if (active && active != this) {
                active.hide(true);
            }

            if (hoverIdle) {
                clearTimeout(hoverIdle);
            }

            this.trigger('beforeshow.uk.dropdown', [this]);

            this.checkDimensions();
            this.element.addClass('uk-open');

            // Update ARIA
            this.element.attr('aria-expanded', 'true');
            this.dropdown.attr('aria-hidden', 'false');

            this.trigger('show.uk.dropdown', [this]);

            UI.Utils.checkDisplay(this.dropdown, true);
            UI.Utils.focus(this.dropdown);
            active = this;

            this.registerOuterClick();
        },

        hide: function(force) {

            this.trigger('beforehide.uk.dropdown', [this, force]);

            this.element.removeClass('uk-open');

            if (this.remainIdle) {
                clearTimeout(this.remainIdle);
            }

            this.remainIdle = false;

            // Update ARIA
            this.element.attr('aria-expanded', 'false');
            this.dropdown.attr('aria-hidden', 'true');

            this.trigger('hide.uk.dropdown', [this, force]);

            if (active == this) active = false;
        },

        registerOuterClick: function(){

            var $this = this;

            UI.$html.off('click.outer.dropdown');

            setTimeout(function() {

                UI.$html.on('click.outer.dropdown', function(e) {

                    if (hoverIdle) {
                        clearTimeout(hoverIdle);
                    }

                    var $target = UI.$(e.target);

                    if (active == $this && !$this.element.find(e.target).length) {
                        $this.hide(true);
                        UI.$html.off('click.outer.dropdown');
                    }
                });
            }, 10);
        },

        checkDimensions: function() {

            if (!this.dropdown.length) return;

            // reset
            this.dropdown.removeClass('uk-dropdown-top uk-dropdown-bottom uk-dropdown-left uk-dropdown-right uk-dropdown-stack uk-dropdown-autoflip').css({
                topLeft :'',
                left :'',
                marginLeft :'',
                marginRight :''
            });

            if (this.justified && this.justified.length) {
                this.dropdown.css('min-width', '');
            }

            var $this          = this,
                pos            = UI.$.extend({}, this.offsetParent.offset(), {width: this.offsetParent[0].offsetWidth, height: this.offsetParent[0].offsetHeight}),
                posoffset      = this.options.offset,
                dropdown       = this.dropdown,
                offset         = dropdown.show().offset() || {left: 0, top: 0},
                width          = dropdown.outerWidth(),
                height         = dropdown.outerHeight(),
                boundarywidth  = this.boundary.width(),
                boundaryoffset = this.boundary[0] !== window && this.boundary.offset() ? this.boundary.offset(): {top:0, left:0},
                dpos           = this.options.pos;

            var variants =  {
                    'bottom-left'   : {top: 0 + pos.height + posoffset, left: 0},
                    'bottom-right'  : {top: 0 + pos.height + posoffset, left: 0 + pos.width - width},
                    'bottom-center' : {top: 0 + pos.height + posoffset, left: 0 + pos.width / 2 - width / 2},
                    'top-left'      : {top: 0 - height - posoffset, left: 0},
                    'top-right'     : {top: 0 - height - posoffset, left: 0 + pos.width - width},
                    'top-center'    : {top: 0 - height - posoffset, left: 0 + pos.width / 2 - width / 2},
                    'left-top'      : {top: 0, left: 0 - width - posoffset},
                    'left-bottom'   : {top: 0 + pos.height - height, left: 0 - width - posoffset},
                    'left-center'   : {top: 0 + pos.height / 2 - height / 2, left: 0 - width - posoffset},
                    'right-top'     : {top: 0, left: 0 + pos.width + posoffset},
                    'right-bottom'  : {top: 0 + pos.height - height, left: 0 + pos.width + posoffset},
                    'right-center'  : {top: 0 + pos.height / 2 - height / 2, left: 0 + pos.width + posoffset}
                },
                css = {},
                pp;

            pp = dpos.split('-');
            css = variants[dpos] ? variants[dpos] : variants['bottom-left'];

            // justify dropdown
            if (this.justified && this.justified.length) {
                justify(dropdown.css({left:0}), this.justified, boundarywidth);
            } else {

                if (this.options.preventflip !== true) {

                    var fdpos;

                    switch(this.checkBoundary(pos.left + css.left, pos.top + css.top, width, height, boundarywidth)) {
                        case "x":
                            if(this.options.preventflip !=='x') fdpos = flips['x'][dpos] || 'right-top';
                            break;
                        case "y":
                            if(this.options.preventflip !=='y') fdpos = flips['y'][dpos] || 'top-left';
                            break;
                        case "xy":
                            if(!this.options.preventflip) fdpos = flips['xy'][dpos] || 'right-bottom';
                            break;
                    }

                    if (fdpos) {

                        pp  = fdpos.split('-');
                        css = variants[fdpos] ? variants[fdpos] : variants['bottom-left'];
                        dropdown.addClass('uk-dropdown-autoflip');

                        // check flipped
                        if (this.checkBoundary(pos.left + css.left, pos.top + css.top, width, height, boundarywidth)) {
                            pp  = dpos.split('-');
                            css = variants[dpos] ? variants[dpos] : variants['bottom-left'];
                        }
                    }
                }
            }

            if (width > boundarywidth) {
                dropdown.addClass('uk-dropdown-stack');
                this.trigger('stack.uk.dropdown', [this]);
            }

            dropdown.css(css).css('display', '').addClass('uk-dropdown-'+pp[0]);
        },

        checkBoundary: function(left, top, width, height, boundarywidth) {

            var axis = "";

            if (left < 0 || ((left - UI.$win.scrollLeft())+width) > boundarywidth) {
               axis += "x";
            }

            if ((top - UI.$win.scrollTop()) < 0 || ((top - UI.$win.scrollTop())+height) > window.innerHeight) {
               axis += "y";
            }

            return axis;
        }
    });


    UI.component('dropdownOverlay', {

        defaults: {
           justify : false,
           cls     : '',
           duration: 200
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$('[data-uk-dropdown-overlay]', context).each(function() {
                    var ele = UI.$(this);

                    if (!ele.data('dropdownOverlay')) {
                        UI.dropdownOverlay(ele, UI.Utils.options(ele.attr('data-uk-dropdown-overlay')));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.justified = this.options.justify ? UI.$(this.options.justify) : false;
            this.overlay   = this.element.find('uk-dropdown-overlay');

            if (!this.overlay.length) {
                this.overlay = UI.$('<div class="uk-dropdown-overlay"></div>').appendTo(this.element);
            }

            this.overlay.addClass(this.options.cls);

            this.on({

                'beforeshow.uk.dropdown': function(e, dropdown) {
                    $this.dropdown = dropdown;

                    if ($this.justified && $this.justified.length) {
                        justify($this.overlay.css({display:'block', marginLeft:'', marginRight:''}), $this.justified, $this.justified.outerWidth());
                    }
                },

                'show.uk.dropdown': function(e, dropdown) {

                    var h = $this.dropdown.dropdown.outerHeight(true);

                    $this.dropdown.element.removeClass('uk-open');

                    $this.overlay.stop().css('display', 'block').animate({height: h}, $this.options.duration, function() {

                       $this.dropdown.dropdown.css('visibility', '');
                       $this.dropdown.element.addClass('uk-open');

                       UI.Utils.checkDisplay($this.dropdown.dropdown, true);
                    });

                    $this.pointerleave = false;
                },

                'hide.uk.dropdown': function() {
                    $this.overlay.stop().animate({height: 0}, $this.options.duration);
                },

                'pointerenter.uk.dropdown': function(e, dropdown) {
                    clearTimeout($this.remainIdle);
                },

                'pointerleave.uk.dropdown': function(e, dropdown) {
                    $this.pointerleave = true;
                }
            });


            this.overlay.on({

                'mouseenter': function() {
                    if ($this.remainIdle) {
                        clearTimeout($this.dropdown.remainIdle);
                        clearTimeout($this.remainIdle);
                    }
                },

                'mouseleave': function(){

                    if ($this.pointerleave && active) {

                        $this.remainIdle = setTimeout(function() {
                           if(active) active.hide();
                        }, active.options.remaintime);
                    }
                }
            })
        }

    });


    function justify(ele, justifyTo, boundarywidth, offset) {

        ele           = UI.$(ele);
        justifyTo     = UI.$(justifyTo);
        boundarywidth = boundarywidth || window.innerWidth;
        offset        = offset || ele.offset();

        if (justifyTo.length) {

            var jwidth = justifyTo.outerWidth();

            ele.css('min-width', jwidth);

            if (UI.langdirection == 'right') {

                var right1   = boundarywidth - (justifyTo.offset().left + jwidth),
                    right2   = boundarywidth - (ele.offset().left + ele.outerWidth());

                ele.css('margin-right', right1 - right2);

            } else {
                ele.css('margin-left', justifyTo.offset().left - offset.left);
            }
        }
    }

})(UIkit2);

(function(UI) {

    "use strict";

    var grids = [];

    UI.component('gridMatchHeight', {

        defaults: {
            target        : false,
            row           : true,
            ignorestacked : false,
            observe       : false
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$('[data-uk-grid-match]', context).each(function() {
                    var grid = UI.$(this), obj;

                    if (!grid.data('gridMatchHeight')) {
                        obj = UI.gridMatchHeight(grid, UI.Utils.options(grid.attr('data-uk-grid-match')));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.columns  = this.element.children();
            this.elements = this.options.target ? this.find(this.options.target) : this.columns;

            if (!this.columns.length) return;

            UI.$win.on('load resize orientationchange', (function() {

                var fn = function() {
                    if ($this.element.is(':visible')) $this.match();
                };

                UI.$(function() { fn(); });

                return UI.Utils.debounce(fn, 50);
            })());

            if (this.options.observe) {

                UI.domObserve(this.element, function(e) {
                    if ($this.element.is(':visible')) $this.match();
                });
            }

            this.on('display.uk.check', function(e) {
                if(this.element.is(':visible')) this.match();
            }.bind(this));

            grids.push(this);
        },

        match: function() {

            var firstvisible = this.columns.filter(':visible:first');

            if (!firstvisible.length) return;

            var stacked = Math.ceil(100 * parseFloat(firstvisible.css('width')) / parseFloat(firstvisible.parent().css('width'))) >= 100;

            if (stacked && !this.options.ignorestacked) {
                this.revert();
            } else {
                UI.Utils.matchHeights(this.elements, this.options);
            }

            return this;
        },

        revert: function() {
            this.elements.css('min-height', '');
            return this;
        }
    });

    UI.component('gridMargin', {

        defaults: {
            cls      : 'uk-grid-margin',
            rowfirst : 'uk-row-first'
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$('[data-uk-grid-margin]', context).each(function() {
                    var grid = UI.$(this), obj;

                    if (!grid.data('gridMargin')) {
                        obj = UI.gridMargin(grid, UI.Utils.options(grid.attr('data-uk-grid-margin')));
                    }
                });
            });
        },

        init: function() {

            var stackMargin = UI.stackMargin(this.element, this.options);
        }
    });

})(UIkit2);

(function(UI) {

    "use strict";

    var active = false, activeCount = 0, $html = UI.$html, body;

    UI.$win.on('resize orientationchange', UI.Utils.debounce(function(){
        UI.$('.uk-modal.uk-open').each(function(){
            return UI.$(this).data('modal') && UI.$(this).data('modal').resize();
        });
    }, 150));

    UI.component('modal', {

        defaults: {
            keyboard: true,
            bgclose: true,
            minScrollHeight: 150,
            center: false,
            modal: true
        },

        scrollable: false,
        transition: false,
        hasTransitioned: true,

        init: function() {

            if (!body) body = UI.$('body');

            if (!this.element.length) return;

            var $this = this;

            this.paddingdir = 'padding-' + (UI.langdirection == 'left' ? 'right':'left');
            this.dialog     = this.find('.uk-modal-dialog');

            this.active     = false;

            // Update ARIA
            this.element.attr('aria-hidden', this.element.hasClass('uk-open'));

            this.on('click', '.uk-modal-close', function(e) {

                e.preventDefault();

                var modal = UI.$(e.target).closest('.uk-modal');
                if (modal[0] === $this.element[0]) $this.hide();

            }).on('click', function(e) {

                var target = UI.$(e.target);

                if (target[0] == $this.element[0] && $this.options.bgclose) {
                    $this.hide();
                }
            });

            UI.domObserve(this.element, function(e) { $this.resize(); });
        },

        toggle: function() {
            return this[this.isActive() ? 'hide' : 'show']();
        },

        show: function() {

            if (!this.element.length) return;

            var $this = this;

            if (this.isActive()) return;

            if (this.options.modal && active) {
                active.hide(true);
            }

            this.element.removeClass('uk-open').show();
            this.resize(true);

            if (this.options.modal) {
                active = this;
            }

            this.active = true;

            activeCount++;

            if (UI.support.transition) {
                this.hasTransitioned = false;
                this.element.one(UI.support.transition.end, function(){
                    $this.hasTransitioned = true;
                    UI.Utils.focus($this.dialog, 'a[href]');
                }).addClass('uk-open');
            } else {
                this.element.addClass('uk-open');
                UI.Utils.focus(this.dialog, 'a[href]');
            }

            $html.addClass('uk-modal-page').height(); // force browser engine redraw

            // Update ARIA
            this.element.attr('aria-hidden', 'false');

            this.element.trigger('show.uk.modal');

            UI.Utils.checkDisplay(this.dialog, true);

            return this;
        },

        hide: function(force) {

            if (!force && UI.support.transition && this.hasTransitioned) {

                var $this = this;

                this.one(UI.support.transition.end, function() {
                    $this._hide();
                }).removeClass('uk-open');

            } else {

                this._hide();
            }

            return this;
        },

        resize: function(force) {

            if (!this.isActive() && !force) return;

            var bodywidth  = body.width();

            this.scrollbarwidth = window.innerWidth - bodywidth;

            body.css(this.paddingdir, this.scrollbarwidth);

            this.element.css('overflow-y', this.scrollbarwidth ? 'scroll' : 'auto');

            if (!this.updateScrollable() && this.options.center) {

                var dh  = this.dialog.outerHeight(),
                pad = parseInt(this.dialog.css('margin-top'), 10) + parseInt(this.dialog.css('margin-bottom'), 10);

                if ((dh + pad) < window.innerHeight) {
                    this.dialog.css({top: (window.innerHeight/2 - dh/2) - pad });
                } else {
                    this.dialog.css({top: ''});
                }
            }
        },

        updateScrollable: function() {

            // has scrollable?
            var scrollable = this.dialog.find('.uk-overflow-container:visible:first');

            if (scrollable.length) {

                scrollable.css('height', 0);

                var offset = Math.abs(parseInt(this.dialog.css('margin-top'), 10)),
                dh     = this.dialog.outerHeight(),
                wh     = window.innerHeight,
                h      = wh - 2*(offset < 20 ? 20:offset) - dh;

                scrollable.css({
                    maxHeight: (h < this.options.minScrollHeight ? '':h),
                    height:''
                });

                return true;
            }

            return false;
        },

        _hide: function() {

            this.active = false;
            if (activeCount > 0) activeCount--;
            else activeCount = 0;

            this.element.hide().removeClass('uk-open');

            // Update ARIA
            this.element.attr('aria-hidden', 'true');

            if (!activeCount) {
                $html.removeClass('uk-modal-page');
                body.css(this.paddingdir, "");
            }

            if (active===this) active = false;

            this.trigger('hide.uk.modal');
        },

        isActive: function() {
            return this.element.hasClass('uk-open');
        }

    });

    UI.component('modalTrigger', {

        boot: function() {

            // init code
            UI.$html.on('click.modal.uikit', '[data-uk-modal]', function(e) {

                var ele = UI.$(this);

                if (ele.is('a')) {
                    e.preventDefault();
                }

                if (!ele.data('modalTrigger')) {
                    var modal = UI.modalTrigger(ele, UI.Utils.options(ele.attr('data-uk-modal')));
                    modal.show();
                }

            });

            // close modal on esc button
            UI.$html.on('keydown.modal.uikit', function (e) {

                if (active && e.keyCode === 27 && active.options.keyboard) { // ESC
                    e.preventDefault();
                    active.hide();
                }
            });
        },

        init: function() {

            var $this = this;

            this.options = UI.$.extend({
                target: $this.element.is('a') ? $this.element.attr('href') : false
            }, this.options);

            this.modal = UI.modal(this.options.target, this.options);

            this.on("click", function(e) {
                e.preventDefault();
                $this.show();
            });

            //methods
            this.proxy(this.modal, 'show hide isActive');
        }
    });

    UI.modal.dialog = function(content, options) {

        var modal = UI.modal(UI.$(UI.modal.dialog.template).appendTo('body'), options);

        modal.on('hide.uk.modal', function(){
            if (modal.persist) {
                modal.persist.appendTo(modal.persist.data('modalPersistParent'));
                modal.persist = false;
            }
            modal.element.remove();
        });

        setContent(content, modal);

        return modal;
    };

    UI.modal.dialog.template = '<div class="uk-modal"><div class="uk-modal-dialog" style="min-height:0;"></div></div>';

    UI.modal.alert = function(content, options) {

        options = UI.$.extend(true, {bgclose:false, keyboard:false, modal:false, labels:UI.modal.labels}, options);

        var modal = UI.modal.dialog(([
            '<div class="uk-margin uk-modal-content">'+String(content)+'</div>',
            '<div class="uk-modal-footer uk-text-right"><button class="uk-button uk-button-primary uk-modal-close">'+options.labels.Ok+'</button></div>'
        ]).join(""), options);

        modal.on('show.uk.modal', function(){
            setTimeout(function(){
                modal.element.find('button:first').focus();
            }, 50);
        });

        return modal.show();
    };

    UI.modal.confirm = function(content, onconfirm, oncancel) {

        var options = arguments.length > 1 && arguments[arguments.length-1] ? arguments[arguments.length-1] : {};

        onconfirm = UI.$.isFunction(onconfirm) ? onconfirm : function(){};
        oncancel  = UI.$.isFunction(oncancel) ? oncancel : function(){};
        options   = UI.$.extend(true, {bgclose:false, keyboard:false, modal:false, labels:UI.modal.labels}, UI.$.isFunction(options) ? {}:options);

        var modal = UI.modal.dialog(([
            '<div class="uk-margin uk-modal-content">'+String(content)+'</div>',
            '<div class="uk-modal-footer uk-text-right"><button class="uk-button js-modal-confirm-cancel">'+options.labels.Cancel+'</button> <button class="uk-button uk-button-primary js-modal-confirm">'+options.labels.Ok+'</button></div>'
        ]).join(""), options);

        modal.element.find(".js-modal-confirm, .js-modal-confirm-cancel").on("click", function(){
            UI.$(this).is('.js-modal-confirm') ? onconfirm() : oncancel();
            modal.hide();
        });

        modal.on('show.uk.modal', function(){
            setTimeout(function(){
                modal.element.find('.js-modal-confirm').focus();
            }, 50);
        });

        return modal.show();
    };

    UI.modal.prompt = function(text, value, onsubmit, options) {

        onsubmit = UI.$.isFunction(onsubmit) ? onsubmit : function(value){};
        options  = UI.$.extend(true, {bgclose:false, keyboard:false, modal:false, labels:UI.modal.labels}, options);

        var modal = UI.modal.dialog(([
            text ? '<div class="uk-modal-content uk-form">'+String(text)+'</div>':'',
            '<div class="uk-margin-small-top uk-modal-content uk-form"><p><input type="text" class="uk-width-1-1"></p></div>',
            '<div class="uk-modal-footer uk-text-right"><button class="uk-button uk-modal-close">'+options.labels.Cancel+'</button> <button class="uk-button uk-button-primary js-modal-ok">'+options.labels.Ok+'</button></div>'
        ]).join(""), options),

        input = modal.element.find("input[type='text']").val(value || '').on('keyup', function(e){
            if (e.keyCode == 13) {
                modal.element.find('.js-modal-ok').trigger('click');
            }
        });

        modal.element.find('.js-modal-ok').on('click', function(){
            if (onsubmit(input.val())!==false){
                modal.hide();
            }
        });

        return modal.show();
    };

    UI.modal.blockUI = function(content, options) {

        var modal = UI.modal.dialog(([
            '<div class="uk-margin uk-modal-content">'+String(content || '<div class="uk-text-center">...</div>')+'</div>'
        ]).join(""), UI.$.extend({bgclose:false, keyboard:false, modal:false}, options));

        modal.content = modal.element.find('.uk-modal-content:first');

        return modal.show();
    };

    UI.modal.labels = {
        Ok: 'Ok',
        Cancel: 'Cancel'
    };

    // helper functions
    function setContent(content, modal){

        if(!modal) return;

        if (typeof content === 'object') {

            // convert DOM object to a jQuery object
            content = content instanceof jQuery ? content : UI.$(content);

            if(content.parent().length) {
                modal.persist = content;
                modal.persist.data('modalPersistParent', content.parent());
            }
        }else if (typeof content === 'string' || typeof content === 'number') {
                // just insert the data as innerHTML
                content = UI.$('<div></div>').html(content);
        }else {
                // unsupported data type!
                content = UI.$('<div></div>').html('UIkit2.modal Error: Unsupported data type: ' + typeof content);
        }

        content.appendTo(modal.element.find('.uk-modal-dialog'));

        return modal;
    }

})(UIkit2);

(function(UI) {

    "use strict";

    UI.component('nav', {

        defaults: {
            toggle: '>li.uk-parent > a[href="#"]',
            lists: '>li.uk-parent > ul',
            multiple: false
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$('[data-uk-nav]', context).each(function() {
                    var nav = UI.$(this);

                    if (!nav.data('nav')) {
                        var obj = UI.nav(nav, UI.Utils.options(nav.attr('data-uk-nav')));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.on('click.uk.nav', this.options.toggle, function(e) {
                e.preventDefault();
                var ele = UI.$(this);
                $this.open(ele.parent()[0] == $this.element[0] ? ele : ele.parent("li"));
            });

            this.update();

            UI.domObserve(this.element, function(e) {
                if ($this.element.find($this.options.lists).not('[role]').length) {
                    $this.update();
                }
            });
        },

        update: function() {

            var $this = this;

            this.find(this.options.lists).each(function() {

                var $ele   = UI.$(this).attr('role', 'menu'),
                    parent = $ele.closest('li'),
                    active = parent.hasClass("uk-active");

                if (!parent.data('list-container')) {
                    $ele.wrap('<div style="overflow:hidden;height:0;position:relative;"></div>');
                    parent.data('list-container', $ele.parent()[active ? 'removeClass':'addClass']('uk-hidden'));
                }

                // Init ARIA
                parent.attr('aria-expanded', parent.hasClass("uk-open"));

                if (active) $this.open(parent, true);
            });
        },

        open: function(li, noanimation) {

            var $this = this, element = this.element, $li = UI.$(li), $container = $li.data('list-container');

            if (!this.options.multiple) {

                element.children('.uk-open').not(li).each(function() {

                    var ele = UI.$(this);

                    if (ele.data('list-container')) {
                        ele.data('list-container').stop().animate({height: 0}, function() {
                            UI.$(this).parent().removeClass('uk-open').end().addClass('uk-hidden');
                        });
                    }
                });
            }

            $li.toggleClass('uk-open');

            // Update ARIA
            $li.attr('aria-expanded', $li.hasClass('uk-open'));

            if ($container) {

                if ($li.hasClass('uk-open')) {
                    $container.removeClass('uk-hidden');
                }

                if (noanimation) {

                    $container.stop().height($li.hasClass('uk-open') ? 'auto' : 0);

                    if (!$li.hasClass('uk-open')) {
                        $container.addClass('uk-hidden');
                    }

                    this.trigger('display.uk.check');

                } else {

                    $container.stop().animate({
                        height: ($li.hasClass('uk-open') ? getHeight($container.find('ul:first')) : 0)
                    }, function() {

                        if (!$li.hasClass('uk-open')) {
                            $container.addClass('uk-hidden');
                        } else {
                            $container.css('height', '');
                        }

                        $this.trigger('display.uk.check');
                    });
                }
            }
        }
    });


    // helper

    function getHeight(ele) {

        var $ele = UI.$(ele), height = 'auto';

        if ($ele.is(':visible')) {
            height = $ele.outerHeight();
        } else {

            var tmp = {
                position: $ele.css('position'),
                visibility: $ele.css('visibility'),
                display: $ele.css('display')
            };

            height = $ele.css({position: 'absolute', visibility: 'hidden', display: 'block'}).outerHeight();

            $ele.css(tmp); // reset element
        }

        return height;
    }

})(UIkit2);

(function(UI) {

    "use strict";

    var scrollpos = {x: window.scrollX, y: window.scrollY},
        $win      = UI.$win,
        $doc      = UI.$doc,
        $html     = UI.$html,
        Offcanvas = {

        show: function(element, options) {

            element = UI.$(element);

            if (!element.length) return;

            options = UI.$.extend({mode: 'push'}, options);

            var $body     = UI.$('body'),
                bar       = element.find('.uk-offcanvas-bar:first'),
                rtl       = (UI.langdirection == 'right'),
                flip      = bar.hasClass('uk-offcanvas-bar-flip') ? -1:1,
                dir       = flip * (rtl ? -1 : 1),

                scrollbarwidth =  window.innerWidth - $body.width();

            scrollpos = {x: window.pageXOffset, y: window.pageYOffset};

            bar.attr('mode', options.mode);
            element.addClass('uk-active');

            $body.css({width: window.innerWidth - scrollbarwidth, height: window.innerHeight}).addClass('uk-offcanvas-page');

            if (options.mode == 'push' || options.mode == 'reveal') {
                $body.css((rtl ? 'margin-right' : 'margin-left'), (rtl ? -1 : 1) * (bar.outerWidth() * dir));
            }

            if (options.mode == 'reveal') {
                bar.css('clip', 'rect(0, '+bar.outerWidth()+'px, 100vh, 0)');
            }

            $html.css('margin-top', scrollpos.y * -1).width(); // .width() - force redraw


            bar.addClass('uk-offcanvas-bar-show');

            this._initElement(element);

            bar.trigger('show.uk.offcanvas', [element, bar]);

            // Update ARIA
            element.attr('aria-hidden', 'false');
        },

        hide: function(force) {

            var $body = UI.$('body'),
                panel = UI.$('.uk-offcanvas.uk-active'),
                rtl   = (UI.langdirection == 'right'),
                bar   = panel.find('.uk-offcanvas-bar:first'),
                finalize = function() {
                    $body.removeClass('uk-offcanvas-page').css({width: '', height: '', marginLeft: '', marginRight: ''});
                    panel.removeClass('uk-active');

                    bar.removeClass('uk-offcanvas-bar-show');
                    $html.css('margin-top', '');
                    window.scrollTo(scrollpos.x, scrollpos.y);
                    bar.trigger('hide.uk.offcanvas', [panel, bar]);

                    // Update ARIA
                    panel.attr('aria-hidden', 'true');
                };

            if (!panel.length) return;
            if (bar.attr('mode') == 'none') force = true;

            if (UI.support.transition && !force) {

                $body.one(UI.support.transition.end, function() {
                    finalize();
                }).css((rtl ? 'margin-right' : 'margin-left'), '');

                if (bar.attr('mode') == 'reveal') {
                    bar.css('clip', '');
                }

                setTimeout(function(){
                    bar.removeClass('uk-offcanvas-bar-show');
                }, 0);

            } else {
                finalize();
            }
        },

        _initElement: function(element) {

            if (element.data('OffcanvasInit')) return;

            element.on('click.uk.offcanvas swipeRight.uk.offcanvas swipeLeft.uk.offcanvas', function(e) {

                var target = UI.$(e.target);

                if (e.type.match(/swipe/)) {
                    if (target.parents('.uk-offcanvas-bar:first').length) return;
                } else {

                    if (!target.hasClass('uk-offcanvas-close')) {
                        if (target.hasClass('uk-offcanvas-bar')) return;
                        if (target.parents('.uk-offcanvas-bar:first').length) return;
                    }
                }

                e.stopImmediatePropagation();
                Offcanvas.hide();
            });

            element.on('click', 'a[href*="#"]', function(e){

                var link = UI.$(this),
                    href = link.attr('href');

                if (href == '#') {
                    return;
                }

                UI.$doc.one('hide.uk.offcanvas', function() {

                    var target;

                    try {
                        target = UI.$(link[0].hash);
                    } catch (e){
                        target = '';
                    }

                    if (!target.length) {
                        target = UI.$('[name="'+link[0].hash.replace('#','')+'"]');
                    }

                    if (target.length && UI.Utils.scrollToElement) {
                        UI.Utils.scrollToElement(target, UI.Utils.options(link.attr('data-uk-smooth-scroll') || '{}'));
                    } else {
                        window.location.href = href;
                    }
                });

                Offcanvas.hide();
            });

            element.data('OffcanvasInit', true);
        }
    };

    UI.component('offcanvasTrigger', {

        boot: function() {

            // init code
            $html.on('click.offcanvas.uikit', '[data-uk-offcanvas]', function(e) {

                e.preventDefault();

                var ele = UI.$(this);

                if (!ele.data('offcanvasTrigger')) {
                    var obj = UI.offcanvasTrigger(ele, UI.Utils.options(ele.attr('data-uk-offcanvas')));
                    ele.trigger("click");
                }
            });

            $html.on('keydown.uk.offcanvas', function(e) {

                if (e.keyCode === 27) { // ESC
                    Offcanvas.hide();
                }
            });
        },

        init: function() {

            var $this = this;

            this.options = UI.$.extend({
                target: $this.element.is('a') ? $this.element.attr('href') : false,
                mode: 'push'
            }, this.options);

            this.on('click', function(e) {
                e.preventDefault();
                Offcanvas.show($this.options.target, $this.options);
            });
        }
    });

    UI.offcanvas = Offcanvas;

})(UIkit2);

(function(UI) {

    "use strict";

    var Animations;

    UI.component('switcher', {

        defaults: {
            connect   : false,
            toggle    : '>*',
            active    : 0,
            animation : false,
            duration  : 200,
            swiping   : true
        },

        animating: false,

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$('[data-uk-switcher]', context).each(function() {
                    var switcher = UI.$(this);

                    if (!switcher.data('switcher')) {
                        var obj = UI.switcher(switcher, UI.Utils.options(switcher.attr('data-uk-switcher')));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.on('click.uk.switcher', this.options.toggle, function(e) {
                e.preventDefault();
                $this.show(this);
            });

            if (!this.options.connect) {
                return;
            }

            this.connect = UI.$(this.options.connect);

            if (!this.connect.length) {
                return;
            }

            this.connect.on('click.uk.switcher', '[data-uk-switcher-item]', function(e) {

                e.preventDefault();

                var item = UI.$(this).attr('data-uk-switcher-item');

                if ($this.index == item) return;

                switch(item) {
                    case 'next':
                    case 'previous':
                        $this.show($this.index + (item=='next' ? 1:-1));
                        break;
                    default:
                        $this.show(parseInt(item, 10));
                }
            });

            if (this.options.swiping) {

                this.connect.on('swipeRight swipeLeft', function(e) {
                    e.preventDefault();
                    if (!window.getSelection().toString()) {
                        $this.show($this.index + (e.type == 'swipeLeft' ? 1 : -1));
                    }
                });
            }

            this.update();
        },

        update: function() {

            this.connect.children().removeClass('uk-active').attr('aria-hidden', 'true');

            var toggles = this.find(this.options.toggle),
                active  = toggles.filter('.uk-active');

            if (active.length) {
                this.show(active, false);
            } else {

                if (this.options.active===false) return;

                active = toggles.eq(this.options.active);
                this.show(active.length ? active : toggles.eq(0), false);
            }

            // Init ARIA for toggles
            toggles.not(active).attr('aria-expanded', 'false');
            active.attr('aria-expanded', 'true');
        },

        show: function(tab, animate) {

            if (this.animating) {
                return;
            }

            var toggles = this.find(this.options.toggle);

            if (isNaN(tab)) {
                tab = UI.$(tab);
            } else {
                tab = tab < 0 ? toggles.length-1 : tab;
                tab = toggles.eq(toggles[tab] ? tab : 0);
            }

            var $this     = this,
                active    = UI.$(tab),
                animation = Animations[this.options.animation] || function(current, next) {

                    if (!$this.options.animation) {
                        return Animations.none.apply($this);
                    }

                    var anim = $this.options.animation.split(',');

                    if (anim.length == 1) {
                        anim[1] = anim[0];
                    }

                    anim[0] = anim[0].trim();
                    anim[1] = anim[1].trim();

                    return coreAnimation.apply($this, [anim, current, next]);
                };

            if (animate===false || !UI.support.animation) {
                animation = Animations.none;
            }

            if (active.hasClass("uk-disabled")) return;

            // Update ARIA for Toggles
            toggles.attr('aria-expanded', 'false');
            active.attr('aria-expanded', 'true');

            toggles.filter(".uk-active").removeClass("uk-active");
            active.addClass("uk-active");

            if (this.options.connect && this.connect.length) {

                this.index = this.find(this.options.toggle).index(active);

                if (this.index == -1 ) {
                    this.index = 0;
                }

                this.connect.each(function() {

                    var container = UI.$(this),
                        children  = UI.$(container.children()),
                        current   = UI.$(children.filter('.uk-active')),
                        next      = UI.$(children.eq($this.index));

                        $this.animating = true;

                        animation.apply($this, [current, next]).then(function(){

                            current.removeClass("uk-active");
                            next.addClass("uk-active");

                            // Update ARIA for connect
                            current.attr('aria-hidden', 'true');
                            next.attr('aria-hidden', 'false');

                            UI.Utils.checkDisplay(next, true);

                            $this.animating = false;

                        });
                });
            }

            this.trigger("show.uk.switcher", [active]);
        }
    });

    Animations = {

        'none': function() {
            var d = UI.$.Deferred();
            d.resolve();
            return d.promise();
        },

        'fade': function(current, next) {
            return coreAnimation.apply(this, ['uk-animation-fade', current, next]);
        },

        'slide-bottom': function(current, next) {
            return coreAnimation.apply(this, ['uk-animation-slide-bottom', current, next]);
        },

        'slide-top': function(current, next) {
            return coreAnimation.apply(this, ['uk-animation-slide-top', current, next]);
        },

        'slide-vertical': function(current, next, dir) {

            var anim = ['uk-animation-slide-top', 'uk-animation-slide-bottom'];

            if (current && current.index() > next.index()) {
                anim.reverse();
            }

            return coreAnimation.apply(this, [anim, current, next]);
        },

        'slide-left': function(current, next) {
            return coreAnimation.apply(this, ['uk-animation-slide-left', current, next]);
        },

        'slide-right': function(current, next) {
            return coreAnimation.apply(this, ['uk-animation-slide-right', current, next]);
        },

        'slide-horizontal': function(current, next, dir) {

            var anim = ['uk-animation-slide-right', 'uk-animation-slide-left'];

            if (current && current.index() > next.index()) {
                anim.reverse();
            }

            return coreAnimation.apply(this, [anim, current, next]);
        },

        'scale': function(current, next) {
            return coreAnimation.apply(this, ['uk-animation-scale-up', current, next]);
        }
    };

    UI.switcher.animations = Animations;


    // helpers

    function coreAnimation(cls, current, next) {

        var d = UI.$.Deferred(), clsIn = cls, clsOut = cls, release;

        if (next[0]===current[0]) {
            d.resolve();
            return d.promise();
        }

        if (typeof(cls) == 'object') {
            clsIn  = cls[0];
            clsOut = cls[1] || cls[0];
        }

        UI.$body.css('overflow-x', 'hidden'); // fix scroll jumping in iOS

        release = function() {

            if (current) current.hide().removeClass('uk-active '+clsOut+' uk-animation-reverse');

            next.addClass(clsIn).one(UI.support.animation.end, function() {

                setTimeout(function () {
                    next.removeClass(''+clsIn+'').css({opacity:'', display:''});
                }, 0);

                d.resolve();

                UI.$body.css('overflow-x', '');

                if (current) current.css({opacity:'', display:''});

            }.bind(this)).show();
        };

        next.css('animation-duration', this.options.duration+'ms');

        if (current && current.length) {

            current.css('animation-duration', this.options.duration+'ms');

            current.css('display', 'none').addClass(clsOut+' uk-animation-reverse').one(UI.support.animation.end, function() {
                release();
            }.bind(this)).css('display', '');

        } else {
            next.addClass('uk-active');
            release();
        }

        return d.promise();
    }

})(UIkit2);

(function(UI) {

    "use strict";

    UI.component('tab', {

        defaults: {
            target    : '>li:not(.uk-tab-responsive, .uk-disabled)',
            connect   : false,
            active    : 0,
            animation : false,
            duration  : 200,
            swiping   : true
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$('[data-uk-tab]', context).each(function() {

                    var tab = UI.$(this);

                    if (!tab.data('tab')) {
                        var obj = UI.tab(tab, UI.Utils.options(tab.attr('data-uk-tab')));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.current = false;

            this.on('click.uk.tab', this.options.target, function(e) {

                e.preventDefault();

                if ($this.switcher && $this.switcher.animating) {
                    return;
                }

                var current = $this.find($this.options.target).not(this);

                current.removeClass('uk-active').blur();

                $this.trigger('change.uk.tab', [UI.$(this).addClass('uk-active'), $this.current]);

                $this.current = UI.$(this);

                // Update ARIA
                if (!$this.options.connect) {
                    current.attr('aria-expanded', 'false');
                    UI.$(this).attr('aria-expanded', 'true');
                }
            });

            if (this.options.connect) {
                this.connect = UI.$(this.options.connect);
            }

            // init responsive tab
            this.responsivetab = UI.$('<li class="uk-tab-responsive uk-active"><a></a></li>').append('<div class="uk-dropdown uk-dropdown-small"><ul class="uk-nav uk-nav-dropdown"></ul><div>');

            this.responsivetab.dropdown = this.responsivetab.find('.uk-dropdown');
            this.responsivetab.lst      = this.responsivetab.dropdown.find('ul');
            this.responsivetab.caption  = this.responsivetab.find('a:first');

            if (this.element.hasClass('uk-tab-bottom')) this.responsivetab.dropdown.addClass('uk-dropdown-up');

            // handle click
            this.responsivetab.lst.on('click.uk.tab', 'a', function(e) {

                e.preventDefault();
                e.stopPropagation();

                var link = UI.$(this);

                $this.element.children('li:not(.uk-tab-responsive)').eq(link.data('index')).trigger('click');
            });

            this.on('show.uk.switcher change.uk.tab', function(e, tab) {
                $this.responsivetab.caption.html(tab.text());
            });

            this.element.append(this.responsivetab);

            // init UIkit components
            if (this.options.connect) {

                this.switcher = UI.switcher(this.element, {
                    toggle    : '>li:not(.uk-tab-responsive)',
                    connect   : this.options.connect,
                    active    : this.options.active,
                    animation : this.options.animation,
                    duration  : this.options.duration,
                    swiping   : this.options.swiping
                });
            }

            UI.dropdown(this.responsivetab, {mode: 'click', preventflip: 'y'});

            // init
            $this.trigger('change.uk.tab', [this.element.find(this.options.target).not('.uk-tab-responsive').filter('.uk-active')]);

            this.check();

            UI.$win.on('resize orientationchange', UI.Utils.debounce(function(){
                if ($this.element.is(':visible'))  $this.check();
            }, 100));

            this.on('display.uk.check', function(){
                if ($this.element.is(':visible'))  $this.check();
            });
        },

        check: function() {

            var children = this.element.children('li:not(.uk-tab-responsive)').removeClass('uk-hidden');

            if (!children.length) {
                this.responsivetab.addClass('uk-hidden');
                return;
            }

            var top          = (children.eq(0).offset().top + Math.ceil(children.eq(0).height()/2)),
                doresponsive = false,
                item, link, clone;

            this.responsivetab.lst.empty();

            children.each(function(){

                if (UI.$(this).offset().top > top) {
                    doresponsive = true;
                }
            });

            if (doresponsive) {

                for (var i = 0; i < children.length; i++) {

                    item  = UI.$(children.eq(i));
                    link  = item.find('a');

                    if (item.css('float') != 'none' && !item.attr('uk-dropdown')) {

                        if (!item.hasClass('uk-disabled')) {

                            clone = UI.$(item[0].outerHTML);
                            clone.find('a').data('index', i);

                            this.responsivetab.lst.append(clone);
                        }

                        item.addClass('uk-hidden');
                    }
                }
            }

            this.responsivetab[this.responsivetab.lst.children('li').length ? 'removeClass':'addClass']('uk-hidden');
        }
    });

})(UIkit2);

(function(UI){

    "use strict";

    UI.component('cover', {

        defaults: {
            automute : true
        },

        boot: function() {

            // auto init
            UI.ready(function(context) {

                UI.$('[data-uk-cover]', context).each(function(){

                    var ele = UI.$(this);

                    if(!ele.data('cover')) {
                        var plugin = UI.cover(ele, UI.Utils.options(ele.attr('data-uk-cover')));
                    }
                });
            });
        },

        init: function() {

            this.parent = this.element.parent();

            UI.$win.on('load resize orientationchange', UI.Utils.debounce(function(){
                this.check();
            }.bind(this), 100));

            this.on('display.uk.check', function(e) {
                if (this.element.is(':visible')) this.check();
            }.bind(this));

            this.check();

            if (this.element.is('iframe') && this.options.automute) {

                var src = this.element.attr('src');

                this.element.attr('src', '').on('load', function(){
                    this.contentWindow.postMessage('{ "event": "command", "func": "mute", "method":"setVolume", "value":0}', '*');
                }).attr('src', [src, (src.indexOf('?') > -1 ? '&':'?'), 'enablejsapi=1&api=1'].join(''));
            }
        },

        check: function() {

            this.element.css({ width  : '', height : '' });

            this.dimension = {w: this.element.width(), h: this.element.height()};

            if (this.element.attr('width') && !isNaN(this.element.attr('width'))) {
                this.dimension.w = this.element.attr('width');
            }

            if (this.element.attr('height') && !isNaN(this.element.attr('height'))) {
                this.dimension.h = this.element.attr('height');
            }

            this.ratio = this.dimension.w / this.dimension.h;

            var w = this.parent.width(), h = this.parent.height(), width, height;

            // if element height < parent height (gap underneath)
            if ((w / this.ratio) < h) {

                width  = Math.ceil(h * this.ratio);
                height = h;

            // element width < parent width (gap to right)
            } else {

                width  = w;
                height = Math.ceil(w / this.ratio);
            }

            this.element.css({ width  : width, height : height });
        }
    });

})(UIkit2);

/*! UIkit 2.27.5 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(addon) {
    var component;

    if (window.UIkit2) {
        component = addon(UIkit2);
    }

    if (typeof define == 'function' && define.amd) {
        define('uikit-accordion', ['uikit'], function(){
            return component || addon(UIkit2);
        });
    }
})(function(UI){

    "use strict";

    UI.component('accordion', {

        defaults: {
            showfirst  : true,
            collapse   : true,
            animate    : true,
            easing     : 'swing',
            duration   : 300,
            toggle     : '.uk-accordion-title',
            containers : '.uk-accordion-content',
            clsactive  : 'uk-active'
        },

        boot:  function() {

            // init code
            UI.ready(function(context) {

                setTimeout(function(){

                    UI.$('[data-uk-accordion]', context).each(function(){

                        var ele = UI.$(this);

                        if (!ele.data('accordion')) {
                            UI.accordion(ele, UI.Utils.options(ele.attr('data-uk-accordion')));
                        }
                    });

                }, 0);
            });
        },

        init: function() {

            var $this = this;

            this.element.on('click.uk.accordion', this.options.toggle, function(e) {

                e.preventDefault();

                $this.toggleItem(UI.$(this).data('wrapper'), $this.options.animate, $this.options.collapse);
            });

            this.update(true);

            UI.domObserve(this.element, function(e) {
                if ($this.element.children($this.options.containers).length) {
                    $this.update();
                }
            });
        },

        toggleItem: function(wrapper, animated, collapse) {

            var $this = this;

            wrapper.data('toggle').toggleClass(this.options.clsactive);
            wrapper.data('content').toggleClass(this.options.clsactive);

            var active = wrapper.data('toggle').hasClass(this.options.clsactive);

            if (collapse) {
                this.toggle.not(wrapper.data('toggle')).removeClass(this.options.clsactive);
                this.content.not(wrapper.data('content')).removeClass(this.options.clsactive)
                    .parent().stop().css('overflow', 'hidden').animate({ height: 0 }, {easing: this.options.easing, duration: animated ? this.options.duration : 0}).attr('aria-expanded', 'false');
            }

            wrapper.stop().css('overflow', 'hidden');

            if (animated) {

                wrapper.animate({ height: active ? getHeight(wrapper.data('content')) : 0 }, {easing: this.options.easing, duration: this.options.duration, complete: function() {

                    if (active) {
                        wrapper.css({'overflow': '', 'height': 'auto'});
                        UI.Utils.checkDisplay(wrapper.data('content'));
                    }

                    $this.trigger('display.uk.check');
                }});

            } else {

                wrapper.height(active ? 'auto' : 0);

                if (active) {
                    wrapper.css({'overflow': ''});
                    UI.Utils.checkDisplay(wrapper.data('content'));
                }

                this.trigger('display.uk.check');
            }

            // Update ARIA
            wrapper.attr('aria-expanded', active);

            this.element.trigger('toggle.uk.accordion', [active, wrapper.data('toggle'), wrapper.data('content')]);
        },

        update: function(init) {

            var $this = this, $content, $wrapper, $toggle;

            this.toggle = this.find(this.options.toggle);
            this.content = this.find(this.options.containers);

            this.content.each(function(index) {

                $content = UI.$(this);

                if ($content.parent().data('wrapper')) {
                    $wrapper = $content.parent();
                } else {
                    $wrapper = UI.$(this).wrap('<div data-wrapper="true" style="overflow:hidden;height:0;position:relative;"></div>').parent();

                    // Init ARIA
                    $wrapper.attr('aria-expanded', 'false');
                }

                $toggle = $this.toggle.eq(index);

                $wrapper.data('toggle', $toggle);
                $wrapper.data('content', $content);
                $toggle.data('wrapper', $wrapper);
                $content.data('wrapper', $wrapper);
            });

            this.element.trigger('update.uk.accordion', [this]);

            if (init && this.options.showfirst) {
                this.toggleItem(this.toggle.eq(0).data('wrapper'), false, false);
            }
        }

    });

    // helper

    function getHeight(ele) {

        var $ele = UI.$(ele), height = "auto";

        if ($ele.is(":visible")) {
            height = $ele.outerHeight();
        } else {

            var tmp = {
                position   : $ele.css('position'),
                visibility : $ele.css('visibility'),
                display    : $ele.css('display')
            };

            height = $ele.css({position: 'absolute', visibility: 'hidden', display: 'block'}).outerHeight();

            $ele.css(tmp); // reset element
        }

        return height;
    }

    return UI.accordion;
});

/*! UIkit 2.27.5 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(addon) {

    var component;

    if (window.UIkit2) {
        component = addon(UIkit2);
    }

    if (typeof define == 'function' && define.amd) {
        define('uikit-form-password', ['uikit'], function(){
            return component || addon(UIkit2);
        });
    }

})(function(UI){

    "use strict";

    UI.component('formPassword', {

        defaults: {
            lblShow: 'Show',
            lblHide: 'Hide'
        },

        boot: function() {
            // init code
            UI.$html.on('click.formpassword.uikit', '[data-uk-form-password]', function(e) {

                var ele = UI.$(this);

                if (!ele.data('formPassword')) {

                    e.preventDefault();

                    UI.formPassword(ele, UI.Utils.options(ele.attr('data-uk-form-password')));
                    ele.trigger('click');
                }
            });
        },

        init: function() {

            var $this = this;

            this.on('click', function(e) {

                e.preventDefault();

                if($this.input.length) {
                    var type = $this.input.attr('type');
                    $this.input.attr('type', type=='text' ? 'password':'text');
                    $this.element.html($this.options[type=='text' ? 'lblShow':'lblHide']);
                }
            });

            this.input = this.element.next('input').length ? this.element.next('input') : this.element.prev('input');
            this.element.html(this.options[this.input.is('[type="password"]') ? 'lblShow':'lblHide']);


            this.element.data('formPassword', this);
        }
    });

    return UI.formPassword;
});

/*! UIkit 2.27.5 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(addon) {

    var component;

    if (window.UIkit2) {
        component = addon(UIkit2);
    }

    if (typeof define == 'function' && define.amd) {
        define('uikit-form-select', ['uikit'], function(){
            return component || addon(UIkit2);
        });
    }

})(function(UI){

    "use strict";

    UI.component('formSelect', {

        defaults: {
            target: '>span:first',
            activeClass: 'uk-active'
        },

        boot: function() {
            // init code
            UI.ready(function(context) {

                UI.$('[data-uk-form-select]', context).each(function(){

                    var ele = UI.$(this);

                    if (!ele.data('formSelect')) {
                        UI.formSelect(ele, UI.Utils.options(ele.attr('data-uk-form-select')));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.target  = this.find(this.options.target);
            this.select  = this.find('select');

            // init + on change event
            this.select.on({

                change: (function(){

                    var select = $this.select[0], fn = function(){

                        try {

                            if($this.options.target === 'input') {
                                $this.target.val(select.options[select.selectedIndex].text);
                            } else {
                                $this.target.text(select.options[select.selectedIndex].text);
                            }

                        } catch(e) {}

                        $this.element[$this.select.val() ? 'addClass':'removeClass']($this.options.activeClass);

                        return fn;
                    };

                    return fn();
                })(),

                focus: function(){ $this.target.addClass('uk-focus') },
                blur: function(){ $this.target.removeClass('uk-focus') },
                mouseenter: function(){ $this.target.addClass('uk-hover') },
                mouseleave: function(){ $this.target.removeClass('uk-hover') }
            });

            this.element.data("formSelect", this);
        }
    });

    return UI.formSelect;
});

/*! UIkit 2.27.5 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(addon) {

    var component;

    if (window.UIkit2) {
        component = addon(UIkit2);
    }

    if (typeof define == 'function' && define.amd) { // AMD
        define('uikit-lightbox', ['uikit'], function(){
            return component || addon(UIkit2);
        });
    }

})(function(UI){

    "use strict";

    var modal, cache = {};

    UI.component('lightbox', {

        defaults: {
            allowfullscreen : true,
            duration        : 400,
            group           : false,
            keyboard        : true
        },

        index : 0,
        items : false,

        boot: function() {

            UI.$html.on('click', '[data-uk-lightbox]', function(e){

                e.preventDefault();

                var link = UI.$(this);

                if (!link.data('lightbox')) {

                    UI.lightbox(link, UI.Utils.options(link.attr('data-uk-lightbox')));
                }

                link.data('lightbox').show(link);
            });

            // keyboard navigation
            UI.$doc.on('keyup', function(e) {

                if (modal && modal.is(':visible') && modal.lightbox.options.keyboard) {

                    e.preventDefault();

                    switch(e.keyCode) {
                        case 37:
                            modal.lightbox.previous();
                            break;
                        case 39:
                            modal.lightbox.next();
                            break;
                    }
                }
            });
        },

        init: function() {

            var siblings = [];

            this.index    = 0;
            this.siblings = [];

            if (this.element && this.element.length) {

                var domSiblings  = this.options.group ? UI.$('[data-uk-lightbox*="'+this.options.group+'"]') : this.element;

                domSiblings.each(function() {

                    var ele = UI.$(this);

                    siblings.push({
                        source : ele.attr('href'),
                        title  : ele.attr('data-title') || ele.attr('title'),
                        type   : ele.attr("data-lightbox-type") || 'auto',
                        link   : ele
                    });
                });

                this.index    = domSiblings.index(this.element);
                this.siblings = siblings;

            } else if (this.options.group && this.options.group.length) {
                this.siblings = this.options.group;
            }

            this.trigger('lightbox-init', [this]);
        },

        show: function(index) {

            this.modal = getModal(this);

            // stop previous animation
            this.modal.dialog.stop();
            this.modal.content.stop();

            var $this = this, promise = UI.$.Deferred(), data, item;

            index = index || 0;

            // index is a jQuery object or DOM element
            if (typeof(index) == 'object') {

                this.siblings.forEach(function(s, idx){

                    if (index[0] === s.link[0]) {
                        index = idx;
                    }
                });
            }

            // fix index if needed
            if ( index < 0 ) {
                index = this.siblings.length - index;
            } else if (!this.siblings[index]) {
                index = 0;
            }

            item   = this.siblings[index];

            data = {
                lightbox : $this,
                source   : item.source,
                type     : item.type,
                index    : index,
                promise  : promise,
                title    : item.title,
                item     : item,
                meta     : {
                    content : '',
                    width   : null,
                    height  : null
                }
            };

            this.index = index;

            this.modal.content.empty();

            if (!this.modal.is(':visible')) {
                this.modal.content.css({width:'', height:''}).empty();
                this.modal.modal.show();
            }

            this.modal.loader.removeClass('uk-hidden');

            promise.promise().done(function() {

                $this.data = data;
                $this.fitSize(data);

            }).fail(function(){

                data.meta.content = '<div class="uk-position-cover uk-flex uk-flex-middle uk-flex-center"><strong>Loading resource failed!</strong></div>';
                data.meta.width   = 400;
                data.meta.height  = 300;

                $this.data = data;
                $this.fitSize(data);
            });

            $this.trigger('showitem.uk.lightbox', [data]);
        },

        fitSize: function() {

            var $this    = this,
                data     = this.data,
                pad      = this.modal.dialog.outerWidth() - this.modal.dialog.width(),
                dpadTop  = parseInt(this.modal.dialog.css('margin-top'), 10),
                dpadBot  = parseInt(this.modal.dialog.css('margin-bottom'), 10),
                dpad     = dpadTop + dpadBot,
                content  = data.meta.content,
                duration = $this.options.duration;

            if (this.siblings.length > 1) {

                content = [
                    content,
                    '<a href="#" class="uk-slidenav uk-slidenav-contrast uk-slidenav-previous uk-hidden-touch" data-lightbox-previous></a>',
                    '<a href="#" class="uk-slidenav uk-slidenav-contrast uk-slidenav-next uk-hidden-touch" data-lightbox-next></a>'
                ].join('');
            }

            // calculate width
            var tmp = UI.$('<div>&nbsp;</div>').css({
                opacity   : 0,
                position  : 'absolute',
                top       : 0,
                left      : 0,
                width     : '100%',
                maxWidth  : $this.modal.dialog.css('max-width'),
                padding   : $this.modal.dialog.css('padding'),
                margin    : $this.modal.dialog.css('margin')
            }), maxwidth, maxheight, w = data.meta.width, h = data.meta.height;

            tmp.appendTo('body').width();

            maxwidth  = tmp.width();
            maxheight = window.innerHeight - dpad;

            tmp.remove();

            this.modal.dialog.find('.uk-modal-caption').remove();

            if (data.title) {
                this.modal.dialog.append('<div class="uk-modal-caption">'+data.title+'</div>');
                maxheight -= this.modal.dialog.find('.uk-modal-caption').outerHeight();
            }

            if (maxwidth < data.meta.width) {

                h = Math.floor( h * (maxwidth / w) );
                w = maxwidth;
            }

            if (maxheight < h) {

                h = Math.floor(maxheight);
                w = Math.ceil(data.meta.width * (maxheight/data.meta.height));
            }

            this.modal.content.css('opacity', 0).width(w).html(content);

            if (data.type == 'iframe') {
                this.modal.content.find('iframe:first').height(h);
            }

            var dh   = h + pad,
                t    = Math.floor(window.innerHeight/2 - dh/2) - dpad;

            if (t < 0) { t = 0; }

            this.modal.closer.addClass('uk-hidden');

            if ($this.modal.data('mwidth') == w &&  $this.modal.data('mheight') == h) {
                duration = 0;
            }

            this.modal.dialog.animate({width: w + pad, height: h + pad, top: t }, duration, 'swing', function() {
                $this.modal.loader.addClass('uk-hidden');
                $this.modal.content.css({width:''}).animate({opacity: 1}, function() {
                    $this.modal.closer.removeClass('uk-hidden');
                });

                $this.modal.data({mwidth: w, mheight: h});
            });
        },

        next: function() {
            this.show(this.siblings[(this.index+1)] ? (this.index+1) : 0);
        },

        previous: function() {
            this.show(this.siblings[(this.index-1)] ? (this.index-1) : this.siblings.length-1);
        }
    });


    // Plugins

    UI.plugin('lightbox', 'image', {

        init: function(lightbox) {

            lightbox.on('showitem.uk.lightbox', function(e, data){

                if (data.type == 'image' || data.source && data.source.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {

                    var resolve = function(source, width, height) {

                        data.meta = {
                            content : '<img class="uk-responsive-width" width="'+width+'" height="'+height+'" src ="'+source+'">',
                            width   : width,
                            height  : height
                        };

                        data.type = 'image';

                        data.promise.resolve();
                    };

                    if (!cache[data.source]) {

                        var img = new Image();

                        img.onerror = function(){
                            data.promise.reject('Loading image failed');
                        };

                        img.onload = function(){
                            cache[data.source] = {width: img.width, height: img.height};
                            resolve(data.source, cache[data.source].width, cache[data.source].height);
                        };

                        img.src = data.source;

                    } else {
                        resolve(data.source, cache[data.source].width, cache[data.source].height);
                    }
                }
            });
        }
    });

    UI.plugin('lightbox', 'youtube', {

        init: function(lightbox) {

            var youtubeRegExp = /(\/\/.*?youtube\.[a-z]+)\/watch\?v=([^&]+)&?(.*)/,
                youtubeRegExpShort = /youtu\.be\/(.*)/;


            lightbox.on('showitem.uk.lightbox', function(e, data){

                var id, matches, resolve = function(id, width, height) {

                    data.meta = {
                        content: '<iframe src="//www.youtube.com/embed/'+id+'" width="'+width+'" height="'+height+'" style="max-width:100%;"'+(modal.lightbox.options.allowfullscreen?' allowfullscreen':'')+'></iframe>',
                        width: width,
                        height: height
                    };

                    data.type = 'iframe';

                    data.promise.resolve();
                };

                if (matches = data.source.match(youtubeRegExp)) {
                    id = matches[2];
                }

                if (matches = data.source.match(youtubeRegExpShort)) {
                    id = matches[1];
                }

                if (id) {

                    if(!cache[id]) {

                        var img = new Image(), lowres = false;

                        img.onerror = function(){
                            cache[id] = {width:640, height:320};
                            resolve(id, cache[id].width, cache[id].height);
                        };

                        img.onload = function(){
                            //youtube default 404 thumb, fall back to lowres
                            if (img.width == 120 && img.height == 90) {
                                if (!lowres) {
                                    lowres = true;
                                    img.src = '//img.youtube.com/vi/' + id + '/0.jpg';
                                } else {
                                    cache[id] = {width: 640, height: 320};
                                    resolve(id, cache[id].width, cache[id].height);
                                }
                            } else {
                                cache[id] = {width: img.width, height: img.height};
                                resolve(id, img.width, img.height);
                            }
                        };

                        img.src = '//img.youtube.com/vi/'+id+'/maxresdefault.jpg';

                    } else {
                        resolve(id, cache[id].width, cache[id].height);
                    }

                    e.stopImmediatePropagation();
                }
            });
        }
    });


    UI.plugin('lightbox', 'vimeo', {

        init: function(lightbox) {

            var regex = /(\/\/.*?)vimeo\.[a-z]+\/([0-9]+).*?/, matches;


            lightbox.on('showitem.uk.lightbox', function(e, data){

                var id, resolve = function(id, width, height) {

                    data.meta = {
                        content: '<iframe src="//player.vimeo.com/video/'+id+'" width="'+width+'" height="'+height+'" style="width:100%;box-sizing:border-box;"'+(modal.lightbox.options.allowfullscreen?' allowfullscreen':'')+'></iframe>',
                        width: width,
                        height: height
                    };

                    data.type = 'iframe';

                    data.promise.resolve();
                };

                if (matches = data.source.match(regex)) {

                    id = matches[2];

                    if(!cache[id]) {

                        UI.$.ajax({
                            type     : 'GET',
                            url      : '//vimeo.com/api/oembed.json?url=' + encodeURI(data.source),
                            jsonp    : 'callback',
                            dataType : 'jsonp',
                            success  : function(data) {
                                cache[id] = {width:data.width, height:data.height};
                                resolve(id, cache[id].width, cache[id].height);
                            }
                        });

                    } else {
                        resolve(id, cache[id].width, cache[id].height);
                    }

                    e.stopImmediatePropagation();
                }
            });
        }
    });

    UI.plugin('lightbox', 'video', {

        init: function(lightbox) {

            lightbox.on('showitem.uk.lightbox', function(e, data){


                var resolve = function(source, width, height) {

                    data.meta = {
                        content: '<video class="uk-responsive-width" src="'+source+'" width="'+width+'" height="'+height+'" controls></video>',
                        width: width,
                        height: height
                    };

                    data.type = 'video';

                    data.promise.resolve();
                };

                if (data.type == 'video' || data.source.match(/\.(mp4|webm|ogv)$/i)) {

                    if (!cache[data.source]) {

                        var vid = UI.$('<video style="position:fixed;visibility:hidden;top:-10000px;"></video>').attr('src', data.source).appendTo('body');

                        var idle = setInterval(function() {

                            if (vid[0].videoWidth) {
                                clearInterval(idle);
                                cache[data.source] = {width: vid[0].videoWidth, height: vid[0].videoHeight};
                                resolve(data.source, cache[data.source].width, cache[data.source].height);
                                vid.remove();
                            }

                        }, 20);

                    } else {
                        resolve(data.source, cache[data.source].width, cache[data.source].height);
                    }
                }
            });
        }
    });


    UI.plugin('lightbox', 'iframe', {

        init: function (lightbox) {

            lightbox.on('showitem.uk.lightbox', function (e, data) {

                var resolve = function (source, width, height) {

                    data.meta = {
                        content: '<iframe class="uk-responsive-width" src="' + source + '" width="' + width + '" height="' + height + '"'+(modal.lightbox.options.allowfullscreen?' allowfullscreen':'')+'></iframe>',
                        width: width,
                        height: height
                    };

                    data.type = 'iframe';

                    data.promise.resolve();
                };

                if (data.type === 'iframe' || data.source.match(/\.(html|php)$/)) {
                    resolve(data.source, (lightbox.options.width || 800), (lightbox.options.height || 600));
                }
            });

        }
    });

    function getModal(lightbox) {

        if (modal) {
            modal.lightbox = lightbox;
            return modal;
        }

        // init lightbox container
        modal = UI.$([
            '<div class="uk-modal">',
                '<div class="uk-modal-dialog uk-modal-dialog-lightbox uk-slidenav-position" style="margin-left:auto;margin-right:auto;width:200px;height:200px;top:'+Math.abs(window.innerHeight/2 - 200)+'px;">',
                    '<a href="#" class="uk-modal-close uk-close uk-close-alt"></a>',
                    '<div class="uk-lightbox-content"></div>',
                    '<div class="uk-modal-spinner uk-hidden"></div>',
                '</div>',
            '</div>'
        ].join('')).appendTo('body');

        modal.dialog  = modal.find('.uk-modal-dialog:first');
        modal.content = modal.find('.uk-lightbox-content:first');
        modal.loader  = modal.find('.uk-modal-spinner:first');
        modal.closer  = modal.find('.uk-close.uk-close-alt');
        modal.modal   = UI.modal(modal, {modal:false});

        // next / previous
        modal.on('swipeRight swipeLeft', function(e) {
            modal.lightbox[e.type=='swipeLeft' ? 'next':'previous']();
        }).on('click', '[data-lightbox-previous], [data-lightbox-next]', function(e){
            e.preventDefault();
            modal.lightbox[UI.$(this).is('[data-lightbox-next]') ? 'next':'previous']();
        });

        // destroy content on modal hide
        modal.on('hide.uk.modal', function(e) {
            modal.content.html('');
        });

        var resizeCache = {w: window.innerWidth, h:window.innerHeight};

        UI.$win.on('load resize orientationchange', UI.Utils.debounce(function(e){

            if (resizeCache.w !== window.innerWidth && modal.is(':visible') && !UI.Utils.isFullscreen()) {
                modal.lightbox.fitSize();
            }

            resizeCache = {w: window.innerWidth, h:window.innerHeight};

        }, 100));

        modal.lightbox = lightbox;

        return modal;
    }

    UI.lightbox.create = function(items, options) {

        if (!items) return;

        var group = [], o;

        items.forEach(function(item) {

            group.push(UI.$.extend({
                source : '',
                title  : '',
                type   : 'auto',
                link   : false
            }, (typeof(item) == 'string' ? {'source': item} : item)));
        });

        o = UI.lightbox(UI.$.extend({}, options, {'group':group}));

        return o;
    };

    return UI.lightbox;
});

/*! UIkit 2.27.5 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(addon) {

    var component;

    if (window.UIkit2) {
        component = addon(UIkit2);
    }

    if (typeof define == 'function' && define.amd) {
        define('uikit-notify', ['uikit'], function(){
            return component || addon(UIkit2);
        });
    }

})(function(UI){

    "use strict";

    var containers = {},
        messages   = {},

        notify     =  function(options){

            if (UI.$.type(options) == 'string') {
                options = { message: options };
            }

            if (arguments[1]) {
                options = UI.$.extend(options, UI.$.type(arguments[1]) == 'string' ? {status:arguments[1]} : arguments[1]);
            }

            return (new Message(options)).show();
        },
        closeAll  = function(group, instantly){

            var id;

            if (group) {
                for(id in messages) { if(group===messages[id].group) messages[id].close(instantly); }
            } else {
                for(id in messages) { messages[id].close(instantly); }
            }
        };

    var Message = function(options){

        this.options = UI.$.extend({}, Message.defaults, options);

        this.uuid    = UI.Utils.uid('notifymsg');
        this.element = UI.$([

            '<div class="uk-notify-message">',
                '<a class="uk-close"></a>',
                '<div></div>',
            '</div>'

        ].join('')).data("notifyMessage", this);

        this.content(this.options.message);

        // status
        if (this.options.status) {
            this.element.addClass('uk-notify-message-'+this.options.status);
            this.currentstatus = this.options.status;
        }

        this.group = this.options.group;

        messages[this.uuid] = this;

        if(!containers[this.options.pos]) {
            containers[this.options.pos] = UI.$('<div class="uk-notify uk-notify-'+this.options.pos+'"></div>').appendTo('body').on("click", ".uk-notify-message", function(){

                var message = UI.$(this).data('notifyMessage');

                message.element.trigger('manualclose.uk.notify', [message]);
                message.close();
            });
        }
    };


    UI.$.extend(Message.prototype, {

        uuid: false,
        element: false,
        timout: false,
        currentstatus: "",
        group: false,

        show: function() {

            if (this.element.is(':visible')) return;

            var $this = this;

            containers[this.options.pos].show().prepend(this.element);

            var marginbottom = parseInt(this.element.css('margin-bottom'), 10);

            this.element.css({opacity:0, marginTop: -1*this.element.outerHeight(), marginBottom:0}).animate({opacity:1, marginTop:0, marginBottom:marginbottom}, function(){

                if ($this.options.timeout) {

                    var closefn = function(){ $this.close(); };

                    $this.timeout = setTimeout(closefn, $this.options.timeout);

                    $this.element.hover(
                        function() { clearTimeout($this.timeout); },
                        function() { $this.timeout = setTimeout(closefn, $this.options.timeout);  }
                    );
                }

            });

            return this;
        },

        close: function(instantly) {

            var $this    = this,
                finalize = function(){
                    $this.element.remove();

                    if (!containers[$this.options.pos].children().length) {
                        containers[$this.options.pos].hide();
                    }

                    $this.options.onClose.apply($this, []);
                    $this.element.trigger('close.uk.notify', [$this]);

                    delete messages[$this.uuid];
                };

            if (this.timeout) clearTimeout(this.timeout);

            if (instantly) {
                finalize();
            } else {
                this.element.animate({opacity:0, marginTop: -1* this.element.outerHeight(), marginBottom:0}, function(){
                    finalize();
                });
            }
        },

        content: function(html){

            var container = this.element.find(">div");

            if(!html) {
                return container.html();
            }

            container.html(html);

            return this;
        },

        status: function(status) {

            if (!status) {
                return this.currentstatus;
            }

            this.element.removeClass('uk-notify-message-'+this.currentstatus).addClass('uk-notify-message-'+status);

            this.currentstatus = status;

            return this;
        }
    });

    Message.defaults = {
        message: "",
        status: "",
        timeout: 5000,
        group: null,
        pos: 'top-center',
        onClose: function() {}
    };

    UI.notify          = notify;
    UI.notify.message  = Message;
    UI.notify.closeAll = closeAll;

    return notify;
});

/*! UIkit 2.27.5 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
/*
 * Based on simplePagination - Copyright (c) 2012 Flavius Matis - http://flaviusmatis.github.com/simplePagination.js/ (MIT)
 */
(function(addon) {

    var component;

    if (window.UIkit2) {
        component = addon(UIkit2);
    }

    if (typeof define == 'function' && define.amd) {
        define('uikit-pagination', ['uikit'], function(){
            return component || addon(UIkit2);
        });
    }

})(function(UI){

    "use strict";

    UI.component('pagination', {

        defaults: {
            items          : 1,
            itemsOnPage    : 1,
            pages          : 0,
            displayedPages : 7,
            edges          : 1,
            currentPage    : 0,
            lblPrev        : false,
            lblNext        : false,
            onSelectPage   : function() {}
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$('[data-uk-pagination]', context).each(function(){
                    var ele = UI.$(this);

                    if (!ele.data('pagination')) {
                        UI.pagination(ele, UI.Utils.options(ele.attr('data-uk-pagination')));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.pages         = this.options.pages ?  this.options.pages : Math.ceil(this.options.items / this.options.itemsOnPage) ? Math.ceil(this.options.items / this.options.itemsOnPage) : 1;
            this.currentPage   = this.options.currentPage;
            this.halfDisplayed = this.options.displayedPages / 2;

            this.on('click', 'a[data-page]', function(e){
                e.preventDefault();
                $this.selectPage(UI.$(this).data('page'));
            });

            this._render();
        },

        _getInterval: function() {

            return {
                start: Math.ceil(this.currentPage > this.halfDisplayed ? Math.max(Math.min(this.currentPage - this.halfDisplayed, (this.pages - this.options.displayedPages)), 0) : 0),
                end  : Math.ceil(this.currentPage > this.halfDisplayed ? Math.min(this.currentPage + this.halfDisplayed, this.pages) : Math.min(this.options.displayedPages, this.pages))
            };
        },

        render: function(pages) {
            this.pages = pages ? pages : this.pages;
            this._render();
        },

        selectPage: function(pageIndex, pages) {
            this.currentPage = pageIndex;
            this.render(pages);

            this.options.onSelectPage.apply(this, [pageIndex]);
            this.trigger('select.uk.pagination', [pageIndex, this]);
        },

        _render: function() {

            var o = this.options, interval = this._getInterval(), i;

            this.element.empty();

            // Generate Prev link
            if (o.lblPrev) this._append(this.currentPage - 1, {text: o.lblPrev});

            // Generate start edges
            if (interval.start > 0 && o.edges > 0) {

                var end = Math.min(o.edges, interval.start);

                for (i = 0; i < end; i++) this._append(i);

                if (o.edges < interval.start && (interval.start - o.edges != 1)) {
                    this.element.append('<li><span>...</span></li>');
                } else if (interval.start - o.edges == 1) {
                    this._append(o.edges);
                }
            }

            // Generate interval links
            for (i = interval.start; i < interval.end; i++) this._append(i);

            // Generate end edges
            if (interval.end < this.pages && o.edges > 0) {

                if (this.pages - o.edges > interval.end && (this.pages - o.edges - interval.end != 1)) {
                    this.element.append('<li><span>...</span></li>');
                } else if (this.pages - o.edges - interval.end == 1) {
                    this._append(interval.end++);
                }

                var begin = Math.max(this.pages - o.edges, interval.end);

                for (i = begin; i < this.pages; i++) this._append(i);
            }

            // Generate Next link (unless option is set for at front)
            if (o.lblNext) this._append(this.currentPage + 1, {text: o.lblNext});
        },

        _append: function(pageIndex, opts) {

            var item, options;

            pageIndex = pageIndex < 0 ? 0 : (pageIndex < this.pages ? pageIndex : this.pages - 1);
            options   = UI.$.extend({ text: pageIndex + 1 }, opts);

            item = (pageIndex == this.currentPage) ? '<li class="uk-active"><span>' + (options.text) + '</span></li>' : '<li><a href="#page-'+(pageIndex+1)+'" data-page="'+pageIndex+'">'+options.text+'</a></li>';

            this.element.append(item);
        }
    });

    return UI.pagination;
});

/*! UIkit 2.27.5 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
/*
  * Based on nativesortable - Copyright (c) Brian Grinstead - https://github.com/bgrins/nativesortable
  */
(function(addon) {

    var component;

    if (window.UIkit2) {
        component = addon(UIkit2);
    }

    if (typeof define == 'function' && define.amd) {
        define('uikit-sortable', ['uikit'], function(){
            return component || addon(UIkit2);
        });
    }

})(function(UI){

    "use strict";

    var supportsTouch       = ('ontouchstart' in window || 'MSGesture' in window) || (window.DocumentTouch && document instanceof DocumentTouch),
        draggingPlaceholder, currentlyDraggingElement, currentlyDraggingTarget, dragging, moving, clickedlink, delayIdle, touchedlists, moved, overElement, startEvent;

    var POINTER_DOWN = supportsTouch ? ('MSGesture' in window || window.PointerEvent ? 'pointerdown':'touchstart') : 'mousedown',
        POINTER_MOVE = supportsTouch ? ('MSGesture' in window || window.PointerEvent ? 'pointermove':'touchmove') : 'mousemove',
        POINTER_UP   = supportsTouch ? ('MSGesture' in window || window.PointerEvent ? 'pointerup':'touchend') : 'mouseup';


    function closestSortable(ele) {

        ele = UI.$(ele);

        do {
            if (ele.data('sortable')) {
                return ele;
            }
            ele = UI.$(ele).parent();
        } while(ele.length);

        return ele;
    }

    UI.component('sortable', {

        defaults: {

            animation        : 150,
            threshold        : 10,

            childClass       : 'uk-sortable-item',
            placeholderClass : 'uk-sortable-placeholder',
            overClass        : 'uk-sortable-over',
            draggingClass    : 'uk-sortable-dragged',
            dragMovingClass  : 'uk-sortable-moving',
            baseClass        : 'uk-sortable',
            noDragClass      : 'uk-sortable-nodrag',
            emptyClass       : 'uk-sortable-empty',
            dragCustomClass  : '',
            handleClass      : false,
            group            : false,

            stop             : function() {},
            start            : function() {},
            change           : function() {}
        },

        boot: function() {

            // auto init
            UI.ready(function(context) {

                UI.$('[data-uk-sortable]', context).each(function(){

                    var ele = UI.$(this);

                    if(!ele.data('sortable')) {
                        UI.sortable(ele, UI.Utils.options(ele.attr('data-uk-sortable')));
                    }
                });
            });

            UI.$html.on(POINTER_MOVE, function(e) {

                if (delayIdle) {

                    var src = e.originalEvent.targetTouches ? e.originalEvent.targetTouches[0] : e;

                    if (Math.abs(src.pageX - delayIdle.pos.x) > delayIdle.threshold || Math.abs(src.pageY - delayIdle.pos.y) > delayIdle.threshold) {
                        delayIdle.apply(src);
                    }
                }

                if (draggingPlaceholder) {

                    if (!moving) {
                        moving = true;
                        draggingPlaceholder.show();

                        draggingPlaceholder.$current.addClass(draggingPlaceholder.$sortable.options.placeholderClass);
                        draggingPlaceholder.$sortable.element.children().addClass(draggingPlaceholder.$sortable.options.childClass);

                        UI.$html.addClass(draggingPlaceholder.$sortable.options.dragMovingClass);
                    }

                    var offset = draggingPlaceholder.data('mouse-offset'),
                        ev     = e.originalEvent.touches && e.originalEvent.touches[0] || e.originalEvent,
                        left   = parseInt(ev.pageX, 10) + offset.left,
                        top    = parseInt(ev.pageY, 10) + offset.top;

                    draggingPlaceholder.css({left: left, top: top });

                    // adjust document scrolling

                    if (top + (draggingPlaceholder.height()/3) > document.body.offsetHeight) {
                        return;
                    }

                    if (top < UI.$win.scrollTop()) {
                        UI.$win.scrollTop(UI.$win.scrollTop() - Math.ceil(draggingPlaceholder.height()/3));
                    } else if ( (top + (draggingPlaceholder.height()/3)) > (window.innerHeight + UI.$win.scrollTop()) ) {
                        UI.$win.scrollTop(UI.$win.scrollTop() + Math.ceil(draggingPlaceholder.height()/3));
                    }
                }
            });

            UI.$html.on(POINTER_UP, function(e) {

                delayIdle = clickedlink = false;

                // dragging?
                if (!currentlyDraggingElement || !draggingPlaceholder) {
                    // completely reset dragging attempt. will cause weird delay behavior elsewise
                    currentlyDraggingElement = draggingPlaceholder = null;
                    return;
                }

                // inside or outside of sortable?
                var sortable  = closestSortable(currentlyDraggingElement),
                    component = draggingPlaceholder.$sortable,
                    ev        = { type: e.type };

                if (sortable[0]) {
                    component.dragDrop(ev, component.element);
                }
                component.dragEnd(ev, component.element);
            });
        },

        init: function() {

            var $this   = this,
                element = this.element[0];

            touchedlists = [];

            this.checkEmptyList();

            this.element.data('sortable-group', this.options.group ? this.options.group : UI.Utils.uid('sortable-group'));

            var handleDragStart = delegate(function(e) {

                if (e.data && e.data.sortable) {
                    return;
                }

                var $target = UI.$(e.target),
                    $link   = $target.is('a[href]') ? $target:$target.parents('a[href]');

                if ($target.is(':input')) {
                    return;
                }

                if ($this.options.handleClass) {
                    var handle = $target.hasClass($this.options.handleClass) ? $target : $target.closest('.'+$this.options.handleClass, $this.element);
                    if (!handle.length) return;
                }

                e.preventDefault();

                if ($link.length) {

                    $link.one('click', function(e){
                        e.preventDefault();
                    }).one(POINTER_UP, function(){

                        if (!moved) {
                            $link.trigger('click');
                            if (supportsTouch && $link.attr('href').trim()) {
                                location.href = $link.attr('href');
                            }
                        }
                    });
                }

                e.data = e.data || {};

                e.data.sortable = element;

                return $this.dragStart(e, this);
            });

            var handleDragEnter = delegate(UI.Utils.debounce(function(e) {
                return $this.dragEnter(e, this);
            }), 40);

            var handleDragLeave = delegate(function(e) {

                // Prevent dragenter on a child from allowing a dragleave on the container
                var previousCounter = $this.dragenterData(this);
                $this.dragenterData(this, previousCounter - 1);

                // This is a fix for child elements firing dragenter before the parent fires dragleave
                if (!$this.dragenterData(this)) {
                    UI.$(this).removeClass($this.options.overClass);
                    $this.dragenterData(this, false);
                }
            });

            var handleTouchMove = delegate(function(e) {

                if (!currentlyDraggingElement ||
                    currentlyDraggingElement === this ||
                    currentlyDraggingTarget === this) {
                    return true;
                }

                $this.element.children().removeClass($this.options.overClass);
                currentlyDraggingTarget = this;

                $this.moveElementNextTo(currentlyDraggingElement, this);

                return prevent(e);
            });

            // Bind/unbind standard mouse/touch events as a polyfill.
            function addDragHandlers() {

                if (supportsTouch && startEvent.touches && startEvent.touches.length) {
                    element.addEventListener(POINTER_MOVE, handleTouchMove, false);
                } else {
                    element.addEventListener('mouseover', handleDragEnter, false);
                    element.addEventListener('mouseout', handleDragLeave, false);
                }

                // document.addEventListener("selectstart", prevent, false);
            }

            function removeDragHandlers() {
                if (supportsTouch && startEvent.touches && startEvent.touches.length) {
                    element.removeEventListener(POINTER_MOVE, handleTouchMove, false);
                } else {
                    element.removeEventListener('mouseover', handleDragEnter, false);
                    element.removeEventListener('mouseout', handleDragLeave, false);
                }

                // document.removeEventListener("selectstart", prevent, false);
            }

            this.addDragHandlers    = addDragHandlers;
            this.removeDragHandlers = removeDragHandlers;

            function handleDragMove(e) {

                if (!currentlyDraggingElement) {
                    return;
                }

                $this.dragMove(e, $this);
            }

            function delegate(fn) {

                return function(e) {

                    var touch, target, context;

                    startEvent = e;

                    if (e) {
                        touch  = e.touches && e.touches[0] || e;
                        target = touch.target || e.target;

                        // Fix event.target for a touch event
                        if (supportsTouch && document.elementFromPoint) {
                            
                            var _target = document.elementFromPoint(touch.pageX - document.body.scrollLeft, touch.pageY - document.body.scrollTop);

                            if (_target) {
                                target = _target;
                            }
                        }

                        overElement = UI.$(target);
                    }

                    if (UI.$(target).hasClass('.'+$this.options.childClass)) {
                        fn.apply(target, [e]);
                    } else if (target !== element) {

                        // If a child is initiating the event or ending it, then use the container as context for the callback.
                        context = moveUpToChildNode(element, target);

                        if (context) {
                            fn.apply(context, [e]);
                        }
                    }
                };
            }

            window.addEventListener(POINTER_MOVE, handleDragMove, false);
            element.addEventListener(POINTER_DOWN, handleDragStart, false);
        },

        dragStart: function(e, elem) {

            moved    = false;
            moving   = false;
            dragging = false;

            var $this    = this,
                target   = UI.$(e.target);

            if (!supportsTouch && e.button==2) {
                return;
            }

            if (target.is('.'+$this.options.noDragClass)) {
                return;
            }

            var noDragParent = target.closest('.'+$this.options.noDragClass);

            if (noDragParent.length && this.element.find(noDragParent[0]).length) {
                return;
            }

            // prevent dragging if taget is a form field
            if (target.is(':input')) {
                return;
            }

            currentlyDraggingElement = elem;

            // init drag placeholder
            if (draggingPlaceholder) {
                draggingPlaceholder.remove();
            }

            var $current = UI.$(currentlyDraggingElement), offset = $current.offset(), ev = e.touches && e.touches[0] || e;

            delayIdle = {

                pos       : { x:ev.pageX, y:ev.pageY },
                threshold : $this.options.handleClass ? 1 : $this.options.threshold,
                apply     : function(evt) {

                    draggingPlaceholder = UI.$('<div class="'+([$this.options.draggingClass, $this.options.dragCustomClass].join(' '))+'"></div>').css({
                        display : 'none',
                        top     : offset.top,
                        left    : offset.left,
                        width   : $current.width(),
                        height  : $current.height(),
                        padding : $current.css('padding')
                    }).data({
                        'mouse-offset': {
                            left : offset.left - parseInt(ev.pageX, 10),
                            top  : offset.top  - parseInt(ev.pageY, 10)
                        },
                        origin : $this.element,
                        index  : $current.index()
                    }).append($current.html()).appendTo('body');

                    draggingPlaceholder.$current  = $current;
                    draggingPlaceholder.$sortable = $this;

                    $current.data({
                        'start-list': $current.parent(),
                        'start-index': $current.index(),
                        'sortable-group': $this.options.group
                    });

                    $this.addDragHandlers();

                    $this.options.start(this, currentlyDraggingElement);
                    $this.trigger('start.uk.sortable', [$this, currentlyDraggingElement, draggingPlaceholder]);

                    moved     = true;
                    delayIdle = false;
                }
            };
        },

        dragMove: function(e, elem) {

            overElement = UI.$(document.elementFromPoint(e.pageX - (document.body.scrollLeft || document.scrollLeft || 0), e.pageY - (document.body.scrollTop || document.documentElement.scrollTop || 0)));

            var overRoot     = overElement.closest('.'+this.options.baseClass),
                groupOver    = overRoot.data('sortable-group'),
                $current     = UI.$(currentlyDraggingElement),
                currentRoot  = $current.parent(),
                groupCurrent = $current.data('sortable-group'),
                overChild;

            if (overRoot[0] !== currentRoot[0] && groupCurrent !== undefined && groupOver === groupCurrent) {

                overRoot.data('sortable').addDragHandlers();

                touchedlists.push(overRoot);
                overRoot.children().addClass(this.options.childClass);

                // swap root
                if (overRoot.children().length > 0) {
                    overChild = overElement.closest('.'+this.options.childClass);

                    if (overChild.length) {
                        overChild.before($current);
                    } else {
                        overRoot.append($current);
                    }

                } else { // empty list
                    overElement.append($current);
                }

                UI.$doc.trigger('mouseover');
            }

            this.checkEmptyList();
            this.checkEmptyList(currentRoot);
        },

        dragEnter: function(e, elem) {

            if (!currentlyDraggingElement || currentlyDraggingElement === elem) {
                return true;
            }

            var previousCounter = this.dragenterData(elem);

            this.dragenterData(elem, previousCounter + 1);

            // Prevent dragenter on a child from allowing a dragleave on the container
            if (previousCounter === 0) {

                var currentlist = UI.$(elem).parent(),
                    startlist   = UI.$(currentlyDraggingElement).data('start-list');

                if (currentlist[0] !== startlist[0]) {

                    var groupOver    = currentlist.data('sortable-group'),
                        groupCurrent = UI.$(currentlyDraggingElement).data('sortable-group');

                    if ((groupOver ||  groupCurrent) && (groupOver != groupCurrent)) {
                        return false;
                    }
                }

                UI.$(elem).addClass(this.options.overClass);
                this.moveElementNextTo(currentlyDraggingElement, elem);
            }

            return false;
        },

        dragEnd: function(e, elem) {

            var $this = this;

            // avoid triggering event twice
            if (currentlyDraggingElement) {
                // TODO: trigger on right element?
                this.options.stop(elem);
                this.trigger('stop.uk.sortable', [this]);
            }

            currentlyDraggingElement = null;
            currentlyDraggingTarget  = null;

            touchedlists.push(this.element);
            touchedlists.forEach(function(el, i) {
                UI.$(el).children().each(function() {
                    if (this.nodeType === 1) {
                        UI.$(this).removeClass($this.options.overClass)
                            .removeClass($this.options.placeholderClass)
                            .removeClass($this.options.childClass);
                        $this.dragenterData(this, false);
                    }
                });
            });

            touchedlists = [];

            UI.$html.removeClass(this.options.dragMovingClass);

            this.removeDragHandlers();

            if (draggingPlaceholder) {
                draggingPlaceholder.remove();
                draggingPlaceholder = null;
            }
        },

        dragDrop: function(e, elem) {

            if (e.type === 'drop') {

                if (e.stopPropagation) {
                    e.stopPropagation();
                }

                if (e.preventDefault) {
                    e.preventDefault();
                }
            }

            this.triggerChangeEvents();
        },

        triggerChangeEvents: function() {

            // trigger events once
            if (!currentlyDraggingElement) return;

            var $current = UI.$(currentlyDraggingElement),
                oldRoot  = draggingPlaceholder.data('origin'),
                newRoot  = $current.closest('.'+this.options.baseClass),
                triggers = [],
                el       = UI.$(currentlyDraggingElement);

            // events depending on move inside lists or across lists
            if (oldRoot[0] === newRoot[0] && draggingPlaceholder.data('index') != $current.index() ) {
                triggers.push({sortable: this, mode: 'moved'});
            } else if (oldRoot[0] != newRoot[0]) {
                triggers.push({sortable: UI.$(newRoot).data('sortable'), mode: 'added'}, {sortable: UI.$(oldRoot).data('sortable'), mode: 'removed'});
            }

            triggers.forEach(function (trigger, i) {
                if (trigger.sortable) {
                    trigger.sortable.element.trigger('change.uk.sortable', [trigger.sortable, el, trigger.mode]);
                }
            });
        },

        dragenterData: function(element, val) {

            element = UI.$(element);

            if (arguments.length == 1) {
                return parseInt(element.data('child-dragenter'), 10) || 0;
            } else if (!val) {
                element.removeData('child-dragenter');
            } else {
                element.data('child-dragenter', Math.max(0, val));
            }
        },

        moveElementNextTo: function(element, elementToMoveNextTo) {

            dragging = true;

            var $this    = this,
                list     = UI.$(element).parent().css('min-height', ''),
                next     = isBelow(element, elementToMoveNextTo) ? elementToMoveNextTo : elementToMoveNextTo.nextSibling,
                children = list.children(),
                count    = children.length;

            if (!$this.options.animation) {
                elementToMoveNextTo.parentNode.insertBefore(element, next);
                UI.Utils.checkDisplay($this.element.parent());
                return;
            }

            list.css('min-height', list.height());

            children.stop().each(function(){
                var ele = UI.$(this),
                    offset = ele.position();

                    offset.width = ele.width();

                ele.data('offset-before', offset);
            });

            elementToMoveNextTo.parentNode.insertBefore(element, next);

            UI.Utils.checkDisplay($this.element.parent());

            children = list.children().each(function() {
                var ele    = UI.$(this);
                ele.data('offset-after', ele.position());
            }).each(function() {
                var ele    = UI.$(this),
                    before = ele.data('offset-before');
                ele.css({position:'absolute', top:before.top, left:before.left, minWidth:before.width });
            });

            children.each(function(){

                var ele    = UI.$(this),
                    before = ele.data('offset-before'),
                    offset = ele.data('offset-after');

                    ele.css('pointer-events', 'none').width();

                    setTimeout(function(){
                        ele.animate({'top':offset.top, 'left':offset.left}, $this.options.animation, function() {
                            ele.css({position:'',top:'', left:'', minWidth: '', 'pointer-events':''}).removeClass($this.options.overClass).removeData('child-dragenter');
                            count--;
                            if (!count) {
                                list.css('min-height', '');
                                UI.Utils.checkDisplay($this.element.parent());
                            }
                        });
                    }, 0);
            });
        },

        serialize: function() {

            var data = [], item, attribute;

            this.element.children().each(function(j, child) {
                item = {};
                for (var i = 0, attr, val; i < child.attributes.length; i++) {
                    attribute = child.attributes[i];
                    if (attribute.name.indexOf('data-') === 0) {
                        attr       = attribute.name.substr(5);
                        val        =  UI.Utils.str2json(attribute.value);
                        item[attr] = (val || attribute.value=='false' || attribute.value=='0') ? val:attribute.value;
                    }
                }
                data.push(item);
            });

            return data;
        },

        checkEmptyList: function(list) {

            list  = list ? UI.$(list) : this.element;

            if (this.options.emptyClass) {
                list[!list.children().length ? 'addClass':'removeClass'](this.options.emptyClass);
            }
        }
    });

    // helpers

    function isBelow(el1, el2) {

        var parent = el1.parentNode;

        if (el2.parentNode != parent) {
            return false;
        }

        var cur = el1.previousSibling;

        while (cur && cur.nodeType !== 9) {
            if (cur === el2) {
                return true;
            }
            cur = cur.previousSibling;
        }

        return false;
    }

    function moveUpToChildNode(parent, child) {
        var cur = child;
        if (cur == parent) { return null; }

        while (cur) {
            if (cur.parentNode === parent) {
                return cur;
            }

            cur = cur.parentNode;
            if ( !cur || !cur.ownerDocument || cur.nodeType === 11 ) {
                break;
            }
        }
        return null;
    }

    function prevent(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.returnValue = false;
    }

    return UI.sortable;
});

/*! UIkit 2.27.5 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(addon) {

    var component;

    if (window.UIkit2) {
        component = addon(UIkit2);
    }

    if (typeof define == 'function' && define.amd) {
        define('uikit-sticky', ['uikit'], function(){
            return component || addon(UIkit2);
        });
    }

})(function(UI){

    "use strict";

    var $win         = UI.$win,
        $doc         = UI.$doc,
        sticked      = [],
        direction    = 1;

    UI.component('sticky', {

        defaults: {
            top          : 0,
            bottom       : 0,
            animation    : '',
            clsinit      : 'uk-sticky-init',
            clsactive    : 'uk-active',
            clsinactive  : '',
            getWidthFrom : '',
            showup       : false,
            boundary     : false,
            media        : false,
            target       : false,
            disabled     : false
        },

        boot: function() {

            // should be more efficient than using $win.scroll(checkscrollposition):
            UI.$doc.on('scrolling.uk.document', function(e, data) {
                if (!data || !data.dir) return;
                direction = data.dir.y;
                checkscrollposition();
            });

            UI.$win.on('resize orientationchange', UI.Utils.debounce(function() {

                if (!sticked.length) return;

                for (var i = 0; i < sticked.length; i++) {
                    sticked[i].reset(true);
                    sticked[i].self.computeWrapper();
                }

                checkscrollposition();
            }, 100));

            // init code
            UI.ready(function(context) {

                setTimeout(function(){

                    UI.$('[data-uk-sticky]', context).each(function(){

                        var $ele = UI.$(this);

                        if (!$ele.data('sticky')) {
                            UI.sticky($ele, UI.Utils.options($ele.attr('data-uk-sticky')));
                        }
                    });

                    checkscrollposition();
                }, 0);
            });
        },

        init: function() {

            var boundary = this.options.boundary, boundtoparent;

            this.wrapper = this.element.wrap('<div class="uk-sticky-placeholder"></div>').parent();
            this.computeWrapper();
            this.wrapper.css({
                'margin-top'    : this.element.css('margin-top'),
                'margin-bottom' : this.element.css('margin-bottom'),
                'margin-left'   : this.element.css('margin-left'),
                'margin-right'  : this.element.css('margin-right')
            })
            this.element.css('margin', 0);

            if (boundary) {

                if (boundary === true || boundary[0] === '!') {

                    boundary      = boundary === true ? this.wrapper.parent() : this.wrapper.closest(boundary.substr(1));
                    boundtoparent = true;

                } else if (typeof boundary === "string") {
                    boundary = UI.$(boundary);
                }
            }

            this.sticky = {
                self          : this,
                options       : this.options,
                element       : this.element,
                currentTop    : null,
                wrapper       : this.wrapper,
                init          : false,
                getWidthFrom  : UI.$(this.options.getWidthFrom || this.wrapper),
                boundary      : boundary,
                boundtoparent : boundtoparent,
                top           : 0,
                calcTop       : function() {

                    var top = this.options.top;

                    // dynamic top parameter
                    if (this.options.top && typeof(this.options.top) == 'string') {

                        // e.g. 50vh
                        if (this.options.top.match(/^(-|)(\d+)vh$/)) {
                            top = window.innerHeight * parseInt(this.options.top, 10)/100;
                        // e.g. #elementId, or .class-1,class-2,.class-3 (first found is used)
                        } else {

                            var topElement = UI.$(this.options.top).first();

                            if (topElement.length && topElement.is(':visible')) {
                                top = -1 * ((topElement.offset().top + topElement.outerHeight()) - this.wrapper.offset().top);
                            }
                        }

                    }

                    this.top = top;
                },

                reset: function(force) {

                    this.calcTop();

                    var finalize = function() {
                        this.element.css({position:'', top:'', width:'', left:'', margin:'0'});
                        this.element.removeClass([this.options.animation, 'uk-animation-reverse', this.options.clsactive].join(' '));
                        this.element.addClass(this.options.clsinactive);
                        this.element.trigger('inactive.uk.sticky');

                        this.currentTop = null;
                        this.animate    = false;

                    }.bind(this);


                    if (!force && this.options.animation && UI.support.animation && !UI.Utils.isInView(this.wrapper)) {

                        this.animate = true;

                        this.element.removeClass(this.options.animation).one(UI.support.animation.end, function(){
                            finalize();
                        }).width(); // force redraw

                        this.element.addClass(this.options.animation+' '+'uk-animation-reverse');
                    } else {
                        finalize();
                    }
                },

                check: function() {

                    if (this.options.disabled) {
                        return false;
                    }

                    if (this.options.media) {

                        switch(typeof(this.options.media)) {
                            case 'number':
                                if (window.innerWidth < this.options.media) {
                                    return false;
                                }
                                break;
                            case 'string':
                                if (window.matchMedia && !window.matchMedia(this.options.media).matches) {
                                    return false;
                                }
                                break;
                        }
                    }

                    var scrollTop      = $win.scrollTop(),
                        documentHeight = $doc.height(),
                        dwh            = documentHeight - window.innerHeight,
                        extra          = (scrollTop > dwh) ? dwh - scrollTop : 0,
                        elementTop     = this.wrapper.offset().top,
                        etse           = elementTop - this.top - extra,
                        active         = (scrollTop  >= etse);

                    if (active && this.options.showup) {

                        // set inactiv if scrolling down
                        if (direction == 1) {
                            active = false;
                        }

                        // set inactive when wrapper is still in view
                        if (direction == -1 && !this.element.hasClass(this.options.clsactive) && UI.Utils.isInView(this.wrapper)) {
                            active = false;
                        }
                    }

                    return active;
                }
            };

            this.sticky.calcTop();

            sticked.push(this.sticky);
        },

        update: function() {
            checkscrollposition(this.sticky);
        },

        enable: function() {
            this.options.disabled = false;
            this.update();
        },

        disable: function(force) {
            this.options.disabled = true;
            this.sticky.reset(force);
        },

        computeWrapper: function() {

            this.wrapper.css({
                'height'        : ['absolute','fixed'].indexOf(this.element.css('position')) == -1 ? this.element.outerHeight() : '',
                'float'         : this.element.css('float') != 'none' ? this.element.css('float') : ''
            });

            if (this.element.css('position') == 'fixed') {
                this.element.css({
                    width: this.sticky.getWidthFrom.length ? this.sticky.getWidthFrom.width() : this.element.width()
                });
            }
        }
    });

    function checkscrollposition(direction) {

        var stickies = arguments.length ? arguments : sticked;

        if (!stickies.length || $win.scrollTop() < 0) return;

        var scrollTop       = $win.scrollTop(),
            documentHeight  = $doc.height(),
            windowHeight    = $win.height(),
            dwh             = documentHeight - windowHeight,
            extra           = (scrollTop > dwh) ? dwh - scrollTop : 0,
            newTop, containerBottom, stickyHeight, sticky;

        for (var i = 0; i < stickies.length; i++) {

            sticky = stickies[i];

            if (!sticky.element.is(':visible') || sticky.animate) {
                continue;
            }

            if (!sticky.check()) {

                if (sticky.currentTop !== null) {
                    sticky.reset();
                }

            } else {

                if (sticky.top < 0) {
                    newTop = 0;
                } else {
                    stickyHeight = sticky.element.outerHeight();
                    newTop = documentHeight - stickyHeight - sticky.top - sticky.options.bottom - scrollTop - extra;
                    newTop = newTop < 0 ? newTop + sticky.top : sticky.top;
                }

                if (sticky.boundary && sticky.boundary.length) {

                    var bTop = sticky.boundary.offset().top;

                    if (sticky.boundtoparent) {
                        containerBottom = documentHeight - (bTop + sticky.boundary.outerHeight()) + parseInt(sticky.boundary.css('padding-bottom'));
                    } else {
                        containerBottom = documentHeight - bTop;
                    }

                    newTop = (scrollTop + stickyHeight) > (documentHeight - containerBottom - (sticky.top < 0 ? 0 : sticky.top)) ? (documentHeight - containerBottom) - (scrollTop + stickyHeight) : newTop;
                }


                if (sticky.currentTop != newTop) {

                    sticky.element.css({
                        position : 'fixed',
                        top      : newTop,
                        width    : sticky.getWidthFrom.length ? sticky.getWidthFrom.width() : sticky.element.width()
                    });

                    if (!sticky.init) {

                        sticky.element.addClass(sticky.options.clsinit);

                        if (location.hash && scrollTop > 0 && sticky.options.target) {

                            var $target = UI.$(location.hash);

                            if ($target.length) {

                                setTimeout((function($target, sticky){

                                    return function() {

                                        sticky.element.width(); // force redraw

                                        var offset       = $target.offset(),
                                            maxoffset    = offset.top + $target.outerHeight(),
                                            stickyOffset = sticky.element.offset(),
                                            stickyHeight = sticky.element.outerHeight(),
                                            stickyMaxOffset = stickyOffset.top + stickyHeight;

                                        if (stickyOffset.top < maxoffset && offset.top < stickyMaxOffset) {
                                            scrollTop = offset.top - stickyHeight - sticky.options.target;
                                            window.scrollTo(0, scrollTop);
                                        }
                                    };

                                })($target, sticky), 0);
                            }
                        }
                    }

                    sticky.element.addClass(sticky.options.clsactive).removeClass(sticky.options.clsinactive);
                    sticky.element.trigger('active.uk.sticky');
                    sticky.element.css('margin', '');

                    if (sticky.options.animation && sticky.init && !UI.Utils.isInView(sticky.wrapper)) {
                        sticky.element.addClass(sticky.options.animation);
                    }

                    sticky.currentTop = newTop;
                }
            }

            sticky.init = true;
        }
    }

    return UI.sticky;
});

/*! UIkit 2.27.5 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(addon) {
    var component;

    if (window.UIkit2) {
        component = addon(UIkit2);
    }

    if (typeof define == 'function' && define.amd) {
        define('uikit-tooltip', ['uikit'], function(){
            return component || addon(UIkit2);
        });
    }

})(function(UI){

    "use strict";

    var $tooltip,   // tooltip container
        tooltipdelay, checkIdle;

    UI.component('tooltip', {

        defaults: {
            offset: 5,
            pos: 'top',
            animation: false,
            delay: 0, // in miliseconds
            cls: '',
            activeClass: 'uk-active',
            src: function(ele) {
                var title = ele.attr('title');

                if (title !== undefined) {
                    ele.data('cached-title', title).removeAttr('title');
                }

                return ele.data("cached-title");
            }
        },

        tip: '',

        boot: function() {

            // init code
            UI.$html.on('mouseenter.tooltip.uikit focus.tooltip.uikit', '[data-uk-tooltip]', function(e) {
                var ele = UI.$(this);

                if (!ele.data('tooltip')) {
                    UI.tooltip(ele, UI.Utils.options(ele.attr('data-uk-tooltip')));
                    ele.trigger('mouseenter');
                }
            });
        },

        init: function() {

            var $this = this;

            if (!$tooltip) {
                $tooltip = UI.$('<div class="uk-tooltip"></div>').appendTo("body");
            }

            this.on({
                focus      : function(e) { $this.show(); },
                blur       : function(e) { $this.hide(); },
                mouseenter : function(e) { $this.show(); },
                mouseleave : function(e) { $this.hide(); }
            });
        },

        show: function() {

            this.tip = typeof(this.options.src) === 'function' ? this.options.src(this.element) : this.options.src;

            if (tooltipdelay) clearTimeout(tooltipdelay);
            if (checkIdle)    clearInterval(checkIdle);

            if (typeof(this.tip) === 'string' ? !this.tip.length:true) return;

            $tooltip.stop().css({top: -2000, visibility: 'hidden'}).removeClass(this.options.activeClass).show();
            $tooltip.html('<div class="uk-tooltip-inner">' + this.tip + '</div>');

            var $this      = this,
                pos        = UI.$.extend({}, this.element.offset(), {width: this.element[0].offsetWidth, height: this.element[0].offsetHeight}),
                width      = $tooltip[0].offsetWidth,
                height     = $tooltip[0].offsetHeight,
                offset     = typeof(this.options.offset) === "function" ? this.options.offset.call(this.element) : this.options.offset,
                position   = typeof(this.options.pos) === "function" ? this.options.pos.call(this.element) : this.options.pos,
                tmppos     = position.split("-"),
                tcss       = {
                    display    : 'none',
                    visibility : 'visible',
                    top        : (pos.top + pos.height + height),
                    left       : pos.left
                };


            // prevent strange position
            // when tooltip is in offcanvas etc.
            if (UI.$html.css('position')=='fixed' || UI.$body.css('position')=='fixed'){
                var bodyoffset = UI.$('body').offset(),
                    htmloffset = UI.$('html').offset(),
                    docoffset  = {top: (htmloffset.top + bodyoffset.top), left: (htmloffset.left + bodyoffset.left)};

                pos.left -= docoffset.left;
                pos.top  -= docoffset.top;
            }


            if ((tmppos[0] == 'left' || tmppos[0] == 'right') && UI.langdirection == 'right') {
                tmppos[0] = tmppos[0] == 'left' ? 'right' : 'left';
            }

            var variants =  {
                bottom  : {top: pos.top + pos.height + offset, left: pos.left + pos.width / 2 - width / 2},
                top     : {top: pos.top - height - offset, left: pos.left + pos.width / 2 - width / 2},
                left    : {top: pos.top + pos.height / 2 - height / 2, left: pos.left - width - offset},
                right   : {top: pos.top + pos.height / 2 - height / 2, left: pos.left + pos.width + offset}
            };

            UI.$.extend(tcss, variants[tmppos[0]]);

            if (tmppos.length == 2) tcss.left = (tmppos[1] == 'left') ? (pos.left) : ((pos.left + pos.width) - width);

            var boundary = this.checkBoundary(tcss.left, tcss.top, width, height);

            if(boundary) {

                switch(boundary) {
                    case 'x':

                        if (tmppos.length == 2) {
                            position = tmppos[0]+"-"+(tcss.left < 0 ? 'left': 'right');
                        } else {
                            position = tcss.left < 0 ? 'right': 'left';
                        }

                        break;

                    case 'y':
                        if (tmppos.length == 2) {
                            position = (tcss.top < 0 ? 'bottom': 'top')+'-'+tmppos[1];
                        } else {
                            position = (tcss.top < 0 ? 'bottom': 'top');
                        }

                        break;

                    case 'xy':
                        if (tmppos.length == 2) {
                            position = (tcss.top < 0 ? 'bottom': 'top')+'-'+(tcss.left < 0 ? 'left': 'right');
                        } else {
                            position = tcss.left < 0 ? 'right': 'left';
                        }

                        break;

                }

                tmppos = position.split('-');

                UI.$.extend(tcss, variants[tmppos[0]]);

                if (tmppos.length == 2) tcss.left = (tmppos[1] == 'left') ? (pos.left) : ((pos.left + pos.width) - width);
            }


            tcss.left -= UI.$body.position().left;

            tooltipdelay = setTimeout(function(){

                $tooltip.css(tcss).attr('class', ['uk-tooltip', 'uk-tooltip-'+position, $this.options.cls].join(' '));

                if ($this.options.animation) {
                    $tooltip.css({opacity: 0, display: 'block'}).addClass($this.options.activeClass).animate({opacity: 1}, parseInt($this.options.animation, 10) || 400);
                } else {
                    $tooltip.show().addClass($this.options.activeClass);
                }

                tooltipdelay = false;

                // close tooltip if element was removed or hidden
                checkIdle = setInterval(function(){
                    if(!$this.element.is(':visible')) $this.hide();
                }, 150);

            }, parseInt(this.options.delay, 10) || 0);
        },

        hide: function() {

            if (this.element.is('input') && this.element[0]===document.activeElement) return;

            if (tooltipdelay) clearTimeout(tooltipdelay);
            if (checkIdle)  clearInterval(checkIdle);

            $tooltip.stop();

            if (this.options.animation) {

                var $this = this;

                $tooltip.fadeOut(parseInt(this.options.animation, 10) || 400, function(){
                    $tooltip.removeClass($this.options.activeClass)
                });

            } else {
                $tooltip.hide().removeClass(this.options.activeClass);
            }
        },

        content: function() {
            return this.tip;
        },

        checkBoundary: function(left, top, width, height) {

            var axis = "";

            if(left < 0 || ((left - UI.$win.scrollLeft())+width) > window.innerWidth) {
               axis += "x";
            }

            if(top < 0 || ((top - UI.$win.scrollTop())+height) > window.innerHeight) {
               axis += "y";
            }

            return axis;
        }
    });

    return UI.tooltip;
});

//Serialize object
$.fn.serializeObject = function()
{
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};
/*! Jcrop.js v2.0.4 - build: 20151117
 *  @copyright 2008-2015 Tapmodo Interactive LLC
 *  @license Free software under MIT License
 *  @website http://jcrop.org/
 **/
(function($){
  'use strict';

  // Jcrop constructor
  var Jcrop = function(element,opt){
    var _ua = navigator.userAgent.toLowerCase();

    this.opt = $.extend({},Jcrop.defaults,opt || {});

    this.container = $(element);

    this.opt.is_msie = /msie/.test(_ua);
    this.opt.is_ie_lt9 = /msie [1-8]\./.test(_ua);

    this.container.addClass(this.opt.css_container);

    this.ui = {};
    this.state = null;
    this.ui.multi = [];
    this.ui.selection = null;
    this.filter = {};

    this.init();
    this.setOptions(opt);
    this.applySizeConstraints();
    this.container.trigger('cropinit',this);
      
    // IE<9 doesn't work if mouse events are attached to window
    if (this.opt.is_ie_lt9)
      this.opt.dragEventTarget = document.body;
  };


  // Jcrop static functions
  $.extend(Jcrop,{
    component: { },
    filter: { },
    stage: { },
    registerComponent: function(name,component){
      Jcrop.component[name] = component;
    },
    registerFilter: function(name,filter){
      Jcrop.filter[name] = filter;
    },
    registerStageType: function(name,stage){
      Jcrop.stage[name] = stage;
    },
    // attach: function(element,opt){{{
    attach: function(element,opt){
      var obj = new $.Jcrop(element,opt);
      return obj;
    },
    // }}}
    // imgCopy: function(imgel){{{
    imgCopy: function(imgel){
      var img = new Image;
      img.src = imgel.src;
      return img;
    },
    // }}}
    // imageClone: function(imgel){{{
    imageClone: function(imgel){
      return $.Jcrop.supportsCanvas?
        Jcrop.canvasClone(imgel):
        Jcrop.imgCopy(imgel);
    },
    // }}}
    // canvasClone: function(imgel){{{
    canvasClone: function(imgel){
      var canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d');

      $(canvas).width(imgel.width).height(imgel.height),
      canvas.width = imgel.naturalWidth;
      canvas.height = imgel.naturalHeight;
      ctx.drawImage(imgel,0,0,imgel.naturalWidth,imgel.naturalHeight);
      return canvas;
    },
    // }}}
    // propagate: function(plist,config,obj){{{
    propagate: function(plist,config,obj){
      for(var i=0,l=plist.length;i<l;i++)
        if (config.hasOwnProperty(plist[i]))
          obj[plist[i]] = config[plist[i]];
    },
    // }}}
    // getLargestBox: function(ratio,w,h){{{
    getLargestBox: function(ratio,w,h){
      if ((w/h) > ratio)
        return [ h * ratio, h ];
          else return [ w, w / ratio ];
    },
    // }}}
    // stageConstructor: function(el,options,callback){{{
    stageConstructor: function(el,options,callback){

      // Get a priority-ordered list of available stages
      var stages = [];
      $.each(Jcrop.stage,function(i,e){
        stages.push(e);
      });
      stages.sort(function(a,b){ return a.priority - b.priority; });

      // Find the first one that supports this element
      for(var i=0,l=stages.length;i<l;i++){
        if (stages[i].isSupported(el,options)){
          stages[i].create(el,options,function(obj,opt){
            if (typeof callback == 'function') callback(obj,opt);
          });
          break;
        }
      }
    },
    // }}}
    // supportsColorFade: function(){{{
    supportsColorFade: function(){
      return $.fx.step.hasOwnProperty('backgroundColor');
    },
    // }}}
    // wrapFromXywh: function(xywh){{{
    wrapFromXywh: function(xywh){
      var b = { x: xywh[0], y: xywh[1], w: xywh[2], h: xywh[3] };
      b.x2 = b.x + b.w;
      b.y2 = b.y + b.h;
      return b;
    }
    // }}}
  });

var AbstractStage = function(){
};

$.extend(AbstractStage,{
  isSupported: function(el,o){
    // @todo: should actually check if it's an HTML element
    return true;
  },
  // A higher priority means less desirable
  // AbstractStage is the last one we want to use
  priority: 100,
  create: function(el,options,callback){
    var obj = new AbstractStage;
    obj.element = el;
    callback.call(this,obj,options);
  },
  prototype: {
    attach: function(core){
      this.init(core);
      core.ui.stage = this;
    },
    triggerEvent: function(ev){
      $(this.element).trigger(ev);
      return this;
    },
    getElement: function(){
      return this.element;
    }
  }
});
Jcrop.registerStageType('Block',AbstractStage);


var ImageStage = function(){
};

ImageStage.prototype = new AbstractStage();

$.extend(ImageStage,{
  isSupported: function(el,o){
    if (el.tagName == 'IMG') return true;
  },
  priority: 90,
  create: function(el,options,callback){
    $.Jcrop.component.ImageLoader.attach(el,function(w,h){
      var obj = new ImageStage;
      obj.element = $(el).wrap('<div />').parent();

      obj.element.width(w).height(h);
      obj.imgsrc = el;

      if (typeof callback == 'function')
        callback.call(this,obj,options);
    });
  }
});
Jcrop.registerStageType('Image',ImageStage);


var CanvasStage = function(){
  this.angle = 0;
  this.scale = 1;
  this.scaleMin = 0.2;
  this.scaleMax = 1.25;
  this.offset = [0,0];
};

CanvasStage.prototype = new ImageStage();

$.extend(CanvasStage,{
  isSupported: function(el,o){
    if ($.Jcrop.supportsCanvas && (el.tagName == 'IMG')) return true;
  },
  priority: 60,
  create: function(el,options,callback){
    var $el = $(el);
    var opt = $.extend({},options);
    $.Jcrop.component.ImageLoader.attach(el,function(w,h){
      var obj = new CanvasStage;
      $el.hide();
      obj.createCanvas(el,w,h);
      $el.before(obj.element);
      obj.imgsrc = el;
      opt.imgsrc = el;

      if (typeof callback == 'function'){
        callback(obj,opt);
        obj.redraw();
      }
    });
  }
});

$.extend(CanvasStage.prototype,{
  init: function(core){
    this.core = core;
  },
  // setOffset: function(x,y) {{{
  setOffset: function(x,y) {
    this.offset = [x,y];
    return this;
  },
  // }}}
  // setAngle: function(v) {{{
  setAngle: function(v) {
    this.angle = v;
    return this;
  },
  // }}}
  // setScale: function(v) {{{
  setScale: function(v) {
    this.scale = this.boundScale(v);
    return this;
  },
  // }}}
  boundScale: function(v){
    if (v<this.scaleMin) v = this.scaleMin;
    else if (v>this.scaleMax) v = this.scaleMax;
    return v;
  },
  createCanvas: function(img,w,h){
    this.width = w;
    this.height = h;
    this.canvas = document.createElement('canvas');
    this.canvas.width = w;
    this.canvas.height = h;
    this.$canvas = $(this.canvas).width('100%').height('100%');
    this.context = this.canvas.getContext('2d');
    this.fillstyle = "rgb(0,0,0)";
    this.element = this.$canvas.wrap('<div />').parent().width(w).height(h);
  },
  triggerEvent: function(ev){
    this.$canvas.trigger(ev);
    return this;
  },
  // clear: function() {{{
  clear: function() {
    this.context.fillStyle = this.fillstyle;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    return this;
  },
  // }}}
  // redraw: function() {{{
  redraw: function() {
    // Save the current context
    this.context.save();
    this.clear();

    // Translate to the center point of our image
    this.context.translate(parseInt(this.width * 0.5), parseInt(this.height * 0.5));
    // Perform the rotation and scaling
    this.context.translate(this.offset[0]/this.core.opt.xscale,this.offset[1]/this.core.opt.yscale);
    this.context.rotate(this.angle * (Math.PI/180));
    this.context.scale(this.scale,this.scale);
    // Translate back to the top left of our image
    this.context.translate(-parseInt(this.width * 0.5), -parseInt(this.height * 0.5));
    // Finally we draw the image
    this.context.drawImage(this.imgsrc,0,0,this.width,this.height);

    // And restore the updated context
    this.context.restore();
    this.$canvas.trigger('cropredraw');
    return this;
  },
  // }}}
  // setFillStyle: function(v) {{{
  setFillStyle: function(v) {
    this.fillstyle = v;
    return this;
  }
  // }}}
});

Jcrop.registerStageType('Canvas',CanvasStage);


  /**
   *  BackoffFilter
   *  move out-of-bounds selection into allowed position at same size
   */
  var BackoffFilter = function(){
    this.minw = 40;
    this.minh = 40;
    this.maxw = 0;
    this.maxh = 0;
    this.core = null;
  };
  $.extend(BackoffFilter.prototype,{
    tag: 'backoff',
    priority: 22,
    filter: function(b){
      var r = this.bound;

      if (b.x < r.minx) { b.x = r.minx; b.x2 = b.w + b.x; }
      if (b.y < r.miny) { b.y = r.miny; b.y2 = b.h + b.y; }
      if (b.x2 > r.maxx) { b.x2 = r.maxx; b.x = b.x2 - b.w; }
      if (b.y2 > r.maxy) { b.y2 = r.maxy; b.y = b.y2 - b.h; }

      return b;
    },
    refresh: function(sel){
      this.elw = sel.core.container.width();
      this.elh = sel.core.container.height();
      this.bound = {
        minx: 0 + sel.edge.w,
        miny: 0 + sel.edge.n,
        maxx: this.elw + sel.edge.e,
        maxy: this.elh + sel.edge.s
      };
    }
  });
  Jcrop.registerFilter('backoff',BackoffFilter);

  /**
   *  ConstrainFilter
   *  a filter to constrain crop selection to bounding element
   */
  var ConstrainFilter = function(){
    this.core = null;
  };
  $.extend(ConstrainFilter.prototype,{
    tag: 'constrain',
    priority: 5,
    filter: function(b,ord){
      if (ord == 'move') {
        if (b.x < this.minx) { b.x = this.minx; b.x2 = b.w + b.x; }
        if (b.y < this.miny) { b.y = this.miny; b.y2 = b.h + b.y; }
        if (b.x2 > this.maxx) { b.x2 = this.maxx; b.x = b.x2 - b.w; }
        if (b.y2 > this.maxy) { b.y2 = this.maxy; b.y = b.y2 - b.h; }
      } else {
        if (b.x < this.minx) { b.x = this.minx; }
        if (b.y < this.miny) { b.y = this.miny; }
        if (b.x2 > this.maxx) { b.x2 = this.maxx; }
        if (b.y2 > this.maxy) { b.y2 = this.maxy; }
      }
      b.w = b.x2 - b.x;
      b.h = b.y2 - b.y;
      return b;
    },
    refresh: function(sel){
      this.elw = sel.core.container.width();
      this.elh = sel.core.container.height();
      this.minx = 0 + sel.edge.w;
      this.miny = 0 + sel.edge.n;
      this.maxx = this.elw + sel.edge.e;
      this.maxy = this.elh + sel.edge.s;
    }
  });
  Jcrop.registerFilter('constrain',ConstrainFilter);

  /**
   *  ExtentFilter
   *  a filter to implement minimum or maximum size
   */
  var ExtentFilter = function(){
    this.core = null;
  };
  $.extend(ExtentFilter.prototype,{
    tag: 'extent',
    priority: 12,
    offsetFromCorner: function(corner,box,b){
      var w = box[0], h = box[1];
      switch(corner){
        case 'bl': return [ b.x2 - w, b.y, w, h ];
        case 'tl': return [ b.x2 - w , b.y2 - h, w, h ];
        case 'br': return [ b.x, b.y, w, h ];
        case 'tr': return [ b.x, b.y2 - h, w, h ];
      }
    },
    getQuadrant: function(s){
      var relx = s.opposite[0]-s.offsetx
      var rely = s.opposite[1]-s.offsety;

      if ((relx < 0) && (rely < 0)) return 'br';
        else if ((relx >= 0) && (rely >= 0)) return 'tl';
        else if ((relx < 0) && (rely >= 0)) return 'tr';
        return 'bl';
    },
    filter: function(b,ord,sel){

      if (ord == 'move') return b;

      var w = b.w, h = b.h, st = sel.state, r = this.limits;
      var quad = st? this.getQuadrant(st): 'br';

      if (r.minw && (w < r.minw)) w = r.minw;
      if (r.minh && (h < r.minh)) h = r.minh;
      if (r.maxw && (w > r.maxw)) w = r.maxw;
      if (r.maxh && (h > r.maxh)) h = r.maxh;

      if ((w == b.w) && (h == b.h)) return b;

      return Jcrop.wrapFromXywh(this.offsetFromCorner(quad,[w,h],b));
    },
    refresh: function(sel){
      this.elw = sel.core.container.width();
      this.elh = sel.core.container.height();

      this.limits = {
        minw: sel.minSize[0],
        minh: sel.minSize[1],
        maxw: sel.maxSize[0],
        maxh: sel.maxSize[1]
      };
    }
  });
  Jcrop.registerFilter('extent',ExtentFilter);


  /**
   *  GridFilter
   *  a rudimentary grid effect
   */
  var GridFilter = function(){
    this.stepx = 1;
    this.stepy = 1;
    this.core = null;
  };
  $.extend(GridFilter.prototype,{
    tag: 'grid',
    priority: 19,
    filter: function(b){
      
      var n = {
        x: Math.round(b.x / this.stepx) * this.stepx,
        y: Math.round(b.y / this.stepy) * this.stepy,
        x2: Math.round(b.x2 / this.stepx) * this.stepx,
        y2: Math.round(b.y2 / this.stepy) * this.stepy
      };
      
      n.w = n.x2 - n.x;
      n.h = n.y2 - n.y;

      return n;
    }
  });
  Jcrop.registerFilter('grid',GridFilter);


  /**
   *  RatioFilter
   *  implements aspectRatio locking
   */
  var RatioFilter = function(){
    this.ratio = 0;
    this.core = null;
  };
  $.extend(RatioFilter.prototype,{
    tag: 'ratio',
    priority: 15,
    offsetFromCorner: function(corner,box,b){
      var w = box[0], h = box[1];
      switch(corner){
        case 'bl': return [ b.x2 - w, b.y, w, h ];
        case 'tl': return [ b.x2 - w , b.y2 - h, w, h ];
        case 'br': return [ b.x, b.y, w, h ];
        case 'tr': return [ b.x, b.y2 - h, w, h ];
      }
    },
    getBoundRatio: function(b,quad){
      var box = Jcrop.getLargestBox(this.ratio,b.w,b.h);
      return Jcrop.wrapFromXywh(this.offsetFromCorner(quad,box,b));
    },
    getQuadrant: function(s){
      var relx = s.opposite[0]-s.offsetx
      var rely = s.opposite[1]-s.offsety;

      if ((relx < 0) && (rely < 0)) return 'br';
        else if ((relx >= 0) && (rely >= 0)) return 'tl';
        else if ((relx < 0) && (rely >= 0)) return 'tr';
        return 'bl';
    },
    filter: function(b,ord,sel){

      if (!this.ratio) return b;

      var rt = b.w / b.h;
      var st = sel.state;

      var quad = st? this.getQuadrant(st): 'br';
      ord = ord || 'se';

      if (ord == 'move') return b;

      switch(ord) {
        case 'n':
          b.x2 = this.elw;
          b.w = b.x2 - b.x;
          quad = 'tr';
          break;
        case 's':
          b.x2 = this.elw;
          b.w = b.x2 - b.x;
          quad = 'br';
          break;
        case 'e':
          b.y2 = this.elh;
          b.h = b.y2 - b.y;
          quad = 'br';
          break;
        case 'w':
          b.y2 = this.elh;
          b.h = b.y2 - b.y;
          quad = 'bl';
          break;
      }

      return this.getBoundRatio(b,quad);
    },
    refresh: function(sel){
      this.ratio = sel.aspectRatio;
      this.elw = sel.core.container.width();
      this.elh = sel.core.container.height();
    }
  });
  Jcrop.registerFilter('ratio',RatioFilter);


  /**
   *  RoundFilter
   *  rounds coordinate values to integers
   */
  var RoundFilter = function(){
    this.core = null;
  };
  $.extend(RoundFilter.prototype,{
    tag: 'round',
    priority: 90,
    filter: function(b){
      
      var n = {
        x: Math.round(b.x),
        y: Math.round(b.y),
        x2: Math.round(b.x2),
        y2: Math.round(b.y2)
      };
      
      n.w = n.x2 - n.x;
      n.h = n.y2 - n.y;

      return n;
    }
  });
  Jcrop.registerFilter('round',RoundFilter);


  /**
   *  ShadeFilter
   *  A filter that implements div-based shading on any element
   *
   *  The shading you see is actually four semi-opaque divs
   *  positioned inside the container, around the selection
   */
  var ShadeFilter = function(opacity,color){
    this.color = color || 'black';
    this.opacity = opacity || 0.5;
    this.core = null;
    this.shades = {};
  };
  $.extend(ShadeFilter.prototype,{
    tag: 'shader',
    fade: true,
    fadeEasing: 'swing',
    fadeSpeed: 320,
    priority: 95,
    init: function(){
      var t = this;

      if (!t.attached) {
        t.visible = false;

        t.container = $('<div />').addClass(t.core.opt.css_shades)
          .prependTo(this.core.container).hide();

        t.elh = this.core.container.height();
        t.elw = this.core.container.width();

        t.shades = {
          top: t.createShade(),
          right: t.createShade(),
          left: t.createShade(),
          bottom: t.createShade()
        };

        t.attached = true;
      }
    },
    destroy: function(){
      this.container.remove();
    },
    setColor: function(color,instant){
      var t = this;

      if (color == t.color) return t;

      this.color = color;
      var colorfade = Jcrop.supportsColorFade();
      $.each(t.shades,function(u,i){
        if (!t.fade || instant || !colorfade) i.css('backgroundColor',color);
          else i.animate({backgroundColor:color},{queue:false,duration:t.fadeSpeed,easing:t.fadeEasing});
      });
      return t;
    },
    setOpacity: function(opacity,instant){
      var t = this;

      if (opacity == t.opacity) return t;

      t.opacity = opacity;
      $.each(t.shades,function(u,i){
        if (!t.fade || instant) i.css({opacity:opacity});
          else i.animate({opacity:opacity},{queue:false,duration:t.fadeSpeed,easing:t.fadeEasing});
      });
      return t;
    },
    createShade: function(){
      return $('<div />').css({
        position: 'absolute',
        backgroundColor: this.color,
        opacity: this.opacity
      }).appendTo(this.container);
    },
    refresh: function(sel){
      var m = this.core, s = this.shades;

      this.setColor(sel.bgColor?sel.bgColor:this.core.opt.bgColor);
      this.setOpacity(sel.bgOpacity?sel.bgOpacity:this.core.opt.bgOpacity);
        
      this.elh = m.container.height();
      this.elw = m.container.width();
      s.right.css('height',this.elh+'px');
      s.left.css('height',this.elh+'px');
    },
    filter: function(b,ord,sel){

      if (!sel.active) return b;

      var t = this,
        s = t.shades;
      
      s.top.css({
        left: Math.round(b.x)+'px',
        width: Math.round(b.w)+'px',
        height: Math.round(b.y)+'px'
      });
      s.bottom.css({
        top: Math.round(b.y2)+'px',
        left: Math.round(b.x)+'px',
        width: Math.round(b.w)+'px',
        height: (t.elh-Math.round(b.y2))+'px'
      });
      s.right.css({
        left: Math.round(b.x2)+'px',
        width: (t.elw-Math.round(b.x2))+'px'
      });
      s.left.css({
        width: Math.round(b.x)+'px'
      });

      if (!t.visible) {
        t.container.show();
        t.visible = true;
      }

      return b;
    }
  });
  Jcrop.registerFilter('shader',ShadeFilter);
  

  /**
   *  CanvasAnimator
   *  manages smooth cropping animation
   *
   *  This object is called internally to manage animation.
   *  An in-memory div is animated and a progress callback
   *  is used to update the selection coordinates of the
   *  visible selection in realtime.
   */
  var CanvasAnimator = function(stage){
    this.stage = stage;
    this.core = stage.core;
    this.cloneStagePosition();
  };

  CanvasAnimator.prototype = {

    cloneStagePosition: function(){
      var s = this.stage;
      this.angle = s.angle;
      this.scale = s.scale;
      this.offset = s.offset;
    },

    getElement: function(){
      var s = this.stage;

      return $('<div />')
        .css({
          position: 'absolute',
          top: s.offset[0]+'px',
          left: s.offset[1]+'px',
          width: s.angle+'px',
          height: s.scale+'px'
        });
    },

    animate: function(cb){
      var t = this;

      this.scale = this.stage.boundScale(this.scale);
      t.stage.triggerEvent('croprotstart');

      t.getElement().animate({
        top: t.offset[0]+'px',
        left: t.offset[1]+'px',
        width: t.angle+'px',
        height: t.scale+'px'
      },{
        easing: t.core.opt.animEasing,
        duration: t.core.opt.animDuration,
        complete: function(){
          t.stage.triggerEvent('croprotend');
          (typeof cb == 'function') && cb.call(this);
        },
        progress: function(anim){
          var props = {}, i, tw = anim.tweens;

          for(i=0;i<tw.length;i++){
            props[tw[i].prop] = tw[i].now; }

          t.stage.setAngle(props.width)
            .setScale(props.height)
            .setOffset(props.top,props.left)
            .redraw();
        }
      });
    }

  };
  Jcrop.stage.Canvas.prototype.getAnimator = function(){
    return new CanvasAnimator(this);
  };
  Jcrop.registerComponent('CanvasAnimator',CanvasAnimator);


  /**
   *  CropAnimator
   *  manages smooth cropping animation
   *
   *  This object is called internally to manage animation.
   *  An in-memory div is animated and a progress callback
   *  is used to update the selection coordinates of the
   *  visible selection in realtime.
   */
  // var CropAnimator = function(selection){{{
  var CropAnimator = function(selection){
    this.selection = selection;
    this.core = selection.core;
  };
  // }}}

  CropAnimator.prototype = {

    getElement: function(){
      var b = this.selection.get();

      return $('<div />')
        .css({
          position: 'absolute',
          top: b.y+'px',
          left: b.x+'px',
          width: b.w+'px',
          height: b.h+'px'
        });
    },

    animate: function(x,y,w,h,cb){
      var t = this;

      t.selection.allowResize(false);

      t.getElement().animate({
        top: y+'px',
        left: x+'px',
        width: w+'px',
        height: h+'px'
      },{
        easing: t.core.opt.animEasing,
        duration: t.core.opt.animDuration,
        complete: function(){
          t.selection.allowResize(true);
          cb && cb.call(this);
        },
        progress: function(anim){
          var props = {}, i, tw = anim.tweens;

          for(i=0;i<tw.length;i++){
            props[tw[i].prop] = tw[i].now; }

          var b = {
            x: parseInt(props.left),
            y: parseInt(props.top),
            w: parseInt(props.width),
            h: parseInt(props.height)
          };

          b.x2 = b.x + b.w;
          b.y2 = b.y + b.h;

          t.selection.updateRaw(b,'se');
        }
      });
    }

  };
  Jcrop.registerComponent('Animator',CropAnimator);


  /**
   *  DragState
   *  an object that handles dragging events
   *
   *  This object is used by the built-in selection object to
   *  track a dragging operation on a selection
   */
  // var DragState = function(e,selection,ord){{{
  var DragState = function(e,selection,ord){
    var t = this;

    t.x = e.pageX;
    t.y = e.pageY;

    t.selection = selection;
    t.eventTarget = selection.core.opt.dragEventTarget;
    t.orig = selection.get();

    selection.callFilterFunction('refresh');

    var p = selection.core.container.position();
    t.elx = p.left;
    t.ely = p.top;

    t.offsetx = 0;
    t.offsety = 0;
    t.ord = ord;
    t.opposite = t.getOppositeCornerOffset();

    t.initEvents(e);

  };
  // }}}

  DragState.prototype = {
    // getOppositeCornerOffset: function(){{{
    // Calculate relative offset of locked corner
    getOppositeCornerOffset: function(){

      var o = this.orig;
      var relx = this.x - this.elx - o.x;
      var rely = this.y - this.ely - o.y;

      switch(this.ord){
        case 'nw':
        case 'w':
          return [ o.w - relx, o.h - rely ];
          return [ o.x + o.w, o.y + o.h ];

        case 'sw':
          return [ o.w - relx, -rely ];
          return [ o.x + o.w, o.y ];

        case 'se':
        case 's':
        case 'e':
          return [ -relx, -rely ];
          return [ o.x, o.y ];

        case 'ne':
        case 'n':
          return [ -relx, o.h - rely ];
          return [ o.w, o.y + o.h ];
      }

      return [ null, null ];
    },
    // }}}
    // initEvents: function(e){{{
    initEvents: function(e){
      $(this.eventTarget)
        .on('mousemove.jcrop',this.createDragHandler())
        .on('mouseup.jcrop',this.createStopHandler());
    },
    // }}}
    // dragEvent: function(e){{{
    dragEvent: function(e){
      this.offsetx = e.pageX - this.x;
      this.offsety = e.pageY - this.y;
      this.selection.updateRaw(this.getBox(),this.ord);
    },
    // }}}
    // endDragEvent: function(e){{{
    endDragEvent: function(e){
      var sel = this.selection;
      sel.core.container.removeClass('jcrop-dragging');
      sel.element.trigger('cropend',[sel,sel.core.unscale(sel.get())]);
      sel.focus();
    },
    // }}}
    // createStopHandler: function(){{{
    createStopHandler: function(){
      var t = this;
      return function(e){
        $(t.eventTarget).off('.jcrop');
        t.endDragEvent(e);
        return false;
      };
    },
    // }}}
    // createDragHandler: function(){{{
    createDragHandler: function(){
      var t = this;
      return function(e){
        t.dragEvent(e);
        return false;
      };
    },
    // }}}
    //update: function(x,y){{{
    update: function(x,y){
      var t = this;
      t.offsetx = x - t.x;
      t.offsety = y - t.y;
    },
    //}}}
    //resultWrap: function(d){{{
    resultWrap: function(d){
      var b = {
          x: Math.min(d[0],d[2]),
          y: Math.min(d[1],d[3]),
          x2: Math.max(d[0],d[2]),
          y2: Math.max(d[1],d[3])
        };

      b.w = b.x2 - b.x;
      b.h = b.y2 - b.y;

      return b;
    },
    //}}}
    //getBox: function(){{{
    getBox: function(){
      var t = this;
      var o = t.orig;
      var _c = { x2: o.x + o.w, y2: o.y + o.h };
      switch(t.ord){
        case 'n': return t.resultWrap([ o.x, t.offsety + o.y, _c.x2, _c.y2 ]);
        case 's': return t.resultWrap([ o.x, o.y, _c.x2, t.offsety + _c.y2 ]);
        case 'e': return t.resultWrap([ o.x, o.y, t.offsetx + _c.x2, _c.y2 ]);
        case 'w': return t.resultWrap([ o.x + t.offsetx, o.y, _c.x2, _c.y2 ]);
        case 'sw': return t.resultWrap([ t.offsetx + o.x, o.y, _c.x2, t.offsety + _c.y2 ]);
        case 'se': return t.resultWrap([ o.x, o.y, t.offsetx + _c.x2, t.offsety + _c.y2 ]);
        case 'ne': return t.resultWrap([ o.x, t.offsety + o.y, t.offsetx + _c.x2, _c.y2 ]);
        case 'nw': return t.resultWrap([ t.offsetx + o.x, t.offsety + o.y, _c.x2, _c.y2 ]);
        case 'move':
          _c.nx = o.x + t.offsetx;
          _c.ny = o.y + t.offsety;
          return t.resultWrap([ _c.nx, _c.ny, _c.nx + o.w, _c.ny + o.h ]);
      }
    }
    //}}}
  };
  Jcrop.registerComponent('DragState',DragState);


  /**
   *  EventManager
   *  provides internal event support
   */
  var EventManager = function(core){
    this.core = core;
  };
  EventManager.prototype = {
      on: function(n,cb){ $(this).on(n,cb); },
      off: function(n){ $(this).off(n); },
      trigger: function(n){ $(this).trigger(n); }
  };
  Jcrop.registerComponent('EventManager',EventManager);


  /**
   * Image Loader
   * Reliably pre-loads images
   */
  // var ImageLoader = function(src,element,cb){{{
  var ImageLoader = function(src,element,cb){
    this.src = src;
    if (!element) element = new Image;
    this.element = element;
    this.callback = cb;
    this.load();
  };
  // }}}

  $.extend(ImageLoader,{
    // attach: function(el,cb){{{
    attach: function(el,cb){
      return new ImageLoader(el.src,el,cb);
    },
    // }}}
    // prototype: {{{
    prototype: {
      getDimensions: function(){
        var el = this.element;

        if (el.naturalWidth)
          return [ el.naturalWidth, el. naturalHeight ];

        if (el.width)
          return [ el.width, el.height ];

        return null;
      },
      fireCallback: function(){
        this.element.onload = null;
        if (typeof this.callback == 'function')
          this.callback.apply(this,this.getDimensions());
      },
      isLoaded: function(){
        return this.element.complete;
      },
      load: function(){
        var t = this;
        var el = t.element;

        el.src = t.src;

        if (t.isLoaded()) t.fireCallback();
          else t.element.onload = function(e){
            t.fireCallback();
          };
      }
    }
    // }}}
  });
  Jcrop.registerComponent('ImageLoader',ImageLoader);


  /**
   * JcropTouch
   * Detects and enables mobile touch support
   */
  // var JcropTouch = function(core){{{
  var JcropTouch = function(core){
    this.core = core;
    this.init();
  };
  // }}}

  $.extend(JcropTouch,{
    // support: function(){{{
    support: function(){
      if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch)
        return true;
    },
    // }}}
    prototype: {
      // init: function(){{{
      init: function(){
        var t = this,
          p = $.Jcrop.component.DragState.prototype;

        // A bit of an ugly hack to make sure we modify prototype
        // only once, store a key on the prototype
        if (!p.touch) {
          t.initEvents();
          t.shimDragState();
          t.shimStageDrag();
          p.touch = true;
        }
      },
      // }}}
      // shimDragState: function(){{{
      shimDragState: function(){
        var t = this;
        $.Jcrop.component.DragState.prototype.initEvents = function(e){
          
          // Attach subsequent drag event handlers based on initial
          // event type - avoids collecting "pseudo-mouse" events
          // generated by some mobile browsers in some circumstances
          if (e.type.substr(0,5) == 'touch') {

            $(this.eventTarget)
              .on('touchmove.jcrop.jcrop-touch',t.dragWrap(this.createDragHandler()))
              .on('touchend.jcrop.jcrop-touch',this.createStopHandler());

          }
          
          // For other events, use the mouse handlers that
          // the default DragState.initEvents() method sets...
          else {

            $(this.eventTarget)
              .on('mousemove.jcrop',this.createDragHandler())
              .on('mouseup.jcrop',this.createStopHandler());

          }

        };
      },
      // }}}
      // shimStageDrag: function(){{{
      shimStageDrag: function(){
        this.core.container
          .addClass('jcrop-touch')
          .on('touchstart.jcrop.jcrop-stage',this.dragWrap(this.core.ui.manager.startDragHandler()));
      },
      // }}}
      // dragWrap: function(cb){{{
      dragWrap: function(cb){
        return function(e){
          e.preventDefault();
          e.stopPropagation();
          if (e.type.substr(0,5) == 'touch') {
            e.pageX = e.originalEvent.changedTouches[0].pageX;
            e.pageY = e.originalEvent.changedTouches[0].pageY;
            return cb(e);
          }
          return false;
        };
      },
      // }}}
      // initEvents: function(){{{
      initEvents: function(){
        var t = this, c = t.core;

        c.container.on(
          'touchstart.jcrop.jcrop-touch',
          '.'+c.opt.css_drag,
          t.dragWrap(c.startDrag())
        );
      }
      // }}}
    }
  });
  Jcrop.registerComponent('Touch',JcropTouch);


  /**
   *  KeyWatcher
   *  provides keyboard support
   */
  // var KeyWatcher = function(core){{{
  var KeyWatcher = function(core){
    this.core = core;
    this.init();
  };
  // }}}
  $.extend(KeyWatcher,{
    // defaults: {{{
    defaults: {
      eventName: 'keydown.jcrop',
      passthru: [ 9 ],
      debug: false
    },
    // }}}
    prototype: {
      // init: function(){{{
      init: function(){
        $.extend(this,KeyWatcher.defaults);
        this.enable();
      },
      // }}}
      // disable: function(){{{
      disable: function(){
        this.core.container.off(this.eventName);
      },
      // }}}
      // enable: function(){{{
      enable: function(){
        var t = this, m = t.core;
        m.container.on(t.eventName,function(e){
          var nudge = e.shiftKey? 16: 2;

          if ($.inArray(e.keyCode,t.passthru) >= 0)
            return true;

          switch(e.keyCode){
            case 37: m.nudge(-nudge,0); break;
            case 38: m.nudge(0,-nudge); break;
            case 39: m.nudge(nudge,0); break;
            case 40: m.nudge(0,nudge); break;

            case 46:
            case 8:
              m.requestDelete();
              return false;
              break;

            default:
              if (t.debug) console.log('keycode: ' + e.keyCode);
              break;
          }

          if (!e.metaKey && !e.ctrlKey)
            e.preventDefault();
        });
      }
      // }}}
    }
  });
  Jcrop.registerComponent('Keyboard',KeyWatcher);


  /**
   * Selection
   * Built-in selection object
   */
  var Selection = function(){};

  $.extend(Selection,{
    // defaults: {{{
    defaults: {
      minSize: [ 8, 8 ],
      maxSize: [ 0, 0 ],
      aspectRatio: 0,
      edge: { n: 0, s: 0, e: 0, w: 0 },
      bgColor: null,
      bgOpacity: null,
      last: null,

      state: null,
      active: true,
      linked: true,
      canDelete: true,
      canDrag: true,
      canResize: true,
      canSelect: true
    },
    // }}}
    prototype: {
      // init: function(core){{{
      init: function(core){
        this.core = core;
        this.startup();
        this.linked = this.core.opt.linked;
        this.attach();
        this.setOptions(this.core.opt);
        core.container.trigger('cropcreate',[this]);
      },
      // }}}
      // attach: function(){{{
      attach: function(){
        // For extending init() sequence
      },
      // }}}
      // startup: function(){{{
      startup: function(){
        var t = this, o = t.core.opt;
        $.extend(t,Selection.defaults);
        t.filter = t.core.getDefaultFilters();

        t.element = $('<div />').addClass(o.css_selection).data({ selection: t });
        t.frame = $('<button />').addClass(o.css_button).data('ord','move').attr('type','button');
        t.element.append(t.frame).appendTo(t.core.container);

        // IE background/draggable hack
        if (t.core.opt.is_msie) t.frame.css({
          opacity: 0,
          backgroundColor: 'white'
        });

        t.insertElements();

        // Bind focus and blur events for this selection
        t.frame.on('focus.jcrop',function(e){
          t.core.setSelection(t);
          t.element.trigger('cropfocus',t);
          t.element.addClass('jcrop-focus');
        }).on('blur.jcrop',function(e){
          t.element.removeClass('jcrop-focus');
          t.element.trigger('cropblur',t);
        });
      },
      // }}}
      // propagate: [{{{
      propagate: [
        'canDelete', 'canDrag', 'canResize', 'canSelect',
        'minSize', 'maxSize', 'aspectRatio', 'edge'
      ],
      // }}}
      // setOptions: function(opt){{{
      setOptions: function(opt){
        Jcrop.propagate(this.propagate,opt,this);
        this.refresh();
        return this;
      },
      // }}}
      // refresh: function(){{{
      refresh: function(){
        this.allowResize();
        this.allowDrag();
        this.allowSelect();
        this.callFilterFunction('refresh');
        this.updateRaw(this.get(),'se');
      },
      // }}}
      // callFilterFunction: function(f,args){{{
      callFilterFunction: function(f,args){
        for(var i=0;i<this.filter.length;i++)
          if (this.filter[i][f]) this.filter[i][f](this);
        return this;
      },
      // }}}
      //addFilter: function(filter){{{
      addFilter: function(filter){
        filter.core = this.core;
        if (!this.hasFilter(filter)) {
          this.filter.push(filter);
          this.sortFilters();
          if (filter.init) filter.init();
          this.refresh();
        }
      },
      //}}}
      // hasFilter: function(filter){{{
      hasFilter: function(filter){
        var i, f = this.filter, n = [];
        for(i=0;i<f.length;i++) if (f[i] === filter) return true;
      },
      // }}}
      // sortFilters: function(){{{
      sortFilters: function(){
        this.filter.sort(
          function(x,y){ return x.priority - y.priority; }
        );
      },
      // }}}
      //clearFilters: function(){{{
      clearFilters: function(){
        var i, f = this.filter;

        for(var i=0;i<f.length;i++)
          if (f[i].destroy) f[i].destroy();

        this.filter = [];
      },
      //}}}
      // removeFiltersByTag: function(tag){{{
      removeFilter: function(tag){
        var i, f = this.filter, n = [];

        for(var i=0;i<f.length;i++)
          if ((f[i].tag && (f[i].tag == tag)) || (tag === f[i])){
            if (f[i].destroy) f[i].destroy();
          }
          else n.push(f[i]);

        this.filter = n;
      },
      // }}}
      // runFilters: function(b,ord){{{
      runFilters: function(b,ord){
        for(var i=0;i<this.filter.length;i++)
          b = this.filter[i].filter(b,ord,this);
        return b;
      },
      // }}}
      //endDrag: function(){{{
      endDrag: function(){
        if (this.state) {
          $(document.body).off('.jcrop');
          this.focus();
          this.state = null;
        }
      },
      //}}}
      // startDrag: function(e,ord){{{
      startDrag: function(e,ord){
        var t = this;
        var m = t.core;

        ord = ord || $(e.target).data('ord');

        this.focus();

        if ((ord == 'move') && t.element.hasClass(t.core.opt.css_nodrag))
          return false;

        this.state = new Jcrop.component.DragState(e,this,ord);
        return false;
      },
      // }}}
      // allowSelect: function(v){{{
      allowSelect: function(v){
        if (v === undefined) v = this.canSelect;

        if (v && this.canSelect) this.frame.attr('disabled',false);
          else this.frame.attr('disabled','disabled');

        return this;
      },
      // }}}
      // allowDrag: function(v){{{
      allowDrag: function(v){
        var t = this, o = t.core.opt;
        if (v == undefined) v = t.canDrag;

        if (v && t.canDrag) t.element.removeClass(o.css_nodrag);
          else t.element.addClass(o.css_nodrag);

        return this;
      },
      // }}}
      // allowResize: function(v){{{
      allowResize: function(v){
        var t = this, o = t.core.opt;
        if (v == undefined) v = t.canResize;

        if (v && t.canResize) t.element.removeClass(o.css_noresize);
          else t.element.addClass(o.css_noresize);

        return this;
      },
      // }}}
      // remove: function(){{{
      remove: function(){
        this.element.trigger('cropremove',this);
        this.element.remove();
      },
      // }}}
      // toBack: function(){{{
      toBack: function(){
        this.active = false;
        this.element.removeClass('jcrop-current jcrop-focus');
      },
      // }}}
      // toFront: function(){{{
      toFront: function(){
        this.active = true;
        this.element.addClass('jcrop-current');
        this.callFilterFunction('refresh');
        this.refresh();
      },
      // }}}
      // redraw: function(b){{{
      redraw: function(b){
        this.moveTo(b.x,b.y);
        this.resize(b.w,b.h);
        this.last = b;
        return this;
      },
      // }}}
      // update: function(b,ord){{{
      update: function(b,ord){
        return this.updateRaw(this.core.scale(b),ord);
      },
      // }}}
      // update: function(b,ord){{{
      updateRaw: function(b,ord){
        b = this.runFilters(b,ord);
        this.redraw(b);
        this.element.trigger('cropmove',[this,this.core.unscale(b)]);
        return this;
      },
      // }}}
      // animateTo: function(box,cb){{{
      animateTo: function(box,cb){
        var ca = new Jcrop.component.Animator(this),
            b = this.core.scale(Jcrop.wrapFromXywh(box));

        ca.animate(b.x,b.y,b.w,b.h,cb);
      },
      // }}}
      // center: function(instant){{{
      center: function(instant){
        var b = this.get(), m = this.core;
        var elw = m.container.width(), elh = m.container.height();
        var box = [ (elw-b.w)/2, (elh-b.h)/2, b.w, b.h ];
        return this[instant?'setSelect':'animateTo'](box);
      },
      // }}}
      //createElement: function(type,ord){{{
      createElement: function(type,ord){
        return $('<div />').addClass(type+' ord-'+ord).data('ord',ord);
      },
      //}}}
      //moveTo: function(x,y){{{
      moveTo: function(x,y){
        this.element.css({top: y+'px', left: x+'px'});
      },
      //}}}
      // blur: function(){{{
      blur: function(){
        this.element.blur();
        return this;
      },
      // }}}
      // focus: function(){{{
      focus: function(){
        this.core.setSelection(this);
        this.frame.focus();
        return this;
      },
      // }}}
      //resize: function(w,h){{{
      resize: function(w,h){
        this.element.css({width: w+'px', height: h+'px'});
      },
      //}}}
      //get: function(){{{
      get: function(){
        var b = this.element,
          o = b.position(),
          w = b.width(),
          h = b.height(),
          rv = { x: o.left, y: o.top };

        rv.x2 = rv.x + w;
        rv.y2 = rv.y + h;
        rv.w = w;
        rv.h = h;

        return rv;
      },
      //}}}
      //insertElements: function(){{{
      insertElements: function(){
        var t = this, i,
          m = t.core,
          fr = t.element,
          o = t.core.opt,
          b = o.borders,
          h = o.handles,
          d = o.dragbars;

        for(i=0; i<d.length; i++)
          fr.append(t.createElement(o.css_dragbars,d[i]));

        for(i=0; i<h.length; i++)
          fr.append(t.createElement(o.css_handles,h[i]));

        for(i=0; i<b.length; i++)
          fr.append(t.createElement(o.css_borders,b[i]));
      }
      //}}}
    }
  });
  Jcrop.registerComponent('Selection',Selection);


  /**
   * StageDrag
   * Facilitates dragging
   */
  // var StageDrag = function(manager,opt){{{
  var StageDrag = function(manager,opt){
    $.extend(this,StageDrag.defaults,opt || {});
    this.manager = manager;
    this.core = manager.core;
  };
  // }}}
  // StageDrag.defaults = {{{
  StageDrag.defaults = {
    offset: [ -8, -8 ],
    active: true,
    minsize: [ 20, 20 ]
  };
  // }}}

  $.extend(StageDrag.prototype,{
    // start: function(e){{{
    start: function(e){
      var c = this.core;

      // Do nothing if allowSelect is off
      if (!c.opt.allowSelect) return;

      // Also do nothing if we can't draw any more selections
      if (c.opt.multi && c.opt.multiMax && (c.ui.multi.length >= c.opt.multiMax)) return false;

      // calculate a few variables for this drag operation
      var o = $(e.currentTarget).offset();
      var origx = e.pageX - o.left + this.offset[0];
      var origy = e.pageY - o.top + this.offset[1];
      var m = c.ui.multi;

      // Determine newly dragged crop behavior if multi disabled
      if (!c.opt.multi) {
        // For multiCleaanup true, remove all existing selections
        if (c.opt.multiCleanup){
          for(var i=0;i<m.length;i++) m[i].remove();
          c.ui.multi = [];
        }
        // If not, only remove the currently active selection
        else {
          c.removeSelection(c.ui.selection);
        }
      }

      c.container.addClass('jcrop-dragging');

      // Create the new selection
      var sel = c.newSelection()
        // and position it
        .updateRaw(Jcrop.wrapFromXywh([origx,origy,1,1]));

      sel.element.trigger('cropstart',[sel,this.core.unscale(sel.get())]);
      
      return sel.startDrag(e,'se');
    },
    // }}}
    // end: function(x,y){{{
    end: function(x,y){
      this.drag(x,y);
      var b = this.sel.get();

      this.core.container.removeClass('jcrop-dragging');

      if ((b.w < this.minsize[0]) || (b.h < this.minsize[1]))
        this.core.requestDelete();

        else this.sel.focus();
    }
    // }}}
  });
  Jcrop.registerComponent('StageDrag',StageDrag);


  /**
   * StageManager
   * Provides basic stage-specific functionality
   */
  // var StageManager = function(core){{{
  var StageManager = function(core){
    this.core = core;
    this.ui = core.ui;
    this.init();
  };
  // }}}

  $.extend(StageManager.prototype,{
    // init: function(){{{
    init: function(){
      this.setupEvents();
      this.dragger = new StageDrag(this);
    },
    // }}}
    // tellConfigUpdate: function(options){{{
    tellConfigUpdate: function(options){
      for(var i=0,m=this.ui.multi,l=m.length;i<l;i++)
        if (m[i].setOptions && (m[i].linked || (this.core.opt.linkCurrent && m[i] == this.ui.selection)))
          m[i].setOptions(options);
    },
    // }}}
    // startDragHandler: function(){{{
    startDragHandler: function(){
      var t = this;
      return function(e){
        if (!e.button || t.core.opt.is_ie_lt9) return t.dragger.start(e);
      };
    },
    // }}}
    // removeEvents: function(){{{
    removeEvents: function(){
      this.core.event.off('.jcrop-stage');
      this.core.container.off('.jcrop-stage');
    },
    // }}}
    // shimLegacyHandlers: function(options){{{
    // This method uses the legacyHandlers configuration object to
    // gracefully wrap old-style Jcrop events with new ones
    shimLegacyHandlers: function(options){
      var _x = {}, core = this.core, tmp;

      $.each(core.opt.legacyHandlers,function(k,i){
        if (k in options) {
          tmp = options[k];
          core.container.off('.jcrop-'+k)
            .on(i+'.jcrop.jcrop-'+k,function(e,s,c){
              tmp.call(core,c);
            });
          delete options[k];
        }
      });
    },
    // }}}
    // setupEvents: function(){{{
    setupEvents: function(){
      var t = this, c = t.core;

      c.event.on('configupdate.jcrop-stage',function(e){
        t.shimLegacyHandlers(c.opt);
        t.tellConfigUpdate(c.opt)
        c.container.trigger('cropconfig',[c,c.opt]);
      });

      this.core.container
        .on('mousedown.jcrop.jcrop-stage',this.startDragHandler());
    }
    // }}}
  });
  Jcrop.registerComponent('StageManager',StageManager);


  var Thumbnailer = function(){
  };

  $.extend(Thumbnailer,{
    defaults: {
      // Set to a specific Selection object
      // If this value is set, the preview will only track that Selection
      selection: null,

      fading: true,
      fadeDelay: 1000,
      fadeDuration: 1000,
      autoHide: false,
      width: 80,
      height: 80,
      _hiding: null
    },

    prototype: {
      recopyCanvas: function(){
        var s = this.core.ui.stage, cxt = s.context;
        this.context.putImageData(cxt.getImageData(0,0,s.canvas.width,s.canvas.height),0,0);
      },
      init: function(core,options){
        var t = this;
        this.core = core;
        $.extend(this,Thumbnailer.defaults,options);
        t.initEvents();
        t.refresh();
        t.insertElements();
        if (t.selection) {
          t.renderSelection(t.selection);
          t.selectionTarget = t.selection.element[0];
        } else if (t.core.ui.selection) {
          t.renderSelection(t.core.ui.selection);
        }

        if (t.core.ui.stage.canvas) {
          t.context = t.preview[0].getContext('2d');
          t.core.container.on('cropredraw',function(e){
            t.recopyCanvas();
            t.refresh();
          });
        }
      },
      updateImage: function(imgel){
        this.preview.remove();
        this.preview = $($.Jcrop.imageClone(imgel));
        this.element.append(this.preview);
        this.refresh();
        return this;
      },
      insertElements: function(){
        this.preview = $($.Jcrop.imageClone(this.core.ui.stage.imgsrc));

        this.element = $('<div />').addClass('jcrop-thumb')
          .width(this.width).height(this.height)
          .append(this.preview)
          .appendTo(this.core.container);
      },
      resize: function(w,h){
        this.width = w;
        this.height = h;
        this.element.width(w).height(h);
        this.renderCoords(this.last);
      },
      refresh: function(){
        this.cw = (this.core.opt.xscale * this.core.container.width());
        this.ch = (this.core.opt.yscale * this.core.container.height());
        if (this.last) {
          this.renderCoords(this.last);
        }
      },
      renderCoords: function(c){
        var rx = this.width / c.w;
        var ry = this.height / c.h;

        this.preview.css({
          width: Math.round(rx * this.cw) + 'px',
          height: Math.round(ry * this.ch) + 'px',
          marginLeft: '-' + Math.round(rx * c.x) + 'px',
          marginTop: '-' + Math.round(ry * c.y) + 'px'
        });

        this.last = c;
        return this;
      },
      renderSelection: function(s){
        return this.renderCoords(s.core.unscale(s.get()));
      },
      selectionStart: function(s){
        this.renderSelection(s);
      },
      show: function(){
        if (this._hiding) clearTimeout(this._hiding);

        if (!this.fading) this.element.stop().css({ opacity: 1 });
        else this.element.stop().animate({ opacity: 1 },{ duration: 80, queue: false });
      },
      hide: function(){
        var t = this;
        if (!t.fading) t.element.hide();
        else t._hiding = setTimeout(function(){
          t._hiding = null;
          t.element.stop().animate({ opacity: 0 },{ duration: t.fadeDuration, queue: false });
        },t.fadeDelay);
      },
      initEvents: function(){
        var t = this;
        t.core.container.on('croprotstart croprotend cropimage cropstart cropmove cropend',function(e,s,c){
          if (t.selectionTarget && (t.selectionTarget !== e.target)) return false;

          switch(e.type){

            case 'cropimage':
              t.updateImage(c);
              break;

            case 'cropstart':
              t.selectionStart(s);
            case 'croprotstart':
              t.show();
              break;

            case 'cropend':
              t.renderCoords(c);
            case 'croprotend':
              if (t.autoHide) t.hide();
              break;

            case 'cropmove':
              t.renderCoords(c);
              break;
          }
        });
      }
    }
  });
  Jcrop.registerComponent('Thumbnailer',Thumbnailer);


  /**
   * DialDrag component
   * This is a little hacky, it was adapted from some previous/old code
   * Plan to update this API in the future
   */
  var DialDrag = function() { };

  DialDrag.prototype = {

    init: function(core,actuator,callback){
      var that = this;

      if (!actuator) actuator = core.container;
      this.$btn = $(actuator);
      this.$targ = $(actuator);
      this.core = core;

      this.$btn
        .addClass('dialdrag')
        .on('mousedown.dialdrag',this.mousedown())
        .data('dialdrag',this);

      if (!$.isFunction(callback)) callback = function(){ };
      this.callback = callback;
      this.ondone = callback;
    },

    remove: function(){
      this.$btn
        .removeClass('dialdrag')
        .off('.dialdrag')
        .data('dialdrag',null);
      return this;
    },

    setTarget: function(obj){
      this.$targ = $(obj);
      return this;
    },

    getOffset: function(){
      var targ = this.$targ, pos = targ.offset();
      return [
        pos.left + (targ.width()/2),
        pos.top + (targ.height()/2)
      ];
    },

    relMouse: function(e){
      var x = e.pageX - this.offset[0],
          y = e.pageY - this.offset[1],
          ang = Math.atan2(y,x) * (180 / Math.PI),
          vec = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
      return [ x, y, ang, vec ];
    },

    mousedown: function(){
      var that = this;

      function mouseUp(e){
        $(window).off('.dialdrag');
        that.ondone.call(that,that.relMouse(e));
        that.core.container.trigger('croprotend');
      }

      function mouseMove(e){
        that.callback.call(that,that.relMouse(e));
      }

      return function(e) {
        that.offset = that.getOffset();
        var rel = that.relMouse(e);
        that.angleOffset = -that.core.ui.stage.angle+rel[2];
        that.distOffset = rel[3];
        that.dragOffset = [rel[0],rel[1]];
        that.core.container.trigger('croprotstart');

        $(window)
          .on('mousemove.dialdrag',mouseMove)
          .on('mouseup.dialdrag',mouseUp);

        that.callback.call(that,that.relMouse(e));

        return false;
      };
    }
    
  };
  Jcrop.registerComponent('DialDrag',DialDrag);


    /////////////////////////////////
    // DEFAULT SETTINGS

    Jcrop.defaults = {

      // Selection Behavior
      edge: { n: 0, s: 0, e: 0, w: 0 },
      setSelect: null,
      linked: true,
      linkCurrent: true,
      canDelete: true,
      canSelect: true,
      canDrag: true,
      canResize: true,

      // Component constructors
      eventManagerComponent:  Jcrop.component.EventManager,
      keyboardComponent:      Jcrop.component.Keyboard,
      dragstateComponent:     Jcrop.component.DragState,
      stagemanagerComponent:  Jcrop.component.StageManager,
      animatorComponent:      Jcrop.component.Animator,
      selectionComponent:     Jcrop.component.Selection,

      // This is a function that is called, which returns a stage object
      stageConstructor:       Jcrop.stageConstructor,

      // Stage Behavior
      allowSelect: true,
      multi: false,
      multiMax: false,
      multiCleanup: true,
      animation: true,
      animEasing: 'swing',
      animDuration: 400,
      fading: true,
      fadeDuration: 300,
      fadeEasing: 'swing',
      bgColor: 'black',
      bgOpacity: .5,

      // Startup options
      applyFilters: [ 'constrain', 'extent', 'backoff', 'ratio', 'shader', 'round' ],
      borders:  [ 'e', 'w', 's', 'n' ],
      handles:  [ 'n', 's', 'e', 'w', 'sw', 'ne', 'nw', 'se' ],
      dragbars: [ 'n', 'e', 'w', 's' ],

      dragEventTarget: window,

      xscale: 1,
      yscale: 1,

      boxWidth: null,
      boxHeight: null,

      // CSS Classes
      // @todo: These need to be moved to top-level object keys
      // for better customization. Currently if you try to extend one
      // via an options object to Jcrop, it will wipe out all
      // the others you don't specify. Be careful for now!
      css_nodrag: 'jcrop-nodrag',
      css_drag: 'jcrop-drag',
      css_container: 'jcrop-active',
      css_shades: 'jcrop-shades',
      css_selection: 'jcrop-selection',
      css_borders: 'jcrop-border',
      css_handles: 'jcrop-handle jcrop-drag',
      css_button: 'jcrop-box jcrop-drag',
      css_noresize: 'jcrop-noresize',
      css_dragbars: 'jcrop-dragbar jcrop-drag',

      legacyHandlers: {
        onChange: 'cropmove',
        onSelect: 'cropend'
      }

    };


  // Jcrop API methods
  $.extend(Jcrop.prototype,{
    //init: function(){{{
    init: function(){
      this.event = new this.opt.eventManagerComponent(this);
      this.ui.keyboard = new this.opt.keyboardComponent(this);
      this.ui.manager = new this.opt.stagemanagerComponent(this);
      this.applyFilters();

      if ($.Jcrop.supportsTouch)
        new $.Jcrop.component.Touch(this);

      this.initEvents();
    },
    //}}}
    // applySizeConstraints: function(){{{
    applySizeConstraints: function(){
      var o = this.opt,
          img = this.opt.imgsrc;

      if (img){

        var iw = img.naturalWidth || img.width,
            ih = img.naturalHeight || img.height,
            bw = o.boxWidth || iw,
            bh = o.boxHeight || ih;

        if (img && ((iw > bw) || (ih > bh))){
          var bx = Jcrop.getLargestBox(iw/ih,bw,bh);
          $(img).width(bx[0]).height(bx[1]);
          this.resizeContainer(bx[0],bx[1]);
          this.opt.xscale = iw / bx[0];
          this.opt.yscale = ih / bx[1];
        }
          
      }

      if (this.opt.trueSize){
        var dw = this.opt.trueSize[0];
        var dh = this.opt.trueSize[1];
        var cs = this.getContainerSize();
        this.opt.xscale = dw / cs[0];
        this.opt.yscale = dh / cs[1];
      }
    },
    // }}}
    initComponent: function(name){
      if (Jcrop.component[name]) {
        var args = Array.prototype.slice.call(arguments);
        var obj = new Jcrop.component[name];
        args.shift();
        args.unshift(this);
        obj.init.apply(obj,args);
        return obj;
      }
    },
    // setOptions: function(opt){{{
    setOptions: function(opt,proptype){

      if (!$.isPlainObject(opt)) opt = {};

      $.extend(this.opt,opt);

      // Handle a setSelect value
      if (this.opt.setSelect) {

        // If there is no current selection
        // passing setSelect will create one
        if (!this.ui.multi.length)
          this.newSelection();

        // Use these values to update the current selection
        this.setSelect(this.opt.setSelect);

        // Set to null so it doesn't get called again
        this.opt.setSelect = null;
      }

      this.event.trigger('configupdate');
      return this;
    },
    // }}}
    //destroy: function(){{{
    destroy: function(){
      if (this.opt.imgsrc) {
        this.container.before(this.opt.imgsrc);
        this.container.remove();
        $(this.opt.imgsrc).removeData('Jcrop').show();
      } else {
        // @todo: more elegant destroy() process for non-image containers
        this.container.remove();
      }
    },
    // }}}
    // applyFilters: function(){{{
    applyFilters: function(){
      var obj;
      for(var i=0,f=this.opt.applyFilters,l=f.length; i<l; i++){
        if ($.Jcrop.filter[f[i]])
          obj = new $.Jcrop.filter[f[i]];
          obj.core = this;
          if (obj.init) obj.init();
          this.filter[f[i]] = obj;
      }
    },
    // }}}
    // getDefaultFilters: function(){{{
    getDefaultFilters: function(){
      var rv = [];

      for(var i=0,f=this.opt.applyFilters,l=f.length; i<l; i++)
        if(this.filter.hasOwnProperty(f[i]))
          rv.push(this.filter[f[i]]);

      rv.sort(function(x,y){ return x.priority - y.priority; });
      return rv;
    },
    // }}}
    // setSelection: function(sel){{{
    setSelection: function(sel){
      var m = this.ui.multi;
      var n = [];
      for(var i=0;i<m.length;i++) {
        if (m[i] !== sel) n.push(m[i]);
        m[i].toBack();
      }
      n.unshift(sel);
      this.ui.multi = n;
      this.ui.selection = sel;
      sel.toFront();
      return sel;
    },
    // }}}
    // getSelection: function(raw){{{
    getSelection: function(raw){
      var b = this.ui.selection.get();
      return b;
    },
    // }}}
    // newSelection: function(){{{
    newSelection: function(sel){
      if (!sel)
        sel = new this.opt.selectionComponent();

      sel.init(this);
      this.setSelection(sel);

      return sel;
    },
    // }}}
    // hasSelection: function(sel){{{
    hasSelection: function(sel){
      for(var i=0;i<this.ui.multi;i++)
        if (sel === this.ui.multi[i]) return true;
    },
    // }}}
    // removeSelection: function(sel){{{
    removeSelection: function(sel){
      var i, n = [], m = this.ui.multi;
      for(var i=0;i<m.length;i++){
        if (sel !== m[i])
          n.push(m[i]);
        else m[i].remove();
      }
      return this.ui.multi = n;
    },
    // }}}
    //addFilter: function(filter){{{
    addFilter: function(filter){
      for(var i=0,m=this.ui.multi,l=m.length; i<l; i++)
        m[i].addFilter(filter);

      return this;
    },
    //}}}
    // removeFiltersByTag: function(tag){{{
    removeFilter: function(filter){
      for(var i=0,m=this.ui.multi,l=m.length; i<l; i++)
        m[i].removeFilter(filter);

      return this;
    },
    // }}}
    // blur: function(){{{
    blur: function(){
      this.ui.selection.blur();
      return this;
    },
    // }}}
    // focus: function(){{{
    focus: function(){
      this.ui.selection.focus();
      return this;
    },
    // }}}
    //initEvents: function(){{{
    initEvents: function(){
      var t = this;
      t.container.on('selectstart',function(e){ return false; })
        .on('mousedown','.'+t.opt.css_drag,t.startDrag());
    },
    //}}}
    // maxSelect: function(){{{
    maxSelect: function(){
      this.setSelect([0,0,this.elw,this.elh]);
    },
    // }}}
    // nudge: function(x,y){{{
    nudge: function(x,y){
      var s = this.ui.selection, b = s.get();

      b.x += x;
      b.x2 += x;
      b.y += y;
      b.y2 += y;

      if (b.x < 0) { b.x2 = b.w; b.x = 0; }
        else if (b.x2 > this.elw) { b.x2 = this.elw; b.x = b.x2 - b.w; }

      if (b.y < 0) { b.y2 = b.h; b.y = 0; }
        else if (b.y2 > this.elh) { b.y2 = this.elh; b.y = b.y2 - b.h; }
      
      s.element.trigger('cropstart',[s,this.unscale(b)]);
      s.updateRaw(b,'move');
      s.element.trigger('cropend',[s,this.unscale(b)]);
    },
    // }}}
    // refresh: function(){{{
    refresh: function(){
      for(var i=0,s=this.ui.multi,l=s.length;i<l;i++)
        s[i].refresh();
    },
    // }}}
    // blurAll: function(){{{
    blurAll: function(){
      var m = this.ui.multi;
      for(var i=0;i<m.length;i++) {
        if (m[i] !== sel) n.push(m[i]);
        m[i].toBack();
      }
    },
    // }}}
    // scale: function(b){{{
    scale: function(b){
      var xs = this.opt.xscale,
          ys = this.opt.yscale;

      return {
        x: b.x / xs,
        y: b.y / ys,
        x2: b.x2 / xs,
        y2: b.y2 / ys,
        w: b.w / xs,
        h: b.h / ys
      };
    },
    // }}}
    // unscale: function(b){{{
    unscale: function(b){
      var xs = this.opt.xscale,
          ys = this.opt.yscale;

      return {
        x: b.x * xs,
        y: b.y * ys,
        x2: b.x2 * xs,
        y2: b.y2 * ys,
        w: b.w * xs,
        h: b.h * ys
      };
    },
    // }}}
    // requestDelete: function(){{{
    requestDelete: function(){
      if ((this.ui.multi.length > 1) && (this.ui.selection.canDelete))
        return this.deleteSelection();
    },
    // }}}
    // deleteSelection: function(){{{
    deleteSelection: function(){
      if (this.ui.selection) {
        this.removeSelection(this.ui.selection);
        if (this.ui.multi.length) this.ui.multi[0].focus();
        this.ui.selection.refresh();
      }
    },
    // }}}
    // animateTo: function(box){{{
    animateTo: function(box){
      if (this.ui.selection)
        this.ui.selection.animateTo(box);
      return this;
    },
    // }}}
    // setselect: function(box){{{
    setSelect: function(box){
      if (this.ui.selection)
        this.ui.selection.update(Jcrop.wrapFromXywh(box));
      return this;
    },
    // }}}
    //startDrag: function(){{{
    startDrag: function(){
      var t = this;
      return function(e){
        var $targ = $(e.target);
        var selection = $targ.closest('.'+t.opt.css_selection).data('selection');
        var ord = $targ.data('ord');
        t.container.trigger('cropstart',[selection,t.unscale(selection.get())]);
        selection.startDrag(e,ord);
        return false;
      };
    },
    //}}}
    // getContainerSize: function(){{{
    getContainerSize: function(){
      return [ this.container.width(), this.container.height() ];
    },
    // }}}
    // resizeContainer: function(w,h){{{
    resizeContainer: function(w,h){
      this.container.width(w).height(h);
      this.refresh();
    },
    // }}}
    // setImage: function(src,cb){{{
    setImage: function(src,cb){
      var t = this, targ = t.opt.imgsrc;

      if (!targ) return false;

      new $.Jcrop.component.ImageLoader(src,null,function(w,h){
        t.resizeContainer(w,h);

        targ.src = src;
        $(targ).width(w).height(h);
        t.applySizeConstraints();
        t.refresh();
        t.container.trigger('cropimage',[t,targ]);

        if (typeof cb == 'function')
          cb.call(t,w,h);
      });
    },
    // }}}
    // update: function(b){{{
    update: function(b){
      if (this.ui.selection)
        this.ui.selection.update(b);
    }
    // }}}
  });

  // Jcrop jQuery plugin function
  $.fn.Jcrop = function(options,callback){
    options = options || {};

    var first = this.eq(0).data('Jcrop');
    var args = Array.prototype.slice.call(arguments);

    // Return API if requested
    if (options == 'api') { return first; }

    // Allow calling API methods (with arguments)
    else if (first && (typeof options == 'string')) {

      // Call method if it exists
      if (first[options]) {
        args.shift();
        first[options].apply(first,args);
        return first;
      }

      // Unknown input/method does not exist
      return false;
    }

    // Otherwise, loop over selected elements
    this.each(function(){
      var t = this, $t = $(this);
      var exists = $t.data('Jcrop');
      var obj;

      // If Jcrop already exists on this element only setOptions()
      if (exists)
        exists.setOptions(options);

      else {

        if (!options.stageConstructor)
          options.stageConstructor = $.Jcrop.stageConstructor;

        options.stageConstructor(this,options,function(stage,options){
          var selection = options.setSelect;
          if (selection) delete(options.setSelect);

          var obj = $.Jcrop.attach(stage.element,options);

          if (typeof stage.attach == 'function')
            stage.attach(obj);

          $t.data('Jcrop',obj);

          if (selection) {
            obj.newSelection();
            obj.setSelect(selection);
          }

          if (typeof callback == 'function')
            callback.call(obj);
        });
      }

      return this;
    });
  };

/* Modernizr 2.7.1 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-csstransforms-canvas-canvastext-draganddrop-inlinesvg-svg-svgclippaths-touch-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-url_data_uri
 */
;

var Modernizr = (function( window, document, undefined ) {

    var version = '2.7.1',

    Modernizr = {},


    docElement = document.documentElement,

    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    inputElem  ,


    toString = {}.toString,

    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),



    omPrefixes = 'Webkit Moz O ms',

    cssomPrefixes = omPrefixes.split(' '),

    domPrefixes = omPrefixes.toLowerCase().split(' '),

    ns = {'svg': 'http://www.w3.org/2000/svg'},

    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName, 


    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node, docOverflow,
          div = document.createElement('div'),
                body = document.body,
                fakeBody = body || document.createElement('body');

      if ( parseInt(nodes, 10) ) {
                      while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

                style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
          (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if ( !body ) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
          docOverflow = docElement.style.overflow;
          docElement.style.overflow = 'hidden';
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
        if ( !body ) {
          fakeBody.parentNode.removeChild(fakeBody);
          docElement.style.overflow = docOverflow;
      } else {
          div.parentNode.removeChild(div);
      }

      return !!ret;

    },



    isEventSupported = (function() {

      var TAGNAMES = {
        'select': 'input', 'change': 'input',
        'submit': 'form', 'reset': 'form',
        'error': 'img', 'load': 'img', 'abort': 'img'
      };

      function isEventSupported( eventName, element ) {

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

            var isSupported = eventName in element;

        if ( !isSupported ) {
                if ( !element.setAttribute ) {
            element = document.createElement('div');
          }
          if ( element.setAttribute && element.removeAttribute ) {
            element.setAttribute(eventName, '');
            isSupported = is(element[eventName], 'function');

                    if ( !is(element[eventName], 'undefined') ) {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
      }
      return isEventSupported;
    })(),


    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProp = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function (object, property) { 
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }


    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F();

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    function setCss( str ) {
        mStyle.cssText = str;
    }

    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    function is( obj, type ) {
        return typeof obj === type;
    }

    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }

    function testProps( props, prefixed ) {
        for ( var i in props ) {
            var prop = props[i];
            if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }

    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                            if (elem === false) return props[i];

                            if (is(item, 'function')){
                                return item.bind(elem || obj);
                }

                            return item;
            }
        }
        return false;
    }

    function testPropsAll( prop, prefixed, elem ) {

        var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
            props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

            if(is(prefixed, "string") || is(prefixed, "undefined")) {
          return testProps(props, prefixed);

            } else {
          props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
          return testDOMProps(props, prefixed, elem);
        }
    }



    tests['canvas'] = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    tests['canvastext'] = function() {
        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
    };
    tests['touch'] = function() {
        var bool;

        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
          bool = true;
        } else {
          injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
            bool = node.offsetTop === 9;
          });
        }

        return bool;
    };

    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };


    tests['csstransforms'] = function() {
        return !!testPropsAll('transform');
    };


    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };

    tests['inlinesvg'] = function() {
      var div = document.createElement('div');
      div.innerHTML = '<svg/>';
      return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };



    tests['svgclippaths'] = function() {
        return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
    };

    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
                                    featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }



     Modernizr.addTest = function ( feature, test ) {
       if ( typeof feature == 'object' ) {
         for ( var key in feature ) {
           if ( hasOwnProp( feature, key ) ) {
             Modernizr.addTest( key, feature[ key ] );
           }
         }
       } else {

         feature = feature.toLowerCase();

         if ( Modernizr[feature] !== undefined ) {
                                              return Modernizr;
         }

         test = typeof test == 'function' ? test() : test;

         if (typeof enableClasses !== "undefined" && enableClasses) {
           docElement.className += ' ' + (test ? '' : 'no-') + feature;
         }
         Modernizr[feature] = test;

       }

       return Modernizr; 
     };


    setCss('');
    modElem = inputElem = null;


    Modernizr._version      = version;

    Modernizr._prefixes     = prefixes;
    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;


    Modernizr.hasEvent      = isEventSupported;

    Modernizr.testProp      = function(prop){
        return testProps([prop]);
    };

    Modernizr.testAllProps  = testPropsAll;


    Modernizr.testStyles    = injectElementWithStyles;
    return Modernizr;

})(window, window.document);
// data uri test.
// https://github.com/Modernizr/Modernizr/issues/14

// This test is asynchronous. Watch out.


// in IE7 in HTTPS this can cause a Mixed Content security popup. 
//  github.com/Modernizr/Modernizr/issues/362
// To avoid that you can create a new iframe and inject this.. perhaps..


(function(){

  var datauri = new Image();


  datauri.onerror = function() {
      Modernizr.addTest('datauri', function () { return false; });
  };  
  datauri.onload = function() {
      Modernizr.addTest('datauri', function () { return (datauri.width == 1 && datauri.height == 1); });
  };

  datauri.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

})();
;

  // Attach to jQuery object
  $.Jcrop = Jcrop;

  $.Jcrop.supportsCanvas = Modernizr.canvas;
  $.Jcrop.supportsCanvasText = Modernizr.canvastext;
  $.Jcrop.supportsDragAndDrop = Modernizr.draganddrop;
  $.Jcrop.supportsDataURI = Modernizr.datauri;
  $.Jcrop.supportsSVG = Modernizr.svg;
  $.Jcrop.supportsInlineSVG = Modernizr.inlinesvg;
  $.Jcrop.supportsSVGClipPaths = Modernizr.svgclippaths;
  $.Jcrop.supportsCSSTransforms = Modernizr.csstransforms;
  $.Jcrop.supportsTouch = Modernizr.touch;

})(jQuery);

/*
    jQuery Masked Input Plugin
    Copyright (c) 2007 - 2015 Josh Bush (digitalbush.com)
    Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
    Version: 1.4.1
*/
!function(factory) {
    "function" == typeof define && define.amd ? define([ "jquery" ], factory) : factory("object" == typeof exports ? require("jquery") : jQuery);
}(function($) {
    var caretTimeoutId, ua = navigator.userAgent, iPhone = /iphone/i.test(ua), chrome = /chrome/i.test(ua), android = /android/i.test(ua);
    $.mask = {
        definitions: {
            "9": "[0-9]",
            a: "[A-Za-z]",
            "*": "[A-Za-z0-9]"
        },
        autoclear: !0,
        dataName: "rawMaskFn",
        placeholder: "_"
    }, $.fn.extend({
        caret: function(begin, end) {
            var range;
            if (0 !== this.length && !this.is(":hidden")) return "number" == typeof begin ? (end = "number" == typeof end ? end : begin, 
            this.each(function() {
                this.setSelectionRange ? this.setSelectionRange(begin, end) : this.createTextRange && (range = this.createTextRange(), 
                range.collapse(!0), range.moveEnd("character", end), range.moveStart("character", begin), 
                range.select());
            })) : (this[0].setSelectionRange ? (begin = this[0].selectionStart, end = this[0].selectionEnd) : document.selection && document.selection.createRange && (range = document.selection.createRange(), 
            begin = 0 - range.duplicate().moveStart("character", -1e5), end = begin + range.text.length), 
            {
                begin: begin,
                end: end
            });
        },
        unmask: function() {
            return this.trigger("unmask");
        },
        mask: function(mask, settings) {
            var input, defs, tests, partialPosition, firstNonMaskPos, lastRequiredNonMaskPos, len, oldVal;
            if (!mask && this.length > 0) {
                input = $(this[0]);
                var fn = input.data($.mask.dataName);
                return fn ? fn() : void 0;
            }
            return settings = $.extend({
                autoclear: $.mask.autoclear,
                placeholder: $.mask.placeholder,
                completed: null
            }, settings), defs = $.mask.definitions, tests = [], partialPosition = len = mask.length, 
            firstNonMaskPos = null, $.each(mask.split(""), function(i, c) {
                "?" == c ? (len--, partialPosition = i) : defs[c] ? (tests.push(new RegExp(defs[c])), 
                null === firstNonMaskPos && (firstNonMaskPos = tests.length - 1), partialPosition > i && (lastRequiredNonMaskPos = tests.length - 1)) : tests.push(null);
            }), this.trigger("unmask").each(function() {
                function tryFireCompleted() {
                    if (settings.completed) {
                        for (var i = firstNonMaskPos; lastRequiredNonMaskPos >= i; i++) if (tests[i] && buffer[i] === getPlaceholder(i)) return;
                        settings.completed.call(input);
                    }
                }
                function getPlaceholder(i) {
                    return settings.placeholder.charAt(i < settings.placeholder.length ? i : 0);
                }
                function seekNext(pos) {
                    for (;++pos < len && !tests[pos]; ) ;
                    return pos;
                }
                function seekPrev(pos) {
                    for (;--pos >= 0 && !tests[pos]; ) ;
                    return pos;
                }
                function shiftL(begin, end) {
                    var i, j;
                    if (!(0 > begin)) {
                        for (i = begin, j = seekNext(end); len > i; i++) if (tests[i]) {
                            if (!(len > j && tests[i].test(buffer[j]))) break;
                            buffer[i] = buffer[j], buffer[j] = getPlaceholder(j), j = seekNext(j);
                        }
                        writeBuffer(), input.caret(Math.max(firstNonMaskPos, begin));
                    }
                }
                function shiftR(pos) {
                    var i, c, j, t;
                    for (i = pos, c = getPlaceholder(pos); len > i; i++) if (tests[i]) {
                        if (j = seekNext(i), t = buffer[i], buffer[i] = c, !(len > j && tests[j].test(t))) break;
                        c = t;
                    }
                }
                function androidInputEvent() {
                    var curVal = input.val(), pos = input.caret();
                    if (oldVal && oldVal.length && oldVal.length > curVal.length) {
                        for (checkVal(!0); pos.begin > 0 && !tests[pos.begin - 1]; ) pos.begin--;
                        if (0 === pos.begin) for (;pos.begin < firstNonMaskPos && !tests[pos.begin]; ) pos.begin++;
                        input.caret(pos.begin, pos.begin);
                    } else {
                        for (checkVal(!0); pos.begin < len && !tests[pos.begin]; ) pos.begin++;
                        input.caret(pos.begin, pos.begin);
                    }
                    tryFireCompleted();
                }
                function blurEvent() {
                    checkVal(), input.val() != focusText && input.change();
                }
                function keydownEvent(e) {
                    if (!input.prop("readonly")) {
                        var pos, begin, end, k = e.which || e.keyCode;
                        oldVal = input.val(), 8 === k || 46 === k || iPhone && 127 === k ? (pos = input.caret(), 
                        begin = pos.begin, end = pos.end, end - begin === 0 && (begin = 46 !== k ? seekPrev(begin) : end = seekNext(begin - 1), 
                        end = 46 === k ? seekNext(end) : end), clearBuffer(begin, end), shiftL(begin, end - 1), 
                        e.preventDefault()) : 13 === k ? blurEvent.call(this, e) : 27 === k && (input.val(focusText), 
                        input.caret(0, checkVal()), e.preventDefault());
                    }
                }
                function keypressEvent(e) {
                    if (!input.prop("readonly")) {
                        var p, c, next, k = e.which || e.keyCode, pos = input.caret();
                        if (!(e.ctrlKey || e.altKey || e.metaKey || 32 > k) && k && 13 !== k) {
                            if (pos.end - pos.begin !== 0 && (clearBuffer(pos.begin, pos.end), shiftL(pos.begin, pos.end - 1)), 
                            p = seekNext(pos.begin - 1), len > p && (c = String.fromCharCode(k), tests[p].test(c))) {
                                if (shiftR(p), buffer[p] = c, writeBuffer(), next = seekNext(p), android) {
                                    var proxy = function() {
                                        $.proxy($.fn.caret, input, next)();
                                    };
                                    setTimeout(proxy, 0);
                                } else input.caret(next);
                                pos.begin <= lastRequiredNonMaskPos && tryFireCompleted();
                            }
                            e.preventDefault();
                        }
                    }
                }
                function clearBuffer(start, end) {
                    var i;
                    for (i = start; end > i && len > i; i++) tests[i] && (buffer[i] = getPlaceholder(i));
                }
                function writeBuffer() {
                    input.val(buffer.join(""));
                }
                function checkVal(allow) {
                    var i, c, pos, test = input.val(), lastMatch = -1;
                    for (i = 0, pos = 0; len > i; i++) if (tests[i]) {
                        for (buffer[i] = getPlaceholder(i); pos++ < test.length; ) if (c = test.charAt(pos - 1), 
                        tests[i].test(c)) {
                            buffer[i] = c, lastMatch = i;
                            break;
                        }
                        if (pos > test.length) {
                            clearBuffer(i + 1, len);
                            break;
                        }
                    } else buffer[i] === test.charAt(pos) && pos++, partialPosition > i && (lastMatch = i);
                    return allow ? writeBuffer() : partialPosition > lastMatch + 1 ? settings.autoclear || buffer.join("") === defaultBuffer ? (input.val() && input.val(""), 
                    clearBuffer(0, len)) : writeBuffer() : (writeBuffer(), input.val(input.val().substring(0, lastMatch + 1))), 
                    partialPosition ? i : firstNonMaskPos;
                }
                var input = $(this), buffer = $.map(mask.split(""), function(c, i) {
                    return "?" != c ? defs[c] ? getPlaceholder(i) : c : void 0;
                }), defaultBuffer = buffer.join(""), focusText = input.val();
                input.data($.mask.dataName, function() {
                    return $.map(buffer, function(c, i) {
                        return tests[i] && c != getPlaceholder(i) ? c : null;
                    }).join("");
                }), input.one("unmask", function() {
                    input.off(".mask").removeData($.mask.dataName);
                }).on("focus.mask", function() {
                    if (!input.prop("readonly")) {
                        clearTimeout(caretTimeoutId);
                        var pos;
                        focusText = input.val(), pos = checkVal(), caretTimeoutId = setTimeout(function() {
                            input.get(0) === document.activeElement && (writeBuffer(), pos == mask.replace("?", "").length ? input.caret(0, pos) : input.caret(pos));
                        }, 10);
                    }
                }).on("blur.mask", blurEvent).on("keydown.mask", keydownEvent).on("keypress.mask", keypressEvent).on("input.mask paste.mask", function() {
                    input.prop("readonly") || setTimeout(function() {
                        var pos = checkVal(!0);
                        input.caret(pos), tryFireCompleted();
                    }, 0);
                }), chrome && android && input.off("input.mask").on("input.mask", androidInputEvent), 
                checkVal();
            });
        }
    });
});

/*! jquery-password-generator-plugin - v0.0.0 - 2015-10-23
* Copyright (c) 2015 Sergey Sokurenko; Licensed MIT */
(function ($) {
  $.passGen = function (options) {
    // Override default options with passed-in options
    options = $.extend({}, $.passGen.options, options);

    // Local varialbles declaration
    var charsets, charset = '', password = '', index;

    // Available character lists
    charsets = {
      'numeric'   : '0123456789',
      'lowercase' : 'abcdefghijklmnopqrstuvwxyz',
      'uppercase' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      'special'   : '~!@#$%^&*()-+[]{}<>?'
    };

    // Defining merged character set
    $.each(charsets, function(key, value) {
      if (options[key]) {
        charset += value;
      }
    });

    // Generating the password
    for (var i=0; i< options.length; i++) {
      // defining random character index
      index = Math.floor(Math.random() * (charset.length));
      // adding the character to the password
      password += charset[index];
    }

    // Returning generated password value
    return password;
  };

  // Default options
  $.passGen.options = {
    'length' : 10,
    'numeric' : true,
    'lowercase' : true,
    'uppercase' : true,
    'special'   : false
  };
}(jQuery));
/*!
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					var result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				value = converter.write ?
					converter.write(value, key) :
					encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

				key = encodeURIComponent(String(key))
					.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
					.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';
				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}

					// Considers RFC 6265 section 5.2:
					// ...
					// 3.  If the remaining unparsed-attributes contains a %x3B (";")
					//     character:
					// Consume the characters of the unparsed-attributes up to,
					// not including, the first %x3B (";") character.
					// ...
					stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
				}

				return (document.cookie = key + '=' + value + stringifiedAttributes);
			}

			// Read

			var jar = {};
			var decode = function (s) {
				return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
			};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!this.json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) ||
						decode(cookie);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, arguments);
		};
		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

$(function() {
	dashNavActns();
	dashLstActns();
	preventSubmit();
	saveForm();
});

// Apply/Save form
function saveForm() {
    $('#saveApply').add('#saveExit').on('click', function() {
        submForm($(this));
    });
}

// Submit save form
function submForm($submit) {

    var $form = $submit.closest('form'),
        $elemID = $submit.closest('[data-id]').attr('data-id'),
        $afterSave = $submit.data('save'),
        $inputs = $form.find(':input');

    preLoad.start(function() {

        $submit.prop('disabled', true).removeClass('uk-button-success');
        $inputs.prop('readonly', true);

        $.post({
            url: $form.attr('action'),
            data: new FormData($form[0]),
            contentType: false,
            processData: false,
            success: function(msg) {
                preLoad.stop();
                if (msg) {
                    MechAlert.no(msg);
                } else {
                    MechAlert.yes(null, function() {
                        if ($afterSave === 'exit') {
                            goBack();
                        } else {
                            if (!$elemID) {
                                location.reload();
                            }
                        }
                    });
                }
                $submit.removeAttr('disabled').addClass('uk-button-success');
                $inputs.removeAttr('readonly');
            }
        });
    });

    return false;
}

// Get item type and action data
function getItem(data) {

    var $item = {};

    for (var i in data) {
        $item.action = (i);
        $item.val = data[i];
    }

    return $item;
}

// Return to the previous window location
function goBack(back) {

    if (back === '' || typeof(back) === 'undefined') {

        if (Cookies.get('goBack')) {
            back = Cookies.get('goBack');
            Cookies.remove('goBack');
        } else {
            back = baseUrl + 'admin';
        }
    }

    window.location.replace(back);
}

// Assign panel actions
function dashNavActns() {

    var $panel = $('#actionPanel'),
        $buttons = $panel.find('[data-create], [data-setup], [data-del]'),
        $type = $panel.attr('data-type'),
        $goBack = $('[data-goback]');

    // Go back button
    $goBack.on('click', function() {
        goBack();
    });

    // Nav action buttons
    $buttons.on('click', function() {

        var $item = getItem($(this).data());

        switch ($item.action) {

            case 'create':
            		var pid = ($item.val !== '') ? '/' + $item.val : '';

                Cookies.set('goBack', window.location.href);
                window.location.replace(index + 'create/' + $type + pid);
                break;
            case 'setup':
                Cookies.set('goBack', window.location.href);
                window.location.replace($(this).attr('data-setup'));
                break;
            case 'del':
                ItemAction.del($type);
                break;
        }
    });
}

// Assign main actions
function dashLstActns() {

    togExtrButs();

    // List actions
    var $list = $('#elList'),
        $type = $('#actionPanel').attr('data-type'),
        $chkAll = $('#checkAll'),
        $chkOne = $list.find('input:checkbox:not(#checkAll)'),
        $sort = $list.find('[data-uk-sortable]'),
        $listAction = $list.find('[data-view], [data-edit], [data-copy], [data-del], [data-pub]');

    $listAction.on('click', function() {

        $(this).on('click', function(event) {
            event.preventDefault();
        });

        var $clicked = $(this),
            $item = getItem($clicked.data()),
            $id = $clicked.closest('[data-id]').attr('data-id');

        switch ($item.action) {

        		case 'view':
        		    Cookies.set('goBack', window.location.href);
        		    window.location.replace(index + 'view/' + $id);
        		    break;
            case 'edit':
                Cookies.set('goBack', window.location.href);
                window.location.replace(index + 'edit/' + $type + '/' + $id);
                break;
            case 'copy':
                ItemAction.copy($type, $id);
                break;
            case 'del':
                ItemAction.del($type, $id);
                break;
            case 'pub':
                ItemAction.pub($clicked, $type, $id);
                break;
        }
    });

    // Select all items in list
    $chkAll.on('click', function() {
        if ($chkOne.length > 0) {
            $chkOne.prop('checked', $(this).prop('checked'));
            togExtrButs();
        } else {
            return false;
        }
        ItemAction.select();
    });

    // Select one(more) item in list
    $chkOne.on('change', function() {
        $chkAll.prop('checked', ($chkOne.filter(':checked').length === $chkOne.length) ? true : false);
        ItemAction.select();
        togExtrButs();
    });

    // Sort items
    $sort.on('start.uk.sortable', function(e) {
        $('html').css('overflow-x', 'hidden');
    }).on('stop.uk.sortable', function() {
        ItemAction.sort($sort);
        $('html').css('overflow-x', 'auto');
    });
}


// Item actions API
var ItemAction = (function() {

    //  Create selected items list
    var select = function() {

        var selected = {},
            list, el = 0;

        // Count selected
        $('#elList').find('input:checkbox:checked:not(#checkAll)').each(function() {
            selected[el++] = $(this).val();
        });

        // Prepare stringified JSON data (if > 0)
        if (jsum(selected) > 0) {
            list = JSON.stringify(selected);
        } else {
            list = 0;
        }

        // Save data to select all input dta attribute
        $('#checkAll').attr('data-selected', list);
    };

    // Copy item
    var copy = function(type, id) {
        $.post({
            url: index + 'copy/' + type + '/' + id,
            success: function(msg) {
                if (msg) {
                    MechAlert.no(msg);
                } else {
                    xReload('#elList');
                }
            }
        });
        return false;
    };

    // Change item publicate state
    var pub = function(el, type, id) {
        xChange(index + 'pub/' + type + '/' + id, function(msg) {
            xReload('#elList');
        });
    };

    // Delete item
    var del = function(type, id) {

        var callback = $('[data-del]').attr('data-del'),
            list = {},
            action, el = 0;

        if (id) {
            action = type + '/' + id;
        } else {
            action = type;
            list = { "data": $('#checkAll').attr('data-selected') };
        }

        UIkit.modal.confirm('Видалити остаточно?', function() {
            $.post({
                url: index + 'del/' + action,
                data: list,
                success: function(msg) {
                    if (msg) {
                        MechAlert.no(msg);
                    } else {
                        if (callback && callback[0] !== 'undefined') {
                            window[callback].apply();
                        } else {
                            MechAlert.yes(null, function() {
                                xReload('#elList');
                            });
                        }
                    }
                }
            });
        });
        return false;
    };

    // Sort items (drag&drop)
    var sort = function(sortable) {

        // Show sort order
        function setSort() {
            var ordering = 1;
            sortable.find('>.movable').each(function() {
                $(this).data('ordering', ordering)
                    .find('.uk-sortable-handle')
                    .text(ordering);
                ordering++;
            });
        }

        // Save sort order
        function saveSort() {
            var order = {},
                $el = $('#actionPanel').data('type');

            sortable.find('>.movable').each(function() {
                var $sorted = $(this);
                order[$sorted.data('id')] = $sorted.data('ordering');
            });

            $.post({
                url: index + 'sort/' + $el,
                data: { "data": JSON.stringify(order) },
                success: function(msg) {
                    xReload('#elList');
                }
            });
        }

        setSort();
        saveSort();
    };

    return {
        copy: copy,
        pub: pub,
        del: del,
        select: select,
        sort: sort
    };
})();


// AJAX custom DIV reload
function xReload(divId) {
    $.get(location + divId, function(content) {
        $(divId).replaceWith($(content).find(divId));
        dashLstActns();
        togCatList();
    });
}

// Change custom values vy Ajax|PHP
function xChange(act, callback) {
    $.ajax({
        url: act,
        success: function() {
            if (callback && typeof(callback) === 'function') {
                callback();
            } else if (callback && typeof(callback) === 'string') {
                MechAlert.yes(callback);
            }
        }
    });
}
// Basic dash scripts
$(function() {
    chkUrlInput();
    limitUpload();

    // Set CSRF Token for all ajax requests (for Codeigniter)
    $.ajaxSetup({ data: { csrf_token: Cookies.set('csrf_cookie') } });

    // Login
    var $logForm = $('#loginForm'),
        $logRedirect = $logForm.attr('data-redirect');


    $logForm.on('submit', function(event) {
        event.preventDefault();

        $.post({
            url: $(this).attr('action'),
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(msg) {
                if (msg) {
                    MechAlert.no(msg);
                } else {
                    location.replace($logRedirect);
                }
            }
        });
        return false;
    });

    // Format Codeigniter profiler
    $('#codeigniter_profiler').css({
        'position': 'relative',
        'bottom': 0,
        'right': 0,
        'margin-left': '18%',
        'margin-bottom': '50px'
    });

    // Show JQuery & UIkit version
    $('#jq').html((window.jQuery) ? 'JQuery: ' + $().jquery + '. UIkit: ' + $.UIkit.version : 'JQuery not loaded!!!');

    // Pass check
    if ($('#pass')[0]) {

        var $pass = $('#pass'),
            $pass_check = $('#pass_check');

        $pass_check.add($pass).on('change', function() {
            if ($pass_check.val() !== '' && $pass.val() !== $pass_check.val()) {
                $pass_check.addClass('uk-form-danger');
            } else if ($pass_check.val() !== '' && $pass.val() === $pass_check.val()) {
                $pass_check.addClass('uk-form-success');
            }
        });

        // Password generate
        $('#passGen').on('click', function() {
            var pass = $.passGen();
            copyToClipboard(pass);
            $('#passGenShow').html(pass);
        });
    }

    // Check alpha/num on input
    $(':input[data-alpha-num]')
        .on('keyup', function() {
            $(this).toggleClass('uk-form-danger', !AlphaNumCheck($(this).val()));
        })
        .on('change', function() {
            if (!AlphaNumCheck($(this).val())) {
                MechAlert.no('Допустимі тільки латинські символи та цифри, символи "_" та "-" ');
            }
        });

    // Count symbols in input/textarea field while typing
    $(':input[data-text-count]').each(function() {

        var $count = $(this),
            $show = $count.siblings('span').children('[data-show-count]');

        $count.on('keyup', function() {
            $show.html($(this).val().length);
        });

        $show.html($count.val().length);
    });

    // Autoenter with translit for [name] input from [title] input
    $('#autoName').on('focus', function() {
        if ($(this).val() === '') {
            urlAutoTranslit(true);
        }
        return false;
    });

    // Phone input mask
    // $('#saveForm').find('input[type="tel"]').each(function(index, el) {
    // 	$(this).mask('(999) 999-99-99', { autoсlear: false });
    // });
});

// Prevent form submit by enter
function preventSubmit () {
	$('#saveForm').find(':input').not('[type=submit]').on('keypress', function(event) {

	    if (event.keyCode == 13) {

	        event.preventDefault();

	        // Focus on next input
	        var inputs = $(this).parents("form").eq(0).find(":input"),
	            idx = inputs.index(this);

	        // Find if the last input (last == submit)
	        if (idx == inputs.length - 1) {
	            inputs[0].select();
	        } else {
	            inputs[idx + 1].focus();
	            // inputs[idx + 1].select();
	        }
	        return false;
	    }
	});
}

// Check input (alpha/num)
function AlphaNumCheck(input) {
    var pattern = /^[a-zA-Z0-9_-]*$/;
    return pattern.test(input);
}

// Calculate object sum
function jsum(obj) {
    var sum = 0;

    for (var el in obj) {
        if (obj.hasOwnProperty(el)) {
            sum += parseFloat(obj[el]);
        }
    }
    return sum;
}

// Copy to clipboard
function copyToClipboard(text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    if (document.execCommand("copy")) {
        MechAlert.info('Пароль скопійовано в буфер обміну');
    }
    $temp.remove();
}

// Max files upload limit
function limitUpload() {

    $('#multiUpload').find('input[data-maxfiles]').on('change', function() {

        var max = $(this).attr('data-maxfiles');

        if (this.files.length > max) {
            MechAlert.no('Максимальна кількість файлів для одночасного завантаження:  ' + max);
            this.value = '';
        }
    });
}


// Check different inputs with urls/links/anchors (by type)
function chkUrlInput() {

    $('#saveForm').find(':input[data-url-check]').on('change', function() {

        var chkd = chkUrl($(this).val, $(this).attr('data-url-check'));

        if (chkd) {
            $urlInput.removeClass('uk-form-danger');
        } else {
            $urlInput.addClass('uk-form-danger');
        }
    });
}

// Check URL with regEx
function chkUrl(url, pattern) {

    if (!pattern) {
        pattern = /^(http|https)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;
    } else {
        pattern = /^[a-z0-9-_]/;
    }

    return (pattern.test(url)) ? true : false;
}

// Remove &nbsp(s) at the beginning of selected text
function clSpcSelect(selected) {

    var str = selected.text();

    if (/^\s/.test(str)) {
        str = $.trim(str);
        selected.text(str);
    }

    return str;
}

// Trim functions
function trim(str, chars) {
    return ltrim(rtrim(str, chars), chars);
}

function ltrim(str, chars) {
    chars = chars || "\\s";
    return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}

function rtrim(str, chars) {
    chars = chars || "\\s";
    return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}


// MechAlert
var MechAlert = (function() {
    var notify = UIkit.notify,
        text = '<div class="uk-text-center"><i class="uk-icon-small uk-icon-check-square-o"></i></div>';

    return {
        yes: function(msg, callback) {
            if (msg || typeof(msg) === "string") {
                text = msg;
            }

            notify(text, {
                status: 'success',
                timeout: 200,
                pos: 'top-center',
                onClose: function() {
                    if (callback && typeof(callback) === "function") {
                        callback();
                    }
                }
            });
        },
        no: function(msg) {
            notify(msg, {
                status: 'danger',
                timeout: 0,
                pos: 'top-center'
            });
        },
        info: function(msg) {
            notify(msg, {
                timeout: 1000,
                pos: 'top-center'
            });
        },

    };
})();
// Comments control
$(function() {
    NotifyComments();
    ToggleComments();
    ChangeCommentStatus();
    ViewComment();
});

// Toggle between comment tabs with content reload (w AJAX load)
function ToggleComments() {
    $('ul[data-comments]').find('li > a').on('click', function(event) {
        event.preventDefault();

        var $tab = $(this);

        if ($tab.parent('li').hasClass('uk-active')) {
            // Prevent reloading active tab
            return false;
        } else {
            ReloadComments($tab);
        }
    });
}

// Refresh comments container (w AJAX)
function ReloadComments($tab) {

    var $li, $link, notify;

    if (typeof($tab) === 'undefined') {
        notify = true;
        $li = $('#elList').find('ul[data-comments]').find('li.uk-active');
        $link = $li.find('a');
    } else {
        $link = $tab;
        notify = false;
    }

    // Reload comments table
    $('#comments_table').load($link.attr('href') + ' #comments_table > *', function() {
        dashLstActns();

        if (notify) {
            NotifyComments();
            SetCommentsCount();
        }

        ViewComment();
    });
}

// Change comments status
function ChangeCommentStatus() {

    $('#commentStates').find('li > a').on('click', function(event) {
        event.preventDefault();

        $.post({
            url: index + 'change_status/' + $(this).attr('data-comment-state'),
            data: { "data": $('#checkAll').attr('data-selected') },
            success: function(msg) {
                if (msg) {
                    MechAlert.no(msg);
                } else {
                    ReloadComments();
                }
            }
        });
        return false;
    });
}

// Change comments count in comments tab header
function SetCommentsCount() {

    var $commentTabs = $('#commentStatus');

    if (typeof($commentTabs[0]) !== 'undefined') {

        $.get(index + 'count_comments', function(data) {

            var $comStates = $commentTabs.find('[data-status]'),
                $count = JSON.parse(data);

            $comStates.each(function() {

                var $badge = $(this),
                    $status = $badge.attr('data-status'),
                    $num = $count[$status];

                $badge.html($num).toggle($num > 0);
            });
        });
    }
}

// Notify new comments in sidebar
function NotifyComments() {
    $.get(baseUrl + 'admin/comments/notify', function(data) {
        $('#comments_notify').toggle(data > 0).html(data);
    });
}

// View/edit comment
function ViewComment() {
    $('[data-ajax-modal]').on('click', function(event) {
        event.preventDefault();

        // AJAX load modal
        $.get($(this).attr('href'), function(data) {

            $('body').append(data);

            var $modal = UIkit.modal('#commentInModal');

            // Open modal
            $modal.show().on({
                'hide.uk.modal': function() {
                    $(this).remove();
                }
            });
        });
    });
}
// Add active class to Sidebar link
$(function() {

    var urlObj = window.location.href.split('/'),
    		$siteHref = $('#siteHref');

    if (urlObj[6] === 'category' || urlObj[5] === 'categories') {
        $('#catsHref').add($siteHref).addClass('active');
    }

    if (urlObj[6] === 'page' || urlObj[5] === 'pages') {
        $('#pagesHref').add($siteHref).addClass('active');
    }

    if (urlObj[4] === 'site') {
        $siteHref.addClass('active');
    }


    $('#dashMenu li').each(function() {

        var $li = $(this),
            link = $li.find('a').attr('href'),
            linkObj = link.split('/');

        if (linkObj[4] !== 'site') {
            $li.toggleClass('active', linkObj[4] === modName);
        }
    });
});



// Add active class to Categories list link

$(function() {
	togCatList();
});

function togCatList() {
    $('#catList').find('tr a').each(function() {
        $(this).closest('tr').toggleClass('mech-active-td', window.location.href === this.href);
    });
}
$(function() {

    var $pEdit = $('#saveForm').find('select[data-pagetype-select]');

    if ($pEdit.length > 0) {
        pageEditor($pEdit);
    }
});

// Change pagetype
function pageEditor($pEdit) {

    // Page type
    $pEdit.on('change', function() {

        var $data = {
            'id': $(this).attr('data-id'),
            'pid': $('#catSelect').val(),
            'category': $(this).attr('data-category'),
            'type': $(this).val()
        };

        $.get(index + 'change_pagetype', $data, function(data) {

            // Replace editor template
            $('#contentField').hide(function() {
                $(this).html(data);

                // Initialize wysiwyg
                wysiwygLoader();

                // Toggle widgets edit
                editMediaLib();

            }).fadeIn();
        });
    });

    // Change sub page templates list for selected type
    $('#saveForm').find('select[data-subpage-type]').on('change', function() {

        var $tplSelect = $('#subTplSelect'),
            $data = {
                'id': $(this).attr('data-id'),
                'type': $(this).val()
            };

        $.get(index + 'change_pagetpl', $data, function(data) {
            $tplSelect.html(data);
        });
    });
}


$(function() {
    mediaSrcSelect();
});


// Mediatype select
function mediaSrcSelect() {

    var $mediaSrc = $('#mediaSrc'),
        $mediaSrcSelect = $('#saveForm').find('[data-mediasrc-select]');

    $mediaSrcSelect.on('change', function() {

        var $data = {
            'id': $(this).attr('data-mediasrc-select'),
            'pid': $('input[name=pid]').val(),
            'src': $(this).val()
        };

        $.get(index + 'mediasrc_select', $data, function(data) {
            $mediaSrc.html(data);
            MechUploadAPI();
            InputFields();
        });
    });
}


// Operations with input fields (copy/remove/compile)
$(function() {
    InputFields();
});

function InputFields() {
    var $form = $('#saveForm'),
        $copyField = $form.find('[data-field-copy]'),
        $delField = $form.find('[data-field-del]'),
        $complInput = $form.find(':input[data-name]'),
        $icoChange = $form.find('[data-icon-change]'),
        $icoDel = $form.find('[data-icon-del]');

    // Copy input block
    $copyField.on('click', function() {

        var $field = $(this).closest('fieldset[data-field]'),
            $clone = $field.clone(true);

        // Clone field and insert after original
        $field.after($clone);

        // Clean values & focus on first input
        $clone.find(':input').val('').filter(':first').focus();
        compileInputs($clone.find(':input[data-name]:first'));

        // Clear icon (if isset)
        iconPreview($clone.find('[data-icon-change]'));
        lastDelHide();
    });

    // Delete input block
    $delField.on('click', function() {
        $(this).closest('fieldset[data-field]').remove();
        lastDelHide();
    });

    // Compile inputs on change
    $complInput.on('change', function() {
        compileInputs($(this));
    });

    // Select icon
    $icoChange.on('click', function(event) {
        event.preventDefault();
        iconModal($(this));
    });

    // Delete icon
    $icoDel.on('click', function() {
        iconDel($(this));
    });

    // Check last element in each field
    lastDelHide();
}

// Remove delete from last field
function lastDelHide() {
    $('#saveForm').find('fieldset[data-field]').parent('div').each(function() {
        $del = $(this).find('i[data-field-del]');
        $del.toggle($del.length > 1);
    });
}

// Compile inputs if one changed (json formatted)
function compileInputs($input) {

    // Get parent fieldset, all neighbor inputs and compiling input
    var $field = $input.closest('fieldset[data-compile]'),
        $inputs = $field.find(':input[data-name]'),
        $compiled = $field.find(':input[data-compiled-input]'),
        $serialize = {},
        $inp;

    // Serialize inputs to object
    $inputs.each(function() {
        $inp = $(this);
        $serialize[$inp.attr('data-name')] = $inp.val();
    });

    // Save serialized json to final input
    $compiled.val(JSON.stringify($serialize));
}

// Set icon for icon button
function iconPreview($button, $icon) {

    var $icoDel = $button.siblings('[data-icon-del]'),
        $preview;

    if ($icon) {
        $preview = 'uk-icon-large uk-icon-' + $icon;
        $icoDel.show();
    } else {
        $preview = 'uk-icon-plus';
        $icoDel.hide();
    }

    $button.html('<i class="' + $preview + '"></i>');
}

// Delete icon
function iconDel($clicked) {
    var $icoInput = $clicked.siblings(':input[data-name="icon"]'),
        $icoPreview = $clicked.siblings('[data-icon-change]');

    $icoInput.val('');
    compileInputs($icoInput);
    iconPreview($icoPreview);
}

// Load icon select Modal
function iconModal($icoPreview) {

    // AJAX load modal with icons
    $.get(baseUrl + 'admin/dash/icon_select', function(data) {

        $('body').append(data);

        var $icoModal = UIkit.modal('#iconSelect'),
            $icons = $icoModal.find('.icon-thumb'),
            $icoSearch = $icoModal.find('#icoSearch');

        // Open/hide modal
        $icoModal
            .show()
            .on({
                'hide.uk.modal': function() {
                    $(this).remove();
                }
            });

        // Find icon by input
        $icoSearch.on('keyup', function() {

            var text = $(this).val().toLowerCase();

            if (text) {
                // Find icon captions that contain searching text & show icons
                $icons.hide().children('div:contains(' + text + ')').parent().show();
            } else {
                $icons.show();
            }
        });

        // Select icon
        $icons.on('click', function(event) {
            event.preventDefault();

            // Find active button & its field
            var $icoInput = $icoPreview.siblings(':input[data-name="icon"]'),
                $icoName = $(this).attr('data-icon-name');

            // Set value to input
            $icoInput.val($icoName);
            // Compile (if in compile field)
            compileInputs($icoInput);
            // Show icon preview
            iconPreview($icoPreview, $icoName);
            // Close modal
            $icoModal.hide();
        });
    });
}
// File Upload API
$(function() {
    if ($('#mechUpLoader')[0]) {
        MechUploadAPI();
    }
});

function MechUploadAPI() {

    var $fUpLoad = $('#fUpload'),
        $fUp = $fUpLoad.find(':file'),
        $fRemove = $('#fRemove'),
        $fDel = $('#fDel'),
        $fInfo = $('#fInfo'),
        $fShowName = $('#fName'),
        $fShowSize = $('#fSize'),
        $fPreview = $('#fPreview');

    // Select file to upload
    $fUp.on('change', function() {
        return FileUp(this.files[0]);
    });

    // Remove uploaded file
    $fRemove.on('click', function() {
        return FileDel();
    });

    // Upload file
    var FileUp = function(file) {

        // Add delete content input (for server side file delete)
        $fDel.prop('disabled', true);

        // Hide upload button, show remove button && base file info
        $fUpLoad.add($fInfo).add($fPreview).toggle();

        // Read file and show preview
        FilePreview(file);
    };

    // Remove uploaded file
    var FileDel = function() {

        // Add delete content input (for server side file delete)
        $fDel.prop('disabled', false);

        // Clean input
        $fUp.val(null);

        // Remove preview
        $fPreview.empty();

        // Show upload button, hide remove button && file info
        $fInfo.add($fUpLoad).add($fPreview).toggle();
    };


    // Get file dimensions
    var GetFileDims = function(file, src, callback) {

        // Get image width/height
        function ImgSize() {

            var $holderW = $('#mechUpLoader').width();

            // Image load
            var img = new Image();
            img.src = src;

            img.onload = function() {

                var $optsHolder = $('#mediaOptions'),
                    size = {
                        'width': this.width,
                        'height': this.height,
                        'holder_w': $holderW
                    },
                    $options = {};

                // Parse options
                if ($optsHolder[0] !== 'undefined') {
                    $options = JSON.parse($optsHolder.val());
                }

                callback(Object.assign($options, size));
            };
        }

        // Get image width/height
        if (file.type.match('image.*')) {
            return ImgSize();
        }

        callback(null);
    };

    // Show file preview
    var FilePreview = function(file) {

        // Create temp blob src for file
        var src = URL.createObjectURL(file);

        // Get file dimensions && show preview
        GetFileDims(file, src, function(options) {

            var fileInfo = {
                'name': file.name,
                'size': file.size,
                'type': file.type,
                'src': src,
            };

            var data = Object.assign(fileInfo, options);

            // Get template for current file type
            $.get(index + 'file_upload', { 'blob': data }, function(tpl) {
                $fPreview.html(tpl);
                MechImageAPI();
            });
        });

        // Show file name & size
        $fShowName.html(file.name);
        $fShowSize.html((file.size / 1024 / 1024).toFixed(2));
    };
}
// Image crop & resize API

function MechImageAPI() {

		preventSubmit();

    var $editor = $('#mechImgEditor'),
        $origImg = $('#origImg'),
        $crop = $editor.find('[data-img-crop]'),
        $lock = $editor.find('[data-lock]'),
        $reset = $editor.find('[data-img-reset]'),
        $resize = $editor.find('[data-img-size]').find(':input[type=number]'),
        $cropModal = $('#cropModal'),
        $saveCrop = $cropModal.find(':input[data-crop-save]');

    // Manual crop
    $crop.on('click', function() {
        CropImage($(this).attr('data-img-crop'));
    });

    // Save crop
    $saveCrop.on('click', function() {
        SaveCrop();
    });

    // Lock proportions
    $lock.on('click', function() {
        ToggleLock($(this));
    });

    // Resize image
    $resize.on('change', function() {
        ResizeImage($(this));
    });

    // Reset image
    $reset.on('click', function() {
        ResetImage($(this).attr('data-img-reset'));
    });

    // Get real image size
    var GetRealSize = function() {
        return {
            'w': parseInt($origImg.attr('width')),
            'h': parseInt($origImg.attr('height'))
        };
    };

    // Get previous crop coordinates (if isset)
    var GetPreviousCrop = function(src) {

        var $cropCoords = {
            'x': parseInt($(':input[name=' + src + '_cx]').val()),
            'y': parseInt($(':input[name=' + src + '_cy]').val()),
            'w': parseInt($(':input[name=' + src + '_cw]').val()),
            'h': parseInt($(':input[name=' + src + '_ch]').val())
        };

        return (jsum($cropCoords) > 0) ? $cropCoords : null;
    };

    // Get input sizes
    var GetInputSize = function(src) {
        return {
            w: parseInt($editor.find(':input[name=' + src + '_w]').val()),
            h: parseInt($editor.find(':input[name=' + src + '_h]').val())
        };
    };

    // Get ratio for proportional resize
    var GetResizeRatio = function(input, crop) {

        var real = GetRealSize(),

            rx = input.w / ((crop) ? crop.w : real.w),
            ry = input.h / ((crop) ? crop.h : real.h);

        return Math.max(rx, ry);
    };

    // Crop image API
    var CropImage = function(src) {

        // Save active src image to data()
        $origImg.data('active', src);

        // Get previous crop data
        var crop = GetPreviousCrop(src);

        // Get cropped size
        var cropped = CroppedSizes(src);

        // Set selection for crop
        var $setSelect = [
            (!crop) ? (cropped.left / cropped.ratio).toFixed() : crop.x,
            (!crop) ? (cropped.top / cropped.ratio).toFixed() : crop.y,
            (!crop) ? cropped.w / cropped.ratio : crop.w,
            (!crop) ? cropped.h / cropped.ratio : crop.h
        ];

        // Initialize Crop API
        $origImg.Jcrop({
            setSelect: $setSelect,
            boxWidth: $origImg.parent().width(),
            aspectRatio: cropped.w / cropped.h,
            bgOpacity: 0.5,
            onSelect: UpdateCoord
            // onChange: UpdateCoord
        });

        // Open modal for crop
        var $cropModal = UIkit.modal('#cropModal', { center: true, bgclose: false, keyboard: false });

        $cropModal.show().on({
            'hide.uk.modal': function() {
            		if ($origImg.data('Jcrop')) {
            		    $origImg.data('Jcrop').destroy();
            		    $origImg.removeAttr('style');
            		}
            }
        });
    };

    // Save crop coordinates (in temp data())
    var UpdateCoord = function(c) {
        $origImg.data('temp', {
            x: c.x,
            y: c.y,
            w: c.w,
            h: c.h
        });
    };

    // Save crop coordinates
    var SaveCrop = function() {

        var $temp = $origImg.data('temp'),
            src = $origImg.data('active');

        $(':input[name=' + src + '_cx]').val(parseInt($temp.x));
        $(':input[name=' + src + '_cy]').val(parseInt($temp.y));
        $(':input[name=' + src + '_cw]').val(parseInt($temp.w));
        $(':input[name=' + src + '_ch]').val(parseInt($temp.h));

        PreviewCropped(src);
    };

    // Get cropped sizes & margin
    var CroppedSizes = function(src) {

        // Get real image size
        var real = GetRealSize();

        // Get width & height values from input
        var input = GetInputSize(src);

        // Check if crop data isset
        var crop = GetPreviousCrop(src);

        // Get resize ratio
        var resizeRatio = GetResizeRatio(input, crop);

        // Get max original image size
        var max = {
            'maxW': (real.w * resizeRatio).toFixed(),
            'maxH': (real.h * resizeRatio).toFixed()
        };

        // Set top/left margin for cropped image
        var step = {
            'left': ((crop) ? (crop.x * resizeRatio) : (max.maxW - input.w) / 2).toFixed(),
            'top': ((crop) ? (crop.y * resizeRatio) : (max.maxH - input.h) / 2).toFixed()
        };

        return Object.assign(max, step, input, { ratio: resizeRatio });
    };

    // Preview cropped image
    var PreviewCropped = function(src) {

        // Get cropped size
        var cropped = CroppedSizes(src);

        // Change CSS for image
        function ImageResize() {

            $('#' + src + 'C').css({
                width: cropped.maxW + 'px',
                height: cropped.maxH + 'px',
                maxWidth: cropped.maxW + 'px',
                maxHeight: cropped.maxH + 'px',
                left: (cropped.left > 0) ? '-' + cropped.left + 'px' : '0',
                top: (cropped.top > 0) ? '-' + cropped.top + 'px' : '0'
            });
        }

        // Change CSS for image container
        function FigureResize() {

            $('#' + src + 'C').parent('figure').css({
                width: cropped.w + 'px',
                height: cropped.h + 'px',
                overflow: (cropped.w > $editor.width()) ? 'auto' : 'hidden'
            });
        }

        ImageResize();
        FigureResize();
    };

    // Reset image crop & size
    var ResetImage = function(src) {

        // Reset width & height
        $('#' + src + 'Preview').find('input[type=number]').each(function() {
            $(this).val($(this).prop('defaultValue'));
        });

        // Reset crop data
        $('#' + src + 'Cinput').find('input').each(function() {
            $(this).val(null);
        });

        // Rest image preview
        PreviewCropped(src);
    };

    // Resize image
    var ResizeImage = function($input) {

        // Get default value of current input
        var def = $input.prop('defaultValue');

        // Get default Value of neighbor input
        var $neighbor = $input.siblings('input[type=number]'),
            ndef = $neighbor.prop('defaultValue');

        // Get lock
        var $locked = $input.siblings('button[data-lock]').attr('data-lock');

        if ($locked === 'true') {
            $neighbor.val(($input.val() * ndef / def).toFixed());
        }

        PreviewCropped($input.closest('[data-img-size]').attr('data-img-size'));
    };

}
$(function() {
	editMediaLib();
});

// Edit medialib in frame (modal)
function editMediaLib() {

    // Toggle medialib edit button
    $('[data-select-lib]')
        .on('change', function() {
            showLibList($(this));
        })
        .each(function() {
            showLibList($(this));
        });

    function showLibList(lib) {
        lib.siblings('[data-lib-list]').toggle(lib.val() > 0);
    }

    // Edit medialib in frame
    $('[data-lib-list]')
        .on('click', function() {

            var $lib = $(this),
                libName = $lib.closest('[data-libname]').attr('data-libname');

            $data = {
                'lib_id': $lib.siblings('select').val(),
                'page_id': $lib.attr('data-lib-list')
            };

            // AJAX load modal with widget list
            $.get(baseUrl + 'admin/medialib/page_list', $data, function(data) {

                // Load data
                $('body').append(data);

                // Show list
                listLibItems(libName);

                // Open modal
                UIkit.modal('#itemsModal')
                    .show()
                    .on({
                        'hide.uk.modal': function() {
                            $(this).remove();
                        }
                    });
            });
        });
}


// Control items to show on page
function listLibItems(libName) {

    var list = $('#itemsList'),
        showAll = list.find('[data-show-all]'),
        items = list.find('tr[data-id]'),
        input = $('input[name="options[widget][' + libName + '][items]"]'),
        obj = input.val().split(","),
        allState = (obj[0] == '-1') ? 1 : 0;

    items
        // Toggle items on load
        .each(function() {
            toggleItemState($(this), input);
            setItemState($(this), input);
        })

        // Toggle items on click
        .on('click', '[data-item-view]', function() {

            var item = $(this).closest('tr[data-id]'),
                show = (item.attr('data-show') == 1) ? 0 : 1;

            // Save show attribute to item
            item.attr('data-show', show);

            // Change item view
            setItemState(item, input);

            // Save to input
            saveToInput(input, items);
        });

    // Toggle all|none items
    showAll
        .attr('data-show-all', allState)
        .toggleClass('uk-text-success', allState === 1)
        .on('click', function() {

            var all = $(this),
                state = (all.attr('data-show-all') == 1) ? 0 : 1;

        		all
        		.toggleClass('uk-text-success', state === 1)
            .attr('data-show-all', state);

            items.each(function() {

                // Change item state
                $(this).attr('data-show', state);

                // Change item view
                setItemState($(this), input);
            });

            // Save to input
            saveToInput(input, items);
        });
}

// Toggle each lib item
function toggleItemState(item, input) {

    var id = item.attr('data-id'),
        obj = input.val().split(",");

    item.attr('data-show', (obj.includes(id) || obj[0] == -1) ? 1 : 0);
}

// Set shown|hidden item view
function setItemState(item) {

    var show = item.attr('data-show'),
        view = item.find('[data-item-view]'),
        shown = 'uk-text-success',
        hidden = 'inactive uk-overlay-grayscale';

    if (show == 1) {
        view.addClass(shown);
        item.removeClass(hidden);
    } else {
        view.removeClass(shown);
        item.addClass(hidden);
    }
}

// Save items array to input
function saveToInput(input, items) {

    var selected = items.filter('[data-show="1"]'),
    		all = $('[data-show-all]'),
        count1 = items.length,
        count2 = selected.length,
        obj = [],
        i = 0;

    // All items
    if (count2 === count1) {
        obj = '-1';
        all.attr('data-show-all', 1).addClass('uk-text-success');
    }

    // No items
    else if (count2 === 0) {
        obj = '0';
        all.attr('data-show-all', 0).removeClass('uk-text-success');
    }

    // If some selected
    else {
        all.attr('data-show-all', 0).removeClass('uk-text-success');
        selected.each(function() {
            obj[i++] = parseInt($(this).closest('tr[data-id]').attr('data-id'));
        });
    }

    // Save object to inputs
    input.val(obj);
}
// $(function() {

    // var $pagination = $('[data-uk-pagination]'),
    //     $options = $pagination.data('pagination'),
    //     $num = $options.options.itemsOnPage,
    //     $offset;

    // $pagination.on('select.uk.pagination', function(e, pageIndex) {

    //     if (pageIndex === 0) {
    //         $offset = '0';
    //     } else {
    //         $offset = $num * pageIndex;
    //     }

    //     // Reload pages table
    //     $('#page_table').load(location +'/' + $num + '/' + $offset + ' #page_table > *', function() {
    //         dashLstActns();
    //     });
    // });
// });

// Preload animation
var preLoad = (function() {

    var $preloader = $('#mechPreloader');

    return {
        start: function(callback) {
            $preloader.fadeIn('slow', function() {
                if (callback && typeof(callback) === 'function') {
                    callback();
                }
            });
        },
        stop: function(callback) {
            $preloader.fadeOut(function() {
                if (callback && typeof(callback) === 'function') {
                    callback();
                }
            });
        }
    };
})();
// Toggle extra buttons
function togExtrButs() {
    var $chkbox = $('#elList').find('input:checkbox:not(#checkAll)'),
        $checked = $chkbox.filter(':checkbox:checked'),
        $del = $('#actionPanel').find('[data-del]');
    $status = $('#actionPanel').find('[data-status]');
    $del.add($status).toggle($checked.length > 0);
}

// Toggle all/selected options in multiselect
$(function() {

    if ($('#multiCheck').length) {
        var $multiCheck = $('#multiCheck'),
            $allChecked = $multiCheck.find(':checkbox[value="-1"]'),
            $other = $multiCheck.find(':checkbox').not($allChecked),
            $parent = $multiCheck.find('li[data-parent]');

        // Check/uncheck all subs when click on category
        $parent.each(function() {
            var $this = $(this),
                $parentCheck = $this.find(':checkbox:first'),
                $subsCheck = $this.find(':checkbox').not($parentCheck);

            $parentCheck.on('click', function() {
                $subsCheck.prop('checked', $(this).prop('checked'));
            });
        });

        // Check/uncheck one
        $other.on('click', function() {
            var $checked = $other.filter(':checked');
            $allChecked.prop('checked', ($checked.length === $other.length) ? true : false);
        });
    }

});

// True|false toggle
$(function() {
    $('.tf-toggle-icon').each(function() {
        togBool($(this));
    });
});

function togBool(toggle) {

    var input = toggle.siblings('input:hidden'),
        bool = 'data-bool',
        field = toggle.attr('data-fieldset'),
        onClass = 'uk-icon-toggle-on on',
        offClass = 'uk-icon-toggle-off';

    // On load
    if (input.val() > 0) {
        toggle.attr(bool, 1).removeClass(offClass).addClass(onClass);

    } else {
        toggle.removeAttr(bool).removeClass(onClass).addClass(offClass);
    }

    // Toggle fieldset (if isset)
    if (field) {
        togField(field, toggle.attr(bool));
    }

    // On click
    toggle.on('click', function() {

        if (toggle.attr(bool)) {
            toggle.removeAttr(bool).removeClass(onClass).addClass(offClass);
            input.val(0);
        } else {
            toggle.attr(bool, 1).removeClass(offClass).addClass(onClass);
            input.val(1);
        }
        if (field) {
            togField(field, toggle.attr(bool));
        }
    });
}


// Toggle fieldset items
function togField(fieldset, toggle) {

    var enable = toggle ? true : false;

    $(fieldset)
        .toggle(enable)
        .find('input, textarea').prop('readonly', !enable).end()
        .find('select').prop('disabled', !enable);
}

// Toggle lock button icon
function ToggleLock(button) {

    var attr = 'data-lock',
        locked = button.attr(attr),
        icon = button.find('i'),
        onClass = 'uk-icon-unlock-alt';

    if (locked) {
        button.removeAttr(attr);
        icon.addClass(onClass);
    } else {
        button.attr(attr, true);
        icon.removeClass(onClass);
    }
}


// Show/hide URLfield
$(function() {

    var $urlCtrl = $('#itemTypeSelect'),
        $urlField = $('#urlField');

    if ($urlCtrl.length) {

        $urlCtrl.on('change', function() {
            togUrlFld($(this).val(), $urlField);
        });

        togUrlFld($urlCtrl.val(), $urlField);
    }
    editItemLnk($urlField);
});

// Toggle url edit fieldset on item type change
function togUrlFld(selected, $urlField) {
    if (selected === 'link' || selected === 'cat' || selected === '1') {
        $urlField.show();
    } else {
        $urlField.hide().find(':input').val('');
        $('#urlIdSelect').val('0');
    }

}
// Translit char or string
function translit(string) {
    var trChar = {
        'А': 'a',
        'Б': 'b',
        'В': 'v',
        'Г': 'g',
        'Д': 'd',
        'Е': 'e',
        'Є': 'e',
        'Ж': 'j',
        'З': 'z',
        'І': 'i',
        'И': 'i',
        'Ї': 'yi',
        'Й': 'y',
        'К': 'k',
        'Л': 'l',
        'М': 'm',
        'Н': 'n',
        'О': 'o',
        'П': 'p',
        'Р': 'r',
        'С': 's',
        'Т': 't',
        'У': 'u',
        'Ф': 'f',
        'Х': 'h',
        'Ц': 'ts',
        'Ч': 'ch',
        'Ш': 'sh',
        'Щ': 'sch',
        'Ъ': '',
        'Ы': 'y',
        'Ь': '',
        'Э': 'e',
        'Ю': 'yu',
        'Я': 'ya',
        'а': 'a',
        'б': 'b',
        'в': 'v',
        'г': 'g',
        'д': 'd',
        'е': 'e',
        'ж': 'j',
        'з': 'z',
        'и': 'i',
        'і': 'i',
        'ї': 'yi',
        'й': 'y',
        'к': 'k',
        'л': 'l',
        'м': 'm',
        'н': 'n',
        'о': 'o',
        'п': 'p',
        'р': 'r',
        'с': 's',
        'т': 't',
        'у': 'u',
        'ф': 'f',
        'х': 'h',
        'ц': 'ts',
        'ч': 'ch',
        'ш': 'sh',
        'щ': 'sch',
        'ъ': 'y',
        'ы': 'y',
        'ь': '',
        'є': 'e',
        'э': 'e',
        'ю': 'yu',
        'я': 'ya',
        ' ': '-',
        '.': '',
        '/': '-',
        '_': '-',
    };

    var result = '';
    for (var i = 0; i < 126; i++) {
        var strChar = string.substr(i, 1);
        if (trChar[strChar]) {
            result += trChar[strChar];
        } else {
            result += strChar;
        }
    }
    return result.replace(/[^A-Za-z0-9_\-]/g, '').toLowerCase();
}
// URL EDIT (Pages & Categories)
$(function() {

    var $autoUrl = $('#autoUrl'),
        $catSelect = $('#catSelect');

    // Transliterate url from title
    $('#transLit').on('click', function() {
        urlAutoTranslit(true);
        editURL();
    });

    // Show full URL & save it to input
    $autoUrl
        .on('change', function() {
            editURL();
        })
        .on('focus', function() {
            if ($(this).val() === '') {
                urlAutoTranslit(true);
            }
            editURL();
        });

    // Toggle slug on parent category change
    $catSelect.on('change', function() {

        clSpcSelect($(this).find('option:selected'));

        $.get(index + 'get_url_slug/' + $(this).val(), function(data) {
            $('#slugSpan').html(data);
            editURL();
        });
    });

    clSpcSelect($catSelect.find('option:selected'));
    clSpcSelect($('#urlIdSelect').find('option:selected'));
});

// Show slug&url & put the url in input after check for copy
function editURL() {

    var $nameInput = $('#autoUrl'),
        $name = $nameInput.val(),
        $oldName = $nameInput.prop('defaultValue'),
        $finUrl = $('#finUrl'),
        $oldUrl = $finUrl.data('oldurl'),
        $slugSpan = $('#slugSpan'),
        url = $slugSpan.html() + $name,
        url_check = {},
        checked;

    // If new url
    if ($name && url !== $oldUrl) {

        url_check = {
            'name': $name,
            'old_url': $oldUrl,
            'url': url
        };

        $.post({
            url: index + 'url_check',
            data: url_check,
            success: function(data) {
                if (data) {
                    checked = JSON.parse(data);
                    $finUrl.val(checked.url);
                    $nameInput.val(checked.name);
                } else {
                    $finUrl.val(url);
                }
            }
        });
    } else {
        $finUrl.val(url);
    }
}

// Select link/ Manual edit
function editItemLnk() {

    var $urlField = $('#urlField'),
        $urlID = $urlField.find('input[name="url_id"]'),
        $link = $urlField.find('input[name="link"]'),
        $anchor = $urlField.find('input[name="anchor"]'),
        $idSelect = $('#urlIdSelect'),
        $linkPreview = $('#linkPreview');

    // Select url from page / manual edit
    $idSelect.on('change', function() {

        var $id = $(this).val(),
            selected = $(this).find('option:selected'),
            text = clSpcSelect(selected),
            link = selected.data('link'),
            title = (text === '---' ? '' : text);

        // Copy page title to item title
        $('input[data-page2title]:first').val(title);

        // Set full link preview & save url_id (for selected page)
        if ($id !== '0') {
            var fin_link = (!selected.data('home') ? (baseUrl + link) : rtrim(baseUrl, '/')),
                anchored = ($anchor.val()) ? '/' + $anchor.val() : '';

            // Show full link
            $linkPreview.val(fin_link + anchored).prop('disabled', true);

            // Set page ID in hidden input
            $urlID.val($id);

            // Make anchor editible
            $anchor.prop('disabled', false);

            // Clear preview & url_id (if empty)
        } else {
            $linkPreview.val('').prop('disabled', false).focus();
            $urlID.val('0');
        }

        $link.val('');
    });

    // Edit anchor
    $anchor.on('keyup', function() {

        var anchor = $(this).val(),
            selected = $idSelect.find('option:selected'),
            link = selected.data('link'),
            finLink = '';

        if (link) {
            finLink = (!selected.data('home')) ? (baseUrl + link) : rtrim(baseUrl, '/');
        }

        if (anchor) {
            finLink = (link) ? finLink + '/' + anchor : anchor;
        }

        $linkPreview.val(finLink);
    });


    // Manual URL edit
    $('#linkChange').on('click', function() {

        $linkPreview.prop('disabled', false).focus();
        $anchor.prop('disabled', true);

        if ($urlID.val() !== '0') {
            $linkPreview.add($anchor).val('');
        }
        $idSelect.add($urlID).val('0');
    });

    // Check manual url & copy it to input & remove url_id
    $linkPreview.on('change', function() {

        var $new_link = $(this).val();

        if ($new_link) {

            if (!chkUrl($new_link)) {
                $linkPreview.addClass('uk-form-danger');
                MechAlert.no('Неправильно вказана адреса');
            } else {
                $linkPreview.removeClass('uk-form-danger');
                $link.val($new_link);
                $urlID.val('0');
            }
        }
    });
}


// Translit title to URL
function urlAutoTranslit(auto) {

    var string = $('input[data-title2url]').val();

    if (string && auto === true) {
        $('#autoUrl').val(translit(string));
    }
    return false;
}