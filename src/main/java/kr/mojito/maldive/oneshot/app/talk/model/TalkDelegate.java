package kr.mojito.maldive.oneshot.app.talk.model;

public interface TalkDelegate {
	public void receive(TalkClient c, String command);
	public void close  (TalkClient c);
}
