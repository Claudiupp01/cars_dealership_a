// frontend/src/pages/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Shield,
  User as UserIcon,
  Crown,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getAllUsers, updateUserRole, deleteUser } from "../services/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/");
      return;
    }
    loadUsers();
  }, [currentUser, navigate]);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      alert("Failed to load users: " + error.message);
    }
    setLoading(false);
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    // Filter by search term (name, username, or email)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.username.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          (u.full_name && u.full_name.toLowerCase().includes(term))
      );
    }

    setFilteredUsers(filtered);
  };

  const handleRoleChange = async (userId, newRole) => {
    if (userId === currentUser.id) {
      alert("You cannot change your own role");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to change this user's role to ${newRole}?`
      )
    ) {
      return;
    }

    try {
      await updateUserRole(userId, newRole);
      loadUsers();
      alert("User role updated successfully");
    } catch (error) {
      alert("Failed to update role: " + error.message);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (userId === currentUser.id) {
      alert("You cannot delete yourself");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete user "${username}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteUser(userId);
      loadUsers();
      alert(`User ${username} deleted successfully`);
    } catch (error) {
      alert("Failed to delete user: " + error.message);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="w-5 h-5 text-red-600" />;
      case "owner":
        return <Crown className="w-5 h-5 text-yellow-600" />;
      default:
        return <UserIcon className="w-5 h-5 text-blue-600" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700";
      case "owner":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12">Loading users...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Admin Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          User Management
        </h1>
        <p className="text-slate-600">Total users: {users.length}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, username, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="owner">Owners</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter((u) => u.role === "user").length}
            </div>
            <div className="text-sm text-slate-600">Users</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {users.filter((u) => u.role === "owner").length}
            </div>
            <div className="text-sm text-slate-600">Owners</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {users.filter((u) => u.role === "admin").length}
            </div>
            <div className="text-sm text-slate-600">Admins</div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                User
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                Email
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                Current Role
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                Status
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                      {getRoleIcon(user.role)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {user.username}
                      </div>
                      <div className="text-sm text-slate-500">
                        {user.full_name || "No name"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.is_active ? (
                    <span className="text-green-600 text-sm">Active</span>
                  ) : (
                    <span className="text-red-600 text-sm">Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end space-x-2">
                    {user.id === currentUser.id ? (
                      <span className="text-xs text-slate-400 italic px-3 py-1">
                        You
                      </span>
                    ) : (
                      <>
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          className="px-3 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        >
                          <option value="user">User</option>
                          <option value="owner">Owner</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() =>
                            handleDeleteUser(user.id, user.username)
                          }
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition"
                          title="Delete user"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">No users found</p>
            <p className="text-slate-500 text-sm mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
