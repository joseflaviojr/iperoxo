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

    if( typeof funcExito == 'function' ) req.done(function( data, textStatus, jqXHR ) {
        this.funcExito( data, textStatus, jqXHR, this.argExtra );
    });

    if( typeof funcErro  == 'function' ) req.fail(function( jqXHR, textStatus, errorThrown ) {
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
            if( typeof this.funcExito == 'function' ){
                this.funcExito( data, textStatus, jqXHR, this.formulario );
            }
        },

        error: function( jqXHR, textStatus, errorThrown ){
            if( typeof this.funcErro == 'function' ){
                this.funcErro( jqXHR, textStatus, errorThrown, this.formulario );
            }
        },

        beforeSend: function( jqXHR, settings ){
            if( typeof this.funcPreEnvio == 'function' ){
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