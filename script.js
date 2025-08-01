// 随机决策器应用
class DecisionMaker {
    constructor() {
        this.options = JSON.parse(localStorage.getItem('decision_options')) || [];
        this.user = JSON.parse(localStorage.getItem('user_info')) || null;
        this.isSpinning = false;
        this.wheelColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        this.init();
    }

    // Google Analytics 事件跟踪
    trackEvent(action, category = 'User Interaction', label = '', value = null) {
        if (typeof gtag !== 'undefined') {
            const eventData = {
                event_category: category,
                event_label: label
            };
            if (value !== null) {
                eventData.value = value;
            }
            gtag('event', action, eventData);
        }
    }

    init() {
        this.checkAuthStatus();
        this.bindEvents();
        this.updateOptionsDisplay();
        this.updateWheelColors();
    }

    checkAuthStatus() {
        const loginModal = document.getElementById('loginModal');
        const app = document.getElementById('app');
        
        if (this.user) {
            // 用户已登录，显示应用界面
            loginModal.style.display = 'none';
            app.style.display = 'flex';
            this.updateUserInfo();
        } else {
            // 用户未登录，显示登录模态框
            loginModal.style.display = 'flex';
            app.style.display = 'none';
        }
    }

    updateUserInfo() {
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        
        if (this.user) {
            userName.textContent = this.user.name || '游客用户';
            if (this.user.avatar) {
                userAvatar.src = this.user.avatar;
                userAvatar.style.display = 'block';
            } else {
                userAvatar.style.display = 'none';
            }
        }
    }

