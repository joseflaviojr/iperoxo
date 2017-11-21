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

var url_args = {}; // Argumentos da URL

var sid = ""; // ID da Sessão
var lid = "en-US"; // Linguagem

var dicionario = dicionario_en_US;
var cordova_repositorio_padrao = null;
var animacao_espera_total = 0; // Total de atividades em execução

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

// Atividade a ser executada quando o dispositivo estiver pronto.
function inicio( atividade ) {
    if( typeof(cordova) != "undefined" ){
        document.addEventListener("deviceready", atividade, false);
    }else{
        $(atividade);
    }
}

//--------------------------------------------------------------------------

// Gera aleatoriamente um identificador de tag HTML.
function gerarID() {
    return "id_" + Math.floor( Math.random() * 999999999 );
}

//--------------------------------------------------------------------------

// Resolve uma rotina de JavaScript com "eval".
// Retorna "undefined" se falhar.
function js( rotina ) {
    try{
        return eval(rotina);
    }catch(e){
        return undefined;
    }
}

//--------------------------------------------------------------------------

// Resolve e executa uma função JavaScript.
// funcao = Função ou nome de função.
// Retorna "undefined" se falhar.
function jsExec( funcao, arg1, arg2, arg3, arg4, arg5 ) {
    try{
        if( funcao == undefined || funcao == "" ){
            return undefined;
        }else if( typeof(funcao) === "function" ){
            return funcao( arg1, arg2, arg3, arg4, arg5 );
        }else{
            return eval(funcao)( arg1, arg2, arg3, arg4, arg5 );
        }
    }catch(e){
        return undefined;
    }
}

//--------------------------------------------------------------------------

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

// Substitui caracteres especiais por entidades HTML.
// Exemplo: & = &amp;
function textoHTML( texto ) {
    return String( texto ).replace(/[ &<>"'\/\\\n]/g, function(x) {
        return HTML_ENTIDADE[x];
    });
}

//--------------------------------------------------------------------------

// Incrementa o número de atividades pelas quais se espera,
// mostrando a animação de execução.
function incrementarEspera() {
    animacao_espera_total++;
    document.getElementById("animacao_espera").style.display = "block";
}

// Decrementa o número de atividades pelas quais se espera.
// Se resultar em zero, a animação de execução será removida.
function decrementarEspera() {
    animacao_espera_total--;
    if( animacao_espera_total <= 0 ){
        animacao_espera_total = 0;
        document.getElementById("animacao_espera").style.display = "none";
    }
}

//--------------------------------------------------------------------------

// Atualiza todos os componentes sensíveis à "lid".
function atualizarComponentesCulturais() {
    moment.locale(lid);
    if( iperoxo_script_tela ) atualizarTelas();
    else if( iperoxo_script_linguagem ) carregarTextoDinamico();
}

//--------------------------------------------------------------------------

// Copia os parâmetros/valores de uma URL (query) para um JSON.
function copiarQueryParaJSON( url, json={} ) {
   
    var inicio = url.indexOf('?');
    if( inicio == -1 ) return json;

    var query = decodeURIComponent(url.substring(inicio+1));
    var args = query.split('&');
    var valor, i;

    for( i = 0; i < args.length; i++ ) {
        valor = args[i].split('=');
        json[valor[0]] = valor[1] === undefined ? null : valor[1];
    }

    return json;

}

//--------------------------------------------------------------------------

// Altera a "sid" (ID da Sessão), comumente chamada de "token".
function setSID( nova_sid, minutos ) {
    sid = nova_sid;
    if( minutos == undefined ) minutos = 365 * 24 * 60;
    if( iperoxo_script_geral ) setCookie( "sid", nova_sid, minutos );
    if( iperoxo_script_tela ) atualizarTelas();
}

//--------------------------------------------------------------------------

// Altera a linguagem atual - variável "lid". Padrão: "en-US"
// No final, será chamada a função linguagemAlterada(), que deveria chamar atualizarComponentesCulturais()
function setLinguagem( nome ) {
    
    lid = nome.split("_").join("-");
    setCookie( "lid", lid, 365 * 24 * 60 );

    var nomeDic = nome.split("-").join("_");
    dicionario = js( "dicionario_" + nomeDic );
    if( dicionario == undefined ) dicionario = js( "dicionario_" + nomeDic.split("_")[0] );
    if( dicionario == undefined ) dicionario = dicionario_en_US;

    linguagemAlterada();

}

//--------------------------------------------------------------------------

// Carrega o conteúdo dos componentes textuais, sensíveis à "lid", que estão desatualizados.
function carregarTextoDinamico() {

    $(document).find(".texto_dinamico").each(function(){

        var _this = $(this);

        var lingatual = _this.attr("lingatual");
        if( lingatual == lid ) return;
        _this.attr("lingatual", lid);

        var origem = _this.attr("origem");
        if( origem == null || origem.length == 0 ) origem = "javascript";

        var texto = _this.html();
        var destino_textual = texto != null && texto.length > 0;

        if( origem == "javascript" ){
            var txt = dicionario[_this.attr("chave")];
            if( txt == undefined ) txt = " ";
            if( destino_textual ) _this.html(textoHTML(txt));
            else _this.val(txt);
        }else{
            var json = {
                sid: sid,
                lid: lid,
                chave: _this.attr("chave")
            };
            uxiamarelo( origem, json, function(txt){
                if( destino_textual ) _this.html(textoHTML(txt));
                else _this.val(txt);
            } );
        }

    });

}

