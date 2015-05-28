/**
 * @author [ESTÊVÃO SAMUEL PROCÓPIO AMARAL]
 * @author [NEWTON KLEBER MACHADO SILVA]
 * @author [ROCHELLY FERNANDES ANDRADE]
 * @version [1.10]
 */

//-----------------Calculos envolvendo Horas ---------------------------------------------------------------------

function converteHorasEmMinutos(horas) {
    horas2 = horas.split(":");
    if (horas[0] == '-') {
        var tempoHoras = horas2[0];
        var tempoMinutos = horas2[1];
        return ((parseInt(tempoHoras, 10) * 60) - parseInt(tempoMinutos, 10));
    }
    else {
        var tempoHoras = horas2[0];
        var tempoMinutos = horas2[1];
        return((tempoHoras * 60) + parseInt(tempoMinutos, 10));
    }
}

function converteMinutosEmHoras(minutos) {
    if (minutos >= 0) {
        var horas = parseInt(minutos / 60, 10);
        var minutos = minutos - horas * 60;
        if (minutos >= 10)
            return horas.toString() + ':' + minutos.toString();
        if (minutos == 0)
            return horas.toString() + ':' + minutos.toString() + '0';
        else
            return horas.toString() + ':0' + minutos.toString();
    } else {
        minutos = minutos * (-1);
        var horas = parseInt(minutos / 60, 10);
        var minutos = minutos - horas * 60;
        if (minutos >= 10)
            return '-' + horas.toString() + ':' + minutos.toString();
        if (minutos == 0)
            return horas.toString() + ':' + minutos.toString() + '0';
        else
            return '-' + horas.toString() + ':0' + minutos.toString();
    }
}

function calculoCargaHoraria(horarios){
    /** [horasDiarias description] Armazena a carga  horaria diaria
    * @type {Array} */
    var horasDiarias  = [];
    var horasSemanais = 0;
    for (var i = 0; i < horarios.length; i++) {
        /**[if description] verifica se existe horarios nesse dia da semana*/

        var periodo1=diferencaEntreHoras(horarios[i].entrada1.toString(),horarios[i].saida1.toString());

        if (horarios[i].entrada2 != null) {
            var periodo2=diferencaEntreHoras(horarios[i].entrada2.toString(),horarios[i].saida2.toString());
        }

        /*[if description] confere se existe a terceira entrada neste dia da semana*/
        if (horarios[i].entrada3 != null)
            var periodo3=diferencaEntreHoras(horarios[i].entrada3.toString(),horarios[i].saida3.toString());
        /*[if description] calculo da carga horaria Diaria*/
        if (periodo3 != undefined)
            horasDiarias[horarios[i].dia_semana] = converteMinutosEmHoras(periodo1 + periodo2 + periodo3);
        else{
            if (periodo2 != undefined)
             horasDiarias[horarios[i].dia_semana] = converteMinutosEmHoras(periodo1 + periodo2);
         else
             horasDiarias[horarios[i].dia_semana] = converteMinutosEmHoras(periodo1);
     }
     horasSemanais += converteHorasEmMinutos( horasDiarias[horarios[i].dia_semana]);
 }
 horasSemanais = converteMinutosEmHoras(horasSemanais);
    /**[horas description] armazena a carga horaria por  dia da semana e por dia
    * @type {Array} */
    horas = [horasSemanais,horasDiarias];
    return horasDiarias;
}

