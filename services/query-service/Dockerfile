FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

COPY pom.xml ./pom.xml
COPY query-service/mvnw ./mvnw
COPY query-service/.mvn ./.mvn
RUN chmod +x mvnw && ./mvnw -f pom.xml install -N -q

COPY query-service ./query-service
WORKDIR /app/query-service
RUN chmod +x mvnw && ./mvnw package -DskipTests -q

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/query-service/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
