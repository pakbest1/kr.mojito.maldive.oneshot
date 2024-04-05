package kr.mojito.maldive.oneshot.wsock;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WSockConfiguration implements WebSocketConfigurer {

	private final WebSocketHandler webSocketHandler;

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		// TODO Auto-generated method stub
		registry.addHandler(webSocketHandler, "/ws").setAllowedOrigins("*");
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
