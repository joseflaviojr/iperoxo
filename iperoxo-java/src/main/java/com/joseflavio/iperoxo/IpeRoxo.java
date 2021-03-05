
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

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.MissingResourceException;
import java.util.Properties;
import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;
import java.util.TimeZone;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.sql.DataSource;

import org.apache.commons.dbcp2.BasicDataSource;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.protobuf.ByteString;
import com.ibm.etcd.api.KeyValue;
import com.ibm.etcd.api.RangeResponse;
import com.ibm.etcd.client.EtcdClient;
import com.ibm.etcd.client.kv.KvClient;
import com.ibm.icu.text.MessageFormat;
import com.joseflavio.copaiba.Copaiba;
import com.joseflavio.copaiba.CopaibaConexao;
import com.joseflavio.copaiba.CopaibaException;
import com.joseflavio.copaiba.Erro;
import com.joseflavio.urucum.arquivo.ResourceBundleCharsetControl;
import com.joseflavio.urucum.comunicacao.Resposta;
import com.joseflavio.urucum.comunicacao.SocketServidor;
import com.joseflavio.urucum.json.JSON;
import com.joseflavio.urucum.seguranca.SegurancaUtil;
import com.joseflavio.urucum.texto.StringUtil;

/**
 * Ipê-roxo: Modelo de software multicamada.
 * @author José Flávio de Souza Dias Júnior
 */
public final class IpeRoxo {
	
	/**
	 * Configuracao.properties
	 */
	private static File configuracaoArquivo;

	/**
	 * {@link Properties} correspondente a Configuracao.properties
	 */
	private static final Properties configuracao = new Properties();

	/**
	 * Fragmentos.txt
	 */
	private static final Map<String,String> fragmentos = new HashMap<>();
	
	/**
	 * Mensagens_pt.properties, Mensagens_en.properties, etc.
	 */
	private static final Map<String,ResourceBundle> mensagens = new HashMap<>();

	/**
	 * Codigos.properties
	 */
	private static final Map<String,Integer> codigos = new HashMap<>();

	private static EtcdClient etcdClient;

	private static Copaiba copaiba;
	
	private static BasicDataSource dataSource;
	
	private static EntityManagerFactory emf;

	private static String emfUnitName;

	private static PublicKey chavePublica;

	private static PrivateKey chavePrivada;
	
	private static final Logger log = LoggerFactory.getLogger( IpeRoxo.class.getPackage().getName() );
	
