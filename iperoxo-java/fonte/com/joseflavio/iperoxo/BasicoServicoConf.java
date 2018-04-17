
/*
 *  Copyright (C) 2016-2018 Jos� Fl�vio de Souza Dias J�nior
 *
 *  This file is part of Ip�-roxo - <http://joseflavio.com/iperoxo/>.
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
 *  Direitos Autorais Reservados (C) 2016-2018 Jos� Fl�vio de Souza Dias J�nior
 *
 *  Este arquivo � parte de Ip�-roxo - <http://joseflavio.com/iperoxo/>.
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

import com.joseflavio.urucum.validacao.Escopo;
import com.joseflavio.urucum.validacao.ValidacaoUtil;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.Set;

/**
 * Configura��o de {@link BasicoServico}.
 * @author Jos� Fl�vio de Souza Dias J�nior
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface BasicoServicoConf {
    
    /**
     * O {@link BasicoServico} necessita de {@link BancoDeDados}?
     */
    boolean bancoDeDados() default true;
    
    /**
     * @see BancoDeDados#BancoDeDados(int)
     */
    int transacoes() default 1;
    
    /**
     * O {@link BasicoServico} necessita de {@link BancoDeDados#commit()} ou {@link BancoDeDados#rollback()} autom�tico?
     */
    boolean commit() default true;
    
    /**
     * � necess�rio {@link ValidacaoUtil#validar(Object, List, boolean, Map, ResourceBundle, Set) validar} o {@link BasicoServico}?
     * @see ValidacaoUtil#validar(Object, List, boolean, Map, ResourceBundle, Set)
     */
    boolean validacao() default true;
    
    /**
     * {@link Escopo}s a desconsiderar na {@link ValidacaoUtil#validar(Object, List, boolean, Map, ResourceBundle, Set) valida��o} do {@link BasicoServico}.
     */
    String[] omissao() default { "Automatico" };
	
}
