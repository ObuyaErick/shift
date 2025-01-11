import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StaffModule } from './modules/tenanted/staff/staff.module';
import { StudentsModule } from './modules/tenanted/students/students.module';
import { AuthModule } from './modules/public/auth/auth.module';

@Module({
  imports: [StudentsModule, StaffModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
