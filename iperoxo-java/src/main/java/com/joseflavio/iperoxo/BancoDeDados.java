
/*
 *  Copyright (C) 2016-2020 José Flávio de Souza Dias Júnior
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
 *  Direitos Autorais Reservados (C) 2016-2020 José Flávio de Souza Dias Júnior
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

import java.io.Closeable;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityGraph;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.FlushModeType;
import javax.persistence.LockModeType;
import javax.persistence.Query;
import javax.persistence.StoredProcedureQuery;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaDelete;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.CriteriaUpdate;
import javax.persistence.metamodel.Metamodel;

/**
 * Mesclagem de {@link EntityManager} e {@link EntityTransaction}.<br>
 * O {@link BancoDeDados} convenientemente manterá uma {@link EntityTransaction} {@link EntityTransaction#begin() iniciada},
 * mesmo após {@link #commit()} ou {@link #rollback()}.<br>
 * O método {@link #close()} efetua, se {@link EntityTransaction#isActive() necessário}, um último {@link #commit()}.<br>
 * Uso típico de {@link BancoDeDados}:
 * <pre>
 * try( {@link BancoDeDados} bd = new {@link BancoDeDados}() ){
 *     bd.{@link #persist(Object) persist}(obj);
 * }
 * </pre>
 * Outra possibilidade de uso:
 * <pre>
 * {@link BancoDeDados} bd = new {@link BancoDeDados}();
 * try{
 *     bd.{@link #persist(Object) persist}(obj);
 *     bd.{@link #commit()};
 * }catch( Exception e ){
 *     bd.{@link #rollback()};
 * }finally{
 *     bd.{@link #close()};
 * }
 * </pre>
 * @author José Flávio de Souza Dias Júnior
 */
public class BancoDeDados implements EntityManager, EntityTransaction, Closeable {
	
	private EntityManager em;
	
	private EntityTransaction et;
	
	private int transacoes;
	
	/**
	 * @param transacoes Número de {@link EntityTransaction#begin()} automáticas.
	 * @see IpeRoxo#getEntityManagerFactory()
	 * @see EntityManagerFactory#createEntityManager()
	 * @see EntityTransaction#begin()
	 */
	public BancoDeDados( int transacoes ) {
		
		this.em = IpeRoxo.getEntityManagerFactory().createEntityManager();
		this.et = em.getTransaction();
		this.transacoes = transacoes;
		
		if( transacoes > 0 ){
			transacoes--;
			et.begin();
		}
		
	}
	
	/**
	 * {@link BancoDeDados#BancoDeDados(int)} para uma única {@link EntityTransaction} {@link EntityTransaction#begin() automática}.
	 */
	public BancoDeDados() {
		this( 1 );
	}

	@Override
	public void persist( Object entity ) {
		em.persist( entity );
	}

	@Override
	public < T > T merge( T entity ) {
		return em.merge( entity );
	}

	@Override
	public void remove( Object entity ) {
		em.remove( entity );
	}

	@Override
	public < T > T find( Class<T> entityClass, Object primaryKey ) {
		return em.find( entityClass, primaryKey );
	}

	@Override
	public < T > T find( Class<T> entityClass, Object primaryKey, Map<String,Object> properties ) {
		return em.find( entityClass, primaryKey, properties );
	}

	@Override
	public < T > T find( Class<T> entityClass, Object primaryKey, LockModeType lockMode ) {
		return em.find( entityClass, primaryKey, lockMode );
	}

	@Override
	public < T > T find( Class<T> entityClass, Object primaryKey, LockModeType lockMode, Map<String,Object> properties ) {
		return em.find( entityClass, primaryKey, lockMode, properties );
	}

	@Override
	public < T > T getReference( Class<T> entityClass, Object primaryKey ) {
		return em.getReference( entityClass, primaryKey );
	}

	@Override
	public void flush() {
		em.flush();
	}

	@Override
	public void setFlushMode( FlushModeType flushMode ) {
		em.setFlushMode( flushMode );
	}

	@Override
	public FlushModeType getFlushMode() {
		return em.getFlushMode();
	}

	@Override
	public void lock( Object entity, LockModeType lockMode ) {
		em.lock( entity, lockMode );
	}

	@Override
	public void lock( Object entity, LockModeType lockMode, Map<String,Object> properties ) {
		em.lock( entity, lockMode, properties );
	}

	@Override
	public void refresh( Object entity ) {
		em.refresh( entity );
	}

	@Override
	public void refresh( Object entity, Map<String,Object> properties ) {
		em.refresh( entity, properties );
	}

	@Override
	public void refresh( Object entity, LockModeType lockMode ) {
		em.refresh( entity, lockMode );
	}

	@Override
	public void refresh( Object entity, LockModeType lockMode, Map<String,Object> properties ) {
		em.refresh( entity, lockMode, properties );
	}

	@Override
	public void clear() {
		em.clear();
	}

	@Override
	public void detach( Object entity ) {
		em.detach( entity );
	}

