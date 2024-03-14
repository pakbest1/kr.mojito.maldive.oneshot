/**
 *  SVC-WMS MultiCombo Library
 *  @FileName 	  WMS_Combo.js
 *  @Creator 	  SVC-WMS
 *  @CreateDate   2023/11/30
 *  @Desction
 ************** 소스 수정 이력 ***********************************************
 *  date        Modifier         Description
 *******************************************************************************
 * 2023/11/30   SVC-WMS          Combo Library
 *******************************************************************************
 */
var pForm = nexacro.Form.prototype, pCombo = nexacro.Combo.prototype;

/************************************************************************
 * Combo Function
 ************************************************************************/
// 초기화
pCombo.initComponent = function(form) {
	this.parentform = form;
	if (nexacro._curscreentype && nexacro._curscreentype.indexOf('mobile') > -1) { this.initMobileComponent(form); }
	else
	if (this.uSelecttype && this.uSelecttype === 'M') { this.initMultiComboComponent(form); }
};


/************************************************************************
 * Combo Mobile Function
 ************************************************************************/
// Mobile Combo Component Initialize
pCombo.initMobileComponent = function(_form) {
	if (!nexacro._curscreentype || !(nexacro._curscreentype.indexOf('mobile') > -1)) { return; }
	let form = this.parentform||this._getForm(), combo = this;
	
	// 2. PopupDiv 생성
	this.MobileCombo_InitPopupDiv();
	
	combo.addEventHandler('ondropdown', combo.MobileCombo_OnDropdown, form);
};

pCombo.MobileCombo_InitPopupDiv = function() {
	let form = this.parentform||this._getForm(), combo = this, popupdiv = combo.popdiv;
	
	combo.set_popuptype('none');  // 이걸해야 MultiCombo가 됨.
	
	let displaynulltext = combo.displaynulltext||'Select';
	combo.set_displaynulltext(displaynulltext);
	combo.set_tooltiptext(displaynulltext);
	if (combo.index < 0) {
		combo.set_text(displaynulltext);
	}
	
	// 2. PopupDiv 생성
	let pcf = combo.popupconfig = {
		// parent
		opener: this,
		
		// popup
		id    : combo.id+'PopupDiv',
		url   : 'common::WmsMobileCombo.xfdl',
		
		left  : nexacro.mainframe.getOffsetLeft  (),  // form.getPixelLeft   (),
		top   : nexacro.mainframe.getOffsetTop   (),  // form.getPixelTop    (),
		width : nexacro.mainframe.getOffsetWidth (),  // null, // form.getPixelWidth  (),
		height: nexacro.mainframe.getOffsetHeight(),  // null, // form.getPixelHeight (),
		right : null,  // nexacro.mainframe.getOffsetLeft(),  // form.getOffsetRight (),
		bootom: null,  // nexacro.mainframe.getOffsetTop (),  // form.getOffsetBottom(),
		
		// dataset
		maxrowdize: 7,
		dataset   : combo.getInnerDataset(),
		codecolumn: combo.codecolumn || 'cd'  ,
		datacolumn: combo.datacolumn || 'cdNm',
	};
	if (!popupdiv) {
		popupdiv = combo.popdiv = new PopupDiv(pcf.id, pcf.left, pcf.top, pcf.width, pcf.height, pcf.right, pcf.bootom);
		form.addChild(pcf.id, popupdiv);
		popupdiv.set_url(pcf.url);
		popupdiv.show();
	}
	popupdiv.opener = combo;
	
	let ppform = popupdiv.form, stabg = ppform.stabg, pplist = ppform.list;
	if (stabg) {
		stabg.set_left  ( pcf.left   );
		stabg.set_top   ( pcf.top    );
		stabg.set_width ( pcf.width  );
		stabg.set_height( pcf.height );
	}
	if (pplist) {
		let rcunt = pcf.dataset.getRowCount(); rcunt = rcunt <= pcf.maxrowdize ? rcunt : pcf.maxrowdize;
		let lheight = (rcunt * pcf.opener.height) + 2, ltop = (pcf.height - lheight) / 2;
		
		pplist.set_right       ( pplist.left       );
		
		pplist.set_top         ( ltop              );
		pplist.set_height      ( lheight           );
		pplist.set_itemheight  ( pcf.opener.height );
		
		pplist.set_innerdataset( pcf.dataset       );
		pplist.set_codecolumn  ( pcf.codecolumn    );
		pplist.set_datacolumn  ( pcf.datacolumn    );
	}
	
	return combo.popupdiv = popupdiv;
};

