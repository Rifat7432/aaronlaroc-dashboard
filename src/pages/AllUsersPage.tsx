/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
} from "../redux/features/user/userApi";

const LIMIT = 10;

interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  joinDate: string;
  lastLogin: string;
}

interface UserForm {
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

const AllUsers: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    setValue: setEditValue,
  } = useForm<UserForm>();

  const { data } = useGetAllUsersQuery({
    pageNo:page,
    perPage: LIMIT,
    searchKeyword: searchTerm || undefined,
  });

  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users: User[] =
    data?.data.rows.map((u: any, i: number) => ({
      _id: u._id,
      id: i+1,
      name: u.email.split("@")[0], // using email as name placeholder
      email: u.email,
      phone: u.phoneNumber,
      role: u.role === "USER" ? "User" : u.role,
      status: "Active",
      joinDate: new Date(u.createdAt).toLocaleDateString(),
    })) ?? [];

  // Prefill edit form when user selected
  useEffect(() => {
    if (selectedUser && showEditModal) {
      setEditValue("name", selectedUser.name);
      setEditValue("email", selectedUser.email);
      setEditValue("phone", selectedUser.phone);
      setEditValue("status", selectedUser.status);
    }
  }, [selectedUser, showEditModal, setEditValue]);

  const onEditSubmitHandler = async (form: UserForm) => {
    if (!selectedUser) return;
    try {
      const res: any = await updateUser({
        id: selectedUser._id,
        body: {
          email: form.email,
          phoneNumber: form.phone,
          role: form.role.toUpperCase(),
        },
      });
      if (res?.error) {
        toast.error(res.error?.data?.message || "Failed to update user");
      } else {
        toast.success("User updated successfully");
      }
    } catch {
      toast.error("Error updating user");
    }
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      const res: any = await deleteUser(selectedUser._id);
      if (res?.error) {
        toast.error(res.error?.data?.message || "Failed to delete user");
      } else {
        toast.success("User deleted successfully");
      }
    } catch {
      toast.error("Error deleting user");
    }
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <p className="text-gray-600 text-sm mb-2">New Users</p>
          <p className="text-4xl font-bold text-sky-900 mb-2">
            {data?.data.rows.length ?? 0}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <p className="text-gray-600 text-sm mb-2">Active Users</p>
          <p className="text-4xl font-bold text-sky-900 mb-2">
            {data?.data.rows.length ?? 0}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <p className="text-gray-600 text-sm mb-2">Inactive Users</p>
          <p className="text-4xl font-bold text-sky-900 mb-2">0</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-xl font-bold text-sky-800">All Users</h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-900 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "Admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "Manager"
                          ? "bg-sky-100 text-sky-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.joinDate}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEditModal(true);
                      }}
                      className="text-sky-800 hover:text-sky-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center p-4">
          <span className="text-sm text-gray-600">
            Page {data?.data.currentPage ?? 1} of {data?.data.totalPages ?? 1}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={page === data?.data.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* DELETE / EDIT / ADD MODALS */}
      {/* Use your existing JSX for modals here, but replace form handlers with RHF submit functions */}
      {/* ... */}
      {/* Add User modal */}

      {/* Edit User modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Edit User</h3>
            </div>
            <form onSubmit={handleEditSubmit(onEditSubmitHandler)}>
              <div className="p-6 space-y-4">
                <input
                  {...editRegister("name")}
                  placeholder="Name"
                  className="border p-2 w-full rounded"
                />
                <input
                  {...editRegister("email")}
                  placeholder="Email"
                  className="border p-2 w-full rounded"
                />
                <input
                  {...editRegister("phone")}
                  placeholder="Phone"
                  className="border p-2 w-full rounded"
                />
                <select
                  {...editRegister("status")}
                  className="border p-2 w-full rounded"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 border p-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-sky-800 text-white p-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Delete User
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{selectedUser.name}</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 border p-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white p-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
