
import React from 'react';
import {
  BarChart3,
  AlertTriangle,
  Settings,
  Users,
  Database,
  Activity,
  Brain,
  FileText
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTranslation } from 'react-i18next';

interface AppSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function AppSidebar({ activeView, onViewChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { t } = useTranslation();

  const menuItems = [
    { id: 'dashboard', title: t('sidebar.realtime_monitoring'), icon: BarChart3 },
    { id: 'alerts', title: t('sidebar.alert_management'), icon: AlertTriangle },
    { id: 'models', title: t('sidebar.model_management'), icon: Brain },
    { id: 'data', title: t('sidebar.data_analysis'), icon: Database },
    { id: 'system', title: t('sidebar.system_management'), icon: Settings },
    { id: 'users', title: t('sidebar.user_management'), icon: Users },
    { id: 'logs', title: t('sidebar.audit_logs'), icon: FileText },
  ];

  return (
    <Sidebar className={`${collapsed ? 'w-16' : 'w-64'} bg-slate-900/95 backdrop-blur-sm border-r border-blue-500/20`}>
      <div className="p-4 border-b border-blue-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-white">{t('sidebar.system_name')}</h1>
              <p className="text-xs text-blue-300">{t('sidebar.system_desc')}</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-300 text-xs uppercase tracking-wider">
            {!collapsed && t('sidebar.core_functions')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.id)}
                    className={`w-full justify-start transition-all duration-200 ${
                      activeView === item.id
                        ? 'bg-blue-600/80 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-blue-600/20 hover:text-white'
                    }`}
                  >
                    <item.icon className={`${collapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'}`} />
                    {!collapsed && <span className="text-sm">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="p-3 border-t border-blue-500/20">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            {!collapsed && <span>The system is running normally.</span>}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
