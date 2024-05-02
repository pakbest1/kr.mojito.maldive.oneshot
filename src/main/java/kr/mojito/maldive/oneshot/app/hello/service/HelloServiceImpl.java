package kr.mojito.maldive.oneshot.app.hello.service;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HelloServiceImpl implements HelloService {

	@Autowired
	private SqlSession session;

	@Override
	public List<?> selectHello() {
		List<?> l = session.selectList("kr.mojito.maldive.oneshot.app.base"+"."+ "selectHello");
		return l;
	}

}
