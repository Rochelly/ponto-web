<?php
session_start();
if (!array_key_exists('siape', $_SESSION)) {
    header('location: /ponto/login.php');
    exit;
}

function __autoload($c) {
    $paths = array('./', './libs/', './dao/ponto/', './dao/ldap/', './conf/',);
    foreach ($paths as $dir) {
        if (file_exists($dir . $c . '.php')) {
            require_once $dir . $c . ".php";
        }
    }
}








$_SESSION['siape'] = $_GET['funcionario'];
$siape = $_SESSION['siape'];
$usuario = $_SESSION['usuario'];



$ponto = new Ponto;
$admin = $ponto->estudanteBool($siape, 4);
if($admin->resposta == 'S' &&  $admin->resposta == 'S')   {
  header('location: /ponto/index.php');
}
else
{  header('location: /ponto/index.php');
    exit;    
}

//$chefiaDepartamento = $ponto->chefia($usuario);

if (count($chefiaDepartamento) != 0) {
    header('location: /ponto/chefia.php');
    exit;
}

?>
