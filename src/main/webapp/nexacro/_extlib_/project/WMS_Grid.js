/**
 *  SVC-WMS Grid Library
 *  @FileName 	  WMS_MultiCombo.js
 *  @Creator 	  SVC-WMS
 *  @CreateDate   2023/11/30
 *  @Desction
 ************** 소스 수정 이력 ***********************************************
 *  date        Modifier         Description
 *******************************************************************************
 * 2023/11/30   SVC-WMS          Grid Library
 *******************************************************************************
 */
var pForm = nexacro.Form.prototype, pGrid = nexacro.Grid.prototype, pWms = nexacro.Wms.prototype;  // Prototype Getter

/*******************************************************************************************************************************
 * Grid Initialize Function
 *******************************************************************************************************************************/
/*** WMS 그리드 공통 기능 ***/
pForm.initGridComponent = function(grid, form) {
	wms.initGridComponent(grid, form||this);
};

/**
 * @description   : WMS 그리드 초기화
 */
pWms.initGridComponent = function(grid, form) {
	if (!grid ) { return; }
	form = form||grid._getForm()||(grid.getBindDataset()||grid).parent, ds=grid.getBindDataset();
	
	let functions = grid._functions||wms.getUserFunctionsProperty(grid);
	
	// WMS 디자인 요소 적용
	grid.set_nodatatext('No Rows To Show');
	grid.set_scrollbardecbuttonsize(0);
	grid.set_scrollbarincbuttonsize(0);
	grid.set_scrollbarsize(10);
	
	// WMS 디자인 설정값을 Default로 지정 - Grid.createFormat() 실행시, 필요
	grid._DEFAULT_PROPERTY = {
		HEAD_ROW_HEIGHT: grid._curFormat && grid._curFormat._headrows && grid._curFormat._headrows[0] ? grid._curFormat._headrows[0].orgsize : 34,
		BODY_ROW_HEIGHT: grid._curFormat && grid._curFormat._bodyrows && grid._curFormat._bodyrows[0] ? grid._curFormat._bodyrows[0].orgsize : 34,
		SUMM_ROW_HEIGHT: grid._curFormat && grid._curFormat._summrows && grid._curFormat._summrows[0] ? grid._curFormat._summrows[0].orgsize : 34,
	};
	
	

	
//	grid.addEventHandler('onrbuttondown', wms._gOncontextmenuclick, form);
//	grid.addEventHandler('onrbuttonup', function(obj, e) {  // obj:Grid, e:nexacro.GridMouseEventInfo
//	trace('grid onrbuttonup');
//	//obj.uContextMenu.trackPopupByComponent(grid, x, y);
//	wms._gOncontextmenuclick(obj, e);
//	}, pForm);

	// 컨텍스트 메뉴 활성화 여부
	if (functions.contextmenu && functions.contextmenu.enable) {
	
		// 컨텍스트 메뉴 설정
		let sGrdCntx='gc_'+grid.id, oGrdCntx = form[sGrdCntx]; // 그리드 컨텍스트 메뉴생성
		if (oGrdCntx) { form.removeChild(sGrdCntx); } // 기존 컨텍스트 메뉴 삭제
		grid.uContextMenu = oGrdCntx = new PopupMenu(sGrdCntx, 0, 0, 100, 100);
		form.addChild(sGrdCntx, oGrdCntx);
		
		let dc_dataset = new Dataset('dc_'+grid.id);
		dc_dataset.copyData( nexacro.getApplication().gds_GridContextMenu );
		
		oGrdCntx.grid             = grid            ;
		oGrdCntx.dataset          = dc_dataset      ;
		oGrdCntx.set_innerdataset  (dc_dataset     );
		oGrdCntx.set_itemheight    (30             );
		oGrdCntx.set_idcolumn      ('id'           );
		oGrdCntx.set_levelcolumn   ('level'        );
		oGrdCntx.set_checkboxcolumn('chk'          );
		oGrdCntx.set_enablecolumn  ('enable'       );
		oGrdCntx.set_iconcolumn    ('icon'         );
		oGrdCntx.set_captioncolumn ('title'        );
		oGrdCntx.addEventHandler   ('onmenuclick', wms.gridOnmenuclick, form);
		oGrdCntx.show();
		
		grid.addEventHandler('onrbuttonup'  , wms._gOncontextmenuclick, form);
	}
	
	// scrollpaging
	if (functions.paging && functions.paging.enable) {
		let paging = functions.paging;
		if ('scroll' == paging.type) { wms.Grid_PagingScroll_Init(grid, form); }
	}   // if (functions.paging && functions.paging.enable)
	
	// Grid Cell Move
	if (functions.move && functions.move.enable) {
		grid.set_cellmovingtype('col,band');
	}
	
	// Grid Cell Resize
	if (functions.resize && functions.resize.enable) {
		wms.Grid_Resize_Init(grid, this);
	}
	
	// 사용자 설정용 - 그리드 컬럼정보
	grid._defaultFormats = grid.getCurFormatString();
	grid._defaultCellset = new Dataset();
	
	// 사용자 설정용 - 그리드 사용자 설정이 있으면 셋팅
	let _user = nexacro.getApplication().gds_UserInfo.getSelectedRowObject();
	if (_user && _user.userId) {
		grid._privateProfileId = grid._privateProfileId||(_user.userId+","+grid._getOwnerFrame().id+","+grid.id);
		let userFormats = nexacro.getPrivateProfile(grid._privateProfileId);
		if (userFormats && !this.isNull(userFormats) && 'null'!=userFormats) {
			grid.set_formats('<Formats>'+ userFormats +'</Formats>');
		}
	}
	
	// Grid Filter 설정
	if (functions.filter && functions.filter.enable) {
		form.Grid_Filter_Show(grid);  // [2024.02.15] sg.park - 그리드 필터 통합
		
		if (grid.uContextMenu) {
			let ds_Cntx = grid.uContextMenu.dataset, _eIdx = ds_Cntx.findRow('code', 'FILTER');
			ds_Cntx.setColumn(_eIdx, 'id'   , 'UNFILTER');
			ds_Cntx.setColumn(_eIdx, 'title', 'unfilter');
		}
	}
	
	// Grid Cell Checkbox 설정
	if (functions.checkbox && functions.checkbox.enable) {
		wms.gridCheckboxNoStatusAdd(grid, ds, 'checkbox');
		grid.addEventHandler('onheadclick', form.Grid_Checkbox_OnHeadClick, form);
		grid.addEventHandler('oncellclick', form.Grid_Checkbox_OnCellClick, form);
	}
	
	// Grid Cell 순번 설정
	if (functions.no && functions.no.enable) {
		wms.gridCheckboxNoStatusAdd(grid, ds, 'no');
	}
	
	// Grid Cell 상태 설정
	if (functions.status && functions.status.enable) {
		wms.gridCheckboxNoStatusAdd(grid, ds, 'status');
	}
	
	// Grid Sort 설정
	if ((functions.sort && functions.sort.enable) || (grid.arrProp && grid.arrProp.indexOf('sort') > -1)) {
		grid.Grid_Sort_Init();
	}
	
	// Grid Cell Tooltip 표시
	if (functions.tooltip && functions.tooltip.enable) {
		grid.addEventHandler('onmousemove', grid.Grid_Tooltip_Show, form);
	}
	
// 	// Grid Clipboard(Copy&Paste)
// 	if (functions.clipboard && functions.clipboard.enable) {
// 		grid.addEventHandler('onmousemove', grid.Grid_Tooltip_Show, form);
// 	}
	
	// Grid Cell Enter 입력시 포커스 이동
	if (functions.enterfocusmove && functions.enterfocusmove.enable) {
		grid.set_autoenter('select');
		grid.set_autoupdatetype('itemselect');
		grid.addEventHandler('onkeyup', grid.Grid_EnterFocus_Move, form);
	}
	
	//trace('initGrid['+ grid.id +'] ');
	// grid.setBindDataset( grid.getBindDataset() );
	return grid;
};

