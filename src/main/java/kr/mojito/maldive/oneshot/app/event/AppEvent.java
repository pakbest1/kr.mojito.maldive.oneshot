package kr.mojito.maldive.oneshot.app.event;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
public class AppEvent {

	@NonNull private Object source;
	@NonNull private Object data;

}
