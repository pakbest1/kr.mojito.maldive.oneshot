package kr.mojito.maldive.oneshot.app.sys.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

@Service
public class EcacheServiceImpl implements EcacheService {
	
	@Autowired
	private CacheManager cacheManager;
	
	@SuppressWarnings("serial")
	@Override
	public Map<String, Object>  evict(String id) throws Exception {
		cacheManager.getCacheNames().stream()
			.forEach(cacheName -> cacheManager.getCache(cacheName).clear());
		
		Map<String, Object> r = new HashMap<String, Object>() {{
			put("result", "ok");
		}};
		
		return r;
	}
	
}
