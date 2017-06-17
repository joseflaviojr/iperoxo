//--------------------------------------------------------------------------

// Copyright (C) 2016 José Flávio de Souza Dias Júnior
// Ipê-roxo 1.0-A14 - <http://www.joseflavio.com/iperoxo/>.

//--------------------------------------------------------------------------

// Comportamento inicial da aplicação.
$(document).ready(function(){
	
	sid = getCookie( "sid" );
	if( sid == "" ) sid = gerarID();
	setSID( sid );

    lid = url_args.lid;
    if( lid == "" || lid == undefined ) lid = getCookie( "lid" );
    if( lid == "" || lid == undefined ) lid = navigator.language;
    setLinguagem( lid );
    
    setCookie( "cookieTeste", "Ipê-roxo ~ Teste de Cookie!" );
    abrirTela( "html/tela.html" );

    abrirMensagemAmpla( "Bem vindo ao Ipê-roxo!<br>Welcome to Ipê-roxo!" );

});

//--------------------------------------------------------------------------

function linguagemAlterada() {
    atualizarTelas();
}

//--------------------------------------------------------------------------

function inicioTela( tela ) {
}

//--------------------------------------------------------------------------