	/**
	 * Método inicial.
	 */
	public static void main( String[] args ) {
		
		try{
		    
		    // Configuração básica ------------------------------------------------------
		    
		    if( args.length > 0 && args[0].endsWith( ".properties" ) ){
		        configuracaoArquivo = new File( args[0] );
		    }
		    
		    carregarConfiguracao( configuracaoArquivo, configuracao, false, false );
            
            String inicializacaoNome = getPropriedade( "IpeRoxo.Inicializacao" );
            Inicializacao inicializacao = null;

            if( StringUtil.tamanho( inicializacaoNome ) > 0 ){
                inicializacao = (Inicializacao) Class.forName( inicializacaoNome ).getConstructor().newInstance();
            }
            
            if( inicializacao instanceof ProgressivaInicializacao ){
                ((ProgressivaInicializacao)inicializacao).validarArgumentos( args );
            }
            

            // Configuração completa ----------------------------------------------------
			
			log.info( getMensagem( null, "Log.Inicio" ) );

			for( int i = 0; i < 15; i++ ){
				try{
					carregarConfiguracao( configuracaoArquivo, configuracao, true, i == 0 );
					break;
				}catch( Exception e ){
					if( i == 14 ) throw e;
					else if( i == 0 ) log.error( e.getMessage() );
					Thread.sleep( 4000 );
				}
			}


			// Linguagem ----------------------------------------------------------------

			String linguagem = getPropriedade( "Locale.Default" );
		
			if( StringUtil.tamanho( linguagem ) > 0 ){
				Locale.setDefault( Locale.forLanguageTag( linguagem ) );
			}


			// Zona de Tempo ------------------------------------------------------------

			String zonatempo = getPropriedade( "TimeZone.Default" );
		
			if( StringUtil.tamanho( zonatempo ) > 0 ){
				TimeZone.setDefault( TimeZone.getTimeZone( ZoneId.of(zonatempo) ) );
			}


			// Fragmentos.txt -----------------------------------------------------------

			String      alvo = "Fragmentos.txt";
			InputStream is   = IpeRoxo.class.getResourceAsStream( "/" + alvo );

			if( is != null ){
				
				log.info( getMensagem( null, "Log.Carregando", alvo ) );

				try( BufferedReader texto = new BufferedReader( new InputStreamReader( is, "UTF-8" ) ) ){
					
					String        chave = null;
					StringBuilder valor = new StringBuilder(256);

					String linha;
					while( ( linha = texto.readLine() ) != null ){
						int tam = linha.length();
						if( tam > 2 && linha.charAt(0) == '[' && linha.charAt(tam-1) == ']' ){
							if( chave != null ){
								int ult = valor.length() - 1;
								if( valor.charAt(ult) == '\n' ) valor.deleteCharAt(ult);
								fragmentos.put( chave, valor.toString() );
								valor.delete( 0, valor.length() );
							}
							chave = linha.substring( 1, tam - 1 );
						}else if( chave != null ){
							valor.append( valor.length() > 0 ? "\n" + linha : linha );
						}
					}

					if( chave != null ){
						int ult = valor.length() - 1;
						if( valor.charAt(ult) == '\n' ) valor.deleteCharAt(ult);
						fragmentos.put( chave, valor.toString() );
						valor.delete( 0, valor.length() );
					}

				}

			}


			// Codigos.properties -------------------------------------------------------

			alvo = "Codigos.properties";
			is   = IpeRoxo.class.getResourceAsStream( "/" + alvo );

			if( is != null ){
				
				log.info( getMensagem( null, "Log.Carregando", alvo ) );

				Properties codigosProps = new Properties();
				try( Reader texto = new InputStreamReader( is, "UTF-8" ) ){
					codigosProps.load( texto );
				}

				for( Object chave : codigosProps.keySet() ){
					String nome = chave.toString();
					codigos.put( nome, Integer.parseInt( codigosProps.getProperty( nome ) ) );
				}

			}


			// Procedimentos gerais -----------------------------------------------------

			Runtime.getRuntime().addShutdownHook( new Encerrador() );


			// Chaves criptográficas ----------------------------------------------------

			try{

				log.info( getMensagem( null, "Log.Carregando", KeyPair.class.getName() ) );

				File chavePubArq = new File( getPropriedade( "Chave.Publica" ) );
				File chavePriArq = new File( getPropriedade( "Chave.Privada" ) );
	
				if( ! chavePubArq.exists() && ! chavePriArq.exists() ){
					KeyPair kp = SegurancaUtil.gerarChaveAssimetrica();
					SegurancaUtil.salvarChave( kp.getPublic(),  chavePubArq );
					SegurancaUtil.salvarChave( kp.getPrivate(), chavePriArq );
				}
				
				chavePublica = SegurancaUtil.obterChavePublica( chavePubArq );
				chavePrivada = SegurancaUtil.obterChavePrivada( chavePriArq );

			}catch( Exception e ){
				log.error( e.getMessage(), e );
			}


			// Fonte de dados -----------------------------------------------------------

			ajustarDataSource( true, true, true, true );

			if( Boolean.parseBoolean( getPropriedade( "IpeRoxo.FinalizarAposDataSource" ) ) ){
				log.info( getMensagem( null, "Log.FinalizandoAposDataSource" ) );
				System.exit( 0 );
			}


			// Copaíba: pré-inicialização -----------------------------------------------

			int     copaibaPorta    = Integer.parseInt    ( getPropriedade( "Copaiba.Porta",    "8884"  ) );
			boolean copaibaSegura   = Boolean.parseBoolean( getPropriedade( "Copaiba.Segura",   "false" ) );
			boolean copaibaExpressa = Boolean.parseBoolean( getPropriedade( "Copaiba.Expressa", "true"  ) );
		
			copaiba = new Copaiba();
		
			copaiba.setPermitirAtribuicao   ( false );
			copaiba.setPermitirLeitura      ( false );
			copaiba.setPermitirMensagem     ( false );
			copaiba.setPermitirRemocao      ( false );
			copaiba.setPermitirRotina       ( false );
			copaiba.setPermitirSolicitacao  ( true  );
			copaiba.setPermitirTransferencia( false );
			copaiba.setPublicarCertificados ( false );
			
			copaiba.setAuditor( new PacoteAuditor() );
	

			// Inicialização ------------------------------------------------------------
			
			if( inicializacao != null ) {
			    log.info( getMensagem( null, "Log.Executando.Inicializacao", inicializacaoNome ) );
			    inicializacao.inicializar();
			}

			
			// Rotinas periódicas -------------------------------------------------------

			ScheduledThreadPoolExecutor executor = new ScheduledThreadPoolExecutor( 1 );
    
			executor.scheduleWithFixedDelay(
				new Mantenedor(),
				5,
				5,
				TimeUnit.MINUTES
			);


			// Copaíba: pós-inicialização -----------------------------------------------
			
			log.info( getMensagem( null, "Log.Iniciando.Copaiba", copaibaPorta ) );
			
			if( copaibaExpressa ){
				copaiba.abrir( copaibaPorta, copaibaSegura, true );
			}else{
				copaiba.abrir( new SocketServidor( copaibaPorta, copaibaSegura, true ) );
			}
			
		}catch( Exception e ){
			log.error( e.getMessage(), e );
			System.exit( 1 );
		}
		
	}
	
