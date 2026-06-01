FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

COPY pom.xml ./pom.xml
COPY api-gateway/mvnw ./mvnw
COPY api-gateway/.mvn ./.mvn
RUN chmod +x mvnw && ./mvnw -f pom.xml install -N -q

COPY api-gateway ./api-gateway
WORKDIR /app/api-gateway
RUN chmod +x mvnw && ./mvnw package -DskipTests -q

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/api-gateway/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
