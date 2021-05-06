#!/bin/sh

# SASS - Conversor de SCSS para CSS
sass --watch sass:css sass-dep:css-dep &
PIDS[0]=$!

# Servidor Web - http://localhost:8000/
python -m SimpleHTTPServer 8000 &
PIDS[1]=$!

# Finalização dos processos com CTRL+C
trap "kill -9 ${PIDS[*]}" SIGINT
echo "Pressione CTRL+C para finalizar..."
wait
