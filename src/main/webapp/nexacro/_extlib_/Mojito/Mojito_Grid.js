/************************************************************************
 * Nexacro Grid
 ************************************************************************/
var pGrid = nexacro.Grid.prototype;

// Grid Event 발생여부
pGrid.eventToggle = function(bOn=false) {
	this.set_enableevent ( bOn );
	this.set_enableredraw( bOn );
	
	let dataset = this.getBindDataset();
	if (!dataset) { return; }
	dataset.set_enableevent  ( bOn );
	dataset.set_updatecontrol( bOn );
}

// 환경설정
pGrid.form  = null;
pGrid._conf = {
	form       : null,
	
	cntxMenu   : null,
	cntxDs     : null,
	
	// 틀고정 환경설정
	fzLnBorder : 2,
	fzLnNmCell : '_FzLnCell',
	fzLnNmRow  : '_FzLnRow' ,
	
	fzLnBkClr  : '#48399A'  ,
};


pGrid.initComponent = pGrid.initGridComponent = function(grid) {
	grid = grid ? grid : this;
	this.form = this._getForm();
	// this.form=this._conf.form=form;
	
	this.initGridResize();
	
	this.initGridContext();  // 컨텍스트메뉴
};

pGrid.initGridResize = function() {
	this.set_cellsizingtype('both');
	this.set_autosizingtype('row' );
	this.set_extendsizetype('row' );
	
};

// 컨텍스트메뉴
pGrid.initGridContext = function() {
	let conf=this._conf, grid=this, form=grid._getForm();
	let langCd = nexacro.getApplication().langCode;
	
	if (!conf.cntxDs) {
		conf.cntxDs = new Dataset(grid.name+'CntxDs');
		conf.cntxDs.assign(nexacro.getApplication().gdsGridContext);
	}
	if (!conf.cntxMenu) {
		conf.cntxMenu = new PopupMenu(grid.name+'CntxMenu', 0, 0, 68, 65);
		form.addChild(conf.cntxMenu.name, conf.cntxMenu);
		conf.cntxMenu.grid = grid;
		
        conf.cntxMenu.set_innerdataset (conf.cntxDs );
		conf.cntxMenu.set_idcolumn     ('id'        );
		conf.cntxMenu.set_levelcolumn  ('level'     );
		conf.cntxMenu.set_iconcolumn   ('icon'      );
		conf.cntxMenu.set_enablecolumn ('enable'    );
		conf.cntxMenu.set_captioncolumn('caption'   );
		//conf.cntxMenu.set_cssclass     ('pm_basic01');
		
// 		if (nexacro.getApplication().langCode == "ko")
// 			pmnu.set_captioncolumn("caption_ko");
// 		else if (nexacro.getApplication().langCode == "en")
// 			pmnu.set_captioncolumn("caption_en");
		//_conf.cntxMenu.set_captioncolumn( langCd == 'ko' ? 'caption_ko' : 'caption' );
		
		conf.cntxMenu.addEventHandler('onmenuclick', this.clickContext, this);
		conf.cntxMenu.show();
	}
	
	grid.addEventHandler('onrbuttondown', grid.showContext, form);
};
pGrid.showContext = function(obj, e) {
	let _conf=obj._conf, _cntxDs=_conf.cntxDs,_cntxMenu=_conf.cntxMenu;
	_cntxMenu.grid    = obj;
	_cntxMenu.rowIdx  = e.row;
	_cntxMenu.cellIdx = e.cell;
	_cntxMenu.headCellIndex = e.cell;
	
	_cntxDs.filter( 'bandtype=='+ e.row < 0 ? '"head"': '"body"' );
	_cntxMenu.trackPopupByComponent(obj, e.canvasx, e.canvasy);
};
pGrid.clickContext = function(obj, e) {  // obj:PopupMenu, e:MenuClickEventInfo
	var eId=e.id, eGrid=obj.grid, eRowIdx=obj.rowIdx, eCellIdx=obj.cellIdx;
	
	switch (eId) {
	
		case 'FreezzePanse' :
			eGrid.freezePanse(eRowIdx, eCellIdx);
			break;
		
	}
};

pGrid.hideContext = function(obj, e) {
	
};

