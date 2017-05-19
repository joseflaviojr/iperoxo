
/*
 *  Copyright (C) 2016 Jos� Fl�vio de Souza Dias J�nior
 *  
 *  This file is part of Ip�-roxo - <http://www.joseflavio.com/iperoxo/>.
 *  
 *  Ip�-roxo is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  Ip�-roxo is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU Lesser General Public License for more details.
 *  
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with Ip�-roxo. If not, see <http://www.gnu.org/licenses/>.
 */

/*
 *  Direitos Autorais Reservados (C) 2016 Jos� Fl�vio de Souza Dias J�nior
 * 
 *  Este arquivo � parte de Ip�-roxo - <http://www.joseflavio.com/iperoxo/>.
 * 
 *  Ip�-roxo � software livre: voc� pode redistribu�-lo e/ou modific�-lo
 *  sob os termos da Licen�a P�blica Menos Geral GNU conforme publicada pela
 *  Free Software Foundation, tanto a vers�o 3 da Licen�a, como
 *  (a seu crit�rio) qualquer vers�o posterior.
 * 
 *  Ip�-roxo � distribu�do na expectativa de que seja �til,
 *  por�m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl�cita de
 *  COMERCIABILIDADE ou ADEQUA��O A UMA FINALIDADE ESPEC�FICA. Consulte a
 *  Licen�a P�blica Menos Geral do GNU para mais detalhes.
 * 
 *  Voc� deve ter recebido uma c�pia da Licen�a P�blica Menos Geral do GNU
 *  junto com Ip�-roxo. Se n�o, veja <http://www.gnu.org/licenses/>.
 */

package com.joseflavio.iperoxo.docker;

import com.joseflavio.iperoxo.BasicoServico;
import com.joseflavio.iperoxo.BasicoServicoConf;
import com.joseflavio.urucum.aparencia.Nome;
import com.joseflavio.urucum.comunicacao.Arquivo;
import com.joseflavio.urucum.comunicacao.Mensagem.Tipo;
import com.joseflavio.urucum.texto.StringUtil;
import com.joseflavio.urucum.validacao.NaoNulo;
import com.joseflavio.urucum.validacao.NaoVazio;

import java.io.IOException;

/**
 * Exemplo de {@link BasicoServico}.
 * @author Jos� Fl�vio de Souza Dias J�nior
 */
@BasicoServicoConf(bancoDeDados=false, transacoes=1, commit=true, validacao=true)
public class Exemplo extends BasicoServico<String> {

	@Nome(masculino="IpeRoxo.Exemplo.Texto")
	@NaoNulo
	@NaoVazio
	private String texto;
	
	@NaoNulo(mensagem="IpeRoxo.Exemplo.Arquivo.Vazio")
	@NaoVazio(mensagem="IpeRoxo.Exemplo.Arquivo.Vazio")
	private Arquivo[] arquivo;

	private String cookieTeste;
	
	private String chave;
	
	@Override
	protected void processar() throws IOException {
		
		try{

			if( StringUtil.tamanho( cookieTeste ) == 0 ){
				retornarErro( "Erro_NaoNulo", "Cookie", 0, 0 );
			}

			$Resposta.mais( Tipo.EXITO, null, getMensagem( "IpeRoxo.Exemplo.Exito" ) );
			$Resposta.mais( Tipo.INFORMACAO, null, texto );
			
			for( Arquivo a : arquivo ){
				$Resposta.mais( Tipo.INFORMACAO, null, a.getNome() + " [" + a.getEndereco() + "]" );
			}
			
			$Resposta.mais( Tipo.ATENCAO, null, "Cookie: " + cookieTeste );
			
			$Resposta.setResultado( getMensagem( "IpeRoxo.Exemplo.Teste", "Exemplo" ) );
			
		}catch( Exception e ){
			if( e instanceof IOException ) throw (IOException) e;
			else throw new IOException( e );
		}
		
	}
	
	@Override
	public String toString() {
		try{
			if( chave.equals( "texto" ) ){
				return getMensagem( "IpeRoxo.Exemplo.Texto" );
			}
		}catch( Exception e ){
		}
		return chave;
	}
	
	public String getTexto() {
		return texto;
	}

	public void setTexto( String texto ) {
		this.texto = texto;
	}
	
	public Arquivo[] getArquivo() {
		return arquivo;
	}
	
	public void setArquivo( Arquivo[] arquivo ) {
		this.arquivo = arquivo;
	}

	public String getCookieTeste() {
		return cookieTeste;
	}

	public void setCookieTeste( String cookieTeste ) {
		this.cookieTeste = cookieTeste;
	}
	
	public String getChave() {
		return chave;
	}
	
	public void setChave( String chave ) {
		this.chave = chave;
	}
	
}
