package kr.mojito.maldive.oneshot.utils;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public class MojitoUtil {


	public static void showRequestParameter(HttpServletRequest req) {
		Map<String, String[]> maps = req.getParameterMap();
		for (String key : maps.keySet()) {
			System.out.println("["+ key +":"+ req.getParameter(key) +"]");
		}
	}
}
