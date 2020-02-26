//--------------------------------------------------------------------------

/**
 * Configuração da aplicação Ipê-roxo.
 */
var configuracao = {
    
    /**
     * Versão do Ipê-roxo.
     */
    iperoxo_versao                   : "1.0-A21",

    /**
     * Função que inicia a aplicação.
     */
    funcao_inicial                   : "aplicacao",

    /**
     * Função a ser chamada se a aplicação estiver com ausência de telas.
     */
    funcao_tela_ausente              : "reiniciarAplicacao",

    /**
     * Repositório padrão da API Apache Cordova para armazenamento de arquivos.
     * @see cordova.file.dataDirectory
     * @see salvar
     * @see cordovaSalvar
     */
    cordova_repositorio              : null,

    /**
     * Componentes visuais disponíveis.
     * @see {@link html-dep/iperoxo-componentes.html}
     * @see {@link html/componentes.html}
     */
    componentes                      : {},

    /**
     * Arquivos que definem os componentes visuais.
     */
    componentes_arquivos             : [ "html-dep/iperoxo-componentes.html", "html/componentes.html" ]

};

//--------------------------------------------------------------------------