//--------------------------------------------------------------------------

// Acrescenta uma mensagem numa região.
// A classificação segue o padrão da Bootstrap.
// A mensagem será inserida no primeiro descendente que contém a classe "mensagens".
// Se região == null, será utilizado o elemento global que possui id = "mensagens".
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

// Acrescenta mensagemClassificada() como "alert-success".
function mensagemExito( texto, regiao ) {
    mensagemClassificada( "alert-success", texto, regiao );
}

// Acrescenta mensagemClassificada() como "alert-info".
function mensagemInformacao( texto, regiao ) {
    mensagemClassificada( "alert-info", texto, regiao );
}

// Acrescenta mensagemClassificada() como "alert-warning".
function mensagemAtencao( texto, regiao ) {
    mensagemClassificada( "alert-warning", texto, regiao );
}

// Acrescenta mensagemClassificada() como "alert-danger".
function mensagemErro( texto, regiao ) {
    mensagemClassificada( "alert-danger", texto, regiao );
}

//--------------------------------------------------------------------------

// Remove as mensagens ativas e mostra o conjunto novo de mensagens provenientes de Copaíba.
// Ver mensagensAmplaCopaiba()
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

// Mostra amplamente o conjunto novo de mensagens provenientes de Copaíba.
// Ver mensagensCopaiba()
function mensagensAmplaCopaiba( resposta, status, jqXHR, regiao ) {
    abrirMensagemAmpla( extrairMensagens(resposta) );
}

//--------------------------------------------------------------------------

// Remove as mensagens ativas e mostra a mensagem de erro proveniente de Uxi-amarelo.
function mensagemErroUxiamarelo( jqXHR, status, errorThrown, regiao ) {
    limparMensagens( regiao );
    mensagemErro( jqXHR.responseJSON.mensagem, regiao );
}

//--------------------------------------------------------------------------

// Mostra amplamente o conteúdo bruto de um objeto.
function mensagemAmplaBruta( obj ) {
    abrirMensagemAmpla( JSON.stringify(obj) );
}

//--------------------------------------------------------------------------

// Remove todas as mensagens contidas numa região.
// Ver mensagemClassificada()
function limparMensagens( regiao ) {
    var destino = regiao == null ? $("#mensagens") : regiao.find(".mensagens:first");
    destino.empty();
}

//--------------------------------------------------------------------------

// Extrai as mensagens de uma com.joseflavio.urucum.comunicacao.Resposta
function extrairMensagens( resposta, separador ) {
    var texto = "";
    if( separador == undefined ) separador = '\n';
    $.each( resposta.mensagens, function() {
        texto += this.argumento + separador;
    });
    return texto;
}

//--------------------------------------------------------------------------

function abrirMensagemAmpla( texto ) {
    mensagem_ampla_texto.innerHTML = textoHTML(texto);
    mensagem_ampla.style.display = "block";
}

function fecharMensagemAmpla() {
    mensagem_ampla.style.display = "none";
}

//--------------------------------------------------------------------------

// Executa AJAX do tipo POST para um serviço Uxi-amarelo.
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

// Prepara um formulário HTML para ser submetido através de AJAX a um serviço Uxi-amarelo.
// formulario   : Formulário HTML (objeto jQuery).
// enviarAgora  : Executar o AJAX imediatamente? Caso contrário, apenas habilitará o "submit" através de AJAX.
// funcExito    : AJAX "success". Argumento extra: formulario.
// funcErro     : AJAX "error". Argumento extra: formulario.
// funcPreEnvio : AJAX "beforeSend". Se retornar "false", cancela o AJAX. Argumento extra: formulario.
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

// Atualiza o ambiente de telas.
function atualizarTelas() {

    if( iperoxo_script_linguagem ) carregarTextoDinamico();

    var navegacao = $("#navegacao");
    if( navegacao.length > 0 ) navegacao.empty();

    $(".tela").each(function(i){

        var tela = $(this);

        var tid = tela.attr("id");
        if( tid == null || tid.length == 0 ){
            tid = gerarID();
            tela.attr( "id", tid );
        }

        var titulo = tela.children(".tela_titulo").text();
        if( titulo == null || titulo.length == 0 ){
            titulo = "Tela " + ( i + 1 );
        }

        if( titulo.length > 20 ) titulo = titulo.substring(0, 17) + "...";

        if( navegacao.length > 0 ){
            navegacao.append(
                "<li id=\"tab_li_" + tid + "\" tid=\"" + tid + "\" class=\"" +
                ( tela.hasClass("hidden") ? "" : "active" ) +
                "\">" +
                "<a href=\"#\" id=\"tab_a_" + tid +
                "\" onclick=\"ativarTela('" + tid + "');\">" +
                titulo +
                "</a>" +
                //TODO "<a href=\"#\" class=\"close\" aria-label=\"fechar\">&times;</a>" +
                "</li>"
            );
        }

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
                inputTimestamp.val( obj.data("DateTimePicker").date().valueOf() );
            };
            obj.find("input[type='text']").change(inputTimestampFunc);

            obj.datetimepicker(opcoes).on("dp.change", inputTimestampFunc);

        }else{
            dtp.locale(lid);
        }

    });

}

