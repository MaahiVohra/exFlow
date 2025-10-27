import db from "@/lib/db";

export const getTransactions = async (): Promise<Transaction[]> => {
  const query = `
    SELECT
      id,
      name,
      description,
      amount,
      transaction_date AS "transactionDate",
      json_build_object('id', type_id) AS type,
      json_build_object('id', user_id) AS user
    FROM transactions
    WHERE deleted_at IS NULL;
  `;

  const transactions = await db.query(query);

  return transactions.rows as Transaction[];
};

export const getTransactionById = async (
  id: string,
): Promise<Transaction | null> => {
  const query = `
    SELECT
      id,
      name,
      description,
      amount,
      transaction_date AS "transactionDate",
      json_build_object('id', type_id) AS type,
      json_build_object('id', user_id) AS user
    FROM transactions
    WHERE id = $1 AND deleted_at IS NULL
    LIMIT 1;
  `;

  const transaction = await db.query(query, [id]);

  if (transaction.rows.length === 0) {
    return null;
  }

  return transaction.rows[0] as Transaction;
};

export const addTransaction = async (transaction: Transaction) => {
  const { name, description, amount, transactionDate, type, user } =
    transaction;
  await db.query(
    "INSERT INTO transactions (name, description, amount, transaction_date, type_id, user_id) VALUES ($1, $2, $3, $4, $5, $6)",
    [name, description, amount, transactionDate, type!.id, user!.id],
  );
};

export const deleteTransaction = async (id: string) => {
  return await db.query(
    "UPDATE transactions SET deleted_at = NOW() WHERE id = $1",
    [id],
  );
};
