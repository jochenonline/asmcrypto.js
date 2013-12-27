/*
function api_Key ( type, extractable, algorithm, keyUsage ) {
    this.type = type;
    this.extractable = extractable;
    this.algorithm = algorithm;
    this.keyUsage = keyUsage;
}
*/
function api_CryptoOperation ( algorithm, key ) {
    this.algorithm = algorithm;
    this.key = key ? key : null;
    this.process = this.finish = this.abort = this.onprogress = this.oncomplete = this.onerror = undefined;
    this.result = null;
}

function api_digest ( params, data ) {
    var algorithm = _api_normalize_algorithm(params),
        options = {},
        operation;

    if ( _api_algorithms[algorithm].family !== 'digest' )
        throw new InvalidAlgorithmError();

    if ( typeof params !== 'string' ) {
        var skip = { name: 1 };
        for ( var p in params ) {
            if ( skip[p] ) continue;
            options[p] = params[p];
        }
    }

    var operation = new api_CryptoOperation(algorithm);
    _pool_worker_init.call( operation, options );

    if ( data !== undefined )
        operation.process(data).finish();

    return operation;
}

function api_sign ( params, key, data ) {
    var algorithm = _api_normalize_algorithm(params),
        options = {},
        operation;

    if ( algorithm === 'HMAC' ) {
        var hash_algorithm = params.hash ? _api_normalize_algorithm(params.hash) : 'SHA-256';
        algorithm = _api_normalize_algorithm( algorithm + '-' + hash_algorithm );
    }

    if ( typeof params !== 'string' ) {
        var skip = { name: 1, hash: 1 };
        for ( var p in params ) {
            if ( skip[p] ) continue;
            options[p] = params[p];
        }
    }

    switch ( _api_algorithms[algorithm].family ) {
        case 'hmac':
            options.password = key;
            operation = new api_CryptoOperation( algorithm, key );
            break;

        default:
            throw new InvalidAlgorithmError();
    }

    _pool_worker_init.call( operation, options );

    if ( data !== undefined )
        operation.process(data).finish();

    return operation;
}

function api_verify ( params, key, signature, data ) {
    var algorithm = _api_normalize_algorithm(params),
        options = {},
        operation;

    if ( algorithm === 'HMAC' ) {
        var hash_algorithm = params.hash ? _api_normalize_algorithm(params.hash) : 'SHA-256';
        algorithm = _api_normalize_algorithm( algorithm + '-' + hash_algorithm );
    }

    if ( typeof params !== 'string' ) {
        var skip = { name: 1, hash: 1 };
        for ( var p in params ) {
            if ( skip[p] ) continue;
            options[p] = params[p];
        }
    }

    switch ( _api_algorithms[algorithm].family ) {
        case 'hmac':
            options.password = key;
            options.verify = signature;
            operation = new api_CryptoOperation( algorithm, key );
            break;

        default:
            throw new InvalidAlgorithmError();
    }

    _pool_worker_init.call( operation, options );

    if ( data !== undefined )
        operation.process(data).finish();

    return operation;
}

function api_encrypt ( params, key, data ) {
    var algorithm = _api_normalize_algorithm(params),
        options = {},
        operation;

    if ( typeof params !== 'string' ) {
        var skip = { name: 1 };
        for ( var p in params ) {
            if ( skip[p] ) continue;
            options[p] = params[p];
        }
    }

    switch ( _api_algorithms[algorithm].family ) {
        case 'cipher':
            options.key = key;
            algorithm = _api_normalize_algorithm( algorithm + '-ENCRYPT' );
            operation = new api_CryptoOperation( algorithm, key );
            break;

        default:
            throw new InvalidAlgorithmError();
    }

    if ( data !== undefined )
        options.dataLength = data.byteLength || data.length || 0;

    _pool_worker_init.call( operation, options );

    if ( data !== undefined )
        operation.process(data).finish();

    return operation;
}

function api_decrypt ( params, key, data ) {
    var algorithm = _api_normalize_algorithm(params),
        options = {},
        operation;

    if ( typeof params !== 'string' ) {
        var skip = { name: 1 };
        for ( var p in params ) {
            if ( skip[p] ) continue;
            options[p] = params[p];
        }
    }

    switch ( _api_algorithms[algorithm].family ) {
        case 'cipher':
            options.key = key;
            algorithm = _api_normalize_algorithm( algorithm + '-DECRYPT' );
            operation = new api_CryptoOperation( algorithm, key );
            break;

        default:
            throw new InvalidAlgorithmError();
    }

    if ( data !== undefined )
        options.dataLength = data.byteLength || data.length || 0;

    _pool_worker_init.call( operation, options );

    if ( data !== undefined )
        operation.process(data).finish();

    return operation;
}
