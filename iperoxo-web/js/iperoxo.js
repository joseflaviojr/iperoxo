//--------------------------------------------------------------------------

/*

  Copyright (C) 2016-2018 José Flávio de Souza Dias Júnior
  
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

  Direitos Autorais Reservados (C) 2016-2018 José Flávio de Souza Dias Júnior
  
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

/**
 * Argumentos da URL.
 */
var url_args = {};

/**
 * ID da sessão corrente.
 * @see setSID
 */
var sid = "";

/**
 * Linguagem atualmente em uso, no formato IETF BCP 47.
 * @see setLinguagem
 */
var lid = "en-US";

/**
 * Dicionário corrente, conforme {@link lid}.
 * @see lid
 */
var dicionario = dicionario_en_US;

/**
 * Total de atividades em execução.
 * @see incrementarEspera
 * @see decrementarEspera
 */
var animacao_espera_total = 0;

/**
 * Objetos com informações sobre as telas abertas.
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
 * {@link MessageFormat} de acordo com a {@link lid}.
 * @see MessageFormat
 */
var formatador;

/**
 * Elemento do qual a dica está sendo mostrada.
 */
var dica_mostrando = null;

var mensagem_ampla;
var mensagem_ampla_fechar;
var mensagem_ampla_texto;

/**
 * Mapa que correlaciona caracteres especiais a entidades HTML.
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

//--------------------------------------------------------------------------

/**
 * Atividade a ser executada quando o dispositivo estiver pronto.
 * @param atividade Função a executar quando "deviceready".
 */
function inicio( atividade ) {
    if( typeof(cordova) !== "undefined" ){
        document.addEventListener("deviceready", atividade, false);
    }else{
        $(atividade);
    }
}

//--------------------------------------------------------------------------

/**
 * Gera um identificador de objeto.
 * @param aleatorio Sufixo numérico aleatório?
 * @param supressao ID's que não devem ser retornados.
 */
