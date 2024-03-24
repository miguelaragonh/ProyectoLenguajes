<?php
namespace App\controller;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Container\ContainerInterface;

class Usuario extends AccesoBD{
    
    protected $container;
    const RECURSO = 'Usuario';
    private function autenticar($idUsuario, $passw){
        $datos = $this->buscarUsr(idUsuario: $idUsuario); 
        //var_dump((($datos) && (password_verify($passw, $datos->passw))) ?
        //['idRol' => $datos->idRol]:null);die();

        return (($datos) && (password_verify($passw, $datos->passw))) ?
        ['idRol' => $datos->idRol]:null;}

    
    public function cambiarRol(Request $request, Response $response, $args){//adminis
        $body=json_decode($request->getBody());
        $datos=$this -> editarUsuario(idUsuario:$args['idUsuario'],idRol: $body -> idRol);
        $status = $datos == true ? 200:404;
        return $response -> withStatus($status);
    }
    public function resetPassw(Request $request, Response $response, $args){ //un administrador
        $body=json_decode($request->getBody());
        $datos=$this -> editarUsuario(idUsuario:$args['idUsuario'],passwN:Hash::hash($body -> passwN));
        $status = $datos == true ? 200:404;
        return $response -> withStatus($status);
    }
    public function cambiarPassw(Request $request, Response $response, $args){
        $body=json_decode($request->getBody(),1);
        $usuario = $this -> autenticar($args['idUsuario'],$body['passw'] );
        //var_dump($usuario);die();
        if($usuario){
           // $datos=$this -> editarUsuario(idUsuario:$args['id'],passwN: $this -> hashm($body['passwN']));
            $datos=$this -> editarUsuario(idUsuario:$args['idUsuario'],passwN:Hash::hash($body['passwN']));
            

        $status = 200;
        }else {
        $status =401;
        }

        //$status = $datos == true ? 200:404;
        return $response -> withStatus($status);
    } 
}