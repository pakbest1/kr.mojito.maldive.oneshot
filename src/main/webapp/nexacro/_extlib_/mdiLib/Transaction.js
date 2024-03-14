/**
*  SVC-WMS Transaction Library
*  @FileName 	Transaction.js
*  @Creator 	SVC-WMS
*  @CreateDate 	2023/11/30
*  @Desction
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
* 2023/11/30			SVC-WMS				Transaction Library
*******************************************************************************
*/

// [2024.01.22] WMS 프로젝트 Nexacro gfnTransaction timeout 지원용 #01
var pEnvironment = nexacro.Environment.prototype;
pEnvironment._defaulthttptimeout=60;
pEnvironment.getHttptimeout = function() {
	return this._defaulthttptimeout;
};
pEnvironment.setHttptimeout = function(sec=60) {
	this.set_httptimeout(sec);
	return sec;
};
pEnvironment.resetHttptimeout = function() {
	this.setHttptimeout(this._defaulthttptimeout);
	return this._defaulthttptimeout;
}
pEnvironment = null; delete pEnvironment;
// /[2024.01.22] WMS 프로젝트 Nexacro gfnTransaction timeout 지원용 #01

var pForm = nexacro.Form.prototype;


// [2024.01.22] WMS 프로젝트 Nexacro gfnTransaction timeout 지원용 #02
pForm._defaultTransactionArgs = { _type: 'wmstransaction', async: true, silent: 'N', timeout: nexacro.Environment.prototype._defaulthttptimeout };
// /[2024.01.22] WMS 프로젝트 Nexacro gfnTransaction timeout 지원용 #02

