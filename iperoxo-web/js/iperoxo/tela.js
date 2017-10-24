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

var iperoxo_script_tela = true;

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
