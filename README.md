#PersHA.js v0.1

PersHA.js is a persistent and higly available javascript engine. As a javascript interpreter, it has similar interface to Node.js. As non-functional features, the engine itself has persistence across restarts and can be configured as a part of highly available cluster of triple nodes.

PersHA.js is written in javascript, and works on Node.js.

##Installation

```sh
npm install -g persha
```
Prerequisite: node v0.12.x

##Starting PersHA.js

```sh
persha -init
```

It starts REPL(read-eval-print-loop) interfece similar to Node.js. You can run any javascript programs, and results will be shown consequently. To stop REPL, hit ctrl-C twice.

When you have an application program file, you can run it as follows:

```sh
persha -init app.js
```
where app.js is a name of your application program file. To stop your application, just kill the process by hitting ctrl-C.

##Persistence

After exiting PersHA.js, you can restart the engine again. It restarts with the interpreter state preserved, and continues the suspended REPL or your app.js.

```sh
persha -restart
```

Note that even in case of restarting app.js you don't need to specify the file name because the program was already loaded in the engine.

Persistence is assured even after killing the process or after restarting the computer. 

##Example 1

```sh
persha -init
> x="Hello World"
'Hello World'
>
(^C again to quit)
```

```sh
persha -restart
RECOVERING ...
READY
> x
'Hello World'
```

##Example 2

```sh
persha -init
> setInterval(function(){console.log(++x)}, 1000); x=0
0
> 1
2
3
4
(^C again to quit)
```

```sh
persha -restart
RECOVERING ...
READY
5
6
7
```

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
```

```sh
% persha -restart &
[1] 2123
RECOVERING ...
READY
% curl http://localhost:3000
Hello 102
```

##High Availability

This feature is not supported in this version.

##Multiple Instances

```sh
export PERSHA_DATA=path/to/datastore
persha -init
```

##Supported I/O

##
