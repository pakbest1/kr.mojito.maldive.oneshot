package kr.mojito.maldive.oneshot.app.talk.model;

public interface ClientDelegate {
	public void receive(TalkClient c, String command);
	public void closeConnection(TalkClient c);
}
