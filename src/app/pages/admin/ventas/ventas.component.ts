import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VentasService } from './services/ventas.service';
import { ProductosService } from '../productos/service/productos.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';
import { Producto } from '../../../shared/models/producto.interface';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss'],
})
export class VentasComponent implements OnInit, OnDestroy {
  productoSeleccionado: Producto | null = null;
  cantidad = 1;
  productos: any[] = []; // Carrito
  productosFetcheados: Producto[] = []; // Lista de productos disponibles
  subtotal = 0;
  total = 0;
  private destroy$ = new Subject<void>();
  myControl = new FormControl('');
  filteredOptions!: Observable<Producto[]>;

  constructor(
    private dialog: MatDialog,
    private productSvc: ProductosService,
    private snackbar: MatSnackBar,
    private ventasSvc: VentasService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    // Configura el observable del autocomplete
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value)),
      map((descripcion) => this.filtrarProductos(descripcion || ''))
    );
  }

  cargarProductos() {
    this.productSvc.listarProductos()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (productos: Producto[]) => {
          this.productosFetcheados = productos;
          console.log('Productos cargados:', productos);
        },
        (error) => this.mostrarAlerta('Error al cargar productos', 'Cerrar')
      );
  }

  filtrarProductos(value: string): Producto[] {
    const filterValue = value.toLowerCase();
    return this.productosFetcheados.filter((producto) =>
      producto.descripcion.toLowerCase().includes(filterValue)
    );
  }

  displayFn(producto: Producto): string {
    return producto ? producto.descripcion : '';
  }

  agregarProducto() {
    if (!this.productoSeleccionado) {
      this.mostrarAlerta('Selecciona un producto válido', 'Cerrar');
      return;
    }

    if (this.cantidad <= 0 || this.cantidad > this.productoSeleccionado.cantidad) {
      this.mostrarAlerta('La cantidad no es válida o excede el stock disponible', 'Cerrar');
      return;
    }

    const productoExistente = this.productos.find(
      (item) => item.cveProducto === this.productoSeleccionado?.cveProducto
    );

    if (productoExistente) {
      productoExistente.cantidad += this.cantidad;
    } else {
      this.productos.push({
        ...this.productoSeleccionado,
        cantidad: this.cantidad,
      });
    }

    this.calcularTotales();
    this.productoSeleccionado = null;
    this.myControl.setValue('');
    this.cantidad = 1;
    this.mostrarAlerta('Producto agregado al carrito', 'Cerrar');
  }

  eliminarProducto(index: number) {
    this.productos.splice(index, 1);
    this.calcularTotales();
  }

  calcularTotales() {
    this.subtotal = this.productos.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
    );
    this.total = this.subtotal;
  }

  guardarVenta() {
    const venta = {
      productos: this.productos.map((p) => ({
        cveProducto: p.cveProducto,
        cantidad: p.cantidad,
        precio: p.precio,
      })),
      total: this.total,
    };

    this.ventasSvc.procesarVenta(venta).subscribe(
      (response) => {
        this.productos = [];
        this.subtotal = 0;
        this.total = 0;
        this.mostrarAlerta('Venta realizada con éxito', 'Cerrar');
      },
      (error) => this.mostrarAlerta('Error al procesar la venta', 'Cerrar')
    );
  }

  cancelar() {
    this.productos = [];
    this.subtotal = 0;
    this.total = 0;
    this.mostrarAlerta('Venta cancelada', 'Cerrar');
  }

  mostrarAlerta(mensaje: string, accion: string) {
    this.snackbar.open(mensaje, accion, {
      duration: 3000,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
