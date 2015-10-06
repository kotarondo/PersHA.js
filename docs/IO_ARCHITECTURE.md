# I/O Architecture

## Summary

I/O requests start from user application *app.js* using Node's I/O module API such as 'fs' or 'http'.

### Building Blocks

Building blocks are all written in javascript.
*node-lib* and *bridge* are executed on PersHA's javascript interpreter.
*iomanager* and *handler* are executed on Node's javascript interpreter.

- *node-lib*  
node interface library programs which are imported from the Node.js project.
- *bridge*  
upper emulator for process.binding interface.
- *iomanager*  
Persha's I/O management system
- *handler*  
lower emulator for process.binding interface.

### I/O API chaining

- *app.js* --- application API---> *node-lib*
- *node-lib* --- process.binding API---> *bridge*
- *bridge* --- IOPort API---> *iomanager*
- *iomanager* --- handler API---> *handler*
- *handler* --- process.binding API---> *Node.js*

- application API  
  Node's documented API for application
- process.binding API  
  Node's internal API to C++ lands.
- IOPort API  
  PersHA's I/O API for upper emulator
- handler API
  PersHA's I/O API for lower emulator


## IOPort interface

### Five types of I/O

Persha I/O system supports five types of I/O.
returing value or throwing error
asynchronous completion callback

- output-only  

 - void func( ... )
- asynchronous  
 - void func( ... , callback)
- blocking  
 - Value func( ... ) throws Error
- complex  
 - Value func( ... , callback) throws Error
- listener  
 - void func( ... , listener)


|   | return | callback | IOPort API | handler API |
| ------------- |:-------------:| -----:|
| output-only | no | no | asyncIO | asyncIO |
| asynchronous | no | yes | asyncIO | syncIO |
| blocking | yes | no | syncIO | asyncIO |
| complex | yes | yes | syncIO | syncIO |
| listener | no | yes | open | open |

### listener callback in synchronous I/O

## Restart Error

### Automatic retry

