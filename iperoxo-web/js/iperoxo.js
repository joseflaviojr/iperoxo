//--------------------------------------------------------------------------

/*

  Copyright (C) 2016 José Flávio de Souza Dias Júnior
  
  This file is part of Ipê-roxo - <http://www.joseflavio.com/iperoxo/>.
  
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

  Direitos Autorais Reservados (C) 2016 José Flávio de Souza Dias Júnior
  
  Este arquivo é parte de Ipê-roxo - <http://www.joseflavio.com/iperoxo/>.
  
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

var iperoxo_script_geral        = true;
var iperoxo_script_sessao       = true;
var iperoxo_script_linguagem    = true;
var iperoxo_script_mensagem     = true;
var iperoxo_script_uxiamarelo   = true;
var iperoxo_script_tela         = true;
var iperoxo_script_persistencia = true;

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
 * Repositório padrão da API Apache Cordova para armazenamento de arquivos.
 * @see salvar
 * @see cordovaSalvar
 */
var cordova_repositorio_padrao = null;

/**
 * Total de atividades em execução.
 * @see incrementarEspera
 * @see decrementarEspera
 */
var animacao_espera_total = 0;

/**
 * Objetos com informações sobre as telas abertas.
 * @see abrirTela
 * @see atualizarTelas
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
    if( minutos == undefined ){
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
    if( fonte == undefined ) fonte = document.cookie;
    var inicio = chave + "=";
    var partes = fonte.split(';');
    for( var i = 0; i < partes.length; i++ ){
        var p = partes[i].replace(/^\s+/,"");
        if( p.indexOf(inicio) == 0 ){
            return decodeURI(p.substring(inicio.length, p.length));
        }
    }
    return "";
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
    document.getElementById("animacao_espera").style.display = "block";
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
        document.getElementById("animacao_espera").style.display = "none";
    }
}

//--------------------------------------------------------------------------

/**
 * Atualiza todos os componentes sensíveis à {@link lid}.
 */
function atualizarComponentesCulturais() {
    moment.locale(lid);
    if( iperoxo_script_tela ) atualizarTelas();
    else if( iperoxo_script_linguagem ) carregarTextoDinamico();
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
    if( inicio == -1 ) return json;

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
    if( minutos == undefined ) minutos = 365 * 24 * 60;
    if( iperoxo_script_geral ) setCookie( "sid", nova_sid, minutos );
    if( iperoxo_script_tela ) atualizarTelas();
}

//--------------------------------------------------------------------------

/**
 * Altera a linguagem atual - variável {@link lid}. Padrão: "en-US"<br>
 * No final, será chamada a função {@link linguagemAlterada}, que deveria chamar {@link atualizarComponentesCulturais}.
 * @param {string} nome Código da linguagem desejada, preferencialmente no formato IETF BCP 47.
 */
function setLinguagem( nome ) {
    
    lid = nome.split("_").join("-");
    setCookie( "lid", lid, 365 * 24 * 60 );

    var nomeDic = nome.split("-").join("_");
    dicionario = js( "dicionario_" + nomeDic );
    if( dicionario == undefined ) dicionario = js( "dicionario_" + nomeDic.split("_")[0] );
    if( dicionario == undefined ) dicionario = dicionario_en_US;

    formatador = new MessageFormat(lid).setIntlSupport(true);
    formatador.currency = "BRL";

    if( typeof(linguagemAlterada) !== "undefined" ) linguagemAlterada();

}

//--------------------------------------------------------------------------

/**
 * Carrega o conteúdo dos componentes textuais, sensíveis à {@link lid}, que estão desatualizados.
 */
