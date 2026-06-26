;
// jQuery Tips插件开发者https://github.com/hahacium
if ( typeof Object.create !== 'function' ) {
    Object.create = function( obj ) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function( $, window, document, undefined ) {

    "use strict";
    
    var Tips = {

        _positionClasses : ['bottom-left', 'bottom-right', 'top-right', 'top-left', 'bottom-center', 'top-center', 'mid-center'],
        _defaultIcons : ['success', 'error', 'info', 'warning'],

        init: function (options, elem) {
            this.prepareOptions(options, $.tips.options);
            this.process();
        },

        prepareOptions: function(options, options_to_extend) {
            var _options = {};
            if ( ( typeof options === 'string' ) || ( options instanceof Array ) ) {
                _options.text = options;
            } else {
                _options = options;
            }
            this.options = $.extend( {}, options_to_extend, _options );
        },

        process: function () {
            this.setup();
            this.addToDom();
            this.position();
            this.bindTips();
            this.animate();
        },

        setup: function () {
            
            var _tipsContent = '';
            
            this._tipsEl = this._tipsEl || $('<div></div>', {
                class : 'jq-tips-single'
            });

            // For the loader on top
            _tipsContent += '<span class="jq-tips-loader"></span>';            

            if ( this.options.allowTipsClose ) {
                _tipsContent += '<span class="close-jq-tips-single">&times;</span>';
            };

            if ( this.options.text instanceof Array ) {

                if ( this.options.heading ) {
                    _tipsContent +='<h2 class="jq-tips-heading">' + this.options.heading + '</h2>';
                };

                _tipsContent += '<ul class="jq-tips-ul">';
                for (var i = 0; i < this.options.text.length; i++) {
                    _tipsContent += '<li class="jq-tips-li" id="jq-tips-item-' + i + '">' + this.options.text[i] + '</li>';
                }
                _tipsContent += '</ul>';

            } else {
                if ( this.options.heading ) {
                    _tipsContent +='<h2 class="jq-tips-heading">' + this.options.heading + '</h2>';
                };
                _tipsContent += this.options.text;
            }

            this._tipsEl.html( _tipsContent );

            if ( this.options.bgColor !== false ) {
                this._tipsEl.css("background-color", this.options.bgColor);
            };

            if ( this.options.textColor !== false ) {
                this._tipsEl.css("color", this.options.textColor);
            };

            if ( this.options.textAlign ) {
                this._tipsEl.css('text-align', this.options.textAlign);
            }

            if ( this.options.icon !== false ) {
                this._tipsEl.addClass('jq-has-icon');

                if ( $.inArray(this.options.icon, this._defaultIcons) !== -1 ) {
                    this._tipsEl.addClass('jq-icon-' + this.options.icon);
                };
            };
        },

        position: function () {
            if ( ( typeof this.options.position === 'string' ) && ( $.inArray( this.options.position, this._positionClasses) !== -1 ) ) {

                if ( this.options.position === 'bottom-center' ) {
                    this._container.css({
                        left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
                        bottom: 20
                    });
                } else if ( this.options.position === 'top-center' ) {
                    this._container.css({
                        left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
                        top: 20
                    });
                } else if ( this.options.position === 'mid-center' ) {
                    this._container.css({
                        left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
                        top: ( $(window).outerHeight() / 2 ) - this._container.outerHeight()/2
                    });
                } else {
                    this._container.addClass( this.options.position );
                }

            } else if ( typeof this.options.position === 'object' ) {
                this._container.css({
                    top : typeof this.options.position.top !== 'undefined' ? this.options.position.top : 'auto',
                    bottom : typeof this.options.position.bottom !== 'undefined' ? this.options.position.bottom : 'auto',
                    left : typeof this.options.position.left !== 'undefined' ? this.options.position.left : 'auto',
                    right : typeof this.options.position.right !== 'undefined' ? this.options.position.right : 'auto'
                });
            } else {
                this._container.addClass( 'bottom-left' );
            }
        },

        bindTips: function () {

            var that = this;

            this._tipsEl.on('afterShown', function () {
                that.processLoader();
            });

            this._tipsEl.find('.close-jq-tips-single').on('click', function ( e ) {

                e.preventDefault();

                if( that.options.showHideTransition === 'fade') {
                    that._tipsEl.trigger('beforeHide');
                    that._tipsEl.fadeOut(function () {
                        that._tipsEl.trigger('afterHidden');
                    });
                } else if ( that.options.showHideTransition === 'slide' ) {
                    that._tipsEl.trigger('beforeHide');
                    that._tipsEl.slideUp(function () {
                        that._tipsEl.trigger('afterHidden');
                    });
                } else {
                    that._tipsEl.trigger('beforeHide');
                    that._tipsEl.hide(function () {
                        that._tipsEl.trigger('afterHidden');
                    });
                }
            });

            if ( typeof this.options.beforeShow == 'function' ) {
                this._tipsEl.on('beforeShow', function () {
                    that.options.beforeShow();
                });
            };

            if ( typeof this.options.afterShown == 'function' ) {
                this._tipsEl.on('afterShown', function () {
                    that.options.afterShown();
                });
            };

            if ( typeof this.options.beforeHide == 'function' ) {
                this._tipsEl.on('beforeHide', function () {
                    that.options.beforeHide();
                });
            };

            if ( typeof this.options.afterHidden == 'function' ) {
                this._tipsEl.on('afterHidden', function () {
                    that.options.afterHidden();
                });
            };          
        },

        addToDom: function () {

             var _container = $('.jq-tips-wrap');
             
             if ( _container.length === 0 ) {
                
                _container = $('<div></div>',{
                    class: "jq-tips-wrap"
                });

                $('body').append( _container );

             } else if ( !this.options.stack || isNaN( parseInt(this.options.stack, 10) ) ) {
                _container.empty();
             }

             _container.find('.jq-tips-single:hidden').remove();

             _container.append( this._tipsEl );

            if ( this.options.stack && !isNaN( parseInt( this.options.stack ), 10 ) ) {
                
                var _prevTipsCount = _container.find('.jq-tips-single').length,
                    _extTipsCount = _prevTipsCount - this.options.stack;

                if ( _extTipsCount > 0 ) {
                    $('.jq-tips-wrap').find('.jq-tips-single').slice(0, _extTipsCount).remove();
                };

            }

            this._container = _container;
        },

        canAutoHide: function () {
            return ( this.options.hideAfter !== false ) && !isNaN( parseInt( this.options.hideAfter, 10 ) );
        },

        processLoader: function () {
            // Show the loader only, if auto-hide is on and loader is demanded
            if (!this.canAutoHide() || this.options.loader === false) {
                return false;
            }

            var loader = this._tipsEl.find('.jq-tips-loader');

            // 400 is the default time that jquery uses for fade/slide(400:淡入淡出/滑动的默认时间)
            // Divide by 1000 for milliseconds to seconds conversion(除以1000进行毫秒到秒的转换)
            var transitionTime = (this.options.hideAfter - 400) / 1000 + 's';
            var loaderBg = this.options.loaderBg;

            var style = loader.attr('style') || '';
            style = style.substring(0, style.indexOf('-webkit-transition')); // Remove the last transition definition

            style += '-webkit-transition: width ' + transitionTime + ' ease-in; \
                      -o-transition: width ' + transitionTime + ' ease-in; \
                      transition: width ' + transitionTime + ' ease-in; \
                      background-color: ' + loaderBg + ';';


            loader.attr('style', style).addClass('jq-tips-loaded');
        },

        animate: function () {

            var that = this;

            this._tipsEl.hide();

            this._tipsEl.trigger('beforeShow');

            if ( this.options.showHideTransition.toLowerCase() === 'fade' ) {
                this._tipsEl.fadeIn(function ( ){
                    that._tipsEl.trigger('afterShown');
                });
            } else if ( this.options.showHideTransition.toLowerCase() === 'slide' ) {
                this._tipsEl.slideDown(function ( ){
                    that._tipsEl.trigger('afterShown');
                });
            } else {
                this._tipsEl.show(function ( ){
                    that._tipsEl.trigger('afterShown');
                });
            }

            if (this.canAutoHide()) {

                var that = this;

                window.setTimeout(function(){
                    
                    if ( that.options.showHideTransition.toLowerCase() === 'fade' ) {
                        that._tipsEl.trigger('beforeHide');
                        that._tipsEl.fadeOut(function () {
                            that._tipsEl.trigger('afterHidden');
                        });
                    } else if ( that.options.showHideTransition.toLowerCase() === 'slide' ) {
                        that._tipsEl.trigger('beforeHide');
                        that._tipsEl.slideUp(function () {
                            that._tipsEl.trigger('afterHidden');
                        });
                    } else {
                        that._tipsEl.trigger('beforeHide');
                        that._tipsEl.hide(function () {
                            that._tipsEl.trigger('afterHidden');
                        });
                    }

                }, this.options.hideAfter);
            };
        },

        reset: function ( resetWhat ) {

            if ( resetWhat === 'all' ) {
                $('.jq-tips-wrap').remove();
            } else {
                this._tipsEl.remove();
            }

        },

        update: function(options) {
            this.prepareOptions(options, this.options);
            this.setup();
            this.bindTips();
        }
    };
    
    $.tips = function(options) {
        var tips = Object.create(Tips);
        tips.init(options, this);

        return {
            
            reset: function ( what ) {
                tips.reset( what );
            },

            update: function( options ) {
                tips.update( options );
            }
        }
    };

    $.tips.options = {
        text: '',
        heading: '',
        showHideTransition: 'fade',
        allowTipsClose: true,
        hideAfter: 3000,
        loader: true,
        loaderBg: '#9EC600',
        stack: 5,
        position: 'bottom-left',
        bgColor: false,
        textColor: false,
        textAlign: 'left',
        icon: false,
        beforeShow: function () {},
        afterShown: function () {},
        beforeHide: function () {},
        afterHidden: function () {}
    };

})( jQuery, window, document );
