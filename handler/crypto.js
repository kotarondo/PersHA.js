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

'use strict'

var binding = process.binding('crypto');

module.exports = {
	open : open,
};

function open(name, args, callback) {
	if (name === 'CipherBase') {
		return new CipherBase();
	}
	if (name === 'DiffieHellman') {
		return new DiffieHellman();
	}
	if (name === 'Hash') {
		return new Hash();
	}
	console.log("[unhandled] crypto open: " + name);
}

function CipherBase() {
	var obj;

	this.syncIO = function(func, args) {
		if (func === 'restart') {
			obj = new binding.CipherBase(args[0]);
			return;
		}
		if (func === 'init') {
			return obj.init.apply(obj, args);
		}
		if (func === 'initiv') {
			return obj.initv.apply(obj, args);
		}
		if (func === 'update') {
			return obj.update.apply(obj, args);
		}
		if (func === 'final') {
			return obj.final.apply(obj, args);
		}
		if (func === 'setAutoPadding') {
			return obj.setAutoPadding.apply(obj, args);
		}
		if (func === 'getAuthTag') {
			return obj.getAuthTag.apply(obj, args);
		}
		if (func === 'setAuthTag') {
			return obj.setAuthTag.apply(obj, args);
		}
		if (func === 'setAAD') {
			return obj.setAAD.apply(obj, args);
		}
		console.log("[unhandled] CipherBase syncIO: " + func);
	};
}

function DiffieHellman(args, callback) {
	var obj;

	this.syncIO = function(func, args) {
		if (func === 'restart') {
			obj = new binding.DiffieHellman(args[0], args[1]);
			return;
		}
		if (func === 'generateKeys') {
			return obj.generateKeys.apply(obj, args);
		}
		if (func === 'computeSecret') {
			return obj.computeSecret.apply(obj, args);
		}
		if (func === 'getPrime') {
			return obj.getPrime.apply(obj, args);
		}
		if (func === 'getGenerator') {
			return obj.getGenerator.apply(obj, args);
		}
		if (func === 'getPublicKey') {
			return obj.getPublicKey.apply(obj, args);
		}
		if (func === 'getPrivateKey') {
			return obj.getPrivateKey.apply(obj, args);
		}
		if (func === 'setPublicKey') {
			return obj.setPublicKey.apply(obj, args);
		}
		if (func === 'setPrivateKey') {
			return obj.setPrivateKey.apply(obj, args);
		}
		console.log("[unhandled] CipherBase syncIO: " + func);
	};
}

function Hash(args, callback) {
	var obj;

	this.syncIO = function(func, args) {
		if (func === 'restart') {
			obj = new binding.Hash(args[0]);
			return;
		}
		if (func === 'update') {
			return obj.update.apply(obj, args);
		}
		if (func === 'digest') {
			return obj.digest.apply(obj, args);
		}
		console.log("[unhandled] Hash syncIO: " + func);
	};
}
