export class User{
    idUsuario:string='';
    nombre:string='';
    idRol:number=-1;
    constructor(us?:User){
        this.idUsuario = us !== undefined? us.idUsuario : '';
        this.nombre = us !== undefined? us.nombre : '';
        this.idRol = us !== undefined? us.idRol : -1;
    }
}