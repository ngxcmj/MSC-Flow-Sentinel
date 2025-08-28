import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { authApi } from '@/lib/api';
import { useTranslation } from 'react-i18next';

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { toast } = useToast();
    const { t } = useTranslation();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setError(t('login.enter_username_password'));
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            // 调用登录API
            const response = await authApi.login(username, password);

            // 保存token和用户信息
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            toast({
                title: t('login.login_success'),
                description: t('welcome', { name: response.user.name }),
            });

            // 重定向到首页
            navigate('/');
        } catch (err: any) {
            console.error('登录失败:', err);
            setError(err?.message || t('login.invalid_credentials'));

            toast({
                variant: "destructive",
                title: t('login.login_failed'),
                description: err?.message || t('login.invalid_credentials'),
            });
            // 重定向到首页
            navigate('/');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Activity className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">{t('login.system_name')}</h1>
                    <p className="mt-2 text-sm text-blue-300">{t('login.system_desc')}</p>
                </div>

                <Card className="border-slate-700 bg-slate-900/80 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl text-center text-white">{t('login.account_login')}</CardTitle>
                        <CardDescription className="text-center text-slate-400">
                            {t('login.enter_credentials')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-md bg-red-500/20 border border-red-500/50 flex items-center space-x-2">
                                    <AlertCircle className="h-4 w-4 text-red-400" />
                                    <p className="text-sm text-red-400">{error}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        type="text"
                                        placeholder={t('login.username_placeholder')}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
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
                                        placeholder={t('login.password_placeholder')}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-slate-800/50 border-slate-700 pl-10 text-white placeholder-slate-400"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                    disabled={isLoading}
                                >
                                    {isLoading ? t('login.logging_in') : t('login.login_button')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-slate-700 pt-4">
                        <div className="text-center text-sm text-slate-400">
                            <span>{t('login.no_account')}</span>
                            <Button
                                variant="link"
                                className="text-blue-400 hover:text-blue-300 p-0 h-auto font-normal"
                                onClick={() => navigate('/register')}
                            >
                                {t('login.register_now')}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default Login; 