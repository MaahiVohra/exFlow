type User = {
  id?: string;
  name?: string;
  email?: string;
  expenses?: Expense[];
  incomes?: Income[];
  createdAt?: Date;
};

type AuthToken = {
  token: string;
  expiresIn: number;
  user: User;
};

type LoginRequest = {
  email: string;
  password: string;
};

type RegisterRequest = {
  name: string;
} & LoginRequest;
