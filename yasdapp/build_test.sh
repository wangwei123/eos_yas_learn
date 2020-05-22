                                        #!/bin/bash

npm run build
cd dist
tar -czvf eostdapp.gz ./*

scp eostdapp.gz root@47.102.217.170:/usr/local/mysofts/nginx/html

ssh root@47.102.217.170
cd /usr/local/mysofts/html
tar -xzvf eostdapp.tar
