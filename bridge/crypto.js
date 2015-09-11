/*
 Copyright (c) 2015, Kotaro Endo.
 All rights reserved.
 
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:
 
 1. Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.
 
 2. Redistributions in binary form must reproduce the above
    copyright notice, this list of conditions and the following
    disclaimer in the documentation and/or other materials provided
    with the distribution.
 
 3. Neither the name of the copyright holder nor the names of its
    contributors may be used to endorse or promote products derived
    from this software without specific prior written permission.
 
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

'use strict';

var binding = process.binding('crypto');
var basePort = new IOPort('crypto');

binding.CipherBase = CipherBase;
binding.DiffieHellman = DiffieHellman;
binding.DiffieHellmanGroup = DiffieHellmanGroup;
binding.Hash = Hash;
binding.ECDH = ECDH;
binding.Hmac = Hmac;
binding.Sign = Sign;
binding.Verify = Verify;
binding.Certificate = Certificate;

binding.setEngine = setEngine;
binding.PBKDF2 = PBKDF2;
binding.randomBytes = randomBytes;
binding.pseudoRandomBytes = pseudoRandomBytes;
binding.getSSLCiphers = getSSLCiphers;
binding.getCiphers = getCiphers;
binding.getHashes = getHashes;
binding.publicEncrypt = publicEncrypt;
binding.privateDecrypt = privateDecrypt;
binding.SSL3_ENABLE = 0;
binding.SSL2_ENABLE = 0;

function CipherBase() {
	this._port = basePort.open('CipherBase');
	this._port.asyncIO('restart', arguments);
}

CipherBase.prototype.init = function() {
	return this._port.syncIO('init', arguments);
};

CipherBase.prototype.initiv = function() {
	return this._port.syncIO('initiv', arguments);
};

CipherBase.prototype.update = function() {
	return this._port.syncIO('update', arguments);
};

CipherBase.prototype.final = function() {
	return this._port.syncIO('final', arguments);
};

CipherBase.prototype.setAutoPadding = function() {
	return this._port.syncIO('setAutoPadding', arguments);
};

CipherBase.prototype.getAuthTag = function() {
	return this._port.syncIO('getAuthTag', arguments);
};

CipherBase.prototype.setAuthTag = function() {
	return this._port.syncIO('setAuthTag', arguments);
};

CipherBase.prototype.setAAD = function() {
	return this._port.syncIO('setAAD', arguments);
};

function DiffieHellman() {
	this._port = basePort.open('DiffieHellman');
	this._port.asyncIO('restart', arguments);
}

DiffieHellman.prototype.generateKeys = function() {
	return this._port.syncIO('generateKeys', arguments);
};

DiffieHellman.prototype.computeSecret = function() {
	return this._port.syncIO('computeSecret', arguments);
};

DiffieHellman.prototype.getPrime = function() {
	return this._port.syncIO('getPrime', arguments);
};

DiffieHellman.prototype.getGenerator = function() {
	return this._port.syncIO('getGenerator', arguments);
};

DiffieHellman.prototype.getPublicKey = function() {
	return this._port.syncIO('getPublicKey', arguments);
};

DiffieHellman.prototype.getPrivateKey = function() {
	return this._port.syncIO('getPrivateKey', arguments);
};

DiffieHellman.prototype.setPublicKey = function() {
	return this._port.syncIO('setPublicKey', arguments);
};

DiffieHellman.prototype.setPrivateKey = function() {
	return this._port.syncIO('setPrivateKey', arguments);
};

function DiffieHellmanGroup() {
	this._port = basePort.open('DiffieHellmanGroup');
	this._port.asyncIO('restart', arguments);
}

DiffieHellmanGroup.prototype.generateKeys = function() {
	return this._port.syncIO('generateKeys', arguments);
};

DiffieHellmanGroup.prototype.computeSecret = function() {
	return this._port.syncIO('computeSecret', arguments);
};

DiffieHellmanGroup.prototype.getPrime = function() {
	return this._port.syncIO('getPrime', arguments);
};

DiffieHellmanGroup.prototype.getGenerator = function() {
	return this._port.syncIO('getGenerator', arguments);
};

DiffieHellmanGroup.prototype.getPublicKey = function() {
	return this._port.syncIO('getPublicKey', arguments);
};

DiffieHellmanGroup.prototype.getPrivateKey = function() {
	return this._port.syncIO('getPrivateKey', arguments);
};

function Hash() {
	this._port = basePort.open('Hash');
	this._port.asyncIO('restart', arguments);
}

Hash.prototype.update = function() {
	return this._port.syncIO('update', arguments);
};

Hash.prototype.digest = function() {
	return this._port.syncIO('digest', arguments);
};

function ECDH() {
	this._port = basePort.open('ECDH');
	this._port.asyncIO('restart', arguments);
}

//TODO ECDH.prototype

function Hmac() {
	this._port = basePort.open('Hmac');
	this._port.asyncIO('restart', arguments);
}

//TODO Hmac.prototype

function Sign() {
	this._port = basePort.open('Sign');
	this._port.asyncIO('restart', arguments);
}

//TODO Sign.prototype

function Verify() {
	this._port = basePort.open('Verify');
	this._port.asyncIO('restart', arguments);
}

//TODO Verify.prototype

function Certificate() {
	this._port = basePort.open('Certificate');
	this._port.asyncIO('restart', arguments);
}

//TODO Certificate.prototype

function retryCall(func, args, callback) {
	if (!callback) {
		return basePort.syncIO(func, args);
	}
	var domain = process.domain;
	(function retry() {
		basePort.asyncIO(func, args, function(err, value) {
			if (err instanceof IOPortError) {
				if (err.message === 'restart') {
					retry();
					return;
				}
			}
			process._MakeCallback(domain, function() {
				callback(err, value);
			});
		});
	})();
};

function setEngine() {
	return basePort.syncIO('setEngine', arguments);
}

function PBKDF2(password, salt, iterations, keylen, digest, callback) {
	return retryCall('PBKDF2', [ password, salt, iterations, keylen, digest ], callback);
}

function randomBytes(size, callback) {
	return retryCall('randomBytes', [ size ], callback);
}

function pseudoRandomBytes(size, callback) {
	return retryCall('pseudoRandomBytes', [ size ], callback);
}

function getSSLCiphers() {
	return basePort.syncIO('getSSLCiphers', arguments);
}

function getCiphers() {
	return basePort.syncIO('getCiphers', arguments);
}

function getHashes() {
	return basePort.syncIO('getHashes', arguments);
}

function publicEncrypt() {
	return basePort.syncIO('publicEncrypt', arguments);
}

function privateDecrypt() {
	return basePort.syncIO('privateDecrypt', arguments);
}
