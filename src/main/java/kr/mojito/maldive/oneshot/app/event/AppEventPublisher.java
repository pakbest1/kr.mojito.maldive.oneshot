package kr.mojito.maldive.oneshot.app.event;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import lombok.NoArgsConstructor;

@Component
@NoArgsConstructor // @RequiredArgsConstructor
public class AppEventPublisher {

	@PostConstruct
	private void postConstruct() {
		eventPublisher = this._eventPublisher;
	}

	@Autowired
	private ApplicationEventPublisher _eventPublisher;
	private static ApplicationEventPublisher eventPublisher;

	public static void publishEvent(Object event) {
		eventPublisher.publishEvent( event );
	}
	public static void onEvent(Object event) {
		publishEvent( event );
	}
}