/*******************************************************************************************************************************
 * Grid Utility Function
 *******************************************************************************************************************************/
{
	pWms.getUserFunctionsProperty = function(_grid) {
		let defaultFunctions = _grid._defaultFunctions={  // Default Functions
			contextmenu   : { name: 'contextmenu'   , enable: true  },
			filter        : { name: 'filter'        , enable: false , type: 'combo', },
			sort          : { name: 'sort'          , enable: true  },
			move          : { name: 'move'          , enable: true  },
			resize        : { name: 'resize'        , enable: true  },
			resizerow     : { name: 'resizerow'     , enable: false },
			checkbox      : { name: 'checkbox'      , enable: false },
			no            : { name: 'no'            , enable: false },
			status        : { name: 'status'        , enable: false },
			paging        : { name: 'paging'        , enable: false },
			tooltip       : { name: 'tooltip'       , enable: true  },
			
			clipboard     : { name: 'clipboard'     , enable: false },
			enterfocusmove: { name: 'enterfocusmove', enable: false },
		};
		
		let uFunction = _grid.uFunction, _oFunctions = {};
		if (uFunction) {
			let aUFunc = uFunction.split(',');
			for (let i in aUFunc) {
				let sKey = aUFunc[i], aKey = sKey.replace(/!/g, '').split(':');
				let oFunction = { name: aKey[0], enable: sKey.indexOf('!')>-1 ? false : true };
				
				if (aKey.length>0 && aKey[0].indexOf('filter'  )>-1) {
					oFunction['type'    ] = aKey[1]||defaultFunctions.filter.type;
				} else
				if (aKey.length>1 && aKey[0].indexOf('checkbox')>-1) {
					oFunction['column'  ] = aKey[1];
					oFunction['expr'    ] = aKey[2];
					oFunction['callback'] = aKey[3];
				}
				
				_oFunctions[aKey[0]] = oFunction;
			}
		}
		
		let uPaging = _grid.uPaging, oPaging = { name: 'paging', enable: false };
		if (uPaging) {
			oPaging['enable'] = true;
			let aUPaging = uPaging.replace(/[\\{|\\| }]/g, '').split(',');
			for (let i in aUPaging) {
				let aKV = aUPaging[i].split(':');
				if (aKV.length>1) {
					oPaging[aKV[0]] = aKV[1];
				}
			}
			_grid.paging = _oFunctions['paging'] = oPaging;
		}
		
		let defaultKeys = Object.keys(defaultFunctions);
		for (var i in defaultKeys) {
			let key = defaultKeys[i];
			_oFunctions[key] = _oFunctions[key]||defaultFunctions[key];
		}
		
		return _grid._functions = _oFunctions;
	}
	
	// Grid 체크된 Row를 반환
	pGrid.getSelectedDataObjects = function(chkColId='chk') {
		let selecttype=this.selecttype, ds=this.getBindDataset(), aRows=null;
		if (!ds || ds.getRowCount() < 1) { return aRows; }
		return 'multirow'==selecttype ? ds.getSelectedRowObjects() : [ ds.getSelectedRowObject() ];
	};

	pWms._StringToObject = function(s) {
		var oOps={}, _Ops = s.replace(/[\\{|\\}]/g, '').split(',');
		if (!s) { return s; }
		
		_Ops.forEach(function(_p) {
			var tup = _p.split(':');
			oOps[tup[0]] = tup[1].replace(/['|\\"]/g, '');
		});
		
		return oOps;
	};
}

// gridCheckboxNoStatusAdd 호환용
pForm.gridGetBodyCellIndex         = pForm.gfnGridGetBodyCellIndex;
pForm.gridGetBindColumnNameByIndex = pForm.gfnGetBindColName      ;

/**
 * @class Grid에 기능 추가(addCol..)
 * @param {Object} objGrid	- 대상그리드
 * @param {Object} objDs	- 대상데이터셋
 * @param {Array} addProp	- 기능
 * @return N/A
 * @example
 * this.gridCheckboxNoStatusAdd(this.grdMain, this.dsList, [checkbox,no,status]);
 */
pWms.gridCheckboxNoStatusAdd = function(objGrid, objDs, addProp) {
	let form = objGrid._getForm(), nHeadColIndex;
	
	if (wms.isNull(objDs.insertheadcell)) nHeadColIndex = 0;
	else nHeadColIndex = objDs.insertheadcell;

	var nBodyColIndex;
	if(wms.isNull(objDs.insertbodycell)) nBodyColIndex = 0;
	else nBodyColIndex = objDs.insertbodycell;
	
	var nFormatRowCount = objGrid.getFormatRowCount();
	var nHeadCount=-1;
	var nBodyCount=-1;
	for (var i=0; i<nFormatRowCount; i++) {
		if (objGrid.getFormatRowProperty(i, 'band') == 'head') nHeadCount++;
		if (objGrid.getFormatRowProperty(i, 'band') == 'body') nBodyCount++;
	}

	var sNo     = wms.getWord("cmm.no"    )||'No'    ;  // 순번
	var sStatus = wms.getWord("cmm.status")||'Status';  // 상태

	//체크박스
	if ( addProp == 'checkbox' ) {
		var idx=-1, colChkId='chk';  // colChkId='gridcmmcheck';
		for (var j=0; j<objDs.getColCount(); j++) {
			var tmpcol = objDs.getColID(j);
			if (tmpcol == colChkId) {
				idx = j;
			}
		}
		if (idx < 0) objDs.addColumn(colChkId, 'string', 1);
		
		for ( var i=0; i<objGrid.getCellCount('head'); i++){
			// 헤드텍스트
			var tmp = objGrid.getCellProperty('head' , i, "text");
			if ( tmp == "0") {
				var bodyCellIndex = form.gridGetBodyCellIndex        (objGrid, i            );  // head cell index 에 해당하는 body cell index
				var columnName    = form.gridGetBindColumnNameByIndex(objGrid, bodyCellIndex);  // body cell index 에 해당하는 바인드 컬럼명
				if(columnName == colChkId) {
					objGrid.deleteContentsCol('body', i);  // return;
				}
			}
		}
		
		// [2024.02.16] sg.park - objGrid._functions.checkbox
		let fcheckbox = objGrid._functions.checkbox;
		
		// Head Cell
		objGrid.insertContentsCol   (nBodyColIndex);
		objGrid.setFormatColProperty(nBodyColIndex, 'size', '30');
		objGrid.setCellProperty('head', nHeadColIndex, 'displaytype'       , 'checkboxcontrol');
		objGrid.setCellProperty('head', nHeadColIndex, 'edittype'          , 'checkbox'       );
		objGrid.setCellProperty('body', nBodyColIndex, 'checkboxfalsevalue', '0'              );
		objGrid.setCellProperty('body', nBodyColIndex, 'checkboxtruevalue' , '1'              );
		objGrid.setCellProperty('head', nHeadColIndex, 'text'              , '0'              );
		
		// Body Cell
		objGrid.setCellProperty('body', nBodyColIndex, 'displaytype'       , 'checkboxcontrol');
		objGrid.setCellProperty('body', nBodyColIndex, 'edittype'          , 'checkbox'       );
		if (fcheckbox && fcheckbox.expr) {
		objGrid.setCellProperty('body', nBodyColIndex, 'cssclass'          , 'expr:'+ fcheckbox.expr +"?'':'cellDis'"     );
		objGrid.setCellProperty('body', nBodyColIndex, 'edittype'          , 'expr:'+ fcheckbox.expr +"?'checkbox':'none'");
		}
		objGrid.setCellProperty('body', nBodyColIndex, 'checkboxfalsevalue', '0'              );
		objGrid.setCellProperty('body', nBodyColIndex, 'checkboxtruevalue' , '1'              );
		objGrid.setCellProperty('body', nBodyColIndex, 'text'              , 'bind:'+ colChkId);  // 'bind:gridcmmcheck');
		
		objGrid.mergeContentsCell('head', 0, nBodyColIndex, nHeadCount, nBodyColIndex, nHeadColIndex, false);
		objGrid.mergeContentsCell('body', 0, nBodyColIndex, nBodyCount, nBodyColIndex, nBodyColIndex, false);
		
		nHeadColIndex++;
		nBodyColIndex++;
	}
	//번호
	if(addProp == "no") {
		for( var i=0; i<objGrid.getCellCount('head'); i++){
			var tmp = objGrid.getCellProperty('head' , i, "text");
			if( tmp == "NO" || tmp == "순번"){
				//return;
				objGrid.deleteContentsCol('body', i);
			}
		}
		objGrid.insertContentsCol(nBodyColIndex);
		objGrid.setFormatColProperty(nBodyColIndex, "size", "50");
		objGrid.setCellProperty('head', nHeadColIndex, "text", sNo);
		objGrid.setCellProperty('head', nHeadColIndex, "textAlign","center");
		objGrid.setCellProperty('body', nBodyColIndex, "text","expr:currow+1");
		objGrid.setCellProperty('body', nBodyColIndex, "textAlign","center");
		objGrid.mergeContentsCell('head', 0, nBodyColIndex, nHeadCount, nBodyColIndex, nHeadColIndex, false);
		objGrid.mergeContentsCell('body', 0, nBodyColIndex, nBodyCount, nBodyColIndex, nBodyColIndex, false);
		
		nHeadColIndex++;
		nBodyColIndex++;
	}
	//상태
	if ( addProp == "status"){
		for( var i=0; i<objGrid.getCellCount('head'); i++){
			var tmp = objGrid.getCellProperty('head' , i, "text");
			if( tmp == "상태" || tmp == "Status"){
				//return;
				objGrid.deleteContentsCol('body', i);
			}
		}
		
		var sInsert = nexacro.wrapQuote(wms.getWord("insert")); //입력
		var sUpdate = nexacro.wrapQuote(wms.getWord("modify")); //수정
		var sDelete = nexacro.wrapQuote(wms.getWord("delete")); //삭제
		var sExpr = "expr:"
				+ "dataset.getRowType(currow)==2?"+sInsert
				+ ":dataset.getRowType(currow)==4?"+sUpdate
				+ ":dataset.getRowType(currow)==8?"+sDelete
				+ ":''";
		
		var nSize = 50;
		if( nexacro.getEnvironmentVariable("evLanguage") == "EN") nSize = 80;
		
		objGrid.insertContentsCol(nBodyColIndex);
		objGrid.setFormatColProperty(nBodyColIndex, "size", nSize);
		objGrid.setCellProperty  ('head', nHeadColIndex, "text", sStatus);
		objGrid.setCellProperty  ('head', nHeadColIndex, "textAlign","center");
		objGrid.setCellProperty  ('body', nBodyColIndex, "displaytype", "expr:dataset.getRowType(currow) != 1 ? 'text' : ''");
		objGrid.setCellProperty  ('body', nBodyColIndex, "text", sExpr);
		objGrid.setCellProperty  ('body', nBodyColIndex, "textAlign","center");
		objGrid.mergeContentsCell('head', 0, nBodyColIndex, nHeadCount, nBodyColIndex, nHeadColIndex, false);
		objGrid.mergeContentsCell('body', 0, nBodyColIndex, nBodyCount, nBodyColIndex, nBodyColIndex, false);
		
		nHeadColIndex++;
		nBodyColIndex++;
	}
}

/*******************************************************************************************************************************
 * Grid Sort
 *******************************************************************************************************************************/
{
	// Grid HeadCell Click Sort
	pGrid.Grid_Sort_Init = function() {
		// if (arrProp.indexOf('sort')>=0) { objGrid.uFun_sort = true; }
		let grid = this, form = grid._getForm();
		grid.uFun_sort = true;
		grid.addEventHandler('onheadclick', grid.Grid_Sort_OnHeadClick, form);
	};
	
	/**
	 * @class  그리드 정렬용 - 헤드클릭 이벤트 [Sort, Checkbox]
	 * @param {Object} objGrid - 대상그리드
	 * @param {Evnet}  e	   - 헤드클릭이벤트
	 * @return  N/A
	 * @example objGrid.addEventHandler("onheadclick", this.gfnGrid_onheadclick, this);
	 */
	pGrid.Grid_Sort_OnHeadClick = function(obj, e) {
		let grid = obj, form = grid._getForm();
		if (form.gfnIsGridFilterCell  (grid, e)) { return; }  // 필터 Cell 이면 정렬처리 제외
		if (form.gfnIsGridCheckboxCell(grid, e)) { return; }  // 체크박스인 경우
		if (!grid.uFun_sort || grid._appendHeadRowIndex == e.subrow) { return; }  // find용 row
		trace('pGrid.Grid_Sort_OnHeadClick()');
		
		// sort
		var multiple = false;
		if (e.ctrlkey) multiple = true; // Ctrl 키
		var rtn = form._gfnGridSetSortStatus(grid, e.cell, multiple);
		if (rtn) {
			grid.Grid_Sort_Execute(grid);
		}
	};
	
	/**
	 * @class 소트를 실행한다
	 * @param {Object}  grid 대상 Grid Component
	 * @return{String}  N/A
	 * @example this._gfnGridExecuteSort(obj);
	 */
	pGrid.Grid_Sort_Execute = function() {
		let grid = this, form = grid._getForm();
		var sortInfo,
			sortItem,
			sortInfos = grid.sortInfos,
			sortItems = grid.sortItems,
			columnName,
			status,
			cell,
			sortString = "";
		
		if (!sortInfos || !sortItems) { return; }  // if ( this.gfnIsNull(sortInfos) || this.gfnIsNull(sortItems) ) return;

		// keystring 조합
		for (var i=0; i<sortItems.length; i++) {
			columnName = sortItems[i];
			sortInfo   = sortInfos[columnName];
			status     = sortInfo.status;
			cell       = sortInfo.refCell;
			
			// 컬럼삭제 등으로 제거될 수 있으므로 실제 column 이 존재하는지
			// 확인하여 없으면 제거해 준다.
			if ( !cell || grid.getBindCellIndex('body', columnName) < 0 ) {  // if ( this.gfnIsNull(cell) || grid.getBindCellIndex("body", columnName) < 0 ){
				// 컬럼정보제거
				sortItems.splice(i, 1);
				sortInfos[columnName] = null;
				delete sortInfos[columnName];
				
				i--;
			}
			else if ( status > 0 ) {
				sortString += (status == 1 ? "+" : "-") + columnName;
			}
		}
		
		var ds = grid.getBindDataset();
		
		// keystring 확인
		var curKeyString = ds.keystring;
		var groupKeyString = "";
		
		if (curKeyString.length > 0 && curKeyString.indexOf(",") < 0) {
			var sIndex = curKeyString.indexOf("S:");
			var gIndex = curKeyString.indexOf("G:");

			if (sIndex > -1) {
				groupKeyString = "";
			}
			else {
				if (gIndex < 0) {
					groupKeyString = "G:"+curKeyString;
				}
				else {
					groupKeyString = curKeyString;
				}
			}
		}
		else {
			var temps = curKeyString.split(",");
			var temp;
			for (var i=0,len=temps.length; i<len; i++) {
				temp = temps[i];
				if (temp.length > 0 && temp.indexOf("S:") < 0) {
					if (temp.indexOf("G:") < 0) {
						groupKeyString = "G:"+temp;
					}
					else {
						groupKeyString = temp;
					}
				}
			}
		}
		
		grid.set_enableevent(false);
		grid.set_enableredraw(false);
		
		if (sortString.length > 0) {
			var sortKeyString = "S:"+sortString;
			
			if ( groupKeyString.length > 0 ) {
				ds.set_keystring(groupKeyString + "," +  sortKeyString);
			}
			else {
				ds.set_keystring(sortKeyString);
			}
			
			grid.sortKeyString = sortKeyString;
		}
		else {
			ds.set_keystring(groupKeyString);
			grid.sortKeyString = "";
		}

		// 정렬표시
		var index, marker;
		for (var p in sortInfos) {
			if ( sortInfos.hasOwnProperty(p) ) {
				sortInfo = sortInfos[p];
				cell = sortInfo.refCell;
				if ( cell ) {
					index = cell._cellidx;
					marker = form.gfnDecode(sortInfo.status, 1, form.GridConfig.sort.ascText, 2, form.GridConfig.sort.descText, '');
					grid.setCellProperty( 'head', index, 'text', sortInfo.text + marker);
				}
			}
		}
		
		// rowposition을 최상단으로 이동 필요시
		//ds.set_rowposition(0);
		
		grid.set_enableevent(true);
		grid.set_enableredraw(true);
	};

}

/*******************************************************************************************************************************
 * Grid ContextMenu
 *******************************************************************************************************************************/
pWms._gOncontextmenucreate = function(_grid) {
	
};

pWms._gOncontextmenuclick = function (grid, e) {  // obj:Grid, e:nexacro.GridMouseEventInfo
	let functions = grid._functions||wms.getUserFunctionsProperty(grid);
	if (!(functions && functions.contextmenu && functions.contextmenu.enable)) { return; }
	
	if (e.row == -1 && grid.uContextMenu) {  // Head
	//if(grid.uPersonalFlag == "true"){
		// 대상 그리드와 셀 정보를 추가
		grid.uContextMenu.grid      = grid;
		grid.uContextMenu.cellindex = e.cell;
		grid.uContextMenu.rowindex  = e.row;

		// trackPopupByComponent 이용 : 하단에서 위치 오류 발생, 패치 2018년 9월 예정
		var x = nexacro.toNumber(system.getCursorX()) - nexacro.toNumber(system.clientToScreenX(grid, 0));
		var y = nexacro.toNumber(system.getCursorY()) - nexacro.toNumber(system.clientToScreenY(grid, 0));
		
		// 스튜디오 사용시 팝업메뉴 위치 조정
		var sRunMode = nexacro.getEnvironmentVariable('evRunMode');
		if (sRunMode == "S") { y += 83; }
		
		grid.uContextMenu.trackPopupByComponent(grid, x, y);
	//}
	}
};

pWms.gridOnmenuclick = function(_gpMenu, e) {
	let _grid = _gpMenu.grid, _form = _grid._getForm(), _dsCntx = _gpMenu.dataset, nCellIdx = _gpMenu.cellindex, nRowIdx  = _gpMenu.rowindex, eIdx = e.index;
	let selectCode = e.id; // _dsCntx.getColumn(nRowIdx, 'code');
	
	trace('[selectId:'+ selectCode +']');
	switch (selectCode) {
	
		case 'FILTER':    // 헤드 필터 생성
			_form.Grid_Filter_Show(_grid);  // [2024.02.15] sg.park - 그리드 필터 통합
			_dsCntx.setColumn(eIdx, 'id'   , 'UNFILTER');
			_dsCntx.setColumn(eIdx, 'title', 'unfilter');
			break;
			
		case 'UNFILTER':  // 헤드 필터 삭제
			_form.Grid_Filter_Hide(_grid);  // [2024.02.15] sg.park - 그리드 필터 통합
			_dsCntx.setColumn(eIdx, 'id'   , 'FILTER');
			_dsCntx.setColumn(eIdx, 'title', 'filter');
			break;
	
		case 'FREEZE':  // 틀고정 열
			//this.fv_CellIndex = nCellIndex;
			wms.gridFreezePanse(_grid, nCellIdx, nRowIdx);
			_dsCntx.setColumn(eIdx, 'id'   , 'FREE'      );
			_dsCntx.setColumn(eIdx, 'title', 'free panse');
			break;
			
		case 'FREE':  // 틀고정 열 해제
			wms.gridFreePanse(_grid);
			_dsCntx.setColumn(eIdx, 'id'   , 'FREEZE'      );
			_dsCntx.setColumn(eIdx, 'title', 'freeze panse');
			break;
			
		case 'SELECT_ALL_CELL' :  // 컬럼 표시/숨김 설정
			wms.showAllGridCells(_grid);
			break;
			
		case 'SELECT_CELL' :  // 컬럼 표시/숨김 설정
			wms.toggleGridCells(_grid);
			break;
			
		case 'DEFAULT_SETTINGS': // 그리드 기본설정 보기
			wms.Grid_Settings_RestoreDefault(_grid);
			break;
			
		case 'SAVE_SETTINGS': // 그리드 개인설정 저장
			wms.Grid_Settings_SavePersnal(_grid);
			break;
			
		default: break;
	}
};

pWms.gridFreezePanse = function(_grid, _cellIdx, _rowIdx) {  // 그리드 틀고정 설정
		let nCol     = nexacro.toNumber(_grid.getCellProperty('Head', _cellIdx, 'col'    ));
// 		let nColSpan = nexacro.toNumber(_grid.getCellProperty('Head', _cellIdx, 'colspan'));
// 		let nRowSpan = nexacro.toNumber(_grid.getCellProperty('Head', _cellIdx, 'rowspan'));
// 		let nVal = _grid.getCellpos;
// 		let nMaxCol = 0;
// 		let i;
// 		let nRealCol;
// 		let nRealColSpan;
// 		let nRealCol_end;
		
	_grid.set_enableredraw(false);
	_grid.setFormatColProperty(0   , 'band', 'body');
	_grid.setFormatColProperty(nCol, 'band', 'left');
	_grid.set_enableredraw(true);
};

pWms.gridFreePanse = function(_grid) {  // 그리드 틀고정 해제
	for (let i=0; i<_grid.getFormatColCount(); i++) {
		_grid.setFormatColProperty(i, 'band', 'body');
	}
		
	for (let i=0; i<_grid.getCellCount('body'); i++) {
		_grid.setCellProperty('body', i, 'border', '');
	}
	//this.gv_CellIndex = -1;
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br> 컬럼 전체 보이기
 * @param {Object} objGrid - 대상그리드
 * @param {Number} nCell - 셀필터 셀 인덱스
 * @return N/A
 * @example
 * this._gfnGridColHideShow(this.grdMain);
 */
pWms.showAllGridCells = function(_grid) {
	_grid.set_formats( '<Formats>'+ _grid._defaultFormats +'</Formats>' );
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br> 컬럼 숨기기/보이기
 * @param {Object} objGrid - 대상그리드
 * @param {Number} nCell - 셀필터 셀 인덱스
 * @return N/A
 * @example
 * this.toggleGridCells(this.grdMain);
 */
pWms.toggleGridCells = function(_grid)
{
	let sTitle = 'Show / Hide Columns';  // this.gfn_getWord("popup.colshwohide");
	
	let oArgs    = { pGrid: _grid   };
	let oPopOpts = { title: sTitle  };	//top, left를 지정하지 않으면 가운데정렬 //"top=20,left=370"
	let pForm = (_grid.getBindDataset()||_grid).parent;
	pForm.gfnOpenPopup('ShowHideColumns', 'common::GridColumnSelectPopup.xfdl', oArgs, function(oArgs, fClbk, sTitle) {
		// Callback
	}, oPopOpts);
};

/*******************************************************************************************************************************
 * Grid Resize
 *******************************************************************************************************************************/
/**
 * Grid Resize Initialize
 */
pWms.Grid_Resize_Init = function(grid, form) {
	
	grid.set_cellsizingtype('both');
	grid.set_autosizingtype('row');
	grid.set_extendsizetype('row');
	grid.setCellProperty   ('body', 0, 'autosizerow', 'limitmax');
	
	grid.addEventHandler('oncolresized', wms.Grid_Resize_OnColResized, form);  // 최소사이즈 체크 후, 기본값 또는 이전 사이즈로 변경 이벤트 추가
	grid.addEventHandler('onrowresized', wms.Grid_Resize_OnRowResized, form);  // 최소사이즈 체크 후, 기본값 또는 이전 사이즈로 변경 이벤트 추가
};

/**
 * Grid Cell Resize
 */
pWms.Grid_Resize_OnColResized = function(grid, e) {  // obj:nexacro.Grid, e:nexacro.GridSizeChangedEventInfo
	grid.setFormatColProperty(e.formatindex, 'size', e.newvalue);
	if ( e.newvalue < 34 ) {
		grid.setFormatColProperty(e.formatindex, 'size', e.oldvalue);
		grid.formats = '<Formats>'+ grid.getCurFormatString() +'</Formats>';
		grid.setFocus();
	}
};

/**
 * Grid Row Resize
 */
pWms.Grid_Resize_OnRowResized = function(grid, e) {  // obj:nexacro.Grid, e:nexacro.GridSizeChangedEventInfo
	// setFormatColProperty
	let minRowSize = 34, nxtRowSize = minRowSize ? minRowSize : e.newvalue;
	grid.setFormatRowProperty(e.formatindex, 'size', nxtRowSize);
	grid.setRealRowSize      (e.formatindex        , nxtRowSize);
	
};

/*******************************************************************************************************************************
 * Grid 사용자설정
 *******************************************************************************************************************************/
/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br> 그리드 원래대로 되돌리기
 * @param {Object} grid - 대상그리드
 * @return N/A
 * @example
 * this.Grid_Settings_RestoreDefault(this.grdMain);
 */
pWms.Grid_Settings_RestoreDefault = function(grid) {
	grid.set_formats('<Formats>'+ grid._defaultFormats +'</Formats>');
	
	let form = grid._getForm(), user = nexacro.getApplication().gds_UserInfo.getSelectedRowObject();
	if (user && user.userId) {
		grid._privateProfileId = grid._privateProfileId||(user.userId+','+grid._getOwnerFrame().id+","+grid.id);
		nexacro.setPrivateProfile(grid._privateProfileId, null);
		form.toast({ icon: 'success', text: 'default settings restore success.' });
	}
};

/**
 * @class 그리드 우클릭 POPUPMENU 내부함수<br> 그리드 사용자설정 저장
 * @param {Object} grid - 대상그리드
 * @return N/A
 * @example
 * this.Grid_Settings_SavePersnal(this.grdMain);
 */
 //todo
pWms.Grid_Settings_SavePersnal = function(grid) {
	let form = grid._getForm(), user = nexacro.getApplication().gds_UserInfo.getSelectedRowObject();
	if (user && user.userId) {
		grid._privateProfileId = grid._privateProfileId||(user.userId+','+grid._getOwnerFrame().id+","+grid.id);
		nexacro.setPrivateProfile(grid._privateProfileId, grid.getCurFormatString());
		form.toast({ icon: 'success', text: 'personal settings save success.' });
	}
};

/*******************************************************************************************************************************
 * Grid Paging - Scroll
 *******************************************************************************************************************************/
pWms.Grid_PagingScroll_Init = function(_grid, _form) {

	_grid.paging = _grid._functions.paging = Object.assign({}, {
		page: 1,
		ds  : _grid.getBindDataset(),
		dsnm: _grid.getBindDataset().name,
		requestdataset : _grid._functions.paging.requestdataset  || _grid._functions.paging.searchdataset,
		requestfunction: _grid._functions.paging.requestfunction || _grid._functions.paging.listfunction,
	}, _grid._functions.paging);
	
	//_grid.paging.requestfunction   = _form[_grid.paging.requestfunction];
	_grid.paging.getRequestDataset = function() {
		let dsReqt = _form[_grid.paging.requestdataset];
		if (!dsReqt) {
			trace('['+ _grid.paging.requestdataset +'] Grid is scroll paging not activate. please check scroll requestdataset');
		}
		return _form[_grid.paging.requestdataset];
	};
	
	if (!_form[_grid.paging.requestfunction]) {
		trace('['+ _grid.name +'] Grid is scroll paging not activate. please check scroll requestfunction');
		return;
	}
	
	_grid.pageretrieve = function(bnext=false) {
		let grid = this, paging = this.paging;
		if (bnext == false) {
			paging.page  =  1;
			paging.total = -1;
			paging.ds.clearData();
		}
		if (paging.count >= paging.total) {
			paging.bNext = false;
			return;
		}
		
		_form[_grid.paging.requestfunction](paging.page+1);
	};
	
	_grid.prePaging = _grid.preScrollPaging = function() {
		let grid = this, paging = this.paging, dsList = grid.getBindDataset();
		let dsListNm = dsList.name, dsListPNm = paging.dsnm+'P', dsListINm = paging.dsnm+'I';
		
		if (!_form[dsListNm ]) { _form.addChild(dsListNm , new Dataset(dsListNm , _form)); }
		if (!_form[dsListPNm]) { _form.addChild(dsListPNm, new Dataset(dsListPNm, _form)); }
		if (!_form[dsListINm]) { _form.addChild(dsListINm, new Dataset(dsListINm, _form)); }
		
		let dsReqt = _form[paging.requestdataset||paging.searchdataset], sidx = dsReqt.getRowCount()-1; if (sidx<0) { sidx = dsReqt.addRow(); }  // 검색조건 : Dataset 정보
		
		let sReqtPage = 'page', iReqtPage = dsReqt.getColIndex(sReqtPage);  // Column page 없으면 생성
		if (iReqtPage<0) { dsReqt.addColumn(sReqtPage, 'int', 255); }
		dsReqt.setColumn(sidx, 'page', paging.page);
		
		let sReqtSize = 'size', iReqtSize = dsReqt.getColIndex(sReqtSize);  // Column size 없으면 생성
		if (iReqtSize<0) { dsReqt.addColumn(sReqtSize, 'int', 255); }
		dsReqt.setColumn(sidx, 'size', paging.size);
		
		if (dsList && paging.page==1) {
			grid.setBindDataset(dsList);
			dsList.clearData();
		}
	};
	
	_grid.postPaging = _grid.postScrollPaging = function() {
		wms.eventOff(this);
		
		let grid = this, paging = this.paging, dsList = grid.getBindDataset();
		let dsListNm = dsList.name, dsListPNm = paging.dsnm+'P', dsListINm = paging.dsnm+'I';
		if (paging.page > 1) { dsList.appendData(_form[dsListPNm], true, true); }  // 조회 데이터 처리
		
		try { paging.total = _form[dsListINm  ].getColumn(0, 'total'); } catch(err) { trace('info > total not found'); }
		try { paging.count = _form[dsList.name].getRowCount();         } catch(err) { trace('info > count not found'); }
		
		if ('multirow' == _grid.selecttype) { _grid.syncCheckAll(); }
		wms.eventOn(this);
	};
	
	_grid._eventVscroll = [ 'last', 'tracklast', 'wheellast', 'selectlast' ];
	_grid.addEventHandler('onvscroll', function(obj, e) {  // obj:Grid, e:nexacro.ScrollEventInfo
		if (obj._eventVscroll.includes(e.type)) {
			//wms.eventForceOff(obj);
			obj.pageretrieve(true);  // trace('event includes [e.type:'+ e.type +']');
			//wms.eventForceOn(obj);
		}
	}, _form);
	
	// requesturl 이 있으면 request() Method 생성
	if (_grid.paging && _grid.paging.requesturl) {
		_grid.request = function(callback) {
			let grid = this, paging = grid.paging, dsReqt = paging.getRequestDataset(), dsList = grid.getBindDataset()
			let dsListNm = dsList.name, dsListPNm = dsListNm+'P', dsListINm = dsListNm+'I';
			
			// 필수 : 페이징 전처리
			grid.preScrollPaging();
			_form.gfnTransaction(
				grid.name+'Paging',
				paging.requesturl,
				'input='+ dsReqt.name,
				paging.dsnm + (paging.page > 1 ? 'P' : '') +'=list '+ dsListINm +'=info',
				null,
				function(id, no, mesg) {  // paging callback
					grid.postScrollPaging();  // 필수 : 페이징 후 처리
					if ('function' == typeof callback && callback instanceof Function) {
						callback(paging, id, no, mesg); // callback(paging);  //this.lookupFunc(clbkFnNm).call(id, no, mesg, result);
					} else
					if ('string' === typeof callback && _form[callback] instanceof Function) {
						_form.lookupFunc(callback).call(paging, id, no, mesg);
					}
				}   // paging callback
			);
		};
	}
};

/**
 * Grid 의 컬럼정보를 리턴한다.
 */
pGrid.getCellsInfo = function(props, bIgnoreNull=false) {
	props = props||[ 'id', 'title' ];
	
	let _getProp = function(_grid, _cidx, _prop) {
		let val = null;
		if (!_grid || !_prop || _cidx < 0) { return val; }
		
		switch (_prop) {
			case 'title': val = _grid.getCellProperty('head', _cidx, 'text')                            ; break;
			case 'id'   : val = _grid.getCellProperty('body', _cidx, 'text').replace(/bind:|expr:/g, ''); break;
			default     : val = _grid.getCellProperty('body', _cidx, _prop )                            ; break;
		}   // switch (prop)
		
		return val;
	};
	
	let grid = this, gridCellCunt = grid.getCellCount('head'), aCells=[];
	for (let i=0; i < gridCellCunt; i++) {
		let aCell = {};
		
		if (Array.isArray(props)) {
			for (let prop of props) {
				aCell[prop] = _getProp(grid, i, prop);
				if (bIgnoreNull && !aCell[prop]) { delete aCell[prop]; }
			}   // for (let prop of props)
		} else {
			if (props) {
				let prop = props;
				aCell = _getProp(grid, i, prop);
			}   // if (props)
		}
		
		aCells.push( aCell );
	}   // for (let i=0; i < gridCellCunt; i++)
	
	return aCells;
};

/*******************************************************************************************************************************
 * Grid Cell 여부확인
 *******************************************************************************************************************************/
/*
 * @class  그리드 필터 Cell 여부확인
 * @param {Evnet}  e	- 헤드클릭이벤트
 */
pGrid.isFilterCell = function(e) {
	let grid = this, form = grid._getForm(), area = e.row < 0 ? 'head' : 'body';
	if ('head' !== area) { return false; }
	
	let cellCssclass = grid.getCellProperty('head', e.cell, 'cssclass'); // 필터 Cell이면 정렬 처리안함.
	return !cellCssclass ? false : cellCssclass.indexOf('filter') > -1;
};

/*
 * @class  그리드 체크박스 Cell 여부확인
 * @param {Object} grid - 대상그리드
 * @param {Evnet}  e	- 헤드클릭이벤트
 * @param {Evnet}  e	- 헤드클릭이벤트
 */
pGrid.isCheckboxCell = function(e, cellid='chk') {
	let grid = this, form = grid._getForm(), area = e.row < 0 ? 'head' : 'body';
	let isCheckboxDisplaytype = 'checkboxcontrol' === (grid.getCellProperty(area, e.cell, 'displaytype')||'');
	let isCheckboxEdittype    = 'checkbox'        === (grid.getCellProperty(area, e.cell, 'edittype'   )||'');
	let isCheckboxCell        =  cellid           === (grid.getCellProperty(area, e.cell, 'text'       )||'').replace(/bind:|expr:/g, '');  // e.col
	return isCheckboxDisplaytype && isCheckboxEdittype && isCheckboxCell;
};

/*******************************************************************************************************************************
 * Grid Checkbox Cell Function
 *******************************************************************************************************************************/
// Grid Checkbox All
pForm.gfnIsGridCheckAll = function(grid, chkColNm='chk') {
	return grid.isCheckAll(chkColNm);
};

/**
 * 전체 체크박스 체크처리
 * let [chkTrueVal, chkFalseVal] = grid.getCheckValues('body');  // grid.getCheckValues('body', 'chk');
 */
pGrid.getCheckValues = function(area, chkcolnm) {
	let grid = this; chkcolnm = chkcolnm||grid.checkcolumn||'chk'; let chkcolix = grid.getBindCellIndex('body', chkcolnm);
	return [
		grid.getCellProperty(area||'body', chkcolix, 'checkboxtruevalue' )||'1',  // truevalue :
		grid.getCellProperty(area||'body', chkcolix, 'checkboxfalsevalue')||'0',  // falsevalue:
	];
};

/**
 * 전체 체크박스 체크처리
 */
pGrid.checkAll = function(chkColNm='chk') {
	wms.eventOff(this);
	
	let grid = this, ds = grid.getBindDataset(), chkIdx = grid.getBindCellIndex('body', chkColNm);
	let [trueValue, falseValue] = grid.getCheckValues('body');  // grid.getCheckValues('body', 'chk');
	let chkCurVal = grid.getCellPropertyValue(-1, chkIdx, 'text')||falseValue, chkNxtVal = chkCurVal == trueValue ? falseValue : trueValue;
	for (let i=0; i<ds.getRowCount(); i++) {
		if ('checkbox' != grid.getCellPropertyValue(i, chkIdx, 'edittype')) { continue; }  // grid
		ds.setColumn(i, chkColNm, chkCurVal);
	}
	//grid.setCellProperty('head', chkIdx, 'text', chkCurVal);
	
	wms.eventOn(this);
};

/**
 * 전체 체크박스 체크여부
 */
pGrid.isCheckAll = function(chkColNm='chk') {
	let form=this._getForm(), grid=this, ds=grid.getBindDataset(), isChkAll=true, chkIdx=grid.getBindCellIndex('body', chkColNm);
	let [trueValue, falseValue] = grid.getCheckValues('body');  // grid.getCheckValues('body', 'chk');
	if (!ds || ds.getRowCount()<1) {
		return false;
	}
	
	wms.eventOff(this);
	for (let i=0; i<ds.getRowCount(); i++) {
		if ('checkbox' != grid.getCellPropertyValue(i, chkIdx, 'edittype')) { continue; }  // grid
		
		isChkAll = isChkAll && trueValue == ds.getColumn(i, chkColNm);
		if (!isChkAll) { break; }
	}
	wms.eventOn(this);
	
	return isChkAll;
};

/**
 * 전체 체크박스 동기화
 */
pGrid.syncCheckAll = function(chkColNm='chk') {
	let form=this._getForm(), grid=this, isChkAll=grid.isCheckAll(chkColNm), chkIdx=grid.getBindCellIndex('body', chkColNm);
	let [trueValue, falseValue] = grid.getCheckValues('body');  // grid.getCheckValues('body', 'chk');
	let chkHcurVal = grid.getCellPropertyValue(-1, chkIdx, 'text');
	
	wms.eventOff(grid);
	if (chkHcurVal != isChkAll) { grid.setCellProperty('head', chkIdx, 'text', isChkAll ? trueValue : falseValue); }
	wms.eventOn(grid);
	
	return isChkAll;
};

/**
 * @description 그리드셀 클릭 이벤트
 */
pForm.Grid_Checkbox_OnHeadClick = function(obj, e) {  // obj:nexacro.Grid,e:nexacro.GridClickEventInfo
	if ( !(e.fromreferenceobject instanceof nexacro._GridCheckboxControl)  ) { return; }
	if ( 'checkbox' != obj.getCellPropertyValue(e.row, e.cell, 'edittype') ) { return; }
	trace('pForm.Grid_Checkbox_OnHeadClick()');
	
	let form = obj._getForm(), grid = obj, area = 'head', ds = grid.getBindDataset(), dsCunt = ds.getRowCount();
	let chkCol = grid.checkcolumn||'chk', chkIdx = grid.getBindCellIndex('body', chkCol);
	
	if (e.row == -1 && e.cell === chkIdx && dsCunt>0) {
		let chkHeadVal = grid.getCellPropertyValue(e.row, e.cell, 'text');
		for (let i=0; i<dsCunt; i++) {
			if ('checkbox' != grid.getCellPropertyValue(i, chkIdx, 'edittype')) { continue; }  // grid
			ds.setColumn(i, chkCol, chkHeadVal);
		}
	}
	grid.syncCheckAll(chkCol);
};

/**
 * @description 그리드셀 클릭 이벤트
 */
pForm.Grid_Checkbox_OnCellClick = function(obj, e) {  // obj:nexacro.Grid,e:nexacro.GridClickEventInfo
	if ( !(e.fromreferenceobject instanceof nexacro._GridCheckboxControl)  ) { return; }
	if ( 'checkbox' != obj.getCellPropertyValue(e.row, e.cell, 'edittype') ) { return; }
	trace('pForm.Grid_Checkbox_OnCellClick()');
	
	let form = obj._getForm(), grid = obj, area = 'body';
	let chkCol = grid.checkcolumn||'chk', chkIdx = grid.getBindCellIndex('body', chkCol);
	
	if (e.cell === chkIdx) {  }
	grid.syncCheckAll(chkCol);
};

/*******************************************************************************************************************************
 * Grid Cell Tooltip Function
 *******************************************************************************************************************************/
/**
 * Grid Cell 데이터 tooltip 표시
 * grid.addEventHandler('onmousemove', this.Grid_Tooltip_Show, form);
 */
pGrid.Grid_Tooltip_Show = function(obj, e) {  // obj:Grid, e:nexacro.GridMouseEventInfo
	let grid = obj, form = grid._getForm();
	if (e.row < 0                    ) { return; }  // Head는 미표시  - head row 수 : grid.head._bandctrl._rowsizesperdatarow.length;
	if (grid.isFilterCell  (e       )) { return; }  // 필터 Cell 이면 정렬처리 제외
	if (grid.isCheckboxCell(e, 'chk')) { return; }  // 체크박스인 경우
	
	let colId = (grid.getCellProperty('body', e.col, 'text')||'').replace(/bind:|expr:/g, ''), excludeCols=[ 'chk', 'currow+1' ];
	if (!colId || excludeCols.includes(colId)) { return; }
	
	let iCellWidth   = grid.getFormatColSize(e.cell);
	let sCellText    = grid.getCellText(e.row, e.cell);
	let oCellTextLen = nexacro.getTextSize(sCellText, 'normal normal 12px NanumGothic');  // 개선 : 스타일 읽기
	//obj.setCellProperty('body', e.cell, 'tooltiptext', iCellWidth < oCellTextLen.nx ? sCellText : '');
	grid.setCellProperty('body', e.cell, 'tooltiptext', sCellText);
};

/*******************************************************************************************************************************
 * Grid Clipboard(Copy & Paste) Function
 *******************************************************************************************************************************/
// WMS_Clipboard.js

/*******************************************************************************************************************************
 * Grid Enter Focus Move Function
 *******************************************************************************************************************************/
pGrid.Grid_EnterFocus_Move = function(obj, e) {
	let form = obj._getForm(), grid = obj;  // , edittype = grid.getCellProperty('body', e.cell, 'edittype');
	// if (e.row < 0 || ['normal', 'none'].includes(edittype)) { return; }
	if (obj instanceof nexacro.Grid && e.keycode == nexacro.Event.KEY_ENTER) {
		if (e.shiftkey) {
			grid.moveToPrevCell();
		} else {
			grid.moveToNextCell();
		}
	}
};

pWms  = null; delete pWms ;
pGrid = null; delete pGrid;
pForm = null; delete pForm;
