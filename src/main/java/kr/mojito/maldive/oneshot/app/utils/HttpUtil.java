package kr.mojito.maldive.oneshot.app.utils;

import java.net.URL;

import okhttp3.CertificatePinner;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class HttpUtil {
	private HttpUtil() {}
	
	public static String requestGet(String surl) {
		if (surl == null) { return null; }
		String s = null;
		URL url;
		
		try {
			url = new URL(surl);
			
			OkHttpClient client = !surl.startsWith("https:/")
				? new OkHttpClient() 
				: new OkHttpClient.Builder().certificatePinner(
					new CertificatePinner.Builder()
						.add(url.getHost())  // , "sha256/afwiKY3RxoMmLkuRW1l7QsPZTJPwDS2pdDROQjXw8ig=")
						.build()
				).build()
			;
				
			Request request = new Request.Builder()
				.url(surl)
				.build();
			
			Response response = client.newCall(request).execute();
			s = response.body().string();
			
		} catch (Exception e) {
			e.printStackTrace();
			s = null;
		}
		
		return s;
	}
	
	public static void main(String[] args) {
		String se = "================================================================================================\n";
		String ss = "------------------------------------------------------------------------------------------------\n";  // String.format("%-80s", "-"); // "-".repeat(80);
		
		String s = HttpUtil.requestGet("https://publicobject.com/robots.txt");
		System.out.println(se+"[response] >>>\n"+ss + s.trim() + "\n"+se);
		
	}
}
