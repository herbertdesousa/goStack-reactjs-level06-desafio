import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';

import AppError from '../errors/AppError';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    const ifIdExists = await transactionRepository.findOne({
      where: { id },
    });

    if (!ifIdExists) {
      throw new AppError('Id Not Exists');
    }

    await transactionRepository.remove(ifIdExists);
  }
}

export default DeleteTransactionService;
