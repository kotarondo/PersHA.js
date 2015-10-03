#I/O Architecture

##Architecture

###Blocks

[app.js]
[node-lib]
[bridge]
[core interpreter]
[iomanager]
[handler]
[Node.js]

###Two javascript interpreter

[app.js] [node-lib] [bridge]/ [core interpreter]
[core interpreter] [iomanager] [handler] / [Node.js]

###Stacked I/O API

-application API
-process.binding API
-IOPort API
-handler API

[app.js] --- application API---> [node-lib]
[node-lib] --- process.binding API---> [bridge]
[bridge] --- IOPort API---> [iomanager]
[iomanager] --- handler API---> [handler]
[handler] --- process.binding API---> [Node.js]


##IOPort interface

###Five types of I/O

-output-only
    void func( ... )
-asynchronous
    void func( ... , callback)
-blocking
    Value func( ... ) throws Error
-complex
    Value func( ... , callback) throws Error
-listener
    void func( ... , listener)


             IOPortAPI         handler API
output-only   asyncIO           asyncIO
asynchronous  asyncIO            syncIO
blocking       syncIO           asyncIO
complex        syncIO            syncIO
listener        open              open

###listener callback in synchronous I/O

##Restart Error

###Automatic retry
