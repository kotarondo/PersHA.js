# I/O Specification

## General

IOPort is an abstraction of interface to any I/O resource type.
Each IOPort's behavior is determined by the corresponding I/O handler. 

IOPort instances can be created by the IOPort constructor.
Every IOPort can have children ports created by the open call.
Ports create by the IOPort constructor are named "root port".
Ports create by the open call are named "non-root port".

- An I/O request can be sent to its handler through a syncIO/asyncIO call.
- An I/O completion can be returned from its handler through an asynchronous callback.
- An I/O event can be dispatched from its handler through a listener callback.

When the engine restarts, restart IOPortErrors are thrown on uncompleted syncIO call, and callbacks of uncompleted asynchronous requests are called with restart IOPortErrors. In addition, all listeners are called with restart IOPortErrors.

## IOPort API

### new IOPort(*name*)

IOPort constructor creates a new root port and the corresponding I/O handler module specified by *name* is loaded internally.
This constructor never throw any error.

### IOPort.prototype.open(*name* [, *listener*])

This function opens a non-root port specified by *name* under *this* port and returns a newly created IOPort instance.
If a *listener* is supplied, it will be called when the corresponding handler dispaches an I/O event.
When the port restarts, *listener* is called with a restart IOPortError as a first argument.
Particularly, *listener* is called while this function is being called.
This function never throw any error.

### IOPort.prototype.close()

This function disables *listener* of *this* port.
After this function has been called, *listener* will not be called on *this* port.
This function always returns undefined and never throw any error.

### IOPort.prototype.asyncIO(*func*, *args* [, *callback*])

This function executes an I/O specified by *func* and *args*.
This function always returns undefined and never throw any error.
If a *callback* is supplied, it will be called just once when the request completed.

### IOPort.prototype.syncIO(*func*, *args* [, *callback*] [, *noretry*])

This function executes an I/O specified by *func* and *args* and returns a value or throws an exception.
If a *callback* is supplied and no exception was thrown on it's function call, it will be called just once when the request completed.
If *noretry* is true, automatic restart retry is disabled. Otherwise automatic restart retry is enabled.
When automatic restart retry is enabled, this function retries automatically if it would throw a restart IOPortError.

## Handler API

PersHA's I/O handlers are implemented as Node's modules.
Handler modules reside in the 'handler' directory under the PersHA.js installed place.
Handler modules are loaded when root ports are created.

### exports.open(*name*, *listener*)

This handler corresponds to the IOPort.prototype.open function on a root port.
This handler returns a newly created handler object.

### exports.syncIO(*func*, *args*)

This handler corresponds to the IOPort.prototype.syncIO/asyncIO function with no *callback* on a root port.
This handler can return a value or can throw an exception which is ignored in case of IOPort.prototype.asyncIO although.

### exports.asyncIO(*func*, *args*, *callback*)

This handler corresponds to the IOPort.prototype.syncIO/asyncIO function with a *callback* on a root port.
This handler can return a value or can throw an exception which is ignored in case of IOPort.prototype.asyncIO although.

### handler.open(*name*, *listener*)

This handler corresponds to the IOPort.prototype.open function on a non-root port.
This handler returns a newly created handler object.

### handler.syncIO(*func*, *args*)
j
This handler corresponds to the IOPort.prototype.syncIO/asyncIO function with no *callback* on a non-root port.
This handler can return a value or can throw an exception which is ignored in case of IOPort.prototype.asyncIO although.

### handler.asyncIO(*func*, *args*, *callback*)

This handler corresponds to the IOPort.prototype.syncIO/asyncIO function with a *callback* on a non-root port.
This handler can return a value or can throw an exception which is ignored in case of IOPort.prototype.asyncIO although.

### calling *listener* synchronously 

The *listener* can be dispatched while a IOPort.prototype.syncIO is being called.
In this case, *listener* callbacks are synchronously dispatched in upper lands before the IOPort.prototype.syncIO returns.
On the contrary, IOPort.prototype.asyncIO is never interrupted by *listener* callbacks even if the handler dispatches them synchronously on the call.

Copyright (c) 2015, Kotaro Endo.
