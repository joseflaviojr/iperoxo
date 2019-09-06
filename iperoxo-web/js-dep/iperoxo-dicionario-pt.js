//--------------------------------------------------------------------------

var dicionario_pt_BR = {};

//--------------------------------------------------------------------------
// Calendário
// https://st.unicode.org/cldr-apps/v#/pt/Gregorian/

$.extend( dicionario_pt_BR, {

    meses_do_ano                     : {
        extenso                      : [ "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ],
        abreviado                    : [ "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez" ]
    },

    dias_da_semana                   : {
        extenso                      : [ "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado" ],
        abreviado                    : [ "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb" ]
    },

    data_formato                     : {
        numerico                     : "dd/MM/yyyy"
    },

    hora_formato                     : {
        numerico                     : "HH:mm"
    },

    datahora_formato                 : {
        numerico                     : "dd/MM/yyyy HH:mm"
    }

} );

//--------------------------------------------------------------------------
// Geral

$.extend( dicionario_pt_BR, {

    mensagens_arquivo                : "Mensagens_pt.properties"

} );

//--------------------------------------------------------------------------

var dicionario_pt = dicionario_pt_BR;

//--------------------------------------------------------------------------