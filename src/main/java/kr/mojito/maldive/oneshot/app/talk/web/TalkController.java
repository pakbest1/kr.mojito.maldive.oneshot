package kr.mojito.maldive.oneshot.app.talk.web;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.mojito.maldive.oneshot.app.talk.event.TalkEvent;
import kr.mojito.maldive.oneshot.app.talk.event.TalkEventPublisher;
import kr.mojito.maldive.oneshot.app.talk.model.TalkMessage;

@RestController
@RequestMapping(value="/talk")
public class TalkController {

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
