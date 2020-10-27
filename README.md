# Project D
這個專案是為了 Dcard take home test 而建立，目的是設計一個 rate limit library。

資料庫的部分我採用 redis。原因有：

* sorted set 利用 timestamp 作為 score 很容易實現時間區間
* 利用 ip 當 key 設定 expire 不用擔心冗余資料
* 利用外部 db 而不是 in-memory 的做法，當我們有多組 web server 時可共享 rate limit

## Installation
* 執行環境需要有 docker
* 本程式在 node 12 上驗證過

```
  npm install
```

## Usage
* 啟動 web server 與 redis server

```
  npm start
```

* 環境變數

Key              | Default | Description
-----------------|---------|------------
RATELIMIT_PERIOD | 60      | 時間區間（seconds)
RATELIMIT_MAX    | 60      | 最大 request 數量

```
  RATELIMIT_PERIOD=10 RATELIMIT_MAX=10 npm start
```

## Test
```
  npm test
```

## Also
```
  docker-compose up
```
