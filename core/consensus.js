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

// temporary implementation

var consensus_queue = [];
var consensus_loop_scheduled = false;

function consensus_schedule(entry) {
	consensus_queue.push(entry);
	if (!consensus_loop_scheduled) {
		consensus_loop_scheduled = true;
		process.nextTick(consensus_loop);
	}
}

function consensus_loop() {
	consensus_loop_scheduled = false;
	while (consensus_queue.length > 0) {
		var entry = consensus_queue.shift();
		Journal_write(entry);
		consensus_handler(entry);
	}
}

function consensus_recovery() {
	while (IOM_state !== 'online') {
		var entry = Journal_read();
		if (entry === undefined) {
			for ( var txid in IOP_asyncCallbacks) {
				consensus_completionError(txid, 'restart');
			}
			IOM_state = 'online';
			var entry;
			Journal_write(entry = {
				type : 'online'
			});
			consensus_handler(entry);
			return;
		}
		consensus_handler(entry);
	}
}

function consensus_handler(entry) {
	try {
		switch (entry.type) {
		case 'online':
			IOP_restartPorts();
			break;
		case 'completionEvent':
			var args = consensus_wrapArgs(entry.args);
			IOP_completionEvent(entry.txid, args);
			break;
		case 'completionError':
			IOP_completionEvent(entry.txid, [ IOPort_Construct([ entry.reason ]) ]);
			break;
		case 'portEvent':
			var args = consensus_wrapArgs(entry.args);
			IOP_portEvent(entry.txid, args);
			break;
		case 'evaluate':
			Global_evaluateProgram(undefined, [ entry.text, entry.filename ]);
			break;
		default:
			assert(false, entry);
		}
	} catch (e) {
		if (isInternalError(e)) throw e;
		task_callbackUncaughtError(e);
	}
	runMicrotasks();
}

function consensus_completionCallback(txid, args) {
	if (!txid) return;
	consensus_schedule({
		type : 'completionEvent',
		txid : txid,
		args : consensus_prewrapArgs(args),
	});
}

function consensus_completionError(txid, reason) {
	if (!txid) return;
	consensus_schedule({
		type : 'completionError',
		txid : txid,
		reason : reason,
	});
}

function consensus_portAsyncCallback(txid, args) {
	if (!txid) return;
	consensus_schedule({
		type : 'portEvent',
		txid : txid,
		args : consensus_prewrapArgs(args),
	});
}

function consensus_evaluate(text, filename) {
	var entry;
	Journal_write(entry = {
		type : 'evaluate',
		text : text,
		filename : filename,
	});
	consensus_handler(entry);
}

function consensus_syncIO_recovery() {
	while (true) {
		var entry = Journal_read();
		if (entry === undefined) {
			for ( var txid in IOP_asyncCallbacks) {
				consensus_completionError(txid, 'restart');
			}
			IOM_state = 'online';
			Journal_write({
				type : 'online'
			});
			IOP_restartPorts();
			Journal_write({
				type : 'error',
				reason : 'restart'
			});
			return {
				type : 'error',
				value : 'restart'
			};
		}
		switch (entry.type) {
		case 'online':
			IOP_restartPorts();
			continue;
		case 'return':
			var value = consensus_wrap(entry.value);
			return {
				type : 'return',
				value : value
			};
		case 'throw':
			var e = consensus_wrap(entry.e);
			return {
				type : 'throw',
				value : e
			};
		case 'error':
			return {
				type : 'error',
				value : entry.reason
			};
		case 'portEvent':
			var args = consensus_wrapArgs(entry.args);
			try {
				IOP_portEvent(entry.txid, args);
			} catch (e) {
			}
			break;
		default:
			assert(false, entry);
		}
	}
}

function consensus_returnFromSyncIO(value) {
	value = consensus_prewrap(value);
	Journal_write({
		type : 'return',
		value : value
	});
	value = consensus_wrap(value);
	return {
		type : 'return',
		value : value
	};
}

function consensus_exceptionInSyncIO(e) {
	e = consensus_prewrap(e);
	Journal_write({
		type : 'throw',
		e : e
	});
	e = consensus_wrap(e);
	return {
		type : 'throw',
		value : e
	};
}

function consensus_errorInSyncIO(reason) {
	Journal_write({
		type : 'error',
		reason : reason
	});
	return {
		type : 'error',
		value : reason
	};
}

