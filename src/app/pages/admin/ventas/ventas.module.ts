import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './venta-routing.module'; 
import { VentasComponent } from './ventas.component'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { VentaDialogComponent } from './components/venta-dialog/venta-dialog.component';

@NgModule({
  declarations: [
    VentasComponent,
    VentaDialogComponent
  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    BrowserAnimationsModule, // Asegúrate de importar esto para Angular Material
    MatInputModule, // Para inputs con Material
    MatFormFieldModule, // Para envoltura de inp
  ]
})
export class VentasModule { }
