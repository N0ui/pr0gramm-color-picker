// ==UserScript==
// @name		 pcp - pr0gramm color picker
// @author		 N0ui
// @namespace	 pcp
// @include		 *://pr0gramm.com*
// @version		 1.9
// @updateURL	 https://raw.githubusercontent.com/N0ui/pr0gramm-color-picker/master/pcp.user.js
// @downloadURL	 https://raw.githubusercontent.com/N0ui/pr0gramm-color-picker/master/pcp.user.js
// @copyright	 2015+, N0ui
// @icon		 http://pr0gramm.com/media/pr0gramm-favicon.png
// @grant        none
// @run-at       document-end
// ==/UserScript==

// by mopsalarm
var pu = {
    addRoute: function (path, view) {
        p.addRoute(view, path);
        var tmpRoute = p._routes[p._routes.length - 2];
        p._routes[p._routes.length - 2] = p._routes[p._routes.length - 1];
        p._routes[p._routes.length - 1] = tmpRoute;

        if (p.getURL() === path) {
            p.navigateTo(path, p.NAVIGATE.FORCE);
        }
    }
};
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


    // theme array
    theming: [{
        name: 'Angenehmes Grün',
        data: [{
            key: 'main-color',
            value: '#1db992'
            }]
        }, {
        name: 'Olivgrün des Friedens',
        data: [{
            key: 'main-color',
            value: '#B0AD05'
            }]
        }, {
        name: 'Altes Pink',
        data: [{
            key: 'main-color',
            value: '#FF0082'
            }]
        }, {
        name: 'Altschwuchtel Grün',
        data: [{
            key: 'main-color',
            value: '#5BB91C'
            }]
        }, {
        name: 'Mega Episches Blau',
        data: [{
            key: 'main-color',
            value: '#008FFF'
            }]
        }, {
        name: 'Aggressionsförderndes Dunkelgelb',
        data: [{
            key: 'main-color',
            value: '#FF9900'
            }]
        }, {
        name: 'Lebhaftes Limettengrün',
        data: [{
            key: 'main-color',
            value: '#b9cc5a'
            }]
        }, {
        name: 'Wohliges Warmgelb',
        data: [{
            key: 'main-color',
            value: '#e3af12'
            }]
        }, {
        name: 'Sonniges Steppenrot',
        data: [{
            key: 'main-color',
            value: '#cc674b'
            }]
        }, {
        name: 'Samtweiches Stahlweiß',
        data: [{
            key: 'main-color',
            value: '#b0b0b0'
            }]
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
    // check if hex color is valid
    // http://stackoverflow.com/questions/8027423/how-to-check-if-a-string-is-a-valid-hex-color-representation?answertab=active#tab-top
    isValidateHex(value) {
        return /^#([A-Fa-f0-9]{3}$)|([A-Fa-f0-9]{6}$)/.test(value) && value.length === 7;
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
        var $styleEl = $('#pcp-style'),
            cssStr = '',
            logoSvg = '';

        cssStr += 'html, body, h3, .tab-bar a, .head-link, #search-submit-inline, .user, .user-score, #inboxLink.empty {color: ' + localStorage["main-font-color"] + ';}';
        cssStr += 'input.box-from-label:checked + label:before {background-color: ' + localStorage["main-font-color"] + ';}input.box-from-label + label:before {border: 1px solid ' + localStorage["main-font-color"] + ';}';
        cssStr += '#filter-save,.confirm-button,span.user-comment-op, input[type=button], input[type=submit],.filter-setting.active .filter-check, .loader > div, div.stream-next:hover span.stream-next-icon, div.stream-prev:hover span.stream-prev-icon, .user-follow, .user-unfollow {';
        cssStr += 'background-color: ' + this.colorLuminance(localStorage["main-color"], -0.1) + ';}';
        cssStr += '#filter-save:hover{background-color: ' + localStorage["main-color"] + ';}';
        cssStr += '.filter-setting.active .filter-check, #upload-droparea {';
        cssStr += 'border: 1px solid ' + localStorage["main-color"] + ';}';
        cssStr += 'div.overlay-tabs span.overlay-link:hover, div.overlay-tabs span.active,#upload-droparea.active, #key-indicator, a.item-fullsize-link:hover, .vote-up:hover, .voted-down .vote-up:hover, .voted-up .vote-up:hover, .voted-up .vote-up, a.bookmarklet, #search-submit-inline:hover, #settings-logout-link,.action,.filter-setting.active .filter-name,.head-link:hover,.tab-bar a:hover, .tab-bar a.active,a.head-tab.active, a.head-tab:hover,a#inboxLink, a#inboxLink, #inboxLink.empty:hover,.head-link:hover, div.tagsinput span.tag a, .vote-fav.faved, .vote-fav:hover {';
        cssStr += 'color: ' + localStorage["main-color"] + ';}';
        cssStr += 'a, .link, a.user:hover, a.tag-link:hover, span.tag.voted-down a.tag-link:hover {';
        cssStr += 'color: ' + localStorage["link-color"] + ';}';
        cssStr += 'a:hover, .link:hover, .action:hover {';
        cssStr += 'color: ' + localStorage["link-color-hover"] + ';}';
        cssStr += '.confirm-button, input[type=button], input[type=submit], .user-follow, .user-unfollow {';
        cssStr += 'color: ' + localStorage["btn-color"] + ';}';
        cssStr += '.warn{';
        cssStr += 'color: ' + localStorage["warn-color"] + ';}';
        cssStr += '.confirm-button:hover, input[type=button]:hover, input[type=button]:focus, input[type=submit]:hover, input[type=submit]:focus {background-color: ' + localStorage["link-color-hover"] + ';}';
        cssStr += 'input[type=button].cancel, input[type=button]:disabled, input[type=submit]:disabled, input[type=submit].cancel {';
        cssStr += 'background-color: ' + localStorage["cancelBtn-bg-color"] + ';color: ' + localStorage["cancelBtn-color"] + ';}';
        cssStr += '.confirm-button:hover, input[type=button]:hover, input[type=button]:focus, input[type=submit]:hover, input[type=submit]:focus, .user-follow:hover, .user-unfollow:hover {';
        cssStr += 'background-color: ' + localStorage["btn-hover-bg-color"] + '; color:  ' + localStorage["btn-hover-color"] + ';}';
        cssStr += 'span.tag {background-color: ' + localStorage["tag-bg-color"] + ' !important;}';
        cssStr += 'a.tag-link {color: ' + localStorage["tag-color"] + ';}';
        cssStr += 'div.video-position {background-color: ' + localStorage["video-bg-color"] + ';}';
        cssStr += '.tab-bar span, .user-stats, div.comment-foot {color: ' + localStorage["second-main-font-color"] + ';}';
        cssStr += 'a.head-tab {color: ' + this.colorLuminance(localStorage["second-main-font-color"], 0.2) + ';}';
        cssStr += 'html, body, div.item-container {background-color: ' + localStorage["bg-color"] + ';}';
        cssStr += '#footer-links {background-color: transparent;}';
        cssStr += '#footer-links a {color: ' + localStorage["second-main-font-color"] + ' !important;}#footer-links a:hover {color: ' + localStorage["link-color-hover"] + '!important;}';
        cssStr += '#head-content {background-color: ' + this.convertHex(this.colorLuminance(localStorage["bg-color"], -0.6), 80) + ';}';
        cssStr += 'input, textarea {background-color: ' + this.colorLuminance(localStorage["bg-color"], 0.3) + ';}';
        cssStr += 'input:focus, textarea:focus {background-color: ' + this.colorLuminance(localStorage["bg-color"], 0.4) + ';}';
        cssStr += 'div.comment-foot, div.comment-box div.comment-box {border-color: ' + this.colorLuminance(localStorage["bg-color"], -0.3) + ';}';
        cssStr += 'input.q {background-color: ' + this.convertHex(this.colorLuminance(localStorage["bg-color"], 0.4), 80) + ';}';
        cssStr += 'div.product-description {background-color: ' + this.colorLuminance(localStorage["bg-color"], 0.4) + ';}';
        cssStr += '#pr0gramm-logo-link svg{width: 121px;}#pr0gramm-logo-link svg path,#pr0gramm-logo-link svg polygon,#pr0gramm-logo-link svg rect{fill:' + localStorage["main-font-color"] + '}#pr0gramm-logo-link svg .pr0-sign{fill:' + localStorage["main-color"] + '}';
        cssStr += '.pcp-input-outer {display:blofck;margin: 0 0 10px 0;}.pcp-label {width: 40%; display:inline-block !important;}.pcp-color{padding: 0;height:26px;width: 24px;display: inline-block;border: 0;background-color:transparent;}#pcp-reset {background-color: #A21F1F;display: inline-block;padding: 10px 20px;cursor:pointer;}';
        cssStr += '.pcp-theme-list {lists-style: none; margin: 0; padding: 0;}.pcp-theme-list .pcp-theme-btn {display: inline-block; margin: 0 25px 25px 0; padding: 10px 15px; border: 1px solid #fff; cursor: pointer;} .pcp-color-input {width: 150px;display:inline-block; margin-left: 20px;}';

        // userscript styles fot "pr0gramm.com Dick by Seglors"
        cssStr += '.stream-next:hover, .stream-prev:hover {color: ' + localStorage["main-color"] + ' !important;}#com-top.active, #com-top:hover, #com-new.active, #com-new:hover{color:' + localStorage["main-color"] + ' !important;}';
        cssStr += '.opuser .user:before{background-color:' + localStorage["main-color"] + ' !important;color: ' + localStorage["main-font-color"] + ' !important;}.comment-content a .preview, .comment-content a .preview {border-color:' + localStorage["main-color"] + ' !important;}.comment-content a .preview:before, .comment-content a .preview:after {border-color:' + localStorage["main-color"] + ' transparent !important;}.custom_seen::after {background: ' + this.convertHex(localStorage["main-color"], 70) + ' !important;}';

        // cust0m pr0gramm 2.0
        cssStr += 'div.stream-next:hover span.cust0m_stream-next-icon, div.stream-prev:hover span.cust0m_stream-prev-icon,.cust0m_menu:hover, .cust0m_menu.active, .cust0m_trigger.active, .cust0m_trigger:hover, .cust0m_button:hover {color:' + localStorage["main-color"] + ' !important;}div.comment-op div.comment-foot, .comment-foot.custom_op{border-bottom-color:' + localStorage["main-color"] + ' !important;}';
        cssStr += '.highcharts-series path{stroke:' + localStorage["main-color"] + '; stroke-width: 2px;}.highcharts-markers.highcharts-tracker path{fill:' + localStorage["main-color"] + ';}.highcharts-tooltip path:nth-child(4) {stroke:' + localStorage["main-color"] + '; stroke-width: 1px;}.highcharts-series-group:first-child path {fill: #000;}';

        //kfav
        cssStr += '.kfav-save:hover {color:' + localStorage["main-color"] + ' !important;}';

        // op highlight
        cssStr += '.extension-is-op .user:before {background-color:' + localStorage["main-color"] + ' !important;}';

        // visitenkarte
        cssStr += '.user.profile > .extended > ul > li > span > span:last-child {color:' + localStorage["main-color"] + ' !important;}';

        // svg
        logoSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1820.8 277.8" style="enable-background:new 0 0 1820.8 277.8;" xml:space="preserve">';
        logoSvg += '<rect x="11" y="34" class="st0" width="237" height="198"></rect><g><path d="M464.8,31.8h-73.9h-29.2V221h29.2v-68h71.9c0,0,47.3-3.9,47.3-61.6C510.1,33.7,464.8,31.8,464.8,31.8z M460.3,121.8h-69.3 v-59h66.7c0,0,21.4,2.6,21.4,29.5C479,119.2,460.3,121.8,460.3,121.8z"/>';
        logoSvg += '<path d="M669.5,199.6c-4-6.2-42.8-51.8-42.8-51.8s47.3-1.9,47.3-59.6c0-57.7-45.4-56.4-45.4-56.4h-69.3h-29.2V221h29.2v-73.2h25.9 c0,0,19.5,18.1,30,30.9c11.4,13.9,37.6,46.2,48.4,46.2c14.9,0,15.5,0,15.5,0v-23.3C679.2,201.5,671.5,202.6,669.5,199.6z M559.4,116.7V62.9h62.2c0,0,21.4-0.6,21.4,26.2s-18.8,27.5-18.8,27.5H559.4z"/>';
        logoSvg += '<path d="M1181.7,199.6c-4-6.2-42.8-51.8-42.8-51.8s47.3-1.9,47.3-59.6c0-57.7-45.4-56.4-45.4-56.4h-69.3h-29.2V221h29.2v-73.2h25.9 c0,0,19.5,18.1,30,30.9c11.4,13.9,37.6,46.2,48.4,46.2c14.9,0,15.5,0,15.5,0v-23.3C1191.4,201.5,1183.6,202.6,1181.7,199.6z M1071.5,116.7V62.9h62.2c0,0,21.4-0.6,21.4,26.2s-18.8,27.5-18.8,27.5H1071.5z"/>';
        logoSvg += '<path d="M1313.5,31.8h-32.4h-3.9l-70,189.2h33.7l20.9-54.4h71l20.9,54.4h33.7l-70-189.2H1313.5z M1271.7,140.9l25.7-66.9l25.7,66.9 H1271.7z"/>';
        logoSvg += '<polygon points="1569.5,31.8 1557.8,31.8 1503.7,161 1449.6,31.8 1440.5,31.8 1413.3,31.8 1411.4,31.8 1411.4,221 1440.5,221 1440.5,94.5 1485.9,198.9 1487.8,198.9 1519.6,198.9 1521.5,198.9 1569.5,88.5 1569.5,221 1598.6,221 1598.6,31.8 1594.1,31.8"/>';
        logoSvg += '<polygon points="1816.3,31.8 1791.7,31.8 1780,31.8 1725.9,161 1671.8,31.8 1662.7,31.8 1635.5,31.8 1633.6,31.8 1633.6,221 1662.7,221 1662.7,94.5 1708.1,198.9 1710,198.9 1741.8,198.9 1743.7,198.9 1791.7,88.5 1791.7,221 1820.8,221 1820.8,31.8"/>';
        logoSvg += '<path d="M944.3,58.3c19.9,0,41.9,15.5,41.9,15.5l21.7-19c-17.2-17.7-45.9-23.1-45.9-23.1s-22-6.3-55.7,2.4 c-33.7,8.6-48.8,48.4-48.8,48.4s-15.5,47.1-1.7,85.5c13.8,38.4,52.7,59.6,88.6,59.6c35.9,0,63.5-19.4,63.5-19.4v-13.1v-7.2v-32.4 v-29.2h-29.2h-34.4v29.2h34.4v31.5c0,0-31.8,15.5-55.8,5.2c-37.2-16.1-38.7-28.9-38.7-75.6S924.4,58.3,944.3,58.3z"/>';
        logoSvg += '<path d="M763.7,31.8c0,0-47.5-3.6-62.2,58c-12.4,52.2,0.5,87.1,15.5,110.7c7.3,11.4,27.7,27.2,46.6,27.2c28.9,0,43-15.8,48.8-24.2 c10.8-15.5,21.6-30.2,21.6-75.2c0-44.9-14.7-65.4-14.7-65.4S806.4,31.8,763.7,31.8z M794.1,174.7c-4,7.4-12.5,22.1-28.4,22.1 s-25.1-15-28.9-23.5c-5.9-13-14.6-31.5-6.3-72.1c8.3-40.6,34.1-38.3,34.1-38.3c23.5,0,30.6,20.5,30.6,20.5s8.1,13.6,8.1,43.2 C803.2,156.3,800.2,163.4,794.1,174.7z"/>';
        logoSvg += '<path class="pr0-sign" d="M277.8,11.9c0-0.4,0-0.9,0-1.3c0-1.9-0.6-3.8-1.6-5.4c-2.3-3.6-5.6-5.2-9.8-5.2c-85,0-170,0-255,0c-0.2,0-0.4,0-0.6,0 C9,0,7.3,0.4,5.8,1.3C1.9,3.4,0,6.8,0,11.2c0,76.5,0,153.1,0,229.6c0,8.7,0,17.4,0,26.1c0,2.2,0.6,4.3,1.9,6.1 c2.3,3.2,5.4,4.8,9.4,4.8c85.1,0,170.2,0,255.3,0c0.3,0,0.5,0,0.8,0c2.7-0.1,5-1,6.9-2.8c2.5-2.3,3.5-5.1,3.5-8.5 c0-42.5,0-85.1,0-127.6C277.8,96.6,277.8,54.2,277.8,11.9z M68.9,206.5c-2.8,2.4-6,4.1-9.8,4.5c-3.7,0.4-6.9-0.5-9.4-3.6 c-0.7-0.9-1.4-1.7-2.1-2.6c-2.6-2.8-3-6.1-2.1-9.7c1-3.6,3-6.5,5.8-8.9c15.5-13,30.9-26,46.4-39c5-4.2,10-8.4,15-12.6 c0.1-0.1,0.2-0.2,0.4-0.3c-2.4-2.1-4.8-4.2-7.2-6.3c-17.8-15.5-35.7-31-53.5-46.5c-3.1-2.7-5.3-5.9-6.1-10 c-0.6-3.2-0.1-6.1,2.2-8.6c0.8-0.9,1.6-1.8,2.4-2.7c2.2-2.7,5.1-3.7,8.4-3.5c3.9,0.2,7.2,1.7,10.1,4.2c6.3,5.3,12.5,10.8,18.7,16.2 c17.4,15.1,34.8,30.2,52.2,45.3c2.4,2.1,4.4,4.5,5.7,7.3c1.7,3.7,1.5,7.3-0.7,10.9c-2.4,4-6,6.6-9.5,9.5 C113.6,168.9,91.2,187.7,68.9,206.5z M228.4,200.9c0,1.5-0.4,1.9-1.9,1.9c-14.2,0-28.3,0-42.5,0c-14.2,0-28.4,0-42.5,0 c-1.5,0-1.9-0.4-1.9-2c0-7,0-13.9,0-20.9c0-1.6,0.4-2,2-2c28.3,0,56.6,0,85,0c1.5,0,1.9,0.5,1.9,2 C228.4,186.9,228.4,193.9,228.4,200.9z"/></g></svg>';


        // add logo
        $('#pr0gramm-logo-link').html(logoSvg);


        // check if style tag is set
        if ($styleEl.length < 1) {
            $('body').append('<style id="pcp-style"></style>');
        }

        // insert css into style tag
        $styleEl.html(cssStr);
    },
    // html form
    settingsHtml: function () {
        var settingsHtmlStr = '',
            themeHtml = '';
        settingsHtmlStr += '<div class="form-section" id="settings-pcp">';
        settingsHtmlStr += '<h2>pr0gramm Farben</h2> <h3>Stell einfach deine Farben ein</h3>';
        $.each(this.colorNames, function (i, v) {
            if (v.key !== 'html') {
                settingsHtmlStr += '<div class="pcp-input-outer"><div class="pcp-label" for="pcp-' + v.key + '">' + v.desc + '</div>';
                settingsHtmlStr += '<input type="color" class="pcp-color" id="pcp-' + v.key + '">';
                settingsHtmlStr += '<input type="text" class="pcp-color-input" id="pcp-' + v.key + '-input"></div>';
            } else {
                settingsHtmlStr += v.html;
            }
        });

        settingsHtmlStr += '<br><br><h2>theming</h2><ul class="pcp-theme-list">';
        $.each(this.theming, function (i, v) {
            themeHtml += '<li class="pcp-theme-btn" style="color: ' + v.data[0].value + '; border-color: ' + v.data[0].value + '">' + v.name + '</li>';
        });
        themeHtml += '</ul>';

        settingsHtmlStr += themeHtml;
        settingsHtmlStr += '<hr><br><div id="pcp-reset">Alle Farben zurücksetzen (bewährtes Orange)</div><br><br><hr>';
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
    update: function (_isInit, _isInputUpdate) {
        if (_isInit) {
            $('#pcp-style').html(this.cssStyle());
        }
        $.each(this.colorNames, function (i, v) {
            if (v.key !== 'html') {
                if (!_isInit) {
                    if (_isInputUpdate && PCP.isValidateHex($('#pcp-' + v.key + '-input').val())) {
                        localStorage[v.key] = $('#pcp-' + v.key + '-input').val();
                    } else {
                        localStorage[v.key] = $('#pcp-' + v.key).val();
                    }
                }

                $('#pcp-' + v.key).val(localStorage[v.key].toLowerCase());
                $('#pcp-' + v.key + '-input').val(localStorage[v.key].toLowerCase());
            }
        });
        if (!_isInit) {
            $('#pcp-style').html(this.cssStyle());
        }
    },
    // set theme
    setTheme: function (e) {
        var $element = $(e.currentTarget);

        if (typeof PCP.theming[$element.index()] !== 'undefined') {
            $.each(PCP.theming[$element.index()].data, function (i, v) {
                localStorage[v.key] = v.value;
            });
        }

        PCP.update(true, false);
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
            $('#settings-site-form').prepend(PCP.settingsHtml());
        }

        // append style
        if ($styleEl.length < 1) {
            $('body').append('<style id="pcp-style"></style>');
        }

        this.update(true, false);
    }
};

var PCPload = function () {
    // override native theming
    p.User.prototype.loadTheme = function () {
        $('#theme-style').remove();
    };

    // by mopsalarm
    $("#footer-links div").append("<a id='tab-theming' class='head-tab' href='#theming'>theming</a>");
    var link = $("#tab-theming");
    if (p._hasPushState) {
        link.each(function () {
            this.href = '/' + $(this).attr('href').substr(1);
        });
    }
    link.fastclick(p.mainView.handleHashLink.bind(p.mainView));


    
    // add theme route
    pu.addRoute('theming', p.View.Base.extend({
        template: '<h1><h1 class="pane-head user-head">pr0gramm theming</a></h1><div class="theming-section">' + PCP.settingsHtml() + '</div>',
        init: function (container, parent) {
            this.parent(container, parent);
            p.mainView.setTab("theming");

            this.render();
        },
        load: function () {
            // reset colors
            $(document).on('click', '#pcp-reset', function () {
                PCP.reset();
            });

            // update colors
            $(document).on('change', '.pcp-color', function () {
                PCP.update(false, false);
            });

            // update input color
            $(document).on('focusout', '.pcp-color-input', function () {
                PCP.update(false, true);
            });

            // set theme
            $(document).on('click', '.pcp-theme-btn', PCP.setTheme);

            
            this.render();
            PCP.init();
            return false;
        },
        loaded: function () {
            this.render();
            return false;
        }
    }));
    
    PCP.init();

    // replace main color
    $('body').on("click", ".kfav-save", function () {
        $("style").not('#pcp-style').html(function (_, html) {
            return html.replace(/#ee4d2e/g, localStorage["main-color"]);
        });
    });

    
    $("style").not('#pcp-style').html(function (_, html) {
        return html.replace(/#ee4d2e/g, localStorage["main-color"]);
    });
};


$(function () {
    PCPload();
});