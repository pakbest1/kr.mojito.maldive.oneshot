package kr.mojito.maldive.oneshot._bootstrap.mybatis.util;

import java.util.HashMap;
import java.util.Map;

@SuppressWarnings("serial")
public class CemelcaseMap<K,V> extends HashMap<K,V> implements Map<K,V> {

	@Override
	public V put(K k, V v) {
		return super.put(toCamelCase((String) k), v);
	}

	@Override
	public V get(Object k) {
		return super.get(toCamelCase((String) k));
	}


	@SuppressWarnings("unchecked")
	K toCamelCase(String s) {
		if (s== null || "".equals(s.trim())) { return (K) s; };

		String[] parts = s.split("_");
		StringBuffer sb = new StringBuffer();

		for (String part : parts) {
			sb.append( sb.toString().equals("") ? part.toLowerCase() : toProperCase(part) );
		}

		return (K) sb.toString();
	}

	String toProperCase(String s) {
		return
			s.substring(0, 1).toUpperCase() +
			s.substring(1   ).toLowerCase()
		;
	}

}