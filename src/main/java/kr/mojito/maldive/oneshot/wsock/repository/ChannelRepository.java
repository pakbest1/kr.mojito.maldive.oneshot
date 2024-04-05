package kr.mojito.maldive.oneshot.wsock.repository;

import org.springframework.stereotype.Repository;

@Repository
public class ChannelRepository {


	// 1. static 영역에 객체를 딱 1개만 생성해둔다.
	// 자기 자신을 내부에 private로 가지는데, static으로 가짐
	private static final ChannelRepository instance = new ChannelRepository();

	// public으로 열어서 객체 인스턴스가 필요하면 이 static 메소드를 통해 조회하도록 허용
	public static ChannelRepository getInstance() {
		return instance;
	}



}
