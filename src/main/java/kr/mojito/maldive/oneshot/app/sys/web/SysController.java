package kr.mojito.maldive.oneshot.app.sys.web;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.mojito.maldive.oneshot.app.sys.service.EcacheService;

@Controller
@RequestMapping(value="/sys")
public class SysController {

	@Autowired
	private EcacheService ecacheService;
	
	@RequestMapping(value="/ecache/evict/{id}")
	public @ResponseBody Map<String, ?> evict(@PathVariable String id) throws Exception {

		return ecacheService.evict(id);

	}

}
