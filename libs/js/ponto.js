/**
 * @author [ESTÊVÃO SAMUEL PROCÓPIO AMARAL]
 * @author [NEWTON KLEBER MACHADO SILVA]
 * @author [ROCHELLY FERNANDES ANDRADE]
 * @version [1.10]
 */
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

function diferencaEntreHoras(saida1, entrada2) {
    // saidaTempo = [saida1 convertida  em minutos]
    var saidaTempo = converteHorasEmMinutos(saida1);
    // entradaTempo = [entrada1 convertida  em minutos]
    var entradaTempo = converteHorasEmMinutos(entrada2);
    // retorna a Diferença entre os dois horarios da entrada convertido em minutos
    return (parseInt(entradaTempo, 10) - parseInt(saidaTempo, 10))
}

function get_dados_mes(mes, ano, callback) {
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
                    callback(batidas, feriados, terceiraMarcacao,horarios);
                });
            });
         });
    });
}

function calculoCargaHoraria(horarios){
    /** [horasDiarias description] Armazena a carga  horaria diaria
    * @type {Array} */
    var horasDiarias  = [];
    var horasSemanais = 0;
    for (var i = 0; i < horarios.length; i++) {
        /**[if description] verifica se existe horarios nesse dia da semana*/
        if (horarios[i].entrada1 != null) {
            var periodo1=diferencaEntreHoras(horarios[i].entrada1.toString(),horarios[i].saida1.toString());

            if (horarios[i].entrada2 != null) {
                var periodo2=diferencaEntreHoras(horarios[i].entrada2.toString(),horarios[i].saida2.toString());
            }
           
            /*[if description] confere se existe a terceira entrada neste dia da semana*/
            if (horarios[i].entrada3 != null)
                var periodo3=diferencaEntreHoras(horarios[i].entrada3.toString(),horarios[i].saida3.toString());
            /*[if description] calculo da carga horaria Diaria*/
            if (periodo3 != undefined)
                horasDiarias[i] = converteMinutosEmHoras(periodo1 + periodo2 + periodo3);
            else{
                if (periodo2 != undefined)
                    horasDiarias[i] = converteMinutosEmHoras(periodo1 + periodo2);
                else
                    horasDiarias[i] = converteMinutosEmHoras(periodo1);
            }
            horasSemanais += converteHorasEmMinutos(horasDiarias[i]); 
        }
        else{
            horasDiarias[i] = null;
        }
    }
    horasSemanais = converteMinutosEmHoras(horasSemanais);
    /**[horas description] armazena a carga horaria por  dia da semana e por dia 
     * @type {Array} */
    horas = [horasSemanais,horasDiarias];
    return horas;
}

