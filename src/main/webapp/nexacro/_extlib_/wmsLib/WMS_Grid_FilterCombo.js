/**
 *  SVC-WMS Grid Filter Combo Library
 *  @FileName 	  WMS_Grid_FilterCombo.js
 *  @Creator 	  SVC-WMS
 *  @CreateDate   2024/02/05
 *  @Desction
 ************** 소스 수정 이력 ***********************************************
 *  date        Modifier         Description
 *******************************************************************************
 * 2024/02/05   SVC-WMS          Grid Filter Combo Library
 *******************************************************************************
 */
var pForm = nexacro.Form.prototype;  // Prototype Getter

/**
 * Grid Filter Combo 생성
 * @param objGrid      : 필터 적용할 그리드 컴포넌트
 * @param sFiltertype  : 필터 처리 방법(none : 일치, like : 문자열포함)
 * @return             : 없음
 */
pForm.Grid_FilterCombo_Show = function(grid, sFiltertype) {
	if (!grid || !grid instanceof nexacro.Grid) { return; }
	
	let form = grid._getForm()||(grid.getBindDataset()||grid).parent;
	let config = grid.config = Object.assign(grid.config||{}, {
		type   : 'combo',
		css    : 'filter',
		editid : 'edtFilter',
		popupid: 'popFilter',
	});
	
	let fEditId = config.editid, fPopupId = config.popupid, fEdit = form[fEditId], fPopup = form[fPopupId];
	let filterHeadRowIndex = config.filterHeadRowIndex;
	
	if (!sFiltertype) { sFiltertype = 'none'; }
	filterHeadRowIndex = grid.appendContentsRow('head');  // 필터 Head Row 추가
	
	// 다른 Head Row의 사이즈와 동일하게 변경
	let dHeight = 34, nHeight = grid.getFormatRowProperty(filterHeadRowIndex-1, 'size');  nHeight = nHeight > dHeight ? nHeight : dHeight;
	grid.setFormatRowProperty(filterHeadRowIndex, 'size', dHeight);
	
	if (!fEdit) {  // 필터 Edit가 없는 경우 만들기
		fEdit = new Edit(fEditId, 0, 0, 0, 0, null, null);
		form.addChild(fEditId, fEdit);
		fEdit.targetGrid = grid;
		fEdit.set_readonly(false);  // fEdit.set_readonly(true);
		fEdit.set_padding("0 7px 0 7px");
		fEdit.addEventHandler('onkillfocus', form.Grid_FilterCombo_Edit_OnKillFocus, form);
		fEdit.addEventHandler('onkeydown'  , form.Grid_FilterCombo_Edit_OnKeyDown  , form);
		//fEdit.addEventHandler('onsetfocus' , form.Grid_FilterCombo_Edit_OnSetFocus , form);  // Edit set focus
		fEdit.show();
	}
	fEdit.move(0, 0, 0, 0);
	
	if (!fPopup) {  // 필더 PopupDiv가 없는 경우 만들기
		fPopup = new PopupDiv(fPopupId, 0, 0, 0, 0, null, null);
		fPopup.set_url('common::GridHeadFilterPopup.xfdl');
		form.addChild(fPopupId, fPopup);
		fPopup.addEventHandler('oncloseup', form.Grid_FilterCombo_Popup_OnClose, form);
		fPopup.show();
	}
	fPopup.move(0, 0, 0, 0);
	
	//필터 설정 정보 만들기
	config = grid.config = Object.assign(grid.config||{}, {
		type               : 'combo',
		css                : 'fltr filter',
		filterHeadRowIndex : filterHeadRowIndex,  // 필터 Head의 Row Index
		cells              : [],                  // Cell별 필터 정보를 관리할 Array
		filteredit         : fEdit,               // 필터 입력용 Edit
		filterpop          : fPopup,              // 필터 선택용 PopupDiv
		filtertype         : sFiltertype,         // 필터 치리 방식 설정(none, like)
	});
	
	let nHeadRow, nHeadCol, sBtxt, sBindColumn, nHeadCellCnt = grid.getCellCount('head');  // Head의 Cell 갯수 가져오기
	for (let i=0; i<nHeadCellCnt; i++) {
		nHeadRow = grid.getCellProperty('head', i, 'row');
		// grid.setCellProperty('head', i, 'cssclass'   , config.css);  // fltr 행 인식자
		
		// 필터 Head Row에 있는 Cell일 경우
		if (nHeadRow == filterHeadRowIndex) {
			//Head의 Col Index로 Body의 Index 찾기
			nHcol = grid.getCellProperty('head',     i, 'col' );
			sBtxt = grid.getCellProperty('body', nHcol, 'text');
			
			let isChkCell = 
				   grid.getCellProperty('body', nHcol, 'displaytype') == 'checkboxcontrol'
				&& grid.getCellProperty('body', nHcol, 'edittype'   ) == 'checkbox'       
				//&& grid.getCellProperty('body', nHcol, 'text'       ).indexOf('chk')>-1
			;
			if (isChkCell) { continue; }
			
			// Bind된 Cell일 경우 Cell별 필터 정보 입력
			if (sBtxt && sBtxt.indexOf('bind:') > -1) {
				sBindColumn = sBtxt.replace('bind:', '');
				grid.config.cells[i] = {
					bind  : sBindColumn,	// 바인드된 컬럼명
					value : null,           // Filter 문자열
				};
				grid.setCellProperty('head', i, 'cssclass'   , config.css   );  // [2023.12.01] sgpark - Filter Icon 표시
				grid.setCellProperty('head', i, 'expandshow' , 'show'       );  // expand버튼이 보이도록 설정
				grid.setCellProperty('head', i, 'displaytype', 'editcontrol');  // Head Cell의 displaytype을 editcontrol로 설정
				// grid.setCellProperty('head', i, 'edittype'   , 'text'       );  // Head Cell의 edittype   을 edit       로 설정 - [2024.02.15] 이거 열면 popup width 너무 큼
			}
		}
	}
	
	// 필터에 필요한 이벤트 추가
	grid.addEventHandler('onheadclick', form.Grid_FilterCombo_OnHeadClick, form);
	grid.addEventHandler('onexpandup' , form.Grid_FilterCombo_OnExpandUp , form);
	grid.addEventHandler('onhscroll'  , form.Grid_FilterCombo_OnHScroll  , form);
	grid.addEventHandler('onvscroll'  , form.Grid_FilterCombo_OnVScroll  , form);
};