	@Override
	public boolean contains( Object entity ) {
		return em.contains( entity );
	}

	@Override
	public LockModeType getLockMode( Object entity ) {
		return em.getLockMode( entity );
	}

	@Override
	public void setProperty( String propertyName, Object value ) {
		em.setProperty( propertyName, value );
	}

	@Override
	public Map<String,Object> getProperties() {
		return em.getProperties();
	}

	@Override
	public Query createQuery( String qlString ) {
		return em.createQuery( qlString );
	}

	@Override
	public < T > TypedQuery<T> createQuery( CriteriaQuery<T> criteriaQuery ) {
		return em.createQuery( criteriaQuery );
	}

	@Override
	@SuppressWarnings( "rawtypes" )
	public Query createQuery( CriteriaUpdate updateQuery ) {
		return em.createQuery( updateQuery );
	}

	@Override
	@SuppressWarnings( "rawtypes" )
	public Query createQuery( CriteriaDelete deleteQuery ) {
		return em.createQuery( deleteQuery );
	}

	@Override
	public < T > TypedQuery<T> createQuery( String qlString, Class<T> resultClass ) {
		return em.createQuery( qlString, resultClass );
	}

	@Override
	public Query createNamedQuery( String name ) {
		return em.createNamedQuery( name );
	}

	@Override
	public < T > TypedQuery<T> createNamedQuery( String name, Class<T> resultClass ) {
		return em.createNamedQuery( name, resultClass );
	}

	@Override
	public Query createNativeQuery( String sqlString ) {
		return em.createNativeQuery( sqlString );
	}

	@Override
	@SuppressWarnings( "rawtypes" )
	public Query createNativeQuery( String sqlString, Class resultClass ) {
		return em.createNativeQuery( sqlString, resultClass );
	}

	@Override
	public Query createNativeQuery( String sqlString, String resultSetMapping ) {
		return em.createNativeQuery( sqlString, resultSetMapping );
	}

	@Override
	public StoredProcedureQuery createNamedStoredProcedureQuery( String name ) {
		return em.createNamedStoredProcedureQuery( name );
	}

	@Override
	public StoredProcedureQuery createStoredProcedureQuery( String procedureName ) {
		return em.createStoredProcedureQuery( procedureName );
	}

	@Override
	@SuppressWarnings( "rawtypes" )
	public StoredProcedureQuery createStoredProcedureQuery( String procedureName, Class... resultClasses ) {
		return em.createStoredProcedureQuery( procedureName, resultClasses );
	}

	@Override
	public StoredProcedureQuery createStoredProcedureQuery( String procedureName, String... resultSetMappings ) {
		return em.createStoredProcedureQuery( procedureName, resultSetMappings );
	}

	@Override
	public void joinTransaction() {
		em.joinTransaction();

	}

	@Override
	public boolean isJoinedToTransaction() {
		return em.isJoinedToTransaction();
	}

	@Override
	public < T > T unwrap( Class<T> cls ) {
		return em.unwrap( cls );
	}

	@Override
	public Object getDelegate() {
		return em.getDelegate();
	}

	@Override
	public void close() {
		
		if( et.isActive() ){
			try{
				et.commit();
			}catch( Exception e ){
			}
		}
		
		try{
			em.close();
		}finally{
			em = null;
			et = null;
		}
		
	}

	@Override
	public boolean isOpen() {
		return em.isOpen();
	}

	@Override
	public EntityTransaction getTransaction() {
		return et;
	}

	@Override
	public EntityManagerFactory getEntityManagerFactory() {
		return em.getEntityManagerFactory();
	}

	@Override
	public CriteriaBuilder getCriteriaBuilder() {
		return em.getCriteriaBuilder();
	}

	@Override
	public Metamodel getMetamodel() {
		return em.getMetamodel();
	}

	@Override
	public < T > EntityGraph<T> createEntityGraph( Class<T> rootType ) {
		return em.createEntityGraph( rootType );
	}

	@Override
	public EntityGraph<?> createEntityGraph( String graphName ) {
		return em.createEntityGraph( graphName );
	}

	@Override
	public EntityGraph<?> getEntityGraph( String graphName ) {
		return em.getEntityGraph( graphName );
	}

	@Override
	public < T > List<EntityGraph<? super T>> getEntityGraphs( Class<T> entityClass ) {
		return em.getEntityGraphs( entityClass );
	}
	
	@Override
	public void begin() {
		et.begin();
	}
	
	@Override
	public void commit() {
		if( et.isActive() ) et.commit();
		if( transacoes > 0 ){
			transacoes--;
			et.begin();
		}
	}
	
	@Override
	public void rollback() {
		if( et.isActive() ) et.rollback();
		if( transacoes > 0 ){
			transacoes--;
			et.begin();
		}
	}
	
	@Override
	public boolean isActive() {
		return et.isActive();
	}
	
	@Override
	public boolean getRollbackOnly() {
		return et.getRollbackOnly();
	}
	
	@Override
	public void setRollbackOnly() {
		et.setRollbackOnly();
	}
	
}