package kr.mojito.maldive.oneshot.wsock;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value="/chat")
public class ChatController {

	@RequestMapping(value="/channels")
	public @ResponseBody List<Object> channels(Map<String, Object> param) throws Exception {
		List<Object> rslt = null;



		return rslt;
	}

}
