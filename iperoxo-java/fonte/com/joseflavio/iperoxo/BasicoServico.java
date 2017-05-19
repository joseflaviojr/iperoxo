
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

package com.joseflavio.iperoxo;

import com.joseflavio.copaiba.CopaibaConexao;
import com.joseflavio.urucum.comunicacao.Mensagem;
import com.joseflavio.urucum.comunicacao.Mensagem.Tipo;
import com.joseflavio.urucum.comunicacao.Resposta;
import com.joseflavio.urucum.texto.StringUtil;
import com.joseflavio.urucum.validacao.ValidacaoUtil;

import java.io.IOException;
import java.io.Serializable;
import java.util.ResourceBundle;

/**
 * {@link Servico} b�sico que monta uma {@link Resposta} enquanto utiliza, opcionalmente, um {@link BancoDeDados}.
 * @author Jos� Fl�vio de Souza Dias J�nior
 */
public abstract class BasicoServico <T extends Serializable> extends Servico<T> {
	
	protected BasicoServicoConf $Configuracao;
	
	/**
	 * {@link Resposta} que ser� enviada ao {@link CopaibaConexao cliente}.
	 * @see #executar()
	 */
	protected Resposta<T> $Resposta;
	
	/**
	 * {@link BancoDeDados} do {@link IpeRoxo}, se existente e {@link BasicoServicoConf#bancoDeDados() necess�rio}.
	 */
	protected BancoDeDados $BancoDeDados;
	
	/**
	 * {@link ResourceBundle} correspondente � {@link #getLid()}.
	 * @see IpeRoxo#getResourceBundle(String)
	 */
	protected ResourceBundle $ResourceBundle;
	
	@Override
	public final Resposta<T> executar() {
		
		$Configuracao = this.getClass().getAnnotation( BasicoServicoConf.class );
		$Resposta     = new Resposta<>();
		
		try{
			
			$ResourceBundle = IpeRoxo.getResourceBundle( lid );
			
			if( is$BancoDeDados() && IpeRoxo.getEntityManagerFactory() != null ){
				$BancoDeDados = new BancoDeDados( get$Transacoes() );
			}
			
			try{
				
				if( is$Validacao() && ! ValidacaoUtil.validar( this, $Resposta.getMensagens(), $ResourceBundle, get$Omissao() ) ){
					throw new IOException();
				}
				
				try{ preProcessamento(); }catch( Exception e ){}
				
				processar();
				
				try{ posProcessamento(); }catch( Exception e ){}
				
				if( $BancoDeDados != null && is$Commit() ) $BancoDeDados.commit();
				
			}catch( Exception e ){
				if( $BancoDeDados != null && is$Commit() ) $BancoDeDados.rollback();
				throw e;
			}finally{
				if( $BancoDeDados != null ) $BancoDeDados.close();
			}
			
			$Resposta.setExito( true );
			
		}catch( Exception e ){
			
			$Resposta.setExito( false );
			
			if( $Resposta.getMensagens().size() == 0 && StringUtil.tamanho( e.getMessage() ) > 0 ){
				$Resposta.mais( Tipo.ERRO, null, e.getMessage() );
			}
			
		}
		
		return $Resposta;
		
	}
	
	/**
	 * Montagem da {@link Resposta} deste {@link Servico}.<br>
	 * {@link Resposta#setExito(boolean)} ser� determinada automaticamente, sendo <code>false</code>
	 * quando este m�todo disparar uma {@link Exception}.<br>
	 * Se {@link BasicoServicoConf#commit()}, ser� feito um {@link BancoDeDados#commit()} (se �xito) ou um {@link BancoDeDados#rollback()}.
	 */
	protected abstract void processar() throws IOException;
	
	/**
	 * Atividade pr�-{@link #processar() processamento}.<br>
	 * {@link Exception}s s�o desconsideradas.
	 */
	protected void preProcessamento() {
	}
	
	/**
	 * Atividade p�s-{@link #processar() processamento}.<br>
	 * {@link Exception}s s�o desconsideradas.
	 */
	protected void posProcessamento() {
	}
	
	
	private boolean is$BancoDeDados() {
		return $Configuracao != null ? $Configuracao.bancoDeDados() : true;
	}
	
	private int get$Transacoes() {
		return $Configuracao != null ? $Configuracao.transacoes() : 1;
	}
	
	private boolean is$Commit() {
		return $Configuracao != null ? $Configuracao.commit() : true;
	}
	
	private boolean is$Validacao() {
		return $Configuracao != null ? $Configuracao.validacao() : true;
	}
	
	private String[] get$Omissao() {
		return $Configuracao != null ? $Configuracao.omissao() : new String[]{ "Automatico" };
	}
	
	/**
	 * Encerra a {@link #executar() execu��o} do {@link BasicoServico} atrav�s de {@link IOException},
	 * definindo na {@link Resposta} um {@link Resposta#setCodigo(int) c�digo} e
	 * uma {@link Resposta#mais(Mensagem.Tipo, String, Serializable) mensagem} de {@link Mensagem.Tipo#ERRO erro}.
	 * @param chave Chave do {@link IpeRoxo#getCodigo(String) c�digo} e da {@link IpeRoxo#getMensagem(String, String, Object...) mensagem} de {@link Mensagem.Tipo#ERRO erro}.
	 * @param parametros Par�metros para {@link IpeRoxo#getMensagem(String, String, Object...)}.
	 * @throws IOException disparada incondicionalmente, a fim de encerrar a {@link #executar() execu��o} do {@link BasicoServico}.
	 */
	protected void retornarErro( String chave, Object... parametros ) throws IOException {
		if( StringUtil.tamanho( chave ) == 0 ) throw new IllegalArgumentException();
		if( chave.charAt( 0 ) == '$' ) chave = chave.substring( 1 );
		$Resposta.setCodigo( IpeRoxo.getCodigo( chave ) );
		$Resposta.mais( Mensagem.Tipo.ERRO, null, getMensagem( chave, parametros ) );
		throw new IOException();
	}
	
}
