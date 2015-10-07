SERVER=https://v8.googlecode.com/svn/data/benchmarks/v7

download: run.js base.js richards.js deltablue.js crypto.js raytrace.js earley-boyer.js regexp.js splay.js navier-stokes.js

%.js:
	curl -s $(SERVER)/$@ -o $@
