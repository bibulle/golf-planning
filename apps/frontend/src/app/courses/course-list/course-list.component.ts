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

}
