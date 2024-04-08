package kr.mojito.maldive.oneshot.app.utils;

import java.util.Map;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

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
}
