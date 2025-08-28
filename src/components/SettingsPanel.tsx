import React, { useState } from 'react';
import { Settings, Shield, Bell, Database, Brain, Users, Monitor, Save, X, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState('monitoring');
  const [isDirty, setIsDirty] = useState(false);
  const { toast } = useToast();

  // 监控设置状态
  const [monitoringSettings, setMonitoringSettings] = useState({
    realTimeMonitoring: true,
    anomalyThreshold: 85,
    alertSensitivity: 'medium',
    dataRetentionDays: 90,
    samplingRate: 100,
    enableGeoBlocking: true,
    maxRequestsPerMinute: 1000,
    enableRateLimiting: true
  });

  // AI模型设置状态
  const [aiSettings, setAiSettings] = useState({
    autoModelUpdate: true,
    updateFrequency: 24,
    minTrainingSamples: 100000,
    confidenceThreshold: 0.8,
    enableActivelearning: true,
    modelComplexity: 'high',
    featureSelection: 'automatic',
    enableExplainability: true
  });

  // 通知设置状态
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    webhookNotifications: true,
    desktopNotifications: true,
    criticalAlertDelay: 0,
    warningAlertDelay: 5,
    infoAlertDelay: 15,
    muteScheduleEnabled: false,
    muteStartTime: '22:00',
    muteEndTime: '08:00'
  });

  // 安全设置状态
  const [securitySettings, setSecuritySettings] = useState({
    autoIpBlocking: true,
    blockDuration: 3600,
    whitelist: ['192.168.1.0/24', '10.0.0.0/8'],
    enableTwoFactor: true,
    sessionTimeout: 30,
    passwordComplexity: 'high',
    enableAuditLog: true,
    logRetentionDays: 365
  });

  const handleSave = () => {
    // 这里应该调用API保存设置
    toast({
      title: "设置已保存",
      description: "系统配置已成功更新",
    });
    setIsDirty(false);
  };

  const renderMonitoringSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-effect border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">基础监控</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">实时监控</span>
              <Switch 
                checked={monitoringSettings.realTimeMonitoring}
                onCheckedChange={(checked) => {
                  setMonitoringSettings(prev => ({...prev, realTimeMonitoring: checked}));
                  setIsDirty(true);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-300">异常检测阈值 (%)</label>
              <Slider
                value={[monitoringSettings.anomalyThreshold]}
                onValueChange={(value) => {
                  setMonitoringSettings(prev => ({...prev, anomalyThreshold: value[0]}));
                  setIsDirty(true);
                }}
                max={100}
                min={50}
                step={5}
                className="w-full"
              />
              <div className="text-xs text-slate-400">{monitoringSettings.anomalyThreshold}%</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">告警敏感度</label>
              <select 
                value={monitoringSettings.alertSensitivity}
                onChange={(e) => {
                  setMonitoringSettings(prev => ({...prev, alertSensitivity: e.target.value}));
                  setIsDirty(true);
                }}
                className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm"
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">流量控制</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">启用限流</span>
              <Switch 
                checked={monitoringSettings.enableRateLimiting}
                onCheckedChange={(checked) => {
                  setMonitoringSettings(prev => ({...prev, enableRateLimiting: checked}));
                  setIsDirty(true);
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">每分钟最大请求数</label>
              <Input
                type="number"
                value={monitoringSettings.maxRequestsPerMinute}
                onChange={(e) => {
                  setMonitoringSettings(prev => ({...prev, maxRequestsPerMinute: parseInt(e.target.value)}));
                  setIsDirty(true);
                }}
                className="bg-slate-800/50 border-slate-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">地理位置封锁</span>
              <Switch 
                checked={monitoringSettings.enableGeoBlocking}
                onCheckedChange={(checked) => {
                  setMonitoringSettings(prev => ({...prev, enableGeoBlocking: checked}));
                  setIsDirty(true);
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAISettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-effect border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">模型训练</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">自动模型更新</span>
              <Switch 
                checked={aiSettings.autoModelUpdate}
                onCheckedChange={(checked) => {
                  setAiSettings(prev => ({...prev, autoModelUpdate: checked}));
                  setIsDirty(true);
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">更新频率 (小时)</label>
              <Input
                type="number"
                value={aiSettings.updateFrequency}
                onChange={(e) => {
                  setAiSettings(prev => ({...prev, updateFrequency: parseInt(e.target.value)}));
                  setIsDirty(true);
                }}
                className="bg-slate-800/50 border-slate-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">最小训练样本数</label>
              <Input
                type="number"
                value={aiSettings.minTrainingSamples}
                onChange={(e) => {
                  setAiSettings(prev => ({...prev, minTrainingSamples: parseInt(e.target.value)}));
                  setIsDirty(true);
                }}
                className="bg-slate-800/50 border-slate-600"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">检测配置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">置信度阈值</label>
              <Slider
                value={[aiSettings.confidenceThreshold * 100]}
                onValueChange={(value) => {
                  setAiSettings(prev => ({...prev, confidenceThreshold: value[0] / 100}));
                  setIsDirty(true);
                }}
                max={100}
                min={50}
                step={5}
                className="w-full"
              />
              <div className="text-xs text-slate-400">{(aiSettings.confidenceThreshold * 100).toFixed(0)}%</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">模型复杂度</label>
              <select 
                value={aiSettings.modelComplexity}
                onChange={(e) => {
                  setAiSettings(prev => ({...prev, modelComplexity: e.target.value}));
                  setIsDirty(true);
                }}
                className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm"
              >
                <option value="low">低 (快速)</option>
                <option value="medium">中 (平衡)</option>
                <option value="high">高 (精确)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">模型可解释性</span>
              <Switch 
                checked={aiSettings.enableExplainability}
                onCheckedChange={(checked) => {
                  setAiSettings(prev => ({...prev, enableExplainability: checked}));
                  setIsDirty(true);
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-effect border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">通知渠道</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">邮件通知</span>
              <Switch 
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => {
                  setNotificationSettings(prev => ({...prev, emailNotifications: checked}));
                  setIsDirty(true);
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">短信通知</span>
              <Switch 
                checked={notificationSettings.smsNotifications}
                onCheckedChange={(checked) => {
                  setNotificationSettings(prev => ({...prev, smsNotifications: checked}));
                  setIsDirty(true);
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Webhook通知</span>
              <Switch 
                checked={notificationSettings.webhookNotifications}
                onCheckedChange={(checked) => {
                  setNotificationSettings(prev => ({...prev, webhookNotifications: checked}));
                  setIsDirty(true);
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">桌面通知</span>
              <Switch 
                checked={notificationSettings.desktopNotifications}
                onCheckedChange={(checked) => {
                  setNotificationSettings(prev => ({...prev, desktopNotifications: checked}));
                  setIsDirty(true);
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">通知延迟</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">紧急告警延迟 (分钟)</label>
              <Input
                type="number"
                value={notificationSettings.criticalAlertDelay}
                onChange={(e) => {
                  setNotificationSettings(prev => ({...prev, criticalAlertDelay: parseInt(e.target.value)}));
                  setIsDirty(true);
                }}
                className="bg-slate-800/50 border-slate-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">警告延迟 (分钟)</label>
              <Input
                type="number"
                value={notificationSettings.warningAlertDelay}
                onChange={(e) => {
                  setNotificationSettings(prev => ({...prev, warningAlertDelay: parseInt(e.target.value)}));
                  setIsDirty(true);
                }}
                className="bg-slate-800/50 border-slate-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">信息延迟 (分钟)</label>
              <Input
                type="number"
                value={notificationSettings.infoAlertDelay}
                onChange={(e) => {
                  setNotificationSettings(prev => ({...prev, infoAlertDelay: parseInt(e.target.value)}));
                  setIsDirty(true);
                }}
                className="bg-slate-800/50 border-slate-600"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-6">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
      
      <Card className="relative w-[600px] max-h-[80vh] glass-effect border-slate-700 animate-slide-in">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              系统设置
              {isDirty && (
                <div className="ml-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              )}
            </CardTitle>
            <div className="flex space-x-2">
              {isDirty && (
                <Button size="sm" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-1" />
                  保存
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
              <TabsTrigger value="monitoring" className="text-xs flex items-center">
                <Monitor className="w-3 h-3 mr-1" />
                监控
              </TabsTrigger>
              <TabsTrigger value="ai" className="text-xs flex items-center">
                <Brain className="w-3 h-3 mr-1" />
                AI
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs flex items-center">
                <Bell className="w-3 h-3 mr-1" />
                通知
              </TabsTrigger>
              <TabsTrigger value="security" className="text-xs flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                安全
              </TabsTrigger>
            </TabsList>

            <div className="max-h-96 overflow-y-auto">
              <TabsContent value="monitoring" className="space-y-4">
                {renderMonitoringSettings()}
              </TabsContent>

              <TabsContent value="ai" className="space-y-4">
                {renderAISettings()}
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                {renderNotificationSettings()}
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <div className="p-4 text-center text-slate-400">
                  <Shield className="w-8 h-8 mx-auto mb-2" />
                  <p>安全设置功能开发中...</p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}