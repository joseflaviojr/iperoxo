
/*
 *  Copyright (C) 2016-2018 José Flávio de Souza Dias Júnior
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
 *  Direitos Autorais Reservados (C) 2016-2018 José Flávio de Souza Dias Júnior
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

import com.joseflavio.copaiba.Copaiba;
import com.joseflavio.copaiba.CopaibaConexao;
import com.joseflavio.copaiba.CopaibaException;
import com.joseflavio.unhadegato.UnhaDeGato;
import com.joseflavio.urucum.arquivo.ResourceBundleCharsetControl;
import com.joseflavio.urucum.comunicacao.Resposta;
import com.joseflavio.urucum.comunicacao.SocketServidor;
import com.joseflavio.urucum.json.JSON;
import com.joseflavio.urucum.texto.StringUtil;
import org.apache.commons.dbcp2.BasicDataSource;
import org.apache.commons.io.IOUtils;
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
 * Ipê-roxo: Modelo de software multicamada.
 * @author José Flávio de Souza Dias Júnior
 */
public final class IpeRoxo {
	
	private static final Properties configuracaoGeral = new Properties();
	
	private static final Properties configuracao = new Properties();
	
	private static final Map<String,ResourceBundle> mensagens = new HashMap<>();
	
	private static final Map<String,Integer> codigos = new HashMap<>();
	
	private static BasicDataSource dataSource;
	
	private static EntityManagerFactory emf;
	
	private static Copaiba copaiba;
	
	private static final Logger log = LogManager.getLogger( IpeRoxo.class.getPackage().getName() );
	
