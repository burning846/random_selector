'use client'

import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react'

interface User {
  name: string
  email: string
  picture?: string
}

interface Option {
  id: string
  name: string
  color: string
}

interface OptionGroup {
  id: string
  name: string
  options: Option[]
}

interface HistoryItem {
  result: string
  groupName: string
  timestamp: string
}

// 预设颜色卡
const COLOR_PALETTE = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
  '#A3E4D7', '#F9E79F', '#D5A6BD', '#AED6F1', '#A9DFBF'
]

// 预设选项组模板
const PRESET_GROUPS: OptionGroup[] = [
  {
    id: 'food',
    name: '今天吃什么',
    options: [
      { id: 'hotpot', name: '火锅', color: COLOR_PALETTE[0] },
      { id: 'bbq', name: '烤肉', color: COLOR_PALETTE[1] },
      { id: 'noodles', name: '面条', color: COLOR_PALETTE[2] },
      { id: 'sushi', name: '寿司', color: COLOR_PALETTE[3] },
      { id: 'pizza', name: '披萨', color: COLOR_PALETTE[4] },
      { id: 'chinese', name: '中餐', color: COLOR_PALETTE[5] }
    ]
  },
  {
    id: 'weekend',
    name: '周末做什么',
    options: [
      { id: 'movie', name: '看电影', color: COLOR_PALETTE[6] },
      { id: 'shopping', name: '购物', color: COLOR_PALETTE[7] },
      { id: 'park', name: '逛公园', color: COLOR_PALETTE[8] },
      { id: 'game', name: '打游戏', color: COLOR_PALETTE[9] },
      { id: 'read', name: '读书', color: COLOR_PALETTE[10] },
      { id: 'sleep', name: '睡觉', color: COLOR_PALETTE[11] }
    ]
  },
  {
    id: 'decision',
    name: '简单决策',
    options: [
      { id: 'yes', name: '是', color: COLOR_PALETTE[12] },
      { id: 'no', name: '否', color: COLOR_PALETTE[13] },
      { id: 'agree', name: '同意', color: COLOR_PALETTE[14] },
      { id: 'disagree', name: '不同意', color: COLOR_PALETTE[15] }
    ]
  }
]