function consensus_portSyncCallback(txid, args) {
	if (!txid) return;
	args = consensus_prewrapArgs(args);
	Journal_write({
		type : 'portEvent',
		txid : txid,
		args : args,
	});
	args = consensus_wrapArgs(args);
	try {
		IOP_portEvent(txid, args);
	} catch (e) {
		e = IOP_unwrap(e);
		throw e;
	}
}

function consensus_date_now() {
	if (IOM_state !== 'online') {
		var entry = Journal_read();
		if (entry !== undefined) {
			assert(entry.now !== undefined, entry);
			return entry.now;
		}
	}
	var now = Date.now();
	Journal_write({
		now : now
	});
	return now;
}

function consensus_date_parse(str) {
	if (IOM_state !== 'online') {
		var entry = Journal_read();
		if (entry !== undefined) {
			assert(entry.parse !== undefined, entry);
			return entry.parse;
		}
	}
	var parse = Date.parse(str);
	Journal_write({
		parse : parse
	});
	return parse;
}

function consensus_math_random() {
	if (IOM_state !== 'online') {
		var entry = Journal_read();
		if (entry !== undefined) {
			assert(entry.random !== undefined, entry);
			return entry.random;
		}
	}
	var random = Math.random();
	Journal_write({
		random : random
	});
	return random;
}

function consensus_prewrapArgs(a) {
	var length = a.length;
	var A = [];
	for (var i = 0; i < length; i++) {
		A[i] = consensus_prewrap(a[i]);
	}
	return A;
}

function consensus_prewrap(a, stack) {
	if (isPrimitiveValue(a)) {
		return a;
	}
	if (a instanceof Function) {
		return undefined;
	}
	if (a instanceof Buffer) {
		return new Buffer(a); // safeguard
	}
	if (a instanceof Date) {
		return new Date(a.getTime());
	}
	if (stack === undefined) stack = [];
	if (isIncluded(a, stack)) {
		return null;
	}
	stack.push(a);
	if (a instanceof Error) {
		var message = String(a.message);
		if (a instanceof TypeError) {
			var A = new TypeError(message);
		}
		else if (a instanceof ReferenceError) {
			var A = new ReferenceError(message);
		}
		else if (a instanceof RangeError) {
			var A = new RangeError(message);
		}
		else if (a instanceof SyntaxError) {
			var A = new SyntaxError(message);
		}
		else {
			var A = new Error(message);
		}
	}
	else if (a instanceof Array) {
		var A = new Array(a.length);
	}
	else {
		var A = {};
	}
	var keys = Object.getOwnPropertyNames(a);
	var length = keys.length;
	for (var i = 0; i < length; i++) {
		var P = keys[i];
		if (a.propertyIsEnumerable(P) === false) {
			continue;
		}
		if (P === 'caller' || P === 'callee' || P === 'arguments') {
			continue;
		}
		A[P] = consensus_prewrap(a[P], stack);
	}
	stack.pop();
	return A;
}

function consensus_wrapArgs(a) {
	var length = a.length;
	var A = [];
	for (var i = 0; i < length; i++) {
		A[i] = consensus_wrap(a[i]);
	}
	return A;
}

function consensus_wrap(a) {
	if (isPrimitiveValue(a)) {
		return a;
	}
	if (a instanceof Function) {
		return undefined;
	}
	if (a instanceof Buffer) {
		var A = VMObject(CLASSID_Buffer);
		A.Prototype = vm.Buffer_prototype;
		A.Extensible = true;
		A.wrappedBuffer = a;
		defineFinal(A, 'length', a.length);
		defineFinal(A, 'parent', A);
		return A;
	}
	if (a instanceof Date) {
		return Date_Construct([ a.getTime() ]);
	}
	if (a instanceof Error) {
		var message = String(a.message);
		if (a instanceof TypeError) {
			var A = TypeError_Construct([ message ]);
		}
		else if (a instanceof ReferenceError) {
			var A = ReferenceError_Construct([ message ]);
		}
		else if (a instanceof RangeError) {
			var A = RangeError_Construct([ message ]);
		}
		else if (a instanceof SyntaxError) {
			var A = SyntaxError_Construct([ message ]);
		}
		else {
			var A = Error_Construct([ message ]);
		}
	}
	else if (a instanceof Array) {
		var A = Array_Construct([ a.length ]);
	}
	else {
		var A = Object_Construct([]);
	}
	for ( var P in a) {
		A.Put(P, consensus_wrap(a[P]), false);
	}
	return A;
}

function consensus_uncaughtError(err) {
	console.log("Uncaught: " + err);
	process.reallyExit(1);
}
