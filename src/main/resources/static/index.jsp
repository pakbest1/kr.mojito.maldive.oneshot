<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%-- <%@page import="sun.misc.BASE64Decoder"%> --%>
<%
String authorization = request.getHeader("Authorization");

// if (authorization == null) {
// 	response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
// 	response.setHeader("WWW-Authenticate", "Basic realm=\"My Realm Name\"");
// } else {
// 	String userInfo = authorization.substring(6).trim();
// 	BASE64Decoder decoder = new BASE64Decoder();
// 	String info = new String(decoder.decodeBuffer(userInfo));
// 	int index = info.indexOf(":");
// 	String user = info.substring(0, index);
// 	String password = info.substring(index + 1);
// 	String realUser = "Admin";
// 	String realPassword = "1234";
// 	if (realUser.equals(user) && realPassword.equals(password)) {
// 		out.println("인증 성공함");
// 	} else {
// 		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
// 		response.setHeader("WWW-Authenticate", "BASIC realm=\"My Realm\"");
// 	}
// }
%>