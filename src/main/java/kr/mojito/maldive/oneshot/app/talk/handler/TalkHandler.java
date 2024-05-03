package kr.mojito.maldive.oneshot.app.talk.handler;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

import kr.mojito.maldive.oneshot.app.talk.model.TalkConsts;

//@Configuration
//@EnableWebSocket
//@RequiredArgsConstructor
@Component
public class TalkHandler implements WebSocketHandler {
	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	private List<WebSocketSession> sessions = new ArrayList<>();

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		HttpHeaders httpHeaders = session.getHandshakeHeaders();
		logger.debug("afterConnectionEstablished [httpHeaders:"+ httpHeaders +"][id:"+ session.getId() +"]");

		session.sendMessage(new TextMessage(TalkConsts.PING +" "+ session.getId()));  // TalkMessage.builder().contents("ping uuid").build());
		//TextMessage textMessage = new TextMessage("welcome");

		sessions.add(session);
	}

	@Override
	public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
		String mesg = (String) message.getPayload();
		logger.debug("handleMessage : ["+ mesg +"]");

		if (mesg != null && mesg.startsWith(TalkConsts.PONG)) { return; }

		session.sendMessage(message);
	}

	@Override
	public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
		logger.debug("handleTransportError");

	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
		logger.debug("afterConnectionClosed");
		sessions.remove(session);
	}

	@Override
	public boolean supportsPartialMessages() {
		logger.debug("supportsPartialMessages");
		return false;
	}

}
