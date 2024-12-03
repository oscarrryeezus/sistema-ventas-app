// venta.model.ts

export interface Venta {
    cveVenta?: number; // ID único de la venta (opcional, se genera en el backend)
    totalVenta: number; // Monto total de la venta
    cveUsuario: number; // Clave del usuario que realiza la venta
    productos: DetalleVenta[]; // Lista de productos vendidos
  }
  
  export interface DetalleVenta {
    cveProducto: number; // Clave del producto vendido
    cantidad: number; // Cantidad vendida del producto
    precioProducto: number; // Precio unitario del producto en la venta
  }
  