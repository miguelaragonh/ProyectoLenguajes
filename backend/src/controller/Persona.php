<?php
namespace App\controller;

use PDO;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Container\ContainerInterface;
class Persona extends AccesoBD{

    protected $container;
    const RECURSO = 'Persona', ID = 'idPersona';

    public function crear(Request $request, Response $response, $args){
        $body=json_decode($request->getBody()); 
      
        $body -> passwI =
        password_hash($body -> passwI, PASSWORD_BCRYPT,['cost' => 10]);
        //unset($body->passwI); 
        $res = $this -> crearUsrBD($body, self::RECURSO, $body->idRol,self::ID);
        $status = match($res){
            '0'=> 201,
            '1' => 409,
            '2' => 500
        };
        return $response->withStatus($status);
    }
    public function numRegs(Request $request, Response $response, $args){
        $datos=$request->getQueryParams();
        $res['cant'] = $this -> numRegsBD($datos,self::RECURSO);
        $response->getBody()->write(json_encode($res));
        return $response
        ->withHeader('Content-Type', 'Application/json')
        ->withStatus(200);
    }

    public function buscar(Request $request, Response $response, $args){
        $id=$args['idPersona'];
        $res = $this -> buscarBD($args['idPersona'],self::RECURSO);
        $status = !$res ? 404:200;
        if ($res) $response->getBody()->write(json_encode($res));
        return $response  
        ->withHeader('Content-Type', 'Application/json')
        ->withStatus($status);
    }

    public function filtar(Request $request, Response $response, $args){
        $datos=$request->getQueryParams();
        $res = $this -> filtarBD($args,$datos,self::RECURSO);
        $status = sizeof($res) >0 ?200:204;
        $response->getBody()->write(json_encode($res));
        return $response
        ->withHeader('Content-Type', 'Application/json')
        ->withStatus($status);
    }

    public function editar(Request $request, Response $response, $args){
        $id=$args['idPersona'];
        
        $body=json_decode($request->getBody(),1);
        unset($body['passwI']);
        unset($body['idPersona']);
        //var_dump($body);die();
        $res = $this -> editarBD($body, self::RECURSO, $id);
        $status = match($res[0]){
            '0' ,0=> 404,
            '1',1 => 200,
            '2' ,2=> 409
        };
        return $response->withStatus($status);
    } 

    public function eliminar(Request $request, Response $response, $args){
        $res = $this -> eliminarBD($args['idPersona'],self::RECURSO);
        $status = $res > 0?200:404;
        return $response->withStatus($status);
    }
}