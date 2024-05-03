package kr.mojito.maldive.oneshot.app.knock.service;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KnockServiceImpl implements KnockService {

	@Autowired
	private SqlSession session;

	private final String ns = "kr.mojito.maldive.oneshot.app.knock.";

	@Override
	public List<?> selectHello() {
		List<?> l = session.selectList(ns+ "selectHello");
		return l;
	}

}
