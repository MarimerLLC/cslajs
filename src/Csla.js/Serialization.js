/// <reference path="Core/BusinessBase.ts" />
var Csla;
(function (Csla) {
    var Serialization = (function () {
        function Serialization() {
        }
        Serialization.prototype.serialize = function (obj) {
            return JSON.stringify(obj);
        };

        Serialization.prototype.deserialize = function (text, c, scope) {
            var result = new c(scope);
            result.deserialize(JSON.parse(text));
            return result;
        };
        return Serialization;
    })();
    Csla.Serialization = Serialization;
})(Csla || (Csla = {}));
//# sourceMappingURL=Serialization.js.map
