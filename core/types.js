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

// ECMAScript 5.1: 8 Types

var TYPE_Undefined = 1;
var TYPE_Boolean = 2;
var TYPE_Number = 3;
var TYPE_String = 4;
var TYPE_Null = 5;
var TYPE_Object = 6;
var TYPE_Reference = 7;
var TYPE_EnvironmentRecord = 8;
var TYPE_Environment = 9;

function Type(x) {
	switch (typeof x) {
	case "undefined":
		return TYPE_Undefined;
	case "boolean":
		return TYPE_Boolean;
	case "number":
		return TYPE_Number;
	case "string":
		return TYPE_String;
	}
	if (x === null) return TYPE_Null;
	if (x.Class !== undefined) return TYPE_Object;
	if (x.referencedName !== undefined) return TYPE_Reference;
	if (x.HasBinding !== undefined) return TYPE_EnvironmentRecord;
	if (x.environmentRecord !== undefined) return TYPE_Environment;
	assert(false, x);
}

var CLASSID_Object = 1;
var CLASSID_BuiltinFunction = 2;
var CLASSID_FunctionObject = 3;
var CLASSID_BindFunction = 4;
var CLASSID_Array = 5;
var CLASSID_String = 6;
var CLASSID_Boolean = 7;
var CLASSID_Number = 8;
var CLASSID_Date = 9;
var CLASSID_RegExp = 10;
var CLASSID_Error = 11;
var CLASSID_Global = 12;
var CLASSID_Math = 13;
var CLASSID_JSON = 14;
var CLASSID_Arguments = 15;
var CLASSID_PlainArguments = 16;
var CLASSID_DeclarativeEnvironment = 17;
var CLASSID_ObjectEnvironment = 18;
var CLASSID_SourceObject = 19;
// extensions
var CLASSID_Buffer = 20;
var CLASSID_IOPort = 21;

var VMObjectClass;
var VMBuiltinFunctionClass;
var VMFunctionObjectClass;
var VMBindFunctionClass;
var VMArrayClass;
var VMStringClass;
var VMBooleanClass;
var VMNumberClass;
var VMDateClass;
var VMRegExpClass;
var VMErrorClass;
var VMGlobalClass;
var VMMathClass;
var VMJSONClass;
var VMArgumentsClass;
var VMPlainArgumentsClass;
var DeclarativeEnvironmentClass;
var ObjectEnvironmentClass;
var SourceObjectClass;
// extensions
var VMBufferClass;
var VMIOPortClass;

function setAlltheInternalMethod(Class, ClassID) {
	var obj = Object.create(null);
	obj.Class = Class;
	obj.ClassID = ClassID;
	obj.GetOwnProperty = default_GetOwnProperty;
	obj.GetProperty = default_GetProperty;
	obj.Get = default_Get;
	obj.CanPut = default_CanPut;
	obj.Put = default_Put;
	obj.HasProperty = default_HasProperty;
	obj.Delete = default_Delete;
	obj.DefaultValue = default_DefaultValue;
	obj.DefineOwnProperty = default_DefineOwnProperty;
	obj.enumerator = default_enumerator;
	obj.walkObject = default_walkObject;
	obj.writeObject = default_writeObject;
	obj.readObject = default_readObject;
	return obj;
}

