package kr.mojito.maldive.oneshot.utils;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;

@Component
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
