
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
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.Set;

/**
 * {@link Servico} b�sico que monta uma {@link Resposta} enquanto utiliza, opcionalmente, um {@link BancoDeDados}.
 * @author Jos� Fl�vio de Souza Dias J�nior
 */
public abstract class BasicoServico <T extends Serializable> extends Servico<T> {
	
	@Override
	public final Resposta<T> executar() {
		Resposta<T> resp = new Resposta<T>();
		try{
			BancoDeDados bd = null;
			if( isNecessarioBancoDeDados() && IpeRoxo.getEntityManagerFactory() != null ){
				bd = new BancoDeDados();
			}
			try{
				ResourceBundle rb = IpeRoxo.getResourceBundle( lid );
				if( isNecessarioValidar() && ! ValidacaoUtil.validar( this, resp.getMensagens(), rb ) ){
					throw new IOException();
				}
				executar( resp, bd, rb );
				if( bd != null && isNecessarioAutoCommit() ) bd.commit();
			}catch( Exception e ){
				if( bd != null && isNecessarioAutoCommit() ) bd.rollback();
				throw e;
			}finally{
				if( bd != null ) bd.close();
			}
			resp.setExito( true );
		}catch( Exception e ){
			resp.setExito( false );
			if( resp.getMensagens().size() == 0 && StringUtil.tamanho( e.getMessage() ) > 0 ){
				resp.mais( Tipo.ERRO, null, e.getMessage() );
			}
		}
		return resp;
	}
	
	/**
	 * Montagem da {@link Resposta} deste {@link Servico}.<br>
	 * {@link Resposta#setExito(boolean)} ser� determinada automaticamente, sendo <code>false</code>
	 * quando este m�todo disparar uma {@link Exception}.<br>
	 * Se {@link #isNecessarioAutoCommit()}, ser� feito um {@link BancoDeDados#commit()} (se �xito) ou um {@link BancoDeDados#rollback()}.
	 * @param resp {@link Resposta} que ser� enviada ao {@link CopaibaConexao cliente}.
	 * @param bd {@link BancoDeDados} do {@link IpeRoxo}, se existente e {@link #isNecessarioBancoDeDados() necess�rio}.
	 * @param rb {@link ResourceBundle} correspondente ao {@link #getLid()}.
	 */
	public abstract void executar( Resposta<T> resp, BancoDeDados bd, ResourceBundle rb ) throws IOException;
	
	/**
	 * � necess�rio {@link ValidacaoUtil#validar(Object, List, boolean, Map, ResourceBundle, Set) validar} este {@link Servico}?
	 * @see ValidacaoUtil#validar(Object, List, boolean, Map, ResourceBundle, Set)
	 */
	protected boolean isNecessarioValidar() {
		return true;
	}
	
	/**
	 * Este {@link Servico} necessita de {@link BancoDeDados}?
	 */
	protected boolean isNecessarioBancoDeDados() {
		return true;
	}
	
	/**
	 * Este {@link Servico} necessita de {@link BancoDeDados#commit()} ou {@link BancoDeDados#rollback()} autom�tico?
	 */
	protected boolean isNecessarioAutoCommit() {
		return true;
	}
	
	/**
	 * Encerra a {@link #executar(Resposta, BancoDeDados, ResourceBundle) execu��o} do {@link Servico} atrav�s de {@link IOException},
	 * definindo opcionalmente na {@link Resposta} um {@link Resposta#setCodigo(int) c�digo} e/ou
	 * uma {@link Resposta#mais(Mensagem.Tipo, String, Serializable) mensagem} de {@link Mensagem.Tipo#ERRO erro}.
	 * @param resposta {@link Resposta} em constru��o.
	 * @param codigo Chave do c�digo a retornar, conforme {@link IpeRoxo#getCodigo(String)}. Opcional.
	 * @param mensagem Mensagem de {@link Mensagem.Tipo#ERRO erro} a retornar, conforme {@link IpeRoxo#getMensagem(String, String, Object...)}. Opcional.
	 * @param parametros Par�metros para {@link IpeRoxo#getMensagem(String, String, Object...)}.
	 * @throws IOException disparada incondicionalmente, a fim de encerrar a {@link #executar() execu��o} do {@link Servico}.
	 */
	protected void retornarErro( Resposta resposta, String codigo, String mensagem, Object... parametros ) throws IOException {
		if( codigo != null ){
			resposta.setCodigo( IpeRoxo.getCodigo( codigo ) );
		}
		if( mensagem != null ){
			resposta.mais( Mensagem.Tipo.ERRO, null, getMensagem( mensagem, parametros ) );
		}
		throw new IOException();
	}
	
	/**
	 * Executa {@link #retornarErro(Resposta, String, String, Object...)}, utilizando
	 * a chave de {@link IpeRoxo#getCodigo(String)} tamb�m como chave da
	 * {@link IpeRoxo#getMensagem(String, String, Object...) mensagem} de {@link Mensagem.Tipo#ERRO erro}.
	 * @see #retornarErro(Resposta, String, String, Object...)
	 */
	protected void retornarErro( Resposta resposta, String codigo, Object... parametros ) throws IOException {
		retornarErro( resposta, codigo, "$" + codigo, parametros );
	}
	
}
