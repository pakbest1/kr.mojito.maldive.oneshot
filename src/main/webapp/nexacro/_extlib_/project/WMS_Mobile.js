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


pForm = null; delete pForm;