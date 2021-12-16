import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { CourseListComponent } from './courses/course-list/course-list.component';
import { CourseModule } from './courses/courses.module';
import { ToBeDefinedModule } from './to-be-defined/to-be-defined.module';
import { NotFoundModule } from './not-found/not-found.module';
import { ToBeDefinedComponent } from './to-be-defined/to-be-defined.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/planning',
    pathMatch: 'full',
  },
  {
    path: 'planning',
    component: CourseListComponent,
    //canActivate: [AuthGuard],
    data: {
      label: 'Planning',
      menu: true,
      iconType: 'icon',
      icon: 'home',
      onlyAdmin: false,
    },
  },
  {
    path: 'courses',
    component: ToBeDefinedComponent,
    //canActivate: [AuthGuard],
    data: {
      label: 'Cours',
      menu: true,
      iconType: 'icon',
      icon: 'academic-cap',
      onlyAdmin: false,
    },
  },
  {
    path: 'profile',
    component: ToBeDefinedComponent,
    //canActivate: [AuthGuard],
    data: {
      label: 'Profile',
      userMenu: true,
      //iconType: 'icon',
      //icon: 'academic-cap',
      onlyAdmin: false,
    },
  },
  // Show the 404 page for any routes that don't exist.
  {
    path: '**',
    component: NotFoundComponent,
    data: {
      label: 'route.not-found',
      menu: false,
    },
  }
];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes), CourseModule, ToBeDefinedModule, NotFoundModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
