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

// ECMAScript 5.1: 11 Expressions

function ThisExpression() {
	var evaluate = function() {
		return ThisBinding;
	};
	evaluate.compile = (function(ctx) {
		return ctx.define("ThisBinding", COMPILER_VALUE_TYPE);
	});
	return evaluate;
}

function IdentifierReference(identifier, strict) {
	var evaluate = function() {
		var env = LexicalEnvironment;
		return GetIdentifierReference(env, identifier, strict);
	};
	evaluate.compile = (function(ctx) {
		var base = ctx.define("GetIdentifierEnvironmentRecord(LexicalEnvironment," + ctx.quote(identifier) + ")",
				COMPILER_ANY_TYPE);
		return {
			name : identifier,
			types : COMPILER_IDENTIFIER_REFERENCE_TYPE,
			base : base,
			strict : strict,
		};
	});
	return evaluate;
}

function Literal(value) {
	var evaluate = function() {
		return value;
	};
	evaluate.compile = (function(ctx) {
		switch (Type(value)) {
		case TYPE_Number:
			var types = COMPILER_NUMBER_TYPE;
			break;
		case TYPE_String:
			var types = COMPILER_STRING_TYPE;
			break;
		case TYPE_Undefined:
			var types = COMPILER_UNDEFINED_TYPE;
			break;
		case TYPE_Null:
			var types = COMPILER_NULL_TYPE;
			break;
		case TYPE_Boolean:
			var types = COMPILER_BOOLEAN_TYPE;
			break;
		default:
			assert(false, value);
		}
		return {
			name : ctx.quote(value),
			types : types,
		};
	});
	return evaluate;
}

function RegExpLiteral(regexp) {
	return function() {
		return theRegExpFactory.createRegExpObject(regexp);
	};
}

function ArrayInitialiser(elements) {
	return function() {
		var array = Array_Construct([]);
		for (var i = 0; i < elements.length; i++) {
			var e = elements[i];
			if (e !== empty) {
				var initResult = e();
				var initValue = GetValue(initResult);
				array.DefineOwnProperty(ToString(i), DataPropertyDescriptor(initValue, true, true, true), false);
			}
		}
		if (e === empty) {
			array.Put("length", i - 1, false);
		}
		return array;
	};
}

function ObjectInitialiser(elements) {
	return function() {
		var obj = Object_Construct([]);
		for (var i = 0; i < elements.length; i++) {
			elements[i](obj);
		}
		return obj;
	};
}

function PropertyAssignment(name, expression) {
	return function(obj) {
		var exprValue = expression();
		var propValue = GetValue(exprValue);
		if (STRICT_CONFORMANCE === false) {
			if (name === '__proto__') {
				set_Object_prototype___proto__(obj, [ propValue ]);
				return;
			}
		}
		var desc = DataPropertyDescriptor(propValue, true, true, true);
		obj.DefineOwnProperty(name, desc, false);
	};
}

function PropertyAssignmentGet(name, body) {
	return function(obj) {
		var env = LexicalEnvironment;
		var closure = CreateFunction([], body, env, body.strict);
		var desc = AccessorPropertyDescriptor(closure, absent, true, true);
		obj.DefineOwnProperty(name, desc, false);
	};
}

function PropertyAssignmentSet(name, parameter, body) {
	return function(obj) {
		var env = LexicalEnvironment;
		var closure = CreateFunction([ parameter ], body, env, body.strict);
		var desc = AccessorPropertyDescriptor(absent, closure, true, true);
		obj.DefineOwnProperty(name, desc, false);
	};
}

function PropertyAccessor(base, name, strict) {
	return function() {
		var baseReference = base();
		var baseValue = GetValue(baseReference);
		var propertyNameReference = name();
		var propertyNameValue = GetValue(propertyNameReference);
		if (baseValue === undefined || baseValue === null) {
			if (Type(propertyNameValue) === TYPE_Object) {
				throw VMTypeError("Cannot read property of " + baseValue);
			}
			throw VMTypeError("Cannot read property '" + propertyNameValue + "' of " + baseValue);
		}
		if (typeof propertyNameValue !== "number") {
			propertyNameValue = ToString(propertyNameValue);
		}
		return ReferenceValue(baseValue, propertyNameValue, strict);
	};
}

