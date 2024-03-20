/**
 *  SVC-WMS Grid Excel Library
 *  @FileName 	  WMS_MultiCombo.js
 *  @Creator 	  SVC-WMS
 *  @CreateDate   2023/11/30
 *  @Desction
 ************** 소스 수정 이력 ***********************************************
 *  date        Modifier         Description
 *******************************************************************************
 * 2023/11/30   SVC-WMS          Grid Excel Library
 *******************************************************************************
ex)
this.exportXlsx(this.gridUser, 'WMS_User');
this.importXlsx({
	data: [{
		grid       : this.grdXlsx,
		dataset    : this.grdXlsx.getBindDataset(),  //
		columns    : [  // Import Define Columns
			'histNo', 'histDt', 'histTypeCd', 'svcPart', 'svcWrkr', 'svcQty', 'totlCbm', 'fromLoc', 'toLoc', 'orglFromLoc', 'orglToLoc',
			'recvTypeCd', 'recvNo', 'recvAnsNo', 'recvPoNo', 'recvOrderNo', 'recvLoadNo', 'shppDo', 'shppLoadNo', 'taskId', 'srceTypeCd',
		],
		datarowtype: 'I',
		
// 		command    : 'Body=Inventory Transaction List!A3:U;',  // ??  // Import Define #01
		sheetname  : 'Inventory Transaction List',  //'Inventory Transaction List',  // Import Define #02
		body       : 'A2:U' ,
	}],
	success: function(data) {  // Import Success Callback
		trace('Excel Import Success Callback');
		
		for (let i in data) {
			let ds = data[i].dataset;
			
		}
		
	},
	error: function(e) {  // Import Error Callback
		trace('Excel Import Error Callback');
		
	},
});
 */
var pForm = nexacro.Form.prototype;
var pGrid = nexacro.Grid.prototype;  // Nexcro Core Grid Override

/*******************************************************************************************************************************
 * Grid + Excel Config 
 *******************************************************************************************************************************/
pForm._xlsxurl   = '/XExportImport.do';  //pForm.importurl  = '/XImport.do';

/*******************************************************************************************************************************
 * Grid + Excel Export 
 *******************************************************************************************************************************/
pForm.exportXlsx = function(obj, filename, sheetname) {
	let grid = null, target = null;
	if (obj && 'object' == typeof obj && !(obj instanceof nexacro.Grid) && !sheetname && !filename) {
		filename  = obj.filename ;
		grid      = obj.grid     ;
		sheetname = obj.sheetname;
		target    = obj.target   ;
		
		if (!target && grid && sheetname) {  // n개의 Grid Export 실행
			target = [{ grid: grid, sheetname: sheetname }];
		}
	} else {
		grid      = obj;
		target    = [{ grid: grid, sheetname: sheetname }];  // n개의 Grid Export 실행
	}
	
	filename  = filename ? filename  : 'ExcelExport.xlsx';
	
	let regExp = /[?*:\/\[\]]/g;  // (엑셀에서 지원하지않는 모든 문자)
	filename  = filename ? filename .replace(regExp, '') : 'ExcelExport';	// 파일명에 특수문자 제거
	filename  = filename +'_'+ this.gfnGetTodayDttm();
	
	let sExpt = 'xexpt00', oExpt = new ExcelExportObject('xexpt00', this);
	for (let i in target) {
		let el = target[i], tgrid = el.grid;
		
		el.selecttype = el.grid.selecttype;
		el.grid.set_selecttype('row');
		
		el.sheetname  = el.sheetname ? el.sheetname.replace(regExp, '') : ('Sheet'+(i+1));  // 시트명에 특수문자 제거
		el.sheetname  = el.sheetname && el.sheetname.length <= 30 ? el.sheetname : sheetname.substring(0, 30)||('Sheet'+(i+1));
		
		
		if (!tgrid || !(tgrid instanceof nexacro.Grid)) {
			this.toast({
				//hideAfter: false,
				icon     : 'error',
				heading  : 'Error Excel Export',
				text     : 'Error : Grid['+ i +'] not found...!',
			});
			return;
		}
		let tds = el.grid.getBindDataset();
		if (!tds || tds.getRowCount()<1) {
			this.toast({
				//hideAfter: false,
				icon     : 'error',
				heading  : 'Error Excel Export',
				text     : 'Error : Grid['+ i +'] Data not found...!',
			});
			return;
		}
		
		var ret = oExpt.addExportItem(nexacro.ExportItemTypes.GRID, el.grid, el.sheetname+'!A1');  // 'Sheet1!A1'
	}

	oExpt.addEventHandler('onerror'   , this.exportXlsxOnerror   , this);
	oExpt.addEventHandler('onsuccess' , this.exportXlsxOnsuccess , this);
	
	oExpt.set_exporttype(nexacro.ExportTypes.EXCEL2007);
	oExpt.set_exportfilename(filename||'ExcelExport');  // "ExcelExport_Sample"
	oExpt.set_exporturl(this._xlsxurl);
	oExpt.target = target;
	
// 	oExpt.set_exportuitype         ('exportprogress');
// 	oExpt.set_exporteventtype      ('itemrecord');                      // itemrecord
// 	oExpt.set_exportmessageprocess( "%d Item, %d Record / %d Total" );  // 	oExpt.set_exportmessageprocess ('%d [ %d / %d ]');
//	oExpt.set_exportmessagecomplete('Export Completed' );               // Export 가 완료되면 진행바에 표시될 텍스트를 설정하는 속성
//	oExpt.addEventHandler          ('onprogress', this.exportXlsxOnprogress, this);
	
	oExpt.exportData();
};

