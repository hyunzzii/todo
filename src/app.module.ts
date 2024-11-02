import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TagModule } from './tags/tags.module';
import { JwtAuthModule } from './auth/jwt/jwt.module';
import { TodosModule } from './todos/todos.moduel';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/todo'), // MongoDB 연결 URI 설정
    UsersModule,
    AuthModule,
    TagModule,
    JwtAuthModule,
    TodosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
