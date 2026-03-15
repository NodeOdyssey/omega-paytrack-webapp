export type UserRole =
  | 'Admin'
  | 'DevAdmin'
  | 'Recruitment'
  | 'Sales'
  | 'HR'
  | 'Accounts'
  | 'Operation';

export type User = {
  ID: number;
  name: string;
  username: string;
  email?: string | null;
  passwordHash: string;
  role: UserRole;
  userVerified?: boolean | null;
  profilePhoto?: string | null;
  status: 'active' | 'inactive';
  createdAt?: Date | null;
  updatedAt?: Date | null;
};
