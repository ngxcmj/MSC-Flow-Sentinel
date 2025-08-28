import React, { useState } from 'react';
import { Bell, AlertTriangle, Shield, Info, CheckCircle, Clock, X, Eye, Settings as SettingsIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from 'react-i18next';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');

  const notifications = [
    {
      id: 1,
      type: 'critical',
      title: 'SQL注入攻击检测',
      message: '检测到来自IP 45.123.67.89的SQL注入尝试，已自动阻止',
      timestamp: '2024-01-15 14:35:21',
      isRead: false,
      details: '攻击向量: UNION SELECT * FROM users; 目标URL: /api/login',
      source: 'AI检测引擎',
      actions: ['封禁IP', '查看详情', '添加黑名单']
    },
    {
      id: 2,
      type: 'warning', 
      title: '异常流量峰值',
      message: '过去5分钟内请求量激增300%，建议检查负载均衡',
      timestamp: '2024-01-15 14:30:15',
      isRead: false,
      details: '当前QPS: 15,000 正常范围: 3,000-5,000',
      source: '流量监控',
      actions: ['查看流量图', '调整限流', '通知运维']
    },
    {
      id: 3,
      type: 'info',
      title: 'LightGBM模型更新',
      message: '异常检测模型已成功更新至v2.1.3，准确率提升至98.5%',
      timestamp: '2024-01-15 02:00:00',
      isRead: true,
      details: '训练数据: 100,000条 验证准确率: 98.5% F1分数: 0.987',
      source: '模型管理系统',
      actions: ['查看性能报告', '回滚版本']
    },
    {
      id: 4,
      type: 'success',
      title: '威胁已解除',
      message: '来自僵尸网络的DDoS攻击已被成功防御',
      timestamp: '2024-01-15 13:45:30',
      isRead: true,
      details: '阻止请求: 45,678次 攻击持续时间: 12分钟',
      source: '防护系统',
      actions: ['查看攻击分析']
    },
    {
      id: 5,
      type: 'critical',
      title: '暴力破解检测',
      message: '检测到针对管理员账户的暴力破解攻击',
      timestamp: '2024-01-15 12:20:45',
      isRead: false,
      details: '目标账户: admin@company.com 尝试次数: 156次',
      source: '认证监控',
      actions: ['锁定账户', '重置密码', '查看日志']
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info': return <Info className="w-5 h-5 text-blue-400" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      default: return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-l-4 border-l-red-500 bg-red-500/10';
      case 'warning': return 'border-l-4 border-l-yellow-500 bg-yellow-500/10';
      case 'info': return 'border-l-4 border-l-blue-500 bg-blue-500/10';
      case 'success': return 'border-l-4 border-l-green-500 bg-green-500/10';
      default: return 'border-l-4 border-l-slate-500 bg-slate-500/10';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const criticalCount = notifications.filter(n => n.type === 'critical' && !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-6">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
      
      <Card className="relative w-96 max-h-[80vh] glass-effect border-slate-700 animate-slide-in">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              {t('notifications.system_notifications')}
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-500/20 text-red-300">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
              <TabsTrigger value="all" className="text-xs">{t('notifications.all')}</TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                {t('notifications.unread')} {unreadCount > 0 && `(${unreadCount})`}
              </TabsTrigger>
              <TabsTrigger value="critical" className="text-xs">
                {t('notifications.critical')} {criticalCount > 0 && `(${criticalCount})`}
              </TabsTrigger>
              <TabsTrigger value="warning" className="text-xs">{t('notifications.warning')}</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-3 max-h-96 overflow-y-auto">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 rounded-lg ${getNotificationColor(notification.type)} ${
                    !notification.isRead ? 'opacity-100' : 'opacity-60'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-white truncate">
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{notification.timestamp}</span>
                        </div>
                        <Button size="sm" variant="ghost" className="text-xs h-6 px-2">
                          <Eye className="w-3 h-3 mr-1" />
                          {t('notifications.details')}
                        </Button>
                      </div>
                      
                      {notification.details && (
                        <div className="mt-2 p-2 bg-slate-800/50 rounded text-xs text-slate-300">
                          <p><strong>{t('notifications.detailed_info')}:</strong> {notification.details}</p>
                          <p><strong>{t('notifications.source')}:</strong> {notification.source}</p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {notification.actions.map((action, index) => (
                          <Button 
                            key={index}
                            size="sm" 
                            variant="outline" 
                            className="text-xs h-6 px-2"
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                {t('notifications.mark_all_read')}
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                {t('notifications.notification_settings')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}