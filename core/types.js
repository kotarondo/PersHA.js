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
var TYPE_Environment = 8;

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
	if (x.strictReference !== undefined) return TYPE_Reference;
	if (x.HasBinding !== undefined) return TYPE_EnvironmentRecord;
	assert(false, x);
}

var CLASSID_Object = 1;
var CLASSID_Function = 2;
var CLASSID_BuiltinFunction = 3;
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
var CLASSID_Script = 22;
var CLASSID_vm = 23;
var CLASSID_mirror = 24;

var Class_Object;
var Class_Function;
var Class_BuiltinFunction;
var Class_BindFunction;
var Class_Array;
var Class_String;
var Class_Boolean;
var Class_Number;
var Class_Date;
var Class_RegExp;
var Class_Error;
var Class_Global;
var Class_Math;
var Class_JSON;
var Class_Arguments;
var Class_PlainArguments;
var Class_DeclarativeEnvironment;
var Class_ObjectEnvironment;
var Class_SourceObject;
// extensions
var Class_Buffer;
var Class_IOPort;
var Class_Script;
var Class_vm;

function setAlltheInternalMethod(Class, ClassID) {
	var obj = {};
	obj.ClassID = ClassID;
	obj.Class = Class;
	obj.GetOwnProperty = default_GetOwnProperty;
	obj.GetProperty = default_GetProperty;
	obj.Get = default_Get;
	obj.CanPut = default_CanPut;
	obj.Put = default_Put;
	obj.HasProperty = default_HasProperty;
	obj.Delete = default_Delete;
	obj.DefaultValue = default_DefaultValue;
	obj.DefineOwnProperty = default_DefineOwnProperty;
	obj.Call = vm_wrapper_ClassCall;
	obj.Construct = vm_wrapper_ClassConstruct;
	obj.enumerator = default_enumerator;
	obj.walkObject = default_walkObject;
	obj.writeObject = default_writeObject;
	obj.readObject = default_readObject;
	return obj;
}

