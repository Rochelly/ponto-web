/**
 * @author [author]
 * @version [version]
 */



 function converteHorasEmMinutos(horas){

 	horas2 = horas.split(":");

 	if (horas[0]=='-') {
 		var tempoHoras   = horas2[0];

 		var tempoMinutos = horas2[1];

 		return (( parseInt(tempoHoras, 10)* 60) - parseInt(tempoMinutos, 10));
 	}
 	else{
 		var tempoHoras   = horas2[0];
 		var tempoMinutos = horas2[1];
 		return( (tempoHoras * 60) + parseInt(tempoMinutos, 10));
 	}

 }


 function converteMinutosEmHoras(minutos){
 	if(minutos>=0){
 		var horas = parseInt(minutos/60,10);
 		var minutos = minutos - horas*60;
 		if (minutos>=10)
 			return horas.toString()+':'+minutos.toString();
 		if (minutos == 0)
 			return horas.toString()+':'+minutos.toString()+'0';
 		else
 			return horas.toString()+':0'+minutos.toString();
 	}else{

 		minutos = minutos*(-1);
 		var horas = parseInt(minutos/60,10);
 		var minutos = minutos - horas*60;
 		if (minutos>=10)
 			return '-'+horas.toString()+':'+minutos.toString();
 		if (minutos == 0)
 			return horas.toString()+':'+minutos.toString()+'0';
 		else
 			return '-'+horas.toString()+':0'+minutos.toString();

 	}
 }
/**
 * Calcula a diferença entre dois horarios e retorna
 * em minutos a  diferença
 * 
 */
 function diferencaEntreHoras (saida1,entrada2){
	 	/**
		 * saidaTempo = [saida1 convertida  em minutos]
		 */
		 var saidaTempo = converteHorasEmMinutos(saida1);
		 /**
		 * entradaTempo = [entrada1 convertida  em minutos]
		 */
		 var entradaTempo = converteHorasEmMinutos(entrada2);
		/**
		 * retorna a Diferença entre os dois horarios da entrada convertido em minutos
		 */
		 return (parseInt(entradaTempo, 10) - parseInt(saidaTempo, 10))

 }


function get_dados_mes(mes, ano, callback) {
			$.get('/ponto/api.php/pontos?mes=' + mes + '&ano=' + ano, function (data, status) {
			/**
			 * [batidas contem a  data da batida, entradas(1,2,3), saidas(1,2,3),dia  da semana(1 a 7), carga_horaria, locais das marcaçoes,minutos trabalhados]
			 * @type {[type]}
			 */
			 var batidas = data;

			 $.get('/ponto/api.php/feriados?mes=' + mes + '&ano=' + ano, function (data, status) {
				/**
				 * [feriados  apresenta as senguintes informaçoes  (exemplo):
				 * 
					 * data: "01/05/2015"
					 * descricao: "Dia do Trabalho"
					 * id: 5]
				 * @type {array de Objects}
				 */
				 var feriados = data;


				 $.get('/ponto/api.php/terceiraentrada?mes=' + mes + '&ano=' + ano, function (data, status) {
				/**
				 * [terceiraMarcacao Object {quantidade:0} -> refere-se a quantidade de terceira  marcaçao que o  funcionario teve no mes]
				 * @type {[type]}
				 */
				 var terceiraMarcacao = data;
				 callback(batidas, feriados, terceiraMarcacao);

				});
				});
			});
}