// 틀고정
pGrid.initFreezePanse = function() {
	
};
pGrid.freezePanse = function(nRow, nCell) {
	this.freePanse();
	this.freezePanseCell(nCell);
	this.freezePanseRow (nRow );
};
pGrid.freezePanseCell = function(nCell) {
	let _conf=this._conf, _grid=this, _form=_conf.form;
	_grid.set_enableredraw(false);

	var nCol     = _grid.getCellProperty('Head', nCell, 'col');
	var nColSpan = _grid.getCellProperty('Head', nCell, 'colspan');
	var nMaxCol  = 0;
	if (nMaxCol < (nCol + nColSpan)) { nMaxCol =  nCol + nColSpan;}

	_grid.setFormatColProperty(nMaxCol-1, 'band', 'left');
	_grid.fixCol = nMaxCol;
	var iCellCunt=_grid.getCellCount('head');
	for (var i=0; i<iCellCunt; i++) {
		_grid.setCellProperty('head', i, 'background', i >= 0 && i < nMaxCol ?_conf.fzLnBkClr : '');
	}
	
	_grid.set_enableredraw(true);
};
pGrid.freezePanseRow = function(nRow) {
	let _conf=this._conf, _grid=this, _form=_conf.form;
	if (nRow < 0) return;  // 선택된 Row가 없을 경우 리턴
	
	// TODO : 현행화 해야함.
	//그래픽스로 라인그리기 - setFixedRow보다 먼저 수행되야 제대로 수행됨.
	var nBorder = _conf.fzLnBorder;
	//임시로 2px씩 떨어뜨려줌..
	
	//행고정시 라인 object
	var nLeft = nexacro.toNumber(nexacro.toNumber(_grid.left));  // nexacro.toNumber(
	var nWidth = _grid.width == null ? null : _grid.width - (2 * nBorder);
	var nHeight = nBorder;
	var nRight = nexacro.toNumber(nexacro.toNumber(_grid.right)) + (_grid.vscrollbar.width);
	var nBottom = _grid.bottom;

	var nTop = _grid.getOffsetTop() + _grid.getRealRowFullSize('head') + (_grid.getFormatRowSize(1) * (nRow + 1));

	//스크롤 한다음에 고정했을 때, top위치를 그마만큼 올려주기.
	if (nexacro.toNumber(_grid.vscrollbar.pos, 0) > 0) {
		nTop = nTop - parseInt(_grid.vscrollbar.pos / _grid.getFormatRowSize(1)) * _grid.getFormatRowSize(1)
	}

	let _fzlnRowId=_grid.id+_conf.fzLnNmRow, _fzlnRow = new Graphics(_fzlnRowId,nLeft,nTop,nWidth,nHeight,nRight,null);
	_form.addChild(_fzlnRowId, _fzlnRow);  // Add Object to Parent Form
	_fzlnRow.set_background(_conf.fzLnBkClr);
	_fzlnRow.show();  // Show Object

	//선택된 Row로 행 고정
	_grid.setFixedRow(nRow);
};

pGrid.freePanse = function() {
	this.freePanseCell();
	this.freePanseRow ();
};
pGrid.freePanseCell = function() {
	let _conf=this._conf, _grid=this, _form=_conf.form;
	_grid.set_enableredraw(false);
	
	var iCellCunt=_grid.getCellCount('head');
	_grid.setFormatColProperty(0          , 'band', 'body');
	_grid.setFormatColProperty(iCellCunt-1, 'band', 'body');
	for (var i = 0; i < iCellCunt; i++) {
		_grid.setCellProperty('head'      , i, 'background', '');
	}
	
	_grid.set_enableredraw(true);
};

pGrid.freePanseRow = function() {
	let _conf=this._conf, _grid=this, _form=_conf.form;
	_grid.set_enableredraw(false);
	
	var _fzlnRow = _form.components[_grid.id + _conf.fzLnNmRow];  // 라인초기화
	if (_fzlnRow) {
		_fzlnRow.destroy();
		_fzlnRow = null;
	}
	_grid.setFixedRow(-1);  // 행고정 초기화
	
	_grid.set_enableredraw(true);
};


/**
 * Checkbox Cell 여부
 */
