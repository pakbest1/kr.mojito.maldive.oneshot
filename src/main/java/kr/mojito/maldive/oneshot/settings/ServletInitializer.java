package kr.mojito.maldive.oneshot.settings;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

import kr.mojito.maldive.oneshot.MojitoMaldiveWebApplication;

public class ServletInitializer extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(MojitoMaldiveWebApplication.class);
	}

}
