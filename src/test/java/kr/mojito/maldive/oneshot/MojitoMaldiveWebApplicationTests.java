package kr.mojito.maldive.oneshot;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;

import kr.mojito.maldive.oneshot.bootstrap.MojitoMaldiveWebApplication;

@ExtendWith(SpringExtension.class)       // junit5 - jupiter
@WebAppConfiguration
@ContextConfiguration(classes=MojitoMaldiveWebApplication.class)
class MojitoMaldiveWebApplicationTests {

	@Test
	void contextLoads() {
	}

}
