/*
	////////////////////////////////////////////////////////////////////////////////////////////////////
		FUNCTION LIST
	////////////////////////////////////////////////////////////////////////////////////////////////////
	
	1. gfnIndexOfIgnoreCase 				: 대소문자 구별없이 문자열의 위치를 검색한다
	2. gfnReplaceIgnoreCase 				: 대소문자 구별없이 주어진 문자열로 치환한다
	3. gfnLastIndexOfIgnoreCase				: 대소문자 구별없이 오른쪽에서 왼쪽으로 문자열을 검색한다
	4. gfnGetRightStr 						: 문자열의 오른쪽에서 length만큼의 문자열을 가져온다
	5. gfnRemoveStr 						: 문자열을 "좌 or 우" + "대소문자 구분유무"로 첫번째 일치되는 문자열 제거
	6. gfnGetLength 						: 문자열 길이계산
	7. gfnCountNonword 						: 문자열의 특수문자(개행문자 Tab문자 ~ ` ! @ # $ % % ^ & * - = + 등) 포함개수
	8. gfnStrFullToHalf 					: 전각문자를 반각문자로 변환
	9. gfnStrHalfToFull 					: 반각문자를 전각문자로 변환
	10. gfnRepeatStr 						: 주어진 문자열을 n회 반복해서 반환한다
	11. gfnHanGulToUnicode 					: 한글 → 유니코드로 변환
	12. gfnUnicodeToHanGul 					: 유니코드 → 한글로 변환
	13. gfnReplaceInvalidFileNameChars 		: file, folder, or shortcut명에 허용되지 않는 특수문자 치환
	14. gfnRemoveMultibyteChar 				: 문자열에서 multibyte character(한글, 한자, 일어)을 제거
	15. gfnStartsWith 						: 지정된 문자로 시작하는지 여부
	16. gfnEndsWith 						: 지정된 문자로 끝나는지 여부
	17. gfnUnicodeToDecimal 				: unicode 문자열 -> decimal표시 문자열로 변경
	18. gfnDecimalToUnicode 				: decimal표시된 문자열 -> unicode 문자열로 변경
	19. gfnUnicodeToHex 					: unicode 문자열 -> hex표시 문자열로 변경
	20. gfnHexToUnicode 					: hex표시 문자열 ->  unicode 문자열로 변경
	21. gfnUnicodeToUtf8 					: unicode 문자열 -> utf-8 인코딩 hex표시된 문자열로 변경
	22. gfnUtf8ToUnicode 					: utf-8 인코딩 hex표시된 문자열 -> unicode 문자열로 변경
	23. gfnGetMaskFormatStrToString 		: 주어진 문자열의 Mask Format 처리된 문자열을 반환합니다
	24. gfnEscapeXML 						: XML 의 예약문자,특수문자를 치환하여 반환
*/

//넥사크로에 정의된 Form의 Prototype 객체를 변수로 가져오기
var _pForm = nexacro.Form.prototype;

_pForm._hex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];	//hex value
_pForm._maskChr = { "@" : /[\x20-\x7D]/, "#" : /[0-9]/, "*" : /[a-zA-Z]/, "9" : /[a-zA-Z0-9]/, "A" : /[A-Z]/, "a" : /[a-z]/, "Z" : /[A-Z0-9]/, "z" : /[a-z0-9]/ };	//mask character RegExp.
_pForm._defaultPassChar = "*";				//default password character
_pForm._defaultMaskChar = "_";				//default mask character
_pForm._PASSWORD_PAIR = ["{", "}"];			//password start,end character
_pForm._stringMaskCache = {};					//mask format cache
_pForm._chkEmpty = String.fromCharCode(0x08);	//emtpy string
_pForm._cacheEscapeXML = {};					//escapeXML cache

/**
 * 대소문자 구별없이 문자열의 위치를 검색한다.
 * @param {string} value 대상 문자열( 예 : "aaBBbbcc" )
 * @param {string} sFind 찾을 문자열( 예 : "bb" )
 * @param {number} nStart 검색 시작위치 (옵션 : Default=0) ( 예 : 1 ) 
 * @return {number} 검색된 문자열의 시작위치 ( 예 : 2 ). 실패 = -1.
 * @example
 * var str = "DCABCABAABAAB",
 *     findStr = "ab";
 * var idx = this.gfnIndexOfIgnoreCase(str, findStr);
 * trace(idx); // output : 2
 * idx = this.gfnIndexOfIgnoreCase(str, findStr, 3);
 * trace(idx); // output : 5
 * @memberOf this
 */
_pForm.gfnIndexOfIgnoreCase = function(value, sFind, nStart)	
{
	return value.toLowerCase().indexOf(sFind.toLowerCase(), nStart);
}

 /**
 * 대소문자 구별없이 주어진 문자열로 치환한다.
 * @param {string} sOrg 대상 문자열( 예 : "aaBBbbcc" )
 * @param {string} sRepFrom 찾을 문자열( 예 : "bb" )
 * @param {string} sRepTo 치환할 문자열 ( 예 : "xx" )
 * @return {string} 치환된 문자열 ( 예 : "aaxxxxccxx" ).
 * @example
 * var str = "DCABCABAABAAB",
 *     findStr = "ab";
 * var str = this.gfnReplaceIgnoreCase(str, findStr, "x");
 * trace(str); // output : DCxCxAxAx
 * @memberOf this
 */ 
