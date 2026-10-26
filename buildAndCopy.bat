
@echo off
@REM publishConfig用于选取PublishConfig.js中的发布配置
set /p publishConfig=PublishConfig:

node    utils\publisher\index.js %publishConfig%
