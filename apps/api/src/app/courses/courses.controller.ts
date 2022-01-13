import { Course } from '@golf-planning/api-interfaces';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CoursesService } from './courses.service';

@Controller()
export class CoursesController {

  constructor(private readonly _coursesService: CoursesService) {}

  @Get('planning')
  @UseGuards(AuthGuard('jwt'))
  async getPlanning(): Promise<Course[]> {
    return this._coursesService.getPlanning()
  }
  @Get('courses')
  @UseGuards(AuthGuard('jwt'))
  async getCourses(): Promise<Course[]> {
    return this._coursesService.getCourse()
  }
  @Get('courses/:userName')
  @UseGuards(AuthGuard('jwt'))
  async getCoursesUser(@Param('userName') userName:string): Promise<Course[]> {
    return this._coursesService.getCourse(userName)
  }

}
