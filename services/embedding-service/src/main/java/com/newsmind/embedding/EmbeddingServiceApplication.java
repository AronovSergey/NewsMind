package com.newsmind.embedding;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.newsmind.embedding", "com.newsmind.common"})
public class EmbeddingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmbeddingServiceApplication.class, args);
	}

}