/**
 * Grid Filter Combo - Filter 초기화
 * @param   grid : 필터 초기화 그리드 컴포넌트
 * @return       : 없음
 */
pForm.Grid_FilterCombo_Reset = function(grid) {
	if (!grid || !grid instanceof nexacro.Grid)  { return; }
	if (!grid.config || !grid.config.filtertype) { return; }
	
	let form = grid._getForm(), config = grid.config, filtertype = config.filtertype, cells = config.cells, cellsCunt = cells.length;  // Cell별 설정정보 갯수 가져오기
	let ds = grid.getBindDataset();
	
	let nHeadRow = null, cellCss = null, filterHeadRowIndex = config.filterHeadRowIndex, nHeadCellCnt = grid.getCellCount('head');
	for (let i=0; i<nHeadCellCnt; i++) {
		nHeadRow = grid.getCellProperty('head', i, 'row');
		cellCss  = grid.getCellProperty('head', i, 'cssclass');
		
		// 필터 Head Row에 있는 Cell일 경우
		if (nHeadRow == filterHeadRowIndex && cellCss && config.css && config.css.indexOf(cellCss) > -1) {
			let nHcol = grid.getCellProperty('head',     i, 'col' );
			let nBtxt = grid.getCellProperty('body', nHcol, 'text');
			if (nHcol > -1 && nBtxt && nBtxt.indexOf('bind:') > -1) {
				grid.setCellProperty('head', i, 'text' , '');
			}
		}
	}
	if (config.cells) {
		for (let j in config.cells) {
			config.cells[j].value = null;
		}
	}
	
	ds.filter('');
};

/**
 * Grid Filter Combo 삭제
 * @param grid  : 필터 적용된 그리드 컴포넌트
 * @return      : 없음
 */
