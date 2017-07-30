@echo off
call shx.cmd cat ../src/*.css > merged.css
call csso.cmd -i merged.css -o ../style.min.css