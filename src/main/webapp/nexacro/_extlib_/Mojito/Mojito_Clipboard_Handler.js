/************************************************************************
 * Browser Clipboard Handler
 ************************************************************************/
function getNexaClipboard() {
	if (!top.nexacro.clipboardData) { top.nexacro.clipboardData = new DataTransfer(); }
	return top.nexacro.clipboardData;
};

//window.addEventListener('copy' , (e) => {  // ex) 모든 복사에 특정 값 복사시키기
window.addEventListener('copy' , function(e) {  // ex) 모든 복사에 특정 값 복사시키기
	let clipdata = null;

	if (e && e.target && e.target.selectionStart > -1  && e.target.selectionEnd > -1) {
		let el = e.target, elSidx = el.selectionStart, elEidx = el.selectionEnd;
		clipdata = (elSidx>-1 && elEidx>=elSidx ? el.value.substring(elSidx, elEidx) : el.value);

		getNexaClipboard().setData('text', clipdata);
	}
	if (!clipdata) {
		clipdata = getNexaClipboard().getData('text');
		e.clipboardData.setData('text', clipdata);
	}

	if (clipdata) {
		e.preventDefault();
		e.clipboardData.setData('text', clipdata);
		getNexaClipboard().setData('text', clipdata);
	}
	console.log('Web Clipboard Copy >==>> '+ clipdata);
	// e.preventDefault();
});

//window.addEventListener('cut' , (e) => {  // ex) 모든 잘라내기에 특정 값 잘라내기
window.addEventListener('cut' , function(e) {  // ex) 모든 잘라내기에 특정 값 잘라내기
	let clipdata = null;

	if (e && e.target && e.target.selectionStart > -1  && e.target.selectionEnd > -1) {
		let el = e.target, elSidx = el.selectionStart, elEidx = el.selectionEnd;
		clipdata = (elSidx>-1 && elEidx>=elSidx ? el.value.substring(elSidx, elEidx) : el.value);
		getNexaClipboard().setData('text', clipdata);
	}
	if (!clipdata) {
		clipdata = getNexaClipboard().getData('text');
	}
	if (clipdata) {
		e.clipboardData.setData('text', clipdata);
		getNexaClipboard().setData('text', clipdata);
	}

	console.log('Web Clipboard Cut >==>> '+ clipdata);
	// e.preventDefault();
});

//window.addEventListener('paste', (e) => {  // ex) 붙여넣는 값을 콘솔에 출력
window.addEventListener('paste', function(e) {  // ex) 붙여넣는 값을 콘솔에 출력
	let ecClip = e.clipboardData, ncClip = getNexaClipboard();
	let clipdata = ecClip.getData('text') || ncClip.getData('text');
// 	if (clipdata) {
// 		console.log('Web Clipboard Paste >==>> '+ clipdata);
// 	} else {
// 		e.preventDefault();
// 	}
});