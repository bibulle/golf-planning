import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
  ],
})
export class MaterialModule {}
