if ( !_is_crypto_worker ) {
    global.InvalidAlgorithmError = InvalidAlgorithmError;

    global.crypto.subtle = {
        digest: api_digest,
        sign: api_sign,
        verify: api_verify,
        encrypt: api_encrypt,
        decrypt: api_decrypt
    };
}
