/**
 *  SVC-WMS Grid Filter Library
 *  @FileName 	  WMS_Grid_Filter.js
 *  @Creator 	  SVC-WMS
 *  @CreateDate   2024/02/05
 *  @Desction
 ************** 소스 수정 이력 ***********************************************
 *  date        Modifier         Description
 *******************************************************************************
 * 2024/02/05   SVC-WMS          Grid Filter Library
 *******************************************************************************
 */
var pForm = nexacro.Form.prototype;  // Prototype Getter

/*******************************************************************************************************************************
 * Grid Filter - Show
 *******************************************************************************************************************************/
pForm.Grid_Filter_Show = function(obj) {
	if (!obj || !obj instanceof nexacro.Grid) { return; }
	let form = obj._getForm(), grid = obj, config = grid.config;
	let functions = grid._functions||wms.getUserFunctionsProperty(grid), filter = functions.filter;
	
	if ('search' == filter.type) {
		form.Grid_FilterSearch_Show(grid);
	} else {
		form.Grid_FilterCombo_Show(grid, 'equals');  // like
	}
};

/*******************************************************************************************************************************
 * Grid Filter - Hide
 *******************************************************************************************************************************/
pForm.Grid_Filter_Hide = function(obj) {
	if (!obj || !obj instanceof nexacro.Grid) { return; }
	let form = obj._getForm(), grid = obj, config = grid.config;
	let functions = grid._functions||wms.getUserFunctionsProperty(grid), filter = functions.filter;
	
	if ('search' == filter.type) {
		form.Grid_FilterSearch_Hide(grid);
	} else {
		form.Grid_FilterCombo_Hide(grid);
	}
}

// /*******************************************************************************************************************************
//  * Grid Filter - Apply
//  *******************************************************************************************************************************/
// pForm.Grid_Filter_Apply = function(obj, uid) {
// 	if (!obj || !obj instanceof nexacro.Grid) { return; }
// 	let form = obj._getForm(), grid = obj, config = grid.config;
// };

pForm = null; delete pForm;
