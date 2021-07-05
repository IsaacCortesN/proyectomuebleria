<?php

$nombre=$_POST['nombre'];
$correo=$_POST['correo'];
$asunto=$_POST['asunto'];
$mensaje=$_POST['mensaje'];

//Datos para el correo 

$destinatario="carlos.0411@live.com.mx";
$asunto1="$asunto";

$carta="De: $nombre \n ";
$carta .="Correo: $correo \n";
$carta .="Mensaje: $mensaje";

//Proceso para enviar correo

mail($destinatario,$asunto1,$carta);

echo 1;


?>