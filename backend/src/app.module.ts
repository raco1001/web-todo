import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './apis/auth/auth.module';
import { HomeModule } from './apis/home/home.module';
import { TeamModule } from './apis/team/team.module';
import { ListModule } from './apis/todolists/todolists.module';
import { Users } from './entities/Users';
import { Teams } from './entities/Teams';
import { TeamUsers } from './entities/TeamUsers';
import { Todolists } from './entities/Todolists';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql', // MariaDB는 mysql 타입
      host: process.env.DB_HOST || 'mariadb_service', // Docker 내부 서비스명
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'root',
      database: process.env.DB_NAME || 'todolist',
      entities: [Users, Teams, TeamUsers, Todolists], // 엔티티 경로
      autoLoadEntities: true, // 엔티티 자동 로드
      synchronize: false, // 개발 환경에서만 true (운영에서는 false)
      logging: true,
    }),
    TypeOrmModule.forFeature([Users, Teams, TeamUsers, Todolists]),
    AuthModule,
    HomeModule,
    TeamModule,
    ListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
