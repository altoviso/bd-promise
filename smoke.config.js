/* global  define */

(function () {
    let load = [
        './test/test.js'
    ];

    function doConfig(smoke) {
        smoke.configure({
            load,
            remoteUrl: 'http://localhost:8080/altoviso/bd-promise/browser-runner.html?remotelyControlled&root=./',
        });
    }

    if (typeof window !== 'undefined') {
        if (window.require) {
            // AMD
            load = load.map(m => m.replace(/^\./, 'smoke').replace(/\.js$/, ''));
            window.require(['smoke'], doConfig);
        } else {
            // global smoke
            doConfig(window.smoke);
        }
    } else {
        // node
        doConfig(require('./node_modules/bd-smoke/smoke-umd.js'));
    }
}());