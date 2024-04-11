package kr.mojito.maldive.oneshot.app.talk.repository;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Repository;

import kr.mojito.maldive.oneshot.app.talk.model.TalkClient;

@Repository
public class TalkClientRepository implements IRepository<TalkClient> {
	private final Map<String, TalkClient> repo = new ConcurrentHashMap<String, TalkClient>();

	@Override
	public TalkClient findById(String id) {
		return repo.get(id);
	}

	@Override
	public synchronized boolean save(TalkClient item) {
		if (item == null) { return false; }

		repo.put(item.getId(), item);
		notifyAll();

		return true;
	}

	@Override
	public synchronized boolean delete(TalkClient item) {
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
