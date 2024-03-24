<?php
namespace App\controller;

use Slim\Routing\RouteCollectorProxy;
//ENDPOINT DE PERSONA

// Listo

require __DIR__ . '/../controller/Persona.php';
$app->group('/persona',function(RouteCollectorProxy $persona){
    $persona->post('',Persona::class.':crear');//
    $persona->get('',Persona::class.':numRegs');//
    $persona->get('/{idPersona}',Persona::class.':buscar');//
    $persona->get('/{pagina}/{limite}',Persona::class.':filtar');
    $persona->put('/{idPersona}',Persona::class.':editar');
    $persona->delete('/{idPersona}',Persona::class.':eliminar');
});



require __DIR__ . '/../controller/Usuario.php';
//ENDPOINT DE USUARIO
$app->group('/usuario',function(RouteCollectorProxy $usuario){
    $usuario->patch('/rol/{idUsuario}',Usuario::class.':cambiarRol');//--//

    $usuario->group('/passw',function(RouteCollectorProxy $passw)
    {
    $passw->patch('/cambio/{idUsuario}',Usuario::class.':cambiarPassw');//--
    $passw->patch('/reset/{idUsuario}',Usuario::class.':resetPassw');//--
    });
});

// Listo

require __DIR__ . '/../controller/Producto.php';
$app -> group('/producto',function(RouteCollectorProxy $prod){
   $prod -> get('/{pagina}/{limite}',Producto::class.':filtrar');
   $prod -> get('',Producto::class.':numRegs'); // Listo
   $prod -> get('/{id}',Producto::class.':buscar');
   $prod -> post('',Producto::class.':crear'); // Listo
   $prod -> put('/{id}',Producto::class.':editar'); // Listo
   $prod -> delete('/{id}',Producto::class.':eliminar'); // Listo
});

require __DIR__ . '/../controller/Orden.php';
$app->group('/orden', function(RouteCollectorProxy $orden)
{
    $orden->get('/{pagina}/{limite}',Orden::class . ':filtrarOrden');/*LOS '::' CORREN SIN INSTANCIAR EL '->' INSTANCIA Y CORRE*/ 
    $orden->get('/{idCompra}', Orden::class . ':buscarOrden');
    $orden->get('', Orden::class . ':numRegsOrd');
    $orden->post('',Orden::class . ':crearOrden');
    $orden->put('/{idCompra}',Orden::class . ':editarOrden');
    $orden->delete('/{idCompra}',Orden::class . ':eliminarOrden');
});

require __DIR__ . '/../controller/Sesion.php';
$app->group('/sesion',function(RouteCollectorProxy $sesion){
    $sesion->patch('/iniciar/{id}',Sesion::class.':iniciar');
    $sesion->patch('/cerrar/{id}',Sesion::class.':cerrar');
    $sesion->patch('/refrescar/{id}',Sesion::class.':refrescar');
});