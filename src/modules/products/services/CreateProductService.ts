import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    if (!name) {
      throw new AppError('Name field is mandatory.');
    }

    if (!price) {
      throw new AppError('Price field is mandatory.');
    }

    if (!quantity) {
      throw new AppError('Quantity field is mandatory.');
    }

    const nameAlreadyExists = await this.productsRepository.findByName(name);

    if (nameAlreadyExists) {
      throw new AppError('Name already exists.');
    }

    const product = await this.productsRepository.create({
      name,
      price,
      quantity,
    });

    return product;
  }
}

export default CreateProductService;
