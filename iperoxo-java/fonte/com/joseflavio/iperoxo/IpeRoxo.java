
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

import com.joseflavio.copaiba.Copaiba;
import com.joseflavio.copaiba.CopaibaException;
import com.joseflavio.urucum.texto.StringUtil;
import org.apache.commons.dbcp2.BasicDataSource;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.sql.DataSource;
import java.io.*;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;

/**
 * Ipê-roxo: Modelo de aplicação de {@link Copaiba}.
 * @author José Flávio de Souza Dias Júnior
 */
public final class IpeRoxo {
	
	private static final Properties configuracaoGeral = new Properties();
	
	private static final Properties configuracao = new Properties();
	
	private static final Map<String,ResourceBundle> mensagens = new HashMap<>();
	
	private static BasicDataSource dataSource;
	
	private static EntityManagerFactory emf;
	
	private static Copaiba copaiba;
	
	private static final Logger log = LogManager.getLogger( IpeRoxo.class.getPackage().getName() );
	
	/**
	 * Método inicial.
	 */
	public static void main( String[] args ) {
		
		try{
			
			log.info( getMensagem( null, "$Log.Inicio" ) );
			
			executarConfiguracaoGeral();
			executarConfiguracao( args );
			executarFonteDeDados();
			
			if( Boolean.parseBoolean( getPropriedade( "IpeRoxo.FinalizarAposDataSource" ) ) ){
				log.info( getMensagem( null, "$Log.FinalizandoAposDataSource" ) );
				System.exit( 0 );
			}
			
			executarInicializacao();
			executarCopaiba();
			
		}catch( Exception e ){
			log.error( e.getMessage(), e );
			System.exit( 1 );
		}
		
	}
	
	/**
	 * ~/Iperoxo.properties
	 */
	private static void executarConfiguracaoGeral() throws IOException {
		
		File arquivo = new File( System.getProperty( "user.home" ), "Iperoxo.properties" );
		if( ! arquivo.exists() ) return;
		
		try( Reader texto = new InputStreamReader( new FileInputStream( arquivo ), "UTF-8" ) ){
			configuracaoGeral.load( texto );
		}
		
	}
	
	/**
	 * Configura a aplicação conforme os argumentos passados por linha de comando.
	 */
	private static void executarConfiguracao( String[] args ) throws IOException {
		
		InputStream conf = null;
		
		if( args.length >= 1 ){
			
			File arquivo = new File( args[0] );
			log.info( getMensagem( null, "$Log.Carregando.Configuracao" ) + ": " + arquivo.getAbsolutePath() );
			
			if( arquivo.exists() ){
				conf = new FileInputStream( arquivo );
			}else{
				throw new IOException( getMensagem( null, "$Arquivo.Inexistente" ) + ": " + arquivo.getAbsolutePath() );
			}
			
		}else{
			
			log.info( getMensagem( null, "$Log.Carregando.Configuracao.Padrao" ) );
			conf = IpeRoxo.class.getResourceAsStream( "/Configuracao.properties" );
			
		}
		
		try( Reader texto = new InputStreamReader( conf, "UTF-8" ) ){
			configuracao.load( texto );
		}
		
	}
	
	/**
	 * Inicia a {@link DataSource} e a {@link EntityManagerFactory}.
	 */
	private static void executarFonteDeDados() throws IOException, NamingException {
		
		if( Boolean.parseBoolean( getPropriedade( "DataSource.Enable" ) ) ){
			log.info( getMensagem( null, "$Log.Iniciando.DataSource" ) );
		}else{
			return;
		}

		System.setProperty( Context.INITIAL_CONTEXT_FACTORY, "org.apache.naming.java.javaURLContextFactory" );
		System.setProperty( Context.URL_PKG_PREFIXES, "org.apache.naming" );
		
		dataSource = new BasicDataSource();
		dataSource.setDriverClassName( getPropriedade( "DataSource.Driver" ) );
		dataSource.setUrl( getPropriedade( "DataSource.URL" ) );
		dataSource.setUsername( getPropriedade( "DataSource.Username" ) );
		dataSource.setPassword( getPropriedade( "DataSource.Password" ) );
		dataSource.setInitialSize( Integer.parseInt( getPropriedade( "DataSource.InitialSize" ) ) );
		dataSource.setMaxTotal( Integer.parseInt( getPropriedade( "DataSource.MaxTotal" ) ) );
		dataSource.setMinIdle( Integer.parseInt( getPropriedade( "DataSource.MinIdle" ) ) );
		dataSource.setMaxIdle( Integer.parseInt( getPropriedade( "DataSource.MaxIdle" ) ) );
		dataSource.setTestOnCreate( Boolean.parseBoolean( getPropriedade( "DataSource.TestOnCreate" ) ) );
		dataSource.setTestWhileIdle( Boolean.parseBoolean( getPropriedade( "DataSource.TestWhileIdle" ) ) );
		dataSource.setTestOnBorrow( Boolean.parseBoolean( getPropriedade( "DataSource.TestOnBorrow" ) ) );
		dataSource.setTestOnReturn( Boolean.parseBoolean( getPropriedade( "DataSource.TestOnReturn" ) ) );

		Context contexto = new InitialContext();
		try{
			contexto.bind( "FONTE", dataSource );
		}finally{
			contexto.close();
		}
		
		if( Boolean.parseBoolean( getPropriedade( "DataSource.JPA.Enable" ) ) ){
			log.info( getMensagem( null, "$Log.Iniciando.JPA" ) );
		}else{
			return;
		}
		
		emf = Persistence.createEntityManagerFactory( "JPA" );

		try{
			emf.createEntityManager().close();
		}catch( Exception e ){
			log.error( e.getMessage(), e );
		}
		
	}
	
