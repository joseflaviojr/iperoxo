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

/**
 * @see setLinguagem
 */
function linguagemAlterada() {
    atualizarComponentesCulturais();
}

//--------------------------------------------------------------------------

/**
 * {@linkcode funcInicio} de tela.
 * @see exemploEventoTela
 */
function inicioTela( tela, args, tid, telaObj, funcExito, funcErro ) {
}

//--------------------------------------------------------------------------