pForm.Grid_FilterCombo_Hide = function(grid) {
	if (!grid || !grid instanceof nexacro.Grid) { return; }
	
	let form = grid._getForm(), config = grid.config;
	let fEditId = config.editid, fPopupId = config.popupid, fEdit = form[fEditId], fPopup = form[fPopupId];
	let filterHeadRowIndex = config.filterHeadRowIndex;
	
	let ds = grid.getBindDataset();
	
	// 필터 Head Row 삭제
	grid.deleteContentsRow('head', filterHeadRowIndex+1);
	grid.deleteContentsRow('head', filterHeadRowIndex  );
	
	fEdit  = form.removeChild(fEditId );  if (fEdit ) { fEdit.destroy (); }  // 필터용 Edit 삭제
	fPopup = form.removeChild(fPopupId);  if (fPopup) { fPopup.destroy(); }  // 필터용 PopupDiv 삭제
	
	// 필터용 Grid 이벤트 삭제
	grid.removeEventHandler('onheadclick', form.Grid_FilterCombo_OnHeadClick, form);
	grid.removeEventHandler('onexpandup' , form.Grid_FilterCombo_OnExpandUp , form);
	grid.removeEventHandler('onhscroll'  , form.Grid_FilterCombo_OnHScroll  , form);
	grid.removeEventHandler('onvscroll'  , form.Grid_FilterCombo_OnVScroll  , form);
	
	// 필터 설정 정보 삭제
	grid.config = null; delete grid.config;
	ds.filter('');
};

/**
 * Grid Filter Combo Cells 정보 재생성
 * @param grid  : 필터 적용된 그리드 컴포넌트
 * @return         : 없음
 */
pForm.Grid_FilterCombo_ReMakeCells = function(grid) {
	if (!grid || !grid instanceof nexacro.Grid) { return; }
	
	let i, j, nHeadRow, nHeadCol, sBtxt, sBindColId, sBindColKw, sBindColVl;
		
	let form = grid._getForm(), config = grid.config, filterHeadRowIndex = config.filterHeadRowIndex;  // 필터 Head Row Index 가져오기
	let cellsOrgl = config.cells, cellsOrglCunt = cellsOrgl.length;
	let cells = [], headCellCunt = grid.getCellCount('head');  // Head의 Cell 갯수 가져오기
	
	for (i=0; i<headCellCunt; i++) {
		nHeadRow = grid.getCellProperty('head', i, 'row');
		
		// 필터 Head Row에 있는 Cell일 경우
		if (nHeadRow == filterHeadRowIndex) {
			//Head의 Col Index로 Body의 Index 찾기
			nHeadCol = grid.getCellProperty('head',        i, 'col' );
			sBtxt    = grid.getCellProperty('body', nHeadCol, 'text');
			
			// Bind된 Cell일 경우
			if (sBtxt && sBtxt.indexOf("bind:") > -1) {
				// bind정보 찾기
				sBindColId = sBtxt.replace('bind:', '');
				
				// 기존 cells에 등록된 value정보 가져오기
				// sBindColKw = cellsOrgl.cells[i] && cellsOrgl.cells[i].keyword ? cellsOrgl.cells[i].keyword : '';
				// sBindColVl = cellsOrgl.cells[i] && cellsOrgl.cells[i].value   ? cellsOrgl.cells[i].value   : '';
				for (j=0; j<cellsOrglCunt; j++) {
					if (cellsOrgl[j] && sBindColId == cellsOrgl[j].bind) {
						sBindColKw = cellsOrgl[j].keyword;
						sBindColVl = cellsOrgl[j].value;
						break;
					}
				}
				
				// 신규 cells정보에 저장
				cells[i] = {
					'bind'   : sBindColId,	// 바인드된 컬럼명
					'keyword': sBindColKw,  // Filter 검색어
					'value'  : sBindColVl,  // Filter 문자열
				};
			}
		}
	}
	
	//config.cells 정보 교체
	config.cells = cells;
};

/**
 * Grid Filter Combo - 필터 문자열 생성
 * @param objGrid	  : 필터 팝업 컴포넌트
 * @return             : 없음
 */
