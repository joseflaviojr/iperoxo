# Ipê-roxo

Modelo de aplicação HTML5 com [Copaíba](http://joseflavio.com/copaiba).

HTML5 application model with [Copaíba](http://joseflavio.com/copaiba).

## Versão Atual / Current Version

1.0-A10

Padrão de versionamento: [JFV](http://joseflavio.com/jfv)

## Requisitos / Requirements

* Git >= 1.8
* Java >= 1.8
* Gradle >= 2.0
* [Uxi-amarelo](http://joseflavio.com/uxiamarelo)

## Desenvolvimento / Development

Configuração do projeto para Eclipse ou IntelliJ IDEA.

Project configuration for Eclipse or IntelliJ IDEA.

    cd iperoxo-docker
    gradle eclipse
    gradle cleanIdea idea

## Execução local / Local execution

Execução durante o processo de desenvolvimento.

Execution during the development process.

    cd iperoxo-docker
    ./local.sh

## Docker Container

Compilation:

    cd iperoxo-docker
    gradle clean build

Image:

    docker build --force-rm -t joseflavio/iperoxo:1.0-A10 .

Volume:

    docker volume create --name iperoxo

Running:

    docker run --name="iperoxo" -d -p 8884:8884 -v iperoxo:/volume --ip=x.x.x.x --net xxxxxx --restart=unless-stopped joseflavio/iperoxo:1.0-A10

Configuration:

    nano /var/lib/docker/volumes/iperoxo/_data/conf/Configuracao.properties

Log:

    tail /var/lib/docker/volumes/iperoxo/_data/logs/iperoxo.log -n 100

Removal:

    docker rm -f iperoxo
    docker rmi joseflavio/iperoxo:1.0-A10