function carregarTextoDinamico() {

    function processar( componente, chaveAttr, origemAttr, destinoFunc, normalizar ) {

        var chave = componente.attr(chaveAttr);
        if( chave == null || chave.length == 0 ) return;

        var origem = componente.attr(origemAttr);
        if( origem == null || origem.length == 0 ) origem = "javascript";

        if( origem == "javascript" ){
            var txt = dicionario[chave];
            if( txt == undefined ) return;
            if( normalizar ) txt = textoHTML(txt);
            destinoFunc(componente, txt);
        }else{
            var json = {
                "sid"  : sid,
                "lid"  : lid,
                "chave": chave
            };
            uxiamarelo( origem, json, function(txt){
                if( normalizar ) txt = textoHTML(txt);
                destinoFunc(componente, txt);
            } );
        }

    }

    function defHtml( componente, texto ) {
        componente.html(texto);
    }

    function defValue( componente, texto ) {
        componente.val(texto);
    }

    function defPlaceholder( componente, texto ) {
        componente.attr("placeholder", texto);
    }

    $(".texto_dinamico").each(function(){

        var _this = $(this);

        var lingatual = _this.attr("lingatual");
        if( lingatual == lid ) return;
        _this.attr("lingatual", lid);

        var html = _this.html();
        var normalizar = html != null && html.length > 0;

        processar( _this, "chave", "origem", normalizar ? defHtml : defValue, normalizar );

        processar( _this, "chaveph", "origem", defPlaceholder, false );

    });

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
 * @param resposta {@linkcode com.joseflavio.urucum.comunicacao.Resposta}
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
        if     ( this.tipo == "EXITO"      ) mensagemExito( this.argumento, regiao );
        else if( this.tipo == "INFORMACAO" ) mensagemInformacao( this.argumento, regiao );
        else if( this.tipo == "ATENCAO"    ) mensagemAtencao( this.argumento, regiao );
        else if( this.tipo == "ERRO"       ) mensagemErro( this.argumento, regiao );
        else if( this.tipo == "ACAO"       ) jsExec( this.referencia, this.argumento );
    });
}

//--------------------------------------------------------------------------

/**
 * Mostra {@link abrirMensagemAmpla amplamente} o conjunto novo de mensagens provenientes de Copaíba.
 * @param resposta {@linkcode com.joseflavio.urucum.comunicacao.Resposta}
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
    mensagemErro( jqXHR.responseJSON.mensagem, regiao );
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
 * Extrai as mensagens de uma {@linkcode com.joseflavio.urucum.comunicacao.Resposta}.
 * @param resposta {@linkcode com.joseflavio.urucum.comunicacao.Resposta}
 * @param separador Separador a utilizar entre as mensagens extraídas. Padrão: '\n'
 */
