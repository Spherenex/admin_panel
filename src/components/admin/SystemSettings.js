// SystemSettings.jsx
import React, { useState } from 'react';
import { 
  Settings, Bell, Shield, Database, Mail, Smartphone, Globe, 
  Save, RefreshCw, Download, Upload, Eye, EyeOff, Key, Users,
  Server, Clock, AlertTriangle, CheckCircle, Info, Lock
} from 'lucide-react';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showPasswords, setShowPasswords] = useState({});
  const [settings, setSettings] = useState({
    general: {
      siteName: "VetMed Admin Portal",
      siteDescription: "Veterinary Medicine Management System",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      currency: "USD",
      language: "en",
      maintenanceMode: false,
      autoBackup: true,
      sessionTimeout: 30
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      lowStockAlerts: true,
      orderUpdates: true,
      supplierUpdates: true,
      systemAlerts: true,
      weeklyReports: true,
      monthlyReports: true
    },
    security: {
      twoFactorAuth: true,
      passwordComplexity: true,
      sessionSecurity: true,
      ipWhitelist: false,
      bruteForceProtection: true,
      encryptionLevel: "AES-256",
      auditLogging: true,
      dataRetention: 365
    },
    email: {
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      smtpUser: "admin@vetmed.com",
      smtpPassword: "••••••••••••",
      fromEmail: "noreply@vetmed.com",
      fromName: "VetMed System",
      encryption: "TLS",
      testEmail: ""
    },
    database: {
      host: "localhost",
      port: 5432,
      database: "vetmed_db",
      username: "vetmed_user",
      password: "••••••••••••",
      maxConnections: 100,
      connectionTimeout: 30,
      backupFrequency: "daily",
      backupRetention: 30
    },
    api: {
      baseUrl: "https://api.vetmed.com",
      version: "v1",
      rateLimit: 1000,
      timeout: 30,
      authentication: "JWT",
      cors: true,
      debugging: false
    }
  });

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically send the settings to your backend API
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const handleTestEmail = () => {
    if (!settings.email.testEmail) {
      alert('Please enter a test email address');
      return;
    }
    alert(`Test email sent to ${settings.email.testEmail}`);
  };

  const handleBackupNow = () => {
    alert('Database backup initiated. You will be notified when complete.');
  };

  const handleSystemRestart = () => {
    if (window.confirm('Are you sure you want to restart the system? This will temporarily interrupt service.')) {
      alert('System restart initiated. The system will be back online in a few minutes.');
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'api', label: 'API', icon: Globe }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure and manage system parameters</p>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Status</p>
              <p className="text-lg font-bold text-green-600">Online</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Backup</p>
              <p className="text-lg font-bold text-gray-900">2 hours ago</p>
            </div>
            <Database className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-lg font-bold text-gray-900">127</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Server Load</p>
              <p className="text-lg font-bold text-yellow-600">65%</p>
            </div>
            <Server className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">General Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                    <select
                      value={settings.general.dateFormat}
                      onChange={(e) => updateSetting('general', 'dateFormat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={settings.general.currency}
                      onChange={(e) => updateSetting('general', 'currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD (C$)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.general.sessionTimeout}
                      onChange={(e) => updateSetting('general', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">System Options</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.general.maintenanceMode}
                      onChange={(e) => updateSetting('general', 'maintenanceMode', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Maintenance Mode</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.general.autoBackup}
                      onChange={(e) => updateSetting('general', 'autoBackup', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Auto Backup</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Delivery Methods</h4>
                      {['emailNotifications', 'smsNotifications', 'pushNotifications'].map(key => (
                        <label key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications[key]}
                            onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Alert Types</h4>
                      {['lowStockAlerts', 'orderUpdates', 'supplierUpdates', 'systemAlerts'].map(key => (
                        <label key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications[key]}
                            onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Reports</h4>
                <div className="space-y-3">
                  {['weeklyReports', 'monthlyReports'].map(key => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications[key]}
                        onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Authentication</h4>
                    {['twoFactorAuth', 'passwordComplexity', 'sessionSecurity', 'bruteForceProtection'].map(key => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security[key]}
                          onChange={(e) => updateSetting('security', key, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Encryption Level</label>
                      <select
                        value={settings.security.encryptionLevel}
                        onChange={(e) => updateSetting('security', 'encryptionLevel', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="AES-128">AES-128</option>
                        <option value="AES-256">AES-256</option>
                        <option value="RSA-2048">RSA-2048</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention (days)</label>
                      <input
                        type="number"
                        value={settings.security.dataRetention}
                        onChange={(e) => updateSetting('security', 'dataRetention', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Security Notice</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Changes to security settings require system administrator approval and may require a system restart.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">SMTP Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                    <input
                      type="text"
                      value={settings.email.smtpHost}
                      onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                    <input
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
                    <input
                      type="text"
                      value={settings.email.smtpUser}
                      onChange={(e) => updateSetting('email', 'smtpUser', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.smtp ? "text" : "password"}
                        value={settings.email.smtpPassword}
                        onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('smtp')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPasswords.smtp ? 
                          <EyeOff className="w-4 h-4 text-gray-400" /> : 
                          <Eye className="w-4 h-4 text-gray-400" />
                        }
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                    <input
                      type="email"
                      value={settings.email.fromEmail}
                      onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                    <input
                      type="text"
                      value={settings.email.fromName}
                      onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Test Email</h4>
                <div className="flex gap-4">
                  <input
                    type="email"
                    placeholder="Enter test email address"
                    value={settings.email.testEmail}
                    onChange={(e) => updateSetting('email', 'testEmail', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleTestEmail}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Test
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Database Settings */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Database Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Host</label>
                    <input
                      type="text"
                      value={settings.database.host}
                      onChange={(e) => updateSetting('database', 'host', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
                    <input
                      type="number"
                      value={settings.database.port}
                      onChange={(e) => updateSetting('database', 'port', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Database Name</label>
                    <input
                      type="text"
                      value={settings.database.database}
                      onChange={(e) => updateSetting('database', 'database', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={settings.database.username}
                      onChange={(e) => updateSetting('database', 'username', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.database ? "text" : "password"}
                        value={settings.database.password}
                        onChange={(e) => updateSetting('database', 'password', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('database')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPasswords.database ? 
                          <EyeOff className="w-4 h-4 text-gray-400" /> : 
                          <Eye className="w-4 h-4 text-gray-400" />
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Backup Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                    <select
                      value={settings.database.backupFrequency}
                      onChange={(e) => updateSetting('database', 'backupFrequency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period (days)</label>
                    <input
                      type="number"
                      value={settings.database.backupRetention}
                      onChange={(e) => updateSetting('database', 'backupRetention', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleBackupNow}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Backup Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* API Settings */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">API Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Base URL</label>
                    <input
                      type="url"
                      value={settings.api.baseUrl}
                      onChange={(e) => updateSetting('api', 'baseUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Version</label>
                    <input
                      type="text"
                      value={settings.api.version}
                      onChange={(e) => updateSetting('api', 'version', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rate Limit (requests/hour)</label>
                    <input
                      type="number"
                      value={settings.api.rateLimit}
                      onChange={(e) => updateSetting('api', 'rateLimit', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timeout (seconds)</label>
                    <input
                      type="number"
                      value={settings.api.timeout}
                      onChange={(e) => updateSetting('api', 'timeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">API Options</h4>
                <div className="space-y-3">
                  {['cors', 'debugging'].map(key => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.api[key]}
                        onChange={(e) => updateSetting('api', key, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {key === 'cors' ? 'Enable CORS' : 'Debug Mode'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between">
            <div className="flex space-x-3">
              <button
                onClick={handleSaveSettings}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </button>
              <button
                onClick={handleSystemRestart}
                className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Restart System
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Last saved: 2 minutes ago
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;