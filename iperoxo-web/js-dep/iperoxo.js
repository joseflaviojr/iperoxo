//--------------------------------------------------------------------------

/**
 * Este arquivo contém os recursos básicos do Ipê-roxo,
 * úteis para a maioria das aplicações.
 */

//--------------------------------------------------------------------------

/*

  Copyright (C) 2016-2021 José Flávio de Souza Dias Júnior
  
  This file is part of Ipê-roxo - <http://joseflavio.com/iperoxo/>.
  
  Ipê-roxo is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  Ipê-roxo is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with Ipê-roxo. If not, see <http://www.gnu.org/licenses/>.

*/

//--------------------------------------------------------------------------

/*

  Direitos Autorais Reservados (C) 2016-2021 José Flávio de Souza Dias Júnior
  
  Este arquivo é parte de Ipê-roxo - <http://joseflavio.com/iperoxo/>.
  
  Ipê-roxo é software livre: você pode redistribuí-lo e/ou modificá-lo
  sob os termos da Licença Pública Menos Geral GNU conforme publicada pela
  Free Software Foundation, tanto a versão 3 da Licença, como
  (a seu critério) qualquer versão posterior.
  
  Ipê-roxo é distribuído na expectativa de que seja útil,
  porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita de
  COMERCIABILIDADE ou ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA. Consulte a
  Licença Pública Menos Geral do GNU para mais detalhes.
  
  Você deve ter recebido uma cópia da Licença Pública Menos Geral do GNU
  junto com Ipê-roxo. Se não, veja <http://www.gnu.org/licenses/>.

*/

//--------------------------------------------------------------------------
// Importação e definição de tipos

/**
 * Injeção no contexto global das
 * classes relacionadas à manipulação de data e hora (biblioteca js-joda).
 * @see https://js-joda.github.io/js-joda/
 */
[
    "ChronoField", "ChronoLocalDate", "ChronoLocalDateTime",
    "ChronoUnit", "ChronoZonedDateTime", "Clock", "DateTimeException",
    "DateTimeFormatter", "DateTimeFormatterBuilder",
    "DateTimeParseException", "DayOfWeek", "Duration", "Instant",
    "IsoChronology", "IsoFields", "LocalDate", "LocalDateTime",
    "LocalTime", "Month", "MonthDay", "Period", "Temporal",
    "TemporalAccessor", "TemporalAdjuster", "TemporalAdjusters",
    "TemporalAmount", "TemporalField", "TemporalQueries",
    "TemporalQuery", "TemporalUnit", "Year", "YearConstants",
    "YearMonth", "ZonedDateTime", "ZoneId", "ZoneOffset",
    "ZoneOffsetTransition", "ZoneRegion", "ZoneRules",
    "ZoneRulesProvider"
].forEach( classe => window[classe] = JSJoda[classe] );

//--------------------------------------------------------------------------

/**
 * Referência ao objeto "document" do DOM, na forma JQuery.
 * $(document)
 * @see document
 */
var html_documento = $(document);

/**
 * Referência ao objeto "body" do DOM, na forma JQuery.
 * $("body")
 */
var html_corpo = $("body");

/**
 * URL inicial da aplicação.
 * @see window.location
 */
var url_inicial;

/**
 * Argumentos da URL inicial da aplicação.
 * @see window.location
 */
var url_args = {};

/**
 * Identificador (ID) da sessão corrente,
 * utilizado normalmente na conversação com serviços externos,
 * como recurso base para autenticação e autorização.
 * @see setSID
 */
var sid = "";

/**
 * Linguagem em uso, no formato IETF BCP 47.
 * Padrão: "en" (inglês).
 * @see setLinguagem
 * @see https://docs.oracle.com/javase/8/docs/api/java/util/Locale.html#forLanguageTag-java.lang.String-
 */
var lid = "en";

/**
 * Identificador da zona de tempo em uso, podendo ser deslocamento fixo (offset).
 * Padrão: "+00:00" (UTC).
 * @see setZonaTempo
 * @see https://docs.oracle.com/javase/8/docs/api/java/time/ZoneId.html#of-java.lang.String-
 */
var zid = "+00:00";

/**
 * Objeto {@link ZoneId} correspondente à zona de tempo atual - variável {@link zid}.
 * @see setZonaTempo
 */
var zona_tempo = ZoneId.of(zid).normalized();

/**
 * Dicionário corrente, conforme {@link lid}.
 * O dicionário é um mapa de chaves/valores que contém todo o
 * conteúdo textual da aplicação, que se apresenta na linguagem escolhida.
 * @see lid
 */
var dicionario = dicionario_en_US;

/**
 * Total de atividades em execução sinalizadas através do método {@link incrementarEspera}.
 * O método {@link decrementarEspera} diminui a referida quantidade de atividades.
 * Caso o total de atividades seja maior que zero,
 * opcionalmente será mostrada na tela uma animação de espera.
 * @see incrementarEspera
 * @see decrementarEspera
 */
var animacao_espera_total = 0;
var animacao_espera;

/**
 * Objetos com informações sobre as telas abertas.
 * Cada tela existente terá um objeto correspondente, devidamente identificado,
 * no qual se encontrarão informações importantes acerca de seu estado,
 * como, por exemplo, os argumentos passados no momento de abertura da tela.
 * @see abrirTela
 * @see atualizarAmbiente
 */
var telas = {};

/**
 * Contador de navegação (alternagem de telas).
 */
var navegacao_passo = 0;

/**
 * Contador de geração de ID's.
 * @see gerarID
 */
var id_geracao_sequencia = 0;

/**
 * Sinalização de que a aplicação está sendo ou não encerrada.
 */
var encerrandoAplicacao = false;

/**
 * {@link MessageFormat} de acordo com a {@link lid}.
 * Este objeto é de utilidade geral para situações simples e pontuais,
 * portanto, é preferível a instanciação de {@link MessageFormat} em cada circunstância de uso.
 * Esta instância é bastante utilizada no processo de implantação de componentes.
 * @see MessageFormat
 * @see https://messageformat.github.io/messageformat/MessageFormat
 */
var formatador;

/**
 * Objeto JQuery que corresponde ao elemento raiz do trecho HTML responsável
 * por mostrar informações situacionais da aplicação Ipê-roxo.
 */
var informacao_situacional;
var informacao_situacional_texto = "";

/**
 * Objeto JQuery que corresponde ao elemento raiz do trecho HTML responsável
 * por mostrar mensagens amplas, ou seja, aquelas que ocupam todo o espaço físico da tela
 * afim de chamar a atenção do usuário para a questão.
 */
var mensagem_ampla;
var mensagem_ampla_texto;

/**
 * Mapa que correlaciona caracteres especiais a entidades HTML.
 * Os caracteres especiais costumam não ser aceitos de forma direta no corpo de um documento HTML,
 * tendo de ser representados de uma forma denominada entidade.
 * @see textoHTML
 */
var HTML_ENTIDADE = {
    ' ': '&#32;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#47;',
    '\\': '&#92;',
    '\n': '<br />'
};

// Variáveis para auxílio de processamento temporário, possuindo, portanto, conteúdo volátil.

var tmp_tela_ativa;
var tmp_tela_ativa_id;
var tmp_elemento_ativo;
var tmp_elemento_ativo_ciclo;

//--------------------------------------------------------------------------

/**
 * Atividade (função) a ser executada quando todos os recursos, inclusive o DOM, estiverem prontos para uso.
 * Evento $(document).ready() em jQuery ou "deviceready" em Cordova.
 */
function pronto( atividade ) {
    if( typeof(cordova) !== "undefined" ){
        document.addEventListener("deviceready", atividade, false);
    }else{
        $(atividade);
    }
}

//--------------------------------------------------------------------------

/**
 * @deprecated
 * @see pronto
 */
function inicio( atividade ) {
    console.warn("Método inicio() em desuso. Usar pronto().");
    return pronto(atividade);
}

//--------------------------------------------------------------------------

/**
 * Gerar um identificador (chave única) de objeto JavaScript.
 * @param {boolean} aleatorio Sufixo numérico aleatório?
 * @param {object}  supressao Lista de ID's que não devem ser retornados.
 */
function gerarID( aleatorio, supressao ) {
    
    function _gerar() {
        return "id_" + ( aleatorio ? Math.floor( Math.random() * 999999999 ) : ++id_geracao_sequencia );
    }

    if( supressao !== undefined && supressao.length > 0 ){
        var id;
        do{
            id = _gerar();
        }while( supressao.indexOf(id) != -1 );
        return id;
    }

    return _gerar();

}

//--------------------------------------------------------------------------

/**
 * Normalizar um nome para que se torne um identificador JavaScript válido.
 * Exemplo: o nome "@stro-21" será convertido para "_stro_21".
 * @param {string} nome Nome a ser normalizado.
 * @param {RegExp} padrao Expressão regular que define os caracteres que serão substituídos. Padrão = /[-.~/\\@&#:()\[\]{}]/g
 * @param {string} subst Valor a ser utilizado em substituição. Opcional. Padrão = '_'.
 */
