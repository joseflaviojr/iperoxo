//--------------------------------------------------------------------------

var dicionario_en_US = {};

//--------------------------------------------------------------------------
// Calendário
// https://st.unicode.org/cldr-apps/v#/en/Gregorian/

$.extend( dicionario_en_US, {

    meses_do_ano                     : {
        extenso                      : [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
        abreviado                    : [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
    },

    dias_da_semana                   : {
        extenso                      : [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
        abreviado                    : [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ]
    },

    data_formato                     : {
        numerico                     : "MM/dd/yyyy"
    },

    hora_formato                     : {
        numerico                     : "HH:mm"
    },

    datahora_formato                 : {
        numerico                     : "MM/dd/yyyy, HH:mm"
    }

} );

//--------------------------------------------------------------------------
// Geral

$.extend( dicionario_en_US, {

    mensagens_arquivo                : "Mensagens_en.properties"

} );

//--------------------------------------------------------------------------

var dicionario_en = dicionario_en_US;

//--------------------------------------------------------------------------