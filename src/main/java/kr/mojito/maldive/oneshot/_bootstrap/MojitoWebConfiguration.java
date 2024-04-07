package kr.mojito.maldive.oneshot._bootstrap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.Nullable;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MojitoWebConfiguration implements WebMvcConfigurer {

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

	private class NoCacheInterceptor implements HandlerInterceptor {

		@Override
		public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
			String no_cache = CacheControl.noCache().getHeaderValue();

			// http/1.0
			response.setHeader    (HttpHeaders.PRAGMA       , no_cache);

			// http/1.1
			response.setHeader    (HttpHeaders.CACHE_CONTROL, no_cache);  // "private, no-cache, no-store, must-revalidate");
			response.setIntHeader (HttpHeaders.EXPIRES      , 0);
			response.setDateHeader(HttpHeaders.EXPIRES      , 0);

			if ("HTTP/1.1".equals(request.getProtocol())) {
				response.setHeader(HttpHeaders.CACHE_CONTROL, no_cache);
			}

			return true;
		}

		@Override
		public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable ModelAndView modelAndView) throws Exception {

			//return true;
		}

		public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable Exception ex) throws Exception {
		}
	}

}
