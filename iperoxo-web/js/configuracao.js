//--------------------------------------------------------------------------

/**
 * Configuração da aplicação Ipê-roxo.
 */
var configuracao = {
    
    /**
     * Versão do Ipê-roxo.
     */
    iperoxo_versao                   : "1.0-A20",

    /**
     * Nome da função que inicializa a aplicação.
     */
    funcao_inicial                   : "aplicacao",

    recurso_geral                    : true,
    recurso_sessao                   : true,
    recurso_linguagem                : true,
    recurso_mensagem                 : true,
    recurso_uxiamarelo               : true,
    recurso_tela                     : true,
    recurso_persistencia             : true,
    recurso_componente               : true,
    recurso_dica                     : true,

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