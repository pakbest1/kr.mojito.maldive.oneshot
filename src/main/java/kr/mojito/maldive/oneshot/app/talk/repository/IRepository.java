package kr.mojito.maldive.oneshot.app.talk.repository;

public interface IRepository<T> {
	T findById(String id);
	boolean save  (T item);
	boolean delete(T item);

	boolean commit();
}
