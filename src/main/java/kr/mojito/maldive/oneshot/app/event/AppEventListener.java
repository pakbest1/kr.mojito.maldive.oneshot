package kr.mojito.maldive.oneshot.app.event;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AppEventListener {

	@EventListener
	public void onEvent(AppEvent event) {
		System.out.println("EpicItEvent handling, data: " + event.getSource());
	}

}
