<?php

use DI\Container;
use Slim\Factory\AppFactory;

require __DIR__ . '/../../vendor/autoload.php';

$cont_aux = new Container(); //dependece inyection

AppFactory::setContainer($cont_aux);//nuestra API

$app = AppFactory::create();
$container = $app->getContainer();
include_once 'config_bd.php';


/*$app->add(new Tuupola\Middleware\JwtAuthentication([
    "secure" => false,// si se esta usando una conexion segura
    //"path" => ["/persona"],//aqui va todo lo que queremos proteger o asegurar
    "ignore" => ["/sesion/iniciar","/usuario","/producto"],// lo que no queremos proteger o asegurar
    "secret" => $container ->get('clave'),
    "algorithm" => ["HS256", "HS384"] // algoritmo que se usara en el jwt
]));*/

//incluir archivo de congif

include_once 'routes.php';
include_once 'conexion.php';

$app->run();