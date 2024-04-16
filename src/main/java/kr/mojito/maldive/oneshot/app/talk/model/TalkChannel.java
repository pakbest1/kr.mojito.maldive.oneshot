package kr.mojito.maldive.oneshot.app.talk.model;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter @Setter
public class TalkChannel {

	private String  id;
	private String  topic;
	private TalkChannel pchannel;

	private Integer current;
	private Integer limit;

	private List<TalkMessage> contents;

//    private HashMap<Mode,ArrayList<Pattern>> masks;
//    private ArrayList<Connection> users;
//    private ModeSet modes;
//    private HashMap<Connection, ModeSet> channelUserModes;

	@Getter(AccessLevel.NONE)
	@Setter(AccessLevel.NONE)
	private final Map<String, TalkClient> clients = new ConcurrentHashMap<String, TalkClient>();

//	private void initClients() {
//		if (clients != null) { return; }
//
//		clients = new ConcurrentHashMap<String, Client>();
//		current = 0;
//	}

	public boolean join(TalkClient client) {
		boolean r = false;
		if (client  == null) { return r; }

		clients.put(client.getNick(), client);
		limit = clients.size();
		r = true;

		return r;
	}

	public boolean part(TalkClient client) {
		boolean r = false;
		if (client  == null) { return r; }

		clients.remove(client.getNick());
		limit = clients.size();
		r = true;

		return r;
	}


}
