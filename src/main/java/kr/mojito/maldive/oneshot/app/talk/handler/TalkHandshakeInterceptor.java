package kr.mojito.maldive.oneshot.app.talk.handler;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

@Component
public class TalkHandshakeInterceptor implements HandshakeInterceptor {

	@Override
	public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
		// Auto-generated method stub
		String qs = request.getURI().getQuery();
		//attributes.putAll();
		getQueryString2Map(qs, attributes);

		return true;
	}

	@Override
	public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
		// Auto-generated method stub

	}


	private Map<String, Object> getQueryString2Map(String query, Map<String, Object> query_pairs) throws UnsupportedEncodingException {
		if (query_pairs == null) { query_pairs = new HashMap<String, Object>(); }

		String[] pairs = query.split("&");
		for (String pair : pairs) {
			int idx = pair.indexOf("=");
			query_pairs.put(URLDecoder.decode(pair.substring(0, idx), "UTF-8"), URLDecoder.decode(pair.substring(idx + 1), "UTF-8"));
		}

		return query_pairs;
	}
}
