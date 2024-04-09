package kr.mojito.maldive.oneshot.app.utils;

import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.MimeType;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Component
@NoArgsConstructor(access=AccessLevel.PRIVATE)
public class MediaTypeUtiles {
	private static Logger  logger;

	@Autowired
	private ServletContext _servletContext_;
	static  ServletContext  servletContext;

	@PostConstruct
	void postConstruct() {
		logger = LoggerFactory.getLogger(this.getClass());

		servletContext = _servletContext_;
	}


	public static MediaType getMediaTypeForFileName(String filename) {
		MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;

		if (filename != null) {
			mediaType = MediaTypeFactory.getMediaType(filename).orElse(MediaType.APPLICATION_OCTET_STREAM);
		}

		//return MediaType.APPLICATION_OCTET_STREAM;  //"Application/octet-stream";
		return mediaType;
	}

	/**
	 * TODO: move to MediaType static method
	 */
	public static List<MediaType> toMediaTypes(List<MimeType> mimeTypes) {
		return mimeTypes.stream().map(MediaTypeUtiles::toMediaType)
				.collect(Collectors.toList());
	}

	/**
	 * TODO: move to MediaType constructor
	 */
	public static MediaType toMediaType(MimeType mimeType) {
		return new MediaType(
			mimeType.getType(),
			mimeType.getSubtype(),
			mimeType.getParameters()
		);
	}

}
