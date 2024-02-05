var pForm = nexacro.Form.prototype;

// /************************************************************************
//  * Clipboard Initialize
//  ************************************************************************/
// pForm.formOnload = function(form) {
// 	form = form||this;
// 	let clipboard = top.nexacro.clipboardData = top.nexacro.clipboardData || new DataTransfer();  // top.window.nexacro.clipboardData||new DataTransfer();
// 	
// 	let comps = form.components;
// 	for (let id of comps._idArray) {  // for (let comp of parent.components._idArray)
// 		let comp = comps[id];
// 		
// 		if (comp instanceof nexacro.Tab) {
// 			this.initClipboardComponent(comp);
// 		} else
// 		if (comp instanceof nexacro.Div || comp instanceof nexacro.Tabpage) {
// 			if (!comp.url) {
// 				this.initClipboardComponent(comp.form);
// 			}
// 		} else {
// 			// if(arr[i] instanceof Grid) {
// 			comp.addEventHandler('onkeydown', this.nxCopyPaste_OnKeydown, this);
// 		}
// 	}   // for
// 	
// };

/************************************************************************
 * Clipboard Initialize
 ************************************************************************/
pForm.initClipboardComponent = function(comp) {
	comp.addEventHandler('onkeydown', this.nxCopyPaste_OnKeydown, this);
};

pForm.getClipboard = function() {
	if (!top.nexacro.clipboardData) {
		top.nexacro.clipboardData = new DataTransfer();
	}
	return top.nexacro.clipboardData;
};

/************************************************************************
 * Clipboard Nexacro Event
 ************************************************************************/
 // 넥사크로 모든 Components Keydown Event 지정
pForm.nxCopyPaste_OnKeydown = function(obj, e) {
	if ( !(e.ctrlkey && !e.altkey && !e.shiftkey) ) { return; }
	
	let efcomp = e.fromobject, ercomp = e.fromreferenceobject;
	if (e.keycode == 67) {  // Ctrl+C
		this.nxCopyPaste_ActionCopy ( efcomp );  // console.log('Ctrl + C : Copy  - '+ efcomp.name);
	} else
	if (e.keycode == 88) {  // Ctrl+V
		this.nxCopyPaste_ActionCut  ( efcomp );  // console.log('Ctrl + C : Copy  - '+ efcomp.name);
	}
	if (e.keycode == 86) {  // Ctrl+V
		this.nxCopyPaste_ActionPaste( efcomp );  // console.log('Ctrl + V : Paste - '+ efcomp.name);
	}
}

/************************************************************************
 * Clipboard Actions
 ************************************************************************/
// Clipboard > Copy Action
pForm.nxCopyPaste_ActionCopy = function(comp, isSlient=false) {
	let clipboard = this.getClipboard(), clipdata = null;
	
	if ( comp instanceof nexacro.Grid ) {
		clipdata = this._enClipboard( comp );
	} else
	if ( comp && comp.value ) {
// 		let selection = window.getSelection();
// 		clipdata = comp.value;
	}
	
	clipboard.setData('text', clipdata);
	// if (!isSlient) { console.log('Ctrl + C : Copy  - '+ comp.name +': '+ clipdata); }
};

pForm.nxCopyPaste_ActionCut = function(comp) {
	let clipboard = this.getClipboard(), clipdata = null;
	
	this.nxCopyPaste_ActionCopy(comp, true);  // isSlient
	if ( comp && comp.set_value ) { comp.set_value(''); }
	
	// console.log('Ctrl + X : Cut   - '+ comp.name +': '+ clipdata);
}

// Clipboard > Paste Action
pForm.nxCopyPaste_ActionPaste = function(comp) {
	let clipboard = this.getClipboard(), clipdata = clipboard.getData('text');
	if (!clipdata) { return; }
	
	if ( comp instanceof nexacro.Grid ) {
		let form = comp._getForm(), grid = comp;
		form._deClipboard(clipdata, grid);  // this.nxCopyPaste_ActionPaste4Grid(clipdata, grid);  // this._getClipboard2('CF_TEXT', form._deClipboard, form, comp);
	} else
	if ( comp && comp.set_value ) {
		// comp.set_value(clipdata);
	}
	
	//console.log('Ctrl + V : Paste - '+ comp.name +': '+ clipdata);
};

