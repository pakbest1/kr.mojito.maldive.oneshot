// ============================================================================
// Mojoto Lib 설정
// ============================================================================
// 2023.12.10 최초작성 v1.0

// Class 생성자
nexacro.Mojito = function(_a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l) {
	//nexacro.Component.call(this, _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l);
	this._config = { isDebug: true };
	
	// ... 
};
nexacro.mojito = nexacro._createPrototype(nexacro.Object, nexacro.Mojito);

var pMojito = nexacro.Mojito.prototype;
// ============================================================================

// 랜덤 문자열 가져오기
pMojito.getStringRandom = function(length=8) {
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

pMojito = null; delete pMojito;

// ============================================================================

$m=mojito=nexacro.mojito=new nexacro.Mojito();
//$m.getRandomString();