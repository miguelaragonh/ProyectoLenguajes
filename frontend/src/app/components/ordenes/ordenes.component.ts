import { Component, Inject, OnInit, inject } from '@angular/core';
import { OrdenesService } from '../../shared/services/ordenes.service';
import { OrdenesModel } from '../../shared/models/ordenes.model';
import {
  FormBuilder,
  FormGroup,
  MaxLengthValidator,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { PrintService } from 'src/app/shared/services/print.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.css'],
  animations: [
    trigger('estadoFiltro', [
      state(
        'show',
        style({
          'max-height': '100%',
          opacity: '1',
          visibility: 'visible',
        })
      ),
      state(
        'hide',
        style({
          'max-height': '0',
          opacity: '0',
          visibility: 'hide',
        })
      ),
      transition('show=>hide', animate('600ms ease-in-out')),
      transition('hide=>show', animate('100ms ease-in-out')),
    ]),
  ],
})
export class OrdenesComponent implements OnInit {
  filtro: any;
  srvAuth = inject(AuthService);
  srvOrdenes = inject(OrdenesService); // Injectar Dependencia
  fb = inject(FormBuilder); // Injectar
  router = inject(Router); // Injectar
  frmOrdenes: FormGroup;
  ordenes = [new OrdenesModel()];
  titulo: string = '';
  pagActual = 1;
  itemsPPag = 5;
  numRegs = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible: boolean = false;
  srvPrint = inject(PrintService);
  idUsuario: string = '';
  rol: number = 0;

  constructor() {
    this.frmOrdenes = this.fb.group({
      id: [''],
      idCompra: ['',[Validators.required,Validators.pattern('[0-9]*')]],
      idUsuario: ['',[Validators.required,Validators.pattern('[0-9]*')]],
      idProducto: ['',[Validators.required,Validators.pattern('[0-9]*')]],
      detalle: ['',[Validators.required,Validators.minLength(2)]],
      montoTotal: ['',[Validators.required,Validators.pattern('[0-9]*')]],
      fechaCreacion: ['',[Validators.required]],
      idFactura: ['',[Validators.required,Validators.pattern('[0-9]*')]],
    });

    this.srvAuth.usrActual.subscribe((res) => {
      (this.idUsuario = res.idUsuario),
        (this.rol = res.idRol)
    });
  }

  get F() {
    return this.frmOrdenes.controls;
  }

  get stateFiltro() {
    return this.filtroVisible ? 'show' : 'hide';
  }

  onCambioPag(e: any) {
    this.pagActual = e;
    this.filtrar();
  }
  onCambioTam(e: any) {
    this.itemsPPag = e.target.value;
    this.pagActual = 1;
    this.filtrar();
  }

  filtrar() {
    this.srvOrdenes
      .filtar(this.filtro, this.pagActual, this.itemsPPag)
      .subscribe((data) => {
        this.ordenes = Object(data)['datos'];
        this.numRegs = Object(data)['regs'];
      });
  }

