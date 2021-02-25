
/*
 *  Copyright (C) 2016-2021 José Flávio de Souza Dias Júnior
 *
 *  This file is part of Ipê-roxo - <http://joseflavio.com/iperoxo/>.
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
 *  Direitos Autorais Reservados (C) 2016-2021 José Flávio de Souza Dias Júnior
 *
 *  Este arquivo é parte de Ipê-roxo - <http://joseflavio.com/iperoxo/>.
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

package com.joseflavio.iperoxo;

import java.io.IOException;
import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.ResourceBundle;

import com.joseflavio.copaiba.CopaibaConexao;
import com.joseflavio.urucum.comunicacao.Mensagem;
import com.joseflavio.urucum.comunicacao.Mensagem.Tipo;
import com.joseflavio.urucum.comunicacao.Resposta;
import com.joseflavio.urucum.texto.StringUtil;
import com.joseflavio.urucum.validacao.ValidacaoUtil;

/**
 * {@link Servico} básico que monta uma {@link Resposta} enquanto utiliza, opcionalmente, um {@link BancoDeDados}.
 * @author José Flávio de Souza Dias Júnior
 */
public abstract class BasicoServico <T extends Serializable> extends Servico<T> {
	
	protected BasicoServicoConf $Configuracao;
	
	/**
	 * {@link Resposta} que será enviada ao {@link CopaibaConexao cliente}.
	 * @see #executar()
	 */
	protected Resposta<T> $Resposta;
	
	/**
	 * {@link BancoDeDados} do {@link IpeRoxo}, se existente e {@link BasicoServicoConf#bancoDeDados() necessário}.
	 */
	protected BancoDeDados $BancoDeDados;
	
	/**
	 * {@link ResourceBundle} correspondente à {@link #getLid()}.
	 * @see IpeRoxo#getResourceBundle(String)
	 */
	protected ResourceBundle $ResourceBundle;
	
	@Override
	public final Resposta<T> executar() {
		
		$Configuracao = this.getClass().getAnnotation( BasicoServicoConf.class );
		$Resposta     = new Resposta<>();
		
		try{
			
			if( lid == null ) lid = IpeRoxo.getLinguagem();
			$ResourceBundle = IpeRoxo.getResourceBundle( lid );

			if( zid == null ) zid = IpeRoxo.getZonaTempo();
			
			if( is$BancoDeDados() && IpeRoxo.getEntityManagerFactory() != null ){
				$BancoDeDados = new BancoDeDados( get$Transacoes() );
			}
			
			try{
				
				if( is$Validacao() && ! validar() ){
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
	 * {@link Resposta#setExito(boolean)} será determinada automaticamente, sendo <code>false</code>
	 * quando este método disparar uma {@link Exception}.<br>
	 * Se {@link BasicoServicoConf#commit()}, será feito um {@link BancoDeDados#commit()} (se êxito) ou um {@link BancoDeDados#rollback()}.
	 */
	protected abstract void processar() throws IOException;
	
	/**
	 * Atividade pré-{@link #processar() processamento}.<br>
	 * {@link Exception}s são desconsideradas.
	 */
	protected void preProcessamento() {
	}
	
	/**
	 * Atividade pós-{@link #processar() processamento}.<br>
	 * {@link Exception}s são desconsideradas.
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
	 * {@link ValidacaoUtil#validar(Object, java.util.List, ResourceBundle, String...) Validação}
	 * deste {@link BasicoServico} considerando seus próprios recursos.
	 * @see ValidacaoUtil#validar(Object, java.util.List, ResourceBundle, String...)
	 */
	public boolean validar()
		throws IllegalAccessException, InstantiationException, InvocationTargetException {
		
		return ValidacaoUtil.validar(
			this,
			$Resposta.getMensagens(),
			$ResourceBundle,
			get$Omissao()
		);

	}
	
	/**
	 * {@link ValidacaoUtil#validar(Object, java.util.List, boolean, java.util.Map, ResourceBundle, String...) Validação}
	 * deste {@link BasicoServico} considerando seus próprios recursos.
	 * @see ValidacaoUtil#validar(Object, java.util.List, boolean, java.util.Map, ResourceBundle, String...)
	 */
	public boolean validar( boolean recursivamente, String... desconsiderar )
		throws IllegalAccessException, InstantiationException, InvocationTargetException {
		
		return ValidacaoUtil.validar(
			this,
			$Resposta.getMensagens(),
			recursivamente,
			null,
			$ResourceBundle,
			desconsiderar
		);

	}

	/**
	 * {@link ValidacaoUtil#validar(Object, java.util.List, boolean, java.util.Map, ResourceBundle, String...) Validação}
	 * de um {@link Object objeto} qualquer considerando os recursos deste {@link BasicoServico}.
	 * @see ValidacaoUtil#validar(Object, java.util.List, boolean, java.util.Map, ResourceBundle, String...)
	 */
	public boolean validar( Object objeto, boolean recursivamente, String... desconsiderar )
		throws IllegalAccessException, InstantiationException, InvocationTargetException {
		
		return ValidacaoUtil.validar(
			objeto,
			$Resposta.getMensagens(),
			recursivamente,
			null,
			$ResourceBundle,
			desconsiderar
		);

	}

	/**
	 * {@link ValidacaoUtil#validar(Object, String, java.util.List, boolean, java.util.Map, ResourceBundle, java.util.Set) Validação}
	 * de um {@link Field campo} de {@link Object objeto} qualquer considerando os recursos deste {@link BasicoServico}.
	 * @see ValidacaoUtil#validar(Object, String, java.util.List, boolean, java.util.Map, ResourceBundle, java.util.Set)
	 */
	public boolean validar( Object objeto, String campo, boolean recursivamente )
		throws IllegalAccessException, InstantiationException, InvocationTargetException, NoSuchFieldException {
		
		return ValidacaoUtil.validar(
			objeto,
			campo,
			$Resposta.getMensagens(),
			recursivamente,
			null,
			$ResourceBundle,
			null
		);

	}

	/**
	 * Encerra a {@link #executar() execução} do {@link BasicoServico} através de {@link IOException},
	 * definindo na {@link Resposta} um {@link Resposta#setCodigo(int) código} e
	 * uma {@link Resposta#mais(Mensagem.Tipo, String, Serializable) mensagem} de {@link Mensagem.Tipo#ERRO erro}.
	 * @param chave Chave do {@link IpeRoxo#getCodigo(String) código} e da {@link IpeRoxo#getMensagem(String, String, Object...) mensagem} de {@link Mensagem.Tipo#ERRO erro}.
	 * @param parametros Parâmetros para {@link IpeRoxo#getMensagem(String, String, Object...)}.
	 * @throws IOException disparada incondicionalmente, a fim de encerrar a {@link #executar() execução} do {@link BasicoServico}.
	 */
	protected void retornarErro( String chave, Object... parametros ) throws IOException {
		if( StringUtil.tamanho( chave ) == 0 ) throw new IllegalArgumentException();
		if( chave.charAt( 0 ) == '$' ) chave = chave.substring( 1 );
		$Resposta.setCodigo( IpeRoxo.getCodigo( chave ) );
		$Resposta.mais( Mensagem.Tipo.ERRO, null, getMensagem( chave, parametros ) );
		throw new IOException();
	}
	
}
