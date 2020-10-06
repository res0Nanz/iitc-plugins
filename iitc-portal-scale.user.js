// ==UserScript==
// @id             iitc-portal-scale
// @name           IITC Plugin: Portal Scale
// @category       Marker
// @version        0.0.1
// @downloadURL    https://raw.githubusercontent.com/res0Nanz/iitc-plugins/main/iitc-portal-scale.user.js
// @description    Rescale Portal Markers
// @include        http://*.ingress.com/intel*
// @include        https://*.ingress.com/intel*
// ==/UserScript==

function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if(typeof window.plugin !== 'function') window.plugin = function() {};
    plugin_info.buildName = 'yuc';
    plugin_info.dateTimeVersion = '20201004.21732';
    plugin_info.pluginId = 'iitc-portal-scale';

    ////////////////////////////////////////////////////////////////////////
    // PLUGIN BEGIN ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////

    // use own namespace for plugin
    window.plugin.portalScale = function() {};
    window.plugin.portalScale.KEY_STORAGE = 'plugin-portal-scale';

    window.plugin.portalScale.saveScale = function () {
        if (typeof this.scale != "number"
            || this.scale > 2 || this.scale < 0.1) {
            this.scale = 1;
        }
        localStorage[this.KEY_STORAGE] = this.scale;
    }

    window.plugin.portalScale.scale = Number(localStorage[window.plugin.portalScale.KEY_STORAGE]);
    window.plugin.portalScale.saveScale();

    window.plugin.portalScale.updateScale = function (value) {
        this.scale = value;
        var scaleTextElement = document.getElementById('portalScaleText');
        if (typeof scaleTextElement != undefined) {
            scaleTextElement.innerHTML=value;
        }
        window.resetHighlightedPortals();
    }

    /**********************************************************************/
    /** OPTIONS ***********************************************************/
    /**********************************************************************/
    window.plugin.portalScale.manualOpt = function() {
        var currentScaleValue = Math.floor(10 * this.scale);
        dialog({
            html: '<div id="portalScaleSetbox"><input type="range" min="1" max="20" value="'
            + currentScaleValue + '"'
            + ' oninput="window.plugin.portalScale.updateScale(this.value/10);"'
            + ' onchange="window.plugin.portalScale.saveScale();">'
            + '<span id="portalScaleText">' + currentScaleValue/10 + '</span>',
            dialogClass: 'ui-dialog',
            title: 'Portal Scale Options'
        });
    }
    window.plugin.portalScale.htmlCallSetBox = '<a onclick="window.plugin.portalScale.manualOpt();return false;">Portal Scale</a>';

    /**********************************************************************/
    /** SETUP *************************************************************/
    /**********************************************************************/
    function setup() {
        window.addHook('iitcLoaded', function() {
            window.plugin.portalScale.originalScaleFcn = window.portalMarkerScale;
            window.portalMarkerScale = () => window.plugin.portalScale.originalScaleFcn() * window.plugin.portalScale.scale;
        });

        $('#toolbox').append(window.plugin.portalScale.htmlCallSetBox);
    }
    
    ////////////////////////////////////////////////////////////////////////
    // PLUGIN END //////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////

    setup.info = plugin_info; //add the script info data to the function as a property
    if(!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    // if IITC has already booted, immediately run the 'setup' function
    if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script'); var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
