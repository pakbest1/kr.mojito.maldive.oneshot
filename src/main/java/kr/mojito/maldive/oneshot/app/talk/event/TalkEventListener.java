package kr.mojito.maldive.oneshot.app.talk.event;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class TalkEventListener {

	@EventListener
	public void onEvent(TalkEvent event) {
		System.out.println("TalkEvent handling, data: " + event.getSource());
	}

}