function atualiza(e) {
			var mes = $('#mes').val();
			var ano = $('#ano').val();
			var feriado = 0;
			var minutosDescontadosDia = 0;
			minutosDescontadosMes = 0; 

/**
 * [description: cria um tabela  na  pagina de marcaçoes sempre que no  mes constar uma ocorrencia
 * no mes, construindo  uma legenda  para os codigos da ocorrencia ]
 */
$.get('/ponto/api.php/legendas?mes=' + mes + '&ano=' + ano, function (data, status) {


 	var  caption = $("#legenda  caption");
 	caption.html('');

 	var  thead = $("#legenda thead");
 	thead.html('');

 	var  tbody = $("#legenda  tbody");
 	tbody.html('');

 	if (data && data.length) {

 		caption.append("<h2>Legenda:</h2>");
 		thead.append($('<th>', {html: '<center>   Código </center>  '}));
 		thead.append($('<th>', {html: '<center>Descrição'}));

 		for (var i = 0; i < data.length; i++) {
 			var nome = data[i].nome;
 			var descricao = data[i].descricao;
 			var tr="<tr><td>"+nome+"</td><td>"+descricao+"</td></tr>";
 			thead.append(tr);
 		}
 		
 	}
 });



 get_dados_mes(mes, ano, function (batidas, feriados,terceiraMarcacao) {
		/**
		 * Titulo  da tabela de marcaçoes 
		 */

		 var thead = $('#marcacao thead');
		 thead.html('');
		 thead.append($('<th>', {html: '<center>Data'}));
		 thead.append($('<th>', {html: '<center>Entrada'}));
		 thead.append($('<th>', {html: '<center>Saida'}));
		 thead.append($('<th>', {html: '<center>Entrada'}));
		 thead.append($('<th>', {html: '<center>Saida'}));
		 if(terceiraMarcacao.quantidade>0){
		 	thead.append($('<th>', {html: '<center>Entrada'}));
		 	thead.append($('<th>', {html: '<center>Saida'}));
		 }
		 thead.append($('<th>', {html: '<center>Horas Trabalhadas'}));
		 thead.append($('<th>', {html: '<center>Saldo'}));
		 var tbody = $('#marcacao tbody');
		 tbody.html('');

		/**
		 * [lastDay  numero de quantidade de  dias do mes selecionado]
		 * @type {Number}
		 */
		 var lastDay = (new Date(2015, mes, 0)).getDate();

		 var totalHoras = "00:00";

		/**
		 * [dataAtual Recupera  a de  hoje para highlighted do dia]
		 * @type {Date}
		 */
		 dataAtual = new Date();
		 diaAtual = dataAtual.getDate();
		 mesAtual = dataAtual.getMonth()+1;
		 anoAtual = dataAtual.getFullYear();
		 mesAtual = (mesAtual < 10) ? "0" + mesAtual : mesAtual.toString();
		 diaAtual = (diaAtual < 10) ? '0' + diaAtual : diaAtual.toString();
		 dataAtual = diaAtual+"/"+mesAtual+"/"+anoAtual;
		/**
		 * [for   roda o  numero  de dias do  mes]
		 * @param  {Number} dia [quantidade de dias do mes]
		 * @param  {[type]} i   [description quantidade  de objetos(instancias da  consulta do banco )]
		 */

		 for (dia = 1, i = 0; dia <= lastDay; dia++) {
		 	var str_mes = (mes < 10) ? "0" + mes : mes;
		 	var str_dia = (dia < 10) ? '0' + dia : dia.toString();
				/**
				 * [datames em cada iteraçao recebe  a data de um  dia trabalhado]
				 * @type {date}
				 */
				 var datames = str_dia + "/" + str_mes + "/" + ano;
				/**
				 * [tr2 tag para a marcaçao do final de semana]
				 * @type {tag html}
				 */
				 var tr2 = $('<tr class="success">');
				 var tr = $('<tr>');
				/**
				 * [if highlighted para o  dia de  hoje]
				 */
				 if(datames==dataAtual)
				 	tr = $('<tr class="hoje">');


				/**
				 * [if adicona somente as  batidas ate o  dia atual]
				 */
				 if (i < batidas.length && batidas[i].bdata == datames) {

				 	var texto = '<center>--:--</center>';
					/**
					 * [hoje   uma data para dia do mes  para se  comparar se  o dia e sabado ou 
					 * domingo]
					 * @type {Date}
					 */
					 var hoje = new Date(ano, mes - 1, dia);

					 if (hoje.getUTCDay() == 0){
					 	tr=tr2;
					 	texto = '<center><span class="folga">Domingo</span>';
					 }
					 if (hoje.getUTCDay() == 6){
					 	texto = '<center><span class="folga">Sábado</span>';
					 	tr=tr2;
					 }


					 tr.append($('<td>', {html: '<center>'+datames}));
					 tr.append($('<td>', {html: batidas[i].bentrada1 == null ? texto : '<center><span title='+batidas[i].eentrada1+'>' + batidas[i].bentrada1.replace('_', '') + '</span>'}));
					/**
					 * verificando se  o funcionario fez menos de uma hora de almoço
					 */
					 if ((batidas[i].bsaida1 != null) && (batidas[i].bentrada2 != null ) && (diferencaEntreHoras(batidas[i].bsaida1,batidas[i].bentrada2)<60) ) {
					 	tr.append($('<td>', {html: batidas[i].bsaida1 == null ? texto : '<center><span class="saldo neg" title=Menos_de_uma_hora_de_almoço:_'+batidas[i].esaida1+'>' +batidas[i].bsaida1.replace('_', '')+'</span>'}));
					 	tr.append($('<td>', {html: batidas[i].bentrada2 == null ? texto : '<center><span class="saldo neg" title= Menos_de_uma_hora_de_almoço:_'+batidas[i].eentrada2+'>' +batidas[i].bentrada2.replace('_', '')+ '</span>'}));

					 	minutosDescontadosDia = 60 - diferencaEntreHoras(batidas[i].bsaida1,batidas[i].bentrada2);

					 	minutosDescontadosMes = minutosDescontadosMes + minutosDescontadosDia;
					 	console.log(minutosDescontadosMes);

					 }
					 else{
					 	tr.append($('<td>', {html: batidas[i].bsaida1 == null ? texto : '<center><span title='+batidas[i].esaida1+'>' +batidas[i].bsaida1.replace('_', '')+'</span>'}));
					 	tr.append($('<td>', {html: batidas[i].bentrada2 == null ? texto : '<center><span title='+batidas[i].eentrada2+'>' +batidas[i].bentrada2.replace('_', '')+ '</span>'}));
					 	minutosDescontadosDia = 0;
					 	minutosDescontadosMes = minutosDescontadosMes + minutosDescontadosDia;
					 }


					 tr.append($('<td>', {html: batidas[i].bsaida2 == null ? texto : '<center><span title='+batidas[i].esaida2+'>' +batidas[i].bsaida2.replace('_', '')+ '</span>'}));

					 /**
					  * [if confere se o funcionario possui uma  terceira marcaçao de ponto no mes]
					  * @param terceiraMarcacao.quantidade>0 [quantidade de  vezes de terceiras marcaçao ]
					  */
					  if(terceiraMarcacao.quantidade>0){
					  	tr.append($('<td>', {html: batidas[i].bentrada3 == null ? texto : '<center><span title='+batidas[i].eentrada2+'>' +batidas[i].bentrada3.replace('_', '')+ '</span>'}));
					  	tr.append($('<td>', {html: batidas[i].bsaida3 == null ? texto : '<center><span title='+batidas[i].esaida2+'>' +batidas[i].bsaida3.replace('_', '')+ '</span>'}));
					  }

					 // Coluna de  horas Trabalhadas
					 tr.append($('<td>', {html: batidas[i].horas_trabalhadas == null ? texto : '<center>'+batidas[i].horas_trabalhadas})); 

					 // Busca  o saldo  no  banco
					 if (batidas[i].saldo != null) {
					 	if (batidas[i].saldo[0] == "-"){

					 		var saldo = converteMinutosEmHoras(converteHorasEmMinutos(batidas[i].saldo) - minutosDescontadosDia);


					 		tr.append($('<td>', {html: '<center><span class="saldo neg">' + saldo + '</span>'}));
					 	}
					 	else{
					 		var saldo = converteMinutosEmHoras(converteHorasEmMinutos(batidas[i].saldo) - minutosDescontadosDia);

					 		tr.append($('<td>', {html: '<center><span class="saldo pos">' + saldo + '</span>'}));
					 	}
					 } 
					 else {
					 	tr.append($('<td>', {html: texto}));
					 }
					 tbody.append(tr);
					 i++;
					}
			/**
			 *  Se  a data  criada no loop nao  estiver na tabela batidas
			 *  pode ser por  3  motivos :
				 *  Feriado
				 *  Fim de Semana
				 *  Falta do servidor
			 * 
			 */
			 else {
			 	
			 	var falta = true;

			 	var texto = '<center>--:--</center>';

			 	/**
			 	 * [description] 	retorna o feriado se  existir
			 	 * @param  {[type]} item) {return item.data [feriado]
			 	 * @return {[type]}       [data]
			 	 */
			 	 var feriado = feriados.filter(function (item) {
			 	 	return item.data == datames;
			 	 });

			 	 if (feriado.length) {
			 	 	texto = '<center><span class="folga" title="'+feriado[0].descricao+'">Feriado</span></center>';
					//texto = '<span class="folga">'+feriado[0].descricao+'</span>';
					tr = tr2;
					falta = false;
				}

				/**
				 * [hoje   uma data para dia do mes  para se  comparar se  o dia e sabado ou 
				 * domingo]
				 * @type {Date}
				 */
				 var hoje = new Date(ano, mes - 1, dia);

				 if (hoje.getUTCDay() == 0){
				 	texto = '<center><span class="folga">Domingo</span>';
				 	tr=tr2;
				 	falta = false;
				 }
				 if (hoje.getUTCDay() == 6){
				 	texto = '<center><span class="folga">Sábado</span>';
				 	tr=tr2;
				 	falta = false;
				 }

				 if ((hoje.getUTCDay() == 6) | (hoje.getUTCDay() == 0))
				 	feriado += 8;

				 tr.append($('<td>', {html: '<center>'+datames})); // Data
				 tr.append($('<td>', {html: texto})); // Entrada 1
				 tr.append($('<td>', {html: texto})); // Saida 1
				 tr.append($('<td>', {html: texto})); // Entrada 2
				 tr.append($('<td>', {html: texto})); // Saida 2

				 if(terceiraMarcacao.quantidade>0){
				 tr.append($('<td>', {html: texto})); // Entrada 3
				 tr.append($('<td>', {html: texto})); // Saida3
				}
				 tr.append($('<td>', {html: texto})); // Horas Trabalhadas
				 tr.append($('<td>', {html: texto})); // Saldo
				 tbody.append(tr);
				}
			}
		});

$.get('/ponto/api.php/sumario?mes=' + mes + '&ano=' + ano, function (data, status) {
	data.periodo !== undefined ? $("#periodo").text(data.periodo) :  $("#periodo").text("");
	data.carga_horaria !== undefined ? $("#carga_horaria").text(data.carga_horaria) : $("#carga_horaria").text("");
	data.horas_trabalhadas !== null ? $("#horas_trabalhadas").text(data.horas_trabalhadas) : $("#horas_trabalhadas").text("");

	console.log(data.saldo);
	console.log("MinMEs:",minutosDescontadosMes);
	data.saldo !== null ? $("#saldo").text(data.saldo) : $("#saldo").text("");
	$("#saldo").removeClass('saldo pos neg');
	if(data.saldo) $("#saldo").addClass(data.saldo[0] == '-' ? 'saldo neg' : 'saldo pos')
});

}



$(document).ready(function () {
	$('#mes').change(atualiza);
	atualiza();


	$('.collapse').on('shown.bs.collapse', function(){
		$(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
	}).on('hidden.bs.collapse', function(){
		$(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
	});


});





//--------------------------------------------------------------------------------------

