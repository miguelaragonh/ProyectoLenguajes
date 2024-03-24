export class OrdenesModel {
    id? : string; // EL ? es para campos opcionales
    idCompra : string;   
    idUsuario : string;
    idProducto : string;
    detalle: string;
    montoTotal: number;
    fechaCreacion: string;
    idFactura: string;

    constructor(c? : OrdenesModel){
        if(this.id !== undefined){ // El doble = se usa para comparar dato y valor
            this.id = c?.id;
        }
        
        this.idCompra = c !== undefined ? c.idCompra : '';
        this.idUsuario = c !== undefined ? c.idUsuario : '';
        this.idProducto = c !== undefined ? c.idProducto : '';
        this.detalle = c !== undefined ? c.detalle : '';
        this.montoTotal = c !== undefined ? c.montoTotal : 0;
        this.fechaCreacion = c !== undefined ? c.fechaCreacion : '';
        this.idFactura = c !== undefined ? c.idFactura : '';
        
    };
}