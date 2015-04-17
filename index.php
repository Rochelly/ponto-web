<?php
session_start();
if (!array_key_exists('siape', $_SESSION)) 
{
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
$ponto = new Ponto;

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
                <nav class="navbar navbar-default">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
                            <span class="sr-only">menu</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a class="navbar-brand" href="#">Marcações</a>
                    </div>
                    <div class="navbar-collapse collapse">
                        <div class="col-md-9">
                            <ul class="nav navbar-nav">
                                <li><a href="#">Buscar</a></li>
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
            <div class="col-md-6"></div>
        </div>
        <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6">
                <div class="panel panel-default" id="tabela" >
                    <div class="panel-heading">
                        <?php
                        $servidor = $ponto->servidor($siape);
                     //   var_dump($servidor);

                        echo "Servidor: <label>{$servidor->nome}</label>";

                        echo "<br>";
                        echo "SIAPE: <label>{$servidor->siape}</label>";
                        echo "<br>";
                        echo "Departamento: <label>{$servidor->descricao}</label>";
                        ?>
                    </div>
                    <div id="dadosServidor" class="panel-body">
                        <?php
                        $sumario = $ponto->sumario($siape, $mes, $ano_selecionado);
                   //     var_dump($sumario);
                        $update = $ponto->ultima_atualizacao();
                        echo "<div>Período: <span id='periodo'>{$sumario->periodo}</span></div>";
                        echo "<div>Carga Horária: <span id='carga_horaria'>{$sumario->carga_horaria}</span></div>";
                        echo "<div>Horas Trabalhadas: <span id='horas_trabalhadas'>{$sumario->horas_trabalhadas}</span></div>";
                        echo "<div>Extras/Atraso: <span id='saldo'>{$sumario->saldo}</span></div>";
                        echo "<div>Ultima Atualizacao: <span id='saldo'>{$update}</span></div>";
                        ?>
                    </div>
                    <table class="table table-striped" id="marcacao" name="marcacao">
                        <thead>
                            <th width="140px">Data</th>
                            <th width="80px">Entrada</th>

                            <th width="120px">Saída</th>

                            <th width="80px">Entrada</th>

                            <th width="120px">Saída</th>

                            <th width="120px">Horas Trabalhadas</th>
                            <th>Saldo</th>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>

                    <?php
                    $legendas = $ponto->legendas($siape, $mes, $ano_selecionado);
               //     var_dump($legendas);
                    if (count($legendas)) {
                        echo "<h2>Legendas</h2>";
                        echo "<dl class='panel-body'>\n";
                        foreach ($legendas as $legenda) {
                            echo "  <dt>{$legenda->nome}</dt>\n";
                            echo "  <dd>{$legenda->descricao}</dd>\n";
                        }
                        echo "</dl>\n";
                    }
                    ?>

                </div>
                <div id="assinaturas">
                    <span><?php echo "{$servidor->nome} ({$siape})"; ?></span>
                    <span>Chefia Imediata</span>
                </div>
            </div>
        </div>
    </form>
</div>

</body>
</html>