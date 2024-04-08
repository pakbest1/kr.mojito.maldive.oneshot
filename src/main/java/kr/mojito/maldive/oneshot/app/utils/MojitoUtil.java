package kr.mojito.maldive.oneshot.app.utils;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Component
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MojitoUtil {

	public static void showRequestParameter(HttpServletRequest req) {
		StringBuffer sb = new StringBuffer();

		Map<String, String[]> maps = req.getParameterMap();
		for (String key : maps.keySet()) {
			sb.append("["+ key +":"+ req.getParameter(key) +"]");
		}

		System.out.println(sb.toString());
	}
}
