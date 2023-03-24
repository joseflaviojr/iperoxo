# Ipê-roxo Cordova (Mobile)

Modelo de aplicativo móvel que combina [Cordova](https://cordova.apache.org/) com [Ipê-roxo Web](https://github.com/joseflaviojr/iperoxo/tree/master/iperoxo-web).

<img width="128px" src="../projeto/Marca/iperoxo0128.png">

## Versão Atual

1.0-A23 (Fase de Nascimento)

Padrão de versionamento: [JFV](http://joseflavio.com/jfv)

## Introdução

As instruções a seguir são necessárias para preparar, compilar e distribuir aplicações [Cordova](https://cordova.apache.org/), tendo como seu conteúdo Web uma aplicação [Ipê-roxo](https://github.com/joseflaviojr/iperoxo/tree/master/iperoxo-web).

Aconselha-se realizar todas estas instruções sempre que precisar distribuir a aplicação, evitando reutilizar código Cordova.

## Caso de Uso

O aplicativo [Praesentia](https://play.google.com/store/apps/details?id=br.edu.ifpa.praesentia) é um exemplo de aplicativo móvel Ipê-roxo.

## Projeto Cordova

Manter o Cordova atualizado.

```sh
npm update -g cordova
```

Criar esqueleto de projeto Cordova e entrar no diretório dele.

```sh
cordova create IpeRoxo
cd IpeRoxo/
```

Atualizar os arquivos de configuração com base nos arquivos `../projeto/config.xml` e `../projeto/package.json`.

Caso os arquivos modelos de configuração contemplem todas as propriedades minimamente exigidas pelo Cordova, estes arquivos poderão ser diretamente copiados, conforme a seguir.

```sh
cp ../projeto/config.xml config.xml
cp ../projeto/package.json package.json
```

Adicionar ao projeto as plataformas desejadas.

```sh
cordova platform add android
cordova platform ls
```

Remover plugins pré-instalados.

```sh
cordova plugin ls
cordova plugin remove cordova-plugin-whitelist
```

Instalar plugins necessários.

```sh
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-network-information
cordova plugin add cordova-plugin-inappbrowser
cordova plugin add cordova-plugin-file
cordova plugin ls
```

Forma detalhada de instalar plugin (opcional):

```sh
plugman install --platform android --project platforms/android/ --plugin cordova-plugin-file
```

Verificar os requisitos mínimos para cada plataforma.

```sh
cordova requirements
```

Requisitos gerais para:

- [Android](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html)
- [iOS](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html)
- [Electron](https://cordova.apache.org/docs/en/latest/guide/platforms/electron/index.html)
- [etc.](https://cordova.apache.org/docs/en/latest/guide/support/index.html)

Se necessário, atualizar por completo as plataformas e seus plugins:

```sh
cordova platform rm android
cordova platform add android
```

## Ícone

Ferramentas necessárias:

- [ImageMagick](https://imagemagick.org)

Elaborar ícone com as seguintes características.

- Formato PNG com fundo transparente; e
- Tamanho mínimo de 1024/1024px.

Manter o ícone no endereço `../projeto/icon.png`.

> Observação: o arquivo `config.xml` já contém `<icon src="res/icon.png" />`.

Implantar o ícone elaborado.

```sh
mkdir res
cp ../projeto/icon.png res/
```

Para mais informações, consultar o [manual](https://cordova.apache.org/docs/en/latest/config_ref/images.html) do Cordova.

## Conteúdo Web: HTML, CSS e JavaScript

> Atenção: as instruções adiante, caso haja descuido, podem ocasionar perdas de arquivos importantes.

Remover todos os arquivos existentes no diretório `www` do projeto Cordova.

```sh
ls -lah www/
rm -rf www/*
```

Inserir os arquivos Web que compõem a aplicação: HTML, CSS, JavaScript, etc., os quais devem estar em projeto separado adjacente.

```sh
cp -R ../../iperoxo-web/css www/
cp -R ../../iperoxo-web/css-dep www/
cp -R ../../iperoxo-web/etc www/
cp -R ../../iperoxo-web/fonts www/
cp -R ../../iperoxo-web/html www/
cp -R ../../iperoxo-web/html-dep www/
cp -R ../../iperoxo-web/img www/
cp -R ../../iperoxo-web/index.html www/
cp -R ../../iperoxo-web/js www/
cp -R ../../iperoxo-web/js-dep www/
touch www/js/index.js
ls -lah www/
```

> O arquivo `index.html` deve receber alguns ajustes:
> 
> - Habilitar a biblioteca `<script src="cordova.js"></script>`.

## Compilação e Distribuição

Executar as etapas de compilação conforme a plataforma desejada.

### Scripts Auxiliares

Revisar e copiar os scripts auxiliares de compilação, mantidos no diretório `../projeto/scripts`.

```sh
cp -R ../projeto/scripts ./
```

### Compilação para Android

A plataforma Android exige assinatura digital dos aplicativos. Siga as instruções do artigo [Assinar o app](https://developer.android.com/studio/publish/app-signing?hl=pt-br) para gerar as suas chaves. Os arquivos `../projeto/Android/cordova-debug.properties` e `../projeto/Android/cordova-release.properties` são exemplos de configuração que orientam o Cordova no processo de assinatura do aplicativo, a partir de `../projeto/scripts/android/build-extras.gradle`.

Constatar se o código numérico (`config.xml :: android-versionCode`) e o nome da versão (`config.xml :: version`) do aplicativo estão de acordo com as regras do artigo [Controlar versões do app](https://developer.android.com/studio/publish/versioning) e se atende à sequência de evolução do aplicativo.

Executar o comando a seguir com o objetivo de compilar para a plataforma Android.

```sh
cordova build android
```

Executar em dispositivo Android conectado em porta USB, com depuração habilitada. Este comando executa, se necessário, o procedimento anterior de `build`.

```sh
cordova run android --device
```

Uma forma de acompanhar as atividades correntes do dispositivo Android conectado é através do comando `adb logcat`.

Para verificar informações pertinentes ao aplicativo instalado no dispositivo Android, executar o comando abaixo.

```sh
adb shell dumpsys package com.joseflavio.iperoxo
```

### Distribuição para Android

Executar o comando a seguir com o objetivo de gerar o arquivo final para fins de distribuição.

```sh
cordova build --release android
```

O arquivo final para fins de distribuição (APK) é gerado comumente no endereço `./platforms/android/app/build/outputs/apk/release/app-release.apk`.

Executar a versão de distribuição em dispositivo Android conectado em porta USB.

```sh
cordova run --release android --device
```

## Limpeza

Apagar diretório do projeto Cordova para refazer todas estas instruções de preparação, compilação e distribuição da aplicação.

```sh
cd ..
rm -rf IpeRoxo/
```
