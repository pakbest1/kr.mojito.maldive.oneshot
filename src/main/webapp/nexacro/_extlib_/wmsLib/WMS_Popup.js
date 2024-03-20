/**
 *  SVC-WMS Common Popup Library
 *  @FileName 	  WMS_MultiCombo.js
 *  @Creator 	  SVC-WMS
 *  @CreateDate   2023/11/30
 *  @Desction
 ************** 소스 수정 이력 ***********************************************
 *  date        Modifier         Description
 *******************************************************************************
 * 2023/11/30   SVC-WMS          Common Popup Library
 *******************************************************************************
 */
var pForm = nexacro.Form.prototype;

pForm._popupWms = {
	notice    : { id: 'WMS_Notice'   , name: 'Notice'    , url: 'common::WmsNoticePopup.xfdl'    },
	contactus : { id: 'WMS_ContactUs', name: 'Contact Us', url: 'common::WmsContactUsPopup.xfdl' },

	user: { id: 'WMS_User', name: 'WMS User', url: 'common::COM001.xfdl' },
	part: { id: 'WMS_Part', name: 'WMS Part', url: 'common::WmsPartPopup.xfdl' },
	dc  : { id: 'WMS_DC'  , name: 'WMS DC'  , url: 'common::COM004.xfdl'   },
	loc : { id: 'WMS_LOC' , name: 'WMS LOC' , url: 'common::COM002.xfdl'  	   },
	mat : { id: 'WMS_MAT' , name: 'WMS MAT' , url: 'common::COM003.xfdl'  	   },
	pwchange : { id: 'WMS_PwChange' , name: 'WMS_PwChange' , url: 'common::COM005.xfdl'  	   },
	userConfig : { id: 'WMS_userConfig' , name: 'WMS_userConfig' , url: 'common::COM006.xfdl'  	   },
	printer : { id: 'WMS_Printer' , name: 'WMS_Printer' , url: 'common::COM008.xfdl'  	   },
	noticeList : { id: 'WMS_noticeList' , name: 'WMS_noticeList' , url: 'PC_SYS::SYS054.xfdl'  	   },
	noticeUserList : { id: 'WMS_noticeUserList' , name: 'WMS_noticeUserList' , url: 'PC_SYS::SYS056.xfdl'  	   },
	mLoc : { id: 'WMS_mLoc' , name: 'WMS_mLoc' , url: 'common::MOM702.xfdl'  	   },
	mMat : { id: 'WMS_mMat' , name: 'WMS_mMat' , url: 'common::MOM703.xfdl'  	   },
	mPrt : { id: 'WMS_mPrt' , name: 'WMS_mPrt' , url: 'common::COM008.xfdl'  	   },
	mCop : { id: 'WMS_mCop' , name: 'WMS_mCop' , url: 'common::COM007.xfdl'  	   },
};

pForm.popupWmsOpen = function(oRole, oArgs, fClbk, sTitle, oOpts) {
	if (!oRole) { return; }
	
	let _clbk = null;
	if (fClbk) {
		_clbk = 'function' == typeof fClbk ? fClbk : ('string'  == typeof fClbk && this[fClbk] ? this[fClbk] : _clbk);
	}
	
	var oOpts = Object.assign({}, {
		//  top:100
		//, left:100			//top,left 지정하지않음 center,middle 적용
		//, width:700
		//, height:394			//width,height 지정하지 않음 popup form size적용
		//, 
		  popuptype : 'modal'	//modal,modaless
		, title     : sTitle||oRole.name
		, titlebar  : false
		, autosize  : true
		, resize    : false
	}, oOpts);
	
	if (oArgs) {
		oArgs['pTitletext'] = oOpts['title'];
		oArgs._parametersArray = Object.keys(oArgs);
	}
	
	if (nexacro.isMobile) {  // [2024.03.20] sg.park - WMS Mobile 처리용
		let mWidthGap = 20, mHeightGap = 58, ownf = this.getOwnerFrame();
		let baseX = system.navigatorname == 'nexacro' ? nexacro.getApplication().mainframe.left : window.screenLeft;
		let baseY = system.navigatorname == 'nexacro' ? nexacro.getApplication().mainframe.top  : window.screenTop ;
		
		Object.assign(oOpts, {
			left        : baseX,
			top         : baseY + mHeightGap,
			width       : ownf.width,
			height      : ownf.height - mHeightGap,
			autosize    : false,
			resizable   : false,
			layered     : false,
			dragmovetype: 'none',
			overlaycolor: 'rgba(0,0,0,0)',
			openalign   : 'center bottom',
			modalType   : 'center',
			opacity     : 1,
		});
	}
	this.gfnOpenPopup(oRole.id, oRole.url, oArgs, _clbk, oOpts);
}

