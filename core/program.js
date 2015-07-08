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

// ECMAScript 5.1: 14 Program

function Program(sourceElements) {
	return function() {
		if (sourceElements === undefined) return CompletionValue("normal", empty, empty);
		else return sourceElements();
	};
}

function SourceElements(statements) {
	if (statements.length === 0) return undefined;

	if (statements.length === 1) return function() {
		try {
			return statements[0]();
		} catch (V) {
			if (isInternalError(V)) throw V;
			return CompletionValue("throw", V, empty);
		}
	};

	return function() {
		try {
			var headResult = statements[0]();
			for (var i = 1; i < statements.length; i++) {
				if (headResult.type !== "normal") return headResult;
				var tailResult = statements[i]();
				if (tailResult.value === empty) {
					var V = headResult.value;
				}
				else {
					var V = tailResult.value;
				}
				headResult = CompletionValue(tailResult.type, V, tailResult.target);
			}
			return headResult;
		} catch (V) {
			if (isInternalError(V)) throw V;
			return CompletionValue("throw", V, empty);
		}
	};
}

function NewSourceObject(source, strict, filename) {
	if (filename === undefined) {
		filename = "<unknown>";
	}
	if (SourceObjectClass === undefined) {
		SourceObjectClass = freeze({
			walkObject : SourceObject_walkObject,
			writeObject : SourceObject_writeObject,
			readObject : undefined,
			ClassID : CLASSID_SourceObject,
		});
	}
	var obj = Object.create(SourceObjectClass);
	obj.source = source;
	obj.strict = strict;
	obj.filename = ToString(filename);
	obj.subcodes = undefined;
	obj.isFunctionBody = undefined;
	obj.ID = 0;
	return preventExtensions(obj);
}

function evaluateProgram(text, filename) {
	try {
		var result = Global_evaluateProgram(undefined, [ text, filename ]);
	} catch (e) {
		if (isInternalError(e)) throw e;
		if (Type(e) !== TYPE_Object) {
			return {
				error : true,
				value : e,
			};
		}
		try {
			var value = ToString(e.Get("stack"));
		} catch (e) {
			if (isInternalError(e)) throw e;
			try {
				var value = ToString(e);
			} catch (e) {
				if (isInternalError(e)) throw e;
				var value = undefined;
			}
		}
		return {
			error : true,
			value : value,
		};
	}
	if (isPrimitiveValue(result)) {
		return {
			value : result,
		};
	}
	try {
		var value = JSON_stringify(undefined, [ result ]);
	} catch (e) {
		if (isInternalError(e)) throw e;
	}
	if (value === undefined) {
		try {
			var value = ToString(result);
		} catch (e) {
			if (isInternalError(e)) throw e;
		}
	}
	return {
		value : value,
	};
}