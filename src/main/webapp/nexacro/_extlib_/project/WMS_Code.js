/**
 *  SVC-WMS Common Code Library
 *  @FileName 	  WMS_Code.js
 *  @Creator 	  SVC-WMS
 *  @CreateDate   2023/11/30
 *  @Desction
 ************** 소스 수정 이력 ***********************************************
 *  date        Modifier         Description
 *******************************************************************************
 * 2023/11/30   SVC-WMS          SVC-WMS Common Code Library
 *******************************************************************************
 */
var pForm = nexacro.Form.prototype;

/**
 * 공통코드 바인딩 처리 v1.1
 * @param	: 	codes : { codegroup: 그룹코드, obj: component, first: '0' : '1::Select' } - ( first: 0 은 All 추가 , 1 은 입력값 추가)
 * @param   :   callback - 생략가능 (모든 코드 가져온 뒤 작업이 필요하면 사용하면 됨)
 */
/*
	Sample > INV > INV073S.xfdl
	
	this.gfnBindCode([
		{ codegroup:'STORAGE_LOC', obj: this.dvSearch.form.cbStoargeLoc, first: '0' },
	],
	function(id, no, mesg){
		trace('mesg');
	});
 */
pForm.gfnBindCode = function(codes, callback) {
	if (!codes || codes.length < 1) { return; }
	let form = this;
	
	let resData = '';
	for (let i=0; i<codes.length; i++) {
		let code = codes[i];
		if (!code || !code.codegroup) { continue; }
		
		let obj = code.obj, nxComp = null, nxDsNm = 'dsCode'+ code.codegroup, nxDs = this[nxDsNm];
		if (obj instanceof nexacro.Combo || obj instanceof nexacro.Radio || obj instanceof nexacro.ListBox) {
			nxComp = obj;
			nxDs   = obj.getInnerDataset();
			
			if (!nxDs) {
				nxDs = new Dataset(nxDsNm, form);
				form.addChild(nxDsNm, nxDs);
				obj.set_innerdataset(nxDsNm);
			}
			
			nxDsNm = nxDs.name;
		} else
		if (obj instanceof Dataset) {		//obj 가 데이터셋일경우
			nxComp = null;
			nxDs   = obj;
			nxDsNm = nxDs.name;
		}
		
		if (!nxDs && code.codegroup) {  // 없으면 만들자 : codeSTORAGE_LOC
			nxDs = new Dataset(nxDsNm, form);
			this.addChild(nxDsNm, nxDs);
			nxDsNm = nxDs.name;
			
			if (obj instanceof nexacro.Combo || obj instanceof nexacro.Radio || obj instanceof nexacro.ListBox) {
				obj.setInnerDataset(nxDs);
			}
		}
		
		if (obj instanceof nexacro.Combo || obj instanceof nexacro.Radio || obj instanceof nexacro.ListBox) {
			nxComp.setInnerDataset (nxDs  );
			nxComp.set_innerdataset(nxDsNm);
			nxComp.set_codecolumn  ('cd'  );
			nxComp.set_datacolumn  ('cdNm');
		}
		
		if (resData.indexOf(nxDsNm)<0) {
			resData += (resData ? ' ' : '') + nxDsNm +'='+ code.codegroup;  // reqData = 'dsCodeLOC=LOC dsCodeMAT=MAT';
		}
	}
	this._gvCodes = codes;
	
	let reqId = 'gfnGetCode', reqDsNm = '_tds_CodeCond', reqDs = this.all[reqDsNm], nRow = -1, reqCols = [ 'cdType', 'corpCd', 'plantCd' ];
	if (!reqDs) {
		reqDs = new Dataset(reqDsNm, this);
		this.addChild(reqDs.name, reqDs);
		
		for (let i in reqCols) {
			reqDs.addColumn(reqCols[i] , 'string');
		}
	}
	
	reqDs.clearData();
	reqDs.set_enableevent  (false);
	reqDs.set_updatecontrol(false);
	for (let i=0; i<codes.length; i++) {
		let code = codes[i];
		if (!code) { continue; }
		
		if (reqDs.findRow( reqCols[0], code.codegroup) >= 0) { continue; }
		
		nRow = reqDs.addRow();
		reqDs.setColumn(nRow, reqCols[0], code.codegroup);
		
		for (let i in reqCols) {
			if (reqCols[i] == reqCols[0]) { continue; }
			if (code[reqCols[i]]) {  reqDs.setColumn(nRow, reqCols[i] , code[reqCols[i]] ); }
		}
	}
	reqDs.set_updatecontrol(true);
	reqDs.set_enableevent  (true);
	reqDs.applyChange();
	
	let clbkFnNm = reqId +'Clbk';
	if ('string'   == typeof callback && this[callback] instanceof Function) {
		clbkFnNm = callback;
	} else
	if ('function' == typeof callback && callback       instanceof Function) {
		if (this[clbkFnNm] && callback != this[clbkFnNm]) {
			// callBackFnNm = callBackFnc == this[callBackFnNm] ? 'clbk_'+strSvcId : wms.getRndName('clbk_');  // 'clbk_'+strSvcId+'1';  //wms.getRndName('clbk_');
			clbkFnNm = wms.getRndName('clbk_');
		}
		this[clbkFnNm] = callback;
	}
	
	//trace('[resData:'+ resData +']');
	this.gfnTransaction(
		reqId                             ,  // svcid
		'/mat.retrieveComCodeComboList.do',  // strSvcUrl
		'input='+reqDs.name               ,  // reqDatasets
		resData                           ,  // resDatasets
		null                              ,  // strArg 
		function (id, code, mesg) {          // callback
			// this._gvCodes
			for (let i=0; i<codes.length; i++) {
				let code = codes[i];
				if (!code || !code.codegroup) { continue; }
				
				let obj = code.obj, nxComp = null, nxDs = null, nxDsNm = 'dsCode'+ code.codegroup;
				if (obj instanceof nexacro.Combo || obj instanceof nexacro.Radio || obj instanceof nexacro.ListBox) {
					nxDs   = obj.getInnerDataset();
					nxComp = obj;
					if (nxDs) {
						nxDsNm = nxDs.name;
					}
					
				} else
				if (obj instanceof Dataset) {		//obj 가 데이터셋일경우
					nxDs   = nxComp;
					nxComp = null;
					if (nxDs) {
						nxDsNm = nxDs.name;
					}
				}
				
				// 코드조회 후 초기작업 - 멀티콤보는 제외
				if ( !(obj instanceof nexacro.Combo && obj.uSelecttype==='M') ) {
					if (nxDs && code.first) {
						let arr = (code.first.indexOf('0') < 0 ? code.first : '0::ALL').split(':'), iIdx = -1;
						iIdx = nxDs.insertRow(0);
						nxDs.setColumn(iIdx, 'cd'  , arr[1]);
						nxDs.setColumn(iIdx, 'cdNm', arr[2]);
					}
					if (nxComp) {
						nxComp.set_index(0);
					}
				}
				
				if (obj instanceof nexacro.Combo && !obj.displayrowcount) { obj.set_displayrowcount(12); }
				
				if (obj instanceof nexacro.Combo && obj.uSelecttype==='M' && obj.initComponent) {
					obj.initComponent(this);
				}
				
			}   // for
			
			if (this[clbkFnNm]) { this.lookupFunc(clbkFnNm).call(id, code, mesg); }  // Callback 실행
			
		}
	);  // this.gfnTransaction
};

