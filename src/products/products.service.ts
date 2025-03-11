import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductParams } from './products.controller';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async getAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async getDetail(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  async createProduct(params: ProductParams): Promise<Product> {
    const productNew = this.productRepository.create({
      name: params.name,
      image: params.image,
      description: params.description,
      price: params.price,
      quantity: 124,
      status: true,
    });

    return await this.productRepository.save(productNew);
  }

  async updateProduct(id: number, params: ProductParams): Promise<Product> {
    const product = await this.getDetail(id);
    Object.assign(product, params);
    await this.productRepository.save(product);
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Product with ID ${id} not found`);
  }
}
