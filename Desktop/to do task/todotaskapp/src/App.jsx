import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './components/Login'
import TodoList from './components/TodoList'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('todoUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUsername(userData.username)
      setIsAuthenticated(true)
      
      // Load user profile
      const savedProfile = localStorage.getItem(`profile_${userData.username}`)
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile))
      }
    }
  }, [])

  const handleLogin = (userData) => {
    setUsername(userData.username)
    setIsAuthenticated(true)
    localStorage.setItem('todoUser', JSON.stringify(userData))
    
    // Load user profile after login
    const savedProfile = localStorage.getItem(`profile_${userData.username}`)
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUsername('')
    setUserProfile(null)
    localStorage.removeItem('todoUser')
  }

  const handleProfileUpdate = (profile) => {
    setUserProfile(profile)
    // Update username if it was changed in profile
    if (profile.username && profile.username !== username) {
      setUsername(profile.username)
      // Update localStorage
      const savedUser = localStorage.getItem('todoUser')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        userData.username = profile.username
        localStorage.setItem('todoUser', JSON.stringify(userData))
      }
    }
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/" replace /> : 
              <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
              <TodoList 
                username={username} 
                onLogout={handleLogout}
                userProfile={userProfile}
                onProfileUpdate={handleProfileUpdate}
              /> : 
              <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
