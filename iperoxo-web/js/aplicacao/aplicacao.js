//--------------------------------------------------------------------------

// Copyright (C) 2016 José Flávio de Souza Dias Júnior
// Ipê-roxo 1.0-A13 - <http://www.joseflavio.com/iperoxo/>.

//--------------------------------------------------------------------------

// Comportamento inicial da aplicação.
$(document).ready(function(){
	
	sid = getCookie( "sid" );
	if( sid == "" ) sid = gerarID();
	setSID( sid );

	lid = getCookie( "lid" );
    if( lid == "" ) lid = navigator.language;
    setLinguagem( lid );
    
    setCookie( "cookieTeste", "Ipê-roxo ~ Teste de Cookie!" );
    abrirTela( "html/tela.html" );

});

//--------------------------------------------------------------------------

function linguagemAlterada() {
    atualizarTelas();
}

//--------------------------------------------------------------------------

function inicioTela( tela ) {
}

//--------------------------------------------------------------------------
