//--------------------------------------------------------------------------

/**
 * Configuração básica da aplicação Ipê-roxo.
 */
var configuracao = {
    
    /**
     * Versão do Ipê-roxo.
     */
    iperoxo_versao                   : "1.0-A22",

    /**
     * Função que define o comportamento inicial da aplicação.
     */
    funcao_inicial                   : "aplicacao",

    /**
     * Função que define o comportamento final da aplicação.
     */
    funcao_final                     : "finalizacao",

    /**
     * Função que será chamada quando o comando de voltar for acionado.
     * Em caso de indefinição, o comportamento padrão será de fechar a tela ativa,
     * podendo, inclusive, encerrar a aplicação.
     */
    funcao_voltar                    : undefined,

    /**
     * Função que será chamada quando a aplicação estiver com ausência de telas.
     */
    funcao_tela_ausente              : "encerrarAplicacao",

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