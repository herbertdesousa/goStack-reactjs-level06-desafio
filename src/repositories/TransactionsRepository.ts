import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const allRepositories = await this.find();

    const { income, outcome } = allRepositories.reduce(
      (total, transaction) => {
        switch (transaction.type) {
          case 'income':
            total.income += Number(transaction.value);
            break;
          case 'outcome':
            total.outcome += Number(transaction.value);
            break;
          default:
            break;
        }
        return total;
      },
      { income: 0, outcome: 0, total: 0 },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
