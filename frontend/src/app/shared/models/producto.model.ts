export class ProductoModel {
    id? : number;   // EL ? es para campos opcionales
    idProducto : string;
    nombreProducto : string;
    color : string;
    precio : number;   // EL ? es para campos opcionales
    talla : number;   // EL ? es para campos opcionales
    stock : number;   // EL ? es para campos opcionales
    genero : string;
    

    constructor(c? : ProductoModel){
        if(this.id !== undefined){ // El doble = se usa para comparar dato y valor
            this.id = c?.id;
        }
        
        this.idProducto = c !== undefined ? c.idProducto : '';
        this.nombreProducto = c !== undefined ? c.nombreProducto : '';
        this.color = c !== undefined ? c.color : '';
        this.precio = c !== undefined ? c.precio : 0;
        this.talla = c !== undefined ? c.talla : 0;
        this.stock = c !== undefined ? c.stock : 0;
        this.genero = c !== undefined ? c.genero : '';
      
    };
}