function NewOperator(expression, args) {
	return function() {
		var ref = expression();
		var constructor = GetValue(ref);
		var argList = evaluateArguments(args);
		if (Type(constructor) !== TYPE_Object) throw VMTypeError();
		if (constructor._Construct === undefined) throw VMTypeError();
		return constructor.Construct(argList);
	};
}

function FunctionCall(expression, args, strict) {
	return function() {
		var ref = expression();
		var func = GetValue(ref);
		var argList = evaluateArguments(args);
		if (Type(func) !== TYPE_Object) throw VMTypeError();
		if (!IsCallable(func)) throw VMTypeError();
		if (Type(ref) === TYPE_Reference) {
			if (IsPropertyReference(ref)) {
				var thisValue = GetBase(ref);
			}
			else {
				var thisValue = GetBase(ref).ImplicitThisValue();
				if (func === vm.theEvalFunction && GetReferencedName(ref) === "eval") {
					return Global_eval(thisValue, argList, true, strict);
				}
			}
		}
		return func.Call(thisValue, argList);
	};
}

function evaluateArguments(args) {
	var argList = [];
	for (var i = 0; i < args.length; i++) {
		var ref = args[i]();
		var arg = GetValue(ref);
		argList.push(arg);
	}
	return argList;
}

function PostfixIncrementOperator(expression) {
	return CompilerContext.expression(function(ctx) {
		var lhs = ctx.compileExpression(expression);
		var oldValue = ctx.compileToNumber(ctx.compileGetValue(lhs));
		var newValue = ctx.define(oldValue.name + " +1", COMPILER_NUMBER_TYPE);
		ctx.compilePutValue(lhs, newValue);
		return oldValue;
	});
}

function PostfixDecrementOperator(expression) {
	return CompilerContext.expression(function(ctx) {
		var lhs = ctx.compileExpression(expression);
		var oldValue = ctx.compileToNumber(ctx.compileGetValue(lhs));
		var newValue = ctx.define(oldValue.name + " -1", COMPILER_NUMBER_TYPE);
		ctx.compilePutValue(lhs, newValue);
		return oldValue;
	});
}

function deleteOperator(expression) {
	return function() {
		var ref = expression();
		if (Type(ref) !== TYPE_Reference) return true;
		if (IsUnresolvableReference(ref)) return true;
		if (IsPropertyReference(ref)) return ToObject(GetBase(ref)).Delete(GetReferencedName(ref), IsStrictReference(ref));
		else {
			var bindings = GetBase(ref);
			return bindings.DeleteBinding(GetReferencedName(ref));
		}
	};
}

function voidOperator(expression) {
	return CompilerContext.expression(function(ctx) {
		var expr = ctx.compileExpression(expression);
		ctx.compileGetValue(expr);
		return {
			name : "undefined",
			types : COMPILER_UNDEFINED_TYPE,
		};
	});
}

function typeofOperator(expression) {
	return function() {
		var val = expression();
		if (Type(val) === TYPE_Reference) {
			if (IsUnresolvableReference(val)) return "undefined";
			val = GetValue(val);
		}
		switch (Type(val)) {
		case TYPE_Undefined:
			return "undefined";
		case TYPE_Null:
			return "object";
		case TYPE_Boolean:
			return "boolean";
		case TYPE_Number:
			return "number";
		case TYPE_String:
			return "string";
		case TYPE_Object:
			if (IsCallable(val)) return "function";
			return "object";
		}
	};
}

function PrefixIncrementOperator(expression) {
	return CompilerContext.expression(function(ctx) {
		var expr = ctx.compileExpression(expression);
		var oldValue = ctx.compileToNumber(ctx.compileGetValue(expr));
		var newValue = ctx.define(oldValue.name + " +1", COMPILER_NUMBER_TYPE);
		ctx.compilePutValue(expr, newValue);
		return newValue;
	});
}

function PrefixDecrementOperator(expression) {
	return CompilerContext.expression(function(ctx) {
		var expr = ctx.compileExpression(expression);
		var oldValue = ctx.compileToNumber(ctx.compileGetValue(expr));
		var newValue = ctx.define(oldValue.name + " -1", COMPILER_NUMBER_TYPE);
		ctx.compilePutValue(expr, newValue);
		return newValue;
	});
}

function PlusOperator(expression) {
	return CompilerContext.expression(function(ctx) {
		var expr = ctx.compileExpression(expression);
		return ctx.compileToNumber(ctx.compileGetValue(expr));
	});
}

