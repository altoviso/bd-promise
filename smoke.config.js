import {smoke} from './node_modules/bd-smoke/smoke.js';

smoke.configureBrowser({
    load: [
        './test/test.js'
    ]
});