function VMObject(ClassID) {
	switch (ClassID) {
	case CLASSID_Object:
		if (VMObjectClass === undefined) {
			var obj = setAlltheInternalMethod("Object", ClassID);
			VMObjectClass = freeze(obj);
		}
		var obj = Object.create(VMObjectClass);
		break;
	case CLASSID_BuiltinFunction:
		if (VMBuiltinFunctionClass === undefined) {
			var obj = setAlltheInternalMethod("Function", ClassID);
			obj.Get = FunctionObject_Get;
			obj.HasInstance = FunctionObject_HasInstance;
			obj.writeObject = BuiltinFunctionObject_writeObject;
			obj.readObject = BuiltinFunctionObject_readObject;
			VMBuiltinFunctionClass = freeze(obj);
		}
		var obj = Object.create(VMBuiltinFunctionClass);
		obj.Call = undefined;
		obj.Construct = undefined;
		break;
	case CLASSID_FunctionObject:
		if (VMFunctionObjectClass === undefined) {
			var obj = setAlltheInternalMethod("Function", ClassID);
			obj.Get = FunctionObject_Get;
			obj.Call = FunctionObject_Call;
			obj.Construct = FunctionObject_Construct;
			obj.HasInstance = FunctionObject_HasInstance;
			obj.walkObject = FunctionObject_walkObject;
			obj.writeObject = FunctionObject_writeObject;
			obj.readObject = FunctionObject_readObject;
			VMFunctionObjectClass = freeze(obj);
		}
		var obj = Object.create(VMFunctionObjectClass);
		obj.Scope = undefined;
		obj.FormalParameters = undefined;
		obj.Code = undefined;
		break;
	case CLASSID_BindFunction:
		if (VMBindFunctionClass === undefined) {
			var obj = setAlltheInternalMethod("Function", ClassID);
			obj.Get = FunctionObject_Get;
			obj.Call = BindFunction_Call;
			obj.Construct = BindFunction_Construct;
			obj.HasInstance = BindFunction_HasInstance;
			obj.walkObject = BindFunction_walkObject;
			obj.writeObject = BindFunction_writeObject;
			obj.readObject = BindFunction_readObject;
			VMBindFunctionClass = freeze(obj);
		}
		var obj = Object.create(VMBindFunctionClass);
		obj.TargetFunction = undefined;
		obj.BoundThis = undefined;
		obj.BoundArgs = undefined;
		break;
	case CLASSID_Array:
		if (VMArrayClass === undefined) {
			var obj = setAlltheInternalMethod("Array", ClassID);
			obj.DefineOwnProperty = ArrayObject_DefineOwnProperty;
			VMArrayClass = freeze(obj);
		}
		var obj = Object.create(VMArrayClass);
		break;
	case CLASSID_String:
		if (VMStringClass === undefined) {
			var obj = setAlltheInternalMethod("String", ClassID);
			obj.GetOwnProperty = StringObject_GetOwnProperty;
			obj.enumerator = StringObject_enumerator;
			obj.writeObject = PrimitiveObject_writeObject;
			obj.readObject = PrimitiveObject_readObject;
			VMStringClass = freeze(obj);
		}
		var obj = Object.create(VMStringClass);
		obj.PrimitiveValue = undefined;
		break;
	case CLASSID_Boolean:
		if (VMBooleanClass === undefined) {
			var obj = setAlltheInternalMethod("Boolean", ClassID);
			obj.writeObject = PrimitiveObject_writeObject;
			obj.readObject = PrimitiveObject_readObject;
			VMBooleanClass = freeze(obj);
		}
		var obj = Object.create(VMBooleanClass);
		obj.PrimitiveValue = undefined;
		break;
	case CLASSID_Number:
		if (VMNumberClass === undefined) {
			var obj = setAlltheInternalMethod("Number", ClassID);
			obj.writeObject = PrimitiveObject_writeObject;
			obj.readObject = PrimitiveObject_readObject;
			VMNumberClass = freeze(obj);
		}
		var obj = Object.create(VMNumberClass);
		obj.PrimitiveValue = undefined;
		break;
	case CLASSID_Date:
		if (VMDateClass === undefined) {
			var obj = setAlltheInternalMethod("Date", ClassID);
			obj.writeObject = PrimitiveObject_writeObject;
			obj.readObject = PrimitiveObject_readObject;
			VMDateClass = freeze(obj);
		}
		var obj = Object.create(VMDateClass);
		obj.PrimitiveValue = undefined;
		break;
	case CLASSID_RegExp:
		if (VMRegExpClass === undefined) {
			var obj = setAlltheInternalMethod("RegExp", ClassID);
			obj.writeObject = RegExp_writeObject;
			obj.readObject = RegExp_readObject;
			VMRegExpClass = freeze(obj);
		}
		var obj = Object.create(VMRegExpClass);
		obj.Match = undefined;
		obj.NCapturingParens = undefined;
		break;
	case CLASSID_Error:
		if (VMErrorClass === undefined) {
			var obj = setAlltheInternalMethod("Error", ClassID);
			obj.walkObject = Error_walkObject;
			obj.writeObject = Error_writeObject;
			obj.readObject = Error_readObject;
			VMErrorClass = freeze(obj);
		}
		var obj = Object.create(VMErrorClass);
		obj.stackTrace = [];
		break;
	case CLASSID_Global:
		if (VMGlobalClass === undefined) {
			var obj = setAlltheInternalMethod("Global", ClassID);
			VMGlobalClass = freeze(obj);
		}
		var obj = Object.create(VMGlobalClass);
		break;
	case CLASSID_Math:
		if (VMMathClass === undefined) {
			var obj = setAlltheInternalMethod("Math", ClassID);
			VMMathClass = freeze(obj);
		}
		var obj = Object.create(VMMathClass);
		break;
	case CLASSID_JSON:
		if (VMJSONClass === undefined) {
			var obj = setAlltheInternalMethod("JSON", ClassID);
			VMJSONClass = freeze(obj);
		}
		var obj = Object.create(VMJSONClass);
		break;
	case CLASSID_Arguments:
		if (VMArgumentsClass === undefined) {
			var obj = setAlltheInternalMethod("Arguments", ClassID);
			obj.GetOwnProperty = Arguments_GetOwnProperty;
			obj.Get = Arguments_Get;
			obj.Delete = Arguments_Delete;
			obj.DefineOwnProperty = Arguments_DefineOwnProperty;
			obj.walkObject = Arguments_walkObject;
			obj.writeObject = Arguments_writeObject;
			obj.readObject = Arguments_readObject;
			VMArgumentsClass = freeze(obj);
		}
		var obj = Object.create(VMArgumentsClass);
		obj.ParameterMap = undefined;
		obj.ArgumentsScope = undefined;
		break;
	case CLASSID_PlainArguments:
		if (VMPlainArgumentsClass === undefined) {
			var obj = setAlltheInternalMethod("Arguments", ClassID);
			VMPlainArgumentsClass = freeze(obj);
		}
		var obj = Object.create(VMPlainArgumentsClass);
		break;
	//extensions
	case CLASSID_Buffer:
		if (VMBufferClass === undefined) {
			var obj = setAlltheInternalMethod("Buffer", ClassID);
			obj.GetOwnProperty = BufferObject_GetOwnProperty;
			obj.enumerator = BufferObject_enumerator;
			obj.DefineOwnProperty = BufferObject_DefineOwnProperty;
			obj.writeObject = BufferObject_writeObject;
			obj.readObject = BufferObject_readObject;
			VMBufferClass = freeze(obj);
		}
		var obj = Object.create(VMBufferClass);
		obj.wrappedBuffer = undefined;
		break;
	case CLASSID_IOPort:
		if (VMIOPortClass === undefined) {
			var obj = setAlltheInternalMethod("IOPort", ClassID);
			VMIOPortClass = freeze(obj);
		}
		var obj = Object.create(VMIOPortClass);
		obj.handler = undefined;
		obj.txid = undefined;
		break;
	default:
		assert(false, ClassID);
	}
	obj.$properties = Object.create(null);
	obj.Prototype = undefined;
	obj.Extensible = undefined;
	obj.ID = 0;
	return preventExtensions(obj);
}