_pForm.gfnReplaceIgnoreCase = function( sOrg, sRepFrom, sRepTo )	
{
	var pos, nStart=0, sRet="";
	var pThis = this;
	
	while(1)
	{
		pos = pThis.gfnIndexOfIgnoreCase( sOrg, sRepFrom, nStart );
		if( pos < 0 )
		{
			sRet += sOrg.substr( nStart );
			break;
		}
		else
		{
			sRet += sOrg.substr( nStart, pos - nStart);
			sRet += sRepTo;
			nStart = pos+sRepFrom.length;
		}
	}
	
	return sRet;
}

 /**
 * 대소문자 구별없이 오른쪽에서 왼쪽으로 문자열을 검색한다.
 * @param {string} source 대상 문자열( 예 : "aaBBbbcc" )
 * @param {string} target 찾을 문자열( 예 : "BB" )
 * @param {string=} opt_start 검색 시작위치 index(Default=문자열의 끝 )
 * @return {number} 찾고자 하는 문자열의 시작위치
 * @example
 * var str = "CABCDABCDABCD",
 *     findStr = "abc";
 * var idx = this.gfnLastIndexOfIgnoreCase(str, findStr);
 * trace(idx); // output : 9
 * idx = this.gfnLastIndexOfIgnoreCase(str, findStr, 8);
 * trace(idx); // output : 5
 * @memberOf this
 */
_pForm.gfnLastIndexOfIgnoreCase = function(source, target, opt_start) 
{
	if ( opt_start === undefined ||
		 opt_start < 0 ||
		 opt_start > source.length )
	{
		opt_start = source.length - 1;
	}
	return source.toLowerCase().lastIndexOf(target.toLowerCase(), opt_start);
}

/**
 * 문자열의 오른쪽에서 length만큼의 문자열을 가져온다.
 * @param {string} source 대상 문자열( 예 : "aaBBbbcc" )
 * @param {number} length 가져올 문자열 길이 ( 예 : 2 )
 * @return {string} 오른쪽에서 length만큼의 문자열 ( 예 : "cc" )]
 * @example
 * var str = "myT1 and myT2 are the strings used for padding";
 * var res = this.gfnGetRightStr(str, 7);
 * trace(res); // output : padding
 * @memberOf this
 */	 
_pForm.gfnGetRightStr = function(source, length) 
{
	if( source.length < length ) 
	{
		return source;
	} 
	else 
	{
		return source.substr(source.length-length, length);
	}
}

/**
 * 문자열을 "좌 or 우" + "대소문자 구분유무"로 첫번째 일치되는 문자열 제거.
 * @param {string} source 원래 문자열( 예 : "aaBBbbcc" )
 * @param {string} target 제거할 문자열( 예 : "cc" )
 * @param {string} direction 삭제방향."left(default)", "right".
 * @param {boolean=} opt_ignoreCase 대소문자구분유무.true(default), false.
 * @return {string} 제거된 문자열.
 * @example
 * var str = "www.domain.com";
 * var result = this.gfnRemoveStr(str, "www.");
 * trace(result); // output : domain.com
 * str = "www.tobesoft.com, www.tobesoft.co.kr";
 * result = this.gfnRemoveStr(str, ".com", "right");
 * trace(result); // output : www.tobesoft, www.tobesoft.co.kr
 * str = "www.tobesoft.COM, www.tobesoft.co.kr";
 * result = this.gfnRemoveStr(str, ".com", "right", false);
 * trace(result); // output : www.tobesoft, www.tobesoft.co.kr
 * @memberOf this
 */	 
_pForm.gfnRemoveStr = function(source, target, direction, opt_ignoreCase) 
{
	direction = direction || "left";
	if(opt_ignoreCase !== false) opt_ignoreCase = true;

	var tempSource,tempTarget,pos;
	var sourceLen = source.length;
	var targetLen = target.length;
	
	tempSource = source;
	tempTarget = target;
	
	if(!opt_ignoreCase) 
	{
		tempSource = source.toLowerCase();
		tempTarget = target.toLowerCase();
	}
	
	//왼쪽부터 검색
	if(direction=="left") 
	{
		pos = tempSource.indexOf(tempTarget);
	} 
	else if(direction=="right") 
	{
		pos = tempSource.lastIndexOf(tempTarget);
	} 
	else 
	{
		return;
	}	
		
	if(pos < 0) 
	{
		return source;
	} 
	else if(tempSource == tempTarget)
	{
		return "";
	}
	else if(pos == 0)
	{
		return tempSource.substr(targetLen);
	} 
	else if(pos > 0)
	{
		return tempSource.substr(0, pos) + tempSource.substr(pos+targetLen);
	}

}
	 
/**
 * 문자열 길이계산.
 * @param {string} str 대상 문자열.
 * @param {string=} unit 문자열의 길이를 검사하는 단위 . 
				   "utf16" - 한문자당 1의 값으로 합산함(default).
				   "utf8"  - 한 문자당 영문1, 다국어 2~5의 값으로 합산함.
				   "ascii" - 한문자당 영문 1, 한글 2의 값으로 합산함.
 * @return {number} 문자열 길이.
 * @example
 * var str = "unit 문자열";
 * var len = this.gfnGetLength(str);
 * trace(len); // output : 8
 * len = this.gfnGetLength(str, "ascii");
 * trace(len); // output : 11
 * len = this.gfnGetLength(str, "utf8");
 * trace(len); // output : 14
 * @memberOf this
 */	 		 
_pForm.gfnGetLength = function(str, unit)
{
	if ( !str ) return 0;
	
	var pThis = this;
	
	if ( unit == "utf8" )
	{
		return pThis._utf8ByteCount(str);
	}
	else if ( unit == "ascii" )
	{
		return pThis._asciiByteCount(str);
	}
	else
	{
		return str.length;
	}
}

