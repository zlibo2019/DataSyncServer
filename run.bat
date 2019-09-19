
@echo off
cmd /c setx NODE_OPTIONS --max_old_space_size=4096
set nodevars = "C:\Program Files\nodejs\nodevars.bat"
cmd /c %nodevars%&&npm run dev
