import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { VentasComponent } from './ventas.component';
import { VentasDialogComponent } from './components/ventas-dialog/ventas-dialog.component';
import { MatTable } from '@angular/material/table';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';

@NgModule({
  declarations: [
    VentasComponent, VentasDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // Para usar formularios reactivos
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTable,
    AsyncPipe
  ],
})
export class VentasModule {}
