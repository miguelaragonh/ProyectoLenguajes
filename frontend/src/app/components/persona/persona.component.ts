import { Component,Inject,OnInit,inject } from '@angular/core';
import { PersonaService } from '../../shared/services/persona.service';
import { PersonaModel } from '../../shared/models/persona.model';
import { FormBuilder,FormGroup, MaxLengthValidator, Validators } from '@angular/forms';
import {  Router} from '@angular/router';
import Swal from 'sweetalert2';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PrintService } from 'src/app/shared/services/print.service';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css'],
  animations:[
    trigger('estadoFiltro',[
      state('show',style({
        'max-height' : '100%' , 'opacity' : '1','visibility' : 'visible'

      })),
      state('hide',style({
        'max-height' : '0' , 'opacity' : '0','visibility' : 'hide'

      })),
      transition('show=>hide', animate('600ms ease-in-out')),
      transition('hide=>show', animate('100ms ease-in-out')),
 ])
  ]

})

export class PersonaComponent implements OnInit{
  filtro: any;
  srvPersona = inject(PersonaService); // Injectar Dependencia
  fb = inject(FormBuilder); // Injectar
  router = inject(Router); // Injectar
  frmPersona : FormGroup; 
  personas = [new PersonaModel];
  titulo : string = "";
  pagActual = 1;
  itemsPPag = 5;
  numRegs = 0;
  paginas =[2,5,10,20,50];
  filtroVisible: boolean = false;
  srvPrint = inject(PrintService);


  constructor(){ 
    this.frmPersona = this.fb.group({
      id : [''], 
      idPersona : ['',[Validators.required, Validators.minLength(9), Validators.maxLength(15),
                      Validators.pattern('[0-9]*')]],//requerido - numeros -tamMax(15) -tamMin(9)

      nombre : ['',[Validators.required, Validators.minLength(3),Validators.maxLength(30),
                    Validators.pattern('([A-Za-záéíóúñÑ]*)( ([A-Za-záéíóúñÑ]*)){0,1}')]],//requerido - -tamMin(9)-formato(letras un espacio) 

      apellido1: ['',[Validators.required, Validators.minLength(2),Validators.maxLength(15),
      Validators.pattern('[A-Za-záéíóúñÑ]*')]],//requerido - tamMin(9)-formato(letras) 

      apellido2: ['',[Validators.required, Validators.minLength(2),Validators.maxLength(15),
      Validators.pattern('[A-Za-záéíóúñÑ]*')]],//requerido -tamMin(9)-formato(letras) 

      telefono : ['',[Validators.required, Validators.pattern('[0-9]{4}-[0-9]{4}')]],//requerido - formato(####-####) 

      celular : ['',[Validators.pattern('[0-9]{4}-[0-9]{4}')]],//- formato(####-####) 

      direccion : ['',[Validators.minLength(5)]],//tamMin(9)

      idRol:['',[Validators.required]],

      correo : ['',[Validators.required,,Validators.email]],//requerido - numeros -tamMax(15) -tamMin(9)
      });
  }
  get F(){return this.frmPersona.controls;}
  
  get stateFiltro(){return this.filtroVisible?'show':'hide';}

  onImprimir(){
    const encabezado = ["Id Persona","Nombre","Telefono","Celular","Correo"];
    this.srvPersona.filtar(this.filtro,1,this.numRegs)
    .subscribe(
      data =>{
        const cuerpo = Object(data)['datos']
        .map(
          (Obj : any) =>{ 
            const datos = [
            Obj.idPersona,
            Obj.nombre+' '+Obj.apellido1+' '+Obj.apellido2,
            Obj.telefono,
            Obj.celular,
            Obj.correo
          ]
          return datos
          }
        )
        this.srvPrint.print(encabezado, cuerpo, "Listado Personas", true);
      }
      );
    }
  

