package kr.mojito.maldive.oneshot.wsock;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;

import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;

public class WSockClientStompSessionHandler extends StompSessionHandlerAdapter {
	@Override
	public void handleFrame(StompHeaders headers, Object payload) {

		// 구독한 채널의 메세지 받기
		System.out.println("SpringStompSessionHandler.handleFrame");
		System.out.println("headers = " + headers);
		System.out.println("payload = " + new String((byte[]) payload));
	}

	@Override
	public Type getPayloadType(StompHeaders headers) {
		return Object.class;
	}

	@Override
	public void afterConnected(StompSession session, StompHeaders connectedHeaders) {

		// 구독
		session.subscribe("/sub/cache/karim", this);

		Map<String, Object> params = new HashMap<>();
		params.put("channelId", "karim");
		// 메세지 보냄
		session.send("/sub/cache/karim", params);

		System.out.println("params = " + params);
	}

	@Override
	public void handleException(StompSession session, StompCommand command, StompHeaders headers, byte[] payload, Throwable exception) {
		System.out.println("SpringStompSessionHandler.handleException");
		System.out.println("exception = " + exception);
	}

	@Override
	public void handleTransportError(StompSession session, Throwable exception) {
		// 이부분 서버 꺼져서 처음에 못붙거나, 붙었다가 서버 꺼지면 나옴 이때 재 커넥션 와일 돌리면 될꺼같음
		System.out.println("SpringStompSessionHandler.handleTransportError");
	}
}
