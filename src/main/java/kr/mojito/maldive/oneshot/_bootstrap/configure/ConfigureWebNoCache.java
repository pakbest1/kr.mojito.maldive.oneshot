package kr.mojito.maldive.oneshot._bootstrap.configure;

import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import kr.mojito.maldive.oneshot._bootstrap.interceptor.NoCacheInterceptor;

//@Configuration
public class ConfigureWebNoCache implements WebMvcConfigurer {

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
}
