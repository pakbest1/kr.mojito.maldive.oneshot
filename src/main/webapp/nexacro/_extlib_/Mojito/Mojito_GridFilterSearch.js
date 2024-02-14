/************************************************************************
 * Nexacro Grid Head Filter - Search
 ************************************************************************/
var pForm = nexacro.Form.prototype;

pForm.GridFilterSearch_show = function(obj) {
	trace('this.GridFilterSearch_show()');
	
	let form = obj._getForm(), grid = obj, cssfltr = 'filter';
	let mxCell = grid.getCellCount('head'), mxCellCss = grid.getCellProperty('head', mxCell-1, 'cssclass'), hrix = null;  // grid.appendContentsRow('head'), ;
	if ( mxCellCss && mxCellCss.indexOf(cssfltr)>-1 ) {  // 마지막 Cell이 filter 속성을 가진다면 Row 생성하지않고 마지막값 설정함.
		hrix = grid._curFormat._headrows.length - 1;  // grid.getFormatRowCount('head')-1;
	} else {
		hrix = grid.appendContentsRow('head');
		mxCell = grid.getCellCount('head');
	}
	
	grid.filter = {  // filter config
		type: 'search',
		row : hrix,
	};
	
	let hrheight = grid.getFormatRowProperty(hrix-1, 'size'); hrheight = hrheight > 34 ? hrheight : 34;
	grid.setFormatRowProperty(hrix, 'size', hrheight);
	
	for (let i=0; i<mxCell; i++) {
		let hrcx = grid.getCellProperty('head', i, 'row');
		if (hrcx != hrix) { continue; }
		
		//grid.setCellProperty('head', i, 'cssclass', 'fltr');
		let clix = grid.getCellProperty('head', i, 'col')
		let cltx = grid.getCellProperty('body', clix, 'text');
		
		// bypass - no bindable
		if (!cltx || cltx.indexOf('bind:')<0) { continue; }  // if (cltx && cltx.indexOf('bind:')>-1)
		
		// bypass - checkbox
		let cdty = grid.getCellProperty('body', clix, 'displaytype'), cety = grid.getCellProperty('body', clix, 'edittype');
		if ('checkboxcontrol' === cdty && 'checkbox' === cety) { continue; }
		
		let bcol = cltx.replace(/bind:/g, '');
		
		grid.setCellProperty('head', i, 'cssclass'   , 'fltr filter');
		grid.setCellProperty('head', i, 'expandshow' , 'hide'       );
		grid.setCellProperty('head', i, 'displaytype', 'editcontrol');
		grid.setCellProperty('head', i, 'edittype'   , 'text'       );
	}
	
	// 필터열이 마지막 Row 이면 Edit 포커싱이 안됨 - 빈 ROW 추가시엔 작동함.
	hrix = grid.appendContentsRow('head');
	grid.setFormatRowProperty(hrix, 'size', 0);  // Blank Head Row
	
	grid.addEventHandler('onkeyup', this.GridFilterSearch_onKeyup, form);
	
// 	grid.addEventHandler('oninput', function(obj, e) {  // obj:nexacro.Grid,e:nexacro.GridInputEventInfo
// 		trace('[oninput:'+ obj.getEditValue() +']');
// 	}, form);
};

pForm.GridFilterSearch_hide = function(obj) {
	let form = obj._getForm(), grid = obj, filter = grid.filter, cssfltr = 'filter';
	
	grid.deleteContentsRow('head', filter.row+1);
	grid.deleteContentsRow('head', filter.row  );
	
	grid.removeEventHandler('onkeyup', form.GridFilterSearch_onKeyup, form);
}

pForm.GridFilterSearch_onKeyup = function(obj, e) {  // obj:nexacro.Grid,e:nexacro.KeyEventInfo
	let form = obj._getForm(), grid = obj, filter = grid.filter, cssfltr = 'filter';
	
	let isFilterEvent = (e.fromreferenceobject.cssclass+e.fromreferenceobject.parent.cssclass).indexOf(cssfltr)>-1;
	if (isFilterEvent && [13].includes(e.keycode)) {
		e.preventDefault();
		this.GridFilterSearch_ApplyFilter(grid, e.fromreferenceobject._unique_id);
	}
};

pForm.GridFilterSearch_ApplyFilter = function(obj, uid) {
	//trace('Grid Filter Search Apply Filter start');
	let form = obj._getForm(), grid = obj, ds = grid.getBindDataset(), cssfltr = 'filter', strFltr = '', logs = [];
	let mxCell = grid.getCellCount('head');
	for (let i=0; i<mxCell; i++) {
		let clhx = grid.getCellProperty('head', i, 'col');
		let clhc = grid.getCellProperty('head', i, 'cssclass'), clht = grid.getCellProperty('head', i, 'value');  clht=clht?clht.trim():clht;
		if (clhc.indexOf(cssfltr)<0) { continue; }  // 필터Cell이 아니면 Pass
		if (!clht) { continue; }  // 필터값이 아니면 Pass
		
		let dfbn = 'bind:', clbt = grid.getCellProperty('body', clhx, 'text');
		if (!clbt.startsWith(dfbn)) { continue; }  // 바인딩 항목이 아니면 Pass
		
		clbt = clbt.replace(new RegExp(dfbn, 'g'), '');
		let dsci = ds.getColumnInfo(clbt), dsct = dsci.type.toLowerCase();
		logs.push({ colid: clbt, coltype: dsct, colval: clht, });
		
		// strFltr += (strFltr ? '&&' : '') + ('string' == dsct ? (clbt + '.indexOf("' + clht + '")>-1') : ('('+ clbt +'=='+ clht +' || String('+ clbt +').indexOf("'+ clht +'")'));
		strFltr += (strFltr ? '&&' : '');
		if ('string' != dsct) {
			strFltr += '( String('+ clbt +').indexOf("' + clht + '")>-1 || '+ clbt +'=='+ clht +')';
		} else {
			strFltr += '( String('+ clbt +').indexOf("' + clht + '")>-1 '+                      ')';
		}
	}
	
	ds.filter(strFltr);
	if (document && uid) {
		let t = document.getElementById(uid).querySelector('.nexainput');
		t.focus();  // ({ focusVisible: true });
		t.select();  // grid.moveToNextCell();
	}
	
	trace('[logs: '+ JSON.stringify( logs ) + '], [filter: '+ strFltr +'][_unique_id: '+ uid +']');
	//trace('Grid Filter Search Apply Filter end');
};

pForm = null; delete pForm;