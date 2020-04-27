//--------------------------------------------------------------------------

/**
 * Comportamento inicial da aplicação, executado após a preparação do ambiente Ipê-roxo.
 * @see configuracao.funcao_inicial
 */
function aplicacao() {

    setLinguagem( valorNaoVazio( url_args.lid, getCookie( "lid" ), navigator.language               ), function(){
    setZonaTempo( valorNaoVazio( url_args.zid, getCookie( "zid" ), - new Date().getTimezoneOffset() ), function(){
    setSID      ( valorNaoVazio( url_args.sid, getCookie( "sid" ), gerarID                          ), function(){

        setCookie( "cookieTeste", "Ipê-roxo ~ Teste de Cookie!" );
    
        abrirTela( "html/tela.html" );
    
        abrirMensagemAmpla(formatador.compile(dicionario.bem_vindo)({
            nome: dicionario.aplicacao_titulo + " " + configuracao.iperoxo_versao
        }));

    });});});

}

//--------------------------------------------------------------------------

/**
 * Comportamento final da aplicação.
 * @see configuracao.funcao_final
 * @see encerrarAplicacao
 */
function finalizacao( funcExito, funcErro ) {
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