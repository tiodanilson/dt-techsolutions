FROM nginx:1.27-alpine
ENV PORT=8080
RUN mkdir -p /etc/nginx/templates && printf '%s\n' \
    'server {' \
    '    listen ${PORT};' \
    '    server_name _;' \
    '    root /usr/share/nginx/html;' \
    '    index index.html;' \
    '    gzip on;' \
    '    gzip_types text/html text/css application/javascript image/svg+xml;' \
    '    location / {' \
    '        try_files $uri $uri/ /index.html;' \
    '    }' \
    '}' > /etc/nginx/templates/default.conf.template
COPY index.html style.css script.js /usr/share/nginx/html/
