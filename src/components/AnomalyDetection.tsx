import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Brain, TrendingUp, Activity, Zap, RotateCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { anomalyApi } from '@/lib/api';

export function AnomalyDetection() {
  const [detectionData, setDetectionData] = useState([]);
  const [anomalyTypes, setAnomalyTypes] = useState([]);
  const [modelStatus, setModelStatus] = useState({
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0
  });
  const [detectionStatus, setDetectionStatus] = useState({
    todayBlocked: 0,
    pendingReview: 0,
    modelLastUpdate: '',
    modelVersion: ''
  });
  
  const [loading, setLoading] = useState({
    hourly: true,
    types: true,
    performance: true,
    status: true
  });
  
  const [error, setError] = useState({
    hourly: false,
    types: false,
    performance: false,
    status: false
  });

  const fetchData = async () => {
    // 获取24小时检测统计
    setLoading(prev => ({ ...prev, hourly: true }));
    try {
      const hourlyData = await anomalyApi.getHourlyDetections();
      setDetectionData(hourlyData);
      setError(prev => ({ ...prev, hourly: false }));
    } catch (err) {
      console.error("获取小时统计数据失败:", err);
      setError(prev => ({ ...prev, hourly: true }));
    } finally {
      setLoading(prev => ({ ...prev, hourly: false }));
    }
    
    // 获取异常类型分布
    setLoading(prev => ({ ...prev, types: true }));
    try {
      const typesData = await anomalyApi.getAnomalyTypes();
      setAnomalyTypes(typesData);
      setError(prev => ({ ...prev, types: false }));
    } catch (err) {
      console.error("获取异常类型数据失败:", err);
      setError(prev => ({ ...prev, types: true }));
    } finally {
      setLoading(prev => ({ ...prev, types: false }));
    }
    
    // 获取模型性能指标
    setLoading(prev => ({ ...prev, performance: true }));
    try {
      const performanceData = await anomalyApi.getModelPerformance();
      setModelStatus(performanceData);
      setError(prev => ({ ...prev, performance: false }));
    } catch (err) {
      console.error("获取模型性能数据失败:", err);
      setError(prev => ({ ...prev, performance: true }));
    } finally {
      setLoading(prev => ({ ...prev, performance: false }));
    }
    
    // 获取实时检测状态
    setLoading(prev => ({ ...prev, status: true }));
    try {
      const statusData = await anomalyApi.getDetectionStatus();
      setDetectionStatus(statusData);
      setError(prev => ({ ...prev, status: false }));
    } catch (err) {
      console.error("获取检测状态数据失败:", err);
      setError(prev => ({ ...prev, status: true }));
    } finally {
      setLoading(prev => ({ ...prev, status: false }));
    }
  };

  useEffect(() => {
    fetchData();
    
    // 定时刷新数据（每30秒）
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3 shadow-xl">
          <p className="text-white text-sm font-medium">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const SkeletonMetric = () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20 bg-slate-700" />
      <Skeleton className="h-8 w-16 bg-slate-600" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">异常检测引擎</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">LightGBM模型运行中</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-blue-300">
            <Brain className="w-4 h-4" />
            <span>AI驱动检测</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
            onClick={fetchData}
            disabled={Object.values(loading).some(Boolean)}
          >
            <RotateCw className={`w-4 h-4 mr-1 ${Object.values(loading).some(Boolean) ? 'animate-spin' : ''}`} />
            刷新数据
          </Button>
        </div>
      </div>

      {/* 模型性能指标 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-effect border-green-500/20 bg-green-500/5">
          {loading.performance ? (
            <CardContent className="pt-6">
              <SkeletonMetric />
            </CardContent>
          ) : (
            <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">准确率</p>
              <p className="text-2xl font-bold text-green-400">{modelStatus.accuracy}%</p>
            </div>
            <Activity className="w-8 h-8 text-green-400" />
          </div>
            </CardContent>
          )}
        </Card>

        <Card className="glass-effect border-blue-500/20 bg-blue-500/5">
          {loading.performance ? (
            <CardContent className="pt-6">
              <SkeletonMetric />
            </CardContent>
          ) : (
            <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">精确率</p>
              <p className="text-2xl font-bold text-blue-400">{modelStatus.precision}%</p>
            </div>
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
            </CardContent>
          )}
        </Card>

        <Card className="glass-effect border-purple-500/20 bg-purple-500/5">
          {loading.performance ? (
            <CardContent className="pt-6">
              <SkeletonMetric />
            </CardContent>
          ) : (
            <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">召回率</p>
              <p className="text-2xl font-bold text-purple-400">{modelStatus.recall}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
            </CardContent>
          )}
        </Card>

        <Card className="glass-effect border-cyan-500/20 bg-cyan-500/5">
          {loading.performance ? (
            <CardContent className="pt-6">
              <SkeletonMetric />
            </CardContent>
          ) : (
            <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">F1分数</p>
              <p className="text-2xl font-bold text-cyan-400">{modelStatus.f1Score}%</p>
            </div>
            <Zap className="w-8 h-8 text-cyan-400" />
          </div>
            </CardContent>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 24小时检测统计 */}
        <Card className="glass-effect border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-white">24小时检测统计</CardTitle>
          </CardHeader>
          <CardContent>
            {loading.hourly ? (
              <div className="h-64 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <RotateCw className="w-8 h-8 text-blue-400 animate-spin mb-2" />
                  <p className="text-sm text-slate-400">加载数据中...</p>
                </div>
              </div>
            ) : error.hourly ? (
              <div className="h-64 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
                  <p className="text-sm text-slate-400">加载数据失败</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 text-blue-400 border-blue-500/30"
                    onClick={() => {
                      setLoading(prev => ({ ...prev, hourly: true }));
                      anomalyApi.getHourlyDetections()
                        .then(data => {
                          setDetectionData(data);
                          setError(prev => ({ ...prev, hourly: false }));
                        })
                        .catch(err => {
                          console.error("重试获取小时数据失败:", err);
                          setError(prev => ({ ...prev, hourly: true }));
                        })
                        .finally(() => {
                          setLoading(prev => ({ ...prev, hourly: false }));
                        });
                    }}
                  >
                    重试
                  </Button>
                </div>
              </div>
            ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={detectionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis 
                  dataKey="hour" 
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
                <Bar dataKey="detected" fill="#3b82f6" name="检测到" radius={[2, 2, 0, 0]} />
                <Bar dataKey="blocked" fill="#ef4444" name="已阻止" radius={[2, 2, 0, 0]} />
                <Bar dataKey="allowed" fill="#10b981" name="已放行" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
            )}
          </CardContent>
        </Card>

        {/* 异常类型分布 */}
        <Card className="glass-effect border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-white">异常类型分布</CardTitle>
          </CardHeader>
          <CardContent>
            {loading.types ? (
              <div className="h-64 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <RotateCw className="w-8 h-8 text-blue-400 animate-spin mb-2" />
                  <p className="text-sm text-slate-400">加载数据中...</p>
                </div>
              </div>
            ) : error.types ? (
              <div className="h-64 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
                  <p className="text-sm text-slate-400">加载数据失败</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 text-blue-400 border-blue-500/30"
                    onClick={() => {
                      setLoading(prev => ({ ...prev, types: true }));
                      anomalyApi.getAnomalyTypes()
                        .then(data => {
                          setAnomalyTypes(data);
                          setError(prev => ({ ...prev, types: false }));
                        })
                        .catch(err => {
                          console.error("重试获取类型数据失败:", err);
                          setError(prev => ({ ...prev, types: true }));
                        })
                        .finally(() => {
                          setLoading(prev => ({ ...prev, types: false }));
                        });
                    }}
                  >
                    重试
                  </Button>
                </div>
              </div>
            ) : (
              <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={anomalyTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  stroke="none"
                >
                  {anomalyTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-800/95 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3 shadow-xl">
                          <p className="text-white text-sm font-medium">{data.name}</p>
                          <p className="text-sm text-slate-300">占比: {data.value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-2 mt-4">
            {anomalyTypes.map((type, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: type.color }}
                  ></div>
                  <span className="text-sm text-slate-300">{type.name}</span>
                </div>
                <span className="text-sm font-medium text-white">{type.value}%</span>
              </div>
            ))}
          </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 实时检测状态 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-effect border-green-500/20 bg-green-500/5">
          {loading.status ? (
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-12 h-12 rounded-lg bg-slate-700" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 bg-slate-700" />
                  <Skeleton className="h-6 w-16 bg-slate-600" />
                  <Skeleton className="h-3 w-24 bg-slate-700" />
                </div>
              </div>
            </CardContent>
          ) : (
            <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">今日拦截</p>
                  <p className="text-xl font-bold text-green-400">{detectionStatus.todayBlocked}</p>
                  <p className="text-xs text-green-300">实时监控中</p>
            </div>
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="glass-effect border-yellow-500/20 bg-yellow-500/5">
          {loading.status ? (
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-12 h-12 rounded-lg bg-slate-700" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 bg-slate-700" />
                  <Skeleton className="h-6 w-16 bg-slate-600" />
                  <Skeleton className="h-3 w-24 bg-slate-700" />
          </div>
        </div>
            </CardContent>
          ) : (
            <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">待处理</p>
                  <p className="text-xl font-bold text-yellow-400">{detectionStatus.pendingReview}</p>
              <p className="text-xs text-yellow-300">需人工审核</p>
            </div>
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="glass-effect border-blue-500/20 bg-blue-500/5">
          {loading.status ? (
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-12 h-12 rounded-lg bg-slate-700" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 bg-slate-700" />
                  <Skeleton className="h-6 w-16 bg-slate-600" />
                  <Skeleton className="h-3 w-24 bg-slate-700" />
          </div>
        </div>
            </CardContent>
          ) : (
            <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">模型更新</p>
                  <p className="text-xl font-bold text-blue-400">{detectionStatus.modelLastUpdate}</p>
                  <p className="text-xs text-blue-300">版本 {detectionStatus.modelVersion}</p>
            </div>
          </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
