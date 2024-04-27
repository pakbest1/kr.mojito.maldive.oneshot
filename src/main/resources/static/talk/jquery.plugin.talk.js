(function($) {
	let plugname = 'talk', $p = $[plugname] = function(config) {
		$p.config = config;

		$p.send = function(s){
			$p.wsock.send(s);
		};

		//$p.init = function() {
		// console.log('$p.init()');
		//let config = $p.config;
		let wsurl  = location.origin.replace(/http:|https:/g, 'ws:')+ config.url;

		$p.wsock = new WebSocket(wsurl);
		Object.assign($p.wsock, {
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
				const {PING} = $p.cmd, {PONG} = $p.cmd;
				let sock= $p.wsock, data = e ? e.data : null;  //console.log('[onmessage:'+ e.data +']');
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

		//}();
		$p.cmd = {
			EMPTY: ''    ,
			PING : 'ping',
			PONG : 'pong',
		};
		Object.freeze($p.cmd);
		
		return $p;
	};

})(jQuery);
