<?php
//EL ID NO SE MANDA NI EN EL PUT NI EN EL PATCH
//LOS CICLOS Y DEMÁS SE REALIZAN ANTES DE REALIZAR LA CONEXION CON EL SERVIDOR PARA EVITAR BLOQUEAR LO MENOS POSIBLE LA BD
//conntroladores
namespace App\controller;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Container\ContainerInterface;
use PDO;

class Orden extends AccesoBD{
    const RECURSO="Orden";

    public function crearOrden(Request $request, Response $response, $args){
        //(:idCompra, :idUsuario, :idProducto, :detalle, :montoTotal)
        $body = json_decode($request -> getBody());
        $res = $this->crearBD($body, self::RECURSO);

        $status = match($res){
            '0', 0 => 201,
            '1', 1 => 409,
        };

        return $response->withStatus($status);
    }

    public function editarOrden(Request $request, Response $response, $args){
        //(:idCompra, :idUsuario, :idProducto, :detalle, :montoTotal)
        $idCompra = $args['idCompra'];
        $body = json_decode($request -> getBody(), 1);
        unset($body['idCompra']);
        $res = $this->editarBD($body, self::RECURSO, $idCompra);
        $status = match($res[0]){
            '0' => 404,//not found
            '1' => 200,
            '2' => 409
        };
        return $response->withStatus($status);
    }


    public function eliminarOrden(Request $request, Response $response, $args){
        $res = $this ->eliminarBD($args['idCompra'], self::RECURSO);
        $status = $res > 0 ? 200 : 404;
        return $response->withStatus($status);
    }


    public function buscarOrden(Request $request, Response $response, $args){
        $idCompra = $args['idCompra'];
        $res = $this->buscarBD($idCompra, self::RECURSO);
        $status = !$res ? 404 : 200;
        if($res){
            $response->getBody()->write(json_encode($res));
        }

        return $response
            ->withHeader('Content-type', 'Application/json')
            ->withStatus($status);
    }

    public function filtrarOrden(Request $request, Response $response, $args){
        $datos = $request->getQueryParams();
        $res = $this -> filtarBD($args, $datos, self::RECURSO);
        
        $status = sizeof($res) > 0 ? 200: 204;
        $response->getBody()->write(json_encode($res)); 

        return $response
            ->withHeader('Content-type', 'Application/json')
            ->withStatus($status);
    }


    public function numRegsOrd(Request $request, Response $response, $args){
        $datos = $request->getQueryParams();
        $res['cant'] = $this->numRegsBD($datos, self::RECURSO);

        $response->getBody()->write(json_encode($res));
        
        return $response
            ->withHeader('Content-type', 'Application/json')
            ->withStatus(200);
    }
}