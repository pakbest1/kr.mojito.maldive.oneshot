package kr.mojito.maldive.oneshot.app.talk.event;

import org.springframework.stereotype.Component;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Component
@Builder
@Getter @Setter
public class TalkEvent {

	private Object source;
	private Object data;

	public TalkEvent() {

	}

	public TalkEvent(Object source) {
		this(source, 0);
	}

	public TalkEvent(Object source, Object data) {
		this.source = source;
		this.data = data;
	}

}