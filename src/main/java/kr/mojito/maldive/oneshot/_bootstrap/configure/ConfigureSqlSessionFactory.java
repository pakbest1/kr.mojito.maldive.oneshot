package kr.mojito.maldive.oneshot._bootstrap.configure;

import java.io.Closeable;
import java.io.IOException;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.zaxxer.hikari.HikariDataSource;

import kr.mojito.maldive.oneshot._bootstrap.mybatis.resreshable.RefreshableSqlSessionFactoryBean;

//@Configuration
@EnableTransactionManagement
public class ConfigureSqlSessionFactory implements Closeable {

	// Config > Mybatis
	@Autowired
	private ApplicationContext applicationContext;

	@Value("${mybatis.config-location:classpath:/mybatis/mybatis-config.xml}")
	private String mybatis_config_location;

	@Value("${mybatis.mapper-locations:/mybatis/mapper/**/*.xml}")
	private String mybatis_mapper_locations;

	private HikariDataSource hikariDataSource;

	@Bean
	public  SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
		hikariDataSource = new HikariDataSource();
		hikariDataSource.setDataSource(dataSource);

		//final SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
		final SqlSessionFactoryBean sessionFactory = new RefreshableSqlSessionFactoryBean();
		((RefreshableSqlSessionFactoryBean) sessionFactory).setInterval(1000);
		// sessionFactory.getObject().getConfiguration().setMapUnderscoreToCamelCase(true);

		sessionFactory.setDataSource(hikariDataSource);

//		PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
//		sessionFactory.setConfigLocation (resolver.getResources(mybatis_config_location )[0]);
//		sessionFactory.setMapperLocations(resolver.getResources(mybatis_mapper_locations)   );

		sessionFactory.setConfigLocation (applicationContext.getResource (mybatis_config_location ));  // resolver.getResources(mybatis_config_location )[0]);  // applicationContext.getResource(config_location)  // "classpath:mybatis/mybatis-config.xml"
		sessionFactory.setMapperLocations(applicationContext.getResources(mybatis_mapper_locations));  // resolver.getResources(mybatis_mapper_locations)   );  // "classpath:mybatis/mapper/**/*.xml"


		return sessionFactory.getObject();
	}

	@Override
	public void close() throws IOException {

	}

}