function MinusOperator(expression) {
	return CompilerContext.expression(function(ctx) {
		var expr = ctx.compileExpression(expression);
		var oldValue = ctx.compileToNumber(ctx.compileGetValue(expr));
		return ctx.define("- " + oldValue.name, COMPILER_NUMBER_TYPE);
	});
}

function BitwiseNOTOperator(expression) {
	return CompilerContext.expression(function(ctx) {
		var expr = ctx.compileExpression(expression);
		var oldValue = ctx.compileToInt32(ctx.compileGetValue(expr));
		return ctx.define("~ " + oldValue.name, COMPILER_NUMBER_TYPE);
	});
}

function LogicalNOTOperator(expression) {
	return CompilerContext.expression(function(ctx) {
		var expr = ctx.compileExpression(expression);
		var oldValue = ctx.compileGetValue(expr);
		return ctx.define("! " + oldValue.name, COMPILER_BOOLEAN_TYPE);
	});
}

function MultiplicativeOperator(operator, leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var left = ctx.compileExpression(leftExpression);
		var leftValue = ctx.compileGetValue(left);
		var right = ctx.compileExpression(rightExpression);
		var rightValue = ctx.compileGetValue(right);
		var leftNum = ctx.compileToNumber(leftValue);
		var rightNum = ctx.compileToNumber(rightValue);
		switch (operator) {
		case '*':
			return ctx.define(leftNum.name + " * " + rightNum.name, COMPILER_NUMBER_TYPE);
		case '/':
			return ctx.define(leftNum.name + " / " + rightNum.name, COMPILER_NUMBER_TYPE);
		case '%':
			return ctx.define(leftNum.name + " % " + rightNum.name, COMPILER_NUMBER_TYPE);
		}
	});
}

function AdditionOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		var lprim = ctx.compileToPrimitive(lval);
		var rprim = ctx.compileToPrimitive(rval);
		if (lprim.types.isString() || rprim.types.isString()) {
			return ctx.define(lprim.name + " + " + rprim.name, COMPILER_STRING_TYPE);
		}
		else if (lprim.types.isNotString() && rprim.types.isNotString()) {
			return ctx.define(lprim.name + " + " + rprim.name, COMPILER_NUMBER_TYPE);
		}
		else {
			return ctx.define(lprim.name + " + " + rprim.name, COMPILER_NUMBER_OR_STRING_TYPE);
		}
	});
}

function SubtractionOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		var lnum = ctx.compileToNumber(lval);
		var rnum = ctx.compileToNumber(rval);
		return ctx.define(lnum.name + " - " + rnum.name, COMPILER_NUMBER_TYPE);
	});
}

function LeftShiftOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		var lnum = ctx.compileToInt32(lval);
		var rnum = ctx.compileToUint32(rval);
		return ctx.define(lnum.name + " << " + rnum.name, COMPILER_NUMBER_TYPE);
	});
}

function SignedRightShiftOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		var lnum = ctx.compileToInt32(lval);
		var rnum = ctx.compileToUint32(rval);
		return ctx.define(lnum.name + " >> " + rnum.name, COMPILER_NUMBER_TYPE);
	});
}

function UnsignedRightShiftOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		var lnum = ctx.compileToUint32(lval);
		var rnum = ctx.compileToUint32(rval);
		return ctx.define(lnum.name + " >>> " + rnum.name, COMPILER_NUMBER_TYPE);
	});
}

function LessThanOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		var px = ctx.compileToPrimitive(lval, TYPE_Number);
		var py = ctx.compileToPrimitive(rval, TYPE_Number);
		return ctx.define(px.name + " < " + py.name, COMPILER_BOOLEAN_TYPE);
	});
}

function GreaterThanOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		var px = ctx.compileToPrimitive(lval, TYPE_Number);
		var py = ctx.compileToPrimitive(rval, TYPE_Number);
		return ctx.define(px.name + " > " + py.name, COMPILER_BOOLEAN_TYPE);
	});
}

function LessThanOrEqualOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		var px = ctx.compileToPrimitive(lval, TYPE_Number);
		var py = ctx.compileToPrimitive(rval, TYPE_Number);
		return ctx.define(px.name + " <= " + py.name, COMPILER_BOOLEAN_TYPE);
	});
}

function GreaterThanOrEqualOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		var px = ctx.compileToPrimitive(lval, TYPE_Number);
		var py = ctx.compileToPrimitive(rval, TYPE_Number);
		return ctx.define(px.name + " >= " + py.name, COMPILER_BOOLEAN_TYPE);
	});
}

function instanceofOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		if (rval.types.isNotObject()) {
			ctx.text("throw VMTypeError();");
			return {
				name : "false",
				types : COMPILER_BOOLEAN_TYPE,
			};
		}
		ctx.text("if (Type(" + rval.name + ") !== " + TYPE_Object + ") throw VMTypeError();");
		ctx.text("if (" + rval.name + ".HasInstance === undefined) throw VMTypeError();");
		return ctx.define(rval.name + ".HasInstance(" + lval.name + ")", COMPILER_BOOLEAN_TYPE);
	});
}

function inOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		if (rval.types.isNotObject()) {
			ctx.text("throw VMTypeError();");
			return {
				name : "false",
				types : COMPILER_BOOLEAN_TYPE,
			};
		}
		ctx.text("if (Type(" + rval.name + ") !== " + TYPE_Object + ") throw VMTypeError();");
		var lval = ctx.compileToString(lval);
		return ctx.define(rval.name + ".HasProperty(" + lval.name + ")", COMPILER_BOOLEAN_TYPE);
	});
}

function EqualsOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		if (rval.types.isString() || rval.types.isNumber() || rval.types.isBoolean()) {
			var lval = ctx.compileToPrimitive(lval);
			return ctx.define(lval.name + " == " + rval.name, COMPILER_BOOLEAN_TYPE);
		}
		if (lval.types.isString() || lval.types.isNumber() || lval.types.isBoolean()) {
			var rval = ctx.compileToPrimitive(rval);
			return ctx.define(lval.name + " == " + rval.name, COMPILER_BOOLEAN_TYPE);
		}
		return ctx.define("abstractEqualityComparison(" + lval.name + " , " + rval.name + ")", COMPILER_BOOLEAN_TYPE);
	});
}

function DoesNotEqualOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		if (rval.types.isString() || rval.types.isNumber() || rval.types.isBoolean()) {
			var lval = ctx.compileToPrimitive(lval);
			return ctx.define(lval.name + " != " + rval.name, COMPILER_BOOLEAN_TYPE);
		}
		if (lval.types.isString() || lval.types.isNumber() || lval.types.isBoolean()) {
			var rval = ctx.compileToPrimitive(rval);
			return ctx.define(lval.name + " != " + rval.name, COMPILER_BOOLEAN_TYPE);
		}
		return ctx.define("!abstractEqualityComparison(" + lval.name + " , " + rval.name + ")", COMPILER_BOOLEAN_TYPE);
	});
}

function abstractEqualityComparison(x, y) {
	if (Type(x) === TYPE_Object) {
		if (Type(y) === TYPE_Object) {
			return (x === y);
		}
		if (y === null || y === undefined) return false;
		x = ToPrimitive(x);
		return (x == y);
	}
	else {
		if (Type(y) !== TYPE_Object) {
			return (x == y);
		}
		if (x === null || x === undefined) return false;
		y = ToPrimitive(y);
		return (x == y);
	}
}

function StrictEqualsOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		return ctx.define(lval.name + " === " + rval.name, COMPILER_BOOLEAN_TYPE);
	});
}

function StrictDoesNotEqualOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		return ctx.define(lval.name + " !== " + rval.name, COMPILER_BOOLEAN_TYPE);
	});
}

function BinaryBitwiseOperator(operator, leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		var lnum = ctx.compileToInt32(lval);
		var rnum = ctx.compileToInt32(rval);
		switch (operator) {
		case '&':
			return ctx.define(lnum.name + " & " + rnum.name, COMPILER_NUMBER_TYPE);
		case '^':
			return ctx.define(lnum.name + " ^ " + rnum.name, COMPILER_NUMBER_TYPE);
		case '|':
			return ctx.define(lnum.name + " | " + rnum.name, COMPILER_NUMBER_TYPE);
		}
	});
}

function LogicalAndOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var mval = ctx.define("", COMPILER_NONE_TYPE);
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		ctx.merge(mval, lval);
		ctx.text("if (" + lval.name + ") {");
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		ctx.merge(mval, rval);
		ctx.text("}");
		return mval;
	});
}

function LogicalOrOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var mval = ctx.define("", COMPILER_NONE_TYPE);
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		ctx.merge(mval, lval);
		ctx.text("if (! " + lval.name + ") {");
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		ctx.merge(mval, rval);
		ctx.text("}");
		return mval;
	});
}