pForm.exportXlsxOnprogress = function(obj, e) {  // obj:ExportObject, e:nexacro.ExcelExportObject
	// obj.target.grid.set_selecttype(obj.target.selecttype);
	// obj = null;
};

pForm.exportXlsxOnerror = function(obj, e) {  // obj:ExportObject, e:nexacro.ExcelExportObject
	for (let trgt of obj.target) { trgt.grid.set_selecttype( trgt.selecttype ); }
	
	// obj = null;
	this.toast({
		hideAfter: false,
		icon     : 'error',
		heading  : 'Error Excel Export',
		text     : e.errormsg,
	});
};

pForm.exportXlsxOnsuccess = function(obj, e) {  // obj:ExportObject, e:nexacro.ExcelExportObject
	for (let trgt of obj.target) { trgt.grid.set_selecttype( trgt.selecttype ); }
	
	/*
	this.toast({
		hideAfter: false,
		icon: 'success',
		heading: 'Success Excel Export',
		text: ' Excel File : '+ obj.exportfilename + (obj.exportfilename ? '.xlsx' : ''),
	});
	*/
};


/*******************************************************************************************************************************
 * Grid + Excel Import 
 *******************************************************************************************************************************/
pForm.importXlsx = function(obj) {
	if (!obj) { trace('Excel Import Data Not Found'); return; }
	
	let grid = null, target = null, data = null, dataset = null;
	let command = null, sheetname = null, head = null, body = null, columns = null, filepasswd = null;
	if (obj && 'object' == typeof obj) {
			target    = obj           ;
			data      = obj.data      ;
			filepasswd= obj.filepasswd;
	}
	
	if (!data || data.length < 0) {
		this.toast({
			//hideAfter: false,
			icon     : 'error',
			heading  : 'Error Excel Import',
			text     : 'Grid Data not found!',
		});
		return;
	}
	
	// Import Process
	let sImpt = 'ximpt00', oImpt = new ExcelImportObject(sImpt, this);
	oImpt.set_importtype(nexacro.ImportTypes.EXCEL2007);  // EXCEL, EXCEL2007
	oImpt.target = target;
	
	oImpt.set_importurl(this._xlsxurl);
	oImpt.addEventHandler('onsuccess', this.importXlsxOnsuccess, this);
	oImpt.addEventHandler('onerror'  , this.importXlsxOnerror  , this);
	
	let aCmds = [], aOuts = [], datalength = data.length;
	for (let i in data) {
		let dataset = data[i].dataset, command = data[i].command;
		let sheetname = data[i].sheetname, head = data[i].head, body = data[i].body;
		if (!dataset) {
			this.toast({
				// hideAfter: false,
				icon     : 'error',
				heading  : 'Error Excel Import',
				text     : 'Grid Data not found!',
			});
			return;
		}
		
		if (!command && sheetname) {
			let s = 'Command=getsheetdata;Output='+ dataset.name +';';
			if (head) { s += 'Head='+ sheetname +'!'+ head +';'; }
			if (body) { s += 'Body='+ sheetname +'!'+ body +';'; }
			command = '['+ s +']';
		}
		
		aCmds.push( command );
		aOuts.push( dataset.name +'='+ dataset.name );
	}
	
	let sSheetlist = 'dsSheetList';
	if (!this[sSheetlist]) {
		this.addChild(sSheetlist, new Dataset(sSheetlist, this));
	}
	aCmds.push( '[Command=getsheetlist;Output=dsSheetList]' );
	aOuts.push( 'dsSheetList=dsSheetList' );
	
	oImpt.importData('', aCmds.join(''), aOuts.join(' '));
};

pForm.importXlsxOnerror = function(obj, e) {  // obj:ExcelImportObject, e:nexacro.ExcelImportErrorEventInfo
	let s = '['+ obj._responseLVal.toString() +'] '+ e.errormsg;
	trace('importXlsxOnerror: '+ s);
	this.toast({
		// hideAfter: false,
		icon     : 'error',
		heading  : 'Error Excel Import',
		text     : s,
	});
	
	// Error Callback
	if (obj.target.error) { obj.target.error(e); }
}

pForm.importXlsxOnsuccess = function(obj, e) {  // obj:ExcelImportObject, e:nexacro.ExcelImportEventInfo
	trace('importXlsxOnsuccess');
	if (!obj || !obj.target) { return; }
	
	let t = obj.target, datas = t.data;
	if (datas && datas.length>0) {  // colID 치환
		for (let didx in datas) {
			let data = datas[didx], grid = data.grid, dataset = data.dataset, datarowtype = data.datarowtype, columns = data.columns;
			
			wms.eventForceOff(dataset);
			
			// datarowtype 처리
			if (datarowtype) {
				let rcunt = dataset.getRowCount();
				for (let i=0; i<rcunt; i++) {
					let bSucc = dataset.setRowType(i, datarowtype);
					// trace('[i:'+ i +'][bSucc:'+ bSucc +'][rowtype:'+ dataset.getRowType(i) +']');
				}
			}
			
			// columns 처리
			if (columns) {
				for (let cidx in columns) {
					let column = columns[cidx];
					dataset.updateColID(cidx, column);
				}
			}
			
			wms.eventForceOn(dataset);
			
			// grid 데이터 바인딩 처리 
			if (grid) { grid.createFormat(); }
		}
	}
	
	if (obj.target.success) { obj.target.success( t.data ); }  // Success Callback
}