pGrid.isCheckboxCell = function(e, colId='chk') {
	let grid = this, area = e.row < 0 ? 'head' : 'body';
	let isCheckboxDisplaytype = 'checkboxcontrol' === grid.getCellProperty(area, e.cell, 'displaytype');
	let isCheckboxEdittype    = 'checkbox'        === grid.getCellProperty(area, e.cell, 'edittype'   );
	let isCheckboxCol         =  colId            === grid.getCellProperty(area, e.cell, 'text'       ).replace(/bind:|expr:/g, '');
	return isCheckboxDisplaytype && isCheckboxEdittype && isCheckboxCol;
};









/**
 * Grid Row Height Override
 */
pGrid._getMaxSubRowSize = function(_a, _b, _c, _d, _e) {
	var _f = this._curFormat;
	var _g;
	if (_a == -2) {
		if (!_c) {
			_c = this._curFormat._summcells;
		}
		_g = _f._summrows;
	} else if (_a == -1) {
		if (!_c) {
			_c = this._curFormat._headcells;
		}
		_g = _f._headrows;
	} else {
		if (!_c) {
			_c = this._curFormat._bodycells;
		}
		_g = _f._bodyrows;
	}
	if (!this._autoSizeRowProc && this.autosizingtype != "row" && this.autosizingtype != "both") {
		return _g[_b].size;
	}
	var _h = 0;
	var _i = _c.length;
	var _j, _k, _l;
	for (var _w = 0; _w < _i; _w++) {
		_j = _c[_w]._row;
		_k = _c[_w]._rowspan;
		_l = _c[_w]._subcells;
		if (_j == _b || (_l.length > 0 && _j <= _b && (_j + _k) > _b)) {
			var _m = 0;
			if (_l.length > 0) {
				_m = this._getMaxSubRowSize(_a, _b - _j, _l, _j, _c[_w]);
				_h = Math.max(_h, _m);
			} else {
				if (!_d) {
					_d = 0;
				}
				var _n = _c[_w]._getAttrValue(_c[_w].autosizerow, _a);
				var _o = _g[_b + _d].size;
				var _p;
				if (_n == "none") {
					_p = _o;
				} else {
					var _q = _c[_w]._getDisplayTypeValue(_a);
					if (_q == "checkboxcontrol") {
						var _r = _c[_w]._getCheckboxsize(_a);
						if (_r == undefined) {
							_r = this._getCellStyleInfo(_c[_w]._cellidx, "checkboxsize", _a, false, _e, true);
							_r = _r[1];
						}
						_p = _r + 6;
					} else if (_q == "radioitemcontrol") {
						var _r = _c[_w]._getRadioitemsize(_a);
						if (_r == undefined) {
							_r = this._getCellStyleInfo(_c[_w]._cellidx, "radioitemsize", _a, false, _e, true);
							_r = _r[1];
						}
						_p = _r + 6;
					} else {
						var _s = _c[_w]._getVirtualMergeInfo(_a + 2) ? "" : _c[_w]._getDisplayText(_a);
						var _t = this._getCellRowTextSize(_c[_w], _a, _s, _e);
						_p = _t[1];
						var _u = _c[_w]._curpadding
						  , _v = _c[_w]._curborder;
						if (_u === "bindexpr" || _u === undefined) {
							_u = this._getCellStyleInfo(_w, "padding", _a, undefined, _e, true);
						}
						if (_v === "bindexpr" || _v === undefined) {
							_v = this._getCellStyleInfo(_w, "border", _a, undefined, _e, true);
						}
						if (_u) {
							_u = nexacro.PaddingObject(_u);
							_p += _u.top + _u.bottom;
						}
						if (_v) {
							_v = new nexacro.BorderObject(_v);
							_p += _v.bottom._width;
						}
					}
					_p += this._getDisplaytypeControlSize(false, _q, _c[_w], _e, _a);
					if (_n == "limitmin") {
						if (_p < _o) {
							_p = _o;
						}
					} else if (_n == "limitmax") {
						if (_p > _o) {
							_p = _o;
						}
					}
				}
				_h = Math.max(_h, _p, _o);
			}
		}
	}
	return _h;
};
	
pGrid = null; delete pGrid;