import { Component, Input } from '@angular/core';
import { Course, User } from '@golf-planning/api-interfaces';

@Component({
  selector: 'golf-planning-course-item',
  templateUrl: './course-item.component.html',
  styleUrls: ['./course-item.component.scss'],
})
export class CourseItemComponent {
  @Input() course!: Course;

  @Input() firstCourseOfDay = true;

  @Input() users: User[] = [];

  isUser(index:number): boolean {
    return this.course.users.some(u => {
      return u.academiergolf_index === index
    });
  }

}
