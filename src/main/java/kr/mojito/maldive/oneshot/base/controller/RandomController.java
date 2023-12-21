package kr.mojito.maldive.oneshot.base.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.mojito.maldive.oneshot.base.dao.UUIDRepository;

@Controller
@RequestMapping("/random")
public class RandomController {

	@Autowired
	private UUIDRepository uuidRepository;

	@GetMapping("/uuid")
	public @ResponseBody String uuid() {
		return uuidRepository.get();
	}
}