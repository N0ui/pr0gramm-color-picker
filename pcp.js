// ==UserScript==
// @name		pcp - pr0gramm color picker
// @author		N0ui
// @namespace	pcp
// @include		http://*pr0gramm.com*
// @include		https://*pr0gramm.com*
// @version		0.1
// @updateURL	https://raw.githubusercontent.com/N0ui/pr0gramm-color-picker/master/pcp.js
// @downloadURL	https://raw.githubusercontent.com/N0ui/pr0gramm-color-picker/master/pcp.js
// @copyright	2015+, N0ui
// @description	alles bleibt hier nicht so wie es ist! (Für den der will)
// @icon		http://pr0gramm.com/media/pr0gramm-favicon.png
// @run-at       document-end
// ==/UserScript==
(function () {
    'use strict';
    var PCC = {
        // used colors
        colorNames: [{
            desc: 'Hauptfarbe',
            key: 'main-color',
            value: '#ee4d2e'
        }, {
            desc: 'Linkfarbe',
            key: 'link-color',
            value: '#75c0c7'
        }, {
            desc: 'Buttontext',
            key: 'btn-color',
            value: '#f2f5f4'
        }, {
            desc: 'Warnung',
            key: 'warn-color',
            value: '#fc8833'
        }, {
            desc: 'Abbrechen Button Hintergrund',
            key: 'cancelBtn-bg-color',
            value: '#212425'
        }, {
            desc: 'Abbrechen Button Text',
            key: 'cancelBtn-color',
            value: '#888888'
        }, {
            desc: 'Button Hover Hintergrund',
            key: 'btn-hover-bg-color',
            value: '#F5F7F6'
        }, {
            desc: 'Button Hover Text',
            key: 'btn-hover-color',
            value: '#555555'
        ],

        // style
        // style
        cssStyle: function () {
            var $styleEl = $('#pcp-style'),
                cssStr = '';
            cssStr += '#filter-save,.confirm-button, input[type=button], input[type=submit],.filter-setting.active .filter-check, .loader > div {';
            cssStr += 'background-color: ' + localStorage["main-color"] + ';}';
            cssStr += '.filter-setting.active .filter-check {';
            cssStr += 'border: 1px solid ' + localStorage["main-color"] + ';}';
            cssStr += 'a.bookmarklet, #settings-logout-link,.action,.filter-setting.active .filter-name,.head-link:hover,.tab-bar a:hover, .tab-bar a.active,a.head-tab.active, a.head-tab:hover,#inboxLink, #inboxLink.empty:hover,.head-link:hover {';
            cssStr += 'color: ' + localStorage["main-color"] + ';}';
            cssStr += 'a, .link {';
            cssStr += 'color: ' + localStorage["link-color"] + ';}';
            cssStr += '.confirm-button, input[type=button], input[type=submit] {';
            cssStr += 'color: ' + localStorage["btn-color"] + ';}';
            cssStr += '.warn{';
            cssStr += 'color: ' + localStorage["warn-color"] + ';}';
            cssStr += '.confirm-button:hover, input[type=button]:hover, input[type=button]:focus, input[type=submit]:hover, input[type=submit]:focus {background-color: #F5F7F6;}';
            cssStr += 'input[type=button].cancel, input[type=button]:disabled, input[type=submit]:disabled, input[type=submit].cancel{';
            cssStr += 'background-color: ' + localStorage["cancelBtn-bg-color"] + ';color: ' + localStorage["cancelBtn-color"] + ';}';
            cssStr += '.confirm-button:hover, input[type=button]:hover, input[type=button]:focus, input[type=submit]:hover, input[type=submit]:focus {';
            cssStr += 'background-color: ' + localStorage["btn-hover-bg-color"] + '; color:  ' + localStorage["btn-hover-color"] + ';}';



            if ($styleEl.length < 1) {
                $('body').append('<style id="pcp-style"></style>');
            }
            $styleEl.html(cssStr);
        },
        // html form
        settingsHtml: function () {
            var settingsHtmlStr = '';
            settingsHtmlStr += '<div class="form-section" id="settings-pcp">';
            settingsHtmlStr += '<h2>pr0gramm Farben</h2> <h3>Stell einfach deine Farben ein</h3>';
            $.each(this.colorNames, function (i, v) {
                settingsHtmlStr += '<label class="radio" for="pcp-' + v.key + '">' + v.desc + '</label>';
                settingsHtmlStr += '<input type="color" class="pcp-color" id="pcp-' + v.key + '">';
            });
            settingsHtmlStr += '<br><br><div id="pcp-reset">Farben zurücksetzen</div>';
            return settingsHtmlStr;
        },
        // reset all colors
        reset: function () {
            $.each(this.colorNames, function (i, v) {
                localStorage.removeItem(v.key);
            });

            this.init();
        },
        // update colors
        update: function () {
            $.each(this.colorNames, function (i, v) {
                localStorage[v.key] = $('#pcp-' + v.key).val();
            });

            $('#pcp-style').html(this.cssStyle());
        },
        // init
        init: function () {
            var $styleEl = $('#pcp-style');

            // set default colors
            if (typeof localStorage["main-color"] === 'undefined' || localStorage["main-color"] === '') {
                $.each(this.colorNames, function (i, v) {
                    localStorage[v.key] = v.value;
                });
            }

            // check if form exists
            if ($('#settings-pcp').length < 1) {
                $('#settings-site-form').prepend(PCC.settingsHtml());
            }

            // append style
            if ($styleEl.length < 1) {
                $('head').append('<style id="pcp-style"></style>');
            }
            $styleEl.html(this.cssStyle());

            $.each(this.colorNames, function (i, v) {
                $('#pcp-' + v.key).val(localStorage[v.key]);
            });
        }
    };


    // check if document is ready
    $(function () {

        // reset colors
        $(document).on('click', '#pcp-reset', function () {
            PCC.reset();
        });

        // update colors
        $(document).on('change', '.pcp-color', function () {
            PCC.update();
        });

        // only to show settings
        p.View.Base.prototype.render = function () {
            if (!this.visible) {
                return;
            }
            if (!this.$container) {
                this.$container = $(this.compiledTemplate(this.data));
            } else {
                this.$container.html(this.compiledTemplate(this.data));
            }
            var anchors = this.$container.find('a[href^="#"]');
            if (p._hasPushState) {
                anchors.each(function () {
                    this.href = '/' + $(this).attr('href').substr(
                        1);
                });
            }
            anchors.fastclick(this.handleHashLink.bind(this));
            this.needsRendering = false;

            PCC.init();
        };
    });
})();