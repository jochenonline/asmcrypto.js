var _api_script_src = null;

if ( _is_crypto_worker ) {
    var op = null;

    function oninit ( algorithm ) {
        if ( op ) throw new IllegalStateError();
        op = new _api_algorithms[algorithm];
    }

    function onreset ( options ) {
        if ( !op ) throw new IllegalStateError();
        op.reset(options);
    }

    function onprocess ( data ) {
        if ( !op ) throw new IllegalStateError();
        op.process(data);
    }

    function onfinish () {
        if ( !op ) throw new IllegalStateError();
        op.finish();
    }

    function onmessage ( e ) {
        var msg = e.data,
            ret;

        switch ( msg[0] ) {
            case 'init':
                oninit( msg[1] )
                ret = [ 'progress' ];
                break;

            case 'reset':
                onreset( msg[1] );
                ret = [ 'progress' ];
                break;

            case 'process':
                onprocess( msg[1] );
                ret = [ 'progress', op.result ];
                break;

            case 'finish':
                onfinish();
                ret = [ 'complete', op.result ];
                break;

            default:
                throw new SyntaxError();
        }

        self.postMessage( ret );
    }

    self.onmessage = onmessage;
}
else {
    var document = global.document,
        script = document.currentScript;
    if ( !script ) {
        var list = document.getElementsByTagName('script');
        script = list[list.length-1];
    }
    _api_script_src = script.src;
}