/**
 * 공통코드 팝업 호출 v1.1
 * @param	: 	Object : { codegroup: 그룹코드, callback: 콜백함수 }
 */
/*
	Sample > INV > INV073S.xfdl
	this.popupComCode({
		codegroup :'STORAGE_LOC',
		selecttype: 'singlerow',
		function(result) {
			trace('Storage Location - Code Popup Callback Result : '+ result);
		}
	});
 */
pForm.gfnPopupCode = function(args) {
	if (!args || !args.codegroup) { return; }
	
	let clbk = args.callback, clbkNm='popupComCodeClbk';
	if (clbk) {
		if ('function' == typeof clbk &&      clbk ) {  // 콜벡이 function, this['popupComCodeClbk'] 바인딩 후, clbkNm 전달
			this[clbkNm] = clbk;
		} else
		if ('string'   == typeof clbk && this[clbk]) {  // 콜벡이 string, clbkNm = clbk 전달
			clbkNm = clbk;
			clbk   = this[clbk];
		}
	}
	
	var oPopOpts = {
		  popuptype : 'modal'	//modal,modaless
		, title     : 'Code : '+ args.codegroup
		, titlebar  : false
		, autosize  : true
		, resize    : false
	};
	
	if (args) {
		// args['titletext'] = oPopOpts['title'];
		args._parametersArray = Object.keys(args);
	}
	this.gfnOpenPopup('ComCode', 'common::WmsComCodePopup.xfdl', args, clbk, oPopOpts);
};


pForm=null; delete pForm;