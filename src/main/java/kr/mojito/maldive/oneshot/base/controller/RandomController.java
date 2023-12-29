package kr.mojito.maldive.oneshot.base.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.mojito.maldive.oneshot.base.dao.RandomRepository;
import kr.mojito.maldive.oneshot.base.dao.UUIDRepository;

@Controller
@RequestMapping("/random")
public class RandomController {

	@Autowired
	private RandomRepository randomRepository;
	
	@GetMapping(value="/string")
	public @ResponseBody String string() {
		return randomRepository.get();
	}
	
	@GetMapping(value={ "/string{sDigit}", "/string/{sDigit}" })  // , "/string/{digit}" })
	public @ResponseBody String stringDigit(@PathVariable String sDigit) {
		sDigit = sDigit != null ? sDigit : "64";
		
		int iDigit = -1;
		try { iDigit = Integer.parseInt(sDigit, 10); } catch (Exception e) { iDigit = 32; }
		
		return randomRepository.get(iDigit);
	}
	
	@Autowired
	private UUIDRepository uuidRepository;
	
	@GetMapping("/uuid")
	public @ResponseBody String uuid() {
		return uuidRepository.get();
	}
	
}
