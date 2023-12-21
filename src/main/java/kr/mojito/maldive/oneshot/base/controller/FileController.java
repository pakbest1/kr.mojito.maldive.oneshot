package kr.mojito.maldive.oneshot.base.controller;

import java.io.File;
import java.io.FileInputStream;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

//import com.nexacro.uiadapter.spring.core.data.NexacroResult;

import kr.mojito.maldive.oneshot.base.service.FileService;
import kr.mojito.maldive.oneshot.base.vo.FileVO;

@Controller
@RequestMapping("/file")
public class FileController {
	private final Logger logger = LoggerFactory.getLogger(this.getClass());
	
	
	@PostMapping("/upload")
	public Object upload(MultipartFile file) throws Exception {
		logger.debug("execute upload");
		
		
		return null;
	}
	
	@Autowired
	private FileService fileService;
	
	@GetMapping("/{fid}")
	public ResponseEntity<?> file(@PathVariable String fid, HttpServletRequest req, HttpServletResponse res) throws Exception {
		FileVO fileVO = new FileVO(fid);
		fileVO = fileService.file(fileVO);
		if (fileVO == null) {
			return ResponseEntity.notFound().build();
		}
		
		File file = fileVO.getFile();
		if (file == null || !file.exists()) {
			return ResponseEntity.notFound().build();
		}
		
		MediaType mediaType = null;  mediaType = mediaType!=null ? mediaType : MediaType.APPLICATION_OCTET_STREAM;
		InputStreamResource isr = new InputStreamResource(new FileInputStream(fileVO.getFile()));
		return ResponseEntity
			.ok()
			.contentType(mediaType)
			.cacheControl(CacheControl.noCache())
			.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + URLEncoder.encode( fileVO.getName(), "UTF-8"))
			.body(isr)
		;
	}
	
}
