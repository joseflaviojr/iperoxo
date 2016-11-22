# Ipê-roxo

Modelo de aplicação HTML5 com [Copaíba](http://joseflavio.com/copaiba).

HTML5 application model with [Copaíba](http://joseflavio.com/copaiba).

## Versão Atual / Current Version

1.0-A5

Padrão de versionamento: http://joseflavio.com/jfv/

## Requisitos / Requirements

* Git >= 1.8
* Java >= 1.8
* Gradle >= 2.0
* [Unha-de-gato](http://joseflavio.com/unhadegato)
* [Uxi-amarelo](http://joseflavio.com/uxiamarelo)

## Desenvolvimento / Development

Execute o comando a seguir e importe o projeto no Eclipse IDE.

Run the following command and import the project in Eclipse IDE.

    cd iperoxo-java
    gradle eclipse

## Execução local / Local execution

Compilação+Execução durante o processo de desenvolvimento.

Compilation+Execution during the development process.

    cd iperoxo-java
    ./local.sh

## Docker Container

Download and Compilation:

    git clone --branch "1.0-A5" https://github.com/joseflaviojr/iperoxo.git
    cd iperoxo/iperoxo-java
    gradle dist

Dockerizing:

    docker build --force-rm -t joseflavio/iperoxo:1.0-A5 .

Creating the volume:

    docker volume create --name iperoxo

Running:

    docker run --name="iperoxo" -d -p 8884:8884 -v iperoxo:/volume --restart=unless-stopped joseflavio/iperoxo:1.0-A5

Connecting to the network:

    docker network connect --ip=x.x.x.x NETWORK_NAME iperoxo

Configuration:

    nano /var/lib/docker/volumes/iperoxo/_data/conf/Configuracao.properties

Log:

    tail /var/lib/docker/volumes/iperoxo/_data/logs/iperoxo.log -n 100

Removal:

    docker rm -f iperoxo
    docker rmi joseflavio/iperoxo:1.0-A5
