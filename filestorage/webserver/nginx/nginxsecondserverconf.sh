export HTTP_PORT=5696
export WS_PORT=56961
export DOLLAR='$'
envsubst < /etc/nginx/conf.d/reserve.conf.template > /etc/nginx/conf.d/secondserver.conf
nginx -c /etc/nginx/nginx.conf 
nginx -s reload
