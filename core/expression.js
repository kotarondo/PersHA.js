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
		return ctx.defineValue("ThisBinding");
	});
	return evaluate;
}

function IdentifierReference(identifier, strict) {
	var evaluate = function() {
		var env = LexicalEnvironment;
		return GetIdentifierReference(env, identifier, strict);
	};
	evaluate.compile = (function(ctx) {
		return ctx.compileGetIdentifierReferece(identifier, strict);
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
			isLiteral : true,
			value : value
		};
	});
	return evaluate;
}

function RegExpLiteral(regexp) {
	function evaluate() {
		return theRegExpFactory.createRegExpObject(regexp);
	}
	evaluate.compile = (function(ctx) {
		return ctx.defineObject("theRegExpFactory.createRegExpObject(" + ctx.literal(regexp) + ")");
	});
	return evaluate;
}

function ArrayInitialiser(elements) {
	return CompilerContext.expression(function(ctx) {
		var array = ctx.defineObject("Array_Construct([])");
		for (var i = 0; i < elements.length; i++) {
			var e = elements[i];
			if (e !== empty) {
				var initResult = ctx.compileExpression(e);
				var initValue = ctx.compileGetValue(initResult);
				ctx.text(array.name + " .DefineOwnProperty(" + i + //
				",DataPropertyDescriptor(" + initValue.name + ",true,true,true),false);");
			}
		}
		if (e === empty) {
			ctx.text(array.name + " .Put('length'," + (i - 1) + ",false);");
		}
		return array;
	});
}

function ObjectInitialiser(elements) {
	return CompilerContext.expression(function(ctx) {
		var obj = ctx.defineObject("Object_Construct([])");
		for (var i = 0; i < elements.length; i++) {
			elements[i](ctx, obj);
		}
		return obj;
	});
}

function PropertyAssignment(name, expression) {
	return function(ctx, obj) {
		var exprValue = ctx.compileExpression(expression);
		var propValue = ctx.compileGetValue(exprValue);
		if (STRICT_CONFORMANCE === false) {
			if (name === '__proto__') {
				ctx.text("set_Object_prototype___proto__(" + obj.name + ",[" + propValue.name + "]);");
				return;
			}
		}
		ctx.text(obj.name + " .DefineOwnProperty(" + ctx.quote(name) + //
		",DataPropertyDescriptor(" + propValue.name + ",true,true,true),false);");
	};
}

function PropertyAssignmentGet(name, body) {
	return function(ctx, obj) {
		var closure = ctx.defineValue("CreateFunction([]," + //
		ctx.literal(body) + ",LexicalEnvironment," + body.strict + ")");
		ctx.text(obj.name + " .DefineOwnProperty(" + ctx.quote(name) + //
		",AccessorPropertyDescriptor(" + closure.name + ",absent,true,true),false);");
	};
}

function PropertyAssignmentSet(name, parameter, body) {
	return function(ctx, obj) {
		var closure = ctx.defineValue("CreateFunction([" + ctx.quote(parameter) + "]," + //
		ctx.literal(body) + ",LexicalEnvironment," + body.strict + ")");
		ctx.text(obj.name + " .DefineOwnProperty(" + ctx.quote(name) + //
		",AccessorPropertyDescriptor(absent," + closure.name + ",true,true),false);");
	};
}

function PropertyAccessor(base, name, strict) {
	return CompilerContext.reference(function(ctx) {
		var baseReference = ctx.compileExpression(base);
		var baseValue = ctx.compileGetValue(baseReference);
		var propertyNameReference = ctx.compileExpression(name);
		var propertyNameValue = ctx.compileGetValue(propertyNameReference);
		if (!(baseValue.types.isNotUndefined() && baseValue.types.isNotNull())) {
			ctx.text("if(" + baseValue.name + " ===undefined|| " + baseValue.name + " ===null)" + //
			"throwPropertyAccessorError(" + baseValue.name + "," + propertyNameValue.name + ");");
		}
		if (!propertyNameValue.types.isNotObject()) {
			ctx.text("if(Type(" + propertyNameValue.name + ")===TYPE_Object){");
			ctx.merge(propertyNameValue, ctx.compileToString(propertyNameValue));
			ctx.text("}");
		}
		return {
			name : propertyNameValue.name,
			types : COMPILER_PROPERTY_REFERENCE_TYPE,
			base : baseValue,
			strict : strict
		};
	});
}

function throwPropertyAccessorError(base, name) {
	if (Type(name) === TYPE_Object) {
		throw VMTypeError("Cannot read property of " + base);
	}
	throw VMTypeError("Cannot read property '" + name + "' of " + base);
}

