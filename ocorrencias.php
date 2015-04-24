<?php
session_start();
echo "<center><h1>Pagina de chefia/ Ocorrencias </h1></center>";
if (!array_key_exists('siape', $_SESSION)) {
    header('location: /ponto/login.php');
    exit;
}

function __autoload($c) {
    $paths = array(
        './',
        './libs/',
        './dao/ponto/',
        './dao/ldap/',
        './conf/',
        );

    foreach ($paths as $dir) {
        if (file_exists($dir . $c . '.php')) {
            require_once $dir . $c . ".php";
        }
    }
}

$siape = $_SESSION['siape'];
$usuario = $_SESSION['usuario'];
$chefia= $_SESSION['chefia'];
$ponto= new Ponto;
if($chefia==0){
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
    <script src="libs/js/ponto.js"></script>
    <title>Registro Eletrônico de Ponto</title>
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
                        <a class="navbar-brand" href="chefia.php">Minhas Marcaçoes</a>
                    </div>
                    <div class="navbar-collapse collapse">
                        <div align="center" class="col-md-9">
                            <ul class="nav navbar-nav">
                                <li><a href="ocorrencias.php">Ocorrencias de Funcionarios</a></li>
                                <li><a href="#about">Ajuda</a></li>
                            </ul>
                        </div>
                        <div class="col-md-1 navbar-right" align="left">
                            <ul align="center" class="nav navbar-nav">
                                <li align="center"><a id="sair" name="sair" href="/ponto/logout.php">Sair</a></li>
                            </ul>
                        </div>

                    </div>
                </nav>
            </div>
        </div>
        <!-- Menu Fim -->
        <div class="row">
            <div class="col-md-4"></div>
            <!-- Select Mes Inicio -->
            <div class="col-md-2">
                <select id="mes" name="mes" class="form-control">
                    <?php
                    $meses = array('', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro');
                    $mes = array_key_exists('mes', $_GET) ? $_GET['mes'] : date('n');
                    var_dump($mes);
                    for ($i = 1; $i < 13; $i++) {
                        if ($i == $mes)
                            echo "<option value='{$i}' selected='selected'>{$meses[$i]}</option>";
                        else
                            echo "<option value='{$i}'>{$meses[$i]}</option>";
                    }
                    ?>
                </select>
            </div>
            <!-- Select Mes Fim -->

            <!-- Select Ano Incio -->
            <div class="col-md-2">
                <select id="ano" name="ano" class="form-control">
                    <?php
                    $ano_atual = date('Y');
                    $ano_selecionado = array_key_exists('ano', $_GET) ? $_GET['ano'] : $ano_atual;
                    $ano = array_key_exists('ano', $_GET) ? $_GET['ano'] : date('n');

                    for ($i = 2015; $i <= $ano_atual; $i++) {
                        if ($i == $ano_selecionado)
                            echo "<option value='{$i}' selected='selected'>{$i}</option>";
                        else
                            echo "<option value='{$i}'>{$i}</option>";
                    }
                    ?>
                </select><br/>
            </div>
            <!-- Select Ano Fim -->
        </div>
        <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6">
                <div class="panel panel-default" id="tabela" >
                    <div class="panel-heading">
                        <?php
                        $servidor = $ponto->servidor($siape);

                        $chefiaDados= $ponto->chefiaDados($usuario);

//                        var_dump($chefiaDados);


                        echo "Nome:         <label>{$_SESSION['usuarioNome']}</label>";
                        echo "<br>";
                        echo "Departamento: <label>{$chefiaDados->descricao}</label>";
                        ?>
                    </div>
                    <div id="dadosServidor" class="panel-body">
                        <?php
                        $sumario = $ponto->sumario($siape, $mes, $ano_selecionado);
                   //     var_dump($sumario);

                        $update = $ponto->ultima_atualizacao();
                        echo "Período: <span id='periodo'>{$sumario->periodo}</span>";
                    echo "</br>";
                        echo "Ultima Atualizacao: <span id='update'>{$update}</span>";
                        ?>
                    </div>
                  </div>



        <div class="panel panel-default">
            <div class="panel-heading">
              <h4 class="panel-title">
              <div align="right">
                <button align="right" id='imprimir' name='imprimir' class="btn btn-info">Imprimir Relatorio</button>        
              </div>
          
                <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapseOne">
                <center>
                               BOLETIM DE FREQUENCIA

                  </center>
              </a>

          </h4>
      </div>
      <div id="collapseOne" class="panel-collapse collapse in">
          <div class="panel-body">

                            <table class="table table-striped" id="marcacao" name="marcacao">
                                <thead>
                                    <th width="80px">SIAPE</th>
                                    <th width="300px">SERVIDOR</th>
                                    <th width="120px">OCORRENCIA</th>
                                    <th width="80px">QUANTIDADE</th>
                             </thead>
                    <!--         <tbody>
                                 </tbody>
 -->
            </div>
        </div>
    </div>
</table>
</div>
<div id="assinaturas">
    <span><?php echo "{$_SESSION['usuarioNome']} ({$siape}) </br> Encarregado da  Frequencia"; ?></span>
</div>
</div>
</div>
</form>
</div>
</body>
</html>