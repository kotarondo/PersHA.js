# PersHA.js

[![Build Status](https://travis-ci.org/kotarondo/PersHA.js.svg?branch=master)](https://travis-ci.org/kotarondo/PersHA.js)
[![npm version](https://badge.fury.io/js/persha.svg)](https://badge.fury.io/js/persha)

PersHA.js is a persistent and highly available javascript engine. As a javascript interpreter, it has compatible functionality to Node.js. As it's non-functional features, the engine itself has persistence across restarts and can be configured as a part of highly available cluster of triple nodes.

PersHA.js is written in javascript, and works on Node.js.

## Installation

```sh
npm install -g persha
```
Prerequisite: node v0.12.x (with other versions it does not work correctly.)

## Starting

```sh
persha -init
```

It starts REPL(read-eval-print-loop) interfece. You can run any javascript programs, and results will be shown consequently. To stop REPL, hit ctrl-C twice.

## Starting with an application program

```sh
persha -init app.js
```
where app.js is a name of your application program file. To stop your application, just kill the process by hitting ctrl-C.

## Restarting

```sh
persha -restart
```

After exiting PersHA.js, you can restart the engine again. It restarts with internal states preserved, and continues suspended REPL or your app.js.

Persistence is assured even after killing the process or even after restarting the computer. 

## Example 1

```
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

## Example 2

```
persha -init
> function y(){console.log("count " + ++x)}
> var x=0
> var id=setInterval(y, 1000)
count 1
count 2
count 3
count 4
(^C again to quit)

persha -restart
RECOVERING ...
READY
count 5
count 6
count 7
> clearInterval(id)
```

This is an another example showing persistence of the engine. All internal states including a value of 'x', 'id', a function 'y', and interval timer are persistent across restarts.

## Practical Example

app.js:
```javascript
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
% curl http://localhost:3000
Hello 102
% curl http://localhost:3000
Hello 103
```

This is a more practical example. In app.js, the express module is loaded and a web server is launched at port 3000. You can check web server's 'Hello' responses using curl command. After killing the engine, you cannot get any responses. But after restarting the engine, You can get 'Hello' responses again. Notice that number sequence in response messages continues because a variable 'x' is persistent across restarts.

In general, any pure javascript module can be loaded in PersHA.js provided that the module has been installed in node_modules directory. Module search order is same as Node's one. Once a module is loaded in the engine, it won't be re-read from files even after restarting the engine. 

## High Availability

This feature is not supported yet in current version.

## Multiple Instances

```sh
export PERSHA_DATA=path/to/datastore
persha -init
persha -restart
```

By default, PersHA.js stores executing information in $HOME/.persha directory, and it reads the last executing information from this directory when it restarts. If you want multiple instances to run in parallel, you have to change this directory specifying the PERSHA_DATA enviroment variable.

## Supported native modules

Currently following native modules are supported:

'events', 'constants', 'module', 'buffer', 'util', 'assert', 'vm', 'timers', 'stream', 'console', 'fs', 'path', 'net', 'repl', 'readline', 'domain', 'string_decoder', 'http', 'freelist', 'url', 'punycode', 'querystring', 'dns', 'dgram', 'tty', 'crypto', 'os'

## Any contribution is welcome

Please let me know bugs/opinions/ideas.
Thank you for your contribution.
