package kr.mojito.maldive.oneshot.app.sys.service;

import java.util.Map;

public interface EcacheService {
	
	Map<String, Object> evict(String id) throws Exception;
	
}
