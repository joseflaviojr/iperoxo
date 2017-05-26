# Ipê-roxo

Exemplo de biblioteca Java.

## Versão Atual

1.0-A14

Padrão de versionamento: [JFV](http://joseflavio.com/jfv)

## Requisitos

* Git >= 1.8
* Java >= 1.8
* Gradle >= 2.0

## Gradle

    compile 'com.joseflavio:exemplo:1.0-A1'

## Maven

    <dependency>
        <groupId>com.joseflavio</groupId>
        <artifactId>exemplo</artifactId>
        <version>1.0-A1</version>
    </dependency>

## Desenvolvimento

Configuração do projeto para Eclipse ou IntelliJ IDEA.

    gradle eclipse
    gradle cleanIdea idea

## Compilação

    gradle clean build

## Publicação

    gradle uploadArchives
