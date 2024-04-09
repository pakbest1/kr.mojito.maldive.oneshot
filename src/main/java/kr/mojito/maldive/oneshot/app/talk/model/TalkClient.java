package kr.mojito.maldive.oneshot.app.talk.model;

import java.net.Socket;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter @Setter
public class TalkClient {

	private String id;
	private String user;
	private String nick;

	private String host;
	private Socket socket;

	/**
	 *  Compile the nick, username and hostname into an IRC hostmask.
	 *
	 * @return String
	 */
	public String getHostmask() {
		return this.nick + "!" + this.user + "@" + this.host;
	}

}
