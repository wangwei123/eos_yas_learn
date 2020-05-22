#!/bin/bash

npm run build
cd dist
tar -czvf yasdapp.gz ./*

#scp eostdapp.gz root@47.56.166.45:/usr/local/mysofts/nginx/html
#scp yasdapp.gz root@47.56.166.45:/usr/local/mysofts/webapps/yasdapp
scp yasdapp.gz root@47.75.65.197:/usr/local/mysofts/webapps/yasdapp

ssh root@47.75.65.197
#cd /usr/local/mysofts/html
#tar -xzvf eostdapp.tar
