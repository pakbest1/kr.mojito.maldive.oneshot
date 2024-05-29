package kr.mojito.maldive.oneshot.app.sys.repository;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

@Repository
@CacheConfig(cacheNames="knock")
public class KnockRepository {

	@Autowired
	private SqlSession session;

	private final String ns = "kr.mojito.maldive.oneshot.app.knock.";

	@Cacheable(key="'all'")
	public List<?> selectAll() {
		List<Map<String, Object>> l = session.selectList(ns+ "selectHello");
		return l;
	}
}
