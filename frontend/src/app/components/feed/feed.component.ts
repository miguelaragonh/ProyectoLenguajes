import { Component,Inject,OnInit,inject } from '@angular/core';
import { ProductosService } from '../../shared/services/productos.service';
import { ProductoModel } from '../../shared/models/producto.model';
import { FormBuilder,FormGroup, MaxLengthValidator, Validators } from '@angular/forms';
import {  Router} from '@angular/router';
import Swal from 'sweetalert2';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent {
  filtro: any;
  srvProducto = inject(ProductosService);
  srvAuth = inject(AuthService);
  arrayProductos : any[] = [];
  arrayPrecios : any[] = [];
  productos = [new ProductoModel];
  producto = [new ProductoModel];
  router = inject(Router);
  rol: number = 0;
  constructor(){
    this.limpiarDatos();
  };

ngOnInit(): void {
  this.filtrar();
  this.srvAuth.usrActual.subscribe((res) => {
      (this.rol = res.idRol)
  });
}

cargarMemoria(idProducto: any,precio : any) {
  this.limpiarDatos();
  localStorage.removeItem('Condicion');
  if (this.arrayProductos.length == 0) {
    const datos: any = idProducto;
    const data: any = precio;
    this.arrayProductos.push(datos);
    this.arrayPrecios.push(data);
    localStorage.setItem('datos', JSON.stringify(this.arrayProductos));
    localStorage.setItem('precios', JSON.stringify(this.arrayPrecios));
  } else {
    if (!this.arrayProductos.includes(idProducto) || this.arrayProductos.includes(idProducto)) {
        this.arrayProductos.push(idProducto);
        this.arrayPrecios.push(precio);
    }
    localStorage.removeItem('datos');
    localStorage.removeItem('precios');
    localStorage.setItem('datos', JSON.stringify(this.arrayProductos));
    localStorage.setItem('precios', JSON.stringify(this.arrayPrecios));
  }
  Swal.fire({
    title: 'Agregado al Carrito de Compras',
    icon: 'success',
    showConfirmButton: false,
    timer: 1500,
  });
}

  limpiarDatos(){
    localStorage.removeItem('datos');
    localStorage.removeItem('precios');
    if(localStorage.getItem("Condicion") == "Vaciar"){
      this.arrayProductos.splice(0,this.arrayProductos.length);
      this.arrayPrecios.splice(0,this.arrayPrecios.length);
    }
  }
  
  filtrar(){
    localStorage.removeItem("datos");
    this.filtro={idProducto:'',nombreProducto:'',color:'',precio:'',talla:'',genero:''};
    this.srvProducto.filtar(this.filtro,1,1000)
    .subscribe(
      data => {
        this.productos =  Object(data)['datos'];
      }
    );
  }

  info(idProducto : any){
    this.srvProducto.buscar(idProducto)
    .subscribe(
      data =>{
        Swal.fire(
          {
            title: '<strong>Informacion del Producto</strong>',
            html : '<br>'+
            '<table class="table table-sm table-striped">'+
            '<tbody class="text-center">'+
            '<tr><th>Producto</th>'+`<td>${data.nombreProducto}</td></tr>`+
            '<tr><th>Color</th>'+`<td>${data.color}</td></tr>`+
            '<tr><th>Talla</th>'+`<td>${data.talla}</td></tr>`+
            '<tr><th>Genero</th>'+`<td>${data.genero}</td></tr>`+
            '</tbody>'+
            '</table>',
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Cerrar'
          }
        )
      }
    )
  }

  Admin(){
    Swal.fire({
      title: 'Modo de Administrador',
      text: 'No puedes realizar compras desde la vista de Administrador',
      icon: 'info',
      showConfirmButton: false,
      timer: 5000,
    }); 
  }
}
