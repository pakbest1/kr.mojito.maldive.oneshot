package kr.mojito.maldive.oneshot._bootstrap.mybatis.typehandler;

import java.io.StringReader;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.TypeHandler;

@SuppressWarnings("rawtypes")
//@MappedJdbcTypes({ JdbcType.LONGVARCHAR })
public class LongvarcharHandler implements TypeHandler {
	// 파라메터 셋팅할때
	@Override
	public void setParameter(PreparedStatement ps, int i, Object parameter, JdbcType jdbcType) throws SQLException {
		String s = (String) parameter;
		StringReader reader = new StringReader(s);
		ps.setCharacterStream(i, reader, s.length());
	}

	// Statement 로 SQL 호출해서 ResultSet 으로 컬럼값을 읽어올때
	@Override
	public Object getResult(ResultSet rs, String columnName) throws SQLException {
		return rs.getString(columnName);
	}

	@Override
	public Object getResult(ResultSet rs, int columnIndex) throws SQLException {
		return rs.getString(columnIndex);
	}

	// CallableStatement 로 SQL 호출해서 컬럼값 읽어올때
	@Override
	public Object getResult(CallableStatement cs, int columnIndex) throws SQLException {
		return cs.getString(columnIndex);
	}


}
