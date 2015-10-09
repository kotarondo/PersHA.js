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
		return ctx.define("ThisBinding", CompilerTypes.VALUE_TYPE);
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
				CompilerTypes.ANY_TYPE);
		return {
			name : identifier,
			types : CompilerTypes.IDENTIFIER_REFERENCE_TYPE,
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
			var types = CompilerTypes.NUMBER_TYPE;
			break;
		case TYPE_String:
			var types = CompilerTypes.STRING_TYPE;
			break;
		case TYPE_Undefined:
			var types = CompilerTypes.UNDEFINED_TYPE;
			break;
		case TYPE_Null:
			var types = CompilerTypes.NULL_TYPE;
			break;
		case TYPE_Boolean:
			var types = CompilerTypes.BOOLEAN_TYPE;
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
		var newValue = ctx.define(oldValue.name + "+1", CompilerTypes.NUMBER_TYPE);
		ctx.compilePutValue(lhs, newValue);
		return oldValue;
	});
}

function PostfixDecrementOperator(expression) {
	return CompilerContext.expression(function(ctx) {
		var lhs = ctx.compileExpression(expression);
		var oldValue = ctx.compileToNumber(ctx.compileGetValue(lhs));
		var newValue = ctx.define(oldValue.name + "-1", CompilerTypes.NUMBER_TYPE);
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
			types : CompilerTypes.UNDEFINED_TYPE,
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
		var newValue = ctx.define(oldValue.name + "+1", CompilerTypes.NUMBER_TYPE);
		ctx.compilePutValue(expr, newValue);
		return newValue;
	});
}

function PrefixDecrementOperator(expression) {
	return CompilerContext.expression(function(ctx) {
		var expr = ctx.compileExpression(expression);
		var oldValue = ctx.compileToNumber(ctx.compileGetValue(expr));
		var newValue = ctx.define(oldValue.name + "-1", CompilerTypes.NUMBER_TYPE);
		ctx.compilePutValue(expr, newValue);
		return newValue;
	});
}

function PlusOperator(expression) {
	return function() {
		var expr = expression();
		return ToNumber(GetValue(expr));
	};
}

function MinusOperator(expression) {
	return function() {
		var expr = expression();
		var oldValue = ToNumber(GetValue(expr));
		return -oldValue;
	};
}

function BitwiseNOTOperator(expression) {
	return function() {
		var expr = expression();
		var oldValue = ToInt32(GetValue(expr));
		return ~oldValue;
	};
}

function LogicalNOTOperator(expression) {
	return function() {
		var expr = expression();
		var oldValue = ToBoolean(GetValue(expr));
		if (oldValue === true) return false;
		return true;
	};
}

function MultiplicativeOperator(operator, leftExpression, rightExpression) {
	return function() {
		var left = leftExpression();
		var leftValue = GetValue(left);
		var right = rightExpression();
		var rightValue = GetValue(right);
		var leftNum = ToNumber(leftValue);
		var rightNum = ToNumber(rightValue);
		switch (operator) {
		case '*':
			return leftNum * rightNum;
		case '/':
			return leftNum / rightNum;
		case '%':
			return leftNum % rightNum;
		}
	};
}

function AdditionOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var lprim = ToPrimitive(lval);
		var rprim = ToPrimitive(rval);
		if (Type(lprim) === TYPE_String || Type(rprim) === TYPE_String) return ToString(lprim) + ToString(rprim);
		else return ToNumber(lprim) + ToNumber(rprim);
	};
}

function SubtractionOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var lnum = ToNumber(lval);
		var rnum = ToNumber(rval);
		return lnum - rnum;
	};
}

function LeftShiftOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var lnum = ToInt32(lval);
		var rnum = ToUint32(rval);
		var shiftCount = rnum & 0x1F;
		return lnum << shiftCount;
	};
}

function SignedRightShiftOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var lnum = ToInt32(lval);
		var rnum = ToUint32(rval);
		var shiftCount = rnum & 0x1F;
		return lnum >> shiftCount;
	};
}

function UnsignedRightShiftOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var lnum = ToUint32(lval);
		var rnum = ToUint32(rval);
		var shiftCount = rnum & 0x1F;
		return lnum >>> shiftCount;
	};
}

function LessThanOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var r = abstractRelationalComparison(lval, rval);
		if (r === undefined) return false;
		return r;
	};
}

function GreaterThanOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var r = abstractRelationalComparison(rval, lval, false);
		if (r === undefined) return false;
		return r;
	};
}

function LessThanOrEqualOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var r = abstractRelationalComparison(rval, lval, false);
		if (r === true || r === undefined) return false;
		return true;
	};
}

function GreaterThanOrEqualOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var r = abstractRelationalComparison(lval, rval);
		if (r === true || r === undefined) return false;
		return true;
	};
}

