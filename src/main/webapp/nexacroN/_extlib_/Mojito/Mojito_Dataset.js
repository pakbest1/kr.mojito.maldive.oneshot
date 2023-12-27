var pDataset = nexacro.Dataset.prototype;

// Dataset Event 발생여부
pDataset.switchEvent = function(bOn=false) {
	this.set_enableevent  ( bOn );
	this.set_updatecontrol( bOn );
}

// Dataset RowType Code
pDataset._rowTypeCodes = {
	 0: { code: 'E', name: 'EMPTY'  },
	 1: { code: 'N', name: 'NORMAL' },
	 2: { code: 'I', name: 'INSERT' },
	 4: { code: 'U', name: 'UPDATE' },
	 8: { code: 'D', name: 'DELETE' },
	16: { code: 'G', name: 'GROUP'  },
};

// Dataset RowType Info 조회
pDataset.getRowTypeInfo = function(rowidx) {
	let rowcount = this.getRowCount();
	if (rowcount < 1 || rowcount <= rowidx) { return null; }
	let rtIdx = this.getRowType(rowidx), rowType = this._rowTypeCodes[rtIdx];
	return rowType;
}

// Dataset RowType Code 조회
pDataset.getRowTypeCode = function(rowidx) {
	let rowType = this.getRowTypeInfo(rowidx);
	return rowType ? rowType.code : null;
};

// Dataset RowType Name 조회
pDataset.getRowTypeName = function(rowidx) {
	let rowType = this.getRowTypeInfo(rowidx);
	return rowType ? rowType.name : null;
};

// Dataset Row DataObject
pDataset.loadColumnInfo = function() {
	this._columnnames = null;
	this._columninfos = null;
	
	let colcount = this.getColCount();
	if (colcount < 1) { return null; }
	
	this._columnnames = [];
	this._columninfos = [];
	for (let i = 0; i < colcount; i++) {
		let columninfo = this.getColumnInfo(i);
		this._columnnames.push( columninfo.name );
		this._columninfos.push( columninfo      );
	}
	
};

// Dataset Row DataObject
pDataset.getRowDataObject = function(rowidx) {
	let rowcount = this.getRowCount();
	if (rowcount < 1 || rowcount <= rowidx) { return null; }
	
	if (!this._columnnames) { this.loadColumnInfo(); }
	
	let rowObject = {}, colcount = this._columnnames.length;
	for (let i = 0; i < colcount; i++) {
		let k = this._columnnames[i], v = this.getColumn(rowidx, k);
		rowObject[k] = v;
	}
	rowObject['rowType'    ] = this.getRowType    ();
	rowObject['rowTypeCode'] = this.getRowTypeCode();
	
	return rowObject;
}

// Dataset 편집여부 리턴 [ true: 편딥, false: 미편집 ]
pDataset.isModified = function() {
	let isModified=false, rowcount = this.getRowCount();
	if (rowcount<1) { return isModified; }
	
	for (let i=0; i<rowcount; i++) {
		isModified |= ['I', 'U', 'D'].includes(this.getRowType(i));
		if (isModified) { break; }
	}
	
	return isModified;
};



// Dataset RowType Info 조회
pDataset.getRowTypeInfoNF = function(rowidx) {
	rowcountNF = this.getRowCountNF();
	if (rowcountNF<1 || rowcountNF <= rowidx) { return null; }
	let rtIdx = this.getRowTypeNF(rowidx), rowType = this._rowTypeCodes[rtIdx];
	return rowType;
}

// Dataset RowType Code 조회
pDataset.getRowTypeCodeNF = function(rowidx) {
	let rowType = this.getRowTypeInfoNF(rowidx);
	return rowType ? rowType.code : null;
};

// Dataset RowType Name 조회
pDataset.getRowTypeNameNF = function(rowidx) {
	let rowType = this.getRowTypeInfoNF(rowidx);
	return rowType ? rowType.name : null;
};

// Dataset Row DataObjectNF
pDataset.getRowDataObjectNF = function(rowidx) {
	let rowcount = this.getRowCountNF();
	if (rowcount < 1 || rowcount <= rowidx) { return null; }
	
	if (!this._columnnames) { this.loadColumnInfo(); }
	
	let rowObject = {}, colcount = this._columnnames.length;
	for (let i = 0; i < colcount; i++) {
		let k = this._columnnames[i], v = this.getColumnNF(rowidx, k);
		rowObject[k] = v;
	}
	rowObject['rowType'    ] = this.getRowTypeNF    ();
	rowObject['rowTypeCode'] = this.getRowTypeCodeNF();
	
	return rowObject;
}

// Dataset 편집여부 리턴 [ true: 편딥, false: 미편집 ]
pDataset.isModifiedNF = function() {
	let isModified=false, rowcountNF = this.getRowCountNF();
	if (rowcountNF<1) { return isModified; }
	
	for (let i=0; i<rowcountNF; i++) {
		isModified |= ['I', 'U', 'D'].includes(this.getRowTypeNF(i));
		if (isModified) { break; }
	}
	
	return isModified;
};



pDataset = null; delete pDataset;