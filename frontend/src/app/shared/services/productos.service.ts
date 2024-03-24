import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductoModel } from '../models/producto.model';
import { Observable, throwError, retry, catchError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  SRV : string = environment.SRV;
  httpOptions = {
    headers : new HttpHeaders({
      'Content-Type': 'application/json'
    })
 }

  constructor(private http: HttpClient) {}

  buscar(idProducto: any): Observable<any> {
    return this.http
      .get<any>(`${this.SRV}/producto/${idProducto}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  filtar (parametros : any, pag : number, lim : number): Observable<ProductoModel[]>{
    let params = new HttpParams;
    for(const prop in parametros){
      if(prop){
        params = params.append(prop,parametros[prop]);
      }
    }
   return this.http.get<ProductoModel[]>(`${this.SRV}/producto/${pag}/${lim}`,{params:params})
   .pipe(retry(1), catchError(this.handleError));
  }

  guardar(datos: any, id?: any): Observable<any> {
    if (id) {
      return this.http.put(`${this.SRV}/producto/${datos.idProducto}`, datos, this.httpOptions).pipe(retry(1), catchError(this.handleError));
    } else {
      return this.http.post(`${this.SRV}/producto`, datos, this.httpOptions).pipe(retry(1), catchError(this.handleError));
    }
  }

  eliminar(idProducto: any): Observable<any> {
    return this.http.delete(`${this.SRV}/producto/${idProducto}`).pipe(retry(1), catchError(this.handleError));
  }

  

  private handleError(error: any) {
    return throwError(
      ()=> {
        return error.status;
      }
    );
  }

}