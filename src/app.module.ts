import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CategoryService } from './category/category.service';
import { CategoryModule } from './category/category.module';

import { Product } from './products/product.entity';
import { Category } from './category/category.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'DUCLUONG2k4?',
      database: 'demost22c',
      autoLoadEntities: true, // Dùng để tự động load entity
      entities: [Product, Category],
      synchronize: true,
    }),
    // MongooseModule.forRoot('mongodb://localhost/demonestIT22C'),
    // UsersModule,
    ProductsModule,
    CategoryModule, // ✅ Module này sẽ tự quản lý ProductsController
  ],
  controllers: [AppController], // ✅ Đúng
  providers: [AppService, ],
})
export class AppModule {}
