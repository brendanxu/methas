#!/bin/bash

# 监控脚本
# 用于生产环境健康检查和性能监控

set -e

# 配置
PRODUCTION_URL="${PRODUCTION_URL:-https://southpole.com}"
SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"
ALERT_THRESHOLD_RESPONSE_TIME=5000  # 5 seconds
ALERT_THRESHOLD_ERROR_RATE=0.05     # 5%

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

# 发送Slack通知
send_slack_notification() {
    local message="$1"
    local type="${2:-info}"
    
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        local emoji="📋"
        case $type in
            "success") emoji="✅" ;;
            "warning") emoji="⚠️" ;;
            "error") emoji="❌" ;;
            "critical") emoji="🚨" ;;
        esac
        
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$emoji South Pole Monitoring: $message\"}" \
            "$SLACK_WEBHOOK_URL" || true
    fi
}

# 健康检查
health_check() {
    log_info "运行健康检查..."
    
    local start_time=$(date +%s%N)
    local response=$(curl -s -w "%{http_code},%{time_total}" -o /dev/null "$PRODUCTION_URL/api/health")
    local end_time=$(date +%s%N)
    
    local http_code=$(echo $response | cut -d',' -f1)
    local response_time=$(echo $response | cut -d',' -f2)
    local response_time_ms=$(echo "$response_time * 1000" | bc)
    
    if [ "$http_code" = "200" ]; then
        log_success "健康检查通过 (${response_time_ms}ms)"
        
        if (( $(echo "$response_time_ms > $ALERT_THRESHOLD_RESPONSE_TIME" | bc -l) )); then
            log_warning "响应时间超过阈值: ${response_time_ms}ms > ${ALERT_THRESHOLD_RESPONSE_TIME}ms"
            send_slack_notification "响应时间警告: ${response_time_ms}ms" "warning"
        fi
    else
        log_error "健康检查失败: HTTP $http_code"
        send_slack_notification "健康检查失败: HTTP $http_code" "error"
        return 1
    fi
}

