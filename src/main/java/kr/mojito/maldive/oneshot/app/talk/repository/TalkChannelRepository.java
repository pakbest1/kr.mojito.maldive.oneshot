package kr.mojito.maldive.oneshot.app.talk.repository;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Repository;

import kr.mojito.maldive.oneshot.app.talk.model.TalkChannel;

@Repository
public class TalkChannelRepository implements IRepository<TalkChannel> {
	private final Map<String, TalkChannel> repo = new ConcurrentHashMap<String, TalkChannel>();
	private final static String[] channelPrefixes = {"&" , "!", "+", "#"};

	@Override
	public TalkChannel findById(String id) {
		return repo.get(id);
	}

	@Override
	public boolean save(TalkChannel item) {
		if (item == null) { return false; }

		repo.put(item.getId(), item);
		notifyAll();

		return true;
	}

	@Override
	public boolean delete(TalkChannel item) {
		if (item == null) { return false; }

		repo.remove(item.getId());
		notifyAll();

		return true;
	}

	@Override
	public synchronized boolean commit() {


		notifyAll();
		return true;
	}

}
