# Ipê-roxo - Biblioteca Java

Biblioteca Java que fornece os recursos básicos para o pleno funcionamento de uma aplicação [Ipê-roxo](https://github.com/joseflaviojr/iperoxo).

## Versão Atual

1.0-A18

Padrão de versionamento: [JFV](http://joseflavio.com/jfv)

## Como Usar

Ipê-roxo está disponível como biblioteca Java no repositório [Maven](http://search.maven.org/#artifactdetails%7Ccom.joseflavio%7Ciperoxo%7C1.0-A18%7Cjar).

Gradle:

```
compile 'com.joseflavio:iperoxo:1.0-A18'
```

Maven:

```xml
<dependency>
    <groupId>com.joseflavio</groupId>
    <artifactId>iperoxo</artifactId>
    <version>1.0-A18</version>
</dependency>
```

> Normalmente se utiliza esta biblioteca de forma indireta através da [Aplicação Docker](https://github.com/joseflaviojr/iperoxo/tree/master/iperoxo-docker).

### Requisitos para uso

* Java >= 1.8

## Documentação

A documentação da biblioteca Ipê-roxo, no formato **Javadoc**, está disponível em:

[http://joseflavio.com/iperoxo/javadoc](http://joseflavio.com/iperoxo/javadoc)

## Desenvolvimento

Configuração do projeto para Eclipse e IntelliJ IDEA:

```sh
gradle eclipse
gradle cleanIdea idea
```

### Requisitos para desenvolvimento

* Git >= 2.8
* Java >= 1.8
* Gradle >= 4.7

### Testes

Os testes [JUnit](https://junit.org/junit4/) estão localizados no pacote `com.joseflavio.iperoxo` da biblioteca Ipê-roxo, sendo [com.joseflavio.iperoxo.IpeRoxoTeste](https://github.com/joseflaviojr/iperoxo/blob/master/iperoxo-java/fonte/com/joseflavio/iperoxo/IpeRoxoTeste.java) a classe central dos testes.

## Compilação

Para compilar o projeto, gerando os arquivos JAR, executar no terminal:

```sh
gradle clean build
```

## Publicação

Para compilar e publicar os arquivos finais do projeto no repositório [Maven](http://search.maven.org/#artifactdetails%7Ccom.joseflavio%7Ciperoxo%7C1.0-A18%7Cjar), executar no terminal:

```sh
gradle clean uploadArchives
```

## Licença

### Português

Direitos Autorais Reservados &copy; 2016-2018 [José Flávio de Souza Dias Júnior](http://joseflavio.com)

Este arquivo é parte de Ipê-roxo - [http://joseflavio.com/iperoxo](http://joseflavio.com/iperoxo).

Ipê-roxo é software livre: você pode redistribuí-lo e/ou modificá-lo
sob os termos da [Licença Pública Menos Geral GNU](https://www.gnu.org/licenses/lgpl.html) conforme publicada pela
Free Software Foundation, tanto a versão 3 da Licença, como
(a seu critério) qualquer versão posterior.

Ipê-roxo é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita de
COMERCIABILIDADE ou ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA. Consulte a
Licença Pública Menos Geral do GNU para mais detalhes.

Você deve ter recebido uma cópia da Licença Pública Menos Geral do GNU
junto com Ipê-roxo. Se não, veja [https://www.gnu.org/licenses/lgpl.html](https://www.gnu.org/licenses/lgpl.html).

### English

Copyright &copy; 2016-2018 [José Flávio de Souza Dias Júnior](http://joseflavio.com)

This file is part of Ipê-roxo - [http://joseflavio.com/iperoxo](http://joseflavio.com/iperoxo).

Ipê-roxo is free software: you can redistribute it and/or modify
it under the terms of the [GNU Lesser General Public License](https://www.gnu.org/licenses/lgpl.html) as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Ipê-roxo is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with Ipê-roxo. If not, see [https://www.gnu.org/licenses/lgpl.html](https://www.gnu.org/licenses/lgpl.html).
