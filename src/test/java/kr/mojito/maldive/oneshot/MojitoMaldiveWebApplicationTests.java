package kr.mojito.maldive.oneshot;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;

import kr.mojito.maldive.oneshot._bootstrap.MojitoApplication;

@ExtendWith(SpringExtension.class)       // junit5 - jupiter
@WebAppConfiguration
@ContextConfiguration(classes=MojitoApplication.class)
class MojitoMaldiveWebApplicationTests {

	@Test
	void contextLoads() {
	}

}
