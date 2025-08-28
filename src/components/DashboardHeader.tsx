
import React, { useState } from 'react';
import { Bell, Search, User, Settings, LogOut, UserCircle, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationPanel } from "./NotificationPanel";
import { SettingsPanel } from "./SettingsPanel";
import { authApi } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from 'react-i18next';

export function DashboardHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  const currentTime = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // 获取当前用户信息
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: '用户', role: '未知' };
  
  // 处理登出
  const handleLogout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      toast({
        title: t('logout_success'),
        description: t('logout_success_desc'),
      });
      
      // 跳转到登录页
      navigate('/login');
    } catch (err) {
      console.error("登出失败:", err);
      
      // 即使API调用失败，也清除本地存储并跳转
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <header className="h-16 border-b border-blue-500/20 bg-slate-900/50 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="text-white hover:bg-blue-600/20" />
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-white">{t('title')}</h2>
            <p className="text-xs text-blue-300">{t('dashboard')}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder={t('search_placeholder')}
                className="pl-10 w-64 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-300 hover:text-white hover:bg-blue-600/20 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-4 h-4" />
              <span className="ml-1 text-xs bg-red-500 text-white rounded-full px-1 animate-pulse">3</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-300 hover:text-white hover:bg-blue-600/20"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>

            {/* 语言切换按钮 */}
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-blue-600/20"
              onClick={() => {
                const newLang = i18n.language === 'zh' ? 'en' : 'zh';
                i18n.changeLanguage(newLang);
                localStorage.setItem('lang', newLang);
                alert(newLang === 'en' ? t('language_switch_en') : t('language_switch_zh'));
              }}
            >
              <Globe className="w-4 h-4" />
              {i18n.language === 'zh' ? 'EN' : '中文'}
            </Button>
            
            {/* 用户下拉菜单 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-blue-600/20">
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-slate-200">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem
                  className="text-slate-200 focus:bg-slate-700 focus:text-white cursor-pointer"
                  onClick={() => navigate('/profile')}
                >
                  {t('profile_settings')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-400 focus:bg-red-500/20 focus:text-red-300 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden md:block text-right">
            <div className="text-xs text-slate-400">{t('current_time')}</div>
            <div className="text-sm text-white font-mono">{currentTime}</div>
          </div>
        </div>
      </div>

      {/* 通知面板 */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

      {/* 设置面板 */}
      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </header>
  );
}
