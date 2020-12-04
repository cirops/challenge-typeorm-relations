import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: IRequest): Promise<Customer> {
    if (!name) {
      throw new AppError('Name field is mandatory.');
    }
    if (!email) {
      throw new AppError('Email field is mandatory.');
    }

    const emailAlreadyExists = await this.customersRepository.findByEmail(
      email,
    );

    if (emailAlreadyExists) {
      throw new AppError('Email already exists.');
    }

    const customer = await this.customersRepository.create({ name, email });

    return customer;
  }
}

export default CreateCustomerService;
