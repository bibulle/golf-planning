import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { CourseListComponent } from './courses/course-list/course-list.component';

const routes: Routes = [
    {path: 'courses', component: CourseListComponent},
    {path: '', redirectTo: '/courses', pathMatch: 'full'}
  ];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }