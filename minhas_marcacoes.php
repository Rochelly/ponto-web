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

$ponto = new Ponto;
$chefiaDepartamento = $ponto->chefia($usuario);

/**
 * [count($chefiaDepartamento) verifica se o usuario e  um chefe, caso nao seja, o 
 * mesmo e redirecionado a pagina index(pagina de  marcaçoes de funcionarios)]
 * @var [int]
 */


$admin = $ponto->estudanteBool($siape, 4);
if($admin->resposta == 'S' &&  $admin->resposta == 'S')  {

}else{
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
                                <a class="navbar-brand" href="chefia.php">Boletim de Frequência</a>
                                <a class="navbar-brand" href="minhas_marcacoes.php">Minhas Marcações</a>
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

                    for ($i = 1; $i < 13; $i++) {
                        if ($i == $mes) {
                            echo "<option value='{$i}' selected='selected'>{$meses[$i]}</option>";
                        } else {
                            echo "<option value='{$i}'>{$meses[$i]}</option>";
                        }
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
            <div class="col-md-2"></div>
            <div class="col-md-8">
                <div class="panel panel-default" id="tabela" >
                    <div class="panel-heading">
<?php
$servidor = $ponto->servidor($siape);


echo "Servidor: <label>{$servidor->nome}</label>";
echo "<br>";
echo "SIAPE: <label>{$servidor->siape}</label>";
echo "<br>";
echo "Departamento: <label>{$servidor->descricao}</label>";
?>
                    </div>
                    <div id="dadosServidor" class="panel-body">
                        <?php
                
                                $update = $ponto->ultima_atualizacao();
                                echo "<div>Período: <span id='periodo'></span></div>";
                                echo "<div>Carga Horária: <span id='carga_horaria'></span></div>";
                                echo "<div>Horas Trabalhadas: <span id='horas_trabalhadas'></span></div>";
                                echo "<div>Extras/Atraso: <span id='saldo'></span></div>";
                                echo "<div>Ultima Atualizacao: <span id='saldo'>{$update}</span></div>";
                        ?>
                    </div>
                    <div class="panel-group" id="accordion">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h4 class="panel-title">
                                    <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">
                                        <span class="glyphicon glyphicon-plus"></span>
                                        Horarios do Servidor
                                    </a>
                                </h4>
                            </div>
                            <div id="collapseTwo" class="panel-collapse collapse">
                                <div class="panel-body">
                                    <table class="table table-striped" id="horarios" name="horarios">
                                        <thead>
                                        <th width="110">Dia da Semana:</th>
                                        <th width="80px">Entrada 1</th>
                                        <th width="80px">Saída 1</th>
                                        <th width="80px">Entrada 2</th>
                                        <th width="80px">Saída 2</th>
                                        <th width='80px'>Entrada 3</th>
                                        <th width='80px'>Saída 3</th>
                                        </thead>
                                        <tbody>
<?php
$diaSemana = array('1' => 'Segunda-Feira', '2' => 'Terça-Feria', '3' => 'Quarta-Feira', '4' => 'Quinta-Feria', '5' => 'Sexta-Feira', '6' => 'Sábado', '7' => 'Domingo');
$horarios = $ponto->horarios($siape);

for ($i = 0; $i < count($horarios); $i++) {
    echo"<tr>";
    echo" <td width='100px'>{$diaSemana[($horarios[$i]->dia_semana)]}</th>";
    echo" <td width='80px'>{$horarios[$i]->entrada1}</th>";
    echo" <td width='80px'>{$horarios[$i]->saida1}</th>";
    echo" <td width='80px'>{$horarios[$i]->entrada2}</th>";
    echo" <td width='80px'>{$horarios[$i]->saida2}</th>";
    echo" <td width='80px'>{$horarios[$i]->entrada3}</th>";
    echo" <td width='80px'>{$horarios[$i]->saida3}</th>";
    echo"</tr>";
}
?>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h4 class="panel-title">
                                <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapseOne">
                                    <span class="glyphicon glyphicon-minus"></span>
                                    Marcaçoes de ponto
                                </a>
                            </h4>
                        </div>
                        <div id="collapseOne" class="panel-collapse collapse in">
                            <div class="panel-body">
                                <div class="table-responsive">
                                    <table class="table table-striped" id="marcacao" name="marcacao">
                                        <thead>
                                        </thead>

                                        <tbody>
                                        </tbody>


                                    </table>

                                </div>
                            </div>
                        </div>
                    </div>


                    <table  id='legenda' class="table table-bordered" >
                        <caption></caption>
                        <thead >
                            <tr>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>




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