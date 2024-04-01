package kr.mojito.maldive.oneshot._mojito;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public interface IOneShotSController {

	Object list(HttpServletRequest req, HttpServletResponse res, HttpSession sess) throws Exception;
	Object item(HttpServletRequest req, HttpServletResponse res, HttpSession sess) throws Exception;
	Object save(HttpServletRequest req, HttpServletResponse res, HttpSession sess) throws Exception;
	Object dele(HttpServletRequest req, HttpServletResponse res, HttpSession sess) throws Exception;

}