pCombo.MobileCombo_OnDropdown = function(obj, e) {  // obj:nexacro.Combo, e:nexacro.EventInfo)
	if (!nexacro._curscreentype || !(nexacro._curscreentype.indexOf('mobile') > -1)) { return; }
	
	let form = obj.parentform, combo = obj, dset = combo.getInnerDataset();  // , popupdiv = combo.popupdiv;  // , oGrid = obj.popupdiv.grid;
	if (!combo || !dset || dset.getRowCount()<1 || !combo.visible || !combo.enable || combo.readonly) { return; }
	
	let popupdiv = combo.MobileCombo_InitPopupDiv(), pcf = combo.popupconfig;
	popupdiv.trackPopup(pcf.left, pcf.top);
};


/************************************************************************
 * Combo MultiCombo Function
 ************************************************************************/
// MultiCombo Component Initialize
pCombo.initMultiComboComponent = function(form) {
	if (this.uSelecttype !== 'M') { return; }
	
	// MultiCombo init
	let mCombo = this;
	mCombo.set_popuptype('none');  // 이걸해야 MultiCombo가 됨.
	let nDispDfltCunt = 10;  mCombo.displayrowcount = nDispDfltCunt;
	let nDisplayCnt = mCombo.displayrowcount||nDispDfltCunt; nDisplayCnt = nDisplayCnt>nDispDfltCunt ? nDispDfltCunt : nDisplayCnt;  // 최대 15개로 지정
	
	let sCheckColumn = mCombo.checkcolumn  = 'chk' ;
	let sCodeColumn  = mCombo.codecolumn  || 'cd'  ;
	let sDataColumn  = mCombo.datacolumn  || 'cdNm';

	let sFarmeFull = form.gfnGetCompId(form.parent);
	let sCompFull  = form.gfnGetCompId(mCombo);   				// formid.Div00.form.Combo00
	let sCompPath  = sCompFull.substr(sFarmeFull.length+1);  	// Div00.form.Combo00
	let sUniqueID  = nexacro.replaceAll(sCompPath, '.', '_');	// fDiv00_form_Combo00

	// 1. 멀티콤보 Dataset 생성 - 그리드 바인딩 용 ("_ds_"+innerds+sUniqueID 지정)
	let sDsCombo = mCombo.innerdataset;
	let oDsCombo = mCombo.combodataset = mCombo.getInnerDataset() || form[sDsCombo];
//	if (!sDsCombo || !oDsCombo || !sCodeColumn || !sDataColumn) {
//		trace('Alert :'+ mCombo.name + ' innerdataset not found');
//		return;
//	}
	if (!sDsCombo || !oDsCombo) {
		sDsCombo = 'ds_'+ sUniqueID;
		oDsCombo = mCombo.getInnerDataset() || form[sDsCombo];
		if (!oDsCombo) {
			oDsCombo = mCombo.combodataset = new Dataset(sDsCombo, this);
			form.addChild(sDsCombo, oDsCombo);
			
			mCombo.set_innerdataset(oDsCombo.name);
		}
		if (null!=null) {  // 미사용
			// 멀티콤보 Dataset 컬럼 생성
			oDsCombo.clear();
			oDsCombo.addColumn(sCheckColumn, 'STRING');
			oDsCombo.addColumn(sCodeColumn , 'STRING');
			oDsCombo.addColumn(sDataColumn , 'STRING');

			// 멀티콤보 Dataset 데이터 추가
			oDsCombo.set_enableevent(false);
			for (var j=0; j<oInnerDataset.getRowCount(); j++) {
				oDsCombo.addRow();
				oDsCombo.setColumn(j, mCombo.checkcolumn, '0');
				oDsCombo.setColumn(j, sCodeColumn      , oInnerDataset.getColumn(j, sCodeColumn));
				oDsCombo.setColumn(j, sDataColumn      , oInnerDataset.getColumn(j, sDataColumn));
			}
			oDsCombo.applyChange();
			oDsCombo.set_enableevent(true);
		}
		
		if (oDsCombo.getRowCount()>0 && oDsCombo.getRowCount() < nDisplayCnt) nDisplayCnt = oDsCombo.getRowCount();
	}
	
	// 2. PopupDiv 생성
	var sPdvId = '_popdiv_' + sUniqueID;
	var objPdv = form.components[sPdvId];
	if (!objPdv) {
		var objPdv = mCombo.popupdiv = new PopupDiv();
		objPdv.init(sPdvId, mCombo.getOffsetLeft(), mCombo.getOffsetBottom(), 100, 100, null, null);
		form.addChild(sPdvId, objPdv);
		objPdv.set_cssclass('multicomboBox');  // objPdv.set_cssclass('pdiv_WF_Area');
		objPdv.show();

		var objParam = {
			combo      : mCombo,
			comboname  : sCompPath,
			dataset    : oDsCombo,
			innerds    : sDsCombo,
			checkcolumn: sCheckColumn,
			codecolumn : sCodeColumn,
			datacolumn : sDataColumn,
		};

		objPdv.uParam = objParam;
		if (!objPdv.getEventHandler('oncloseup', 0)) { objPdv.addEventHandler('oncloseup', form.MultiComboPopupDiv_EventOncloseup, form); }
	}
	
	// 3. Grid 생성
	var sGridId = 'gridCombo', objGrid = objPdv.form.components[sGridId];
	if (form.gfnIsNull(objGrid)){
		let fTopGap = 10;
		var nComboSize = mCombo.getOffsetWidth()-2;  // 콤보 사이즈를 기준 - 보더제외
		let oGcols = [ 
			{ bind: sCheckColumn||'chk' , width: 38 , cssclass: 'cellText' },
			{ bind: sCodeColumn ||'cd'  , width: 80 , cssclass: 'cellText' },
			{ bind: sDataColumn ||'cdNm'            , cssclass: 'cellText' },
		]; // oGcols[2].width = nComboSize - oGcols[0].width - oGcols[1].width;
		
		var objGrd = mCombo.popupdiv.grid = new Grid(sGridId, 0, fTopGap, null, null, -10, 0);
		objGrd.set_cssclass('grd_multicombo');  // objGrd.set_cssclass('grd_mCombo');
		objGrd.set_wheelscrollrow(1);
		objPdv.addChild(sGridId, objGrd);

		objGrd.set_enableevent(false);
		objGrd.set_enableredraw(false);
		
		objGrd.set_scrollbardecbuttonsize(0);
		objGrd.set_scrollbarincbuttonsize(0);
		objGrd.set_scrollbarsize         (0);
		
		objGrd.checkcolumn = mCombo.checkcolumn;
		objGrd.set_binddataset(oDsCombo.name);
		
//		// 이전 소스
// 		objGrd.createFormat();
// 		objGrd.setFormatRowProperty( 0, 'size', 32);  // row height
// 		objGrd.setFormatRowProperty( 1, 'size', 32);
// 		
// 		objGrd.setFormatColProperty(0, 'size', nGColSize.chk  );  // cell width
// 		objGrd.setFormatColProperty(1, 'size', nGColSize.code );
// 		objGrd.setFormatColProperty(2, 'size', nGColSize.value);
			
		// Dataset 기준으로 만들어 버려 원하지않는 컬럼이 생기기도 하기에 별도 생성
		objGrd.appendContentsRow('head');
		objGrd.appendContentsRow('body');
		objGrd.setFormatRowProperty( 0, 'size', 32);  // row height
		objGrd.setFormatRowProperty( 1, 'size', 32);
		let iCellCunt = objGrd.getCellCount('head');
		for (let i in oGcols) {
			let gCol = oGcols[i];
			objGrd.setFormatColProperty(i, 'size', gCol.width);  // cell width
			
			if (i < iCellCunt) { continue; }
			objGrd.appendContentsCol();  // append column
		}
		for (let i in oGcols) {
			let gCol = oGcols[i];
			if (gCol.cssclass) {
				objGrd.setCellProperty('body', i, 'cssclass'   ,          gCol.cssclass );
			}
			if (gCol.bind    ) {
				objGrd.setCellProperty('body', i, 'text'       , 'bind:'+ gCol.bind     );
				objGrd.setCellProperty('body', i, 'tooltiptext', 'bind:'+ gCol.bind     );
			}
		}
			
		objGrd.mergeCell(1, 2, -1, -1);   //헤더 체크박스 제외 머지
		objGrd.setCellProperty('head', 0, 'displaytype'       , 'checkboxcontrol');
		objGrd.setCellProperty('head', 0, 'edittype'          , 'checkbox'       );
		objGrd.setCellProperty('head', 0, 'checkboxfalsevalue', '0'              );
		objGrd.setCellProperty('head', 0, 'checkboxtruevalue' , '1'              );
		objGrd.setCellProperty('head', 0, 'text'              , '0'              );
		objGrd.setCellProperty('head', 1, 'text'              , 'Select all'     );
		objGrd.setCellProperty('head', 1, 'textAlign'         , 'left'           );

		objGrd.setCellProperty('body', 0, 'displaytype'       , 'checkboxcontrol');
		objGrd.setCellProperty('body', 0, 'edittype'          , 'checkbox'       );
		objGrd.setCellProperty('body', 0, 'checkboxfalsevalue', '0'              );
		objGrd.setCellProperty('body', 0, 'checkboxtruevalue' , '1'              );
		objGrd.setCellProperty('body', 1, 'textAlign'         , 'center'         );
		objGrd.setCellProperty('body', 2, 'textAlign'         , 'left'           );
		
		objGrd.set_autosizingtype('col');
		//objGrd.set_autosizingtype('none');
		objGrd.set_scrollbarsize(10);
		objGrd.show();

		if (!objGrd.getEventHandler('onheadclick', 0)) { objGrd.addEventHandler ('onheadclick', form.MultiComboGrid_EventOnheadclick, form); }
		if (!objGrd.getEventHandler('oncellclick', 0)) { objGrd.addEventHandler ('oncellclick', form.MultiComboGrid_EventOncellclick, form); }
		
		objGrd.set_enableevent (true);
		objGrd.set_enableredraw(true);
		
	}
	
	// 3.2. 데이터 바인딩 후 MultiCombo Renderring
	mCombo._innerdataset = form[mCombo.innerdataset];
	form.MultiCombo_Renderring(mCombo);  // MultiCombo Renderring
		
	// 4. MultiCombo Event
	if (!mCombo.getEventHandler('ondropdown', 0)) { mCombo.addEventHandler('ondropdown', form.MultiCombo_EventOndropdown, form); }
	//mCombo._innerdataset = form[mCombo.innerdataset];
	
	// 5.   MultiCombo Setter
	// 5.1. MultiCombo Setter (Array - Value)
	if (!mCombo.setValues) {
		mCombo.setValues = function(a) {
			if (!a) { return; }
			if (typeof a === 'string') { a = a.split(','); }
			if (!Array.isArray(a)) { return; }
			if (!this._innerdataset) { return; }
			
			//let sFilter = '"'+ a.toString() +'".indexOf('+ this.codecolumn +')>-1';
			//this._oDataset.filter(sFilter);
			let ds = mCombo.combodataset||this._innerdataset;
			if (ds && ds.getRowCount() > 0) {
				//wms.eventOff(ds);
				for (let i = 0; i<ds.getRowCount(); i++) {
					let v = ds.getColumn(i, this.codecolumn);
					ds.setColumn(i, this.checkcolumn, v && a.includes(v) ? '1' : '0');
				}
				if (mCombo.popupdiv.grid) {
					mCombo.popupdiv.grid.syncCheckAll(mCombo.checkcolumn);
				}
				
				//wms.eventOn(this._oDataset);
			}
			let evtId = 'oncloseup';
			if (mCombo.popupdiv[evtId]) {  // if (mCombo.popupdiv.getEventHandler(evtId, 0)) {
				mCombo.popupdiv[evtId].fireEvent(mCombo.popupdiv, evtId);
			}
			//ds.filter('');
		}
	}

	// 5.2. MultiCombo Setter (String)
	if (!mCombo.set_returnvalue) {
		mCombo.set_returnvalue = function(s) {
			this.setValues(s);
		};
	}
	
	// 5.3. MultiCombo Setter (Array)
	if (!mCombo.set_selectedValues) {
		mCombo.set_selectedValues = function(a) {
			this.setValues(a);
		};
	}
	
};

