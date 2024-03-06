/**
*  PcMdi 프로젝트 Library
*  @FileName 	Util.js
*  @Creator 	TOBESOFT
*  @CreateDate 	2023/10/30
*  @Desction
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
* 2023/10/30			TOBESOFT				Util Library
*******************************************************************************
*/

var pForm = nexacro.Form.prototype;

/**
* @class dataSet의 Row 중에서 변경된 내용이 있는지 여부
* @param {Object} objDs - 확인 대상 Dataset
* @return {boolean}
* @example this.gfnDsIsUpdated(this.dsList)
*/
pForm.gfnDsIsUpdated = function (objDs)
{
	if (objDs.getDeletedRowCount() > 0) {
		return true;
	}
	
	for(var i = 0 ; i < objDs.getRowCountNF() ; i++)
	{
		if(objDs.getRowTypeNF(i) == 2 || objDs.getRowTypeNF(i) == 4 || objDs.getRowTypeNF(i) == 8)
		{
			return true;
		}
	}
	return false;
};

/**
* @class 여러개의 dataSet Row 중에서 변경된 내용이 있는지 여부
* @param {String} datasetStr - 확인 대상 Dataset의 String 값으로 여러개인 경우 comma로 구분
* @return {boolean}
* @example this.gfnMultiDsAreUpdated("ds_master,ds_detail")
*/
pForm.gfnMultiDsAreUpdated = function(datasetStr) {
	if(!this.gfnIsNull(datasetStr) && datasetStr.length > 0) {
		var arrDs = datasetStr.split(",");
		for(var i=0; i<arrDs.length; i++){
			var ds = nexacro.trim(arrDs[i]);
			var dsObj = this.lookup(ds);
			if(dsObj !== undefined && typeof(dsObj) === "object") {
				if (dsObj.getDeletedRowCount() > 0) {
					return true;
				}
				// check insert(2)/update(4)/delete(8)
				for(var j=0; j < dsObj.rowcount; j++) {
					if ([2, 4, 8].includes(dsObj.getRowType(j))) {
						return true;
					}
				}
			}
		}
	}
	return false;
}

/************************************************************************************************
* 문자/숫자 관련 Util
************************************************************************************************/
/**
* @class null값 확인
* @param {String} sValue - 확인 대상
* @return {boolean} Null이면 true
* @example this.gfnIsNull(sValue)
*/
pForm.gfnIsNull = function(sValue)
{
	if (new String(sValue).valueOf() == "undefined") return true;
	if (sValue == null) return true;
	
	var ChkStr = new String(sValue);

	if (ChkStr == null) return true;
	if (ChkStr.toString().length == 0 ) return true;
	return false;
};

/**
* @class 입력값을 체크하여 Null인경우 지정한 값을 리턴
* @param {String} inVal
* @param {String} nullVal	- Null인경우 대치값
* @return {String} 입력값이 Null인경우 지정한값, Null이 아닌경우 입력값
* @example this.gfnNvl(nRow, 0);
*/
pForm.gfnNvl = function(inVal, nullVal)
{
	if(inVal == null) {
		inVal = nullVal;
	}
	return inVal;
};


/**
* @class 정규식을 이용한 trim 구현 - 문자열 양 옆의 공백 제거 <br>
* @param {String} sValue - 변경하려는 값
* @return {String} 문자열
* @example this.gfnTrim(sValue);
*/
pForm.gfnTrim = function(sValue)
{
	if (this.gfnIsNull(sValue)) return "";
	return nexacro.trim(sValue);
};

/**
* @class 왼쪽 문자 채우기
* @param {String} val - 문자열
* @param {String} pad - 채울 문자열(default : " "(공백) )
* @param {Number} len - 전체 문자 길이(default : 1 )
* @return {String}
* @example this.gfnLPad("1", 0, 2);
*/
pForm.gfnLPad = function(val, pad, len)
{
	var sRet = "";
	var strVal = "";

	if (this.gfnIsNull(val)) return "";
	if (this.gfnIsNull(pad)) pad = " ";
	if (this.gfnIsNull(len)) len = 1;
	
	strVal = new String(val);
	
	if( strVal.length >= len ) return strVal;

	for(var valIdx = 0; valIdx < len - strVal.length; valIdx++) {
		sRet += pad;
	}

	sRet += strVal;
	
	return sRet;
};

/************************************************************************************************
* Date 관련 Util
************************************************************************************************/

/**
* @class 현재일자를 구한다. <br>
* @param {String} [sGubn] - date/null : 일자, time : 일자+시간, milli : Milliseconds
* @param {Boolean} [bFormat] - format 지정 여부
* @return {String} 날짜및시간 문자열
* @example this.gfnGetDate()
*/
pForm.gfnGetDate = function(sGubn, bFormat)
{
	if (this.gfnIsNull(sGubn)) sGubn = "date";
	if (this.gfnIsNull(bFormat)) {
		bFormat = false;
		var sDFormat = "";
		var sTFormat = "";
		var sSplit = "";
	}
	else {
		bFormat = true;
		var sDFormat = "-";
		var sTFormat = ":";
		var sSplit = " ";
	}
	
	var s;
	
	var d = new Date();
	if (sGubn == "date") {
		s = d.getFullYear() + sDFormat
		+ ((d.getMonth() + 1) + "").padLeft(2, '0') + sDFormat
		+ (d.getDate() + "").padLeft(2, '0');
	}
	else if (sGubn == "day") {
		s = d.getFullYear() + sDFormat
		+ ((d.getMonth() + 1) + "").padLeft(2, '0') + sDFormat
		+ (d.getDate() + "").padLeft(2, '0') + sSplit
		+ this.gfnGetDayKor(d.getFullYear()+((d.getMonth() + 1) + "").padLeft(2, '0')+(d.getDate() + "").padLeft(2, '0'));
	}
	else if (sGubn == "time") {
		s = d.getFullYear() + sDFormat
		  + ((d.getMonth() + 1) + "").padLeft(2, '0') + sDFormat
		  + (d.getDate() + "").padLeft(2, '0') + sSplit
		  + (d.getHours() + "").padLeft(2, '0') + sTFormat
		  + (d.getMinutes() + "").padLeft(2, '0') + sTFormat
		  + (d.getSeconds() + "").padLeft(2, '0');
	}
	else if (sGubn == "milli") {
		s = d.getFullYear() + sDFormat
		  + ((d.getMonth() + 1) + "").padLeft(2, '0') + sDFormat
		  + (d.getDate() + "").padLeft(2, '0') + sSplit
		  + (d.getHours() + "").padLeft(2, '0') + sTFormat
		  + (d.getMinutes() + "").padLeft(2, '0') + sTFormat
		  + (d.getSeconds() + "").padLeft(2, '0') + sTFormat
		+ (d.getMilliseconds() + "").padLeft(3, '0');
	}
	return (s);
};

/**
* @class 입력된 날짜에 OffSet 으로 지정된 만큼의 날짜를 더함 <br>
* @param {String} strDate - 'yyyyMMdd' 형태로 표현된 날짜.
* @param {Number} nOffSet - 날짜로부터 증가 감소값.
* @return {String} date의 문자열 (ex. 20080821)
* @example this.gfnAddDate(sToday,-7)
*/
pForm.gfnAddDate = function(strDate, nOffSet)
{
	var date = new Date();
	
	var iYear = parseInt(strDate.substr(0, 4));
	var iMonth = parseInt(strDate.substr(4, 2) - 1);
	var iDate = parseInt(strDate.substr(6, 2)-(nOffSet*-1));
	
	date.setFullYear(iYear,iMonth,iDate);
	
	//return this.gfnDateToStr(date);
	return this.gfnGetMaskFormatDateToString(date, "yyyyMMdd");
};

