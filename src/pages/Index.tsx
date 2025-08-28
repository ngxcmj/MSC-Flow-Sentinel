
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricsOverview } from "@/components/MetricsOverview";
import { TrafficChart } from "@/components/TrafficChart";
import { GeoHeatMap } from "@/components/GeoHeatMap";
// import { AnomalyDetection } from "@/components/AnomalyDetection";
import { AlertsPanel } from "@/components/AlertsPanel";
import { ModelManagement } from "@/components/ModelManagement";
import { SystemManagement } from "@/components/SystemManagement";
import { UserManagement } from "@/components/UserManagement";
import { AuditLogs } from "@/components/AuditLogs";
import { useTranslation } from 'react-i18next';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [showSystemSettings, setShowSystemSettings] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <MetricsOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrafficChart />
              <GeoHeatMap />
            </div>
            {/* 删除异常检测模块 */}
          </div>
        );
      case 'alerts':
        return <AlertsPanel />;
      case 'models':
        return <ModelManagement />;
      case 'system':
        return <SystemManagement />;
      case 'users':
        return <UserManagement />;
      case 'logs':
        return <AuditLogs />;
      default:
        return (
          <div className="space-y-6">
            <MetricsOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrafficChart />
              <GeoHeatMap />
            </div>
            {/* 删除异常检测模块 */}
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <AppSidebar activeView={activeView} onViewChange={setActiveView} />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader onOpenSystemSettings={() => setShowSystemSettings(true)} />
          
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </main>
        {showSystemSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="relative w-[900px] max-h-[90vh] bg-slate-900 rounded-lg shadow-2xl overflow-auto">
              <SystemManagement />
              <button
                className="absolute top-4 right-4 text-white text-2xl"
                onClick={() => setShowSystemSettings(false)}
              >×</button>
            </div>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default Index;
