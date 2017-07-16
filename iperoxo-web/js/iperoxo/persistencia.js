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

var iperoxo_script_persistencia = true;

var cordova_repositorio_padrao = null;

//--------------------------------------------------------------------------

inicio(function(){
    if( typeof(cordova) != "undefined" && device.platform != "browser" ){
        cordova_repositorio_padrao =
            device.platform == "iOS" ?
            cordova.file.syncedDataDirectory :
            cordova.file.dataDirectory;
    }
});

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