export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  creationDate?: number;
  level?: number;
  xp?: number;
}

export interface DatabaseModule {
  addUser(user: Omit<User, 'id'>): Promise<number>;
  getUsers(): Promise<User[]>;
  getUserById(userId: number): Promise<User | null>;
  updateUser(user: User): Promise<boolean>;
  deleteUser(userId: number): Promise<boolean>;
  deleteAllUsers(): Promise<boolean>;

  registerUser(user: {
    name: string;
    email: string;
    password: string;
  }): Promise<User>;
  loginUser(email: string, password: string): Promise<User>;

  awardXP(userId: number, xpAmount: number): Promise<User | null>;
}
