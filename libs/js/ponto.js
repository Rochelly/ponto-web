/**
 * @author [ESTÊVÃO SAMUEL PROCÓPIO AMARAL]
 * @author [NEWTON KLEBER MACHADO SILVA]
 * @author [ROCHELLY FERNANDES ANDRADE]
 * @version [1.10]
 */
//-----------------Calculos envolvendo Horas ---------------------------------------------------------------------
var hh;
var mm;
var ss;

function relogio2() {
    var data = new Date();
    var seg = data.getSeconds();
    ss = seg;
    if (ss == 0) {
        mm = mm + 1;
        if (mm >= 59) {
            mm = 0;
            hh += 1;
        }
    }
    if (hh <= 9) {
        xhh = "0" + hh;
    } else {
        xhh = hh;
    }
    if (mm <= 9) {
        xmm = "0" + mm;
    } else {
        xmm = mm;
    }
    if (ss <= 9) {
        xss = "0" + ss;
    } else {
        xss = ss;
    }
    if (hh == 0 && mm == 0) xss = '00';
    document.all("span_relogio").innerHTML = "+" + xhh + ":" + xmm + ":" + xss;
    lrelogio = setTimeout("relogio2()", 1000);
}

function relogio() {
    if (hh == 0 && mm == 0 && ss == 0) {
        Notification.requestPermission(function(permission) {
            var notification = new Notification(" Horário de expediente !", {
                body: ' Você completou sua carga horária .',
                icon: 'icon.jpg',
                dir: 'auto'
            });
            setTimeout(function() {
                notification.close();
            }, 70000);
        });
    }
    var data = new Date();
    var seg = data.getSeconds();
    ss = 59 - seg;
    if (ss <= 0) {
        mm = mm - 1;
        if (mm <= 0 && hh <= 0) {
            mm = 0;
            hh = 0;
        } else {
            if (mm <= 0) {
                mm = 59;
                hh = hh - 1;
                if (hh >= 24 || hh < 0) {
                    hh = 0;
                }
            }
        }
    }
    if (hh <= 9) {
        xhh = "0" + hh;
    } else {
        xhh = hh;
    }
    if (mm <= 9) {
        xmm = "0" + mm;
    } else {
        xmm = mm;
    }
    if (ss <= 9) {
        xss = "0" + ss;
    } else {
        xss = ss;
    }
    if (hh == 0 && mm == 0) xss = '00';
    if (ss <= 0 || ss == 60) xss = '00';
    document.all("span_relogio").innerHTML = xhh + ":" + xmm + ":" + xss;
    lrelogio = setTimeout("relogio()", 1000);
}

function converteHorasEmMinutos(horas) {
    horas2 = horas.split(":");
    if (horas[0] == '-') {
        var tempoHoras = horas2[0];
        var tempoMinutos = horas2[1];
        return ((parseInt(tempoHoras, 10) * 60) - parseInt(tempoMinutos, 10));
    } else {
        var tempoHoras = horas2[0];
        var tempoMinutos = horas2[1];
        return ((tempoHoras * 60) + parseInt(tempoMinutos, 10));
    }
}

function converteMinutosEmHoras(minutos) {
    if (minutos >= 0) {
        var horas = parseInt(minutos / 60, 10);
        var minutos = minutos - horas * 60;
        if (minutos >= 10) return horas.toString() + ':' + minutos.toString();
        if (minutos == 0) return horas.toString() + ':' + minutos.toString() + '0';
        else return horas.toString() + ':0' + minutos.toString();
    } else {
        minutos = minutos * (-1);
        var horas = parseInt(minutos / 60, 10);
        var minutos = minutos - horas * 60;
        if (minutos >= 10) return '-' + horas.toString() + ':' + minutos.toString();
        if (minutos == 0) return '-' + horas.toString() + ':' + minutos.toString() + '0';
        else return '-' + horas.toString() + ':0' + minutos.toString();
    }
}

