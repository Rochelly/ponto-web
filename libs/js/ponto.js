/**
 * @author [author]
 * @version [version]
 */


function get_dados_mes(mes, ano, callback) {
    $.get('/ponto/api.php/pontos?mes=' + mes + '&ano=' + ano, function (data, status) {
        var batidas = data;

        $.get('/ponto/api.php/feriados?mes=' + mes + '&ano=' + ano, function (data, status) {
            var feriados = data;
            //console.log(batidas, feriados);
            callback(batidas, feriados);


        });
    });
}


function   terceiraEntrada(mes,ano,callback){

    $get('/ponto/api.php/terceiraentrada?mes=' + mes + '&ano=' + ano,function(data,status){
        var terceiraMarcacao =data;
        callback(terceiraMarcacao);
    });
}


function atualiza(e) {
    var mes = $('#mes').val();
    var ano = $('#ano').val();
    var feriado = 0;


    $.get('/ponto/api.php/legendas?mes=' + mes + '&ano=' + ano, function (data, status) {
        var leg = $("#legendas");
        $("#legendas").text('');
        if (data && data.length) {
            leg.append($('<h2>').text('Legendas'));
            var list = $('<dl>');
            for (var i = 0; i < data.length; i++) {
                var dt = $('<dt>').text(data[i].nome);
                var dd = $('<dd>').text(data[i].descricao);
                list.append(dt);
                list.append(dd);
            }
            leg.append(list);
        }
    });

    $.get('/ponto/api.php/sumario?mes=' + mes + '&ano=' + ano, function (data, status) {
        data.periodo !== undefined ? $("#periodo").text(data.periodo) :  $("#periodo").text("");
        data.carga_horaria !== undefined ? $("#carga_horaria").text(data.carga_horaria) : $("#carga_horaria").text("");
        data.horas_trabalhadas !== null ? $("#horas_trabalhadas").text(data.horas_trabalhadas) : $("#horas_trabalhadas").text("");
        data.saldo !== null ? $("#saldo").text(data.saldo) : $("#saldo").text("");
        $("#saldo").removeClass('saldo pos neg');
        if(data.saldo) $("#saldo").addClass(data.saldo[0] == '-' ? 'saldo neg' : 'saldo pos')
    });

    get_dados_mes(mes, ano, function (batidas, feriados) {


      /*  terceiraEntrada(mes,ano,function (terceiraMarcacao){

            
        });
*/

        console.log('ok', batidas, feriados);
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

                    var texto = '--:--';
                    /**
                     * [hoje   uma data para dia do mes  para se  comparar se  o dia e sabado ou 
                     * domingo]
                     * @type {Date}
                     */
                    var hoje = new Date(ano, mes - 1, dia);

                    if (hoje.getUTCDay() == 0){
                        tr=tr2;
                        texto = '<span class="folga">Domingo</span>';
                    }
                    if (hoje.getUTCDay() == 6){
                        texto = '<span class="folga">Sábado</span>';
                        tr=tr2;
                    }


                    tr.append($('<td>', {html: datames}));
                    tr.append($('<td>', {html: batidas[i].bentrada1 == null ? texto : '<span title='+batidas[i].eentrada1+'>' + batidas[i].bentrada1.replace('_', '') + '</span>'}));
                    tr.append($('<td>', {html: batidas[i].bsaida1 == null ? texto : '<span title='+batidas[i].esaida1+'>' +batidas[i].bsaida1.replace('_', '')+'</span>'}));
                    tr.append($('<td>', {html: batidas[i].bentrada2 == null ? texto : '<span title='+batidas[i].eentrada2+'>' +batidas[i].bentrada2.replace('_', '')+ '</span>'}));
                    tr.append($('<td>', {html: batidas[i].bsaida2 == null ? texto : '<span title='+batidas[i].esaida2+'>' +batidas[i].bsaida2.replace('_', '')+ '</span>'}));

                    tr.append($('<td>', {html: batidas[i].bentrada3 == null ? texto : '<span title='+batidas[i].eentrada2+'>' +batidas[i].bentrada3.replace('_', '')+ '</span>'}));
                    tr.append($('<td>', {html: batidas[i].bsaida3 == null ? texto : '<span title='+batidas[i].esaida2+'>' +batidas[i].bsaida3.replace('_', '')+ '</span>'}));

                    tr.append($('<td>', {html: batidas[i].horas_trabalhadas == null ? texto : batidas[i].horas_trabalhadas}));
                    if (batidas[i].saldo != null) {
                        if (batidas[i].saldo[0] == "-")
                            tr.append($('<td>', {html: '<span class="saldo neg">' + batidas[i].saldo + '</span>'}));
                        else
                            tr.append($('<td>', {html: '<span class="saldo pos">' + batidas[i].saldo + '</span>'}));
                    } 
                    else {
                      tr.append($('<td>', {html: texto}));
                  }
                  tbody.append(tr);
                  i++;
            }
            /**
             *  Se o dia e superior ao  dia atual, entao somente 
             *  complete as marcaçoes  com '--:--'
             */
            else {
                var texto = '--:--';

                var feriado = feriados.filter(function (item) {
                    return item.data == datames;
                });

                if (feriado.length) {
                    texto = '<span class="folga" title="'+feriado[0].descricao+'">Feriado</span>';
                    //texto = '<span class="folga">'+feriado[0].descricao+'</span>';
                    tr = tr2;
                }

                /**
                 * [hoje   uma data para dia do mes  para se  comparar se  o dia e sabado ou 
                 * domingo]
                 * @type {Date}
                 */
                 var hoje = new Date(ano, mes - 1, dia);
                
                 if (hoje.getUTCDay() == 0){
                     texto = '<span class="folga">Domingo</span>';
                     tr=tr2;
                 }
                 if (hoje.getUTCDay() == 6){
                     texto = '<span class="folga">Sábado</span>';
                     tr=tr2;
                 }

                 if ((hoje.getUTCDay() == 6) | (hoje.getUTCDay() == 0))
                    feriado += 8;

                tr.append($('<td>', {html: datames}));
                tr.append($('<td>', {html: texto}));
                tr.append($('<td>', {html: texto}));
                tr.append($('<td>', {html: texto}));
                tr.append($('<td>', {html: texto}));
                tr.append($('<td>', {html: texto}));
                tr.append($('<td>', {html: texto}));
                tr.append($('<td>', {html: texto}));
                tr.append($('<td>', {html: texto}));
                tbody.append(tr);
        }
        }
    });

}



$(document).ready(function () {
    $('#mes').click(atualiza);
    atualiza();

    $('.collapse').on('shown.bs.collapse', function(){
        $(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
    }).on('hidden.bs.collapse', function(){
        $(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
    });


});





//--------------------------------------------------------------------------------------

