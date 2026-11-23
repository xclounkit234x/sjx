import * as Scramjet from '@mercuryworkshop/scramjet/bundled-wasm';

try {
    const config = {
        ...Scramjet.defaultConfig,
        flags: {
            ...Scramjet.defaultConfig.flags,
            sourcemaps: false
        }
    };
    const context = {
        config,
        prefix: new URL('https://regust.invalid/__scramjet__/'),
        interface: {
            codecEncode: encodeURIComponent,
            codecDecode: decodeURIComponent
        }
    };

    window.__regustRewriteJs = (source, sourceUrl, isModule = false) => {
        const base = new URL(sourceUrl || window.location.href);
        const meta = { origin: new URL(base.origin), base };
        return Scramjet.rewriteJs(String(source), base.href, context, meta, isModule);
    };
    window.__regustReadyResolve();
    delete window.__regustReadyResolve;
    delete window.__regustReadyReject;
} catch (error) {
    window.__regustReadyReject(error);
    throw error;
}
