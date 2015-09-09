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

var cares = process.binding('cares_wrap');
var caresPort = new IOPort('cares_wrap');

cares.getHostByAddr = function() {
	process._debug("cares.getHostByAddr TODO");
};

cares.getaddrinfo = function(req, hostname, family, hints) {
	(function retry() {
		caresPort.asyncIO('getaddrinfo', [ hostname, family, hints ], function(err, value) {
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

cares.getnameinfo = function() {
	process._debug("cares.getnameinfo TODO");
};

cares.isIP = function() {
	return caresPort.syncIO('isIP', arguments);
};

cares.strerror = function() {
	process._debug("cares.strerror TODO");
};

cares.getServers = function() {
	process._debug("cares.getServers TODO");
};

cares.setServers = function() {
	process._debug("cares.setServers TODO");
};

cares.GetAddrInfoReqWrap = function() {
	this.domain = process.domain;
};

cares.GetNameInfoReqWrap = function() {
	this.domain = process.domain;
};
