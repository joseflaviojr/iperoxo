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

var iperoxo_script_linguagem = true;

var lid        = "en-US";
var dicionario = dicionario_en_US;

//--------------------------------------------------------------------------

// Altera a linguagem atual - variável "lid". Padrão: "en-US"
// No final, será chamada a função linguagemAlterada(), que deveria chamar carregarTextoDinamico()
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