pForm.Grid_FilterCombo_GetFilterValue = function(objPopDiv) {
	let fpopform=objPopDiv.form, fgrid=fpopform.divForm.form.grdFilter, fds=fgrid.getBindDataset();
	
	// keyword : 필터에서 입력한 검색어
	let edittype = fgrid.getCellProperty('head', 1, 'edittype');
	if (edittype) {
		fKeyword = fpopform.opcomps.configcell.keyword || fgrid.getCellProperty('head', 1, 'text');
		fgrid.getCellProperty('head', 1, 'text', fKeyword);
	}
	
	// value : 체크된 리스트를 필터 문자열로 만들기
	fds.set_enableevent(false);
	fds.filter('chk==1');
	
	let iRowCunt = fds.getRowCount(), iRowCuntNF = fds.getRowCountNF(), fKeyword = '', fValue = '', aValue = [];
	if (iRowCuntNF != iRowCunt) {  // 체크 Row == 전체 Row 이면 필터링문자열 없음.
		for (let i=0; i<iRowCunt; i++) {
			//fValue += (i==0 ? '' : ',') + (fds.getColumn(i, 'code')||'{empty}');
			aValue.push( fds.getColumn(i, 'code')||'{empty}' );
		}
	}
	fValue = iRowCuntNF == iRowCunt ? '{all}' : aValue.join(this.Grid_Filter_Separator)||'{empty}';  // this.Grid_Filter_Separator
	
	fds.filter('');
	fds.set_enableevent(true);
	
	// 필터 문자열 리턴
	let isAll = ['{all}'] .includes(fValue);
	fpopform.opcomps.configcell.keyword = isAll ? null : fKeyword;
	fpopform.opcomps.configcell.value   = isAll ? null : fValue;
	
	return {
		filtertype: 'chkeck',
		apply     : fpopform.filterapply,
		keyword   : fpopform.opcomps.configcell.keyword,
		value     : fpopform.opcomps.configcell.value  ,
	};
};

/**
 * Grid Filter Combo - Filter 적용
 * @param grid	  : 필터 적용할 그리드 컴포넌트
 * @return             : 없음
 */
pForm.Grid_FilterCombo_Apply = function(grid) {
	if (!grid || !grid instanceof nexacro.Grid) { return; }
	
	let form = grid._getForm(), config = grid.config, filtertype = config.filtertype, cells = config.cells, cellsCunt = cells.length;  // Cell별 설정정보 갯수 가져오기
	let ds = grid.getBindDataset();
	let fstring = '', fcolId, fcolVl, acolVl, acolVlCunt;
	
	for (let i=0; i<cellsCunt; i++) {
		if (!cells[i] || !cells[i].bind) { continue; }
		
		// Cell 설정정보가 존재하고 bind 정보가 있을 경우
		fcolId = cells[i].bind;
		fcolVl = cells[i].value;
		let fcolFilterType = cells[i].filtertype||'unknwon', fcolInf = ds.getColumnInfo(fcolId), fcolDataType = (fcolInf && fcolInf.type ? fcolInf.type : 'string').toLowerCase();
		
		//필터 문자열 정보가 있을 경우
		if (fcolVl) {  // fcolVl &&
			grid.setCellProperty('head', i, fcolVl);   // fcolVl
			
			// 필터 문자열을 분해하여 필터 쿼리 만들기
			fstring += '('
			acolVl = (fcolVl||'').replace(/\{empty\}/g, '').split(this.Grid_Filter_Separator);  // this.Grid_Filter_Separator
			acolVlCunt = acolVl.length;
			
			// [2024.02.01] sgpark - 당분간 Like 검색은 봉인 , [2024.03.05] sgpark - 봉인해제
			if (filtertype=='like') {
				for(j=0; j<acolVlCunt; j++) {
					
					if (acolVl[j] && ['like'].includes(fcolFilterType)) {
						fstring += fcolId + ".toString().indexOf('"+acolVl[j]+"')>-1";
					} else
					if ( acolVl[j] ) {
						//fstring += fcolId + (isNaN(acolVl[j]) ? ".toString() === '" + acolVl[j] +"'" : "===" + acolVl[j]);
						fstring += fcolId + (['int', 'float', 'bigdecimal'].includes(fcolDataType) ? "===" + acolVl[j] : ".toString() === '" + acolVl[j] +"'");
					} else {
						fstring += "!"+fcolId;
					}
					fstring += '||';
				}
			} else
			{
				for (let j=0; j<acolVlCunt; j++) {
					fstring += fcolId + "==" + (acolVl[j] ? "'"+ acolVl[j] + "'" : 'null') + "||";
				}
			}
			
			fstring = fstring.substr(0, fstring.length-2);
			fstring += ')&&';
		}
	}
	fstring = fstring.substr(0, fstring.length-2);
	
	let sCEnd = '&&';
	fstring = fstring.endsWith(sCEnd) ? fstring.substring(0, fstring.length - sCEnd.length) : fstring;
	
	// 필터 실행
	ds.set_enableevent(false);
	ds.filter(fstring);
	ds.set_enableevent(true);
	//grid.setBindDataset(ds);
};