// MultiCheck 콤보박스 랜더링
pForm.MultiCombo_Renderring = function(obj) {
	if (obj.uSelecttype != 'M') { return; }
	let oCombo = obj, oPdiv = obj.popupdiv, oGrid = obj.popupdiv.grid;
	
	let fTopGap = 10;
	let ngScrollWidth = oGrid.scrollbarsize;
	
	let ncRowCount    = oCombo.displayrowcount;
	let ngRowCount    = oGrid.getBindDataset().getRowCount(); ngRowCount    = ngRowCount > ncRowCount ? ncRowCount : ngRowCount;
	let mxRowCount    = Math.max(ncRowCount, ngRowCount)    , mnRowCount    = Math.min(ncRowCount, ngRowCount);
	let ngHeadHeight  = oGrid.getRealRowSize(-1);
	let ngBodyHeight  = oGrid.getRealRowSize( 0);
	let ngHeight      = ngHeadHeight + (ngBodyHeight * ncRowCount);  // trace('[ngHeadHeight:'+ ngHeadHeight +'][ngBodyHeight:'+ ngBodyHeight +']  [ncRowCount:'+ ncRowCount +'][ngRowCount:'+ ngRowCount +']');
	if (ngRowCount < ncRowCount && ngRowCount > -1) {
		//ncRowCount    = oCombo.displayrowcount;
		ncRowCount      = ngRowCount;
		ngScrollWidth = 0;
		
		ngHeight = ngHeadHeight + (ngBodyHeight * ncRowCount);
	} else {
		ngScrollWidth = oGrid.scrollbarsize;
	}
	oPdiv.set_height(ngHeight + fTopGap + 2);  // 2 = top/bottom border pixel
	// trace ('[combo:'+ oCombo.name +'][ncWidth:'+ ncWidth +'] [ngWidth:'+ ngWidth +'][ngColsWidth:'+ ngColsWidth +'][ngScrollWidth:'+ ngScrollWidth +']');

	let ncWidth       = oCombo.getOffsetWidth();
	let ngWidth       = oGrid.getOffsetWidth();
	let ngColsWidth   = oGrid.getRealColFullSize();  // 그리드 전체 컬럼 사이즈
	let mxWidth = Math.max(ncWidth, ngWidth, ngColsWidth+ngScrollWidth);  // trace ('[mxWidth:'+ mxWidth +']');
	oGrid.set_width(mxWidth);          // oGrid.set_right(mxWidth);
	ngWidth = oGrid.getOffsetWidth();
	
	let ngCol0W     = oGrid.getRealColSize( 0)   ;  // 첫번째 컬럼 사이즈: checkbox
	let ngCol1W     = oGrid.getRealColSize( 1)   ;  // 두번째 컬럼 사이즈: code
	let ngCol2WOrgl = oGrid.getRealColSize( 2)   ;  // 세번째 컬럼 사이즈: value
	let ngCol2WCalc = mxWidth - ngCol0W - ngCol1W;  
	let ngCol2W     = Math.max(ngCol2WOrgl, ngCol2WCalc);
	
	oGrid.setRealColSize('body', 2, ngCol2W - ngScrollWidth);
	ngColsWidth = oGrid.getRealColFullSize();
	
	oPdiv.set_width(ngColsWidth + ngScrollWidth + 2);  // trace ('[ngCol0W:'+ ngCol0W +'][ngCol1W:'+ ngCol1W +'] [ngCol2WOrgl:'+ ngCol2WOrgl +'][ngCol2WCalc:'+ ngCol2WCalc +'] [ngCol2W:'+ ngCol2W +']  [oGrid.width:'+ oGrid.width +'] [oPdiv.width:'+ oPdiv.width +']');
};

