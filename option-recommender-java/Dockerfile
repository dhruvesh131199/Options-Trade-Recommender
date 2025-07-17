

# Stage 1: Build the Spring Boot application
# Use a Maven image with JDK 21 and name this stage 'builder'
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

# Set the working directory inside the container for the build stage
WORKDIR /myjar

# Copy the Maven project files (pom.xml, src/) to the container
# Copy pom.xml separately first to leverage Docker cache for dependencies
COPY pom.xml .

# Download dependencies (this step will be cached if pom.xml doesn't change)
RUN mvn dependency:go-offline

# Copy the rest of the source code
COPY src ./src

# Build the JAR file
# Adding -X for verbose output during debugging, you can remove it later
RUN mvn clean package -Dmaven.test.skip=true -X

# Stage 2: Create the final, smaller runtime image
FROM eclipse-temurin:21-jre-alpine

# Set the working directory for the application's runtime
WORKDIR /myjar

# Copy the built JAR file from the 'builder' stage to the final image
# This copies the JAR from the *first* stage's /app/target/ to the *second* stage's /app/
COPY --from=builder /myjar/target/options-recommender-0.0.1-SNAPSHOT.jar app.jar

# IMPORTANT: Make the JAR executable! This is often the final missing piece.
RUN chmod +x app.jar

# Expose the port your Spring Boot application listens on (default is 8080)
EXPOSE 8080

# Define the command to run your Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]