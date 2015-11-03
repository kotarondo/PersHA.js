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

var microtaskQueue = [];

function scheduleMicrotask(callback, args) {
	var task = ({
		callback : callback,
		args : args
	});
	microtaskQueue.push(task);
}

function runMicrotasks() {
	while (microtaskQueue.length > 0) {
		var task = microtaskQueue[0];
		var callback = task.callback;
		var args = task.args;
		assert(IsCallable(callback), callback);
		assert(args instanceof Array, args);
		try {
			callback.Call(undefined, args);
		} catch (e) {
			if (isInternalError(e)) throw e;
			task_callbackUncaughtError(e);
		}
		microtaskQueue.shift();
	}
}

function task_callbackUncaughtError(e) {
	try {
		var callback = vm0.theGlobalObject.Get('_uncaughtErrorCallback');
		if (IsCallable(callback)) {
			var caught = callback.Call(undefined, [ e ]);
			if (caught) return;
		}
	} catch (ee) {
		if (isInternalError(ee)) throw ee;
		e = ee;
	}
	for (var i = 0; i < 3; i++) {
		try {
			if (Type(e) === TYPE_Object && e.HasProperty('stack')) {
				var err = ToString(e.Get('stack'));
			}
			else {
				var err = ToString(e);
			}
			break;
		} catch (ee) {
			if (isInternalError(ee)) throw ee;
			e = ee;
		}
	}
	if (err) {
		consensus_uncaughtError(err);
	}
}

var taskAccumulatedTime = 0;
var taskResumedTime = undefined;

function taskResumeClock() {
	assert(taskResumedTime === undefined);
	taskResumedTime = Date.now();
}

function taskPauseClock() {
	assert(taskResumedTime !== undefined);
	var elapsed = Date.now() - taskResumedTime;
	if (elapsed <= 0) {
		elapsed = 1;
	}
	taskAccumulatedTime += elapsed;
	taskResumedTime = undefined;
}
