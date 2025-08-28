import React, { useState } from 'react';
import { Users, Settings, Shield, FileText, Database, Activity, Bell, Lock, Plus, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { userApi } from '@/lib/api';
import { useTranslation } from 'react-i18next';

export function SystemManagement() {
  const [activeTab, setActiveTab] = useState('users');
  const { toast } = useToast();
  const { t } = useTranslation();

  // Add user dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    department: '',
    role: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([
    { value: 'admin', label: 'System Administrator' },
    { value: 'analyst', label: 'Security Analyst' },
    { value: 'operator', label: 'Operations Engineer' },
  ]);

  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle role selection
  const handleRoleChange = (value: string) => {
    setUserForm(prev => ({ ...prev, role: value }));
  };

  // Handle user creation
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    // Form validation
    if (!userForm.username || !userForm.password || !userForm.name || !userForm.email || !userForm.role) {
      setFormError('Please fill in all required fields');
      setFormLoading(false);
      return;
    }

    if (userForm.password !== userForm.confirmPassword) {
      setFormError('Passwords do not match');
      setFormLoading(false);
      return;
    }

    try {
      await userApi.createUser({
        username: userForm.username,
        password: userForm.password,
        name: userForm.name,
        email: userForm.email,
        department: userForm.department || undefined,
        role: userForm.role
      });

      toast({
        title: "Success",
        description: "User created successfully",
      });

      // Reset form and close dialog
      setUserForm({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: '',
        department: '',
        role: '',
      });
      setCreateDialogOpen(false);
    } catch (err: any) {
      console.error("Failed to create user:", err);
      setFormError(err?.message || 'Failed to create user, please try again');
    } finally {
      setFormLoading(false);
    }
  };

  const tabs = [
    { id: 'users', name: t('system_management.user_management'), icon: Users },
    { id: 'settings', name: t('system_management.system_settings'), icon: Settings },
    { id: 'security', name: t('system_management.security_config'), icon: Shield },
    { id: 'logs', name: t('system_management.audit_logs'), icon: FileText }
  ];

  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'System Administrator',
      status: 'active',
      lastLogin: '2024-01-15 14:30:25',
      permissions: ['Full Access']
    },
    {
      id: 2,  
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'Security Analyst',
      status: 'active',
      lastLogin: '2024-01-15 11:20:15',
      permissions: ['View Monitoring', 'Alerts Management', 'Generate Reports']
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert.j@company.com',
      role: 'Operations Engineer',
      status: 'inactive',
      lastLogin: '2024-01-12 16:45:30',
      permissions: ['View Monitoring', 'System Configuration']
    }
  ];

  const auditLogs = [
    {
      id: 1,
      user: 'John Doe',
      action: 'Modified user permissions',
      target: 'Jane Smith account',
      timestamp: '2024-01-15 14:35:21',
      ip: '192.168.1.100',
      result: 'success'
    },
    {
      id: 2,
      user: 'Jane Smith',
      action: 'Viewed anomaly detection report',
      target: '2024-01-15 Report',
      timestamp: '2024-01-15 11:25:43',
      ip: '192.168.1.101',
      result: 'success'
    },
    {
      id: 3,
      user: 'System',
      action: 'Automatic model update',
      target: 'LightGBM v2.1.3',
      timestamp: '2024-01-15 02:00:00',
      ip: 'localhost',
      result: 'success'
    }
  ];

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">{t('system_management.user_permission_management')}</h3>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setCreateDialogOpen(true)}>
          <Users className="w-4 h-4 mr-2" />
          {t('system_management.add_user')}
        </Button>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="glass-effect p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{user.name[0]}</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">{user.name}</h4>
                  <p className="text-sm text-slate-400">{user.email}</p>
                  <p className="text-xs text-slate-500">{t('system_management.last_login')}: {user.lastLogin}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-white">{user.role}</p>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      user.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <span className="text-xs text-slate-400">
                      {user.status === 'active' ? t('system_management.active') : t('system_management.inactive')}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    {t('system_management.edit')}
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    {t('system_management.permissions')}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-600/50">
              <p className="text-xs text-slate-400 mb-1">{t('system_management.permission_scope')}:</p>
              <div className="flex flex-wrap gap-2">
                {user.permissions.map((permission, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-md">
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">System Configuration</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-effect p-4 rounded-lg">
          <h4 className="text-white font-medium mb-4">{t('system_management.monitoring_settings')}</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">{t('system_management.realtime_monitoring')}</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">{t('system_management.auto_alerts')}</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">{t('system_management.data_backup')}</span>
              <Switch defaultChecked />
            </div>
            <div>
              <label className="text-sm text-slate-300 block mb-2">{t('system_management.data_retention_days')}</label>
              <Input defaultValue="90" className="bg-slate-800/50 border-slate-600" />
            </div>
          </div>
        </div>

        <div className="glass-effect p-4 rounded-lg">
          <h4 className="text-white font-medium mb-4">Alerts Configuration</h4>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 block mb-2">Anomaly Threshold (%)</label>
              <Input defaultValue="5" className="bg-slate-800/50 border-slate-600" />
            </div>
            <div>
              <label className="text-sm text-slate-300 block mb-2">Alert Interval (minutes)</label>
              <Input defaultValue="15" className="bg-slate-800/50 border-slate-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Email Notifications</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">SMS Notifications</span>
              <Switch />
            </div>
          </div>
        </div>

        <div className="glass-effect p-4 rounded-lg">
          <h4 className="text-white font-medium mb-4">Model Configuration</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Automatic Model Updates</span>
              <Switch defaultChecked />
            </div>
            <div>
              <label className="text-sm text-slate-300 block mb-2">Update Frequency (hours)</label>
              <Input defaultValue="24" className="bg-slate-800/50 border-slate-600" />
            </div>
            <div>
              <label className="text-sm text-slate-300 block mb-2">Training Sample Threshold</label>
              <Input defaultValue="100000" className="bg-slate-800/50 border-slate-600" />
            </div>
          </div>
        </div>

        <div className="glass-effect p-4 rounded-lg">
          <h4 className="text-white font-medium mb-4">Performance Optimization</h4>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 block mb-2">Concurrent Processes</label>
              <Input defaultValue="1000" className="bg-slate-800/50 border-slate-600" />
            </div>
            <div>
              <label className="text-sm text-slate-300 block mb-2">Cache Size (MB)</label>
              <Input defaultValue="512" className="bg-slate-800/50 border-slate-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Compressed Transfers</span>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityConfig = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Security Configuration</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-effect p-4 rounded-lg">
          <h4 className="text-white font-medium mb-4">Access Control</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">IP Whitelist</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Two-Factor Authentication</span>
              <Switch defaultChecked />
            </div>
            <div>
              <label className="text-sm text-slate-300 block mb-2">Session Timeout (minutes)</label>
              <Input defaultValue="30" className="bg-slate-800/50 border-slate-600" />
            </div>
            <div>
              <label className="text-sm text-slate-300 block mb-2">Password Complexity</label>
              <select className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="glass-effect p-4 rounded-lg">
          <h4 className="text-white font-medium mb-4">Data Encryption</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Transport Encryption</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Storage Encryption</span>
              <Switch defaultChecked />
            </div>
            <div>
              <label className="text-sm text-slate-300 block mb-2">Encryption Algorithm</label>
              <select className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm">
                <option>AES-256</option>
                <option>AES-128</option>
                <option>RSA-2048</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAuditLogs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Audit Logs</h3>
        <div className="flex space-x-2">
          <Input placeholder="Search logs..." className="bg-slate-800/50 border-slate-600" />
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="space-y-3">
        {auditLogs.map((log) => (
          <div key={log.id} className="glass-effect p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${
                    log.result === 'success' ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                  <span className="text-white font-medium">{log.user}</span>
                  <span className="text-slate-300">{log.action}</span>
                  <span className="text-blue-300">{log.target}</span>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
                  <span>Time: {log.timestamp}</span>
                  <span>IP: {log.ip}</span>
                  <span>Result: {log.result === 'success' ? 'Success' : 'Failure'}</span>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-xs">
                Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'users': return renderUserManagement();
      case 'settings': return renderSystemSettings();
      case 'security': return renderSecurityConfig();
      case 'logs': return renderAuditLogs();
      default: return renderUserManagement();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{t('system_management.title')}</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-300">{t('system_management.system_running')}</span>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex space-x-1 bg-slate-800/30 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="animate-slide-in">
        {renderContent()}
      </div>

      {/* Add user dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Create New User</DialogTitle>
            <DialogDescription className="text-slate-400">
              Fill in user information to create a new account
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-md bg-red-500/20 border border-red-500/50 flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <p className="text-sm text-red-400">{formError}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">Username *</Label>
                <Input
                  id="username"
                  name="username"
                  value={userForm.username}
                  onChange={handleFormChange}
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={userForm.name}
                  onChange={handleFormChange}
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={userForm.password}
                  onChange={handleFormChange}
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={userForm.confirmPassword}
                  onChange={handleFormChange}
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userForm.email}
                  onChange={handleFormChange}
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-slate-300">Department</Label>
                <Input
                  id="department"
                  name="department"
                  value={userForm.department}
                  onChange={handleFormChange}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="role" className="text-slate-300">Role *</Label>
                <Select value={userForm.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-full bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {roles.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                className="text-slate-300 border-slate-600"
                disabled={formLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={formLoading}
              >
                {formLoading ? 'Creating...' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}