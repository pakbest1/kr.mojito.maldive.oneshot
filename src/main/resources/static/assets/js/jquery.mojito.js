(function($) {

	$.getParameterFromSearch = ()=>{
		let o = {}; for(const [key, value] of new URLSearchParams(location.search).entries()) { o[key] = value; }
		return window._parameter = o;
	};

	$.getParameterFromHash = ()=>{
		let o = {}; for(const [key, value] of new URLSearchParams(location.hash.replace(/#/g, '?')).entries()) { o[key] = value; }
		return window._parameter = o;
	};

})(jQuery);