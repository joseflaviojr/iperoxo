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

var iperoxo_script_mensagem = true;

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

inicio(function(){

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

});

//--------------------------------------------------------------------------