    bindEvents() {
        // 登录相关事件
        const googleLoginBtn = document.getElementById('googleLoginBtn');
        const guestLoginBtn = document.getElementById('guestLoginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const closeBtn = document.querySelector('.close');

        googleLoginBtn.addEventListener('click', () => this.handleGoogleLogin());
        guestLoginBtn.addEventListener('click', () => this.handleGuestLogin());
        logoutBtn.addEventListener('click', () => this.handleLogout());
        closeBtn.addEventListener('click', () => this.closeLoginModal());

        // 选项管理事件
        const addOptionBtn = document.getElementById('addOptionBtn');
        const optionInput = document.getElementById('optionInput');
        const quickBtns = document.querySelectorAll('.quick-btn');

        addOptionBtn.addEventListener('click', () => this.addOption());
        optionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addOption();
            }
        });

        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const option = btn.getAttribute('data-option');
                this.addOptionByText(option);
            });
        });

        // 决策事件
        const spinBtn = document.getElementById('spinBtn');
        spinBtn.addEventListener('click', () => this.spinWheel());

        // 模态框外部点击关闭
        const loginModal = document.getElementById('loginModal');
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                this.closeLoginModal();
            }
        });
    }

    handleGoogleLogin() {
        // 模拟Google登录（实际项目中需要集成Google OAuth）
        this.showMessage('Google登录功能需要配置OAuth客户端ID', 'warning');
        
        // 模拟登录成功
        setTimeout(() => {
            this.user = {
                id: 'google_' + Date.now(),
                name: 'Google用户',
                email: 'user@gmail.com',
                avatar: 'https://via.placeholder.com/40x40/667eea/white?text=G',
                loginType: 'google'
            };
            this.saveUserInfo();
            this.checkAuthStatus();
            this.showMessage('Google登录成功！', 'success');
            
            // 跟踪登录事件
            this.trackEvent('login', 'Authentication', 'google_login');
        }, 1000);
    }

    handleGuestLogin() {
        this.user = {
            id: 'guest_' + Date.now(),
            name: '游客用户',
            loginType: 'guest'
        };
        this.saveUserInfo();
        this.checkAuthStatus();
        this.showMessage('以游客模式登录成功！', 'success');
        
        // 跟踪登录事件
        this.trackEvent('login', 'Authentication', 'guest_login');
    }

    handleLogout() {
        if (confirm('确定要退出登录吗？')) {
            this.user = null;
            localStorage.removeItem('user_info');
            this.checkAuthStatus();
            this.showMessage('已退出登录', 'info');
            
            // 跟踪登出事件
            this.trackEvent('logout', 'Authentication', 'user_logout');
        }
    }

    closeLoginModal() {
        if (!this.user) {
            this.showMessage('请先登录以使用应用', 'warning');
        }
    }

    saveUserInfo() {
        localStorage.setItem('user_info', JSON.stringify(this.user));
    }

    addOption() {
        const optionInput = document.getElementById('optionInput');
        const text = optionInput.value.trim();
        
        if (text === '') {
            this.showMessage('请输入选项内容！', 'error');
            return;
        }

        if (this.options.some(option => option.text === text)) {
            this.showMessage('该选项已存在！', 'warning');
            return;
        }

        this.addOptionByText(text);
        optionInput.value = '';
    }

    addOptionByText(text) {
        if (this.options.some(option => option.text === text)) {
            this.showMessage('该选项已存在！', 'warning');
            return;
        }

        const option = {
            id: Date.now() + Math.random(),
            text: text,
            createdAt: new Date().toLocaleString()
        };

        this.options.push(option);
        this.saveOptions();
        this.updateOptionsDisplay();
        this.updateWheelColors();
        this.showMessage(`选项"${text}"添加成功！`, 'success');
        
        // 跟踪添加选项事件
        this.trackEvent('add_option', 'Decision Making', text, this.options.length);
    }

    removeOption(id) {
        const removedOption = this.options.find(option => option.id === id);
        this.options = this.options.filter(option => option.id !== id);
        this.saveOptions();
        this.updateOptionsDisplay();
        this.updateWheelColors();
        this.showMessage('选项已删除！', 'info');
        
        // 跟踪删除选项事件
        if (removedOption) {
            this.trackEvent('remove_option', 'Decision Making', removedOption.text, this.options.length);
        }
    }

    updateOptionsDisplay() {
        const optionsList = document.getElementById('optionsList');
        const optionCount = document.getElementById('optionCount');
        const spinBtn = document.getElementById('spinBtn');
        
        optionCount.textContent = `(${this.options.length})`;
        
        if (this.options.length === 0) {
            optionsList.innerHTML = '<div class="empty-state">暂无选项，请先添加一些选项</div>';
            spinBtn.disabled = true;
            spinBtn.querySelector('.btn-text').textContent = '请先添加选项';
        } else {
            spinBtn.disabled = false;
            spinBtn.querySelector('.btn-text').textContent = '开始选择';
            
            optionsList.innerHTML = this.options.map(option => `
                <div class="option-item">
                    <span class="option-text">${this.escapeHtml(option.text)}</span>
                    <button class="remove-option" onclick="decisionMaker.removeOption(${option.id})">删除</button>
                </div>
            `).join('');
        }
    }

    updateWheelColors() {
        const wheel = document.getElementById('wheel');
        if (this.options.length === 0) {
            wheel.style.background = '#ccc';
            return;
        }

        // 根据选项数量动态生成颜色
        const colors = this.wheelColors.slice(0, Math.max(this.options.length, 6));
        const anglePerOption = 360 / this.options.length;
        
        let gradientStops = [];
        for (let i = 0; i < this.options.length; i++) {
            const startAngle = i * anglePerOption;
            const endAngle = (i + 1) * anglePerOption;
            const color = colors[i % colors.length];
            gradientStops.push(`${color} ${startAngle}deg ${endAngle}deg`);
        }
        
        wheel.style.background = `conic-gradient(${gradientStops.join(', ')})`;
    }

    spinWheel() {
        if (this.isSpinning || this.options.length === 0) {
            return;
        }

        this.isSpinning = true;
        const wheel = document.getElementById('wheel');
        const spinBtn = document.getElementById('spinBtn');
        const result = document.getElementById('result');
        
        // 禁用按钮
        spinBtn.disabled = true;
        spinBtn.querySelector('.btn-text').textContent = '选择中...';
        
        // 隐藏之前的结果
        result.classList.remove('show', 'winner');
        result.textContent = '';
        
        // 跟踪转盘旋转事件
        this.trackEvent('spin_wheel', 'Decision Making', '', this.options.length);
        
        // 计算随机角度
        const randomIndex = Math.floor(Math.random() * this.options.length);
        const anglePerOption = 360 / this.options.length;
        const targetAngle = randomIndex * anglePerOption + anglePerOption / 2;
        const spinRotations = 5; // 转5圈
        const totalRotation = spinRotations * 360 + (360 - targetAngle);
        
        // 设置CSS变量并开始动画
        wheel.style.setProperty('--spin-rotation', `${totalRotation}deg`);
        wheel.classList.add('spinning');
        
        // 动画结束后显示结果
        setTimeout(() => {
            const selectedOption = this.options[randomIndex];
            this.showResult(selectedOption);
            
            // 重置状态
            wheel.classList.remove('spinning');
            this.isSpinning = false;
            spinBtn.disabled = false;
            spinBtn.querySelector('.btn-text').textContent = '再次选择';
            
            // 记录选择历史
            this.recordChoice(selectedOption);
            
            // 跟踪结果事件
            this.trackEvent('spin_result', 'Decision Making', selectedOption.text);
        }, 3000);
    }

    showResult(option) {
        const result = document.getElementById('result');
        result.textContent = `🎉 选择结果：${option.text}`;
        result.classList.add('show');
        
        setTimeout(() => {
            result.classList.add('winner');
        }, 200);
        
        this.showMessage(`恭喜！选择了"${option.text}"`, 'success');
    }

    recordChoice(option) {
        const history = JSON.parse(localStorage.getItem('choice_history')) || [];
        const record = {
            option: option.text,
            timestamp: new Date().toISOString(),
            user: this.user?.name || '游客'
        };
        
        history.unshift(record);
        // 只保留最近50条记录
        if (history.length > 50) {
            history.splice(50);
        }
        
        localStorage.setItem('choice_history', JSON.stringify(history));
    }

    saveOptions() {
        localStorage.setItem('decision_options', JSON.stringify(this.options));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showMessage(message, type = 'info') {
        // 创建消息提示
        const messageDiv = document.createElement('div');
        messageDiv.className = `toast toast-${type}`;
        messageDiv.textContent = message;
        
        // 添加样式
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 12px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

        // 根据类型设置背景色
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            warning: '#ffc107'
        };
        messageDiv.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(messageDiv);

        // 显示动画
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(0)';
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }

    // 清空所有选项
    clearAllOptions() {
        if (confirm('确定要清空所有选项吗？此操作不可撤销！')) {
            const optionCount = this.options.length;
            this.options = [];
            this.saveOptions();
            this.updateOptionsDisplay();
            this.updateWheelColors();
            this.showMessage('所有选项已清空！', 'info');
            
            // 跟踪清空选项事件
            this.trackEvent('clear_options', 'Decision Making', '', optionCount);
        }
    }

    // 导出选项数据
    exportOptions() {
        const data = {
            options: this.options,
            exportDate: new Date().toISOString(),
            user: this.user?.name || '游客',
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fileName = `decision-options-${new Date().toISOString().split('T')[0]}.json`;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showMessage('选项数据导出成功！', 'success');
        
        // 跟踪导出选项事件
        this.trackEvent('export_options', 'Data Management', fileName, this.options.length);
    }
}

