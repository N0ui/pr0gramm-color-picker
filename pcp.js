// ==UserScript==
// @name         pcp - pr0gramm color picker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  alles bleibt hier nicht so wie es ist! (Für den der will)
// @author       N0ui
// @match        *://pr0gramm.com/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';
(function ($) {
    var PCC = {
        // used colors
        colorNames: [{
            desc: 'Hauptfarbe',
            key: 'main-color',
            value: '#ee4d2e'
        }, {
            desc: 'Linkfarbe',
            key: 'second-color',
            value: '#75c0c7'
        }, {
            desc: 'Buttontext',
            key: 'third-color',
            value: '#f2f5f4'
        }],
        // style
        cssStyle: function () {
            var cssStr = '';
            cssStr += '#filter-save,.confirm-button, input[type=button], input[type=submit],.filter-setting.active .filter-check {';
            cssStr += 'background-color: ' + localStorage["main-color"] + ' !important;}';
            cssStr += '.filter-setting.active .filter-check {';
            cssStr += 'border: 1px solid ' + localStorage["main-color"] + ' !important;}';
            cssStr += '#settings-logout-link,.action,.filter-setting.active .filter-name,.head-link:hover,.tab-bar a:hover, .tab-bar a.active,a.head-tab.active, a.head-tab:hover,#inboxLink, #inboxLink.empty:hover,.head-link:hover {';
            cssStr += 'color: ' + localStorage["main-color"] + ';}';
            cssStr += 'a, .link {';
            cssStr += 'color: ' + localStorage["second-color"] + ';}';
            cssStr += '.confirm-button, input[type=button], input[type=submit] {';
            cssStr += 'color: ' + localStorage["third-color"] + ';}';
            cssStr += '.confirm-button:hover, input[type=button]:hover, input[type=button]:focus, input[type=submit]:hover, input[type=submit]:focus {background-color: #F5F7F6 !important;}';

            return cssStr;
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
})(jQuery);