function gerarID( aleatorio, supressao ) {
    
    function _gerar() {
        return "id_" + ( aleatorio ? Math.floor( Math.random() * 999999999 ) : ++id_geracao_sequencia );
    }

    if( supressao != undefined && supressao.length > 0 ){
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
 * Resolve uma rotina de JavaScript com {@link eval}.
 * @param rotina Rotina a resolver.
 * @returns a própria rotina se ela não for "string"; "undefined" se falhar.
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
 * Executa uma função JavaScript.<br>
 * Os argumentos anônimos serão repassados para a {@linkcode funcao}.
 * @param funcao Função ou nome de função.
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
 * Especifica o valor de um "cookie".
 * @param chave Chave que identifica o cookie.
 * @param valor Valor do cookie.
 * @param minutos Tempo máximo de existência.
 */
function setCookie( chave, valor, minutos ) {
    if( minutos === undefined ){
      document.cookie = chave + "=" + encodeURI(valor) + ";path=/";
    }else{
      var expiracao = new Date();
      expiracao.setTime( expiracao.getTime() + (minutos*60*1000) );
      document.cookie = chave + "=" + encodeURI(valor) + ";expires=" + expiracao.toUTCString() + ";path=/";
    }
}

//--------------------------------------------------------------------------

/**
 * Retorna o valor de um "cookie".
 * @param chave Chave que identifica o cookie.
 * @param fonte Origem do cookie. undefined == document.cookie
 * @see setCookie
 */
function getCookie( chave, fonte ) {
    if( fonte === undefined ) fonte = document.cookie;
    var inicio = chave + "=";
    var partes = fonte.split(';');
    for( var i = 0; i < partes.length; i++ ){
        var p = partes[i].replace(/^\s+/,"");
        if( p.indexOf(inicio) === 0 ){
            return decodeURI(p.substring(inicio.length, p.length));
        }
    }
    return "";
}

//--------------------------------------------------------------------------

/**
 * Cria um elemento HTML, na forma de objeto jQuery, para ser inserido numa página.
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
 * Obtém o rótulo de um elemento HTML. Exemplos: "div", "span", "img".
 * @param elemento Elemento HTML ou objeto jQuery correspondente.
 */
function elementoRotulo( elemento ) {
    var nome = elemento instanceof jQuery ? elemento.prop("tagName") : elemento.tagName;
    return nome.toLowerCase();
}

//--------------------------------------------------------------------------

/**
 * Verifica qual é o mecanismo de definição de valor (conteúdo principal) de um elemento.
 * Elementos tais como "input" e "param" são definidos através do atributo "value".
 * A maioria é definida através de "html" (corpo do elemento).
 * @param elemento Elemento HTML ou objeto jQuery correspondente.
 */
function getDefValor( elemento ) {
    var re = elementoRotulo(elemento);
    if( re === "input" || re === "param" ) return "value";
    if( re === "select" || re === "option" ) return "value";
    return "html";
}

//--------------------------------------------------------------------------

/**
 * Verifica qual é o mecanismo de definição de apresentação (aquilo que o usuário vê) de um elemento.
 * Elementos como o "input" são definidos através do atributo "value".
 * A maioria é definida através de "html" (corpo do elemento).
 * @param elemento Elemento HTML ou objeto jQuery correspondente.
 */
function getDefApresentacao( elemento ) {
    var re = elementoRotulo(elemento);
    if( re === "input" ) return "value";
    return "html";
}

//--------------------------------------------------------------------------

/**
 * Substitui caracteres especiais por entidades HTML.<br>
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
 * Substitui as chaves indicadas pelos seus respectivos valores do dicionário.
 * @param {*} chaves Uma chave ou um vetor de chaves.
 * @param {string} prefixo Prefixo das chaves a considerar no dicionário.
 * @param {string} sufixo Sufixo das chaves a considerar no dicionário.
 * @returns valores substituídos.
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
 * Remove uma classe de um elemento HTML, removendo o atributo "class" se este ficar vazio.
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
 * Garante o tratamento de um elemento HTML como um objeto jQuery.
 * @param o Elemento HTML ou objeto jQuery correspondente.
 * @returns Objeto jQuery. Se o argumento for um jQuery, ele mesmo será retornado.
 */
function jQueryObj( o ) {
    return o instanceof jQuery ? o : $(o);
}

//--------------------------------------------------------------------------

/**
 * Codifica uma string para o formato base64url, conforme a RFC 4648, Table 2.
 */
function codificarBase64url( str ) {
    return window.btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

//--------------------------------------------------------------------------

/**
 * Decodifica uma string que está no formato base64url, conforme a RFC 4648, Table 2.
 */
function decodificarBase64url( base64url ) {
    return window.atob( base64url.replace(/\-/g, "+").replace(/_/g, "/") );
}

//--------------------------------------------------------------------------

/**
 * Obtém todos os atributos de um elemento HTML, e seus respectivos valores.
 * @param elemento Elemento HTML ou objeto jQuery correspondente.
 */
function obterAtributos( elemento ) {
    var lista = elemento instanceof jQuery ? elemento[0].attributes : elemento.attributes;
    var atrib = {};
    $.each( lista, function(i, o){
        atrib[o.name] = o.value;
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
    document.getElementById("animacao-espera").style.display = "block";
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
        document.getElementById("animacao-espera").style.display = "none";
    }
}

//--------------------------------------------------------------------------

/**
 * @deprecated
 * @see atualizarAmbiente
 */
function atualizarComponentesCulturais() {//TODO Remover por desuso
    console.warn("Método atualizarComponentesCulturais em desuso. Usar atualizarAmbiente.");
    atualizarAmbiente();
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
 * @param {string} nova_sid Novo valor da {@link sid}.
 * @param {number} minutos Tempo de vida do cookie correspondente ({@link setCookie}).
 */
function setSID( nova_sid, minutos ) {
    sid = nova_sid;
    if( minutos === undefined ) minutos = 365 * 24 * 60;
    if( configuracao.recurso_geral ) setCookie( "sid", nova_sid, minutos );
    atualizarAmbiente();
}

//--------------------------------------------------------------------------

/**
 * Altera a linguagem atual - variável {@link lid}. Padrão: "en-US".
 * No final, será chamada a função {@link linguagemAlterada}, se existente, que deveria chamar {@link atualizarAmbiente}.
 * Evento a disparar no final: "iperoxo.lid" (document).
 * @param {string} nome Código da linguagem desejada, preferencialmente no formato IETF BCP 47.
 */
function setLinguagem( nome ) {
    
    lid = nome.split("_").join("-");
    setCookie( "lid", lid, 365 * 24 * 60 );

    var nomeDic = nome.split("-").join("_");
    dicionario = js( "dicionario_" + nomeDic );
    if( dicionario === undefined ) dicionario = js( "dicionario_" + nomeDic.split("_")[0] );
    if( dicionario === undefined ) dicionario = dicionario_en_US;

    formatador = new MessageFormat(lid).setIntlSupport(true);
    formatador.currency = "BRL";

    moment.locale(lid);

    if( typeof(linguagemAlterada) !== "undefined" ) linguagemAlterada();
    else atualizarAmbiente();

    $(document).triggerHandler("iperoxo.lid");
    
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
 * Acrescenta uma mensagem estilizada numa região do HTML, no formato Bootstrap (alerts).<br>
 * A mensagem será inserida no primeiro descendente que contém a classe "mensagens".<br>
 * Se região == null, será utilizado o elemento global que possui id = "mensagens".
 * @param {string} classe Classe CSS da biblioteca Bootstrap. Ex.: "alert-success"
 * @param {string} texto Texto da mensagem, o qual será normalizado com {@link textoHTML}.
 * @param {string} regiao Objeto jQuery.
 */
function mensagemClassificada( classe, texto, regiao ) {
    var destino = regiao == null ? $("#mensagens") : regiao.find(".mensagens:first");
    destino.append(
        "<div class=\"alert " + classe + "\">" +
        "<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"fechar\">&times;</a>" +
        textoHTML(texto) +
        "</div>"
    );
    destino[0].scrollIntoView(true);
}

//--------------------------------------------------------------------------

/**
 * {@link mensagemClassificada} como "alert-success".
 * @see mensagemClassificada
 */
function mensagemExito( texto, regiao ) {
    mensagemClassificada( "alert-success", texto, regiao );
}

/**
 * {@link mensagemClassificada} como "alert-info".
 * @see mensagemClassificada
 */
function mensagemInformacao( texto, regiao ) {
    mensagemClassificada( "alert-info", texto, regiao );
}

/**
 * {@link mensagemClassificada} como "alert-warning".
 * @see mensagemClassificada
 */
function mensagemAtencao( texto, regiao ) {
    mensagemClassificada( "alert-warning", texto, regiao );
}

/**
 * {@link mensagemClassificada} como "alert-danger".
 * @see mensagemClassificada
 */
function mensagemErro( texto, regiao ) {
    mensagemClassificada( "alert-danger", texto, regiao );
}

//--------------------------------------------------------------------------

/**
 * Remove as mensagens ativas e mostra o conjunto novo de mensagens provenientes de Copaíba.
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
 * Remove as mensagens ativas e mostra a mensagem de erro proveniente de Uxi-amarelo.
 * @see mensagemErro
 * @see http://joseflavio.com/uxiamarelo
 */
function mensagemErroUxiamarelo( jqXHR, status, errorThrown, regiao ) {
    limparMensagens( regiao );
    if( jqXHR.responseJSON !== undefined ){
        mensagemErro( jqXHR.responseJSON.mensagem, regiao );
    }else{
        mensagemErro( jqXHR.status + " - " + jqXHR.statusText, regiao );
    }
}

//--------------------------------------------------------------------------

/**
 * Mostra {@link abrirMensagemAmpla amplamente} o conteúdo bruto de um objeto, conforme {@link JSON#stringify}.
 * @see abrirMensagemAmpla
 * @see JSON#stringify
 */
function mensagemAmplaBruta( obj ) {
    abrirMensagemAmpla( JSON.stringify(obj) );
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

    if( configuracao.recurso_componente ){
        implantarComponentes();
    }

    if( configuracao.recurso_dica ){
        implantarDicas();
    }

    if( configuracao.recurso_linguagem ){
        carregarTextoDinamico();
    }

    if( configuracao.recurso_tela ){

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
            tela.find(".tid:first").val(tid);
            tela.find(".lid:first").val(lid);

        });

    }

    if( configuracao.recurso_componente ){
        $(".componente").each(function(){
            atualizarComponente(this);
        });
    }

    //TODO Remover por desuso
    if( js("telasAtualizadas") !== undefined ){
        console.warn("telasAtualizadas em desuso. Usar evento 'iperoxo.ambiente'.");
        jsExec("telasAtualizadas");
    }

    $(document).triggerHandler("iperoxo.ambiente");

}

//--------------------------------------------------------------------------

/**
 * @deprecated
 * @see atualizarAmbiente
 */
function atualizarTelas() {//TODO Remover por desuso
    console.warn("Método atualizarTelas em desuso. Usar atualizarAmbiente.");
    atualizarAmbiente();
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
    var divHTML = "<div id=\"" + divID + "\" class=\"hidden\"></div>";
    var telaAtiva = $(".tela").not(".hidden");

    if( telaAtiva.length === 1 ) telaAtiva.parent().after(divHTML);
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

            tela.addClass("hidden");
            removerClasse(div, "hidden");
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

    $( ".tela" ).addClass("hidden");

    telaObj.passo = ++navegacao_passo;

    var posPreAtivacao = function() {

        tela.removeClass("hidden");
        
        atualizarAmbiente();
    
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

    return ! tela.hasClass("hidden");

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

        var oculta = tela.hasClass("hidden");
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
    fecharTela( $(".tela").not(".hidden") );
}

//--------------------------------------------------------------------------

/**
 * Ação disparada por elemento de tela.<br>
 * A função a ser chamada deverá ter minimamente a assinatura da função {@link exemploEventoTela}.<br>
 * Argumentos extras serão repassados para a {@linkcode funcao}, após a passagem dos argumentos padrões.
 * @param elemento Elemento HTML acionado, ou objeto jQuery correspondente.
 * @param funcao Função ou nome da função a ser executada.
 * @see exemploEventoTela
 */
function acaoTela( elemento, funcao ) {
    
    var tela    = estaTela(elemento);
    var tid     = tela.attr("id");
    var telaObj = telas[tid];

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
 */
function exemploEventoTela( tela, args, tid, telaObj, funcExito, funcErro ) {
    abrirMensagemAmpla(JSON.stringify(telaObj));
}

//--------------------------------------------------------------------------

/**
 * Implanta todas as dicas indicadas através da classe "dica" e do atributo "dica".
 * Este método é chamado automaticamente por {@link atualizarAmbiente}.
 */
function implantarDicas() {
    $(".dica").each(function(){
        var elemento = $(this);
        var dica = elemento.attr("dica");
        var modelo = '<div class="tooltip" role="tooltip"><div class="tooltip-inner textod" chave="{dica}"></div></div>';
        elemento.tooltip({
            "title"    : function(){ return dicionario[dica]; },
            "html"     : true,
            "placement": "auto top",
            "container": "body",
            "trigger"  : "manual",
            "template" : formatador.compile(modelo)({ "dica": dica })
        });
        elemento.removeClass("dica");
        elemento.addClass("dica-implantada");
        elemento.on( "click focusin focusout", function( evento ){
            if( ! configuracao.recurso_dica ) return;
            var dica_atual = evento.target;
            if( dica_atual === dica_mostrando ){
                if( evento.type === "focusout" ){
                    elemento.tooltip("hide");
                    dica_mostrando = null;
                }else{
                    var visivel = elemento.attr("aria-describedby") !== undefined;
                    if( ! visivel ) elemento.tooltip("show");
                }
            }else{
                if( dica_mostrando !== null ) $(dica_mostrando).tooltip("hide");
                elemento.tooltip("show");
                dica_mostrando = dica_atual;
            }
        });
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
 * @see {@link iperoxo.html}
 */
function implantarComponentes() {

    var tipos = Object.keys(configuracao.componentes).join(',');
    var pos_implantacao_total = [];

    while( true ){
        
        var comp = $(tipos).first();
        if( comp.length === 0 ) break;

        var atributos = obterAtributos(comp);
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
 * @see {@link iperoxo.html}
 * @see configuracao.componentes
 * @see elementoHTML
 */
function inserirComponente( destino, tipo, atributos, conteudo, posicao, renderizar ) {

    var raiz = jQueryObj(destino);
    var comp = elementoHTML(tipo, atributos, conteudo);

    if( posicao === "preferencia" || posicao === undefined ){
        
        var local = $("ipe-componente[tipo='" + tipo + "']:first", raiz);

        if( local.length > 0 ){
            var endereco = local.attr("destino");
            if( endereco !== undefined && endereco !== "" ){
                raiz = local.parent(".componente:first");
                if( raiz.length === 0 ) raiz = $("html");
                raiz.find(endereco).append(comp);
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
    if( fonte === undefined ) return true;
    return jsExec(fonte, comp);
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
    jsExec( chave + "_set_editavel", comp, editavel !== false );
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
    return ! jQueryObj(comp).hasClass("hidden");
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
    if( visivel !== false ) comp.removeClass("hidden");
    else comp.addClass("hidden");
}

//--------------------------------------------------------------------------

/**
 * Ação executada antes da implantação de um componente "ipe-data".
 */
function comp_ipe_data_pre_implantacao( comp, atributos ) {
    
    var obj = comp.find(".datetimepicker");
    
    var opcoes = jsExec( obj.attr("opcoes") );
    if( opcoes === undefined ) opcoes = {};

    var formato = obj.attr("formato");
    opcoes["format"] = formato !== undefined ? formato : "L LT";

    if( opcoes["locale"]           === undefined ) opcoes["locale"]           = lid;
    if( opcoes["showTodayButton"]  === undefined ) opcoes["showTodayButton"]  = true;
    if( opcoes["showClear"]        === undefined ) opcoes["showClear"]        = true;
    if( opcoes["allowInputToggle"] === undefined ) opcoes["allowInputToggle"] = false;

    var inputTimestamp = obj.parent().find("input[type='hidden']");
    var inputTimestampFunc = function() {
        var data = obj.data("DateTimePicker").date();
        inputTimestamp.val( data != null ? data.valueOf() : "" );
    };
    obj.find("input[type='text']").change(inputTimestampFunc);

    obj.datetimepicker(opcoes).on("dp.change", inputTimestampFunc);

    $(document).on( "iperoxo.lid", function(){
        obj.data("DateTimePicker").locale(lid);
    });

}

//--------------------------------------------------------------------------

/**
 * Obtém o valor de data/hora definido através de um componente do tipo "ipe-data".
 * Aconselha-se não utilizar este método de forma direta.
 * @param comp Objeto jQuery do componente.
 * @returns valor numérico no formato Unix Timestamp (milissegundos desde 01/jan/1970 00:00 UTC).
 * @see getCompValor
 */
function comp_ipe_data_get_valor( comp ) {
    var valor = comp.find(".ipe-data-valor:first").val();
    return valor !== undefined && valor !== "" ? parseInt(valor) : null;
}

//--------------------------------------------------------------------------

/**
 * Define o valor de data/hora de um componente do tipo "ipe-data".
 * Aconselha-se não utilizar este método de forma direta.
 * @param comp Objeto jQuery do componente.
 * @param valor Unix Timestamp, Date ou outro valor conforme https://eonasdan.github.io/bootstrap-datetimepicker/Options/#date
 * @see setCompValor
 */
function comp_ipe_data_set_valor( comp, valor ) {
    if( typeof(valor) === "number" ) valor = new Date(valor);
    return comp.find(".datetimepicker:first").data("DateTimePicker").date(valor);
}

//--------------------------------------------------------------------------

/**
 * Verifica se um componente "ipe-data" está em estado
 * que permita a alteração de valor através da interface gráfica.
 */
function comp_ipe_data_get_editavel( comp ) {
    var elemt = comp.find("input[type='text']:first");
    return elemt.attr("readonly") === undefined;
}

//--------------------------------------------------------------------------

/**
 * Determina se um componente "ipe-data" deve ou não permitir
 * a alteração de valor através da interface gráfica.
 */
function comp_ipe_data_set_editavel( comp, editavel ) {
    var elemt = comp.find("input[type='text']:first");
    if( ! editavel ) elemt.attr("readonly", "readonly");
    else elemt.removeAttr("readonly");
}

//--------------------------------------------------------------------------

/**
 * Obtém os nomes dos arquivos selecionados através de um componente do tipo "ipe-arquivo".
 * Aconselha-se não utilizar este método de forma direta.
 * @param comp Objeto jQuery do componente.
 * @returns array com os nomes dos arquivos selecionados.
 * @see getCompValor
 * @see obterNomesArquivos
 */
function comp_ipe_arquivo_get_valor( comp ) {
    var campo = comp.find("input[type='file']:first");
    return obterNomesArquivos(campo);
}

//--------------------------------------------------------------------------

/**
 * Aciona a tela de seleção de arquivos de um componente do tipo "ipe-arquivo".
 * Aconselha-se não utilizar este método de forma direta.
 * @param comp Objeto jQuery do componente.
 * @param valor null == limpar seleção atual; qualquer outro valor == acionar tela de seleção.
 * @see setCompValor
 */
function comp_ipe_arquivo_set_valor( comp, valor ) {
    if( valor === null ){
        return comp.find("[data-dismiss='fileinput']:first").click();
    }else{
        return comp.find("[data-trigger='fileinput']:first").click();
    }
}

//--------------------------------------------------------------------------

/**
 * Ação executada quando um componente "ipe-arquivo" é alterado.
 */
function comp_ipe_arquivo_onchange( comp ) {
    var nomes = comp.find(".ipe-arquivo-nomes:first");
    var campo = comp.find("input[type='file']:first");
    nomes.val( obterNomesArquivos(campo).join(", ") );
}

//--------------------------------------------------------------------------

/**
 * Obtém os valores marcados através de um componente do tipo "ipe-marcacao-grupo".
 * Aconselha-se não utilizar este método de forma direta.
 * @param comp Objeto jQuery do componente.
 * @returns Array com os valores marcados.
 * @see getCompValor
 */
function comp_ipe_marcacao_grupo_get_valor( comp ) {
    var subcomps = comp.find("input[type='checkbox']:checked");
    var valores = [];
    for( var i = 0; i < subcomps.length; i++ ){
        valores.push( subcomps[i].value );
    }
    return valores;
}

//--------------------------------------------------------------------------

/**
 * Define quais os valores devem estar marcados num componente do tipo "ipe-marcacao-grupo".
 * Aconselha-se não utilizar este método de forma direta.
 * @param comp Objeto jQuery do componente.
 * @param valor Array com os valores que devem ficar marcados.
 * @see setCompValor
 */
function comp_ipe_marcacao_grupo_set_valor( comp, valor ) {
    var subcomps = comp.find("input[type='checkbox']");
    for( var i = 0; i < subcomps.length; i++ ){
        var cb = subcomps[i];
        var novacond = valor.includes(cb.value);
        if( cb.checked !== novacond ){
            cb.checked = novacond;
            $(cb).trigger("change");
        }
    }
}

//--------------------------------------------------------------------------

/**
 * Obtém o estado de marcação de um componente "ipe-marcacao".
 * Aconselha-se não utilizar este método de forma direta.
 * @param comp Objeto jQuery do componente.
 * @returns boolean (true/false).
 * @see getCompValor
 */
function comp_ipe_marcacao_get_valor( comp ) {
    return comp.find("input[type='checkbox']:first")[0].checked;
}

//--------------------------------------------------------------------------

/**
 * Define o estado de marcação de um componente "ipe-marcacao".
 * Aconselha-se não utilizar este método de forma direta.
 * @param comp Objeto jQuery do componente.
 * @param valor Valor direto ou conversível para boolean (true/false).
 * @see setCompValor
 */
function comp_ipe_marcacao_set_valor( comp, valor ) {
    if( typeof(valor) !== "boolean" ) valor = valor == "true";
    var cbj = comp.find("input[type='checkbox']:first");
    var cb  = cbj[0];
    if( cb.checked !== valor ){
        cb.checked = valor;
        cbj.trigger("change");
    }
}

//--------------------------------------------------------------------------

/**
 * Ação executada após a implantação de um componente "ipe-texto".
 */
function comp_ipe_texto_pos_implantacao( comp, atributos ) {
    $.applyDataMask();
}

//--------------------------------------------------------------------------

/**
 * Verifica se um componente "ipe-texto" está em estado
 * que permita a alteração de valor através da interface gráfica.
 */
function comp_ipe_texto_get_editavel( comp ) {
    var elemt = comp.find("input:first");
    return elemt.attr("readonly") === undefined;
}

//--------------------------------------------------------------------------

/**
 * Determina se um componente "ipe-texto" deve ou não permitir
 * a alteração de valor através da interface gráfica.
 */
function comp_ipe_texto_set_editavel( comp, editavel ) {
    var elemt = comp.find("input:first");
    if( ! editavel ) elemt.attr("readonly", "readonly");
    else elemt.removeAttr("readonly");
}

//--------------------------------------------------------------------------

/**
 * Ação executada após a implantação de um componente "ipe-texto-acao".
 */
function comp_ipe_texto_acao_pos_implantacao( comp, atributos ) {
    var controles = comp.parent();
    if( ! controles.hasClass("input-group") ) controles.addClass("input-group");
}

//--------------------------------------------------------------------------

/**
 * Ação executada para um componente "ipe-selecao" após a implantação total.
 */
function comp_ipe_selecao_pos_implantacao_total( comp, atributos ) {
    comp.find(".ipe-selecao-selectpicker").selectpicker();
}

//--------------------------------------------------------------------------

/**
 * Atualiza a composição visual de um componente "ipe-selecao".
 */
function comp_ipe_selecao_atualizar( comp ) {
    comp.find(".ipe-selecao-selectpicker").selectpicker("refresh");
}

//--------------------------------------------------------------------------

/**
 * Atualiza a composição visual de um componente "ipe-navegacao".
 */
function comp_ipe_navegacao_atualizar( comp ) {
    
    var navegacao = comp.find(".ipe-navegacao-abas:first");

    // Removendo abas desnecessárias
    navegacao.children("li").each(function(){
        var tab_li = $(this);
        var tid = tab_li.attr("tid");
        if( telas[tid] === undefined ) tab_li.remove();
    });

    // Atualizando as abas das telas
    $(".tela").each(function(i){

        var tela  = $(this);
        var tid   = tela.attr("id");
        var ativa = ! tela.hasClass("hidden");

        // Título da tela na aba
        var titulo = tela.children(".tela-titulo").text();
        if( titulo.length === 0 ){
            titulo = "Tela " + ( i + 1 );
        }
        if( titulo.length > 20 ){
            titulo = titulo.substring(0, 17) + "...";
        }

        // Aba da tela
        var tab_li = $( "#tab_li_" + tid );
        if( tab_li.length > 0 ){
            tab_li.removeClass();
            tab_li.addClass( ativa ? "active" : "" );
            tab_li.find("a").html(titulo);
        }else{
            inserirComponente(
                navegacao,
                "ipe-navegacao-aba",
                { "tid": tid, "ativa": ( ativa ? "sim" : "nao" ), "titulo": titulo }
            );
        }

    });

}

//--------------------------------------------------------------------------

/**
 * Obtém o valor de um componente do tipo "ipe-tela-titulo".
 * Aconselha-se não utilizar este método de forma direta.
 * @param comp Objeto jQuery do componente.
 * @returns texto bruto ou chave do dicionário.
 * @see getCompValor
 */
function comp_ipe_tela_titulo_get_valor( comp ) {
    return comp.hasClass("textod") ? comp.attr("chave") : comp.text();
}

//--------------------------------------------------------------------------

/**
 * Define o valor de um componente do tipo "ipe-tela-titulo".
 * Aconselha-se não utilizar este método de forma direta.
 * @param comp Objeto jQuery do componente.
 * @param valor Texto bruto ou chave do dicionário.
 * @see setCompValor
 */
function comp_ipe_tela_titulo_set_valor( comp, valor ) {
    if( comp.hasClass("textod") ){
        setTexto(comp, valor);
    }else{
        comp.text(valor);
    }
    atualizarAmbiente();
}

//--------------------------------------------------------------------------

/**
 * Retorna o componente que contém a parte passada por parâmetro.
 * @param parte Elemento HTML ou objeto jQuery contido no componente desejado.
 * @returns Objeto jQuery do componente.
 */
function esteComp( parte ) {
    return jQueryObj(parte).parents(".componente:first");
}

//--------------------------------------------------------------------------

/**
 * Retorna a tela que contém a parte passada por parâmetro.
 * @param parte Elemento HTML ou objeto jQuery contido na tela desejada.
 * @returns Objeto jQuery da tela.
 */
function estaTela( parte ) {
    return jQueryObj(parte).parents(".tela:first");
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

inicio(function(){

    //-----------------------------------
    if( configuracao.recurso_geral ){
        // Definição de "url_args"
        copiarQueryParaJSON( window.location.search, url_args );
    }

    //-----------------------------------
    if( configuracao.recurso_mensagem ){

        mensagem_ampla        = document.getElementById("mensagem-ampla");
        mensagem_ampla_fechar = document.getElementsByClassName("mensagem-ampla-fechar")[0];
        mensagem_ampla_texto  = document.getElementById("mensagem-ampla-texto");
    
        mensagem_ampla_fechar.onclick = function() {
            fecharMensagemAmpla();
        }
    
        window.addEventListener("click", function(e){
            if( e.target == mensagem_ampla ){
                fecharMensagemAmpla();
            }
        });

    }

    //-----------------------------------
    if( configuracao.recurso_persistencia && configuracao.cordova_repositorio == null && isCordovaNativa() ){
        configuracao.cordova_repositorio =
            device.platform === "iOS" ?
            cordova.file.syncedDataDirectory :
            cordova.file.dataDirectory;
    }
    
    //-----------------------------------
    $("body").click(function( evento ){
        if( configuracao.recurso_dica && dica_mostrando !== null ){
            if( evento.target !== dica_mostrando ){
                $(dica_mostrando).tooltip("hide");
                dica_mostrando = null;
            }
        }
    });

    //-----------------------------------
    // Inicialização dos componentes visuais e da aplicação
    if( configuracao.recurso_componente ){
        $("body").append("<div id=\"componentes\" class=\"hidden\"></div>");
        $("#componentes").load(
            "iperoxo.html .tela",
            function(){
                var componentes = $(this);
                componentes.find(".componente").each(function(){
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
                    configuracao.componentes[tipo] = {
                        "tipo"       : tipo,
                        "chave"      : chave,
                        "valor-auto" : vauto,
                        "html"       : comp.wrap("<div></div>").parent().html()
                    };
                });
                componentes.remove();
                jsExec( configuracao.funcao_inicial );
            }
        );
    }else{
        jsExec( configuracao.funcao_inicial );
    }

});

//--------------------------------------------------------------------------