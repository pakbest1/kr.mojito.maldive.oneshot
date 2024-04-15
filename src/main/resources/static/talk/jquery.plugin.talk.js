(function($) {

	let plugname = 'talk', $plug = $[plugname] = function(config) {
		$plug.config = config;

		$plug.send = function(s){
			$plug.wsock.send(s);
		};

		$plug.init = function() {
			// console.log('$plug.init()');
			let config = $plug.config;
			let wsurl  = location.origin.replace(/http:|https:/g, 'ws:')+ config.url;

			$plug.wsock = new WebSocket(wsurl);
			Object.assign($plug.wsock, {
				onopen   : (e)=>{
					console.log('[onopen:'+ wsurl +']');
				},
				onclose  : (e)=>{
					console.log('[onclose:]');
				},
				onerror  : (e)=>{
					console.log('[onerror:]');
				},
				onmessage: (e)=>{
					//console.log('[onmessage:'+ e.data +']');
					if (config.recive) { config.recive(e); }
				},
			});

			if (config.form && config.send) {
				$(config.form).on('submit', (e)=>{
					config.send(e);
					e.preventDefault();
					return false;
				});
			};

			if (config.init) {
				config.init({
					target: config.form,
					parameter: config.parameter,
				});
			}

			return $plug;
		}();

	};

})(jQuery);