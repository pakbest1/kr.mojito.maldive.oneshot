/**
 *  SVC-WMS Grid Filter Search Library
 *  @FileName 	  WMS_Grid_FilterSearch.js
 *  @Creator 	  SVC-WMS
 *  @CreateDate   2024/02/05
 *  @Desction
 ************** 소스 수정 이력 ***********************************************
 *  date        Modifier         Description
 *******************************************************************************
 * 2024/02/05   SVC-WMS          Grid Filter Search Library
 *******************************************************************************
 */
var pForm = nexacro.Form.prototype;  // Prototype Getter

/*******************************************************************************************************************************
 * Grid Filter Search - Show
 *******************************************************************************************************************************/
pForm.Grid_FilterSearch_Show = function(grid) {
	if (!grid || !grid instanceof nexacro.Grid) { return; }
	trace('this.Grid_FilterSearch_Show()');
	
	grid.config = Object.assign(grid.config||{}, {  // Filter Config
		type: 'search',
		css : 'fltr filter',
	});
	
	let form = grid._getForm(), config = grid.config, cssfltr = config.css;
	let mxCell = grid.getCellCount('head'), mxCellCss = grid.getCellProperty('head', mxCell-1, 'cssclass'), hrix = null;  // grid.appendContentsRow('head'), ;
	let filterHeadRowIndex = config.filterHeadRowIndex;
// 	if ( mxCellCss && mxCellCss.indexOf(cssfltr)>-1 ) {  // 마지막 Cell이 filter 속성을 가진다면 Row 생성하지않고 마지막값 설정함.
// 		hrix = grid._curFormat._headrows.length  -1;     // grid.getFormatRowCount('head')-1;
// 	} else {
// 		hrix = grid.appendContentsRow('head');
// 		mxCell = grid.getCellCount('head');
// 	}
	if (!filterHeadRowIndex || filterHeadRowIndex < 0) {
		if ( mxCellCss && mxCellCss.indexOf(cssfltr)>-1 ) {  // 마지막 Cell이 filter 속성을 가진다면 Row 생성하지않고 마지막값 설정함.
			hrix = grid._curFormat._headrows.length  -1;     // grid.getFormatRowCount('head')-1;
		} else {
			hrix = grid.appendContentsRow('head');
			mxCell = grid.getCellCount('head');
		}
		config.filterHeadRowIndex = hrix;
		
		let dHeight = 34, hrheight = grid.getFormatRowProperty(hrix-1, 'size'); hrheight = hrheight > dHeight ? hrheight : dHeight;
		grid.setFormatRowProperty(hrix, 'size', dHeight);
		
		for (let i=0; i<mxCell; i++) {
			let hrcx = grid.getCellProperty('head', i, 'row');
			if (hrcx != hrix) { continue; }
			
			//grid.setCellProperty('head', i, 'cssclass', 'fltr');
			let clix = grid.getCellProperty('head',    i, 'col' );
			let cltx = grid.getCellProperty('body', clix, 'text');
			
			// bypass - no bindable
			if (!cltx || cltx.indexOf('bind:')<0) { continue; }  // if (cltx && cltx.indexOf('bind:')>-1)
			
			// bypass - checkbox
			let displaytype = grid.getCellProperty('body', clix, 'displaytype'), edittype = grid.getCellProperty('body', clix, 'edittype');
			if ('checkboxcontrol' === displaytype && 'checkbox' === edittype) { continue; }
			
			let bcol = cltx.replace(/bind:/g, '');
			
			grid.setCellProperty('head', i, 'cssclass'   , 'fltr filter');
			grid.setCellProperty('head', i, 'expandshow' , 'show'       );
			grid.setCellProperty('head', i, 'displaytype', 'editcontrol');
			grid.setCellProperty('head', i, 'edittype'   , 'text'       );
		}
		
		// 필터열이 마지막 Row 이면 Edit 포커싱이 안됨 - 빈 ROW 추가시엔 작동함.
		hrix = grid.appendContentsRow('head');
		grid.setFormatRowProperty(hrix, 'size', 0);  // Blank Head Row
		
		grid.addEventHandler('onexpandup' , form.Grid_FilterSearch_OnExpandUp      , form);
		grid.addEventHandler('onkeyup'    , form.Grid_FilterSearch_Edit_OnKeyup    , form);
		//grid.addEventHandler('onkillfocus', form.Grid_FilterSearch_Edit_OnKillFocus, form);
		
	}   // if (!filterHeadRowIndex || filterHeadRowIndex < 0)
	
// 	grid.addEventHandler('oninput', function(obj, e) {  // obj:nexacro.Grid,e:nexacro.GridInputEventInfo
// 		trace('[oninput:'+ obj.getEditValue() +']');
// 	}, form);
};

/*******************************************************************************************************************************
 * Grid Filter Search - Hide
 *******************************************************************************************************************************/
