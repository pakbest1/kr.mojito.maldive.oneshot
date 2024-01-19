package kr.mojito.maldive.oneshot.base.service;

import java.util.List;

import kr.mojito.maldive.oneshot.base.vo.FileVO;

public interface FileService {
	List<FileVO> list  (FileVO vo) throws Exception;
	List<FileVO> save  (FileVO vo) throws Exception;
	List<FileVO> delete(FileVO vo) throws Exception;
		FileVO  file  (FileVO vo) throws Exception;
}
