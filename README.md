#PersHA.js v0.1

PersHA.js is a Persistent and Higly Available javascript engine. As a javascript interpreter, it has similar interface to Node.js. Furthermore the engine itself has persistence across restarts and can be configured as a part of highly available three-node cluster.

##Installation

```sh
npm install -g persha
```


##Starting

```sh
persha -init
```

It starts repl(read-eval-printloop) interfece similar to Node.js. You can run any javascript program, and the result is shown consequently. For example, you can set the variable 'x' as follows:

```sh
> x = "Hello World!"
```

To stop Persha.js, hit ctrl-C twice.

##Persistence

##High Availability