/**
 * utf8을 기준으로 문자열 길이계산.
 * @private
 * @param {string} str 대상 문자열.
 * @return {number} 문자열 길이.
 * @memberOf this
 */	 		 
_pForm._utf8ByteCount = function(str)
{
	if (str === undefined) return 0;
	
	var pThis = this;
	var count = 0,
		ch,
		high,
		low,
		isHighSurrogate = pThis._isHighSurrogate,
		utf8Len = pThis._utf8Len,
		toCodepoint = pThis._toCodepoint;

	for(var i=0, n = str.length; i< n; i++) 
	{
		ch = str.charCodeAt(i);
		
		if(isHighSurrogate(ch)) 
		{
			high = ch;
			low = str.charCodeAt(++i);
			count += utf8Len(toCodepoint(high, low));
		} 
		else 
		{
			count += utf8Len(ch);
		}
	}
	return count;
} 	

/**
 * ascii를 기준으로 문자열 길이계산.
 * @private
 * @param {string} str 대상 문자열.
 * @return {number} 문자열 길이.
 * @memberOf this
 */	 		 
_pForm._asciiByteCount = function(str)
{
	if (str === undefined) return 0;
	
	var i, j=0, val; 
	for(i=0, n = str.length; i< n; i++) 
	{ 
		val = str.charCodeAt(i);
		if ( val > 255 ) j++;
		j++; 
	}
	return j;
}

/**
 * uft8 문자열 길이계산.
 * @private
 * @param {string} codePoint 문자셋 수치보정값.
 * @return {number} 문자열 길이.
 * @memberOf this
 */	 		 
_pForm._utf8Len = function(codePoint)
{
	if(codePoint >= 0xD800 && codePoint <= 0xDFFF)
	{
		trace("Illegal argument: "+codePoint);
	}
	if(codePoint < 0)
	{
		trace("Illegal argument: "+codePoint);
	}
	if(codePoint <= 0x7F) return 1;
	if(codePoint <= 0x7FF) return 2;
	if(codePoint <= 0xFFFF) return 3;
	if(codePoint <= 0x1FFFFF) return 4;
	if(codePoint <= 0x3FFFFFF) return 5;
	if(codePoint <= 0x7FFFFFFF) return 6;

	trace("Illegal argument: "+codePoint);
}

/**
 * 유니코드 보충언어판(Supplementary Plane)의 상위 대행코드(High Surrogate) 여부.
 * @private
 * @param {string} codeUnit 확인 할 문자.
 * @return {boolean} 상위 대행코드(High Surrogate) 여부.
 * @memberOf this
 */	 		 
_pForm._isHighSurrogate = function(codeUnit)
{
	return codeUnit >= 0xD800 && codeUnit <= 0xDBFF;
}

/**
 * 유니코드 보충언어판(Supplementary Plane)의 하위 대행코드(Low Surrogate) 여부.
 * @private
 * @param {string} codeUnit 확인 할 문자.
 * @return {boolean} 하위 대행코드(Low Surrogate) 여부.
 * @memberOf this
 */	 		 
_pForm._isLowSurrogate = function(codeUnit)
{
	return codeUnit >= 0xDC00 && codeUnit <= 0xDFFF;
}

/**
 * 문자셋의 수치보정값 처리
 * @private
 * @param {number} highCodeUnit 상위 대행코드.
 * @param {number} lowCodeUnit 하위 대행코드.
 * @return {number} 문자셋의 수치보정값
 * @memberOf this
 */
_pForm._toCodepoint = function(highCodeUnit, lowCodeUnit)
{
	var pThis = this;
	
	if(!pThis._isHighSurrogate(highCodeUnit))
	{
		trace("Illegal argument: "+highCodeUnit);
	}
	if(!pThis._isLowSurrogate(lowCodeUnit))
	{
		trace("Illegal argument: "+lowCodeUnit);
	}
	highCodeUnit = (0x3FF & highCodeUnit) << 10;
	var u = highCodeUnit | (0x3FF & lowCodeUnit);
	return u + 0x10000;	 	
}

/**
 * 문자열의 특수문자(개행문자 Tab문자 ~ ` ! @ # $ % % ^ & * - = + 등) 포함개수.
 * @param {string} str 대상 문자열.
 * @return {number} 특수문자 개수.
 * @example
 * var str = "2011-12-27\r\n\t~`";
 * var cnt = this.gfnCountNonword(str);
 * trace(cnt); // output : 7
 * @memberOf this
 */	 		 
_pForm.gfnCountNonword = function(str)
{
	var regExp = /\W/g;
	var rtn = str.match(regExp);
	return (!rtn)?0:rtn.length;
} 	

/**
 * 전각문자를 반각문자로 변환.<br><br>
 * 참고: <br>
 * 전각문자는 "정사각형" 안에 들어가는 문자이고, <br>
 * 반각은 그 정사각형의 반쪽에 들어가는 문자이다.<br>
 * 전각문자의 폭은, 반각문자의 2배입니다. <br><br>
 * 예를 들어 숫자 "3" 은, 한글 "가"의 절반의 폭만을 가지고 있습니다. <br>
 * 그래서 영문과 숫자 등은 반각이고, 한글이나 한자들은 전각문자입니다. <br>
 * 다만, 영문과 숫자를 전각으로 표현할 수도 있습니다.<br>
 * 예 : 전각문자 ==> ※★０＋ , 반각문자 ==> 1a 
 * @param {string} str 전각문자( 예 : "０＋" ).
 * @return {string} 반각문자 ( 예 : "0+" ).
 * @example
 * var var str = "０１＋ｗｏｒｌｄ투비소프트";
 * var result = this.gfnStrFullToHalf(str);
 * trace(result); // output : 01+world투비소프트
 * @memberOf this
 */	 			 
