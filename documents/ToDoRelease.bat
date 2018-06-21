@echo off

G: > nul
cd \DocMaster\documents\package > nul
start winrar a -s package.zip package.json index.html html js > nul
ping /n 3 127.0.0.1 > nul
move package.zip G:\DocMaster\nwjs-v0.21.6-win-x64 > nul
cd \DocMaster\nwjs-v0.21.6-win-x64 > nul
copy /b nw.exe+package.zip ClickMe.exe > nul
move ClickMe.exe G:\DocMaster\documents\release > nul
cd \DocMaster\documents > nul
start winrar a -s release.zip release > nul
ping /n 10 127.0.0.1 > nul
del G:\DocMaster\documents\release\ClickMe.exe > nul
del G:\DocMaster\nwjs-v0.21.6-win-x64\package.zip > nul
del G:\DocMaster\documents\package\index.html > nul
del G:\DocMaster\documents\package\html\index2.html > nul
