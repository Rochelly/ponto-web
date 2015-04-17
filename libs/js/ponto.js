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

    $.get('/ponto/api.php/pontos?mes=' + mes + '&ano=' + ano, function (data, status) {
        var tbody = $('#marcacao tbody');
        tbody.html('');

        var lastDay = (new Date(2015, mes, 0)).getDate();
        var totalHoras = "00:00";

        //gerar dias para o mes
        for (dia = 1, i = 0; dia <= lastDay; dia++) {
            var str_mes = (mes < 10) ? "0" + mes : mes;
            var str_dia = (dia < 10) ? '0' + dia : dia.toString();
            var datames = str_dia + "/" + str_mes + "/" + ano;
            if (i < data.length && data[i].bdata == datames) {
                var tr = $('<tr>');
                var texto = '--:--';
                var hoje = new Date(ano, mes - 1, dia);
                if (hoje.getUTCDay() == 0)
                    texto = '<span class="folga">Domingo</span>';
                if (hoje.getUTCDay() == 6)
                    texto = '<span class="folga">Sábado</span>';

                tr.append($('<td>', {html: datames}));
                tr.append($('<td>', {html: data[i].bentrada1 == null ? texto : '<span title='+data[i].eentrada1+'>' + data[i].bentrada1.replace('_', '') + '</span>'}));
                tr.append($('<td>', {html: data[i].bsaida1 == null ? texto : '<span title='+data[i].esaida1+'>' +data[i].bsaida1.replace('_', '')+'</span>'}));
                tr.append($('<td>', {html: data[i].bentrada2 == null ? texto : '<span title='+data[i].eentrada2+'>' +data[i].bentrada2.replace('_', '')+ '</span>'}));
                tr.append($('<td>', {html: data[i].bsaida2 == null ? texto : '<span title='+data[i].esaida2+'>' +data[i].bsaida2.replace('_', '')+ '</span>'}));
                tr.append($('<td>', {html: data[i].horas_trabalhadas == null ? texto : data[i].horas_trabalhadas}));
                if (data[i].saldo != null) {
                    if (data[i].saldo[0] == "-")
                        tr.append($('<td>', {html: '<span class="saldo neg">' + data[i].saldo + '</span>'}));
                    else
                        tr.append($('<td>', {html: '<span class="saldo pos">' + data[i].saldo + '</span>'}));
                } else {
                          tr.append($('<td>', {html: texto}));
                }

                tbody.append(tr);
                i++;
            } else {
             var tr2 = $('<tr class="success">');
             var tr = $('<tr>');
             var hoje = new Date(ano, mes - 1, dia);
             var texto = '--:--';
             var texto2 = '--:--';
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
            tr.append($('<td>', {html: texto2}));
        
           
            tbody.append(tr);
        }
    }
});
    //e.preventDefault();
}

$(document).ready(function () {
    $('#mes').click(atualiza);
    atualiza();

});