function ConditionalOperator(condition, firstExpression, secondExpression) {
	return CompilerContext.expression(function(ctx) {
		var mval = ctx.define("", COMPILER_NONE_TYPE);
		var lref = ctx.compileExpression(condition);
		var lval = ctx.compileGetValue(lref);
		ctx.text("if (" + lval.name + ") {");
		var trueRef = ctx.compileExpression(firstExpression);
		ctx.merge(mval, ctx.compileGetValue(trueRef));
		ctx.text("} else {");
		var falseRef = ctx.compileExpression(secondExpression);
		ctx.merge(mval, ctx.compileGetValue(falseRef));
		ctx.text("}");
		return mval;
	});
}

function SimpleAssignment(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		ctx.compilePutValue(lref, rval);
		return rval;
	});
}

function CompoundAssignment(operator, leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		switch (operator) {
		case '*=':
			var leftNum = ctx.compileToNumber(lval);
			var rightNum = ctx.compileToNumber(rval);
			var r = ctx.define(leftNum.name + " * " + rightNum.name, COMPILER_NUMBER_TYPE);
			break;
		case '/=':
			var leftNum = ctx.compileToNumber(lval);
			var rightNum = ctx.compileToNumber(rval);
			var r = ctx.define(leftNum.name + " / " + rightNum.name, COMPILER_NUMBER_TYPE);
			break;
		case '%=':
			var leftNum = ctx.compileToNumber(lval);
			var rightNum = ctx.compileToNumber(rval);
			var r = ctx.define(leftNum.name + " % " + rightNum.name, COMPILER_NUMBER_TYPE);
			break;
		case '+=':
			var lprim = ctx.compileToPrimitive(lval);
			var rprim = ctx.compileToPrimitive(rval);
			if (lprim.types.isString() || rprim.types.isString()) {
				var r = ctx.define(lprim.name + " + " + rprim.name, COMPILER_STRING_TYPE);
			}
			else if (lprim.types.isNotString() && rprim.types.isNotString()) {
				var r = ctx.define(lprim.name + " + " + rprim.name, COMPILER_NUMBER_TYPE);
			}
			else {
				var r = ctx.define(lprim.name + " + " + rprim.name, COMPILER_NUMBER_OR_STRING_TYPE);
			}
			break;
		case '-=':
			var leftNum = ctx.compileToNumber(lval);
			var rightNum = ctx.compileToNumber(rval);
			var r = ctx.define(leftNum.name + " - " + rightNum.name, COMPILER_NUMBER_TYPE);
			break;
		case '<<=':
			var leftNum = ctx.compileToInt32(lval);
			var rightNum = ctx.compileToUint32(rval);
			var r = ctx.define(leftNum.name + " << " + rightNum.name, COMPILER_NUMBER_TYPE);
			break;
		case '>>=':
			var leftNum = ctx.compileToInt32(lval);
			var rightNum = ctx.compileToUint32(rval);
			var r = ctx.define(leftNum.name + " >> " + rightNum.name, COMPILER_NUMBER_TYPE);
			break;
		case '>>>=':
			var leftNum = ctx.compileToUint32(lval);
			var rightNum = ctx.compileToUint32(rval);
			var r = ctx.define(leftNum.name + " >>> " + rightNum.name, COMPILER_NUMBER_TYPE);
			break;
		case '&=':
			var leftNum = ctx.compileToInt32(lval);
			var rightNum = ctx.compileToInt32(rval);
			var r = ctx.define(leftNum.name + " & " + rightNum.name, COMPILER_NUMBER_TYPE);
			break;
		case '|=':
			var leftNum = ctx.compileToInt32(lval);
			var rightNum = ctx.compileToInt32(rval);
			var r = ctx.define(leftNum.name + " | " + rightNum.name, COMPILER_NUMBER_TYPE);
			break;
		case '^=':
			var leftNum = ctx.compileToInt32(lval);
			var rightNum = ctx.compileToInt32(rval);
			var r = ctx.define(leftNum.name + " ^ " + rightNum.name, COMPILER_NUMBER_TYPE);
			break;
		}
		ctx.compilePutValue(lref, r);
		return r;
	});
}

function CommaOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		GetValue(lref);
		var rref = rightExpression();
		return GetValue(rref);
	};
}
