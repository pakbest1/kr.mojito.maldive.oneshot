package kr.mojito.maldive.oneshot.app.talk.repository;

import java.util.Map;

import org.springframework.stereotype.Repository;

import kr.mojito.maldive.oneshot.app.talk.model.TalkChannel;

@Repository
@SuppressWarnings("unused")
public class ClientRepository {

	private Map<String, TalkChannel> clients;

}
