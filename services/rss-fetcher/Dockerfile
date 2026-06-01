FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Install parent pom so child module can resolve it
COPY pom.xml ./pom.xml
COPY rss-fetcher/mvnw ./mvnw
COPY rss-fetcher/.mvn ./.mvn
RUN chmod +x mvnw && ./mvnw -f pom.xml install -N -q

# Build the service
COPY rss-fetcher ./rss-fetcher
WORKDIR /app/rss-fetcher
RUN chmod +x mvnw && ./mvnw package -DskipTests -q

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/rss-fetcher/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