pForm.importXlsx4Grid = function(obj, command, sheetname, head, body, columns, filepasswd) {
	let grid = null, dataset = null, target = null;
	if (obj && 'object' == typeof obj && !(obj instanceof nexacro.Grid) && !command && !sheetname && !head && !body && !columns) {
			target    = obj           ;
			grid      = obj.grid      ;
			dataset   = obj.dataset  || (grid.getBindDataset?grid.getBindDataset():null);
			command   = obj.command   ;
			sheetname = obj.sheetname ;
			head      = obj.head      ;
			body      = obj.body      ;
			columns   = obj.columns   ;
			filepasswd= obj.filepasswd;
	}
	else {
		target    = Object.assign({}, {
			grid      : obj           ,
			dataset   : dataset      || (obj.getBindDataset?obj.getBindDataset():null),
			command   : command       ,
			sheetname : sheetname     ,
			head      : head          ,
			body      : body          ,
			columns   : columns       ,
			filepasswd: filepasswd    ,
		});
	}
	command   = command   ? command   : command ;
	sheetname = sheetname ? sheetname : 'Sheet1';

	if (!grid || !(grid instanceof nexacro.Grid)) {
		this.toast({
			//hideAfter: false,
			icon     : 'error',
			heading  : 'Error Excel Import',
			text     : 'Grid not found!',
		});
		return;
	}
	
	dataset = grid.getBindDataset();
	if (!dataset) {  // || ds.getRowCount()<1
		this.toast({
			//hideAfter: false,
			icon     : 'error',
			heading  : 'Error Excel Import',
			text     : 'Grid Data not found!',
		});
		return;
	}
	
	// Import Info Define
	if (!command && sheetname) {
		let sCmd = '';
		if (head) { sCmd += (sCmd.length==0 ? '' : ' ') + 'Head='+ sheetname +'!'+ head +';'; }
		if (body) { sCmd += (sCmd.length==0 ? '' : ' ') + 'Body='+ sheetname +'!'+ body +';'; }
		command = sCmd;
	}
	
	// Data Columns Define
	if (target) { target.columns = target.columns||grid.getCellsInfo('id'); }
	
	// Import Process
	let sImpt = 'ximpt00', oImpt = new ExcelImportObject(sImpt, this);
	oImpt.set_importtype(nexacro.ImportTypes.EXCEL2007);  // EXCEL, EXCEL2007
	oImpt.target = target;
	
	oImpt.set_importurl(this._xlsxurl);
	oImpt.addEventHandler('onsuccess', this.importXlsx4GridOnsuccess, this);
	oImpt.addEventHandler('onerror'  , this.importXlsx4GridOnerror  , this);
	
	oImpt.importData('', command, dataset.name);
};


pForm.importXlsx4GridOnerror = function(obj, e) {  // obj:ExcelImportObject, e:nexacro.ExcelImportErrorEventInfo
	trace('importXlsx4GridOnerror');
	this.toast({
		hideAfter: false,
		icon     : 'error',
		heading  : 'Error Excel Import',
		text     : '['+ obj._responseLVal[0] +'] '+ e.errormsg,
	});
	
	// Error Callback
	if (obj.target.error) { obj.target.error(obj.target.dataset); }
}

pForm.importXlsx4GridOnsuccess = function(obj, e) {  // obj:ExcelImportObject, e:nexacro.ExcelImportEventInfo
	trace('importXlsx4GridOnsuccess');
	if (!obj || !obj.target) { return; }
	
	let grid = obj.target.grid, dataset = obj.target.dataset||(grid?grid.getBindDataset():null), columns = obj.target.columns;
	if (dataset && columns) {  // colID 치환
		for (let i in columns) {
			let column = columns[i];
			dataset.updateColID(i, column);
		}
	}
	if (grid) { grid.createFormat(); }
	
	// Success Callback
	if (obj.target.success) { obj.target.success(dataset); }
}



// Row Height 자동조정 시 디자인에서 지정한 height값도 반영되게 수정
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

// createFormat() 실행 시, 디자인에서 지정한 height값도 반영되게 수정
pGrid.createFormat = function() {
	let D = this._DEFAULT_PROPERTY, D_HeadHeight = D.HEAD_ROW_HEIGHT||34, D_BodyHeight = D.BODY_ROW_HEIGHT||34;
	
	var _a = this._binddataset;
	var _b;
	var _c = 0;
	if (_a) {
		_c = _a.getColCount();
		this.rowcount = this._rowcount = _a.rowcount;
		this._rowposition = _a.rowposition;
	}
	var _d;
	if (_c > 0) {
		_d = "<Formats>\n";
		_d += "<Format id=\"default\">\n";
		_d += "<Columns>\n";
		{
			for (_b = 0; _b < _c; _b++) {
				_d += "<Column size=\"";
				_d += "80";
				_d += "\"/>\n";
			}
		}
		_d += "</Columns>\n";
		_d += "<Rows>\n";
		{
			_d += "<Row band=\"head\" size=\"";
			_d += D_HeadHeight;  // "24";
			_d += "\"/>\n";
			_d += "<Row band=\"body\" size=\"";
			_d += D_BodyHeight;  // "24";
			_d += "\"/>\n";
		}
		_d += "</Rows>\n";
		_d += "<Band id=\"head\">\n";
		{
			for (_b = 0; _b < _c; _b++) {
				_d += "<Cell col=\"";
				_d += _b.toString();
				_d += "\" displaytype=\"normal\" text=\"";
				_d += _a.getColID(_b);
				_d += "\"/>\n";
			}
		}
		_d += "</Band>\n";
		_d += "<Band id=\"body\">\n";
		{
			for (_b = 0; _b < _c; _b++) {
				_d += "<Cell col=\"";
				_d += _b.toString();
				_d += "\" displaytype=\"normal\" text=\"bind:";
				_d += _a.getColID(_b);
				_d += "\"/>\n";
			}
		}
		_d += "</Band>\n";
		_d += "</Format>\n";
		_d += "</Formats>\n";
	} else {
		_d = "<Formats>\n";
		_d += "<Format id=\"default\">\n";
		_d += "</Format>\n";
		_d += "</Formats>\n";
	}
	this.set_formats(_d);
	return 0;
};

