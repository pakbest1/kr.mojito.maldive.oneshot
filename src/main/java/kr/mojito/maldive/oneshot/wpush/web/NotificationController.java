package kr.mojito.maldive.oneshot.wpush.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import kr.mojito.maldive.oneshot.app.utils.MojitoUtil;
import kr.mojito.maldive.oneshot.wpush.service.NotificationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(value="/notification")
public class NotificationController {

	@Autowired
	private final NotificationService notificationService;

	@GetMapping(value="/subscribe/{userId}")  // , produces="text/event-stream;charset=UTF-8"
	public SseEmitter subscribe(@PathVariable(value = "userId") Long userId) {
		return notificationService.subscribe(userId);
	}

	@RequestMapping(value="/notify")
	public void notify(ModelAndView mv, HttpServletRequest req, HttpServletResponse res) {
		MojitoUtil.showRequestParameter(req);
		notificationService.notify(Long.parseLong(req.getParameter("userid")), req.getParameter("message"), null, "notify");
	}
}
