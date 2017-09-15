# Ipê-roxo Docker

Aplicação Docker.

## Versão Atual

1.0-A16

Padrão de versionamento: [JFV](http://joseflavio.com/jfv)

## Requisitos

* Git >= 1.8
* Java >= 1.8
* Gradle >= 2.0

## Desenvolvimento

Configuração do projeto para Eclipse ou IntelliJ IDEA.

    gradle eclipse
    gradle cleanIdea idea

## Execução local

Execução durante o processo de desenvolvimento.

    ./local.compilar.sh
    ./local.executar.sh

## Docker

### Volume

    docker volume create --name iperoxo

### Imagem

    gradle clean build
    docker build --force-rm -t joseflavio/iperoxo:1.0-A16 .

### Container

    docker run --name="iperoxo" -d -p 8884:8884 -v iperoxo:/volume --ip=x.x.x.x --net xxxxxx --restart=unless-stopped joseflavio/iperoxo:1.0-A16

### Configuração

    nano /var/lib/docker/volumes/iperoxo/_data/conf/Configuracao.properties

### Log

    tail /var/lib/docker/volumes/iperoxo/_data/logs/iperoxo.log -n 100

### Remoção

    docker rm -f iperoxo
    docker rmi joseflavio/iperoxo:1.0-A16
