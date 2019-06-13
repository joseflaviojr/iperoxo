
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

import com.joseflavio.urucum.texto.StringUtil;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;

import java.io.IOException;
import java.sql.Connection;

/**
 * Base de testes de {@link Servico}s {@link IpeRoxo}.
 * @author José Flávio de Souza Dias Júnior
 */
@FixMethodOrder(MethodSorters.JVM)
public class IpeRoxoTeste {

	/**
	 * Inicializa o {@link IpeRoxo} através de {@link IpeRoxo#main(String[])} e
	 * espera por {@link IpeRoxo#isDisponivel()}.<br>
	 * Deve-se chamar este método preferencialmente em {@link BeforeClass}.
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
		Assert.assertEquals( "Aplicação Ipê-roxo!", IpeRoxo.getMensagem( "pt-BR", "IpeRoxo.Exemplo.Teste", "Ipê-roxo" ) );
		Assert.assertEquals( "Ipê-roxo application!", IpeRoxo.getMensagem( "en", "IpeRoxo.Exemplo.Teste", "Ipê-roxo" ) );
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