/**
* @class 서비스 호출 공통함수 <br>
* Dataset의 값을 갱신하기 위한 서비스를 호출하고, 트랜젝션이 완료되면 콜백함수을 수행하는 함수
* @param {String}   strSvcId - 서비스 ID
* @param {String}   strSvcUrl - 서비스 호출 URL
* @param {String}  [inData]	- input Dataset list("입력ID=DataSet ID" 형식으로 설정하며 빈칸으로 구분)
* @param {String}  [outData] - output Dataset list("DataSet ID=출력ID" 형식으로 설정하며 빈칸으로 구분)
* @param {String}  [strArg]	- 서비스 호출시 Agrgument
* @param {String}  [callBackFnc] - 콜백 함수명
* @param {Boolean} [isAsync] - 비동기통신 여부
* @param {String}  [sSilent] - 공통메시지 처리여부 Y/N
* @param {int}     [iTimeoutSec] - 타임아웃 (초)
* @return N/A
* @example
* var strSvcUrl = "transactionSaveTest.do";
* var inData    = "dsList=dsList:U";
* var outData   = "dsList=dsList";
* var strArg    = "";
* this.gfnTransaction("save", strSvcUrl, inData, outData, strArg, "fnCallback", true, "N");
*/
pForm.gfnTransaction = function(strSvcId, strSvcUrl, inData, outData, strArg, callBackFnc, isAsync, sSilent, iTimeoutSec)
{
	// [2024.01.22] WMS 프로젝트 Nexacro gfnTransaction timeout 지원용 처리 #03
	if (strSvcId && 'object' === typeof strSvcId && !strSvcUrl && !inData && !outData && !strArg && !callBackFnc && !isAsync && !sSilent && !iTimeoutSec) {
		let req = Object.assign({}, this._defaultTransactionArgs, strSvcId);  // Object Deep Copy
		
		strSvcId    = req.id         ;
		strSvcUrl   = req.url        ;
		inData      = req.request    ;
		strArg      = req.requestargs;
		outData     = req.response   ;
		isAsync     = req.async      ;
		sSilent     = req.silent     ;
		callBackFnc = req.callback   ;
		iTimeoutSec = req.timeout    ;
	}
	
	if (iTimeoutSec > -1) {  // request timeout 지정
		nexacro.getEnvironment().setHttptimeout(iTimeoutSec);
	}
	// /[2024.01.22] WMS 프로젝트 Nexacro gfnTransaction timeout 지원용 처리 #03

	if (this.gfnIsNull(strSvcId) || this.gfnIsNull(strSvcUrl))
	{
		trace("Error : gfnTransaction() 함수의 인자값이 부족합니다.");
		return false;
	}
	
	// fnCallback 함수 기본값 설정
	if (this.gfnIsNull(callBackFnc))  callBackFnc = "fnCallback";
	if (this.gfnIsNull(sSilent    ))  sSilent     = "N";
	
	var objDate = new Date();
	var nStartTime = objDate.getTime   ();
	var sStartDate = objDate.getYear   ()
		+"-"+ String(objDate.getMonth  ()).padLeft(2, '0')
		+"-"+ String(objDate.getDate   ()).padLeft(2, '0')
		+" "+ String(objDate.getHours  ()).padLeft(2, '0')
		+":"+ String(objDate.getMinutes()).padLeft(2, '0')
		+":"+ String(objDate.getSeconds()).padLeft(2, '0')
		+" "+ objDate.getMilliseconds();

	// Async
	if ((isAsync != true) && (isAsync != false)) isAsync = true;
	
	// Callback 처리 - callBackFnc인자가 함수일때 사용법 지원
	let callBackFnNm = 'clbk_'+strSvcId;
	if ('string'   == typeof callBackFnc && this[callBackFnc] instanceof Function) {
		callBackFnNm = callBackFnc;
	} else
	if ('function' == typeof callBackFnc && callBackFnc       instanceof Function) {
		if (this[callBackFnNm] && callBackFnc != this[callBackFnNm]) {
			// callBackFnNm = callBackFnc == this[callBackFnNm] ? 'clbk_'+strSvcId : wms.getRndName('clbk_');  // 'clbk_'+strSvcId+'1';  //wms.getRndName('clbk_');
			callBackFnNm = wms.getRndName('clbk_');
		}
		this[callBackFnNm] = callBackFnc;
	}
	
	// 1. callback에서 처리할 서비스 정보 저장
	var objSvcID = {
			svcId     : strSvcId,
			svcUrl    : strSvcUrl,
			callback  : callBackFnNm,  // callBackFnc,
			isAsync   : isAsync,
			silent    : sSilent,
			startDate : sStartDate,
			startTime : nStartTime };
	
	// 2. strServiceUrl
	var strServiceUrl = "svc::" + strSvcUrl;
//	var strServiceUrl = "svcUrl::" + strSvcUrl;
	
	// 3. strArg
	var strArguments = "";
	if (this.gfnIsNull(strArg)) {
		strArguments = "";
	} else {
		strArguments = strArg;
	}

	// 개발 및 개발서버 에는 xml, 운영서버는 SSV로 통신
	var nDataType;
	if (nexacro.getApplication().gvRunMode == "R") {
		nDataType = 2;
	} else {
		nDataType = 0;
	}
	
	this.transaction( JSON.stringify(objSvcID)  //1.svcID
					, strServiceUrl             //2.strServiceUrl
					, inData                    //3.inDataSet
					, outData                   //4.outDataSet
					, strArguments              //5.arguments
					, "gfnCallback"				//6.strCallbackFunc
					, isAsync                   //7.bAsync
					, nDataType                 //8.nDataType : 0(XML 타입), 1((Binary 타입),  2(SSV 타입) --> HTML5에서는 Binary 타입은 지원안함
					, false);                   //9.bCompress ( default : false )

	// [2024.03.06] WMS 프로젝트 Nexacro gfnTransaction 처리 시, outData에 기술되어 있는 데이터셋 필터 초기화처리
	if (outData) {
		let dss = outData.split(' ');
		for (let i in dss) {
			let [lval, rval] = dss[i].split('='), ods = this._getDatasetObject(lval);
			if (ods && ods instanceof nexacro.Dataset) {
				let grids = this.lookupGrids('binddataset', ods.id);
				if (grids && grids.length > 0) {
					for (let grid of grids) {
						this.Grid_Filter_Reset(grid);
					}
				}
			}
		}
		// trace('response dataset filter reset');
	}
	// /[2024.03.06] WMS 프로젝트 Nexacro gfnTransaction 처리 시, outData에 기술되어 있는 데이터셋 필터 초기화처리
};

pForm.lookupComponents = function(clazz, propnm, propvl, form) {
	let r = [], comps = (form||this).components, complength = comps.length;
	for (let i=0; i<complength; i++) {
		let comp = comps[i];
		if (comp instanceof nexacro.Div && !comp.url) {
			r = r.concat(this.lookupComponents(clazz, propnm, propvl, comp.form));
		} else
		if (comp instanceof nexacro.Tab && comp.tabpages.length > 0) {
			for (var j=0; j<comp.tabpages.length; j++) {
				if (!comp.tabpages[j].url) {
					r = r.concat(this.lookupComponents(clazz, propnm, propvl, comp.tabpages[j].form));
				}
			}
		} else
		{
			if (comp instanceof clazz && comp[propnm] && comp[propnm] == propvl) {
				r = r.concat(comp);
			}
		}
	}
	
	return r.length > 0 ? r : null;
};

pForm.lookupGrids = function(propnm, propvl) {
	return this.lookupComponents(nexacro.Grid, propnm, propvl);
};


