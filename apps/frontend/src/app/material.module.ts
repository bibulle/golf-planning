import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';

@NgModule({
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatListModule, MatSnackBarModule, MatDialogModule, MatCardModule],
  exports: [MatButtonModule, MatMenuModule, MatIconModule, MatListModule, MatSnackBarModule, MatDialogModule, MatCardModule],
})
export class MaterialModule {}
