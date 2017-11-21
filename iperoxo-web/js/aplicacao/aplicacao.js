//--------------------------------------------------------------------------

// Copyright (C) 2016 José Flávio de Souza Dias Júnior
// Ipê-roxo 1.0-A16 - <http://www.joseflavio.com/iperoxo/>.

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
    var msgfunc = new MessageFormat("en").compile( "Bem vindo ao Ipê-roxo {VERSAO}!\nWelcome to Ipê-roxo {VERSAO}!" );
    abrirMensagemAmpla( msgfunc( { VERSAO: configuracao.iperoxo_versao } ) );

});

//--------------------------------------------------------------------------

function linguagemAlterada() {
    atualizarComponentesCulturais();
}

//--------------------------------------------------------------------------

function inicioTela( tela, args ) {
}

//--------------------------------------------------------------------------
