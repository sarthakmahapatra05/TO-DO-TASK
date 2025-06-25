import { useState, useEffect } from 'react'
import { User, Linkedin, Code, BookOpen, Github, Globe, Save, Edit3, X, Check } from 'lucide-react'

const Profile = ({ username, onUpdateProfile, onBack }) => {
  const [profile, setProfile] = useState({
    username: username || '',
    fullName: '',
    email: '',
    bio: '',
    linkedin: '',
    leetcode: '',
    geeksforgeeks: '',
    github: '',
    website: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dailyGoal: 5,
    preferredCategories: ['personal', 'work'],
    notifications: {
      email: true,
      browser: true,
      dailyReminder: true
    }
  })

  const [isEditing, setIsEditing] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')

  const categories = ['personal', 'work', 'shopping', 'health', 'education', 'other']

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem(`profile_${username}`)
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }, [username])

  const handleSave = () => {
    localStorage.setItem(`profile_${username}`, JSON.stringify(profile))
    onUpdateProfile(profile)
    setIsEditing(false)
    setSavedMessage('Profile saved successfully!')
    setTimeout(() => setSavedMessage(''), 3000)
  }

  const handleCancel = () => {
    // Reload original profile
    const savedProfile = localStorage.getItem(`profile_${username}`)
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
    setIsEditing(false)
  }

  const updateProfile = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateNotifications = (field, value) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }))
  }

  const toggleCategory = (category) => {
    setProfile(prev => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(category)
        ? prev.preferredCategories.filter(c => c !== category)
        : [...prev.preferredCategories, category]
    }))
  }

  const validateUrl = (url, platform) => {
    if (!url) return true
    const patterns = {
      linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/,
      leetcode: /^https?:\/\/(www\.)?leetcode\.com\/[\w-]+\/?$/,
      geeksforgeeks: /^https?:\/\/(www\.)?geeksforgeeks\.org\/[\w-]+\/?$/,
      github: /^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/,
      website: /^https?:\/\//i
    }
    return patterns[platform] ? patterns[platform].test(url) : true
  }

  const getUrlError = (url, platform) => {
    if (!url) return ''
    if (!validateUrl(url, platform)) {
      return `Please enter a valid ${platform} URL`
    }
    return ''
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button onClick={onBack} className="back-button">
          ← Back to Tasks
        </button>
        <h1>Profile Settings</h1>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="edit-button">
            <Edit3 size={20} />
            Edit Profile
          </button>
        ) : (
          <div className="edit-actions">
            <button onClick={handleCancel} className="cancel-button">
              <X size={20} />
              Cancel
            </button>
            <button onClick={handleSave} className="save-button">
              <Save size={20} />
              Save
            </button>
          </div>
        )}
      </div>

      {savedMessage && (
        <div className="success-message">
          <Check size={20} />
          {savedMessage}
        </div>
      )}

      <div className="profile-content">
        {/* Basic Information */}
        <div className="profile-section">
          <h2>Basic Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => updateProfile('username', e.target.value)}
                disabled={!isEditing}
                className="form-input"
                placeholder="Enter username"
              />
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => updateProfile('fullName', e.target.value)}
                disabled={!isEditing}
                className="form-input"
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => updateProfile('email', e.target.value)}
                disabled={!isEditing}
                className="form-input"
                placeholder="Enter email address"
              />
            </div>
            <div className="form-group full-width">
              <label>Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => updateProfile('bio', e.target.value)}
                disabled={!isEditing}
                className="form-textarea"
                placeholder="Tell us about yourself..."
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="profile-section">
          <h2>Social Media & Professional Links</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>
                <Linkedin size={16} />
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={profile.linkedin}
                onChange={(e) => updateProfile('linkedin', e.target.value)}
                disabled={!isEditing}
                className="form-input"
                placeholder="https://linkedin.com/in/username"
              />
              {isEditing && getUrlError(profile.linkedin, 'linkedin') && (
                <span className="error-text">{getUrlError(profile.linkedin, 'linkedin')}</span>
              )}
            </div>
            <div className="form-group">
              <label>
                <Code size={16} />
                LeetCode Profile
              </label>
              <input
                type="url"
                value={profile.leetcode}
                onChange={(e) => updateProfile('leetcode', e.target.value)}
                disabled={!isEditing}
                className="form-input"
                placeholder="https://leetcode.com/username"
              />
              {isEditing && getUrlError(profile.leetcode, 'leetcode') && (
                <span className="error-text">{getUrlError(profile.leetcode, 'leetcode')}</span>
              )}
            </div>
            <div className="form-group">
              <label>
                <BookOpen size={16} />
                GeeksforGeeks Profile
              </label>
              <input
                type="url"
                value={profile.geeksforgeeks}
                onChange={(e) => updateProfile('geeksforgeeks', e.target.value)}
                disabled={!isEditing}
                className="form-input"
                placeholder="https://geeksforgeeks.org/username"
              />
              {isEditing && getUrlError(profile.geeksforgeeks, 'geeksforgeeks') && (
                <span className="error-text">{getUrlError(profile.geeksforgeeks, 'geeksforgeeks')}</span>
              )}
            </div>
            <div className="form-group">
              <label>
                <Github size={16} />
                GitHub Profile
              </label>
              <input
                type="url"
                value={profile.github}
                onChange={(e) => updateProfile('github', e.target.value)}
                disabled={!isEditing}
                className="form-input"
                placeholder="https://github.com/username"
              />
              {isEditing && getUrlError(profile.github, 'github') && (
                <span className="error-text">{getUrlError(profile.github, 'github')}</span>
              )}
            </div>
            <div className="form-group">
              <label>
                <Globe size={16} />
                Personal Website
              </label>
              <input
                type="url"
                value={profile.website}
                onChange={(e) => updateProfile('website', e.target.value)}
                disabled={!isEditing}
                className="form-input"
                placeholder="https://yourwebsite.com"
              />
              {isEditing && getUrlError(profile.website, 'website') && (
                <span className="error-text">{getUrlError(profile.website, 'website')}</span>
              )}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="profile-section">
          <h2>Preferences</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Daily Goal (tasks)</label>
              <input
                type="number"
                min="1"
                max="50"
                value={profile.dailyGoal}
                onChange={(e) => updateProfile('dailyGoal', parseInt(e.target.value))}
                disabled={!isEditing}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Timezone</label>
              <select
                value={profile.timezone}
                onChange={(e) => updateProfile('timezone', e.target.value)}
                disabled={!isEditing}
                className="form-select"
              >
                {Intl.supportedValuesOf('timeZone').map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
            <div className="form-group full-width">
              <label>Preferred Categories</label>
              <div className="category-checkboxes">
                {categories.map(category => (
                  <label key={category} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={profile.preferredCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      disabled={!isEditing}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="profile-section">
          <h2>Notifications</h2>
          <div className="notification-settings">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={profile.notifications.email}
                onChange={(e) => updateNotifications('email', e.target.checked)}
                disabled={!isEditing}
                className="checkbox-input"
              />
              <span className="checkbox-text">Email notifications</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={profile.notifications.browser}
                onChange={(e) => updateNotifications('browser', e.target.checked)}
                disabled={!isEditing}
                className="checkbox-input"
              />
              <span className="checkbox-text">Browser notifications</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={profile.notifications.dailyReminder}
                onChange={(e) => updateNotifications('dailyReminder', e.target.checked)}
                disabled={!isEditing}
                className="checkbox-input"
              />
              <span className="checkbox-text">Daily reminder</span>
            </label>
          </div>
        </div>

        {/* Quick Actions */}
        {!isEditing && (
          <div className="profile-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <button className="action-button linkedin">
                <Linkedin size={20} />
                View LinkedIn
              </button>
              <button className="action-button leetcode">
                <Code size={20} />
                View LeetCode
              </button>
              <button className="action-button geeksforgeeks">
                <BookOpen size={20} />
                View GeeksforGeeks
              </button>
              <button className="action-button github">
                <Github size={20} />
                View GitHub
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile 