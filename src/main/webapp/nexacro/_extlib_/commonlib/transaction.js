//넥사크로에 정의된 Form의 Prototype 객체를 변수로 가져오기
var _pForm = nexacro.Form.prototype;

/**
 * Dataset의 값을 갱신하기 위한 서비스를 호출하고, 트랜젝션이 완료되면 콜백함수을 수행하는 함수
 * @param {string} strSvcId - 서비스 ID
 * @param {string} strSvcUrl - 서비스 호출 URL 
 * @param {string} [inData]	- input Dataset list("입력ID=DataSet ID" 형식으로 설정하며 빈칸으로 구분)
 * @param {string} [outData] - output Dataset list("DataSet ID=출력ID" 형식으로 설정하며 빈칸으로 구분)
 * @param {string} [strArg]	- 서비스 호출시 Arguments
 * @param {string} [callBackFnc] - 콜백 함수명
 * @param {boolean} [isAsync] - 비동기통신 여부 
 * @return N/A
 * @example
 * var strSvcUrl = "http://서비스URL";
 * var inData    = "inputDS=inputDS:A";
 * var outData   = "outputDS=outputDS";
 * var strArg    = "arg1=" + nexacro.wrapQuote("인자값1");
 * this.gfnTransaction("search", strSvcUrl, inData, outData, strArg, "fnCallback", true);
 * 
 * @memberOf this
 */ 
_pForm.gfnTransaction = function(strSvcId, strSvcUrl, inData, outData, strArg, callBackFnc, isAsync)
{
 
	if (this.gfnIsEmpty(strSvcId) || this.gfnIsEmpty(strSvcUrl))
	{
		trace("Error : gfnTransaction() 함수의 transaction ID 가 없습니다.");
		return false;
	}
	
	// 콜백함수 fnCallback 함수 기본값 설정
	if (this.gfnIsEmpty(callBackFnc)) callBackFnc = "fnCallback";
	
	var objDate = new Date();
	var nStartTime = objDate.getTime();
    var sStartDate = objDate.getYear()
						+"-"+String(objDate.getMonth()).padLeft(2, '0')
						+"-"+String(objDate.getDate()).padLeft(2, '0')
						+" "+String(objDate.getHours()).padLeft(2, '0')
						+":"+String(objDate.getMinutes()).padLeft(2, '0')
						+":"+String(objDate.getSeconds()).padLeft(2, '0')
						+" "+objDate.getMilliseconds();

	// Async
	if ((isAsync != true) && (isAsync != false)) isAsync = true;		//기본 비동기통신
	
	// 1. callback에서 처리할 서비스 정보 저장
	var objSvcID = { 
			svcId     : strSvcId,
			svcUrl    : strSvcUrl,
			callback  : callBackFnc,
			isAsync   : isAsync,
			startDate : sStartDate,
			startTime : nStartTime };
	
	// 2. strServiceUrl
	var strServiceUrl = strSvcUrl;
	
	// 3. strArg
	var strArguments = "";
	if (this.gfnIsEmpty(strArg)) {
		strArguments = "";
	}
	else { 
		strArguments = strArg;
	}

	var nDataType = 2;	//SSV

	this.transaction( JSON.stringify(objSvcID)  //1.svcID
					, strServiceUrl             //2.strServiceUrl
					, inData                    //3.inDataSet
					, outData                   //4.outDataSet
					, strArguments              //5.arguments
					, "_gfnCallback"			//6.strCallbackFunc
					, isAsync                   //7.bAsync
					, nDataType                 //8.nDataType : 0(XML 타입), 1((Binary 타입),  2(SSV 타입) --> HTML5에서는 Binary 타입은 지원안함
					, false);                   //9.bCompress ( default : false ) 
};

/**
 * @class 공통 Callback 함수 <br>
 * 이 함수가 먼저 수행되고 사용자지정Callback함수가 수행된다.
 * @param {string} svcID - 서비스 ID
 * @param {number} errorCode - 에러코드(정상 0, 에러 음수값)
 * @param {string} [errorMsg] - 에러메시지
 * @return N/A
 */
_pForm._gfnCallback = function(svcID,errorCode,errorMsg)
{
	var objSvcID = JSON.parse(svcID);
	
	// 에러 공통 처리
	if(errorCode != 0)
	{
		switch(errorCode)
		{
			case -1 :				
				// 서버 오류입니다.\n관리자에게 문의하세요.
				this.alert(errorMsg);
				break;
				
			case -2463215:
				//@todo : 임의 에러코드  처리
				//return false;
				break;
		}
	}

	// 서비스 실행결과 출력
	var sStartDate = objSvcID.startDate;
	var nStartTime = objSvcID.startTime;
	
	var objDate = new Date();
	var sEndDate = objDate.getYear()
					+"-"+String(objDate.getMonth()).padLeft(2, '0')
					+"-"+String(objDate.getDate()).padLeft(2, '0')
					+" "+String(objDate.getHours()).padLeft(2, '0')
					+":"+String(objDate.getMinutes()).padLeft(2, '0')
					+":"+String(objDate.getSeconds()).padLeft(2, '0')
					+" "+objDate.getMilliseconds();
	var nElapseTime = (objDate.getTime() - nStartTime)/1000;
	
	var sMsg = "";
	if (errorCode == 0)
	{
		sMsg = "\n########################################## Error #####################################################\n";
		sMsg += "gfnCallback : svcID>>"+objSvcID.svcId+ ",  svcUrl>>"+objSvcID.svcUrl+ ",  errorCode>>"+errorCode + ", errorMsg>>"+errorMsg + ", isAsync>>" + objSvcID.isAsync + ", sStartDate>>" + sStartDate + ", sEndDate>>"+sEndDate + ", nElapseTime>>"+nElapseTime+"\n";
		sMsg += "######################################################################################################";
		//trace(sMsg);		//Debug 시 주석해제
	}
	else {
		sMsg = "\n########################################## Error #####################################################\n";
		sMsg += "gfnCallback : svcID>>"+objSvcID.svcId+ ",  svcUrl>>"+objSvcID.svcUrl+ ",  errorCode>>"+errorCode + ", isAsync>>" + objSvcID.isAsync + ", sStartDate>>" + sStartDate + ", sEndDate>>"+sEndDate + ", nElapseTime>>"+nElapseTime+"\n";
		sMsg += "######################################################################################################";
		//trace(sMsg);		//Debug 시 주석해제
	}

	// 화면의 callBack 함수 실행
	if(!this.gfnIsEmpty(objSvcID.svcId))
	{
		// form에 callback 함수가 있을때
		if (this[objSvcID.callback]) this[objSvcID.callback].call(this, objSvcID.svcId, errorCode, errorMsg);
	}
};