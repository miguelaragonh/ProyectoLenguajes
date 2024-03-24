export class PersonaModel {
    id? : number;   // EL ? es para campos opcionales
    idPersona : string;
    nombre : string;
    apellido1: string;
    apellido2: string;
    telefono : string;
    celular : string;
    direccion : string;
    correo : string;
    idRol : string;
    passwI? : string;
    fechaIngreso? : Date;

    constructor(c? : PersonaModel){
        if(this.id !== undefined){ // El doble = se usa para comparar dato y valor
            this.id = c?.id;
        }
        
        this.idPersona = c !== undefined ? c.idPersona : '';
        this.nombre = c !== undefined ? c.nombre : '';
        this.apellido1 = c !== undefined ? c.apellido1 : '';
        this.apellido2 = c !== undefined ? c.apellido2 : '';
        this.telefono = c !== undefined ? c.telefono : '';
        this.celular = c !== undefined ? c.celular : '';
        this.direccion = c !== undefined ? c.direccion : '';
        this.correo = c !== undefined ? c.correo : '';
        this.idRol = c !== undefined ? c.idRol : '';
        

        if(this.fechaIngreso !== undefined){
            this.fechaIngreso = c?.fechaIngreso;
        }
        if(this.passwI !== undefined){
            this.passwI = c?.passwI;
        }
    };
}
