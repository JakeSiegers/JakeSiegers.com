@echo off
call shx.cmd cat ../src/*.js > merged.js
call jsmin.cmd merged.js > ../js.min.js