pForm.popupWmsModalessOpen = function(oRole, oArgs, fClbk, sTitle, oOpts) {
	return this.popupWmsOpen(oRole, oArgs, fClbk, sTitle, Object.assign({}, oOpts, { popuptype: 'modaless' }));
};

pForm.popupWmsNotice = function(oArgs, fClbk, sTitle) {
	this.popupWmsOpen(this._popupWms.notice, oArgs, oArgs.callback||fClbk, sTitle);
};
pForm.popupContactUs = function(oArgs, fClbk, sTitle) {
	this.popupWmsOpen(this._popupWms.contactus, oArgs, oArgs.callback||fClbk, sTitle);
};

pForm.popupWmsUser = function(oArgs, fClbk, sTitle) {
	this.popupWmsOpen(this._popupWms.user, oArgs, oArgs.callback||fClbk, sTitle);
};
pForm.popupWmsPart = function(oArgs, fClbk, sTitle) {
	this.popupWmsOpen(this._popupWms.part, oArgs, oArgs.callback||fClbk, sTitle);
};
pForm.popupWmsDC   = function(oArgs, fClbk, sTitle) {
	this.popupWmsOpen(this._popupWms.dc, oArgs, oArgs.callback||fClbk, sTitle);
};
pForm.popupWmsLOC  = function(oArgs, fClbk, sTitle) {
	this.popupWmsOpen(this._popupWms.loc, oArgs, oArgs.callback||fClbk, sTitle);
};
pForm.popupWmsMAT  = function(oArgs, fClbk) {
	this.popupWmsOpen(this._popupWms.mat, oArgs, oArgs.callback||fClbk);
};
pForm.popupWmsPwChage  = function(oArgs, fClbk, sTitle) {
	this.popupWmsOpen(this._popupWms.pwchange, oArgs, oArgs.callback||fClbk, sTitle);
};
pForm.popupWmsUserConfig  = function(oArgs, fClbk, sTitle) {
	this.popupWmsOpen(this._popupWms.userConfig, oArgs, oArgs.callback||fClbk, sTitle);
};
pForm.popupWmsPrinter  = function(oArgs, fClbk, sTitle) {
	this.popupWmsOpen(this._popupWms.printer, oArgs, oArgs.callback||fClbk, sTitle);
};
pForm.popupWmsNoticeList  = function(oArgs, fClbk, sTitle) {
	this.popupWmsOpen(this._popupWms.noticeList, oArgs, oArgs.callback||fClbk, sTitle);
};
pForm.popupWmsNoticeUserList  = function(oArgs, fClbk, sTitle) {
	this.popupWmsOpen(this._popupWms.noticeUserList, oArgs, oArgs.callback||fClbk, sTitle);
};
pForm.popupWmsPrt  = function(oArgs, fClbk, sTitle) {
	this.popupWmsOpen(this._popupWms.mPrt, oArgs, oArgs.callback||fClbk, sTitle);
};
pForm.popupWmsCop  = function(oArgs, fClbk, sTitle) {
	this.popupWmsOpen(this._popupWms.mCop, oArgs, oArgs.callback||fClbk, sTitle);
};
// --모바일 공통 팝업--
pForm.popupWmsMLoc  = function(oArgs, fClbk, sTitle) {
	this.popupWmsOpen(this._popupWms.mLoc, oArgs, oArgs.callback||fClbk, sTitle);
};
pForm.popupWmsMMat  = function(oArgs, fClbk, sTitle) {
	this.popupWmsOpen(this._popupWms.mMat, oArgs, oArgs.callback||fClbk, sTitle);
};
pForm.getPopupParameters = function(form, oTitle) {
	let tfrm = form||this;
	let pfrm = tfrm instanceof nexacro.Form && this == tfrm ? tfrm.getOwnerFrame() : (tfrm instanceof nexacro.ChildFrame ? tfrm : null);
	if (!pfrm) { return null; }
	
	tfrm.parameters = {};
	if (pfrm._parametersArray) {
		// tfrm.parameters = {};
		for (let i in pfrm._parametersArray) {
			let k = pfrm._parametersArray[i], v = pfrm[k];
			tfrm.parameters[k] = v;
		}
	}
	tfrm.parameters.selecttype  = tfrm.parameters.selecttype || 'row';
	tfrm.parameters.pSelecttype = tfrm.parameters.selecttype || tfrm.parameters.pSelecttype || 'row';
	
	// PopUp 공통처리 : form 일땐 안되고, this 일땐 되네
	if (tfrm.parent.titletext) {
		if (oTitle && oTitle instanceof nexacro.Static) { oTitle.set_text( tfrm.parent.titletext ); }
	}
	// PopUp 공통처리
	
	return tfrm.parameters;
}






