
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
import com.joseflavio.urucum.comunicacao.Resposta;

import java.io.IOException;
import java.io.Serializable;
import java.util.Locale;

/**
 * Base, n�o obrigat�ria, para servi�os a serem expostos atrav�s de {@link CopaibaConexao#solicitar(String, String, String)}.
 * @author Jos� Fl�vio de Souza Dias J�nior
 */
public abstract class Servico <T extends Serializable> {
	
	protected String sid;
	
	protected String tid;
	
	protected String lid;
	
	protected String $CopaibaEstado;
	
	protected Servico() {
	}
	
	/**
	 * Executa este {@link Servico} e retorna uma {@link Resposta}.
	 */
	public abstract Resposta<T> executar();
	
	/**
	 * Identificador da sess�o.
	 */
	public String getSid() {
		return sid;
	}

	public Servico<T> setSid( String sid ) {
		this.sid = sid;
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
	 * Linguagem do usu�rio, no formato IETF BCP 47.
	 * @see Locale#toLanguageTag()
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
