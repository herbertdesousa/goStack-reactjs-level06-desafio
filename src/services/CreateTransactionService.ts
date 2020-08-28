import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionRepository.getBalance();
    if (total <= value && type === 'outcome') {
      throw new AppError('No balance available');
    }

    const checkCategoryExist = await categoryRepository.findOne({
      where: { title: category },
    });

    if (checkCategoryExist) {
      const transaction = transactionRepository.create({
        title,
        value,
        type,
        category: checkCategoryExist,
      });
      await transactionRepository.save(transaction);

      return transaction;
    }

    const newCategory = categoryRepository.create({
      title: category,
    });
    await categoryRepository.save(newCategory);

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: newCategory,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