function normalizarID( nome, padrao, subst ) {
    if( padrao === undefined ) padrao = /[-.~/\\@&#:()\[\]{}]/g;
    if( subst  === undefined ) subst  = '_';
    return nome.replace(padrao, subst);
}

//--------------------------------------------------------------------------

/**
 * Resolver uma rotina de JavaScript com {@link eval}, sem disparar exceção.
 * @param rotina Rotina a resolver.
 * @returns A própria rotina se ela não for "string"; retorna "undefined" se falhar.
 */
function js( rotina ) {
    try{
        return typeof(rotina) === "string" ? eval(rotina) : rotina;
    }catch(e){
        return undefined;
    }
}

//--------------------------------------------------------------------------

/**
 * Executar uma função JavaScript sem disparar exceção.
 * Os argumentos anônimos serão repassados para a {@linkcode funcao}.
 * @param funcao Função ou nome da função a executar.
 * @returns "undefined" se falhar.
 */
function jsExec( funcao ) {
    try{
        if( funcao === undefined || funcao === "" ) return undefined;
        if( typeof(funcao) !== "function" ) funcao = window[funcao];
        return funcao.apply( this, Array.prototype.slice.call(arguments, 1) );
    }catch(e){
        return undefined;
    }
}

//--------------------------------------------------------------------------

/**
 * Retornar o primeiro entre os valores passados por parâmetro que não é vazio.
 * Entenda-se aqui por vazio qualquer valor igual a undefined, null ou "".
 * Valores do tipo função serão preliminarmente invocados com jsExec().
 * @param valor1 Primeiro valor a ser verificado, opcional.
 * @param valor2 Segundo valor a ser verificado, opcional.
 */
function valorNaoVazio( valor1, valor2, valor3, valor4, valor5 ) {

    function valor( v ) {
        return typeof(v) === "function" ? jsExec(v) : v;
    }

    valor1 = valor(valor1);
    if( valor1 != null && valor1 !== "" ) return valor1;

    valor2 = valor(valor2);
    if( valor2 != null && valor2 !== "" ) return valor2;

    valor3 = valor(valor3);
    if( valor3 != null && valor3 !== "" ) return valor3;

    valor4 = valor(valor4);
    if( valor4 != null && valor4 !== "" ) return valor4;

    return valor5;
    
}

//--------------------------------------------------------------------------

/**
 * Especificar o valor de um "cookie", seja na efetiva estrutura de Cookie HTTP, ou
 * numa estrutura de chave/valor de um objeto-repositório.
 * @param chave Chave que identifica o cookie.
 * @param valor Valor do cookie.
 * @param minutos Tempo máximo de existência. Apenas para Cookie HTTP.
 * @param repositorio Repositório de cookies. undefined == document.cookie
 * @see getCookie
 * @see https://pt.wikipedia.org/wiki/Cookie_(inform%C3%A1tica)
 */
function setCookie( chave, valor, minutos, repositorio ) {
    if( repositorio === undefined ){
        if( minutos === undefined || minutos === 0 ){
          document.cookie = chave + "=" + encodeURI(valor) + ";path=/";
        }else{
          var expiracao = new Date();
          expiracao.setTime( expiracao.getTime() + (minutos*60*1000) );
          document.cookie = chave + "=" + encodeURI(valor) + ";expires=" + expiracao.toUTCString() + ";path=/";
        }
    }else{
        repositorio[chave] = valor;
    }
}

//--------------------------------------------------------------------------

/**
 * Retornar o valor de um "cookie".
 * @param chave Chave que identifica o cookie.
 * @param repositorio Repositório de cookies. undefined == document.cookie
 * @see setCookie
 * @see https://pt.wikipedia.org/wiki/Cookie_(inform%C3%A1tica)
 */
function getCookie( chave, repositorio ) {
    if( repositorio === undefined ){
        var inicio = chave + "=";
        var partes = document.cookie.split(';');
        for( var i = 0; i < partes.length; i++ ){
            var p = partes[i].replace(/^\s+/,"");
            if( p.indexOf(inicio) === 0 ){
                return decodeURI(p.substring(inicio.length, p.length));
            }
        }
        return "";
    }else{
        return repositorio[chave];
    }
}

//--------------------------------------------------------------------------

/**
 * Criar um elemento HTML, na forma de objeto jQuery, para ser inserido numa página (DOM/body).
 * @param {string} rotulo Rótulo que identifica o elemento. Exemplos: "div", "span", "img".
 * @param {object} atributos Objeto que define os atributos do elemento. Exemplo: {id:'teste', class:'textod'}
 * @param {*} conteudo Conteúdo do elemento, o qual pode ser texto ou jQuery (subelemento). Aceita-se vetor de elementos.
 * @returns jQuery do elemento, pronto para ser inserido numa página HTML.
 */
function elementoHTML( rotulo, atributos, conteudo ) {

    var comp = $("<" + rotulo + " />");

    if( conteudo != null ){
        if( conteudo instanceof jQuery ){
            comp.append(conteudo);
        }else if( Array.isArray(conteudo) ){
            for( var i = 0; i < conteudo.length; i++ ){
                if( conteudo[i] instanceof jQuery ){
                    comp.append(conteudo[i]);
                }
            }
        }else{
            comp.html(conteudo);
        }
    }

    for( var a in atributos ){
        comp.attr(a, atributos[a]);
    }

    return comp;

}

//--------------------------------------------------------------------------

/**
 * Sinônimo para a função elementoHTML().
 * Esta talvez substituirá, no futuro e de forma definitiva,
 * a função original, pois o nome é mais curto e facilita a
 * composição de tags conjugadas.
 * @see elementoHTML
 */
function eHTML( rotulo, atributos, conteudo ) {
    return elementoHTML( rotulo, atributos, conteudo );
}

//--------------------------------------------------------------------------

/**
 * Obter o rótulo de um elemento HTML. Exemplos de rótulos: "div", "span", "img".
 * @param elemento Elemento HTML ou objeto jQuery correspondente.
 */
function elementoRotulo( elemento ) {
    if( elemento === undefined ) return undefined;
    var nome = elemento instanceof jQuery ? elemento.prop("tagName") : elemento.tagName;
    return nome !== undefined ? nome.toLowerCase() : undefined;
}

//--------------------------------------------------------------------------

/**
 * Verificar qual é o mecanismo de definição de valor (conteúdo principal) de um elemento.
 * Elementos tais como "input" e "param" são definidos através do atributo "value".
 * A maioria é definida através de "html" (corpo do elemento).
 * @param elemento Elemento HTML ou objeto jQuery correspondente.
 * @see getDefApresentacao
 */
function getDefValor( elemento ) {
    var re = elementoRotulo(elemento);
    if( re === "input" || re === "param" ) return "value";
    if( re === "select" || re === "option" ) return "value";
    return "html";
}

//--------------------------------------------------------------------------

/**
 * Verificar qual é o mecanismo de definição de apresentação (aquilo que o usuário vê) de um elemento.
 * Elementos como o "input" são definidos através do atributo "value".
 * A maioria é definida através de "html" (corpo do elemento).
 * @param elemento Elemento HTML ou objeto jQuery correspondente.
 * @see getDefValor
 */
function getDefApresentacao( elemento ) {
    var re = elementoRotulo(elemento);
    if( re === "input" ) return "value";
    return "html";
}

//--------------------------------------------------------------------------

/**
 * Substituir caracteres especiais por entidades HTML.<br>
 * Exemplo: &amp; = &amp;amp;
 * @param {string} texto Texto a ser normalizado para HTML.
 * @see HTML_ENTIDADE
 */
function textoHTML( texto ) {
    return String( texto ).replace(/[ &<>"'\/\\\n]/g, function(x) {
        return HTML_ENTIDADE[x];
    });
}

//--------------------------------------------------------------------------

/**
 * Substituir as chaves (indicadas) pelos seus respectivos valores do dicionário.
 * Chave é um código que identifica de forma universal uma palavra ou uma frase.
 * As palavras e frases são especificadas em dicionários de acordo com a
 * linguagem e cultura do usuário da aplicação.
 * @param {*} chaves Uma chave ou um vetor de chaves.
 * @param {string} prefixo Prefixo das chaves a considerar no dicionário.
 * @param {string} sufixo Sufixo das chaves a considerar no dicionário.
 * @returns valores substituídos.
 * @see dicionario
 * @see lid
 */
function traduzir( chaves, prefixo, sufixo ) {
    
    function preparar(chave){
        if( prefixo !== undefined ) chave = prefixo + chave;
        if( sufixo  !== undefined ) chave = chave   + sufixo;
        return chave;
    }

    if( Array.isArray(chaves) ){
        for( var i = 0; i < chaves.length; i++ ){
            chaves[i] = dicionario[preparar(chaves[i])];
        }
    }else{
        chaves = dicionario[preparar(chaves)];
    }

    return chaves;

}

//--------------------------------------------------------------------------

/**
 * Remover uma classe de um elemento HTML, removendo o atributo "class" se este ficar vazio.
 * @param elemento Elemento HTML ou objeto jQuery correspondente.
 * @param classe Nome da classe a ser removida.
 */
function removerClasse( elemento, classe ) {
    var obj = jQueryObj(elemento);
    obj.removeClass(classe);
    if( obj.attr("class") === "" ){
        obj.removeAttr("class");
    }
}

//--------------------------------------------------------------------------

/**
 * Garantir o tratamento de um elemento HTML como um objeto jQuery.
 * @param o Elemento HTML ou objeto jQuery correspondente.
 * @returns Objeto jQuery. Se o argumento for um jQuery, ele mesmo será retornado.
 */
function jQueryObj( o ) {
    return o instanceof jQuery ? o : $(o);
}

//--------------------------------------------------------------------------

/**
 * Codificar uma string para o formato base64url, conforme a RFC 4648, Table 2.
 */
function codificarBase64url( str ) {
    return window.btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

//--------------------------------------------------------------------------

/**
 * Decodificar uma string que está no formato base64url, conforme a RFC 4648, Table 2.
 */
function decodificarBase64url( base64url ) {
    return window.atob( base64url.replace(/\-/g, "+").replace(/_/g, "/") );
}

//--------------------------------------------------------------------------

/**
 * Obtém todos os atributos de um elemento HTML, e seus respectivos valores.
 * @param elemento Elemento HTML ou objeto jQuery correspondente.
 * @param normalizar Função para normalizar/transformar o nome de atributo. Opcional.
 * @param manterOrig Ao normalizar o nome do atributo, manter também o nome original no resultado? Padrão: false.
 */
function obterAtributos( elemento, normalizar, manterOrig ) {
    
    var lista = elemento instanceof jQuery ? elemento[0].attributes : elemento.attributes;
    var atrib = {};

    if( normalizar === undefined ) normalizar = function(nome){ return nome };

    $.each( lista, function(i, o){

        var nome_orig = o.name;
        var nome_norm = normalizar(nome_orig);

        atrib[nome_norm] = o.value;

        if( manterOrig ) atrib[nome_orig] = o.value;

    } );

    return atrib;

}

//--------------------------------------------------------------------------

/**
 * Obtém o valor de um atributo de elemento HTML.
 * @param elemento Elemento HTML ou objeto jQuery correspondente.
 * @param nome Nome do atributo desejado.
 * @param valorPadrao Valor a retornar se o atributo inexistir ou se estiver vazio.
 */
function obterAtributo( elemento, nome, valorPadrao ) {
    var valor = jQueryObj(elemento).attr(nome);
    return valor !== undefined && valor !== "" ? valor : valorPadrao;
}

//--------------------------------------------------------------------------

/**
 * Obtém o nome de todos os arquivos selecionados num campo de entrada de arquivos.
 * @param elemento Elemento HTML "input[type=file]" ou objeto jQuery correspondente.
 */
function obterNomesArquivos( elemento ) {
    var lista = elemento instanceof jQuery ? elemento[0].files : elemento.files;
    var nomes = [];
    $.each( lista, function(i, o){
        nomes.push(o.name);
    } );
    return nomes;
}

//--------------------------------------------------------------------------

/**
 * Retorna o sufixo do nome indicado, de acordo com um caractere separador.
 * @param {string} nome String que contém um sufixo.
 * @param separador Caractere separador.
 * @returns "undefined" se sufixo inexistente.
 */
function sufixo( nome, separador ) {
    if( separador === undefined ) separador = '_';
    var i = nome.lastIndexOf(separador);
    return i >= 0 ? nome.substring(i+1) : undefined;
}

//--------------------------------------------------------------------------

/**
 * Verifica se esta aplicação está rodando num navegador Web tradicional.<br>
 * Atenção: Apache Cordova é considerado navegador apenas se device.platform === "browser".
 */
function isNavegadorWeb() {
    return typeof(cordova) === "undefined" || device.platform === "browser";
}

//--------------------------------------------------------------------------

/**
 * Verifica se esta aplicação está rodando sobre a plataforma Apache Cordova nativa.<br>
 * Atenção: Apache Cordova é considerado nativo apenas se device.platform !== "browser".
 */
function isCordovaNativa() {
    return typeof(cordova) !== "undefined" && device.platform !== "browser";
}

//--------------------------------------------------------------------------

/**
 * Incrementa o número de atividades pelas quais se espera,
 * mostrando a animação de execução.
 */
function incrementarEspera() {
    animacao_espera_total++;
    animacao_espera.style.display = "block";
}

//--------------------------------------------------------------------------

/**
 * Decrementa o número de atividades pelas quais se espera.<br>
 * Se resultar em zero, a animação de execução será removida.
 */
function decrementarEspera() {
    animacao_espera_total--;
    if( animacao_espera_total <= 0 ){
        animacao_espera_total = 0;
        animacao_espera.style.display = "none";
    }
}

//--------------------------------------------------------------------------

/**
 * @deprecated
 * @see atualizarAmbiente
 */
function atualizarComponentesCulturais() {
    console.warn("Método atualizarComponentesCulturais() em desuso. Usar atualizarAmbiente().");
    return atualizarAmbiente();
}

//--------------------------------------------------------------------------

/**
 * Copia os parâmetros/valores de uma URL (query) para um JSON.
 * @param {string} url URL.
 * @param {string} json JSON.
 */
function copiarQueryParaJSON( url, json ) {
    
    if( json === undefined ) json = {};

    var inicio = url.indexOf('?');
    if( inicio === -1 ) return json;

    var query = decodeURIComponent(url.substring(inicio+1));
    var args = query.split('&');

    for( var i = 0, valor; i < args.length; i++ ) {
        valor = args[i].split('=');
        json[valor[0]] = valor[1] === undefined ? null : valor[1];
    }

    return json;

}

//--------------------------------------------------------------------------

/**
 * Altera a {@link sid} (ID da Sessão), comumente chamada de "token".
 * Evento a disparar no final: "iperoxo.sid" (document).
 * @param {string} nova_sid Novo valor da {@link sid}.
 * @param {function} funcExito Função a ser chamada depois de atualizarAmbiente().
 */
function setSID( nova_sid, funcExito ) {
    sid = nova_sid;
    atualizarAmbiente();
    jsExec(funcExito);
    html_documento.triggerHandler("iperoxo.sid");
}

//--------------------------------------------------------------------------

/**
 * Altera a linguagem atual - variável {@link lid}. Padrão: "en".
 * No final, será chamada a função {@link linguagemAlterada}, se existente, que deveria chamar {@link atualizarAmbiente}.
 * Evento a disparar no final: "iperoxo.lid" (document).
 * @param {string} nome Código da linguagem desejada, preferencialmente no formato IETF BCP 47.
 * @param {function} funcExito Função a ser chamada depois de atualizarAmbiente().
 * @see https://docs.oracle.com/javase/8/docs/api/java/util/Locale.html#forLanguageTag-java.lang.String-
 */
function setLinguagem( nome, funcExito ) {
    
    var _nome = nome.split("-").join("_");
    var _dic  = js( "dicionario_" + _nome );
    if( _dic === undefined ) _dic = js( "dicionario_" + _nome.split("_")[0] );
    if( _dic === undefined ) _dic = dicionario_en_US;

    $.ajax({
        
        url: "etc/" + _dic.mensagens_arquivo,
        dataType: "text"

    }).done(function(txt){

        $.extend( _dic, DotProperties.parse(txt) );

        lid = nome.split("_").join("-");
        dicionario = _dic;
        
        try{
            formatador = new MessageFormat(lid);
        }catch( e ){
            formatador = new MessageFormat("en");
        }
    
        if( typeof(linguagemAlterada) !== "undefined" ) linguagemAlterada();
        else atualizarAmbiente();
    
        jsExec(funcExito);
    
        html_documento.triggerHandler("iperoxo.lid");

    });

}

//--------------------------------------------------------------------------

/**
 * Altera a zona de tempo corrente - variável {@link zid}. Padrão: "+00:00".
 * Números inteiros representando deslocamento fixo em minutos, serão convertidos para o formato "+00:00".
 * A variável {@link zona_tempo} também será atualizada.
 * Evento a disparar no final: "iperoxo.zid" (document).
 * @param {string} zonaId Identificador da zona de tempo, podendo ser um objeto ZoneId ou um deslocamento fixo (offset). Exemplos: "America/Belem", "-03:00", -180
 * @param {function} funcExito Função a ser chamada depois de atualizarAmbiente().
 * @see https://docs.oracle.com/javase/8/docs/api/java/time/ZoneId.html#of-java.lang.String-
 * @see https://docs.oracle.com/javase/8/docs/api/java/time/ZoneId.html#getAvailableZoneIds--
 */
function setZonaTempo( zonaId, funcExito ) {

    if( Number.isInteger(zonaId) ){
        var z;
        if( zonaId >= 0 ){
            z = "+";
        }else{
            z = "-";
            zonaId = - zonaId;
        }
        var hm = zonaId / 60;
        z += ("0" + parseInt(hm)).slice(-2);
        z += ":" + ("0" + Math.round(hm % 1 * 60)).slice(-2);
        zonaId = z;
    }
    
    if( typeof(zonaId) === "string" ){
        zid        = zonaId;
        zona_tempo = ZoneId.of(zid).normalized();
    }else{
        zid        = zonaId._id;
        zona_tempo = zonaId.normalized();
    }

    atualizarAmbiente();
    jsExec(funcExito);
    html_documento.triggerHandler("iperoxo.zid");
    
}

//--------------------------------------------------------------------------

/**
 * Retorna o Unix timestamp, milissegundos desde 01/jan/1970 00:00 UTC, do
 * objeto do tipo data/hora passado por parâmetro.
 * @param o Date, Instant, ZonedDateTime, LocalDateTime, LocalDate ou LocalTime.
 * @param z Zona de tempo a considerar. Opcional.
 * @throws Error se o tipo do objeto é incompatível.
 */
function getTimestamp( o, z ) {
    
    if( z == undefined ) z = zona_tempo;

    if     ( o instanceof Date          ) return o.valueOf();
    else if( o instanceof Instant       ) return o.toEpochMilli();
    else if( o instanceof ZonedDateTime ) return o.toEpochSecond() * 1000;
    else if( o instanceof LocalDateTime ) return o.toEpochSecond(z) * 1000;
    else if( o instanceof LocalDate     ) return o.atStartOfDay(z).toEpochSecond() * 1000;
    else if( o instanceof LocalTime     ) return o.atDate(LocalDate.of(1970,1,1)).toEpochSecond(z) * 1000;
    else throw new Error(typeof(o));

}

//--------------------------------------------------------------------------

/**
 * Carrega o conteúdo dos elementos textuais, sensíveis à {@link lid}, que estão desatualizados.
 * Evite utilizar este método de forma direta, prefira {@link atualizarAmbiente}.
 */
function carregarTextoDinamico() {

    function processar( elemento, chave, funcao, extra ) {
        var origem = elemento.attr("origem");
        if( origem === undefined || origem.length === 0 ){
            jsExec( funcao, elemento, dicionario[chave], extra );
        }else{
            uxiamarelo(
                origem,
                { "sid": sid, "lid": lid, "chave": chave },
                function(retorno){ jsExec( funcao, elemento, retorno, extra ); }
            );
        }
    }

    function defHtml( elemento, texto ) {
        if( texto !== undefined ) elemento.html(textoHTML(texto));
    }

    function defValue( elemento, texto ) {
        if( texto !== undefined ) elemento.val(texto);
    }

    function defAttr( elemento, texto, atributo ) {
        if( texto !== undefined ) elemento.attr(atributo, texto);
    }

    $(".textod, .texto_dinamico").each(function(){

        var _this = $(this);

        var lingatual = _this.attr("lingatual");
        if( lingatual === lid ) return;
        _this.attr("lingatual", lid);

        var chaves = _this.attr("chaves");
        if( chaves !== undefined && chaves.length > 0 ){
            
            var atribs = chaves.split(",");
            for( var i = 0; i < atribs.length; i++ ){

                var atrib = atribs[i].trim().split("=");
                if( atrib.length !== 2 ) continue;

                var funcao = atrib[0].trim();
                var chave  = atrib[1].trim();
                var extra  = undefined;

                if( funcao === "h" || funcao === "html" ){
                    funcao = defHtml;
                }else if( funcao === "v" || funcao === "value" ){
                    funcao = defValue;
                }else if( funcao === "ph" || funcao === "placeholder" ){
                    funcao = defAttr;
                    extra  = "placeholder";
                }else if( funcao === "a" || funcao === "auto" ){
                    funcao = getDefApresentacao(_this) === "value" ? defValue : defHtml;
                }else{
                    extra  = funcao;
                    funcao = defAttr;
                }

                processar( _this, chave, funcao, extra );

            }

        }else{

            var chave = _this.attr("chave");
            if( chave !== undefined && chave.length > 0 ){
                processar( _this, chave, getDefApresentacao(_this) === "value" ? defValue : defHtml );
            }

            var chaveph = _this.attr("chaveph");
            if( chaveph !== undefined && chaveph.length > 0 ){
                processar( _this, chaveph, defAttr, "placeholder" );
            }

        }
        
    });

}

//--------------------------------------------------------------------------

/**
 * Altera o conteúdo textual de um elemento, privilegiando o mecanismo de texto dinâmico.
 * @param elemento Elemento HTML ou objeto jQuery correspondente.
 * @param chave Valor da "chave" ou "chaves", ou conteúdo textual direto.
 * @param carregar Executar carregarTextoDinamico()?
 */
function setTexto( elemento, conteudo, carregar ) {
    var obj = jQueryObj(elemento);
    if( elemento.hasClass("textod") || elemento.hasClass("texto_dinamico") ){
        if( conteudo.indexOf("=") > 0 ) obj.attr("chaves", conteudo);
        else obj.attr("chave", conteudo);
        obj.attr("lingatual", "");
        if( carregar !== false ) carregarTextoDinamico();
    }else{
        obj.text(conteudo);
    }
}

//--------------------------------------------------------------------------

/**
 * Acrescenta uma "ipe-mensagem" numa região do HTML.
 * A mensagem será inserida no primeiro descendente que contém a classe "mensagens".
 * Se região == null, será utilizado o elemento global que possui id = "mensagens".
 * @param {string} estilo Estilo visual da mensagem: "padrao", "primario", "secundario", "sucesso", "informacao", "atencao", "perigo", "claro" ou "escuro".
 * @param {string} texto Texto da mensagem, o qual será normalizado com {@link textoHTML}.
 * @param {string} regiao Objeto jQuery.
 */
function mensagemClassificada( estilo, texto, regiao ) {
    var destino = regiao == null ? $("#mensagens") : regiao.find(".mensagens:first");
    inserirComponente( destino, "ipe-mensagem", { "estilo": estilo }, textoHTML(texto), "fim" );
    html_documento.scrollTop(0);
}

//--------------------------------------------------------------------------

/**
 * {@link mensagemClassificada} como "sucesso".
 * @see mensagemClassificada
 */
function mensagemExito( texto, regiao ) {
    mensagemClassificada( "sucesso", texto, regiao );
}

/**
 * {@link mensagemClassificada} como "informacao".
 * @see mensagemClassificada
 */
function mensagemInformacao( texto, regiao ) {
    mensagemClassificada( "informacao", texto, regiao );
}

/**
 * {@link mensagemClassificada} como "atencao".
 * @see mensagemClassificada
 */
function mensagemAtencao( texto, regiao ) {
    mensagemClassificada( "atencao", texto, regiao );
}

/**
 * {@link mensagemClassificada} como "perigo".
 * @see mensagemClassificada
 */
function mensagemErro( texto, regiao ) {
    mensagemClassificada( "perigo", texto, regiao );
}

//--------------------------------------------------------------------------

/**
 * Mostra o conjunto novo de mensagens provenientes de Copaíba.
 * As mensagens atualmente ativas serão removidas.
 * @param resposta {@link com.joseflavio.urucum.comunicacao.Resposta}
 * @param regiao Região do HTML, conforme regras da função {@link mensagemClassificada}.
 * @see mensagemClassificada
 * @see mensagensAmplaCopaiba
 * @see limparMensagens
 * @see http://joseflavio.com/copaiba
 * @see http://joseflavio.com/urucum
 */
function mensagensCopaiba( resposta, status, jqXHR, regiao ) {
    limparMensagens( regiao );
    $.each( resposta.mensagens, function() {
        if     ( this.tipo === "EXITO"      ) mensagemExito( this.argumento, regiao );
        else if( this.tipo === "INFORMACAO" ) mensagemInformacao( this.argumento, regiao );
        else if( this.tipo === "ATENCAO"    ) mensagemAtencao( this.argumento, regiao );
        else if( this.tipo === "ERRO"       ) mensagemErro( this.argumento, regiao );
        else if( this.tipo === "ACAO"       ) jsExec( this.referencia, this.argumento );
    });
}

//--------------------------------------------------------------------------

/**
 * Mostra {@link abrirMensagemAmpla amplamente} o conjunto novo de mensagens provenientes de Copaíba.
 * @param resposta {@link com.joseflavio.urucum.comunicacao.Resposta}
 * @see abrirMensagemAmpla
 * @see extrairMensagens
 * @see mensagensCopaiba
 * @see http://joseflavio.com/copaiba
 * @see http://joseflavio.com/urucum
 */
function mensagensAmplaCopaiba( resposta, status, jqXHR ) {
    abrirMensagemAmpla( extrairMensagens(resposta) );
}

//--------------------------------------------------------------------------

/**
 * @deprecated
 * @see mensagensErroHTTP
 */
function mensagemErroUxiamarelo( jqXHR, status, errorThrown, regiao ) {
    console.warn("Método mensagemErroUxiamarelo() em desuso. Usar mensagensErroHTTP().");
    return mensagensErroHTTP( jqXHR, status, errorThrown, regiao );
}

//--------------------------------------------------------------------------

/**
 * Mostra as mensagens de erro HTTP recebidas do navegador/cliente, servidor Web, proxy ou Uxi-amarelo.
 * As mensagens atualmente ativas serão removidas.
 * @see mensagemErro
 * @see https://tools.ietf.org/html/rfc7231#section-6.6
 * @see http://joseflavio.com/uxiamarelo
 */
function mensagensErroHTTP( jqXHR, status, errorThrown, regiao ) {
    
    function _msgerro( str ) {
        limparMensagens( regiao );
        mensagemErro( str, regiao );
    }

    if( jqXHR != null ){
        
        var resposta = jqXHR.responseJSON;

        if( resposta != null ){

            if( resposta.mensagens != null ){
                mensagensCopaiba( resposta, status, jqXHR, regiao );

            }else if( resposta.mensagem != null ){
                _msgerro( resposta.mensagem );

            }else{
                _msgerro( JSON.stringify(resposta) );
            }

        }else if( jqXHR.status != null ){
            if( jqXHR.status == 0 ) _msgerro( dicionario.erro_comunicacao );
            else _msgerro( jqXHR.status + " - " + jqXHR.statusText );

        }else{
            _msgerro( typeof(jqXHR) === "string" ? jqXHR : JSON.stringify(jqXHR) );
        }

    }else{
        _msgerro( dicionario.erro_desconhecido );
    }

}

//--------------------------------------------------------------------------

/**
 * Mostra {@link abrirMensagemAmpla amplamente} o conteúdo bruto de um objeto, conforme {@link JSON#stringify}.
 * @see abrirMensagemAmpla
 * @see JSON#stringify
 */
function mensagemAmplaBruta( obj ) {
    abrirMensagemAmpla( typeof(obj) === "string" ? obj : JSON.stringify(obj) );
}

//--------------------------------------------------------------------------

/**
 * Remove todas as mensagens contidas numa região do HTML.
 * @param regiao Região do HTML, conforme regras da função {@link mensagemClassificada}.
 * @see mensagemClassificada
 */
function limparMensagens( regiao ) {
    var destino = regiao == null ? $("#mensagens") : regiao.find(".mensagens:first");
    destino.empty();
}

//--------------------------------------------------------------------------

/**
 * Extrai as mensagens de uma {@link com.joseflavio.urucum.comunicacao.Resposta}.
 * @param resposta {@link com.joseflavio.urucum.comunicacao.Resposta}
 * @param separador Separador a utilizar entre as mensagens extraídas. Padrão: '\n'
 */
function extrairMensagens( resposta, separador ) {
    var texto = "";
    if( separador === undefined ) separador = '\n';
    $.each( resposta.mensagens, function() {
        texto += this.argumento + separador;
    });
    return texto;
}

//--------------------------------------------------------------------------

/**
 * Mostra uma mensagem textual em destaque na tela toda.
 * @param {string} texto Texto a ser mostrado, o qual antes será normalizado com {@link textoHTML}.
 */
function abrirMensagemAmpla( texto ) {
    mensagem_ampla_texto.innerHTML = textoHTML(texto);
    mensagem_ampla.style.display = "block";
}

//--------------------------------------------------------------------------

/**
 * Remove a mensagem textual mostrada através de {@link abrirMensagemAmpla}.
 */
function fecharMensagemAmpla() {
    mensagem_ampla.style.display = "none";
}

//--------------------------------------------------------------------------

/**
 * Atualiza a informação situacional.
 * @param {string} texto Texto que descreve a situação atual. Ele será normalizado com {@link textoHTML}.
 */
function setInformacaoSituacional( texto ) {
    if( texto == null ) texto = "";
    informacao_situacional_texto = textoHTML(texto);
    informacao_situacional.html(informacao_situacional_texto);
}

//--------------------------------------------------------------------------

/**
 * Atualiza a informação situacional e garante sua visibilidade.
 * @param {string} texto Texto que descreve a situação atual. Ele será normalizado com {@link textoHTML}.
 */
function mostrarInformacaoSituacional( texto ) {
    setInformacaoSituacional(texto);
    informacao_situacional.tempo = Instant.now();
    informacao_situacional.fadeIn();
}

//--------------------------------------------------------------------------

/**
 * Oculta a informação situacional.
 */
function ocultarInformacaoSituacional() {
    informacao_situacional.tempo = undefined;
    informacao_situacional.fadeOut();
}

//--------------------------------------------------------------------------

/**
 * Executa AJAX do tipo POST para um serviço {@link http://joseflavio.com/uxiamarelo Uxi-amarelo}.
 * @param url URL para Uxi-amarelo.
 * @param json JSON a ser enviado através de POST.
 * @param funcExito Função a ser executada, se êxito.
 * @param funcErro Função a ser executada, se erro.
 * @param argExtra Argumento para {@linkcode funcExito} ou {@linkcode funcErro}.
 * @see http://joseflavio.com/uxiamarelo
 */
function uxiamarelo( url, json, funcExito, funcErro, argExtra ) {
    
    var req = $.ajax({
        
        url: url,
        method: "POST",
        data: JSON.stringify(json),
        
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        funcExito: funcExito,
        funcErro: funcErro,
        argExtra: argExtra

    });

    if( typeof(funcExito) === "function" ) req.done(function( data, textStatus, jqXHR ) {
        this.funcExito( data, textStatus, jqXHR, this.argExtra );
    });

    if( typeof(funcErro) === "function" ) req.fail(function( jqXHR, textStatus, errorThrown ) {
        this.funcErro( jqXHR, textStatus, errorThrown, this.argExtra );
    });

}

//--------------------------------------------------------------------------

/**
 * Prepara um formulário HTML para ser submetido através de AJAX a um serviço {@link http://joseflavio.com/uxiamarelo Uxi-amarelo}.
 * @param formulario Formulário HTML (objeto jQuery).
 * @param enviarAgora Executar o AJAX imediatamente? Caso contrário, apenas habilitará o "submit" através de AJAX.
 * @param funcExito Função a ser executada, se êxito. Argumento extra: {@linkcode formulario}.
 * @param funcErro Função a ser executada, se erro. Argumento extra: {@linkcode formulario}.
 * @param funcPreEnvio Função a ser executada antes da submissão do formulário. Se retornar "false", cancela o AJAX. Argumento extra: {@linkcode formulario}.
 * @see http://joseflavio.com/uxiamarelo
 */
function uxiamareloPreparar( formulario, enviarAgora, funcExito, funcErro, funcPreEnvio ) {

    var conf = {
        
        formulario: formulario,
        funcExito: funcExito,
        funcErro: funcErro,
        funcPreEnvio: funcPreEnvio,

        dataType: "json",

        success: function( data, textStatus, jqXHR ){
            if( typeof(this.funcExito) === "function" ){
                this.funcExito( data, textStatus, jqXHR, this.formulario );
            }
        },

        error: function( jqXHR, textStatus, errorThrown ){
            if( typeof(this.funcErro) === "function" ){
                this.funcErro( jqXHR, textStatus, errorThrown, this.formulario );
            }
        },

        beforeSend: function( jqXHR, settings ){
            if( typeof(this.funcPreEnvio) === "function" ){
                this.funcPreEnvio( jqXHR, settings, this.formulario );
            }
        }

    };

    if( enviarAgora ){
        formulario.ajaxSubmit(conf);
    }else{
        formulario.ajaxForm(conf);
    }

}

//--------------------------------------------------------------------------

/**
 * Atualiza todo o ambiente Ipê-roxo, implantando novos componentes, atualizando textos dinâmicos,
 * revisando o sistema de telas, atualizando os componentes existentes, etc.
 * Para cada tela reconhecida será mantido um objeto na variável global {@link telas}.
 * Evento a disparar no final: "iperoxo.ambiente" (document).
 * @see atualizarComponente
 */
function atualizarAmbiente() {

    implantarComponentes();
    implantarDicas();
    carregarTextoDinamico();

    // Removendo objetos desnecessários
    for( var t in telas ){
        if( $("#"+t).length === 0 ){
            delete telas[t];
        }
    }

    // Atualizando telas
    $(".tela").each(function(){

        var tela = $(this);

        // ID da tela
        var tid = tela.attr("id");
        if( tid === undefined || tid.length === 0 ){
            tid = gerarID();
            tela.attr( "id", tid );
        }

        // Objeto associado à tela
        if( telas[tid] === undefined ){
            telas[tid] = {
                "tid"   : tid,
                "args"  : {},
                "passo" : navegacao_passo
            };
        }

        // Campos padrões
        tela.find(".sid:first").val(sid);
        tela.find(".lid:first").val(lid);
        tela.find(".zid:first").val(zid);
        tela.find(".tid:first").val(tid);

    });

    $(".componente").each(function(){
        atualizarComponente(this);
    });

    //TODO Remover por desuso
    if( js("telasAtualizadas") !== undefined ){
        console.warn("telasAtualizadas() em desuso. Usar evento 'iperoxo.ambiente'.");
        jsExec("telasAtualizadas");
    }

    html_documento.triggerHandler("iperoxo.ambiente");

}

//--------------------------------------------------------------------------

/**
 * @deprecated
 * @see atualizarAmbiente
 */
function atualizarTelas() {
    console.warn("Método atualizarTelas() em desuso. Usar atualizarAmbiente().");
    return atualizarAmbiente();
}

//--------------------------------------------------------------------------

/**
 * Carrega uma tela, a qual está especificada em outra página HTML.
 * @param pagina URL da página HTML que contém a tela.
 * @param autoAtivar Ativar automaticamente a tela? Padrão: true. Ver {@link ativarTela}
 * @param paginaArg Argumento (JSON ou String) a ser enviado para a página, além das "URL Query Strings".
 * @param funcExito {@linkcode function(tid, funcExitoArg)}, executada após a carga normal da tela.
 * @param funcExitoArg Argumento a ser passado para a {@linkcode funcExito}.
 */
function abrirTela( pagina, autoAtivar, paginaArg, funcExito, funcExitoArg ) {

    if( autoAtivar === undefined ) autoAtivar = true;

    var divID  = gerarID();
    var divHTML = "<div id=\"" + divID + "\" class=\"d-none\"></div>";
    var telaAtiva = getTelaAtiva();

    if( telaAtiva !== undefined ) telaAtiva.parent().after(divHTML);
    else $("#telas").append(divHTML);

    var div = $( "#" + divID );
    var queryJSON = copiarQueryParaJSON(pagina);
    
    if( $.isPlainObject(paginaArg) ){
        $.extend(queryJSON, paginaArg);
        paginaArg = JSON.parse(JSON.stringify(paginaArg));
    }

    div.load(
        pagina + " .tela",
        paginaArg,
        function(){

            var tela = div.children(".tela");

            var tid = tela.attr("id");
            if( tid === undefined || tid.length === 0 ){
                tid = gerarID();
                tela.attr( "id", tid );
            }

            var telaObj = telas[tid] = {
                "tid"   : tid,
                "nome"  : tela.attr("nome"),
                "args"  : queryJSON,
                "passo" : navegacao_passo
            };

            tela.click(function(evento){
                if( evento.target.id === tid ){
                    setInformacaoSituacional();
                }
            });

            tela.addClass("d-none");
            removerClasse(div, "d-none");
            atualizarAmbiente();

            tela.find(".uxiamarelo_form").each(function(){
                var form = $(this);
                uxiamareloPreparar(
                    form,
                    false,
                    js(obterAtributo(form, "funcExito",    telaObj.nome + "_form_funcExito"   )),
                    js(obterAtributo(form, "funcErro",     telaObj.nome + "_form_funcErro"    )),
                    js(obterAtributo(form, "funcPreEnvio", telaObj.nome + "_form_funcPreEnvio"))
                );
                jsExec( obterAtributo(form, "funcInicio", telaObj.nome + "_form_funcInicio"), form );
            });

            var posPreparacao = function() {
                if( autoAtivar ) ativarTela( tid );
                jsExec( funcExito, tid, funcExitoArg );
            };

            var resultado = jsExec(
                obterAtributo(tela, "funcPreparacao", telaObj.nome + "_funcPreparacao"),
                tela,
                queryJSON,
                tid,
                telaObj,
                posPreparacao,
                posPreparacao
            );

            if( resultado !== false ) posPreparacao();

        }
    );

}

//--------------------------------------------------------------------------

/**
 * Determina qual das telas deve estar visível e disponível para uso.
 * @param tela Elemento HTML, objeto jQuery ou identificação (tid) da tela desejada.
 */
function ativarTela( tela ) {

    if( typeof(tela) === "string" ) tela = $( "#" + tela );
    else tela = jQueryObj(tela);
    if( ! tela.hasClass("tela") ) return;
    
    var tid = tela.attr("id");
    var telaObj = telas[tid];

    $( ".tela" ).addClass("d-none");

    telaObj.passo = ++navegacao_passo;

    var posPreAtivacao = function() {

        var elemAtivo = telaObj.elementoAtivo;

        tela.removeClass("d-none");

        atualizarAmbiente();
    
        ajustarRolagem();

        if( elemAtivo !== undefined ) elemAtivo.focus();
        else tela.find(".focavel:first").focus();
    
        if( telaObj.iniciada === undefined ){
            telaObj.iniciada = true;
            jsExec(
                obterAtributo(tela, "funcInicio", telaObj.nome + "_funcInicio"),
                tela,
                telaObj.args,
                tid,
                telaObj
            );
        }

    };

    var resultado = jsExec(
        obterAtributo(tela, "funcPreAtivacao", telaObj.nome + "_funcPreAtivacao"),
        tela,
        telaObj.args,
        tid,
        telaObj,
        posPreAtivacao,
        posPreAtivacao
    );

    if( resultado !== false ) posPreAtivacao();

}

//--------------------------------------------------------------------------

/**
 * Verifica se a tela indicada está ativa.
 * @param tela Elemento HTML, objeto jQuery ou identificação (tid) da tela desejada.
 */
function isTelaAtiva( tela ) {

    if( typeof(tela) === "string" ) tela = $( "#" + tela );
    else tela = jQueryObj(tela);

    return ! tela.hasClass("d-none");

}

//--------------------------------------------------------------------------

/**
 * Tela atualmente ativa.
 */
function getTelaAtiva() {
    if( telas[tmp_tela_ativa_id] === undefined || tmp_tela_ativa.hasClass("d-none") ){
        tmp_tela_ativa = $(".tela").not(".d-none");
        tmp_tela_ativa_id = tmp_tela_ativa.attr("id");
    }
    return tmp_tela_ativa.length > 0 ? tmp_tela_ativa : undefined;
}

//--------------------------------------------------------------------------

/**
 * Identificação da tela atualmente ativa.
 */
function getTelaAtivaId() {
    if( telas[tmp_tela_ativa_id] === undefined || tmp_tela_ativa.hasClass("d-none") ){
        tmp_tela_ativa = $(".tela").not(".d-none");
        tmp_tela_ativa_id = tmp_tela_ativa.attr("id");
    }
    return tmp_tela_ativa.length > 0 ? tmp_tela_ativa_id : undefined;
}

//--------------------------------------------------------------------------

/**
 * Fecha e remove uma tela.
 * @param tela Elemento HTML, objeto jQuery ou identificação (tid) da tela desejada.
 */
function fecharTela( tela ) {

    if( typeof(tela) === "string" ) tela = $( "#" + tela );
    else tela = jQueryObj(tela);
    if( ! tela.hasClass("tela") ) return;
    var tid = tela.attr("id");

    var remocaoEfetiva = function() {

        var oculta = tela.hasClass("d-none");
        tela.parent().remove();
        delete telas[tid];
    
        if( ! oculta ){
    
            var maior = -1;
            var maior_tid = undefined;
    
            for( var t in telas ){
                var p = telas[t].passo;
                if( p > maior ){
                    maior = p;
                    maior_tid = t;
                }
            }
    
            if( maior_tid != undefined ){
                ativarTela( maior_tid );
            }
    
        }
    
        atualizarAmbiente();

        if( Object.keys(telas).length === 0 && ! encerrandoAplicacao ){
            jsExec( configuracao.funcao_tela_ausente );
        }

    };

    var telaObj = telas[tid];

    var resultado = jsExec(
        obterAtributo(tela, "funcFim", telaObj.nome + "_funcFim"),
        tela,
        telaObj.args,
        tid,
        telaObj,
        remocaoEfetiva,
        remocaoEfetiva
    );

    if( resultado !== false ) remocaoEfetiva();

}

//--------------------------------------------------------------------------

/**
 * Fecha e remove todas as telas atuais.
 */
function fecharTelas() {
    for( var t in telas ){
        fecharTela(t);
    }
}

//--------------------------------------------------------------------------

/**
 * Fecha e remove a tela ativa.
 */
function fecharTelaAtiva() {
    fecharTela( getTelaAtiva() );
}

//--------------------------------------------------------------------------

/**
 * Executa uma ação/evento de tela.
 * A função a ser chamada deverá ter minimamente a assinatura da função {@link exemploEventoTela}.
 * Argumentos extras serão repassados para a {@linkcode funcao}, após a passagem dos argumentos padrões.
 * @param elemento Elemento HTML ou objeto jQuery da tela ou de parte dela.
 * @param funcao Função ou nome da função a ser executada. Se a string iniciar com "_", será prefixada com o nome da tela.
 * @see exemploEventoTela
 */
function acaoTela( elemento, funcao ) {

    elemento = jQueryObj(elemento);

    var tela    = estaTela(elemento);
    var tid     = tela.attr("id");
    var telaObj = telas[tid];

    if( typeof(funcao) === "string" && funcao[0] === "_" ){
        funcao = telaObj.nome + funcao;
    }

    jsExec.apply(
        this,
        [ funcao, tela, telaObj.args, tid, telaObj, undefined, undefined ]
        .concat( Array.prototype.slice.call(arguments, 2) )
    );

}

//--------------------------------------------------------------------------

/**
 * Exemplo de evento de tela.
 * @param tela Objeto jQuery do elemento raiz da tela.
 * @param args Argumentos passados para a tela durante a abertura.
 * @param tid Identificação da tela.
 * @param telaObj Objeto que representa a tela em {@link telas}.
 * @param funcExito Função de êxito a ser chamada se esta tiver comportamento assíncrono.
 * @param funcErro Função de erro a ser chamada se esta tiver comportamento assíncrono.
 * @returns {@linkcode false}, se esta função tem comportamento assíncrono.
 * @see acaoTela
 */
function exemploEventoTela( tela, args, tid, telaObj, funcExito, funcErro ) {
    abrirMensagemAmpla(JSON.stringify(telaObj));
}

//--------------------------------------------------------------------------

/**
 * Ajusta as rolagens horizontal e vertical da tela ativa conforme o último registro de posicionamento.
 */
function ajustarRolagem() {
    var telaAtiva = getTelaAtiva();
    if( telaAtiva !== undefined ){
        var telaObj = telas[telaAtiva.attr("id")];
        if( telaObj !== undefined ){
            if( telaObj.rolagem_horizontal !== undefined ){
                html_documento.scrollLeft( telaObj.rolagem_horizontal );
                html_documento.scrollTop ( telaObj.rolagem_vertical   );
            }else{
                html_documento.scrollLeft( 0 );
                html_documento.scrollTop ( 0 );
            }
        }
    }
}

//--------------------------------------------------------------------------

/**
 * Implanta todas as dicas indicadas através da classe "dica" e do atributo "dica".
 * Este método é chamado automaticamente por {@link atualizarAmbiente}.
 */
function implantarDicas() {

    $(".dica").each(function(){

        var elem = $(this);
        var dica = elem.attr("dica");

        elem.removeClass("dica");
        elem.addClass("dica-implantada");

        var funcEntrada = function(evento){
            mostrarInformacaoSituacional(dicionario[dica]);
        };

        var funcSaida = function(evento){
            setInformacaoSituacional();
        };

        if( elem.hasClass("focavel") ){
            elem.focusin(function(evento){
                informacao_situacional.fixa = true;
                funcEntrada(evento);
            });
            elem.focusout(function(evento){
                informacao_situacional.fixa = false;
                funcSaida(evento);
            });
        }else{
            elem.click(funcEntrada);
        }

    });

}

//--------------------------------------------------------------------------

/**
 * Substitui todas as tags de componentes pelos seus respectivos códigos HTML.
 * Todo o DOM do documento é varrido, e não somente o escopo de tela.
 * Este método não garante a renderização completa do componente,
 * pois outras características precisam ser processadas.
 * Portanto, evite utilizar este método de forma direta, prefira chamar {@link atualizarAmbiente}.
 * @see configuracao.componentes
 * @see {@link html-dep/iperoxo-componentes.html}
 * @see {@link html/componentes.html}
 */
function implantarComponentes() {

    var tipos = Object.keys(configuracao.componentes).join(',');
    var pos_implantacao_total = [];

    while( true ){
        
        var comp = $(tipos).first();
        if( comp.length === 0 ) break;

        var atributos = obterAtributos(comp, normalizarID, true);
        var conteudo  = comp.html();
        if( conteudo !== "" ) atributos["conteudo"] = conteudo;

        var tipo = elementoRotulo(comp);
        var html = configuracao.componentes[tipo].html;
        var novo = $($.parseHTML( formatador.compile(html)(atributos) ));

        comp.children(tipos).each(function(){

            var subcomp = $(this).detach();
            var destino = $("ipe-componente[tipo='" + elementoRotulo(subcomp) + "']:first", novo);

            if( destino.length > 0 ){
                var endereco = destino.attr("destino");
                if( endereco !== undefined && endereco !== "" ){
                    destino.parent(".componente:first").find(endereco).append(subcomp);
                }else{
                    destino.before(subcomp);
                }
            }

        });

        $.merge(novo.find(".componente-ajustar"), novo).each(function(){
            var obj = $(this);
            $.each( Array.from(obj[0].attributes), function(i, o){
                var remover = false;
                if( o.name.startsWith("atributo-boolean-") ){
                    if( o.value !== "" ) obj.attr(o.value, o.value);
                    remover = true;
                }else if( o.name.startsWith("classe-extra-") ){
                    if( o.value !== "" ) obj.addClass(o.value);
                    remover = true;
                }else if( o.value === "remover-atributo" ){
                    remover = true;
                }else if( o.value === "remover-elemento" ){
                    obj.remove();
                    return false;
                }else if( o.value === "remover-elemento-apenas" ){
                    obj.replaceWith(obj.contents());
                    return false;
                }
                if( remover ) obj.removeAttr(o.name);
            } );
            removerClasse(obj, "componente-ajustar");
        });

        var chave = configuracao.componentes[tipo].chave;

        jsExec( chave + "_pre_implantacao", novo, atributos, comp );
        comp.replaceWith( novo );
        novo.removeClass("ver-pronto");
        jsExec( chave + "_pos_implantacao", novo, atributos, comp );

        var func_pos_total = js( chave + "_pos_implantacao_total" );
        if( func_pos_total !== undefined ){
            pos_implantacao_total.push({
                funcao : func_pos_total,
                arg1   : novo,
                arg2   : atributos,
                arg3   : comp
            });
        }

    }

    for( var i = 0; i < pos_implantacao_total.length; i++ ){
        var acao = pos_implantacao_total[i];
        jsExec( acao.funcao, acao.arg1, acao.arg2, acao.arg3 );
    }

}

//--------------------------------------------------------------------------

/**
 * Cria e insere um componente numa página HTML.
 * Pode-se optar por buscar o local mais adequado (preferência) para o componente.
 * Obs.: O método {@link atualizarAmbiente} será chamado para renderizar plenamente o componente inserido.
 * @param {jQuery} destino Destino de referência (raiz): elemento HTML ou objeto jQuery correspondente.
 * @param {string} tipo Tipo do componente. Exemplos: "ipe-texto", "ipe-arquivo", etc.
 * @param {object} atributos Atributos do componente. Exemplo: {nome:'texto', rotulo:'texto', valor:'Ipê-roxo!'}
 * @param {*} conteudo Conteúdo do elemento, o qual pode ser um texto ou um jQuery (subelementos).
 * @param {string} posicao Posição de inserção em relação ao elemento de destino. Valores: "preferencia", "inicio", "fim", "antes" ou "depois". Padrão: "preferencia".
 * @param {boolean} renderizar Executar {@link atualizarAmbiente} logo após a inserção? Padrão: true.
 * @see {@link html-dep/iperoxo-componentes.html}
 * @see {@link html/componentes.html}
 * @see configuracao.componentes
 * @see eHTML
 */
function inserirComponente( destino, tipo, atributos, conteudo, posicao, renderizar ) {

    var raiz = jQueryObj(destino);
    var comp = eHTML(tipo, atributos, conteudo);

    if( posicao === "preferencia" || posicao === undefined ){
        
        var local = $("ipe-componente[tipo='" + tipo + "']:first", raiz);

        if( local.length > 0 ){
            var endereco = local.attr("destino");
            if( endereco !== undefined && endereco !== "" ){
                raiz = local.parent(".componente:first");
                if( raiz.length === 0 ) raiz = $("html");
                var local_apontado = raiz.find(endereco);
                if( local_apontado.length > 0 ) local_apontado.append(comp);
                else local.before(comp);
            }else{
                local.before(comp);
            }
        }else{
            raiz.append(comp);
        }

    }else if( posicao === "inicio" ){
        raiz.prepend(comp);

    }else if( posicao === "antes" ){
        raiz.before(comp);

    }else if( posicao === "depois" ){
        raiz.after(comp);

    }else{
        raiz.append(comp);
    }

    if( renderizar === true || renderizar === undefined ) atualizarAmbiente();

}

//--------------------------------------------------------------------------

/**
 * Retorna o componente identificado pelo nome de referência passado por parâmetro.
 * @param ref Nome de referência do componente desejado. Atributo "componente-ref".
 * @param raiz Raiz de busca. Objeto jQuery, elemento HTML ou ID de tela. Opcional.
 * @returns Objeto jQuery do componente.
 */
function getComp( ref, raiz ) {
    raiz =
        raiz === undefined ? $("html") :
        typeof raiz === "string" ? $(".tela[id='" + raiz + "']") :
        jQueryObj(raiz);
    return $(".componente[componente-ref='" + ref + "']:first", raiz);
}

//--------------------------------------------------------------------------

/**
 * Remove um componente visual Ipê-roxo da tela. A remoção é irreversível.
 * @param comp Componente a ser removido (jQuery ou elemento HTML).
 * @see getComp
 */
function removerComponente( comp ) {
    jQueryObj(comp).remove();
}

//--------------------------------------------------------------------------

/**
 * Obtém o valor de um componente visual Ipê-roxo.
 * @param comp Componente a ser manipulado (jQuery ou elemento HTML).
 * @returns valor em formato específico do componente analisado.
 * @see getComp
 * @see setCompValor
 */
function getCompValor( comp ) {
    comp = jQueryObj(comp);
    var tipo  = comp.attr("componente-tipo");
    var chave = configuracao.componentes[tipo].chave;
    var fonte = js( chave + "_get_valor" );
    if( fonte !== undefined ){
        return jsExec(fonte, comp);
    }else{
        fonte = configuracao.componentes[tipo]["valor-auto"];
        if( fonte === undefined ) return undefined;
        fonte = fonte === "" ? comp : comp.find(fonte);
        return getDefValor(fonte) === "value" ? fonte.val() : fonte.html();
    }
}

//--------------------------------------------------------------------------

/**
 * Define o valor de um componente visual Ipê-roxo.
 * @param comp Componente a ser manipulado (jQuery ou elemento HTML).
 * @param valor Valor em formato específico do componente.
 * @see getComp
 * @see getCompValor
 */
function setCompValor( comp, valor ) {
    comp = jQueryObj(comp);
    var tipo  = comp.attr("componente-tipo");
    var chave = configuracao.componentes[tipo].chave;
    var fonte = js( chave + "_set_valor" );
    if( fonte !== undefined ){
        return jsExec(fonte, comp, valor);
    }else{
        fonte = configuracao.componentes[tipo]["valor-auto"];
        if( fonte === undefined ) return undefined;
        fonte = fonte === "" ? comp : comp.find(fonte);
        var ret = getDefValor(fonte) === "value" ? fonte.val(valor) : fonte.html(valor);
        fonte.trigger("change");
        return ret;
    }
}

//--------------------------------------------------------------------------

/**
 * Atualiza a aparência e o estado funcional de um componente visual Ipê-roxo.
 * @param comp Componente a ser manipulado (jQuery ou elemento HTML).
 * @see getComp
 */
function atualizarComponente( comp ) {
    comp = jQueryObj(comp);
    var tipo  = comp.attr("componente-tipo");
    if( tipo === undefined ) return;
    var chave = configuracao.componentes[tipo].chave;
    jsExec( chave + "_atualizar", comp );
}

//--------------------------------------------------------------------------

/**
 * Verifica se um componente visual Ipê-roxo está em estado
 * que permita a alteração de valor através da interface gráfica.
 * @param comp Componente a ser manipulado (jQuery ou elemento HTML).
 * @returns true, se componente em estado editável.
 * @see getComp
 */
function getCompEditavel( comp ) {
    comp = jQueryObj(comp);
    var tipo  = comp.attr("componente-tipo");
    var chave = configuracao.componentes[tipo].chave;
    var fonte = js( chave + "_get_editavel" );
    if( fonte !== undefined ){
        return jsExec(fonte, comp);    
    }else{
        fonte = configuracao.componentes[tipo]["valor-auto"];
        fonte = fonte === undefined || fonte === "" ? comp : comp.find(fonte);
        return fonte.attr("readonly") === undefined;
    }
}

//--------------------------------------------------------------------------

/**
 * Determina se um componente visual Ipê-roxo deve ou não permitir
 * a alteração de valor através da interface gráfica.
 * @param comp Componente a ser manipulado (jQuery ou elemento HTML).
 * @param editavel O componente deve ficar em estado editável?
 * @see getComp
 */
function setCompEditavel( comp, editavel ) {
    comp = jQueryObj(comp);
    var tipo  = comp.attr("componente-tipo");
    var chave = configuracao.componentes[tipo].chave;
    var fonte = js( chave + "_set_editavel" );
    if( fonte !== undefined ){
        jsExec(fonte, comp, editavel);
    }else{
        fonte = configuracao.componentes[tipo]["valor-auto"];
        fonte = fonte === undefined || fonte === "" ? comp : comp.find(fonte);
        if( editavel !== false ) fonte.removeAttr("readonly");
        else fonte.attr("readonly", "readonly");
    }
}

//--------------------------------------------------------------------------

/**
 * Verifica se um componente visual Ipê-roxo está habilitado para uso.
 * @param comp Componente a ser manipulado (jQuery ou elemento HTML).
 * @returns true, se componente habilitado.
 * @see getComp
 */
function getCompHabilitado( comp ) {
    comp = jQueryObj(comp);
    var tipo  = comp.attr("componente-tipo");
    var chave = configuracao.componentes[tipo].chave;
    var fonte = js( chave + "_get_habilitado" );
    if( fonte !== undefined ){
        return jsExec(fonte, comp);
    }else{
        fonte = configuracao.componentes[tipo]["valor-auto"];
        fonte = fonte === undefined || fonte === "" ? comp : comp.find(fonte);
        return fonte.attr("disabled") === undefined;
    }
}

//--------------------------------------------------------------------------

/**
 * Habilita ou desabilita o uso de um componente visual Ipê-roxo.
 * @param comp Componente a ser manipulado (jQuery ou elemento HTML).
 * @param habilitado O componente deve ficar habilitado?
 * @see getComp
 */
function setCompHabilitado( comp, habilitado ) {
    comp = jQueryObj(comp);
    var tipo  = comp.attr("componente-tipo");
    var chave = configuracao.componentes[tipo].chave;
    var fonte = js( chave + "_set_habilitado" );
    if( fonte !== undefined ){
        jsExec(fonte, comp, habilitado);
    }else{
        fonte = configuracao.componentes[tipo]["valor-auto"];
        fonte = fonte === undefined || fonte === "" ? comp : comp.find(fonte);
        if( habilitado !== false ) fonte.removeAttr("disabled");
        else fonte.attr("disabled", "disabled");
    }
}

//--------------------------------------------------------------------------

/**
 * Verifica se um componente visual Ipê-roxo está visível na interface gráfica.
 * @param comp Componente a ser manipulado (jQuery ou elemento HTML).
 * @returns true, se componente em estado visível.
 * @see getComp
 */
function getCompVisivel( comp ) {
    return ! jQueryObj(comp).hasClass("d-none");
}

//--------------------------------------------------------------------------

/**
 * Determina se um componente visual Ipê-roxo deve ou não estar visível na interface gráfica.
 * Independente da visibilidade, o componente continuará existindo e mantendo a sua função.
 * @param comp Componente a ser manipulado (jQuery ou elemento HTML).
 * @param visivel O componente deve estar visível?
 * @see getComp
 */
function setCompVisivel( comp, visivel ) {
    comp = jQueryObj(comp);
    if( visivel !== false ) comp.removeClass("d-none");
    else comp.addClass("d-none");
}

//--------------------------------------------------------------------------

/**
 * Obtém o valor de uma propriedade de um componente visual Ipê-roxo.
 * A propriedade pode ter sido definida, inicialmente, através de atributo de tag HTML do componente.
 * @param comp Componente a ser manipulado (jQuery ou elemento HTML).
 * @param nome Nome da propriedade.
 * @returns undefined, se propriedade indefinida.
 * @see getComp
 */
function getCompProp( comp, nome ) {
    comp = jQueryObj(comp);
    var tipo  = comp.attr("componente-tipo");
    var chave = configuracao.componentes[tipo].chave;
    return jsExec( chave + "_get_" + normalizarID(nome), comp );
}

//--------------------------------------------------------------------------

/**
 * Define o valor de uma propriedade de um componente visual Ipê-roxo.
 * A propriedade pode ter sido definida, inicialmente, através de atributo de tag HTML do componente.
 * @param comp Componente a ser manipulado (jQuery ou elemento HTML).
 * @param nome Nome da propriedade.
 * @param valor Novo valor da propriedade.
 * @see getComp
 */
function setCompProp( comp, nome, valor ) {
    comp = jQueryObj(comp);
    var tipo  = comp.attr("componente-tipo");
    var chave = configuracao.componentes[tipo].chave;
    return jsExec( chave + "_set_" + normalizarID(nome), comp, valor );
}

//--------------------------------------------------------------------------

/**
 * Retorna o componente que contém a parte passada por parâmetro.
 * @param parte Elemento HTML ou objeto jQuery contido no componente desejado, podendo ser a raiz do próprio.
 * @param superior Desconsiderar o próprio componente e buscar o superior hierarquicamente?
 * @returns Objeto jQuery do componente encontrado, ou jQuery vazio.
 */
function esteComp( parte, superior ) {
    var jobj = jQueryObj(parte);
    if( superior ){
        return jobj.hasClass("componente") ?
               jobj.parents(".componente:first") :
               jobj.parents(".componente:first").parents(".componente:first");
    }else{
        return jobj.hasClass("componente") ?
               jobj :
               jobj.parents(".componente:first");
    }
}

//--------------------------------------------------------------------------

/**
 * Retorna a tela que contém a parte passada por parâmetro.
 * @param parte Elemento HTML ou objeto jQuery contido na tela desejada, podendo ser a raiz da própria.
 * @returns Objeto jQuery da tela.
 */
function estaTela( parte ) {
    var jobj = jQueryObj(parte);
    return jobj.hasClass("tela") ? jobj : jobj.parents(".tela:first");
}

//--------------------------------------------------------------------------

/**
 * Retorna o objeto de informações da tela que contém a parte passada por parâmetro.
 * @param parte Elemento HTML ou objeto jQuery contido na tela desejada.
 * @returns Objeto de informações da tela.
 * @see telas
 */
function estaTelaObj( parte ) {
    return telas[jQueryObj(parte).parents(".tela:first").attr("id")];
}

//--------------------------------------------------------------------------

/**
 * <p>Armazena um objeto JSON (persistência).</p>
 * <p>Repositório preferencial: {@link cordovaSalvar}</p>
 * <p>Repositório alternativo: {@link window#localStorage}</p>
 * @param {string} nome Identificação do objeto no repositório de armazenamento.
 * @param {object} objeto Objeto a ser armazenado.
 * @see abrir
 * @see listar
 * @see apagar
 * @see cordovaSalvar
 */
function salvar( nome, objeto, funcExito, funcErro ) {
    if( isCordovaNativa() ){
        cordovaSalvar( nome, objeto, funcExito, funcErro );
    }else{
        try{
            window.localStorage.setItem( nome, JSON.stringify( objeto ) );
            jsExec(funcExito);
        }catch( e ){
            jsExec(funcErro, e);
        }
    }
}

//--------------------------------------------------------------------------

/**
 * Recupera um objeto JSON previamente armazenado com {@link salvar}.
 * @param {string} nome Identificação do objeto no repositório de armazenamento.
 * @see salvar
 * @see cordovaAbrir
 */
function abrir( nome, funcExito, funcErro ) {
    if( isCordovaNativa() ){
        cordovaAbrir( nome, funcExito, funcErro );
    }else{
        try{
            var item = window.localStorage.getItem( nome );
            if( item === null ) jsExec( funcErro, null );
            else jsExec( funcExito, JSON.parse( item ) );
        }catch( e ){
            jsExec( funcErro, e );
        }
    }
}

//--------------------------------------------------------------------------

/**
 * Lista os nomes de todos os objetos armazenados com {@link salvar}.
 * @param funcExito Função que receberá a lista de nomes.
 * @see salvar
 */
function listar( funcExito, funcErro ) {
    if( isCordovaNativa() ){
        cordovaListar( funcExito, funcErro );
    }else{
        try{
            jsExec( funcExito, Object.keys(window.localStorage) );
        }catch( e ){
            jsExec( funcErro, e );
        }
    }
}

//--------------------------------------------------------------------------

/**
 * Apaga um objeto previamente armazenado com {@link salvar}.
 * @param {string} nome Identificação do objeto no repositório de armazenamento.
 * @see salvar
 * @see cordovaApagar
 */
function apagar( nome, funcExito, funcErro ) {
    if( isCordovaNativa() ){
        cordovaApagar( nome, funcExito, funcErro );
    }else{
        try{
            window.localStorage.removeItem( nome );
            jsExec( funcExito, nome );
        }catch( e ){
            jsExec( funcErro, e );
        }
    }
}

//--------------------------------------------------------------------------

/**
 * Armazena um objeto JSON num arquivo de texto, através da API do Apache Cordova.
 * @param {string} nome Identificação do objeto no repositório de armazenamento.
 * @param {object} objeto Objeto a ser armazenado.
 * @see configuracao.cordova_repositorio
 * @see cordovaAbrir
 * @see cordovaListar
 * @see cordovaApagar
 * @see salvar
 */
function cordovaSalvar( nome, objeto, funcExito, funcErro ) {

    funcErro = js(funcErro);

    window.resolveLocalFileSystemURL( configuracao.cordova_repositorio, function(diretorio) {
        diretorio.getFile( nome, { create: true }, function(arquivo) {
            arquivo.createWriter( function(saida) {

                saida.onwriteend = function(e) {
                    jsExec(funcExito, arquivo);
                };

                saida.onerror = funcErro;

                saida.write(new Blob(
                    [ JSON.stringify( objeto, null, '\t' ) ],
                    { type: 'text/plain' }
                ));

            }, funcErro );
        }, funcErro );
    }, funcErro );

}

//--------------------------------------------------------------------------

/**
 * Recupera um objeto JSON previamente armazenado com {@link cordovaSalvar}.
 * @param {string} nome Identificação do objeto no repositório de armazenamento.
 * @see configuracao.cordova_repositorio
 * @see cordovaSalvar
 * @see abrir
 */
function cordovaAbrir( nome, funcExito, funcErro ) {

    funcErro = js(funcErro);

    var endereco = configuracao.cordova_repositorio + nome;

    window.resolveLocalFileSystemURL( endereco, function(arquivo) {
        arquivo.file( function(conteudo) {

            var entrada = new FileReader();

            entrada.onloadend = function(e) {
                jsExec( funcExito, JSON.parse(this.result), arquivo );
            };

            entrada.onerror = funcErro;

            entrada.readAsText( conteudo );

        }, funcErro );
    }, funcErro );

}

//--------------------------------------------------------------------------

/**
 * Lista os nomes de todos os objetos armazenados com {@link cordovaSalvar}.
 * @param funcExito Função que receberá a lista de nomes.
 * @see configuracao.cordova_repositorio
 * @see cordovaSalvar
 */
function cordovaListar( funcExito, funcErro ) {

    funcErro = js(funcErro);

    window.resolveLocalFileSystemURL( configuracao.cordova_repositorio, function(diretorio) {
        diretorio.createReader().readEntries( function(entradas) {
            jsExec(
                funcExito,
                entradas.filter(function(entrada){
                    return entrada.isFile;
                }).map(function(v, k){
                    return v.name;
                })
            );
        }, funcErro );
    }, funcErro );
    
}

//--------------------------------------------------------------------------

/**
 * Apaga um objeto previamente armazenado com {@link cordovaSalvar}.
 * @param {string} nome Identificação do objeto no repositório de armazenamento.
 * @see configuracao.cordova_repositorio
 * @see cordovaSalvar
 * @see apagar
 */
function cordovaApagar( nome, funcExito, funcErro ) {

    funcErro = js(funcErro);

    var endereco = configuracao.cordova_repositorio + nome;

    window.resolveLocalFileSystemURL( endereco, function(arquivo) {
        arquivo.remove( function() {
            jsExec( funcExito, nome );
        }, funcErro );
    }, funcErro );

}

//--------------------------------------------------------------------------

/**
 * Reinicia adequadamente a aplicação Ipê-roxo.
 * @see location.reload
 */
function reiniciarAplicacao() {
    
    function recarregar() {
        window.location = url_inicial;
    }

    encerrarAplicacao(recarregar, recarregar);

}

//--------------------------------------------------------------------------

/**
 * Encerra adequadamente a aplicação Ipê-roxo.
 * @param funcSaida Função que efetivamente fecha a aplicação. Opcional, sendo navigator["app"].exitApp() a padrão.
 * @param funcErro Função para tratar o erro ocorrido ao executar configuracao.funcao_final. Opcional, podendo ser a mesma funcSaida.
 */
function encerrarAplicacao( funcSaida, funcErro ) {
    
    encerrandoAplicacao = true;
    
    fecharTelas();

    function funcSaidaPadrao() {
        if( isCordovaNativa() ){
            try{
                navigator["app"].exitApp();
            }catch( e ){
                reiniciarAplicacao();
            }
        }else{
            reiniciarAplicacao();
        }
    }

    jsExec(
        configuracao.funcao_final,
        funcSaida ? funcSaida : funcSaidaPadrao,
        funcErro  ? funcErro  : funcSaidaPadrao
    );
    
}

//--------------------------------------------------------------------------

pronto(function(){

    //-----------------------------------
    // URL inicial da aplicação
    url_inicial = window.location;
    copiarQueryParaJSON( url_inicial.search, url_args );

    //-----------------------------------
    // Comando de voltar
    document.addEventListener("backbutton", function(){
        var funcVoltar = js(configuracao.funcao_voltar);
        if( typeof(funcVoltar) === "function" ) jsExec(funcVoltar);
        else fecharTelaAtiva();
    }, false);

    //-----------------------------------
    // Informação situacional
    informacao_situacional = $("#informacao-situacional");
    informacao_situacional.click(ocultarInformacaoSituacional);

    setInterval(function(){
        if( informacao_situacional.fixa || ! informacao_situacional.tempo ) return;
        var tempo_decorrido = Instant.now()._seconds - informacao_situacional.tempo._seconds;
        if( tempo_decorrido >= 10 || informacao_situacional_texto.length === 0 ){
            ocultarInformacaoSituacional();
        }
    }, 1000);

    //-----------------------------------
    // Animação de espera
    animacao_espera = document.getElementById("animacao-espera");

    //-----------------------------------
    // Mensagem ampla
    mensagem_ampla        = $("#mensagem-ampla")[0];
    mensagem_ampla_texto  = $("#mensagem-ampla div")[0];

    mensagem_ampla.onclick = function(){
        fecharMensagemAmpla();
    }

    //-----------------------------------
    if( configuracao.cordova_repositorio == null && isCordovaNativa() ){
        configuracao.cordova_repositorio =
            device.platform === "iOS" ?
            cordova.file.syncedDataDirectory :
            cordova.file.dataDirectory;
    }
    
    //-----------------------------------
    // Registro da rolagem da tela ativa
    var rolagem = function( evento ){
        var telaAtiva = getTelaAtiva();
        if( telaAtiva !== undefined ){
            var telaObj = telas[telaAtiva.attr("id")];
            if( telaObj !== undefined ){
                telaObj.rolagem_horizontal = html_documento.scrollLeft();
                telaObj.rolagem_vertical   = html_documento.scrollTop();
            }
        }
    };
    html_documento.scroll(rolagem);
    html_documento.resize(rolagem);

    //-----------------------------------
    // Controle de foco
    setInterval(function(){
        
        var elemento  = document.activeElement;
        if( elemento === undefined ) return;
        
        var atualizar = true;

        if( elemento !== tmp_elemento_ativo ){
            
            tmp_elemento_ativo = elemento;
            tmp_elemento_ativo_ciclo = 1;

            var rotulo = elementoRotulo(elemento);
            if(
                rotulo === "body"    ||
                rotulo === "a"       ||
                rotulo === "button"  ||
                ! elemento.classList.contains("focavel")
            ){
                atualizar = false;
            }

        }else{

            tmp_elemento_ativo_ciclo++;

            if( tmp_elemento_ativo_ciclo >= 6 ){
                tmp_elemento_ativo_ciclo = 1;
            }else{
                atualizar = false;
            }

        }

        if( atualizar ){
            var telaObj = telas[getTelaAtivaId()];
            if( telaObj === undefined ) return;
            telaObj.elementoAtivo = elemento;
        }

    }, 1000);

    //-----------------------------------
    // Inicialização dos componentes visuais e da aplicação
    var repositorios = configuracao.componentes_arquivos.slice(0);
    
    function _carregar_componentes() {

        var repositorio = $(this);

        repositorio.find(".componente").each(function(){

            var comp = $(this).clone();

            var tipo = comp.attr("componente-tipo").toLowerCase();
            if( tipo === undefined || tipo === "" ){
                console.error( "componente-tipo ausente: %o", comp );
                return true;
            }

            comp.find(".componente").each(function(){
                var subcomp = $(this);
                var subtipo = subcomp.attr("componente-tipo");
                if( subtipo !== undefined && subtipo !== "" ){
                    subcomp.replaceWith( "<ipe-componente tipo=\"" + subtipo + "\" />" );
                }
            });

            var chave = comp.attr("componente-chave");
            var vauto = comp.attr("componente-valor-auto");

            comp.removeAttr("componente-chave");
            comp.removeAttr("componente-valor-auto");

            var conf = {
                "tipo"       : tipo,
                "chave"      : chave,
                "valor-auto" : vauto,
                "html"       : comp.wrap("<div></div>").parent().html()
            };

            configuracao.componentes[tipo] = conf;

            try{
                jsExec(chave + "_inicializar", conf);
            }catch(e){
                console.error(e);
            }
            
        });

        repositorio.remove();
        
        if( ! _carregar_repositorio() ) jsExec( configuracao.funcao_inicial );

    }

    function _carregar_repositorio() {
        var endereco = repositorios.shift();
        if( endereco !== undefined ){
            $("<div id=\"componentes\" class=\"d-none\"></div>").load(endereco + " .tela", _carregar_componentes);
            return true;
        }else{
            return false;
        }
    }

    _carregar_repositorio();

});

//--------------------------------------------------------------------------