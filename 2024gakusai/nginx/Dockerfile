FROM nginx:alpine

# デフォルトの設定を削除
RUN rm /etc/nginx/conf.d/default.conf

# 自分のnginx.confをコンテナにコピー
COPY ./nginx.conf /etc/nginx/conf.d/default.conf