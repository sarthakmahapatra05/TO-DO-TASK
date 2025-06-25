import { useState, useEffect } from 'react'
import { Plus, Trash2, LogOut, CheckCircle, Circle, Search, Filter, Calendar, Tag, Star, Moon, Sun, Download, Upload, Edit3, X, User, Sparkles, Settings } from 'lucide-react'
import Profile from './Profile'

const TodoList = ({ username, onLogout }) => {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState('all') // all, active, completed
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTodos, setSelectedTodos] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [dailyQuote, setDailyQuote] = useState('')
  
  // New todo form state
  const [todoForm, setTodoForm] = useState({
    text: '',
    category: 'personal',
    priority: 'medium',
    dueDate: '',
    notes: ''
  })

  const categories = ['personal', 'work', 'shopping', 'health', 'education', 'other']
  const priorities = ['low', 'medium', 'high']

  // Motivational quotes
  const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "The future depends on what you do today. - Mahatma Gandhi",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
    "It always seems impossible until it's done. - Nelson Mandela",
    "The way to get started is to quit talking and begin doing. - Walt Disney",
    "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
    "The best way to predict the future is to create it. - Peter Drucker",
    "Dream big and dare to fail. - Norman Vaughan",
    "Every day is a new beginning. Take a deep breath and start again.",
    "Small progress is still progress. Keep moving forward!",
    "Your potential is limitless. Believe in yourself and take action.",
    "Today's accomplishments were yesterday's impossibilities.",
    "Focus on being productive instead of busy."
  ]

  // Load todos and preferences from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem(`todos_${username}`)
    const savedDarkMode = localStorage.getItem(`darkMode_${username}`)
    const savedProfile = localStorage.getItem(`profile_${username}`)
    
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    }

    // Set daily quote
    const today = new Date().toDateString()
    const savedQuote = localStorage.getItem(`quote_${today}`)
    if (savedQuote) {
      setDailyQuote(savedQuote)
    } else {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      setDailyQuote(randomQuote)
      localStorage.setItem(`quote_${today}`, randomQuote)
    }
  }, [username, quotes])

  // Save todos and preferences to localStorage
  useEffect(() => {
    localStorage.setItem(`todos_${username}`, JSON.stringify(todos))
    localStorage.setItem(`darkMode_${username}`, JSON.stringify(darkMode))
    
    // Apply dark mode to body
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [todos, darkMode, username])

  const addTodo = (e) => {
    e.preventDefault()
    if (todoForm.text.trim()) {
      const todo = {
        id: Date.now(),
        text: todoForm.text.trim(),
        category: todoForm.category,
        priority: todoForm.priority,
        dueDate: todoForm.dueDate,
        notes: todoForm.notes,
        completed: false,
        createdAt: new Date().toISOString()
      }
      setTodos([...todos, todo])
      resetTodoForm()
      setShowAddForm(false)
    }
  }

  const updateTodo = (e) => {
    e.preventDefault()
    if (todoForm.text.trim() && editingTodo) {
      setTodos(todos.map(todo =>
        todo.id === editingTodo.id ? { ...todo, ...todoForm } : todo
      ))
      setEditingTodo(null)
      resetTodoForm()
    }
  }

  const resetTodoForm = () => {
    setTodoForm({
      text: '',
      category: 'personal',
      priority: 'medium',
      dueDate: '',
      notes: ''
    })
  }

  const startEdit = (todo) => {
    setEditingTodo(todo)
    setTodoForm({
      text: todo.text,
      category: todo.category,
      priority: todo.priority,
      dueDate: todo.dueDate || '',
      notes: todo.notes || ''
    })
  }

  const cancelEdit = () => {
    setEditingTodo(null)
    resetTodoForm()
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
    setSelectedTodos(selectedTodos.filter(todoId => todoId !== id))
  }

  const toggleSelectTodo = (id) => {
    setSelectedTodos(prev => 
      prev.includes(id) 
        ? prev.filter(todoId => todoId !== id)
        : [...prev, id]
    )
  }

  const selectAll = () => {
    const filteredIds = filteredTodos.map(todo => todo.id)
    setSelectedTodos(filteredIds)
  }

  const deselectAll = () => {
    setSelectedTodos([])
  }

  const bulkComplete = () => {
    setTodos(todos.map(todo =>
      selectedTodos.includes(todo.id) ? { ...todo, completed: true } : todo
    ))
    setSelectedTodos([])
  }

  const bulkDelete = () => {
    setTodos(todos.filter(todo => !selectedTodos.includes(todo.id)))
    setSelectedTodos([])
  }

  const exportTodos = () => {
    const dataStr = JSON.stringify(todos, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `todos_${username}_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importTodos = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedTodos = JSON.parse(e.target.result)
          setTodos(importedTodos)
        } catch (error) {
          alert('Invalid file format')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleProfileUpdate = (profile) => {
    setUserProfile(profile)
    localStorage.setItem(`profile_${username}`, JSON.stringify(profile))
  }

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filter === 'active') return !todo.completed && matchesSearch
    if (filter === 'completed') return todo.completed && matchesSearch
    return matchesSearch
  })

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length
  const overdueCount = todos.filter(todo => 
    !todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date()
  ).length

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      personal: '#8b5cf6',
      work: '#3b82f6',
      shopping: '#10b981',
      health: '#ef4444',
      education: '#f59e0b',
      other: '#6b7280'
    }
    return colors[category] || colors.other
  }

  const displayName = userProfile?.fullName || userProfile?.username || username

  if (showProfile) {
    return (
      <Profile 
        username={username}
        onUpdateProfile={handleProfileUpdate}
        onBack={() => setShowProfile(false)}
      />
    )
  }

  return (
    <div className={`todo-container ${darkMode ? 'dark' : ''}`}>
      <header className="todo-header">
        <div className="user-info">
          <div className="user-welcome">
            <h1>Welcome, {displayName}!</h1>
            <p>Manage your tasks efficiently</p>
          </div>
          {dailyQuote && (
            <div className="daily-quote">
              <div className="quote-icon">
                <Sparkles size={16} />
              </div>
              <p className="quote-text">"{dailyQuote}"</p>
            </div>
          )}
        </div>
        <div className="header-actions">
          <button 
            onClick={() => setShowProfile(true)} 
            className="profile-button"
            title="Profile Settings"
          >
            <User size={20} />
            Profile
          </button>
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="theme-toggle"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={onLogout} className="logout-button">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      <div className="todo-content">
        {/* Search and Filter Bar */}
        <div className="search-filter-bar">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="todo-stats">
          <div className="stats-item">
            <span className="stats-number">{totalCount}</span>
            <span className="stats-label">Total</span>
          </div>
          <div className="stats-item">
            <span className="stats-number">{completedCount}</span>
            <span className="stats-label">Completed</span>
          </div>
          <div className="stats-item">
            <span className="stats-number">{totalCount - completedCount}</span>
            <span className="stats-label">Pending</span>
          </div>
          <div className="stats-item">
            <span className="stats-number overdue">{overdueCount}</span>
            <span className="stats-label">Overdue</span>
          </div>
          {userProfile?.dailyGoal && (
            <div className="stats-item">
              <span className="stats-number goal">{completedCount}/{userProfile.dailyGoal}</span>
              <span className="stats-label">Daily Goal</span>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedTodos.length > 0 && (
          <div className="bulk-actions">
            <span>{selectedTodos.length} selected</span>
            <button onClick={bulkComplete} className="bulk-btn complete">
              Mark Complete
            </button>
            <button onClick={bulkDelete} className="bulk-btn delete">
              Delete Selected
            </button>
            <button onClick={deselectAll} className="bulk-btn">
              Deselect All
            </button>
          </div>
        )}

        {/* Add Todo Form */}
        {showAddForm ? (
          <form onSubmit={addTodo} className="add-todo-form expanded">
            <div className="form-header">
              <h3>Add New Task</h3>
              <button type="button" onClick={() => setShowAddForm(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="form-row">
              <input
                type="text"
                placeholder="Task title..."
                value={todoForm.text}
                onChange={(e) => setTodoForm({...todoForm, text: e.target.value})}
                className="todo-input"
                required
              />
            </div>
            <div className="form-row">
              <select
                value={todoForm.category}
                onChange={(e) => setTodoForm({...todoForm, category: e.target.value})}
                className="form-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
              <select
                value={todoForm.priority}
                onChange={(e) => setTodoForm({...todoForm, priority: e.target.value})}
                className="form-select"
              >
                {priorities.map(pri => (
                  <option key={pri} value={pri}>{pri.charAt(0).toUpperCase() + pri.slice(1)}</option>
                ))}
              </select>
              <input
                type="date"
                value={todoForm.dueDate}
                onChange={(e) => setTodoForm({...todoForm, dueDate: e.target.value})}
                className="form-input"
              />
            </div>
            <div className="form-row">
              <textarea
                placeholder="Notes (optional)..."
                value={todoForm.notes}
                onChange={(e) => setTodoForm({...todoForm, notes: e.target.value})}
                className="form-textarea"
                rows="3"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="add-button">
                <Plus size={20} />
                Add Task
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="add-todo-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Add a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="todo-input"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newTodo.trim()) {
                    addTodo(e)
                  }
                }}
              />
              <button onClick={() => setShowAddForm(true)} className="add-button">
                <Plus size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Edit Todo Form */}
        {editingTodo && (
          <form onSubmit={updateTodo} className="edit-todo-form">
            <div className="form-header">
              <h3>Edit Task</h3>
              <button type="button" onClick={cancelEdit} className="close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="form-row">
              <input
                type="text"
                placeholder="Task title..."
                value={todoForm.text}
                onChange={(e) => setTodoForm({...todoForm, text: e.target.value})}
                className="todo-input"
                required
              />
            </div>
            <div className="form-row">
              <select
                value={todoForm.category}
                onChange={(e) => setTodoForm({...todoForm, category: e.target.value})}
                className="form-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
              <select
                value={todoForm.priority}
                onChange={(e) => setTodoForm({...todoForm, priority: e.target.value})}
                className="form-select"
              >
                {priorities.map(pri => (
                  <option key={pri} value={pri}>{pri.charAt(0).toUpperCase() + pri.slice(1)}</option>
                ))}
              </select>
              <input
                type="date"
                value={todoForm.dueDate}
                onChange={(e) => setTodoForm({...todoForm, dueDate: e.target.value})}
                className="form-input"
              />
            </div>
            <div className="form-row">
              <textarea
                placeholder="Notes (optional)..."
                value={todoForm.notes}
                onChange={(e) => setTodoForm({...todoForm, notes: e.target.value})}
                className="form-textarea"
                rows="3"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="add-button">
                <Edit3 size={20} />
                Update Task
              </button>
              <button type="button" onClick={cancelEdit} className="cancel-button">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Import/Export Actions */}
        <div className="import-export-actions">
          <button onClick={exportTodos} className="action-btn">
            <Download size={16} />
            Export
          </button>
          <label className="action-btn">
            <Upload size={16} />
            Import
            <input
              type="file"
              accept=".json"
              onChange={importTodos}
              style={{ display: 'none' }}
            />
          </label>
          {filteredTodos.length > 0 && (
            <button onClick={selectAll} className="action-btn">
              Select All
            </button>
          )}
        </div>

        {/* Todo List */}
        <div className="todo-list">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <p>{searchTerm ? 'No tasks match your search.' : filter === 'all' ? 'No tasks yet. Add one above!' : `No ${filter} tasks.`}</p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''} ${selectedTodos.includes(todo.id) ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={selectedTodos.includes(todo.id)}
                  onChange={() => toggleSelectTodo(todo.id)}
                  className="select-checkbox"
                />
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="todo-toggle"
                >
                  {todo.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                </button>
                
                <div className="todo-content">
                  <div className="todo-main">
                    <span className="todo-text">{todo.text}</span>
                    <div className="todo-meta">
                      <span 
                        className="category-badge"
                        style={{ backgroundColor: getCategoryColor(todo.category) }}
                      >
                        {todo.category}
                      </span>
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(todo.priority) }}
                      >
                        <Star size={12} />
                        {todo.priority}
                      </span>
                      {todo.dueDate && (
                        <span className={`due-date ${new Date(todo.dueDate) < new Date() && !todo.completed ? 'overdue' : ''}`}>
                          <Calendar size={12} />
                          {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {todo.notes && (
                      <p className="todo-notes">{todo.notes}</p>
                    )}
                  </div>
                </div>
                
                <div className="todo-actions">
                  <button
                    onClick={() => startEdit(todo)}
                    className="edit-button"
                    title="Edit task"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-button"
                    title="Delete task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default TodoList 