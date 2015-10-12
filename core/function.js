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

// ECMAScript 5.1: 13 Function Definition

function FunctionDeclaration(name, parameters, body) {
	return ({
		name : name,
		instantiate : function() {
			var env = VariableEnvironment;
			return CreateFunction(parameters, body, env, body.strict);
		}
	});
}

function FunctionExpression(name, parameters, body) {
	if (name === undefined) {
		return CompilerContext.expression(function(ctx) {
			return ctx.defineObject("CreateFunction(" + ctx.literal(parameters) + "," + ctx.literal(body)
					+ ",LexicalEnvironment," + body.strict + ")");
		});
	}

	var evaluate = function() {
		var env = LexicalEnvironment;
		var funcEnv = NewDeclarativeEnvironment(env);
		var envRec = funcEnv.environmentRecord;
		envRec.CreateImmutableBinding(name);
		var closure = CreateFunction(parameters, body, funcEnv, body.strict);
		envRec.InitializeImmutableBinding(name, closure);
		return closure;
	};

	return CompilerContext.expression(function(ctx) {
		return ctx.defineObject(ctx.literal(evaluate) + "()");
	});
}

function FunctionBody(sourceElements) {
	if (sourceElements === undefined) {
		return function() {
			return undefined;
		};
	}
	var delayed;
	return function() {
		if (!delayed) {
			var ctx = new CompilerContext();
			ctx.compileStatement(sourceElements);
			ctx.compileReturn(COMPILER_UNDEFINED_VALUE);
			//console.log(ctx.texts.join('\n'));
			sourceElements = null;
			delayed = ctx.finish();
		}
		return delayed();
	};
}

function CreateFunction(parameters, body, Scope, Strict) {
	var F = VMObject(CLASSID_Function);
	F.vm = vm;
	F.Prototype = vm.Function_prototype;
	F.Scope = Scope;
	F.FormalParameters = parameters;
	F.Code = body;
	F.Extensible = true;
	var len = parameters.length;
	F.DefineOwnProperty("length", DataPropertyDescriptor(len, false, false, false), false);
	var proto = Object_Construct([]);
	proto.DefineOwnProperty("constructor", DataPropertyDescriptor(F, true, false, true), false);
	F.DefineOwnProperty("prototype", DataPropertyDescriptor(proto, true, false, false), false);
	if (Strict === true) {
		var thrower = vm.theThrowTypeError;
		F.DefineOwnProperty("caller", AccessorPropertyDescriptor(thrower, thrower, false, false), false);
		F.DefineOwnProperty("arguments", AccessorPropertyDescriptor(thrower, thrower, false, false), false);
	}
	return F;
}

function Function_ClassCall(thisValue, argumentsList) {
	var F = this;
	enterExecutionContextForFunctionCode(F, thisValue, argumentsList);
	try {
		return F.Code.evaluate();
	} finally {
		exitExecutionContext();
	}
}

function Function_ClassConstruct(argumentsList) {
	var F = this;
	var obj = VMObject(CLASSID_Object);
	obj.Extensible = true;
	var proto = F.Get("prototype");
	if (Type(proto) === TYPE_Object) {
		obj.Prototype = proto;
	}
	if (Type(proto) !== TYPE_Object) {
		obj.Prototype = vm.Object_prototype;
	}
	var result = F.Call(obj, argumentsList);
	if (Type(result) === TYPE_Object) return result;
	return obj;
}

function ThrowTypeError() {
	throw VMTypeError();
}

function initializeThrowTypeErrorObject() {
	var F = VMObject(CLASSID_BuiltinFunction);
	F.Prototype = vm.Function_prototype;
	defineCall(F, ThrowTypeError);
	defineFinal(F, "length", 0);
	F.Extensible = false;
	vm.theThrowTypeError = F;
}
