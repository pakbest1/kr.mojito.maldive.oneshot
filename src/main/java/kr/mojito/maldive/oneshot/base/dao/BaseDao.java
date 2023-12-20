package kr.mojito.maldive.oneshot.base.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public class BaseDao { // extends SqlSessionTemplate {

//	@Autowired
//	public BaseDao(SqlSessionFactory sqlSessionFactory) {
//		super(sqlSessionFactory);
//	}
//
//	@Autowired
//	public BaseDao(SqlSessionFactory sqlSessionFactory, ExecutorType executorType) {
//		super(sqlSessionFactory, executorType);
//	}
//
//	@Autowired
//	public BaseDao(SqlSessionFactory sqlSessionFactory, ExecutorType executorType,
//			PersistenceExceptionTranslator exceptionTranslator) {
//		super(sqlSessionFactory, executorType, exceptionTranslator);
//	}
	
	public <E> List<E> selectList(String sql, Object parameter) {
		
		return null;
	}
}
