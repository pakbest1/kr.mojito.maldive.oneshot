package kr.mojito.maldive.oneshot.notification;

import java.io.IOException;
import java.util.Map;

import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

	private final UserRepository userRepository;
	private final EmitterRepository emitterRepository;


	private static final Long DEFAULT_TIMEOUT = 600L * 1000 * 60;

	public SseEmitter subscribe(Long userId) {
		SseEmitter emitter = createEmitter(userId);

		sendToClient(userId, "EventStream Created. [userId="+ userId + "]", "sse 접속 성공");
		return emitter;
	}

	public <T> void notify(Long userId, T data, String comment, String type) {
		//sendToClient(userId, data, comment, type);
		notifyAll("notify", data, comment);
	}
	public void notify(Long userId, Object data, String comment) {
		// sendToClient(userId, data, comment);
		notifyAll("notify", data, comment);
	}

	private <T> void notifyAll(String type, T data, String comment) {
		Map<Long, SseEmitter> emitters = emitterRepository.list();
		for (Map.Entry<Long, SseEmitter> entry : emitters.entrySet()) {
			SseEmitter emitter = entry.getValue();
			sendToClient(emitter, data, comment, type);
		}
	}

	private void sendToClient(Long userId, Object data, String comment) {
		SseEmitter emitter = emitterRepository.get(userId);
		if (emitter != null) {
			try {
				emitter.send(SseEmitter.event()
						.id(String.valueOf(userId))
						.name("sse")
						.data(data)
						.comment(comment));
			} catch (IOException e) {
				emitterRepository.deleteById(userId);
				emitter.completeWithError(e);
			}
		}
	}

	private <T> void sendToClient(Long userId, T data, String comment, String type) {
		SseEmitter emitter = emitterRepository.get(userId);
		sendToClient(emitter, data, comment, type);
	}
	private <T> void sendToClient(SseEmitter emitter, T data, String comment, String type) {
		if (emitter != null) {
			try {
				emitter.send(SseEmitter.event()
						//.id(String.valueOf(userId))
						.name(type)
						.data(data)
						.comment(comment));
			} catch (IOException e) {
				//emitterRepository.deleteById(userId);
				emitter.completeWithError(e);
			}
		}
	}

	private SseEmitter createEmitter(Long userId) {
		SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
		emitterRepository.save(userId, emitter);

		emitter.onCompletion(() -> emitterRepository.deleteById(userId));
		emitter.onTimeout   (() -> emitterRepository.deleteById(userId));

		return emitter;
	}

	private User validUser(Long userId) {
		return userRepository.findById(userId);  // .orElseThrow(() -> new CustomException(UserErrorCode.NOT_FOUND_USER));
	}
}