function calculoCargaHoraria(horarios) {
    /** [horasDiarias description] Armazena a carga  horaria diaria
     * @type {Array} */
    var horasDiarias = [];
    var horasSemanais = 0;
    for (var i = 0; i < horarios.length; i++) { /**[if description] verifica se existe horarios nesse dia da semana*/
        var periodo1 = diferencaEntreHoras(horarios[i].entrada1.toString(), horarios[i].saida1.toString());
        if (horarios[i].entrada2 != null) {
            var periodo2 = diferencaEntreHoras(horarios[i].entrada2.toString(), horarios[i].saida2.toString());
        }
        /*[if description] confere se existe a terceira entrada neste dia da semana*/
        if (horarios[i].entrada3 != null) var periodo3 = diferencaEntreHoras(horarios[i].entrada3.toString(), horarios[i].saida3.toString()); /*[if description] calculo da carga horaria Diaria*/
        if (periodo3 != undefined) horasDiarias[horarios[i].dia_semana] = converteMinutosEmHoras(periodo1 + periodo2 + periodo3);
        else {
            if (periodo2 != undefined) horasDiarias[horarios[i].dia_semana] = converteMinutosEmHoras(periodo1 + periodo2);
            else horasDiarias[horarios[i].dia_semana] = converteMinutosEmHoras(periodo1);
        }
        horasSemanais += converteHorasEmMinutos(horasDiarias[horarios[i].dia_semana]);
    }
    horasSemanais = converteMinutosEmHoras(horasSemanais);
    /**[horas description] armazena a carga horaria por  dia da semana e por dia
     * @type {Array} */
    horas = [horasSemanais, horasDiarias];
    return horasDiarias;
}

function calculaSaldoDiario(marcacao) {
    if (marcacao.bentrada1 == null | marcacao.bsaida1 == null) {
        var periodo1 = 0;
    } else {
        if (marcacao.bentrada1[0] == '*' | marcacao.bsaida1[0] == '*') {
            var periodo1 = 0;
        } else {
            var periodo1 = diferencaEntreHoras(marcacao.bentrada1, marcacao.bsaida1)
        }
    }
    if (marcacao.bentrada2 == null | marcacao.bsaida2 == null) {
        var periodo2 = 0;
    } else {
        if (marcacao.bentrada2[0] == '*' | marcacao.bsaida2[0] == '*') {
            var periodo2 = 0;
        } else {
            var periodo2 = diferencaEntreHoras(marcacao.bentrada2, marcacao.bsaida2)
        }
    }
    if (marcacao.bentrada3 == null | marcacao.bsaida3 == null) {
        var periodo3 = 0;
    } else {
        if (marcacao.bentrada3[0] == '*' | marcacao.bsaida3[0] == '*') {
            var periodo3 = 0;
        } else {
            var periodo3 = diferencaEntreHoras(marcacao.bentrada3, marcacao.bsaida3)
        }
    }
    var saldoDiario = (periodo1 + periodo2 + periodo3);
    return saldoDiario;
}

function verificaOcorrencia(marcacao) {
    if (marcacao.bentrada1 != null && marcacao.bsaida1 != null)
        if (marcacao.bentrada1[0] == '*' | marcacao.bsaida1[0] == '*') return true;
    if (marcacao.bentrada2 != null && marcacao.bsaida2 != null)
        if (marcacao.bentrada2[0] == '*' | marcacao.bsaida2[0] == '*') return true;
    if (marcacao.bentrada3 != null && marcacao.bsaida3 != null)
        if (marcacao.bentrada3[0] == '*' | marcacao.bsaida3[0] == '*') return true;
    return false;
}

