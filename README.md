# Ipê-roxo

Modelo de aplicação de [Copaíba](http://joseflavio.com/copaiba).

[Copaíba](http://joseflavio.com/copaiba) application model.

## Versão Atual / Current Version

1.0-A3

Padrão de versionamento: http://joseflavio.com/jfv/

## Requisitos / Requirements

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

Compilation:

    cd iperoxo-java
    gradle dist

Dockerizing:

    docker build --force-rm -t joseflavio/iperoxo:1.0-A3 .

Creating the volume:

    docker volume create --name iperoxo

Running:

    docker run --name="iperoxo" -d -p 8884:8884 -v iperoxo:/volume --restart=unless-stopped joseflavio/iperoxo:1.0-A3

Connecting to the network:

    docker network connect --ip=x.x.x.x NETWORK_NAME iperoxo
