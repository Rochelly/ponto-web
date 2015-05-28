<?php
/**
 * @author [ESTÊVÃO SAMUEL PROCÓPIO AMARAL]
 * @author [NEWTON KLEBER MACHADO SILVA]
 * @version [1.10]
 */
require_once('dao/ldap/Ldap.php');
require_once ('dao/ponto/Ponto.php');
session_start();

$base_dn = 'dc=ufvjm,dc=edu,dc=br';
$usuario = '';
$msg = '';



if (array_key_exists('login', $_POST)) {
	$usuario = $_POST['login'];
/*	$usuario = 'marcos.alcantara';*/
/*	$usuario = 'nina.beatriz';*/
	$conn = new Ldap();
	$result = $conn->search($base_dn, "uid={$_POST['login']}", array('cn', 'employeeNumber'));

	$entry = $result->first();
	$user_dn = $result->entry_dn();
	$user_pw = $_POST['senha'];

   /**
    * Faz o  login e incia a sessao
	* Informaçoes disponiveis na sessao:
	* $_SESSION['usuarioNome'] --> Nome completo do Usuario (Fonte: Ldap)
   	* $_SESSION['siape']  -> SIAPE do servidor (Fonte: Ldap)
	* $_SESSION['usuario'] ->  login do usuario (mesmo do E-mail institucional)	
	**/
	if ($conn->bind($user_dn, $user_pw)) {

		$_SESSION['usuarioNome'] = $entry['cn'][0];
		$_SESSION['siape'] = $entry['employeeNumber'][0];
/*		$_SESSION['siape'] = '2157248';*/

		$_SESSION['usuario']=$usuario;
	
		header('location: /ponto/index.php');
		exit();
	}
	
	else {
		$msg = 'Usuario ou senha inválido!';
	}
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
	<script src="libs/js/jquery.min.js"></script>
	<script src="libs/js/bootstrap.js"></script>
	<script src="libs/js/bootstrap.min.js"></script>
	<title>Marcação</title>
</head>
<body>
	<form method="post" class="form-horizontal">
		<div class="container">
			<div class="row">
				<div class="col-md-4" style="height:200px;"></div>
			</div>
			<div class="row">
				<div class="col-md-4 col-md-offset-4">
					<fieldset>
						<!-- Form Name -->
						<legend>Registro Eletrônico de Ponto</legend>
   
						<!-- Text input-->
						<div class="control-group">
							<label class="control-label" for="login">Login</label>
							<div class="controls">
								<input id="login" name="login" type="text" placeholder="" class="form-control input-md" required="" value="<?php echo $usuario; ?>">
							</div>
						</div>

						<!-- Password input-->
						<div class="control-group">
							<label class="control-label" for="senha">Senha</label>
							<div class="controls">
								<input id="senha" name="senha" type="password" placeholder="" class="form-control input-md" required="">
							</div>
						</div>

						<!-- Button -->
						<div class="control-group">
							<label class="control-label" for="entrar"></label>
							<div class="controls">
								<button id="entrar" name="entrar" class="btn btn-default">Entrar</button>
							</div>
						</div>
					</fieldset>
					<?php
					if ($msg) {
						echo "<div style='height:15px;'></div><div class='alert alert-warning' role='alert'>{$msg}</div>";
					}
					?>
				</div>
			</div>
		</div>
	</form>
</body>
</html>
