package kr.mojito.maldive.oneshot.security.oauth2.model;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

// 출처: https://co-de.tistory.com/29 [코알못:티스토리]
@Data
public class OAuthToken {
	
	@JsonIgnoreProperties(ignoreUnknown = true)
	@Data
	public static class response{

		private String access_token;
		private String token_type;
		private String refresh_token;
		private long expires_in;
		private String scope;

	}

	@Data
	public static class request {

		@Data
		public static class accessToken {
			public String code;
			private String grant_type;
			private String redirect_uri;

			public Map<?, ?> getMapData() {
				Map<String, String> map = new HashMap<>();
				
				map.put(OAuthConsts.CODE        , code        );
				map.put(OAuthConsts.GRANT_TYPE  , grant_type  );
				map.put(OAuthConsts.REDIRECT_URI, redirect_uri);
				
				return map;
			}
		}

		@Data
		public static class refrashToken{
			private String refreshToken;
			private String grant_type;

			public Map<?, ?> getMapData() {
				Map<String, String> map = new HashMap<>();
				
				map.put(OAuthConsts.REFRESH_TOKEN, refreshToken);
				map.put(OAuthConsts.GRANT_TYPE   , grant_type  );
				
				return map;
			}
		}
	}
	
}
