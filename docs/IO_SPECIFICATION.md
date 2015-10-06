# I/O Specification

## General

IOPort is an abstraction of interface to any I/O resource type. 
Each IOPort's behavior is decided by the corresponding I/O handler. 

The first IOPort instance can be created by the IOPort constructor.
Every IOPort can have children created by open call.

I/O requests can be sent to its handler through syncIO/asyncIO call.
I/O events can be dispatched from its handler through listener call.

When the engine restarts, restart-IOPortError are thrown on uncompleted syncIO and are passed as a first argument of callbacks of uncompleted requests and listeners.

## IOPort API specification

### new IOPort(*name*)

### IOPort.prototype.open(*name* [, *listener*])

This function opens a port specified by *name* on this port and returns a newly created IOPort instance.
If *listener* is supplied, it will be called when the port dispaches an I/O event.
When the port restarts, *listener* is called with a restart IOPortError argument.
Particularly, while this function is being called, *listener* is called because of the port restart.
This function never throws any error.

### IOPort.prototype.close()

This function closes this port.
After this function was called, no listener will be called on this port.
This function always returns undefined and never throws any error.

### IOPort.prototype.asyncIO(*func*, *args* [, *callback*])

This function executes an I/O specified by *func* and *args*.
This function always returns undefined and never throws any error.
If *callback* is supplied, it will be called once when the request completed.

### IOPort.prototype.syncIO(*func*, *args* [, *callback*] [, *noretry*])

This function executes an I/O specified by *func* and *args* and returns a value or throws an error.
If *callback* is supplied and no error was thrown on it's function call, it will be called once when the request completed.
If *noretry* is true, automatic restart retry is disabled.

## Handler API specification

PersHA's I/O handlers are implemented as Node's modules.

### exports.open(name)
### exports.syncIO(func, args)
### exports.asyncIO(func, args, callback)

### handler.open(name, callback)
### handler.syncIO(func, args)
### handler.asyncIO(func, args, callback)

