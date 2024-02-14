/************************************************************************
 * Nexacro Form
 ************************************************************************/
var pForm = nexacro.Form.prototype;

// this.initComponent(function(){  });
pForm.initComponent = function(f) {
	if (f) { this.setEventHandler('onload', f, this); }
};

pForm = null; delete pForm;