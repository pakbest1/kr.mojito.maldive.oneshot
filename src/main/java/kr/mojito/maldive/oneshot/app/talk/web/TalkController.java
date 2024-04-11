package kr.mojito.maldive.oneshot.app.talk.web;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.mojito.maldive.oneshot.app.talk.event.TalkEvent;
import kr.mojito.maldive.oneshot.app.talk.event.TalkEventPublisher;
import kr.mojito.maldive.oneshot.app.talk.model.TalkMessage;
import kr.mojito.maldive.oneshot.app.utils.MojitoUtil;

@RestController
//@RequestMapping(value="/talk")
public class TalkController {
	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	public void send(@RequestParam Map<String, Object> param) throws Exception {
		logger.debug(MojitoUtil.toJSON( param ));
	}

//	@MessageMapping("/talk/channel/{channel}")
//	@SendTo("/talk/subscribe/{channel}")
//	public TalkMessage message(@DestinationVariable String channel, TalkMessage talkMessage) {
//		return talkMessage;
//	}




	@MessageMapping("/talk/{channel}/publish")
	@SendTo        ("/talk/{channel}/subscribe")
	public TalkMessage channelMessage(@DestinationVariable String channel, TalkMessage talkMessage) {

		TalkEventPublisher.publishEvent(new TalkEvent( talkMessage.getContents() ));
		return talkMessage;
	}

	@MessageMapping("/talk/{nick}/private")
	@SendTo        ("/talk/{nick}/recive")
	public TalkMessage privateMessage(@DestinationVariable String nick, TalkMessage talkMessage) {
		return talkMessage;
	}

	@MessageMapping("/talk/{channel}/whois")
	public TalkMessage infoMessages(@DestinationVariable String channel, TalkMessage talkMessage) {
		return talkMessage;
	}
//
//	@MessageMapping("/channel")
//	@SendTo("/topic/messages")
//	public ChatMessage senChanneldMessages(ChatMessage chatMessage) {
//		return chatMessage;
//	}

//	@MessageMapping("/addUser")
//	@SendTo("/topic/public")
//	public ChatMessage addUser(ChatMessage chatMessage) {
//		// 클라이언트가 입장할 때 사용자 추가 로직을 구현
//		return chatMessage;
//	}

}
