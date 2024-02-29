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