import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoModel } from 'src/app/shared/models/producto.model';
import { PrintService } from 'src/app/shared/services/print.service';
import { ProductosService } from 'src/app/shared/services/productos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
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
export class ProductosComponent {
  filtro: any;
  srvProd = inject(ProductosService);
  fb = inject(FormBuilder);
  router = inject(Router);
  frmProductos: FormGroup;
  productos = [new ProductoModel()];
  titulo: string = '';
  pagActual = 1;
  itemsPag = 5;
  numRegs = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible: boolean = false;
  srvPrint = inject(PrintService);

  constructor() {
    this.frmProductos = this.fb.group({
      id: [''],
      idProducto: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern('[0-9]*'),
        ]
      ],
      nombreProducto: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(40),
        ]
      ],
      color: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ]
      ],
      precio: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern('[0-9]*'),
        ]
      ],
      talla: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(4),
          Validators.pattern('[0-9]*'),
        ]
      ],
      stock: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern('[0-9]*'),
        ]
      ],
      genero: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
          Validators.pattern('([A-Za-záéíóúñÑ]*)'),
        ]
      ],
    });
  }

  get F() {
    return this.frmProductos.controls;
  }

  get stateFiltro() {
    return this.filtroVisible ? 'show' : 'hide';
  }

  onFiltrar() {
    this.filtroVisible = !this.filtroVisible;
    if (!this.filtroVisible) {
      this.resetearFiltro();
    }
  }

  filtrar() {
    this.srvProd
      .filtar(this.filtro, this.pagActual, this.itemsPag)
      .subscribe((data) => {
        this.productos = Object(data)['datos'];
        this.numRegs = Object(data)['regs'];
        console.log(this.productos);
      });
  }

  resetearFiltro() {
    this.filtro = {
      idProducto: '',
      nombreProducto: '',
      color: '',
      precio: '',
      talla: '',
      genero: '',
    };
    this.filtrar();
  }

  onFiltrarChange(f: any) {
    this.filtro = f;
    this.filtrar();
  }

  onCambioPag(e: any) {
    this.pagActual = e;
    this.filtrar();
  }
  onCambioTam(e: any) {
    this.itemsPag = e.target.value;
    this.pagActual = 1;
    this.filtrar();
  }

  onSubmit() {
    //este es el encargado de guardar
    const producto = {
      idProducto: this.frmProductos.value.idProducto,
      nombreProducto: this.frmProductos.value.nombreProducto,
      color: this.frmProductos.value.color,
      precio: this.frmProductos.value.precio,
      talla: this.frmProductos.value.talla,
      stock: this.frmProductos.value.stock,
      genero: this.frmProductos.value.genero,
    };
    const texto = this.frmProductos.value.idProducto
      ? 'cambios guardados'
      : 'Creando Con exito'; //valida si esta agregando o editando
    this.srvProd.guardar(producto, this.frmProductos.value.id).subscribe({
      complete: () => {
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
              title: 'Producto no existe!',
              icon: 'error',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cerrar',
            });
            break;
          case 409:
            Swal.fire({
              title: 'Id Producto ya existe',
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

  onNuevo() {
    //resetea el form de crear nuevo
    this.titulo = 'Nuevo Persona';
    this.frmProductos.reset();
    this.filtrar();
  }

  onInfo(idProducto: any) {
    //info
    this.srvProd.buscar(idProducto).subscribe((data) => {
      console.log(data);
      Swal.fire({
        title: '<strong> Informacion Producto</strong>',
        html:
          '<br>' +
          '<table class="table table-sm table-striped">' +
          '<tbody class="text-start">' +
          '<tr><th>Id Producto</th>' +
          `<td>${data.idProducto}</td></tr>` +
          '<tr><th>Producto</th>' +
          `<td>${data.nombreProducto}</td></tr>` +
          '<tr><th>Color</th>' +
          `<td>${data.precio}</td></tr>` +
          '<tr><th>Precio</th>' +
          `<td>${data.talla}</td></tr>` +
          '<tr><th>Stock</th>' +
          `<td>${data.stock}</td></tr>` +
          '<tr><th>Genero</th>' +
          `<td>${data.genero}</td></tr>` +
          '</tbody>' +
          '</table>',
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
      });
    });
  }

  onEditar(idProducto: any) {
    this.titulo = 'Editando Producto';
    this.srvProd.buscar(idProducto).subscribe({
      next: (data) => {
        console.log(data);
        this.frmProductos.setValue(data);
      },
      error: (e) => {
        if (e == 404) {
          Swal.fire({
            title: 'Producto no Existe',
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

  onCerrar() {
    this.router.navigate(['/home']);
  }

  onEliminar(idProducto: any, nombreProducto: string) {
    //elimina
    Swal.fire({
      title: 'Estas seguro de eliminar ?',
      text: nombreProducto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvProd.eliminar(idProducto).subscribe({
          complete: () => {
            Swal.fire(
              'Eliminado',
              'Producto eliminado de forma correcta',
              'success'
            );
            this.filtrar(); // este actualiza
          },
          error: (e) => {
            console.log(e);
            switch (e) {
              case 404:
                Swal.fire({
                  title: 'Producto no existe!',
                  icon: 'info',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar',
                });
                break;
              case 412:
                Swal.fire({
                  title: 'No se puede eliminar el Producto',
                  text: 'El Producto tiene ordenes de compra relacionadas',
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

  onImprimir() {
    const encabezado = [
      'Id Producto',
      'Producto',
      'Color',
      'Precio',
      'Talla',
      'Stock',
      'Genero',
    ];
    this.srvProd
      .filtar(this.filtro, this.pagActual, this.numRegs)
      .subscribe((data) => {
        const cuerpo = Object(data)['datos'].map((Obj: any) => {
          const datos = [
            Obj.idProducto,
            Obj.nombreProducto,
            Obj.color,
            Obj.precio,
            Obj.talla,
            Obj.stock,
            Obj.genero,
          ];
          return datos;
        });
        this.srvPrint.print(encabezado, cuerpo, 'Listado Productos', true);
      });
  }

  ngOnInit() {
    this.resetearFiltro();
  }
}