//--------------------------------------------------------------------------

// Abre uma tela especificada em outra página HTML.
// pagina       : URL da página HTML.
// autoAtivar   : Ativar automaticamente a tela? Padrão: true. Ver ativarTela()
// paginaArg    : Argumento a ser enviado para a página.
// funcExito    : function(tid, funcExitoArg), executada após a carga normal da tela.
// funcExitoArg : Argumento a ser passado para a funcExito.
function abrirTela( pagina, autoAtivar, paginaArg, funcExito, funcExitoArg ) {

    if( autoAtivar == undefined ) autoAtivar = true;

    var divID  = gerarID();
    var divHTML = "<div id=\"" + divID + "\" class=\"hidden\"></div>";
    var telaAtiva = $(".tela").not(".hidden");

    if( telaAtiva.length == 1 ) telaAtiva.parent().after(divHTML);
    else $("#telas").append(divHTML);

    var div = $( "#" + divID );
    var queryJSON = copiarQueryParaJSON(pagina);

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

            atualizarTelas();
            if( autoAtivar ) ativarTela( tid );

            jsExec( tela.attr("funcPreparacao"), tela, queryJSON );
            div.removeClass("hidden");
            jsExec( tela.attr("funcInicio"), tela, queryJSON );

            tela.find(".uxiamarelo_form").each(function(i){
                var _this = $(this);
                jsExec( _this.attr("funcInicio"), _this );
                uxiamareloPreparar(
                    _this,
                    false,
                    js(_this.attr("funcExito")),
                    js(_this.attr("funcErro")),
                    js(_this.attr("funcPreEnvio"))
                );
            });

            if( funcExito != null ) funcExito(tid, funcExitoArg);

        }
    );

}

//--------------------------------------------------------------------------

// Determina qual das telas deve estar visível e disponível para uso.
function ativarTela( tid ) {

    $( "#navegacao > li" ).removeClass("active");
    $( "#tab_li_" + tid ).addClass("active");

    $( ".tela" ).addClass("hidden");
    $( "#" + tid ).removeClass("hidden");

}

//--------------------------------------------------------------------------

// Fecha e remove uma tela.
function fecharTela( tid ) {
    $( "#" + tid ).remove();
    atualizarTelas();
}

//--------------------------------------------------------------------------

// Fecha e remove todas as telas atuais.
function fecharTelas() {
    $( ".tela" ).remove();
    atualizarTelas();
}

//--------------------------------------------------------------------------

// Armazena um objeto JSON com um exclusivo nome.
function salvar( nome, objeto, funcExito, funcErro ) {
    if( typeof(cordova) != "undefined" && device.platform != "browser" ){
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

// Recupera um objeto JSON previamente armazenado.
function abrir( nome, funcExito, funcErro ) {
    if( typeof(cordova) != "undefined" && device.platform != "browser" ){
        cordovaAbrir( nome, funcExito, funcErro );
    }else{
        try{
            var item = window.localStorage.getItem( nome );
            if( item === null ) jsExec(funcErro, null);
            else funcExito( JSON.parse( item ) );
        }catch( e ){
            jsExec(funcErro, e);
        }
    }
}

//--------------------------------------------------------------------------

// Armazena um objeto JSON num arquivo de texto, através da API do Apache Cordova.
function cordovaSalvar( nome, objeto, funcExito, funcErro ) {

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

// Recupera um objeto JSON previamente armazenado num arquivo de texto, através da API do Apache Cordova.
function cordovaAbrir( nome, funcExito, funcErro ) {

    var endereco = cordova_repositorio_padrao + nome;

    window.resolveLocalFileSystemURL( endereco, function(arquivo) {
        arquivo.file( function(conteudo) {

            var entrada = new FileReader();

            entrada.onloadend = function(e) {
                funcExito( JSON.parse(this.result), arquivo );
            };

            entrada.onerror = funcErro;

            entrada.readAsText( conteudo );

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

        var mensagem_ampla        = document.getElementById("mensagem_ampla");
        var mensagem_ampla_fechar = document.getElementsByClassName("mensagem_ampla_fechar")[0];
        var mensagem_ampla_texto  = document.getElementById("mensagem_ampla_texto");
    
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
        if( typeof(cordova) != "undefined" && device.platform != "browser" ){
            cordova_repositorio_padrao =
                device.platform == "iOS" ?
                cordova.file.syncedDataDirectory :
                cordova.file.dataDirectory;
        }
    }
    
});

//--------------------------------------------------------------------------