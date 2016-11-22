//--------------------------------------------------------------------------

// Copyright (C) 2016 José Flávio de Souza Dias Júnior
// This file is part of Ipê-roxo - <http://www.joseflavio.com/iperoxo/>.

//--------------------------------------------------------------------------

// Comportamento inicial da aplicação.
$(document).ready(function(){
    setSID( gerarID() );
    setLinguagem( navigator.language );
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
