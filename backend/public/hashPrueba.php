<?php
$cadEntrada = "MiguelAragon1234";
echo $cadEntrada ."<br />";

$opciones =[
'costo' =>10
];

$entradaConHash=password_hash($cadEntrada, PASSWORD_BCRYPT, $opciones);// encriptado de contraseña
echo "Cadena con hash ".$entradaConHash ."<br />";

$cadDigitado= "MiguelAragon1234";

if (password_verify($cadDigitado,$entradaConHash)) {//verifcar contraseña
    echo "<br> Acceso permitido <br />";
}else {
    echo "<br> Acceso denegado <br />";
}