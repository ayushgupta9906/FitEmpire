# Stage 1: Build application
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY fitempire-backend/pom.xml .
RUN mvn dependency:go-offline -B
COPY fitempire-backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
