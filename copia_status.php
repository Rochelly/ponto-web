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
$siape = $_SESSION['siape'];
$usuario = $_SESSION['usuario'];
$ponto = new Ponto;
$funcionariosLista = $ponto->funcionariosListAll();



if (count($chefiaDepartamento) != 0) {
    header('location: /ponto/chefia.php');
    exit;
}
$admin = $ponto->estudanteBool($siape, 4);
if(($admin->resposta != 'S' &&  $admin->resposta != 'S') || count($admin)== 0)  {
    header('location: /ponto/index.php');
    exit;
    }
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="libs/css/bootstrap-theme.min.css">
        <link rel="stylesheet" href="libs/css/bootstrap.min.css">
        <link rel="stylesheet" href="libs/css/ponto.css">
        <link rel="stylesheet" href="libs/css/print.css" media="print">
        <script src="libs/js/jquery.min.js"></script>
        <script src="libs/js/bootstrap.js"></script>
        <script src="libs/js/bootstrap.min.js"></script>
        <title > Registro Eletrônico de Ponto</title>
    </head>
    <body>
        <div class="container-fluid">
            <form id="ponto" method="get">
                <!-- Menu Inicio-->
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-8">
                        <nav class="navbar navbar-inverse  role='navigation">
                            <div class="navbar-header">
                                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
                                <span class="sr-only">menu</span>
                                </button>
                                <a class="navbar-brand" href="marcacoes_admin.php">Minhas Marcações</a>
                                <a class="navbar-brand" href="admin.php">Boletins de Frequência</a>
                                <a class="navbar-brand" href="copia_status.php">Funcionarios</a>
                                <a class="navbar-brand" href="#about">Ajuda</a>
                            </div>
                            <div class="col-md-1 navbar-right" align="left">
                                <ul align="center" class="nav navbar-nav">
                                    <li align="center"><a id="sair" name="sair" href="/ponto/logout.php">Sair</a></li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>
                <!-- Menu Fim -->
            </form>
        </div>
        <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6">
                </br>
                </br>
                </br>
                </br>
                </br>
                <div class="panel panel-default" id="tabela" >
                    <div class="panel-heading">
        <center> SELECIONE O FUNCIONÁRIO PARA COPIAR O STATUS:</center>
                    </div>
                    <div class="panel-body">
                        <form action=copiado.php method=get>
                            </br>
                            </br>
                            <select id="funcionario" name="funcionario" class="form-control">
                                <?
                                for ($i=0; $i <count($funcionariosLista)  ; $i++) {
                                echo "<option value='{$funcionariosLista[$i]->siape}'>{$funcionariosLista[$i]->nome}  </option>";
                                }
                                for ($i=0; $i <count($funcionariosLista)  ; $i++) {
                                echo "<option value='{$funcionariosLista[$i]->siape}'>{$funcionariosLista[$i]->siape}  </option>";
                                }
                                ?>
                            </select>
                            </br>
                            </br>
                            <center><input type=submit value='Copiar Status' class='btn btn-info' /></center>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div id="assinaturas">
            </br>
            </br>
            <span></span>
        </div>
    </body>
</html>