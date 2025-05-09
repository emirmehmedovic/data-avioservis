import apiClient from '../config/api';

export enum UserRole {
  ADMIN = 'Admin',
  SERVISER = 'Serviser',
  PREGLEDNIK = 'Preglednik',
}

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  role?: UserRole;
}

// API service functions
const userService = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<{ status: string; data: { users: User[] } }>('/users');
    return response.data.data.users;
  },

  // Get a single user by ID
  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get<{ status: string; data: { user: User } }>(`/users/${id}`);
    return response.data.data.user;
  },

  // Create a new user
  create: async (data: CreateUserDto): Promise<User> => {
    const response = await apiClient.post<{ status: string; data: { user: User } }>('/users', data);
    return response.data.data.user;
  },

  // Update an existing user
  update: async (id: number, data: UpdateUserDto): Promise<User> => {
    const response = await apiClient.put<{ status: string; data: { user: User } }>(`/users/${id}`, data);
    return response.data.data.user;
  },

  // Delete a user
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  }
};

export default userService; 