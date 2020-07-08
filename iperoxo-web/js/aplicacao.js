//--------------------------------------------------------------------------

/**
 * Comportamento inicial da aplicação, executado após a preparação do ambiente Ipê-roxo.
 * @see configuracao.funcao_inicial
 */
function aplicacao() {

    setLinguagem( valorNaoVazio( url_args.lid, getCookie( "lid" ), navigator.language               ), function(){
    setZonaTempo( valorNaoVazio( url_args.zid, getCookie( "zid" ), - new Date().getTimezoneOffset() ), function(){
    setSID      ( valorNaoVazio( url_args.sid, getCookie( "sid" ), gerarID                          ), function(){

        // O ciclo de vida da aplicação começa aqui.

        // Exemplo de definição de cookie
        setCookie( "cookieTeste", "Ipê-roxo ~ Teste de Cookie!" );
    
        // Abertura da tela principal
        abrirTela( "html/tela.html" );
    
        // Mensagem de boas-vindas
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
    jsExec(funcExito);
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

// Codifique aqui as funções da aplicação.

//--------------------------------------------------------------------------