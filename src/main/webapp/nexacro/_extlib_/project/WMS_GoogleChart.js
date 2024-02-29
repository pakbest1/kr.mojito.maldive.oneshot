/**
 *  SVC-WMS GoogleChart Library
 *  @FileName 	  WMS_GoogleChart.js
 *  @Creator 	  SVC-WMS
 *  @CreateDate   2024/02/22
 *  @Desction
 ************** 소스 수정 이력 ***********************************************
 *  date        Modifier         Description
 *******************************************************************************
 * 2024/02/22   SVC-WMS          Toast Library
 *******************************************************************************
 */
var pForm = nexacro.Form.prototype, pWms = nexacro.Wms.prototype;

/**
 * _WBCallMethod
 * @param t
 * @param o
 */
pForm._WBCallMethod = function(w, t, o) {
	if (!w || !(w instanceof nexacro.WebBrowser) || !o) { return; }
	
	try {
		w.callMethod(t, o);
	} catch(err) {
		w.setEventHandler('onloadcompleted', function(obj,e) {  // obj:nexacro.WebBrowser,e:nexacro.WebLoadCompEventInfo
			w._loadcompleted = true;
			w.callMethod(t, o);
		}, this);
	}
	
};

/**
 * chartDraw
 * @param o
 * @param delay 지연시간(밀리초)
 */
pForm.chartDraw = function(w, o) {
	this._WBCallMethod(w, 'chartDraw', o);
};

/**
 * chartDraw
 * @param o
 * @param delay 지연시간(밀리초)
 */
pForm.tableDraw = function(w, o, d=800) {
	this._WBCallMethod(w, 'tableDraw', o); 
};

pForm=null; delete pForm;