// 全局变量
let decisionMaker;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    decisionMaker = new DecisionMaker();
    
    // 跟踪页面浏览事件
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname
        });
    }
    
    // 添加键盘快捷键
    document.addEventListener('keydown', (e) => {
        // 空格键开始选择
        if (e.code === 'Space' && !decisionMaker.isSpinning && decisionMaker.options.length > 0) {
            e.preventDefault();
            decisionMaker.spinWheel();
        }
        
        // Ctrl/Cmd + E 导出数据
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            decisionMaker.exportOptions();
        }
        
        // Ctrl/Cmd + Shift + D 清空数据
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            decisionMaker.clearAllOptions();
        }
        
        // ESC键关闭模态框
        if (e.key === 'Escape') {
            const loginModal = document.getElementById('loginModal');
            if (loginModal.style.display === 'flex') {
                decisionMaker.closeLoginModal();
            }
        }
    });
    
    // 显示欢迎消息
    setTimeout(() => {
        if (decisionMaker.user) {
            decisionMaker.showMessage('欢迎使用随机决策器！', 'success');
        }
    }, 1000);
});

// 页面可见性变化监听
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && decisionMaker) {
        // 页面重新可见时检查认证状态
        decisionMaker.checkAuthStatus();
    }
});

// 性能监控
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`页面加载时间: ${loadTime}ms`);
        }, 0);
    });
}

// 添加触摸设备支持
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', () => {}, { passive: true });
}

// PWA支持检测
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // 可以在这里注册Service Worker以支持PWA功能
        console.log('支持Service Worker，可以添加PWA功能');
    });
}