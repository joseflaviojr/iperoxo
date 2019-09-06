
/*
 *  Copyright (C) 2016-2019 José Flávio de Souza Dias Júnior
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
 *  Direitos Autorais Reservados (C) 2016-2019 José Flávio de Souza Dias Júnior
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
import java.time.ZoneId;
import java.util.Locale;

import com.joseflavio.copaiba.CopaibaConexao;
import com.joseflavio.urucum.comunicacao.Resposta;

/**
 * Base, não obrigatória, para serviços a serem expostos através de {@link CopaibaConexao#solicitar(String, String, String)}.
 * @author José Flávio de Souza Dias Júnior
 */
public abstract class Servico <T extends Serializable> {
	
	protected String sid;
	
	protected String lid;

	protected String zid;
	
	protected String tid;
	
	protected String $CopaibaEstado;
	
	protected Servico() {
	}
	
	/**
	 * Executa este {@link Servico} e retorna uma {@link Resposta}.
	 */
	public abstract Resposta<T> executar();
	
	/**
	 * Identificador da sessão.
	 */
	public String getSid() {
		return sid;
	}

	public Servico<T> setSid( String sid ) {
		this.sid = sid;
		return this;
	}

	/**
	 * Linguagem do usuário no formato IETF BCP 47.
	 * @see Locale#toLanguageTag()
	 * @see IpeRoxo#getLinguagem()
	 * @see IpeRoxo#getResourceBundle(String)
	 * @see IpeRoxo#getMensagem(String, String, Object...)
	 */
	public String getLid() {
		return lid;
	}
	
	/**
	 * @see #getLid()
	 */
	public Servico<T> setLid( String lid ) {
		this.lid = lid;
		return this;
	}

	/**
	 * Zona de tempo do usuário.
	 * @see ZoneId#of(String)
	 * @see IpeRoxo#getZonaTempo()
	 */
	public String getZid() {
		return zid;
	}
	
	/**
	 * @see #getZid()
	 */
	public Servico<T> setZid( String zid ) {
		this.zid = zid;
		return this;
	}

	/**
	 * Identificador da tela corrente.
	 */
	public String getTid() {
		return tid;
	}

	public Servico<T> setTid( String tid ) {
		this.tid = tid;
		return this;
	}
	
	/**
	 * Estado serializado deste {@link Servico}, no formato JSON.
	 */
	public String get$CopaibaEstado() {
		return $CopaibaEstado;
	}
	
	/**
	 * @see #get$CopaibaEstado()
	 */
	public void set$CopaibaEstado( String $CopaibaEstado ) {
		this.$CopaibaEstado = $CopaibaEstado;
	}
	
	/**
	 * Atalho para {@link IpeRoxo#getMensagem(String, String, Object...)}, em conjunto com {@link #getLid()}.
	 */
	protected String getMensagem( String mensagem, Object... parametros ) throws IOException {
		return IpeRoxo.getMensagem( lid, mensagem, parametros );
	}
	
}
