FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80:8080
CMD ["nginx", "-g", "daemon off;"]