function ReferenceValue(base, referencedName, strictReference) {
	return freeze({
		base : base,
		referencedName : referencedName,
		strictReference : strictReference,
	});
}

function GetBase(V) {
	return V.base;
}

function GetReferencedName(V) {
	return V.referencedName;
}

function IsStrictReference(V) {
	return V.strictReference;
}

function HasPrimitiveBase(V) {
	switch (typeof V.base) {
	case "boolean":
	case "string":
	case "number":
		return true;
	}
	return false;
}

function IsPropertyReference(V) {
	if (Type(V.base) === TYPE_Object) return true;
	return HasPrimitiveBase(V);
}

function IsUnresolvableReference(V) {
	if (V.base === undefined) return true;
	return false;
}

function GetValue(V) {
	if (Type(V) !== TYPE_Reference) return V;
	var base = GetBase(V);
	if (IsUnresolvableReference(V)) throw VMReferenceError(GetReferencedName(V));
	if (IsPropertyReference(V)) {
		if (HasPrimitiveBase(V) === false) return base.Get(GetReferencedName(V));
		else return specialGet(base, GetReferencedName(V));
	}
	else {
		assertEquals(Type(base), TYPE_EnvironmentRecord, base);
		return base.GetBindingValue(GetReferencedName(V), IsStrictReference(V));
	}
}

