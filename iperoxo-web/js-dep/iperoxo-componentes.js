//--------------------------------------------------------------------------

/*

  Copyright (C) 2016-2019 José Flávio de Souza Dias Júnior
  
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

  Direitos Autorais Reservados (C) 2016-2019 José Flávio de Souza Dias Júnior
  
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
 * Ajusta o estado funcional de um componente "ipe-data" conforme a sua configuração atual.
 * @param comp Objeto jQuery do componente.
 */
function comp_ipe_data_ajustar( comp ) {

    var $$    = comp[0];
    var valor = comp_ipe_data_get_valor(comp);

    var formato;
    if( $$.data && $$.hora ) formato = $$.dicionario.datahora_formato.numerico;
    else if( $$.hora )       formato = $$.dicionario.hora_formato.numerico;
    else                     formato = $$.dicionario.data_formato.numerico;
    
    $$.formato    = formato;
    $$.formatador = DateTimeFormatter.ofPattern(formato);

    var novamasc = formato;
    novamasc = novamasc.replace( /dd/g, "00" );
    novamasc = novamasc.replace( /d/g, $$.zeroesq ? "00" : "0[0]" );
    novamasc = novamasc.replace( /mm|hh/gi, "00" );
    novamasc = novamasc.replace( /m|h/gi, $$.zeroesq ? "00" : "0[0]" );
    novamasc = novamasc.replace( /yy/g, "00" );
    novamasc = novamasc.replace( /y/g, $$.zeroesq ? "0000" : "0[0][0][0]" );
    novamasc = novamasc.replace( /([^0])/g, "$1`" );

    var opcoes = {
        mask            : novamasc,
        overwrite       : $$.sobrepor,
        lazy            : ! $$.permanente,
        placeholderChar : $$.sinal
    };

    if( $$.mascara ) $$.mascara.updateOptions(opcoes);
    else $$.mascara = IMask($$.entrada[0], opcoes);

    comp_ipe_data_set_valor(comp, valor);

}

//--------------------------------------------------------------------------

/**
 * Ação executada após a implantação de um componente "ipe-data".
 * @param comp Objeto jQuery do componente.
 */
function comp_ipe_data_pos_implantacao( comp, atributos ) {
    
    var $$ = comp[0];

    $$.atributos  = atributos;
    $$.entrada    = comp.find(configuracao.componentes["ipe-data"]["valor-auto"]);
    $$.saida      = comp.find(".ipe-data-valor");
    $$.data       = atributos["data"] !== "nao";
    $$.hora       = atributos["hora"] !== "nao";
    $$.zeroesq    = atributos["mascara-zero-esquerda"] !== "nao";
    $$.sobrepor   = atributos["mascara-sobrepor"] !== "nao";
    $$.permanente = atributos["mascara-permanente"] !== "nao";
    $$.sinal      = atributos["mascara-sinal"] ? atributos["mascara-sinal"] : '_';
    $$.zona       = zona_tempo;
    $$.dicionario = dicionario;

    comp_ipe_data_ajustar(comp);

    $$.entrada.keyup(function(){
        var valor = $$.mascara.unmaskedValue;
        if( valor !== "" ) valor = $$.mascara.value;
        comp_ipe_data_set_valor(comp, valor, false);
    });

}

//--------------------------------------------------------------------------

/**
 * Obtém o valor de data/hora definido através de um componente do tipo "ipe-data".
 * Aconselha-se não utilizar este método de forma direta.
 * @param comp Objeto jQuery do componente.
 * @returns valor numérico no formato Unix timestamp (milissegundos desde 01/jan/1970 00:00 UTC), ou null.
 * @see getCompValor
 * @see https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date
 */
function comp_ipe_data_get_valor( comp ) {
    var valor = comp[0].saida.val();
    return valor !== undefined && valor !== "" ? parseInt(valor) : null;
}

//--------------------------------------------------------------------------

/**
 * Define o valor de data/hora de um componente do tipo "ipe-data".
 * Aconselha-se não utilizar este método de forma direta.
 * @param comp Objeto jQuery do componente.
 * @param valor Unix timestamp (milissegundos desde 01/jan/1970 00:00 UTC), Date, Joda ou texto formatado.
 * @see setCompValor
 * @see https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date
 */
function comp_ipe_data_set_valor( comp, valor, atualizarTexto ) {

    var $$ = comp[0];

    if( valor == null ) valor = "";

    if( typeof(valor) === "object" ){
        try{
            valor = getTimestamp(valor, $$.zona);
        }catch(e){
            valor = valor.toString();
        }
    }

    var tipo = typeof(valor);

    if( tipo === "string" ){
        if( valor.length > 0 ){
            try{
                var tempo;
                if( $$.data && $$.hora ) tempo = LocalDateTime.parse(valor, $$.formatador);
                else if( $$.hora )       tempo = LocalTime    .parse(valor, $$.formatador);
                else                     tempo = LocalDate    .parse(valor, $$.formatador);
                valor = getTimestamp(tempo, $$.zona);
            }catch(e){   
            }
        }

    }else if( tipo === "number" ){
        valor = parseInt(valor);
        
    }else{
        throw new Error(valor);
    }

    var numero = typeof(valor) === "number";

    if( numero || valor === "" ){
        $$.saida.val(valor);
        comp.removeClass("has-error");
    }else{
        $$.saida.val("");
        comp.addClass("has-error");
    }

    if( atualizarTexto !== false ){
        if( numero ){
            $$.mascara.value = LocalDateTime
                .ofEpochSecond(parseInt(valor/1000), $$.zona)
                .format($$.formatador);
        }else{
            $$.mascara.value = valor;
        }
    }
    
}

