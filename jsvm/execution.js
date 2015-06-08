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

// ECMAScript 5.1: 10 Executable Code and Execution Contexts

var DeclarativeEnvironmentRecordClass = freeze({
	// $attributes
	// 0: Mutable Deletable
	// 1: Mutable Undeletable
	// 2: Immutable Initialized
	// 3: Immutable Uninitialized

	HasBinding : function(N) {
		if (this.$attributes[N] !== undefined) return true;
		return false;
	},

	CreateMutableBinding : function(N, D) {
		assertEquals(this.$attributes[N], undefined, N);
		if (D === true) {
			this.$attributes[N] = 0;
		}
		else {
			this.$attributes[N] = 1;
		}
	},

	SetMutableBinding : function(N, V, S) {
		if (this.$attributes[N] === undefined) return;
		if (this.$attributes[N] <= 1) {
			this.$values[N] = V;
		}
		else throw VMTypeError(N);
	},

	GetBindingValue : function(N, S) {
		assert(this.$attributes[N] !== undefined, N);
		if (this.$attributes[N] === 3) {
			if (S === false) return undefined;
			throw VMReferenceError(N);
		}
		return this.$values[N];
	},

	DeleteBinding : function(N) {
		if (this.$attributes[N] === undefined) return true;
		if (this.$attributes[N] !== 0) return false;
		delete (this.$values[N]);
		delete (this.$attributes[N]);
		return true;
	},

	ImplicitThisValue : function() {
		return undefined;
	},

	CreateImmutableBinding : function(N) {
		assertEquals(this.$attributes[N], undefined, N);
		this.$attributes[N] = 3;
	},

	InitializeImmutableBinding : function(N, V) {
		assertEquals(this.$attributes[N], 3, N);
		this.$values[N] = V;
		this.$attributes[N] = 2;
	},
});

var ObjectEnvironmentRecordClass = freeze({
	HasBinding : function(N) {
		var bindings = this.bindings;
		return bindings.HasProperty(N);
	},

	CreateMutableBinding : function(N, D) {
		var bindings = this.bindings;
		assertEquals(bindings.HasProperty(N), false, N);
		if (D === true) {
			var configValue = true;
		}
		else {
			var configValue = false;
		}
		bindings.DefineOwnProperty(N, PropertyDescriptor({
			Value : undefined,
			Writable : true,
			Enumerable : true,
			Configurable : configValue
		}), true);
	},

	SetMutableBinding : function(N, V, S) {
		var bindings = this.bindings;
		bindings.Put(N, V, S);
	},

	GetBindingValue : function(N, S) {
		var bindings = this.bindings;
		var value = bindings.HasProperty(N);
		if (value === false) {
			if (S === false) return undefined;
			throw VMReferenceError(N);
		}
		return bindings.Get(N);
	},

	DeleteBinding : function(N) {
		var bindings = this.bindings;
		return bindings.Delete(N, false);
	},

	ImplicitThisValue : function() {
		if (this.provideThis === true) return this.bindings;
		return undefined;
	},
});

function GetIdentifierReference(lex, name, strict) {
	if (lex === null) return ReferenceValue(undefined, name, strict);
	var envRec = lex.environmentRecord;
	var exists = envRec.HasBinding(name);
	if (exists === true) return ReferenceValue(envRec, name, strict);
	else {
		var outer = lex.outer;
		return GetIdentifierReference(outer, name, strict);
	}
}

function DeclarativeEnvironmentRecord() {
	var obj = Object.create(DeclarativeEnvironmentRecordClass);
	obj.$values = Object.create(null);
	obj.$attributes = Object.create(null);
	return preventExtensions(obj);
}

function ObjectEnvironmentRecord(bindings) {
	var obj = Object.create(ObjectEnvironmentRecordClass);
	obj.bindings = bindings;
	obj.provideThis = false;
	return preventExtensions(obj);
}

function NewDeclarativeEnvironment(E) {
	if (DeclarativeEnvironmentClass === undefined) {
		DeclarativeEnvironmentClass = freeze({
			walkObject : DeclarativeEnvironment_walkObject,
			writeObject : DeclarativeEnvironment_writeObject,
			readObject : DeclarativeEnvironment_readObject,
			ClassID : CLASSID_DeclarativeEnvironment,
		});
	}
	var obj = Object.create(DeclarativeEnvironmentClass);
	obj.environmentRecord = DeclarativeEnvironmentRecord();
	obj.outer = E;
	obj.ID = 0;
	return preventExtensions(obj);
}

function NewObjectEnvironment(O, E) {
	if (ObjectEnvironmentClass === undefined) {
		ObjectEnvironmentClass = freeze({
			walkObject : ObjectEnvironment_walkObject,
			writeObject : ObjectEnvironment_writeObject,
			readObject : ObjectEnvironment_readObject,
			ClassID : CLASSID_ObjectEnvironment,
		});
	}
	var obj = Object.create(ObjectEnvironmentClass);
	obj.environmentRecord = ObjectEnvironmentRecord(O);
	obj.outer = E;
	obj.ID = 0;
	return preventExtensions(obj);
}