	/**
	 * Carrega as propriedades definidas em arquivo e em fontes externas.
	 * @throws IOException caso ocorra uma falha, o que torna o resultado não confiável.
	 */
	private static void carregarConfiguracao( File arquivo, Properties propriedades, boolean externasEssenciais, boolean logInfo ) throws IOException {
		
		// Configuracao.Padrao.properties -----------------------------------------------
		
		InputStream conf = IpeRoxo.class.getResourceAsStream( "/Configuracao.Padrao.properties" );
		try( Reader texto = new InputStreamReader( conf, "UTF-8" ) ){
			propriedades.load( texto );
		}
		
		// Configuracao.properties ------------------------------------------------------
		
		if( arquivo != null ){

			if( logInfo ){
				log.info( getMensagem( null, "Log.Carregando.Configuracao", arquivo.getAbsolutePath() ) );
			}
			
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
			
			if( logInfo ){
				log.info( getMensagem( null, "Log.Carregando.Configuracao.Padrao" ) );
			}

			conf = IpeRoxo.class.getResourceAsStream( "/Configuracao.properties" );
			
		}
		
		try( Reader texto = new InputStreamReader( conf, "UTF-8" ) ){
			propriedades.load( texto );
		}

		// Propriedades externas --------------------------------------------------------

		List<String> propsFontes = Arrays.asList( propriedades.getProperty( "Propriedades.Fontes", "" ).split( "," ) );
		propsFontes.replaceAll( (s) -> s.trim().toLowerCase() );
		
		// etcd -------------------------------------------------------------------------

		if( propsFontes.contains( "etcd" ) ){

			try{

				if( logInfo ){
					log.info( getMensagem( null, "Log.Carregando.Propriedades", "etcd" ) );
				}

				// Conexão

				EtcdClient etcd   = getEtcd();
				KvClient   etcdKV = etcd.getKvClient();

				// Propriedades primárias prefixadas com a classe da aplicação

				if( Boolean.parseBoolean( propriedades.getProperty( "Propriedades.Classe" ) ) ){
					importarPropriedades(
						etcdKV,
						propriedades,
						propriedades.getProperty( "IpeRoxo.Aplicacao.Classe" ) + ".",
						true
					);
				}


				// Propriedades primárias prefixadas com a identificação da aplicação

				if( Boolean.parseBoolean( propriedades.getProperty( "Propriedades.Aplicacao" ) ) ){
					importarPropriedades(
						etcdKV,
						propriedades,
						propriedades.getProperty( "IpeRoxo.Aplicacao.Identificacao" ) + ".",
						true
					);
				}


				// Propriedades secundárias

				List<String> prefixos = Arrays.asList( propriedades.getProperty( "Propriedades.Prefixos", "" ).split( "," ) );
				prefixos.replaceAll( (s) -> s.trim() );

				for( String prefixo : prefixos ){
					importarPropriedades(
						etcdKV,
						propriedades,
						prefixo,
						false
					);
				}

			}catch( Exception e ){
				if( externasEssenciais ){
					if( e instanceof IOException ) throw e;
					else throw new IOException( e );
				}else{
					log.error( "etcd: " + e.getMessage() );
				}
			}
			
		}
		
	}

