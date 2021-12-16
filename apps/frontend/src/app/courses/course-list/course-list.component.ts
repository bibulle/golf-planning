import { Component, OnInit } from '@angular/core';
import { Course } from '@golf-planning/api-interfaces';
import { CourseService } from '../course.service';

@Component({
  selector: 'golf-planning-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

  courses:Course[] =[];

  constructor(private _courseService: CourseService) { }

  ngOnInit(): void {

    this._courseService.getCourses().subscribe( courses => {
      this.courses = courses;
    })
  }

  isFirstCourseOfDay(index: number): boolean {
    if (index <= 0) {
      return true
    }

    //console.log(`${this.courses[index].date.toLocaleString()} <-> ${this.courses[index+1].date.toLocaleString()} => ${this.courses[index].date.getDay() !== this.courses[index+1].date.getDay()}`);
    return this.courses[index-1].date.getDay() !== this.courses[index].date.getDay();
  }

}
