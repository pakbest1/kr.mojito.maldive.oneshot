package kr.mojito.maldive.oneshot.notification;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class EmitterRepository {

	private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

	public Map<Long, SseEmitter> all() {
		return emitters;
	}

	public void save(Long id, SseEmitter emitter) {
		emitters.put(id, emitter);
	}

	public void deleteById(Long userId) {
		emitters.remove(userId);
	}

	public SseEmitter get(Long userId) {
		return emitters.get(userId);
	}
}
