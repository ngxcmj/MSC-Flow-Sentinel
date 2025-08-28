import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState, ReactNode } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";

const queryClient = new QueryClient();

interface RouteProps {
  children: ReactNode;
}

// 路由守卫组件
const ProtectedRoute = ({ children }: RouteProps) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  // 如果没有令牌，重定向到登录页面
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// 公共路由组件（已登录用户无法访问）
const PublicRoute = ({ children }: RouteProps) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // 如果已经有令牌，重定向到首页或之前尝试访问的页面
  if (token) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  // 应用初始化逻辑
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 可以在这里添加验证令牌的逻辑
        // 例如，如果令牌无效则清除
        setIsInitialized(true);
      } catch (error) {
        console.error("应用初始化失败:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>;
  }

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
            {/* 公共路由 - 无需登录 */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            
            {/* 受保护的路由 - 需要登录 */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            
            {/* 404页面 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
};

export default App;
