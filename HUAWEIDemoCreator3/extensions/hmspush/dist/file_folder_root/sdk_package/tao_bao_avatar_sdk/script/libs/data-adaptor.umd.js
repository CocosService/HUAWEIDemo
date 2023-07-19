! function (e, r) {
    "object" == typeof exports && "undefined" != typeof module ? r(exports) : "function" == typeof define && define.amd ? define(["exports"], r) : r((e = "undefined" != typeof globalThis ? globalThis : e || self).__FigureAdaptor = {})
}(this, (function (e) {
    "use strict";
    /*! *****************************************************************************
        Copyright (c) Microsoft Corporation.

        Permission to use, copy, modify, and/or distribute this software for any
        purpose with or without fee is hereby granted.

        THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
        REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
        AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
        INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
        LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
        OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
        PERFORMANCE OF THIS SOFTWARE.
        ***************************************************************************** */
    var r = function () {
            return r = Object.assign || function (e) {
                for (var r, o = 1, t = arguments.length; o < t; o++)
                    for (var s in r = arguments[o]) Object.prototype.hasOwnProperty.call(r, s) && (e[s] = r[s]);
                return e
            }, r.apply(this, arguments)
        },
        o = function () {
            function e() {
                this._clothes = void 0, this._makeup = void 0, this._pose = void 0, this._animation = void 0, this._scene = void 0
            }
            return e.prototype.getClothes = function (e) {
                var r;
                return null === (r = this._clothes) || void 0 === r ? void 0 : r[e]
            }, e.prototype.getMakeup = function (e) {
                var r;
                return null === (r = this._makeup) || void 0 === r ? void 0 : r[e]
            }, e.prototype.getPose = function () {
                return this._pose
            }, e.prototype.getAnimation = function () {
                return this._animation
            }, e.prototype.getScene = function () {
                return this._scene
            }, e.prototype.setClothes = function (e) {
                this._clothes = e
            }, e.prototype.setMakeup = function (e) {
                this._makeup = e
            }, e.prototype.setPose = function (e) {
                this._pose = e
            }, e.prototype.setAnimation = function (e) {
                this._animation = e
            }, e.prototype.setScene = function (e) {
                this._scene = e
            }, e
        }(),
        t = new o,
        s = new(function () {
            function e() {
                this._enabledClothes = !0, this._enabledMakeup = !0, this._enabledPose = !0, this._enabledAnimation = !0, this._enabledScene = !0
            }
            return e.prototype.setEnabledClothes = function (e) {
                this._enabledClothes = e
            }, e.prototype.setEnabledMakeup = function (e) {
                this._enabledMakeup = e
            }, e.prototype.setEnabledPose = function (e) {
                this._enabledPose = e
            }, e.prototype.setEnabledAnimation = function (e) {
                this._enabledAnimation = e
            }, e.prototype.setEnabledScene = function (e) {
                this._enabledScene = e
            }, e.prototype.reportError = function (e) {
                this._errorCb && this._errorCb(e)
            }, e.prototype.setErrorCallBack = function (e) {
                this._errorCb = e
            }, e.prototype.checkPropsError = function (e) {
                var r = {
                    pass: !0,
                    errorKey: ""
                };
                return Object.keys(e).forEach((function (o) {
                    void 0 === e[o] && (r.pass = !1, r.errorKey = o)
                })), r
            }, e.prototype.checkClothes = function (e) {
                var r, o = (e || {}).type,
                    s = {
                        pass: !0,
                        downgrade: t.getClothes(o),
                        message: ""
                    };
                if (!this._enabledClothes) return s;
                if (!(null === (r = null == e ? void 0 : e.meshInfo) || void 0 === r ? void 0 : r.isNew)) return s;
                var n = e.meshInfo,
                    a = n.highToe,
                    i = n.sex,
                    c = n.bone,
                    u = n.subType,
                    p = n.textureRect,
                    d = n.textureUrl,
                    l = n.gltfUrl;
                switch (o) {
                    case "shoe":
                    case "wing":
                    case "necklace":
                    case "earring":
                    case "headwear":
                    case "glasses":
                    case "pants":
                    case "coat":
                    case "suit":
                        (f = this.checkPropsError({
                            highToe: a,
                            sex: i,
                            gltfUrl: l
                        })).pass || (s.pass = f.pass, s.message = "clothes ".concat(o, " id:").concat(e.id, " prop:").concat(f.errorKey, " is undefined"));
                        break;
                    case "sock":
                        (f = this.checkPropsError({
                            highToe: a,
                            sex: i,
                            textureRect: p,
                            textureUrl: d
                        })).pass || (s.pass = f.pass, s.message = "clothes ".concat(o, " id:").concat(e.id, " prop:").concat(f.errorKey, " is undefined"));
                        break;
                    case "handheld":
                        var f;
                        (f = this.checkPropsError({
                            bone: c,
                            highToe: a,
                            sex: i,
                            subType: u,
                            gltfUrl: l
                        })).pass || (s.pass = f.pass, s.message = "clothes ".concat(o, " id:").concat(e.id, " prop:").concat(f.errorKey, " is undefined"))
                }
                return s.pass || this.reportError({
                    type: "clothes",
                    subtype: o,
                    obj: e,
                    downgrade: s.downgrade,
                    message: s.message
                }), s
            }, e.prototype.checkMakeup = function (e) {
                var r = (e || {}).type,
                    o = {
                        pass: !0,
                        downgrade: t.getMakeup(r),
                        message: ""
                    };
                if (!this._enabledMakeup) return o;
                var s = e || {},
                    n = s.shapeInfo,
                    a = s.shapeInfo,
                    i = void 0 === a ? {} : a,
                    c = i.gltfUrl,
                    u = i.textureUrl,
                    p = i.textureRect;
                switch (r) {
                    case "con":
                    case "hair":
                        if (!(null == n ? void 0 : n.isNew)) return o;
                        (d = this.checkPropsError({
                            gltfUrl: c
                        })).pass || (o.pass = d.pass, o.message = "makeup ".concat(r, " id:").concat(e.id, " prop:").concat(d.errorKey, " is undefined"));
                        break;
                    case "moustache":
                    case "facialMakeup":
                    case "face":
                    case "eyebrow":
                    case "eyeLids":
                    case "eyesLine":
                    case "eyeLash":
                    case "blush":
                    case "eyeShadow":
                    case "lips":
                        if (!(null == n ? void 0 : n.isNew)) return o;
                        var d;
                        (d = this.checkPropsError({
                            textureUrl: u,
                            textureRect: p
                        })).pass || (o.pass = d.pass, o.message = "makeup ".concat(r, " id:").concat(e.id, " prop:").concat(d.errorKey, " is undefined"))
                }
                return o.pass || this.reportError({
                    type: "makeup",
                    subtype: r,
                    obj: e,
                    downgrade: o.downgrade,
                    message: o.message
                }), o
            }, e.prototype.checkPose = function (e) {
                var r = {
                    pass: !0,
                    downgrade: t.getPose(),
                    message: ""
                };
                if (!this._enabledPose) return r;
                if (!(null == e ? void 0 : e.isNew)) return r;
                var o = e.gltfUrl,
                    s = this.checkPropsError({
                        gltfUrl: o
                    });
                return s.pass || (r.pass = s.pass, r.message = "pose id:".concat(e.id, " prop:").concat(s.errorKey, " is undefined"), this.reportError({
                    type: "pose",
                    obj: e,
                    downgrade: r.downgrade,
                    message: r.message
                })), r
            }, e.prototype.checkAnimation = function (e) {
                var r = {
                    pass: !0,
                    downgrade: t.getAnimation(),
                    message: ""
                };
                if (!this._enabledAnimation) return r;
                if (!(null == e ? void 0 : e.isNew)) return r;
                var o = e.gltfUrl,
                    s = this.checkPropsError({
                        gltfUrl: o
                    });
                return s.pass || (r.pass = s.pass, r.message = "animation uuid:".concat(e.uuid, " animName:").concat(e.animName, " prop:").concat(s.errorKey, " is undefined"), this.reportError({
                    type: "animation",
                    obj: e,
                    downgrade: r.downgrade,
                    message: r.message
                })), r
            }, e.prototype.checkScene = function (e) {
                var r = {
                    pass: !0,
                    downgrade: t.getScene(),
                    message: ""
                };
                if (!this._enabledScene) return r;
                if (!(null == e ? void 0 : e.isNew)) return r;
                var o = e.gltfUrl,
                    s = this.checkPropsError({
                        gltfUrl: o
                    });
                return s.pass || (r.pass = s.pass, r.message = "scene uuid:".concat(e.uuid, " sceneId:").concat(e.sceneId, " prop:").concat(s.errorKey, " is undefined"), this.reportError({
                    type: "scene",
                    obj: e,
                    downgrade: r.downgrade,
                    message: r.message
                })), r
            }, e
        }()),
        n = {
            test: !1
        },
        a = function () {
            for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
            !n.test && console.error.apply(console, e)
        },
        i = function (e) {
            var r = e.isNew,
                o = e.artExtras,
                t = e.uuid,
                s = e.onError,
                n = {};
            if (!r || !o) return n;
            try {
                n = JSON.parse(o)
            } catch (e) {
                s && s({
                    err: e,
                    uuid: t,
                    artExtras: o
                }), a("artExtras杞崲澶辫触", e)
            }
            return n
        },
        c = function (e, o) {
            void 0 === e && (e = []), void 0 === o && (o = {});
            var t = o.onError,
                n = [];
            return null == e || e.forEach((function (e) {
                if (e) {
                    var o = e.meshInfo,
                        a = i({
                            isNew: null == o ? void 0 : o.isNew,
                            uuid: null == o ? void 0 : o.uuid,
                            artExtras: null == o ? void 0 : o.artExtras,
                            onError: t
                        }),
                        c = r(r({}, o), a),
                        u = r(r({}, e), {
                            meshInfo: c
                        }),
                        p = s.checkClothes(u);
                    p.pass ? n.push(u) : !p.pass && p.downgrade && n.push(p.downgrade)
                } else n.push(e)
            })), n
        },
        u = function (e, o) {
            void 0 === e && (e = []), void 0 === o && (o = {});
            var t = o.onError,
                n = [];
            return null == e || e.forEach((function (e) {
                if (e) {
                    var o = e.shapeInfo,
                        a = e.colorInfo,
                        c = i({
                            isNew: null == o ? void 0 : o.isNew,
                            uuid: null == o ? void 0 : o.uuid,
                            artExtras: null == o ? void 0 : o.artExtras,
                            onError: t
                        }),
                        u = i({
                            isNew: null == a ? void 0 : a.isNew,
                            uuid: null == a ? void 0 : a.uuid,
                            artExtras: null == a ? void 0 : a.artExtras,
                            onError: t
                        }),
                        p = r(r({}, o), c),
                        d = r(r({}, a), u),
                        l = r(r({}, e), {
                            shapeInfo: p,
                            colorInfo: d
                        }),
                        f = s.checkMakeup(l);
                    f.pass ? n.push(l) : !f.pass && f.downgrade && n.push(f.downgrade)
                } else n.push(e)
            })), n
        },
        p = function (e, o) {
            void 0 === o && (o = {});
            var t = o.onError,
                n = e || {},
                a = n.isNew,
                c = n.uuid,
                u = n.artExtras,
                p = i({
                    isNew: a,
                    uuid: c,
                    artExtras: u,
                    onError: t
                }),
                d = r(r({}, e), p),
                l = s.checkAnimation(d);
            if (l.pass) return d;
            if (!l.pass && l.downgrade) return l.downgrade;
            throw Error(l.message)
        };

    function d(e) {
        return e.replace(/_[a-z]/g, (function (e) {
            return e.charAt(1).toUpperCase()
        }))
    }

    function l(e) {
        Object.keys(e).forEach((function (r) {
            var o, t = JSON.parse(JSON.stringify(e[r]));
            if (null !== (o = t) && "object" == typeof o) {
                var s = Object.keys(t);
                if (1 === s.length && Array.isArray(t[s[0]])) return delete e[r][s[0]], delete e[r], e[d(r)] = t[s[0]], void l(e[d(r)]);
                delete e[r], e[d(r)] = t, l(t)
            }
            delete e[r], e[d(r)] = t
        }))
    }
    e.Config = n, e.adaptConvertOjb = i, e.adaptorAnimationInfo = p, e.adaptorCharacterInfo = function (e, o) {
        void 0 === o && (o = {});
        var t, s = o.onError,
            n = e.defaultAnimInfo,
            i = e.model,
            d = i.clothes,
            l = i.makeup_face,
            f = i.face;
        try {
            t = n && p(n, {
                onError: s
            })
        } catch (e) {
            a("浜虹墿寰呮満鍔ㄤ綔璁剧疆寮傚父:", e)
        }
        var h = {
            clothes: c(d, {
                onError: s
            }),
            makeup_face: u(l, {
                onError: s
            }),
            face: f
        };
        return r(r(r({}, e), {
            model: h
        }), {
            defaultAnimInfo: t
        })
    }, e.adaptorClothes = c, e.adaptorClothesDict = function (e, r) {
        void 0 === e && (e = []), void 0 === r && (r = {});
        var o = r.onError,
            t = c(Object.values(e), {
                onError: o
            }),
            s = {};
        return t.forEach((function (e) {
            (null == e ? void 0 : e.type) && (s[e.type] = e)
        })), s
    }, e.adaptorMakeups = u, e.adaptorMakeupsDict = function (e, r) {
        void 0 === e && (e = []), void 0 === r && (r = {});
        var o = r.onError,
            t = u(Object.values(e), {
                onError: o
            }),
            s = {};
        return t.forEach((function (e) {
            (null == e ? void 0 : e.type) && (s[e.type] = e)
        })), s
    }, e.adaptorPoseInfo = function (e, o) {
        void 0 === o && (o = {});
        var t = e || {},
            n = t.isNew,
            a = t.uuid,
            c = t.artExtras,
            u = o.onError,
            p = i({
                isNew: n,
                artExtras: c,
                uuid: a,
                onError: u
            }),
            d = r(r({}, e), p),
            l = s.checkPose(d);
        if (l.pass) return d;
        if (!l.pass && l.downgrade) return l.downgrade;
        throw Error(l.message)
    }, e.adaptorSceneInfo = function (e, o) {
        void 0 === o && (o = {});
        var t = e || {},
            n = t.isNew,
            a = t.uuid,
            c = t.artExtras,
            u = t.sceneType,
            p = o.onError;
        e && !u && (e.sceneType = 0);
        var d = i({
                isNew: n,
                uuid: a,
                artExtras: c,
                onError: p
            }),
            l = r(r({}, e), d),
            f = s.checkScene(l);
        if (f.pass) return l;
        if (!f.pass && f.downgrade) return f.downgrade;
        throw Error(f.message)
    }, e.checker = s, e.convertApiData = function (e) {
        var r = JSON.parse(JSON.stringify(e));
        return l(r), r.openUserFigureDTO ? r.openUserFigureDTO : r
    }, e.downgrade = t, Object.defineProperty(e, "__esModule", {
        value: !0
    })
}));
//# sourceMappingURL=data-adaptor.umd.js.map