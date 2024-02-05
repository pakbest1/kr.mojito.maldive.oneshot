
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

function getNexaClipboard() {
	if (!top.nexacro.clipboardData) {
		top.nexacro.clipboardData = new DataTransfer();
	}
	return top.nexacro.clipboardData;
}

window.addEventListener('copy' , (e) => {  // ex) 모든 복사에 특정 값 복사시키기
	let clipdata = null;
	
	if (e && e.target && e.target.selectionStart > -1  && e.target.selectionEnd > -1) {
		let el = e.target, elSidx = el.selectionStart, elEidx = el.selectionEnd;
		clipdata = (elSidx>-1 && elEidx>=elSidx ? el.value.substring(elSidx, elEidx) : el.value);
		top.nexacro.clipboardData.setData('text', clipdata);
	}
	if (!clipdata) {
		let clipboard = getNexaClipboard();
		clipdata = clipboard.getData('text');
		e.clipboardData.setData('text', clipdata);
	}
	
	if (clipdata) {
		e.preventDefault();
		e.clipboardData.setData('text', clipdata);
		top.nexacro.clipboardData.setData('text', clipdata);
	}
	console.log('Web Clipboard Copy >==>> '+ clipdata);
	// e.preventDefault();
});
window.addEventListener('cut' , (e) => {
	let clipdata = null;
	
	if (e && e.target && e.target.selectionStart > -1  && e.target.selectionEnd > -1) {
		let el = e.target, elSidx = el.selectionStart, elEidx = el.selectionEnd;
		clipdata = (elSidx>-1 && elEidx>=elSidx ? el.value.substring(elSidx, elEidx) : el.value);
		top.nexacro.clipboardData.setData('text', clipdata);
	}
	if (!clipdata) {
		clipdata = top && top.nexacro && top.nexacro.clipboardData ? top.nexacro.clipboardData.getData('text') : clipdata;
	}
	if (clipdata) {
		e.clipboardData.setData('text', clipdata);
	}
	
	console.log('Web Clipboard Cut >==>> '+ clipdata);
	// e.preventDefault();
});

window.addEventListener('paste', (e) => {  // ex) 붙여넣는 값을 콘솔에 출력
	let ecClip = e.clipboardData, ncClip = top.nexacro.clipboardData;
	let clipdata = ecClip.getData('text') | ncClip.getData('text');
// 	if (clipdata) {
// 		console.log('Web Clipboard Paste >==>> '+ clipdata);
// 	} else {
// 		e.preventDefault();
// 	}
});