_pForm.gfnStrFullToHalf = function(str)
{
	var i, c, sHalf = "";
	var count = str.length;
	for( i=0 ; i < count ; i++ )
	{
		var c = str.charCodeAt(i);

		if (c == 12288) 
		{
			sHalf += unescape("%20"); 
		} 
		else if ( (c >= 65281) && (c <= 65374) ) 
		{
			sHalf += unescape("%"+(c-65248).toString(16));
		} 
		else 
		{
			sHalf += str.charAt(i);
		}
	}
	
	return  sHalf;
} 	

/**
 * 반각문자를 전각문자로 변환.
 * @param {string} str 반각문자( 예 : "0+" ).
 * @return {string} 전각문자 ( 예 : "０＋" ).
 * @example
 * var var str = "01+world투비소프트";
 * var result = this.gfnStrHalfToFull(str);
 * trace(result); // output : ０１＋ｗｏｒｌｄ투비소프트
 * @memberOf this
 */	 	 
_pForm.gfnStrHalfToFull = function(str)
{
	var rTmp = "";
	var iTmp = "";
	var i, incount = str.length;
	var tempCode;
 
	for( i = 0 ; i < incount ; i++ ) 
	{
		//기본 아스키 코드 값을 벗어난 경우(한글)는 전자로 변환할 필요 없음.
		tempCode = str.charCodeAt(i);
		
		if( (tempCode >= 32) && (tempCode <= 126) ) 
		{
			if( tempCode == 32 ) 
			{
				iTmp = unescape("%u"+(12288).toString(16));
			} 
			else 
			{
				iTmp = tempCode + 65248;
			}
			
		} 
		else 
		{
			iTmp = tempCode;
		}

		if( tempCode == 32 )
		{
			rTmp = rTmp + (iTmp);
		} 
		else 
		{
			rTmp = rTmp + String.fromCharCode(iTmp);
		}
	}

	return rTmp;
}

/**
 * 주어진 문자열을 n회 반복해서 반환한다.
 * @param {string} str 반복할 문자열.
 * @param {number} count 반복 횟수.
 * @return {string} 반복된 문자열
 * @example
 * var str = "0";
 * var result = this.gfnRepeatStr(str, 4);
 * trace(result); // output : 0000
 * @memberOf this
 */
_pForm.gfnRepeatStr = function(str, count) 
{
	var rtn = "".padLeft(count, str);
	return rtn;
}

/**
 * 한글 → 유니코드로 변환.
 * @param {string} str 한글 문자열.
 * @return {string} 유니코드.
 * @example
 * var str = "www.투비소프트.com";
 * var result = this.gfnHanGulToUnicode(str);
 * trace(result); // output : www.\uD22C\uBE44\uC18C\uD504\uD2B8.com
 * @memberOf this
 */	 	 
_pForm.gfnHanGulToUnicode = function(str)
{
	return escape(str).replace(/%/gi, "\\");
}	
		
/**
 * 유니코드 → 한글로 변환.
 * @param {string} str 유니코드 문자열.
 * @return {string} 한글.
 * @example
 * var str = "www.\uD22C\uBE44\uC18C\uD504\uD2B8.com";
 * var result = this.gfnUnicodeToHanGul(str);
 * trace(result); // output : www.투비소프트.com
 * @memberOf this
 */	 	 
_pForm.gfnUnicodeToHanGul = function(str)
{
	return unescape(str.replace(/\\/gi, "%"));
}

/**
 * file, folder, or shortcut명에 허용되지 않는 특수문자 치환.<br>
 * \ / : * ? " < > | 를 치환한다.
 * @param {string} str 파일명.
 * @param {string=} opt_newvalue 치환할 문자열(default: underscore( "_" ) ).
 * @return {string} 정제된 파일명.
 * @example
 * var str = "test:uploadfile.php";
 * var result = this.gfnReplaceInvalidFileNameChars(str);
 * trace(result); // output : test_uploadfile.php
 * str = "test-uploadfile.php";
 * result = this.gfnReplaceInvalidFileNameChars(str);
 * trace(result); // output : test-uploadfile.php
 * @memberOf this
 */