	private static void importarPropriedades( KvClient origem, Properties destino, String prefixo, boolean removerPrefixo ) {

		int tamanho = prefixo.length();
		if( tamanho == 0 ) return;
		if( ! removerPrefixo ) tamanho = 0;

		RangeResponse resposta = origem.get( ByteString.copyFromUtf8( prefixo ) ).asPrefix().sync();
		
		for( KeyValue kv : resposta.getKvsList() ){
			
			String chave = kv.getKey().toStringUtf8();
			String valor = kv.getValue().toStringUtf8();
			
			destino.put(
				removerPrefixo ? chave.substring( tamanho ) : chave,
				valor
			);

		}

	}
	
	/**
	 * Ajusta a {@link DataSource} e a {@link EntityManagerFactory} de acordo com a configuração corrente.
	 * @param atualizar Atualizar propriedades da {@link DataSource} que podem ser alteradas em tempo de execução?
	 * @param reiniciar Reiniciar {@link DataSource} para absorver propriedades que são imutáveis em tempo de execução?
	 * @param esperarConexao Esperar por uma conexão efetiva à {@link DataSource}? Ver {@link #getConnection()}.
	 */
	private static void ajustarDataSource( boolean atualizar, boolean reiniciar, boolean esperarConexao, boolean logInfo ) throws IOException {

		try{

			// Propriedades globais da JNDI ---------------------------------------------

			System.setProperty( Context.INITIAL_CONTEXT_FACTORY, "org.apache.naming.java.javaURLContextFactory" );
			System.setProperty( Context.URL_PKG_PREFIXES       , "org.apache.naming"                            );

			// Propriedades -------------------------------------------------------------

			boolean ds_enable     = Boolean.parseBoolean( getPropriedade( "DataSource.Enable"     ) );
			boolean jpa_enable    = Boolean.parseBoolean( getPropriedade( "DataSource.JPA.Enable" ) );
			String  jpa_unit_name = getPropriedade( "DataSource.JPA.Unit.Name" );
			String  jpa_jndi_name = getPropriedade( "DataSource.JPA.JNDI.Name" );

			BasicDataSource velhoDS = dataSource;
			BasicDataSource novoDS  = null;

			// Situação da DataSource ---------------------------------------------------

			if( ds_enable ){
				if( velhoDS == null || velhoDS.isClosed() || reiniciar ){
					if( logInfo ) log.info( getMensagem( null, "Log.Iniciando.DataSource" ) );
					novoDS = new BasicDataSource();
					setDataSourceVars0( novoDS, configuracao );
				}else{
					novoDS = velhoDS;
				}
				if( atualizar || reiniciar ){
					setDataSourceVars1( novoDS, configuracao );
				}
			}

			// Mudança de DataSource ----------------------------------------------------

			if( velhoDS != novoDS ){

				Context contexto = new InitialContext();
				try{
					contexto.rebind( jpa_jndi_name, novoDS );
				}finally{
					contexto.close();
				}

				dataSource = novoDS;

				if( velhoDS != null && ! velhoDS.isClosed() ){
					try{
						velhoDS.close();
					}catch( Exception e ){
					}
				}
				
			}

			// EntityManagerFactory -----------------------------------------------------

			if( jpa_enable ){

				if( emfUnitName == null || ! emfUnitName.equals( jpa_unit_name ) ){
					
					if( emf != null && emf.isOpen() ){
						try{
							emf.close();
						}catch( Exception e ){
						}
					}

					if( logInfo ){
						log.info( getMensagem( null, "Log.Iniciando.JPA" ) );
					}

					emf = Persistence.createEntityManagerFactory( jpa_unit_name );
					emfUnitName = jpa_unit_name;

				}

			}else if( emf != null ){

				try{
					if( emf.isOpen() ) emf.close();
				}catch( Exception e ){
				}finally{
					emf = null;
					emfUnitName = null;
				}

			}

			// Esperar conexão ----------------------------------------------------------

			if( esperarConexao && dataSource != null ){
				boolean avisar = true;
				while( true ){
					try( Connection con = getConnection() ){
						break;
					}catch( Exception e ){
						if( logInfo && avisar ){
							log.info( getMensagem( null, "Log.Esperando", "DataSource" ) );
							log.error( e.getMessage(), e );
							avisar = false;
						}
						try{
							Thread.sleep( 2000 );
						}catch( InterruptedException f ){
							break;
						}
					}
				}
			}

		}catch( Exception e ){
			if( e instanceof IOException ) throw (IOException) e;
			else throw new IOException( e );
		}
		
	}

