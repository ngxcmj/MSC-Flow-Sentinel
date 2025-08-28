
import React, { useState, useEffect } from 'react';
import { Globe, MapPin, Shield, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function GeoHeatMap() {
  const { t } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [geoData, setGeoData] = useState([]);

  // 模拟地理数据
  useEffect(() => {
    const regions = [
      { name: '北京', country: '中国', requests: 45892, anomalies: 1456, risk: 'medium', coords: { x: 70, y: 25 } },
      { name: '上海', country: '中国', requests: 52341, anomalies: 2891, risk: 'high', coords: { x: 72, y: 35 } },
      { name: '广州', country: '中国', requests: 38764, anomalies: 987, risk: 'low', coords: { x: 68, y: 45 } },
      { name: '东京', country: '日本', requests: 29145, anomalies: 1234, risk: 'medium', coords: { x: 85, y: 30 } },
      { name: '首尔', country: '韩国', requests: 18567, anomalies: 567, risk: 'low', coords: { x: 82, y: 28 } },
      { name: '新加坡', country: '新加坡', requests: 24891, anomalies: 1876, risk: 'high', coords: { x: 75, y: 55 } },
      { name: '悉尼', country: '澳大利亚', requests: 15632, anomalies: 234, risk: 'low', coords: { x: 90, y: 75 } },
      { name: '洛杉矶', country: '美国', requests: 67453, anomalies: 3421, risk: 'high', coords: { x: 15, y: 35 } },
      { name: '纽约', country: '美国', requests: 78234, anomalies: 4567, risk: 'high', coords: { x: 25, y: 30 } },
      { name: '伦敦', country: '英国', requests: 43291, anomalies: 1789, risk: 'medium', coords: { x: 50, y: 25 } },
    ];

    setGeoData(regions);
  }, []);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const getRiskBorderColor = (risk) => {
    switch (risk) {
      case 'high': return 'border-red-400';
      case 'medium': return 'border-yellow-400';
      case 'low': return 'border-green-400';
      default: return 'border-blue-400';
    }
  };

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{t('charts.global_anomaly_distribution')}</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-slate-300">
            <Globe className="w-4 h-4" />
            <span>{t('charts.realtime_monitoring')}</span>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* 世界地图背景 */}
        <div className="relative w-full h-64 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg border border-blue-500/20 overflow-hidden">
          <svg
            viewBox="0 0 100 60"
            className="w-full h-full opacity-20"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 简化的世界地图轮廓 */}
            <path
              d="M10,15 L25,12 L35,18 L45,15 L60,20 L75,18 L85,22 L90,25 L85,35 L75,38 L60,42 L45,40 L35,45 L25,42 L10,38 Z"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="0.5"
            />
            <path
              d="M15,25 L30,22 L40,28 L50,25 L65,30 L80,28 L90,32 L85,42 L70,45 L55,48 L40,46 L30,50 L15,45 Z"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="0.5"
            />
          </svg>

          {/* 数据点 */}
          {geoData.map((region, index) => (
            <div
              key={index}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-125`}
              style={{ left: `${region.coords.x}%`, top: `${region.coords.y}%` }}
              onClick={() => setSelectedRegion(region)}
            >
              <div className={`w-3 h-3 rounded-full ${getRiskColor(region.risk)} animate-pulse`}>
                <div className={`absolute inset-0 rounded-full ${getRiskColor(region.risk)} animate-ping`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* 选中区域详情 */}
        {selectedRegion && (
          <div className="absolute top-4 right-4 bg-slate-800/95 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 min-w-48">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">{selectedRegion.name}</h4>
              <button
                onClick={() => setSelectedRegion(null)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-slate-300 mb-3">{selectedRegion.country}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">{t('charts.total_requests_label')}:</span>
                <span className="text-xs text-white">{selectedRegion.requests.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">{t('charts.anomalies_label')}:</span>
                <span className="text-xs text-red-400">{selectedRegion.anomalies.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">{t('charts.risk_level_label')}:</span>
                <span className={`text-xs ${
                  selectedRegion.risk === 'high' ? 'text-red-400' :
                  selectedRegion.risk === 'medium' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {selectedRegion.risk === 'high' ? t('charts.risk_high') :
                   selectedRegion.risk === 'medium' ? t('charts.risk_medium') : t('charts.risk_low')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 图例 */}
      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-blue-500/20">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-slate-300">{t('charts.low_risk')}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-slate-300">{t('charts.medium_risk')}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-slate-300">{t('charts.high_risk')}</span>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <div className="text-lg font-bold text-white">{geoData.length}</div>
          <div className="text-xs text-slate-400">{t('charts.monitored_regions')}</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-400">
            {geoData.filter(r => r.risk === 'high').length}
          </div>
          <div className="text-xs text-slate-400">{t('charts.high_risk_regions')}</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">
            {geoData.reduce((sum, r) => sum + r.requests, 0).toLocaleString()}
          </div>
          <div className="text-xs text-slate-400">{t('charts.total_requests_count')}</div>
        </div>
      </div>
    </div>
  );
}
