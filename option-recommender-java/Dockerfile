# Stage 1: Build the Spring Boot application
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /myjar
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -Dmaven.test.skip=true

# Stage 2: Create the final runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /myjar
COPY --from=builder /myjar/target/options-recommender-0.0.1-SNAPSHOT.jar app.jar
RUN chmod +x app.jar

# Support dynamic ports from Cloud Run or Render
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=${PORT}"]
