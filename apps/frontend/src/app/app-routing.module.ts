import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; // CLI imports router
import { AuthGuard } from './authent/authent.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { NotFoundModule } from './not-found/not-found.module';
import { PlanningUserComponent } from './planning-user/planning-user.component';
import { PlanningUserModule } from './planning-user/planning-user.module';
import { PlanningComponent } from './planning/planning.component';
import { PlanningModule } from './planning/planning.module';
import { ToBeDefinedComponent } from './to-be-defined/to-be-defined.component';
import { ToBeDefinedModule } from './to-be-defined/to-be-defined.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/planning',
    pathMatch: 'full',
  },
  {
    path: 'planning',
    component: PlanningComponent,
    canActivate: [AuthGuard],
    data: {
      label: 'Planning',
      menu: true,
      icon: 'home',
      authenticate: true,
      onlyAdmin: false,
    },
  },
  {
    path: 'courses',
    component: PlanningUserComponent,
    canActivate: [AuthGuard],
    data: {
      label: 'Cours',
      menu: true,
      icon: 'academic-cap',
      authenticate: true,
      onlyAdmin: false,
    },
  },
  {
    path: 'profile',
    component: ToBeDefinedComponent,
    canActivate: [AuthGuard],
    data: {
      label: 'Profile',
      userMenu: true,
      authenticate: true,
      onlyAdmin: false,
    },
  },
  {
    path: 'login',
    redirectTo: '/planning',
    pathMatch: 'full',
    data: {
      label: 'Login',
      userMenu: true,
      authenticate: false,
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
  imports: [RouterModule.forRoot(routes), PlanningModule, PlanningUserModule, ToBeDefinedModule, NotFoundModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
