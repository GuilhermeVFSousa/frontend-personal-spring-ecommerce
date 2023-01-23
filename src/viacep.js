!(function (e, r, n) {
  "use strict";
  angular.module("angular.viacep", []),
    angular.module("angular.viacep").factory("viaCepHelper", [
      "viaCep",
      "$q",
      "VALID_KEYS",
      function (e, r, n) {
        var t, i, a, u, o, c;
        return (
          (c = {}),
          (i = function (e, r) {
            var t, i, a, u, o;
            for (o = [], t = 0, a = n.length; t < a; t++)
              (i = n[t]),
                void 0 !== r[i]
                  ? ((u = r[i]),
                    u.$modelValue
                      ? o.push(void 0)
                      : (u.$setViewValue(e[i]), o.push(u.$render())))
                  : o.push(void 0);
            return o;
          }),
          (t = function (e) {
            var r, t, i, a;
            for (a = [], r = 0, i = n.length; r < i; r++)
              (t = n[r]),
                void 0 !== e[t]
                  ? (e[t].$setViewValue(""), a.push(e[t].$render()))
                  : a.push(void 0);
            return a;
          }),
          (a = function (n, a) {
            var u;
            return (
              (u = r.defer()),
              e.get(n).then(
                function (e) {
                  return u.resolve(), i(e, a);
                },
                function (e) {
                  return u.reject(), t();
                }
              ),
              u.promise
            );
          }),
          (o = function (e) {
            var r;
            return (r = n.indexOf(e)), r !== -1;
          }),
          (u = function (e) {
            var r;
            return (
              "" !== e &&
              null !== e &&
              void 0 !== e &&
              ((r = e.replace(/\D/g, "")), 8 === r.length)
            );
          }),
          (c.fillAddress = i),
          (c.get = a),
          (c.isValidCep = u),
          (c.isValidKey = o),
          (c.cleanAddress = t),
          c
        );
      },
    ]),
    angular.module("angular.viacep").factory("viaCep", [
      "$http",
      "$q",
      function (e, r) {
        var n;
        return (
          (n = function (n) {
            var t, i, a;
            if (void 0 === n) throw new TypeError("CEP can't be undefined");
            if ("" === n) throw new TypeError("CEP can't be empty");
            if (null === n) throw new TypeError("CEP can't be null");
            return (
              (i = n.replace(/\D/g, "")),
              (a = "https://viacep.com.br/ws/" + i + "/json/"),
              (t = r.defer()),
              e.get(a).then(function (e) {
                var r;
                return (
                  (r = e.data),
                  r.erro ? t.reject("CEP not found") : t.resolve(r)
                );
              }),
              t.promise
            );
          }),
          { get: n }
        );
      },
    ]),
    angular.module("angular.viacep").directive("viaCep", [
      "viaCepHelper",
      function (e) {
        return {
          restrict: "A",
          require: ["ngModel", "^viaCepForm"],
          scope: { viacepKey: "@viaCep" },
          link: function (r, n, t, i) {
            var a, u, o;
            return (
              (o = i[0]),
              (u = i[1]),
              (a = function (r) {
                return e.isValidCep(r)
                  ? u.get(r).then(
                      function () {
                        return o.$setValidity("cep", !0);
                      },
                      function () {
                        return o.$setValidity("cep", !1);
                      }
                    )
                  : u.cleanAddress();
              }),
              "cep" === r.viacepKey
                ? r.$watch(
                    function () {
                      return o.$modelValue;
                    },
                    function (e) {
                      return a(e);
                    }
                  )
                : u.registerMapper(r.viacepKey, o)
            );
          },
        };
      },
    ]),
    angular.module("angular.viacep").directive("viaCepForm", [
      function () {
        return {
          restrict: "A",
          controller: [
            "$scope",
            "viaCepHelper",
            "VALID_KEYS",
            function (e, r, n) {
              var t, i, a, u;
              return (
                (this.mappers = []),
                (i = function (e) {
                  return r.get(e, this.mappers);
                }),
                (a = function (e) {
                  var r;
                  return (r = n.indexOf(e)), r !== -1;
                }),
                (t = function () {
                  return r.cleanAddress(this.mappers);
                }),
                (u = function (e, r) {
                  var t;
                  if (((t = a(e)), !t))
                    throw new TypeError("viacep key must be one of: " + n);
                  return (this.mappers[e] = r);
                }),
                (this.registerMapper = u),
                (this.get = i),
                (this.cleanAddress = t),
                this
              );
            },
          ],
          link: function (e, r, n) {},
        };
      },
    ]),
    angular
      .module("angular.viacep")
      .value("VALID_KEYS", [
        "cep",
        "logradouro",
        "complemento",
        "bairro",
        "localidade",
        "uf",
        "unidade",
        "ibge",
        "gia",
      ]);
})(window, document);