pForm.Grid_FilterSearch_Hide = function(obj) {
	let form = obj._getForm(), grid = obj, config = grid.config, cssfltr = config.css, filterHeadRowIndex = config.filterHeadRowIndex;
	
	grid.deleteContentsRow('head'    , filterHeadRowIndex+1);
	grid.deleteContentsRow('head'    , filterHeadRowIndex  );
	
	grid.removeEventHandler('onexpandup' , form.Grid_FilterSearch_OnExpandUp      , form);
	grid.removeEventHandler('onkeyup'    , form.Grid_FilterSearch_Edit_OnKeyup    , form);
	//grid.removeEventHandler('onkillfocus', form.Grid_FilterSearch_Edit_OnKillFocus, form);
}

/*******************************************************************************************************************************
 * Grid Filter Search - Edit OnKeyup
 *******************************************************************************************************************************/
pForm.Grid_FilterSearch_OnExpandUp = function(obj, e) {  // obj:nexacro.Grid,e:nexacro.GridMouseEventInfo
	let form = obj._getForm(), grid = obj, config = grid.config, cssfltr = config.css;
	form.Grid_FilterSearch_Apply(grid, e.fromreferenceobject._unique_id);
};

/*******************************************************************************************************************************
 * Grid Filter Search - Edit OnKillFocus
 *******************************************************************************************************************************/
pForm.Grid_FilterSearch_Edit_OnKillFocus = function(obj, e) {  // obj:nexacro.Edit, e:nexacro.KillFocusEventInfo
	let form = obj._getForm(), grid = obj, config = grid.config, cssfltr = config.css;
	form.Grid_FilterSearch_Apply(grid, e.fromreferenceobject._unique_id);
};

/*******************************************************************************************************************************
 * Grid Filter Search - Edit OnKeyup
 *******************************************************************************************************************************/
pForm.Grid_FilterSearch_Edit_OnKeyup = function(obj, e) {  // obj:nexacro.Grid,e:nexacro.KeyEventInfo
	let form = obj._getForm(), grid = obj, config = grid.config, cssfltr = config.css;
	
	let isFilterEvent = (e.fromreferenceobject.cssclass+e.fromreferenceobject.parent.cssclass).indexOf(cssfltr)>-1;
	if (isFilterEvent && [13].includes(e.keycode)) {
		// e.preventDefault();
		form.Grid_FilterSearch_Apply(grid, e.fromreferenceobject._unique_id);
	}
};

/*******************************************************************************************************************************
 * Grid Filter Search - Apply
 *******************************************************************************************************************************/
pForm.Grid_FilterSearch_Apply = function(obj, uid) {
	//trace('Grid Filter Search Apply Filter start');
	let form = obj._getForm(), grid = obj, ds = grid.getBindDataset(), config = grid.config, cssfltr = config.css, strFltr = '', logs = [];
	let mxCell = grid.getCellCount('head');
	for (let i=0; i<mxCell; i++) {
		let clhx = grid.getCellProperty('head', i, 'col');
		let clhc = grid.getCellProperty('head', i, 'cssclass'), clht = grid.getCellProperty('head', i, 'value');  clht=clht&&clht.trim?clht.trim():clht;
		if (clhc.indexOf(cssfltr)<0) { continue; }  // 필터Cell이 아니면 Pass
		if (!clht) { continue; }  // 필터값이 아니면 Pass
		
		let dfbn = 'bind:', clbt = grid.getCellProperty('body', clhx, 'text');
		if (!clbt.startsWith(dfbn)) { continue; }  // 바인딩 항목이 아니면 Pass
		
		clbt = clbt.replace(new RegExp(dfbn, 'g'), '');
		let dsci = ds.getColumnInfo(clbt), dsct = dsci.type.toLowerCase();
		logs.push({ colid: clbt, coltype: dsct, colval: clht, });
		
		// strFltr += (strFltr ? '&&' : '') + ('string' == dsct ? (clbt + '.indexOf("' + clht + '")>-1') : ('('+ clbt +'=='+ clht +' || String('+ clbt +').indexOf("'+ clht +'")'));
		strFltr += (strFltr ? '&&' : '');
		if (['int', 'float', 'bigdecimal'].includes(dsct)) {  // ('string' != dsct) {
			strFltr += '( String('+ clbt +').indexOf("' + clht + '")>-1 || '+ clbt +'=='+ clht +')';
		} else {
			strFltr += '( String('+ clbt +').indexOf("' + clht + '")>-1 '+                      ')';
		}
	}
	
	ds.filter(strFltr);
	if (document && uid) {
		let t = document.getElementById(uid).querySelector('.nexainput');
		if (t) {
			t.focus();  // ({ focusVisible: true });
			t.select();  // grid.moveToNextCell();
		}
	}
	
	trace('[logs: '+ JSON.stringify( logs ) + '], [filter: '+ strFltr +'][_unique_id: '+ uid +']');
	//trace('Grid Filter Search Apply Filter end');
};

pForm = null; delete pForm;
