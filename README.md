# 随机决策器 - Random Decision Maker

一个简洁美观的随机决策器Web应用，帮助您在多个选项中做出随机选择。

## 功能特性

- 🎯 **随机决策**: 添加多个选项，系统随机选择一个结果
- 🔐 **用户认证**: 支持Google登录和游客模式
- 🎨 **精美动画**: 转盘旋转动画，选择过程生动有趣
- 📱 **响应式设计**: 完美适配桌面和移动设备
- 💾 **本地存储**: 自动保存选项和用户信息
- 🚀 **Vercel部署**: 一键部署到Vercel平台

## 使用方法

1. **登录**: 选择Google登录或游客模式进入应用
2. **添加选项**: 在输入框中添加您的选择项，或使用快捷按钮
3. **开始选择**: 点击"开始选择"按钮，观看转盘动画
4. **查看结果**: 等待动画结束，查看随机选择的结果

## 快捷键

- `空格键`: 开始随机选择
- `Ctrl/Cmd + E`: 导出选项数据
- `Ctrl/Cmd + Shift + D`: 清空所有选项
- `ESC`: 关闭模态框

## 部署到Vercel

### 方法一：通过Git仓库部署

1. 将代码推送到GitHub仓库
2. 访问 [Vercel](https://vercel.com)
3. 点击"New Project"并选择您的GitHub仓库
4. Vercel会自动检测并部署您的项目

### 方法二：使用Vercel CLI

```bash
# 安装Vercel CLI
npm i -g vercel

# 在项目目录中运行
vercel

# 按照提示完成部署
```

## 项目结构

```
web_test/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # JavaScript逻辑
├── vercel.json         # Vercel配置
├── analytics-setup.md  # Analytics 设置指南
└── README.md           # 项目说明
```

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **样式**: CSS Grid, Flexbox, CSS动画
- **存储**: LocalStorage
- **部署**: Vercel
- **认证**: Google OAuth 2.0 (模拟)
- **分析**: Google Analytics 4 (GA4)

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 开发说明

### 本地开发

直接在浏览器中打开 `index.html` 文件即可开始开发。

### Google OAuth配置（可选）

如需启用真实的Google登录功能，请：

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用Google+ API
4. 创建OAuth 2.0客户端ID
5. 在 `script.js` 中替换相应的客户端ID

### Google Analytics 配置

如需启用网站数据分析：

1. 前往 [Google Analytics](https://analytics.google.com/)
2. 创建新的 GA4 属性
3. 获取测量 ID（格式：G-XXXXXXXXXX）
4. 将 `index.html` 中的 `GA_MEASUREMENT_ID` 替换为实际 ID
5. 详细设置请参考 `analytics-setup.md`

### 跟踪的用户行为

应用自动跟踪以下事件：
- 用户登录/登出
- 添加/删除选项
- 转盘旋转和结果
- 数据导出和清空
- 页面浏览

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！