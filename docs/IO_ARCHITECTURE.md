# I/O Architecture

## Building Blocks

- *node-lib*  
Node interface library programs which are imported from the Node.js project.
- *bridge*  
Emulator for process.binding interface.
- *iomanager*  
Persha's I/O management system.
- *handler*  
Node modules to handle I/O.

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
- *handler* --- process.binding API ---> *Node.js*


## Five types of I/O

Persha I/O system supports five types of I/O.

- output-only
 - void func( ... )
- asynchronous  
 - void func( ... , callback)
- blocking  
 - var r = func( ... ) may throw Error
- complex  
 - var r = func( ... , callback) may throw Error
- listener  
 - void func( ... , listener)

|   | return | callback | IOPort API | handler API |
|:---:|:---:|:---:|:---:|:---:|
| output-only | no | no | asyncIO | asyncIO |
| asynchronous | no | yes | asyncIO | syncIO |
| blocking | yes | no | syncIO | asyncIO |
| complex | yes | yes | syncIO | syncIO |
| listener | no | yes | open | open |

Copyright (c) 2015, Kotaro Endo.
