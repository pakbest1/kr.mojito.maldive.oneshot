/**
 *  SVC-WMS Toast Library
 *  @FileName 	  WMS_MultiCombo.js
 *  @Creator 	  SVC-WMS
 *  @CreateDate   2023/11/30
 *  @Desction
 ************** 소스 수정 이력 ***********************************************
 *  date        Modifier         Description
 *******************************************************************************
 * 2023/11/30   SVC-WMS          Toast Library
 *******************************************************************************
 */

/**
 * @class Toast - Web에서만 작동함.
 */
if (!nexacro.Toast) {
	nexacro.Toast = function() {
		this._toast = {
			wrap: new Div("divToastWrap",null,null,"110","100","0","0",null,null,null,null,this),
		};
		
		// Toast Wrapping
		let divToastWrap = new Div("divToastWrap",null,null,"110","100","0","0",null,null,null,null,this);
		divToastWrap.set_taborder("9999");
		this.addChild(divToastWrap.name, divToastWrap);
	};
}

var pForm = nexacro.Form.prototype, pWms = nexacro.Wms.prototype;

/**
 * @class Toast
 * @param s 메세지
 * @param t 타이틀
 */
pForm.toast = pWms.toast = function(opts) {
	if (!opts) { return; }
	
	if (opts.text) { opts.text = this.gfn_GetMsg(opts.text, opts.args)||opts.text; }
	opts = Object.assign(opts, { showHideTransition: 'fade' });
	
	return $.toast(opts);
};


pForm=null; delete pForm;
pWms=null; delete pWms;