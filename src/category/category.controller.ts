import { Controller, Get, Param, Post, Body, Put, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  // GET /category/:id - Retrieve a category and its products
  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    const categoryId = +id; // Convert string to number
    const category = await this.categoryService.getOneById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    const products = category.products || [];
    return {
      message: `Retrieved category with ID ${id}`,
      data: {
        category: {
          id: category.id,
          name: category.name,
          description: category.description,
        },
        products,
      },
    };
  }

  // GET /category - Retrieve all categories
  @Get()
  async getAllCategories() {
    const categories = await this.categoryService.getAll();
    return {
      message: 'Retrieved all categories',
      data: categories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
      })),
    };
  }

  // POST /category - Create a new category
  @Post()
  async createCategory(@Body() createCategoryDto: { name: string; description: string }) {
    const { name, description } = createCategoryDto;
    if (!name || !description) {
      throw new BadRequestException('Name and description are required');
    }
    const newCategory = await this.categoryService.create({ name, description });
    return {
      message: 'Category created successfully',
      data: {
        id: newCategory.id,
        name: newCategory.name,
        description: newCategory.description,
      },
    };
  }

  // PUT /category/:id - Update a category
  @Put(':id')
  async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: { name?: string; description?: string }) {
    const categoryId = +id;
    const { name, description } = updateCategoryDto;
    const updatedCategory = await this.categoryService.update(categoryId, { name, description });
    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return {
      message: `Category with ID ${id} updated successfully`,
      data: {
        id: updatedCategory.id,
        name: updatedCategory.name,
        description: updatedCategory.description,
      },
    };
  }

  // DELETE /category/:id - Delete a category (with constraint)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    const categoryId = +id;
    const category = await this.categoryService.getOneById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    if (category.products && category.products.length > 0) {
      throw new BadRequestException(`Cannot delete category with ID ${id} because it has associated products`);
    }
    const result = await this.categoryService.delete(categoryId);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return {
      message: `Category with ID ${id} deleted successfully`,
    };
  }
}