export default function RandomSelector() {
  const [user, setUser] = useState<User | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>(PRESET_GROUPS)
  const [selectedGroupId, setSelectedGroupId] = useState<string>(PRESET_GROUPS[0].id)
  const [newOptionName, setNewOptionName] = useState('')
  const [newGroupName, setNewGroupName] = useState('')
  const [result, setResult] = useState('')
  const [isSpinning, setIsSpinning] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [rotation, setRotation] = useState(0)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [editingGroup, setEditingGroup] = useState<OptionGroup | null>(null)

  const selectedGroup = optionGroups.find(group => group.id === selectedGroupId) || optionGroups[0]
  const currentOptions = selectedGroup?.options || []

  useEffect(() => {
    // 从localStorage加载数据
    const savedGroups = localStorage.getItem('randomSelector_groups')
    const savedHistory = localStorage.getItem('randomSelector_history')
    const savedUser = localStorage.getItem('randomSelector_user')
    const savedSelectedGroup = localStorage.getItem('randomSelector_selectedGroup')

    if (savedGroups) {
      setOptionGroups(JSON.parse(savedGroups))
    }
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      setShowLoginModal(true)
    }
    if (savedSelectedGroup) {
      setSelectedGroupId(savedSelectedGroup)
    }
  }, [])

  useEffect(() => {
    // 保存到localStorage
    localStorage.setItem('randomSelector_groups', JSON.stringify(optionGroups))
  }, [optionGroups])

  useEffect(() => {
    localStorage.setItem('randomSelector_history', JSON.stringify(history))
  }, [history])

  useEffect(() => {
    if (user) {
      localStorage.setItem('randomSelector_user', JSON.stringify(user))
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem('randomSelector_selectedGroup', selectedGroupId)
  }, [selectedGroupId])

  const addOption = () => {
    if (newOptionName.trim()) {
      const updatedGroups = optionGroups.map(group => {
        if (group.id === selectedGroupId) {
          const newOption: Option = {
            id: Date.now().toString(),
            name: newOptionName.trim(),
            color: COLOR_PALETTE[group.options.length % COLOR_PALETTE.length]
          }
          return {
            ...group,
            options: [...group.options, newOption]
          }
        }
        return group
      })
      setOptionGroups(updatedGroups)
      setNewOptionName('')
      showMessage('选项已添加！', 'success')
    }
  }

  const removeOption = (optionId: string) => {
    const updatedGroups = optionGroups.map(group => {
      if (group.id === selectedGroupId) {
        return {
          ...group,
          options: group.options.filter(option => option.id !== optionId)
        }
      }
      return group
    })
    setOptionGroups(updatedGroups)
    showMessage('选项已删除！', 'info')
  }

  const addGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: OptionGroup = {
        id: Date.now().toString(),
        name: newGroupName.trim(),
        options: []
      }
      setOptionGroups([...optionGroups, newGroup])
      setNewGroupName('')
      setShowGroupModal(false)
      showMessage('选项组已添加！', 'success')
    }
  }

  const deleteGroup = (groupId: string) => {
    if (optionGroups.length > 1) {
      const updatedGroups = optionGroups.filter(group => group.id !== groupId)
      setOptionGroups(updatedGroups)
      if (selectedGroupId === groupId) {
        setSelectedGroupId(updatedGroups[0].id)
      }
      showMessage('选项组已删除！', 'info')
    }
  }

  const spinWheel = () => {
    if (currentOptions.length === 0) {
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
      const randomIndex = Math.floor(Math.random() * currentOptions.length)
      const selectedOption = currentOptions[randomIndex]
      setResult(selectedOption.name)
      setIsSpinning(false)
      
      // 添加到历史记录
      const newHistoryItem: HistoryItem = {
        result: selectedOption.name,
        groupName: selectedGroup.name,
        timestamp: new Date().toLocaleString('zh-CN')
      }
      setHistory([newHistoryItem, ...history.slice(0, 9)]) // 保留最近10条记录
      
      showMessage(`结果是：${selectedOption.name}`, 'success')
    }, 3000)
  }

  const clearHistory = () => {
    setHistory([])
    showMessage('历史记录已清空！', 'info')
  }

  const exportData = () => {
    const data = {
      optionGroups,
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

        <style jsx>{`
          .app-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          
          .user-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255,255,255,0.95);
            padding: 15px 30px;
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(0,0,0,0.1);
          }
          
          .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
          }
          
          .logout-btn {
            background: #dc3545;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
          }
          
          .logout-btn:hover {
            background: #c82333;
          }
          
          .main-content {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
            margin-top: 20px;
            margin-bottom: 20px;
          }
          
          .container {
            padding: 30px;
          }
          
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            margin: -30px -30px 30px -30px;
            border-radius: 20px 20px 0 0;
          }
          
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 2.5em;
          }
          
          .header p {
            margin: 0;
            opacity: 0.9;
            font-size: 1.1em;
          }
          
          .input-section {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 15px;
            border: 1px solid #e9ecef;
            margin-bottom: 30px;
          }
          
          .input-section h2 {
            margin: 0 0 20px 0;
            color: #495057;
            font-size: 1.3em;
          }
          
          .group-selector {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            align-items: center;
          }
          
          .group-select {
            flex: 1;
            padding: 12px 15px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            font-size: 16px;
            background: white;
            transition: all 0.3s ease;
          }
          
          .group-select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }
          
          .add-btn {
            padding: 12px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .add-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
          }
          
          .add-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .delete-btn {
            padding: 12px 20px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .delete-btn:hover {
            background: #c82333;
            transform: translateY(-2px);
          }
          
          .input-group {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
          }
          
          .option-input {
            flex: 1;
            padding: 12px 15px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            font-size: 16px;
            transition: all 0.3s ease;
          }
          
          .option-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }
          
          .options-list {
            margin-top: 20px;
          }
          
          .option-tag {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: white;
            padding: 12px 15px;
            margin-bottom: 8px;
            border-radius: 10px;
            border: 1px solid #e9ecef;
            transition: all 0.3s ease;
          }
          
          .option-tag:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transform: translateY(-1px);
          }
          
          .remove-option {
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }
          
          .remove-option:hover {
            background: #c82333;
          }
          
          .empty-state {
            text-align: center;
            color: #6c757d;
            padding: 40px 20px;
            font-style: italic;
          }
          
          .decision-section {
            text-align: center;
            background: #f8f9fa;
            padding: 25px;
            border-radius: 15px;
            border: 1px solid #e9ecef;
            margin-bottom: 30px;
          }
          
          .decision-section h2 {
            margin: 0 0 20px 0;
            color: #495057;
            font-size: 1.3em;
          }
          
          .wheel-container {
            position: relative;
            display: inline-block;
            margin-bottom: 30px;
          }
          
          .wheel-pointer {
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 24px;
            z-index: 10;
          }
          
          .wheel {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            position: relative;
            border: 8px solid #495057;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: #6c757d;
            background: #e9ecef;
          }
          
          .wheel-option-label {
            position: absolute;
            font-size: 12px;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
            pointer-events: none;
          }
          
          .spin-btn {
            padding: 15px 30px;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 20px;
          }
          
          .spin-btn:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(40, 167, 69, 0.4);
          }
          
          .spin-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .result {
            background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            margin-top: 20px;
            font-size: 1.2em;
            font-weight: 600;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.5s ease;
          }
          
          .result.show {
            opacity: 1;
            transform: translateY(0);
          }
          
          .history-section {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 15px;
            border: 1px solid #e9ecef;
          }
          
          .history-section h3 {
            margin: 0 0 20px 0;
            color: #495057;
            font-size: 1.3em;
          }
          
          .history-list {
            max-height: 300px;
            overflow-y: auto;
            margin-bottom: 20px;
          }
          
          .history-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: white;
            padding: 12px 15px;
            margin-bottom: 8px;
            border-radius: 10px;
            border: 1px solid #e9ecef;
            transition: all 0.3s ease;
          }
          
          .history-item:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          
          .history-result {
            font-weight: 600;
            color: #495057;
          }
          
          .history-group {
            font-size: 0.9em;
            color: #6c757d;
            font-style: italic;
          }
          
          .history-time {
            font-size: 0.9em;
            color: #6c757d;
          }
          
          .action-buttons {
            display: flex;
            gap: 10px;
          }
          
          .action-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
          }
          
          .action-btn:first-child {
            background: #dc3545;
            color: white;
          }
          
          .action-btn:first-child:hover {
            background: #c82333;
            transform: translateY(-1px);
          }
          
          .action-btn:last-child {
            background: #17a2b8;
            color: white;
          }
          
          .action-btn:last-child:hover {
            background: #138496;
            transform: translateY(-1px);
          }
          
          .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          
          .modal-content {
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            max-width: 400px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
          }
          
          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 30px;
            border-bottom: 1px solid #e9ecef;
          }
          
          .modal-header h2 {
            margin: 0;
            color: #495057;
          }
          
          .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6c757d;
            transition: color 0.3s ease;
          }
          
          .modal-close:hover {
            color: #495057;
          }
          
          .modal-body {
            padding: 30px;
          }
          
          .modal-body p {
            text-align: center;
            color: #6c757d;
            margin-bottom: 30px;
          }
          
          .login-options {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
          
          .login-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 15px 20px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            font-size: 16px;
          }
          
          .google-btn {
            background: #4285f4;
            color: white;
          }
          
          .google-btn:hover {
            background: #3367d6;
            transform: translateY(-2px);
          }
          
          .guest-btn {
            background: #6c757d;
            color: white;
          }
          
          .guest-btn:hover {
            background: #5a6268;
            transform: translateY(-2px);
          }
          
          .google-icon, .guest-icon {
            font-size: 18px;
          }
          
          .group-input {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            font-size: 16px;
            margin-bottom: 20px;
            box-sizing: border-box;
          }
          
          .group-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }
          
          .modal-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
          }
          
          .confirm-btn {
            padding: 10px 20px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          
          .confirm-btn:hover:not(:disabled) {
            background: #218838;
            transform: translateY(-1px);
          }
          
          .confirm-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .cancel-btn {
            padding: 10px 20px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          
          .cancel-btn:hover {
            background: #5a6268;
            transform: translateY(-1px);
          }
          
          .message {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 1001;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          
          .message.success {
            background: #28a745;
          }
          
          .message.error {
            background: #dc3545;
          }
          
          .message.info {
            background: #17a2b8;
          }
          
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @media (max-width: 768px) {
            .container {
              padding: 20px;
            }
            
            .header {
              margin: -20px -20px 20px -20px;
              padding: 20px;
            }
            
            .header h1 {
              font-size: 2em;
            }
            
            .wheel {
              width: 150px;
              height: 150px;
            }
            
            .group-selector {
              flex-direction: column;
              align-items: stretch;
            }
            
            .input-group {
              flex-direction: column;
            }
            
            .action-buttons {
              flex-direction: column;
            }
            
            .history-item {
              flex-direction: column;
              align-items: flex-start;
              gap: 5px;
            }
            
            .user-bar {
              padding: 10px 20px;
            }
            
            .modal-content {
              margin: 20px;
              width: calc(100% - 40px);
            }
            
            .modal-body {
              padding: 20px;
            }
            
            .modal-header {
              padding: 15px 20px;
            }
          }
        `}</style>

          {/* 选项组管理区域 */}
          <div className="input-section">
            <h2>📁 选项组管理</h2>
            <div className="group-selector">
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="group-select"
              >
                {optionGroups.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
              <button
                onClick={() => setShowGroupModal(true)}
                className="add-btn"
              >
                ➕ 新建组
              </button>
              {optionGroups.length > 1 && (
                <button
                  onClick={() => deleteGroup(selectedGroupId)}
                  className="delete-btn"
                >
                  🗑️ 删除组
                </button>
              )}
            </div>
          </div>

          {/* 输入区域 */}
          <div className="input-section">
            <h2>📝 添加选项到 "{selectedGroup.name}"</h2>
            <div className="input-group">
              <input
                type="text"
                value={newOptionName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewOptionName(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addOption()}
                placeholder="输入一个选项..."
                className="option-input"
              />
              <button 
                onClick={addOption} 
                disabled={!newOptionName.trim()}
                className="add-btn"
              >
                ➕ 添加
              </button>
            </div>

            <div className="options-list">
              {currentOptions.length === 0 ? (
                <div className="empty-state">暂无选项，请添加一些选项开始使用</div>
              ) : (
                currentOptions.map((option) => (
                  <div key={option.id} className="option-tag" style={{borderLeft: `4px solid ${option.color}`}}>
                    <span>{option.name}</span>
                    <button 
                      onClick={() => removeOption(option.id)}
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
                  transition: isSpinning ? 'transform 3s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
                  background: currentOptions.length > 0 ? 
                    `conic-gradient(${currentOptions.map((option, index) => {
                      const startAngle = (index * 360 / currentOptions.length)
                      const endAngle = ((index + 1) * 360 / currentOptions.length)
                      return `${option.color} ${startAngle}deg ${endAngle}deg`
                    }).join(', ')})` : 
                    'linear-gradient(45deg, #e0e0e0, #f0f0f0)'
                }}
              >
                {currentOptions.length > 0 ? (
                  currentOptions.map((option, index) => {
                    const angle = (index * 360 / currentOptions.length) + (180 / currentOptions.length)
                    const radius = 60
                    const x = Math.cos((angle - 90) * Math.PI / 180) * radius
                    const y = Math.sin((angle - 90) * Math.PI / 180) * radius
                    
                    return (
                      <div
                        key={option.id}
                        className="wheel-option-label"
                        style={{
                          position: 'absolute',
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: 'translate(-50%, -50%)',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                          pointerEvents: 'none'
                        }}
                      >
                        {option.name.length > 6 ? option.name.substring(0, 6) + '...' : option.name}
                      </div>
                    )
                  })
                ) : (
                  <span>添加选项</span>
                )}
              </div>
            </div>
            
            <button 
              onClick={spinWheel} 
              disabled={isSpinning || currentOptions.length === 0}
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
                    <span className="history-group">({item.groupName})</span>
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

      {/* 新建组模态框 */}
      {showGroupModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>新建选项组</h2>
              <button 
                className="modal-close"
                onClick={() => setShowGroupModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addGroup()}
                placeholder="输入组名..."
                className="group-input"
              />
              <div className="modal-actions">
                <button 
                  onClick={addGroup}
                  disabled={!newGroupName.trim()}
                  className="confirm-btn"
                >
                  确认
                </button>
                <button 
                  onClick={() => setShowGroupModal(false)}
                  className="cancel-btn"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}