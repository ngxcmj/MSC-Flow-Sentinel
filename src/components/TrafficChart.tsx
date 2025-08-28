
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useTranslation } from 'react-i18next';

export function TrafficChart() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('1h');
  const [data, setData] = useState([]);

  // 生成模拟数据
  useEffect(() => {
    const generateData = () => {
      const now = new Date();
      const points = timeRange === '1h' ? 60 : timeRange === '6h' ? 72 : 144;
      const interval = timeRange === '1h' ? 1 : timeRange === '6h' ? 5 : 10;
      
      return Array.from({ length: points }, (_, i) => {
        const time = new Date(now.getTime() - (points - i) * interval * 60000);
        const baseTraffic = 1000 + Math.sin(i * 0.1) * 300;
        const anomaly = Math.random() < 0.1 ? Math.random() * 500 : 0;
        
        return {
          time: time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          normal: Math.max(0, baseTraffic + (Math.random() - 0.5) * 200),
          anomaly: anomaly,
          total: baseTraffic + anomaly + (Math.random() - 0.5) * 200
        };
      });
    };

    setData(generateData());
    
    const interval = setInterval(() => {
      setData(generateData());
    }, 30000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3 shadow-xl">
          <p className="text-white text-sm font-medium">{`${t('charts.time_label')}: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(0)} req/s
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{t('charts.traffic_trend')}</h3>
        <div className="flex space-x-2">
          {['1h', '6h', '24h'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-xs transition-all duration-200 ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="normalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="anomalyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="#94a3b8" 
              fontSize={12}
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12}
              tick={{ fill: '#94a3b8' }}
            />
            <Tooltip content={CustomTooltip} />
            <Area
              type="monotone"
              dataKey="normal"
              stackId="1"
              stroke="#3b82f6"
              fill="url(#normalGradient)"
              strokeWidth={2}
              name={t('charts.normal_traffic')}
            />
            <Area
              type="monotone"
              dataKey="anomaly"
              stackId="1"
              stroke="#ef4444"
              fill="url(#anomalyGradient)"
              strokeWidth={2}
              name={t('charts.anomaly_traffic')}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-blue-500/20">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-slate-300">{t('charts.normal_traffic')}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-slate-300">{t('charts.anomaly_traffic')}</span>
        </div>
      </div>
    </div>
  );
}
