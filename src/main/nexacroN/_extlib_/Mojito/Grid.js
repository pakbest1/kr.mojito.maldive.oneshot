var pGrid = nexacro.Grid.prototype;

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
	
	fzBkClrCell: '#48399A',
};


pGrid.initFunctions = function(form) {
	this.form=this._conf.form=form;
	
	this.initContext();  // 컨텍스트메뉴
};

// 컨텍스트메뉴
pGrid.initContext = function() {
	let _conf=this._conf, _grid=this, _gridId=_grid.id, _form=_conf.form;
	let langCd = nexacro.getApplication().langCode;
	
	if (!_conf.cntxDs) {
		_conf.cntxDs = new Dataset(_gridId+'CntxDs');
		_conf.cntxDs.assign(nexacro.getApplication().gdsGridContext);
	}
	if (!_conf.cntxMenu) {
		_conf.cntxMenu = new PopupMenu(_gridId+'CntxMenu', 0, 0, 68, 65);
		_form.addChild(_conf.cntxMenu.name, _conf.cntxMenu);
		_conf.cntxMenu.grid = _grid;
		
        _conf.cntxMenu.set_innerdataset (_conf.cntxDs);
		_conf.cntxMenu.set_idcolumn     ('id'        );
		_conf.cntxMenu.set_levelcolumn  ('level'     );
		_conf.cntxMenu.set_iconcolumn   ('icon'      );
		_conf.cntxMenu.set_enablecolumn ('enable'    );
		_conf.cntxMenu.set_captioncolumn('caption'   );
		//_conf.cntxMenu.set_cssclass     ('pm_basic01');
		
// 		if (nexacro.getApplication().langCode == "ko")
// 			pmnu.set_captioncolumn("caption_ko");
// 		else if (nexacro.getApplication().langCode == "en")
// 			pmnu.set_captioncolumn("caption_en");
		//_conf.cntxMenu.set_captioncolumn( langCd == 'ko' ? 'caption_ko' : 'caption' );
		
		_conf.cntxMenu.addEventHandler('onmenuclick', this.clickContext, this);
		_conf.cntxMenu.show();
	}
	
	_grid.addEventHandler('onrbuttondown', _grid.showContext, _form);
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
		_grid.setCellProperty('head', i, 'background', i >= 0 && i < nMaxCol ?_conf.fzBkClrCell : '');
	}
	
	_grid.set_enableredraw(true);
};
pGrid.freezePanseRow = function(nRow) {
	let o_conf=this._conf, oGrid=this, oForm=oGrid.form;
	if (nRow < 0) return;  // 선택된 Row가 없을 경우 리턴
	
	// TODO : 현행화 해야함.
	//그래픽스로 라인그리기 - setFixedRow보다 먼저 수행되야 제대로 수행됨.
	var nBorder = 2;
	//임시로 2px씩 떨어뜨려줌..
	var objGraphics;
	//행고정시 라인 object
	var nLeft = nexacro.toNumber(nexacro.toNumber(oGrid.left));  // nexacro.toNumber(
	var nWidth = oGrid.width == null ? null : oGrid.width - (2 * nBorder);
	var nHeight = nBorder;
	var nRight = nexacro.toNumber(nexacro.toNumber(oGrid.right)) + (oGrid.vscrollbar.width);
	var nBottom = oGrid.bottom;

	var nTop = oGrid.getOffsetTop() + oGrid.getRealRowFullSize('head') + (oGrid.getFormatRowSize(1) * (nRow + 1));

	//스크롤 한다음에 고정했을 때, top위치를 그마만큼 올려주기.
	if (nexacro.toNumber(oGrid.vscrollbar.pos, 0) > 0) {
		nTop = nTop - parseInt(oGrid.vscrollbar.pos / oGrid.getFormatRowSize(1)) * oGrid.getFormatRowSize(1)
	}

	objGraphics = new Graphics('rowFixLine',nLeft,nTop,nWidth,nHeight,nRight,null);
	// Add Object to Parent Form
	this.addChild("rowFixLine", objGraphics);
	// Show Object
	objGraphics.set_background("#48399A");
	objGraphics.show();

	//선택된 Row로 행 고정
	objGrid.setFixedRow(nRow);
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
	
	var _FzLnRow = _form.components[_grid.id + _conf.fzLnNmRow];  // 라인초기화
	if (_FzLnRow) {
		_FzLnRow.destroy();
		_FzLnRow = null;
	}
	_grid.setFixedRow(-1);  // 행고정 초기화
	
	_grid.set_enableredraw(true);
};



pGrid = null; delete pGrid;