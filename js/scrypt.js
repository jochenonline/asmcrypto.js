function scrypt_constructor ( password, n, r, p, options ) {
    options = options || {};
    options.n = options.n || 1024;
    options.r = options.r || 1;
    options.p = options.p || 1;
    // TODO validate n, r, p

    options.length = options.length || hmac_sha256_constructor.HMAC_SIZE;
    options.heapSize = options.length + 128 * options.r * ( options.p + (1 << options.n) + 1 );
    options.heapSize = 4096 * Math.ceil( options.heapSize / 4096 );
    this.hmac = new hmac_sha256_constructor( password, options );
    this.length = options.length;

    this.result = null;

    return this;
}

function scrypt_reset ( password, n, r, p ) {
    this.result = null;
    // TODO validate n, r, p
    this.hmac.reset(password);
    return this;
}

function scrypt_generate ( salt ) {
    if ( this.result !== null )
        throw new Error("Illegal state");

    if ( !salt && typeof salt !== 'string' )
        throw new ReferenceError("Illegal 'salt' value");

    return this;
}