/**
 * @class alert
 * @param s 메세지
 * @param t 타이틀
 * @param strMsg 메시지 파라미터 ("a|b")
 * @return N/A
 * @example [1] this.alert('메세지를 표시함');
 * @example [2] this.alert('메세지를 표시함', '타이틀');
 * @example [3] this.alert('메세지를 표시함', '타이틀' , ["MenuNm1","MenuNm2"] );  
 */
pForm.alert = pForm._alert = function(ctnt, aArg, tile, typ) {
    var objApp = nexacro.getApplication();  
	var strMsg = this.gfn_GetMsg(ctnt, aArg)||ctnt;
	trace("strMsg====="+strMsg);
	
	var sActs = 'Alert', sClbk = sActs+'Clbk';
	var oArgs = { paramContents: strMsg, paramType: this.gfnIsNull(typ) ? 'INF' : typ, paramButton: [], paramRtn: []};
	//var oArgs = { paramContents: this.gfnIsNull(sMsg) ? ctnt : sMsg, paramType: this.gfnIsNull(typ) ? 'INF' : typ, paramButton: [], paramRtn: []};
	var oOpts = { titlebar: false, title: this.gfnIsNull(tile) ? 'Alert' : tile, url: 'common::Alert.xfdl', };
	this[sClbk] = function(sPopId, rtn) {};
	
// 	let url = 'common::Alert.xfdl';
// 	//let url = nexacro.isMobile ? 'common::M_Alert.xfdl' : 'common::Alert.xfdl'; // Desktop / Mobile 기능화면 분리
	if (nexacro.isMobile) {  // [2024.03.20] sg.park - WMS Mobile 처리용
		let mWidthGap = 20, mHeightGap = 58, ownf = this.getOwnerFrame();
		let baseX = system.navigatorname == 'nexacro' ? nexacro.getApplication().mainframe.left : window.screenLeft;
		let baseY = system.navigatorname == 'nexacro' ? nexacro.getApplication().mainframe.top  : window.screenTop ;
		
		Object.assign(oOpts, {
			url         : 'common::M_Alert.xfdl',
			left        : baseX,
			top         : baseY + mHeightGap,
			width       : ownf.width  - (mWidthGap*2),
			height      : 210, //ownf.height - mHeightGap,
			autosize    : false,
			resizable   : false,
			layered     : false,
			dragmovetype: 'none',
			overlaycolor: 'rgba(0,0,0,0.5)',
			openalign   : 'center middle',
			modalType   : 'center',
			opacity     : 1,
		});
	}
	this.gfnOpenPopup('Alert', oOpts.url, oArgs, sClbk, oOpts);
};
pForm.alertError                   = function(ctnt, aArg, tile) { this.alert(ctnt, aArg, tile||'Error'  , 'ERR'); };
pForm.alertWarning                 = function(ctnt, aArg, tile) { this.alert(ctnt, aArg, tile||'Warning', 'WAN'); };
pForm.alertSuccess = pForm.alertOk = function(ctnt, aArg, tile) { this.alert(ctnt, aArg, tile||'Success', 'SCC'); };
 
/**
 * @class confirm
 * @param s 메세지
 * @param t 타이틀
 * @param strMsg 메시지 파라미터 ("a|b")
 * @return N/A
 * @example [1] this.confirm('이거 출력되면 퇴근가능?', null, '물어보살', function(sPopId, sReturn){ if('Y'==sReturn) { alert('Ye~~~~'); } else if('N'==sReturn) { alert('Nooo~~~~'); } else { alert('그래도 대답은 합시다'); } });
 */
