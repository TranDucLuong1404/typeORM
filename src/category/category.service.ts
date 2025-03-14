import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getOneById(id: number): Promise<Category | null> {
    return await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });
  }

  async getAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      relations: ['products'],
    });
  }

  async create(createCategoryDto: { name: string; description: string }): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async update(id: number, updateCategoryDto: { name?: string; description?: string }): Promise<Category | null> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      return null;
    }
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async delete(id: number): Promise<{ affected: number }> {
    const result = await this.categoryRepository.delete(id);
    return { affected: result.affected ?? 0 }; // Default to 0 if affected is undefined
  }
}