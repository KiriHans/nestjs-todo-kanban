import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/entity/tasks.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: '123',
      username: 'postgres',
      database: 'pgWithNest',
      entities: [Task],
      synchronize: true,
      logging: true,
    }),
    ConfigModule.forRoot({}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