function specialGet(base, P) {
	var O = ToObject(base);
	var desc = O.GetProperty(P);
	if (desc === undefined) return undefined;
	if (IsDataDescriptor(desc) === true) return desc.Value;
	else {
		assert(IsAccessorDescriptor(desc), desc);
		var getter = desc.Get;
		if (getter === undefined) return undefined;
		return getter.Call(base, []);
	}
}

function PutValue(V, W) {
	if (Type(V) !== TYPE_Reference) throw VMReferenceError();
	var base = GetBase(V);
	if (IsUnresolvableReference(V)) {
		if (IsStrictReference(V) === true) throw VMReferenceError(GetReferencedName(V));
		theGlobalObject.Put(GetReferencedName(V), W, false);
	}
	else if (IsPropertyReference(V)) {
		if (HasPrimitiveBase(V) === false) {
			base.Put(GetReferencedName(V), W, IsStrictReference(V));
		}
		else {
			specialPut(base, GetReferencedName(V), W, IsStrictReference(V));
		}
	}
	else {
		assertEquals(Type(base), TYPE_EnvironmentRecord, base);
		base.SetMutableBinding(GetReferencedName(V), W, IsStrictReference(V));
	}
	return;
}

function specialPut(base, P, W, Throw) {
	var O = ToObject(base);
	if (O.CanPut(P) === false) {
		if (Throw === true) throw VMTypeError();
		else return;
	}
	var ownDesc = O.GetOwnProperty(P);
	if (IsDataDescriptor(ownDesc) === true) {
		if (Throw === true) throw VMTypeError();
		else return;
	}
	var desc = O.GetProperty(P);
	if (IsAccessorDescriptor(desc) === true) {
		var setter = desc.Set;
		setter.Call(base, [ W ]);
	}
	else if (Throw === true) throw VMTypeError();
	return;
}

function CompletionValue(type, value, target) {
	return preventExtensions({
		type : type,
		value : value,
		target : target,
	});
}

function PropertyDescriptor(Desc) {
	if (!Desc.hasOwnProperty("Value")) {
		Desc.Value = absent;
	}
	if (!Desc.hasOwnProperty("Writable")) {
		Desc.Writable = absent;
	}
	if (!Desc.hasOwnProperty("Get")) {
		Desc.Get = absent;
	}
	if (!Desc.hasOwnProperty("Set")) {
		Desc.Set = absent;
	}
	if (!Desc.hasOwnProperty("Configurable")) {
		Desc.Configurable = absent;
	}
	if (!Desc.hasOwnProperty("Enumerable")) {
		Desc.Enumerable = absent;
	}
	assert((Desc.Get === absent && Desc.Set === absent) || (Desc.Value === absent && Desc.Writable === absent), Desc);
	return freeze(Desc);
}

function IsAccessorDescriptor(Desc) {
	if (Desc === undefined) return false;
	if (Desc.Get === absent && Desc.Set === absent) return false;
	return true;
}

