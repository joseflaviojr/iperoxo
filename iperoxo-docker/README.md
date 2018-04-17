# Ipê-roxo - Aplicação Docker

Modelo de aplicação Java para execução em container Docker, compondo parte do [Ipê-roxo](https://github.com/joseflaviojr/iperoxo).

## Descrição

A aplicação Docker do Ipê-roxo é responsável por manter as regras, os procedimentos e os bancos de dados do sistema. No esquema geral do Ipê-roxo (figura abaixo), o módulo "Aplicação Java" corresponde à aplicação Docker aqui especificada.

<img src="../projeto/EsquemaGeral.png">

## Versão Atual

1.0-A17

Padrão de versionamento: [JFV](http://joseflavio.com/jfv)

## Desenvolvimento

Configuração do projeto para Eclipse e IntelliJ IDEA:

```sh
gradle eclipse
gradle cleanIdea idea
```

### Requisitos para desenvolvimento

* Git >= 2.8
* Java >= 1.8
* Gradle >= 3.1

## Execução Local

Compilação e execução da aplicação durante o processo de desenvolvimento:

```sh
./local.compilar.sh
./local.executar.sh
```

## Instalação

Seguem-se as instruções para compilar, instalar e executar esta aplicação num container Docker. Os argumentos de cada comando precisam ser revisados e especificados conforme o ambiente de execução.

Compilar:

```sh
gradle clean build
```

Criar imagem:

```sh
docker build --force-rm -t joseflavio/iperoxo:1.0-A17 .
```

Criar volume de dados:

```sh
docker volume create --name iperoxo
```

Executar pela primeira vez:

```sh
docker run --name="iperoxo" -d -p 8884:8884 -v iperoxo:/volume --ip=x.x.x.x --net xxxxxx --restart=unless-stopped joseflavio/iperoxo:1.0-A17
```

> A aplicação Ipê-roxo será inicializada automaticamente no processo de boot, a não ser que seja voluntariamente parada: `docker stop iperoxo`.

Configurar:

```sh
cd /var/lib/docker/volumes/iperoxo/_data/conf
```

> Algumas configurações exigem a reinicialização da aplicação: `docker restart iperoxo`.

Verificar arquivos de log:

```sh
tail /var/lib/docker/volumes/iperoxo/_data/logs/iperoxo.log -n 100
```

### Requisitos para Instalação

* Docker >= 17.06
* Git >= 2.8
* Java >= 1.8
* Gradle >= 3.1

### Desinstalação

Desinstalar a aplicação Ipê-roxo por completo:

```sh
docker rm -f iperoxo
docker rmi joseflavio/iperoxo:1.0-A17
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
