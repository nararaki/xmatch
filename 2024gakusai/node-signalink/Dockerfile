# 1. ベースイメージとしてNode.jsの公式イメージを使用（LTSバージョン）
FROM node:18-alpine

# 2. 作業ディレクトリを設定
WORKDIR /app

# 3. package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 4. 依存関係をインストール（TypeScriptとts-nodeもインストールされる）
RUN npm install

# 5. アプリケーションのソースコードをコンテナにコピー
COPY . .

# 6. 開発サーバーとしてポートを公開（必要に応じて変更）
EXPOSE 8000

# 7. アプリケーションをts-nodeで起動
CMD ["npx", "ts-node", "server.ts","-H","0.0.0.0"]