function IsDataDescriptor(Desc) {
	if (Desc === undefined) return false;
	if (Desc.Value === absent && Desc.Writable === absent) return false;
	return true;
}

function IsGenericDescriptor(Desc) {
	if (Desc === undefined) return false;
	if (IsAccessorDescriptor(Desc) === false && IsDataDescriptor(Desc) === false) return true;
	return false;
}

function FromPropertyDescriptor(Desc) {
	if (Desc === undefined) return undefined;
	var obj = Object_Construct([]);
	if (IsDataDescriptor(Desc) === true) {
		assert(Desc.Value !== absent, Desc);
		assert(Desc.Writable !== absent, Desc);
		obj.DefineOwnProperty("value", PropertyDescriptor({
			Value : Desc.Value,
			Writable : true,
			Enumerable : true,
			Configurable : true
		}), false);
		obj.DefineOwnProperty("writable", PropertyDescriptor({
			Value : Desc.Writable,
			Writable : true,
			Enumerable : true,
			Configurable : true
		}), false);
	}
	else {
		assert(IsAccessorDescriptor(Desc), Desc);
		assert(Desc.Get !== absent, Desc);
		assert(Desc.Set !== absent, Desc);
		obj.DefineOwnProperty("get", PropertyDescriptor({
			Value : Desc.Get,
			Writable : true,
			Enumerable : true,
			Configurable : true
		}), false);
		obj.DefineOwnProperty("set", PropertyDescriptor({
			Value : Desc.Set,
			Writable : true,
			Enumerable : true,
			Configurable : true
		}), false);
	}
	assert(Desc.Enumerable !== absent, Desc);
	assert(Desc.Configurable !== absent, Desc);
	obj.DefineOwnProperty("enumerable", PropertyDescriptor({
		Value : Desc.Enumerable,
		Writable : true,
		Enumerable : true,
		Configurable : true
	}), false);
	obj.DefineOwnProperty("configurable", PropertyDescriptor({
		Value : Desc.Configurable,
		Writable : true,
		Enumerable : true,
		Configurable : true
	}), false);
	return obj;
}

function ToPropertyDescriptor(Obj) {
	var Enumerable = absent;
	var Configurable = absent;
	var Value = absent;
	var Writable = absent;
	var Get = absent;
	var Set = absent;
	if (Type(Obj) !== TYPE_Object) throw VMTypeError();
	if (Obj.HasProperty("enumerable") === true) {
		var enum_ = Obj.Get("enumerable");
		var Enumerable = ToBoolean(enum_);
	}
	if (Obj.HasProperty("configurable") === true) {
		var conf = Obj.Get("configurable");
		var Configurable = ToBoolean(conf);
	}
	if (Obj.HasProperty("value") === true) {
		var value = Obj.Get("value");
		var Value = value;
	}
	if (Obj.HasProperty("writable") === true) {
		var writable = Obj.Get("writable");
		var Writable = ToBoolean(writable);
	}
	if (Obj.HasProperty("get") === true) {
		var getter = Obj.Get("get");
		if (IsCallable(getter) === false && getter !== undefined) throw VMTypeError();
		var Get = getter;
	}
	if (Obj.HasProperty("set") === true) {
		var setter = Obj.Get("set");
		if (IsCallable(setter) === false && setter !== undefined) throw VMTypeError();
		var Set = setter;
	}
	if (Get !== absent || Set !== absent) {
		if (Value !== absent || Writable !== absent) throw VMTypeError();
	}
	var desc = PropertyDescriptor({
		Enumerable : Enumerable,
		Configurable : Configurable,
		Value : Value,
		Writable : Writable,
		Get : Get,
		Set : Set,
	});
	return desc;
}

function default_GetOwnProperty(P) {
	return this.$properties[P];
}

