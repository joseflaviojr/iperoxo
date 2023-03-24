//--------------------------------------------------------------------------

var dicionario_es_ES = {};

//--------------------------------------------------------------------------
// Calendário
// https://st.unicode.org/cldr-apps/v#/es/Gregorian/

$.extend( dicionario_es_ES, {

    meses_do_ano                     : {
        extenso                      : [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "octubre", "Noviembre", "Diciembre" ],
        abreviado                    : [ "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sept", "Oct", "Nov", "Dic" ]
    },

    dias_da_semana                   : {
        extenso                      : [ "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado" ],
        abreviado                    : [ "Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb" ]
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

$.extend( dicionario_es_ES, {

    mensagens_arquivo                : "Mensagens_es.properties"

} );

//--------------------------------------------------------------------------

var dicionario_es = dicionario_es_ES;

//--------------------------------------------------------------------------