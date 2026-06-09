-include .env
export

.PHONY: infra up down

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
