# I/O Architecture

## Building Blocks

- *node-lib*  
Node interface library programs which are imported from the Node.js project.
- *bridge*  
Emulator for process.binding interface.
- *iomanager*  
Persha's I/O management system.
- *handler*  
Node modules to execute actual I/O requests.

They are all written in javascript.  
*node-lib* and *bridge* are executed on PersHA's javascript interpreter(upper lands).  
*iomanager* and *handler* are executed on Node's javascript interpreter(lower lands).  


## I/O APIs

- application API  
  Node's documented API (such as "fs.readFile")
- process.binding API  
  Node's internal API (it is originally inerface to C++ lands)
- IOPort API  
  PersHA's I/O API to lower lands (documented in IO_SPECIFICATION.md)
- handler API  
  PersHA's I/O handling API (documented in IO_SPECIFICATION.md)


## I/O API chaining

- *app.js* --- application API ---> *node-lib*
- *node-lib* --- process.binding API ---> *bridge*
- *bridge* --- IOPort API ---> *iomanager*
- *iomanager* --- handler API ---> *handler*
- *handler* --- process.binding API ---> internal part of *Node.js*


## Five types of I/O

Persha's I/O system supports five types of I/O.

|   | return | callback | IOPort API | handler API |
|:---:|:---:|:---:|:---:|:---:|
| output-only | no | no | asyncIO | asyncIO |
| asynchronous | no | yes | asyncIO | syncIO |
| blocking | yes | no | syncIO | asyncIO |
| complex | yes | yes | syncIO | syncIO |
| listener | no | yes | open | open |

The difference between asynchronous type and listener type is:
- callback function of asynchronous type never be called twice.
- callback function of listener type may be called more than once.

Informal typedefs (Java and JavaScript mixture style):

- output-only
 - void func( ... )
- asynchronous  
 - void func( ... , callback )
- blocking  
 - var r = func( ... ) throws Exception
- complex  
 - var r = func( ... , callback ) throws Exception
- listener  
 - void setListener( listener )

Copyright (c) 2015, Kotaro Endo.