pGrid=null; delete pGrid;
pForm=null; delete pForm;


/*******************************************************************************************************************************
 * Nexacro Core Overriding - ComComp.js > _pExportItem._gridItemExport
 *******************************************************************************************************************************/
{
	var _pExportItem = nexacro.ExportItem.prototype;
	
	_pExportItem._gridItemExport = function(_a) {
		var _b = _a._exportuitype;
		if (_a.exporteventtype != "none" && _b) {
			var _c = _a._exportBar;
			if (!_c || _c._uitype != _b) {
				_c = _a._exportBar = _a._getExportBar(_b);
				var _d = _a._getProcessStr(_a.count(), _a._allRowCount, _a._allRowCount);
				_d = nexacro._getLongerStr(_d, _a.exportmessagecomplete, _a.exportmessageready);
				var _e = _c._textbox;
				var _f = _e ? _e._getCurrentStyleInheritValue("font") : _c.font || _c._getCurrentStyleInheritValue("font");
				var _g = nexacro._getTextSize(_d, _f);
				_c._textWidth = _g[0];
				_c._textHeight = _g[1];
			}
			if (_a._itemsIndex == 0 && _a.exportmessageready != "") {
				_c._set_text(_a.exportmessageready);
			}
			_c._show();
		}
		var _h = this.source;
		var _i = _h._curFormat._cols ? _h._curFormat._cols.length : 0;
		var _j = _h._curFormat._bodyrows ? _h._curFormat._bodyrows.length : 0;
		if (_h._hasTree) {
			this._gridTempInfo = {};
			_a._tempSaveMethod = nexacro.Grid.prototype._recreate_contents_all;
			nexacro.Grid.prototype._recreate_contents_all = nexacro._emptyFn;
			this._gridTempInfo.enableevent = _h.enableevent;
			_h.enableevent = false;
			this._gridTempInfo.treeIndexes = _h._treeIndexes.slice(0);
			this._gridTempInfo.treeStates = _h._treeStates.slice(0);
			this._gridTempInfo.treeinitstatus = _h.treeinitstatus;
			_h.set_treeinitstatus("expand,all");
		}
		if (_h._hasVirtualMergeCell()) {
			this._makeMergeDatas(_h, _j, _i);
		}
		this._style_map1 = null;
		this._style_map2 = null;
		var _k = this._ds_style;
		if (!_k) {
			_k = this._ds_style = new nexacro.Dataset("STYLE");
			_k.addColumn("type", "String", 10);
			_k.addColumn("name", "String", 32);
			_k.addColumn("value", "String", 1024);
			_k.addColumn("locale", "String", 32);
		} else {
			_k.clearData();
		}
		var _l = this._ds_command;
		if (!_l) {
			_l = new nexacro.Dataset("COMMAND");
			this._ds_command = _l;
			_l.addColumn("command", "String", 32);
			_l.addColumn("type", "int", 32);
			_l.addColumn("item", "String", 256);
			_l.addColumn("seq", "int");
			_l.addColumn("startrow", "int", 32);
			_l.addColumn("eof", "boolean", 32);
			_l.addColumn("instanceid", "String", 256);
			_l.addColumn("url", "String", 256);
			_l.addColumn("summarytype", "String", 256);
			_l.addColumn("range", "String", 32);
			_l.addColumn("exportsize", "String", 32);
			_l.addColumn("exporthead", "String", 32);
			_l.addColumn("exportimage", "String", 32);
			_l.addColumn("exportfilename", "String", 32);
			_l.addColumn("exportfilepath", "String", 256);
			_l.addColumn("format", "String", 1024 * 1024);
			_l.addColumn("password", "String", 256);
			_l.addColumn("wraptext", "boolean", 32);
			_l.addColumn("locale", "String", 32);
			_l.addColumn("righttoleft", "boolean", 32);
			_l.addColumn("separator", "String", 32);
			_l.addColumn("quotechar", "String", 32);
		} else {
			_l.clearData();
		}
		_l.addRow();
		_l.setColumn(0, "command", "export");
		_l.setColumn(0, "type", _a._exporttype);
		_l.setColumn(0, "item", _h.id);
		_l.setColumn(0, "seq", this._seq);
		_l.setColumn(0, "startrow", this._startRow);
		_l.setColumn(0, "instanceid", this._instanceId);
		_l.setColumn(0, "url", _a._fileURL);
		_l.setColumn(0, "summarytype", _h.summarytype);
		_l.setColumn(0, "range", this.range);
		var _m = this.exportselect == "selectrecord";
		var _n = ((_h.selecttype != "area") && (_h.selecttype != "multiarea") && (_h.selecttype != "treecell")) ? true : false;
		if (_n) {
			if (_m) {
				if (this._exporthead == "") {
					this._exporthead = "nohead, nosumm";
					this._applyHead = false;
					this._applySumm = false;
				}
				this._exportmerge = false;
			}
		} else {
			this._exporthead = "nohead, nosumm";
			this._applyHead = false;
			this._applySumm = false;
		}
		_l.setColumn(0, "exportsize", this.exportsize);
		_l.setColumn(0, "exporthead", this._exporthead);
		_l.setColumn(0, "exportimage", this.exportimage);
		_l.setColumn(0, "exportfilename", _a.exportfilename);
		_l.setColumn(0, "exportfilepath", _a.exportfilepath);
		if (nexacro._Browser == "Runtime") {
			nexacro._flushCommand(this._getWindow());
		}
		var _o = nexacro._replaceAll(this._makeFormat(_h), "&#13;", "");
		// [2024.03.15] sg.park - Grid Head Filter가 엑셀다운로드 시, 포함되지 않게 수정
		if (_h && _h.config && _o && _h.config.filterHeadRowIndex && _h.config.filterHeadRowIndex > -1) {
			let _fidx = _h.config.filterHeadRowIndex, _sep = '</Head>', _oa = _o.split(_sep);
			
			/* Formats
				 > Format
					 > Columns > Column
					 > Rows    > Row
					 > Head    > Cell
					 > Body    > Cell
			*/
			
			// Filter Cell 제거
			_oa[0] = _oa[0].replace(new RegExp('<Cell row="'+ _fidx +'"[^>]*/>', 'g'), '');
			_o = _oa.join(_sep);
			
			// Filter Cell  이전 rowspan 제거
			let _ox = (new DOMParser()).parseFromString(_o, 'text/xml');
			
			// <Cell row="(\d+)" col="(\d+)" rowspan="2"([^>]*)>  ==> <Cell row="$1" rowspan="1"$3>
			//_oa[0] = _oa[0].replace(new RegExp('<Cell row="'+ (_fidx-1) +'" col="(\d+)" rowspan="2" [^>]*/>', 'g'), '<Cell row="'+ (_fidx-1) +'" col="$1" rowspan="1" $3>');
			let _kH = 'Head', _oHead = _ox.getElementsByTagName(_kH), _oHeadTag = ['<'+ _kH +'>'], _oHCells = _oHead && _oHead.length>0 ? _oHead[0].getElementsByTagName('Cell') : null;
			if (_oHCells) {
				for (let _oHCell of _oHCells) {
					if (_oHCell.getAttribute('row') == _fidx-1) {
						if (_oHCell.getAttribute('rowspan') > 1) {
							_oHCell.setAttribute('rowspan', 1);
						}
					}
					_oHeadTag.push(_oHCell.outerHTML);
				}
				_oHeadTag.push('</'+ _kH +'>');
				_oHead[0].outerHTML = _oHeadTag.join('');
				// _oa[0] = _oa[0].replace(new RegExp('<'+ _kH +'>*</'+ _kH +'>', 'g'), _oHeadTag.join(''));
			}
			
			// Filter Row 제거
			let _ok = 'Row', _ox_rows = _ox.getElementsByTagName(_ok);
			if (_ox_rows && _ox_rows.length>0) {
				if (_ox_rows && _ox_rows.length>=_fidx) {
					_ox_rows[_fidx].remove();
				}
				let _oRowsN = ['<'+ _ok +'s>'];
				for (let i=0; i<_ox_rows.length; i++) {
					_oRowsN.push(_ox_rows[i].outerHTML);
				}
				_oRowsN.push('</'+ _ok +'s>');
				
				//_ox_rows.outerHTML = _oRowsN.join('');
				//_oa[0] = _oa[0].replace(new RegExp('<'+ _ok +'s>*</'+ _ok +'s>', 'g'), _oRowsN.join(''));
			}
			
			_o = new XMLSerializer().serializeToString(_ox);  // _oa.join(_sep);
		}
		
		_l.setColumn(0, "format", _o);
		_l.setColumn(0, "password", _a._file_pw);
		_l.setColumn(0, "wraptext", _a._wrap_text);
		_l.setColumn(0, "righttoleft", this._righttoleft);
		_l.setColumn(0, "separator", _a.separator ? _a.separator : _a._defaultseparator);
		_l.setColumn(0, "quotechar", _a.quotechar);
		var _p = _h._getLocale();
		if (_p) {
			_p = _p.replace(/-/g, "_");
			_l.setColumn(0, "locale", _p);
		}
		var _q = new nexacro.Dataset("CELL");
		this._ds_cell = _q;
		var _r = _h.getCellCount("body");
		var _s = this._bodyRowCnt = _h._getGridRowCount();
		var _t = "";
		var _u = "";
		if (this._exportmerge && _h._is_use_suppress && _s >= _h._bodyBand._get_rows().length) {
			this._gridSuppressUpdate(_h, _s);
		}
		var _v = null;
		var _w = null;
		if (_r > 0) {
			for (var _ct = 0; _ct < _r; _ct++) {
				_q.addColumn("Column" + _ct, "String", 256);
			}
			var _x = this.parent ? (this.parent.transferrowcount || _s) : _s;
			var _y = this._partitionRow = _x;
			if (_y >= _s) {
				_y = _s;
				this._eof = true;
				_v = this.parent._argsParam;
				_w = this.parent._argsDsParam;
			}
			var _z = _h._curFormat._bodycells;
			var _aa = (this.exportvalue == "selectstyle");
			var _ab;
			var _ac;
			var _ad = false;
			var _ae, _af, _ag, _ah;
			var _ai, _aj;
			var _ak = this._getWindow();
			for (_ai = 0; _ai < _y; _ai++) {
				_ac = 0;
				if (nexacro._Browser == "Runtime") {
					nexacro._peekWindowHandleMessageQueuePassing(_ak);
				}
				var _al;
				var _am = false;
				var _an;
				for (_aj = 0; _aj < _r; _aj++) {
					_am = _am || _h.isSelectedCell(_aj, "body", _ai, -9);
				}
				if (_am || !_m) {
					_an = _q.addRow();
					if (_m) {
						this._eventExport(_a, this.type, _ai, this._selectcount++);
					} else {
						this._eventExport(_a, this.type, _ai);
					}
				} else {
					continue;
				}
				var _ao = _ai % 2;
				for (_aj = 0; _aj < _r; _aj++) {
					_ad = false;
					_ab = _h.isSelectedCell(_aj, "body", _ai, -9);
					if (!_ab) {
						if (_m) {
							_ad = true;
						}
					}
					var _ap, _aq, _ar, _as, _at;
					var _au = _z[_aj];
					var _av = _au._suppress_infos;
					var _aw = _ab && _aa;
					var _ax = false;
					var _ay = _au._rowspan;
					var _az = this._checkExpr(null, _au.cssclass);
					var _ba = _az ? _au._getAttrValue(_au.cssclass, _ai) : "";
					var _bb = _aj + (_ba ? _ba : "");
					var _bc = _aw ? "-c" : "";
					var _bd = this._stylecache[_bb + "align" + _bc];
					var _be = this._stylecache[_bb + "line" + _bc];
					var _bf = undefined
					  , _bg = undefined
					  , _bh = undefined;
					{
						if (_ad) {
							_bf = "255,255,255";
							_bg = "255,255,255";
							_ae = this._d_BLColor;
							_be = _ae + ":" + _ae + ":" + _ae + ":" + _ae;
							_ax = true;
						} else {
							if (!_au._getVirtualMergeInfo(_ai + 2)) {
								_bf = this._stylecache[_bb + "background" + _ao + _bc];
								_bg = this._stylecache[_bb + "color" + _ao + _bc];
							}
						}
						_bh = this._stylecache[_bb + "font" + _bc];
					}
					if (!nexacro._isNull(_bd)) {
						_aq = _bd;
						if (_az) {
							_ax = true;
						}
					} else {
						if (this._applyA) {
							_ax = true;
							_aq = nexacro._nvl(this._getCellStyle(_au, _ai, _ao, "align", _aw), "");
							if (_az) {
								this._stylecache[_bb + "align" + _bc] = _aq;
							}
						} else {
							_aq = null;
						}
					}
					if (!nexacro._isNull(_bf)) {
						_ap = _bf;
						if (_az) {
							_ax = true;
						}
					} else {
						if (this._applyB) {
							_ax = true;
							_ap = nexacro._nvl(this._getColortoRGB(this._getCellStyle(_au, _ai, _ao, "background", _aw)), "");
							if (!_az && !_au._getVirtualMergeInfo(_ai + 2)) {
								this._stylecache[_bb + "background" + _ao + _bc] = _ap;
							}
						} else {
							_ap = null;
						}
					}
					if (!nexacro._isNull(_bg)) {
						_as = _bg;
						if (_az) {
							_ax = true;
						}
					} else {
						if (this._applyC) {
							_ax = true;
							_as = nexacro._nvl(this._getColortoRGB(this._getCellStyle(_au, _ai, _ao, "color", _aw)), "");
							if (!_az && !_au._getVirtualMergeInfo(_ai + 2)) {
								this._stylecache[_bb + "color" + _ao + _bc] = _as;
							}
						} else {
							_as = null;
						}
					}
					if (!nexacro._isNull(_bh)) {
						_ar = _bh;
						if (_az) {
							_ax = true;
						}
					} else {
						if (this._applyF) {
							_ax = true;
							_ar = nexacro._nvl(this._getFitFontValue(this._getCellStyle(_au, _ai, _ao, "font", _aw)), "");
							var _bi = this._getCellStyle(_au, _ai, _ao, "textDecoration", _aw);
							if (_bi) {
								_ar = _bi + "," + _ar;
							}
							if (!_az) {
								this._stylecache[_bb + "font" + _bc] = _ar;
							}
						} else {
							_ar = null;
						}
					}
					var _bj = false, _bk = null, _bl = null, _bm = null, _bn = null, _bo;
					var _bp = 0;
					var _bq = 0;
					var _br = false;
					switch (this._exportmerge) {
					case 0:
						break;
					case 1:
						if (_au.suppress > 0) {
							_ax = _bj = true;
							if (_av[_ai]) {
								if (_av[_ai].border_proc) {
									_bn = "empty";
								}
								if (_av[_ai].text_proc) {
									_ad = true;
								}
							}
						}
						_h._checkVirtualMerge(_au, _ai);
						if (_au._getVirtualMergeInfo(_ai + 2)) {
							var _bs = _au._getVirtualMergeInfo(_ai + 2).remove;
							if (_bs) {
								_ax = _bj = true;
								switch (_bs) {
								case "bottomvirtual":
									_bn = "empty";
									break;
								case "rightbottomvirtual":
									_bm = _bn = "empty";
									break;
								case "rightvirtual":
									_bm = "empty";
									break;
								}
							}
						}
						break;
					case 2:
						if (_au.suppress > 0) {
							if (_ay > 1) {
								_br = true;
							}
							_ax = _bj = true;
							var _bt = _aj + "count";
							var _bu = this._excel_suppress_info;
							if (!_bu[_bt]) {
								_bu[_bt] = 0;
								_aq = _aq.split(",")[0] + "," + this._suppress_align_table[_au.suppressalign];
							}
							if (_av[_ai] && _av[_ai].border_proc) {
								this._excel_suppress_info[_bt]++;
							} else {
								_bp = ++_bu[_bt];
								if (_br) {
									_bp = _bp * _ay;
								}
								if (_br && _bp == 1) {
									_br = false;
								}
								_bu[_bt] = 0;
							}
						}
						_af = this._getMergeDatas(_ai, _aj);
						if (_af && _af.isVirtualEnd) {
							_ax = _bj = true;
							_bp = _af.rowspan;
							_bq = _af.colspan;
						}
						break;
					}
					if (_h._supphorztype > 0) {
						if (_au._area == "left" || _au._area == "right") {
							_ax = _bj = true;
							if (_av[_ai]) {
								if (_av[_ai].horz_text_proc) {
									_ad = true;
								}
							}
						}
					}
					if (!_bj && !nexacro._isNull(_be)) {
						_at = _be;
						if (_az) {
							_ax = true;
						}
					} else {
						if (this._applyL) {
							_ag = this._getCellStyle(_au, _ai, _ao, "border", _aw);
							if (!_bk) {
								if (_ag.left) {
									_bk = this._getColortoRGB(_ag.left.color) + (_ag.left.style == "solid" ? "" : "," + _ag.left.style);
								} else {
									_bk = "transparent,none";
								}
							}
							if (!_bl) {
								if (_ag.top) {
									_bl = this._getColortoRGB(_ag.top.color) + (_ag.top.style == "solid" ? "" : "," + _ag.top.style);
								} else {
									_bl = "transparent,none";
								}
							}
							if (!_bm) {
								if (_ag.right) {
									_bm = this._getColortoRGB(_ag.right.color) + (_ag.right.style == "solid" ? "" : "," + _ag.right.style);
								} else {
									_bm = "transparent,none";
								}
							}
							if (!_bn) {
								if (_ag.bottom) {
									_bn = this._getColortoRGB(_ag.bottom.color) + (_ag.bottom.style == "solid" ? "" : "," + _ag.bottom.style);
								} else {
									_bn = "transparent,none";
								}
							}
							_at = _bk + ":" + _bl + ":" + _bm + ":" + _bn;
							if (!_az) {
								this._stylecache[_bb + "line" + _bc] = _at;
							}
						} else {
							_at = "empty:empty:empty:empty:";
						}
					}
					_ah = this._getFixedCellType(_au, _ai);
					if (_u) {
						if (_u != _ah) {
							_u = _ah;
							_ax = true;
						}
					} else {
						_u = _ah;
					}
					_t = this._makeforDsStyle(_k, _aq, _ap, _as, _ar, _at, _ah, _bp, _bq);
					var _bv = false;
					if (_ah.indexOf("date") > -1 && (this._checkExpr(_au.locale) || this._checkExpr(_au.calendardateformat))) {
						_ax = true;
						if (_au.calendardateformat == "LONGDATE") {
							_bv = true;
						}
					}
					var _bw = _au._getDisplaytype(_ai);
					if (!_ax) {
						if (_bw == "mask" || _bw == "maskeditcontrol") {
							var _bx = _au._getAttrValue(_au.maskedittype, _ai);
							if (_bx == "number") {
								_ax = true;
							}
						}
					}
					var _by = this._getCellText(_h, _ai, _aj);
					_al = _ad ? "" : _by;
					var _bz = this._orgvalue_cells[_aj];
					if (_bv) {
						_au.calendardateformat = "SHORTDATE";
						_al = _au._getDisplayText_date(_ai);
						_au.calendardateformat = "LONGDATE";
					}
					if (_bw == "imagecontrol") {
						var _ca = this.exportimage.toLowerCase();
						if (_ca == "url" || _ca == "image") {
							var _cb = this._getCellText(_h, _ai, _aj);
							if (_cb) {
								var _cc = nexacro._getURIValue(_cb);
								_al = nexacro._getImageLocation(_cc, this._getForm()._getFormBaseUrl());
							} else {
								_al = _cb;
							}
						} else {
							_al = "";
						}
					} else if (_al && _bw == "mask") {
						if (!_cd) {
							var _cd = new Map();
						}
						var _ce = _cd.get(_aj);
						if (_ce == undefined) {
							_ce = _au._getAttrValue(_au.maskeditpostfixtext, _ai);
							_cd.set(_aj, _ce ? _ce : "none");
						}
						if (_ce && _ce != "none") {
							_al = _al.replace(_ce, "");
						}
					}
					var _cf;
					if (_a._commdataformat == 0) {
						_cf = "_x001D_";
					} else {
						_cf = String.fromCharCode(29);
					}
					if (this._exportmerge == 1) {
						if (_au.suppress > 0) {
							if (_av[_ai] && _av[_ai].text_proc) {
								_al = "";
							}
						}
						if (_h._supphorztype > 0) {
							if (_au._area == "left" || _au._area == "right") {
								if (_av[_ai]) {
									if (_av[_ai].horz_text_proc) {
										_al = "";
									}
								}
							}
						}
						if (!!_h._checkVirtualMerge(_au, _ai)) {
							_al = "";
							_af = this._getMergeDatas(_ai, _aj);
							if (_af) {
								if (_af.isVirtualStart) {
									if (_aq == "left,top") {
										_al = _by;
									} else {
										var _cg = _aq.split(",");
										var _ch = _af[_cg[1]] + "_" + _af[_cg[0]];
										if (this._merge_datas[_ch]) {
											this._merge_datas[_ch].disPlayText = _by;
											this._merge_datas[_ch].showText = true;
										} else {
											this._merge_datas[_ch] = {
												disPlayText: _by,
												showText: true
											};
										}
									}
								}
								if (_af.showText) {
									_al = _af.disPlayText;
								}
							}
						}
					} else if (this._exportmerge == 2) {
						if (_h._supphorztype > 0) {
							if (_au._area == "left" || _au._area == "right") {
								if (_av[_ai]) {
									if (_av[_ai].horz_text_proc) {
										_al = "";
									}
								}
							}
						}
					}
					if (_a._orgval_type || _bz) {
						_al = nexacro._isNumber(_al) ? _al : nexacro._isDecimal(_al) ? _al.toString() : nexacro._nvl(_al, "");
					} else {
						_al = nexacro._nvl(_al, "");
					}
					if (_br) {
						_q.setColumn(_an, "Column" + (_aj + _ac), _al + _cf + (_ax || (_ab && _aa) ? _t : "") + _cf + _br);
						_br = false;
					} else {
						_q.setColumn(_an, "Column" + (_aj + _ac), _al + _cf + (_ax || (_ab && _aa) ? _t : ""));
					}
					if (_au._subcells.length) {
						var _ci = _au._subcells;
						var _cj = _ci.length;
						var _ck = _au._rowspan - 1;
						var _cl = _au._colspan - 1;
						var _cm = "";
						_ae = this._d_BLColor;
						if (this._applyL) {
							_ag = this._getCellStyle(_au, _ai, _ao, "border", _aw);
							_bo = this._getColortoRGB(_ag.right.color) + (_ag.right.style == "solid" ? "" : "," + _ag.right.style);
						} else {
							_bo = _ae;
						}
						var _cn;
						var _co;
						var _cp;
						var _cq;
						for (var _cu = 0; _cu < _cj; _cu++) {
							var _cr = _ci[_cu]._col;
							var _cs = _ci[_cu]._row;
							if (_cr == _cl) {
								_cp = _bo;
							} else {
								_cp = "empty";
							}
							if (_cr == 0) {
								_cn = _ae;
							} else {
								_cn = "empty";
							}
							if (_cs == _ck) {
								_cq = _bo;
							} else {
								_cq = "empty";
							}
							if (_cs == 0) {
								_co = _ae;
							} else {
								_co = "empty";
							}
							_cm = _cn + ":" + _co + ":" + _cp + ":" + _cq;
							_ah = this._getFixedCellType(_ci[_cu], 0);
							_t = this._makeforDsStyle(_k, _aq, _ap, _as, _ar, _cm, _ah);
							if (_cu != 0) {
								_q.addColumn("Column" + (_ct + _ac), "String", 256);
								_ac++;
							}
							_by = this._getCellText(_h, _ai, _aj, _cu);
							_al = _ad ? "" : _by;
							if (_a._orgval_type || _bz) {
								_al = nexacro._isNumber(_al) ? _al : nexacro._isDecimal(_al) ? _al.toString() : nexacro._nvl(_al, "");
							} else {
								_al = nexacro._nvl(_al, "");
							}
							_q.setColumn(_an, "Column" + (_aj + _ac), _al + _cf + _t);
						}
					}
				}
			}
			this._preStartRow = this._startRow;
			this._startRow = _y;
		} else {
			this._eof = true;
			_v = this.parent._argsParam;
			_w = this.parent._argsDsParam;
		}
		_l.setColumn(0, "eof", this._eof);
		if (this._ds_response) {
			delete this._ds_response;
		}
		this._ds_response = new nexacro.Dataset("RESPONSE");
		this._rollbackSuppressInfo();
		if (_w != undefined) {
			this._transaction(this.id, _a._exporturl, "COMMAND=_ds_command STYLE=_ds_style CELL=_ds_cell" + " " + _w, "_ds_response=RESPONSE", _v, "_exportCallback", true, _a._commdataformat, _a._commcompress);
		} else {
			this._transaction(this.id, _a._exporturl, "COMMAND=_ds_command STYLE=_ds_style CELL=_ds_cell", "_ds_response=RESPONSE", _v, "_exportCallback", true, _a._commdataformat, _a._commcompress);
		}
		return true;
	}
	;
	
	_pExportItem = null; delete _pExportItem;
}
