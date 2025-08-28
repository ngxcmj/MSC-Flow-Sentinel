import axios from 'axios';

// 将API基础URL固定为后端服务器地址
const API_BASE_URL = 'http://localhost:3000/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 请求拦截器 - 添加token等认证信息
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理常见错误
api.interceptors.response.use(
  (response) => {
    // 直接返回响应数据而不是整个响应对象
    return response.data;
  },
  (error) => {
    if (error.response) {
      // 401未授权 - 清除token并跳转登录页
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

// 添加类型定义
export interface AuthResponse {
  token: string;
  user: UserData;
}

export interface UserData {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  status: string;
  lastLogin?: string;
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface DetectionStatus {
  todayBlocked: number;
  pendingReview: number;
  modelLastUpdate: string;
  modelVersion: string;
}

export interface HourlyDetection {
  hour: string;
  detected: number;
  blocked: number;
  allowed: number;
}

export interface AnomalyType {
  name: string;
  value: number;
  color: string;
}

// 认证相关API
export const authApi = {
  login: (username: string, password: string): Promise<AuthResponse> => 
    api.post('/auth/login', { username, password }),
  
  register: (userData: {
    username: string;
    password: string;
    email: string;
    name: string;
    department?: string;
  }): Promise<void> => api.post('/auth/register', userData),
  
  logout: (): Promise<void> => api.post('/auth/logout'),
  
  getCurrentUser: (): Promise<UserData> => api.get('/auth/me'),
  
  refreshToken: (): Promise<{ token: string }> => api.post('/auth/refresh-token')
};

// 异常检测相关API
export const anomalyApi = {
  // 获取异常检测统计数据
  getStatistics: (timeRange?: string): Promise<any> => 
    api.get('/anomaly/statistics', { params: { timeRange } }),
  
  // 获取24小时检测统计
  getHourlyDetections: (): Promise<HourlyDetection[]> => api.get('/anomaly/hourly'),
  
  // 获取异常类型分布
  getAnomalyTypes: (): Promise<AnomalyType[]> => api.get('/anomaly/types'),
  
  // 获取模型性能指标
  getModelPerformance: (): Promise<ModelPerformance> => api.get('/anomaly/model/performance'),
  
  // 获取实时检测状态
  getDetectionStatus: (): Promise<DetectionStatus> => api.get('/anomaly/status'),
  
  // 获取异常列表(分页)
  getAnomalies: (params: {
    page: number;
    size: number;
    sort?: string;
    status?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    content: any[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }> => api.get('/anomaly/list', { params }),
  
  // 获取单个异常详情
  getAnomalyDetail: (id: string): Promise<any> => api.get(`/anomaly/${id}`),
  
  // 处理异常(标记/忽略/处理等)
  handleAnomaly: (id: string, action: string, notes?: string): Promise<void> => 
    api.post(`/anomaly/${id}/${action}`, { notes })
};

// 用户管理相关API
export const userApi = {
  // 获取所有用户(分页)
  getUsers: (params: {
    page: number;
    size: number;
    sort?: string;
    role?: string;
    status?: string;
    search?: string;
  }): Promise<{
    content: UserData[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }> => api.get('/users', { params }),
  
  // 获取单个用户
  getUser: (id: string): Promise<UserData> => api.get(`/users/${id}`),
  
  // 创建用户
  createUser: (userData: any): Promise<UserData> => api.post('/users', userData),
  
  // 更新用户
  updateUser: (id: string, userData: any): Promise<UserData> => api.put(`/users/${id}`, userData),
  
  // 删除用户
  deleteUser: (id: string): Promise<void> => api.delete(`/users/${id}`),
  
  // 修改用户状态(启用/禁用)
  changeUserStatus: (id: string, status: string): Promise<void> => 
    api.patch(`/users/${id}/status`, { status }),
    
  // 重置用户密码
  resetPassword: (id: string): Promise<{ temporaryPassword: string }> => api.post(`/users/${id}/reset-password`),
  
  // 获取所有角色
  getRoles: (): Promise<{ id: string; name: string; description: string }[]> => api.get('/roles')
};

// 系统管理相关API
export const systemApi = {
  // 获取系统概览数据
  getOverview: (): Promise<any> => api.get('/system/overview'),
  
  // 获取系统配置
  getConfig: (): Promise<any> => api.get('/system/config'),
  
  // 更新系统配置
  updateConfig: (config: any): Promise<any> => api.post('/system/config', config),
  
  // 获取系统日志
  getLogs: (params: {
    page: number;
    size: number;
    level?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    content: any[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }> => api.get('/system/logs', { params }),
  
  // 获取系统资源使用情况
  getResources: (): Promise<any> => api.get('/system/resources')
};

// 数据分析相关API
export const analyticsApi = {
  // 获取流量数据
  getTrafficData: (params: {
    timeRange: string;
    interval?: string;
  }): Promise<any> => api.get('/analytics/traffic', { params }),
  
  // 获取地理分布数据
  getGeoData: (): Promise<any> => api.get('/analytics/geo'),
  
  // 获取请求类型分析
  getRequestTypes: (): Promise<any> => api.get('/analytics/request-types'),
  
  // 获取IP分析
  getIpAnalysis: (params: {
    timeRange: string;
    limit?: number;
  }): Promise<any> => api.get('/analytics/ip-analysis', { params }),
  
  // 导出报告
  exportReport: (params: {
    format: string;
    startDate: string;
    endDate: string;
    type?: string;
  }): Promise<Blob> => api.post('/analytics/export', params, { responseType: 'blob' })
};

// 模型管理相关API
export const modelApi = {
  // 获取模型列表
  getModels: (): Promise<any[]> => api.get('/models'),
  
  // 获取单个模型详情
  getModel: (id: string): Promise<any> => api.get(`/models/${id}`),
  
  // 获取模型训练历史
  getModelHistory: (id: string): Promise<any[]> => api.get(`/models/${id}/history`),
  
  // 触发模型训练
  trainModel: (id: string, params?: any): Promise<any> => api.post(`/models/${id}/train`, params),
  
  // 部署模型
  deployModel: (id: string, version: string): Promise<void> => 
    api.post(`/models/${id}/deploy`, { version }),
    
  // 获取特征重要性
  getFeatureImportance: (id: string): Promise<any[]> => api.get(`/models/${id}/features`),
  
  // 获取模型评估指标
  getModelMetrics: (id: string, version?: string): Promise<ModelPerformance> => 
    api.get(`/models/${id}/metrics`, { params: { version } })
};

export default api; 