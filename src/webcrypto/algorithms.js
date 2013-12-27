var _api_algorithms = {
    "SHA-256" : sha256_constructor,
    "HMAC" : hmac_constructor,
    "HMAC-SHA-256" : hmac_sha256_constructor,
    "AES-CBC": cbc_aes_constructor,
    "AES-CBC-ENCRYPT": cbc_aes_encrypt_constructor,
    "AES-CBC-DECRYPT": cbc_aes_decrypt_constructor,
    "AES-CCM": ccm_aes_constructor,
    "AES-CCM-ENCRYPT": ccm_aes_encrypt_constructor,
    "AES-CCM-DECRYPT": ccm_aes_decrypt_constructor,
};

function _api_normalize_algorithm ( algorithm ) {
    if ( !algorithm )
        throw new SyntaxError();

    algorithm = ( algorithm.name || algorithm ).toUpperCase();

    if ( !_api_algorithms.hasOwnProperty(algorithm) )
        throw new InvalidAlgorithmError();

    return algorithm;
}
