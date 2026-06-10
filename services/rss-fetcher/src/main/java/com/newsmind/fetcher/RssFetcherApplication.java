package com.newsmind.fetcher;

import com.newsmind.fetcher.config.FeedsConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties(FeedsConfig.class)
public class RssFetcherApplication {

	public static void main(String[] args) {
		SpringApplication.run(RssFetcherApplication.class, args);
	}

}