/**
 * Grid Filter Combo - Edit onsetfocus Event
 */
pForm.Grid_FilterCombo_Edit_OnSetFocus = function(obj, e) {  // obj:nexacro.Edit,e:nexacro.SetFocusEventInfo
	let form = obj.targetGrid._getForm(), grid = obj.targetGrid, config = grid.config, fcell = obj.targetCell;
	
	let fEvt = new nexacro.GridMouseEventInfo('onexpandup');
	fEvt.set_id('onexpandup');
	fEvt.eventid    = 'onexpandup';
	fEvt.fromobject = obj         ;  fEvt.fromobject.parent = form;
	fEvt.cell       = fcell       ;
	
	form.Grid_FilterCombo_OnExpandUp(grid, fEvt);
};

/**
 * @description Grid Filter Combo - Popup Close Event
 */
pForm.Grid_FilterCombo_Popup_OnClose = function(obj, e) {  // obj:nexacro.PopupDiv, e:nexacro.EventInfo
	let fpop = obj, form = fpop.form, grid = fpop.targetGrid, config = grid.config, fcellIdx = fpop.cellidx;
	
	// 팝업을 호출한 Cell Index, Grid 컴포넌트, 설정 정보
	let finf = form.Grid_FilterCombo_GetFilterValue(fpop);  // 필터 문자열 만드는 함수 호출
	
	if (!finf.apply) { return; }
	if (['{all}'].includes(finf.value)) {
		finf.value = '';
	}
	
	grid.setCellProperty('head', fcellIdx,        'text', finf.value);
	grid.setCellProperty('head', fcellIdx, 'tooltiptext', finf.value);
	Object.assign(config.cells[fcellIdx], finf);
	
	form.Grid_FilterCombo_Apply(grid);  //필터 실행 함수 호출
};


/**
 * @description Grid Filter Combo - HeadClick Event
 */
pForm.Grid_FilterCombo_OnHeadClick = function(obj, e) {  // obj:nexacro.Grid,e:nexacro.GridClickEventInfo
	let form = obj._getForm(), grid = obj, config = grid.config, refobject = e.fromreferenceobject;
	let dfilterHeadRowIndex = config.filterHeadRowIndex;
	let cfilterHeadRowIndex = obj.getCellProperty('head', e.cell, 'row');
	
	if ( dfilterHeadRowIndex!=cfilterHeadRowIndex || !(refobject instanceof nexacro._GridEditControl) ) { return; }  // if (filterHeadRowIndex==cfilterHeadRowIndex && refobject instanceof nexacro._GridEditControl) {
	
	// click된 cell이 Filter Head Row이며, Edit가 표현되어 있는 경우(bind된 cell일 경우만 표현됨)
	let fedit, oRect, nLeft, nTop, nWidth, nHeight, sBtxt
	
	// Cell 사이즈 구하기
	oRect   = grid.getCellRect(-1, e.cell);
	nLeft   = grid.getOffsetLeft() + oRect.left + refobject.getOffsetLeft  () + 1;
	nTop    = grid.getOffsetTop () + oRect.top  + refobject.getOffsetTop   () + 2;
	nWidth  =                                     refobject.getOffsetWidth ();
	nHeight =                                     refobject.getOffsetHeight();
	
	sBtxt = obj.getCellText(e.row, e.cell);  // Cell의 Text 가져오기
	fedit = config.filteredit;            // Filter용 Edit 가져오기
	
	//Filter Head Cell 위치랑 동일하게 Edit 배치
	fedit.move(nLeft, nTop, nWidth, nHeight);
	fedit.set_value(sBtxt);
	fedit.targetCell = e.cell;
	fedit.set_visible(true);
	fedit.setFocus();
	
	// form.Grid_FilterCombo_OnExpandUp(grid, { row: e.row, cell: e.cell, fromobject: e.fromobject });  // Filter Popup Show
};

/**
 * Grid Filter Combo - Edit keydown Event
 */
