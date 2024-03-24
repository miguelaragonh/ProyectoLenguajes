<?php
use Psr\Container\ContainerInterface;
//se crea una nueva parte del contenedor
$container->set('bd',function(ContainerInterface $c){
    $conf = $c->get('config_bd');//creando config
    $opc =[
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ
    ];//opciones
    //objeto de conexion
    
    $dsn = "mysql:host=$conf->host;dbname=$conf->bd;charset=$conf->charset";
    try {
        $con=new PDO($dsn,$conf->usr,$conf->pass,$opc);
    } catch (PDOException $e) {
        print "Error ".$e->getMessage()."<br>";
        die();
    }
    return $con;
});