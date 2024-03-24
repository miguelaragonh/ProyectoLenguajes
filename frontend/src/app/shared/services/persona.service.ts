import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PersonaModel } from '../models/persona.model';
import { Observable, throwError, retry, catchError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
//import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PersonaService {
  SRV: string = environment.SRV;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  buscar(idPersona: any): Observable<PersonaModel> {
    return this.http
      .get<PersonaModel>(`${this.SRV}/persona/${idPersona}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  filtar(
    parametros: any,
    pag: number,
    lim: number
  ): Observable<PersonaModel[]> {
    let params = new HttpParams();
    for (const prop in parametros) {
      if (prop) {
        params = params.append(prop, parametros[prop]);
      }
    }
    console.log('Filtrando');
    return this.http
      .get<PersonaModel[]>(`${this.SRV}/persona/${pag}/${lim}`, {
        params: params,
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  guardar(datos: any, id?: any): Observable<any> {
    console.log(datos);
    if (id) {
      return this.http
        .put(`${this.SRV}/persona/${datos.idPersona}`, datos, this.httpOptions)
        .pipe(catchError(this.handleError));
    } else {
      console.log(datos);
      return this.http
        .post(`${this.SRV}/persona`, datos, this.httpOptions)
        .pipe(catchError(this.handleError));
    }
  }

  eliminar(idPersona: any): Observable<any> {
    return this.http
      .delete(`${this.SRV}/persona/${idPersona}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  //manejador de error
  private handleError(error: any) {
    return throwError(() => {
      return error.status;
    });
  }
}
