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
	syncIO : syncIO,
	asyncIO : asyncIO,
};

var binding = process.binding('cares_wrap');
var GetAddrInfoReqWrap = binding.GetAddrInfoReqWrap;
var GetNameInfoReqWrap = binding.GetNameInfoReqWrap;

function syncIO(func, args) {
	if (func === 'isIP') {
		return binding.isIP.apply(binding, args);
	}
	if (func === 'strerror') {
		return binding.strerror.apply(binding, args);
	}
	if (func === 'getServers') {
		return binding.getServers.apply(binding, args);
	}
	if (func === 'setServers') {
		return binding.setServers.apply(binding, args);
	}
	console.log("[unhandled] cares_wrap syncIO: " + func);
}

function asyncIO(func, args, callback) {
	if (func === 'query') {
		var req = {};
		req.oncomplete = callback;
		binding[args[0]](req, args[1]);
		return;
	}
	if (func === 'getaddrinfo') {
		var req = new GetAddrInfoReqWrap();
		req.oncomplete = callback;
		binding.getaddrinfo(req, args[0], args[1], args[2]);
		return;
	}
	if (func === 'getnameinfo') {
		var req = new GetNameInfoReqWrap();
		req.oncomplete = callback;
		binding.getnameinfo(req, args[0], args[1]);
		return;
	}
	console.log("[unhandled] cares_wrap asyncIO: " + func);
}
