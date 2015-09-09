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

var binding = process.binding('cares_wrap');
var caresPort = new IOPort('cares_wrap');

function asyncCall(req, name, args) {
	(function retry() {
		caresPort.asyncIO(name, args, function(err, value) {
			if (err instanceof IOPortError) {
				if (err.message === 'restart') {
					retry();
					return;
				}
			}
			process._MakeCallback(req.domain, function() {
				req.oncomplete(err, value);
			});
		});
	})();
};

binding.queryA = function(req, name) {
	req.domain = process.domain;
	asyncCall(req, 'query', [ 'queryA', name ]);
};

binding.queryAaaa = function(req, name) {
	req.domain = process.domain;
	asyncCall(req, 'query', [ 'queryAaaa', name ]);
};

binding.queryCname = function(req, name) {
	req.domain = process.domain;
	asyncCall(req, 'query', [ 'queryCname', name ]);
};

binding.queryMx = function(req, name) {
	req.domain = process.domain;
	asyncCall(req, 'query', [ 'queryMx', name ]);
};

binding.queryNs = function(req, name) {
	req.domain = process.domain;
	asyncCall(req, 'query', [ 'queryNs', name ]);
};

binding.queryTxt = function(req, name) {
	req.domain = process.domain;
	asyncCall(req, 'query', [ 'queryTxt', name ]);
};

binding.querySrv = function(req, name) {
	req.domain = process.domain;
	asyncCall(req, 'query', [ 'querySrv', name ]);
};

binding.queryNaptr = function(req, name) {
	req.domain = process.domain;
	asyncCall(req, 'query', [ 'queryNaptr', name ]);
};

binding.querySoa = function(req, name) {
	req.domain = process.domain;
	asyncCall(req, 'query', [ 'querySoa', name ]);
};

binding.getHostByAddr = function(req, name) {
	req.domain = process.domain;
	asyncCall(req, 'query', [ 'getHostByAddr', name ]);
};

binding.GetAddrInfoReqWrap = function() {
	this.domain = process.domain;
};

binding.getaddrinfo = function(req, hostname, family, hints) {
	asyncCall(req, 'getaddrinfo', [ hostname, family, hints ]);
};

binding.GetNameInfoReqWrap = function() {
	this.domain = process.domain;
};

binding.getnameinfo = function(req, host, port) {
	asyncCall(req, 'getnameinfo', [ host, port ]);
};

binding.isIP = function() {
	return caresPort.syncIO('isIP', arguments);
};

binding.strerror = function() {
	return caresPort.syncIO('strerror', arguments);
};

binding.getServers = function() {
	return caresPort.syncIO('getServers', arguments);
};

binding.setServers = function() {
	return caresPort.syncIO('setServers', arguments);
};

binding.AF_INET = 2;
binding.AF_INET6 = 30;
binding.AF_UNSPEC = 0;
binding.AI_ADDRCONFIG = 1024;
binding.AI_V4MAPPED = 2048;