function default_GetProperty(P) {
	var O = this;
	var prop = O.GetOwnProperty(P);
	if (prop !== undefined) return prop;
	var proto = O.Prototype;
	if (proto === null) return undefined;
	return proto.GetProperty(P);
}

function default_Get(P) {
	var O = this;
	var desc = O.GetProperty(P);
	if (desc === undefined) return undefined;
	if (IsDataDescriptor(desc) === true) return desc.Value;
	else {
		assert(IsAccessorDescriptor(desc), desc);
		var getter = desc.Get;
		if (getter === undefined) return undefined;
		return getter.Call(O, []);
	}
}

function default_CanPut(P) {
	var O = this;
	var desc = O.GetOwnProperty(P);
	if (desc !== undefined) {
		if (IsAccessorDescriptor(desc) === true) {
			if (desc.Set === undefined) return false;
			else return true;
		}
		else {
			assert(IsDataDescriptor(desc), desc);
		}
		return desc.Writable;
	}
	var proto = O.Prototype;
	if (proto === null) return O.Extensible;
	var inherited = proto.GetProperty(P);
	if (inherited === undefined) return O.Extensible;
	if (IsAccessorDescriptor(inherited) === true) {
		if (inherited.Set === undefined) return false;
		else return true;
	}
	else {
		assert(IsDataDescriptor(inherited), inherited);
		if (O.Extensible === false) return false;
		else return inherited.Writable;
	}
}

function default_Put(P, V, Throw) {
	var O = this;
	var ownDesc = O.GetOwnProperty(P);
	if (IsDataDescriptor(ownDesc) === true) {
		if (ownDesc.Writable === false) {
			if (Throw === true) throw VMTypeError();
			else return;
		}
		if (O.DefineOwnProperty === default_DefineOwnProperty) {
			//shortcut optimization
			intrinsic_set_value(O, P, V, ownDesc);
			return;
		}
		if (O.DefineOwnProperty === ArrayObject_DefineOwnProperty) {
			//shortcut optimization
			ArrayObject_DefineOwnProperty_Value(O, P, V, ownDesc);
			return;
		}
		var valueDesc = PropertyDescriptor({
			Value : V
		});
		O.DefineOwnProperty(P, valueDesc, Throw);
		return;
	}
	if (O.CanPut(P) === false) {
		if (Throw === true) throw VMTypeError();
		else return;
	}
	var desc = O.GetProperty(P);
	if (IsAccessorDescriptor(desc) === true) {
		var setter = desc.Set;
		assert(setter !== undefined, desc);
		setter.Call(O, [ V ]);
	}
	else {
		var newDesc = PropertyDescriptor({
			Value : V,
			Writable : true,
			Enumerable : true,
			Configurable : true
		});
		O.DefineOwnProperty(P, newDesc, Throw);
	}
	return;
}

function default_HasProperty(P) {
	var O = this;
	var desc = O.GetProperty(P);
	if (desc === undefined) return false;
	else return true;
}

function default_Delete(P, Throw) {
	var O = this;
	var desc = O.GetOwnProperty(P);
	if (desc === undefined) return true;
	if (desc.Configurable === true) {
		intrinsic_remove(O, P);
		return true;
	}
	else if (Throw) throw VMTypeError();
	return false;
}

function default_DefaultValue(hint) {
	var O = this;
	if (hint === undefined) {
		if (O.Class === "Date") {
			hint = TYPE_String;
		}
		else {
			hint = TYPE_Number;
		}
	}
	if (hint === TYPE_String) {
		var toString = O.Get("toString");
		if (IsCallable(toString) === true) {
			var str = toString.Call(O, []);
			if (Type(str) !== TYPE_Object) return str;
		}
		var valueOf = O.Get("valueOf");
		if (IsCallable(valueOf) === true) {
			var val = valueOf.Call(O, []);
			if (Type(val) !== TYPE_Object) return val;
		}
		throw VMTypeError();
	}
	if (hint === TYPE_Number) {
		var valueOf = O.Get("valueOf");
		if (IsCallable(valueOf) === true) {
			var val = valueOf.Call(O, []);
			if (Type(val) !== TYPE_Object) return val;
		}
		var toString = O.Get("toString");
		if (IsCallable(toString) === true) {
			var str = toString.Call(O, []);
			if (Type(str) !== TYPE_Object) return str;
		}
		throw VMTypeError();
	}
}

