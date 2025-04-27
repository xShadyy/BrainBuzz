export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string; // Optional in responses, required in registration
  creationDate?: number; // Timestamp of account creation
  level?: number; // User's current level
  xp?: number; // User's current experience points
}

export interface DatabaseModule {
  addUser(user: Omit<User, 'id'>): Promise<number>;
  getUsers(): Promise<User[]>;
  getUserById(userId: number): Promise<User | null>;
  updateUser(user: User): Promise<boolean>;
  deleteUser(userId: number): Promise<boolean>;
  deleteAllUsers(): Promise<boolean>;

  // Authentication methods
  registerUser(user: {
    name: string;
    email: string;
    password: string;
  }): Promise<User>;
  loginUser(email: string, password: string): Promise<User>;
}
