import { useState, useEffect } from 'react'
import { User, Lock, Eye, EyeOff, Mail, Chrome, Linkedin, Code, ArrowRight, Sparkles } from 'lucide-react'

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [quote, setQuote] = useState('')

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
    "Dream big and dare to fail. - Norman Vaughan"
  ]

  useEffect(() => {
    // Set a random quote on component mount
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    setQuote(randomQuote)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simple validation
    if (!formData.username.trim()) {
      setError('Username is required')
      setIsLoading(false)
      return
    }
    if (!formData.password.trim()) {
      setError('Password is required')
      setIsLoading(false)
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    // Simulate loading
    setTimeout(() => {
      // For demo purposes, accept any valid credentials
      onLogin({
        username: formData.username.trim(),
        password: formData.password
      })
      setIsLoading(false)
    }, 1000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  const handleSocialLogin = (platform) => {
    setIsLoading(true)
    setError('')
    
    // Simulate social login
    setTimeout(() => {
      const mockUsername = `${platform}_user_${Math.floor(Math.random() * 1000)}`
      onLogin({
        username: mockUsername,
        password: 'social_auth',
        platform: platform
      })
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-section">
            <div className="app-logo">
              <Sparkles size={32} />
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue</p>
          </div>
          
          {quote && (
            <div className="quote-section">
              <div className="quote-icon">
                <Sparkles size={16} />
              </div>
              <p className="quote-text">"{quote}"</p>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <div className="input-icon">
              <User size={20} />
            </div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="login-input"
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <div className="input-icon">
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="login-input"
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                Sign In
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <div className="social-login">
          <button
            onClick={() => handleSocialLogin('google')}
            className="social-button google"
            disabled={isLoading}
          >
            <Chrome size={20} />
            Continue with Google
          </button>
          
          <button
            onClick={() => handleSocialLogin('linkedin')}
            className="social-button linkedin"
            disabled={isLoading}
          >
            <Linkedin size={20} />
            Continue with LinkedIn
          </button>
          
          <button
            onClick={() => handleSocialLogin('leetcode')}
            className="social-button leetcode"
            disabled={isLoading}
          >
            <Code size={20} />
            Continue with LeetCode
          </button>
        </div>

        <div className="login-footer">
          <p>Demo Credentials: Any username with password 6+ characters</p>
          <p className="social-note">Social login simulates authentication for demo purposes</p>
        </div>
      </div>
    </div>
  )
}

export default Login 