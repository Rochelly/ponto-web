<?php
session_start();
if (!array_key_exists('siape', $_SESSION)) {
    header('location: /ponto/login.php');
    exit;
}

function __autoload($c) {
    $paths = array(
        './',
        './libs/',
        './model/',
        './dao/ponto/',
        './view/'
        );

    foreach ($paths as $dir) {
        if (file_exists($dir . $c . '.php')) {
            require_once $dir . $c . ".php";
        }
    }
}

$siape = $_SESSION['siape'];
$ponto = new Ponto;
$func = substr($_SERVER['PATH_INFO'], 1);
$args = explode('&', $_SERVER['QUERY_STRING']);
$args = array_map(function ($item) {return end(explode('=', $item)); }, $args);
$args = array_merge(array($siape), $args);

$result = call_user_func_array(array($ponto, $func), $args);

header('content-type: application/json');
echo json_encode($result);