	/**
	 * Método inicial.
	 */
	public static void main( String[] args ) {
		
		try{
			
			log.info( getMensagem( null, "Log.Inicio" ) );
			
			executarConfiguracaoGeral();
			executarConfiguracao( args );
			executarFonteDeDados();
			
			if( Boolean.parseBoolean( getPropriedade( "IpeRoxo.FinalizarAposDataSource" ) ) ){
				log.info( getMensagem( null, "Log.FinalizandoAposDataSource" ) );
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
		
		// Configuracao.Padrao.properties
		
		InputStream conf = IpeRoxo.class.getResourceAsStream( "/Configuracao.Padrao.properties" );
		try( Reader texto = new InputStreamReader( conf, "UTF-8" ) ){
			configuracao.load( texto );
		}
		
		// Configuracao.properties
		
		if( args.length >= 1 ){
			
			File arquivo = new File( args[0] );
			log.info( getMensagem( null, "Log.Carregando.Configuracao" ) + ": " + arquivo.getAbsolutePath() );
			
			if( ! arquivo.exists() ){
				try(
					InputStream  is = IpeRoxo.class.getResourceAsStream( "/Configuracao.properties" );
					OutputStream os = new FileOutputStream( arquivo );
				){
					IOUtils.copy( is, os );
				}
			}
			
			conf = new FileInputStream( arquivo );
			
		}else{
			
			log.info( getMensagem( null, "Log.Carregando.Configuracao.Padrao" ) );
			conf = IpeRoxo.class.getResourceAsStream( "/Configuracao.properties" );
			
		}
		
		try( Reader texto = new InputStreamReader( conf, "UTF-8" ) ){
			configuracao.load( texto );
		}
		
		// Codigos.properties
		
		conf = IpeRoxo.class.getResourceAsStream( "/Codigos.properties" );
		if( conf != null ){
			Properties props = new Properties();
			try( Reader texto = new InputStreamReader( conf, "UTF-8" ) ){
				props.load( texto );
			}
			for( Object chave : props.keySet() ){
				String nome = chave.toString();
				codigos.put( nome, Integer.parseInt( props.getProperty( nome ) ) );
			}
		}
		
	}
	
	/**
	 * Inicia a {@link DataSource} e a {@link EntityManagerFactory}.
	 */
	private static void executarFonteDeDados() throws IOException, NamingException {
		
		if( Boolean.parseBoolean( getPropriedade( "DataSource.Enable" ) ) ){
			log.info( getMensagem( null, "Log.Iniciando.DataSource" ) );
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
		
		while( true ){
			try( Connection con = getConnection() ){
				break;
			}catch( Exception e ){
				try{
					Thread.sleep( 2000 );
				}catch( InterruptedException f ){
				}
			}
		}
		
		if( Boolean.parseBoolean( getPropriedade( "DataSource.JPA.Enable" ) ) ){
			log.info( getMensagem( null, "Log.Iniciando.JPA" ) );
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
		
		log.info( getMensagem( null, "Log.Executando.Inicializacao" ) );
		
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
		copaiba.setPermitirMensagem( false );
		copaiba.setPermitirLeitura( false );
		copaiba.setPermitirAtribuicao( false );
		copaiba.setPermitirRemocao( false );
		copaiba.setPermitirTransferencia( false );
		
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
		
		log.info( getMensagem( null, "Log.Iniciando.Copaiba", porta ) );
		
		copaiba.abrir( new SocketServidor( porta, segura, true ) );
		
	}
	
	/**
	 * {@link ResourceBundle} correspondente a uma {@link Locale}.<br>
	 * {@link ResourceBundle#getBaseBundleName()} == {@link #getPropriedade(String) propriedade} "ResourceBundle.BaseName"<br>
	 * {@link PropertyResourceBundle}'s (arquivos ".properties") devem estar codificados conforme {@link #getPropriedade(String) propriedade} "ResourceBundle.Charset". Veja {@link ResourceBundleCharsetControl}.
	 * @param linguagem Formato IETF BCP 47. Veja {@link Locale#toLanguageTag()}. {@code null} ou {@code vazio} == {@link IpeRoxo#getPropriedade(String) propriedade} "ResourceBundle.Locale.Default".
	 * @see #getMensagem(String, String, Object...)
	 */
	public static ResourceBundle getResourceBundle( String linguagem ) throws IOException {
		
		final boolean padrao = StringUtil.tamanho( linguagem ) == 0;
		
		if( padrao ) linguagem = getPropriedade( "ResourceBundle.Locale.Default", "pt" );
		else linguagem = linguagem.replace( '_', '-' );
		
		ResourceBundle rb = mensagens.get( linguagem );
		if( rb != null ) return rb;
		
		String baseName = getPropriedade( "ResourceBundle.BaseName", "Mensagens" );
		
		try{
			
			rb = ResourceBundle.getBundle(
                baseName,
                Locale.forLanguageTag( linguagem ),
                new ResourceBundleCharsetControl( getPropriedade( "ResourceBundle.Charset", "UTF-8" ) )
            );
			
			mensagens.put( linguagem, rb );
			return rb;
			
		}catch( MissingResourceException e ){
			
			if( padrao ){
				throw new IOException( e );
			}else{
				return getResourceBundle( null );
			}
			
		}
		
	}
	
	/**
	 * @param linguagem Veja {@link Locale#toLanguageTag()}. Opcional.
	 * @see StringUtil#formatar(ResourceBundle, String, Object...)
	 * @see #getResourceBundle(String)
	 */
	public static String getMensagem( String linguagem, String mensagem, Object... parametros ) throws IOException, MissingResourceException {
		return StringUtil.formatar( getResourceBundle( linguagem ), mensagem, parametros );
	}
	
	/**
	 * Busca por um código inteiro definido em "Codigos.properties".<br>
	 * Código normalmente representa um estado do sistema, seja de progressão ou de erro.
	 * @return 0, se código indefinido.
	 * @see Resposta#getCodigo()
	 */
	public static int getCodigo( String chave ) {
		Integer codigo = codigos.get( chave );
		return codigo != null ? codigo : 0;
	}
	
	/**
	 * Obtém uma propriedade da aplicação.
	 * @param chave Chave da propriedade.
	 * @see Properties#getProperty(String)
	 */
	public static String getPropriedade( String chave ) {
		return configuracao.getProperty( chave );
	}
	
	/**
	 * Obtém uma propriedade da aplicação.
	 * @param chave Chave da propriedade.
	 * @param nulo Valor a retornar, se propriedade nula ou indefinida.
	 * @see Properties#getProperty(String)
	 */
	public static String getPropriedade( String chave, String nulo ) {
		String valor = configuracao.getProperty( chave );
		return valor != null ? valor : nulo;
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
	 * {@link UnhaDeGato}
	 * @param nome Identificação da {@link UnhaDeGato} desejada.
	 * @see #getUnhaDeGato()
	 */
	public static UnhaDeGato getUnhaDeGato( String nome ) {
		
		String  udgEndereco = getPropriedade( "UnhaDeGato." + nome + ".Endereco" );
		int     udgPorta    = Integer.parseInt( getPropriedade( "UnhaDeGato." + nome + ".Porta" ) );
		boolean udgSegura   = Boolean.parseBoolean( getPropriedade( "UnhaDeGato." + nome + ".Segura" ) );
		boolean udgIgnorar  = Boolean.parseBoolean( getPropriedade( "UnhaDeGato." + nome + ".IgnorarCertificado" ) );
		
		return new UnhaDeGato( udgEndereco, udgPorta, udgSegura, udgIgnorar );
		
	}
	
	/**
	 * {@link UnhaDeGato} "Principal".
	 * @see #getUnhaDeGato(String)
	 */
	public static UnhaDeGato getUnhaDeGato() {
		return getUnhaDeGato( "Principal" );
	}
	
	/**
	 * @see UnhaDeGato#solicitar(String, String, String, String)
	 * @see CopaibaConexao#solicitar(String, String, String)
	 */
	public static JSON solicitar( UnhaDeGato unhaDeGato, String copaiba, String classe, JSON estado, String metodo ) throws IOException {
		return new JSON( unhaDeGato.solicitar(
			copaiba,
			classe,
			estado.toString(),
			metodo
		) );
	}
	
	/**
	 * @see #getUnhaDeGato()
	 * @see #solicitar(UnhaDeGato, String, String, JSON, String)
	 */
	public static JSON solicitar( String copaiba, String classe, JSON estado, String metodo ) throws IOException {
		return solicitar( getUnhaDeGato(), copaiba, classe, estado, metodo );
	}
	
	/**
	 * {@link #getUnhaDeGato()}, {@link Servico#executar()}.
	 * @see #getUnhaDeGato()
	 * @see Servico#executar()
	 * @see #solicitar(UnhaDeGato, String, String, JSON, String)
	 */
	public static JSON solicitar( String copaiba, String classe, JSON estado ) throws IOException {
		return solicitar( getUnhaDeGato(), copaiba, classe, estado, "executar" );
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