function calculaSaldoDiario(marcacao){

    if (marcacao.bentrada1 == null | marcacao.bsaida1 == null) {
        var periodo1 = 0;
    }
    else
    {
        if (marcacao.bentrada1[0] == '*' | marcacao.bsaida1[0] == '*') {
            var periodo1 = 0;
        }else {
            var periodo1 = diferencaEntreHoras(marcacao.bentrada1,marcacao.bsaida1)
        }
    }

    if (marcacao.bentrada2 == null | marcacao.bsaida2 == null) {
        var periodo2 = 0;
    }else
    {
        if (marcacao.bentrada2[0] == '*' | marcacao.bsaida2[0] == '*') {
            var periodo2 = 0;
        }else {
            var periodo2 = diferencaEntreHoras(marcacao.bentrada2,marcacao.bsaida2)
        }
    }

    if (marcacao.bentrada3 == null | marcacao.bsaida3 == null) {
        var periodo3 = 0;
    }else
    {
        if (marcacao.bentrada3[0] == '*' | marcacao.bsaida3[0] == '*') {
            var periodo3 = 0;
        }else {
            var periodo3 = diferencaEntreHoras(marcacao.bentrada3,marcacao.bsaida3)
        }

    }

    var saldoDiario = (periodo1+periodo2+periodo3);

    return saldoDiario;
}

function verificaOcorrencia(marcacao){
    if (marcacao.bentrada1 !=  null && marcacao.bsaida1 !=  null)
        if (marcacao.bentrada1[0] == '*' | marcacao.bsaida1[0] == '*')
            return true;


        if (marcacao.bentrada2 != null && marcacao.bsaida2 != null)
          if (marcacao.bentrada2[0] == '*' | marcacao.bsaida2[0] == '*')
            return true;


        if (marcacao.bentrada3 !=  null && marcacao.bsaida3 !=  null)
            if (marcacao.bentrada3[0] == '*' | marcacao.bsaida3[0] == '*')
                return true;

            return false;
        }

        function diferencaEntreHoras(entrada2 ,saida1 ) {
    // saidaTempo = [saida1 convertida  em minutos]
    //





    var entradaTempo = converteHorasEmMinutos(entrada2);
    // entradaTempo = [entrada1 convertida  em minutos]
    var saidaTempo   = converteHorasEmMinutos(saida1);


    resultado = (parseInt(saidaTempo, 10) - parseInt(entradaTempo, 10));


    // retorna a Diferença entre os dois horarios da entrada convertido em minutos
    return resultado
}

// -----------------Componentes Visuais --------------------------------------------------------------------------

function sumario(mes,ano,minutosDescontadosMes){
    /**
             Período: 01/05/2015 a 31/05/2015
             Carga Horária: 104:00
             Horas Trabalhadas: 80:23
             Extras/Atraso: -79:40
             Ultima Atualizacao: 20/05/2015 13:15
             */
             $.get('/ponto/api.php/sumario?mes=' + mes + '&ano=' + ano, function(data, status) {
        // se  nao houver data de marcaçoa  entao  nao existe marcaçao
        if (data.periodo == null)
            alert('Não consta nenhuma marcação neste mês!');
        //Preenchendo o sumario
        data.periodo != undefined ? $("#periodo").text(data.periodo) : $("#periodo").text("");
        data.carga_horaria != undefined ? $("#carga_horaria").text(data.carga_horaria) : $("#carga_horaria").text("");
        data.horas_trabalhadas != null ? $("#horas_trabalhadas").text(data.horas_trabalhadas) : $("#horas_trabalhadas").text("");
        saldoComDesconto = data.saldo;
        saldoComDesconto = parseInt(saldoComDesconto, 10);
        //realiza o desconto de dias  nao  trabalhados e minutos a menos na horas do almoço
        if (data.saldo != null)
            saldoComDesconto = converteMinutosEmHoras(converteHorasEmMinutos(data.saldo) - minutosDescontadosMes);
        data.saldo != null ? $("#saldo").text(saldoComDesconto) : $("#saldo").text("");
        $("#saldo").removeClass('saldo pos neg');
        if (data.saldo)
            $("#saldo").addClass(saldoComDesconto[0] == '-' ? 'saldo neg' : 'saldo pos');
    });
}

