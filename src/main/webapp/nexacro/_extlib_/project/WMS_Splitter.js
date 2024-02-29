/**
 *  SVC-WMS Splitter Library
 *  @FileName 	  WMS_MultiCombo.js
 *  @Creator 	  SVC-WMS
 *  @CreateDate   2023/11/30
 *  @Desction
 ************** 소스 수정 이력 ***********************************************
 *  date        Modifier         Description
 *******************************************************************************
 * 2023/11/30   SVC-WMS          Splitter Library
 *******************************************************************************
 */
var pForm = nexacro.Form.prototype;

/************************************************************************
 * Splitter Function
 ************************************************************************/
 
/**
* @description 	     : 스플리터 초기화 함수
* @param objSplitter : 스플리터로 사용할 Static
*        sDirection	 : 스플리터 방향 설정(horizontal, vertical)
         nMin        : 스플리터 최소 위치값(-1 시 최소값 없음)
		 nMax        : 스플리터 최대 위치값(-1 시 최대값 없음) 
* @return            : 없음
*/
pForm.initSpliterComponent = function(objSplitter, sDirection, nMin, nMax) {
	objSplitter.direction = sDirection||objSplitter.uDirection;  // 방향설정 정보 저장
	if (!['horizontal', 'vertical'].includes(objSplitter.direction)) {
		objSplitter.set_cursor  ('');
		objSplitter.set_cssclass('');
		return;
	}
	
	objSplitter.min = nMin||-1;                                  // 최소값 저장
	objSplitter.max = nMax||-1;                                  // 최대값 저장
	if (!objSplitter.direction) { return; }
	
	var iSplitterSize = 4;
	objSplitter.set_cursor  (sDirection=='horizontal' ? 'e-resize'    : 's-resize'   );  // 방향설정에 따라 Cursor 형태 변경
	objSplitter.set_cssclass(sDirection=='horizontal' ? 'sta_spliteH' : 'sta_spliteV');
	if (sDirection=='horizontal') {
		objSplitter.set_width(iSplitterSize);
	} else {
		objSplitter.set_height(iSplitterSize);
	}
	
	////Drag 이벤트 발생시 전달할 정보 오브젝트로 만들기
	this.objSplitterDargChecker = 	{
		'x'         : 0,
		'y'         : 0,
		'dragFlag'  : false,
		'targetObj' : null,
		'left'      : 0,
		'top'       : 0,
	};
	
	
	objSplitter.addEventHandler('onlbuttondown', this.Splitter_onlbuttondown, this);  // 마우스 왼쪽 버튼 클릭 이벤트 추가
	objSplitter.addEventHandler('onlbuttonup'  , this.Splitter_onlbuttonup  , this);  // 마우스 왼쪽 버튼 클릭 해제 이벤트 추가
	       this.addEventHandler('onmousemove'  , this.Splitter_onmousemove  , this);  // 마우스 이동 이벤트 추가
};

 /**
 * @description 스플리터 onlbuttondown 처리내역
*/
pForm.Splitter_onlbuttondown = function(obj, e) {  // obj:nexacro.Static, e:nexacro.MouseEventInfo
	var objDrag = this.objSplitterDargChecker;
	
	//Drag 여부값 설정(드래그 시작)
	objDrag.dragFlag = true;
	
	//클릭된 좌표값 설정
	objDrag.x = e.screenx;
	objDrag.y = e.screeny;
	
	//현재 Splitter의 위치값 설정
	objDrag.left = obj.getOffsetLeft();
	objDrag.top = obj.getOffsetTop();
	
	//클릭된 컴포넌트 설정
	objDrag.targetObj = obj;
};

 /**
  * @description 스플리터 onlbuttonup 처리내역function(obj:nexacro.Static, e:nexacro.MouseEventInfo)
  */
pForm.Splitter_onlbuttonup = function(obj, e) {  // obj:nexacro.Static, e:nexacro.MouseEventInfo
	//Drag 여부값 설정(드래그 종료)
	this.objSplitterDargChecker.dragFlag = false;
};

 /**
  * @description 화면 onmoucemove시 처리내역
  */
pForm.Splitter_onmousemove = function(obj, e) {  // obj:nexacro.Form, e:nexacro.MouseEventInfo
	var nX, nX1, nX2;
	var nY, nY1, nY2;
	var nLeft, nTop;
	var nMin, nMax;
	
	
	var objDrag = this.objSplitterDargChecker;  // Drag 정보 오브젝트 가져오기
	var objDragComp = objDrag.targetObj;        // 현재 선택된 Splitter 컴포넌트 가져오기
	
	//Drag 여부값이 시작 상태일 경우
	if (objDrag.dragFlag == true) {
		
		nMin = objDragComp.min;  // 최소 위치값 가져오기
		nMax = objDragComp.max;  // 최대 위치값 가져오기
		
		//현재 Splitter 위치 값 가져오기
		nLeft = objDrag.left;
		nTop = objDrag.top;
		
		//Drag 시작 X/Y좌표
		nX1 = objDrag.x;
		nY1 = objDrag.y;
		
		//현재 X/Y좌표
		nX2 = e.screenx;
		nY2 = e.screeny;
		
		//Splitter 방향 설정이 horizontal일 경우
		if(objDragComp.direction == 'horizontal') {
			nX = nLeft + (nX2 - nX1);         // 이동할 X좌표값  구하기
			if (nMin!=-1&&nX<nMin)nX = nMin;  // 최소값보다 작을 경우 최소값으로 좌표 설정
			if (nMax!=-1&&nX>nMax)nX = nMax;  // 최대값보다 클 경우 최대값으로 좌표 설정
			objDragComp.setOffsetLeft(nX);    // Splitter Left 좌표값 변경
		}
		//Splitter 방향 설정이 vertical일 경우
		else {
			nY = nTop + (nY2 - nY1);         // 이동할 Y좌표값  구하기
			if(nMin!=-1&&nY<nMin)nY = nMin;  // 최소값보다 작을 경우 최소값으로 좌표 설정
			if(nMax!=-1&&nY>nMax)nY = nMax;  // 최대값보다 클 경우 최대값으로 좌표 설정			
			objDragComp.setOffsetTop(nY);    // Splitter Top 좌표값 변경
		}
		
		//컴포넌트 위치 갱신을 위해 resetScroll 호출
		this.resetScroll();
	}
};

pForm = null;