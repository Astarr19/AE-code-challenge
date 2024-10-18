import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react"
import {account} from "../Types/Account"
import Paper from "@mui/material/Paper/Paper";
import { Button, Card, CardContent, Grid, TextField } from "@mui/material";

type AccountDashboardProps = {
  account: account;
  setAccount: Dispatch<SetStateAction<account | undefined>>
  signOut: () => Promise<void>;
}

export const AccountDashboard = (props: AccountDashboardProps) => {
  const [depositAmount, setDepositAmount] = useState(0);
  const [depositError, setDepositError] = useState<string>('')
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [withdrawError, setWithdrawError] = useState<string>('')

  const {account, setAccount, signOut} = props;

  const handleInputChange = (amount: number, type: 'deposit' | 'withdraw'): void => {
    // Deleting the entire input sends NaN as the value
    amount = isNaN(amount) ? 0 : amount;

    switch(type) {
      case 'deposit':
        if (amount <= 0) {
          setDepositError('Number must be positive')
        } else if (amount > 1000) {
          setDepositError('Exceeds max withdraw amount: $1,000 for single transaction');
          break
        } else if (account.type === 'credit' && account.amount + amount > 0) {
          setDepositError('Cannot deposit more than your remaining balance');
          break
        } else {
          setDepositError('')
        }
        setDepositAmount(amount);
        break;

      case 'withdraw':
        if (amount <= 0) {
          setWithdrawError('Number must be positive')
        } else if (amount > 200) {
          setWithdrawError('Exceeds max withdraw amount: $200 for single transaction');
          break;
        } else if (amount % 5 !== 0) {
          setWithdrawError('Withdraw amount must be dispensable in five dollar bills');
          break;
        } else if (account.type !== 'credit' && account.amount - amount < 0) {
          setWithdrawError('Cannot withdraw more than your remaining balance');
          break;
        } else if (account.type === 'credit' && Math.abs(account.amount) + amount > account.creditLimit) {
          setWithdrawError('Cannot withdraw more than your credit limit');
          break;
        } else {
          setWithdrawError('');
        }
        setWithdrawAmount(amount);
        break;

      default:
        break;
    }
  }

  const depositFunds = async () => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({amount: depositAmount})
    }
    const response = await fetch(`http://localhost:3000/transactions/${account.accountNumber}/deposit`, requestOptions);
    const data = await response.json();
    if (data.error) {
      setDepositError(data.error);
      return;
    }

    setAccount({
      accountNumber: data.account_number,
      name: data.name,
      amount: data.amount,
      type: data.type,
      creditLimit: data.credit_limit
    });
  }

  const withdrawFunds = async () => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({amount: withdrawAmount})
    }
    const response = await fetch(`http://localhost:3000/transactions/${account.accountNumber}/withdraw`, requestOptions);
    const data = await response.json();
    if (data.error) {
      setWithdrawError(data.error);
      return;
    }

    setAccount({
      accountNumber: data.account_number,
      name: data.name,
      amount: data.amount,
      type: data.type,
      creditLimit: data.credit_limit
    });
  }

  return (
    <Paper className="account-dashboard">
      <div className="dashboard-header">
        <h1>Hello, {account.name}!</h1>
        <Button variant="contained" onClick={signOut}>Sign Out</Button>
      </div>
      <h2>Balance: ${account.amount}</h2>
      <Grid container spacing={2} padding={2}>
        <Grid item xs={6}>
          <Card className="deposit-card">
            <CardContent>
              <h3>Deposit</h3>
              <TextField 
                label="Deposit Amount" 
                variant="outlined"
                error={!!depositError}
                helperText={depositError}
                type="number"
                sx={{
                  display: 'flex',
                  margin: 'auto',
                }}
                onChange={(e) => handleInputChange(parseFloat(e.target.value), 'deposit')}
              />
              <Button 
                variant="contained" 
                disabled={!!depositError || !depositAmount}
                sx={{
                  display: 'flex', 
                  margin: 'auto', 
                  marginTop: 2}}
                onClick={depositFunds}
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className="withdraw-card">
            <CardContent>
              <h3>Withdraw</h3>
              <TextField 
                label="Withdraw Amount" 
                variant="outlined" 
                error={!!withdrawError}
                helperText={withdrawError}
                type="number"
                sx={{
                  display: 'flex',
                  margin: 'auto',
                }}
                onChange={(e) => handleInputChange(parseFloat(e.target.value), 'withdraw')}
              />
              <Button 
                variant="contained"
                disabled={!!withdrawError || !withdrawAmount}
                sx={{
                  display: 'flex', 
                  margin: 'auto', 
                  marginTop: 2
                }}
                onClick={withdrawFunds}
                >
                  Submit
                </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
    
  )
}