<?php
session_start();
   /**
	* Informaçoes disponiveis na sessao:
	* $_SESSION['usuarioNome'] --> Nome completo do Usuario (Fonte: Ldap)
   	* $_SESSION['siape']  -> SIAPE do servidor (Fonte: Ldap)
	* $_SESSION['usuario'] ->  login do usuario (mesmo do E-mail institucional)
	*/

/**
 * Verifica se o usuario esta logado
 * se nao, redireciona a pagina  de login
 */
if (!array_key_exists('siape', $_SESSION)) {
	header('location: /ponto/login.php');
	exit;
}

/**
 * [__autoload carregas as dependecias]
 */
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



$ponto= new Ponto;
/**
 * [$chefiaDepartamento  array qye contem todos  os departamentos subordinados as  chefias - (departamento_id e descricao)]
 * @var [array of  object]
 */
$chefiaDepartamento  = $ponto->chefia($usuario);


/**
 * [count($chefiaDepartamento) verifica se o usuario e  um chefe, caso nao seja, o mesmo e redirecionado a pagina index(pagina de  marcaçoes de funcionarios)]
 * @var [int]
 */
if(count($chefiaDepartamento)==0){
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
			<!-- Menu Fim -->

			<div class="row">
				<div class="col-md-4"></div>
				<!-- Select Mes Inicio -->
				<div class="col-md-2">
					<select id="mes" name="mes" class="form-control" onchange="this.form.submit()">
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
					</select>


				</br>


			</div>
			<!-- Select Ano Fim -->

		</div>
		<center>

			<?php
				/**
				 * [$departamentoSelecionado  id do  departamento  que  esta selecionado]
				 * @var int
				 */
				$departamentoSelecionado = array_key_exists('departamento', $_GET) ? $_GET['departamento'] : $chefiaDepartamento[0]->departamento_id;

				/**
				 * [$departamentos  array  com todos os  departamentos da chefia, o indice e o codigo do departamento]
				 * @var array
				 */
				$departamentos = array();
				for ($i=0; $i <count($chefiaDepartamento) ; $i++) { 
					
					$departamentos[$chefiaDepartamento[$i]->departamento_id] = $chefiaDepartamento[$i]->descricao;

				}

				?>
				<div class="row">
					<div class="col-md-4"></div>
					<div class="col-md-3">
						<select id="departamento" name="departamento" class="form-control" onchange="this.form.submit()">
							<?php
							for ($i=0; $i <count($chefiaDepartamento) ; $i++) { 
								echo "<option value='{$chefiaDepartamento[$i]->departamento_id }'". (($chefiaDepartamento[$i]->departamento_id == $departamentoSelecionado) ? " selected = 'selected'" : "") .
								">{$chefiaDepartamento[$i]->descricao }</option>";
							}
							?>
						</select>
					</div>
				</div>
				<div id='imagens' name=''>
					<center>
						<img src="/ponto/img/cabecalho.png"  align="left"  />
						<?php
							echo "<strong><h2>";
							echo strtoupper(strtr("{$departamentos[$departamentoSelecionado]}
							</br> Boletim De Frequência
							</br>
							$meses[$mes] / $ano_selecionado
							","áéíóúâêôãõàèìòùç","ÁÉÍÓÚÂÊÔÃÕÀÈÌÒÙÇ"));
							echo "</h2></strong>";
							echo "</center>";
						?>


					</div>
				</center>
			</br>
			<div class="row">
				<div class="col-md-3"></div>
				<div class="col-md-6">
					<div class='panel panel-default' id='tabela3' name='tabela3'>
						<div class='panel-heading'  id='tabela3' name='tabela3' >
							<?php



							echo "Chefe:         <label>{$_SESSION['usuarioNome']}</label>";
							echo "<button style='float: right;' type='button' class='btn btn-info' onclick='window.print();''>
							Imprimir Relatório
						</button> ";
						echo "<br>";
						echo "Departamento: <label>{$departamentos[$departamentoSelecionado]}</label>";
						?>
					</div>
					<div id="dadosServidor" class="panel-body"  name="tabela3" >
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




				<?php
				echo"<div class='panel panel-default'>";
/**
 * [$funcionarios  retorna  o SIAPE de todos os  funcionarios) de um departamento]
 * @var [type]
 * 	@var [type] [description]
 */
$funcionarios = $ponto->funcionariosDep($departamentoSelecionado);

/**
 * [$diasMes numero de dias do mes]
 * @var [int]
 */
$diasMes = cal_days_in_month(CAL_GREGORIAN, $mes, $ano_selecionado);


/**
 * [$j   funcionarios de  um setor]
 * @var integer
 */
for ($j=0; $j <count($funcionarios) ; $j++) {


	$ocorrencias = $ponto->ocorrencias($mes,$ano_selecionado,$departamentoSelecionado,$funcionarios[$j]->n_folha);

	echo" <table class='table table-bordered' id='ocorrencias' name='ocorrencias'>";
	echo"  <div class='panel-heading'>";
	echo("Servidor: <label >{$funcionarios[$j]->nome}</label>");
	echo("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp SIAPE: &nbsp&nbsp<label >{$funcionarios[$j]->n_folha}</label>");
	echo "    </div>";
	echo"	</table>  ";


/**
 *  Caso o  funcionario  apresente  ocorrencias, elas serao  listas
 *  caso  contrario,  sera exibido  apenas os saldo  de dias, ex:
 *
 * Efetivo :25
 * Faltas:  5
 */
if (count($ocorrencias)>0)
{


	echo" <table class='table table-bordered' id='ocorrencias' name='ocorrencias'>
	<thead>
		<th width='80px'>Ocorrência:</th>
		<th width='300px'>Descrição:</th>
		<th width='200px'>Quantidade:</th>
		<th width='300px'>Dias Do Mês:</th>
	</thead>

	<tbody>";
						// Mudar esses parametros ($ponto->ocorrencias(mes,ano,$departamentoId,$funcionarios[$j]->n_folha);


		for ($i=0; $i < count($ocorrencias); $i++) {
			echo "<tr>";
			echo" <td width='100px'>{$ocorrencias[$i]->ocorrencia}</th>";
			echo" <td width='80px'>{$ocorrencias[$i]->descricao}</th>";
			echo" <td width='150px'>{$ocorrencias[$i]->quantidade}</th>";
			echo" <td width='80px'>";
								/**
								 * [$dias dias em  que ocorreram as ocorrencias]
								 * @var [type]
								 *
								 */
								$dias= $ponto->diasOcorrencias($mes,$ano_selecionado,$departamentoSelecionado,$funcionarios[$j]->n_folha,$ocorrencias[$i]->ocorrencia);

								for ($l=0; $l < count($dias); $l++) {
									echo "{$dias[$l]->dia}";
									if  ((count($dias)-1)!=$l){
										echo "-";
									}
								}
								echo " </th>";
								echo "</tr>";
							}

							/**
							 * [$saldoDias  quantidade de dias trabalhados e  nao trabalhados por  mes]
							 * @var [array de objetos]
							 */
							$saldoDias=$ponto->diasTrabalhados($mes,$ano_selecionado,$departamentoSelecionado,$funcionarios[$j]->n_folha);

							echo "</tbody>";
							echo "<table border='0'>
							<tr>
								<td width='200px' > <label> Efetivo: {$saldoDias[0]->trabalhados} </label></td>
								<td width='150px' > <label> Afastamento: {$saldoDias[0]->naotrabalhados} </label></td>


							</tr>

						</table> </br>";



					}
					else {


						echo "<table border='0'>
						<tr>
							<td width='200px' > <label> Efetivo: {$diasMes} </label></td>
							<td width='150px' > <label> Afastamento: 0 </label></td>
						</tr>

					</table> </br>";

				}
				echo"	<hr align='center'  size='1' >";

			}

			echo " </div> ";


			?>




		</div>
	</div>

</form>
</div>
<div id="assinaturas">
</br>
</br>
<span><?php echo "{$_SESSION['usuarioNome']} ({$siape}) </br> Encarregado da  Frequência"; ?></span>

</div>


</body>
</html>