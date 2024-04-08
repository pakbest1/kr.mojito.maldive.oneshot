package kr.mojito.maldive.oneshot._bootstrap.resolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

public class MethodArgumentResolver implements HandlerMethodArgumentResolver {

	@Override
	public boolean supportsParameter(MethodParameter parameter) {
//		parameter.hasParameterAnnotation(LoginUser.class);
//		boolean hasLoginAnnotation = parameter.hasParameterAnnotation(LoginUser.class);
//		boolean hasOwnerType = SessionDto.class.isAssignableFrom(parameter.getParameterType());

		return false;  // hasLoginAnnotation && hasOwnerType;
	}

	@Override
	public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
		HttpServletRequest request = (HttpServletRequest) webRequest.getNativeRequest();
		HttpSession session = request.getSession(false);

		if (session==null) { return null; }
		return null;  // session.getAttribute(SessionConst.LOGIN_MEMBER);
	}
}
