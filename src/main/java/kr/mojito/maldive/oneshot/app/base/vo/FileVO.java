package kr.mojito.maldive.oneshot.app.base.vo;

import java.io.File;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
public class FileVO {

	public FileVO(String fid) {
		this(null, null, fid, null, null);
	}
	public FileVO(String fid, String path) {
		this(null, null, fid, null, path);
	}
	public FileVO(String fpid, String fpseq, String fid) {
		this(fpid, fpseq, fid, null, null);
	}
	public FileVO(String fpid, String fpseq, String fid, String name) {
		this(fpid, fpseq, fid, name, null);
	}
	public FileVO(String fpid, String fpseq, String fid, String name, String path) {
		this.fpid  = fpid;
		this.fpseq = fpseq;
		this.fid   = fid;

		this.name  = name;
		this.setPath(path);  // this.path  = path;
	}

	private String fpid ;
	private String fpseq;

	private String fid;

	private String name;
	//private String original;


	@Getter(AccessLevel.NONE)
	@Setter(AccessLevel.NONE)
	private String path;

	public String getPath() {
		if (null==path && null!=file && file.exists()) {
			try { path = file.getCanonicalPath(); } catch (Exception e) { path = null; }
		}
		return path;
	}
	public void setPath(String path) {
		if (null!=path) {
			this.file = new File(path);
			if (!this.file.exists()) { this.file = null; }
		}
		this.path = path;
	}

	@Getter(AccessLevel.NONE)
	@Setter(AccessLevel.NONE)
	private File   file;

	public File getFile() {
		return file;
	}
	public void setFile(File file) {
		if (null!=file && file.exists()) {
			try { path = file.getCanonicalPath(); } catch (Exception e) { path = null; }
		} else {
			file = null;
		}
		this.file = file;
	}
}
