#------------------------------

# Ipe-roxo 1.0-A14

#------------------------------

FROM java:8-jre-alpine

MAINTAINER Jose Flavio de Souza Dias Junior <contato@joseflavio.com>

#------------------------------

ENV IPEROXO /usr/local/iperoxo
ENV PATH ${IPEROXO}/bin:$PATH

#------------------------------

RUN mkdir -p ${IPEROXO}/bin && \
    mkdir -p /volume/conf && \
    mkdir -p /volume/logs

ADD build/dist/*.jar ${IPEROXO}/bin/
ADD build/dist/*.sh ${IPEROXO}/bin/
ADD recurso/Configuracao.properties /volume/conf/

RUN chmod -R 755 ${IPEROXO}/bin && \
    ln -s /volume/logs ${IPEROXO}/bin/log

#------------------------------

WORKDIR ${IPEROXO}/bin

EXPOSE 8884

CMD ["iperoxo.sh", "/volume/conf/Configuracao.properties"]

#------------------------------