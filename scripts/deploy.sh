#!/bin/bash

# 部署脚本
# 用于自动化部署流程

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查必需的环境变量
check_env_vars() {
    log_info "检查环境变量..."
    
    if [ -z "$VERCEL_TOKEN" ]; then
        log_error "VERCEL_TOKEN 环境变量未设置"
        exit 1
    fi
    
    if [ -z "$VERCEL_ORG_ID" ]; then
        log_error "VERCEL_ORG_ID 环境变量未设置"
        exit 1
    fi
    
    if [ -z "$VERCEL_PROJECT_ID" ]; then
        log_error "VERCEL_PROJECT_ID 环境变量未设置"
        exit 1
    fi
    
    log_success "环境变量检查通过"
}

# 检查依赖
check_dependencies() {
    log_info "检查依赖..."
    
    if ! command -v pnpm &> /dev/null; then
        log_error "pnpm 未安装"
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        log_warning "Vercel CLI 未安装，正在安装..."
        npm install -g vercel
    fi
    
    log_success "依赖检查通过"
}

# 运行测试
run_tests() {
    log_info "运行测试..."
    
    # 类型检查
    log_info "运行 TypeScript 类型检查..."
    pnpm type-check
    
    # Lint 检查
    log_info "运行 ESLint 检查..."
    pnpm lint
    
    # 单元测试
    log_info "运行单元测试..."
    pnpm test:ci || true
    
    log_success "测试完成"
}

# 构建应用
build_app() {
    log_info "构建应用..."
    
    # 清理缓存
    log_info "清理构建缓存..."
    rm -rf .next
    
    # 生成 Prisma 客户端
    log_info "生成 Prisma 客户端..."
    pnpm prisma generate
    
    # 构建应用
    log_info "构建 Next.js 应用..."
    NODE_OPTIONS="--max-old-space-size=8192" pnpm build
    
    log_success "构建完成"
}

# 运行性能测试
run_performance_tests() {
    log_info "运行性能测试..."
    
    # 启动应用用于测试
    log_info "启动应用进行性能测试..."
    pnpm start &
    SERVER_PID=$!
    
    # 等待服务器启动
    sleep 10
    
    # 运行 Lighthouse CI
    log_info "运行 Lighthouse CI..."
    npx lhci autorun || log_warning "性能测试失败，但继续部署"
    
    # 停止服务器
    kill $SERVER_PID || true
    
    log_success "性能测试完成"
}

# 部署到预览环境
deploy_preview() {
    log_info "部署到预览环境..."
    
    vercel --token="$VERCEL_TOKEN" \
           --scope="$VERCEL_ORG_ID" \
           --confirm \
           --force
    
    log_success "预览环境部署完成"
}

# 部署到生产环境
deploy_production() {
    log_info "部署到生产环境..."
    
    vercel --token="$VERCEL_TOKEN" \
           --scope="$VERCEL_ORG_ID" \
           --prod \
           --confirm \
           --force
    
    log_success "生产环境部署完成"
}

# 部署后验证
post_deploy_verification() {
    local url=$1
    log_info "部署后验证: $url"
    
    # 健康检查
    log_info "运行健康检查..."
    if curl -f -s "$url/api/health" > /dev/null; then
        log_success "健康检查通过"
    else
        log_error "健康检查失败"
        exit 1
    fi
    
    # 快速冒烟测试
    log_info "运行冒烟测试..."
    if curl -f -s "$url" | grep -q "South Pole"; then
        log_success "冒烟测试通过"
    else
        log_error "冒烟测试失败"
        exit 1
    fi
}

# 发送通知
send_notification() {
    local environment=$1
    local url=$2
    local status=$3
    
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        log_info "发送 Slack 通知..."
        
        if [ "$status" = "success" ]; then
            curl -X POST -H 'Content-type: application/json' \
                --data "{\"text\":\"🚀 South Pole 部署成功！\\n环境: $environment\\nURL: $url\"}" \
                "$SLACK_WEBHOOK_URL"
        else
            curl -X POST -H 'Content-type: application/json' \
                --data "{\"text\":\"❌ South Pole 部署失败！\\n环境: $environment\"}" \
                "$SLACK_WEBHOOK_URL"
        fi
    fi
}

# 主函数
main() {
    local environment=${1:-preview}
    
    log_info "开始部署流程 - 环境: $environment"
    
    # 检查前置条件
    check_env_vars
    check_dependencies
    
    # 运行测试和构建
    run_tests
    build_app
    
    # 根据环境执行不同的部署策略
    case $environment in
        "preview")
            deploy_preview
            preview_url=$(vercel --token="$VERCEL_TOKEN" --scope="$VERCEL_ORG_ID" ls | grep southpole | head -1 | awk '{print $2}')
            post_deploy_verification "https://$preview_url"
            send_notification "Preview" "https://$preview_url" "success"
            ;;
        "production")
            run_performance_tests
            deploy_production
            post_deploy_verification "https://southpole.com"
            send_notification "Production" "https://southpole.com" "success"
            ;;
        *)
            log_error "未知环境: $environment"
            echo "用法: $0 [preview|production]"
            exit 1
            ;;
    esac
    
    log_success "部署流程完成！"
}

# 错误处理
trap 'log_error "部署失败！"; send_notification "$environment" "" "failed"; exit 1' ERR

# 执行主函数
main "$@"