import { Component } from '@angular/core';
import { RegisterService } from 'src/app/shared/services/register.service';
import { Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  srvRegister = inject(RegisterService); // Injectar Dependencia
  fb = inject(FormBuilder); // Injectar
  router = inject(Router); // Injectar
  frmRegister: FormGroup;

  constructor() {
    this.frmRegister = this.fb.group({
      idPersona: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(15),
          Validators.pattern('[0-9]*'),
        ],
      ], //requerido - numeros -tamMax(15) -tamMin(9)

      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern('([A-Za-záéíóúñÑ]*)( ([A-Za-záéíóúñÑ]*)){0,1}'),
        ],
      ], //requerido - -tamMin(9)-formato(letras un espacio)

      apellido1: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
          Validators.pattern('[A-Za-záéíóúñÑ]*'),
        ],
      ], //requerido - tamMin(9)-formato(letras)

      apellido2: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
          Validators.pattern('[A-Za-záéíóúñÑ]*'),
        ],
      ], //requerido -tamMin(9)-formato(letras)

      telefono: [
        '',
        [Validators.required, Validators.pattern('[0-9]{4}-[0-9]{4}')],
      ], //requerido - formato(####-####)

      celular: [
        '',
        [Validators.required, Validators.pattern('[0-9]{4}-[0-9]{4}')],
      ], //- formato(####-####)

      direccion: ['', [Validators.minLength(5)]], //tamMin(9)

      correo: ['', [Validators.required, Validators.email]], //requerido - numeros -tamMax(15) -tamMin(9)

      passwI: ['', [Validators.required, Validators.minLength(8)]], //tamMin(9)
    });
  }

  get F() {
    return this.frmRegister.controls;
  }
  redirect() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    const registro = {
      idPersona: this.frmRegister.value.idPersona,
      nombre: this.frmRegister.value.nombre,
      apellido1: this.frmRegister.value.apellido1,
      apellido2: this.frmRegister.value.apellido2,
      telefono: this.frmRegister.value.telefono,
      celular: this.frmRegister.value.celular,
      direccion: this.frmRegister.value.direccion,
      correo: this.frmRegister.value.correo,
      idRol: 2,
      passwI: this.frmRegister.value.passwI,
    };
    this.srvRegister.crearUsuario(registro).subscribe({
      next: () => {
        Swal.fire({
          title: 'El registro se completo correctamente',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
        });
        this.redirect();
      },
      error(err) {
        Swal.fire({
          title: 'Error al realizar el registro',
          text: 'El Usuario ya existe',
          icon: 'error',
          showConfirmButton: false,
          timer: 2000,
        });
      },
    });
    this.frmRegister.reset();
  }
}
