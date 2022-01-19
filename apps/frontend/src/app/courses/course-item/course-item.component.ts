import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Course, User } from '@golf-planning/api-interfaces';

@Component({
  selector: 'golf-planning-course-item',
  templateUrl: './course-item.component.html',
  styleUrls: ['./course-item.component.scss'],
})
export class CourseItemComponent implements OnChanges {
  @Input() course!: Course;

  @Input() users: User[] = [];

  isInThePast = true;

  ngOnChanges(): void {
    // console.log('OnChange');

    const courseDate = this.course.date;
    const split = this.course.hour.split(':');
    courseDate.setHours(+split[0]);
    courseDate.setMinutes(+split[1]);
    // console.log(`${courseDate} ${this.course.hour} ${new Date()}`);
    this.isInThePast = courseDate.getTime() < new Date().getTime();
  }

  isUser(index: number): boolean {
    return this.course.users.some((u) => {
      return u.academiergolf_index === index;
    });
  }

}
