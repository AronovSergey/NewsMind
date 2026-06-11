package com.newsmind.fetcher;

import com.newsmind.fetcher.scheduler.FetchScheduler;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
@TestPropertySource(properties = "spring.jpa.hibernate.ddl-auto=none")
class RssFetcherApplicationTests {

	@MockitoBean
	FetchScheduler fetchScheduler;

	@Test
	void contextLoads() {
	}

}
