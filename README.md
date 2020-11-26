# express-middleware-practice

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
