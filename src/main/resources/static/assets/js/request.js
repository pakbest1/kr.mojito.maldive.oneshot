const request = function(o) {
	let _o = Object.assign(o, {});
};

const requestSync = function(o) {
	let _o = Object.assign(o, {});

};

let resdata = { id: 'bbs', page: 1, size: 50, keyword: '' };
let reqdata = requestSync({
	url : '/bbs/request',
	data: resdata,
});


