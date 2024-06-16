# 使用特定版本的 Node.js 镜像作为基础镜像
FROM node:20-bookworm-slim

# 设置工作目录
WORKDIR /app

# 复制当前目录的内容到工作目录
COPY . .

# 暴露应用的端口
EXPOSE 3010

# 显示 Node.js 版本
RUN node --version

# 显示 yarn 版本
RUN yarn --version

# 检查是否有 yarn，如果没有则安装，并输出相关信息
RUN if ! yarn --version; then \
      echo "Yarn is not installed. Installing yarn..."; \
      npm install -g yarn; \
      echo "Yarn installation completed."; \
    else \
      echo "Yarn is already installed."; \
    fi

# 显示 yarn 版本
RUN yarn --version

RUN apt-get update && \
  apt-get install -y --no-install-recommends openssl && \
  rm -rf /var/lib/apt/lists/*

# 启动应用
CMD ["node", "--import", "./scripts/register.js", "./dist/index.js"]