function diferencaEntreHoras(entrada2, saida1) {
    // saidaTempo = [saida1 convertida  em minutos]
    var entradaTempo = converteHorasEmMinutos(entrada2);
    // entradaTempo = [entrada1 convertida  em minutos]
    var saidaTempo = converteHorasEmMinutos(saida1);
    resultado = (parseInt(saidaTempo, 10) - parseInt(entradaTempo, 10));
    // retorna a Diferença entre os dois horarios da entrada convertido em minutos
    return resultado
}
// -----------------Componentes Visuais --------------------------------------------------------------------------
function sumario(mes, ano, minutosDescontadosMes, cargaHorariaTotal, minutosTrabalhadosMes, lastDay, horarios, batidaHoje, diaSemana) {
    //--Primeira Coluna  do Sumário --------------------------------------------------------------------------------------------
    mes = (mes < 10) ? "0" + mes : mes.toString(); //  ex :  mes 3 convertido para 03
    var periodo = '01/' + mes.toString() + "/" + ano.toString() + " - " + lastDay.toString() + "/" + mes.toString() + "/" + ano.toString();
    //Preenchendo o sumario
    periodo != undefined ? $("#periodo").text(periodo) : $("#periodo").text("");
    cargaHorariaTotal != undefined ? $("#carga_horaria").text(converteMinutosEmHoras(cargaHorariaTotal)) : $("#carga_horaria").text("");
    minutosTrabalhadosMes != null ? $("#horas_trabalhadas").text(converteMinutosEmHoras(minutosTrabalhadosMes - minutosDescontadosMes)) : $("#horas_trabalhadas").text("");
    saldoComDesconto = (minutosTrabalhadosMes - minutosDescontadosMes) - cargaHorariaTotal;
    if (converteMinutosEmHoras(cargaHorariaTotal) == '0:00') {
        alert('Não consta nenhuma marcação neste mês!');
    }
    //realiza o desconto de dias  nao  trabalhados e minutos a menos na horas do almoço
    saldoComDesconto = converteMinutosEmHoras(saldoComDesconto);
    saldoComDesconto != null ? $("#saldo").text(saldoComDesconto) : $("#saldo").text("");
    $("#saldo").removeClass('saldo pos neg');
    if (saldoComDesconto) $("#saldo").addClass(saldoComDesconto[0] == '-' ? 'saldo neg' : 'saldo pos');
    //--Segunda Coluna  do Sumário --------------------------------------------------------------------------------------------
    diaSemana -= 1;
    //console.log(horarios[diaSemana]);
    var cargaHorariaPrimeiroPeriodo = diferencaEntreHoras(horarios[diaSemana].entrada1, horarios[diaSemana].saida1);
    //console.log("1º" , cargaHorariaPrimeiroPeriodo);
    if (horarios[diaSemana].entrada2 != null) {
        var cargaHorariaSegundoPeriodo = diferencaEntreHoras(horarios[diaSemana].entrada2, horarios[diaSemana].saida2);
        //console.log("2º" , cargaHorariaSegundoPeriodo);
    }
    var minutosAlmoco = diferencaEntreHoras(horarios[diaSemana].saida1, horarios[diaSemana].entrada2);
    //console.log("Almoco",minutosAlmoco);   
    if (batidaHoje.bentrada1 != null && batidaHoje.bentrada2 == null) {
        var previsaoSaida = converteMinutosEmHoras(converteHorasEmMinutos(batidaHoje.bentrada1) + cargaHorariaPrimeiroPeriodo);
        //console.log('Previsão',previsaoSaida);
        $("#previsao").text(previsaoSaida);
    }
    if (batidaHoje.bentrada2 != null && batidaHoje.saida2 == null) {
        var previsaoSaida = converteMinutosEmHoras(converteHorasEmMinutos(batidaHoje.bentrada1) + cargaHorariaPrimeiroPeriodo + cargaHorariaSegundoPeriodo + diferencaEntreHoras(batidaHoje.bsaida1, batidaHoje.bentrada2));
        //console.log('Previsão',previsaoSaida);
        $("#previsao").text(previsaoSaida);
    }
    var cargaHorariaDia = cargaHorariaSegundoPeriodo == undefined ? converteMinutosEmHoras(cargaHorariaPrimeiroPeriodo) : converteMinutosEmHoras(cargaHorariaPrimeiroPeriodo + cargaHorariaSegundoPeriodo);
    $("#carga_horaria_dia").text(cargaHorariaDia);
    var acressimoConpesacao = 0;
    if (saldoComDesconto[0] == '-') {
        var saldoEmMinutos = converteHorasEmMinutos(saldoComDesconto);
        if (saldoEmMinutos < -120) {
            acressimoConpesacao = 120;
        } else acressimoConpesacao = saldoEmMinutos;
    } else {
        acressimoConpesacao = saldoMinutos * -1;
    }
    if (calculaSaldoDiario(batidaHoje) - converteHorasEmMinutos(saldoComDesconto) == converteHorasEmMinutos(cargaHorariaDia)) 
        acressimoConpesacao = 0;
    else 
        acressimoConpesacao = calculaSaldoDiario(batidaHoje) - converteHorasEmMinutos(saldoComDesconto) - converteHorasEmMinutos(cargaHorariaDia);
    if (batidaHoje.bentrada2 != null) {
        if (acressimoConpesacao != 0){
            if (acressimoConpesacao > 120) {
                acressimoConpesacao = 120;
            };

            $("#compensacao").html("Saída Para Compensação: <span>" + converteMinutosEmHoras(converteHorasEmMinutos(previsaoSaida) + acressimoConpesacao) + "</span>");
        }
    }
    var data = new Date();
    var dia = data.getDate(); // 1-31
    var dia_sem = data.getDay(); // 0-6 (zero=domingo)
    var mes = data.getMonth(); // 0-11 (zero=janeiro)
    var ano2 = data.getYear(); // 2 dígitos
    var ano4 = data.getFullYear(); // 4 dígitos
    var hora = data.getHours(); // 0-23
    var min = data.getMinutes(); // 0-59
    var seg = data.getSeconds(); // 0-59
    var mseg = data.getMilliseconds(); // 0-999
    var tz = data.getTimezoneOffset(); // em minutos
    if (hora < 10) hora = '0' + hora;
    var horaAgora = hora + ":" + min;
    tempoRestante = converteMinutosEmHoras(diferencaEntreHoras(horaAgora, previsaoSaida));
    if (diferencaEntreHoras(horaAgora, previsaoSaida) >= 0) {
        tempoRestante = tempoRestante.split(":");
        hh = parseInt(tempoRestante[0], 10);
        mm = parseInt(tempoRestante[1], 10);
        ss = seg;
        relogio();
    } else {
        tempoRestante = tempoRestante.split(":");
        hh = parseInt(tempoRestante[0], 10) * -1;
        mm = parseInt(tempoRestante[1], 10);
        ss = seg;
        relogio2();
    }
}

