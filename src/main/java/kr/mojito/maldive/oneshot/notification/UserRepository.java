package kr.mojito.maldive.oneshot.notification;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class UserRepository {

	private final Map<Long, User> users = new ConcurrentHashMap<>();

	public User findById(Long id) {
		return users.get(id);
	}
}
