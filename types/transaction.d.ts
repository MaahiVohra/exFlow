type Transaction = {
  id?: string;
  name?: string;
  description?: string;
  amount?: number;
  transactionDate?: Date;

  user?: User;
  type?: IdName;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};
