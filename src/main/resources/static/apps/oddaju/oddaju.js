const

_getObject = (entries) => {
	const result = {};
	if (!entries) { return result; }
	for (const [key, value] of entries) {
		result[key] = value;
	}
	return result;
},
getObject = (s) => {
	s = s.startsWith('#') ? s.substring(1) : s;
	return _getObject(new URLSearchParams(s).entries());
},
getObjectFromQueryString = () => {
	return getObject(location.search);
},
getObjectFromHash = () => {
	return getObject(location.hash);
};
getDDLInfo = (sql) => {
	if (!sql) { return null; }
	let mch = /(create|alter|drop)\s+(table|view|package|procedure|function|trigger)\s+(\w+)*/i.exec(sql), r = {};

	if (mch && mch[1]) { r.type = mch[1]; }
	if (mch && mch[2]) { r.name = mch[2]; }

	return Object.keys(r).length === 0 ? null : r;
},





null;