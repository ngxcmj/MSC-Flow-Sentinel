
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Shield, AlertTriangle, Users, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  status?: 'normal' | 'warning' | 'critical';
}

function MetricCard({ title, value, change, changeType, icon, status = 'normal' }: MetricCardProps) {
  const statusColors = {
    normal: 'border-green-500/30 bg-green-500/5',
    warning: 'border-yellow-500/30 bg-yellow-500/5',
    critical: 'border-red-500/30 bg-red-500/5'
  };

  const changeColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-slate-400'
  };

  return (
    <div className={`metric-card ${statusColors[status]} relative overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-white mb-2">{value}</p>
          <div className="flex items-center space-x-1">
            {changeType === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : changeType === 'down' ? (
              <TrendingDown className="w-4 h-4 text-red-400" />
            ) : null}
            <span className={`text-sm ${changeColors[changeType]}`}>{change}</span>
          </div>
        </div>
        <div className="text-blue-400 opacity-80">
          {icon}
        </div>
      </div>
      
      {status !== 'normal' && (
        <div className={`absolute top-2 right-2 status-indicator status-${status}`}></div>
      )}
    </div>
  );
}

export function MetricsOverview() {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState({
    totalRequests: { value: '1,247,853', change: '+12.5%', type: 'up' as const },
    anomalyRate: { value: '3.2%', change: '-0.8%', type: 'down' as const, status: 'warning' as const },
    blockedIPs: { value: '1,429', change: '+24', type: 'up' as const, status: 'critical' as const },
    peakTraffic: { value: '8.9K/s', change: '+15.2%', type: 'up' as const },
    activeUsers: { value: '45,892', change: '+3.1%', type: 'up' as const },
    coverage: { value: '99.7%', change: '+0.1%', type: 'up' as const }
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalRequests: {
          ...prev.totalRequests,
          value: (Math.floor(Math.random() * 100000) + 1200000).toLocaleString()
        },
        anomalyRate: {
          ...prev.anomalyRate,
          value: (Math.random() * 5 + 1).toFixed(1) + '%'
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{t('metrics.overview_title')}</h2>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Updating in real time</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title={t('metrics.total_requests')}
          value={metrics.totalRequests.value}
          change={metrics.totalRequests.change}
          changeType={metrics.totalRequests.type}
          icon={<Globe className="w-8 h-8" />}
        />

        <MetricCard
          title={t('metrics.anomaly_rate')}
          value={metrics.anomalyRate.value}
          change={metrics.anomalyRate.change}
          changeType={metrics.anomalyRate.type}
          status={metrics.anomalyRate.status}
          icon={<AlertTriangle className="w-8 h-8" />}
        />

        <MetricCard
          title={t('metrics.blocked_ips')}
          value={metrics.blockedIPs.value}
          change={metrics.blockedIPs.change}
          changeType={metrics.blockedIPs.type}
          status={metrics.blockedIPs.status}
          icon={<Shield className="w-8 h-8" />}
        />

        <MetricCard
          title={t('metrics.peak_traffic')}
          value={metrics.peakTraffic.value}
          change={metrics.peakTraffic.change}
          changeType={metrics.peakTraffic.type}
          icon={<TrendingUp className="w-8 h-8" />}
        />

        <MetricCard
          title={t('metrics.active_users')}
          value={metrics.activeUsers.value}
          change={metrics.activeUsers.change}
          changeType={metrics.activeUsers.type}
          icon={<Users className="w-8 h-8" />}
        />

        <MetricCard
          title={t('metrics.coverage')}
          value={metrics.coverage.value}
          change={metrics.coverage.change}
          changeType={metrics.coverage.type}
          icon={<Globe className="w-8 h-8" />}
        />
      </div>
    </div>
  );
}
