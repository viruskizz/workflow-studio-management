import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeaturesModule } from './features/features.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: +configService.get<number>('DB_PORT') || 5432,
        username: configService.get('DB_USERNAME') || 'root',
        password: configService.get('DB_PASSWORD') || '424242',
        database: configService.get('DB_NAME') || 'postgres',
        entities: entities,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    FeaturesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
