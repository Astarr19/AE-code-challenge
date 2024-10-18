-- CREATE TABLE
DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (
    account_number INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    amount INTEGER NOT NULL,
    type VARCHAR NOT NULL,
    credit_limit INTEGER
);

DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    amount INTEGER,
    transaction_date TIMESTAMP WITH TIME ZONE,
    type VARCHAR NOT NULL,
    account_number INTEGER
);

ALTER TABLE accounts ADD CONSTRAINT verify_type
CHECK (type IN ('checking', 'savings', 'credit'));

ALTER TABLE transactions ADD CONSTRAINT verify_type
CHECK (type IN ('withdrawal', 'deposit'));

ALTER TABLE transactions ADD CONSTRAINT fk_accounts
FOREIGN KEY (account_number)
    REFERENCES accounts(account_number);

-- LOAD DATAS
INSERT INTO accounts 
    (account_number, name, amount, type)
VALUES
    (1, 'Johns Checking', 350, 'checking'),
    (2, 'Janes Savings', 2000, 'savings'),
    (4, 'Bobs Checking', 40000, 'checking'),
    (5, 'Bills Savings', 50000, 'savings'),
    (7, 'Nancy Checking', 70000, 'checking'),
    (8, 'Nancy Savings', 80000, 'savings');

INSERT INTO accounts
    (account_number, name, amount, type, credit_limit)
VALUES
    (3, 'Jills Credit', -200, 'credit', 10000),
    (6, 'Bills Credit', -60000, 'credit', 60000),
    (9, 'Nancy Credit', -90000, 'credit', 100000);

INSERT INTO transactions
    (amount, transaction_date, type, account_number)
VALUES
    (400, NOW() - INTERVAL '48 HOURS', 'withdrawal', 1),
    (250, NOW() - INTERVAL '23 HOURS' - INTERVAL '58 MINUTES', 'withdrawal', 1);