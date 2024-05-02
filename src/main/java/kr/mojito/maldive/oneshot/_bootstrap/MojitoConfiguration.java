package kr.mojito.maldive.oneshot._bootstrap;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import kr.mojito.maldive.oneshot._bootstrap.interceptor.NoCacheInterceptor;

@Configuration
@EnableTransactionManagement
public class MojitoConfiguration implements WebMvcConfigurer {

//	@Override
//	public void addResourceHandlers(final ResourceHandlerRegistry registry) {
//			registry
//				.addResourceHandler  ("/forms/**")                 // 해당 경로의 요청이 올 때
////				.addResourceLocations("classpath:/form/")    // classpath 기준으로 'm' 디렉토리 밑에서 제공
//				//.setCachePeriod(20)                        // 캐싱 지정
//				.setCacheControl(CacheControl.noCache())
//			;
//	}

	@Override
	public void addInterceptors(final InterceptorRegistry registry) {
		registry
			.addInterceptor(new NoCacheInterceptor())
		;

	}



	// Config > Mybatis
	@Autowired
	private ApplicationContext applicationContext;

	@Value("${mybatis.config-location:classpath:/mybatis/mybatis-config.xml}")
	private String mybatis_config_location;

	@Value("${mybatis.mapper-locations:/mybatis/mapper/**/*.xml}")
	private String mybatis_mapper_locations;


	@Bean
	@SuppressWarnings("unused")
	public  SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
		final SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
		sessionFactory.setDataSource(dataSource);

		PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
		sessionFactory.setConfigLocation (applicationContext.getResource (mybatis_config_location ));  // resolver.getResources(mybatis_config_location )[0]);  // applicationContext.getResource(config_location)  // "classpath:mybatis/mybatis-config.xml"
		sessionFactory.setMapperLocations(applicationContext.getResources(mybatis_mapper_locations));  // resolver.getResources(mybatis_mapper_locations)   );  // "classpath:mybatis/mapper/**/*.xml"

		// sessionFactory.getObject().getConfiguration().setMapUnderscoreToCamelCase(true);

		return sessionFactory.getObject();
	}

}