function NewOperator(expression, args) {
	return CompilerContext.expression(function(ctx) {
		var ref = ctx.compileExpression(expression);
		var cntr = ctx.compileGetValue(ref);
		var argList = ctx.compileEvaluateArguments(args);
		if (cntr.types.isNotObject()) {
			ctx.text("throw VMTypeError();");
			return COMPILER_UNDEFINED_VALUE;
		}
		ctx.text("if(! " + cntr.name + " ||! " + cntr.name + " ._Construct)throw VMTypeError();");
		return ctx.defineValue(cntr.name + " .Construct(" + argList.name + ")");
	});
}

function FunctionCall(expression, args, strict) {
	return CompilerContext.expression(function(ctx) {
		var ref = ctx.compileExpression(expression);
		var func = ctx.compileGetValue(ref);
		var argList = ctx.compileEvaluateArguments(args);
		if (func.types.isNotObject()) {
			ctx.text("throw VMTypeError();");
			return COMPILER_UNDEFINED_VALUE;
		}
		ctx.text("if(! " + func.name + " ||! " + func.name + " ._Call)throw VMTypeError();");
		if (ref.types === COMPILER_PROPERTY_REFERENCE_TYPE) {
			var thisValue = ref.base;
		}
		else if (ref.types === COMPILER_IDENTIFIER_REFERENCE_TYPE) {
			var thisValue = ctx.defineValue(ref.base.name + " .ImplicitThisValue()");
		}
		else {
			assert(ref.types.isValue(), ref); // provided that all expressions have own compilers
			var thisValue = COMPILER_UNDEFINED_VALUE;
		}
		if (ref.name === '"eval"' && ref.types === COMPILER_IDENTIFIER_REFERENCE_TYPE) {
			ctx.text("if(" + func.name + " ===vm.theEvalFunction)");
			var mval = ctx.defineValue("Global_eval(" + thisValue.name + "," + argList.name + ",true," + strict + ")");
			ctx.text("else");
			ctx.mergeDefineValue(mval, func.name + " .Call(" + thisValue.name + "," + argList.name + ")");
			return mval;
		}
		return ctx.defineValue(func.name + " .Call(" + thisValue.name + "," + argList.name + ")");
	});
}

function PostfixIncrementOperator(expression) {
	return CompilerContext.expression(function(ctx) {
		var lhs = ctx.compileExpression(expression);
		var oldValue = ctx.compileToNumber(ctx.compileGetValue(lhs));
		var newValue = ctx.defineNumber(oldValue.name + " +1");
		ctx.compilePutValue(lhs, newValue);
		return oldValue;
	});
}

function PostfixDecrementOperator(expression) {
	return CompilerContext.expression(function(ctx) {
		var lhs = ctx.compileExpression(expression);
		var oldValue = ctx.compileToNumber(ctx.compileGetValue(lhs));
		var newValue = ctx.defineNumber(oldValue.name + " -1");
		ctx.compilePutValue(lhs, newValue);
		return oldValue;
	});
}

function deleteOperator(expression) {
	return CompilerContext.expression(function(ctx) {
		var ref = ctx.compileExpression(expression);
		var base = ref.base;
		if (ref.types === COMPILER_PROPERTY_REFERENCE_TYPE) {
			return ctx.defineBoolean("ToObject(" + base.name + ").Delete(" + ref.name + "," + ref.strict + ");");
		}
		else if (ref.types === COMPILER_IDENTIFIER_REFERENCE_TYPE) {
			return ctx.defineBoolean("(" + base.name + " ===undefined)?true: " + //
			base.name + " .DeleteBinding(" + ref.name + ")");
		}
		else {
			assert(ref.types.isValue(), ref); // provided that all expressions have own compilers
			return COMPILER_TRUE_VALUE;
		}
	});
}

function voidOperator(expression) {
	return CompilerContext.expression(function(ctx) {
		var expr = ctx.compileExpression(expression);
		ctx.compileGetValue(expr);
		return COMPILER_UNDEFINED_VALUE;
	});
}

function typeofOperator(expression) {
	return CompilerContext.expression(function(ctx) {
		var val = ctx.compileExpression(expression);
		if (val.types === COMPILER_PROPERTY_REFERENCE_TYPE) {
			var val = ctx.compileGetValue(val);
		}
		else if (val.types === COMPILER_IDENTIFIER_REFERENCE_TYPE) {
			ctx.text("if(" + val.base.name + " !==undefined){");
			var val = ctx.compileGetValue(val);
			ctx.text("}else");
			ctx.merge(val, COMPILER_UNDEFINED_VALUE);
		}
		else {
			assert(val.types.isValue(), val); // provided that all expressions have own compilers
		}
		if (val.types.isObject()) {
			return ctx.defineString(val.name + " ._Call?'function':'object'");
		}
		if (val.types.isNotObject()) {
			return ctx.defineString("typeof " + val.name);
		}
		ctx.text("if(Type(" + val.name + ")===TYPE_Object)");
		var mval = ctx.defineString(val.name + " ._Call?'function':'object'");
		ctx.text("else");
		ctx.mergeDefineString(mval, "typeof " + val.name);
		return mval;
	});
}

