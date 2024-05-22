package kr.mojito.maldive.oneshot.app.knock.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.mojito.maldive.oneshot.app.knock.repository.KnockRepository;

@Service
public class KnockServiceImpl implements KnockService {

	@Autowired
	private KnockRepository repository;

	@Override
	public List<?> selectAll() {
		return repository.selectAll();
	}

}