# 页面可访问性检查
accessibility_check() {
    log_info "检查页面可访问性..."
    
    local pages=("/" "/contact" "/services/carbon-footprint-assessment" "/news")
    local failed_pages=()
    
    for page in "${pages[@]}"; do
        local url="$PRODUCTION_URL$page"
        local http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
        
        if [ "$http_code" = "200" ]; then
            log_success "页面可访问: $page"
        else
            log_error "页面不可访问: $page (HTTP $http_code)"
            failed_pages+=("$page")
        fi
    done
    
    if [ ${#failed_pages[@]} -gt 0 ]; then
        send_slack_notification "页面不可访问: ${failed_pages[*]}" "error"
        return 1
    fi
}

# 性能检查
performance_check() {
    log_info "运行性能检查..."
    
    # 使用Lighthouse CI进行性能检查
    if command -v lhci &> /dev/null; then
        log_info "运行 Lighthouse 性能测试..."
        
        # 创建临时配置
        cat > /tmp/lhci-monitor.json << EOF
{
  "ci": {
    "collect": {
      "url": ["$PRODUCTION_URL"],
      "numberOfRuns": 1,
      "settings": {
        "preset": "desktop",
        "onlyCategories": ["performance"]
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.8}],
        "metrics:first-contentful-paint": ["warn", {"maxNumericValue": 3000}],
        "metrics:largest-contentful-paint": ["warn", {"maxNumericValue": 4000}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
EOF
        
        if lhci autorun --config=/tmp/lhci-monitor.json; then
            log_success "性能检查通过"
        else
            log_warning "性能检查失败或低于预期"
            send_slack_notification "性能指标低于预期" "warning"
        fi
        
        rm -f /tmp/lhci-monitor.json
    else
        log_warning "Lighthouse CI 未安装，跳过性能检查"
    fi
}

# SSL证书检查
ssl_check() {
    log_info "检查SSL证书..."
    
    local domain=$(echo "$PRODUCTION_URL" | sed 's|https\?://||' | sed 's|/.*||')
    local expiry_date=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates | grep "notAfter" | cut -d= -f2)
    
    if [ -n "$expiry_date" ]; then
        local expiry_timestamp=$(date -d "$expiry_date" +%s)
        local current_timestamp=$(date +%s)
        local days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
        
        if [ $days_until_expiry -gt 30 ]; then
            log_success "SSL证书有效 (${days_until_expiry}天后过期)"
        elif [ $days_until_expiry -gt 7 ]; then
            log_warning "SSL证书即将过期 (${days_until_expiry}天后过期)"
            send_slack_notification "SSL证书即将过期: ${days_until_expiry}天" "warning"
        else
            log_error "SSL证书即将过期 (${days_until_expiry}天后过期)"
            send_slack_notification "SSL证书紧急: ${days_until_expiry}天后过期" "critical"
        fi
    else
        log_error "无法获取SSL证书信息"
        send_slack_notification "无法检查SSL证书" "error"
    fi
}

# 数据库连接检查
database_check() {
    log_info "检查数据库连接..."
    
    local db_health_url="$PRODUCTION_URL/api/admin/db-health"
    local response=$(curl -s -w "%{http_code}" -o /tmp/db_health.json "$db_health_url")
    local http_code=$(echo $response | tail -n1)
    
    if [ "$http_code" = "200" ]; then
        local status=$(cat /tmp/db_health.json | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
        if [ "$status" = "healthy" ]; then
            log_success "数据库连接正常"
        else
            log_warning "数据库状态异常: $status"
            send_slack_notification "数据库状态异常: $status" "warning"
        fi
    else
        log_error "无法检查数据库状态: HTTP $http_code"
        send_slack_notification "数据库检查失败: HTTP $http_code" "error"
    fi
    
    rm -f /tmp/db_health.json
}

# 错误率检查
error_rate_check() {
    log_info "检查错误率..."
    
    # 这里可以集成APM工具或日志分析
    # 示例：检查最近的错误日志
    local error_log_url="$PRODUCTION_URL/api/logs?level=error&since=1h"
    local response=$(curl -s "$error_log_url")
    
    if echo "$response" | grep -q "error"; then
        local error_count=$(echo "$response" | grep -c "error" || echo "0")
        log_warning "发现 $error_count 个错误事件（最近1小时）"
        
        if [ "$error_count" -gt 10 ]; then
            send_slack_notification "错误率异常: $error_count 个错误（最近1小时）" "warning"
        fi
    else
        log_success "未发现错误事件"
    fi
}

# 磁盘空间检查（如果是自托管）
disk_space_check() {
    log_info "检查磁盘空间..."
    
    local disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$disk_usage" -gt 90 ]; then
        log_error "磁盘空间不足: ${disk_usage}%"
        send_slack_notification "磁盘空间不足: ${disk_usage}%" "critical"
    elif [ "$disk_usage" -gt 80 ]; then
        log_warning "磁盘空间警告: ${disk_usage}%"
        send_slack_notification "磁盘空间警告: ${disk_usage}%" "warning"
    else
        log_success "磁盘空间充足: ${disk_usage}%"
    fi
}

# 生成监控报告
generate_report() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local report_file="/tmp/monitoring_report_$(date +%Y%m%d_%H%M%S).json"
    
    cat > "$report_file" << EOF
{
  "timestamp": "$timestamp",
  "url": "$PRODUCTION_URL",
  "checks": {
    "health": "$(health_check >/dev/null 2>&1 && echo "pass" || echo "fail")",
    "accessibility": "$(accessibility_check >/dev/null 2>&1 && echo "pass" || echo "fail")",
    "ssl": "$(ssl_check >/dev/null 2>&1 && echo "pass" || echo "fail")",
    "database": "$(database_check >/dev/null 2>&1 && echo "pass" || echo "fail")"
  }
}
EOF
    
    log_info "监控报告已生成: $report_file"
}

# 主函数
main() {
    local check_type="${1:-all}"
    
    log_info "开始监控检查 - 类型: $check_type"
    log_info "目标URL: $PRODUCTION_URL"
    
    case $check_type in
        "health")
            health_check
            ;;
        "accessibility")
            accessibility_check
            ;;
        "performance")
            performance_check
            ;;
        "ssl")
            ssl_check
            ;;
        "database")
            database_check
            ;;
        "errors")
            error_rate_check
            ;;
        "disk")
            disk_space_check
            ;;
        "all")
            health_check
            accessibility_check
            ssl_check
            database_check
            error_rate_check
            performance_check
            generate_report
            ;;
        *)
            log_error "未知检查类型: $check_type"
            echo "用法: $0 [health|accessibility|performance|ssl|database|errors|disk|all]"
            exit 1
            ;;
    esac
    
    log_success "监控检查完成"
}

# 错误处理
trap 'log_error "监控检查失败"; send_slack_notification "监控脚本执行失败" "error"; exit 1' ERR

# 执行主函数
main "$@"