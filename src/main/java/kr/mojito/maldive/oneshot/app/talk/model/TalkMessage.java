package kr.mojito.maldive.oneshot.app.talk.model;

import org.springframework.web.socket.WebSocketMessage;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Builder
@ToString
@Getter @Setter
public class TalkMessage implements WebSocketMessage<TalkMessage> {

	private String sender;
	private String channel;
	private String contents;
	private String type;

	@Override
	public TalkMessage getPayload() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public int getPayloadLength() {
		// TODO Auto-generated method stub
		return 0;
	}
	@Override
	public boolean isLast() {
		// TODO Auto-generated method stub
		return false;
	}

}
