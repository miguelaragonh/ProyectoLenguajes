import { HttpClient } from '@angular/common/http';
import { Token } from '../models/token';
import { Injectable, inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  SVR = environment.SRV;
  private JWT_TOKEN = 'JWT_TOKEN';
  private REFRESH_TOKEN = 'REFRESH_TOKEN';
  http = inject(HttpClient);

  refrescando: boolean = false; //nuevo

  constructor() {}

  setTokens(tokens: Token): void {
    this.setToken(tokens.token);
    this.setRefreshToken(tokens.refreshToken);
  }
  private setToken(token: string): void {
    localStorage.setItem(this.JWT_TOKEN, token);
  }
  private setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN, token);
  }
  get token(): any {
    return localStorage.getItem(this.JWT_TOKEN);
  }
  get refreshToken(): any {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }
  eliminarTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  public decodeToken(): any {
    //decodificar los token
    const helper = new JwtHelperService();
    return helper.decodeToken(this.token);
  }

  public jwtTokenExp(): any {
    //extrae el tiempo permitido de sesion
    const helper = new JwtHelperService();
    return helper.isTokenExpired(this.token);
  }

  public tiempoExpToken(): any {
    //extrae el tiempo
    return this.decodeToken().exp - Date.now() / 1000;
  }

  public refreshTokens() {
    //refrescar el token
    if (!this.refrescando) {
      this.refrescando = true;
      this.http
        .patch<Token>(
          `${this.SVR}/sesion/refrescar/${this.decodeToken().sub}`,
          { tkR: `${this.refreshToken}` }
        )
        .subscribe((tokens) => {
          this.setTokens(tokens);
          this.refrescando = false;
        });
    }
  }
}
