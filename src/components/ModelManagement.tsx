import React, { useState } from 'react';
import { Brain, Upload, Download, Settings, TrendingUp, Activity, Zap, Database } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

export function ModelManagement() {
  const { t } = useTranslation();
  const [activeModel, setActiveModel] = useState('lightgbm-v2.1.3');
  
  const models = [
    {
      id: 'ours-model-v1.1',
      name: 'Ours Model v1.1',
      status: 'active',
      accuracy: 96.8,
      trainingDate: '2025-04-15',
      samples: 2847592,
      features: 47
    },
    {
      id: 'lightgbm-v2.1.2',
      name: 'LightGBM v2.1.2',
      status: 'standby',
      accuracy: 95.2,
      trainingDate: '2025-03-10',
      samples: 2654738,
      features: 45
    },
    {
      id: 'lightgbm-v2.1.1',
      name: 'LightGBM v2.1.1',
      status: 'archived',
      accuracy: 94.6,
      trainingDate: '2025-04-05',
      samples: 2456891,
      features: 43
    }
  ];

  const performanceData = [
    { time: '00:00', accuracy: 96.2, precision: 94.8, recall: 97.5 },
    { time: '04:00', accuracy: 96.5, precision: 95.1, recall: 97.8 },
    { time: '08:00', accuracy: 96.8, precision: 95.4, recall: 98.1 },
    { time: '12:00', accuracy: 96.4, precision: 94.9, recall: 97.7 },
    { time: '16:00', accuracy: 96.9, precision: 95.6, recall: 98.2 },
    { time: '20:00', accuracy: 96.7, precision: 95.3, recall: 98.0 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'standby': return 'bg-yellow-500';
      case 'archived': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3 shadow-xl">
          <p className="text-white text-sm font-medium">{`Time: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Model Management</h2>
        <div className="flex items-center space-x-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload Model
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Training Configuration
          </Button>
        </div>
      </div>

      {/* Active Model Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card border-green-500/20 bg-green-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Accuracy Rate</p>
              <p className="text-2xl font-bold text-green-400">96.8%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="metric-card border-blue-500/20 bg-blue-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Training Samples</p>
              <p className="text-2xl font-bold text-blue-400">2.84M</p>
            </div>
            <Database className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="metric-card border-purple-500/20 bg-purple-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Feature Dimensions</p>
              <p className="text-2xl font-bold text-purple-400">47</p>
            </div>
            <Activity className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="metric-card border-yellow-500/20 bg-yellow-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Inference Speed</p>
              <p className="text-2xl font-bold text-yellow-400">2.3ms</p>
            </div>
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model List */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-white mb-4">Model Version Management</h3>
          <div className="space-y-3">
            {models.map((model) => (
              <div key={model.id} className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                activeModel === model.id 
                  ? 'border-blue-500/50 bg-blue-500/5' 
                  : 'border-slate-600/50 bg-slate-800/20 hover:border-slate-500/50'
              }`} onClick={() => setActiveModel(model.id)}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(model.status)}`}></div>
                    <span className="font-medium text-white">{model.name}</span>
                    {model.status === 'active' && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-md">Active</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" className="text-xs">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    {model.status !== 'active' && (
                      <Button size="sm" variant="outline" className="text-xs">
                        Activate
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Accuracy: </span>
                    <span className="text-white font-medium">{model.accuracy}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Training Date: </span>
                    <span className="text-white font-medium">{model.trainingDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Training Samples: </span>
                    <span className="text-white font-medium">{(model.samples / 1000000).toFixed(2)}M</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Features: </span>
                    <span className="text-white font-medium">{model.features}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-600/50">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Brain className="w-4 h-4 mr-2" />
              Start New Model Training
            </Button>
          </div>
        </div>

        {/* Performance Monitoring */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-white mb-4">Model Performance Monitoring</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                  domain={[90, 100]}
                />
                <Tooltip content={CustomTooltip} />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  name="Accuracy"
                />
                <Line
                  type="monotone"
                  dataKey="precision"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  name="Precision"
                />
                <Line
                  type="monotone"
                  dataKey="recall"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  name="Recall"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-blue-500/20">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-slate-300">Accuracy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-slate-300">Precision</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-slate-300">Recall</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Importance */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold text-white mb-4">Feature Importance Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Request Frequency', importance: 0.23, change: '+0.05' },
            { name: 'User-Agent', importance: 0.18, change: '-0.02' },
            { name: 'IP Geolocation', importance: 0.15, change: '+0.03' },
            { name: 'Request Path Length', importance: 0.12, change: '+0.01' },
            { name: 'HTTP Method', importance: 0.09, change: '0.00' },
            { name: 'Response Time', importance: 0.08, change: '-0.01' },
            { name: 'Request Size', importance: 0.08, change: '+0.02' },
            { name: 'Referer', importance: 0.07, change: '-0.01' }
          ].map((feature, index) => (
            <div key={index} className="bg-slate-800/30 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white font-medium">{feature.name}</span>
                <span className={`text-xs ${
                  feature.change.startsWith('+') ? 'text-green-400' :
                  feature.change.startsWith('-') ? 'text-red-400' : 'text-slate-400'
                }`}>
                  {feature.change}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 mb-1">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  style={{ width: `${feature.importance * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-slate-400">{(feature.importance * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}