package kr.mojito.maldive.oneshot.app.talk.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class Client {

	private String nick;
	private String username;
	private String hostName;
	private String realName;

	/**
	 *  Compile the nick, username and hostname into an IRC hostmask.
	 *
	 * @return String
	 */
	public String getHostmask() {
		return this.nick + "!" + this.username + "@" + this.hostName;
	}
}
