package kr.mojito.maldive.oneshot.security.oauth2;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/sso/oauth2")
public class OAuth2ClientController {
	
	@RequestMapping("/authorize")
	public ModelAndView authorize(HttpServletRequest request, HttpServletResponse response, HttpSession session, ModelAndView mnv, @RequestParam Map<String, String> params) throws Exception {
		
		
		
		return mnv;
	}

	@RequestMapping("/token")
	public @ResponseBody Map<String, String> token(HttpServletRequest request, HttpServletResponse response, HttpSession session, ModelAndView mnv, @RequestParam Map<String, String> params) throws Exception {
		Map<String, String> map = new HashMap<String, String>();
		
		
		
		return map;
	}

	@RequestMapping("/user.profile")
	public @ResponseBody Map<String, String> userprofile(HttpServletRequest request, HttpServletResponse response, HttpSession session, ModelAndView mnv, @RequestParam Map<String, String> params) throws Exception {
		Map<String, String> map = new HashMap<String, String>();
		
		
		
		return map;
	}
}
