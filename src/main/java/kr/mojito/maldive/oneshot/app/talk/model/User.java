package kr.mojito.maldive.oneshot.app.talk.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Builder
@ToString
@Getter @Setter
public class User {
	private String id;
	private String name;
	private String nick;
	private String avatar;
	private String hostname;
}
//@Entity
//@Entity
//@Table(name = "users")
//@Data
//public class User {
//
//	public enum Level {
//		NEWBIE, REGISTERED, MASTER;
//
//		public static Level valueOf(String name, Level def) {
//			for (Level l : values()) {
//				if (l.name().equalsIgnoreCase(name)) {
//					return l;
//				}
//			}
//			return def;
//		}
//	}
//
//	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
//	@Column
//	private long id;
//
//	@Column
//	private String nick;
//
//	@Column
//	private String server;
//
//	@Column
//	private String ident;
//
//	@Column
//	private String hostname;
//
//	@Column
//	private String password;
//
//	@Enumerated(EnumType.STRING)
//	@Column
//	private Level level = Level.NEWBIE;
//
//
//}
