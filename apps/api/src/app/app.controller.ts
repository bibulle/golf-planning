import { Course } from '@golf-planning/api-interfaces';
import { Controller, Get } from '@nestjs/common';
import { CoursesService } from './courses/courses.service';

@Controller()
export class AppController {
  constructor(private readonly _coursesService: CoursesService) {}

  @Get('courses')
  getData(): Course[] {
    return this._coursesService.getData();
  }
}
