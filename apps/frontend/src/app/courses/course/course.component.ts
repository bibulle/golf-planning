import { Component, Input, OnInit } from '@angular/core';
import { Course } from '@golf-planning/api-interfaces';

@Component({
  selector: 'golf-planning-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent {
  @Input() course!: Course;

  @Input() firstCourseOfDay = true;

  // ngOnInit(): void {
    // console.log(this.course);
    // console.log(this.firstCourseOfDay);
  // }
}
