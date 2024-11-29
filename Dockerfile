FROM nginx:alpine3.20
COPY /build /usr/share/nginx/html
EXPOSE 80:8080
CMD ["nginx", "-g", "daemon off;"]
