

const _getObject = (entries) => {
	const result = {};
	if (!entries) { return result; }
	for (const [key, value] of entries) {
		result[key] = value;
	}
	return result;
};
const getObject = (s) => {
	s = s.startsWith('#') ? s.substring(1) : s;
	return _getObject(new URLSearchParams(s).entries());
};
const getObjectFromQueryString = () => {
	return getObject(location.search);
};
const getObjectFromHash = () => {
	return getObject(location.hash);
};