var emptyPropertyDescriptor = PropertyDescriptor({});

function default_DefineOwnProperty(P, Desc, Throw) {
	var O = this;
	var current = O.GetOwnProperty(P);
	var extensible = O.Extensible;
	if (current === undefined && extensible === false) {
		if (Throw === true) throw VMTypeError();
		else return false;
	}
	if (current === undefined && extensible === true) {
		if (IsGenericDescriptor(Desc) === true || IsDataDescriptor(Desc) === true) {
			intrinsic_createData(O, P, Desc);
		}
		else {
			assert(IsAccessorDescriptor(Desc), Desc);
			intrinsic_createAccessor(O, P, Desc);
		}
		return true;
	}
	if (isEveryFieldOcurrsAndSameAs(Desc, emptyPropertyDescriptor)) return true;
	if (isEveryFieldOcurrsAndSameAs(Desc, current)) return true;
	if (current.Configurable === false) {
		if (Desc.Configurable === true) {
			if (Throw === true) throw VMTypeError();
			else return false;
		}
		if (Desc.Enumerable !== absent && current.Enumerable !== Desc.Enumerable) {
			if (Throw === true) throw VMTypeError();
			else return false;
		}
	}
	if (IsGenericDescriptor(Desc) === true) {
	}
	else if (IsDataDescriptor(current) !== IsDataDescriptor(Desc)) {
		if (current.Configurable === false) {
			if (Throw === true) throw VMTypeError();
			else return false;
		}
		if (IsDataDescriptor(current) === true) {
			intrinsic_createAccessor(O, P, PropertyDescriptor({
				Configurable : current.Configurable,
				Enumerable : current.Enumerable,
			}));
		}
		else {
			intrinsic_createData(O, P, PropertyDescriptor({
				Configurable : current.Configurable,
				Enumerable : current.Enumerable,
			}));
		}
	}
	else if (IsDataDescriptor(current) === true && IsDataDescriptor(Desc) === true) {
		if (current.Configurable === false) {
			if (current.Writable === false && Desc.Writable === true) {
				if (Throw === true) throw VMTypeError();
				else return false;
			}
			if (current.Writable === false) {
				if (Desc.Value !== absent && SameValue(Desc.Value, current.Value) === false) {
					if (Throw === true) throw VMTypeError();
					else return false;
				}
			}
		}
		else {
			assert(current.Configurable, current);
		}
	}
	else {
		assert(IsAccessorDescriptor(current), current);
		assert(IsAccessorDescriptor(Desc), Desc);
		if (current.Configurable === false) {
			if (Desc.Set !== absent && SameValue(Desc.Set, current.Set) === false) {
				if (Throw === true) throw VMTypeError();
				else return false;
			}
			if (Desc.Get !== absent && SameValue(Desc.Get, current.Get) === false) {
				if (Throw === true) throw VMTypeError();
				else return false;
			}
		}
	}
	intrinsic_set(O, P, Desc);
	return true;
}

function isEveryFieldOcurrsAndSameAs(Desc, x) {
	if (Desc.Value !== absent) {
		if (x.Value === absent) return false;
		if (!SameValue(Desc.Value, x.Value)) return false;
	}
	if (Desc.Writable !== absent) {
		if (x.Writable === absent) return false;
		if (!SameValue(Desc.Writable, x.Writable)) return false;
	}
	if (Desc.Get !== absent) {
		if (x.Get === absent) return false;
		if (!SameValue(Desc.Get, x.Get)) return false;
	}
	if (Desc.Set !== absent) {
		if (x.Set === absent) return false;
		if (!SameValue(Desc.Set, x.Set)) return false;
	}
	if (Desc.Configurable !== absent) {
		if (x.Configurable === absent) return false;
		if (!SameValue(Desc.Configurable, x.Configurable)) return false;
	}
	if (Desc.Enumerable !== absent) {
		if (x.Enumerable === absent) return false;
		if (!SameValue(Desc.Enumerable, x.Enumerable)) return false;
	}
	return true;
}

