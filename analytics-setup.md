# Web Analytics 设置指南

本项目已集成 Google Analytics 4 (GA4) 用于网站数据分析和用户行为跟踪。

## 设置步骤

### 1. 创建 Google Analytics 账户

1. 访问 [Google Analytics](https://analytics.google.com/)
2. 使用 Google 账户登录
3. 点击「开始测量」创建新的 Analytics 账户
4. 填写账户信息和属性设置
5. 选择「网站」作为平台
6. 填写网站信息（网站名称、URL、行业类别等）

### 2. 获取测量 ID

1. 在 Google Analytics 中，进入「管理」→「数据流」
2. 选择你的网站数据流
3. 复制「测量 ID」（格式：G-XXXXXXXXXX）

### 3. 配置项目

在 `index.html` 文件中，将 `GA_MEASUREMENT_ID` 替换为你的实际测量 ID：

```html
<!-- 替换这两处的 GA_MEASUREMENT_ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=你的测量ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '你的测量ID');
</script>
```

## 跟踪的事件

本应用自动跟踪以下用户行为：

### 认证事件
- **登录**: `login`
  - Google 登录: `google_login`
  - 游客登录: `guest_login`
- **登出**: `logout`

### 决策制作事件
- **添加选项**: `add_option`
  - 记录选项内容和当前选项总数
- **删除选项**: `remove_option`
  - 记录删除的选项内容和剩余选项数
- **转盘旋转**: `spin_wheel`
  - 记录旋转时的选项数量
- **决策结果**: `spin_result`
  - 记录最终选择的选项
- **清空选项**: `clear_options`
  - 记录清空前的选项数量

### 数据管理事件
- **导出选项**: `export_options`
  - 记录导出文件名和选项数量

### 页面事件
- **页面浏览**: `page_view`
  - 自动跟踪页面访问

## 数据隐私

- 本应用遵循数据隐私最佳实践
- 不收集个人身份信息（PII）
- 用户可以通过浏览器设置禁用 Analytics
- 建议在隐私政策中说明数据收集情况

## 查看数据

1. 登录 [Google Analytics](https://analytics.google.com/)
2. 选择你的属性
3. 在左侧菜单中查看：
   - **实时**: 当前用户活动
   - **事件**: 自定义事件统计
   - **受众群体**: 用户特征分析
   - **获客**: 流量来源分析

## 高级配置

### 自定义维度

可以在 Google Analytics 中设置自定义维度来跟踪更多信息：

1. 进入「管理」→「自定义定义」→「自定义维度」
2. 创建新的自定义维度
3. 在代码中使用 `gtag('config', 'GA_MEASUREMENT_ID', { custom_map: {...} })`

### 转化目标

设置转化目标来衡量应用成功指标：

1. 进入「管理」→「转化」
2. 点击「新建转化事件」
3. 设置事件名称（如 `spin_result` 表示成功进行决策）

## 故障排除

### 检查 Analytics 是否正常工作

1. 打开浏览器开发者工具
2. 在 Console 中输入：`gtag('event', 'test_event')`
3. 在 Google Analytics 实时报告中查看是否有事件记录

### 常见问题

- **事件不显示**: 检查测量 ID 是否正确
- **实时数据为空**: 确保网站已部署且可访问
- **事件延迟**: Google Analytics 数据可能有 24-48 小时延迟

## 合规性

使用 Google Analytics 时请注意：

- 遵循当地数据保护法规（如 GDPR、CCPA）
- 在网站上添加隐私政策
- 考虑添加 Cookie 同意横幅
- 提供用户选择退出的选项