PersHA.js v0.1
==============

PersHA.js is a Persistent and Higly Available javascript engine. As a javascript interpreter, it has a very similar interface to Node.js, but the engine itself has persistence across restarts and can be configured as a part of highly available three-node cluster.

JavaScript interpreter
----------------------

To start Persha.js:

persha -init

It starts repl(read-eval-printloop) interfece similar to Node.js. You can run any javascript program, and consequently the result is shown. For very simple example, you can set the variable 'x' as follows:

> x = "Hello World!"


To stop Persha.js, hit ctrl-C twice.

> 
(^C again to quit)
> 

Persistence
-----------



