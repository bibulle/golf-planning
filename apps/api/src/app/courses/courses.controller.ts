import { Course } from '@golf-planning/api-interfaces';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {

  constructor(private readonly _coursesService: CoursesService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getCourses(): Promise<Course[]> {
    return this._coursesService.getData()
  }
}
