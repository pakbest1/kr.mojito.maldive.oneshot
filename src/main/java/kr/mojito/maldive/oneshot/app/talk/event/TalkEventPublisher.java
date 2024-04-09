package kr.mojito.maldive.oneshot.app.talk.event;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
public class TalkEventPublisher {
	private TalkEventPublisher() {}

	@Autowired
	private ApplicationEventPublisher _eventPublisher;
	private static ApplicationEventPublisher eventPublisher;

	@PostConstruct
	private void postConstruct() {
		eventPublisher = this._eventPublisher;
	}


	public static void publishEvent(Object event) {
		eventPublisher.publishEvent( event );
	}

	public static void onEvent(Object event) {
		publishEvent( event );
	}
}