function default_enumerator(ownOnly, enumerableOnly) {
	return intrinsic_enumerator(this, ownOnly, enumerableOnly);
}

function intrinsic_set(O, P, Desc) {
	var x = O.$properties[P];
	O.$properties[P] = freeze({
		Value : (Desc.Value !== absent) ? Desc.Value : x.Value,
		Writable : (Desc.Writable !== absent) ? Desc.Writable : x.Writable,
		Get : (Desc.Get !== absent) ? Desc.Get : x.Get,
		Set : (Desc.Set !== absent) ? Desc.Set : x.Set,
		Configurable : (Desc.Configurable !== absent) ? Desc.Configurable : x.Configurable,
		Enumerable : (Desc.Enumerable !== absent) ? Desc.Enumerable : x.Enumerable,
	});
}

function intrinsic_set_value(O, P, V, x) {
	assert(x.Writable, x);
	O.$properties[P] = freeze({
		Value : V,
		Writable : true,
		Get : absent,
		Set : absent,
		Configurable : x.Configurable,
		Enumerable : x.Enumerable,
	});
}

function intrinsic_remove(O, P) {
	delete O.$properties[P];
}

function intrinsic_createData(O, P, Desc) {
	var x = {
		Value : undefined,
		Writable : false,
		Get : absent,
		Set : absent,
		Enumerable : false,
		Configurable : false,
	};
	if (Desc.Value !== absent) {
		x.Value = Desc.Value;
	}
	if (Desc.Writable !== absent) {
		x.Writable = Desc.Writable;
	}
	if (Desc.Configurable !== absent) {
		x.Configurable = Desc.Configurable;
	}
	if (Desc.Enumerable !== absent) {
		x.Enumerable = Desc.Enumerable;
	}
	O.$properties[P] = freeze(x);
}

function intrinsic_createAccessor(O, P, Desc) {
	var x = {
		Value : absent,
		Writable : absent,
		Get : undefined,
		Set : undefined,
		Enumerable : false,
		Configurable : false,
	};
	if (Desc.Get !== absent) {
		x.Get = Desc.Get;
	}
	if (Desc.Set !== absent) {
		x.Set = Desc.Set;
	}
	if (Desc.Configurable !== absent) {
		x.Configurable = Desc.Configurable;
	}
	if (Desc.Enumerable !== absent) {
		x.Enumerable = Desc.Enumerable;
	}
	O.$properties[P] = freeze(x);
}

function intrinsic_enumerator(O, ownOnly, enumerableOnly) {
	var names = Object.keys(O.$properties);
	if (ownOnly !== true) {
		var all = Object.create(null);
		var proto = O;
		while (proto !== null) {
			for ( var P in proto.$properties) {
				var desc = proto.$properties[P];
				if (enumerableOnly === false || desc.Enumerable === true) {
					all[P] = P;
				}
			}
			proto = proto.Prototype;
		}
		var names = Object.keys(all);
	}
	var i = 0;
	var next = function() {
		while (true) {
			var P = names[i++];
			if (P === undefined) return undefined;
			var desc = O.$properties[P];
			if (desc === undefined) {
				if (ownOnly === true) {
					continue;
				}
				var proto = O.Prototype;
				while (proto !== null) {
					var desc = proto.$properties[P];
					if (desc !== undefined) {
						break;
					}
					proto = proto.Prototype;
				}
				if (desc === undefined) {
					continue;
				}
			}
			if (enumerableOnly === false || desc.Enumerable === true) return P;
		}
	}
	return next;
}
