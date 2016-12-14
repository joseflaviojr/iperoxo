#!/bin/bash

gradle clean dist
cd build/dist
./iperoxo.sh ../../recurso/Configuracao.properties
