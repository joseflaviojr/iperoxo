# Ipê-roxo

Modelo de sistema de software multicamada que contempla características de [stacks](https://en.wikipedia.org/wiki/Solution_stack) e [frameworks](https://en.wikipedia.org/wiki/Software_framework).

<img width="128px" src="projeto/Marca/iperoxo0128.png">

## Descrição

O Ipê-roxo é um modelo que visa tornar mais eficiente o desenvolvimento de software, com foco nas regras de negócios, mas sem interferir na liberdade do programador. As linguagens de programação são aplicadas no Ipê-roxo de modo que não percam a sua essência. Java começa com `public static void main` e HTML com `head body`, e assim deve ser.

<img src="projeto/EsquemaGeral.png">

## Versão Atual

1.0-A21 (Fase de Nascimento)

Padrão de versionamento: [JFV](http://joseflavio.com/jfv)

## Sistema

O modelo Ipê-roxo é dividido em quatro partes:

* [Web (front-end)](https://github.com/joseflaviojr/iperoxo/tree/master/iperoxo-web)
* [Java/Docker (back-end)](https://github.com/joseflaviojr/iperoxo/tree/master/iperoxo-docker)
* [Cordova (mobile)](https://github.com/joseflaviojr/iperoxo/tree/master/iperoxo-cordova)
* [Biblioteca Java](https://github.com/joseflaviojr/iperoxo/tree/master/iperoxo-java)

E depende de outras duas soluções "amazônicas":

* [Uxi-amarelo](https://github.com/joseflaviojr/uxiamarelo)
* [Copaíba](https://github.com/joseflaviojr/copaiba)

## Caso de Uso

O aplicativo [Praesentia](https://play.google.com/store/apps/details?id=br.edu.ifpa.praesentia) é um exemplo de aplicação na camada de *front-end* do Ipê-roxo, combinando HTML, CSS, JavaScript e Cordova.
