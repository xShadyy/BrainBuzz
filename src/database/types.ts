export interface User {
  id?: number;
  name: string;
  email: string;
}

export interface DatabaseModule {
  addUser(user: Omit<User, 'id'>): Promise<number>;
  getUsers(): Promise<User[]>;
  getUserById(userId: number): Promise<User | null>;
  updateUser(user: User): Promise<boolean>;
  deleteUser(userId: number): Promise<boolean>;
  deleteAllUsers(): Promise<boolean>;
}
