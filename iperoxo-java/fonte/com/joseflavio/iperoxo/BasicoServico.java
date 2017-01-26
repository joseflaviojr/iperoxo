
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

package com.joseflavio.iperoxo;

import java.io.IOException;
import java.io.Serializable;
import java.util.ResourceBundle;

import com.joseflavio.copaiba.CopaibaConexao;
import com.joseflavio.urucum.comunicacao.Mensagem.Tipo;
import com.joseflavio.urucum.comunicacao.Resposta;
import com.joseflavio.urucum.texto.StringUtil;

/**
 * {@link Servico} básico que monta uma {@link Resposta} enquanto utiliza, opcionalmente, um {@link BancoDeDados}.
 * @author José Flávio de Souza Dias Júnior
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
				executar( resp, bd, IpeRoxo.getResourceBundle( lid ) );
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
	 * {@link Resposta#setExito(boolean)} será determinada automaticamente, sendo <code>false</code>
	 * quando este método disparar uma {@link Exception}.<br>
	 * Se {@link #isNecessarioAutoCommit()}, será feito um {@link BancoDeDados#commit()} (se êxito) ou um {@link BancoDeDados#rollback()}.
	 * @param resp {@link Resposta} que será enviada ao {@link CopaibaConexao cliente}.
	 * @param bd {@link BancoDeDados} do {@link IpeRoxo}, se existente e {@link #isNecessarioBancoDeDados() necessário}.
	 * @param rb {@link ResourceBundle} correspondente ao {@link #getLid()}.
	 */
	public abstract void executar( Resposta<T> resp, BancoDeDados bd, ResourceBundle rb ) throws IOException;
	
	/**
	 * Este {@link Servico} necessita de {@link BancoDeDados}?
	 */
	protected boolean isNecessarioBancoDeDados() {
		return true;
	}
	
	/**
	 * Este {@link Servico} necessita de {@link BancoDeDados#commit()} ou {@link BancoDeDados#rollback()} automático?
	 */
	protected boolean isNecessarioAutoCommit() {
		return true;
	}

}
