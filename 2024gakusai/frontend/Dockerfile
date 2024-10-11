# 1. ベースイメージとしてNode.jsの公式イメージを使用（LTSバージョン）
FROM node:18

# 2. 作業ディレクトリを設定
WORKDIR /app

# 3. package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 4. 依存関係をインストール
RUN npm install

# 5. アプリケーションのソースコードをコンテナにコピー
COPY . .

# 7. Next.jsはデフォルトで3000ポートを使用する
EXPOSE 3000


# 9. アプリケーションを起動
CMD ["npm", "run","dev"]

