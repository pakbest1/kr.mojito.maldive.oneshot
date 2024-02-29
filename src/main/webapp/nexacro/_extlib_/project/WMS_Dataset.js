/**
 *  SVC-WMS Dataset Library
 *  @FileName 	  WMS_MultiCombo.js
 *  @Creator 	  SVC-WMS
 *  @CreateDate   2023/11/30
 *  @Desction
 ************** 소스 수정 이력 ***********************************************
 *  date        Modifier         Description
 *******************************************************************************
 * 2023/11/30   SVC-WMS          Dataset Library
 *******************************************************************************
 */
var pDataset = nexacro.Dataset.prototype, pForm = nexacro.Form.prototype;


/*******************************************************************************
 * pDataset
 *******************************************************************************/
/**
   Dataset Row 상태를 코드값으로 조회 - @see: https://www.playnexacro.com/#show:learn:4603
   
   @param	: {int}  rowIdx   - 건수 표시할 Component
   @return	: [ null:미존재행(0), N:일반(1), I:입력(2), U:수정(4), D:삭제(8), G:그룹정보행(16) ]
 */
pDataset._rowTypes = { 0:null, 1:'N', 2:'I', 4:'U', 8:'D', 16:'G' };
pDataset.getRowTypeCd = pDataset.getRowTypeCode = function(rowIdx) {
	//if (!this._rowTypes) { this._rowTypes = { 0:null, 1:'N', 2:'I', 4:'U', 8:'D', 16:'G' }; }
	if (rowIdx < 0) { return this._rowTypes[0]; }
	var iRowType = this.getRowType(rowIdx);
	return this._rowTypes[iRowType];
};
pDataset.getRowTypeCdNF = pDataset.getRowTypeCodeNF = function(rowIdx) {
	//if (!this._rowTypes) { this._rowTypes = { 0:null, 1:'N', 2:'I', 4:'U', 8:'D', 16:'G' }; }
	if (rowIdx < 0) { return this._rowTypes[0]; }
	var iRowType = this.getRowTypeNF(rowIdx);
	return this._rowTypes[iRowType];
};

/*
 * Dataset 변경여
 */
pDataset.isModified = function() {
	let isModified = false;
	
	if (this.getDeletedRowCount() > 0) {
		return isModified = true;
	}
	for (let i=0; i<this.getRowCountNF(); i++) {
		if ('I,U,D'.indexOf( this.getRowTypeCodeNF(i) )>-1) { return isModified = true; }
	}
	
	return isModified;
};

/* Dataset 컬럼정보 조회 */
pDataset.getColumnInfos = function() {
	if (!this || this.getColCount() < 1) { return; }
	
	let aCols = [], iCols = this.getColCount();
	for (let i=0; i<iCols; i++) {
		aCols.push( JSON.parse(JSON.stringify( this.getColumnInfo(i) )) );
	}
	
	this._columnInfos = aCols;
	return aCols;
};

/*
 * Dataset Row 정보 Object로 가져오기
 */
pDataset.getRowObject = function(index) {
	if (!this || this.getRowCount() < 1 || index < 0) { return; }
	if (!this._columnInfos) { this._columns = this.getColumnInfos(); }
	
	let oRow = {};
	for (let i=0; i<this._columnInfos.length; i++) {
		let k=this._columnInfos[i], v=this.getColumn(index, k.id);
		oRow[k.id] = v instanceof nexacro.Decimal || 'number' == typeof v ? Number(v) : v;
	}
	
	return oRow;
};

/*
 * Dataset Row 정보 선택된 Object로 가져오기
 */
pDataset.getSelectedRowObject  = function() {
	if (!this || this.getRowCount() < 1 || this.rowposition < 0) { return; }
	if (!this._columnInfos) { this._columns = this.getColumnInfos(); }
	
	let iRow = this.rowposition;
	return this.getRowObject(iRow);
};

/*
 * Dataset Row 정보 체크선택된 Object로 가져오기
 */
pDataset.getSelectedRowObjects = function(chkColId='chk', chkColVal='1') {
	if (!this || this.getRowCount() < 1) { return; }
	if (!this._columnInfos) { this._columns = this.getColumnInfos(); }
	
	let aRows = [], iRows = this.getRowCount();
	for (let i=0; i<iRows; i++) {
		if (chkColVal != this.getColumn(i, chkColId)) { continue; }
		aRows.push( this.getRowObject(i) );
	}
	
	return aRows;
};




/*******************************************************************************
 * pDataset
 *******************************************************************************/
/*
 * 폼에 존재하는 모든 데이터셋 변경여루 확인
 */
pForm.isDsModified = function(isForce=false) {
	let isDatasetModified=false;
	
	for (let i in this.all) {
		let obj = this.all[i];
		if ( !(obj instanceof nexacro.Dataset) ) { continue; }
		isDatasetModified = isDatasetModified || obj.isModified();
		if (isDatasetModified) { break; }
	}
	
	return isDatasetModified;
};

pDataset = null; delete pDataset;
pForm = null; delete pFrom;