function VMObject(ClassID) {
	switch (ClassID) {
	case CLASSID_Object:
		if (Class_Object === undefined) {
			var obj = setAlltheInternalMethod("Object", ClassID);
			obj.GetProperty = default_FastGetProperty;
			obj.Get = default_FastGet;
			obj.Put = default_FastPut;
			Class_Object = obj;
		}
		var obj = Object.create(Class_Object);
		break;
	case CLASSID_BuiltinFunction:
		if (Class_BuiltinFunction === undefined) {
			var obj = setAlltheInternalMethod("Function", ClassID);
			obj.GetProperty = default_FastGetProperty;
			obj.Put = default_FastPut;
			obj.Get = Function_Get;
			obj.HasInstance = Function_HasInstance;
			obj.writeObject = BuiltinFunction_writeObject;
			obj.readObject = BuiltinFunction_readObject;
			Class_BuiltinFunction = obj;
		}
		var obj = Object.create(Class_BuiltinFunction);
		obj.vm = undefined;
		obj._Call = undefined;
		obj._Construct = undefined;
		break;
	case CLASSID_Function:
		if (Class_Function === undefined) {
			var obj = setAlltheInternalMethod("Function", ClassID);
			obj.GetProperty = default_FastGetProperty;
			obj.Put = default_FastPut;
			obj.Get = Function_Get;
			obj._Call = Function_ClassCall;
			obj._Construct = Function_ClassConstruct;
			obj.HasInstance = Function_HasInstance;
			obj.walkObject = Function_walkObject;
			obj.writeObject = Function_writeObject;
			obj.readObject = Function_readObject;
			Class_Function = obj;
		}
		var obj = Object.create(Class_Function);
		obj.vm = undefined;
		obj.Scope = undefined;
		obj.Code = undefined;
		break;
	case CLASSID_BindFunction:
		if (Class_BindFunction === undefined) {
			var obj = setAlltheInternalMethod("Function", ClassID);
			obj.GetProperty = default_FastGetProperty;
			obj.Put = default_FastPut;
			obj.Get = Function_Get;
			obj._Call = BindFunction_ClassCall;
			obj._Construct = BindFunction_ClassConstruct;
			obj.HasInstance = BindFunction_HasInstance;
			obj.walkObject = BindFunction_walkObject;
			obj.writeObject = BindFunction_writeObject;
			obj.readObject = BindFunction_readObject;
			Class_BindFunction = obj;
		}
		var obj = Object.create(Class_BindFunction);
		obj.vm = undefined;
		obj.TargetFunction = undefined;
		obj.BoundThis = undefined;
		obj.BoundArgs = undefined;
		break;
	case CLASSID_Array:
		if (Class_Array === undefined) {
			var obj = setAlltheInternalMethod("Array", ClassID);
			obj.GetProperty = default_FastGetProperty;
			obj.Get = default_FastGet;
			obj.Put = Array_FastPut;
			obj.DefineOwnProperty = Array_DefineOwnProperty;
			Class_Array = obj;
		}
		var obj = Object.create(Class_Array);
		break;
	case CLASSID_String:
		if (Class_String === undefined) {
			var obj = setAlltheInternalMethod("String", ClassID);
			obj.Get = String_FastGet;
			obj.Put = String_FastPut;
			obj.GetOwnProperty = String_GetOwnProperty;
			obj.enumerator = String_enumerator;
			obj.writeObject = Primitive_writeObject;
			obj.readObject = Primitive_readObject;
			Class_String = obj;
		}
		var obj = Object.create(Class_String);
		obj.PrimitiveValue = undefined;
		break;
	case CLASSID_Boolean:
		if (Class_Boolean === undefined) {
			var obj = setAlltheInternalMethod("Boolean", ClassID);
			obj.GetProperty = default_FastGetProperty;
			obj.Get = default_FastGet;
			obj.Put = default_FastPut;
			obj.writeObject = Primitive_writeObject;
			obj.readObject = Primitive_readObject;
			Class_Boolean = obj;
		}
		var obj = Object.create(Class_Boolean);
		obj.PrimitiveValue = undefined;
		break;
	case CLASSID_Number:
		if (Class_Number === undefined) {
			var obj = setAlltheInternalMethod("Number", ClassID);
			obj.GetProperty = default_FastGetProperty;
			obj.Get = default_FastGet;
			obj.Put = default_FastPut;
			obj.writeObject = Primitive_writeObject;
			obj.readObject = Primitive_readObject;
			Class_Number = obj;
		}
		var obj = Object.create(Class_Number);
		obj.PrimitiveValue = undefined;
		break;
	case CLASSID_Date:
		if (Class_Date === undefined) {
			var obj = setAlltheInternalMethod("Date", ClassID);
			obj.GetProperty = default_FastGetProperty;
			obj.Get = default_FastGet;
			obj.Put = default_FastPut;
			obj.writeObject = Primitive_writeObject;
			obj.readObject = Primitive_readObject;
			Class_Date = obj;
		}
		var obj = Object.create(Class_Date);
		obj.PrimitiveValue = undefined;
		break;
	case CLASSID_RegExp:
		if (Class_RegExp === undefined) {
			var obj = setAlltheInternalMethod("RegExp", ClassID);
			obj.GetProperty = default_FastGetProperty;
			obj.Get = default_FastGet;
			obj.Put = default_FastPut;
			obj.writeObject = RegExp_writeObject;
			obj.readObject = RegExp_readObject;
			Class_RegExp = obj;
		}
		var obj = Object.create(Class_RegExp);
		obj.Match = undefined;
		obj.NCapturingParens = undefined;
		break;
	case CLASSID_Error:
		if (Class_Error === undefined) {
			var obj = setAlltheInternalMethod("Error", ClassID);
			obj.GetProperty = default_FastGetProperty;
			obj.Get = default_FastGet;
			obj.Put = default_FastPut;
			obj.walkObject = Error_walkObject;
			obj.writeObject = Error_writeObject;
			obj.readObject = Error_readObject;
			Class_Error = obj;
		}
		var obj = Object.create(Class_Error);
		obj.stackTrace = [];
		break;
	case CLASSID_Global:
		if (Class_Global === undefined) {
			var obj = setAlltheInternalMethod("Global", ClassID);
			obj.GetProperty = default_FastGetProperty;
			obj.Get = default_FastGet;
			obj.Put = default_FastPut;
			Class_Global = obj;
		}
		var obj = Object.create(Class_Global);
		break;
	case CLASSID_Math:
		if (Class_Math === undefined) {
			var obj = setAlltheInternalMethod("Math", ClassID);
			obj.GetProperty = default_FastGetProperty;
			obj.Get = default_FastGet;
			obj.Put = default_FastPut;
			Class_Math = obj;
		}
		var obj = Object.create(Class_Math);
		break;
	case CLASSID_JSON:
		if (Class_JSON === undefined) {
			var obj = setAlltheInternalMethod("JSON", ClassID);
			obj.GetProperty = default_FastGetProperty;
			obj.Get = default_FastGet;
			obj.Put = default_FastPut;
			Class_JSON = obj;
		}
		var obj = Object.create(Class_JSON);
		break;
	case CLASSID_Arguments:
		if (Class_Arguments === undefined) {
			var obj = setAlltheInternalMethod("Arguments", ClassID);
			obj.GetOwnProperty = Arguments_GetOwnProperty;
			obj.Get = Arguments_Get;
			obj.Delete = Arguments_Delete;
			obj.DefineOwnProperty = Arguments_DefineOwnProperty;
			obj.walkObject = Arguments_walkObject;
			obj.writeObject = Arguments_writeObject;
			obj.readObject = Arguments_readObject;
			Class_Arguments = obj;
		}
		var obj = Object.create(Class_Arguments);
		obj.ParameterMap = undefined;
		obj.ArgumentsScope = undefined;
		break;
	case CLASSID_PlainArguments:
		if (Class_PlainArguments === undefined) {
			var obj = setAlltheInternalMethod("Arguments", ClassID);
			obj.GetProperty = default_FastGetProperty;
			obj.Get = default_FastGet;
			obj.Put = default_FastPut;
			Class_PlainArguments = obj;
		}
		var obj = Object.create(Class_PlainArguments);
		break;
	//extensions
	case CLASSID_Buffer:
		if (Class_Buffer === undefined) {
			var obj = setAlltheInternalMethod("Buffer", ClassID);
			obj.Get = Buffer_FastGet;
			obj.Put = Buffer_FastPut;
			obj.GetOwnProperty = Buffer_GetOwnProperty;
			obj.enumerator = Buffer_enumerator;
			obj.DefineOwnProperty = Buffer_DefineOwnProperty;
			obj.writeObject = Buffer_writeObject;
			obj.readObject = Buffer_readObject;
			Class_Buffer = obj;
		}
		var obj = Object.create(Class_Buffer);
		obj.wrappedBuffer = undefined;
		break;
	case CLASSID_IOPort:
		if (Class_IOPort === undefined) {
			var obj = setAlltheInternalMethod("IOPort", ClassID);
			obj.GetProperty = default_FastGetProperty;
			obj.Get = default_FastGet;
			obj.Put = default_FastPut;
			Class_IOPort = obj;
		}
		var obj = Object.create(Class_IOPort);
		obj.handler = undefined;
		obj.txid = undefined;
		obj.callback = undefined;
		break;
	case CLASSID_vm:
		if (Class_vm === undefined) {
			var obj = setAlltheInternalMethod("vm", ClassID);
			obj.GetProperty = default_FastGetProperty;
			obj.Get = default_FastGet;
			obj.Put = default_FastPut;
			obj.walkObject = vm_walkObject;
			obj.writeObject = vm_writeObject;
			obj.readObject = vm_readObject;
			Class_vm = obj;
		}
		var obj = Object.create(Class_vm);
		for ( var name in vmTemplate) {
			obj[name] = undefined;
		}
		break;
	case CLASSID_Script:
		if (Class_Script === undefined) {
			var obj = setAlltheInternalMethod("Script", ClassID);
			obj.GetProperty = default_FastGetProperty;
			obj.Get = default_FastGet;
			obj.Put = default_FastPut;
			obj.walkObject = Script_walkObject;
			obj.writeObject = Script_writeObject;
			obj.readObject = Script_readObject;
			Class_Script = obj;
		}
		var obj = Object.create(Class_Script);
		obj.Code = undefined;
		break;
	default:
		assert(false, ClassID);
	}
	obj.$properties = Object.create(null);
	obj.Prototype = undefined;
	obj.Extensible = undefined;
	obj.ID = 0;
	return obj;
}

