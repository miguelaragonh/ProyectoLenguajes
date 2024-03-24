import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, retry, catchError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { OrdenesModel } from '../models/ordenes.model';

@Injectable({
  providedIn: 'root',
})
export class OrdenesService {
  SRV: string = environment.SRV;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  //Este metodo es para cargar todos los datos de la tabla, con filtros
  //(Si los filtros van vacios, trae todo)

  eliminar(idCompra: any): Observable<any> {
    return this.http
      .delete(`${this.SRV}/orden/${idCompra}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  filtar (parametros : any, pag : number, lim : number): Observable<OrdenesModel[]>{
     let params = new HttpParams;
     for(const prop in parametros){
       if(prop){
         params = params.append(prop,parametros[prop]);
       }
     }
    return this.http.get<OrdenesModel[]>(`${this.SRV}/orden/${pag}/${lim}`,{params:params})
    .pipe(retry(1), catchError(this.handleError));
   }

  editar(datos: any): Observable<any> {
    return this.http
      .post(`${this.SRV}/orden`, datos)
      .pipe(catchError(this.handleError));
  }

  buscar(idCompra: any): Observable<OrdenesModel> {
    return this.http
      .get<OrdenesModel>(`${this.SRV}/orden/${idCompra}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  registrar(datos: any): Observable<any> {
    return this.http
      .post(`${this.SRV}/orden`, datos)
      .pipe(catchError(this.handleError));
  }

  guardar(datos: any, id?: any): Observable<any> {
    console.log(datos);
    if (id) {
      return this.http.put(`${this.SRV}/orden/${datos.idCompra}`, datos, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
    } else {
      return this.http
        .post(`${this.SRV}/orden`, datos, this.httpOptions)
        .pipe(retry(1), catchError(this.handleError));
    }
  }
  //manejador de error
  private handleError(error: any) {
    return throwError(() => {
      return error.status;
    });
  }
}
