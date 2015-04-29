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
                        <a class="navbar-brand" href="chefia.php">Minhas Marcaçes</a>
                        <a class="navbar-brand" href="ocorrencias.php">Ocorrencias de Funcionarios</a>
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
					<div id='imagens' name=''>
						<center>
						<img src="/ponto/img/cabecalho.png"  align="left"  />
						<?php 

						$chefiaDados= $ponto->chefiaDados($usuario);
						
						echo "<strong><h2>";
						echo strtoupper("{$chefiaDados->descricao} 
							</br> Boletim De Frequencia 
							</br>
							 $meses[$mes]/$ano_selecionado
							");
						echo "</h2></strong>";
						echo "</center>";
						?>


					</div>

				</div>
				<!-- Select Ano Fim -->

			</div>
			<div class="row">
				<div class="col-md-3"></div>
				<div class="col-md-6">
					<div class='panel panel-default' id='tabela3' name='tabela3'>
						<div class='panel-heading'  id='tabela3' name='tabela3' >
							<?php
							$servidor = $ponto->servidor($siape);
							$chefiaDados= $ponto->chefiaDados($usuario);
							$departamentoId =$chefiaDados->departamento_id;





							echo "Chefe:         <label>{$_SESSION['usuarioNome']}</label>";
							echo "<button style='float: right;' type='button' class='btn btn-info' onclick='window.print();''>
							Imprimir Relatorio
						</button> ";
						echo "<br>";
						echo "Departamento: <label>{$chefiaDados->descricao}</label>";
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

				$funcionarios = $ponto->funcionariosDep($departamentoId);
				$diasMes = cal_days_in_month(CAL_GREGORIAN, $mes, $ano_selecionado); 

				for ($j=0; $j <count($funcionarios) ; $j++) { 

					$ocorrencias = $ponto->ocorrencias($mes,$ano_selecionado,$departamentoId,$funcionarios[$j]->n_folha);

					echo" <table class='table table-bordered' id='ocorrencias' name='ocorrencias'>";
					echo"  <div class='panel-heading'>";
					echo("Servidor: <label >{$funcionarios[$j]->nome}</label>");
					echo("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp SIAPE: &nbsp&nbsp<label >{$funcionarios[$j]->n_folha}</label>");
					echo "    </div>";
					echo"	</table>  ";



					if (count($ocorrencias)>0) 
					{


						echo" <table class='table table-bordered' id='ocorrencias' name='ocorrencias'>
						<thead>
							<th width='80px'>Ocorrência:</th>
							<th width='300px'>Descriçao:</th>
							<th width='200px'>Quantidade:</th>
							<th width='300px'>Dias Do Mes:</th>
						</thead>

						<tbody>";
						// Mudar esses parametros ($ponto->ocorrencias(mes,ano,$departamentoId,$funcionarios[$j]->n_folha);


							for ($i=0; $i < count($ocorrencias); $i++) { 
								echo "<tr>";
								echo" <td width='100px'>{$ocorrencias[$i]->ocorrencia}</th>";
								echo" <td width='80px'>{$ocorrencias[$i]->descricao}</th>";                               
								echo" <td width='150px'>{$ocorrencias[$i]->quantidade}</th>";
								echo" <td width='80px'>";
								$dias= $ponto->diasOcorrencias($mes,$ano_selecionado,$departamentoId,$funcionarios[$j]->n_folha,$ocorrencias[$i]->ocorrencia);

								for ($l=0; $l < count($dias); $l++) { 
									echo "{$dias[$l]->dia}";
									if  ((count($dias)-1)!=$l){
										echo "-";
									}
								}
								echo " </th>";
								echo "</tr>";
							}

							$saldoDias=$ponto->diasTrabalhados($mes,$ano_selecionado,$departamentoId,$funcionarios[$j]->n_folha);

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
<span><?php echo "{$_SESSION['usuarioNome']} ({$siape}) </br> Encarregado da  Frequencia"; ?></span>

</div>


</body>
</html>