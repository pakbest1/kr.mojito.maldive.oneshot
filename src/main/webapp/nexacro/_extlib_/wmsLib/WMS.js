/**
 *  SVC-WMS Common Library
 *  @FileName 	  WMS_MultiCombo.js
 *  @Creator 	  SVC-WMS
 *  @CreateDate   2023/11/30
 *  @Desction
 ************** 소스 수정 이력 ***********************************************
 *  date        Modifier         Description
 *******************************************************************************
 * 2023/11/30   SVC-WMS          Common Library
 *******************************************************************************
 */
if (String) {
	String.prototype.toCamelCase = function() {
		return this.toLowerCase().replace(/[-|_]([a-z])/g, function (g) { return g[1].toUpperCase(); });
	};

	String.prototype.toNFormat=String.prototype.toNumberFormat = function() {
		//let lang = navigator.language||''
		return this==Number(this) ? Number(this).toLocaleString() : this!='undefined' ? this : '';
	};
}
if (Number) {
	Number.prototype.toNFormat=Number.prototype.toNumberFormat = function() {
		//let lang = navigator.language||''
		return this==Number(this) ? Number(this).toLocaleString() : this!='undefined' ? this : '';
	};
}

// Wms Class 생성자
(function(nexacro) {
	if (!nexacro) return;
    if (nexacro.Wms) return nexacro.Wms;
	
	var Wms = nexacro.Wms = function(id, parent) {
		this._config = { isDebug: true };
		nexacro.Object.call(this, id, parent);
	};
	
	var _pWms = nexacro._createPrototype(nexacro.Object, Wms);  // nexacro.Object
	Wms.prototype = _pWms;
	_pWms._type_name = 'Wms';
	
	return Wms;
})(nexacro);

/*
nexacro.Wms = function(_a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l) {
	//nexacro.Component.call(this, _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l);
	this._config = { isDebug: true };
	
	// ...
};
nexacro.Wms.prototype  = nexacro._createPrototype(nexacro.Object, nexacro.Wms);  // Prototype Getter
*/
var pWms = nexacro.Wms.prototype;  // Prototype Getter

pWms.traceDataset = function(ds) {
	if (!ds) { return; }
	console.log( ds.saveJSON() );
};
pWms.trace = function(o) {
	if (o instanceof nexacro.Dataset) { this.traceDataset(o); }
	else
	if (typeof o === 'object') { console.log(JSON.stringify(o, null, 2)); }
	else {
		console.log(o);
	}
};

pWms.isNull = function(s) {
	if (new String(s).valueOf() == "undefined") return true;
	if (s == null) return true;
	
	var ChkStr = new String(s);
	if (ChkStr == null) return true;
	if (ChkStr.toString().length == 0 ) return true;
	return false;
};

pWms.getUUID = function() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}


// 출처: https://sisiblog.tistory.com/273 [달삼쓰뱉:티스토리]
pWms.getRandomString = function(length=8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
};


pWms.getRndName = function(prefix='clbk_') {
	return prefix + wms.getRandomString();
};


/**
 * @class  다국어 처리를 위한 용어 검색
 * @param  {String} sTargetVal - 검색할 용어
 * @return {String} 변경할 용어
 */
pWms.getWord = function (sWord, sLang='EN') {
	let objApp = nexacro.getApplication(), oDs = objApp.gds_Words, sVal = sWord;
	let nRow = oDs.findRow('WORD_ID', sWord);
	if (nRow != -1) {
		sVal = oDs.getColumn(nRow, sLang);
	}
	return sVal;
};

/**
 * @description   : 메뉴아이디 전처리
 * @param sMenuId : 메뉴아이디
 * @return		  : 전처리 한 메뉴아이디
 */
pWms.prefixMenuId = function(sMenuId) {
	return !sMenuId ? sMenuId : ('MENU_' + sMenuId.toString().replace(/MENU_/g, ''));
};


