<?php
/**
 * @author [ESTÊVÃO SAMUEL PROCÓPIO AMARAL]
 * @author [NEWTON KLEBER MACHADO SILVA]
 * @version [1.10]
 */
session_start(); 
session_unset();
session_destroy();
header('location: /ponto/login.php');
