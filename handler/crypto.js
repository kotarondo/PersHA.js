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
	syncIO : syncIO,
	asyncIO : asyncIO,
};

function open(name, callback) {
	if (name === 'CipherBase') {
		return new CipherBase();
	}
	if (name === 'DiffieHellman') {
		return new DiffieHellman();
	}
	if (name === 'Hash') {
		return new Hash();
	}
	if (name === 'ECDH') {
		return new ECDH();
	}
	if (name === 'Hmac') {
		return new Hmac();
	}
	if (name === 'Sign') {
		return new Sign();
	}
	if (name === 'Verify') {
		return new Verify();
	}
	if (name === 'Certificate') {
		return new Certificate();
	}
	console.log("[unhandled] crypto open: " + name);
}

function syncIO(func, args) {
	return binding[func].apply(binding, args);
}

function asyncIO(func, args, callback) {
	args.push(callback);
	return binding[func].apply(binding, args);
}

function CipherBase() {
	var obj;
	this.syncIO = function(func, args) {
		if (func === 'restart') {
			obj = new binding.CipherBase(args[0]);
			return;
		}
		return obj[func].apply(obj, args);
	};
}

function DiffieHellman(args, callback) {
	var obj;
	this.syncIO = function(func, args) {
		if (func === 'restart') {
			obj = new binding.DiffieHellman(args[0], args[1]);
			return;
		}
		return obj[func].apply(obj, args);
	};
}

function Hash(args, callback) {
	var obj;
	this.syncIO = function(func, args) {
		if (func === 'restart') {
			obj = new binding.Hash(args[0]);
			return;
		}
		return obj[func].apply(obj, args);
	};
}

function ECDH(args, callback) {
	var obj;
	this.syncIO = function(func, args) {
		if (func === 'restart') {
			obj = new binding.ECDH(args[0]);
			return;
		}
		return obj[func].apply(obj, args);
	};
}

function Hmac(args, callback) {
	var obj;
	this.syncIO = function(func, args) {
		if (func === 'restart') {
			obj = new binding.Hmac();
			return;
		}
		return obj[func].apply(obj, args);
	};
}

function Sign(args, callback) {
	var obj;
	this.syncIO = function(func, args) {
		if (func === 'restart') {
			obj = new binding.Sign();
			return;
		}
		return obj[func].apply(obj, args);
	};
}

function Verify(args, callback) {
	var obj;
	this.syncIO = function(func, args) {
		if (func === 'restart') {
			obj = new binding.Verify();
			return;
		}
		return obj[func].apply(obj, args);
	};
}

function Certificate(args, callback) {
	var obj;
	this.syncIO = function(func, args) {
		if (func === 'restart') {
			obj = new binding.Certificate();
			return;
		}
		return obj[func].apply(obj, args);
	};
}
