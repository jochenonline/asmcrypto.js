function InvalidAlgorithmError () { Error.apply( this, arguments ); }
InvalidAlgorithmError.prototype = new Error;
