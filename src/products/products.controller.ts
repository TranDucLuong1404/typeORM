import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';

export interface ProductParams {
  name: string;
  description: string;
  image: string;
  price: number;
}

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get('')
  async index() {
    const products = await this.productService.getAll();
    return { message: 'hello', data: products };
  }

  @Get('/:id')
  async detail(@Param('id') id: number) {
    const product = await this.productService.getDetail(id);
    return { message: 'Data', data: product };
  }

  @Post('/')
  async create(@Body() body: ProductParams) {
    const product = await this.productService.createProduct(body);
    return { message: 'Product created', data: product };
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() body: ProductParams) {
    const updatedProduct = await this.productService.updateProduct(id, body);
    return { message: 'Product updated', data: updatedProduct };
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    await this.productService.deleteProduct(id);
    return { message: 'Product deleted' };
  }
}
