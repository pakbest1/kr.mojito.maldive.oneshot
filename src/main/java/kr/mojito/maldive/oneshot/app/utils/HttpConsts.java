package kr.mojito.maldive.oneshot.app.utils;

import lombok.NonNull;
import okhttp3.MediaType;

public interface HttpConsts {
	public interface Methods {
		@NonNull final String GET     = "GET"    ;
		@NonNull final String HEAD    = "HEAD"   ;
		@NonNull final String POST    = "POST"   ;
		@NonNull final String PUT     = "PUT"    ;
		@NonNull final String DELETE  = "DELETE" ;
		@NonNull final String OPTIONS = "OPTIONS";
		@NonNull final String PATCH   = "PATCH"  ;
	}
	
	public interface MediaTypes {
		@NonNull final MediaType MEDIATYPE_XML                    = MediaType.parse("text/xml"                         );
		@NonNull final MediaType MEDIATYPE_TEXT                   = MediaType.parse("text/plain"                       );
		@NonNull final MediaType MEDIATYPE_HTML                   = MediaType.parse("text/html"                        );
		@NonNull final MediaType MEDIATYPE_JSON                   = MediaType.parse("application/json"                 );
		@NonNull final MediaType MEDIATYPE_FORM_DATA              = MediaType.parse("multipart/form-data"              );
		@NonNull final MediaType MEDIATYPE_FORM_URLENCODED        = MediaType.parse("application/x-www-form-urlencoded");
		@NonNull final MediaType MEDIATYPE_RAW_DATA               = MediaType.parse("application/octet-stream"         );
		
		@NonNull final String    MEDIATYPE_XML_STRING             = MediaType.parse("text/xml"                         ).toString();
		@NonNull final String    MEDIATYPE_TEXT_STRING            = MediaType.parse("text/plain"                       ).toString();
		@NonNull final String    MEDIATYPE_HTML_STRING            = MediaType.parse("text/html"                        ).toString();
		@NonNull final String    MEDIATYPE_JSON_STRING            = MediaType.parse("application/json"                 ).toString();
		@NonNull final String    MEDIATYPE_FORM_DATA_STRING       = MediaType.parse("multipart/form-data"              ).toString();
		@NonNull final String    MEDIATYPE_FORM_URLENCODED_STRING = MediaType.parse("application/x-www-form-urlencoded").toString();
		@NonNull final String    MEDIATYPE_RAW_DATA_STRING        = MediaType.parse("application/octet-stream"         ).toString();
	}
}