/************************************************************************
 * Clipboard Functions
 ************************************************************************/
// Clipboard Copy for Grid
pForm._enClipboard = function(obj) {
	if(obj.readonly) return;

	var startrow  = nexacro.toNumber(obj.selectstartrow[0]);
	var endrow    = nexacro.toNumber(obj.selectendrow[0]);
	var startcell = this.getCellIdx(obj, 'body', obj.selectstartcol, obj.selectstartsubrow)[0];
	var endcell   = this.getCellIdx(obj, 'body', obj.selectendcol, obj.selectendsubrow)[0];

	var selectText = obj.getEditSelectedText();

	var dataset = obj.getBindDataset();
	if (dataset == null) return;
	var clip = '';
	if (startrow > endrow) {
		var v = startrow;
		startrow = endrow;
		endrow = v;
	}
	if (startcell > endcell) {
		var v = startcell;
		startcell = endcell;
		endcell = v;
	}
	for (var row = startrow; row <= endrow; row++) {
		for (var cell = startcell; cell <= endcell; cell++) {
			var sData = obj.getCellValue(row, cell)||'';
			if (String(sData).indexOf('\n') > 0) {
				sData = '"' + sData + '"';
			}
			clip += sData;

			if (cell < endcell) {
				clip += '\t';
			}
		}

		if (row < endrow) {
			clip += '\r\n';
		}
	}

// 	//this._setClipboard2('CF_TEXT', clip, obj);
// 	let clipboard = this.getClipboard();
// 	clipboard.setData('text', clip);
	
	return clip;
};

// Clipboard Paste for Grid
pForm._deClipboard = function(clip, oGrid) {
	var cCellNL = '\b';			
	if(oGrid == null) return;
	if(oGrid.readonly) return;
	if(!clip) return;
	var dataset = oGrid.getBindDataset();
	if(dataset == null) return;

	var start_cell = oGrid.getCellPos();
	var start_row = oGrid.selectstartrow[0];

	// 엑셀붙여넣기시 Cell 내부 MultiLine 처리
	if (this.isUseClipboard == false) {
		var newClip = '';
		var nPos = -1;
		var nPrePos = -1;		
		var nStartPos = -1;
		var bEnd = false;
		
		nPos = clip.indexOf('"');
		while (nPos >= 0) {
			bEnd = false;
			//Start
			if(nPos == 0) {
				nStartPos = nPos;				
			} else if(clip.substr(nPos - 1, 1) == '\t' || clip.substr(nPos - 1, 1) == '\n') {
				nStartPos = nPos;			
			//End
			} else if(nPos == clip.length - 1) {
				bEnd = true;
			} else if(clip.substr(nPos + 1, 1) == '\t' || clip.substr(nPos + 1, 1) == '\n') {
				bEnd = true;
			}
			
			if(bEnd) {
				if(nStartPos > -1) {
					var cellstr = clip.substr(nStartPos, nPos - nStartPos + 1);
					cellstr = nexacro.replaceAll(cellstr, "\n", cCellNL);
					newClip += clip.substr(nPrePos + 1, nStartPos - nPrePos - 1);
					newClip += cellstr;
				}
				nStartPos = -1;		
				nPrePos = nPos;
			}
			
			nPos = clip.indexOf('"', nPos + 1);
		}
		
		if (nPrePos != -1) {
			clip = newClip + clip.substr(nPrePos + 1);		
		}
		clip = nexacro.replaceAll(clip, '\r\n', '\n');
	}
	
	var rows = null;

// 	if(this.isUseClipboard) {
// 		rows = clip.split("\r\n");
// 	} else {
// 		rows = clip.split("\n");				
// 	}
	//rows = clip.split(this.isUseClipboard ? '\r\n' : '\n');
	rows = clip.split('\r\n');
	
	if (!rows[rows.length - 1]) {		
		rows.splice(rows.length - 1, 1);
	}
	
	var colids = [];
	for (var i = 0; i < rows.length; i++) {				
		var cells = rows[i].split("\t");
		
		if (dataset.rowcount <= i + start_row) {
			dataset.addRow();
		}

		for (var j = 0; j < cells.length; j++) {
			if (oGrid.getCellCount('body') <= j + start_cell) break;
			var edittype = oGrid.getCellProperty('body', j + start_cell, 'edittype');
			
			if (edittype == 'none' || edittype == 'readonly') continue;
			
			var sData = cells[j];
			if (edittype == 'date') {
				sData = String(sData).replace(/-|:|\s/g, '');
			}
			if (!colids[j]) {
				var cell_text = oGrid.getCellProperty('body', j + start_cell, 'text');
				if (!cell_text) continue;
				if (cell_text.substr(0, 5) == 'bind:') {
					colids[j] = cell_text.substr(5);
				}
			}
			if (colids[j]) {
				if (sData.substr(0, 1) == '"' && sData.substr(sData.length - 1, sData.length) == '"') {
					sData = sData.substr(1, sData.length - 2);
				}
				
				if (edittype == 'combo') {
					var combodataset = oGrid.getCellProperty('body', j + start_cell, 'combodataset');
					var combocodecol = oGrid.getCellProperty('body', j + start_cell, 'combocodecol');
					var combodatacol = oGrid.getCellProperty('body', j + start_cell, 'combodatacol');
					
					if(combodataset) {
						var objComboDs = oGrid.parent[combodataset];
					
						if(objComboDs) {
							// ComboCode 우선
							var nFindRow = objComboDs.findRow(combocodecol, sData);										
							if(nFindRow < 0) {
								nFindRow = objComboDs.findRow(combodatacol, sData);
							
								if(nFindRow >= 0) {
									dataset.setColumn(i + start_row, colids[j], objComboDs.getColumn(nFindRow, combocodecol));
									continue;
								}
							}									
						}
					}
				}
				
				if (this.isUseClipboard == false) {
					sData = nexacro.replaceAll(sData, cCellNL, '\n');
				}
				dataset.setColumn(i + start_row, colids[j], sData);
			}
		}
	}			
	oGrid.showEditor(false);
};


