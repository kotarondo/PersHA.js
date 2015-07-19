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

module.exports = {
	open : open,
	syncIO : syncIO,
	asyncIO : asyncIO,
};

function open(name, args, callback) {
	if (name === 'Hash') {
		return new Hash(args, callback);
	}
	console.log("[unhandled] crypto open:" + name);
	console.log(args);
}

function syncIO(name, args) {
	console.log("[unhandled] crypto syncIO:" + name);
	console.log(args);
}

function asyncIO(name, args, callback) {
	console.log("[unhandled] crypto asyncIO:" + name);
	console.log(args);
	callback();
}

function Hash(args, callback) {
	var Hash = process.binding('crypto').Hash;

	var obj = new Hash(args[0]);

	this.syncIO = function(name, args) {
		if (name === 'update') {
			return obj.update.apply(obj, args);
		}
		if (name === 'digest') {
			return obj.digest.apply(obj, args);
		}
		console.log("[unhandled] Hash syncIO:" + name);
		console.log(args);
	};
	this.asyncIO = function(name, args, callback) {
		console.log("[unhandled] Hash asyncIO:" + name);
		console.log(args);
		callback();
	};
}