function cabecalhoTabelaMarcacoes(terceiraMarcacao) {
    var thead = $('#marcacao thead');
    thead.html('');
    thead.append($('<th>', {
        html: '<center>Data'
    }));
    thead.append($('<th>', {
        html: '<center>Entrada'
    }));
    thead.append($('<th>', {
        html: '<center>Saida'
    }));
    thead.append($('<th>', {
        html: '<center>Entrada'
    }));
    thead.append($('<th>', {
        html: '<center>Saida'
    }));
    //verifica se  existe alguma terceira marcaçao no mes
    if (terceiraMarcacao.quantidade > 0) {
        thead.append($('<th>', {
            html: '<center>Entrada'
        }));
        thead.append($('<th>', {
            html: '<center>Saida'
        }));
    }
    thead.append($('<th>', {
        html: '<center>Horas Trabalhadas'
    }));
    thead.append($('<th>', {
        html: '<center>Saldo'
    }));
    thead.append($('<th>', {
        html: '<center>Ajuste'
    }));
}

function corpoTabelaMarcacoes(mes, ano, batidas, feriados, terceiraMarcacao, horarios) {
    var minutosDescontadosMes = 0;
    var cargaHorariaTotalMes = 0;
    var minutosTrabalhadosMes = 0;
    var cargaHoraria = calculoCargaHoraria(horarios);
    var tbody = $('#marcacao tbody');
    tbody.html('');
    cabecalhoTabelaMarcacoes(terceiraMarcacao); { // dataAtual: Recupera  a de  hoje para highlighted do dia
        dataAtual = new Date();
        diaAtual = dataAtual.getDate(); // dia de hoje
        mesAtual = dataAtual.getMonth() + 1; // mes de hoje
        anoAtual = dataAtual.getFullYear(); // ano de hoje
        mesAtual = (mesAtual < 10) ? "0" + mesAtual : mesAtual.toString(); //  ex :  mes 3 convertido para 03
        diaAtual = (diaAtual < 10) ? '0' + diaAtual : diaAtual.toString(); //  ex :  dia 1 convertido para 01
        dataAtual = diaAtual + "/" + mesAtual + "/" + anoAtual; // converte a data atual para o seguinte fomato : dd/mm/aa
    }
    var lastDay = (new Date(ano, mes, 0)).getDate(); // lastDay :  numero de quantidade de  dias do mes selecionado
    /**for   roda o  numero  de dias do  mes]
     * @param  {int} dia      [quantidade de dias do mes]
     * @param  {int} i        [quantidade  de objetos(instancias da  consulta do banco )]
     * @param  {int} lastDay  [lastDay :  numero de quantidade de  dias do mes selecionado]
     */
    for (dia = 1, i = 0; dia <= lastDay; dia++) {
        var minutosDescontadosDia = 0;
        var str_mes = (mes < 10) ? "0" + mes : mes;
        var str_dia = (dia < 10) ? '0' + dia : dia.toString();
        var datames = str_dia + "/" + str_mes + "/" + ano; // datames: em cada iteraçao recebe  a data de um  dia trabalhado]
        var trFolga = $('<tr class="success">'); // [trFolga tag para a marcaçao do final de semana e feriados ]
        var trFalta = $('<tr class="danger">'); //marca as faltas
        var trHoje = $('<tr class="hoje">'); //  marca o  dia de  hoje
        var tr = $('<tr>'); // tr geral
        if (datames == dataAtual) { //if highlighted para o  dia de  hoje]
            tr = trHoje;
        }
        if (i < batidas.length && batidas[i].bdata == datames) { // [if adicona somente as  batidas ate o  dia atual]
            if (datames == dataAtual) //if highlighted para o  dia de  hoje]
                var batidaHoje = batidas[i];
            var faltaBool = false;
            var fimDeSemanaBool = false;
            var feriadoBool = false;
            var texto = '<center>--:--</center>';
            var dataCorrente = new Date(ano, mes - 1, dia); // dataCorrente: a data corrente no loop
            var feriado = feriados.filter(function(item) {
                return item.data == datames;
            }); { //verifica se o dia o dia e feriado ou  fim de semana
                if (feriado.length) { //verifica se existe feriado nesse dia
                    texto = '<center><span class="folga" title="' + feriado[0].descricao + '">Feriado</span></center>';
                    tr = trFolga;
                    feriadoBool = true;
                }
                if (dataCorrente.getUTCDay() == 0) { //verifica se o dia  e domingo
                    texto = '<center><span class="folga">Domingo</span>';
                    tr = trFolga;
                    fimDeSemanaBool = true;
                }
                if (dataCorrente.getUTCDay() == 6) { //verifica se o dia e Sabado
                    texto = '<center><span class="folga">Sábado</span>';
                    tr = trFolga;
                    fimDeSemanaBool = true;
                }
                if (batidas[i].bentrada1 == null && batidas[i].bentrada2 == null && batidas[i].bentrada3 == null && fimDeSemanaBool == false && feriadoBool == false) { // verifica se o funcionario faltou e realizao desconto da falta
                    faltaBool = true;
                    tr = trFalta;
                    //console.log("Falta");
                }
            }
            if (feriadoBool == false && fimDeSemanaBool == false && verificaOcorrencia(batidas[i]) == false) {
                cargaHorariaTotalMes += converteHorasEmMinutos(cargaHoraria[dataCorrente.getUTCDay()]); //Carga horária até o dia presente
            }
            tr.append($('<td>', {
                html: '<center>' + datames
            }));
            tr.append($('<td>', {
                html: batidas[i].bentrada1 == null ? texto : '<center><span title="' + batidas[i].eentrada1 + '"">' + batidas[i].bentrada1.replace('_', '') + '</span>'
            }));
            // verificando se  o funcionario fez menos de uma hora de almoço
            if ((batidas[i].bsaida1 != null) && (batidas[i].bentrada2 != null) && (diferencaEntreHoras(batidas[i].bsaida1, batidas[i].bentrada2) < 60)) {
                tr.append($('<td>', {
                    html: batidas[i].bsaida1 == null ? texto : '<center><span class="saldo neg" title="Menos de uma hora de almoço: ' + batidas[i].esaida1 + '"">' + batidas[i].bsaida1.replace('_', '') + '</span>'
                }));
                tr.append($('<td>', {
                    html: batidas[i].bentrada2 == null ? texto : '<center><span class="saldo neg" title= "Menos de uma hora de almoço: ' + batidas[i].eentrada2 + '"">' + batidas[i].bentrada2.replace('_', '') + '</span>'
                }));
                minutosDescontadosDia = 60 - diferencaEntreHoras(batidas[i].bsaida1, batidas[i].bentrada2);
                minutosDescontadosMes += minutosDescontadosDia;
            } else { // hora de almoço correnta
                tr.append($('<td>', {
                    html: batidas[i].bsaida1 == null ? texto : '<center><span title="' + batidas[i].esaida1 + '"">' + batidas[i].bsaida1.replace('_', '') + '</span>'
                }));
                tr.append($('<td>', {
                    html: batidas[i].bentrada2 == null ? texto : '<center><span title="' + batidas[i].eentrada2 + '"">' + batidas[i].bentrada2.replace('_', '') + '</span>'
                }));
            }
            tr.append($('<td>', {
                html: batidas[i].bsaida2 == null ? texto : '<center><span title="' + batidas[i].esaida2 + '"">' + batidas[i].bsaida2.replace('_', '') + '</span>'
            }));
            if (terceiraMarcacao.quantidade > 0) { //[if confere se o funcionario possui uma  terceira marcaçao de ponto no mes]
                tr.append($('<td>', {
                    html: batidas[i].bentrada3 == null ? texto : '<center><span title="' + batidas[i].eentrada2 + '"">' + batidas[i].bentrada3.replace('_', '') + '</span>'
                }));
                tr.append($('<td>', {
                    html: batidas[i].bsaida3 == null ? texto : '<center><span title="' + batidas[i].esaida2 + '"">' + batidas[i].bsaida3.replace('_', '') + '</span>'
                }));
            }
            //Coluna de horas Trabalhadas
            if (faltaBool) { //caso seja identificado falta coloca menos
                tr.append($('<td>', {
                    html: texto
                }));
                tr.append($('<td>', {
                    html: "<center><span class='saldo neg'>-" + cargaHoraria[dataCorrente.getUTCDay()] + "</span>"
                }));
                tr.append($('<td>', {
                    html: '<center><span > --:--</span>'
                }));
                tr = trFolga;
            } else {
                var minutosTrabalhadosComDesconto = calculaSaldoDiario(batidas[i]) - minutosDescontadosDia;
                minutosTrabalhadosMes += calculaSaldoDiario(batidas[i]);
                if (!verificaOcorrencia(batidas[i]) && minutosTrabalhadosComDesconto != 0) {
                    tr.append($('<td>', {
                        html: calculaSaldoDiario(batidas[i]) == null ? texto : '<center>' + converteMinutosEmHoras(calculaSaldoDiario(batidas[i]))
                    }));
                    var saldoMinutos = diferencaEntreHoras(cargaHoraria[dataCorrente.getUTCDay()], converteMinutosEmHoras(minutosTrabalhadosComDesconto))
                    var saldoDiarioEmHoras = converteMinutosEmHoras(saldoMinutos);
                    if (saldoDiarioEmHoras[0] == "-") tr.append($('<td>', {
                        html: '<center><span class="saldo neg">' + saldoDiarioEmHoras + '</span>'
                    }));
                    else tr.append($('<td>', {
                        html: '<center><span class="saldo pos">' + saldoDiarioEmHoras + '</span>'
                    }));
                } else {
                    tr.append($('<td>', {
                        html: texto
                    }));
                    tr.append($('<td>', {
                        html: texto
                    }));
                }
                if (batidas[i].bajuste != '0:00') {
                    minutosDescontadosMes -= converteHorasEmMinutos(batidas[i].bajuste);
                    if (batidas[i].bajuste[0] == '-') tr.append($('<td>', {
                        html: "<center><span  title='" + batidas[i].obs + "'class='saldo neg'>" + batidas[i].bajuste + '</span>'
                    }));
                    else tr.append($('<td>', {
                        html: "<center><span  title='" + batidas[i].obs + "'class='saldo pos'>+" + batidas[i].bajuste + '</span>'
                    }));
                } else {
                    tr.append($('<td>', {
                        html: texto
                    }));
                }
            }
            tbody.append(tr);
            i++;
        } else { //marcaçoes depois da ultima batida do  mes, ou dia que nao  tem batida
            var texto = '<center>--:--</center>';
            var fimDeSemanaBool = false;
            var feriadoBool = false;
            var falta = false;
            var dataLoop = new Date(ano, mes - 1, dia); //[hoje uma data para dia do mes  para se  comparar se  o dia e sabado ou  domingo ]
            var hoje = new Date(anoAtual, mesAtual - 1, diaAtual); // data de hoje, para se saber se  a data da marcaçao ja passou
            var feriado = feriados.filter(function(item) {
                return item.data == datames;
            }); //feriado do  dia se existi
            if (feriado.length) { // caso exista feriado
                texto = '<center><span class="folga" title="' + feriado[0].descricao + '">Feriado</span></center>';
                tr = trFolga;
                feriadoBool = true;
            }
            if (dataLoop.getUTCDay() == 0) { //verifica se e domingo
                texto = '<center><span class="folga">Domingo</span>';
                tr = trFolga;
                fimDeSemanaBool = true;
            }
            if (dataLoop.getUTCDay() == 6) { //verifica se e Sabado
                texto = '<center><span class="folga">Sábado</span>';
                tr = trFolga;
                fimDeSemanaBool = true;
            }
            if (hoje > dataLoop) { // [if   se  a  data  que esta no loop for  menor que a data de hoje entao  a marcao  dever  ser debitada
                if (!(fimDeSemanaBool | feriadoBool) && (!((mes == '1' | mes == '2' | mes == '3') && ano == '2015'))) { //                         // description para  descontar nao pode ser feriado ou  fim  de semana e ao mesmo tempo nao desconta nos meses : janeiro, fevereiro, março do ano  de 2015
                    cargaHorariaTotalMes += converteHorasEmMinutos(cargaHoraria[dataCorrente.getUTCDay()]);
                    falta = true;
                    tr = trFalta;
                }
            }
            tr.append($('<td>', {
                html: '<center>' + datames
            })); // Data
            tr.append($('<td>', {
                html: texto
            })); // Entrada 1
            tr.append($('<td>', {
                html: texto
            })); // Saida 1
            tr.append($('<td>', {
                html: texto
            })); // Entrada 2
            tr.append($('<td>', {
                html: texto
            })); // Saida 2
            if (terceiraMarcacao.quantidade > 0) { // Verifica se existe terceira marcaçao
                tr.append($('<td>', {
                    html: texto
                })); // Entrada 3
                tr.append($('<td>', {
                    html: texto
                })); // Saida3
            }
            tr.append($('<td>', {
                html: texto
            })); // Horas Trabalhadas
            if (falta == true) { //se e falta marca com menos -8 horas
                tr.append($('<td>', {
                    html: "<center><span class='saldo neg'>-" + cargaHoraria[dataCorrente.getUTCDay()] + "</span>"
                }));
                tr.append($('<td>', {
                    html: texto
                }));
            } else {
                tr.append($('<td>', {
                    html: texto
                })); // Saldo
                tr.append($('<td>', {
                    html: texto
                }));
            }
            tbody.append(tr);
        }
    } //  fim do loop que lista as  marcaçoes
    sumario(mes, ano, minutosDescontadosMes, cargaHorariaTotalMes, minutosTrabalhadosMes, lastDay, horarios, batidaHoje, dataCorrente.getUTCDay()); // cria o sumario
}