/**
* @class 입력된 월에 OffSet 으로 지정된 만큼의 월을 더함
* @param {String} strDate - String Date Format
* @param {Number} OffSet - Integer Format
* @return {String} date
* @example this.gfnAddMonth(sToday, +1)
*/
pForm.gfnAddMonth = function(strDate, OffSet)
{
	var date, d, s, mon, val;

	/**
	 * @class 입력일자 해당월의 마지막 일 <br>
	 * @param {String} strMonth - 'yyyyMMdd' 형태로 표현된 날짜.
	 * @return {Number} 해당월의 마지막일자 2자리
	 */
	var gfnGetMonthLastDate = function(strMonth) {
		var iLastDay;
		var iYear  = parseInt(strMonth.substr(0, 4),10) ;
		var iMonth = parseInt(strMonth.substr(4, 2),10);
		switch(iMonth)
		{
			case 2 :
				if( ((iYear%4)==0) && ((iYear%100)!=0) || ((iYear%400)==0) )
					iLastDay = 29;
				else
					iLastDay = 28;
				break;
			case 4 :
			case 6 :
			case 9 :
			case 11 :
				iLastDay = 30;
				break;
			default:
				iLastDay = 31;
				break;
		}
		
		return iLastDay;
	};

	if (strDate) {
		date = this.gfnStrToDate(strDate);
		d = (new Date(date)).addMonth(OffSet);
	} else {
		date = this.gfnStrToDate(this.gfnGetDate());
		d = (new Date(date)).addMonth(OffSet);
	}
	
	if (gfnGetMonthLastDate(strDate) == date.getDate()) {
		var sY = new Date(d).getFullYear();
		var sM = new Date(d).getMonth();
		var eY = date.getFullYear();
		var eM = date.getMonth();
		
		mon = -((eY - sY)* 12 + (eM - sM));
		
		if (mon != OffSet) {
			val = OffSet - mon;
			d = (new Date(d)).addMonth(-1);
		}
		
		var ld = new Date((new Date(d)).getFullYear()
				, (new Date(d)).getMonth()
				// , gfnGetMonthLastDate(this.gfnDateToStr(new Date(d))));
				, gfnGetMonthLastDate(this.gfnGetMaskFormatDateToString(new Date(d), "yyyyMMdd")));
		
		s = (new Date(ld)).getFullYear()
		+ (((new Date(ld)).getMonth() + 1) + "").padLeft(2, '0')
		+ (((new Date(ld)).getDate()) + "").padLeft(2, '0');
	} else {
		s = (new Date(d)).getFullYear()
		+ (((new Date(d)).getMonth() + 1) + "").padLeft(2, '0')
		+ (((new Date(d)).getDate()) + "").padLeft(2, '0');
	}
	
	return (s);
};

/**
* @class 문자를 날짜로 변환. <br>
* @param {String} strDate - String Date Format
* @return {Date} date
* @example gfnStrToDate("20020101");
*/
pForm.gfnStrToDate = function(inDate)
{
var date =  new Date(parseInt(inDate.substr(0,4)),parseInt(inDate.substr(4,2))-1,parseInt(inDate.substr(6,2)));
return date;
};

/**
* @class 입력된 날자로부터 요일을 구함 <br>
* @param {String} strDate - 'yyyyMMdd' 형태로 표현된 날짜.
* @return {Number} 0 = 일요일 ~ 6 = 토요일. 오류가 발생할 경우 -1 Return.
* @example this.gfnGetDay("20020101");
*/
pForm.gfnGetDay = function(strDate)
{
	var date = new Date();

	var iYear = parseInt(strDate.substr(0, 4));
	var iMonth = parseInt(strDate.substr(4, 2) - 1);
	var iDate = parseInt(strDate.substr(6, 2));
	
	date.setFullYear(iYear,iMonth,iDate);
	return date.getDay();
};

/**
* @class 입력된 날자로부터 한글 요일을 구함 <br>
* @param {String} dateVal - 'yyyyMMdd' 형태로 표현된 날짜.
* @return {String} 0 = 일요일 ~ 6 = 토요일. 오류가 발생할 경우 "" Return.
* @example this.gfnGetDayKor("20020101");
*/
pForm.gfnGetDayKor = function(dateVal)
{
	var nDay = -1;
	var dayKorArray = ["일", "월", "화", "수", "목", "금", "토"];
	
	nDay = this.gfnGetDay(dateVal);
	
	if( nDay < 0 ) return "";
	
	return dayKorArray[nDay];
};

/***************************************************************************************************************
validation check용
*****************************************************************************************************************/

/**
* @class  Grid에서 expression으로  표현할때 decode 문처럼 사용할 수 있는 기능
* @param  arguments - Decode 수행할 아규먼트(가변)
* @return {String} varRtnValue - 반환된 문자열
* @example this.gfnDecode(sortInfo.status, 1, this.MARKER[0], 2, this.MARKER[1], "");
*/
pForm.gfnDecode = function ()
{
	var varRtnValue = null;

	var arrArgument = this.gfnDecode.arguments;
	var varValue = arrArgument[0];
	var bIsDefault = false;
	var nCount = 0;

	if ((arrArgument.length % 2) == 0)
	{
		nCount = arrArgument.length - 1;
		bIsDefault = true;
	}
	else
	{
		nCount = arrArgument.length;
		bIsDefault = false;
	}

	for (var i = 1; i < nCount; i += 2)
	{
		if (varValue == arrArgument[i])
		{
			varRtnValue = arrArgument[i + 1];
			i = nCount;
		}
	}

	if (varRtnValue == null && bIsDefault)
	{
		varRtnValue = arrArgument[arrArgument.length - 1];
	}

	return varRtnValue;
};

