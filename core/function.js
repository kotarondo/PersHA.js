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

function FunctionDeclaration(body) {
	return ({
		name : body.functionName,
		instantiate : function() {
			return CreateFunction(body, VariableEnvironment);
		},
		compile : function(ctx) {
			return ctx.defineObject("CreateFunction(" + ctx.literal(body) + ",VariableEnvironment)");
		},
	});
}

function FunctionExpression(body) {
	if (body.functionName === undefined) {
		return CompilerContext.expression(function(ctx) {
			return ctx.defineObject("CreateFunction(" + ctx.literal(body) + ",LexicalEnvironment)");
		});
	}

	var evaluate = function() {
		var env = LexicalEnvironment;
		var funcEnv = NewDeclarativeEnvironment(env);
		var envRec = funcEnv;
		envRec.CreateImmutableBinding(body.functionName);
		var closure = CreateFunction(body, funcEnv);
		envRec.InitializeImmutableBinding(body.functionName, closure);
		return closure;
	};

	return CompilerContext.expression(function(ctx) {
		return ctx.defineObject(ctx.literal(evaluate) + "()");
	});
}

function CreateFunction(body, Scope) {
	var F = VMObject(CLASSID_Function);
	F.vm = vm;
	F.Prototype = vm.Function_prototype;
	F.Scope = Scope;
	F.Code = body;
	F.Extensible = true;
	var len = body.parameters.length;
	F.DefineOwnProperty("length", DataPropertyDescriptor(len, false, false, false), false);
	var proto = Object_Construct([]);
	proto.DefineOwnProperty("constructor", DataPropertyDescriptor(F, true, false, true), false);
	F.DefineOwnProperty("prototype", DataPropertyDescriptor(proto, true, false, false), false);
	if (body.strict) {
		var thrower = vm.theThrowTypeError;
		F.DefineOwnProperty("caller", AccessorPropertyDescriptor(thrower, thrower, false, false), false);
		F.DefineOwnProperty("arguments", AccessorPropertyDescriptor(thrower, thrower, false, false), false);
	}
	return F;
}

function delayedFunctionBody(F, argumentsList) {
	var ctx = new CompilerContext("F, argumentsList");
	try {
		compileDeclarationBindingInstantiation0(ctx, F.Code);
		if (F.Code.sourceElements !== undefined) {
			ctx.compileStatement(F.Code.sourceElements);
			F.Code.sourceElements = null;
		}
		ctx.compileReturn(COMPILER_UNDEFINED_VALUE);
	} catch (e) {
		console.error("CODEGEN ERROR:\n" + ctx.texts.join('\n'));
		console.error(e);
		process.reallyExit(1);
	}
	var evaluate = ctx.finish();
	F.Code.evaluate = evaluate;
	try {
		return evaluate(F, argumentsList);
	} catch (e) {
		if (!isInternalError(e)) throw e;
		console.error("FIRST EXEC ERROR:\n" + ctx.texts.join('\n'));
		console.error(e);
		process.reallyExit(1);
	}
}

function Function_ClassCall(thisValue, argumentsList) {
	var F = this;
	enterExecutionContextForFunctionCode0(F, thisValue);
	try {
		return F.Code.evaluate(F, argumentsList);
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
