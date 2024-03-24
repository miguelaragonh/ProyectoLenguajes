import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PersonaComponent } from './components/persona/persona.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HomeComponent } from './components/home/home.component';
import { FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import { fas} from '@fortawesome/free-solid-svg-icons';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
//import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FeedComponent } from './components/feed/feed.component';
import { Error403Component } from './components/error403/error403.component'; 
import { JwtInterceptor } from './shared/helpers/jwt.interceptor';
import { RefreshTokenInterceptor } from './shared/helpers/refresh-token.interceptor';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductosComponent } from './components/productos/productos.component';
import { OrdenesComponent } from './components/ordenes/ordenes.component';
import { LoaderComponent } from './components/loader/loader.component';
import { LoaderInterceptor } from './shared/helpers/loader.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    PersonaComponent,
    NavBarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    FeedComponent,
    Error403Component,
    ProductosComponent,
    OrdenesComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    SweetAlert2Module,
    BrowserAnimationsModule,
    NgxPaginationModule
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass:JwtInterceptor,multi:true},
    {provide:HTTP_INTERCEPTORS,useClass:RefreshTokenInterceptor,multi:true},
    {provide:HTTP_INTERCEPTORS,useClass:LoaderInterceptor,multi:true},
  
  ],
  bootstrap: [AppComponent],
})
export class AppModule { 
//aqui va todo lo que queremos exportar para otros componentes
constructor(lib:FaIconLibrary){
lib.addIconPacks(fas);
}

}
