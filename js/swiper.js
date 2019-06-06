(function() {
    var $$ = (function() {
        var Dom7 = function(arr) {
            var _this = this,
                i = 0;
            // Create array-like object
            for (i = 0; i < arr.length; i++) {
                _this[i] = arr[i];
            }
            _this.length = arr.length;
            // Return collection with methods
            return this;
        };
        var $ = function(selector, context) {
            var arr = [],
                i = 0;
            if (selector && !context) {
                if (selector instanceof Dom7) {
                    return selector;
                }
            }
            if (selector) {
                // String
                if (typeof selector === 'string') {
                    var els, tempParent, html = selector.trim();
                    if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
                        var toCreate = 'div';
                        if (html.indexOf('<li') === 0) toCreate = 'ul';
                        if (html.indexOf('<tr') === 0) toCreate = 'tbody';
                        if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
                        if (html.indexOf('<tbody') === 0) toCreate = 'table';
                        if (html.indexOf('<option') === 0) toCreate = 'select';
                        tempParent = document.createElement(toCreate);
                        tempParent.innerHTML = selector;
                        for (i = 0; i < tempParent.childNodes.length; i++) {
                            arr.push(tempParent.childNodes[i]);
                        }
                    } else {
                        if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
                            // Pure ID selector
                            els = [document.getElementById(selector.split('#')[1])];
                        } else {
                            // Other selectors
                            els = (context || document).querySelectorAll(selector);
                        }
                        for (i = 0; i < els.length; i++) {
                            if (els[i]) arr.push(els[i]);
                        }
                    }
                }
                // Node/element
                else if (selector.nodeType || selector === window || selector === document) {
                    arr.push(selector);
                }
                //Array of elements or instance of Dom
                else if (selector.length > 0 && selector[0].nodeType) {
                    for (i = 0; i < selector.length; i++) {
                        arr.push(selector[i]);
                    }
                }
            }
            return new Dom7(arr);
        };
        Dom7.prototype = {
            // Classes and attriutes
            addClass: function(className) {
                if (typeof className === 'undefined') {
                    return this;
                }
                var classes = className.split(' ');
                for (var i = 0; i < classes.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        this[j].classList.add(classes[i]);
                    }
                }
                return this;
            },
            removeClass: function(className) {
                var classes = className.split(' ');
                for (var i = 0; i < classes.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        this[j].classList.remove(classes[i]);
                    }
                }
                return this;
            },
            hasClass: function(className) {
                if (!this[0]) return false;
                else return this[0].classList.contains(className);
            },
            toggleClass: function(className) {
                var classes = className.split(' ');
                for (var i = 0; i < classes.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        this[j].classList.toggle(classes[i]);
                    }
                }
                return this;
            },
            attr: function(attrs, value) {
                if (arguments.length === 1 && typeof attrs === 'string') {
                    // Get attr
                    if (this[0]) return this[0].getAttribute(attrs);
                    else return undefined;
                } else {
                    // Set attrs
                    for (var i = 0; i < this.length; i++) {
                        if (arguments.length === 2) {
                            // String
                            this[i].setAttribute(attrs, value);
                        } else {
                            // Object
                            for (var attrName in attrs) {
                                this[i][attrName] = attrs[attrName];
                                this[i].setAttribute(attrName, attrs[attrName]);
                            }
                        }
                    }
                    return this;
                }
            },
            removeAttr: function(attr) {
                for (var i = 0; i < this.length; i++) {
                    this[i].removeAttribute(attr);
                }
                return this;
            },
            data: function(key, value) {
                if (typeof value === 'undefined') {
                    // Get value
                    if (this[0]) {
                        var dataKey = this[0].getAttribute('data-' + key);
                        if (dataKey) return dataKey;
                        else if (this[0].dom7ElementDataStorage && (key in this[0].dom7ElementDataStorage)) return this[0].dom7ElementDataStorage[key];
                        else return undefined;
                    } else return undefined;
                } else {
                    // Set value
                    for (var i = 0; i < this.length; i++) {
                        var el = this[i];
                        if (!el.dom7ElementDataStorage) el.dom7ElementDataStorage = {};
                        el.dom7ElementDataStorage[key] = value;
                    }
                    return this;
                }
            },
            // Transforms
            transform: function(transform) {
                for (var i = 0; i < this.length; i++) {
                    var elStyle = this[i].style;
                    elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
                }
                return this;
            },
            transition: function(duration) {
                if (typeof duration !== 'string') {
                    duration = duration + 'ms';
                }
                for (var i = 0; i < this.length; i++) {
                    var elStyle = this[i].style;
                    elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
                }
                return this;
            },
            //Events
            on: function(eventName, targetSelector, listener, capture) {
                function handleLiveEvent(e) {
                    var target = e.target;
                    if ($(target).is(targetSelector)) listener.call(target, e);
                    else {
                        var parents = $(target).parents();
                        for (var k = 0; k < parents.length; k++) {
                            if ($(parents[k]).is(targetSelector)) listener.call(parents[k], e);
                        }
                    }
                }
                var events = eventName.split(' ');
                var i, j;
                for (i = 0; i < this.length; i++) {
                    if (typeof targetSelector === 'function' || targetSelector === false) {
                        // Usual events
                        if (typeof targetSelector === 'function') {
                            listener = arguments[1];
                            capture = arguments[2] || false;
                        }
                        for (j = 0; j < events.length; j++) {
                            this[i].addEventListener(events[j], listener, capture);
                        }
                    } else {
                        //Live events
                        for (j = 0; j < events.length; j++) {
                            if (!this[i].dom7LiveListeners) this[i].dom7LiveListeners = [];
                            this[i].dom7LiveListeners.push({ listener: listener, liveListener: handleLiveEvent });
                            this[i].addEventListener(events[j], handleLiveEvent, capture);
                        }
                    }
                }

                return this;
            },
            off: function(eventName, targetSelector, listener, capture) {
                var events = eventName.split(' ');
                for (var i = 0; i < events.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        if (typeof targetSelector === 'function' || targetSelector === false) {
                            // Usual events
                            if (typeof targetSelector === 'function') {
                                listener = arguments[1];
                                capture = arguments[2] || false;
                            }
                            this[j].removeEventListener(events[i], listener, capture);
                        } else {
                            // Live event
                            if (this[j].dom7LiveListeners) {
                                for (var k = 0; k < this[j].dom7LiveListeners.length; k++) {
                                    if (this[j].dom7LiveListeners[k].listener === listener) {
                                        this[j].removeEventListener(events[i], this[j].dom7LiveListeners[k].liveListener, capture);
                                    }
                                }
                            }
                        }
                    }
                }
                return this;
            },
            once: function(eventName, targetSelector, listener, capture) {
                var dom = this;
                if (typeof targetSelector === 'function') {
                    targetSelector = false;
                    listener = arguments[1];
                    capture = arguments[2];
                }

                function proxy(e) {
                    listener(e);
                    dom.off(eventName, targetSelector, proxy, capture);
                }
                dom.on(eventName, targetSelector, proxy, capture);
            },
            trigger: function(eventName, eventData) {
                for (var i = 0; i < this.length; i++) {
                    var evt;
                    try {
                        evt = new window.CustomEvent(eventName, { detail: eventData, bubbles: true, cancelable: true });
                    } catch (e) {
                        evt = document.createEvent('Event');
                        evt.initEvent(eventName, true, true);
                        evt.detail = eventData;
                    }
                    this[i].dispatchEvent(evt);
                }
                return this;
            },
            transitionEnd: function(callback) {
                var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
                    i, j, dom = this;

                function fireCallBack(e) {
                    /*jshint validthis:true */
                    if (e.target !== this) return;
                    callback.call(this, e);
                    for (i = 0; i < events.length; i++) {
                        dom.off(events[i], fireCallBack);
                    }
                }
                if (callback) {
                    for (i = 0; i < events.length; i++) {
                        dom.on(events[i], fireCallBack);
                    }
                }
                return this;
            },
            // Sizing/Styles
            width: function() {
                if (this[0] === window) {
                    return window.innerWidth;
                } else {
                    if (this.length > 0) {
                        return parseFloat(this.css('width'));
                    } else {
                        return null;
                    }
                }
            },
            outerWidth: function(includeMargins) {
                if (this.length > 0) {
                    if (includeMargins)
                        return this[0].offsetWidth + parseFloat(this.css('margin-right')) + parseFloat(this.css('margin-left'));
                    else
                        return this[0].offsetWidth;
                } else return null;
            },
            height: function() {
                if (this[0] === window) {
                    return window.innerHeight;
                } else {
                    if (this.length > 0) {
                        return parseFloat(this.css('height'));
                    } else {
                        return null;
                    }
                }
            },
            outerHeight: function(includeMargins) {
                if (this.length > 0) {
                    if (includeMargins)
                        return this[0].offsetHeight + parseFloat(this.css('margin-top')) + parseFloat(this.css('margin-bottom'));
                    else
                        return this[0].offsetHeight;
                } else return null;
            },
            offset: function() {
                if (this.length > 0) {
                    var el = this[0];
                    var box = el.getBoundingClientRect();
                    var body = document.body;
                    var clientTop = el.clientTop || body.clientTop || 0;
                    var clientLeft = el.clientLeft || body.clientLeft || 0;
                    var scrollTop = window.pageYOffset || el.scrollTop;
                    var scrollLeft = window.pageXOffset || el.scrollLeft;
                    return {
                        top: box.top + scrollTop - clientTop,
                        left: box.left + scrollLeft - clientLeft
                    };
                } else {
                    return null;
                }
            },
            css: function(props, value) {
                var i;
                if (arguments.length === 1) {
                    if (typeof props === 'string') {
                        if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
                    } else {
                        for (i = 0; i < this.length; i++) {
                            for (var prop in props) {
                                this[i].style[prop] = props[prop];
                            }
                        }
                        return this;
                    }
                }
                if (arguments.length === 2 && typeof props === 'string') {
                    for (i = 0; i < this.length; i++) {
                        this[i].style[props] = value;
                    }
                    return this;
                }
                return this;
            },

            //Dom manipulation
            each: function(callback) {
                for (var i = 0; i < this.length; i++) {
                    callback.call(this[i], i, this[i]);
                }
                return this;
            },
            html: function(html) {
                if (typeof html === 'undefined') {
                    return this[0] ? this[0].innerHTML : undefined;
                } else {
                    for (var i = 0; i < this.length; i++) {
                        this[i].innerHTML = html;
                    }
                    return this;
                }
            },
            text: function(text) {
                if (typeof text === 'undefined') {
                    if (this[0]) {
                        return this[0].textContent.trim();
                    } else return null;
                } else {
                    for (var i = 0; i < this.length; i++) {
                        this[i].textContent = text;
                    }
                    return this;
                }
            },
            is: function(selector) {
                if (!this[0]) return false;
                var compareWith, i;
                if (typeof selector === 'string') {
                    var el = this[0];
                    if (el === document) return selector === document;
                    if (el === window) return selector === window;

                    if (el.matches) return el.matches(selector);
                    else if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
                    else if (el.mozMatchesSelector) return el.mozMatchesSelector(selector);
                    else if (el.msMatchesSelector) return el.msMatchesSelector(selector);
                    else {
                        compareWith = $(selector);
                        for (i = 0; i < compareWith.length; i++) {
                            if (compareWith[i] === this[0]) return true;
                        }
                        return false;
                    }
                } else if (selector === document) return this[0] === document;
                else if (selector === window) return this[0] === window;
                else {
                    if (selector.nodeType || selector instanceof Dom7) {
                        compareWith = selector.nodeType ? [selector] : selector;
                        for (i = 0; i < compareWith.length; i++) {
                            if (compareWith[i] === this[0]) return true;
                        }
                        return false;
                    }
                    return false;
                }

            },
            index: function() {
                if (this[0]) {
                    var child = this[0];
                    var i = 0;
                    while ((child = child.previousSibling) !== null) {
                        if (child.nodeType === 1) i++;
                    }
                    return i;
                } else return undefined;
            },
            eq: function(index) {
                if (typeof index === 'undefined') return this;
                var length = this.length;
                var returnIndex;
                if (index > length - 1) {
                    return new Dom7([]);
                }
                if (index < 0) {
                    returnIndex = length + index;
                    if (returnIndex < 0) return new Dom7([]);
                    else return new Dom7([this[returnIndex]]);
                }
                return new Dom7([this[index]]);
            },
            append: function(newChild) {
                var i, j;
                for (i = 0; i < this.length; i++) {
                    if (typeof newChild === 'string') {
                        var tempDiv = document.createElement('div');
                        tempDiv.innerHTML = newChild;
                        while (tempDiv.firstChild) {
                            this[i].appendChild(tempDiv.firstChild);
                        }
                    } else if (newChild instanceof Dom7) {
                        for (j = 0; j < newChild.length; j++) {
                            this[i].appendChild(newChild[j]);
                        }
                    } else {
                        this[i].appendChild(newChild);
                    }
                }
                return this;
            },
            prepend: function(newChild) {
                var i, j;
                for (i = 0; i < this.length; i++) {
                    if (typeof newChild === 'string') {
                        var tempDiv = document.createElement('div');
                        tempDiv.innerHTML = newChild;
                        for (j = tempDiv.childNodes.length - 1; j >= 0; j--) {
                            this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
                        }
                        // this[i].insertAdjacentHTML('afterbegin', newChild);
                    } else if (newChild instanceof Dom7) {
                        for (j = 0; j < newChild.length; j++) {
                            this[i].insertBefore(newChild[j], this[i].childNodes[0]);
                        }
                    } else {
                        this[i].insertBefore(newChild, this[i].childNodes[0]);
                    }
                }
                return this;
            },
            insertBefore: function(selector) {
                var before = $(selector);
                for (var i = 0; i < this.length; i++) {
                    if (before.length === 1) {
                        before[0].parentNode.insertBefore(this[i], before[0]);
                    } else if (before.length > 1) {
                        for (var j = 0; j < before.length; j++) {
                            before[j].parentNode.insertBefore(this[i].cloneNode(true), before[j]);
                        }
                    }
                }
            },
            insertAfter: function(selector) {
                var after = $(selector);
                for (var i = 0; i < this.length; i++) {
                    if (after.length === 1) {
                        after[0].parentNode.insertBefore(this[i], after[0].nextSibling);
                    } else if (after.length > 1) {
                        for (var j = 0; j < after.length; j++) {
                            after[j].parentNode.insertBefore(this[i].cloneNode(true), after[j].nextSibling);
                        }
                    }
                }
            },
            next: function(selector) {
                if (this.length > 0) {
                    if (selector) {
                        if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) return new Dom7([this[0].nextElementSibling]);
                        else return new Dom7([]);
                    } else {
                        if (this[0].nextElementSibling) return new Dom7([this[0].nextElementSibling]);
                        else return new Dom7([]);
                    }
                } else return new Dom7([]);
            },
            nextAll: function(selector) {
                var nextEls = [];
                var el = this[0];
                if (!el) return new Dom7([]);
                while (el.nextElementSibling) {
                    var next = el.nextElementSibling;
                    if (selector) {
                        if ($(next).is(selector)) nextEls.push(next);
                    } else nextEls.push(next);
                    el = next;
                }
                return new Dom7(nextEls);
            },
            prev: function(selector) {
                if (this.length > 0) {
                    if (selector) {
                        if (this[0].previousElementSibling && $(this[0].previousElementSibling).is(selector)) return new Dom7([this[0].previousElementSibling]);
                        else return new Dom7([]);
                    } else {
                        if (this[0].previousElementSibling) return new Dom7([this[0].previousElementSibling]);
                        else return new Dom7([]);
                    }
                } else return new Dom7([]);
            },
            prevAll: function(selector) {
                var prevEls = [];
                var el = this[0];
                if (!el) return new Dom7([]);
                while (el.previousElementSibling) {
                    var prev = el.previousElementSibling;
                    if (selector) {
                        if ($(prev).is(selector)) prevEls.push(prev);
                    } else prevEls.push(prev);
                    el = prev;
                }
                return new Dom7(prevEls);
            },
            parent: function(selector) {
                var parents = [];
                for (var i = 0; i < this.length; i++) {
                    if (selector) {
                        if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
                    } else {
                        parents.push(this[i].parentNode);
                    }
                }
                return $($.unique(parents));
            },
            parents: function(selector) {
                var parents = [];
                for (var i = 0; i < this.length; i++) {
                    var parent = this[i].parentNode;
                    while (parent) {
                        if (selector) {
                            if ($(parent).is(selector)) parents.push(parent);
                        } else {
                            parents.push(parent);
                        }
                        parent = parent.parentNode;
                    }
                }
                return $($.unique(parents));
            },
            find: function(selector) {
                var foundElements = [];
                for (var i = 0; i < this.length; i++) {
                    var found = this[i].querySelectorAll(selector);
                    for (var j = 0; j < found.length; j++) {
                        foundElements.push(found[j]);
                    }
                }
                return new Dom7(foundElements);
            },
            children: function(selector) {
                var children = [];
                for (var i = 0; i < this.length; i++) {
                    var childNodes = this[i].childNodes;

                    for (var j = 0; j < childNodes.length; j++) {
                        if (!selector) {
                            if (childNodes[j].nodeType === 1) children.push(childNodes[j]);
                        } else {
                            if (childNodes[j].nodeType === 1 && $(childNodes[j]).is(selector)) children.push(childNodes[j]);
                        }
                    }
                }
                return new Dom7($.unique(children));
            },
            remove: function() {
                for (var i = 0; i < this.length; i++) {
                    if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
                }
                return this;
            },
            add: function() {
                var dom = this;
                var i, j;
                for (i = 0; i < arguments.length; i++) {
                    var toAdd = $(arguments[i]);
                    for (j = 0; j < toAdd.length; j++) {
                        dom[dom.length] = toAdd[j];
                        dom.length++;
                    }
                }
                return dom;
            }
        };
        $.fn = Dom7.prototype;
        $.unique = function(arr) {
            var unique = [];
            for (var i = 0; i < arr.length; i++) {
                if (unique.indexOf(arr[i]) === -1) unique.push(arr[i]);
            }
            return unique;
        };

        return $;
    })();

    /**
     * @Author   swiper
     * @desc     轮播图插件
     */
    var Swiper = function(container, options) {
        if (!container) { return; }
        var opt = options || {};
        this.container = $$(container); // 包裹标签 
        this.wrapper = this.container.find('.swiper-wrapper'); // slide 外标签
        this.slides = this.container.find('.swiper-wrapper').children('.swiper-slide'); // slide 集合
        this.prevButton = this.container.children('.swiper-button-prev');
        this.nextButton = this.container.children('.swiper-button-next');
        if (this.container.length <= 0 || this.wrapper <= 0 || this.slides <= 0) {
            return;
        }
        this.pagination = $$(opt.pagination || ''); // 分页器容器的css选择器或HTML标签。分页器等组件可以置于container之外
        // 可改变属性 默认通过options对象传进
        this.direction = opt.direction || 'horizontal'; // 可设置水平(horizontal)或垂直(vertical)
        this.speed = opt.speed === undefined ? 300 : opt.speed; // 滑动速度，默认300ms 即slider自动滑动开始到结束的时间（单位ms），也是触摸滑动时释放至贴合的时间。
        this.autoplay = opt.autoplay === undefined ? false : opt.autoplay; // 自动切换的时间间隔（单位ms），不设定该参数slide不会自动切换
        this.autoplayDisableOnInteraction = opt.autoplayDisableOnInteraction === undefined ? true : opt.autoplayDisableOnInteraction; // 用户操作swiper之后，是否禁止autoplay。默认为true：停止。
        this.freeMode = opt.freeMode === undefined ? false : opt.freeMode; // 默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合 为true时 loop失效
        this.slidesPerView = opt.slidesPerView || 1; // 设置slider容器能够同时显示的slides数量(carousel模式)。'auto'则自动根据slides的宽度来设定数量
        this.loop = opt.loop === undefined ? false : opt.loop; //设置为true 则开启loop模式。loop模式：会在原本slide前后复制若干个slide(默认一个)并在合适的时候切换，让Swiper看起来是循环的。 
        this.activeIndex = 0; // 返回当前活动块(激活块)的索引。loop模式下注意该值会被加上复制的slide数。
        this.realIndex = opt.initialSlide || 0; // 当前活动块的索引，与activeIndex不同的是，在loop模式下不会将复制的块的数量计算在内。
        this.clickedIndex = 0; // 返回最后点击Slide的索引。(click)
        this.clickedSlide = null; // 返回最后点击的Slide(HTML元素)。
        this.bounce = opt.bounce === undefined ? true : opt.bounce; //是否启用弹力动画效果，关掉可以加速 默认为true
        this.paginationClickable = opt.paginationClickable === undefined ? false : opt.paginationClickable; // 此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
        this.spaceBetween = opt.spaceBetween === undefined ? 0 : opt.spaceBetween; // slide之间的距离（单位px） 默认为0
        this.slideToClickedSlide = opt.slideToClickedSlide === undefined ? false : opt.slideToClickedSlide; // 设置为true则点击slide会过渡到这个slide。
        this.onInit = opt.onInit || null; // 回调函数，初始化后执行。参数为Swiper
        this.onTouchStart = opt.onTouchStart || null; // 回调函数，当碰触到slider时执行。可选Swiper和touchstart事件作为参数
        this.onTouchMove = opt.onTouchMove || null; // 回调函数，手指触碰Swiper并滑动（手指）时执行 可选Swiper和touchstart事件作为参数
        this.onTouchEnd = opt.onTouchEnd || null; // 回调函数，当释放slider时执行。（释放即执行）可选Swiper和touchstart事件作为参数
        this.onSlideChangeStart = opt.onSlideChangeStart || null; // 回调函数，swiper从当前slide开始过渡到另一个slide时执行。触摸情况下，如果释放slide时没有达到过渡条件而回弹时不会触发这个函数
        this.onTransitionStart = opt.onTransitionStart || null; // 回调函数，过渡开始时触发，接受Swiper实例作为参数。
        this.onTransitionEnd = opt.onTransitionEnd || null; // 回调函数，过渡结束时触发，接收Swiper实例作为参数。
        this.onClick = opt.onClick || null; // 调函数，当你点击或轻触Swiper 300ms后执行。
        this.onTap = opt.onTap || null; // 回调函数，当你轻触(tap)Swiper后执行。在移动端，click会有 200~300 ms延迟，所以请用tap代替click作为点击事件。
        this.control = opt.control || null;
        // 存储属性 一般不可通过外部传入或者通过对象修改
        this.touchType = null; // 滑动类型 1:右滑动  2: 上滑动   3: 下滑动   4: 左滑动
        this.isTouch = false; // 是否滑动触发
        this.isMove = false; // 动画是否在执行中
        this.x = 0; // 记录当前滑动的x轴距离
        this.y = 0; // 记录当前滑动的y轴距离
        this.startPointX = 0; // 按下的x轴坐标
        this.startPointY = 0; // 按下的y轴坐标
        this.endPointX = 0; // 松开以及移动的x轴坐标
        this.endPointX = 0; // 松开以及移动的y轴坐标
        this.moveX = 0; // 从按下到松开拖动x轴的距离
        this.moveY = 0; // 从按下到松开拖动y轴的距离
        this.minPullTime = 50; // 满足按下时间在某个范围 才会执行
        this.pullTime = 200; // 满足按下时间在某个范围 才会执行
        this.minPullDis = 10; // 拉动距离如果不在某个时间范围 就看拉动距离是否大于20
        this.maxPullDis = 60; // 拉动距离如果不在某个时间范围 就看拉动距离是否大于一半
        this.pullScrollDis = 10; // 拉动距离要大于20才会执行freeMode 滚动
        this.transitionendTimer = null; // 动画完成的定时器
        this.autoplayTimer = null; //自动播放定时器
        this.startTime = null; // 记录按下的时间
        this.endTime = null; // 记录松开的时间
        this.swipeBounceTime = 300; // 滑动滚动回弹时间
        this.slideLen = this.slides.length; // 记录slide 的长度
        this.total = 0; // 轮播图总数
        this.loopLen = 1; // 无缝滚动增加的个数
        this.transtionEndType = 1; // 动画结束的类型 1: slide滑动结束类型 2:滑动滚动结束执行
        this.transitionendNum = 0; // 防止多次触发 拖动滑动
        this.moveIsInit = false; // 滑动事件是否执行了 作用是只在滑动事件里面执行一次
        this.isTouchDown = false; // 是否按下的标志
        this.transtionEndFalg = false; // 动画执行完是否放行的标志 防止多次触发
        this.transtionEndCallback = null; // 动画结束的回调函数
        this.paginationLen = this.slides.length; // pagination 的长度
        this.events = {
            MIBLE: {
                click: 'touchstart',
                start: 'touchstart',
                move: 'touchmove',
                end: 'touchend'
            },
            PC: {
                click: 'click',
                start: 'mousedown',
                move: 'mousemove',
                end: 'mouseup'
            }
        }
        this.classNameList = {
            horizontal: 'swiper-container-horizontal', // 水平类名
            vertical: 'swiper-container-vertical', // 垂直类名
            slideActive: 'swiper-slide-active', // 当前激活的类名
            slideCopy: 'swiper-slide-copy', // 当前激活的类名
            pagination: 'swiper-pagination-bullet', // 点的类名
            paginationActive: 'swiper-pagination-active',
            swiperButtonDisabled: 'swiper-button-disabled'
        }
        this._init();
        this._bindEvent();
    }

    Swiper.prototype = {
        // 初始化
        _init: function() {
            var self = this;
            // 如果是无缝合模式 无缝滚动失效
            if (this.freeMode) {
                this.loop = false;
            }
            // 轮播图个数
            this.total = this.slideLen;
            // 判断是否自动宽高
            if (this.slidesPerView !== 'auto') {
                this.slides.each(function(index, el) {
                    if (self.spaceBetween > 0) {
                        self.setBetween($$(el), self.spaceBetween);
                    }
                    var wid = self.getWH(self.container) / self.slidesPerView;
                    self.setWH($$(el), self.toFixed(wid, 2));
                });
            } else {
                this.slides.each(function(index, el) {
                    if (self.spaceBetween > 0) {
                        self.setBetween($$(el), self.spaceBetween);
                    }
                });
            }
            // 如果wrapper累计宽高没有container的大 loop 失效
            if (this.countWH(0, this.slideLen) <= this.getWH(this.container)) {
                this.loop = false;
            }

            // 是否开启了pagination
            var paginationHtml = '';
            if (this.pagination.length > 0) {
                if (!this.loop && !this.freeMode) {
                    for (var i = 0; i < this.slideLen; i++) {
                        if (-this.countWH(0, i) <= this.maxTranslate()) {
                            this.paginationLen = i + 1;
                            break;
                        }
                    }
                }
                for (var j = 0; j < this.paginationLen; j++) {
                    paginationHtml += '<span class="' + this.classNameList.pagination + '" pagination-index="' + j + '"></span>';
                }
            }
            this.pagination.append(paginationHtml);

            // 无缝滚动处理
            if (this.loop) {
                if (this.slidesPerView === 'auto') {
                    for (var i = 0; i < this.slideLen; i++) {
                        this.wrapper.prepend($$(this.slides[this.slideLen - 1 - i].cloneNode(true)).addClass(this.classNameList.slideCopy));
                        this.wrapper.append($$(this.slides[i].cloneNode(true)).addClass(this.classNameList.slideCopy));
                    }
                    this.loopLen = this.slideLen;
                } else if (this.slidesPerView > 1) {
                    for (var i = 0; i < this.slidesPerView; i++) {
                        this.wrapper.prepend($$(this.slides[this.slideLen - 1 - i].cloneNode(true)).addClass(this.classNameList.slideCopy));
                        this.wrapper.append($$(this.slides[i].cloneNode(true)).addClass(this.classNameList.slideCopy));
                    }
                    this.loopLen = this.slidesPerView;
                } else {
                    this.wrapper.prepend($$(this.slides[this.slideLen - 1].cloneNode(true)).addClass(this.classNameList.slideCopy));
                    this.wrapper.append($$(this.slides[0].cloneNode(true)).addClass(this.classNameList.slideCopy));
                    this.loopLen = 1;
                }
                // 同步一下 slides 和 slides 的长度
                this.slides = this.container.find('.swiper-wrapper').children('.swiper-slide'); // slide 集合
                this.slideLen = this.slides.length;
            } else {
                this.loopLen = 0;
            }
            // 检测索引范围
            this.checkRealIndex();
            // 初始化索引
            this.activeIndex = this.realIndex + this.loopLen;
            // 检测索引范围
            this.checkActiveIndex();
            // 根据垂直或者水平添加类名
            if (this.isHorizontal()) {
                this.container.addClass(this.classNameList.horizontal);
            } else {
                this.container.addClass(this.classNameList.vertical);
            }
            // 初始化类名
            this.setClassActive();
            // 设置轮播图宽高
            this.setWH(this.wrapper, this.countWH(0, this.slideLen, true));
            // 设置当前活动块
            this.setTranslate(-this.countWH(0, this.activeIndex));
            // 同步当前滑动的距离
            this.syncTranslate();
            // 如果是自动播放
            if (this.autoplay) {
                this.startAutoplay();
            }
            // 执行初始化后的回调函数 通过参数传入
            this.onInit && this.onInit(this);
        },
        // 绑定事件
        _bindEvent: function() {
            var self = this;

            // 点击点滑动到对应的slide
            if (this.paginationClickable) {
                this.pagination.children('.' + this.classNameList.pagination).on(this.getEventName('click'), function(e) {
                    self.slideTo($$(this).index());
                })
            }
            var onTouchStart, onTouchMove, onTouchEnd;
            // 按下执行
            onTouchStart = function(ev) {
                //记录按下的时间
                var e = ev.event || window.event;
                self.moveIsInit = false;
                self.isTouchDown = true;
                // 执行回调函数
                self.onTouchStart && self.onTouchStart(self, e);
                // 按下清除自动播放
                self.stopTmpAutoplay();
                // 记录按下的时间
                self.startTime = new Date().getTime();
                // 获取坐标
                var page = self.getPage(e, 1);
                self.startPointX = page.x;
                self.startPointY = page.y;
                // 设置过渡时间为0
                self.setTransition(0);
                // 同步当前滑动的距离
                self.syncTranslate();
                // 按下设置一下当前的距离
                self.setTranslate(self.getTranslate());
                if (e.type !== 'touchstart') {
                    e.preventDefault();
                }
            };
            // 移动执行
            onTouchMove = function(ev) {
                if (!self.isTouchDown) { return };
                var e = ev.event || window.event;
                // 执行回调函数
                self.onTouchMove && self.onTouchMove(self, e);
                // 保存移动的坐标
                var page = self.getPage(e, 2);
                self.endPointX = page.x;
                self.endPointY = page.y;
                // 算出从按下点到移动的距离
                self.moveX = self.endPointX - self.startPointX;
                self.moveY = self.endPointY - self.startPointY;
                if (!self.moveIsInit) {
                    self.moveIsInit = true;
                    self.updateLoopActiveIndx();
                }
                // 算出滑动方向
                self.touchType = self.getDirection(self.moveX, self.moveY);
                if (self.isHorizontal()) {
                    // 如果是左滑动和右滑动执行
                    if (self.touchType == 3 || self.touchType == 4) {
                        if ((self.touchType == 4 && self.getTranslate() >= self.minTranslate()) ||
                            (self.touchType == 3 && self.getTranslate() > self.minTranslate()) ||
                            (self.touchType == 3 && self.getTranslate() <= self.maxTranslate()) ||
                            (self.touchType == 4 && self.getTranslate() < self.maxTranslate())
                        ) {
                            self.setTranslate(self.moveX / 2 + self.getTranslate());
                        } else {
                            self.setTranslate(self.moveX + self.getTranslate());
                        }
                    }
                } else {
                    // 如果是上滑动和下滑动执行
                    if (self.touchType == 1 || self.touchType == 2) {
                        if ((self.touchType == 2 && self.getTranslate() >= self.minTranslate()) ||
                            (self.touchType == 1 && self.getTranslate() > self.minTranslate()) ||
                            (self.touchType == 1 && self.getTranslate() <= self.maxTranslate()) ||
                            (self.touchType == 2 && self.getTranslate() < self.maxTranslate())
                        ) {
                            self.setTranslate(self.moveY / 2 + self.getTranslate());
                        } else {
                            self.setTranslate(self.moveY + self.getTranslate());
                        }
                    }
                }
                if (e.type !== 'touchmove') {
                    e.preventDefault();
                }
            };
            // 松开执行
            onTouchEnd = function(ev) {
                var e = ev.event || window.event;
                self.moveIsInit = false;
                self.isTouchDown = false;
                // 执行回调函数
                self.onTouchEnd && self.onTouchEnd(self, e);
                // 保存松开的坐标
                var page = self.getPage(e, 3);
                self.endPointX = page.x;
                self.endPointY = page.y;
                self.moveX = self.endPointX - self.startPointX;
                self.moveY = self.endPointY - self.startPointY;
                // 记录松开的时间
                self.endTime = new Date().getTime();
                // 滑动操作
                if ((Math.abs(self.moveX) > 1 && self.isHorizontal() || Math.abs(self.moveY) > 1 && !self.isHorizontal())) {
                    // 执行松开操作
                    if (self.freeMode) { // 如果是无缝合模式
                        self._scrollTo();
                    } else {
                        self.isTouch = true;
                        // 同步当前滑动的距离
                        self.syncTranslate();
                        // 更新拖动的索引 只有是滑动触发才会经过方法判断
                        self.updateTouchActiveIndex();
                        // 检测索引范围
                        self.checkActiveIndex();
                        // 检测索引范围
                        self._slideTo();
                    }
                } else { // 点击操作
                    if (self.clickedSlide) {
                        var index = self.clickedSlide.index();
                        self.clickedIndex = index;
                        self.onTap && self.onTap(self);
                        // slideToClickedSlide  点击对应slide滑到对应的地方
                        if (self.slideToClickedSlide) {
                            var len = index - self.activeIndex;
                            self.activeIndex = index;
                            if (self.loop && self.slideToClickedSlide) {
                                self.setTransition(0);
                                if (self.activeIndex > self.slideLen - self.loopLen) { // 如果是倒数第一个 拉到第一个
                                    self.activeIndex = self.loopLen - (self.slideLen - self.activeIndex) + self.loopLen - len;
                                    self.setTranslate(-self.countWH(0, self.activeIndex), self._transtionEnd.bind(self));
                                    for (var i = 0; i < len; i++) {
                                        self.activeIndex++;
                                    }
                                    self.syncTranslate();
                                }
                            }
                            self.slideTo();
                        }
                    }
                }
                if (e.type !== 'touchend') {
                    e.preventDefault();
                }
            }
            // 按下 保存当前点击的元素
            this.wrapper.on(this.getEventName('start'), '.swiper-slide', function(ev) {
                self.clickedSlide = $$(this);
                self.maxPullDis = Math.round(self.getWH(self.clickedSlide) / 2);
            })
            // 按下 移动 松开
            this.wrapper.on(this.getEventName('start'), onTouchStart);
            this.wrapper.on(this.getEventName('end'), onTouchEnd);
            this.wrapper.on(this.getEventName('move'), onTouchMove);

            // 点击存在300ms 延迟
            this.wrapper.on('click', '.swiper-slide', function(e) {
                var el = self.clickedSlide !== null ? self.clickedSlide : $$(this);
                self.clickedIndex = el.index();
                self.onClick && self.onClick(self);
            });

            // 是否存在上一个，下一个按钮
            if (this.prevButton.length > 0) {
                this.prevButton.on(this.getEventName('end'), function(e) {
                    if (!$$(this).hasClass(self.classNameList.swiperButtonDisabled)) {
                        self.slidePrev();
                    }
                    e.preventDefault();
                })
            }
            if (this.nextButton.length > 0) {
                this.nextButton.on(this.getEventName('end'), function(e) {
                    if (!$$(this).hasClass(self.classNameList.swiperButtonDisabled)) {
                        self.slideNext();
                    }
                    e.preventDefault();
                })
            }
        },
        // 无缝合模式 
        _scrollTo: function() {
            // 拖动满足大于pullScrollDis 并且时间大于minPullTime
            if ((Math.abs(this.moveX) > this.pullScrollDis && this.isHorizontal() || Math.abs(this.moveY) > this.pullScrollDis && !this.isHorizontal()) && this.endTime - this.startTime > this.minPullTime) {
                this.isTouch = true;
                this.transtionEndType = 2;
                this.transtionEndFalg = true;
                this.transitionendNum = 0;
                var translate = this.getTranslate();
                // 检测临界值
                if (this.restTranslate()) {
                    return;
                }
                var momentum = this.momentum(this.getTranslate(), translate, this.endTime - this.startTime, this.getWH(this.container) - this.countWH(0, this.slideLen), this.bounce ? this.getWH(this.container) : 0);
                translate = momentum.destination;
                duration = Math.min(1000, Math.max(200, momentum.duration));
                this.swipeBounceTime = duration;
                this.setTransition(duration);
                this.setTranslate(translate);
                // 监听动画完成后回调
                this._transtionEnd();
            }
        },
        // 滑动到对应的slide
        _slideTo: function() {
            // 设置过渡时间
            this.setTransition(this.speed);
            // 同步当前滑动的距离
            this.syncTranslate();
            this.transtionEndType = 1;
            this.transtionEndFalg = true;
            this.isMove = true;
            // 执行回调函数
            this.onTransitionStart && this.onTransitionStart(this);
            if (this.freeMode && this.slideToClickedSlide) {
                var translate = null;
                var swiperItemWH = this.getWH(this.slides.eq(this.activeIndex)) / 2;
                var containerWH = this.getWH(this.container) / 2;
                if (this.countWH(0, this.activeIndex) + swiperItemWH > containerWH) {
                    translate = -(this.countWH(0, this.activeIndex) - containerWH + swiperItemWH);
                } else {
                    translate = this.minTranslate();
                }
                if (this.getTranslate() < this.maxTranslate() || translate && translate < this.maxTranslate() || this.activeIndex == this.slideLen - 1) {
                    translate = this.maxTranslate();
                }
                if (this.countWH(0, this.slideLen) <= this.getWH(this.container) || translate && translate > this.minTranslate() || this.getTranslate() > this.minTranslate() || this.activeIndex == 0) {
                    translate = this.minTranslate();
                }
                // 同步 realIndex
                this.syncRealIndex();
                // 执行回调函数
                this.onSlideChangeStart && this.onSlideChangeStart(this);
                if (translate !== null) {
                    // 双向控制
                    this.controlMethods();
                    this.setTranslate(translate);
                }
            } else {
                // 检测临界值
                if (this.restTranslate()) {
                    this.controlMethods();
                    return;
                }
                // 同步 realIndex
                this.syncRealIndex();
                // 执行回调函数
                this.onSlideChangeStart && this.onSlideChangeStart(this);
                // 双向控制
                this.controlMethods();
                this.setTranslate(-this.countWH(0, this.activeIndex));
            }
            // 监听动画完成后回调
            this._transtionEnd();
            // 激活当前块的类名
            this.setClassActive();
        },
        // 双向控制方法
        controlMethods: function(translate) {
            if (this.control) {
                if (Object.prototype.toString.call(this.control) === '[object Array]') {
                    for (var i = 0; i < this.control.length; i++) {
                        if (translate === undefined) {
                            this.control[i].slideTo(this.activeIndex);
                        } else {
                            this.control[i].setTransition(0);
                            this.control[i].setWrapperTranslate(translate);
                        }
                    }
                } else {
                    if (translate === undefined) {
                        this.control.slideTo(this.activeIndex);
                    } else {
                        this.control.setTransition(0);
                        this.control.setWrapperTranslate(translate);
                    }
                }
            }
        },
        // 对外提供设置slide的方法
        slideTo: function(index, cb) {
            if (this.isMove) { return; }
            // 如果要根据索引设置slide
            if (index !== undefined && !isNaN(index)) {
                this.activeIndex = index;
            }
            // 检测索引范围
            this.checkActiveIndex();
            // 按下清除自动播放
            this.isTouch = false;
            this.touchType = null;
            this.stopTmpAutoplay();
            this.transtionEndCallback = cb ? cb : null;
            this._slideTo();
        },
        // next
        slideNext: function(cb) {
            if (this.isMove) { return; }
            this.isTouch = false;
            this.touchType = null;
            this.updateLoopActiveIndx();
            this.activeIndex++;
            // 检测索引范围
            this.checkActiveIndex();
            // 清除自动播放
            this.stopTmpAutoplay();
            this.transtionEndCallback = cb ? cb : null;
            this._slideTo();
        },
        slidePrev: function(cb) {
            if (this.isMove) { return; }
            this.isTouch = false;
            this.touchType = null;
            this.updateLoopActiveIndx();
            this.activeIndex--;
            // 检测索引范围
            this.checkActiveIndex();
            this.stopTmpAutoplay();
            this.transtionEndCallback = cb ? cb : null;
            this._slideTo();
        },
        // 动画完成执行
        _transtionEnd: function() {
            if (!this.transtionEndFalg) { return; }
            var self = this;
            this.transtionEndFalg = false;
            clearTimeout(this.transitionendTimer);
            var duration = self.transtionEndType === 1 ? self.speed : self.swipeBounceTime;
            this.transitionendTimer = setTimeout(function() {
                clearTimeout(self.transitionendTimer)
                self.isMove = false;
                self.touchType = null;
                self.isTouch = false;
                self.setTransition(0);
                // 如果是自动播放 操作后继续自动播放 并且自动播放目前处于停止状态
                if (self.autoplay && !self.autoplayDisableOnInteraction && self.autoplayTimer === 'stop') {
                    self.startAutoplay();
                }
                if (self.transtionEndType === 1) { // slide完成 执行
                    // 执行完成后的回调函数
                    self.onTransitionEnd && self.onTransitionEnd(self);
                } else if (self.transtionEndType === 2) { // 滑动滚动执行
                    self.syncTranslate();
                    if (self.freeMode) {
                        // 内容区要大于显示区才有回弹
                        if (self.countWH(0, self.slideLen) > self.getWH(self.container)) {
                            if (self.getTranslate() < self.maxTranslate() && self.transitionendNum < 1) {
                                self.transtionEndFalg = true;
                                self.transitionendNum++;
                                self.setTransition(Math.min(300, duration));
                                self.setTranslate(self.maxTranslate());
                                self._transtionEnd();
                            } else if (self.getTranslate() > self.minTranslate() && self.transitionendNum < 1) {
                                self.transtionEndFalg = true;
                                self.transitionendNum++;
                                self.setTransition(Math.min(300, duration));
                                self.setTranslate(self.minTranslate());
                                self._transtionEnd();
                            }
                        }
                    }
                }
                self.transtionEndCallback && self.transtionEndCallback();
                self.transtionEndCallback = null;
            }, duration);
        },
        // 设置激活的类名
        setClassActive: function() {
            // 设置激活的类名
            this.slides.removeClass(this.classNameList.slideActive);
            this.slides.eq(this.activeIndex).addClass(this.classNameList.slideActive);
            var paginationChild = this.pagination.find('.' + this.classNameList.pagination);
            if (this.pagination.length > 0 && paginationChild.length > 0) {
                paginationChild.removeClass(this.classNameList.paginationActive)
                paginationChild.eq(this.realIndex).addClass(this.classNameList.paginationActive);
            }
        },
        // 最大可以滑动的距离
        maxTranslate: function() {
            return -this.toFixed((this.countWH(0, this.slideLen) - this.getWH(this.container) - this.spaceBetween), 2);
        },
        // 最小可以滑动的距离
        minTranslate: function() {
            return -0;
        },
        // 自动播放方法
        startAutoplay: function() {
            var self = this;
            if (this.autoplay) {
                this.isTouch = false;
                this.touchType = null;
                clearInterval(this.autoplayTimer);
                this.autoplayTimer = setInterval(function() {
                    if (self.loop) {
                        self.updateLoopActiveIndx();
                        self.activeIndex++;
                    } else {
                        self.activeIndex++;
                        if (self.activeIndex > self.slideLen - 1) {
                            self.activeIndex = 0;
                        }
                    }
                    self._slideTo();
                }, isNaN(this.autoplay) ? 5000 : this.autoplay);
            }
        },
        // 永久停止自动播放
        stopAutoplay: function() {
            if (this.autoplay) {
                clearInterval(this.autoplayTimer);
                this.autoplayTimer = null;
                this.autoplayDisableOnInteraction = true;
            }
        },
        // 用户操作暂时性停止自动播放
        stopTmpAutoplay: function() {
            if (this.autoplay) {
                clearInterval(this.autoplayTimer);
                if (!this.autoplayDisableOnInteraction) {
                    this.autoplayTimer = 'stop'; // 是否停止的标识
                } else {
                    this.autoplayTimer = null;
                }
            }
        },
        // 同步realIndex
        syncRealIndex: function() {
            if (this.loop) {
                if (this.activeIndex >= this.slideLen - this.loopLen) {
                    this.realIndex = this.loopLen - (this.slideLen - this.activeIndex);
                } else if (this.activeIndex < this.loopLen) {
                    this.realIndex = this.slideLen - this.loopLen * 2 - (this.loopLen - this.activeIndex);
                } else {
                    this.realIndex = this.activeIndex - this.loopLen;
                }
            } else {
                this.realIndex = this.activeIndex
            }
        },
        // 检测activeIndex索引范围
        checkActiveIndex: function() {
            if (!this.loop) {
                // 索引小于最小索引 重置为0
                if (this.activeIndex <= 0) {
                    this.activeIndex = 0;
                    if (!this.loop && this.prevButton.length > 0) {
                        this.prevButton.addClass(this.classNameList.swiperButtonDisabled);
                    }
                } else {
                    if (!this.loop && this.prevButton.length > 0 && this.prevButton.hasClass(this.classNameList.swiperButtonDisabled)) {
                        this.prevButton.removeClass(this.classNameList.swiperButtonDisabled);
                    }
                }
                // 索引大于最大索引 重置为swiperLen - 1
                if (this.activeIndex >= this.paginationLen - 1) {
                    this.activeIndex = this.paginationLen - 1;
                    if (!this.loop && this.nextButton.length > 0) {
                        this.nextButton.addClass(this.classNameList.swiperButtonDisabled);
                    }
                } else {
                    if (!this.loop && this.nextButton.length > 0 && this.nextButton.hasClass(this.classNameList.swiperButtonDisabled)) {
                        this.nextButton.removeClass(this.classNameList.swiperButtonDisabled);
                    }
                }
            } else {
                if (this.activeIndex <= 0) {
                    this.activeIndex = 0;
                }
                if (this.activeIndex >= this.slideLen - 1) {
                    this.activeIndex = this.slideLen - 1;
                }
            }
        },
        // 检测activeIndex索引范围
        checkRealIndex: function() {
            if (this.realIndex <= 0) {
                this.realIndex = 0;
            }
            // 索引大于最大索引 重置为swiperLen - 1
            if (this.realIndex >= this.paginationLen - 1) {
                this.realIndex = this.paginationLen - 1;
            }
        },
        // 更新无缝滚动索引
        updateLoopActiveIndx: function() {
            if (this.loop) {
                // 设置过渡时间为0
                this.setTransition(0);
                if (this.activeIndex < this.loopLen) { // 如果是第一个 拉到倒数第二个
                    this.activeIndex = this.slideLen - this.loopLen - (this.loopLen - this.activeIndex);
                    this.setTranslate(-this.countWH(0, this.activeIndex));
                    this.syncTranslate();
                }
                if (this.activeIndex > this.slideLen - this.loopLen - 1) { // 如果是倒数第一个 拉到第一个
                    this.activeIndex = this.loopLen - (this.slideLen - this.activeIndex) + this.loopLen;
                    this.setTranslate(-this.countWH(0, this.activeIndex));
                    this.syncTranslate();
                }
            }
        },
        // 更新当前活动索引 根据滑动距离确定
        updateTouchActiveIndex: function() {
            var dTime = this.endTime - this.startTime;
            if ((this.isHorizontal() && Math.abs(this.moveX) > this.maxPullDis) || (this.isHorizontal() && dTime > this.minPullTime && dTime < this.pullTime && Math.abs(this.moveX) > this.minPullDis)) { // 水平方向
                if (this.touchType == 4) { // 向右滑动 
                    // 循环判断当前拖动到的索引
                    for (var i = 0; i < this.slideLen; i++) {
                        if (Math.abs(this.getTranslate()) <= this.countWH(0, this.activeIndex)) {
                            this.activeIndex--;
                        } else {
                            break;
                        }
                    }
                }
                if (this.touchType == 3) { // 向左滑动
                    // 循环判断当前拖动到的索引
                    for (var i = 0; i < this.slideLen; i++) {
                        if (Math.abs(this.getTranslate()) >= this.countWH(0, this.activeIndex)) {
                            this.activeIndex++;
                        } else {
                            break;
                        }
                    }
                }
            } else if ((Math.abs(this.moveY) > this.maxPullDis) || (dTime > this.minPullTime && dTime < this.pullTime && Math.abs(this.moveY) > this.minPullDis)) { // 并且滑动距离大于pullDis
                if (this.touchType == 1) { // 向下滑动 
                    // 循环判断当前拖动到的索引
                    for (var i = 0; i < this.slideLen; i++) {
                        if (Math.abs(this.getTranslate()) >= this.countWH(0, this.activeIndex)) {
                            this.activeIndex++;
                        } else {
                            break;
                        }
                    }
                }
                if (this.touchType == 2) { // 向上滑动 
                    // 循环判断当前拖动到的索引
                    for (var i = 0; i < this.slideLen; i++) {
                        if (Math.abs(this.getTranslate()) <= this.countWH(0, this.activeIndex)) {
                            this.activeIndex--;
                        } else {
                            break;
                        }
                    }
                }
            }
        },
        // 如果超出边界重置translate
        restTranslate: function() {
            var translate = null;
            this.syncTranslate();
            this.setTransition(this.speed);
            // 检测临界值
            if (this.getTranslate() < this.maxTranslate()) {
                translate = this.maxTranslate();
            } else if (this.getTranslate() > this.minTranslate()) {
                translate = this.minTranslate();
            }
            // 检测当前activeIndex 对应的translate的值是否超出临界值
            if (-this.countWH(0, this.activeIndex) < this.maxTranslate() && !this.freeMode) {
                translate = this.maxTranslate();
            }
            if (this.countWH(0, this.slideLen) <= this.getWH(this.container) || this.getTranslate() > this.minTranslate()) {
                translate = this.minTranslate();
            }
            // 检测当前activeIndex 对应的translate的值是否超出临界值
            if (-this.countWH(0, this.activeIndex) < this.maxTranslate() && !this.slideToClickedSlide) {
                for (var i = 0; i < this.slideLen; i++) {
                    if (-this.countWH(0, i) <= this.maxTranslate()) {
                        this.activeIndex = i;
                        break;
                    }
                }
            }
            // 如果滚动大于0 或者内容区小于滚动区  索引直接为0 
            if (this.countWH(0, this.slideLen) <= this.getWH(this.container) || this.getTranslate() > this.minTranslate()) {
                this.activeIndex = 0;
            }
            this.syncRealIndex();
            // 激活当前块的类名
            this.setClassActive();
            if (translate !== null) {
                this.setTranslate(translate);
                // 监听动画完成后回调
                this._transtionEnd();
                return true;
            }
            return false;
        },
        // 获取translate
        getTranslate: function() {
            return this.isHorizontal() ? this.x : this.y;
        },
        // 设置translate
        setTranslate: function(value) {
            var elStyle = this.wrapper[0].style;
            if (this.isHorizontal()) {
                value = 'translate3d(' + value + 'px, 0, 0)';
            } else {
                value = 'translate3d(0,' + value + 'px, 0)';
            }
            elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = value;
        },
        // 更新translate
        syncTranslate: function() {
            // this.x = this.wrapper.position().left;
            // this.y = this.wrapper.position().top;
            this.x = -this.getTranslatePoint(this.wrapper[0], 'x');
            this.y = -this.getTranslatePoint(this.wrapper[0], 'y');
        },
        // 返回当前wrapper位移
        getWrapperTranslate: function() {
            this.syncTranslate();
            return this.getTranslate();
        },
        // 手动设置wrapper的位移。
        setWrapperTranslate: function(translate, duration) {
            if (duration) {
                this.setTransition(duration);
            }
            this.setTranslate(translate);
        },
        // 设置transition
        setTransition: function(duration) {
            if (typeof duration !== 'string') {
                duration = duration + 'ms';
            }
            var elStyle = this.wrapper[0].style;
            elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
        },
        // 获取宽或者高
        getWH: function(el) {
            return this.isHorizontal() ? this.toFixed(el.width(), 2) : this.toFixed(el.height(), 2);
        },
        // 设置宽或者高
        setWH: function(el, value) {
            this.isHorizontal() ? el.css('width', value + 'px') : el.css('height', value + 'px');
        },
        // 设置间距
        setBetween: function(el, value) {
            this.isHorizontal() ? el.css('margin-right', value + 'px') : el.css('margin-bottom', value + 'px');
        },
        //统计所有swiperItem宽度的和
        countWH: function(start, end, ceil) {
            var total = 0;
            start = start ? start : 0;
            end = end ? end : 0;
            for (var i = start; i < end; i++) {
                var size = this.getWH(this.slides.eq(i));
                size = ceil ? Math.ceil(size) : size;
                total += (size + this.spaceBetween)
            }
            return this.toFixed(total, 1);
        },
        // 获取transform: translate()坐标的值，支持获取x轴和y轴
        getTranslatePoint: function(el, axis) {
            var matrix, curTransform, curStyle, transformMatrix;
            if (typeof axis === 'undefined') {
                axis = this.isHorizontal() ? 'x' : 'y';
            }
            curStyle = window.getComputedStyle(el, null);
            if (window.WebKitCSSMatrix) {
                curTransform = curStyle.transform || curStyle.webkitTransform;
                if (curTransform.split(',').length > 6) {
                    curTransform = curTransform.split(', ').map(function(a) {
                        return a.replace(',', '.');
                    }).join(', ');
                }
                transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
            } else {
                transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
                matrix = transformMatrix.toString().split(',');
            }

            if (axis === 'x') {
                if (window.WebKitCSSMatrix) {
                    curTransform = transformMatrix.m41;
                } else if (matrix.length === 16) {
                    curTransform = parseFloat(matrix[12]);
                } else {
                    curTransform = parseFloat(matrix[4]);
                }
            }
            if (axis === 'y') {
                if (window.WebKitCSSMatrix) {
                    curTransform = transformMatrix.m42;
                } else if (matrix.length === 16) {
                    curTransform = parseFloat(matrix[13]);
                } else {
                    curTransform = parseFloat(matrix[5]);
                }
            }
            if (curTransform) { curTransform = -curTransform; }
            return curTransform || 0;
        },
        isHorizontal: function() {
            return this.direction === 'horizontal' ? true : false;
        },
        /**
         *  惯性函数
         *  current  结束位置
         *  start    开始位置
         *  time     时长
         *  lowerMargin 可滚动的最大距离
         *  wrapperSize 滚动区域大小 当滚动超过边缘的时候会有一小段回弹动画
         *  distance 距离
         *  destination  目的地
         *  options.deceleration 减速度(系数) 0.001
         *  options.swipeTime 滑动持续时间
         *  options.swipeBounceTime 回弹持续时间
         *  options.rate 回弹系数
         */
        momentum: function(current, start, time, lowerMargin, wrapperSize, options) {
            options = options === undefined ? {} : options;
            var distance = current - start;
            var speed = Math.abs(distance) / time;
            var deceleration = options.deceleration === undefined ? 0.0012 : options.deceleration;
            // 公式：惯性拖拽 = 最后的位置 + 速度 / 摩擦系数 * 方向
            var destination = current + (speed * speed) / deceleration * (distance < 0 ? -1 : 1);
            var duration = options.swipeTime === undefined ? speed / deceleration : options.swipeTime;
            // 目的地(超过)最大的滚动范围
            if (destination < lowerMargin) {
                // 是否开启回弹
                destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 20)) : lowerMargin;
                distance = Math.abs(destination - current);
                duration = options.swipeBounceTime === undefined ? distance / speed : options.swipeBounceTime;
            } else if (destination > 0) {
                destination = wrapperSize ? wrapperSize / 2.5 * (speed / 20) : 0
                distance = Math.abs(destination - current);
                duration = options.swipeBounceTime === undefined ? distance / speed : options.swipeBounceTime;
            }
            // 如果未触发以上两种条件(未到达边界)，则使用最初计算出来的位置
            return {
                destination: Math.round(destination),
                duration: duration
            }
        },
        //返回角度
        getAngle: function(dx, dy) {
            return Math.atan2(dy, dx) * 180 / Math.PI;
        },
        // 根据角度获取滑动的类型
        getDirection: function(dx, dy) {
            var result = null;
            // 根据角度判断类型
            var angle = this.getAngle(dx, dy);
            if (angle >= -135 && angle <= -45) { // 上
                result = 1;
            } else if (angle > 45 && angle < 135) { // 下
                result = 2;
            } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) { // 左
                result = 3;
            } else if (angle >= -45 && angle <= 45) { // 右
                result = 4;
            }
            return result;
        },
        // 获取事件名称
        getEventName: function(name) {
            if (!name) {
                return null
            }
            if (this.isPC()) {
                return this.events.PC[name]
            } else {
                return this.events.MIBLE[name]
            }
        },
        getPage: function(e, type) {
            var page = {};
            if (!e || !type) { return };
            if (this.isPC()) {
                var sys = this.getExplore();
                // ie8
                if (parseFloat(sys.ie) <= 8) {
                    page.x = e.clientX;
                    page.y = e.clientY;
                } else {
                    page.x = e.pageX;
                    page.y = e.pageY;
                }
            } else {
                if (type === 1) {
                    page.x = e.targetTouches[0].pageX;
                    page.y = e.targetTouches[0].pageY;
                } else if (type === 2) {
                    page.x = e.targetTouches[0].pageX;
                    page.y = e.targetTouches[0].pageY;
                } else if (type === 3) {
                    page.x = e.changedTouches[0].pageX;
                    page.y = e.changedTouches[0].pageY;
                }
            }
            return page;
        },
        toFixed: function(value, n) {
            var f = Math.ceil(value * Math.pow(10, n)) / Math.pow(10, n);
            // var s = f.toString();
            // var rs = s.indexOf('.');
            // if (rs < 0) {
            //     s += '.';
            // }
            // for (var i = s.length - s.indexOf('.'); i <= n; i++) {
            //     s += "0";
            // }
            return Number(f);
        },
        isPC: function() {
            var u = navigator.userAgent;
            var Agents = ['Android', 'iPhone', 'webOS', 'BlackBerry', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
            var flag = true;
            for (var i = 0; i < Agents.length; i++) {
                if (u.indexOf(Agents[i]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        },
        getExplore: function() {
            var Sys = {};
            var ua = navigator.userAgent.toLowerCase();
            var s;
            (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1]:
                (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
                (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
            return Sys;
        }
    }
    window.Swiper = Swiper;
})()