var LexicalEnvironment;
var VariableEnvironment;
var ThisBinding;

var runningCode;
var runningSourcePos;
var outerExecutionContext;

function saveExecutionContext() {
	outerExecutionContext = preventExtensions({
		LexicalEnvironment : LexicalEnvironment,
		VariableEnvironment : VariableEnvironment,
		ThisBinding : ThisBinding,
		runningCode : runningCode,
		runningSourcePos : runningSourcePos,
		outerExecutionContext : outerExecutionContext,
	});
}

function exitExecutionContext() {
	var ctx = outerExecutionContext;
	LexicalEnvironment = ctx.LexicalEnvironment;
	VariableEnvironment = ctx.VariableEnvironment;
	ThisBinding = ctx.ThisBinding;
	runningCode = ctx.runningCode;
	runningSourcePos = ctx.runningSourcePos;
	outerExecutionContext = ctx.outerExecutionContext;
}

function getStackTrace() {
	var stackTrace = [];
	if (runningCode !== undefined) {
		stackTrace.push({
			code : runningCode,
			pos : runningSourcePos,
		});
		var ctx = outerExecutionContext;
		while (ctx.runningCode !== undefined) {
			stackTrace.push({
				code : ctx.runningCode,
				pos : ctx.runningSourcePos,
			});
			var ctx = ctx.outerExecutionContext;
		}
	}
	return stackTrace;
}

function enterExecutionContextForGlobalCode(code) {
	saveExecutionContext();
	LexicalEnvironment = theGlobalEnvironment;
	VariableEnvironment = theGlobalEnvironment;
	ThisBinding = theGlobalObject;
	runningCode = code;
	runningSourcePos = 0;
	DeclarationBindingInstantiation(code);
}

function enterExecutionContextForEvalCode(code, direct) {
	saveExecutionContext();
	if (direct !== true) {
		LexicalEnvironment = theGlobalEnvironment;
		VariableEnvironment = theGlobalEnvironment;
		ThisBinding = theGlobalObject;
	}
	if (code.strict) {
		var strictVarEnv = NewDeclarativeEnvironment(LexicalEnvironment);
		LexicalEnvironment = strictVarEnv;
		VariableEnvironment = strictVarEnv;
	}
	runningCode = code;
	runningSourcePos = 0;
	DeclarationBindingInstantiation(code);
}

function enterExecutionContextForFunctionCode(F, thisValue, argumentsList) {
	saveExecutionContext();
	var code = F.Code;
	if (code.strict) {
		ThisBinding = thisValue;
	}
	else if (thisValue === null || thisValue === undefined) {
		ThisBinding = theGlobalObject;
	}
	else if (Type(thisValue) !== TYPE_Object) {
		ThisBinding = ToObject(thisValue);
	}
	else {
		ThisBinding = thisValue;
	}
	var localEnv = NewDeclarativeEnvironment(F.Scope);
	LexicalEnvironment = localEnv;
	VariableEnvironment = localEnv;
	runningCode = code;
	runningSourcePos = 0;
	DeclarationBindingInstantiation(code, argumentsList, F);
}

function DeclarationBindingInstantiation(code, args, func) {
	var env = VariableEnvironment.environmentRecord;
	if (code.isEvalCode) {
		var configurableBindings = true;
	}
	else {
		var configurableBindings = false;
	}
	if (code.strict) {
		var strict = true;
	}
	else {
		var strict = false;
	}
	if (code.isFunctionCode) {
		var names = func.FormalParameters;
		var n = 0;
		for (var i = 0; i < names.length; i++) {
			var argName = names[i];
			var v = args[n++];
			var argAlreadyDeclared = env.HasBinding(argName);
			if (argAlreadyDeclared === false) {
				env.CreateMutableBinding(argName);
			}
			env.SetMutableBinding(argName, v, strict);
		}
	}
	var functions = code.functions;
	for (var i = 0; i < functions.length; i++) {
		var f = functions[i];
		var fn = f.name;
		var fo = f.instantiate();
		var funcAlreadyDeclared = env.HasBinding(fn);
		if (funcAlreadyDeclared === false) {
			env.CreateMutableBinding(fn, configurableBindings);
		}
		else if (env === theGlobalEnvironment.envRec) {
			var go = theGlobalObject;
			var existingProp = go.GetProperty(fn);
			if (existingProp.Configurable === true) {
				go.DefineOwnProperty(fn, PropertyDescriptor({
					Value : undefined,
					Writable : true,
					Enumerable : true,
					Configurable : configurableBindings
				}), true);
			}
			else if (IsAccessorDescriptor(existingProp) || !(existingProp.Writable === true && existingProp.Enumerable === true))
				throw VMTypeError();
		}
		env.SetMutableBinding(fn, fo, strict);
	}
	var argumentsAlreadyDeclared = env.HasBinding("arguments");
	if (code.isFunctionCode && argumentsAlreadyDeclared === false && (code.existsDirectEval || code.existsArgumentsRef)) {
		var argsObj = CreateArgumentsObject(func, names, args, VariableEnvironment, strict);
		if (strict === true) {
			env.CreateImmutableBinding("arguments");
			env.InitializeImmutableBinding("arguments", argsObj);
		}
		else {
			env.CreateMutableBinding("arguments");
			env.SetMutableBinding("arguments", argsObj, false);
		}
	}
	var variables = code.variables;
	for (var i = 0; i < variables.length; i++) {
		var dn = variables[i];
		var varAlreadyDeclared = env.HasBinding(dn);
		if (varAlreadyDeclared === false) {
			env.CreateMutableBinding(dn);
			env.SetMutableBinding(dn, undefined, strict);
		}
	}
}

