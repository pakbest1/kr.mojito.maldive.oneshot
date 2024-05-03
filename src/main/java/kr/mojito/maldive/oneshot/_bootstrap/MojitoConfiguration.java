package kr.mojito.maldive.oneshot._bootstrap;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import kr.mojito.maldive.oneshot._bootstrap.configure.ConfigureNoCache;
import kr.mojito.maldive.oneshot._bootstrap.configure.ConfigureSqlSessionFactory;

@Configuration
@Import({
	ConfigureNoCache.class,
	ConfigureSqlSessionFactory.class,
})
public class MojitoConfiguration {



}
