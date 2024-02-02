
;
function getTag(o) {
	let sType = null;
	if (!o) return sType;
	if (o.tagName) {
		sType = o.tagName;
	}
	return sType;
};
function getValue(o) {
	let elem = o, tag = elem.tagName, s=null;
	
    let aValue = ['INPUT', 'TEXTAREA'];
	if (aValue.includes( tag )) {
		s = elem.value;
	}
	
	return s;
};
window.addEventListener("copy" , (e) => {  // ex) 모든 복사에 특정 값 복사시키기
	let srceElem = e.srcElement, srceVal = getValue(srceElem); console.log('');

	e.preventDefault();
	e.clipboardData.setData("text", srceVal);
});

window.addEventListener("paste", (e) => {  // ex) 붙여넣는 값을 콘솔에 출력
  console.log(e.clipboardData.getData("text"));
});

