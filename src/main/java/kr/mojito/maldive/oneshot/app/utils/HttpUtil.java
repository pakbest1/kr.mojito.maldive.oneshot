package kr.mojito.maldive.oneshot.app.utils;

import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import okhttp3.CertificatePinner;
import okhttp3.FormBody;
import okhttp3.FormBody.Builder;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Component
@SuppressWarnings("unused")
public class HttpUtil {
	private HttpUtil() {}
	
	@SuppressWarnings("unchecked")
	private static Object _request(String surl, String method, String mediatype, Object body) {
		if (surl      == null) { return null; }
		
		if (method    == null) { method    = HttpConsts.Methods.GET                     ; }
		if (mediatype == null) { mediatype = HttpConsts.MediaTypes.MEDIATYPE_HTML_STRING; }
		
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
			if (body != null && HttpConsts.Methods.POST.equals(method)) {
//				if (body instanceof String) {
//					//ObjectMapper objectmapper = new ObjectMapper();
//					//objectmapper.
//				}
				//okhttp3.MediaType.get(s)
				//okhttp3.MediaType.get("html");
				//MediaTypes.MEDIATYPE_HTML

				if (HttpConsts.MediaTypes.MEDIATYPE_JSON_STRING.equals(mediatype)) {
					String j = null;
					try {
						j = body instanceof String ? (String) body : (new ObjectMapper()).writeValueAsString(body);
					} catch (Exception e) {
						j = null;
					}
					
					requestBuilder.post(RequestBody.create(MediaType.parse(mediatype), j));
				} else if (HttpConsts.MediaTypes.MEDIATYPE_FORM_DATA_STRING.equals(mediatype)) {
					FormBody formBody        = null;
					Builder  formBodyBuilder = new FormBody.Builder();
					if (body instanceof Map) {
						Map<String, ?> map = (Map<String, ?>) body;
						
						for (Entry<String, ?> entry : map.entrySet()) {
							String key = entry.getKey(), value = entry.getValue() == null ? null : entry.getValue().toString();
							formBodyBuilder.add(key, value);
						}
						
						formBody = formBodyBuilder.build();
					}
					requestBuilder.post(formBody);
				}
				
				
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
	
	
	
	public static void log(String s) {
		log(s, null);
	}
	public static void log(String s, String prefix) {
		String sff = "================================================================================================\n";
		String smd = "------------------------------------------------------------------------------------------------\n";  // String.format("%-80s", "-"); // "-".repeat(80);
		System.out.println(sff+"["+ (prefix == null ? "" : prefix + " --> ") +"response] >>>\n"+smd + s.trim() + "\n"+sff);
	}
	
	
	
	public static void main(String[] args) {
		String s;
		
		okhttp3.MediaType mediaType = okhttp3.MediaType.get("text/html;charset=utf-8");
		log(mediaType.toString());
		
//		// case : get
//		s = (String) HttpUtil.requestGet("https://publicobject.com/robots.txt");
//		log(s, "HttpUtil.requestGet");
		
		
		// case : post
		Map<String, Object> mbody = new HashMap<String, Object>() {{
			put("param1", "1");
			put("param2", "2");
			put("param3", "3");
		}};
		s = (String) HttpUtil.request("https://publicobject.com/robots.txt", HttpConsts.Methods.POST, HttpConsts.MediaTypes.MEDIATYPE_RAW_DATA.toString(), mbody);
		log(s, "HttpUtil.request");
		
	}
	
}
