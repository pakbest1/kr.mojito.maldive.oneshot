package kr.mojito.maldive.oneshot.app.knock.service;

import java.util.List;
import java.util.Map;

public interface KnockService {

	List<?> selectAll() throws Exception;

	Map<String, Object> evictAll() throws Exception;
}
