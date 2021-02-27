# Ipê-roxo Java/Docker (Back-End)

Modelo de aplicação Java para execução em container Docker, compondo parte do [Ipê-roxo](https://github.com/joseflaviojr/iperoxo).

<img width="128px" src="../projeto/Marca/iperoxo0128.png">

## Descrição

A aplicação Java/Docker (Back-End) do Ipê-roxo é responsável por gerenciar as regras, os procedimentos e os dados do sistema.

<img src="../projeto/EsquemaGeral.png">

## Versão Atual

1.0-A22 (Fase de Nascimento)

Padrão de versionamento: [JFV](http://joseflavio.com/jfv)

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

## Execução Local

Compilação da aplicação durante o processo de desenvolvimento:

```sh
./local.compilar.sh
```

Execução local:

```sh
./local.executar.sh
```

Compilação e execução local:

```sh
./local.sh
```

## Instalação

Seguem-se as instruções para compilar, instalar e executar esta aplicação num container Docker. Os argumentos de cada comando precisam ser revisados e especificados conforme o ambiente de execução.

Compilar:

```sh
gradle clean build
```

Criar imagem:

```sh
docker build --force-rm -t joseflavio/iperoxo:1.0-A22 .
```

Criar volume de dados:

```sh
docker volume create --name iperoxo
```

Executar pela primeira vez:

```sh
docker run --name="iperoxo" -d -p 8884:8884 -e TZ=America/Belem -v iperoxo:/volume --ip=x.x.x.x --net xxxxxx --restart=unless-stopped joseflavio/iperoxo:1.0-A22
```

> A aplicação Ipê-roxo será inicializada automaticamente no processo de boot, a não ser que seja voluntariamente parada: `docker stop iperoxo`.

Configurar:

```sh
cd /var/lib/docker/volumes/iperoxo/_data/conf
```

> Algumas configurações exigem a reinicialização da aplicação: `docker restart iperoxo`.

Verificar arquivos de log:

```sh
docker logs --tail 50 -f iperoxo
tail /var/lib/docker/volumes/iperoxo/_data/logs/iperoxo.log -n 100
```

### Requisitos para Instalação

* Docker >= 17.06
* Git >= 2.8
* Java >= 1.8
* Gradle >= 4.7

### Desinstalação

Desinstalar a aplicação Ipê-roxo por completo:

```sh
docker rm -f iperoxo
docker rmi joseflavio/iperoxo:1.0-A22
```
