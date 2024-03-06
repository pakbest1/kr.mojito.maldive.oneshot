/**
 *  SVC-WMS Form Library
 *  @FileName 	  WMS_Form.js
 *  @Creator 	  SVC-WMS
 *  @CreateDate   2023/11/30
 *  @Desction
 ************** 소스 수정 이력 ***********************************************
 *  date        Modifier         Description
 *******************************************************************************
 * 2023/11/30   SVC-WMS          Form Library
 *******************************************************************************
 */
 var pForm = nexacro.Form.prototype;
 
//  /* 메뉴정보 칼럼 변수*/
// pForm.FRAME_MENUCOLUMNS = 
// {
// 	sytmFlagCd		: "SYTM_FLAG_CD",    	// 시스템구분코드
// 	
// 	menuId 			: "menuId",	    		// 아이디
// 	menuNm 			: "menuNm",				// 명칭
// 	title 			: "menuNm",				// 메뉴타이틀
// 	param			: "parameter",			// Form Parameter
// 	
// 	groupId			: "MODULE_CD",			// 메뉴그룹 아이디
// 	prgmId 			: "PRGM_ID",			// 프로그램 아이디
// 	prgmPath		: "PRGM_PATH",			// 프로그램 경로(서비스그룹명)
// 	prgmFileNm		: "PRGM_FILE_NM",		// 프로그램 파일명
// 	prgmHelpFlag	: "PRGM_HELP_FLAG",		// 프로그램 매뉴얼 작성 여부
// 	prgmNm			: "PRGM_NM",			// 프로그램 이름
// 	menuUrl 		: "MENU_URL",			// 프로그램 URL(서비스그룹명 + "::" + 파일명)
// 	menuLevel 		: "MENU_LV",     		// 메뉴레벨	
//     upMenuId    	: "HIPO_MENU_ID",		// 상위메뉴 아이디
// 	//leafYn 		: "LEAF_YN",			// 마지막 노드 여부
// 	//useYn			: "USED_YN",			// 사용여부
// 	searchBtnYn     : "CMMNBTNSEARCH",      // 공통조회버튼 사용여부 
// 	addBtnYn		: "CMMNBTNADD",			// 공통추가버튼 사용여부 
// 	delBtnYn		: "CMMNBTNDEL",			// 공통삭제버튼 사용여부
// 	saveBtnYn		: "CMMNBTNSAVE",		// 공통저장버튼 사용여부
// 	printBtnYn		: "CMMNBTNPRINT",		// 공통출력버튼 사용여부
// 	excelBtnYn	    : "CMMNBTNEXCELDOWN",	// 공통엑셀버튼 사용여부
// 	initbtinYn		: "CMMNBTNINIT",        // 공통초기화버튼 사용여부
// 	//excelUpBtnYn	: "cmmnBtnExcelUp",		// 공통엑셀업로드버튼 사용여부
// 	//helpBtnYn		: "cmmnBtnHelp",		// 공통도움말버튼 사용여부
// 	winId 			: "WIN_ID",      		// 윈도우(프레임)아이디(열린 메뉴의 윈도우 아이디)
// 	displayPath     : "DISPLAY_PATH",
// 	
// 	limitWorkTab    : 'LIMIT_WORK_TAB',     // 최대 탭 크기
// };


/**
* @class  메뉴오픈 (frame open) 
* @param {String} sMenuId : 화면ID
* @param {Object} bjParam : 화면에 넘길 파라미터 Object 
* @param {Boolean} bReload	: 화면을 리로드 할지 여부
* @return {Boolean} 화면오픈 성공여부
* @example this.gfnOpenMenu(sMenuId, objParam);
*/
pForm.gfnOpenMenu = function(args) {
	args = Object.assign({}, { parameters: null, isreload: true}, args);
	let menuid=args.menuid, parameters=args.parameters, reload=args.reload;
	
	var bReturn = false;
	
	// 팝업에서 부모쪽 제어할때 IE에서 느려지는 제약사항이 있어서 함수 호출 분리함. 
	if (this.gfnIsNull(this.getOwnerFrame().form.opener)) {
		bReturn = this._gfnOpenMenu(args);  // menuid, parameters, reload);
	} else {
		bReturn = nexacro.getApplication().gvFrmLeft.form._gfnOpenMenu(args);  // menuid, parameters, reload);
	}
	
	return bReturn;
};

/**
* @class _gfnOpenMenu (frame open) [내부함수]
* @param {String} menuid : 화면ID
* @param {Object} parameters : 화면에 넘길 파라미터 Object 
* @param {Boolean} reload : 화면을 리로드 할지 여부
* @return {Boolean} 화면오픈 성공여부
* @example this._gfnOpenMenu(sMenuId, objParam);
*/
pForm._gfnOpenMenu  = function(args) { // menuid, parameters, reload=true) {
	args = Object.assign({}, { parameters: null, isreload: true}, args);
	let menuid=args.menuid, parameters=args.parameters, reload=args.reload;

	// Null Check
	if (this.isNull(menuid)) {
		this.alert('msg.nomenu');
		return false;
	}
	reload = reload||true;
	
	const leftFrame = nexacro.LeftFrame, leftForm = leftFrame.form;
	leftForm.fnOpenMenu(menuid, parameters, reload);
	
	return true;
};

/**
 * @class getParameters 파라메터 조회
 */
pForm.getParameters = function(_obj) {
	if (!_obj) { _obj = this; }
	let oframe = _obj instanceof nexacro.Form && this == _obj ? _obj.getOwnerFrame() : (_obj instanceof nexacro.ChildFrame ? _obj : null);
	if (!oframe) { return; }
	
	return this.parameters = oframe.parameters;
};