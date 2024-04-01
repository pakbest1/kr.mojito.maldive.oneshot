package kr.mojito.maldive.oneshot.wpush.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import kr.mojito.maldive.oneshot.wpush.repository.EmitterRepository;
import kr.mojito.maldive.oneshot.wpush.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

	private final UserRepository userRepository;
	private final EmitterRepository emitterRepository;


	private static final Long DEFAULT_TIMEOUT = 600L * 1000 * 60;

	public SseEmitter subscribe(Long userId) {
		SseEmitter emitter = createEmitter(userId);

		send(userId, "EventStream Created. [userId="+ userId + "]", "sse 접속 성공");
		return emitter;
	}

	public <T> void notify(Long userId, T data, String comment, String type) {
		//sendToClient(userId, data, comment, type);
		sendAll("notify", data, comment);
	}
	public void notify(Long userId, Object data, String comment) {
		// sendToClient(userId, data, comment);
		sendAll("notify", data, comment);
	}

	private <T> void sendAll(String type, T data, String comment) {
		Map<Long, SseEmitter> emitters = emitterRepository.all();
		for (Map.Entry<Long, SseEmitter> entry : emitters.entrySet()) {
			SseEmitter emitter = entry.getValue();
			send(emitter, data, comment, type);
		}
	}

	private <T> void send(SseEmitter emitter, T data, String comment, String type) {
		// SseEmitter emitter = emitterRepository.get(userId);
		if (emitter != null) {
			try {
				emitter.send(SseEmitter
					.event()
					//.id(String.valueOf(userId))
					.name(type!=null ? type : "sse")
					.data(data)
					.comment(comment)
				);
			} catch (IOException e) {
				//emitterRepository.deleteById(userId);
				emitter.completeWithError(e);
			}
		}
	}

	private <T> void send(Long userId, T data, String comment) {
		send(userId, data, comment, "sse");
	}
	private <T> void send(Long userId, T data, String comment, String type) {
		SseEmitter emitter = emitterRepository.get(userId);
		send(emitter, data, comment, type);
	}


	private SseEmitter createEmitter(Long userId) {
		SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
		emitterRepository.save(userId, emitter);

		emitter.onCompletion(() -> emitterRepository.deleteById(userId));
		emitter.onTimeout   (() -> emitterRepository.deleteById(userId));

		return emitter;
	}

	@SuppressWarnings("unused")
	private User validUser(Long userId) {
		return userRepository.findById(userId);  // .orElseThrow(() -> new CustomException(UserErrorCode.NOT_FOUND_USER));
	}
}
