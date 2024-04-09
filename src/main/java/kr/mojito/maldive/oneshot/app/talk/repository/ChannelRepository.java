package kr.mojito.maldive.oneshot.app.talk.repository;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Repository;

import kr.mojito.maldive.oneshot.app.talk.model.TalkChannel;


@Repository(value="talkChannelRepository")
@SuppressWarnings("unused")
public class ChannelRepository {

	private final Map<String, TalkChannel> channels = new ConcurrentHashMap<String, TalkChannel>();
	private final static String[] channelPrefixes = {"&" , "!", "+", "#"};



}
