package kr.mojito.maldive.oneshot.app.knock.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.mojito.maldive.oneshot.app.knock.service.KnockService;

@Controller
@RequestMapping(value="/knock")
public class KnockController {

	@Autowired
	private KnockService svc;

	@RequestMapping(value={ "/hello", "/helloworld" })
	public @ResponseBody List<?> helloworld() {

		return svc.selectAll();

	}

}
