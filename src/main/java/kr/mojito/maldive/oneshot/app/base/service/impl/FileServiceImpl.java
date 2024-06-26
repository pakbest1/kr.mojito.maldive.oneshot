package kr.mojito.maldive.oneshot.app.base.service.impl;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import kr.mojito.maldive.oneshot.app.base.dao.BaseDao;
import kr.mojito.maldive.oneshot.app.base.service.FileService;
import kr.mojito.maldive.oneshot.app.base.vo.FileVO;

@Service
public class FileServiceImpl implements FileService {
	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Value("${path.mojito.file:C:\\SVC-WMS\\data001\\wms\\upload}")
	private String ROOT_FILE;

	@PostConstruct
	private void postConstruct() {
		String sMesg = "[PATH_UPLOAD:"+ ROOT_FILE +"]";

		File fRoot = new File(ROOT_FILE);
		if (!fRoot.exists()) {
			fRoot.mkdirs();
			sMesg += " is created.";
		} else {
			sMesg += " is exists.";
		}

		logger.debug(sMesg);

		this.fileRepo = new HashMap<String, Object>(){private static final long serialVersionUID = 1L;{
			put("a", new FileVO("A", "0", "a", "영화_인터스텔라_포스트_2014.jpg" , ROOT_FILE+"/2023/202312/20231220/a.jpg"));
			put("b", new FileVO("B", "0", "b", "movie_interstallar_post_2014.jpg", ROOT_FILE+"/2023/202312/20231220/b.jpg"));
		}};
	}


	private Map<String, Object> fileRepo;


	@Autowired
	private BaseDao dao;

	private final String _NS_ = "kr.mojito.maldive.oneshot.file";
	private String NS(String id) {
		return new StringBuffer(_NS_).append(".").append(id).toString();
	}

	@Override
	public List<FileVO> save  (FileVO vo) throws Exception {


		return null;
	}

	@Override
	public List<FileVO> delete(FileVO vo) throws Exception {


		return null;
	}

	@Override
	public List<FileVO> list(FileVO vo) throws Exception {
		return dao.selectList(NS("list"), vo);
	}

	@Override
	public FileVO file(FileVO vo) throws Exception {
		return (FileVO) this.fileRepo.get(vo.getFid());
	}


}
