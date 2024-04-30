package kr.mojito.maldive.oneshot.app.event;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Component
@NoArgsConstructor(access=AccessLevel.PRIVATE) // @RequiredArgsConstructor
public class AppEventPublisher {

	@Autowired
	private ApplicationEventPublisher _eventPublisher;
	private static ApplicationEventPublisher eventPublisher;

	@PostConstruct
	private void postConstruct() {
		eventPublisher = this._eventPublisher;
	}

	public static void publishEvent(AppEvent event) {
		eventPublisher.publishEvent( event );
	}
	public static void onEvent(AppEvent event) {
		publishEvent( event );
	}
}
