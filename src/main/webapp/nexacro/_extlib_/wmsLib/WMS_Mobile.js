/**
*  SCVWMS Mobile 프로젝트
*  @FileName 	mwms.js 
*  @Creator 	SCVWMS
*  @CreateDate 	2023/11/30
*  @Desction    
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
* 2023/11/30			SCVWMS					최초생성
*******************************************************************************
*/
var pForm = nexacro.Form.prototype;

/*
 * 메인 폼으로 이동
 */
pForm.goMainForm = function(isLogin=true) {
	
	if (this.isModified()) {
		if (!confirm('작성중인 정보가 존재합니다. 계속 진행 하시겠습니까?')) {
			return;
		}
	}

	let app = nexacro.getApplication();
	app.gvBase.divMenu.form.fnsetDsBtnMenu();
	this.getOwnerFrame().form.divMain.set_url('mFrame::frmMainPage.xfdl');  //this.parent.parent.parent.form.divMain.set_url("mFrame::frmMainPage.xfdl");
	app.gvBase.fnAction('LOGIN', isLogin);
};

/*
 * 모바일 폼 초기화
 */
pForm.gfnMobileFormOnload = function(form) {
	let comps = form.components;
	for (let i in comps._idArray) {
		let comp = comps[i];
		
		if (comp instanceof nexacro.Div && !comp.url) {  // URL로 링크된 경우에는 존재하는 경우에는 해당 링크된 Form Onload에서 처리하도록 한다.
			this.gfnMobileFormOnload(comp.form);
		} else
		if (comp instanceof nexacro.Tab && comp.tabpages && comp.tabpages.length > 0) {
			let tablength = comp.tabpages.length;
			for (let j in comp.tabpages) {  // var j=0; j<nPages; j++  // URL로 링크된 경우에는 존재하는 경우에는 해당 링크된 Form Onload에서 처리하도록 한다.
				let tabpage = comp.tabpages[j];
				if (!tabpage.url) { form.gfnMobileFormOnload(tabpage.form); }
			}
		} 
		else {
// 			if (comp instanceof nexacro.Grid) {  // WMS Grid 기능
// 				form.initGridComponent(comp);  // this.gfnSetGrid(nxComp);
// 			} else
// 			
// 			if (comp instanceof nexacro.Static && comp.uDirection) {  // WMS Splitter 기능
// 				form.initSpliterComponent(comp, comp.uDirection, -1, -1);
// 			} else
			
			if (comp instanceof nexacro.Combo && comp.initComponent) {  // WMS Combo > MultiCombo
				comp.initComponent(form);
			}
			
			this.initClipboardComponent(comp);  // WMS Clipboard
		}
	}
};


pForm = null; delete pForm;