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

// temporarily

function consensus_date_now() {
	return Date.now();
}

function consensus_date_parse(str) {
	return Date.parse(str);
}

function consensus_math_random() {
	return Math.random();
}

function consensus_uncaughtError(err) {
	console.log("Uncaught: "+err);
}

function consensus_evaluate(text, filename) {
	try {
		Global_evaluateProgram(undefined, [ text, filename ]);
	} catch (e) {
		if (isInternalError(e)) throw e;
		task_callbackUncaughtError(e);
	}
	runMicrotasks();
}

function consensus_completionCallback(txid, args) {
	if (!txid) return;
	process.nextTick(function() {
		args = consensus_wrapArgs(args);
		try {
			IOP_completionEvent(txid, args);
		} catch (e) {
			if (isInternalError(e)) throw e;
			task_callbackUncaughtError(e);
		}
		runMicrotasks();
	});
}

function consensus_completionError(txid, reason) {
	if (!txid) return;
	process.nextTick(function() {
		try {
			IOP_completionEvent(txid, [ IOPort_Construct([ reason ]) ]);
		} catch (e) {
			if (isInternalError(e)) throw e;
			task_callbackUncaughtError(e);
		}
		runMicrotasks();
	});
}

function consensus_portAsyncCallback(txid, args) {
	if (!txid) return;
	process.nextTick(function() {
		args = consensus_wrapArgs(args);
		try {
			IOP_portEvent(txid, args);
		} catch (e) {
			if (isInternalError(e)) throw e;
			task_callbackUncaughtError(e);
		}
		runMicrotasks();
	});
}

function consensus_returnFromSyncIO(value) {
	value = consensus_wrap(value);
	return {
		type : 'return',
		value : value
	};
}

function consensus_exceptionInSyncIO(e) {
	e = consensus_wrap(e);
	return {
		type : 'throw',
		value : e
	};
}

function consensus_errorInSyncIO(reason) {
	//TODO
	assert(false, reason);
}

function consensus_portSyncCallback(txid, args) {
	if (!txid) return;
	args = consensus_wrapArgs(args);
	try {
		IOP_portEvent(txid, args);
	} catch (e) {
		e = IOP_unwrap(e);
		throw e;
	}
}

function consensus_wrapArgs(a) {
	var length = a.length;
	var A = [];
	for (var i = 0; i < length; i++) {
		A[i] = consensus_wrap(a[i]);
	}
	return A;
}

function consensus_wrap(a, stack) {
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
	if (stack === undefined) stack = [];
	if (isIncluded(a, stack)) {
		return null;
	}
	stack.push(a);
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
		A.Put(P, consensus_wrap(a[P], stack), false);
	}
	stack.pop();
	return A;
}

/*
function IOManager_evaluate(text, filename) {
	try {
		Global_evaluateProgram(undefined, [ text, filename ]);
	} catch (e) {
		if (isInternalError(e)) throw e;
		task_callbackUncaughtError(e);
	}
	task_leave();
}

		while (true) {
			var entry = Journal_read();
			if (entry === undefined) {
				IOManager_online();
				var entry = {
					type : 'return',
					func : func,
					error : 'restart'
				};
				Journal_write(entry);
				return entry;
			}
			if (entry.type === 'return') {
				assert(entry.func === func, entry);
				if (callback && entry.success) {
					IOManager_asyncCallbacks[txid] = callback;
				}
				return entry;
			}
			if (entry.type === 'portEvent') {
				IOManager_portEvent(entry);
				continue;
			}
			if (entry.type === 'evaluate') {
				IOManager_evaluate(entry.text, entry.filename);
				continue;
			}
			assert(false);
		}
	}

function IOP_online() {
	for ( var txid in IOP_openPorts) {
		IOP_portEvent(txid, [IOPort_Construct(['restart'])]);
	}
	for ( var txid in IOP_asyncCallbacks) {
		consensus_completionEvent(txid,  [IOPort_Construct(['restart'])]);
	}
}

function task_loop() {
		var entry = Journal_read();
		if (entry === undefined) {
			IOManager_online();
			break;
		}
		if (entry.type === 'evaluate') {
			IOManager_evaluate(entry.text, entry.filename);
		}
		else if (entry.type === 'completionEvent') {
			IOManager_completionEvent(entry);
		}
		else {
			IOManager_portEvent(entry);
		}
}
*/