// 콤보박스를 MultiCheck 콤보박스로 랜더링
pForm.MultiCombo_EventOndropdown = function(obj, e) {  // obj:nexacro.Combo, e:nexacro.EventInfo)
	if (obj.uSelecttype != 'M') { return; }
	let oForm = this, oCombo = obj, oPdiv = obj.popupdiv, oGrid = obj.popupdiv.grid;
	
	oForm.MultiCombo_Renderring(oCombo);  // MultiCheck 콤보박스 랜더링
	
	oCombo.set_text(oCombo.displaynulltext||'Select');
	oPdiv.trackPopupByComponent(oCombo, 0, oCombo.height);
};

pForm.MultiCombo_EventOndropdownOrgl = function(obj, e) {  // obj:nexacro.Combo, e:nexacro.EventInfo)
	if (obj.uSelecttype != 'M') { return; }
	
	// PopupDiv + Grid 사이즈 조절
	//obj.initComponent(this);
	let oCombo = obj, oPdiv = obj.popupdiv, oGrid = obj.popupdiv.grid;
	let ngScrollSize   = oGrid.scrollbarsize;
	let ncDisplayCount = obj.displayrowcount;
	let ncWidth        = oCombo.getOffsetWidth()-2;
	let ngWidth        = oGrid.getRealColFullSize() + ngScrollSize;
	let ngRowCount     = oGrid.getBindDataset().getRowCount();
	//oPdiv.set_width(ngWidth + (nComboSize > ngWidth && ngRowCount > ncDisplayCount ? ngScrollSize + 20 : 0));
		
	// Height
	if (ngRowCount <= ncDisplayCount) {
		var ngHeadHeight = oGrid.getRealRowSize(-1);
		var ngBodyHeight = oGrid.getRealRowSize( 0);
		
		var pDivHeight = ngHeadHeight + (ngBodyHeight * ngRowCount) + 2;
		oPdiv.set_height(pDivHeight);
		
		oCombo.set_displayrowcount(ngRowCount);
		ngScrollSize = 0;
	}
	oGrid.set_right(ngScrollSize*2*-1);
	
	// Width
	let nMxWidth = -1;
	ncWidth  = oCombo.getOffsetWidth()-2;
	ngWidth  = oGrid.getRealColFullSize() + oGrid.scrollbarsize;
	nMxWidth = ngWidth > ncWidth ? ngWidth : ncWidth;
	
	//oPdiv.set_width(nMxWidth + ngScrollSize);  oPdiv.show();  //  + (ngRowCount > ncDisplayCount ? ngScrollSize : 0)
	oGrid.set_width(nMxWidth);  oGrid.show();  //  - (ngRowCount > ncDisplayCount ? ngScrollSize : 0));  oGrid.show();
	
	let ngBody0W = oGrid.getRealColSize( 0);
	let ngBody1W = oGrid.getRealColSize( 1);
	let ngBody2W = oGrid.getRealColSize( 2);
	let ngBody2OrglW = ngBody2W, ngBody2CalcW = nMxWidth - (ngBody0W + ngBody1W - ngScrollSize);
	ngBody2CalcW = ngBody2OrglW >= ngBody2CalcW ? ngBody2OrglW : ngBody2CalcW;
	//oGrid.setRealColSize('body', 2, ngBody2CalcW);
	if (ngBody2OrglW < ngBody2CalcW) {
		oGrid.setRealColSize('body', 2, ngBody2CalcW - (ngScrollSize*2));
	}
	
	ncWidth  = oCombo.getOffsetWidth()-2;
	ngWidth  = oGrid.getRealColSize( 0) + oGrid.getRealColSize( 1) +  oGrid.getRealColSize( 2);
	nMxWidth = ngWidth > ncWidth ? ngWidth : ncWidth+2;
	oPdiv.set_width(oGrid.width + (ngScrollSize*2));  oPdiv.show();
	// /PopupDiv + Grid 사이즈 조절
	
	obj.set_text(oCombo.displaynulltext||'Select');
	obj.popupdiv.trackPopupByComponent(obj, 0, obj.height);
	
}

