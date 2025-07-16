# Stage 1: Build the Spring Boot application
# Use a JDK image that includes Maven or Gradle, or install them
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

# Set the working directory inside the container for the build stage
WORKDIR /app

# Copy the Maven project files (pom.xml, src/) to the container
# Copy pom.xml separately first to leverage Docker cache for dependencies
COPY pom.xml .
COPY src ./src

# Build the Spring Boot application.
# -Dmaven.test.skip=true: Skips tests to speed up the Docker build.
#                          Run tests in your CI/CD pipeline separately.
# clean package: Cleans existing builds and packages the application into a JAR.
RUN mvn clean package -Dmaven.test.skip=true

# Stage 2: Create the final, smaller runtime image
# Use a JRE-only image for a smaller footprint
FROM eclipse-temurin:17-jre-alpine

# Set the working directory for the application's runtime
WORKDIR /app

# Expose the port your Spring Boot application listens on (default is 8080)
EXPOSE 8080

# Copy the built JAR file from the 'builder' stage to the final image
# The JAR file is typically found in target/ directory, named after artifactId-version.jar
# This line has been updated with your specific JAR filename
ARG JAR_FILE=target/options-recommender-0.0.1-SNAPSHOT.jar
COPY --from=builder ${JAR_FILE} app.jar

# Define the command to run your Spring Boot application
# java -jar app.jar: Standard way to run an executable Spring Boot JAR.
CMD ["java", "-jar", "app.jar"]