import { query } from "../utils/db";
import { getAccount } from "./accountHandler";

export const withdrawal = async (accountID: string, amount: number) => {
  const account = await getAccount(accountID);
  const newDailyTotal = parseFloat(account.daily_limit) + amount;
  if (newDailyTotal > 400) {
    throw new Error(`Transaction exceeds daily withdrawal limit of $400: $${newDailyTotal}/$400`);
  }
  
  await query(`
    INSERT INTO transactions
      (amount, transaction_date, type, account_number)
    VALUES
      ($1, NOW(), 'withdrawal', $2);`,
      [amount, accountID]
  );

  account.amount -= amount;
  const res = await query(`
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [account.amount, accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Transaction failed");
  }

  return account;
}

export const deposit = async (accountID: string, amount: number) => {
  const account = await getAccount(accountID);

  // Update transactions table before updating account
  await query(`
    INSERT INTO transactions
      (amount, transaction_date, type, account_number)
    VALUES
      ($1, NOW(), 'deposit', $2);`,
      [amount, accountID]
  );

  account.amount += amount; 
  const res = await query(`
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [account.amount, accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Transaction failed");
  }

  return account;
}