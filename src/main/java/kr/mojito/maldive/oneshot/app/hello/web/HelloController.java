package kr.mojito.maldive.oneshot.app.hello.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.mojito.maldive.oneshot.app.hello.service.HelloService;

@Controller
@RequestMapping(value="/hello")
public class HelloController {

	@Autowired
	private HelloService svc;

	@RequestMapping(value="/select")
	public @ResponseBody List<?> select() {

		return svc.selectHello();

	}

}
