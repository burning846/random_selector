'use client'

import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react'

interface User {
  name: string
  email: string
  picture?: string
}

interface HistoryItem {
  result: string
  timestamp: string
}

export default function RandomSelector() {
  const [user, setUser] = useState<User | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [currentOption, setCurrentOption] = useState('')
  const [options, setOptions] = useState<string[]>([])
  const [result, setResult] = useState('')
  const [isSpinning, setIsSpinning] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [rotation, setRotation] = useState(0)

  const quickOptions = [
    '是', '否', '同意', '不同意', '去', '不去',
    '买', '不买', '吃', '不吃', '看', '不看'
  ]

  useEffect(() => {
    // 从localStorage加载数据
    const savedOptions = localStorage.getItem('randomSelector_options')
    const savedHistory = localStorage.getItem('randomSelector_history')
    const savedUser = localStorage.getItem('randomSelector_user')

    if (savedOptions) {
      setOptions(JSON.parse(savedOptions))
    }
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      setShowLoginModal(true)
    }
  }, [])

  useEffect(() => {
    // 保存到localStorage
    localStorage.setItem('randomSelector_options', JSON.stringify(options))
  }, [options])

  useEffect(() => {
    localStorage.setItem('randomSelector_history', JSON.stringify(history))
  }, [history])

  useEffect(() => {
    if (user) {
      localStorage.setItem('randomSelector_user', JSON.stringify(user))
    }
  }, [user])

  const addOption = () => {
    if (currentOption.trim() && !options.includes(currentOption.trim())) {
      setOptions([...options, currentOption.trim()])
      setCurrentOption('')
      showMessage('选项已添加！', 'success')
    } else if (options.includes(currentOption.trim())) {
      showMessage('选项已存在！', 'error')
    }
  }

  const addQuickOptions = () => {
    const newOptions = Array.from(new Set([...options, ...quickOptions]))
    setOptions(newOptions)
    showMessage('快速选项已添加！', 'success')
  }

  const removeOption = (optionToRemove: string) => {
    setOptions(options.filter((option: string, i: number) => option !== optionToRemove))
    showMessage('选项已删除！', 'info')
  }

  const spinWheel = () => {
    if (options.length === 0) {
      showMessage('请先添加一些选项！', 'error')
      return
    }

    setIsSpinning(true)
    setResult('')

    // 随机旋转角度
    const spins = Math.floor(Math.random() * 5) + 5 // 5-10圈
    const finalAngle = Math.random() * 360
    const totalRotation = rotation + spins * 360 + finalAngle
    
    setRotation(totalRotation)

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * options.length)
      const selectedOption = options[randomIndex]
      setResult(selectedOption)
      setIsSpinning(false)
      
      // 添加到历史记录
      const newHistoryItem: HistoryItem = {
        result: selectedOption,
        timestamp: new Date().toLocaleString('zh-CN')
      }
      setHistory([newHistoryItem, ...history.slice(0, 9)]) // 保留最近10条记录
      
      showMessage(`结果是：${selectedOption}`, 'success')
    }, 3000)
  }

  const clearHistory = () => {
    setHistory([])
    showMessage('历史记录已清空！', 'info')
  }

  const exportData = () => {
    const data = {
      options,
      history,
      exportTime: new Date().toLocaleString('zh-CN')
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `随机决策器数据_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    showMessage('数据已导出！', 'success')
  }

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    const messageEl = document.createElement('div')
    messageEl.className = `message ${type}`
    messageEl.textContent = text
    document.body.appendChild(messageEl)
    
    setTimeout(() => {
      if (document.body.contains(messageEl)) {
        document.body.removeChild(messageEl)
      }
    }, 3000)
  }

  const handleGoogleLogin = () => {
    // 模拟Google登录
    const mockUser: User = {
      name: 'Google用户',
      email: 'user@gmail.com',
      picture: 'https://via.placeholder.com/32'
    }
    setUser(mockUser)
    setShowLoginModal(false)
    showMessage('登录成功！', 'success')
  }

  const handleGuestLogin = () => {
    const guestUser: User = {
      name: '游客',
      email: 'guest@local'
    }
    setUser(guestUser)
    setShowLoginModal(false)
    showMessage('以游客身份继续！', 'info')
  }

  const handleLogout = () => {
    setUser(null)
    setShowLoginModal(true)
    localStorage.removeItem('randomSelector_user')
    showMessage('已退出登录！', 'info')
  }

  return (
    <div className="app-container">
      {/* 登录模态框 */}
      {showLoginModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>欢迎使用随机决策器</h2>
            </div>
            <div className="modal-body">
              <p>请选择登录方式继续使用</p>
              <div className="login-options">
                <button className="login-btn google-btn" onClick={handleGoogleLogin}>
                  <span className="google-icon">🔍</span>
                  使用Google登录
                </button>
                <button className="login-btn guest-btn" onClick={handleGuestLogin}>
                  <span className="guest-icon">👤</span>
                  游客模式
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 用户信息栏 */}
      {user && (
        <div className="user-bar">
          <div className="user-info">
            {user.picture && (
              <img src={user.picture} alt="用户头像" className="user-avatar" />
            )}
            <span>欢迎，{user.name}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            退出登录
          </button>
        </div>
      )}

      {/* 主内容 */}
      <div className="main-content">
        <div className="container">
          <div className="header">
            <h1>🎯 随机决策器</h1>
            <p>让选择变得简单有趣</p>
          </div>

          {/* 输入区域 */}
          <div className="input-section">
            <h2>📝 添加选项</h2>
            <div className="input-group">
              <input
                type="text"
                value={currentOption}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentOption(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addOption()}
                placeholder="输入一个选项..."
                className="option-input"
              />
              <button 
                onClick={addOption} 
                disabled={!currentOption.trim()}
                className="add-btn"
              >
                ➕ 添加
              </button>
            </div>
            
            <div className="quick-options">
              {quickOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    if (!options.includes(option)) {
                      setOptions([...options, option])
                      showMessage(`已添加：${option}`, 'success')
                    }
                  }}
                  className="quick-btn"
                >
                  {option}
                </button>
              ))}
            </div>
            
            <button onClick={addQuickOptions} className="add-btn">
              ⚡ 添加所有快速选项
            </button>

            <div className="options-list">
              {options.length === 0 ? (
                <div className="empty-state">暂无选项，请添加一些选项开始使用</div>
              ) : (
                options.map((option, index) => (
                  <div key={index} className="option-tag">
                    <span>{option}</span>
                    <button 
                      onClick={() => removeOption(option)}
                      className="remove-option"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 决策区域 */}
          <div className="decision-section">
            <h2>🎲 开始决策</h2>
            <div className="wheel-container">
              <div className="wheel-pointer">👇</div>
              <div 
                className="wheel"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 3s cubic-bezier(0.23, 1, 0.32, 1)' : 'none'
                }}
              >
                {options.length > 0 ? `${options.length} 个选项` : '添加选项'}
              </div>
            </div>
            
            <button 
              onClick={spinWheel} 
              disabled={isSpinning || options.length === 0}
              className="spin-btn"
            >
              {isSpinning ? '🌀 转动中...' : '🎯 开始选择'}
            </button>
            
            {result && (
              <div className={`result ${result ? 'show' : ''}`}>
                🎉 结果是：{result}
              </div>
            )}
          </div>

          {/* 历史记录 */}
          <div className="history-section">
            <h3>📊 历史记录</h3>
            <div className="history-list">
              {history.length === 0 ? (
                <div className="empty-state">暂无历史记录</div>
              ) : (
                history.map((item, index) => (
                  <div key={index} className="history-item">
                    <span className="history-result">{item.result}</span>
                    <span className="history-time">{item.timestamp}</span>
                  </div>
                ))
              )}
            </div>
            
            <div className="action-buttons">
              <button onClick={clearHistory} className="action-btn">
                🗑️ 清空历史
              </button>
              <button onClick={exportData} className="action-btn">
                📥 导出数据
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}