_pForm.gfnReplaceInvalidFileNameChars = function(str,opt_newvalue) 
{
	if(opt_newvalue === null || opt_newvalue === undefined) opt_newvalue = "_";
	
	var filename = str.replace(/[\\\/:*?"<>|]/, opt_newvalue);
	return filename;
}		

/**
 * 문자열에서 multibyte character(한글, 한자, 일어)을 제거.
 * @param {string} str 문자열.
 * @return {string} multibyte character가 제거된 문자열.
 * @example
 * var str = "unit문자열s五ご";
 * var result = this.gfnRemoveMultibyteChar(str);
 * trace(result); // output : units
 * @memberOf this
 */
_pForm.gfnRemoveMultibyteChar = function(str) 
{
	var rtn = "";
	var arrStr = str.split(""),
		len = arrStr.length,
		chr;
	for(var i = 0; i < len; i++)
	{
		chr = arrStr[i];
		chr = escape(chr);

		if (chr.charAt(1) != "u") //multichar이 아닌 경우만 처리함.
		{
			rtn += arrStr[i]; //multichar이을 빼고 값을 더해줌??????????????? 
		}
	}
	return rtn;
}	

/**
 * 지정된 문자로 시작하는지 여부.
 * @param {string} str 문자열.
 * @param {string} prefix 대상문자열.
 * @return {boolean} 시작하는지 여부.
 * @example
 * var str = "Hello World!";
 * var result = this.gfnStartsWith(str, "He");
 * trace(result); // output : true
 * result = this.gfnStartsWith(str, "hew");
 * trace(result); // output : false
 * @memberOf this
 */
_pForm.gfnStartsWith = function(str, prefix) 
{
	return str.lastIndexOf(prefix, 0) == 0;
}	

/**
 * 지정된 문자로 끝나는지 여부.
 * @param {string} str 문자열.
 * @param {string} suffix 대상문자열.
 * @return {boolean} 끝나는지 여부.
 * @example
 * var str = "Hello World!";
 * var result = this.gfnEndsWith(str, "ld!");
 * trace(result); // output : true
 * result = this.gfnEndsWith(str, "Wor");
 * trace(result); // output : false
 * @memberOf this
 */
_pForm.gfnEndsWith = function(str, suffix) 
{
	var l = str.length - suffix.length;
	return l >= 0 && str.indexOf(suffix, l) == l;
}

/**
* unicode 문자열 -> decimal표시 문자열로 변경.<br>
* (ex : left,right delimiter가 default 값으로 주어지면 space문자 -> &#38;#32; 로 변경된다.)  
* @param {string} val 대상 unicodeString
* @param {string=} leftDelimiter 문자를 Decimal 표시할 때 좌측에 표시하는 문자열(default:"&#")
* @param {string=} rightDelimiter 문자를 Decimal 표시할 때 우측에 표시하는 문자열(default:";")
* @return {string} unicode 문자열을 decimal값으로 표시한 문자열
* @example
* var str = "form 로딩";
* var result = this.gfnUnicodeToDecimal(str);
* trace(result); // output : &#38;#102;&#38;#111;&#38;#114;&#38;#109;&#38;#32;&#38;#47196;&#38;#46377;
* @memberOf this
*/
_pForm.gfnUnicodeToDecimal = function(val, leftDelimiter, rightDelimiter)
{
	if ( this.gfnIsEmpty(leftDelimiter) ) leftDelimiter = "&#";
	if ( this.gfnIsEmpty(rightDelimiter) ) rightDelimiter = ";";

	var res = "";
	val = val.replace(/^\s+/, '');
	if (val.length == 0)
	{
		return "";
	}
	var code;
	for ( var i = 0, n = val.length; i < n; i++ )
	{
		code = val.charCodeAt(i);
		res += leftDelimiter + code + rightDelimiter;
	}
	return res;
}

/**
* decimal표시된 문자열 -> unicode 문자열로 변경.<br>
* (ex : left,right delimiter가 default이면 &#38;#32; -> space문자)  
* @param {string} val 대상 decimal표시된 문자열
* @param {string=} leftDelimiter 문자를 Decimal 표시할 때 좌측에 표시하는 문자열(default:"&#")
* @param {string=} rightDelimiter 문자를 Decimal 표시할 때 우측에 표시하는 문자열(default:";")
* @return {string} decimal값으로 표시한 문자열을 unicode 문자열
* @example
* var str = "&#38;#102;&#38;#111;&#38;#114;&#38;#109;&#38;#32;&#38;#47196;&#38;#46377;";
* var result = this.gfnDecimalToUnicode(str);
* trace(result); // output : form 로딩
* @memberOf this
*/
_pForm.gfnDecimalToUnicode = function(val, leftDelimiter, rightDelimiter)
{
	if ( this.gfnIsEmpty(leftDelimiter) ) leftDelimiter = "&#";
	if ( this.gfnIsEmpty(rightDelimiter) ) rightDelimiter = ";";

	var res = "";
	val = val.replace(/^\s+/, '');
	if (val.length == 0)
	{
		return "";
	}
	var delimiter = rightDelimiter + leftDelimiter;
	var arr = val.split(delimiter),
		chr;
	arr[0] = arr[0].substr(leftDelimiter.length);
	var lastE = arr[arr.length - 1];
	arr[arr.length - 1] = lastE.substr(0, lastE.length - rightDelimiter.length);
	for ( var i = 0, n = arr.length; i < n; i++ )
	{
		chr = String.fromCharCode(arr[i]);
		res += chr;
	}
	return res;
}

/**
* unicode 문자열 -> hex표시 문자열로 변경.<br>
* (ex : left,right delimiter가 default 값으로 주어지면 space문자 -> &#38;#x20; 로 변경된다.)  
* @param {string} val 대상 unicodeString
* @param {string=} leftDelimiter 문자를 hex 표시할 때 좌측에 표시하는 문자열(default:"&#x")
* @param {string=} rightDelimiter 문자를 hex 표시할 때 우측에 표시하는 문자열(default:";")
* @return {string} unicode 문자열을 hex값으로 표시한 문자열
* @example
* var str = "form 로딩";
* var result = this.gfnUnicodeToHex(str);
* trace(result); // output : &#38;#x66;&#38;#x6F;&#38;#x72;&#38;#x6D;&#38;#x20;&#38;#xB85C;&#38;#xB529;
* @memberOf this
*/
_pForm.gfnUnicodeToHex = function(val, leftDelimiter, rightDelimiter)
{
	if ( this.gfnIsEmpty(leftDelimiter) ) leftDelimiter = "&#x";
	if ( this.gfnIsEmpty(rightDelimiter) ) rightDelimiter = ";";

	var res = "";
	val = val.replace(/^\s+/, '');
	if (val.length == 0)
	{
		return "";
	}
	var code;

	for ( var i = 0, n = val.length; i < n; i++ )
	{
		code = val.charCodeAt(i);
		res += leftDelimiter + code.toString(16).toUpperCase() + rightDelimiter;
	}
	return res;
}

/**
* hex표시 문자열 ->  unicode 문자열로 변경.<br>
* (ex : left,right delimiter가 default 값으로 주어지면 &#38;#x20; -> space문자 로 변경된다.)  
* @param {string} val 대상 hex표시 문자열
* @param {string=} leftDelimiter 문자를 hex 표시할 때 좌측에 표시하는 문자열(default:"&#x")
* @param {string=} rightDelimiter 문자를 hex 표시할 때 우측에 표시하는 문자열(default:";")
* @return {string} hex값으로 표시한 문자열을 unicode 문자열
* @example
* var str = "&#38;#102;&#38;#111;&#38;#114;&#38;#109;&#38;#32;&#38;#47196;&#38;#46377;";
* var result = this.gfnHexToUnicode(str);
* trace(result); // output : form 로딩
* @memberOf this
*/
_pForm.gfnHexToUnicode = function(val, leftDelimiter, rightDelimiter)
{
	if ( this.gfnIsEmpty(leftDelimiter) ) leftDelimiter = "&#x";
	if ( this.gfnIsEmpty(rightDelimiter) ) rightDelimiter = ";";

	var res = "";
	val = val.replace(/^\s+/, '');
	if (val.length == 0)
	{
		return "";
	}
	var delimiter = rightDelimiter + leftDelimiter;
	var arr = val.split(delimiter),
		chr;
	arr[0] = arr[0].substr(leftDelimiter.length);
	var lastE = arr[arr.length - 1];
	arr[arr.length - 1] = lastE.substr(0, lastE.length - rightDelimiter.length);

	for ( var i = 0, n = arr.length; i < n; i++ )
	{
		chr = String.fromCharCode(parseInt(arr[i], 16));
		res += chr;
	}
	return res;
}

/**
 * hex display
 * @private
 * @param {number} 한자리 숫자.
 * @return {string} Hex표시값
 * @memberOf this
 */
_pForm._toHex = function(val)
{
	var hexs = this._hex;
	return hexs[(val >> 4) & 0xF] + hexs[val & 0xF];
}

/**
* unicode 문자열 -> utf-8 인코딩 hex표시된 문자열로 변경.<br>
* (ex : left,right delimiter가 default 값으로 주어지면 space문자 -> 20 로 변경된다.)  
* @param {string} val 대상 unicodeString
* @param {string=} leftDelimiter 문자를 utf-8 인코딩 hex 표시할 때 좌측에 표시하는 문자열(default:"")
* @param {string=} rightDelimiter 문자를 utf-8 인코딩 hex 표시할 때 우측에 표시하는 문자열(default:" ")
* @return {string} unicode 문자열을 utf-8 인코딩 hex값으로 표시한 문자열
* @example
* var str = "form 로딩";
* var result = this.gfnUnicodeToUtf8(str);
* trace(result); // output : 66 6F 72 6D 20 EB A1 9C EB 94 A9
* @memberOf this
*/
_pForm.gfnUnicodeToUtf8 = function(val, leftDelimiter, rightDelimiter)
{
	if ( this.gfnIsEmpty(leftDelimiter) ) leftDelimiter = "";
	if ( this.gfnIsEmpty(rightDelimiter) ) rightDelimiter = " ";

	var res = "";
	val = val.replace(/^\s+/, '');
	
	if (val.length == 0)
	{
		return "";
	}

	var code;
//		toHex = this._toHex;

	for ( var i = 0, n = val.length; i < n; i++ )
	{
		code = val.charCodeAt(i);

		if (i > 0)
		{
			res += rightDelimiter;
		}
		if (code <= 0x7F)
		{
			res += leftDelimiter + this._toHex(code);
		}
		else if (code <= 0x7FF)
		{
			res += leftDelimiter + this._toHex(0xC0 | ((code>>6) & 0x1F)) + rightDelimiter + leftDelimiter + this._toHex(0x80 | (code & 0x3F));
		}
		else if (code <= 0xFFFF)
		{
			res += leftDelimiter + this._toHex(0xE0 | ((code>>12) & 0x0F)) + rightDelimiter + leftDelimiter + this._toHex(0x80 | ((code>>6) & 0x3F)) + rightDelimiter + leftDelimiter + this._toHex(0x80 | (code & 0x3F));
		}
		else if (code <= 0x10FFFF)
		{
			outputString += leftDelimiter + this._toHex(0xF0 | ((code>>18) & 0x07)) + rightDelimiter + leftDelimiter + this._toHex(0x80 | ((code>>12) & 0x3F)) + rightDelimiter + leftDelimiter + this._toHex(0x80 | ((code>>6) & 0x3F)) + rightDelimiter + leftDelimiter + this._toHex(0x80 | (code & 0x3F));
		}
		else
		{
			res += leftDelimiter + code.toString(16).toUpperCase();
		}

	}

	res += rightDelimiter;
	return res;
}

/**
* utf-8 인코딩 hex표시된 문자열 -> unicode 문자열로 변경.<br>
* (ex : left,right delimiter가 default 값으로 주어지면 20 -> space문자 로 변경된다.)  
* @param {string} val 대상 utf-8 인코딩 hex표시된 문자열
* @param {string=} leftDelimiter 문자를 utf-8 인코딩 hex 표시할 때 좌측에 표시하는 문자열(default:"")
* @param {string=} rightDelimiter 문자를 utf-8 인코딩 hex 표시할 때 우측에 표시하는 문자열(default:" ")
* @return {string} utf-8 인코딩 hex값으로 표시한 문자열 -> unicode 문자열
* @example
* var str = "66 6F 72 6D 20 EB A1 9C EB 94 A9";
* var result = this.gfnUtf8ToUnicode(str);
* trace(result); // output : form 로딩
* @memberOf this
*/
_pForm.gfnUtf8ToUnicode = function(val, leftDelimiter, rightDelimiter)
{
	val = val.replace(/^\s+/, '');
	val = val.replace(/ $/, '');
	if (val.length == 0)
	{
		return "";
	}
	if ( this.gfnIsEmpty(leftDelimiter) ) leftDelimiter = "";
	if ( this.gfnIsEmpty(rightDelimiter) ) rightDelimiter = " ";
	
	var delimiter = rightDelimiter + leftDelimiter,
		arr;

	arr = val.split(delimiter);
	if ( leftDelimiter.length && rightDelimiter.length )
	{
		arr[0] = arr[0].substr(leftDelimiter.length);
		var lastE = arr[arr.length - 1];
		arr[arr.length - 1] = lastE.substr(0, lastE.length - rightDelimiter.length);
	}

	var valLen = arr.length,
		res = "", code, compte = 0, tmpcode = 0;
	for(var i = 0 ; i < valLen ; i++ )
	{
		code = parseInt(arr[i], 16);
		switch (compte)
		{
			case 0:
				if (0 <= code && code <= 0x7F)
				{ 
					res += String.fromCharCode(code);
				}
				else if (0xC0 <= code && code <= 0xDF)
				{
					compte = 1;
					tmpcode = code & 0x1F;
				}
				else if (0xE0 <= code && code <= 0xEF)
				{  
					compte = 2;
					tmpcode = code & 0xF;
				}
				else if (0xF0 <= code && code <= 0xF7)
				{ 
					compte = 3;
					tmpcode = code & 0x7;
				}
				else
				{
					res += String.fromCharCode(code);
				}
				break;
			case 1:
				if (code < 0x80 || code > 0xBF)
				{
					res += String.fromCharCode(code);
				}
				compte--;
				res += String.fromCharCode((tmpcode << 6) | (code-0x80));
				tmpcode = 0;
				break;
			case 2:
			case 3:
				if (code < 0x80 || code > 0xBF)
				{
					res += String.fromCharCode(code);
				}
				tmpcode = (tmpcode << 6) | (code-0x80);
				compte--;
				break;
		}
	}
	return res;
}

/**
 * mask format 변환 정보 반환.
 * @private
 * @param {string} strMask mask할 format 문자열.
 * @return {array} mask format 변환 정보
 * @memberOf this
 */
_pForm._parseStringMask = function(strMask)
{
	var pThis = this;
	
	var res = pThis._stringMaskCache[strMask];
	if ( res ) return res;

	var len = strMask.length,
		arrMask = [],
		arrPass = [],
		arrOrgMask = [],
		bQuote = false,
		bEscape = false,
		bPasswd = false,
		Mask = 0,
		i, nIdx,
		cMasks = strMask.split(""),
		rMaskChr,
		ReserveMasks = pThis._maskChr;

	for( i=0, nIdx=0; i < len ; i++ ) 
	{
		if( bEscape == false && cMasks[i] == "'" ) 
		{ // Mask가 Quotation이 시작될 경우.
			if( bQuote == false )
				bQuote = true;
			else
				bQuote = false;
			continue;
		}
		Mask = 0;
		if( bEscape == false && cMasks[i] == "\\" && !bQuote ) 
		{ // Mask에서 Escape에 진입할 경우.
			bEscape = true;
			continue;
		}
		else if ( bEscape ) 
		{ // Mask에서 Escape를 사용할 경우.
			bEscape = false;
		}
		else if( bQuote == false ) 
		{// Mask에서 Quotation 밖의 글자에 대해.
			rMaskChr = ReserveMasks[cMasks[i]];
			if ( rMaskChr ) 
			{
				Mask = rMaskChr;
			}
			if( cMasks[i] == this._PASSWORD_PAIR[0] ) 
			{
				bPasswd = true;
				continue;
			}
			if( cMasks[i] == this._PASSWORD_PAIR[1] ) 
			{
				bPasswd = false;
				continue;
			}
		}
		arrMask[nIdx] = Mask;
		arrPass[nIdx] = bPasswd;
		arrOrgMask[nIdx] = cMasks[i];
		nIdx++;
	}
	res = [arrMask, arrPass, arrOrgMask];
	pThis._stringMaskCache[strMask] = res;
	return res;
}
		
/**
 * mask 값이 적용된 문자 배열 반환
 * @private
 * @param {array} arrVal 원본 문자 배열.
 * @param {array} arrMask mask를 적용하기 위한 정규식 배열
 * @param {array} arrOrgMask 원본 mask 문자 배열.
 * @return {array} mask 값이 적용된 문자 배열
 * @memberOf this
 */
_pForm._makeMaskedValue = function(arrVal, arrMask, arrOrgMask)
{
	var bOverlappedValue = false; // 기본은 겹치지 않음.
	var Mask;
	var c;

	var	nXCharLen = 0;
	var nLen = arrVal.length;
	var i, j;
	if( nLen == arrMask.length ) 
	{
		for( i=0 ; i < nLen ; i++) 
		{
			if( arrMask[i] == 0 && arrVal[i] == arrMask[i] )
				continue;
			else if( arrMask[i] == 0 )
				break;
		}
		if( i == arrVal.length )
			bOverlappedValue = true;
	}

	var strMaskedValue = [];
	nLen = arrOrgMask.length;		
	var ReserveMasks = this._maskChr;
	for( i=0, j=0 ; i < nLen ; i++ ) 
	{
		c = arrOrgMask[i];
		Mask = arrMask[i];

		if ( Mask != 0 && ReserveMasks[c] ) 
		{
			do 
			{
				c = arrVal[j];
				j++;
			}
			while( c && !Mask.test(c) )
			
			if( this.gfnIsEmpty(c) ) 
			{// || (xch & 0x80) )
				c = _chkEmpty;
			}
		}
		else if( bOverlappedValue && arrOrgMask[i] == c ) 
		{
			j++;
		}
		strMaskedValue[i] = c;
	}
	return strMaskedValue;
}

/**
 * 주어진 문자열의 Mask Format 처리된 문자열을 반환합니다.
 * @param {string} val 원본 문자열.
 * @param {string} strMask mask할 format 문자열.
 * @param {string=} maskChr 원본문자열에 있는 빈문자열 대체 mask.
 * @return {string} 변환된 문자열.
 * @example
 * var str = "20060607";
 * var result = this.gfnGetMaskFormatStrToString(str, "@@@@-@@-@@");
 * trace(result); // output : 2006-06-07
 *
 * str = "6601011234567";
 * result = this.gfnGetMaskFormatStrToString(str, "######-{#######}");
 * trace(result); // output : 660101-*******
 * @memberOf this
 */
_pForm.gfnGetMaskFormatStrToString = function(val, strMask, maskChr)
{
	var pThis = this;
	
	if ( !maskChr ) maskChr = pThis._defaultMaskChar;

	var maskInfo = pThis._parseStringMask(strMask),
		arrMask = maskInfo[0],
		arrPass = maskInfo[1],
		arrOrgMask = maskInfo[2],
		arrVal = val.split("");

	var maskedValue = pThis._makeMaskedValue(arrVal, arrMask, arrOrgMask);

	var i;
	var strText = [];
	var c;
	var Mask, Pass, strMask;

	var nLen = arrOrgMask.length;
	for(i = 0 ; i < nLen ; i++ ) 
	{
		c = maskedValue[i];
		Mask = arrMask[i];
		Pass = arrPass[i];
		strMask = arrOrgMask[i];
		if( Mask != 0 ) 
		{
			if( this.gfnIsEmpty(c) || c == pThis._chkEmpty ) 
			{
				c = maskChr;
			}
			else if( Pass )
			{
				c = pThis._defaultPassChar;
			}
			else if( strMask == "A" || strMask == "Z" ) 
			{
				c = c.toUpperCase();
			}
			else if( strMask == "a" || strMask == "z" ) 
			{
				c = c.toLowerCase();
			}
		}
		strText[i] = c;
	}
	return strText.join("");
}

/**
 * XML 의 예약문자,특수문자를 치환하여 반환.<br><br>
 * 대상문자 : &, <, >, ', ", \t, \r, \n
 * @param {string} str 문자열.
 * @return {string} 치환된 문자열.
 * @example
 *
 * trace(this.gfnEscapeXML("1 > 0")); // output : 1 &gt; 0
 * trace(this.gfnEscapeXML("Q&A")); // output : Q&amp;A
 *
 * @memberOf this
 */
_pForm.gfnEscapeXML = function(str) 
{
	var pThis = this;
	
	if ( typeof str != "string") {
		str = new String(str);
	}
	
	var ret = pThis._cacheEscapeXML[str];
	if ( this.gfnIsEmpty(ret) )
	{
		/* 개행전에 한글 존재시 확인 필요 (속도는 이게 너 빠름)
		var ch = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			"'": '&apos;',
			'"': '&quot;',
			'\t': '&#9;',
			'\r': '&#13;',
			'\n': '&#10;'
		};
		ret = str.replace(/[<>&"'\t\r\n]/g, function(c) {
			return ch[c];
		});
		*/
		
		ret = str.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/'/g, "&apos;")
				.replace(/\"/g, "&quot;")
				.replace(/\t/g, "&#9;")
				.replace(/\r/g, "&#13;")
				.replace(/\n/g, "&#10;");

		pThis._cacheEscapeXML[str] = ret;
	}
	
	return ret;
}

/**
 * 주어진 문자열을 첫 문자만 대문자 변경
 * @param {string} str 문자열
 * @return {string} 첫 문자 대문자 처리된 문자
 * @example
 *
 * trace(this.gfnCapitalize("point")); // output : Point
 *		 
 * @memberOf this
 */
_pForm.gfnCapitalize = function(str)
{
	if ( !str ) trace("str is null!");
	return str.replace(/\b[a-z]/g, function(match) {
		return match.toUpperCase();
	});
}

/**
 * 주어진 문장열에서 '-' 제거하고 제거된 위치에서 첫 문자만 대문자 변경
 * @param {string} str 문자열
 * @return {string} 처리된 문자
 * @example
 *
 * trace(this.gfnCamelize("create-point")); // output : createPoint
 *		 
 * @memberOf this
 */
_pForm.gfnCamelize = function(str)
{
	return str.replace(/-(.)/g, function(all, chr) {
		return chr.toUpperCase();
	});
}

/**
 * 주어진 문장열에서 대문자 기준으로 '-' 삽입하고 대문자는 소문자 변경
 * @param {string} str 문자열
 * @return {string} 처리된 문자
 * @example
 *
 * trace(this.gfnHyphenate("createPoint")); // output : create-point
 *		 
 * @memberOf this
 */
_pForm.gfnHyphenate = function(str)
{
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}