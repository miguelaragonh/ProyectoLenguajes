<?php
namespace App\controller;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class Producto extends AccesoBD{
    const RECURSO = 'Producto';

    public function crear(Request $request, Response $response, $args){
        $body=json_decode($request->getBody());
       // var_dump($body);
        $res = $this -> crearBD($body, self::RECURSO);
        $status = match($res[0]){
            '0',0 => 404,
            '1',1 => 201,
            '2',2 => 409,
        };
        return $response->withStatus($status);
    }

    public function eliminar(Request $request, Response $response, $args){
        $res = $this -> eliminarBD($args['id'],self::RECURSO);
        $status = $res > 0?200:404;
        return $response->withStatus($status);
    }

    public function editar(Request $request, Response $response, $args){
        $id=$args['id'];
        $body=json_decode($request->getBody(),1);
        unset($body['idProducto']);
        $res = $this -> editarBD($body, self::RECURSO, $id);
        $status = match($res[0]){
            '0',0 => 404,
            '1',1 => 200,
            '2',2 => 409,
        };
        return $response->withStatus($status);
    }

    public function filtrar(Request $request, Response $response, $args){
        $datos=$request->getQueryParams();
        $res = $this -> filtarBD($args,$datos,self::RECURSO);
        $status = sizeof($res) >0 ?200:204;
       $response->getBody()->write(json_encode($res));
        return $response->withStatus($status);
    }

    public function numRegs(Request $request, Response $response, $args){
        //obteniendo los datos por el getQuery param
        $datos=$request->getQueryParams();
        $res['cant'] = $this -> numRegsBD($datos,self::RECURSO);
        $response->getBody()->write(json_encode($res));
        return $response
        ->withHeader('Content-Type', 'Application/json')
        ->withStatus(200);
    }

    public function buscar(Request $request, Response $response, $args){
        $id=$args['id'];
        $res = $this -> buscarBD($id,self::RECURSO);
        $status = !$res ? 404:200;
        if ($res) $response->getBody()->write(json_encode($res));
        return $response  
        ->withHeader('Content-Type', 'Application/json')
        ->withStatus($status);
    }
}