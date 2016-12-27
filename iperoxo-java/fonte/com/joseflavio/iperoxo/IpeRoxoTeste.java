
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
import java.sql.Connection;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;

import com.joseflavio.urucum.texto.StringUtil;

/**
 * Base de testes de {@link Servico}s {@link IpeRoxo}.
 * @author Jos� Fl�vio de Souza Dias J�nior
 */
@FixMethodOrder(MethodSorters.JVM)
public class IpeRoxoTeste {

	/**
	 * Inicializa o {@link IpeRoxo} atrav�s de {@link IpeRoxo#main(String[])} e
	 * espera por {@link IpeRoxo#isDisponivel()}.<br>
	 * Deve-se chamar este m�todo preferencialmente em {@link BeforeClass}.
	 */
	protected static void inicializarIpeRoxo() throws IOException, InterruptedException {
		
		new Thread( () -> {
			IpeRoxo.main( new String[0] );			
		} ).start();
		
		while( ! IpeRoxo.isDisponivel() ){
			Thread.sleep( 10 );
		}
		
	}
	
	@Test
	public void testarConfiguracao() throws IOException {
		Assert.assertNotEquals( 0, StringUtil.tamanho( IpeRoxo.getPropriedade( "Copaiba.Porta" ) ) );
		Assert.assertNotEquals( 0, StringUtil.tamanho( IpeRoxo.getPropriedade( "Copaiba.Segura" ) ) );
		Assert.assertNotEquals( 0, StringUtil.tamanho( IpeRoxo.getPropriedade( "Copaiba.Auditor.Raiz" ) ) );
	}
	
	@Test
	public void testarMensagem() throws IOException {
		Assert.assertEquals( "Aplica��o Ip�-roxo!", IpeRoxo.getMensagem( "pt-BR", "$IpeRoxo.Exemplo.Teste", "Ip�-roxo" ) );
		Assert.assertEquals( "Ip�-roxo application!", IpeRoxo.getMensagem( "en", "$IpeRoxo.Exemplo.Teste", "Ip�-roxo" ) );
	}
	
	@Test
	public void testarDataSource() throws IOException {
		if( Boolean.parseBoolean( IpeRoxo.getPropriedade( "DataSource.Enable" ) ) ){
			try( Connection con = IpeRoxo.getConnection() ){
				Assert.assertTrue( ! con.isClosed() );
			}catch( Exception e ){
				Assert.fail();
			}
		}
	}
	
}
