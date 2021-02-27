# Ipê-roxo - Biblioteca Java

Biblioteca Java que fornece os recursos básicos para o pleno funcionamento de uma aplicação [Ipê-roxo](https://github.com/joseflaviojr/iperoxo). Além disso, ela serve como modelo para o desenvolvimento de outras bibliotecas Java.

<img width="128px" src="../projeto/Marca/iperoxo0128.png">

## Versão Atual

1.0-A22 (Fase de Nascimento)

Padrão de versionamento: [JFV](http://joseflavio.com/jfv)

## Como Usar

Ipê-roxo está disponível como biblioteca Java no repositório [Maven](http://search.maven.org/#artifactdetails%7Ccom.joseflavio%7Ciperoxo%7C1.0-A22%7Cjar).

Gradle:

```groovy
implementation 'com.joseflavio:iperoxo:1.0-A22'
```

Maven:

```xml
<dependency>
    <groupId>com.joseflavio</groupId>
    <artifactId>iperoxo</artifactId>
    <version>1.0-A22</version>
</dependency>
```

> Normalmente se utiliza esta biblioteca de forma indireta através da [Aplicação Java/Docker](https://github.com/joseflaviojr/iperoxo/tree/master/iperoxo-docker).

### Requisitos para uso

* Java >= 1.8

## Documentação

A documentação da biblioteca Ipê-roxo, no formato **Javadoc**, está disponível em:

[http://joseflavio.com/iperoxo/javadoc](http://joseflavio.com/iperoxo/javadoc)

## Desenvolvimento

Configuração do projeto para Eclipse IDE e IntelliJ IDEA:

```sh
gradle cleanEclipse eclipse
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

Para compilar e publicar os arquivos finais do projeto no repositório [Maven](http://search.maven.org/#artifactdetails%7Ccom.joseflavio%7Ciperoxo%7C1.0-A22%7Cjar), executar no terminal:

```sh
gradle clean publish
```
