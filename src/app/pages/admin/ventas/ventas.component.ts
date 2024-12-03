import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.scss'
})
export class VentasComponent {
  productosFiltrados: any[] = [];
  productoSeleccionado: any = null;
  cantidad: number = 0;
  carrito: any[] = [];
  totalVenta: number = 0;

  constructor(private http: HttpClient) {}

  // Buscar productos desde el servidor (autocomplete)
  buscarProducto(query: string) {
    if (query.trim() === '') {
      this.productosFiltrados = [];
      return;
    }

    this.http
      .get<any[]>(`http://localhost:3000/ventas/productos-autocomplete?query=${query}`)
      .subscribe((productos) => {
        this.productosFiltrados = productos;
      });
  }

  // Seleccionar producto del autocomplete
  seleccionarProducto(producto: any) {
    this.productoSeleccionado = producto;
  }

  // Agregar producto al carrito
  agregarProducto() {
    if (!this.productoSeleccionado || this.cantidad <= 0) return;

    // Verificar si el producto ya está en el carrito
    const itemExistente = this.carrito.find(
      (item) => item.producto.cveProducto === this.productoSeleccionado.cveProducto
    );

    if (itemExistente) {
      itemExistente.cantidad += this.cantidad;
    } else {
      this.carrito.push({
        producto: this.productoSeleccionado,
        cantidad: this.cantidad,
      });
    }

    this.actualizarTotal();
    this.productoSeleccionado = null;
    this.cantidad = 0;
  }

  // Eliminar producto del carrito
  eliminarProducto(item: any) {
    const index = this.carrito.indexOf(item);
    if (index >= 0) {
      this.carrito.splice(index, 1);
    }
    this.actualizarTotal();
  }

  // Actualizar total de la venta
  actualizarTotal() {
    this.totalVenta = this.carrito.reduce(
      (acc, item) => acc + item.cantidad * item.producto.precio,
      0
    );
  }

  // Procesar venta
  procesarVenta() {
    const venta = {
      totalVenta: this.totalVenta,
      cveUsuario: 1, // Usuario actual, en un sistema real sería dinámico
      productos: this.carrito.map((item) => ({
        cveProducto: item.producto.cveProducto,
        cantidad: item.cantidad,
        precioProducto: item.producto.precio,
      })),
    };

    this.http.post('http://localhost:3000/ventas/procesar', venta).subscribe(
      (response) => {
        alert('Venta procesada con éxito');
        this.carrito = [];
        this.totalVenta = 0;
      },
      (error) => {
        alert('Error al procesar la venta');
      }
    );
  }
}