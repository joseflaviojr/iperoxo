//--------------------------------------------------------------------------

/**
 * Comportamento inicial da aplicação, executado após a preparação do ambiente Ipê-roxo.
 * @see configuracao.funcao_inicial
 */
function aplicacao() {
    
    // lid
    lid = url_args.lid;
    if( lid === undefined || lid === "" ) lid = getCookie( "lid" );
    if( lid === undefined || lid === "" ) lid = navigator.language;
    setLinguagem( lid );

    // sid
    sid = url_args.sid;
    if( sid === undefined || sid === "" ) sid = getCookie( "sid" );
	if( sid === undefined || sid === "" ) sid = gerarID();
	setSID( sid );

    // Código de Exemplo
    setCookie( "cookieTeste", "Ipê-roxo ~ Teste de Cookie!" );
    abrirTela( "html/tela.html" );
    abrirMensagemAmpla(formatador.compile(dicionario.bem_vindo)({
        nome: dicionario.aplicacao_titulo + " " + configuracao.iperoxo_versao
    }));

}

//--------------------------------------------------------------------------

/**
 * {@linkcode funcInicio} de "tela.html"
 * @see exemploEventoTela
 */
function tela_funcInicio( tela, args, tid, telaObj, funcExito, funcErro ) {
    var texto = getComp("texto", tela);
    setCompValor(texto, "Ipê-roxo");
}

//--------------------------------------------------------------------------