package com.joseflavio.iperoxo;

import java.io.IOException;
import java.io.Serializable;
import java.util.ResourceBundle;

import com.joseflavio.copaiba.CopaibaConexao;
import com.joseflavio.urucum.comunicacao.Mensagem.Tipo;
import com.joseflavio.urucum.comunicacao.Resposta;

/**
 * {@link Servico} b�sico que monta uma {@link Resposta} enquanto utiliza, opcionalmente, um {@link BancoDeDados}.
 * @author Jos� Fl�vio de Souza Dias J�nior
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
			if( resp.getMensagens().size() == 0 ){
				resp.mais( Tipo.ERRO, null, e.getClass().getName() + ": " + e.getMessage() );
			}
		}
		return resp;
	}
	
	/**
	 * Montagem da {@link Resposta} deste {@link Servico}.<br>
	 * {@link Resposta#setExito(boolean)} ser� determinada automaticamente, sendo <code>false</code>
	 * quando este m�todo disparar uma {@link Exception}.<br>
	 * Se {@link #isNecessarioAutoCommit()}, ser� feito um {@link BancoDeDados#commit()} (se �xito) ou um {@link BancoDeDados#rollback()}.
	 * @param resp {@link Resposta} que ser� enviada ao {@link CopaibaConexao cliente}.
	 * @param bd {@link BancoDeDados} do {@link IpeRoxo}, se existente e {@link #isNecessarioBancoDeDados() necess�rio}.
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
	 * Este {@link Servico} necessita de {@link BancoDeDados#commit()} ou {@link BancoDeDados#rollback()} autom�tico?
	 */
	protected boolean isNecessarioAutoCommit() {
		return true;
	}

}