function CreateArgumentsObject(func, names, args, env, strict) {
	var len = args.length;
	if (strict === true || len === 0 || names.length === 0) {
		var obj = VMObject(CLASSID_PlainArguments);
	}
	else {
		var obj = VMObject(CLASSID_Arguments);
	}
	obj.Prototype = builtin_Object_prototype;
	obj.Extensible = true;
	default_DefineOwnProperty.call(obj, "length", PropertyDescriptor({
		Value : len,
		Writable : true,
		Enumerable : false,
		Configurable : true
	}), false);
	var map = [];
	var mappedNames = [];
	var indx = len - 1;
	while (indx >= 0) {
		var val = args[indx];
		default_DefineOwnProperty.call(obj, ToString(indx), PropertyDescriptor({
			Value : val,
			Writable : true,
			Enumerable : true,
			Configurable : true
		}), false);
		if (indx < names.length) {
			var name = names[indx];
			if (strict === false && isIncluded(name, mappedNames) === false) {
				mappedNames.push(name);
				map[indx] = name;
			}
		}
		var indx = indx - 1;
	}
	if (mappedNames.length !== 0) {
		obj.ParameterMap = map;
		obj.ArgumentsScope = env;
	}
	if (strict === false) {
		obj.DefineOwnProperty("callee", PropertyDescriptor({
			Value : func,
			Writable : true,
			Enumerable : false,
			Configurable : true
		}), false);
	}
	else {
		var thrower = theThrowTypeError;
		obj.DefineOwnProperty("caller", PropertyDescriptor({
			Get : thrower,
			Set : thrower,
			Enumerable : false,
			Configurable : false
		}), false);
		obj.DefineOwnProperty("callee", PropertyDescriptor({
			Get : thrower,
			Set : thrower,
			Enumerable : false,
			Configurable : false
		}), false);
	}
	return obj;
}

function ArgGet(env, name) {
	var ref = GetIdentifierReference(env, name, false);
	return GetValue(ref);
}

function ArgSet(env, name, value) {
	var ref = GetIdentifierReference(env, name, false);
	PutValue(ref, value);
}

function Arguments_Get(P) {
	var map = this.ParameterMap;
	if (ToString(ToUint32(P)) === P) {
		var isMapped = map[P];
	}
	if (isMapped === undefined) {
		var v = default_Get.call(this, P);
		if (P === "caller" && Type(v) === TYPE_Object && v.Class === "Function" && v.Code !== undefined && v.Code.strict)
			throw VMTypeError();
		return v;
	}
	else {
		return ArgGet(this.ArgumentsScope, isMapped);
	}
}

function Arguments_GetOwnProperty(P) {
	var desc = default_GetOwnProperty.call(this, P);
	if (desc === undefined) return desc;
	var map = this.ParameterMap;
	if (ToString(ToUint32(P)) === P) {
		var isMapped = map[P];
	}
	if (isMapped !== undefined) {
		desc = PropertyDescriptor({
			Value : ArgGet(this.ArgumentsScope, isMapped),
			Writable : desc.Writable,
			Configurable : desc.Configurable,
			Enumerable : desc.Enumerable,
		});
	}
	return desc;
}

function Arguments_DefineOwnProperty(P, Desc, Throw) {
	var map = this.ParameterMap;
	if (ToString(ToUint32(P)) === P) {
		var isMapped = map[P];
	}
	var allowed = default_DefineOwnProperty.call(this, P, Desc, false);
	if (allowed === false) {
		if (Throw === true) throw VMTypeError();
		else return false;
	}
	if (isMapped !== undefined) {
		if (IsAccessorDescriptor(Desc) === true) {
			map[P] = undefined;
		}
		else {
			if (Desc.Value !== absent) {
				ArgSet(this.ArgumentsScope, isMapped, Desc.Value);
			}
			if (Desc.Writable === false) {
				map[P] = undefined;
			}
		}
	}
	return true;
}

function Arguments_Delete(P, Throw) {
	var map = this.ParameterMap;
	if (ToString(ToUint32(P)) === P) {
		var isMapped = map[P];
	}
	var result = default_Delete.call(this, P, Throw);
	if (result === true && isMapped !== undefined) {
		map[P] = undefined;
	}
	return result;
}
