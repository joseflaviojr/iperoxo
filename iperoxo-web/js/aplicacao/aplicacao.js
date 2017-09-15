//--------------------------------------------------------------------------

// Copyright (C) 2016 José Flávio de Souza Dias Júnior
// Ipê-roxo 1.0-A15 - <http://www.joseflavio.com/iperoxo/>.

//--------------------------------------------------------------------------

// Comportamento inicial da aplicação.
inicio(function(){
    
    // sid
	sid = getCookie( "sid" );
	if( sid == "" ) sid = gerarID();
	setSID( sid );

    // lid
    lid = url_args.lid;
    if( lid == "" || lid == undefined ) lid = getCookie( "lid" );
    if( lid == "" || lid == undefined ) lid = navigator.language;
    setLinguagem( lid );
    
    // Código de Exemplo
    setCookie( "cookieTeste", "Ipê-roxo ~ Teste de Cookie!" );
    abrirTela( "html/tela.html" );
    var msgfunc = new MessageFormat("en").compile( "Bem vindo ao Ipê-roxo {VERSAO}!<br>Welcome to Ipê-roxo {VERSAO}!" );
    abrirMensagemAmpla( msgfunc( { VERSAO: configuracao.iperoxo_versao } ) );

});

//--------------------------------------------------------------------------

function linguagemAlterada() {
    if( iperoxo_script_tela ) atualizarTelas();
    else if( iperoxo_script_linguagem ) carregarTextoDinamico();
}

//--------------------------------------------------------------------------

function inicioTela( tela ) {
}

//--------------------------------------------------------------------------
