export HTTP_PORT=5695 
export WS_PORT=56951 
export DOLLAR='$'
envsubst < /etc/nginx/conf.d/main.conf.template > /etc/nginx/conf.d/fstorage.conf 
nginx -c /etc/nginx/nginx.conf 
nginx -s reload
