SERVER=http://test262.ecmascript.org

test: sta.js ch06.json ch06.json ch07.json ch08.json ch09.json ch10.json ch11.json ch12.json ch13.json ch14.json ch15.json
	persha -init test262.js

%.json:
	curl -s $(SERVER)/json/$@ -o $@

%.js:
	curl -s $(SERVER)/harness/$@ -o $@