function extrairMensagens( resposta, separador ) {
    var texto = "";
    if( separador == undefined ) separador = '\n';
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
 * <p>Atualiza o ambiente de telas.</p>
 * <p>Para cada tela reconhecida será mantido um objeto na variável global {@link telas}.</p>
 * <p>No final, será chamada, se existente, a função {@link telasAtualizadas}.</p>
 */
function atualizarTelas() {

    if( iperoxo_script_linguagem ) carregarTextoDinamico();

    var navegacao = $("#navegacao");
    if( navegacao.length == 0 ) navegacao = undefined;

    // Removendo abas desnecessárias
    if( navegacao != undefined ){
        navegacao.children("li").each(function(i){
            var tab_li = $(this);
            var tid = tab_li.attr("tid");
            if( $("#"+tid).length == 0 ){
                tab_li.remove();
            }
        });
    }

    // Removendo objetos desnecessários
    for( var t in telas ){
        if( $("#"+t).length == 0 ){
            delete telas[t];
        }
    }

    // Atualizando
    $(".tela").each(function(i){

        var tela  = $(this);
        var ativa = ! tela.hasClass("hidden");

        // ID
        var tid = tela.attr("id");
        if( tid == null || tid.length == 0 ){
            tid = gerarID();
            tela.attr( "id", tid );
        }

        // Objeto
        if( telas[tid] == undefined ){
            telas[tid] = {
                "tid"   : tid,
                "args"  : {},
                "passo" : navegacao_passo
            };
        }

        // Título
        var titulo = tela.children(".tela_titulo").text();
        if( titulo == null || titulo.length == 0 ){
            titulo = "Tela " + ( i + 1 );
        }
        if( titulo.length > 20 ){
            titulo = titulo.substring(0, 17) + "...";
        }

        // Navegação
        if( navegacao != undefined ){
            var tab_li = $( "#tab_li_" + tid );
            if( tab_li.length > 0 ){
                tab_li.removeClass();
                tab_li.addClass( ativa ? "active" : "" );
                tab_li.find("a").html(titulo);
            }else{
                navegacao.append(
                    "<li id=\"tab_li_" + tid + "\" tid=\"" + tid + "\" class=\"" +
                    ( ativa ? "active" : "" ) +
                    "\">" +
                    "<a href=\"#\" id=\"tab_a_" + tid +
                    "\" onclick=\"ativarTela('" + tid + "');\">" +
                    titulo +
                    "</a>" +
                    //TODO "<a href=\"#\" class=\"close\" aria-label=\"fechar\">&times;</a>" +
                    "</li>"
                );
            }
        }

        // Campos padrões
        tela.find(".sid:first").val(sid);
        tela.find(".tid:first").val(tid);
        tela.find(".lid:first").val(lid);

    });

    // DateTimePicker's
    $(".datetimepicker").each(function(i){

        var obj = $(this);
        var dtp = obj.data("DateTimePicker");

        if( dtp == undefined ){

            var opcoes = jsExec( obj.attr("opcoes") );
            if( opcoes == undefined ){
                opcoes = {
                    locale: lid,
                    showTodayButton: true,
                    showClear: true,
                    allowInputToggle: true
                };
            }

            var inputTimestamp = obj.parent().find("input[type='hidden']");
            var inputTimestampFunc = function() {
                var data = obj.data("DateTimePicker").date();
                inputTimestamp.val( data != null ? data.valueOf() : "" );
            };
            obj.find("input[type='text']").change(inputTimestampFunc);

            obj.datetimepicker(opcoes).on("dp.change", inputTimestampFunc);

        }else{
            dtp.locale(lid);
        }

    });

    if( typeof(telasAtualizadas) !== "undefined" ) telasAtualizadas();

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

    if( telaAtiva.length == 1 ) telaAtiva.parent().after(divHTML);
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
            if( tid == null || tid.length == 0 ){
                tid = gerarID();
                tela.attr( "id", tid );
            }

            var telaObj = telas[tid] = {
                "tid"   : tid,
                "args"  : queryJSON,
                "passo" : navegacao_passo
            };

            tela.addClass("hidden");
            div.removeClass("hidden");
            atualizarTelas();

            tela.find(".uxiamarelo_form").each(function(){
                var form = $(this);
                uxiamareloPreparar(
                    form,
                    false,
                    js(form.attr("funcExito")),
                    js(form.attr("funcErro")),
                    js(form.attr("funcPreEnvio"))
                );
                jsExec( form.attr("funcInicio"), form );
            });

            var posPreparacao = function() {
                if( autoAtivar ) ativarTela( tid );
                jsExec( funcExito, tid, funcExitoArg );
            };

            var resultado = jsExec(
                tela.attr("funcPreparacao"),
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
 * @param {string} tid Identificação da tela desejada.
 */
function ativarTela( tid ) {

    var tela    = $( "#" + tid );
    var telaObj = telas[tid];

    $( "#navegacao > li" ).removeClass("active");
    $( ".tela" ).addClass("hidden");

    telaObj.passo = ++navegacao_passo;

    var posPreAtivacao = function() {

        $( "#tab_li_" + tid ).addClass("active");
        tela.removeClass("hidden");
    
        if( telaObj.iniciada === undefined ){
            telaObj.iniciada = true;
            jsExec( tela.attr("funcInicio"), tela, telaObj.args, tid, telaObj );
        }

    };

    var resultado = jsExec(
        tela.attr("funcPreAtivacao"),
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
 * @param {string} tid Identificação da tela desejada.
 */
function isTelaAtiva( tid ) {
    return ! $( "#" + tid ).hasClass("hidden");
}

//--------------------------------------------------------------------------

/**
 * Fecha e remove uma tela.
 * @param {string} tid Identificação da tela desejada.
 */
function fecharTela( tid ) {

    var tela = $( "#" + tid );
    if( ! tela.hasClass("tela") ) return;

    var remocaoEfetiva = function() {

        tela.parent().remove();
        delete telas[tid];
    
        if( ! tela.hasClass("hidden") ){
    
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
    
        atualizarTelas();

    };

    var resultado = jsExec(
        tela.attr("funcFim"),
        tela,
        telas[tid].args,
        tid,
        telas[tid],
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
    fecharTela( $(".tela").not(".hidden").attr("id") );
}

//--------------------------------------------------------------------------

/**
 * Ação disparada por componente de tela.<br>
 * A função a ser chamada deverá ter minimamente a assinatura da função {@link exemploEventoTela}.<br>
 * Argumentos extras serão repassados para a {@linkcode funcao}, após a passagem dos argumentos padrões.
 * @param componente Objeto DOM acionado.
 * @param funcao Função ou nome da função a ser executada.
 * @see exemploEventoTela
 */
function acaoTela( componente, funcao ) {
    
    var tela    = $(componente).parents(".tela");
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
 * @param tela Objeto jQuery do DOM raiz da tela.
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
 * @see cordova_repositorio_padrao
 * @see cordovaAbrir
 * @see cordovaListar
 * @see cordovaApagar
 * @see salvar
 */
function cordovaSalvar( nome, objeto, funcExito, funcErro ) {

    funcErro = js(funcErro);

    window.resolveLocalFileSystemURL( cordova_repositorio_padrao, function(diretorio) {
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
 * @see cordova_repositorio_padrao
 * @see cordovaSalvar
 * @see abrir
 */
function cordovaAbrir( nome, funcExito, funcErro ) {

    funcErro = js(funcErro);

    var endereco = cordova_repositorio_padrao + nome;

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
 * @see cordova_repositorio_padrao
 * @see cordovaSalvar
 */
function cordovaListar( funcExito, funcErro ) {

    funcErro = js(funcErro);

    window.resolveLocalFileSystemURL( cordova_repositorio_padrao, function(diretorio) {
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
 * @see cordova_repositorio_padrao
 * @see cordovaSalvar
 * @see apagar
 */
function cordovaApagar( nome, funcExito, funcErro ) {

    funcErro = js(funcErro);

    var endereco = cordova_repositorio_padrao + nome;

    window.resolveLocalFileSystemURL( endereco, function(arquivo) {
        arquivo.remove( function() {
            jsExec( funcExito, nome );
        }, funcErro );
    }, funcErro );

}

//--------------------------------------------------------------------------

inicio(function(){

    //-----------------------------------
    if( iperoxo_script_geral ){
        // Definição de "url_args"
        copiarQueryParaJSON( window.location.search, url_args );
    }

    //-----------------------------------
    if( iperoxo_script_mensagem ){

        mensagem_ampla        = document.getElementById("mensagem_ampla");
        mensagem_ampla_fechar = document.getElementsByClassName("mensagem_ampla_fechar")[0];
        mensagem_ampla_texto  = document.getElementById("mensagem_ampla_texto");
    
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
    if( iperoxo_script_persistencia ){
        if( isCordovaNativa() ){
            cordova_repositorio_padrao =
                device.platform == "iOS" ?
                cordova.file.syncedDataDirectory :
                cordova.file.dataDirectory;
        }
    }
    
});

//--------------------------------------------------------------------------