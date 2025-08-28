import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Shield, Search, Filter, Eye, Lock, Unlock, UserCheck, UserX, RotateCw, AlertTriangle, Key } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userApi, UserData } from '@/lib/api';
import { useTranslation } from 'react-i18next';

export function UserManagement() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([
    { value: 'all', label: t('user_management.all_roles') },
  ]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const { toast } = useToast();

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    department: '',
    role: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Statistics
  const [stats, setStats] = useState({
    active: 0,
    inactive: 0,
    pending: 0
  });

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await userApi.getUsers({
        page: currentPage,
        size: 10,
        role: selectedRole === 'all' ? undefined : selectedRole,
        search: searchTerm || undefined
      });
      
      setUsers(response.content);
      setTotalPages(response.totalPages);
      setTotalUsers(response.totalElements);
      
      // Calculate user status counts
      const activeCount = response.content.filter(user => user.status === 'active').length;
      const inactiveCount = response.content.filter(user => user.status === 'inactive').length;
      const pendingCount = response.content.filter(user => user.status === 'pending').length;
      
      setStats({
        active: activeCount,
        inactive: inactiveCount,
        pending: pendingCount
      });
      
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(true);
      toast({
        variant: "destructive",
        title: "Failed to fetch users",
        description: "Please check your network connection and try again",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const rolesData = await userApi.getRoles();
      
      const formattedRoles = [
        { value: 'all', label: t('user_management.all_roles') },
        ...rolesData.map(role => ({ 
          value: role.name, 
          label: role.name 
        }))
      ];
      
      setRoles(formattedRoles);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
      toast({
        variant: "destructive",
        title: "Failed to fetch roles",
        description: "Using default role list",
      });
    }
  };

  // Initial load
  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  // Fetch data when filters change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, selectedRole]);

  // Search functionality
  const handleSearch = () => {
    setCurrentPage(0);
    fetchUsers();
  };

  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle role selection
  const handleRoleChange = (value: string) => {
    setUserForm(prev => ({ ...prev, role: value }));
  };

  // Handle filter role change
  const handleFilterRoleChange = (value: string) => {
    setSelectedRole(value);
    setCurrentPage(0);
  };

  // Handle user creation
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    // Form validation
    if (!userForm.username || !userForm.password || !userForm.name || !userForm.email || !userForm.role) {
      setFormError('Please fill in all required fields');
      setFormLoading(false);
      return;
    }

    if (userForm.password !== userForm.confirmPassword) {
      setFormError('Passwords do not match');
      setFormLoading(false);
      return;
    }

    try {
      await userApi.createUser({
        username: userForm.username,
        password: userForm.password,
        name: userForm.name,
        email: userForm.email,
        department: userForm.department || undefined,
        role: userForm.role
      });

      toast({
        title: "User created",
        description: "User account created successfully",
      });

      // Reset form and refresh list
      setUserForm({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: '',
        department: '',
        role: '',
      });
      setCreateDialogOpen(false);
      fetchUsers();
    } catch (err: any) {
      console.error("Failed to create user:", err);
      setFormError(err?.message || 'Failed to create user, please try again');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle user edit
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setFormError('');
    setFormLoading(true);

    try {
      await userApi.updateUser(selectedUser.id, {
        name: userForm.name,
        email: userForm.email,
        department: userForm.department || undefined,
        role: userForm.role
      });

      toast({
        title: "User updated",
        description: "User information updated successfully",
      });

      setEditDialogOpen(false);
      fetchUsers();
    } catch (err: any) {
      console.error("Failed to update user:", err);
      setFormError(err?.message || 'Failed to update user, please try again');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setFormLoading(true);

    try {
      await userApi.deleteUser(selectedUser.id);

      toast({
        title: "User deleted",
        description: "User account has been deleted",
      });

      setDeleteDialogOpen(false);
      fetchUsers();
    } catch (err: any) {
      console.error("Failed to delete user:", err);
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: err?.message || 'Failed to delete user, please try again',
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Handle user status change
  const handleToggleStatus = async (user: UserData) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    
    try {
      await userApi.changeUserStatus(user.id, newStatus);
      
      toast({
        title: "Status changed",
        description: `User ${user.name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
      });
      
      fetchUsers();
    } catch (err: any) {
      console.error("Failed to change user status:", err);
      toast({
        variant: "destructive",
        title: "Operation failed",
        description: err?.message || 'Failed to change user status, please try again',
      });
    }
  };

  // Reset password
  const handleResetPassword = async (user: UserData) => {
    try {
      const response = await userApi.resetPassword(user.id);
      
      toast({
        title: "Password reset",
        description: `Temporary password for ${user.name}: ${response.temporaryPassword}`,
      });
    } catch (err: any) {
      console.error("Failed to reset password:", err);
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: err?.message || 'Failed to reset password, please try again',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300';
      case 'inactive': return 'bg-red-500/20 text-red-300';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page title and stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{t('user_management.title')}</h2>
          <p className="text-slate-400 mt-1">{t('user_management.subtitle')}</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('user_management.add_user')}
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-effect border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t('user_management.total_users')}</p>
                <p className="text-2xl font-bold text-white">{totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t('user_management.active_users')}</p>
                <p className="text-2xl font-bold text-green-400">{stats.active}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t('user_management.inactive_users')}</p>
                <p className="text-2xl font-bold text-red-400">{stats.inactive}</p>
              </div>
              <UserX className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{t('user_management.pending_users')}</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <Shield className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filter */}
      <Card className="glass-effect border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                placeholder={t('user_management.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 bg-slate-800/50 border-slate-600"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedRole} onValueChange={handleFilterRoleChange}>
                <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-600 text-white">
                  <SelectValue placeholder={t('user_management.select_role')} />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {roles.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="text-blue-400 border-blue-500/30"
                onClick={handleSearch}
              >
                <Filter className="w-4 h-4 mr-2" />
                {t('user_management.filter')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User list */}
      <Card className="glass-effect border-slate-700">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between py-4 border-b border-slate-700/50">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-10 h-10 rounded-full bg-slate-700" />
                    <div>
                      <Skeleton className="h-5 w-32 bg-slate-700 mb-1" />
                      <Skeleton className="h-4 w-40 bg-slate-700/70" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-20 bg-slate-700" />
                    <Skeleton className="h-8 w-20 bg-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
              <p className="text-slate-300 mb-4">Failed to load user data</p>
              <Button
                variant="outline"
                onClick={fetchUsers}
                className="text-blue-400 border-blue-500/30"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Reload
              </Button>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <Users className="w-12 h-12 text-slate-500 mb-4" />
              <p className="text-slate-400 mb-2">No users found</p>
              <p className="text-sm text-slate-500 mb-4">No users match your filters</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRole('all');
                  fetchUsers();
                }}
                className="text-blue-400 border-blue-500/30"
              >
                Clear filters
              </Button>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-slate-300 font-medium">{t('user_management.user_info')}</th>
                  <th className="text-left p-4 text-slate-300 font-medium">{t('user_management.role')}</th>
                  <th className="text-left p-4 text-slate-300 font-medium">{t('user_management.status')}</th>
                  <th className="text-left p-4 text-slate-300 font-medium">{t('user_management.last_login')}</th>
                  <th className="text-right p-4 text-slate-300 font-medium">{t('user_management.actions')}</th>
                </tr>
              </thead>
              <tbody>
                  {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">{user.name ? user.name[0] : 'U'}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-sm text-slate-400">{user.email}</p>
                            <p className="text-xs text-slate-500">{user.department || 'No department'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-blue-300 border-blue-500/30">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                        <Badge variant="secondary" className={getStatusColor(user.status)}>
                          {getStatusText(user.status)}
                        </Badge>
                    </td>
                    <td className="p-4">
                        <span className="text-slate-400 text-sm">
                          {user.lastLogin || 'Never logged in'}
                        </span>
                    </td>
                    <td className="p-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-white hover:bg-slate-700"
                            onClick={() => {
                              setSelectedUser(user);
                              setUserForm({
                                username: user.username,
                                password: '',
                                confirmPassword: '',
                                name: user.name,
                                email: user.email,
                                department: user.department || '',
                                role: user.role,
                              });
                              setEditDialogOpen(true);
                            }}
                          >
                          <Edit className="w-4 h-4" />
                        </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`${
                              user.status === 'active' ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'
                            } hover:bg-slate-700`}
                            onClick={() => handleToggleStatus(user)}
                          >
                            {user.status === 'active' ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <Unlock className="w-4 h-4" />
                            )}
                        </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-yellow-400 hover:text-yellow-300 hover:bg-slate-700"
                            onClick={() => handleResetPassword(user)}
                          >
                            <Key className="w-4 h-4" />
                        </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                            onClick={() => {
                              setSelectedUser(user);
                              setDeleteDialogOpen(true);
                            }}
                          >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
          
          {/* Pagination */}
          {!loading && !error && users.length > 0 && (
            <div className="p-4 flex justify-between items-center border-t border-slate-700">
              <div className="text-sm text-slate-400">
                {t('user_management.showing')} {users.length} {t('user_management.records')}, {t('user_management.total')} {totalUsers} {t('user_management.records')}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  className="text-slate-300 border-slate-600"
                >
                  {t('user_management.previous_page')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  className="text-slate-300 border-slate-600"
                >
                  {t('user_management.next_page')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create user dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Create New User</DialogTitle>
            <DialogDescription className="text-slate-400">
              Fill in user information to create a new account
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-md bg-red-500/20 border border-red-500/50 flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <p className="text-sm text-red-400">{formError}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">Username *</Label>
                <Input
                  id="username"
                  name="username"
                  value={userForm.username}
                  onChange={handleFormChange}
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={userForm.name}
                  onChange={handleFormChange}
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={userForm.password}
                  onChange={handleFormChange}
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={userForm.confirmPassword}
                  onChange={handleFormChange}
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userForm.email}
                  onChange={handleFormChange}
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-slate-300">Department</Label>
                <Input
                  id="department"
                  name="department"
                  value={userForm.department}
                  onChange={handleFormChange}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="role" className="text-slate-300">Role *</Label>
                <Select value={userForm.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-full bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {roles.filter(r => r.value !== 'all').map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                className="text-slate-300 border-slate-600"
                disabled={formLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={formLoading}
              >
                {formLoading ? 'Creating...' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit user dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Edit User</DialogTitle>
            <DialogDescription className="text-slate-400">
              Update user information
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditUser} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-md bg-red-500/20 border border-red-500/50 flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <p className="text-sm text-red-400">{formError}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Username</Label>
                <Input
                  value={userForm.username}
                  readOnly
                  className="bg-slate-700/50 border-slate-600 text-slate-400"
                />
                <p className="text-xs text-slate-500">Username cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-slate-300">Full Name *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={userForm.name}
                  onChange={handleFormChange}
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-slate-300">Email *</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={userForm.email}
                  onChange={handleFormChange}
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-department" className="text-slate-300">Department</Label>
                <Input
                  id="edit-department"
                  name="department"
                  value={userForm.department}
                  onChange={handleFormChange}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-role" className="text-slate-300">Role *</Label>
                <Select value={userForm.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-full bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {roles.filter(r => r.value !== 'all').map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className="text-slate-300 border-slate-600"
                disabled={formLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={formLoading}
              >
                {formLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Delete User</DialogTitle>
            <DialogDescription className="text-slate-400">
              This action cannot be undone. Please confirm deletion.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-md">
            <p className="text-white">Are you sure you want to delete user <span className="font-bold">{selectedUser?.name}</span>?</p>
            <p className="text-slate-400 mt-1 text-sm">After deletion, this user will no longer be able to access the system.</p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="text-slate-300 border-slate-600"
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={formLoading}
            >
              {formLoading ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}