	private static void setDataSourceVars0( BasicDataSource ds, Properties props ) {
		ds.setDriverClassName( props.getProperty( "DataSource.Driver" ) );
		ds.setUrl( props.getProperty( "DataSource.URL" ) );
		ds.setUsername( props.getProperty( "DataSource.Username" ) );
		ds.setPassword( props.getProperty( "DataSource.Password" ) );
		ds.setInitialSize( Integer.parseInt( props.getProperty( "DataSource.InitialSize" ) ) );
	}

	private static void setDataSourceVars1( BasicDataSource ds, Properties props ) {
		ds.setMaxTotal( Integer.parseInt( props.getProperty( "DataSource.MaxTotal" ) ) );
		ds.setMinIdle( Integer.parseInt( props.getProperty( "DataSource.MinIdle" ) ) );
		ds.setMaxIdle( Integer.parseInt( props.getProperty( "DataSource.MaxIdle" ) ) );
		ds.setTestOnCreate( Boolean.parseBoolean( props.getProperty( "DataSource.TestOnCreate" ) ) );
		ds.setTestWhileIdle( Boolean.parseBoolean( props.getProperty( "DataSource.TestWhileIdle" ) ) );
		ds.setTestOnBorrow( Boolean.parseBoolean( props.getProperty( "DataSource.TestOnBorrow" ) ) );
		ds.setTestOnReturn( Boolean.parseBoolean( props.getProperty( "DataSource.TestOnReturn" ) ) );
	}

	/**
	 * {@link #getPropriedade(String) Propriedade} "Locale.Default" ou {@link Locale#getDefault()}.
	 * @see Locale#toLanguageTag()
	 */
	public static String getLinguagem() {
		
		String linguagem = getPropriedade( "Locale.Default" );
		
		if( StringUtil.tamanho( linguagem ) == 0 ){
			return Locale.getDefault().toLanguageTag();
		}else{
			return linguagem;
		}

	}

	/**
	 * {@link #getPropriedade(String) Propriedade} "TimeZone.Default" ou {@link ZoneId#systemDefault()}.
	 * @see ZoneId#of(String)
	 */
	public static String getZonaTempo() {
		
		String zona = getPropriedade( "TimeZone.Default" );
		
		if( StringUtil.tamanho( zona ) == 0 ){
			return ZoneId.systemDefault().getId();
		}else{
			return zona;
		}

	}