function cabecalhoTabelaMarcacoes(terceiraMarcacao){
    var thead = $('#marcacao thead');
    thead.html('');
    thead.append($('<th>', {html: '<center>Data'    }));
    thead.append($('<th>', {html: '<center>Entrada' }));
    thead.append($('<th>', {html: '<center>Saida'   }));
    thead.append($('<th>', {html: '<center>Entrada' }));
    thead.append($('<th>', {html: '<center>Saida'   }));
    //verifica se  existe alguma terceira marcaçao no mes
    if (terceiraMarcacao.quantidade > 0) {
        thead.append($('<th>', {html: '<center>Entrada' }));
        thead.append($('<th>', {html: '<center>Saida'   }));
    }
    thead.append($('<th>', {html: '<center>Horas Trabalhadas'}));
    thead.append($('<th>', {html: '<center>Saldo'            }));
}

function corpoTabelaMarcacoes(mes,ano,batidas, feriados, terceiraMarcacao,horarios) {

    var minutosDescontadosDia = 0;
    var minutosDescontadosMes = 0;
    var cargaHorariaTotalMes  = 0;
    var saldoTotalMes         = 0;


    cabecalhoTabelaMarcacoes(terceiraMarcacao);

    var tbody = $('#marcacao tbody');
    tbody.html('');


            {   // dataAtual: Recupera  a de  hoje para highlighted do dia
                dataAtual = new Date();
                diaAtual  = dataAtual.getDate(); // dia de hoje
                mesAtual  = dataAtual.getMonth() + 1; // mes de hoje
                anoAtual  = dataAtual.getFullYear(); // ano de hoje
                mesAtual  = (mesAtual < 10) ? "0" + mesAtual : mesAtual.toString(); //  ex :  mes 3 convertido para 03
                diaAtual  = (diaAtual < 10) ? '0' + diaAtual : diaAtual.toString(); //  ex :  dia 1 convertido para 01
                dataAtual = diaAtual + "/" + mesAtual + "/" + anoAtual; // converte a data atual para o seguinte fomato : dd/mm/aa
            }

            var lastDay = (new Date(ano, mes, 0)).getDate(); // lastDay :  numero de quantidade de  dias do mes selecionado
            /**for   roda o  numero  de dias do  mes]
             * @param  {int} dia      [quantidade de dias do mes]
             * @param  {int} i        [quantidade  de objetos(instancias da  consulta do banco )]
             * @param  {int} lastDay  [lastDay :  numero de quantidade de  dias do mes selecionado]
             */
             for (dia = 1, i = 0; dia <= lastDay; dia++) {

                var str_mes = (mes < 10) ? "0" + mes : mes;
                var str_dia = (dia < 10) ? '0' + dia : dia.toString();
                var datames = str_dia + "/" + str_mes + "/" + ano; // datames: em cada iteraçao recebe  a data de um  dia trabalhado]

                var trFolga = $('<tr class="success">');  // [trFolga tag para a marcaçao do final de semana e feriados ]
                var tr = $('<tr>');
                if (datames == dataAtual) //if highlighted para o  dia de  hoje]
                    tr = $('<tr class="hoje">');

                // [if adicona somente as  batidas ate o  dia atual]
                if (i < batidas.length && batidas[i].bdata == datames) {

                    var falta = false;
                    var fimDeSemana = false ;
                    var feriadoBool = false;
                    var texto = '<center>--:--</center>';
                    var dataCorrente = new Date(ano, mes - 1, dia);// dataCorrente: a data corrente no loop

                    if (dataCorrente.getUTCDay() == 0) {
                        texto = '<center><span class="folga">Domingo</span>';
                        tr = trFolga;
                        fimDeSemana = true;
                    }
                    if (dataCorrente.getUTCDay() == 6) {
                        texto = '<center><span class="folga">Sábado</span>';
                        tr = trFolga;
                        fimDeSemana = true;
                    }

                    var feriado = feriados.filter(function(item) {
                            return item.data == datames;
                        });

                    if (feriado.length) {
                         texto = '<center><span class="folga" title="' + feriado[0].descricao + '">Feriado</span></center>';
                        tr = trFolga;
                        feriadoBool = true;
                    }
                    if (batidas[i].bentrada1 == null && fimDeSemana == false &&  feriadoBool == false){
                        falta = true;
                        minutosDescontadosDia = minutosDescontadosDia + 480;
                    }

                    tr.append($('<td>', {html: '<center>' + datames}));
                    /**
                     * [if description] caso nao tenha a entrada1 entao
                     * @param  {[type]} batidas[i].bentrada1 [description]
                     * @return {[type]}                      [description]
                     */

                    // verifica se o funcionario faltou e realizao desconto da falta


                    tr.append($('<td>', {html: batidas[i].bentrada1 == null ? texto : '<center><span title=' + batidas[i].eentrada1 + '>' + batidas[i].bentrada1.replace('_', '') + '</span>'}));

                    // verificando se  o funcionario fez menos de uma hora de almoço
                    if ((batidas[i].bsaida1 != null) && (batidas[i].bentrada2 != null) && (diferencaEntreHoras(batidas[i].bsaida1, batidas[i].bentrada2) < 60)) {
                        tr.append($('<td>', {html: batidas[i].bsaida1 == null ? texto : '<center><span class="saldo neg" title=Menos_de_uma_hora_de_almoço:_' + batidas[i].esaida1 + '>' + batidas[i].bsaida1.replace('_', '') + '</span>'}));
                        tr.append($('<td>', {html: batidas[i].bentrada2 == null ? texto : '<center><span class="saldo neg" title= Menos_de_uma_hora_de_almoço:_' + batidas[i].eentrada2 + '>' + batidas[i].bentrada2.replace('_', '') + '</span>'}));
                        minutosDescontadosDia = 60 - diferencaEntreHoras(batidas[i].bsaida1, batidas[i].bentrada2);
                        minutosDescontadosMes = minutosDescontadosMes + minutosDescontadosDia;
                    }
                    else {// hora de almoço correnta
                        tr.append($('<td>', {html: batidas[i].bsaida1 == null ? texto : '<center><span title=' + batidas[i].esaida1 + '>' + batidas[i].bsaida1.replace('_', '') + '</span>'}));
                        tr.append($('<td>', {html: batidas[i].bentrada2 == null ? texto : '<center><span title=' + batidas[i].eentrada2 + '>' + batidas[i].bentrada2.replace('_', '') + '</span>'}));
                        minutosDescontadosDia = 0;
                        minutosDescontadosMes = minutosDescontadosMes + minutosDescontadosDia;
                    }
                    tr.append($('<td>', {html: batidas[i].bsaida2 == null ? texto : '<center><span title=' + batidas[i].esaida2 + '>' + batidas[i].bsaida2.replace('_', '') + '</span>'}));
                    /**
                     * [if confere se o funcionario possui uma  terceira marcaçao de ponto no mes]
                     * @param terceiraMarcacao.quantidade>0 [quantidade de  vezes de terceiras marcaçao ]
                     */
                     if (terceiraMarcacao.quantidade > 0) {
                        tr.append($('<td>', {html: batidas[i].bentrada3 == null ? texto : '<center><span title=' + batidas[i].eentrada2 + '>' + batidas[i].bentrada3.replace('_', '')   + '</span>'}));
                        tr.append($('<td>', {html: batidas[i].bsaida3   == null ? texto : '<center><span title=' + batidas[i].esaida2   + '>' + batidas[i].bsaida3.replace('_', '')     + '</span>'}));
                    }

                    // Coluna de  horas Trabalhadas
                    tr.append($('<td>', {html: batidas[i].horas_trabalhadas == null  ? texto : '<center>' + converteMinutosEmHoras(calculaSaldoDiario(batidas[i]))}));

                    if (falta) {
                        tr.append($('<td>', {html: '<center><span class="saldo neg"> -8:00</span>'}));
                    }else{

                        var minutosTrabalhadosComDesconto = calculaSaldoDiario(batidas[i]) - minutosDescontadosDia ;
                        var cargaHoraria = calculoCargaHoraria(horarios);

                        if (!verificaOcorrencia(batidas[i]) &&  minutosTrabalhadosComDesconto != 0) {

                           var saldoDiarioEmHoras = converteMinutosEmHoras(diferencaEntreHoras(cargaHoraria[dataCorrente.getUTCDay()],converteMinutosEmHoras(minutosTrabalhadosComDesconto)));

                           if (saldoDiarioEmHoras[0] == "-")
                               tr.append($('<td>', {html: '<center><span class="saldo neg">' + saldoDiarioEmHoras + '</span>'}));
                           else
                                tr.append($('<td>', {html: '<center><span class="saldo pos">' + saldoDiarioEmHoras + '</span>'}));
                    }
                    else
                        if(feriadoBool | fimDeSemana)
                             tr.append($('<td>', {html: texto}));
                         else
                            tr.append($('<td>', {html: '<center> 0:00'}));
                }


                tbody.append(tr);
                i++;
            }
            else {
                    /**
                     *  Se  a data  criada no loop nao  estiver na tabela batidas
                     *  pode ser por  3  motivos :
                     *  Feriado
                     *  Fim de Semana
                     *  Falta do servidor no fim  do  mes,
                     */
                     var texto = '<center>--:--</center>';
                     var fimDeSemanaBool = false;
                     var feriadoBool = false;
                     var hoje = new Date(ano, mes - 1, dia);
                     var dataHAtual = new Date(anoAtual, mesAtual - 1, diaAtual);
                     var falta = false;
                    /**
                     * [description]    retorna o feriado se  existir
                     * @param  {[type]} item) {return item.data [feriado]
                     * @return {[type]}       [data]
                     */
                     var feriado = feriados.filter(function(item) {
                        return item.data == datames;
                    });

                     if (feriado.length) {
                        texto = '<center><span class="folga" title="' + feriado[0].descricao + '">Feriado</span></center>';
                        tr = trFolga;
                        feriadoBool = true;
                    }
                    //[hoje( hoje e hoje)   uma data para dia do mes  para se  comparar se  o dia e sabado ou  domingo ]
                    if (hoje.getUTCDay() == 0) {
                        texto = '<center><span class="folga">Domingo</span>';
                        tr = trFolga;
                        fimDeSemanaBool = true;
                    }
                    if (hoje.getUTCDay() == 6) {
                        texto = '<center><span class="folga">Sábado</span>';
                        tr = trFolga;
                        fimDeSemanaBool = true;
                    }

                    tr.append($('<td>', {html: '<center>' + datames})); // Data
                    tr.append($('<td>', {html: texto})); // Entrada 1
                    tr.append($('<td>', {html: texto})); // Saida 1
                    tr.append($('<td>', {html: texto})); // Entrada 2
                    tr.append($('<td>', {html: texto})); // Saida 2
                    if (terceiraMarcacao.quantidade > 0) {
                        tr.append($('<td>', {html: texto})); // Entrada 3
                        tr.append($('<td>', {html: texto})); // Saida3
                    }
                    tr.append($('<td>', {html: texto})); // Horas Trabalhadas

                    // [if   se  a  data  que esta no loop for  menor que a data de hoje entao  a marcao  dever  ser debitada
                    if (dataHAtual > hoje) {
                        /**
                         * [if description] para  descontar nao pode ser feriado ou  fim  de semana
                         * e ao mesmo tempo nao desconta nos meses : janeiro, fevereiro, março do ano  de 2015
                         */
                         if (!(fimDeSemanaBool | feriadoBool) && (!((mes == '1' | mes == '2' | mes == '3') && ano == '2015'))) {
                            falta = true;
                            minutosDescontadosMes = minutosDescontadosMes + 480;
                        }

                    }
                    /*se e falta marca com menos -8 horas*/
                    if (falta == true)
                        tr.append($('<td>', {html: '<center><span class="saldo neg"> -8:00</span>'})); // Saldo
                    else
                        tr.append($('<td>', {html: texto})); // Saldo

                    tbody.append(tr);
                }

            }//  fim do loop que lista as  marcaçoes

            // cria o sumario
            sumario(mes,ano,minutosDescontadosMes);
        }

        function legendaOcorrencias(mes,ano){
            $.get('/ponto/api.php/legendas?mes=' + mes + '&ano=' + ano, function(data, status) {
        //Titulo da tabela de legendas
        var caption = $("#legenda  caption");
        caption.html('');
        //cabeçalho da tabela de legendas
        var thead = $("#legenda thead");
        thead.html('');
        // corpo da tabela de legendas
        var tbody = $("#legenda  tbody");
        tbody.html('');
        /**
        * [if description] verifica se existe alguma ocorrencia lançada
        * para a criaçao da  tabela de  legendas
        */
        if (data && data.length) {
            //adiciona o  cabeçalho  da legenda
            caption.append("<h2>Legenda:</h2>");
            thead.append($('<th>', {html: '<center>   Código </center>  '}));
            thead.append($('<th>', {html: '<center>Descrição'}));
            //preenche  a legenda com os codigos e descriçoes
            for (var i = 0; i < data.length; i++) {
                var nome = data[i].nome;
                var descricao = data[i].descricao;
                var tr = "<tr><td>" + nome + "</td><td>" + descricao + "</td></tr>";
                thead.append(tr);
            }
        }
    });
}

