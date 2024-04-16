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
					const {PING} = $plug.cmd, {PONG} = $plug.cmd;
					let sock= $plug.wsock, data = e ? e.data : null;  //console.log('[onmessage:'+ e.data +']');
					if (!data) { return; }
					if (data.startsWith(PING)) {
						let r = data.replace(new RegExp(PING, 'g'), PONG);  console.log('[>'+ r +'<]');
						sock.send(r);
						e.preventDefault();
						return;
					}

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
		$plug.cmd = {
			EMPTY: ''    ,
			PING : 'ping',
			PONG : 'pong',
		};
		Object.freeze($plug.cmd);
	};

})(jQuery);