function legendaOcorrencias(mes, ano) {
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
            thead.append($('<th>', {
                html: '<center>   Código </center>  '
            }));
            thead.append($('<th>', {
                html: '<center>Descrição'
            }));
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

function efeitoCollapse() {
    $('.collapse').on('shown.bs.collapse', function() {
        $(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
    }).on('hidden.bs.collapse', function() {
        $(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
    });
    $('#imprimir').click(function(event) {
        event.preventDefault();
        var observacao = $('#obs').val(); /*      $('#obs2').val(observacao);*/
        $("#obs2").html("<pre><p >" + observacao + "</p></pre>");
        window.print();
        return false;
    });
}
//----------------------------------------------------------------------------------------------------------------
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
                $.get('/ponto/api.php/horarios', function(data, status) { /* recupere os horarios dos funcionarios*/
                    var horarios = data;
                    // o  retorno
                    callback(mes, ano, batidas, feriados, terceiraMarcacao, horarios);
                });
            });
        });
    });
}

function atualiza(e) {
    var mes = $('#mes').val();
    var ano = $('#ano').val();
    legendaOcorrencias(mes, ano);
    get_dados_mes(mes, ano, corpoTabelaMarcacoes);
}
$(document).ready(function() {
    $('#mes').change(atualiza);
    atualiza();
    efeitoCollapse();
});
//----------------------------------------------------------------------------------------------------------------