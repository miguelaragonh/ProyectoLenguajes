import { HttpClient } from '@angular/common/http';
import { Token } from '../models/token';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, retry ,tap, throwError} from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  servidor = environment.SRV;
  http = inject(HttpClient);

  srvToken = inject(TokenService);
  router = inject(Router);
  private usrActualSubject = new BehaviorSubject<User>(new User());
  public usrActual = this.usrActualSubject.asObservable();

  public get valorUserActual(): User {
      return this.usrActualSubject.value;
  }
    
  constructor() { }


  public login(user : {idUsuario : '' ,passw : ''}) : Observable<any>{
    return this.http.patch<Token>(`${this.servidor}/sesion/iniciar/${user.idUsuario}`,{passw:user.passw})
    .pipe(
      retry(1),
      tap(
        tokens => {
          this.doLogin(tokens);
          this.router.navigate(['/home']);//se hace para navegar en la pagina
        }
      ),
      map(()=>true),
      catchError(
        error => { return of (error.status)} 
      )
    )
  }
    
  private handleError(error: any) {
    return throwError(() => {
      return error.status;
    });
  }

  cambiarPassw(idUsuario : string, data : any): Observable<any>{
    return this.http.patch(`${this.servidor}/usuario/passw/cambio/${idUsuario}`,data).pipe(retry(1), catchError(this.handleError));
  }

  public logout(){
    if (this.isloged()) {
      this.http.patch<Token>(`${this.servidor}/sesion/cerrar/${this.valorUserActual.idUsuario}`,{})
      .subscribe();
      this.doLogout();
      this.router.navigate(['/login']);
      localStorage.clear();
    }
  }

  private doLogin(tokens:Token):void{//guardamis tokens
    this.srvToken.setTokens(tokens);
    this.usrActualSubject.next(this.getUserActual());//agrega datos a un observable
  }

  private doLogout(){
    if(this.srvToken.token){
    this.srvToken.eliminarTokens();
    localStorage.clear();
    }
    this.usrActualSubject.next(this.getUserActual());//agrega datos a un observable
  }

  private getUserActual():User{
    if (!this.srvToken.token) {
      return new User();
    }
    const tokenD=this.srvToken.decodeToken();
    return  { idUsuario: tokenD.sub, nombre: tokenD.nom, idRol:tokenD.idRol};
  }

  public isloged():boolean{ //verifica si exite el token y que no ha expirado
    return !! this.srvToken && !this.srvToken.jwtTokenExp();
  }
  
  public verificarRefrescar():boolean{
    if(this.isloged() && this.srvToken.tiempoExpToken()<=20){
      this.srvToken.refreshTokens();
      return true;
    }else{
      return false;
    }
  }
}