function PrefixIncrementOperator(expression) {
	return CompilerContext.expression(function(ctx) {
		var expr = ctx.compileExpression(expression);
		var oldValue = ctx.compileToNumber(ctx.compileGetValue(expr));
		var newValue = ctx.defineNumber(oldValue.name + " +1");
		ctx.compilePutValue(expr, newValue);
		return newValue;
	});
}

function PrefixDecrementOperator(expression) {
	return CompilerContext.expression(function(ctx) {
		var expr = ctx.compileExpression(expression);
		var oldValue = ctx.compileToNumber(ctx.compileGetValue(expr));
		var newValue = ctx.defineNumber(oldValue.name + " -1");
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
		return ctx.defineNumber("- " + oldValue.name);
	});
}

function BitwiseNOTOperator(expression) {
	return CompilerContext.expression(function(ctx) {
		var expr = ctx.compileExpression(expression);
		var oldValue = ctx.compileToNumber(ctx.compileGetValue(expr));
		return ctx.defineNumber("~ " + oldValue.name);
	});
}

function LogicalNOTOperator(expression) {
	return CompilerContext.expression(function(ctx) {
		var expr = ctx.compileExpression(expression);
		var oldValue = ctx.compileGetValue(expr);
		return ctx.defineBoolean("! " + oldValue.name);
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
			return ctx.defineNumber(leftNum.name + " * " + rightNum.name);
		case '/':
			return ctx.defineNumber(leftNum.name + " / " + rightNum.name);
		case '%':
			return ctx.defineNumber(leftNum.name + " % " + rightNum.name);
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
			return ctx.defineString(lprim.name + " + " + rprim.name);
		}
		else if (lprim.types.isNotString() && rprim.types.isNotString()) {
			return ctx.defineNumber(lprim.name + " + " + rprim.name);
		}
		else {
			return ctx.defineValue(lprim.name + " + " + rprim.name);
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
		return ctx.defineNumber(lnum.name + " - " + rnum.name);
	});
}

function LeftShiftOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		var lnum = ctx.compileToNumber(lval);
		var rnum = ctx.compileToNumber(rval);
		return ctx.defineNumber(lnum.name + " << " + rnum.name);
	});
}

function SignedRightShiftOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		var lnum = ctx.compileToNumber(lval);
		var rnum = ctx.compileToNumber(rval);
		return ctx.defineNumber(lnum.name + " >> " + rnum.name);
	});
}

function UnsignedRightShiftOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		var lnum = ctx.compileToNumber(lval);
		var rnum = ctx.compileToNumber(rval);
		return ctx.defineNumber(lnum.name + " >>> " + rnum.name);
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
		return ctx.defineBoolean(px.name + " < " + py.name);
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
		return ctx.defineBoolean(px.name + " > " + py.name);
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
		return ctx.defineBoolean(px.name + " <= " + py.name);
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
		return ctx.defineBoolean(px.name + " >= " + py.name);
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
			return COMPILER_FALSE_VALUE;
		}
		ctx.text("if(Type(" + rval.name + ")!==TYPE_Object)throw VMTypeError();");
		ctx.text("if(" + rval.name + " .HasInstance===undefined)throw VMTypeError();");
		return ctx.defineBoolean(rval.name + " .HasInstance(" + lval.name + ")");
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
			return COMPILER_FALSE_VALUE;
		}
		ctx.text("if(Type(" + rval.name + ")!==TYPE_Object)throw VMTypeError();");
		var lval = ctx.compileToString(lval);
		return ctx.defineBoolean(rval.name + " .HasProperty(" + lval.name + ")");
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
			return ctx.defineBoolean(lval.name + " == " + rval.name);
		}
		if (lval.types.isString() || lval.types.isNumber() || lval.types.isBoolean()) {
			var rval = ctx.compileToPrimitive(rval);
			return ctx.defineBoolean(lval.name + " == " + rval.name);
		}
		return ctx.defineBoolean("abstractEqualityComparison(" + lval.name + " , " + rval.name + ")");
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
			return ctx.defineBoolean(lval.name + " != " + rval.name);
		}
		if (lval.types.isString() || lval.types.isNumber() || lval.types.isBoolean()) {
			var rval = ctx.compileToPrimitive(rval);
			return ctx.defineBoolean(lval.name + " != " + rval.name);
		}
		return ctx.defineBoolean("!abstractEqualityComparison(" + lval.name + " , " + rval.name + ")");
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
		return ctx.defineBoolean(lval.name + " === " + rval.name);
	});
}

function StrictDoesNotEqualOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		return ctx.defineBoolean(lval.name + " !== " + rval.name);
	});
}

function BinaryBitwiseOperator(operator, leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		var lnum = ctx.compileToNumber(lval);
		var rnum = ctx.compileToNumber(rval);
		switch (operator) {
		case '&':
			return ctx.defineNumber(lnum.name + " & " + rnum.name);
		case '^':
			return ctx.defineNumber(lnum.name + " ^ " + rnum.name);
		case '|':
			return ctx.defineNumber(lnum.name + " | " + rnum.name);
		}
	});
}

function LogicalAndOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		if (lval.isLiteral) {
			if (!lval.value) {
				return lval;
			}
			var rref = ctx.compileExpression(rightExpression);
			return ctx.compileGetValue(rref);
		}
		ctx.text("if(" + lval.name + "){");
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		ctx.merge(lval, rval);
		ctx.text("}");
		return lval;
	});
}

function LogicalOrOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		if (lval.isLiteral) {
			if (lval.value) {
				return lval;
			}
			var rref = ctx.compileExpression(rightExpression);
			return ctx.compileGetValue(rref);
		}
		ctx.text("if(! " + lval.name + "){");
		var rref = ctx.compileExpression(rightExpression);
		var rval = ctx.compileGetValue(rref);
		ctx.merge(lval, rval);
		ctx.text("}");
		return lval;
	});
}

function ConditionalOperator(condition, firstExpression, secondExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(condition);
		var lval = ctx.compileGetValue(lref);
		var mval = ctx.defineNone();
		ctx.text("if(" + lval.name + "){");
		var trueRef = ctx.compileExpression(firstExpression);
		ctx.merge(mval, ctx.compileGetValue(trueRef));
		ctx.text("}else{");
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
			var r = ctx.defineNumber(leftNum.name + " * " + rightNum.name);
			break;
		case '/=':
			var leftNum = ctx.compileToNumber(lval);
			var rightNum = ctx.compileToNumber(rval);
			var r = ctx.defineNumber(leftNum.name + " / " + rightNum.name);
			break;
		case '%=':
			var leftNum = ctx.compileToNumber(lval);
			var rightNum = ctx.compileToNumber(rval);
			var r = ctx.defineNumber(leftNum.name + " % " + rightNum.name);
			break;
		case '+=':
			var lprim = ctx.compileToPrimitive(lval);
			var rprim = ctx.compileToPrimitive(rval);
			if (lprim.types.isString() || rprim.types.isString()) {
				var r = ctx.defineString(lprim.name + " + " + rprim.name);
			}
			else if (lprim.types.isNotString() && rprim.types.isNotString()) {
				var r = ctx.defineNumber(lprim.name + " + " + rprim.name);
			}
			else {
				var r = ctx.defineValue(lprim.name + " + " + rprim.name);
			}
			break;
		case '-=':
			var leftNum = ctx.compileToNumber(lval);
			var rightNum = ctx.compileToNumber(rval);
			var r = ctx.defineNumber(leftNum.name + " - " + rightNum.name);
			break;
		case '<<=':
			var leftNum = ctx.compileToNumber(lval);
			var rightNum = ctx.compileToNumber(rval);
			var r = ctx.defineNumber(leftNum.name + " << " + rightNum.name);
			break;
		case '>>=':
			var leftNum = ctx.compileToNumber(lval);
			var rightNum = ctx.compileToNumber(rval);
			var r = ctx.defineNumber(leftNum.name + " >> " + rightNum.name);
			break;
		case '>>>=':
			var leftNum = ctx.compileToNumber(lval);
			var rightNum = ctx.compileToNumber(rval);
			var r = ctx.defineNumber(leftNum.name + " >>> " + rightNum.name);
			break;
		case '&=':
			var leftNum = ctx.compileToNumber(lval);
			var rightNum = ctx.compileToNumber(rval);
			var r = ctx.defineNumber(leftNum.name + " & " + rightNum.name);
			break;
		case '|=':
			var leftNum = ctx.compileToNumber(lval);
			var rightNum = ctx.compileToNumber(rval);
			var r = ctx.defineNumber(leftNum.name + " | " + rightNum.name);
			break;
		case '^=':
			var leftNum = ctx.compileToNumber(lval);
			var rightNum = ctx.compileToNumber(rval);
			var r = ctx.defineNumber(leftNum.name + " ^ " + rightNum.name);
			break;
		}
		ctx.compilePutValue(lref, r);
		return r;
	});
}

function CommaOperator(leftExpression, rightExpression) {
	return CompilerContext.expression(function(ctx) {
		var lref = ctx.compileExpression(leftExpression);
		var lval = ctx.compileGetValue(lref);
		var rref = ctx.compileExpression(rightExpression);
		return ctx.compileGetValue(rref);
	});
}