//--------------------------------------------------------------------------

/**
 * Verifica se um componente "ipe-data" está em estado
 * que permita a alteração de valor através da interface gráfica.
 */
function comp_ipe_data_get_editavel( comp ) {
    return comp[0].entrada.attr("readonly") === undefined;
}

//--------------------------------------------------------------------------

/**
 * Determina se um componente "ipe-data" deve ou não permitir
 * a alteração de valor através da interface gráfica.
 */
function comp_ipe_data_set_editavel( comp, editavel ) {
    if( ! editavel ) comp[0].entrada.attr("readonly", "readonly");
    else comp[0].entrada.removeAttr("readonly");
}

//--------------------------------------------------------------------------

/**
 * Atualiza a composição visual de um componente "ipe-data".
 * @param comp Objeto jQuery do componente.
 * @see atualizarAmbiente()
 */
function comp_ipe_data_atualizar( comp ) {
    var $$ = comp[0];
    if( $$.zona !== zona_tempo || $$.dicionario !== dicionario ){
        $$.zona       = zona_tempo;
        $$.dicionario = dicionario;
        comp_ipe_data_ajustar(comp);
    }
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
 * @param comp Objeto jQuery do componente.
 */
function comp_ipe_texto_pos_implantacao( comp, atributos ) {

    var campo  = comp.find(configuracao.componentes["ipe-texto"]["valor-auto"]);
    var padrao = atributos["mascara"];

    if( padrao !== undefined && padrao.length > 0 ){

        if( padrao.startsWith("/") && padrao.endsWith("/") ){
            padrao = new RegExp(padrao.substring(1, padrao.length - 1));
        }

        comp[0].mascara = IMask(
            campo[0],
            {
                mask            : padrao,
                overwrite       : atributos["mascara-sobrepor"] !== "nao",
                lazy            : atributos["mascara-permanente"] !== "nao",
                placeholderChar : atributos["mascara-sinal"] ? atributos["mascara-sinal"] : '_'
            }
        );
        
    }

}

//--------------------------------------------------------------------------

/**
 * Define o valor textual de um componente do tipo "ipe-texto".
 * Aconselha-se não utilizar este método de forma direta.
 * @param comp Objeto jQuery do componente.
 * @see setCompValor
 */
function comp_ipe_texto_set_valor( comp, valor ) {
    var mascara = comp[0].mascara;
    if( mascara ){
        mascara.value = valor;
    }else{
        comp.find(configuracao.componentes["ipe-texto"]["valor-auto"]).val(valor);
    }
}

//--------------------------------------------------------------------------

/**
 * Verifica se um componente "ipe-texto" está em estado
 * que permita a alteração de valor através da interface gráfica.
 */
function comp_ipe_texto_get_editavel( comp ) {
    var elemt = comp.find(configuracao.componentes["ipe-texto"]["valor-auto"]);
    return elemt.attr("readonly") === undefined;
}

//--------------------------------------------------------------------------

/**
 * Determina se um componente "ipe-texto" deve ou não permitir
 * a alteração de valor através da interface gráfica.
 */
function comp_ipe_texto_set_editavel( comp, editavel ) {
    var elemt = comp.find(configuracao.componentes["ipe-texto"]["valor-auto"]);
    if( ! editavel ) elemt.attr("readonly", "readonly");
    else elemt.removeAttr("readonly");
}

//--------------------------------------------------------------------------

/**
 * Obtém a máscara de valor de um componente do tipo "ipe-texto".
 * Aconselha-se não utilizar este método de forma direta.
 * @param comp Objeto jQuery do componente.
 * @returns https://unmanner.github.io/imaskjs/api/#mask
 * @see getCompProp
 */
function comp_ipe_texto_get_mascara( comp ) {
    var mascara = comp[0].mascara;
    return mascara ? mascara.mask : undefined;
}

//--------------------------------------------------------------------------

/**
 * Define a máscara de valor de um componente do tipo "ipe-texto".
 * Aconselha-se não utilizar este método de forma direta.
 * @param comp Objeto jQuery do componente.
 * @param valor Valores aceitáveis: https://unmanner.github.io/imaskjs/api/#mask
 * @see setCompProp
 */
function comp_ipe_texto_set_mascara( comp, valor ) {
    var mascara = comp[0].mascara;
    if( mascara ){
        mascara.updateOptions({ mask: valor });
    }else{
        comp[0].mascara = IMask(
            comp.find(configuracao.componentes["ipe-texto"]["valor-auto"])[0],
            {
                mask            : valor,
                overwrite       : true,
                lazy            : false,
                placeholderChar : '_'
            }
        );
    }
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