import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import Swal from 'sweetalert2';
import { ProductosService } from 'src/app/shared/services/productos.service';
import { ProductoModel } from 'src/app/shared/models/producto.model';
import { OrdenesService } from 'src/app/shared/services/ordenes.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  srvAuth = inject(AuthService);
  srvProd = inject(ProductosService);
  srvOrden = inject(OrdenesService);
  prod = [new ProductoModel()];
  fechaCreacion = new Date();
  datos: any;
  total: any;
  tam: number = 0;
  monto: number = 0;
  frmPassw: FormGroup;
  filtro: any;
  usuario: string = '';
  apellido: string = '';
  apllido2: string = '';
  idUsuario: string = '';
  idProducto: string = '';
  rol: number = 0;
  fb = inject(FormBuilder);
  errorPassw: number = 0;
  get F() {
    return this.frmPassw.controls;
  }

  constructor() {
    this.frmPassw = this.fb.group({
      passw: ['', [Validators.required, Validators.minLength(8)]],
      passwN: ['', [Validators.required, Validators.minLength(8)]],
      passwR: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSalir() {
    Swal.fire({
      title: 'Realmente deseas Salir?',
      text: 'Nos vemos la proxima',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Salir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvAuth.logout();
        localStorage.clear();
      }
    });
  }

  ngOnInit(): void {
    this.srvAuth.usrActual.subscribe((res) => {
      (this.idUsuario = res.idUsuario),
        (this.rol = res.idRol),
        (this.usuario = res.nombre);
    });
  }

  onResetFrm() {
    this.frmPassw.reset();
    this.errorPassw = 0;
  }

  onSubmit() {
    if (
      this.frmPassw.value.passwN.localeCompare(this.frmPassw.value.passwR) !== 0
    ) {
      this.errorPassw = 1;
      this.frmPassw.value.reset();
    } else {
      this.srvAuth
        .cambiarPassw(this.idUsuario, {
          passw: this.frmPassw.value.passw,
          passwN: this.frmPassw.value.passwN,
        })
        .subscribe({
          complete: () => {
            Swal.fire({
              title: 'Se ha cambiado la contraseña correctamente',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            });
          },
          error: (e) => {
            if (e === 403) {
              this.errorPassw = 2;
            }
          },
        });
    }
  }

  vaciarCarrito() {
    Swal.fire({
      title: 'Desea Cancelar la Compra?',
      text: 'Los Articulos se eliminaran del Carrito',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Cancelar Compra',
      cancelButtonText: 'Continuar Compra',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('datos');
        localStorage.removeItem('precios');
        this.prod.splice(0, this.prod.length);
        if (this.total != null) {
          this.total.splice(0, this.total.length);
        }
        this.monto = 0;
        this.tam = 0;
        localStorage.setItem('Condicion', 'Vaciar');
      }else{
        this.prod.splice(0, this.prod.length);
        if (this.total != null) {
          this.total.splice(0, this.total.length);
        }
        this.monto = 0;
        this.tam = 0;
      }
    });
  }

  cerrarCarrito() {
    if (this.total === null && this.tam === 0) {
      localStorage.removeItem('datos');
      localStorage.removeItem('precios');
      this.prod.splice(0, this.prod.length);
      if (this.total != null) {
        this.total.splice(0, this.total.length);
      }
      this.monto = 0;
      this.tam = 0;
      localStorage.setItem('Condicion', 'Vaciar');
    }else{
      this.prod.splice(0, this.prod.length);
      if (this.total != null) {
        this.total.splice(0, this.total.length);
      }
      this.monto = 0;
      this.tam = 0;
    }
  }

  cargarDatosCompra() {
    this.datos = localStorage.getItem('datos');
    this.datos = JSON.parse(this.datos);
    this.prod.pop();
    if (this.datos != null) {
      for (let i = 0; i < this.datos.length; i++) {
        if (this.datos[i] != null) {
          this.srvProd.buscar(this.datos[i]).subscribe((data) => {
            this.prod.push(data);
          });
        }
      }
    }
  }

  montoTotal() {
    this.cargarTotal();
    if (this.total != null) {
      Swal.fire({
        title: '<strong> Informacion Orden</strong>',
        html:
          '<br>' +
          '<table class="table table-sm table-striped">' +
          '<tbody class="text-start">' +
          '<tr><th>Monto Total</th>' +
          `<td>${this.monto}</td></tr>` +
          '<tr><th>Numero Productos</th>' +
          `<td>${this.total.length}</td></tr>` +
          '</tbody>' +
          '</table>',
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
      });
    } else {
      Swal.fire({
        title: 'No hay informacion',
        text: 'Sin Producto en el Carrito',
        icon: 'warning',
        showCancelButton: false,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  }

  private cargarTotal() {
    this.total = localStorage.getItem('precios');
    this.total = JSON.parse(this.total);
    if (this.total !== null && this.tam < this.total.length) {
      for (let i = 0; i < this.total.length; i++) {
        this.monto += Number(this.total[i]);
        this.tam = this.tam + 1;
      }
    } else {
      this.monto = this.monto;
    }
  }

  crearOrden() {
    this.datos = localStorage.getItem('datos');
    this.datos = JSON.parse(this.datos);
    if(this.datos != null){
      if (this.monto === 0) {
        this.cargarTotal();
      }
      let numFact = Math.floor(Math.random() * 1000000);
      for (let i = 0; i < this.datos.length; i++) {
        const orden = {
          idCompra: Math.floor(Math.random() * 1000000),
          idUsuario: this.srvAuth.valorUserActual.idUsuario,
          idProducto: this.datos[i],
          detalle: 'Compra Realizada',
          montoTotal: this.monto,
          fechaCreacion:
            this.fechaCreacion.getFullYear() +
            '-' +
            (this.fechaCreacion.getMonth() + 1) +
            '-' +
            this.fechaCreacion.getDate(),
          idFacura: numFact,
        };
        this.srvOrden.guardar(orden).subscribe({
          next: () => {
            if (i === 0) {
              Swal.fire({
                title: 'Compra Finalizada',
                icon: 'success',
                showConfirmButton: false,
                timer: 2500,
              });
            }
            if (i == this.datos.length - 1) {
              localStorage.removeItem('datos');
              localStorage.removeItem('precios');
              this.prod.splice(0, this.prod.length);
              this.total.splice(0, this.prod.length);
              this.monto = 0;
              this.tam = 0;
              localStorage.setItem('Condicion', 'Vaciar');
            }
          },
          error: (e) => {
            switch (e) {
              case 404:
                break;
              case 409:
                Swal.fire({
                  title: 'Hubo un problema al crear la orden',
                  text: 'Se volvera intentar',
                  icon: 'warning',
                  showConfirmButton: false,
                  timer: 2500,
                });
                this.crearOrden();
                break;
            }
          },
        });
      }
    }else{
      Swal.fire({
        title: 'No hay datos de Compra',
        text: 'Puede seleccionar el producto a comprar en el Feed',
        icon: 'warning',
        showConfirmButton: false,
        timer: 2500,
      });
      this.cerrarCarrito();
    }
  }
}