function ReferenceValue(base, referencedName, strictReference) {
	assert(strictReference !== undefined);
	return ({
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
	if (IsUnresolvableReference(V)) {
		throw VMReferenceError(GetReferencedName(V) + " is not defined");
	}
	if (IsPropertyReference(V)) {
		if (HasPrimitiveBase(V) === false) return base.Get(GetReferencedName(V));
		else return specialGet(base, GetReferencedName(V));
	}
	else {
		assert(Type(base) === TYPE_EnvironmentRecord, base);
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
		if (IsStrictReference(V) === true) throw VMReferenceError(GetReferencedName(V) + " is not defined");
		vm.theGlobalObject.Put(GetReferencedName(V), W, false);
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
		assert(Type(base) === TYPE_EnvironmentRecord, base);
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
	return ({
		type : type,
		value : value,
		target : target,
	});
}

function FullPropertyDescriptor(Value, Writable, Get, Set, Enumerable, Configurable) {
	return ({
		Value : Value,
		Writable : Writable,
		Get : Get,
		Set : Set,
		Enumerable : Enumerable,
		Configurable : Configurable
	});
}

function DataPropertyDescriptor(Value, Writable, Enumerable, Configurable) {
	return ({
		Value : Value,
		Writable : Writable,
		Get : absent,
		Set : absent,
		Enumerable : Enumerable,
		Configurable : Configurable
	});
}

function AccessorPropertyDescriptor(Get, Set, Enumerable, Configurable) {
	return ({
		Value : absent,
		Writable : absent,
		Get : Get,
		Set : Set,
		Enumerable : Enumerable,
		Configurable : Configurable
	});
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
		obj.DefineOwnProperty("value", DataPropertyDescriptor(Desc.Value, true, true, true), false);
		obj.DefineOwnProperty("writable", DataPropertyDescriptor(Desc.Writable, true, true, true), false);
	}
	else {
		assert(IsAccessorDescriptor(Desc), Desc);
		assert(Desc.Get !== absent, Desc);
		assert(Desc.Set !== absent, Desc);
		obj.DefineOwnProperty("get", DataPropertyDescriptor(Desc.Get, true, true, true), false);
		obj.DefineOwnProperty("set", DataPropertyDescriptor(Desc.Set, true, true, true), false);
	}
	assert(Desc.Enumerable !== absent, Desc);
	assert(Desc.Configurable !== absent, Desc);
	obj.DefineOwnProperty("enumerable", DataPropertyDescriptor(Desc.Enumerable, true, true, true), false);
	obj.DefineOwnProperty("configurable", DataPropertyDescriptor(Desc.Configurable, true, true, true), false);
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
	var desc = FullPropertyDescriptor(Value, Writable, Get, Set, Enumerable, Configurable);
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

function default_FastGetProperty(P) {
	var O = this;
	var prop = O.$properties[P];
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

function default_FastGet(P) {
	var O = this;
	var desc = O.$properties[P];
	if (desc === undefined) {
		var proto = O.Prototype;
		if (proto === null) return undefined;
		var desc = proto.GetProperty(P);
		if (desc === undefined) return undefined;
	}
	if (desc.Value !== absent) return desc.Value;
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
		var valueDesc = DataPropertyDescriptor(V, absent, absent, absent);
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
		var newDesc = DataPropertyDescriptor(V, true, true, true);
		O.DefineOwnProperty(P, newDesc, Throw);
	}
	return;
}

function default_FastPut(P, V, Throw) {
	var O = this;
	var ownDesc = O.$properties[P];
	if (ownDesc) {
		if (ownDesc.Writable === true) {
			ownDesc.Value = V;
			return;
		}
	}
	else if (O.Extensible) {
		var proto = O.Prototype;
		if (proto === null) {
			intrinsic_createData(O, P, V, true, true, true);
			return;
		}
		var desc = proto.GetProperty(P);
		if (desc === undefined || desc.Writable === true) {
			intrinsic_createData(O, P, V, true, true, true);
			return;
		}
	}
	default_Put.call(O, P, V, Throw);
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

var emptyPropertyDescriptor = FullPropertyDescriptor(absent, absent, absent, absent, absent, absent);

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
			intrinsic_createData(O, P, Desc.Value, Desc.Writable, Desc.Enumerable, Desc.Configurable);
		}
		else {
			assert(IsAccessorDescriptor(Desc), Desc);
			intrinsic_createAccessor(O, P, Desc.Get, Desc.Set, Desc.Enumerable, Desc.Configurable);
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
			intrinsic_createAccessor(O, P, absent, absent, current.Enumerable, current.Configurable);
		}
		else {
			intrinsic_createData(O, P, absent, absent, current.Enumerable, current.Configurable);
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
			if (Desc.Set !== absent && Desc.Set !== current.Set) {
				if (Throw === true) throw VMTypeError();
				else return false;
			}
			if (Desc.Get !== absent && Desc.Get !== current.Get) {
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
		if (Desc.Writable !== x.Writable) return false;
	}
	if (Desc.Get !== absent) {
		if (x.Get === absent) return false;
		if (Desc.Get !== x.Get) return false;
	}
	if (Desc.Set !== absent) {
		if (x.Set === absent) return false;
		if (Desc.Set !== x.Set) return false;
	}
	if (Desc.Configurable !== absent) {
		if (x.Configurable === absent) return false;
		if (Desc.Configurable !== x.Configurable) return false;
	}
	if (Desc.Enumerable !== absent) {
		if (x.Enumerable === absent) return false;
		if (Desc.Enumerable !== x.Enumerable) return false;
	}
	return true;
}

function default_enumerator(ownOnly, enumerableOnly) {
	return intrinsic_enumerator(this, ownOnly, enumerableOnly);
}

function intrinsic_set(O, P, Desc) {
	var x = O.$properties[P];
	if (Desc.Value !== absent) x.Value = Desc.Value;
	if (Desc.Writable !== absent) x.Writable = Desc.Writable;
	if (Desc.Get !== absent) x.Get = Desc.Get;
	if (Desc.Set !== absent) x.Set = Desc.Set;
	if (Desc.Configurable !== absent) x.Configurable = Desc.Configurable;
	if (Desc.Enumerable !== absent) x.Enumerable = Desc.Enumerable;
}

function intrinsic_set_value(O, P, V) {
	O.$properties[P].Value = V;
}

function intrinsic_remove(O, P) {
	delete O.$properties[P];
}

function intrinsic_createData(O, P, Value, Writable, Enumerable, Configurable) {
	O.$properties[P] = ({
		Value : (Value !== absent) ? Value : undefined,
		Writable : (Writable !== absent) ? Writable : false,
		Get : absent,
		Set : absent,
		Enumerable : (Enumerable !== absent) ? Enumerable : false,
		Configurable : (Configurable !== absent) ? Configurable : false,
	});
}

function intrinsic_createAccessor(O, P, Get, Set, Enumerable, Configurable) {
	O.$properties[P] = ({
		Value : absent,
		Writable : absent,
		Get : (Get !== absent) ? Get : undefined,
		Set : (Set !== absent) ? Set : undefined,
		Enumerable : (Enumerable !== absent) ? Enumerable : false,
		Configurable : (Configurable !== absent) ? Configurable : false,
	});
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
	names.sort(function(x, y) {
		var nx = Number(x);
		var ny = Number(y);
		if (isFinite(nx)) {
			if (!isFinite(ny)) {
				return -1;
			}
			if (nx < ny) return -1;
			if (nx > ny) return 1;
		}
		else if (isFinite(ny)) {
			return 1;
		}
		if (x < y) return -1;
		if (x > y) return 1;
		return 0;
	});
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
