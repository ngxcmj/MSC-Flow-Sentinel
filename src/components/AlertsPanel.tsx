import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Clock, Filter, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from 'react-i18next';

export function AlertsPanel() {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState([]);
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Generate mock alerts
    const generateAlerts = () => {
      const alertTypes = ['SQL Injection', 'XSS Attack', 'DDoS', 'Brute Force', 'Suspicious Access'];
      const severities = ['critical', 'high', 'medium', 'low'];
      const statuses = ['active', 'resolved', 'investigating'];

      return Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        description: `Abnormal traffic pattern detected, suspected attack`,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toLocaleString('en-US'),
        count: Math.floor(Math.random() * 100) + 1
      }));
    };

    setAlerts(generateAlerts());
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'investigating': return <Clock className="w-4 h-4 text-yellow-400" />;
      default: return <XCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filterLevel === 'all' || alert.severity === filterLevel;
    const matchesSearch = alert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.source.includes(searchTerm) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{t('alerts.management_center')}</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-300">{alerts.filter(a => a.status === 'active').length} Active Alerts</span>
        </div>
      </div>

      {/* Metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card border-red-500/20 bg-red-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Critical</p>
              <p className="text-2xl font-bold text-red-400">{alerts.filter(a => a.severity === 'critical').length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="metric-card border-orange-500/20 bg-orange-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">High</p>
              <p className="text-2xl font-bold text-orange-400">{alerts.filter(a => a.severity === 'high').length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-400" />
          </div>
        </div>

        <div className="metric-card border-green-500/20 bg-green-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Resolved</p>
              <p className="text-2xl font-bold text-green-400">{alerts.filter(a => a.status === 'resolved').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="metric-card border-yellow-500/20 bg-yellow-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Investigating</p>
              <p className="text-2xl font-bold text-yellow-400">{alerts.filter(a => a.status === 'investigating').length}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-slate-800/50 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div key={alert.id} className="glass-effect p-4 rounded-lg hover:bg-white/5 transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getStatusIcon(alert.status)}
                  <span className="font-medium text-white">{alert.type}</span>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <span className="text-sm text-slate-400">#{alert.id}</span>
                </div>
                
                <p className="text-sm text-slate-300 mb-2">{alert.description}</p>
                
                <div className="flex items-center space-x-4 text-xs text-slate-400">
                  <span>Source IP: {alert.source}</span>
                  <span>Count: {alert.count}</span>
                  <span>Time: {alert.timestamp}</span>
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                {alert.status === 'active' && (
                  <>
                    <Button size="sm" variant="outline" className="text-xs">
                      Investigate
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      Block IP
                    </Button>
                    <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700">
                      Resolve
                    </Button>
                  </>
                )}
                {alert.status === 'investigating' && (
                  <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700">
                    Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No matching alerts found</p>
        </div>
      )}
    </div>
  );
}