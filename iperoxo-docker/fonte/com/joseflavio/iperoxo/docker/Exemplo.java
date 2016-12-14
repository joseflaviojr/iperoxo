
/*
 *  Copyright (C) 2016 José Flávio de Souza Dias Júnior
 *  
 *  This file is part of Ipê-roxo - <http://www.joseflavio.com/iperoxo/>.
 *  
 *  Ipê-roxo is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  Ipê-roxo is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU Lesser General Public License for more details.
 *  
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with Ipê-roxo. If not, see <http://www.gnu.org/licenses/>.
 */

/*
 *  Direitos Autorais Reservados (C) 2016 José Flávio de Souza Dias Júnior
 * 
 *  Este arquivo é parte de Ipê-roxo - <http://www.joseflavio.com/iperoxo/>.
 * 
 *  Ipê-roxo é software livre: você pode redistribuí-lo e/ou modificá-lo
 *  sob os termos da Licença Pública Menos Geral GNU conforme publicada pela
 *  Free Software Foundation, tanto a versão 3 da Licença, como
 *  (a seu critério) qualquer versão posterior.
 * 
 *  Ipê-roxo é distribuído na expectativa de que seja útil,
 *  porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita de
 *  COMERCIABILIDADE ou ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA. Consulte a
 *  Licença Pública Menos Geral do GNU para mais detalhes.
 * 
 *  Você deve ter recebido uma cópia da Licença Pública Menos Geral do GNU
 *  junto com Ipê-roxo. Se não, veja <http://www.gnu.org/licenses/>.
 */

package com.joseflavio.iperoxo.docker;

import java.io.IOException;
import java.util.ResourceBundle;

import com.joseflavio.iperoxo.BancoDeDados;
import com.joseflavio.iperoxo.BasicoServico;
import com.joseflavio.iperoxo.Servico;
import com.joseflavio.urucum.comunicacao.Arquivo;
import com.joseflavio.urucum.comunicacao.Mensagem.Tipo;
import com.joseflavio.urucum.comunicacao.Resposta;
import com.joseflavio.urucum.validacao.NaoNulo;
import com.joseflavio.urucum.validacao.NaoVazio;
import com.joseflavio.urucum.validacao.ValidacaoUtil;

/**
 * Exemplo de {@link Servico}.
 * @author José Flávio de Souza Dias Júnior
 */
public class Exemplo extends BasicoServico<String> {
	
	@NaoNulo(mensagem="$IpeRoxo.Exemplo.Texto.Vazio")
	@NaoVazio(mensagem="$IpeRoxo.Exemplo.Texto.Vazio")
	private String texto;
	
	@NaoNulo(mensagem="$IpeRoxo.Exemplo.Arquivo.Vazio")
	@NaoVazio(mensagem="$IpeRoxo.Exemplo.Arquivo.Vazio")
	private Arquivo[] arquivo;

	@Override
	public void executar( Resposta<String> resp, BancoDeDados bd, ResourceBundle rb ) throws IOException {
		
		try{
			
			if( ! ValidacaoUtil.validar( this, resp.getMensagens(), true, null, rb ) ){
				throw new IOException();
			}
			
			resp.mais( Tipo.EXITO, null, getMensagem( "$IpeRoxo.Exemplo.Exito" ) );
			resp.mais( Tipo.INFORMACAO, null, texto );
			
			for( Arquivo a : arquivo ){
				resp.mais( Tipo.INFORMACAO, null, a.getNome() + " [" + a.getEndereco() + "]" );
			}
			
		}catch( IOException e ){
			throw e;
		}catch( Exception e ){
			throw new IOException( e );
		}
		
	}
	
	@Override
	public String toString() {
		try{
			return getMensagem( "$IpeRoxo.Exemplo.Texto" );
		}catch( Exception e ){
			return "Texto";
		}
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
	
}
