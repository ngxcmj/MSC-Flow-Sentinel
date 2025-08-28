# AI Traffic Detection API

Web流量异常监测系统后端API服务，基于Node.js、Express和TypeScript构建。

## 功能特性

- 用户认证与授权（JWT）
- 用户管理（CRUD操作）
- 异常流量检测与分析
- 实时监控与统计
- 模型管理
- 系统配置与日志

## 技术栈

- Node.js
- Express.js
- TypeScript
- MySQL
- JWT认证

## 项目结构

```
flow-sentinel-api/
├── src/
│   ├── config/       # 配置文件
│   ├── controllers/  # 控制器
│   ├── middlewares/  # 中间件
│   ├── models/       # 数据模型
│   ├── routes/       # 路由
│   ├── services/     # 业务逻辑
│   ├── utils/        # 工具函数
│   └── server.ts     # 服务器入口
├── .env              # 环境变量
├── package.json      # 项目依赖
└── tsconfig.json     # TypeScript配置
```

## 安装与运行

### 前提条件

- Node.js 14+
- MySQL 5.7+

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制`.env.example`文件为`.env`，并根据实际情况修改配置：

```
PORT=8080
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=flow_sentinel
DB_PORT=3306

# JWT配置
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
```

### 初始化数据库

```bash
npm run seed
```

这将创建必要的数据库表和默认管理员用户。

默认管理员账号：
- 用户名：admin
- 密码：admin123

### 开发环境运行

```bash
npm run dev
```

### 生产环境构建与运行

```bash
npm run build
npm start
```

## API文档

启动服务后，访问 `http://localhost:8080/api-docs` 查看Swagger API文档。

### 主要API路由

- `/api/auth` - 认证相关
- `/api/users` - 用户管理
- `/api/anomaly` - 异常检测
- `/api/models` - 模型管理
- `/api/analytics` - 数据分析
- `/api/system` - 系统管理

## 许可证

MIT