	/**
	 * {@link ResourceBundle} correspondente a uma {@link Locale}.<br>
	 * {@link ResourceBundle#getBaseBundleName()} == {@link #getPropriedade(String) propriedade} "ResourceBundle.BaseName"<br>
	 * {@link PropertyResourceBundle}'s (arquivos ".properties") devem estar codificados conforme {@link #getPropriedade(String) propriedade} "ResourceBundle.Charset". Veja {@link ResourceBundleCharsetControl}.
	 * @param linguagem Formato IETF BCP 47. Veja {@link Locale#toLanguageTag()}. {@code null} ou {@code vazio} == {@link #getLinguagem()}.
	 * @see #getMensagem(String, String, Object...)
	 */
	public static ResourceBundle getResourceBundle( String linguagem ) throws IOException {
		
		boolean padrao = StringUtil.tamanho( linguagem ) == 0;
		
		if( padrao ) linguagem = getLinguagem();
		linguagem = linguagem.replace( '_', '-' );
		
		ResourceBundle rb = mensagens.get( linguagem );
		if( rb != null ) return rb;
		
		try{

			rb = ResourceBundle.getBundle(
                getPropriedade( "ResourceBundle.BaseName", "Mensagens" ),
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
	public static String getMensagem( String linguagem, String mensagem, Object... argumentos ) throws IOException, MissingResourceException {
		return StringUtil.formatar( getResourceBundle( linguagem ), mensagem, argumentos );
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
	 * Obtém e formata um fragmento de código fonte armazenado em "Fragmentos.txt".
	 * @param chave Chave de identificação do fragmento.
	 * @return null, se inexistente.
	 * @see MessageFormat#format(String, Object...)
	 */
	public static String getFragmento( String chave, Object... argumentos ) {
		String frag = fragmentos.get( chave );
		if( frag == null ) return null;
		else return MessageFormat.format( frag, argumentos );
	}
	
	/**
	 * Obtém uma propriedade da aplicação, comumente definida em arquivo de configuração.
	 * @param chave Chave da propriedade.
	 * @see Properties#getProperty(String)
	 */
	public static String getPropriedade( String chave ) {
		return configuracao.getProperty( chave );
	}
	
	/**
	 * Obtém uma propriedade da aplicação, comumente definida em arquivo de configuração.
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
	 * Retorna a conexão ao servidor etcd, reconectando se necessário.
	 */
	private static EtcdClient getEtcd() throws IOException {

		try{

			if( etcdClient == null || etcdClient.isClosed() ){
	
				String etcdEndereco = configuracao.getProperty( "etcd.Endereco", "localhost" );
				String etcdPorta    = configuracao.getProperty( "etcd.Porta", "2379" );
				String etcdUsuario  = configuracao.getProperty( "etcd.Usuario", "" );
				String etcdSenha    = configuracao.getProperty( "etcd.Senha", "" );
	
				EtcdClient.Builder etcdBuilder = EtcdClient.forEndpoint( etcdEndereco, Integer.parseInt(etcdPorta) ).withPlainText();
				if( etcdUsuario.length() > 0 ) etcdBuilder.withCredentials( etcdUsuario, etcdSenha );
				
				etcdClient = etcdBuilder.build();
	
			}
			
			return etcdClient;

		}catch( Exception e ){

			try{
				if( etcdClient != null ) etcdClient.close();
			}catch( Exception f ){
			}finally{
				etcdClient = null;
			}

			if( e instanceof IOException ) throw e;
			else throw new IOException( e );

		}

	}
	
	/**
	 * Obtém uma nova {@link CopaibaConexao conexão} com um sistema parceiro.
	 * @param nome Identificação do parceiro, prefixo de suas propriedades de conexão.
	 * @see #getParceiro()
	 */
	public static CopaibaConexao getParceiro( String nome ) throws CopaibaException {//TODO default values
		
		String  parcEndereco = getPropriedade( nome + ".Endereco" );
		int     parcPorta    = Integer.parseInt( getPropriedade( nome + ".Porta" ) );
		boolean parcSegura   = Boolean.parseBoolean( getPropriedade( nome + ".Segura" ) );
		boolean parcIgnorar  = Boolean.parseBoolean( getPropriedade( nome + ".IgnorarCertificado" ) );
		String  parcUsuario  = getPropriedade( nome + ".Usuario" );
		String  parcSenha    = getPropriedade( nome + ".Senha" );
		boolean parcExpressa = Boolean.parseBoolean( getPropriedade( nome + ".Expressa" ) );

		if( parcExpressa ){
			return new CopaibaConexao( parcEndereco, parcPorta, parcSegura, parcIgnorar, parcExpressa );
		}else{
			return new CopaibaConexao( parcEndereco, parcPorta, parcSegura, parcIgnorar, parcUsuario, parcSenha );
		}
		
	}
	
	/**
	 * Obtém uma nova {@link CopaibaConexao conexão} com o sistema parceiro principal.
	 * @see #getParceiro(String)
	 */
	public static CopaibaConexao getParceiro() throws CopaibaException {
		return getParceiro( getPropriedade( "Parceria.Principal" ) );
	}
	
	/**
	 * Executa uma {@link CopaibaConexao#solicitar(String, String, String) solicitação} remota com base em {@link JSON}.
	 * A {@link CopaibaConexao} não será {@link CopaibaConexao#fechar(boolean) fechada}.
	 * @see CopaibaConexao#solicitar(String, String, String)
	 */
	public static JSON solicitar( CopaibaConexao copaiba, String classe, JSON estado, String metodo ) throws CopaibaException {
		return new JSON(
			copaiba.solicitar(
				classe,
				estado.toString(),
				metodo
			)
		);
	}
	
	/**
	 * {@link CopaibaConexao#solicitar(String, String, String) Solicita} uma ação a um {@link #getParceiro(String) parceiro},
	 * abrindo e {@link CopaibaConexao#close() fechando} adequadamente a conexão.
	 * @see #getParceiro(String)
	 * @see CopaibaConexao#solicitar(String, String, String)
	 */
	public static JSON solicitar( String parceiro, String classe, JSON estado, String metodo ) throws CopaibaException {
		try( CopaibaConexao copaiba = getParceiro( parceiro ) ){
			return solicitar( copaiba, classe, estado, metodo );
		}catch( IOException e ){
			throw new CopaibaException( Erro.DESCONHECIDO, e );
		}
	}

	/**
	 * {@link CopaibaConexao#solicitar(String, String, String) Solicita} uma ação ao {@link #getParceiro() parceiro} principal,
	 * abrindo e {@link CopaibaConexao#close() fechando} adequadamente a conexão.
	 * @see #getParceiro()
	 * @see CopaibaConexao#solicitar(String, String, String)
	 */
	public static JSON solicitar( String classe, JSON estado, String metodo ) throws CopaibaException {
		return solicitar( getPropriedade( "Parceria.Principal" ), classe, estado, metodo );
	}
	
	/**
	 * {@link IpeRoxo} está inicializada e publicamente disponível?
	 * @see Copaiba#isAberta()
	 */
	public static boolean isDisponivel() {
		return copaiba != null && copaiba.isAberta();
	}

	/**
	 * {@link PrivateKey} especificada através da {@link #getPropriedade(String) propriedade} "Chave.Privada".
	 * @see SegurancaUtil#obterChavePrivada(File)
	 */
	public static PrivateKey getChavePrivada() {
		return chavePrivada;
	}

	/**
	 * {@link PublicKey} especificada através da {@link #getPropriedade(String) propriedade} "Chave.Publica".
	 * @see SegurancaUtil#obterChavePublica(File)
	 */
	public static PublicKey getChavePublica() {
		return chavePublica;
	}
	
	/**
	 * {@link Logger} da aplicação.
	 */
	public static Logger getLog() {
		return log;
	}

	/**
	 * Encerramento normal dos recursos utilizados pelo sistema.
	 * @see Runtime#addShutdownHook(Thread)
	 */
	private static class Encerrador extends Thread {

		@Override
		public void run() {
			
			try{
				if( emf != null ){
					log.info( getMensagem( null, "Log.Encerrando", "EntityManagerFactory" ) );
					emf.close();
				}
			}catch( Exception e ){
			}finally{
				emf = null;
			}

			try{
				if( dataSource != null ){
					log.info( getMensagem( null, "Log.Encerrando", "DataSource" ) );
					dataSource.close();
				}
			}catch( Exception e ){
			}finally{
				dataSource = null;
			}

			try{
				if( etcdClient != null ){
					log.info( getMensagem( null, "Log.Encerrando", "etcd" ) );
					etcdClient.close();
				}
			}catch( Exception e ){
			}finally{
				etcdClient = null;
			}

			try{
				if( copaiba != null ){
					log.info( getMensagem( null, "Log.Encerrando", "Copaíba" ) );
					copaiba.close();
				}
			}catch( Exception e ){
			}finally{
				copaiba = null;
			}

		}

	}

	/**
	 * Manutenção do sistema conforme estado atual da configuração.
	 */
	private static class Mantenedor implements Runnable {

		@Override
		public void run() {
			
			try{

				// Carregando novas configurações ---------------------------------------

				Properties config_nova = new Properties();
				carregarConfiguracao( configuracaoArquivo, config_nova, true, false );

				// Detectando alterações ------------------------------------------------

				boolean ds_reiniciar = ! iguais(
					configuracao,
					config_nova,
					"DataSource.Enable",
					"DataSource.Driver",
					"DataSource.URL",
					"DataSource.Username",
					"DataSource.Password",
					"DataSource.InitialSize"
				);

				boolean ds_atualizar = ! iguais(
					configuracao,
					config_nova,
					"DataSource.JPA.Enable",
					"DataSource.JPA.Unit.Name",
					"DataSource.JPA.JNDI.Name",
					"DataSource.MaxTotal",
					"DataSource.MinIdle",
					"DataSource.MaxIdle",
					"DataSource.TestOnCreate",
					"DataSource.TestWhileIdle",
					"DataSource.TestOnBorrow",
					"DataSource.TestOnReturn"
				);

				boolean etcd_reiniciar = ! iguais(
					configuracao,
					config_nova,
					"etcd.Endereco",
					"etcd.Porta",
					"etcd.Usuario",
					"etcd.Senha"
				);

				// Atualizando a configuração oficial -----------------------------------

				for( Object chave : config_nova.keySet() ){
					configuracao.put( chave, config_nova.get( chave ) );
				}

				// Ajustando etcd -------------------------------------------------------

				if( etcd_reiniciar ){
					try{
						log.info( getMensagem( null, "Log.Atualizando", "etcd" ) );
						if( etcdClient != null && ! etcdClient.isClosed() ) etcdClient.close();
						getEtcd();
					}catch( Exception e ){
						log.error( e.getMessage(), e );
					}
				}

				// Ajustando DataSource -------------------------------------------------

				if( ds_atualizar || ds_reiniciar ){
					try{
						log.info( getMensagem( null, "Log.Atualizando", "DataSource" ) );
						ajustarDataSource( ds_atualizar, ds_reiniciar, false, true );
						try( Connection con = getConnection() ){}
					}catch( Exception e ){
						log.error( e.getMessage(), e );
					}
				}

			}catch( Exception e ){
				log.error( e.getMessage(), e );
			}

		}

		private static boolean iguais( Properties p1, Properties p2, String... chaves ) {
			for( String chave : chaves ){
				if( ! p1.get( chave ).equals( p2.get( chave ) ) ){
					return false;
				}
			}
			return true;
		}

	}
	
}