/**
* @class 컨트롤이 Dataset에 bind되어 있을 경우 즉시 value를 Dataset에 적용시킨다.
* @param N/A
* @return N/A
* @example this.gfnUpdateToDataset();
*/
pForm.gfnUpdateToDataset = function()
{
	var objComp = this.getFocus();
	
	if (objComp != null)
	{
		try
		{
			objComp.updateToDataset();
		}
		catch (e)
		{
		}
	}
};

/**
 * Object Type 구하기
 */
pForm.gfnGetObjectType = function(obj) {
	let sType = '';
	
	if ( Array.isArray(obj) ) {
		sType = 'Array';
	} else
	if ( obj instanceof nexacro.Grid ) {
		sType = 'Grid';
	} else
	if ( obj instanceof nexacro.Dataset ) {
		sType = 'Dataset';
	} else 
	if ( obj instanceof Date || typeof obj.getMonth === 'function' ) {
		sType = 'Date';
	} else
	if (typeof obj === 'function' ) {
		sType = typeof obj;
	} else {
		sType = typeof obj;
	}
	
	return sType.charAt(0).toUpperCase() + sType.slice(1);
};

/**
* @class 파라미터로 여러개의 Object 를 검사할 때 하나라도 empty 이면 true 리턴한다.
* @param {*} value 확인할 value.
* gfnIsEmpty(GRID) : binddataset 이 empty인지 검사
* gfnIsEmpty(DATASET) : rowcount 가 0 인지 검사
* gfnIsEmpty(String) : trim().length 가 0인지 검사
* gfnIsEmpty(ARRAY) : length 가 0 인지 검사
* gfnIsEmpty(object) : value 가 empty 인지 검사
* gfnIsEmpty(null) : true 리턴
* @return {boolean} empty 여부.
* @example this.gfnIsEmpty2(obj.value)
*/
pForm.gfnIsEmpty2 = function ()
{
	for (var i = 0; i < arguments.length; i++)
	{
		var obj = arguments[i];
		if (this.gfnIsNull(obj))
		{
			return true;
		}
		var objType = this.gfnGetObjectType(obj);  // nexacro._getObjectType(obj);  // 
		switch (objType)
		{
			case "Array":
				if (obj.length <= 0)
				{
					return true;
				}
				break;
			case "String":
				if (obj.trim().length <= 0)
				{
					return true;
				}
				break;
			case "Dataset":
				if (obj.rowcount <= 0)
				{
					return true;
				}
				break;
			case "Grid":
				if (obj.binddataset.rowcount <= 0)
				{
					return true;
				}
				break;
			case "Function":
			case "Boolean":
			case "Number":
			case "Date":
				//Pass
				break;
			default:
				if (this.gfnIsObject(obj))
				{
					return this.gfnIsEmpty(obj);
				}

				if (this.gfnIsEmpty2(obj.value))
				{
					return true;
				}
		}
	}
	return false;
}

/**
* @class not empty 여부 확인.
* @param {*} value 확인할 value.
* @return {boolean} empty 여부.
* @example this.gfnIsNotEmpty2(obj.value)
*/
pForm.gfnIsNotEmpty2 = function ()
{
	for (var i=0; i<arguments.length; i++)
	{
		var obj = arguments[i];
		var chk = this.gfnIsEmpty2(obj);
		if (chk)
		{
			return false;
		}
	}
	return true;
}

/**
* @class 로그 출력(실행환경이 넥사크로스튜디오, 로컬, 개발일 경우만)
* @param  {String} sMsg - 로그 출력 문자열
* @param  {String} sType - 로그 타입
* @return N/A
* @example this.gfnLog(e.message ,"error");
*/
pForm.gfnLog = function(sMsg, sType)
{
	var objApp = nexacro.getApplication();
	
	var arrLogLevel = ["debug","info","warn","error"];
	
	if (objApp.gvRunMode == "R")
	{
		return;
	}
	
	if (this.gfnIsNull(sType))
	{
		sType = "debug";
	}
	
	if (system.navigatorname == "nexacro")
	{
		if (sMsg instanceof Object)
		{
			for(var x in sMsg)
			{
				trace("[" + sType + "] " + x + " : " + sMsg[x]);
			}
		} else
		{
			trace("[" + sType + "] " + sMsg);
		}
	} else
	{
		console.log(sMsg);
	}
}

