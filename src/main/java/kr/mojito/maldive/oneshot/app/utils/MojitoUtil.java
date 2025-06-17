package kr.mojito.maldive.oneshot.app.utils;

import java.util.Map;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Component
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MojitoUtil {
	private static Logger  logger;

	@PostConstruct
	void postConstruct() {
		logger = LoggerFactory.getLogger(this.getClass());
	}

	public static void showRequestParameter(HttpServletRequest req) {
		StringBuffer sb = new StringBuffer();

		Map<String, String[]> maps = req.getParameterMap();
		for (String key : maps.keySet()) {
			sb.append("["+ key +":"+ req.getParameter(key) +"]");
		}

		logger.debug(sb.toString());
	}


	private static final ObjectMapper objectmapper       = new ObjectMapper();
	//private static final ObjectWriter objectmapperpretty = new ObjectMapper().writerWithDefaultPrettyPrinter();
	@SuppressWarnings("unchecked")
	public static <T> T fromJSON(String json, Class<?> clazz) {
		T t = null;

		try {
//			Constructor<?> constructor = clazz.getDeclaredConstructor();
//			if (!constructor.isAccessible()) {
//				constructor.setAccessible(true);
//			}

			t = (T) objectmapper.readValue(json, clazz);
			//objectmapper.writeValueAsString(constructor);

		} catch (Exception e) {
			logger.error("Exception", e);;  // TODO Auto-generated catch block
		}

		return t;
	}

	public static String toJSON(Object o) {
		String s = null;
		try {
			s = objectmapper.writeValueAsString(o);
		} catch (Exception e) {
			logger.error("Exception", e);;  // TODO Auto-generated catch block
		}

		return s;
	}

	public static String toPrettyJSON(Object o) {
		return toJSON4Indent(o);
	}
	public static String toJSON4Indent(Object o) {
		String s = null;

		try {
			s = objectmapper.writerWithDefaultPrettyPrinter().writeValueAsString(o);
		} catch (Exception e) {
			logger.error("Exception", e);;  // TODO Auto-generated catch block
		}

		return s;
	}

}
