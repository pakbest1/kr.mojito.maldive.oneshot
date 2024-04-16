package kr.mojito.maldive.oneshot.app.talk.handler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class TalkWebSocketConfiguration implements WebSocketConfigurer {

	@Autowired
	private final TalkWebSocketHandler talkWebSocketHandler;

	public WebSocketHandler getWebSocketHandler() {
		return talkWebSocketHandler;
	}

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry
			.addHandler(getWebSocketHandler(), "/talk/socket")
			//.addHandler(talkWebSocketHandler, "/talk2/socket")
			.setAllowedOrigins("*")
		;
	}



//	@Bean
//	public WebSocketStompClient WebSocketStompClient(WebSocketStompClient webSocketClient, StompSessionHandler stompSessionHandler) {
//		// client to server message converter
//		webSocketClient.setMessageConverter(new MappingJackson2MessageConverter());
//
//		StompHeaders stompHeaders = new StompHeaders();
//		stompHeaders.add("host", "karim");
//
//		Object[] urlVariables = {};
//		String url = "ws://localhost:8443/ws"; //  "wss://localhost:8443/ws";
//		webSocketClient.connect(url, null, stompHeaders, stompSessionHandler, urlVariables);
//
//		return webSocketClient;
//	}
//
//	@Bean
//	public WebSocketStompClient webSocketClient() {
//		WebSocketClient webSocketClient = new StandardWebSocketClient();
//		return new WebSocketStompClient(webSocketClient);
//	}
//	@Bean
//	public StompSessionHandler stompSessionHandler() {
//		return new WSockClientStompSessionHandler();
//	}

}