  onCambioPag(e:any) {
    this.pagActual = e;
    this.filtrar();
  }
  onCambioTam(e:any){
    this.itemsPPag = e.target.value;
    this.pagActual= 1;
    this.filtrar();

  }
  onSubmit(){//este es el encargado de guardar 
    const persona = {
       idPersona :this.frmPersona.value.idPersona,
       nombre : this.frmPersona.value.nombre,
       apellido1 : this.frmPersona.value.apellido1,
       apellido2: this.frmPersona.value.apellido2,
       telefono : this.frmPersona.value.telefono,
       celular : this.frmPersona.value.celular,
       direccion : this.frmPersona.value.direccion,
       correo : this.frmPersona.value.correo,
       idRol : this.frmPersona.value.idRol,
       passwI : this.frmPersona.value.idPersona

    };
    const texto = this.frmPersona.value.idPersona? "cambios guardados":
    "Creando Con exito";//valida si esta agregando o editando
    this.srvPersona.guardar(persona,this.frmPersona.value.id)
    .subscribe( 
      {
        
      complete: () => {
          Swal.fire({
            title: texto,
            icon: 'success',
            showConfirmButton: false,
            timer :1500
          })
          this.filtrar();
        },
        error: (e)=>{
          switch (e) {
            case 404:
              Swal.fire({
                title: 'Persona no existe!',
                icon: 'error',
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cerrar'
              })
              break
            case 409:
              Swal.fire({
                title: 'IdPersona ya existe',
                icon: 'error',
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cerrar'
              })
              break
          }
        }
    }
    );
  
  }
  onNuevo(){//resetea el form de crear nuevo
    this.titulo = "Nuevo Persona"
    this.frmPersona.reset();
    this.filtrar();
  }

  onEliminar(idPersona : any, nombre :string){//elimina 
    Swal.fire({
      title: 'Estas seguro de eliminar ?',
      text: nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
      this.srvPersona.eliminar(idPersona)
      .subscribe(
        { // este tipo de subscribe se usa cuando viene de un pipe
          //next: () =>{},//proximo dato en strim
          complete: () => {
            Swal.fire(
              'Eliminado',
              'Persona eliminado de forma correcta',
              'success'
            );
            this.filtrar();// este actualiza
          },//ejecutar el strim
          error: (e) => {
            //console.log(e);
            switch (e) {
              case 404:
                Swal.fire({
                  title: 'Persona no existe!',
                  icon: 'info',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar'
                })
                break
              case 412:
                Swal.fire({
                  title: 'No se puede eliminar Persona',
                  text:'Posee una compra asociada',
                  icon: 'info',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar'
                })
                break
            }
          }//capturas los estados de error
        });
      }
    });
  }

  onInfo(idPersona : any){ //info 
    this.srvPersona.buscar(idPersona)
    .subscribe(
      data =>{
        const fechaIng = new Date(data.fechaIngreso!).toLocaleDateString('es-Es');
        Swal.fire(
          {
            title: '<strong> Informacion Persona</strong>',
            html : '<br>'+
            '<table class="table table-sm table-striped">'+
            '<tbody class="text-start">'+
            '<tr><th>IdPersona</th>'+`<td>${data.idPersona}</td></tr>`+
            '<tr><th>Nombre</th>'+`<td>${data.nombre}${data.apellido1}${data.apellido2}</td></tr>`+
            '<tr><th>Telefono</th>'+`<td>${data.telefono}</td></tr>`+
            '<tr><th>Celular</th>'+`<td>${data.celular}</td></tr>`+
            '<tr><th>Correo</th>'+`<td>${data.correo}</td></tr>`+
            '<tr><th>IdRol</th>'+`<td>${data.idRol}</td></tr>`+
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

  onEditar(idPersona : any){
    this.titulo = "Editando Persona"
    this.srvPersona.buscar(idPersona)
    .subscribe( 
      {
        next:(data)=>{
          this.frmPersona.setValue(data)
        },
        error:(e) =>{
          if(e==404){
            Swal.fire(
              {
                title: 'Persona no Existe',
                icon: 'info',
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonAriaLabel: '#d33',
                cancelButtonText : 'Cerrar'

              }
            )
          }
          this.filtrar();
        }
      }

    );
  }

  onCerrar(){
    this.router.navigate(['/home']);
  }

  filtrar(){
    this.srvPersona.filtar(this.filtro,this.pagActual,this.itemsPPag)
    .subscribe(
      data =>{
        this.personas = Object(data)['datos'];
        this.numRegs = Object(data)['regs'];
        console.log(this.personas);
      }
    );
  }

  onFiltrar() {
    this.filtroVisible = !this.filtroVisible;
    if (!this.filtroVisible){
      this.resetearFiltro();
    }
  }

  onFiltrarChange(f:any) {
    this.filtro = f;
    this.filtrar();
  }

  resetearFiltro() {
    this.filtro ={idPersona: '',nombre: '',apellido1: '',apellido2: ''};
    this.filtrar();
  }
  

  ngOnInit(){
    this.resetearFiltro();
  }
}
