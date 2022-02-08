import { Course, User } from '@golf-planning/api-interfaces';
import { Body, Controller, Get, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CoursesService } from './courses.service';

@Controller()
export class CoursesController {
  private readonly logger = new Logger(CoursesController.name);

  constructor(private readonly _coursesService: CoursesService) {}

  @Get('planning')
  @UseGuards(AuthGuard('jwt'))
  async getPlanning(): Promise<Course[]> {
    return this._coursesService.getPlanning();
  }
  @Get('courses')
  @UseGuards(AuthGuard('jwt'))
  async getCourses(): Promise<Course[]> {
    return this._coursesService.getCourse();
  }
  @Get('courses/:userName')
  @UseGuards(AuthGuard('jwt'))
  async getCoursesUser(@Param('userName') userName: string): Promise<Course[]> {
    return this._coursesService.getCourse(userName);
  }
  @Post('courses/register')
  @UseGuards(AuthGuard('jwt'))
  async registerUser(@Body() data: { courseId: string; golfId: string; userIndex: number }) {
    // this.logger.debug(data);
    return this._coursesService
      .registerUser(data.courseId, data.golfId, data.userIndex)
      .catch((err) => {
        // this.logger.debug(err);
        // this.logger.debug('400');
        return Promise.reject({"statusCode":400,"message":err});
      })
      .then((v) => {
        // this.logger.debug(v);
        // this.logger.debug('200');
        return {"statusCode":200,"message":"Done1"};
      });
  }

  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  async getUsers(): Promise<User[]> {
    const users = this._coursesService.getUsers().map((u) => {
      const nu: User = { ...u };
      nu.academiergolf_password = undefined;
      return nu;
    });
    return users;
  }
}