pForm.confirm = pForm._confirm = function(ctnt, aArg, tile, typ, clbk, aBtnNms, aBtnCds) {
	aBtnNms = aBtnNms||['Yes', 'No'];
	aBtnCds = aBtnCds||['Y', 'N'];
	
    var objApp = nexacro.getApplication();  
	var strMsg = this.gfn_GetMsg(ctnt, aArg)||ctnt;
	trace("strMsg====="+strMsg);
	
	var sActs = 'Confirm', sClbk = sActs+'Clbk';
	var oArgs = { paramContents: strMsg, paramType: this.gfnIsNull(typ) ? 'INF' : typ, paramButton: aBtnNms, paramRtn: aBtnCds};
	var oOpts = { url: 'common::Confirm.xfdl', titlebar: false, title: this.gfnIsNull(tile) ? 'Confirm' : tile, };
	
	if (clbk && 'string' == typeof clbk && 'function' == typeof this[clbk]) {
		sClbk = clbk;
	} else 
	if (clbk && 'function' == typeof clbk) {
		this[sClbk] = clbk;
	} else {
		sClbk = null;
	}
	
	if (nexacro.isMobile) {  // [2024.03.20] sg.park - WMS Mobile 처리용
		let mWidthGap = 20, mHeightGap = 58, ownf = this.getOwnerFrame();
		let baseX = system.navigatorname == 'nexacro' ? nexacro.getApplication().mainframe.left : window.screenLeft;
		let baseY = system.navigatorname == 'nexacro' ? nexacro.getApplication().mainframe.top  : window.screenTop ;
		
		Object.assign(oOpts, {
			url         : 'common::Confirm.xfdl',
			left        : baseX,
			top         : baseY + mHeightGap,
			width       : ownf.width  - (mWidthGap*2),
			height      : 210, //ownf.height - mHeightGap,
			autosize    : false,
			resizable   : false,
			layered     : false,
			dragmovetype: 'none',
			overlaycolor: 'rgba(0,0,0,0.5)',
			openalign   : 'center middle',
			modalType   : 'center',
			opacity     : 1,
		});
	}
	this.gfnOpenPopup('Confirm', oOpts.url, oArgs, sClbk, oOpts);
};
pForm.confirmInfo    = function(ctnt, aArg, tile, clbk) { this._confirm(ctnt, aArg, tile, 'INF', clbk); };
pForm.confirmCaution = function(ctnt, aArg, tile, clbk) { this._confirm(ctnt, aArg, tile, 'WAN', clbk); };
//pForm.confirmWarning = function(ctnt, aArg, clbk) { this._confirm(ctnt, 'Warning', 'WAN', clbk); };
//pForm.confirmSuccess = pForm.confirmOk = function(ctnt, aArg, tile, clbk) { this._confirm(ctnt, aArg, tile, 'SCC', clbk); };



/**
* 메세지의 키값에 따른 메세지값 찾기
* @param {String} strCode	메시지 코드
* @param {String} strMsg	메시지 파라미터 ("a|b")
* @return{String} rtnVal	메시지 스트링
*/
pForm.gfn_GetMsg = function(strCode, strMsg) 
{
	var rtnVal;
	var bMsgType;
	var strMsgTx;
	var arrMsgTx;	
	var strMsgKn;	
	var strParam = new String(strMsg);
	var objApp = nexacro.getApplication();
	
	var nFIdx = objApp.gds_MultiLang.findRow("messageCd", strCode);	
	if(nFIdx == -1) {
		nFIdx = objApp.gds_DefaultLang.findRow("messageCd", strCode);
		if(nFIdx == -1) {
			this.gfn_ImsiAddDomain(strCode, nFIdx); // 임시 적용
			trace("메시지코드 에러..메시지 관리에서 등록하세요..Code : " + strCode);
			strMsgTx = strCode;
		} else {
			strMsgTx = objApp.gds_DefaultLang.getColumn(nFIdx, "message");
		}
	} else {
		strMsgTx = objApp.gds_MultiLang.getColumn(nFIdx, "message");
	}
	
	if(this.gfnIsNull(strMsgTx)) {
		strMsgTx = strParam;
	} 
	
	// Message Convert
	var strIdx;
	if (strMsgTx.replace) {
		strMsgTx=strMsgTx.replace("\\r","");
		strMsgTx=strMsgTx.replace("\\n",String.fromCharCode(13) + String.fromCharCode(10));
	}
	if(this.gfnIsNull(strParam)) {
		// strMsgTx = 
	} else {		
		arrMsgTx = strParam.split("|");
		for(var i=0; i<arrMsgTx.length;i++) {
			//var strIdx = "&Itm" + i.toString();
			strIdx = "%" + (i+1).toString();
			strMsgTx = strMsgTx.replace(strIdx, arrMsgTx[i]);		// %1 ---> "조회조건0"
		}
	}
	
	rtnVal = strMsgTx;
	return rtnVal;
};

// 임시 다국어 처리 Data 입력
pForm.gfn_ImsiAddDomain = function(strMsgCd, nFRow)
{
	var objApp = nexacro.getApplication();
	if(this.gfnIsNull(strMsgCd)) return;
	var objData = this.all ? this.all["_tds_Domain"] : null;
	if(objData == null) return;
	if(strMsgCd.substr(0,2) != "ch") return;
	//if(objData.findRow("MESSAGE_CD", strMsgCd) >= 0) return;
	var nRow = objData.addRow();
	objData.setColumn(nRow, "menuNm", this.parent.openMenuNm);
	objData.setColumn(nRow, "messageCd", strMsgCd);
	objData.setColumn(nRow, "messageType", "ch");
	objData.setColumn(nRow, "language", "DFT");
	objData.setColumn(nRow, "pdaUseYn", "N");
	if(nFRow >= 0) {
		objData.setColumn(nRow, "message", objApp.gds_DefaultLang.getColumn(nFRow, "message"));	
	} 
};

// /**
//  * @class ToastMessage
//  * @param s 메세지
//  * @param t 타이틀
//  */
// pForm.toast = function(opts) {
// 	return $.toast(opts);
// };


pForm=null; delete pForm;