function abstractRelationalComparison(x, y, LeftFirst) {
	if (LeftFirst !== false) {
		var px = ToPrimitive(x, TYPE_Number);
		var py = ToPrimitive(y, TYPE_Number);
	}
	else {
		var py = ToPrimitive(y, TYPE_Number);
		var px = ToPrimitive(x, TYPE_Number);
	}
	if (!(Type(px) === TYPE_String && Type(py) === TYPE_String)) {
		var nx = ToNumber(px);
		var ny = ToNumber(py);
		if (isNaN(nx)) return undefined;
		if (isNaN(ny)) return undefined;
		return (nx < ny);
	}
	else return (px < py);
}

function instanceofOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		if (Type(rval) !== TYPE_Object) throw VMTypeError();
		if (rval.HasInstance === undefined) throw VMTypeError();
		return rval.HasInstance(lval);
	};
}

function inOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		if (Type(rval) !== TYPE_Object) throw VMTypeError();
		return rval.HasProperty(ToString(lval));
	};
}

function EqualsOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		return abstractEqualityComparison(lval, rval);
	};
}

function DoesNotEqualOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var r = abstractEqualityComparison(lval, rval);
		if (r === true) return false;
		return true;
	};
}

function abstractEqualityComparison(x, y) {
	if (Type(x) === Type(y)) return (x === y);
	if (x === null && y === undefined) return true;
	if (x === undefined && y === null) return true;
	if (Type(x) === TYPE_Number && Type(y) === TYPE_String) return abstractEqualityComparison(x, ToNumber(y));
	if (Type(x) === TYPE_String && Type(y) === TYPE_Number) return abstractEqualityComparison(ToNumber(x), y);
	if (Type(x) === TYPE_Boolean) return abstractEqualityComparison(ToNumber(x), y);
	if (Type(y) === TYPE_Boolean) return abstractEqualityComparison(x, ToNumber(y));
	if ((Type(x) === TYPE_String || Type(x) === TYPE_Number) && Type(y) === TYPE_Object)
		return abstractEqualityComparison(x, ToPrimitive(y));
	if (Type(x) === TYPE_Object && (Type(y) === TYPE_String || Type(y) === TYPE_Number))
		return abstractEqualityComparison(ToPrimitive(x), y);
	return false;
}

function StrictEqualsOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		return (lval === rval);
	};
}

function StrictDoesNotEqualOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		if (lval === rval) return false;
		return true;
	};
}

function BinaryBitwiseOperator(operator, leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		var lnum = ToInt32(lval);
		var rnum = ToInt32(rval);
		switch (operator) {
		case '&':
			return lnum & rnum;
		case '^':
			return lnum ^ rnum;
		case '|':
			return lnum | rnum;
		}
	};
}

function LogicalAndOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		if (ToBoolean(lval) === false) return lval;
		var rref = rightExpression();
		return GetValue(rref);
	};
}

function LogicalOrOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		if (ToBoolean(lval) === true) return lval;
		var rref = rightExpression();
		return GetValue(rref);
	};
}

function ConditionalOperator(condition, firstExpression, secondExpression) {
	return function() {
		var lref = condition();
		if (ToBoolean(GetValue(lref)) === true) {
			var trueRef = firstExpression();
			return GetValue(trueRef);
		}
		else {
			var falseRef = secondExpression();
			return GetValue(falseRef);
		}
	};
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
	return function() {
		var lref = leftExpression();
		var lval = GetValue(lref);
		var rref = rightExpression();
		var rval = GetValue(rref);
		switch (operator) {
		case '*=':
			var r = ToNumber(lval) * ToNumber(rval);
			break;
		case '/=':
			var r = ToNumber(lval) / ToNumber(rval);
			break;
		case '%=':
			var r = ToNumber(lval) % ToNumber(rval);
			break;
		case '+=':
			var lprim = ToPrimitive(lval);
			var rprim = ToPrimitive(rval);
			if (Type(lprim) === TYPE_String || Type(rprim) === TYPE_String) {
				var r = ToString(lprim) + ToString(rprim);
			}
			else {
				var r = ToNumber(lprim) + ToNumber(rprim);
			}
			break;
		case '-=':
			var r = ToNumber(lval) - ToNumber(rval);
			break;
		case '<<=':
			var r = ToInt32(lval) << (ToUint32(rval) & 0x1F);
			break;
		case '>>=':
			var r = ToInt32(lval) >> (ToUint32(rval) & 0x1F);
			break;
		case '>>>=':
			var r = ToUint32(lval) >>> (ToUint32(rval) & 0x1F);
			break;
		case '&=':
			var r = ToInt32(lval) & ToInt32(rval);
			break;
		case '|=':
			var r = ToInt32(lval) | ToInt32(rval);
			break;
		case '^=':
			var r = ToInt32(lval) ^ ToInt32(rval);
			break;
		}
		PutValue(lref, r);
		return r;
	};
}

function CommaOperator(leftExpression, rightExpression) {
	return function() {
		var lref = leftExpression();
		GetValue(lref);
		var rref = rightExpression();
		return GetValue(rref);
	};
}
