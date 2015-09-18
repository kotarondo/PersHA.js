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

var taskCount = 0;
var taskDepth = 0;
var taskPaused = true;
var taskInterruptible = true;
var taskResumedTime = 0;
var taskAccumulatedTime = 0;
var taskPendingError;

function task_enter() {
	assert(taskPaused && taskInterruptible);
	taskPaused = false;
	taskDepth++;
	taskCount++;
	resumeTaskTimer();
}

function task_leave() {
	assert(!taskPaused);
	if (taskDepth === 1) {
		runMicrotasks();
	}
	assert(!taskPaused);
	taskPaused = true;
	taskInterruptible = true;
	taskDepth--;
	pauseTaskTimer();
	if (taskDepth === 0) {
		if (IOManager_state === 'online' && taskAccumulatedTime >= RECOVERY_TARGET) {
			Journal_checkpoint();
		}
		runTasks();
	}
}

function task_pause() {
	assert(!taskPaused);
	taskPaused = true;
	taskInterruptible = false;
	pauseTaskTimer();
}

function task_resume() {
	assert(taskPaused);
	taskPaused = false;
	resumeTaskTimer();
}

function resumeTaskTimer() {
	assert(taskResumedTime === 0);
	taskResumedTime = Date.now();
}

function pauseTaskTimer() {
	assert(taskResumedTime !== 0);
	taskAccumulatedTime += Date.now() - taskResumedTime + 1;
	taskResumedTime = 0;
}

var taskQueue = [];

function scheduleTask(callback, arg) {
	var task = {
		callback : callback,
		arg : arg
	};
	taskQueue.push(task);
	if (taskDepth === 0) {
		runTasks();
	}
}

var inRunTasks = false;

function runTasks() {
	assert(taskDepth === 0);
	if (inRunTasks) {
		return;
	}
	inRunTasks = true;
	while (taskQueue.length > 0) {
		var task = taskQueue[0];
		task.callback(task.arg);
		taskQueue.shift();
		assert(taskDepth === 0);
	}
	inRunTasks = false;
}

var microtaskQueue = [];

function scheduleMicrotask(callback, args) {
	var task = {
		callback : callback,
		args : args
	};
	microtaskQueue.push(task);
}

function runMicrotasks() {
	assert(taskDepth === 1);
	while (microtaskQueue.length > 0) {
		var task = microtaskQueue[0];
		var callback = task.callback;
		var args = task.args;
		assert(IsCallable(callback), callback);
		assert(args instanceof Array, args);
		var callingVM = vm;
		vm = callback.vm;
		assert(vm);
		try {
			callback._Call(undefined, args);
		} catch (e) {
			task_callbackUncaughtError(e);
		} finally {
			vm = callingVM;
		}
		microtaskQueue.shift();
		assert(taskDepth === 1);
	}
}

function task_callbackUncaughtError(e) {
	if (isInternalError(e)) throw e;
	try {
		var callback = vm.theGlobalObject.Get('_uncaughtErrorCallback');
		if (IsCallable(callback)) {
			var caught = callback.Call(undefined, [ e ]);
			if (caught) return;
		}
	} catch (ee) {
		if (isInternalError(ee)) throw ee;
		e = ee;
	}
	var err = "";
	for (var i = 0; i < 3; i++) {
		try {
			if (Type(e) === TYPE_Object && e.HasProperty('stack')) {
				var err = ToString(e.Get('stack'));
			}
			else {
				var err = ToString(e);
			}
		} catch (ee) {
			if (isInternalError(ee)) throw ee;
			e = ee;
		}
	}
	if (IOManager_state !== 'recovery') {
		console.error("Uncaught: " + err);
	}
}