// MultiCombo > PopupDiv Closeup
pForm.MultiComboPopupDiv_EventOncloseup = function(obj, e) {  // obj:nexacro.PopupDiv, e:nexacro.EventInfo
	var objDs    = obj.uParam.dataset;
	var objCombo = obj.uParam.combo;

	let aTxts=[], aVals=[];
	for (let i=0; i<objDs.getRowCount(); i++) {
		if (objDs.getColumn(i, objCombo.checkcolumn) == '1') {
			aTxts.push(objDs.getColumn(i, obj.uParam.datacolumn));
			aVals.push(objDs.getColumn(i, obj.uParam.codecolumn));
		}
	}

	var sComboText  = aTxts.toString();
	var sComboValue = aVals.toString();
	this.MultiCombo_setText(obj.uParam, aTxts, aVals);

	var objFn = objCombo.getEventHandler('oncloseup', 0);
	if (!this.gfnIsNull(objFn)) {
		var objEvent = new nexacro.ComboCloseUpEventInfo(); // 이벤트객체 생성
		objEvent.posttext  = sComboText
		objEvent.postvalue = sComboValue

		//call 호출시 this 전달 필요
		objFn.call(this, objCombo, objEvent);
	}
};

// MultiCombo > setComboText
pForm.MultiCombo_setText = function(uParam, aTxts, aVals) {
	let sComboText = aTxts.toString();
	uParam.combo.returntext = sComboText;
	uParam.combo.retrunvalue = aVals.toString();
	let objTextSize = nexacro.getTextSize(sComboText, 'normal 14px/normal "Verdana,Malgun Gothic"');
	
	uParam.combo.selectedTexts  = aTxts;
	uParam.combo.selectedValues = aVals;
	
	//콤보에 속성값 지정되어 있을 시 Text 표현 안됨. 속성해제
	uParam.combo.set_innerdataset('');
	uParam.combo.set_codecolumn('');
	uParam.combo.set_datacolumn('');

	// Text가 표현되는 combo edit 크기
	// combo width - combo drop button size - padding
	let nComboTextWidth = uParam.combo.getOffsetWidth() - uParam.combo.getOffsetHeight() - 10;
// 	if (nComboTextWidth < objTextSize.nx){
// 		uParam.combo.set_text(aTxts.length+'개 ' + (uParam.combo.displaynulltext||'Select'));
// // 		uParam.combo.set_tooltiptext(sComboText);
// // 		uParam.combo.set_tooltiptype('hover');
// 	}
// 	else{
// 		uParam.combo.set_text(sComboText);
// 	}
	
	uParam.combo.set_text(sComboText);
	// uParam.combo.set_displaynulltext(sComboText||uParam.combo.displaynulltext||'Select');
	uParam.combo.set_tooltiptext(sComboText);
	uParam.combo.set_tooltiptype('hover');

	if (this.gfnIsNull(aTxts)) uParam.combo.set_text( uParam.combo.displaynulltext||'Select' );

	// 속성지정
	uParam.combo.set_innerdataset(uParam.innerds);
	uParam.combo.set_codecolumn(uParam.codecolumn);
	uParam.combo.set_datacolumn(uParam.datacolumn);
};

