import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { FilterComponent } from './filter.component';



@NgModule({
  declarations: [
    FilterComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule
  ],
  exports: [
    FilterComponent
  ]
})
export class FilterModule { }
