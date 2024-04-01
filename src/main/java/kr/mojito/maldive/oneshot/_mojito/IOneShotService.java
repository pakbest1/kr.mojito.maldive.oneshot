package kr.mojito.maldive.oneshot._mojito;

import java.util.Map;

public interface IOneShotService {

	Object list(Map<String, Object> map) throws Exception;
	Object item(Map<String, Object> map) throws Exception;
	Object save(Map<String, Object> map) throws Exception;
	Object dele(Map<String, Object> map) throws Exception;

}
