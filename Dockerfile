# ============================================================
# Dockerfile: AI 学生折扣站
# 基于轻量 Alpine Node.js 22 镜像，原生内置 SQLite 与 HTTP
# 镜像体积仅 ~150MB，构建仅需数秒，无需编译工具链
# ============================================================

FROM node:22-alpine

WORKDIR /app

# 创建持久化数据库目录
RUN mkdir -p /app/data

# 拷贝项目文件
COPY . .

# 暴露服务端口
EXPOSE 3000

# 环境变量默认配置
ENV NODE_ENV=production \
    PORT=3000 \
    ADMIN_PASSWORD=admin123456 \
    DB_PATH=/app/data/deals.db

# 持久化数据卷
VOLUME ["/app/data"]

# 启动服务
CMD ["node", "server.js"]