pForm.Grid_FilterCombo_Edit_OnKeyDown = function(obj, e) {  // obj:nexacro.Edit,e:nexacro.KeyEventInfo
	if (e.ctrlkey || e.altkey || e.shiftkey) { return; }
	if (![13].includes(e.keycode)) { return; }
	
	// 엔터키 입력 시
	let grid = obj.targetGrid, form = grid._getForm(), config = grid.config;
	let fcellIdx = obj.targetCell, fcellVal = obj.value;
	
	form.Grid_FilterCombo_ReMakeCells(grid);                   // Cells정보를 다시 만드는 함수 호출
	grid.setCellProperty('head', fcellIdx, 'text', fcellVal);  // 현재 Edit Value를 Grid Cell Text에 저장
	config.cells[fcellIdx].value      = fcellVal;              // 해당 Cell 설정정보에 필터 문자열 저장
	
	config.cells[fcellIdx].filtertype = 'like'  ;              // 해당 Cell 설정정보에 필터 문자열 저장
	
	form.Grid_FilterCombo_Apply(grid);                         // 필터 실행 함수 호출
};

/**
 * @description Filter Edit onkillfocus 시 처리내역
 */
pForm.Grid_FilterCombo_Edit_OnKillFocus = function(obj, e) {  // obj:nexacro.Edit, e:nexacro.KillFocusEventInfo
	let grid = obj.targetGrid, form = grid._getForm(), config = grid.config
	let fcellIdx = obj.targetCell, fcellVal = obj.value;
	
//	form.Grid_FilterCombo_ReMakeCells(grid);  // Cells정보를 다시 만드는 함수 호출
// 	grid.setCellProperty('head', fcell, 'text', fval);  //현재 Edit Value를 Grid Cell Text에 저장
// 	config.cells[nCell].value = fval;  //해당 Cell 설정정보에 필터 문자열 저장
	
	obj.set_visible(false);  // Edit 숨기기
};

/**
 * @description Grid Filter Combo - Head ExpandupClick Event
 */
pForm.Grid_FilterCombo_OnExpandUp = function(obj, e) {  // obj:nexacro.Grid, e:nexacro.GridMouseEventInfo
	if (e.row != -1) { return; }  // head만 적용
	
	let form = obj._getForm(), grid = obj, config = grid.config, fpop = config.filterpop;     // 그리드, 필터 설정, 필터 팝업
	let hcell = e.fromobject.parent, hrect = grid.getCellRect(-1, e.cell);  // Expand 버튼이 포함된 Cell, Cell 영역 Rect [ "-1": Head 밴드, "-2": Summary 밴드 ]
	
	// 팝업 사이즈 설정 - 데이터 건수별 Height 조정처리 필요.
	let nLeft  = hrect.left, nTop = hrect.top + hrect.height;
	let nWidth = hcell.getOffsetWidth()+24, nHeight = 250;
	if (nWidth < 160) { nWidth = 160; }   // width가 너무 작으면 최소 160으로 고정
	
	//oncloseup시 필요한 정보를 사용자 속성으로 등록
	fpop.targetGrid = grid;
	fpop.cellidx    = e.cell;
	
	form.Grid_FilterCombo_ReMakeCells(grid);                         // Cells정보를 다시 만드는 함수 호출
	
	fpop.form.filterapply = false;                                   // 필터 적용여부 false - 팝업에서 필요액션이 있으면 true로 변경됨
	fpop.form.fnMakeFilterDataset(grid, e.cell, config);             // 필터 리스트 데이터셋 생성 함수 호출
	fpop.trackPopupByComponent(grid, nLeft, nTop, nWidth, nHeight);  // 필터 팝업 오픈
};

/**
 * Grid Filter Combo - onhscroll Event - 필터용 Edit 숨기기
 */
pForm.Grid_FilterCombo_OnHScroll = function(obj, e) {  // obj:nexacro.Grid,e:nexacro.ScrollEventInfo
	let config = obj.config, fedit = config.filteredit;
	fedit.set_visible(false);
};

/**
 * Grid Filter Combo - onvscroll Event - 필터용 Edit 숨기기
 */
pForm.Grid_FilterCombo_OnVScroll = function(obj, e) {  // obj:nexacro.Grid,e:nexacro.ScrollEventInfo
	let config = obj.config, fedit = config.filteredit;
	fedit.set_visible(false);
};



pForm = null; delete pForm;
