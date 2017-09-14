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

var iperoxo_script_geral = true;

var url_args = {}; // Argumentos da URL
var animacao_espera_total = 0; //Total de atividades em execução

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

// Definição de "url_args".
inicio(function(){

    var query = decodeURIComponent(window.location.search.substring(1));
    var args = query.split('&');
    var valor, i;

    for( i = 0; i < args.length; i++ ) {
        valor = args[i].split('=');
        url_args[valor[0]] = valor[1] === undefined ? null : valor[1];
    }

});

//--------------------------------------------------------------------------