package kr.mojito.maldive.oneshot.app.talk.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

//@Configuration
//@EnableWebSocket
//@RequiredArgsConstructor
@Component
public class TalkWebSocketHandler implements WebSocketHandler {
	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		logger.debug("afterConnectionEstablished");
		session.sendMessage(new TextMessage("ping uuid"));  // TalkMessage.builder().contents("ping uuid").build());
		//TextMessage textMessage = new TextMessage("welcome");
	}

	@Override
	public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
		logger.debug("handleMessage : "+ message.getPayload());
		session.sendMessage(message);
	}

	@Override
	public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
		logger.debug("handleTransportError");

	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
		logger.debug("afterConnectionClosed");

	}

	@Override
	public boolean supportsPartialMessages() {
		logger.debug("supportsPartialMessages");
		return false;
	}

}