	/**
	 * @see Inicializacao
	 */
	private static void executarInicializacao()
							throws IOException, ClassNotFoundException,
							IllegalAccessException, InstantiationException {
		
		String nome = getPropriedade( "IpeRoxo.Inicializacao" );
		if( nome == null || nome.isEmpty() ) return;
		
		log.info( getMensagem( null, "$Log.Executando.Inicializacao" ) );
		
		Class<?> classe = Class.forName( nome );
		
		try{
			
			((Inicializacao)classe.newInstance()).inicializar();
		
		}catch( InstantiationException e ){
			throw e;
		}catch( IllegalAccessException e ){
			throw e;
		}catch( Exception e ){
			if( Boolean.parseBoolean( getPropriedade( "IpeRoxo.Inicializacao.Essencial" ) ) ){
				throw e instanceof IOException ? (IOException) e : new IOException( e );
			}else{
				log.error( e.getMessage(), e );
			}
		}
		
	}
	
	/**
	 * {@link Copaiba#abrir(int, boolean) Inicia} a {@link Copaiba}.
	 */
	private static void executarCopaiba() throws IOException, CopaibaException {
		
		copaiba = new Copaiba();
		
		copaiba.setPermitirRotina( false );
		copaiba.setPublicarCertificados( false );
		copaiba.setAuditor( new PacoteAuditor() );

		int porta = 8884;
		String portaStr = getPropriedade( "Copaiba.Porta" );
		
		try{
			porta = Integer.parseInt( portaStr );
		}catch( NumberFormatException e ){
			try{
				porta = Integer.parseInt( configuracaoGeral.getProperty( portaStr ) );
			}catch( NumberFormatException f ){
			}
		}
		
		boolean segura = Boolean.parseBoolean( getPropriedade( "Copaiba.Segura" ) );
		
		log.info( getMensagem( null, "$Log.Iniciando.Copaiba", porta ) );
		
		copaiba.abrir( porta, segura );
		
	}
	
	/**
	 * {@link ResourceBundle} correspondente a uma {@link Locale}.
	 * @param linguagem Veja {@link Locale#toString()}. Opcional.
	 * @see StringUtil#formatarMensagem(ResourceBundle, String, Object...)
	 * @see #getMensagem(String, String, Object...)
	 */
	public static ResourceBundle getResourceBundle( String linguagem ) throws IOException {
		
		if( linguagem == null ) linguagem = Locale.getDefault().toString();
		
		ResourceBundle rb = mensagens.get( linguagem );
		if( rb != null ) return rb;
		
		if( linguagem.indexOf( '_' ) > 0 ){
			return getResourceBundle( linguagem.replace( '_', '-' ) );
		}
		
		InputStream is = IpeRoxo.class.getResourceAsStream( "/Mensagens_" + linguagem + ".properties" );
		if( is != null ){
			try{
				rb = new PropertyResourceBundle( new InputStreamReader( is, "UTF-8" ) );
				mensagens.put( linguagem, rb );
				return rb;
			}catch( UnsupportedEncodingException e ){
				throw new IOException( e );
			}
		}
		
		int traco = linguagem.indexOf( '-' );
		rb = traco > 0 ? getResourceBundle( linguagem.substring( 0, traco ) ) : getResourceBundle( "pt-BR" );
		mensagens.put( linguagem, rb );
		return rb;
		
	}
	
	/**
	 * @param linguagem Veja {@link Locale#toString()}. Opcional.
	 * @see StringUtil#formatarMensagem(ResourceBundle, String, Object...)
	 * @see #getResourceBundle(String)
	 */
	public static String getMensagem( String linguagem, String mensagem, Object... parametros ) throws IOException, MissingResourceException {
		return StringUtil.formatarMensagem( getResourceBundle( linguagem ), mensagem, parametros );
	}
	
	/**
	 * Obtém uma propriedade da aplicação.
	 * @see Properties#getProperty(String)
	 */
	public static String getPropriedade( String chave ) {
		return configuracao.getProperty( chave );
	}

	/**
	 * Determina o valor de uma propriedade da aplicação.<br>
	 * A alteração não será persistida, tendo efeito apenas durante o tempo de execução corrente.
	 * @see #getPropriedade(String)
	 */
	public static void setPropriedade( String chave, String valor ) {
		configuracao.setProperty( chave, valor );
	}
	
	/**
	 * {@link DataSource}, se "DataSource.Enable"
	 */
	public static DataSource getDataSource() {
		return dataSource;
	}
	
	/**
	 * {@link DataSource#getConnection()}, se "DataSource.Enable"
	 */
	public static Connection getConnection() throws SQLException {
		return dataSource != null ? dataSource.getConnection() : null;
	}
	
	/**
	 * {@link EntityManagerFactory}, se "DataSource.Enable" e "DataSource.JPA.Enable"
	 */
	public static EntityManagerFactory getEntityManagerFactory() {
		return emf;
	}
	
	/**
	 * {@link IpeRoxo} está inicializada e publicamente disponível?
	 * @see Copaiba#isAberta()
	 */
	public static boolean isDisponivel() {
		return copaiba != null && copaiba.isAberta();
	}
	
	/**
	 * {@link Logger} da aplicação.
	 */
	public static Logger getLog() {
		return log;
	}
	
}