/**
* 공통코드를 가져온다.
* @param	: 	arrCode: array
* @param	: 	codeGroup: 그룹코드
* @param	: 	obj:  component
* @param	: 	first:  첫 Row 설정 ( 0 은 All 추가 , 1 은 입력값 추가)   first:"0"   , first:"1:AAA:NEXACRO"
* @example  :   arrCode.push({codeGroup:"LANGUAGE", obj:this.Div00.form.cbo_language , first:"0"});
* @example  :   arrCode.push({codeGroup:"LANGUAGE", obj:this.ds_cond , first:"2:CODE:CDNAME"});

*/
// arrCode.push({codeGroup:"LANGUAGE", obj:this.ds_cond , first:"2:CODE:CDNAME"});
var gv_arrCode;
pForm.gfn_GetComCode  = function ( arrCode )
{

	var objDs = null;		// 대상 데이터셋
	var objComp = null;	// 대상 컴포넌트
	var strOutput ="";
	gv_arrCode = arrCode;
	
	for(var i=0; i<arrCode.length; i++)
	{
		var obj = arrCode[i].obj;
		if(obj instanceof nexacro.Combo ||  obj instanceof nexacro.Radio || obj instanceof nexacro.ListBox){
			objDs   = obj.getInnerDataset();
			objComp = obj;
		}
		else if(obj instanceof Dataset){		//obj 가 데이터셋일경우
			objDs = obj;
			objComp = null;
		}
		
		if(objDs == null){
			trace("gfn_getCommonCode : Dataset is Null");
			return;
		}
		
		var cdGrp = arrCode[i].codeGroup;
		
		strOutput += objDs.id + "=" +cdGrp;
		if( i != (arrCode.length-1)) {
			strOutput += " ";
		}
	}
		
	var objCond = this.all["_tds_CodeCond"];
	if(objCond == null) {
		objCond = new Dataset();
		this.addChild("_tds_CodeCond", objCond);
		objCond.name = "_tds_CodeCond";
		objCond.addColumn("cdType", "string");
	}
	objCond.clearData();
	var nRow;
	for(var i=0; i<arrCode.length; i++) {
		if(objCond.findRow("cdType", arrCode[i].codeGroup) >= 0) continue;
		nRow = objCond.addRow();
		objCond.setColumn(nRow, "cdType", arrCode[i].codeGroup);
	}
	objCond.applyChange();
	
	var strSvcId    = "gfn_GetComCode";
	//var strSvcUrl   = "mat.retrieveComCodeComboList.do";
	var strSvcUrl   = "svc::mat.retrieveComCodeComboList.do";
	var inData      = "input="+objCond.name;
	var outData     = strOutput;  // ds_CodeA=A ds_CodeB=B ds_CodeC=C
	var strArg      = "";
	//this.gfnTransaction(strSvcId, strSvcUrl, inData, outData, strArg);
	
	var callBackFnc = "fnComCodeCallback";
	var isAsync     = true;
	
	this.transaction(strSvcId , strSvcUrl , inData , outData , strArg, callBackFnc, isAsync);
};

/*
* Event : fnComCodeCallback
* Desc  : 처리콜백 함수
**/
pForm.fnComCodeCallback = function(svcID,errorCode,errorMsg)
{
	trace("fnCallback==");
	// 에러 시 화면 처리 내역
	if(errorCode != 0)
	{
		this.alert(errorCode+"\n"+errorMsg);
		return;
	}
	switch(svcID)
	{
	case "gfn_GetComCode":
		
		for(var i=0; i < gv_arrCode.length; i++)
		{
			var obj = gv_arrCode[i].obj;
			if(obj instanceof nexacro.Combo ||  obj instanceof nexacro.Radio || obj instanceof nexacro.ListBox){
				objDs   = obj.getInnerDataset();
				objComp = obj;
			}
			else if(obj instanceof Dataset){		//obj 가 데이터셋일경우
				objDs = obj;
				objComp = null;
			}
			
			if(objDs == null){
				trace("gfn_getCommonCode : Dataset is Null");
				return;
			}
		
			// first set 세팅
			if(!this.gfnIsNull(gv_arrCode[i].first)){
				objDs.insertRow(0);
				var arrFirst = gv_arrCode[i].first.split(":");
				if(arrFirst[0] == "0"){
					objDs.setColumn(0, "cd"  , "");
					objDs.setColumn(0, "cdNm", "ALL");
				}
				else if(arrFirst[0] == "1"){
					objDs.setColumn(0, "cd"  , arrFirst[1]);
					objDs.setColumn(0, "cdNm", arrFirst[2]);
				}
			}

			//컴포넌트를 넘긴 경우 0번째 인덱스 설정
			if(!this.gfnIsNull(objComp)){
				objComp.set_index(0);
			}
		}
		gv_arrCode = "";
		break;
		
	}
};


pForm = null; delete pForm;