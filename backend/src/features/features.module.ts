import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [UsersModule, AuthModule, ProjectsModule, FilesModule],
  exports: [UsersModule, AuthModule, ProjectsModule, FilesModule],
})
export class FeaturesModule {}
