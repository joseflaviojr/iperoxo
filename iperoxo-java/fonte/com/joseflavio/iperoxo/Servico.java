
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

import java.io.IOException;
import java.io.Serializable;
import java.util.Locale;

import com.joseflavio.copaiba.CopaibaConexao;
import com.joseflavio.urucum.comunicacao.Resposta;

/**
 * Base para servi�os a serem expostos atrav�s de {@link CopaibaConexao#solicitar(String, String, String)}.
 * @author Jos� Fl�vio de Souza Dias J�nior
 */
public abstract class Servico <T extends Serializable> {
	
	protected String sid;
	
	protected String tid;
	
	protected String lid;
	
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

	public void setSid( String sid ) {
		this.sid = sid;
	}

	/**
	 * Identificador da tela corrente.
	 */
	public String getTid() {
		return tid;
	}

	public void setTid( String tid ) {
		this.tid = tid;
	}
	
	/**
	 * Linguagem do usu�rio.
	 * @see Locale
	 * @see IpeRoxo#getResourceBundle(String)
	 * @see IpeRoxo#getMensagem(String, String, Object...)
	 */
	public String getLid() {
		return lid;
	}

	public void setLid( String lid ) {
		this.lid = lid;
	}
	
	/**
	 * Atalho para {@link IpeRoxo#getMensagem(String, String, Object...)}, em conjunto com {@link #getLid()}.
	 */
	protected String getMensagem( String mensagem, Object... parametros ) throws IOException {
		return IpeRoxo.getMensagem( lid, mensagem, parametros );
	}
	
}
