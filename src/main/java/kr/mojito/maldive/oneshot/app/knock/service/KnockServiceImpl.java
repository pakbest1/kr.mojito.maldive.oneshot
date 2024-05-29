package kr.mojito.maldive.oneshot.app.knock.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

import kr.mojito.maldive.oneshot.app.knock.repository.KnockRepository;

@Service
public class KnockServiceImpl implements KnockService {
	
	@Autowired
	private CacheManager cacheManager;

	@Autowired
	private KnockRepository repository;
	
	@Override
	public List<?> selectAll() throws Exception {
		return repository.selectAll();
	}

	@SuppressWarnings("serial")
	@Override
	public Map<String, Object>  evictAll() throws Exception {
		cacheManager.getCacheNames().stream()
			.forEach(cacheName -> cacheManager.getCache(cacheName).clear());
		
		Map<String, Object> r = new HashMap<String, Object>() {{
			put("result", "ok");
		}};
		
		return r;
	}

}
