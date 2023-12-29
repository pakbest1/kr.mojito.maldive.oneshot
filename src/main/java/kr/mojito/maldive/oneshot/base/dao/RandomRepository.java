package kr.mojito.maldive.oneshot.base.dao;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.HashSet;
import java.util.Set;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

@Repository
public class RandomRepository {
	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Value("${path.mojito.random.string:C:/SVC-WMS/nas/mojito/random/string}")
	private String REPO_FILE;

	private String sLnsp = System.getProperty("line.separator"); // System.lineSeparator()

	private File fRepo;
	private Set<String> sRepo = new HashSet<String>();

	@PostConstruct
	private void postConstruct() {
		String sMesg = "[REPO_FILE:"+ REPO_FILE +"]";
		fRepo = new File(REPO_FILE);

		try {
			if (!fRepo.getParentFile().exists()) {
				fRepo.getParentFile().mkdir();
			}
			if (!fRepo.exists()) {
					fRepo.createNewFile();
				sMesg += " is created.";
			} else {
				sMesg += " is exists.";
			}
			logger.info(sMesg);
		} catch(Exception e) {
			e.printStackTrace();
		}

		load();  // 기존 발행된 uuid 조회 및 Set에 탑재

//		this.fileRepo = new HashMap<String, Object>(){private static final long serialVersionUID = 1L;{
//			put("a", new FileVO("A", "0", "a", "영화_인터스텔라_포스트_2014.jpg" , ROOT_FILE+"/2023/202312/20231220/a.jpg"));
//			put("b", new FileVO("B", "0", "b", "movie_interstallar_post_2014.jpg", ROOT_FILE+"/2023/202312/20231220/b.jpg"));
//		}};
	}

	private final String randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
	
	public String getPartitionBy(int iDigit, String sPartitionBy) {
		String s = null;

		do {
			//s = RandomStringUtils.random() ;  // UUID.randomUUID().toString();
			int maxChars = randomChars.length();
			StringBuffer sb = new StringBuffer();
			for (int i = 0; i < iDigit; i++) {
				int iCharAt = (int) Math.floor(Math.random() * maxChars);
				sb.append(randomChars.charAt(iCharAt));
			}
			s = sb.toString();
			
		} while(sRepo.contains(s));
		save(s);  // file에 기록

		return s;
	}

	public String get() {
		int iDigit = 64;
		return getPartitionBy(iDigit, null);
	}
	public String get(int iDigit) {
		return getPartitionBy(iDigit, null);
	}


	private void load() {
		try {
			sRepo.clear();
			String sLine = null;
			BufferedReader brRepo = new BufferedReader(new FileReader(fRepo));
			while ((sLine = brRepo.readLine()) != null) {
				sLine = sLine.trim();
				if ("".equals(sLine)) { continue; }
				sRepo.add( sLine );
			}
			brRepo.close();
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
	}

	private void save(String s) {
		try {
			BufferedWriter brRepo = new BufferedWriter(new FileWriter(fRepo, true));
			brRepo.write(s + sLnsp);
			brRepo.close();
			logger.debug("Generated Random : ["+ s + "]");
		} catch(Exception e) {
			logger.error(e.getMessage(), e);
		}
	}

}
