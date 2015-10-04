# I/O Architecture

## Architecture

### Blocks

- *app.js*  
user application
- *node-lib*  
node interface library
- *bridge*  
- *core interpreter*  
PersHA.js javascript interpreter
- *iomanager*  

- *handler*  

- *Node.js*  

### Two javascript interpreter

*app.js* *node-lib* *bridge* are working on *core interpreter*

*core interpreter* *iomanager* *handler* are working on *Node.js*

### Stacked I/O API

- application API  
  Nodes's documented API for application usage
- process.binding API  
  Node's internal API 
- IOPort API  
  PersHA's I/O API
- handler API
  PersHA's I/O handler API

- *app.js* --- application API---> *node-lib*
- *node-lib* --- process.binding API---> *bridge*
- *bridge* --- IOPort API---> *iomanager*
- *iomanager* --- handler API---> *handler*
- *handler* --- process.binding API---> *Node.js*


## IOPort interface

### Five types of I/O

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


|   | IOPort API | handler API |
| ------------- |:-------------:| -----:|
| output-only | asyncIO | asyncIO |
| asynchronous | asyncIO | syncIO |
| blocking | syncIO | asyncIO |
| complex | syncIO | syncIO |
| listener | open | open |

### listener callback in synchronous I/O

## Restart Error

### Automatic retry
