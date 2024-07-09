FROM nginx:latest

# Install required packages and Brotli module
RUN apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository -y ppa:hda-me/nginx-stable && \
    apt-get update && \
    apt-get install -y nginx nginx-module-brotli && \
    rm -rf /var/lib/apt/lists/*

# Copy custom nginx configuration
# COPY nginx.conf /etc/nginx/nginx.conf

# Copy application files
# COPY /path/to/your/application /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
