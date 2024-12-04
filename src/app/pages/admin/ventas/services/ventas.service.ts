import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private API_URL = "http://localhost:3000/venta";
  constructor( private http: HttpClient) { }

  getProductosActivos(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/productos-autocomplete`, {
      params: { query },
    });
  }

  procesarVenta(venta: any): Observable<any> {
    return this.http.post(`${this.API_URL}/procesar`, venta);
  }
}
