package kr.mojito.maldive.oneshot.form;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class FormController {

	@RequestMapping(value="/action/form/response")
	public ModelAndView response(ModelAndView mv, HttpServletRequest req, HttpServletResponse res) {

		mv.setViewName("form/response");

		return mv;
	}
}
