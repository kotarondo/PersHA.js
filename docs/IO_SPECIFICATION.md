# I/O Specification

## General

IOPort is an abstraction of interface to any I/O resource type. 
Each IOPort's behavior is decided by the corresponding I/O handler. 

IOPort instances can be created by the IOPort constructor.
Every IOPort can have children ports created by open call.

An I/O request can be sent to its handler through a syncIO/asyncIO call.
An I/O completion can be returned from its handler through an asynchronous callback.
An I/O event can be dispatched from its handler through a listener callback.

When the engine restarts, restart IOPortErrors are thrown on uncompleted syncIO call, and they are also passed as a first argument of listeners, and they are also passed as a first argument of callbacks of uncompleted asynchronous requests.

## IOPort API

### new IOPort(*name*)

IOPort constructor creates a new root port and the corresponding I/O handler module specified by *name* is loaded internally.
This constructor never throws any error.

### IOPort.prototype.open(*name* [, *listener*])

This function opens a non-root port specified by *name* under *this* port and returns a newly created IOPort instance.
If a *listener* is supplied, it will be called when the corresponding handler dispaches an I/O event.
When the port restarts, *listener* is called with a restart IOPortError argument.
Particularly, *listener* is called while this function is being called.
This function never throws any error.

### IOPort.prototype.close()

This function closes this port.
After this function has been called, *listener* will not be called on this port.
This function always returns undefined and never throws any error.

### IOPort.prototype.asyncIO(*func*, *args* [, *callback*])

This function executes an I/O specified by *func* and *args*.
This function always returns undefined and never throws any error.
If a *callback* is supplied, it will be called once when the request completed.

### IOPort.prototype.syncIO(*func*, *args* [, *callback*] [, *noretry*])

This function executes an I/O specified by *func* and *args* and returns a value otherwise throws an error.
If a *callback* is supplied and no error was thrown on it's function call, it will be called once when the request completed.
If *noretry* is true, automatic restart retry is disabled. Otherwise automatic restart retry is enabled.
When automatic restart retry is enabled, this function retries automatically if it would throw a restart IOPortError.

## Handler API

PersHA's I/O handlers are implemented as Node's modules.
Handler modules reside in the 'handler' directory under the persha installed place.
Handler modules are loaded when root ports are created.

### exports.open(*name*, *listener*)

This handler corresponds to the IOPort.prototype.open function on a root port.
This handler returns a newly created handler object.

### exports.syncIO(*func*, *args*)

This handler corresponds to the IOPort.prototype.syncIO/asyncIO function with no *callback* on a root port.
This handler can return a value or can throw a error which is ignored in case of IOPort.prototype.asyncIO although.

### exports.asyncIO(*func*, *args*, *callback*)

This handler corresponds to the IOPort.prototype.syncIO/asyncIO function with a *callback* on a root port.
This handler can return a value or can throw a error which is ignored in case of IOPort.prototype.asyncIO although.

### handler.open(*name*, *listener*)

This handler corresponds to the IOPort.prototype.open function on a non-root port.
This handler returns a newly created handler object.

### handler.syncIO(*func*, *args*)
j
This handler corresponds to the IOPort.prototype.syncIO/asyncIO function with no *callback* on a non-root port.
This handler can return a value or can throw a error which is ignored in case of IOPort.prototype.asyncIO although.

### handler.asyncIO(*func*, *args*, *callback*)

This handler corresponds to the IOPort.prototype.syncIO/asyncIO function with a *callback* on a non-root port.
This handler can return a value or can throw a error which is ignored in case of IOPort.prototype.asyncIO although.

### calling *listener* or *callback* in synchronous I/O

The *listener* or *callback* can be dispatched while a IOPort.prototype.syncIO is being called.
In this case, these callbacks are properly dispatched in upper lands before the IOPort.prototype.syncIO returns.
On the contrary, IOPort.prototype.asyncIO is never interrupted by callbacks even if the handler dispatches them on the call.
In this case, these callbacks are called afterwards in upper lands.

Copyright (c) 2015, Kotaro Endo.