function atualiza(e) {
    var mes = $('#mes').val();
    var ano = $('#ano').val();
    var feriado = 0;
    var minutosDescontadosDia = 0;
    minutosDescontadosMes = 0;
    /**description: cria um tabela  na  pagina de marcaçoes
     * sempre que no  mes constar uma ocorrenciano mes,
     * construindo  uma legenda  para os codigos da ocorrencia*/
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

get_dados_mes(mes, ano, function(batidas, feriados, terceiraMarcacao,horarios) {

            cargaHoraria = calculoCargaHoraria(horarios); 

            // Titulo  da tabela de marcaçoes
            var thead = $('#marcacao thead');
            thead.html('');
            thead.append($('<th>', {html: '<center>Data'}));
            thead.append($('<th>', {html: '<center>Entrada'}));
            thead.append($('<th>', {html: '<center>Saida'}));
            thead.append($('<th>', {html: '<center>Entrada'}));
            thead.append($('<th>', {html: '<center>Saida'}));
            //verifica se  existe alguma terceira marcaçao no mes
            if (terceiraMarcacao.quantidade > 0) {
                thead.append($('<th>', {html: '<center>Entrada'}));
                thead.append($('<th>', {html: '<center>Saida'}));
            }
            thead.append($('<th>', {html: '<center>Horas Trabalhadas'}));
            thead.append($('<th>', {html: '<center>Saldo'}));


            var tbody = $('#marcacao tbody');
            tbody.html('');

            // lastDay :  numero de quantidade de  dias do mes selecionado
            var lastDay = (new Date(2015, mes, 0)).getDate();

            var totalHoras = "00:00";

            // dataAtual: Recupera  a de  hoje para highlighted do dia
            dataAtual = new Date();
            diaAtual  = dataAtual.getDate(); // dia de hoje
            mesAtual  = dataAtual.getMonth() + 1; // mes de hoje
            anoAtual  = dataAtual.getFullYear(); // ano de hoje
            mesAtual  = (mesAtual < 10) ? "0" + mesAtual : mesAtual.toString(); //  ex :  mes 3 convertido para 03
            diaAtual  = (diaAtual < 10) ? '0' + diaAtual : diaAtual.toString(); //  ex : 	dia 1 convertido para 01
            dataAtual = diaAtual + "/" + mesAtual + "/" + anoAtual; // converte a data atual para o seguinte fomato : dd/mm/aa
            /**for   roda o  numero  de dias do  mes]
             * @param  {Number} dia 			[quantidade de dias do mes]
             * @param  {[type]} i   			[description quantidade  de objetos(instancias da  consulta do banco )]
             * @param  {[type]} lastDay 	[description]lastDay :  numero de quantidade de  dias do mes selecionado]
             */
             for (dia = 1, i = 0; dia <= lastDay; dia++) {
                var str_mes = (mes < 10) ? "0" + mes : mes;
                var str_dia = (dia < 10) ? '0' + dia : dia.toString();
                var falta = false;
                // [datames em cada iteraçao recebe  a data de um  dia trabalhado]
                var datames = str_dia + "/" + str_mes + "/" + ano;
                /** [tr2 tag para a marcaçao do final de semana e feriados ]
                 * @type {tag html}
                 * */
                 var tr2 = $('<tr class="success">');
                 var tr = $('<tr>');
                /** [if highlighted para o  dia de  hoje]
                */
                if (datames == dataAtual)
                    tr = $('<tr class="hoje">');
                /**
                 * [if adicona somente as  batidas ate o  dia atual]
                 */
                 if (i < batidas.length && batidas[i].bdata == datames) {

                    var texto = '<center>--:--</center>';
                    // [hoje   uma data para dia do mes  para se  comparar se  o dia e sabado ou  domingo]
                    var hoje = new Date(ano, mes - 1, dia);

                    if (hoje.getUTCDay() == 0) {
                        tr = tr2;
                        texto = '<center><span class="folga">Domingo</span>';
                    }

                    if (hoje.getUTCDay() == 6) {
                        texto = '<center><span class="folga">Sábado</span>';
                        tr = tr2;
                    }

                    tr.append($('<td>', {html: '<center>' + datames}));
                    /**
                     * [if description] caso nao tenha a entrada1 entao  
                     * @param  {[type]} batidas[i].bentrada1 [description]
                     * @return {[type]}                      [description]
                     */
                    if (batidas[i].bentrada1 == null) {
                        falta = true;
                        minutosDescontadosDia = minutosDescontadosDia + 480;
                        console.log(batidas[i].bentrada1 );
                        }

                    tr.append($('<td>', {html: batidas[i].bentrada1 == null ? texto : '<center><span title=' + batidas[i].eentrada1 + '>' + batidas[i].bentrada1.replace('_', '') + '</span>'}));

                    // verificando se  o funcionario fez menos de uma hora de almoço
                    if ((batidas[i].bsaida1 != null) && (batidas[i].bentrada2 != null) && (diferencaEntreHoras(batidas[i].bsaida1, batidas[i].bentrada2) < 60)) {
                        tr.append($('<td>', {html: batidas[i].bsaida1 == null ? texto : '<center><span class="saldo neg" title=Menos_de_uma_hora_de_almoço:_' + batidas[i].esaida1 + '>' + batidas[i].bsaida1.replace('_', '') + '</span>'}));
                        tr.append($('<td>', {html: batidas[i].bentrada2 == null ? texto : '<center><span class="saldo neg" title= Menos_de_uma_hora_de_almoço:_' + batidas[i].eentrada2 + '>' + batidas[i].bentrada2.replace('_', '') + '</span>'}));
                        minutosDescontadosDia = 60 - diferencaEntreHoras(batidas[i].bsaida1, batidas[i].bentrada2);
                        minutosDescontadosMes = minutosDescontadosMes + minutosDescontadosDia;
                    }
                    else {
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
                        tr.append($('<td>', {html: batidas[i].bentrada3 == null ? texto : '<center><span title=' + batidas[i].eentrada2 + '>' + batidas[i].bentrada3.replace('_', '') + '</span>'}));
                        tr.append($('<td>', {html: batidas[i].bsaida3 == null ? texto : '<center><span title=' + batidas[i].esaida2 + '>' + batidas[i].bsaida3.replace('_', '') + '</span>'}));
                    }

                    // Coluna de  horas Trabalhadas
                    tr.append($('<td>', {html: batidas[i].horas_trabalhadas == null ? texto : '<center>' + batidas[i].horas_trabalhadas}));

                    // Busca  o saldo  no  banco
                    if (batidas[i].saldo != null) {

                        if (batidas[i].saldo[0] == "-") {
                            var saldo = converteMinutosEmHoras(converteHorasEmMinutos(batidas[i].saldo) - minutosDescontadosDia);
                            tr.append($('<td>', {html: '<center><span class="saldo neg">' + saldo + '</span>'}));
                        }
                        else {
                            var saldo = converteMinutosEmHoras(converteHorasEmMinutos(batidas[i].saldo) - minutosDescontadosDia);
                            tr.append($('<td>', {html: '<center><span class="saldo pos">' + saldo + '</span>'}));
                        }
                    }
                    else {

                        if (falta) {

                            tr.append($('<td>', {html: '<center><span class="saldo neg"> -8:00</span>'}));
                        }
                        else {
                            console.log(texto);
                            tr.append($('<td>', {html: texto}));
                        }
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
                     *  Falta do servidor no fin  do  mes,
                     */

                     var texto = '<center>--:--</center>';
                     var fimDeSemanaBool = false;
                     var feriadoBool = false;
                     var hoje = new Date(ano, mes - 1, dia);
                     var dataHAtual = new Date(anoAtual, mesAtual - 1, diaAtual);
                     var falta2 = false;
                    /**
                     * [description] 	retorna o feriado se  existir
                     * @param  {[type]} item) {return item.data [feriado]
                     * @return {[type]}       [data]
                     */
                     var feriado = feriados.filter(function(item) {
                        return item.data == datames;
                    });

                     if (feriado.length) {
                        feriadoBool = true;
                        texto = '<center><span class="folga" title="' + feriado[0].descricao + '">Feriado</span></center>';
                        tr = tr2;
                    }
                    //[hoje( hoje e hoje)   uma data para dia do mes  para se  comparar se  o dia e sabado ou  domingo ]
                    if (hoje.getUTCDay() == 0) {
                        texto = '<center><span class="folga">Domingo</span>';
                        tr = tr2;
                        fimDeSemanaBool = true;
                    }
                    if (hoje.getUTCDay() == 6) {
                        texto = '<center><span class="folga">Sábado</span>';
                        tr = tr2;
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
                         if ((!(feriadoBool | fimDeSemanaBool)) && (!((mes == '1' | mes == '2' | mes == '3') && ano == '2015'))) {
                            falta2 == true;
                            minutosDescontadosMes = minutosDescontadosMes + 480;

                        }

                    }

                    if (falta2 == true)
                        tr.append($('<td>', {html: '<center><span class="saldo neg"> -8:00</span>'})); // Saldo
                    else
                        tr.append($('<td>', {html: texto})); // Saldo

                    tbody.append(tr);
                }

            }//  fim do loop que lista as  marcaçoes

            /** [description] Cria o sumario    como no  seguinte exemplo
             Período: 01/05/2015 a 31/05/2015
             Carga Horária: 104:00
             Horas Trabalhadas: 80:23
             Extras/Atraso: -79:40
             Ultima Atualizacao: 20/05/2015 13:15 */
             $.get('/ponto/api.php/sumario?mes=' + mes + '&ano=' + ano, function(data, status) {
                // se  nao houver data de marcaçoa  entao  nao existe marcaçao
                if (data.periodo == null) {
                    alert('Não consta nenhuma marcação neste mês!');
                }
                //Preenchendo o sumario
                data.periodo != undefined ? $("#periodo").text(data.periodo) : $("#periodo").text("");
                data.carga_horaria != undefined ? $("#carga_horaria").text(data.carga_horaria) : $("#carga_horaria").text("");
                data.horas_trabalhadas != null ? $("#horas_trabalhadas").text(data.horas_trabalhadas) : $("#horas_trabalhadas").text("");
                saldoComDesconto = data.saldo;
                saldoComDesconto = parseInt(saldoComDesconto, 10);
                //realiza o desconto de dias  nao  trabalhados e minutos a menos na horas do almoço
                if (data.saldo != null) {
                    saldoComDesconto = converteMinutosEmHoras(converteHorasEmMinutos(data.saldo) - minutosDescontadosMes);
                }
                data.saldo != null ? $("#saldo").text(saldoComDesconto) : $("#saldo").text("");
                $("#saldo").removeClass('saldo pos neg');
                if (data.saldo) {
                    $("#saldo").addClass(saldoComDesconto[0] == '-' ? 'saldo neg' : 'saldo pos');
                }
            });
});
} // fim da funçao atualiza

$(document).ready(function() {
    $('#mes').change(atualiza);
    atualiza();

    $('.collapse').on('shown.bs.collapse', function() {
        $(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
    }).on('hidden.bs.collapse', function() {
        $(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
    });


});





//--------------------------------------------------------------------------------------

