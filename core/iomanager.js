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

var HANDLER_SCRIPT_DIR = PERSHA_HOME + "/handler/";
var IOM_state = 'offline';
var IOM_InSyncIO = false;

function IOM_bindPort(port) {
	if (IOM_state !== 'online') {
		return;
	}
	if (port.handler !== undefined) {
		return;
	}
	port.handler = null;
	var root = port.Get('root');
	var name = port.Get('name');
	try {
		if (!root) {
			port.handler = require(HANDLER_SCRIPT_DIR + name);
			return;
		}
		IOM_bindPort(root);
		if (!root.handler) {
			return;
		}
		if (!root.handler.open) {
			console.error("IOM: no handler: " + IOPort_longname(root) + ".open");
			return;
		}
		port.handler = root.handler.open(name, function() {
			var args = Array.prototype.slice.call(arguments);
			if (IOM_InSyncIO) {
				IOM_InSyncIO = false;
				consensus_portSyncCallback(port.txid, args);
				IOM_InSyncIO = true;
			}
			else {
				consensus_portAsyncCallback(port.txid, args);
			}
		});
	} catch (e) {
		console.error("IOM: bind: " + IOPort_longname(port) + ": " + e.stack);
	}
}

function IOM_asyncIO(port, func, args, txid) {
	assert(IOM_state === 'online', IOM_state);
	var handler = port.handler;
	try {
		if (!txid) {
			handler.syncIO(func, args);
		}
		else {
			handler.asyncIO(func, args, function() {
				consensus_completionCallback(txid, Array.prototype.slice.call(arguments));
			});
		}
	} catch (e) {
		console.error("IOM: asyncIO: " + IOPort_longname(port) + "." + func + ": " + e.stack);
		consensus_completionError(txid, 'handler error');
	}
}

function IOM_syncIO(port, func, args, txid) {
	assert(IOM_state === 'online', IOM_state);
	var handler = port.handler;
	IOM_InSyncIO = true;
	try {
		if (!txid) {
			var value = handler.syncIO(func, args);
		}
		else {
			var value = handler.asyncIO(func, args, function() {
				consensus_completionCallback(txid, Array.prototype.slice.call(arguments));
			});
		}
	} catch (e) {
		IOM_InSyncIO = false;
		consensus_completionError(txid, 'handler error');
		return consensus_exceptionInSyncIO(e);
	}
	IOM_InSyncIO = false;
	return consensus_returnFromSyncIO(value);
}
