<?php
namespace App\controller;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Container\ContainerInterface;
use Firebase\JWT\JWT;

class Sesion extends AccesoBD{
    const TIPOUSR= [        
        1=>"Persona",
        2=>"Persona"
    ];

    private function modicarToken(string $idUsuario,string $tokenRef=""){
        return $this->accederToken( 'modificar', $idUsuario,$tokenRef);
     }
     private function verificarRefresco(string $idUsuario,string $tokenRef){
        return $this->accederToken( 'verificar', $idUsuario,$tokenRef);//nos devuelve el rol
     }

     public function generarTokens(String $idUsuario,int $idRol, string $nombre){
        $key = $this->container->get('clave');// Crear una clave
        $payload= [
            'iss' => $_SERVER['SERVER_NAME'],
            'iat' => time(),
            'exp'=> time()+150000,
            'sub' => $idUsuario,
            'idRol' => $idRol,
            'nom' => $nombre
    
        ];
        $payloadRef= [
            'iss' => $_SERVER['SERVER_NAME'],
            'iat' => time(),
            'idRol' => $idRol,
        ];
    
        $tkRef = JWT::encode($payloadRef,$key, 'HS256');
        //Guardar token
        $this->modicarToken(idUsuario:$idUsuario,tokenRef:$tkRef);
        
        //var_dump($tkRef);
        return[
            "token"=> JWT::encode($payload,$key, 'HS256'),
            "refreshToken" =>$tkRef
        ];

    }

    private function autenticar($idUsuario, $passw){
        $datos = $this->buscarUsr(idUsuario: $idUsuario); 
        //se le especificó el parametro al cual meter el dato idUsuario
        return (($datos) && (password_verify($passw, $datos->passw))) ?
        ['idRol' => $datos->idRol]:null; 
    }

    public function iniciar(Request $request,Response $response, $args){
        $body = json_decode($request->getbody());
        $res=$this->autenticar($args['id'],$body->passw);
        //var_dump($res);
        
        if ($res) {
            $nombre=$this->buscarNombre($args['id'],'persona');

            //Generar Token
            $tokens=$this->generarTokens($args['id'],$res['idRol'],$nombre);
            
            $response->getBody()->write(json_encode($tokens));
            //$response->withStatus(200);
            $status=200;
        }
        else{
            $status= 401;
        }
        return $response->withStatus($status);
        //->withHeader('Content-type','Application/json')
        //->withStatus($status);
    }

    public function cerrar(Request $request, Response $response, $args){

        $this->modicarToken(idUsuario:$args['id']);

        return $response->withStatus(200);

    }
    public function refrescar(Request $request, Response $response, $args){
        $body=json_decode($request->getbody());
        $idRol = $this->verificarRefresco($args['id'], $body ->tkR);

       
        if ($idRol) {
            $nombre = $this->buscarNombre($args['id'], self::TIPOUSR[$idRol]);
            $tokens = $this->generarTokens($args['id'], $idRol,$nombre);
        }
        if (isset($tokens)) {
           $status =200;
           $response -> getBody()->write(json_encode($tokens));
        } else{
            $status = 401;
        }
        return $response
        ->withHeader('Content-type','Application/json')
        ->withStatus($status);
    }

}