// MultiCombo > PopupDiv > Grid > Head Click
pForm.MultiComboGrid_EventOnheadclick = function(obj, e) {  // obj:nexacro.Grid, e:nexacro.GridClickEventInfo
	let grid = obj, area = 'head';  //, sType = grid.getCellProperty(area, e.cell, 'displaytype');
	// [2024.01.30] 콤보박스 그리드는 Row 클릭시 처리
	//if (sType != 'checkboxcontrol') { return; }
	
	let chkCol  = grid.checkcolumn||'chk', chkColIdx = grid.getBindCellIndex('body', chkCol);
	//console.log( 'MultiComboGrid_EventOnheadclick > Before > '+ grid.getCellProperty(area, chkColIdx, 'text') );
	let [tChkVal, fChkVal] = grid.getCheckValues(area);  // grid.getCheckValues('body', 'chk');
	let chkCrVl = grid.getCellProperty(area, chkColIdx, 'text')||fChkVal, chkNtVl = chkCrVl != tChkVal ? tChkVal : fChkVal;
	grid.setCellProperty(area, chkColIdx, 'text', chkNtVl);
	
	grid.checkAll( chkCol );
	//console.log( 'MultiComboGrid_EventOnheadclick > After > '+ grid.getCellProperty(area, chkColIdx, 'text') );
}

pForm.MultiComboGrid_EventOncellclick = function(obj, e) {  // obj:nexacro.Grid,e:nexacro.GridClickEventInfo)
	let grid = obj, area = 'body';  //, sType = obj.getCellProperty('head', e.cell, 'displaytype');
	// [2024.01.30] 콤보박스 그리드는 Row 클릭시 처리
	//if (sType != 'checkboxcontrol') { return; }
	
	let ridx     = e.row, objCombo = grid.parent.parent.uParam;
	let chkCol   = objCombo.checkcolumn||'chk', chkColIdx = grid.getBindCellIndex('body', chkCol);  // let idxChk = this.getBindCellIndex('body', chkColNm);
	
	if (e.cell != chkColIdx) {
		let ds = grid.getBindDataset();
		let [tChkVal, fChkVal] = grid.getCheckValues(area);  // grid.getCheckValues('body', 'chk');
		let cVal = ds.getColumn(ridx, chkCol)||fChkVal, nVal = cVal != tChkVal ? tChkVal : fChkVal;
		ds.setColumn(ridx, chkCol, nVal);
	}
	grid.syncCheckAll( chkCol );
};


pCombo = null; delete pCombo;
pForm  = null; delete pForm ;

