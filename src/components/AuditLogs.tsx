import React, { useState } from 'react';
import { FileText, Search, Filter, Download, Eye, AlertTriangle, CheckCircle, XCircle, Clock, User, Activity, Shield, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedResult, setSelectedResult] = useState('all');

  const auditLogs = [
    {
      id: 1,
      user: 'Zhang San',
      action: 'Modified user permissions',
      target: 'Li Si account',
      timestamp: '2024-01-15 14:35:21',
      ip: '192.168.1.100',
      result: 'success',
      type: 'user_management',
      details: 'Changed user Li Si\'s permissions from "Security Analyst" to "Senior Analyst"',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 2,
      user: 'Li Si',
      action: 'Viewed anomaly detection report',
      target: '2024-01-15 Report',
      timestamp: '2024-01-15 11:25:43',
      ip: '192.168.1.101',
      result: 'success',
      type: 'data_access',
      details: 'Downloaded and viewed anomaly detection report for January 15, 2024',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    {
      id: 3,
      user: 'System',
      action: 'Automatic model update',
      target: 'LightGBM v2.1.3',
      timestamp: '2024-01-15 02:00:00',
      ip: 'localhost',
      result: 'success',
      type: 'system',
      details: 'Automatically updated LightGBM model to v2.1.3, training dataset contained 100,000 records',
      userAgent: 'System/1.0'
    },
    {
      id: 4,
      user: 'Wang Wu',
      action: 'System login',
      target: 'Traffic monitoring system',
      timestamp: '2024-01-15 08:30:15',
      ip: '192.168.1.102',
      result: 'failed',
      type: 'authentication',
      details: 'User login attempt failed, reason: incorrect password',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 5,
      user: 'Zhao Liu',
      action: 'Configured alert rule',
      target: 'High-risk IP detection rule',
      timestamp: '2024-01-14 16:45:30',
      ip: '192.168.1.103',
      result: 'success',
      type: 'configuration',
      details: 'Created new alert rule: trigger alert when same IP makes over 1000 requests within 5 minutes',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
    },
    {
      id: 6,
      user: 'Sun Qi',
      action: 'Exported data',
      target: 'User behavior data',
      timestamp: '2024-01-14 10:20:45',
      ip: '192.168.1.104',
      result: 'failed',
      type: 'data_export',
      details: 'Attempt to export user behavior data failed, reason: insufficient permissions',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 7,
      user: 'System',
      action: 'Data backup',
      target: 'Database backup',
      timestamp: '2024-01-14 03:00:00',
      ip: 'localhost',
      result: 'success',
      type: 'system',
      details: 'Performed daily data backup, backup size: 2.5GB',
      userAgent: 'System/1.0'
    },
    {
      id: 8,
      user: 'Zhang San',
      action: 'Deleted user',
      target: 'Temporary account temp001',
      timestamp: '2024-01-13 15:30:20',
      ip: '192.168.1.100',
      result: 'success',
      type: 'user_management',
      details: 'Deleted temporary test account temp001',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  ];

  const logTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'user_management', label: 'User Management' },
    { value: 'data_access', label: 'Data Access' },
    { value: 'system', label: 'System Operations' },
    { value: 'authentication', label: 'Authentication' },
    { value: 'configuration', label: 'Configuration Changes' },
    { value: 'data_export', label: 'Data Export' }
  ];

  const resultOptions = [
    { value: 'all', label: 'All Results' },
    { value: 'success', label: 'Success' },
    { value: 'failed', label: 'Failed' }
  ];

  const getResultIcon = (result: string) => {
    return result === 'success' ? 
      <CheckCircle className="w-4 h-4 text-green-400" /> : 
      <XCircle className="w-4 h-4 text-red-400" />;
  };

  const getResultColor = (result: string) => {
    return result === 'success' ? 
      'bg-green-500/20 text-green-300' : 
      'bg-red-500/20 text-red-300';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user_management': return <User className="w-4 h-4 text-blue-400" />;
      case 'data_access': return <Eye className="w-4 h-4 text-purple-400" />;
      case 'system': return <Activity className="w-4 h-4 text-orange-400" />;
      case 'authentication': return <Shield className="w-4 h-4 text-green-400" />;
      case 'configuration': return <Settings className="w-4 h-4 text-yellow-400" />;
      case 'data_export': return <Download className="w-4 h-4 text-cyan-400" />;
      default: return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'user_management': return 'bg-blue-500/20 text-blue-300';
      case 'data_access': return 'bg-purple-500/20 text-purple-300';
      case 'system': return 'bg-orange-500/20 text-orange-300';
      case 'authentication': return 'bg-green-500/20 text-green-300';
      case 'configuration': return 'bg-yellow-500/20 text-yellow-300';
      case 'data_export': return 'bg-cyan-500/20 text-cyan-300';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ip.includes(searchTerm);
    const matchesType = selectedType === 'all' || log.type === selectedType;
    const matchesResult = selectedResult === 'all' || log.result === selectedResult;
    return matchesSearch && matchesType && matchesResult;
  });

  const todayLogs = auditLogs.filter(log => log.timestamp.startsWith('2024-01-15')).length;
  const successRate = (auditLogs.filter(log => log.result === 'success').length / auditLogs.length * 100).toFixed(1);
  const systemActions = auditLogs.filter(log => log.user === 'System').length;

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Audit Logs</h2>
          <p className="text-slate-400 mt-1">System operation records and security audit trails</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="outline">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Risk Analysis
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-effect border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Today's Operations</p>
                <p className="text-2xl font-bold text-white">{todayLogs}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-green-400">{successRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">System Actions</p>
                <p className="text-2xl font-bold text-orange-400">{systemActions}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Records</p>
                <p className="text-2xl font-bold text-white">{auditLogs.length}</p>
              </div>
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <Card className="glass-effect border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search users, actions, targets, or IP addresses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-800/50 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm min-w-[120px]"
              >
                {logTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <select
                value={selectedResult}
                onChange={(e) => setSelectedResult(e.target.value)}
                className="bg-slate-800/50 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm min-w-[100px]"
              >
                {resultOptions.map(result => (
                  <option key={result.value} value={result.value}>{result.label}</option>
                ))}
              </select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Time Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs list */}
      <Card className="glass-effect border-slate-700">
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredLogs.map((log, index) => (
              <div key={log.id} className={`p-4 ${index !== filteredLogs.length - 1 ? 'border-b border-slate-700/50' : ''} hover:bg-slate-800/30 transition-colors`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getResultIcon(log.result)}
                      {getTypeIcon(log.type)}
                      <span className="text-white font-medium">{log.user}</span>
                      <span className="text-slate-300">{log.action}</span>
                      <Badge className={getTypeColor(log.type)}>
                        {logTypes.find(t => t.value === log.type)?.label || log.type}
                      </Badge>
                      <Badge className={getResultColor(log.result)}>
                        {log.result === 'success' ? 'Success' : 'Failed'}
                      </Badge>
                    </div>
                    
                    <div className="ml-6 space-y-1">
                      <p className="text-blue-300">Target: {log.target}</p>
                      <p className="text-slate-400 text-sm">{log.details}</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span>Time: {log.timestamp}</span>
                        <span>IP: {log.ip}</span>
                        <span>Device: {log.userAgent.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="ghost" className="text-xs ml-4">
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredLogs.length === 0 && (
        <Card className="glass-effect border-slate-700">
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No matching audit logs found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}