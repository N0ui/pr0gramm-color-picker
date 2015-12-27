// ==UserScript==
// @name		 pcp - pr0gramm color picker
// @author		 N0ui
// @namespace	 pcp
// @include		 http://*pr0gramm.com*
// @include		 https://*pr0gramm.com*
// @version		 1.2
// @updateURL	 https://raw.githubusercontent.com/N0ui/pr0gramm-color-picker/master/pcp.user.js
// @downloadURL	 https://raw.githubusercontent.com/N0ui/pr0gramm-color-picker/master/pcp.user.js
// @copyright	 2015+, N0ui
// @icon		 http://pr0gramm.com/media/pr0gramm-favicon.png
// @grant        none
// @run-at       document-end
// ==/UserScript==
(function () {
    'use strict';
    var PCP = {
        // colors and html
        colorNames: [{
            key: 'html',
            html: '<h4>Hauptfarben</h4>'
        }, {
            desc: 'Hauptfarbe',
            key: 'main-color',
            value: '#ee4d2e'
        }, {
            desc: 'Hintergrund',
            key: 'bg-color',
            value: '#161618'
        }, {
            desc: 'Standard Schriftfarbe',
            key: 'main-font-color',
            value: '#f2f5f4'
        }, {
            desc: 'Standard Schriftfarbe 2 (grau)',
            key: 'second-main-font-color',
            value: '#888888'
        }, {
            desc: 'Linkfarbe',
            key: 'link-color',
            value: '#75c0c7'
        }, {
            desc: 'Linkfarbe Hover',
            key: 'link-color-hover',
            value: '#F5F7F6'
        }, {
            key: 'html',
            html: '<br><h4>Buttons</h4>'
        }, {
            desc: 'Buttontext',
            key: 'btn-color',
            value: '#f2f5f4'
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
        }, {
            key: 'html',
            html: '<br><h4>Video & Tags</h4>'
        }, {
            desc: 'Tag Hintergrund',
            key: 'tag-bg-color',
            value: '#2A2E31'
        }, {
            desc: 'Tag Text',
            key: 'tag-color',
            value: '#F5F7F6'
        }, {
            desc: 'Video Prozessbalken',
            key: 'video-bg-color',
            value: '#75c0c7'
        }, {
            key: 'html',
            html: '<br><h4>Sonstiges</h4>'
        }, {
            desc: 'Warnung',
            key: 'warn-color',
            value: '#fc8833'
        }],
        // calculate brightness (http://www.sitepoint.com/javascript-generate-lighter-darker-color/)
        colorLuminance: function (hex, lum) {
            // validate hex string
            hex = String(hex).replace(/[^0-9a-f]/gi, '');
            if (hex.length < 6) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            lum = lum || 0;

            // convert to decimal and change luminosity
            var rgb = "#",
                c, i;
            for (i = 0; i < 3; i++) {
                c = parseInt(hex.substr(i * 2, 2), 16);
                c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                rgb += ("00" + c).substr(c.length);
            }

            return rgb;
        },
        // convert hex to rgba
        convertHex: function (hex, opacity) {
            var hex = hex.replace('#', '');
            var r = parseInt(hex.substring(0, 2), 16);
            var g = parseInt(hex.substring(2, 4), 16);
            var b = parseInt(hex.substring(4, 6), 16);

            return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
        },
        // style
        cssStyle: function () {
            var $styleEl = $('#pcp-style'), cssStr = '';
            
            cssStr += 'html, body, h3, .tab-bar a, .head-link, a#inboxLink, #inboxLink.empty, #search-submit-inline, .user, .user-score {color: ' + localStorage["main-font-color"] + ';}';
            cssStr += 'input.box-from-label:checked + label:before {background-color: ' + localStorage["main-font-color"] + ';}input.box-from-label + label:before {border: 1px solid ' + localStorage["main-font-color"] + ';}';
            cssStr += '#filter-save,.confirm-button, input[type=button], input[type=submit],.filter-setting.active .filter-check, .loader > div, div.stream-next:hover span.stream-next-icon, div.stream-prev:hover span.stream-prev-icon, .user-follow, .user-unfollow {';
            cssStr += 'background-color: ' + this.colorLuminance(localStorage["main-color"], -0.1) + ';}';
            cssStr += '#filter-save:hover{background-color: ' + localStorage["main-color"] + ';}';
            cssStr += '.filter-setting.active .filter-check, #upload-droparea {';
            cssStr += 'border: 1px solid ' + localStorage["main-color"] + ';}';
            cssStr += 'div.overlay-tabs span.overlay-link:hover, div.overlay-tabs span.active,#upload-droparea.active, #key-indicator, a.item-fullsize-link:hover, .vote-up:hover, .voted-down .vote-up:hover, .voted-up .vote-up:hover, .voted-up .vote-up, a.bookmarklet, #search-submit-inline:hover, #settings-logout-link,.action,.filter-setting.active .filter-name,.head-link:hover,.tab-bar a:hover, .tab-bar a.active,a.head-tab.active, a.head-tab:hover,#inboxLink, #inboxLink.empty:hover,.head-link:hover, div.tagsinput span.tag a, .vote-fav.faved, .vote-fav:hover {';
            cssStr += 'color: ' + localStorage["main-color"] + ';}';
            cssStr += 'a, .link, a.user:hover, a.tag-link:hover, span.tag.voted-down a.tag-link:hover {';
            cssStr += 'color: ' + localStorage["link-color"] + ';}';
            cssStr += 'a:hover, .link:hover, .action:hover {';
            cssStr += 'color: ' + localStorage["link-color-hover"] + ';}';
            cssStr += '.confirm-button, input[type=button], input[type=submit], .user-follow, .user-unfollow {';
            cssStr += 'color: ' + localStorage["btn-color"] + ';}';
            cssStr += '.warn{';
            cssStr += 'color: ' + localStorage["warn-color"] + ';}';
            cssStr += '.confirm-button:hover, input[type=button]:hover, input[type=button]:focus, input[type=submit]:hover, input[type=submit]:focus {background-color: #F5F7F6;}';
            cssStr += 'input[type=button].cancel, input[type=button]:disabled, input[type=submit]:disabled, input[type=submit].cancel {';
            cssStr += 'background-color: ' + localStorage["cancelBtn-bg-color"] + ';color: ' + localStorage["cancelBtn-color"] + ';}';
            cssStr += '.confirm-button:hover, input[type=button]:hover, input[type=button]:focus, input[type=submit]:hover, input[type=submit]:focus, .user-follow:hover, .user-unfollow:hover {';
            cssStr += 'background-color: ' + localStorage["btn-hover-bg-color"] + '; color:  ' + localStorage["btn-hover-color"] + ';}';
            cssStr += 'span.tag {background-color: ' + localStorage["tag-bg-color"] + ' !important;}';
            cssStr += 'a.tag-link {color: ' + localStorage["tag-color"] + ';}';
            cssStr += 'div.video-position {background-color: ' + localStorage["video-bg-color"] + ';}';
            cssStr += '.tab-bar span, .user-stats, div.comment-foot {color: ' + localStorage["second-main-font-color"] + ';}';
            cssStr += 'a.head-tab {color: ' + this.colorLuminance(localStorage["second-main-font-color"], 0.2) + ';}';
            cssStr += 'html, body, #footer-links, div.item-container {background-color: ' + localStorage["bg-color"] + ';}';
            cssStr += '#head-content {background-color: ' + this.convertHex(this.colorLuminance(localStorage["bg-color"], -0.6), 80) + ';}';
            cssStr += 'input, textarea {background-color: ' + this.colorLuminance(localStorage["bg-color"], 0.3) + ';}';
            cssStr += 'input:focus, textarea:focus {background-color: ' + this.colorLuminance(localStorage["bg-color"], 0.4) + ';}';
            cssStr += 'div.comment-foot, div.comment-box div.comment-box {border-color: ' + this.colorLuminance(localStorage["bg-color"], -0.3) + ';}';
            cssStr += 'input.q {background-color: ' + this.convertHex(this.colorLuminance(localStorage["bg-color"], 0.4), 80) + ';}';
            cssStr += 'div.product-description {background-color: ' + this.colorLuminance(localStorage["bg-color"], 0.4) + ';}';
            cssStr += '.pcp-input-outer {display:blofck;margin: 0 0 10px 0;}.pcp-label {width: 40%; display:inline-block !important;}.pcp-color{padding: 0;width: 50px;display: inline-block;}#pcp-reset {border: 1px solid #fff;display: inline-block;padding: 8px 20px;cursor:pointer;}';

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
                if (v.key !== 'html') {
                    settingsHtmlStr += '<div class="pcp-input-outer"><label class="pcp-label" for="pcp-' + v.key + '">' + v.desc + '</label>';
                    settingsHtmlStr += '<input type="color" class="pcp-color" id="pcp-' + v.key + '"></div>';
                } else {
                    settingsHtmlStr += v.html;
                }
            });
            settingsHtmlStr += '<br><br><div id="pcp-reset">Farben zurücksetzen</div>';
            return settingsHtmlStr;
        },
        // reset all colors
        reset: function () {
            $.each(this.colorNames, function (i, v) {
                if (v.key !== 'html') {
                    localStorage.removeItem(v.key);
                }
            });

            this.init();
        },
        // update colors
        update: function () {
            $.each(this.colorNames, function (i, v) {
                if (v.key !== 'html') {
                    localStorage[v.key] = $('#pcp-' + v.key).val();
                }
            });

            $('#pcp-style').html(this.cssStyle());
        },
        // init
        init: function () {
            
            var $styleEl = $('#pcp-style');

            // set default colors
            if (typeof localStorage["main-color"] === 'undefined' || localStorage["main-color"] === '') {
                $.each(this.colorNames, function (i, v) {
                    if (v.key !== 'html') {
                        localStorage[v.key] = v.value;
                    }
                });
            }

            // check if form exists
            if ($('#settings-pcp').length < 1) {
                console.log('html');
                $('#settings-site-form').prepend(PCP.settingsHtml());
            }

            // append style
            if ($styleEl.length < 1) {
                $('head').append('<style id="pcp-style"></style>');
            }
            $styleEl.html(this.cssStyle());

            $.each(this.colorNames, function (i, v) {
                if (v.key !== 'html') {
                    $('#pcp-' + v.key).val(localStorage[v.key]);
                }
            });
        }
    };


    // init
    PCP.init();

    // reset colors
    $(document).on('click', '#pcp-reset', function () {
        PCP.reset();
    });

    // update colors
    $(document).on('change', '.pcp-color', function () {
        PCP.update();
    });


    // only to add HTML
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

        PCP.init();
    };

})();