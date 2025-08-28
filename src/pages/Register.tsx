import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, User, Building, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { authApi } from '@/lib/api';

export function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: '',
    department: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单表单验证
    if (!formData.username || !formData.password || !formData.email || !formData.name) {
      setError('请填写所有必填字段');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // 调用注册API
      await authApi.register({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        name: formData.name,
        department: formData.department
      });
      
      toast({
        title: "注册成功",
        description: "账户已创建，请登录",
      });
      
      // 重定向到登录页
      navigate('/login');
    } catch (err: any) {
      console.error('注册失败:', err);
      setError(err?.message || '注册失败，请稍后重试');
      
      toast({
        variant: "destructive",
        title: "注册失败",
        description: err?.message || '注册失败，请稍后重试',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">流量哨兵</h1>
          <p className="mt-2 text-sm text-blue-300">Web流量异常监测系统</p>
        </div>

        <Card className="border-slate-700 bg-slate-900/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-center text-white">账户注册</CardTitle>
            <CardDescription className="text-center text-slate-400">
              创建一个新账户以访问系统
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-red-500/20 border border-red-500/50 flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="text"
                      name="username"
                      placeholder="用户名 *"
                      value={formData.username}
                      onChange={handleChange}
                      className="bg-slate-800/50 border-slate-700 pl-10 text-white placeholder-slate-400"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="text"
                      name="name"
                      placeholder="姓名 *"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-slate-800/50 border-slate-700 pl-10 text-white placeholder-slate-400"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="email"
                      name="email"
                      placeholder="邮箱 *"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-slate-800/50 border-slate-700 pl-10 text-white placeholder-slate-400"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="text"
                      name="department"
                      placeholder="部门"
                      value={formData.department}
                      onChange={handleChange}
                      className="bg-slate-800/50 border-slate-700 pl-10 text-white placeholder-slate-400"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="password"
                      name="password"
                      placeholder="密码 *"
                      value={formData.password}
                      onChange={handleChange}
                      className="bg-slate-800/50 border-slate-700 pl-10 text-white placeholder-slate-400"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="password"
                      name="confirmPassword"
                      placeholder="确认密码 *"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="bg-slate-800/50 border-slate-700 pl-10 text-white placeholder-slate-400"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? '注册中...' : '注 册'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-slate-700 pt-4">
            <div className="text-center text-sm text-slate-400">
              <span>已有账号？</span>
              <Button 
                variant="link" 
                className="text-blue-400 hover:text-blue-300 p-0 h-auto font-normal"
                onClick={() => navigate('/login')}
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                返回登录
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Register; 