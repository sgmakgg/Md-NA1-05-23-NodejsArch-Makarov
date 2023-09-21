export HTTP_PORT=5696
export WS_PORT=56961
export DOLLAR='$'
envsubst < /etc/nginx/conf.d/main.conf.template > /etc/nginx/conf.d/webserver.conf

export HTTP_PORT=5695
export WS_PORT=56951
export DOLLAR='$'
envsubst < /etc/nginx/conf.d/reserve.conf.template > /etc/nginx/conf.d/secondserver.conf
nginx -c /etc/nginx/nginx.conf
nginx -s reload

