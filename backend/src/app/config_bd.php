<?php
$container->set('config_bd',function(){
    return(object)[
        "host" => "localhost:3306",
        "bd" => "tsneaker_bd",
        "usr" => "root",
        "pass" => "",
        "charset"   => "utf8mb4"
    ];
});

$container->set('clave',function(){
    return "aBcDe12345./@=+-zdcsdk3241#4%";
});