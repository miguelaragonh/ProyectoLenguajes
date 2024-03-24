import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FeedComponent } from './components/feed/feed.component';
import { authGuard } from './shared/guards/auth.guard';
import { Roles } from './shared/models/roles';
import { Error403Component } from './components/error403/error403.component';
import { loginGuard } from './shared/guards/login.guard';
import { ProductosComponent } from './components/productos/productos.component';
import { PersonaComponent } from './components/persona/persona.component';
import { OrdenesComponent } from './components/ordenes/ordenes.component';


const routes: Routes = [
// aqui van las rutas que se van usar y se hacen en formato json
{path: '', pathMatch: 'full',redirectTo: '/login'},
{path: 'login', component: LoginComponent,canActivate:[loginGuard]},
{path: 'home', component: HomeComponent,canActivate:[authGuard],data:{roles:[Roles.Admin,Roles.Cliente]}},
{path: 'error403', component: Error403Component},
{path: 'feed', component: FeedComponent,canActivate:[authGuard],data:{roles:[Roles.Admin,Roles.Cliente]}},
{path: 'register', component: RegisterComponent},
{path: 'persona', component: PersonaComponent,canActivate:[authGuard],data:{roles:[Roles.Admin]}},
{path: 'ordenes', component: OrdenesComponent,canActivate:[authGuard],data:{roles:[Roles.Admin,Roles.Cliente]}},
{path: 'producto',component: ProductosComponent,canActivate:[authGuard],data:{roles:[Roles.Admin]}},
{path: '**', redirectTo: '/home'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