/**
* @class 공통트랜잭션 콜백
* @param {String} svcID - 서비스ID.
* @param {Number} errorCode - 에러코드.
* @param {Number} errorMsg - 에러메시지.
* @return N/A
* @example this.gfnCallback(svcID, errorCode, errorMsg);
*/
pForm.gfnCallback = function (svcID, errorCode, errorMsg)
{
	// [2024.01.22] WMS 프로젝트 Nexacro gfnTransaction timeout 지원용 처리 #04
	nexacro.getEnvironment().resetHttptimeout();  //nexacro.getEnvironment().set_httptimeout(nexacro.getEnvironment().defaulthttptimeout);
	// /[2024.01.22] WMS 프로젝트 Nexacro gfnTransaction timeout 지원용 처리 #04

	//trace("pForm.gfnCallback");
	var objSvcID = JSON.parse(svcID);

	// 서비스 실행결과 출력
	var sStartDate = objSvcID.startDate;
	var nStartTime = objSvcID.startTime;
	
	var objDate = new Date();
	var sEndDate =  objDate.getYear   ()
		+"-"+String(objDate.getMonth  ()).padLeft(2, '0')
		+"-"+String(objDate.getDate   ()).padLeft(2, '0')
		+" "+String(objDate.getHours  ()).padLeft(2, '0')
		+":"+String(objDate.getMinutes()).padLeft(2, '0')
		+":"+String(objDate.getSeconds()).padLeft(2, '0')
		+" "+objDate.getMilliseconds();
	var nElapseTime = (objDate.getTime() - nStartTime)/1000;
	
	var sMsg = "";
	// studio 실행시에만 transaction 실행 log 표시
	if (nexacro.getEnvironmentVariable("evRunMode") == "S") {
		if (errorCode == 0){
			sMsg = "gfnCallback : svcID>>"+objSvcID.svcId+ ",  svcUrl>>"+objSvcID.svcUrl+ ",  errorCode>>"+errorCode + ", errorMsg>>"+errorMsg + ", isAsync>>" + objSvcID.isAsync+ ", silent>>" + objSvcID.silent + ", sStartDate>>" + sStartDate + ", sEndDate>>"+sEndDate + ", nElapseTime>>"+nElapseTime;
			trace(sMsg);
		}else {
			sMsg = "gfnCallback : svcID>>"+objSvcID.svcId+ ",  svcUrl>>"+objSvcID.svcUrl+ ",  errorCode>>"+errorCode + ", isAsync>>" + objSvcID.isAsync + ", silent>>" + objSvcID.silent + ", sStartDate>>" + sStartDate + ", sEndDate>>"+sEndDate + ", nElapseTime>>"+nElapseTime;
			sMsg += "\n==================== errorMsg =======================\n"+errorMsg+"\n==================================================";
			trace(sMsg);
		}
	}
	
	// 에러 공통 처리
	if(errorCode != 0)
	{
		// 에러메세지에서 "ORA-" 문자열 위치 체크
		var nStart = errorMsg.indexOf("ORA-");

		switch(errorCode)
		{
			case 1:
				this.alert(errorCode+"\n"+errorMsg);
				return;
				break;
				
			case -1 :
				if (objSvcID.silent != "Y")
				{
					this.alert("서버 오류입니다.\n관리자에게 문의하세요.\n" + errorCode+"\n"+errorMsg);
				}
// 				if (objSvcID.silent != "Y" && nStart < 0)
// 				{
// 					// 서버 오류입니다.\n관리자에게 문의하세요.
// 					this.alert(errorCode+"\n"+errorMsg);
// 				} else if (nStart > 0) {
// 					var sMsg = errorMsg.substr(nStart, 9);
// 					// 데이터베이스 오류입니다. \n에러코드 : {0}.
// 					this.alert("msg.database.error", [sMsg]);
// 				}
				return;	//서버 에러 와 업무 에러 코드 분리시에 return 처리 결정
				break;
				
			case -777:
				//임의 에러코드  처리 - 사용자 화면 callback에서 에러 처리 
				break;
				
			case -888:
				//사용자 NexacroException 처리 
				this.alert(errorMsg);
				return;
				break;
				
			case -999 :
				if (objSvcID.silent != "Y")
				{
					// Session expired
					this.alert("emSessionExpired");
				}
				return;
				break;
		}
	}

	// 화면의 callBack 함수 실행 (callback실행시키지 않을 경우 gfnStopCallback 지정)
	if (!this.gfnIsNull(objSvcID.svcId) && objSvcID.callback != "gfnStopCallback")
	{
		// form에 callback 함수가 있을때
		if (this[objSvcID.callback]) this.lookupFunc(objSvcID.callback).call(objSvcID.svcId, errorCode, errorMsg);
	}
};

/**
* @class 메시지 콜백<br>
* @param {String} svcID - 서비스ID.
* @param {String} sRtn - 반환값.
* @return N/A
* @example this.alert("msg.session.timeout", [], "session", "gfnErrorMsgCallbackk");
*/
pForm.gfnErrorMsgCallbackk = function (sPopId, sRtn)
{
	switch(sPopId)
	{
		case "session":
			// 런타임과 윈도우 구분
			if(system.navigatorname == "nexacro")
			{
				if (this.name.indexOf("Pu") > 0)
				{
					this.close();
				}
				this.gfnGoLogin();
			}
			else
			{
				window.top.location.reload(true);
			}
			break;
		default: break;
	}
};

pForm = null; delete pForm;