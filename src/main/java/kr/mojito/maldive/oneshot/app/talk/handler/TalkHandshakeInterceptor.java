package kr.mojito.maldive.oneshot.app.talk.handler;

import java.io.UnsupportedEncodingException;
import java.net.URI;
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
//		// Auto-generated method stub
//		String qs = request.getURI().getQuery();
		//attributes.putAll();
		procQuerystring2Attributes(request, attributes);
		//procQuery(qs, attributes);

		return true;
	}

	@Override
	public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
		// Auto-generated method stub

	}

	private Map<String, Object> procQuerystring2Attributes(ServerHttpRequest request, Map<String, Object> attributes) throws UnsupportedEncodingException {
		return procQuerystring2Attributes(request.getURI(), attributes);
	}
	private Map<String, Object> procQuerystring2Attributes(URI uri, Map<String, Object> attributes) throws UnsupportedEncodingException {

		String query = uri.getQuery();
		if (attributes == null) { attributes = new HashMap<String, Object>(); }

		String[] pairs = query.split("&");
		for (String pair : pairs) {
			int idx = pair.indexOf("=");
			attributes.put(
					URLDecoder.decode(pair.substring(      0, idx), "UTF-8"),
					URLDecoder.decode(pair.substring(idx + 1     ), "UTF-8")
			);
		}

		return attributes;
	}

//	public Map<String, Object> procQuery(String query, Map<String, Object> query_pairs) {
//		if (query == null) {
//			return Collections.emptyMap();
//		}
//		return Arrays.stream(query.split("&"))
//				.map(this::splitQueryParameter)
//				.collect(Collectors.groupingBy(SimpleImmutableEntry::getKey, LinkedHashMap::new, mapping(Map.Entry::getValue, toList())));
//	}
//
//	public SimpleImmutableEntry<String, String> splitQueryParameter(String it) {
//		final int idx = it.indexOf("=");
//		final String key = idx > 0 ? it.substring(0, idx) : it;
//		final String value = idx > 0 && it.length() > idx + 1 ? it.substring(idx + 1) : null;
//		return new SimpleImmutableEntry<>(
//			URLDecoder.decode(key  , StandardCharsets.UTF_8),
//			URLDecoder.decode(value, StandardCharsets.UTF_8)
//		);
//	}

}
