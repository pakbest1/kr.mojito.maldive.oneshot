package kr.mojito.maldive.oneshot.app.talk.repository;

import java.util.HashMap;

import kr.mojito.maldive.oneshot.app.talk.model.Channel;


@SuppressWarnings("unused")
public class ChannelManager {

	private HashMap<String, Channel> channels;
	private final static String[] channelPrefixes = {"&" , "!", "+", "#"};
}