  onEliminar(idCompra: any) {
    //elimina
    Swal.fire({
      title: 'Estas seguro de eliminar ?',
      text: "Se va a eliminar la Compa",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvOrdenes.eliminar(idCompra).subscribe({
          complete: () => {
            Swal.fire(
              'Eliminado',
              'Orden eliminada satisfactoriamente',
              'success'
            );
            this.filtrar();
          },
          error: (e) => {
            switch (e) {
              case 404:
                Swal.fire({
                  title: 'Orden no existe!',
                  icon: 'info',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar',
                });
                break;
            }
          },
        });
      }
    });
  }

  onInfo(idCompra: any) {
    this.srvOrdenes.buscar(idCompra).subscribe((data) => {
      Swal.fire({
        title: '<strong> Informacion Orden</strong>',
        html:
          '<br>' +
          '<table class="table table-sm table-striped">' +
          '<tbody class="text-start">' +
          '<tr><th>ID Compra</th>' +
          `<td>${data.idCompra}</td></tr>` +
          '<tr><th>ID Usuario</th>' +
          `<td>${data.idUsuario}</td></tr>` +
          '<tr><th>ID Producto</th>' +
          `<td>${data.idProducto}</td></tr>` +
          '<tr><th>Detalle</th>' +
          `<td>${data.detalle}</td></tr>` +
          '<tr><th>Monto Total</th>' +
          `<td>${data.montoTotal}</td></tr>` +
          '</tbody>' +
          '</table>',
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
      });
    });
  }

  onNuevo() {
    this.titulo = 'Nueva Orden';
    this.frmOrdenes.reset();
    this.filtrar();
  }

  onSubmit() {
    const orden = {
      idCompra: this.frmOrdenes.value.idCompra,
      idUsuario: this.frmOrdenes.value.idUsuario,
      idProducto: this.frmOrdenes.value.idProducto,
      detalle: this.frmOrdenes.value.detalle,
      montoTotal: this.frmOrdenes.value.montoTotal,
    };
    const texto = this.frmOrdenes.value.idCompra
      ? 'cambios guardados'
      : 'Creando Con exito';
    this.srvOrdenes.guardar(orden, this.frmOrdenes.value.id).subscribe({
      next: () => {
        Swal.fire({
          title: texto,
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        this.filtrar();
      },
      error: (e) => {
        switch (e) {
          case 404:
            Swal.fire({
              title: 'Orden no existe!',
              icon: 'error',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cerrar',
            });
            break;
          case 409:
            Swal.fire({
              title: 'IdCompra ya existe',
              icon: 'error',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cerrar',
            });
            break;
        }
      },
    });
  }

  onImprimir() {
    const encabezado = [
      'ID Usuario',
      'ID Producto',
      'Detalle',
      'Monto Total',
      'Fecha Creacion',
      'ID Factura',
    ];
    this.srvOrdenes.filtar(this.filtro, this.pagActual, this.numRegs).subscribe((data) => {
      const cuerpo = Object(data)['datos'].map((Obj: any) => {
        const datos = [
          Obj.idUsuario,
          Obj.idProducto,
          Obj.detalle,
          Obj.montoTotal,
          Obj.fechaCreacion,
          Obj.idFactura,
        ];
        return datos;
      });
      this.srvPrint.print(encabezado, cuerpo, 'Listado Ordenes', true);
    });
  }

  onEditar(idCompra: any) {
    this.titulo = 'Editando Orden';
    this.srvOrdenes.buscar(idCompra).subscribe({
      next: (data) => {
        console.log(data);
        this.frmOrdenes.setValue(data);
      },
      error: (e) => {
        if (e == 404) {
          Swal.fire({
            title: 'Orden no Existe',
            icon: 'info',
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonAriaLabel: '#d33',
            cancelButtonText: 'Cerrar',
          });
        }
        this.filtrar();
      },
    });
  }

  onFiltrar() {
    this.filtroVisible = !this.filtroVisible;
    if (!this.filtroVisible) {
      this.resetearFiltro();
    }
  }

  onFiltrarChange(f: any) {
    console.log('Filtro', f);
    this.filtro = f;
    this.filtrar();
  }

  resetearFiltro() {
    if(this.rol == 2){
      this.filtro = {
        idCompra: '',
        idUsuario: this.idUsuario,
        idProducto: '',
        detalle: '',
        montoTotal: '',
        fechaCreacion: '',
        idFactura: '',
      };
    }else{
      this.filtro = {
        idCompra: '',
        idUsuario: '',
        idProducto: '',
        detalle: '',
        montoTotal: '',
        fechaCreacion: '',
        idFactura: '',
      };
    }
    this.filtrar();
  }

  onCerrar() {
    this.router.navigate(['/home']);
  }

  ngOnInit() {
    this.resetearFiltro();
  }
}