// Col index에 해당되는 Cell Idx 구함.
pForm.getCellIdx = function(_grid, _band, _col, _subrow) {
	var rtn_cell = -1;
	var rtn_subcell = -1;

	// 2021.11.30.HY. Header 가 다중Row 이고 body가 1 일때
	var nHeadRowCnt = 0;
	var nBodyRowCnt = 0;
	for (var i = 0; i < _grid.getFormatRowCount(); i++) {
		var sBand = _grid.getFormatRowProperty(i, "band");
		if(sBand == "head") {
			nHeadRowCnt++;
		} else if(sBand == "body") {
			nBodyRowCnt++;
		}
	}

	if (nHeadRowCnt > nBodyRowCnt) {
		_subrow = _subrow + (nHeadRowCnt - nBodyRowCnt);
	}

	for (var i = 0; i < _grid.getCellCount(_band); i++) {
		var cell_row = _grid.getCellProperty(_band, i, "row");
		var cell_col = _grid.getCellProperty(_band, i, "col");
		if(_subrow < cell_row) return [rtn_cell, rtn_subcell];
		//if else 순서 바뀌면 안됨!
		if(_col == cell_col) {
		//조건 우선순위1
			rtn_cell = i;
			rtn_subcell = _grid.getSubCellCount(_band, i) > 0 ? 0 : -1;

			if(_subrow == cell_row ) {
				return [rtn_cell, rtn_subcell];
			}
		} else if(cell_col <= _col && _col <= (cell_col + _grid.getSubCellCount(_band, i) - 1)) {
			//조건 우선순위2
			rtn_cell = i;
			rtn_subcell = _col - cell_col;

			if(_subrow == cell_row ) {
				return [rtn_cell, rtn_subcell];
			}
		} else if(cell_col <= _col && _col <= (cell_col + _grid.getCellProperty(_band, i, "colspan") - 1)) {
			//조건 우선순위3
			rtn_cell = i;
			rtn_subcell = -1;

			if(_subrow == cell_row ) {
				return [rtn_cell, rtn_subcell];
			}
		}
	}
	return [rtn_cell, rtn_subcell];
};

pForm = null; delete pForm;