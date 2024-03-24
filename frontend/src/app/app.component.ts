import { Component, HostListener, OnInit, inject } from '@angular/core';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'Frontend';
  authsvr = inject(AuthService);
  rol : number = 0;
  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(){
    this.authsvr.logout();
  }
  constructor(){
    this.authsvr.usrActual.subscribe((res) => {
      (this.rol = res.idRol)
  });
  }
}
