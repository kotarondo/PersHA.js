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

var crypto = process.binding('crypto');
var cryptoPort = new IOPort('crypto');

crypto.SecureContext = function() {
	process._debug("crypto.SecureContext TODO ");
};

crypto.Connection = function() {
	process._debug("crypto.Connection TODO ");
};

crypto.CipherBase = function() {
	var self = this;
	self._port = cryptoPort.open('CipherBase', arguments, portEventCallback);

	function portEventCallback(name, args) {
		process._debug("binding[crypto] port event " + name);
		if (name instanceof IOPortError) {
			return;
		}
		self[name].apply(self, args);
	}
};

crypto.CipherBase.prototype.init = function() {
	return this._port.syncIO('init', arguments);
};

crypto.CipherBase.prototype.initiv = function() {
	return this._port.syncIO('initv', arguments);
};

crypto.CipherBase.prototype.update = function() {
	return this._port.syncIO('update', arguments);
};

crypto.CipherBase.prototype.final = function() {
	return this._port.syncIO('final', arguments);
};

crypto.CipherBase.prototype.setAutoPadding = function() {
	return this._port.syncIO('setAutoPadding', arguments);
};

crypto.CipherBase.prototype.getAuthTag = function() {
	return this._port.syncIO('getAuthTag', arguments);
};

crypto.CipherBase.prototype.setAuthTag = function() {
	return this._port.syncIO('setAuthTag', arguments);
};

crypto.CipherBase.prototype.setAAD = function() {
	return this._port.syncIO('setAAD', arguments);
};

crypto.DiffieHellman = function() {
	var self = this;
	self._port = cryptoPort.open('DiffieHellman', arguments, portEventCallback);

	function portEventCallback(name, args) {
		process._debug("binding[crypto] port event " + name);
		if (name instanceof IOPortError) {
			return;
		}
		self[name].apply(self, args);
	}
};

crypto.DiffieHellman.prototype.generateKeys = function() {
	return this._port.syncIO('generateKeys', arguments);
};

crypto.DiffieHellman.prototype.computeSecret = function() {
	return this._port.syncIO('computeSecret', arguments);
};

crypto.DiffieHellman.prototype.getPrime = function() {
	return this._port.syncIO('getPrime', arguments);
};

crypto.DiffieHellman.prototype.getGenerator = function() {
	return this._port.syncIO('getGenerator', arguments);
};

crypto.DiffieHellman.prototype.getPublicKey = function() {
	return this._port.syncIO('getPublicKey', arguments);
};

crypto.DiffieHellman.prototype.getPrivateKey = function() {
	return this._port.syncIO('getPrivateKey', arguments);
};

crypto.DiffieHellman.prototype.setPublicKey = function() {
	return this._port.syncIO('setPublicKey', arguments);
};

crypto.DiffieHellman.prototype.setPrivateKey = function() {
	return this._port.syncIO('setPrivateKey', arguments);
};

crypto.DiffieHellmanGroup = function() {
	var self = this;
	self._port = cryptoPort.open('DiffieHellmanGroup', arguments, portEventCallback);

	function portEventCallback(name, args) {
		process._debug("binding[crypto] port event " + name);
		if (name instanceof IOPortError) {
			return;
		}
		self[name].apply(self, args);
	}
};

crypto.DiffieHellmanGroup.prototype.generateKeys = function() {
	return this._port.syncIO('generateKeys', arguments);
};

crypto.DiffieHellmanGroup.prototype.computeSecret = function() {
	return this._port.syncIO('computeSecret', arguments);
};

crypto.DiffieHellmanGroup.prototype.getPrime = function() {
	return this._port.syncIO('getPrime', arguments);
};

crypto.DiffieHellmanGroup.prototype.getGenerator = function() {
	return this._port.syncIO('getGenerator', arguments);
};

crypto.DiffieHellmanGroup.prototype.getPublicKey = function() {
	return this._port.syncIO('getPublicKey', arguments);
};

crypto.DiffieHellmanGroup.prototype.getPrivateKey = function() {
	return this._port.syncIO('getPrivateKey', arguments);
};

crypto.ECDH = function() {
	var self = this;
	self._port = cryptoPort.open('ECDH', arguments, portEventCallback);

	function portEventCallback(name, args) {
		process._debug("binding[crypto] port event " + name);
		if (name instanceof IOPortError) {
			return;
		}
		self[name].apply(self, args);
	}

}

crypto.Hmac = function() {
	var self = this;
	self._port = cryptoPort.open('Hmac', arguments, portEventCallback);

	function portEventCallback(name, args) {
		process._debug("binding[crypto] port event " + name);
		if (name instanceof IOPortError) {
			return;
		}
		self[name].apply(self, args);
	}

};

crypto.Hash = function() {
	var self = this;
	self._port = cryptoPort.open('Hash', arguments, portEventCallback);

	function portEventCallback(name, args) {
		process._debug("binding[crypto] port event " + name);
		if (name instanceof IOPortError) {
			return;
		}
		self[name].apply(self, args);
	}
};

crypto.Hash.prototype.update = function() {
	return this._port.syncIO('update', arguments);
};

crypto.Hash.prototype.digest = function() {
	return this._port.syncIO('digest', arguments);
};

crypto.Sign = function() {
	var self = this;
	self._port = cryptoPort.open('Sign', arguments, portEventCallback);

	function portEventCallback(name, args) {
		process._debug("binding[crypto] port event " + name);
		if (name instanceof IOPortError) {
			return;
		}
		self[name].apply(self, args);
	}

};

crypto.Verify = function() {
	var self = this;
	self._port = cryptoPort.open('Verify', arguments, portEventCallback);

	function portEventCallback(name, args) {
		process._debug("binding[crypto] port event " + name);
		if (name instanceof IOPortError) {
			return;
		}
		self[name].apply(self, args);
	}

};

crypto.Certificate = function() {
	var self = this;
	self._port = cryptoPort.open('Certificate', arguments, portEventCallback);

	function portEventCallback(name, args) {
		process._debug("binding[crypto] port event " + name);
		if (name instanceof IOPortError) {
			return;
		}
		self[name].apply(self, args);
	}

};

crypto.setEngine = function() {
	process._debug("crypto.setEngine TODO ");
}

crypto.PBKDF2 = function() {
	process._debug("crypto.PBKDF2 TODO ");
}

crypto.randomBytes = function() {
	process._debug("crypto.randomBytes TODO ");
}

crypto.pseudoRandomBytes = function() {
	process._debug("crypto.pseudoRandomBytes TODO ");
}

crypto.getSSLCiphers = function() {
	process._debug("crypto.getSSLCiphers TODO ");
}

crypto.getCiphers = function() {
	process._debug("crypto.getCiphers TODO ");
}

crypto.getHashes = function() {
	process._debug("crypto.getHashes TODO ");
}

crypto.publicEncrypt = function() {
	process._debug("crypto.publicEncrypt TODO ");
}

crypto.privateDecrypt = function() {
	process._debug("crypto.privateDecrypt TODO ");
}

crypto.SSL3_ENABLE = 0;
crypto.SSL2_ENABLE = 0;
