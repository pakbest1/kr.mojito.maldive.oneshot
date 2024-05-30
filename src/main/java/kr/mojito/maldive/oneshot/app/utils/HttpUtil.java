package kr.mojito.maldive.oneshot.app.utils;

import java.net.URL;

import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import okhttp3.CertificatePinner;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@Component
@SuppressWarnings("unused")
public class HttpUtil {
	private HttpUtil() {}
	
	private static final String DEFAULT_HTTP_METHOD_POST = HttpMethod.POST.toString();
	
	private static Object _request(String surl, String method, String contenttype, Object body) {
		if (surl        == null) { return null; }
		if (method      == null) { method      = HttpMethod.GET                    .toString(); }
		if (contenttype == null) { contenttype = MediaType.APPLICATION_OCTET_STREAM.toString(); }
		
		String s = null;
		URL url;
		
		try {
			url = new URL(surl);
			
			OkHttpClient client = !surl.startsWith("https:/") ? new OkHttpClient() : new OkHttpClient.Builder().certificatePinner(
				new CertificatePinner.Builder()
					.add(url.getHost())  // , "sha256/afwiKY3RxoMmLkuRW1l7QsPZTJPwDS2pdDROQjXw8ig=")
					.build()
			).build();
			
			Request.Builder requestBuilder = new Request.Builder().url(surl);
			if (body != null && DEFAULT_HTTP_METHOD_POST.equals(method)) {
//				if (body instanceof String) {
//					//ObjectMapper objectmapper = new ObjectMapper();
//					//objectmapper.
//				}
			}
			
			Response response = client.newCall(requestBuilder.build()).execute();
			s = response.body().string();
			
		} catch (Exception e) {
			e.printStackTrace();
			s = null;
		}
		
		return s;
	}
	
	private static Object request(String surl, String method, String contenttype) {
		return _request(surl, method, contenttype, null);
	}
	private static Object request(String surl, String method, String contenttype, Object body) {
		return _request(surl, method, contenttype, body);
	}
	
	public static Object requestGet(String surl, Object body) {
		if (surl == null) { return null; }
		return _request(surl, "get", null, null);
	}
	public static Object requestGet(String surl) {
		return requestGet(surl, null);
	}
	
	public static Object requestJson(String surl, Object body) {
		return null;
	}
	public static Object requestJson(String surl) {
		return requestJson(surl, null);
	}
	
	public static void main(String[] args) {
		String s;
		s = (String) HttpUtil.requestGet("https://publicobject.com/robots.txt");
		log(s, "HttpUtil.requestGet");
		
		s = (String) HttpUtil.request("https://publicobject.com/robots.txt", "get", "text/plain");
		log(s, "HttpUtil.request");
	}
	
	public static void log(String s) {
		log(s, null);
	}
	public static void log(String s, String prefix) {
		String sff = "================================================================================================\n";
		String smd = "------------------------------------------------------------------------------------------------\n";  // String.format("%-80s", "-"); // "-".repeat(80);
		System.out.println(sff+"["+ (prefix == null ? "" : prefix + " --> ") +"response] >>>\n"+smd + s.trim() + "\n"+sff);
	}
}
