// ============================================================================
// Mojoto Lib 설정
// ============================================================================
// 2023.12.10 최초작성 v1.0

// Class 생성자
nexacro._Mojito = function(_a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l) {
	//nexacro.Component.call(this, _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l);
	this._config = { isDebug: true };
	
	// ...
};
var pMojito = nexacro._Mojito.prototype = nexacro._createPrototype(nexacro.Object, nexacro._Mojito);  // Prototype Getter
// ============================================================================

// 랜덤 문자열 가져오기
pMojito.getRandomString = function(num=8) {
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

pMojito = null; delete pMojito;

// ============================================================================
$m=mojito=nexacro.Mojito=new nexacro._Mojito();
//$m.getRandomString();