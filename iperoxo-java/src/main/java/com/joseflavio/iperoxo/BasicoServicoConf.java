
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

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.joseflavio.urucum.validacao.Escopo;

/**
 * Configuração de {@link BasicoServico}.
 * @author José Flávio de Souza Dias Júnior
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface BasicoServicoConf {
    
    /**
     * Inicializar automaticamente o {@link BancoDeDados}?
     * @see BasicoServico#$BancoDeDados
     */
    boolean bancoDeDados() default true;
    
    /**
     * @see BancoDeDados#BancoDeDados(int)
     */
    int transacoes() default 1;
    
    /**
     * {@link BancoDeDados#commit()} ou {@link BancoDeDados#rollback()} automático?
     */
    boolean commit() default true;
    
    /**
     * {@link BasicoServico#validar() Validar} automaticamente o {@link BasicoServico}?
     * @see BasicoServico#validar()
     */
    boolean validacao() default true;
    
    /**
     * {@link Escopo}s a desconsiderar na {@link BasicoServico#validar() validação} do {@link BasicoServico}.
     */
    String[] omissao() default { "Automatico" };
	
}
