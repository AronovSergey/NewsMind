-include .env
export

.PHONY: infra up down test test-fetcher test-embedding test-query test-gateway test-frontend

infra:
	docker compose up -d

up:
	(cd services/rss-fetcher && ./mvnw spring-boot:run) &
	(cd services/embedding-service && ./mvnw spring-boot:run) &
	(cd services/query-service && ./mvnw spring-boot:run) &
	(cd services/api-gateway && ./mvnw spring-boot:run) &
	cd frontend && npm run dev

down:
	@pkill -f 'spring-boot:run' 2>/dev/null || true
	@pkill -f 'vite' 2>/dev/null || true

# Tests
test:
	(cd services/rss-fetcher && ./mvnw test)
	(cd services/embedding-service && ./mvnw test)
	(cd services/query-service && ./mvnw test)
	(cd services/api-gateway && ./mvnw test)

test-fetcher:
	cd services/rss-fetcher && ./mvnw test

test-embedding:
	cd services/embedding-service && ./mvnw test

test-query:
	cd services/query-service && ./mvnw test

test-gateway:
	cd services/api-gateway && ./mvnw test

test-frontend:
	cd frontend && npm test