pWms.stringToObject = function(s) {
	var oOps={}, aOps = s.replace(/[\\{|\\}]/g, '').split(',');
	if (!s) { return s; }
	
	aOps.forEach(function(el) {
		var al = el.replace(/ /g, '').split(':');
		oOps[al[0]] = al[1].replace(/['|\\"]/g, '');
	});
	
	return oOps;
};

// Dataset, Grid - Event 발생 활성화 On & Off
pWms.eventOnOff = function(isOn, isForce, comps) {
	if (!comps) { return; }
	for (let i in comps) {  // for (let comp of comps) {  // for (let i in comps) {  comp = comps[i];
		let comp = comps[i];
		if (comp instanceof Dataset) {
			comp.set_enableevent  (isOn);
			if (isForce) { comp.set_updatecontrol(isOn); }
		} else
		if (comp instanceof Grid) {
			let ds = comp.getBindDataset();
			if (ds) { this.eventOnOff(isOn, isForce, [ds]); }
			
 			comp.set_enableevent (isOn);
// 			comp.set_enableredraw(isOn);
		}
	}
};

// Dataset, Grid - Event 비활성화
pWms.eventOff = nexacro.Form.prototype.eventOff = function() {
	this.eventOnOff(false, false, arguments);
};

// Dataset, Grid - Event 활성화
pWms.eventOn = nexacro.Form.prototype.eventOn = function() {
	this.eventOnOff(true, false, arguments);
};

// Dataset, Grid - Event 비활성화
pWms.eventForceOff = nexacro.Form.prototype.eventOff = function() {
	this.eventOnOff(false, true, arguments);
};

// Dataset, Grid - Event 활성화
pWms.eventForceOn = nexacro.Form.prototype.eventOn = function() {
	this.eventOnOff(true, true, arguments);
};


// 
// 	/*** Form 초기기동 시 바인딩 기능 ***/
// 	initBindCode: function(oForm, oCpnt, sCode, sFrstName, sDfltCode, cdClbk) {
// 		let cdNm = 'CD_TYPE', bindCode=oCpnt['uBindCode']||'', dfltClbk = 'fnCodeCallback';
// 		let dsNm = 'ds_ReqCodes', ds = oForm[dsNm] = new Dataset(dsNm);
// 		ds.addColumn(cdNm);
// 		let rIdx = ds.addRow();
// 		ds.setColumn(rIdx, cdNm, sCode);
// 		
// 		let reqDs = 'input='+dsNm, resDs = 'ds_'+ sCode +'='+ sCode;
// 		if (cdClbk && oForm[cdClbk]) {
// 			this[dfltClbk] = function(svcID, errorCode, errorMsg) {
// 				trace(cdClbk);
// 				//trace("fnCallback=="+ this.ds_list.getColumn(0,1));
// 				if (errorCode != 0) { alert(errorCode+"\n"+errorMsg); return; }  // 에러 시 화면 처리 내역
// 				if ('function' == typeof cdClbk) { cdClbk(svcID, errorCode, errorMsg); }
// 				if ('string'   == typeof cdClbk && 'function' == typeof oForm[cdClbk]) { oForm[cdClbk](svcID, errorCode, errorMsg); }
// 			};  // this[cdClbk]
// 		}
// 		
// 		oForm.transaction(
// 			'listCode',
// 			'/mat.retrieveComCodeComboList.do',
// 			reqDs,
// 			resDs,
// 			dfltClbk
// 		);
// 	},
// 	
// 	/* 공통코드 바인딩
// 		wms.initBindCodes([
// 			{ obj: '', code: '', select: { code: null, data: '전체' }, defaultcode: '' },
// 			{ obj: '', code: '', select: { code: null, data: '전체' }, defaultcode: '' }
// 		]);
// 	 */
// 	initBindCodes: function(opts) {
// 		
// 	},
// 	
// 	loadPreload: function () {
// 		
// 	},
// 
// });
pWms = null; delete pWms;

$w=wms=nexacro.wms=new nexacro.Wms();



var pForm = nexacro.Form.prototype, pDataset = nexacro.Dataset.prototype;


/**
 * @class 해당 콤포넌트의 form으로 부터의 경로를 구하는 함수
 * @param {Object} obj - 콤포넌트
 * @return {String} 해당 콤포넌트의 form으로 부터의 경로
 * Linked Form에서는 Div00.form.Button00 가 아니라 Div00.formid.Button00 형태로 생성됨
 */
pForm.gfnGetCompId = function (obj) {
	var sCompId = obj.name;
	var objParent = obj.parent;
	
	while (true) {
		//trace("" + objParent + " / " + objParent.name);
		if (objParent instanceof nexacro.ChildFrame ) {
			break;
		} else {		
			sCompId = objParent.name + "." + sCompId;
		}
		objParent = objParent.parent;		
	}
	return sCompId;
}



/************************************************************************
 * WMS 필요함수
 ************************************************************************/
pForm.isNull = function(s) {
	return this.gfnIsNull(s);
};

/*
   Dataset Row 상태를 코드값으로 조회 - @see: https://www.playnexacro.com/#show:learn:4603
   
   @param	: {int}  rowIdx   - 건수 표시할 Component
   @return	: [ null:미존재행(0), N:일반(1), I:입력(2), U:수정(4), D:삭제(8), G:그룹정보행(16) ]
 */
pDataset.getRowTypeCd = pDataset.getRowTypeCode = function(rowIdx) {
	if (!this._rowTypes) { this._rowTypes = { 0:null, 1:'N', 2:'I', 4:'U', 8:'D', 16:'G' }; }
	if (rowIdx < 0) { return this._rowTypes[0]; }
	var iRowType = this.getRowType(rowIdx);
	return this._rowTypes[iRowType];
};

/*
   조회 건수 표시 - this.gfnSetRowCnt : (AS-IS gfn_SetRowCnt 함수 참고)
   @param	{Object}  oc   - 건수 표시할 Component
   @param	{Dataset} ds   - Dataset Object
   @return	:   N/A
 */
pForm.gfnSetRowCnt = function(oc, ds, sTemplete='${count} Rows )') {
	if (!oc || !ds) { return; }
	let cunt = Number(ds ? (ds.filterstr ? ds.getRowCountNF() : ds.getRowCount()) : 0).toNumberFormat();
	trace('['+ ds.id +':'+ cunt +']');
	
	let reCunt = new RegExp('\\$\\{count\\}', 'g'),
		reTotl = new RegExp('\\$\\{total\\}', 'g'), 
		reRepl = new RegExp('\\$\{[A-Za-z0-9_]+\}', 'g');
	oc.set_text( !reRepl.test(sTemplete)   // tmplText.indexOf('${'+rcCunt+'}') < 0
		? cunt +' Rows )'
		: sTemplete .replace(reCunt, cunt)
					.replace(reRepl, ''  )
	);
};

//pForm.gfnBindContents = function(oc, oi, stmpl='${count} / ${total} Rows') {
pForm.gfnBindContents = function(args) {
	if (!args || !args.target || !args.value) { return; }
	if (!args.templete) { args.templete = '${count} / ${total} Rows'; }
	
	let ot=args.target, ov=args.value, st=args.templete;
	
// 	s = s.replace(new RegExp('\\$\\{count\\}', 'g'), Number(oi.count||0).toNumberFormat());
// 	s = s.replace(new RegExp('\\$\\{total\\}', 'g'), Number(oi.total||0).toNumberFormat());
	let s = st, keys = Object.keys(ov);
	for (let key of keys) {
		let val = ov[key]; val = isNaN(val) ? (!val?'':val) : Number(val).toNumberFormat();
		s = s.replace(new RegExp('\\$\\{'+ key +'\\}', 'g'), val);
	}
	s = s.replace(new RegExp('\\$\{[A-Za-z0-9_]+\}', 'g'), '');
	ot.set_text(s);
	
	return s;
}

/*
 * 데이터셋 필수값 체크 - this.gfnDataRequired : (AS-IS gfn_DataRequired 함수 참고)
 *
 * Grid 항목별 필수 입력항목 Valid Check!!
 * @param {Object} objGrid  - 대상 Grid Object
 * @param {String} sColumns - 체크할 컬럼 문자열 (구분자 : ":")
 * @param {String} sTtitles - 체크할 컬럼 타이틀 (구분자 : ":")
 * @return true / false
 */
pForm.gfnDataRequired = function(oGrid, sColumns, sTtitles, sRowType, isAlert=true) {
	if (!oGrid || !sColumns || !sTtitles) { return false; }
 
	var rowType = 'I,U';
	if(new String(sRowType).valueOf() != "undefined"){
		rowType = sRowType;
	}
	trace( "rowType=="+rowType);
	
	var oDataset = oGrid.getBindDataset();  // var oDataset = this.all[oGrid.binddataset];
	var nRow, arrCol = sColumns.split(':'), arrTitle = sTtitles.split(':');
	
	if (arrCol.length != arrTitle.length) {
		trace('인자 불일치');
		return false;
	}
	if (oDataset.getRowCount() < 1) { return true; }
	
	var bRet = true, nIdx, sVal, sTitle, nSize, oColInfo;
	for (var i = 0; i < oDataset.getRowCount(); i++) {
		if (rowType.indexOf( oDataset.getRowTypeCd(i) )>-1) {	 
	//	if ('I,U'.indexOf( oDataset.getRowTypeCd(i) )>-1) {	 // if ((oDataset.getColumn(i, "ROW_CUD") == "I") || (oDataset.getColumn(i, "ROW_CUD") == "U")) {	
	  //if (['I','U'].includes( oDataset.getRowTypeCd(i) )) {
			for (var j = 0; j < arrCol.length; j++) {
				//let idxDsCell = oGrid.getBindCellIndex('body', arrCol[j]);
				oColInfo = oDataset.getColumnInfo(arrCol[j]);
				//if (oColInfo == null) continue;
				if (oColInfo == null) {
					this.alert('"'+ arrCol[j] +'" not found', 'Check Data Column');
					oGrid.setFocus();
					return false;
				}
				
				nSize = oColInfo.size;
				sVal = oDataset.getColumn(i, arrCol[j]);
				sTitle = arrTitle[j];
				if (sTitle == null) sTitle = arrCol[j];
				if (sTitle.indexOf('*')>=0) {
					sTitle = sTitle.replace('*','');
				}
				
				if (this.isNull( sVal )) {
					// TODO : gfn_XpMsg("emComMandatoryCheck", "W", sTitle); //%1은(는) 필수입력항목입니다.
					this.alert('"'+ sTitle +'" Data is Required', 'Check Data Required');
					
					oDataset.rowposition = i;
					nIdx = oGrid.getBindCellIndex('body', arrCol[j]);
					if (nIdx >= 0) {
						oGrid.setFocus();
						oGrid.showEditor(true);
						oGrid.setCellPos(nIdx);
					}
					
					return false;
				}   // if (this.isNull( sVal ))
			}  // for (var j = 0; j < arrCol.length; j++)
		}   // if ((oDataset.getColumn(i, "ROW_CUD")
	}   // for (var i = 0; i < oDataset.getRowCount(); i++) {
	
	return true;
}

/*
 * 데이터셋 중복값 체크 (AS-IS gfn_DataDupCheck 함수 참고)
 * 
 * Function명 : gfn_DataDupCheck
 * 설명       : 입력한 데이터의 중복여부체크(복수 컬럼검색).
 * @param {Object} objDs	 - Dataset Object.
 * @param {String} arrColID  - Check Column Name
 * @return true / false      - { true:중복되지않음, false:중복 }
 */
pForm.gfnDataDupCheck = pForm.gfnDataDupeCheck = function(oComp, arrColID, isAlert=true) {
	let oGrid = null, objDs = null;
	if (oComp instanceof nexacro.Grid) {
		oGrid = oComp;
		objDs = oGrid.getBindDataset();
	} else
	if (oComp instanceof nexacro.Dataset || oComp instanceof nexacro.NormalDataset) {
		objDs = oComp;
	}
	if (!objDs) {
		this.alert('Dataset not found', 'Check Dataset');
		return false;
	}

	var bUniqueData = true, strExpr, nFindRow;
	for (var i=0; i<objDs.getRowCount(); i++) {
		if ('I'.indexOf( objDs.getRowTypeCd(i) )>-1) {  // if(objDs.getColumn(i, "ROW_CUD") == "I") {
	  //if (['I'].includes( objData.getRowTypeCd(i) )) {
			strExpr = '';
			for (var j=0; j<arrColID.length; j++) {
				strExpr += arrColID[j]+"=='"+objDs.getColumn(i, arrColID[j])+"'";
				// if((i+1)<arrColID.length){ //j로 변경해야함 - LEESJ 수정(20150416)
				if ((j+1)<arrColID.length) {
					strExpr += ' && ';
				}
			}
			
			trace(strExpr);
			nFindRow = objDs.findRowExpr(strExpr);
			if (i==nFindRow) {
				nFindRow = objDs.findRowExpr(strExpr, nFindRow + 1);
				if(nFindRow >= 0) {
					objDs.rowposition = i;
					
					bUniqueData = false;
					break;
				}
			} else if(nFindRow >= 0) {
				objDs.rowposition = i;
				
				bUniqueData = false;
				break;
			}
		}
	}
	
	if (isAlert && !bUniqueData) {
		this.alert('Duplicate data exists : '+ arrColID.toString());
	}
	
	return bUniqueData;
};

// /**
//   Grid 편집여부 확인
//  */
// pForm.isDataModified = function(aComps, fExec) {
// 	if (!aComps || aComps.length<1) { return false; }
// 	let bDataModified = false;
// 	
// 	for (let c=0; c<aComps.length; c++) {
// 		let cpnt = aComps[c], ds = cpnt instanceof nexacro.Grid ? cpnt.getBindDataset() : (cpnt instanceof nexacro.Dataset ? cpnt : null);
// 		if (!ds) { continue; }
// 		
// 		for (let i=0; i<ds.getRowCount(); i++) {
// 			bDataModified = bDataModified || 'I,U,D'.indexOf(ds.getRowTypeCode(i))>-1;
// 			if (bDataModified) { break; }
// 		}
// 		if (bDataModified) { break; }
// 	}
// 	
// 	if (bDataModified) {
// 		this.confirm('Changed data exists\nDo you want to reset your data?', null, function(sPopId, rtn) {
// 			trace('[bDataModified:'+ rtn +']');
// 			if ('Y' === rtn) { if ('function' == typeof fExec) { fExec.call(this); } }
// 		}, 'Changed data exists');
// 	}
// 	
// 	if (!bDataModified && 'function' == typeof fExec) { fExec.call(this); }
// 	return bDataModified;
// };

/*
 * 폼에 존재하는 모든 데이터셋 변경여부 확인
 * 적용예외 Dataset Names : Array ['dsSearch']
 */
pForm.isModified = function(aExcludeNames) {
	let isDatasetModified=false;
	
	for (let i in this.all) {
		let obj = this.all[i];
		if ( !(obj instanceof nexacro.Dataset) ) { continue; }
		if (aExcludeNames && aExcludeNames.includes( obj.name )) { continue; }
		
		isDatasetModified = isDatasetModified || obj.isModified();
		if (isDatasetModified) { break; }
	}
	
	return isDatasetModified;
};


/*******************************************************************************************************************************
 * 파일 다운로드 처리
 *******************************************************************************************************************************/
pForm.downloadFile = function (url) {
	$('<iframe/>')
		.attr({
			id   : 'nxdifm',
			style: 'visibility:hidden;display:none',
			src  : url, // '/docs/WMS_Sample_Inv_Trans_List.xlsx',
		})
		.on({
			'load' : function(){ $(this).remove(); },
			'error': function(){
				$.toast({
					showHideTransition: 'plain',
					text: 'File not Found. url:'+ url,
				});
				$(this).remove();
			},
		})
		.appendTo('body');
};


pForm = null; delete pForm;
pDataset = null; delete pDataset;
