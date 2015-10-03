
#PersHA.js v0.1

[![Build Status](https://travis-ci.org/kotarondo/PersHA.js.svg?branch=master)](https://travis-ci.org/kotarondo/PersHA.js)

PersHA.js is a persistent and higly available javascript engine. As a javascript interpreter, it has compatible interface and functionality to Node.js. As it's non-functional features, the engine itself has persistence across restarts and can be configured as a part of highly available cluster of triple nodes.

PersHA.js is written in javascript, and works on Node.js.

##Installation

```sh
npm install -g persha
```
Prerequisite: node v0.12.x, other versions do not work correctly.

##Starting

```sh
persha -init
```

It starts REPL(read-eval-print-loop) interfece. You can run any javascript programs, and results will be shown consequently. To stop REPL, hit ctrl-C twice.

##Starting with an application program

```sh
persha -init app.js
```
where app.js is a name of your application program file. To stop your application, just kill the process by hitting ctrl-C.

##Restarting

```sh
persha -restart
```

After exiting PersHA.js, you can restart the engine again. It restarts with internal states preserved, and continues the suspended REPL or your app.js.

Note that even in case of restarting app.js you don't need to specify the file name because the program was already loaded in the engine.

Persistence is assured even after killing the process or even after restarting the computer. 

##Example 1

```sh
persha -init
> x="Hello World"
'Hello World'
>
(^C again to quit)

persha -restart
RECOVERING ...
READY
> x
'Hello World'
```

This is a simple example showing persistence of the engine. A variable 'x' has its value 'Hello World' persistent across restarts.

##Example 2

```sh
persha -init
> function y(){console.log(++x)}
undefined
> var x=0
undefined
> var id=setInterval(y, 1000)
undefined
> 1
2
3
4
(^C again to quit)

persha -restart
RECOVERING ...
READY
5
6
7
clearInterval(id)
undefined
```

This is an another example showing persistence of the engine. All internal states including a variable 'x', a function 'y', and interval timer are persistent across restarts.

##Practical Example

app.js:
```sh
var express=require('express');
var app=express();
var x=100;
app.get('/', function (req, res) {
  res.send('Hello ' + x++);
});
app.listen(3000);
```

```sh
% npm install express
% persha -init app.js &
[1] 2075
% curl http://localhost:3000
Hello 100
% curl http://localhost:3000
Hello 101
% kill 2075
[1]  + terminated  persha -init app.js
% curl http://localhost:3000
curl: (7) Failed to connect to localhost port 3000: Connection refused
% persha -restart &
[1] 2123
RECOVERING ...
READY
% curl http://localhost:3000
Hello 102
% curl http://localhost:3000
Hello 103
```

This is a more practical example. In app.js, the express module is loaded and a web server is launched at port 3000. You can check web server's 'Hello' responses using curl command. After killing the engine, you cannot get any responses. After restarting the engine, You can get 'Hello' responses again. Notice that a number in response is not initialized after restarting the engine.

In general, any pure javascript module can be loaded in PersHA.js provided that the module has been installed in node_modules directory. Module search order is same as Node's one. Once a module is loaded in the engine, it won't be re-read from installed files even after restarting the engine. 

##High Availability

This feature is not supported in this version.

##Multiple Instances

```sh
export PERSHA_DATA=path/to/datastore
persha -init
```

By default, PersHA.js stores executing information in $HOME/.persha directory, and it reads the last executing information from this directory when it restarts. If you want multiple instances to run in parallel, you have to change this directory specifying the PERSHA_DATA enviroment variable.

##Supported native modules

Currently following native modules are supported:
'events', 'constants', 'module', 'buffer', 'smalloc', 'util', 'assert', 'vm', 'timers', 'stream', 'console', 'fs', 'path', 'net', 'repl', 'readline', 'domain', 'string_decoder', 'http', 'freelist', 'url', 'punycode', 'querystring', 'dns', 'dgram', 'tty', 'crypto', 'os'

##Any contribution is welcome

Please let me know bugs/opinions/ideas.
Thank you for your contribution.
