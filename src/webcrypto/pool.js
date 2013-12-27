/**
 * Worker pool
 * Maintains LRU cache of free workers.
 */

var _pool_workers = {},
    _pool_worker_idleTimeout = 10000;

function _pool_worker_get ( algorithm ) {
    var list = _pool_workers[algorithm];
    if ( list === undefined )
        list = _pool_workers[algorithm] = [];

    var worker;

    if ( list.length > 0 ) {
        worker = list.shift();
        global.clearTimeout( worker.timeout );
        worker.timeout = null;
        return worker;
    }

    worker = new Worker( _api_script_src + '#' + global.escape(algorithm) );

    function onerror () {
        if ( !worker ) return;
        global.clearTimeout( worker.timeout );
        worker.terminate();
        worker = null;
    }

    worker.onerror = onerror;
    worker.algorithm = algorithm;
    worker.timeout = null;

    worker.postMessage( [ 'init', algorithm ] );

    return worker;
}

function _pool_worker_put ( worker ) {
    var list = _pool_workers[worker.algorithm];

    list.unshift(worker);

    function _splice () {
        var i = list.indexOf(worker);
        if ( i > -1 ) list.splice( i, 1 );
        worker.terminate();
        worker = null;
    }

    worker.timeout = global.setTimeout( _splice, _pool_worker_idleTimeout );
}

function _pool_worker_init ( options ) {
    var thiz = this,
        worker = _pool_worker_get( thiz.algorithm );

    function onprogress ( p ) {
        thiz.result = p;
        if ( typeof thiz.onprogress === 'function' )
            thiz.onprogress(p);
    }

    function oncomplete ( r ) {
        _pool_worker_put(worker);
        worker = null;

        thiz.result = r;

        if ( typeof thiz.onprogress === 'function' )
            thiz.onprogress(r);

        if ( typeof thiz.oncomplete === 'function' )
            thiz.oncomplete();
    }

    function onmessage ( e ) {
        var msg = e.data;

        switch ( msg[0] ) {
            case 'progress':
                onprogress(msg[1]);
                break;

            case 'complete':
                oncomplete(msg[1]);
                break;

            default:
                throw new SyntaxError();
        }
    }

    function process ( buffer ) {
        if ( !worker )
            throw new IllegalStateError();

        worker.postMessage( [ 'process', buffer ] );

        return thiz;
    }

    function finish () {
        if ( !worker )
            throw new IllegalStateError();

        worker.postMessage( [ 'finish' ] );

        return thiz;
    }

    function abort () {
        if ( !worker )
            throw new IllegalStateError();

        worker.terminate();
        worker = null;

        return thiz;
    }

    worker.onmessage = onmessage;

    worker.postMessage( [ 'reset', options ] );

    this.process = process;
    this.finish = finish;
    this.abort = abort;
}
