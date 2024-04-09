package kr.mojito.maldive.oneshot.app.talk.model;

import org.springframework.stereotype.Component;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Component
@Builder
@ToString
@Getter @Setter
public class TalkMessage {

	private String sender;
	private String channel;
	private String contents;
	private String type;

}