function efeitoCollapse(){
    $('.collapse').on('shown.bs.collapse', function() {
        $(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
    }).on('hidden.bs.collapse', function() {
        $(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
    });

    $('#imprimir').click(function(event){
        event.preventDefault();
        var observacao = $('#obs').val();
  /*      $('#obs2').val(observacao);*/
        $("#obs2").html("<pre><p >"+ observacao+"</p></pre>" );
        window.print();

        return false;
    });

}
//----------------------------------------------------------------------------------------------------------------
function get_dados_mes(mes, ano, callback){
    $.get('/ponto/api.php/pontos?mes=' + mes + '&ano=' + ano, function(data, status) {
        /* [batidas contem a  data da batida, entradas(1,2,3), saidas(1,2,3),
        *dia  da semana(1 a 7), carga_horaria, locais das marcaçoes,minutos trabalhados]*/
        var batidas = data;
        $.get('/ponto/api.php/feriados?mes=' + mes + '&ano=' + ano, function(data, status) {
            /**[feriados  apresenta as senguintes informaçoes  (exemplo):
             * data: "01/05/2015"
             * descricao: "Dia do Trabalho"
             * id: 5]
             * @type {array de Objects}*/
             var feriados = data;
             $.get('/ponto/api.php/terceiraentrada?mes=' + mes + '&ano=' + ano, function(data, status) {
                /**[terceiraMarcacao Object {quantidade:0} -> refere-se a quantidade
                * de terceira  marcaçao que o  funcionario teve no mes]             */
                var terceiraMarcacao = data;
                $.get('/ponto/api.php/horarios',function (data,status){
                    /* recupere os horarios dos funcionarios*/
                    var horarios=data;
                    // o  retorno
                    callback(mes,ano,batidas, feriados, terceiraMarcacao,horarios);
                });
            });
         });
    });
}

function atualiza(e){
    var mes = $('#mes').val();
    var ano = $('#ano').val();
    legendaOcorrencias(mes,ano);
    get_dados_mes(mes, ano,corpoTabelaMarcacoes);



}

$(document).ready(function() {
    $('#mes').change(atualiza);
    atualiza();
    efeitoCollapse();
});





//--------------------------------------------------------------------------------------

