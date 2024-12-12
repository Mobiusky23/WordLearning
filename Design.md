# 项目技术设计文档

## 技术栈

### 核心框架
- Next.js 15.1.0 (App Router)
- React 19
- TypeScript 5

### 样式解决方案
- Tailwind CSS
- CSS Variables (用于主题切换)
- Geist 字体

### 数据层
- Prisma ORM
- PostgreSQL 数据库

### 认证
- NextAuth.js

### 开发工具
- ESLint
- shadcn/ui 组件库

## 项目结构 
├── src/
│ ├── app/ # Next.js App Router 目录
│ │ ├── layout.tsx # 根布局
│ │ ├── page.tsx # 首页
│ │ └── globals.css # 全局样式
│ └── components/ # React 组件
├── prisma/
│ └── schema.prisma # Prisma 数据模型
├── public/ # 静态资源
└── [配置文件]
├── next.config.ts # Next.js 配置
├── tailwind.config.ts # Tailwind 配置
├── postcss.config.mjs # PostCSS 配置
├── tsconfig.json # TypeScript 配置
└── eslint.config.mjs # ESLint 配置

## 技术要点

### 1. 主题系统
- 支持亮色/暗色模式
- 使用 CSS 变量实现主题切换
- 响应系统主题设置

### 2. 字体方案
- 使用 Geist 字体家族
- 支持 Sans 和 Mono 两种字体
- 通过 next/font 优化加载

### 3. TypeScript 配置
- 启用严格模式
- 配置模块解析
- 支持路径别名 (@/*)

### 4. 数据库集成
- Prisma 作为 ORM
- PostgreSQL 数据库
- 环境变量配置

### 5. 样式解决方案
- Tailwind CSS 工具类
- PostCSS 处理
- 响应式设计支持

### 6. 开发规范
- ESLint 代码检查
- Next.js 推荐规则
- TypeScript 类型检查

## 环境变量
必需的环境变量：
- DATABASE_URL: PostgreSQL 连接字符串

