FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

COPY pom.xml ./pom.xml
COPY embedding-service/mvnw ./mvnw
COPY embedding-service/.mvn ./.mvn
RUN chmod +x mvnw && ./mvnw -f pom.xml install -N -q

COPY common ./common
RUN ./mvnw -pl common install -DskipTests -q

COPY embedding-service ./embedding-service
WORKDIR /app/embedding-service
RUN chmod +x mvnw && ./mvnw package -DskipTests -q

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/embedding-service/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
