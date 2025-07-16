#!/bin/bash

# 部署后验证脚本
# 确保部署的应用程序正常工作

set -e

# 配置
DEPLOY_URL="${1:-https://southpole.com}"
MAX_WAIT_TIME=300  # 5 minutes
CHECK_INTERVAL=10  # 10 seconds

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# 等待服务启动
wait_for_service() {
    log_info "等待服务启动: $DEPLOY_URL"
    
    local elapsed=0
    while [ $elapsed -lt $MAX_WAIT_TIME ]; do
        if curl -f -s "$DEPLOY_URL" > /dev/null; then
            log_success "服务已启动"
            return 0
        fi
        
        sleep $CHECK_INTERVAL
        elapsed=$((elapsed + CHECK_INTERVAL))
        log_info "等待中... (${elapsed}s/${MAX_WAIT_TIME}s)"
    done
    
    log_error "服务启动超时"
    return 1
}

# API端点验证
verify_api_endpoints() {
    log_info "验证API端点..."
    
    local endpoints=(
        "/api/health"
        "/api/auth/session"
        "/api/content"
        "/api/forms/contact"
    )
    
    local failed_endpoints=()
    
    for endpoint in "${endpoints[@]}"; do
        local url="$DEPLOY_URL$endpoint"
        local http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
        
        if [[ "$http_code" =~ ^(200|401|404)$ ]]; then
            log_success "API端点正常: $endpoint (HTTP $http_code)"
        else
            log_error "API端点异常: $endpoint (HTTP $http_code)"
            failed_endpoints+=("$endpoint")
        fi
    done
    
    if [ ${#failed_endpoints[@]} -gt 0 ]; then
        log_error "以下API端点验证失败: ${failed_endpoints[*]}"
        return 1
    fi
}

# 页面内容验证
verify_page_content() {
    log_info "验证页面内容..."
    
    # 首页验证
    local homepage_content=$(curl -s "$DEPLOY_URL")
    if echo "$homepage_content" | grep -q "South Pole"; then
        log_success "首页内容验证通过"
    else
        log_error "首页内容验证失败"
        return 1
    fi
    
    # 联系页面验证
    local contact_content=$(curl -s "$DEPLOY_URL/contact")
    if echo "$contact_content" | grep -q "Contact"; then
        log_success "联系页面内容验证通过"
    else
        log_error "联系页面内容验证失败"
        return 1
    fi
}

# 表单功能验证
verify_form_functionality() {
    log_info "验证表单功能..."
    
    # 发送测试联系表单
    local response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{
            "name": "Test User",
            "email": "test@example.com",
            "message": "Deployment verification test",
            "company": "Test Company"
        }' \
        "$DEPLOY_URL/api/forms/contact")
    
    if echo "$response" | grep -q "success\|received"; then
        log_success "联系表单功能验证通过"
    else
        log_warning "联系表单功能验证失败，但非关键性错误"
    fi
}

# 静态资源验证
verify_static_resources() {
    log_info "验证静态资源..."
    
    local resources=(
        "/favicon.ico"
        "/robots.txt"
        "/sitemap.xml"
    )
    
    for resource in "${resources[@]}"; do
        local url="$DEPLOY_URL$resource"
        local http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
        
        if [ "$http_code" = "200" ]; then
            log_success "静态资源正常: $resource"
        else
            log_warning "静态资源异常: $resource (HTTP $http_code)"
        fi
    done
}

# 性能基准验证
verify_performance() {
    log_info "验证性能基准..."
    
    local start_time=$(date +%s%N)
    curl -s "$DEPLOY_URL" > /dev/null
    local end_time=$(date +%s%N)
    
    local response_time_ms=$(( (end_time - start_time) / 1000000 ))
    
    if [ $response_time_ms -lt 3000 ]; then
        log_success "响应时间正常: ${response_time_ms}ms"
    elif [ $response_time_ms -lt 5000 ]; then
        log_warning "响应时间较慢: ${response_time_ms}ms"
    else
        log_error "响应时间过慢: ${response_time_ms}ms"
        return 1
    fi
}

# 安全头验证
verify_security_headers() {
    log_info "验证安全头..."
    
    local headers=$(curl -s -I "$DEPLOY_URL")
    
    local security_headers=(
        "X-Frame-Options"
        "X-Content-Type-Options"
        "Referrer-Policy"
        "Strict-Transport-Security"
    )
    
    for header in "${security_headers[@]}"; do
        if echo "$headers" | grep -i "$header" > /dev/null; then
            log_success "安全头存在: $header"
        else
            log_warning "安全头缺失: $header"
        fi
    done
}

# 数据库连接验证
verify_database() {
    log_info "验证数据库连接..."
    
    local db_health=$(curl -s "$DEPLOY_URL/api/admin/db-health")
    if echo "$db_health" | grep -q "healthy"; then
        log_success "数据库连接正常"
    else
        log_error "数据库连接异常"
        return 1
    fi
}

# 环境变量验证
verify_environment() {
    log_info "验证环境配置..."
    
    # 检查是否为生产环境
    local env_info=$(curl -s "$DEPLOY_URL/api/health")
    if echo "$env_info" | grep -q "production"; then
        log_success "生产环境配置正确"
    else
        log_warning "环境配置可能不正确"
    fi
}

# 日志验证
verify_logging() {
    log_info "验证日志系统..."
    
    # 检查错误日志API
    local log_response=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/api/logs")
    if [ "$log_response" = "200" ] || [ "$log_response" = "401" ]; then
        log_success "日志系统正常"
    else
        log_warning "日志系统可能异常"
    fi
}

# 缓存验证
verify_caching() {
    log_info "验证缓存系统..."
    
    # 第一次请求
    local start1=$(date +%s%N)
    curl -s "$DEPLOY_URL" > /dev/null
    local end1=$(date +%s%N)
    local time1=$(( (end1 - start1) / 1000000 ))
    
    # 第二次请求（应该更快）
    local start2=$(date +%s%N)
    curl -s "$DEPLOY_URL" > /dev/null
    local end2=$(date +%s%N)
    local time2=$(( (end2 - start2) / 1000000 ))
    
    if [ $time2 -lt $time1 ]; then
        log_success "缓存系统工作正常 (${time1}ms -> ${time2}ms)"
    else
        log_info "缓存效果不明显 (${time1}ms -> ${time2}ms)"
    fi
}

# 生成验证报告
generate_verification_report() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local report_file="/tmp/deployment_verification_$(date +%Y%m%d_%H%M%S).json"
    
    cat > "$report_file" << EOF
{
  "timestamp": "$timestamp",
  "deployment_url": "$DEPLOY_URL",
  "verification_results": {
    "service_startup": "$(wait_for_service >/dev/null 2>&1 && echo "pass" || echo "fail")",
    "api_endpoints": "$(verify_api_endpoints >/dev/null 2>&1 && echo "pass" || echo "fail")",
    "page_content": "$(verify_page_content >/dev/null 2>&1 && echo "pass" || echo "fail")",
    "performance": "$(verify_performance >/dev/null 2>&1 && echo "pass" || echo "fail")",
    "database": "$(verify_database >/dev/null 2>&1 && echo "pass" || echo "fail")"
  }
}
EOF
    
    log_info "验证报告已生成: $report_file"
}

# 主函数
main() {
    log_info "开始部署后验证"
    log_info "目标URL: $DEPLOY_URL"
    
    # 等待服务启动
    wait_for_service
    
    # 运行所有验证
    verify_api_endpoints
    verify_page_content
    verify_static_resources
    verify_performance
    verify_security_headers
    verify_database
    verify_environment
    verify_logging
    verify_caching
    
    # 可选的功能验证（非关键）
    verify_form_functionality || true
    
    # 生成报告
    generate_verification_report
    
    log_success "部署验证完成！应用程序已准备就绪。"
}

# 错误处理
trap 'log_error "部署验证失败"; exit 1' ERR

# 执行主函数
main "$@"