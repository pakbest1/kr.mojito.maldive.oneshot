package kr.mojito.maldive.oneshot._bootstrap;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import kr.mojito.maldive.oneshot._bootstrap.configure.ConfigureSqlSessionFactory;
import kr.mojito.maldive.oneshot._bootstrap.configure.ConfigureWebNoCache;

@Configuration
@EnableCaching
@Import({
	ConfigureWebNoCache.class,
	ConfigureSqlSessionFactory.class,
})
public class MojitoConfiguration {

//	@Autowired
//	private EhcacheEventListener ehcacheEventListener;

}
