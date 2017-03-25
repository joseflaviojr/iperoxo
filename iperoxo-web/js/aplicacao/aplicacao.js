//--------------------------------------------------------------------------

// Copyright (C) 2016 José Flávio de Souza Dias Júnior
// Ipê-roxo 1.0-A12 - <http://www.joseflavio.com/iperoxo/>.

//--------------------------------------------------------------------------

// Comportamento inicial da aplicação.
$(document).ready(function(){
    setSID( gerarID() );
    setLinguagem( navigator.language );
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
