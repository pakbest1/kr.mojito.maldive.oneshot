package kr.mojito.maldive.oneshot._bootstrap.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.Nullable;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

public class NoCacheInterceptor implements HandlerInterceptor {

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

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable Exception ex) throws Exception {

		//return true;
	}

}
