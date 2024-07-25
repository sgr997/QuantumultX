/** 
[rewrite_local]
^https?:\/\/h5\.gumingnc\.com\/newton-buyer\/newton\/buyer\/ump\/milk\/tea\/activity\/index url script-request-header https://raw.githubusercontent.com/sgr997/QuantumultX/main/guming.js
^https?:\/\/h5\.gumingnc\.com\/newton-buyer\/newton\/buyer\/ump\/milk\/tea\/activity\/fcfs url script-request-header https://raw.githubusercontent.com/sgr997/QuantumultX/main/guming.js

[task_local]
1 0 * * * https://raw.githubusercontent.com/sgr997/QuantumultX/main/guming.js

[mitm]

hostname=h5.gumingnc.com
**/
const $ = new Env('guming');

$.KEY_IS_DEBUG = 'IS_DEBUG'
$.KEY_GM_TIMES = 'GM_TIMES'
$.KEY_WAIT_TIME = 'WAIT_TIME'
$.KEY_GUMING_WX_USER = 'GUMING_WX_USER'
$.KEY_GUMING_WX_USER2 = 'GUMING_WX_USER2'
$.KEY_GUMING_ALIPAY_USER = 'GUMING_ALIPAY_USER'
$.KEY_activityId = 'activityId'
$.KEY_keyWordAnswer = 'keyWordAnswer'
$.KEY_consumptionInventoryId = 'consumptionInventoryId'

if (typeof $request !== 'undefined') {
    try {
        // 获取cookie，token
        let authorization = $request.headers.Authorization;
        let cookie = $request.headers.Cookie;
        let referer = $request.headers.Referer;
        let userAgent = $request.headers['User-Agent'];
        let tToken = $request.headers['t-token'];
        let channelCode = '20'
        if (userAgent.indexOf('miniProgram/wx') != -1) {
            channelCode = '20'
        }
        if (userAgent.indexOf('AlipayClient') != -1) {
            channelCode = '60'
        }

        if (channelCode === '20') {
            // 微信
            $.VAL_GUMING_WX_USER = { authorization, cookie, tToken, referer, userAgent, 'channelCode': channelCode, 'brandId': 1 }
            $.setjson($.VAL_GUMING_WX_USER, $.KEY_GUMING_WX_USER)
        } else {
            // 支付宝
            $.VAL_GUMING_ALIPAY_USER = { authorization, cookie, tToken, referer, userAgent, 'channelCode': channelCode, 'brandId': 1 }
            $.setjson($.VAL_GUMING_ALIPAY_USER, $.KEY_GUMING_ALIPAY_USER)
        }
        $.msg(`添加${channelCode == '20' ? '微信' : '支付宝'}古茗账号成功🎉`, '', `请在Quantumult-X中禁用该脚本`)
    } catch (e) {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    } finally {
        $.log('', `🔔 ${$.name}, 结束!`, '');
        $.done()
    }
} else {
    $.VAL_IS_DEBUG = $.getdata($.KEY_IS_DEBUG, 'false')
    $.VAL_GM_TIMES = $.getdata($.KEY_GM_TIMES, 1)
    $.VAL_WAIT_TIME = $.getdata($.KEY_WAIT_TIME, 500)
    $.VAL_GUMING_WX_USER = $.getjson($.KEY_GUMING_WX_USER)
    $.VAL_GUMING_WX_USER2 = $.getjson($.KEY_GUMING_WX_USER2)
    $.VAL_GUMING_ALIPAY_USER = $.getjson($.KEY_GUMING_ALIPAY_USER)
    $.VAL_activityId = $.getdata($.KEY_activityId) || ''
    $.VAL_keyWordAnswer = $.getdata($.KEY_keyWordAnswer) || ''
    $.VAL_consumptionInventoryId = $.getdata($.KEY_consumptionInventoryId) || 0

    if (!$.VAL_activityId || !$.VAL_keyWordAnswer || !$.VAL_consumptionInventoryId) {
        $.log('', `❌ ${$.name}, 失败! 原因: 配置缺失!`, '')
        $.done()
    }

    !(async () => {
        const yesUser = []
        let ca = 0
        if ($.VAL_GUMING_WX_USER){
            ca = ca + 1
        }
        if ($.VAL_GUMING_ALIPAY_USER){
            ca = ca + 1
        }
        if ($.VAL_GUMING_WX_USER2){
            ca = ca + 1
        }
        for (let i = 0; i < $.VAL_GM_TIMES; i++) {
            if (yesUser.length === ca) {
                break
            }
            if ($.VAL_GUMING_WX_USER && yesUser.indexOf($.VAL_GUMING_WX_USER) === -1 && await evalUser($.VAL_GUMING_WX_USER)) {
                yesUser.push($.VAL_GUMING_WX_USER)
                $.msg(`微信古茗账号完成🎊`, '', `自己去账号看吧`)
            }
            if ($.VAL_GUMING_WX_USER2 && yesUser.indexOf($.VAL_GUMING_WX_USER2) === -1 && await evalUser($.VAL_GUMING_WX_USER2)) {
                yesUser.push($.VAL_GUMING_WX_USER2)
                $.msg(`微信2古茗账号完成🎊`, '', `自己去账号看吧`)
            }
            if ($.VAL_GUMING_ALIPAY_USER && yesUser.indexOf($.VAL_GUMING_ALIPAY_USER) === -1 && await evalUser($.VAL_GUMING_ALIPAY_USER)) {
                yesUser.push($.VAL_GUMING_ALIPAY_USER)
                $.msg(`支付宝古茗账号完成🎊`, '', `自己去账号看吧`)
            }
            await $.wait($.VAL_WAIT_TIME)
        }

    })()
        .catch((e) => {
            $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
        })
        .finally(() => {
            $.msg(`🔔 ${$.name}, 结束!`, `🔔 ${$.name}, 结束!`, '');
            $.done();
        })

}

function evalUser(user) {
    $.log(`开始执行${user.channelCode == '20' ? '微信' : '支付宝'}古茗账号`)
    const headers = {
            'Sec-Fetch-Dest': `empty`,
            'Connection': `keep-alive`,
            'Accept-Encoding': `gzip, deflate, br`,
            'Content-Type': `application/json`,
            'Sec-Fetch-Site': `same-origin`,
            'Origin': `https://h5.gumingnc.com`,
            'Cache-Control': `max-age=0`,
            'User-Agent': `${user.userAgent}`,
            'Authorization': `${user.authorization}`,
            'Sec-Fetch-Mode': `cors`,
            't-token': `${user.tToken}`,
            'Host': `h5.gumingnc.com`,
            'Referer': `${user.referer}`,
            'Cookie': `${user.cookie}`,
            'Accept-Language': `zh-CN,zh-Hans;q=0.9`,
            'Accept': `*/*`
        }
    if($.VAL_IS_DEBUG == 'true'){
        $.log(JSON.stringify(headers))
    }
    let option = {
        url: $.VAL_IS_DEBUG == 'true' ? `https://blogapi.goku.top/test?code=0&msg=success` : `https://h5.gumingnc.com/newton-buyer/newton/buyer/ump/milk/tea/activity/fcfs`,
        headers: $.VAL_IS_DEBUG == 'true' ? {} : headers,
        body: `{"channelCode":${user.channelCode},"activityId":${$.VAL_activityId},"brandId":${user.brandId},"keyWordAnswer":"${$.VAL_keyWordAnswer}","consumptionInventoryId":${$.VAL_consumptionInventoryId}}`
    }
    return $.http.post(option).then(response => {
        $.log(`${response.body}`)
        return response.body.indexOf('参与次数已达上限1次')!==-1
        //let result = JSON.parse(response.body)
        //if (result.code == 0) {
            //$.msg(`${user.channelCode == '20' ? '微信' : '支付宝'}古茗账号抢券成功`, '', `${user.channelCode == '20' ? '微信' : '支付宝'}古茗账号抽奖结果：${result.msg}`)
        //} else {
            //$.log(`${user.channelCode == '20' ? '微信' : '支付宝'}古茗账号抽奖结果：${result.msg}`)
        //}
        //return result.code == 0
    })
}

function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; "POST" === e && (s = this.post); const i = new Promise(((e, i) => { s.call(this, t, ((t, s, o) => { t ? i(t) : e(s) })) })); return t.timeout ? ((t, e = 1e3) => Promise.race([t, new Promise(((t, s) => { setTimeout((() => { s(new Error("请求超时")) }), e) }))]))(i, t.timeout) : i } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.logLevels = { debug: 0, info: 1, warn: 2, error: 3 }, this.logLevelPrefixs = { debug: "[DEBUG] ", info: "[INFO] ", warn: "[WARN] ", error: "[ERROR] " }, this.logLevel = "info", this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.encoding = "utf-8", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } getEnv() { return "undefined" != typeof $environment && $environment["surge-version"] ? "Surge" : "undefined" != typeof $environment && $environment["stash-version"] ? "Stash" : "undefined" != typeof module && module.exports ? "Node.js" : "undefined" != typeof $task ? "Quantumult X" : "undefined" != typeof $loon ? "Loon" : "undefined" != typeof $rocket ? "Shadowrocket" : void 0 } isNode() { return "Node.js" === this.getEnv() } isQuanX() { return "Quantumult X" === this.getEnv() } isSurge() { return "Surge" === this.getEnv() } isLoon() { return "Loon" === this.getEnv() } isShadowrocket() { return "Shadowrocket" === this.getEnv() } isStash() { return "Stash" === this.getEnv() } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null, ...s) { try { return JSON.stringify(t, ...s) } catch { return e } } getjson(t, e) { let s = e; if (this.getdata(t)) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise((e => { this.get({ url: t }, ((t, s, i) => e(i))) })) } runScript(t, e) { return new Promise((s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let o = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); o = o ? 1 * o : 20, o = e && e.timeout ? e.timeout : o; const [r, a] = i.split("@"), n = { url: `http://${a}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: o }, headers: { "X-Key": r, Accept: "*/*" }, policy: "DIRECT", timeout: o }; this.post(n, ((t, e, i) => s(i))) })).catch((t => this.logErr(t))) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), o = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, o) : i ? this.fs.writeFileSync(e, o) : this.fs.writeFileSync(t, o) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let o = t; for (const t of i) if (o = Object(o)[t], void 0 === o) return s; return o } lodash_set(t, e, s) { return Object(t) !== t || (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce(((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}), t)[e[e.length - 1]] = s), t } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), o = s ? this.getval(s) : ""; if (o) try { const t = JSON.parse(o); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, o] = /^@(.*?)\.(.*?)$/.exec(e), r = this.getval(i), a = i ? "null" === r ? null : r || "{}" : "{}"; try { const e = JSON.parse(a); this.lodash_set(e, o, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const r = {}; this.lodash_set(r, o, t), s = this.setval(JSON.stringify(r), i) } } else s = this.setval(t, e); return s } getval(t) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": return $persistentStore.read(t); case "Quantumult X": return $prefs.valueForKey(t); case "Node.js": return this.data = this.loaddata(), this.data[t]; default: return this.data && this.data[t] || null } } setval(t, e) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": return $persistentStore.write(t, e); case "Quantumult X": return $prefs.setValueForKey(t, e); case "Node.js": return this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0; default: return this.data && this.data[e] || null } } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.cookie && void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))) } get(t, e = (() => { })) { switch (t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"], delete t.headers["content-type"], delete t.headers["content-length"]), t.params && (t.url += "?" + this.queryStr(t.params)), void 0 === t.followRedirect || t.followRedirect || ((this.isSurge() || this.isLoon()) && (t["auto-redirect"] = !1), this.isQuanX() && (t.opts ? t.opts.redirection = !1 : t.opts = { redirection: !1 })), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, ((t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status ? s.status : s.statusCode, s.status = s.statusCode), e(t, s, i) })); break; case "Quantumult X": this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then((t => { const { statusCode: s, statusCode: i, headers: o, body: r, bodyBytes: a } = t; e(null, { status: s, statusCode: i, headers: o, body: r, bodyBytes: a }, r, a) }), (t => e(t && t.error || "UndefinedError"))); break; case "Node.js": let s = require("iconv-lite"); this.initGotEnv(t), this.got(t).on("redirect", ((t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } })).then((t => { const { statusCode: i, statusCode: o, headers: r, rawBody: a } = t, n = s.decode(a, this.encoding); e(null, { status: i, statusCode: o, headers: r, rawBody: a, body: n }, n) }), (t => { const { message: i, response: o } = t; e(i, o, o && s.decode(o.rawBody, this.encoding)) })); break } } post(t, e = (() => { })) { const s = t.method ? t.method.toLocaleLowerCase() : "post"; switch (t.body && t.headers && !t.headers["Content-Type"] && !t.headers["content-type"] && (t.headers["content-type"] = "application/x-www-form-urlencoded"), t.headers && (delete t.headers["Content-Length"], delete t.headers["content-length"]), void 0 === t.followRedirect || t.followRedirect || ((this.isSurge() || this.isLoon()) && (t["auto-redirect"] = !1), this.isQuanX() && (t.opts ? t.opts.redirection = !1 : t.opts = { redirection: !1 })), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient[s](t, ((t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status ? s.status : s.statusCode, s.status = s.statusCode), e(t, s, i) })); break; case "Quantumult X": t.method = s, this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then((t => { const { statusCode: s, statusCode: i, headers: o, body: r, bodyBytes: a } = t; e(null, { status: s, statusCode: i, headers: o, body: r, bodyBytes: a }, r, a) }), (t => e(t && t.error || "UndefinedError"))); break; case "Node.js": let i = require("iconv-lite"); this.initGotEnv(t); const { url: o, ...r } = t; this.got[s](o, r).then((t => { const { statusCode: s, statusCode: o, headers: r, rawBody: a } = t, n = i.decode(a, this.encoding); e(null, { status: s, statusCode: o, headers: r, rawBody: a, body: n }, n) }), (t => { const { message: s, response: o } = t; e(s, o, o && i.decode(o.rawBody, this.encoding)) })); break } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } queryStr(t) { let e = ""; for (const s in t) { let i = t[s]; null != i && "" !== i && ("object" == typeof i && (i = JSON.stringify(i)), e += `${s}=${i}&`) } return e = e.substring(0, e.length - 1), e } msg(e = t, s = "", i = "", o = {}) { const r = t => { const { $open: e, $copy: s, $media: i, $mediaMime: o } = t; switch (typeof t) { case void 0: return t; case "string": switch (this.getEnv()) { case "Surge": case "Stash": default: return { url: t }; case "Loon": case "Shadowrocket": return t; case "Quantumult X": return { "open-url": t }; case "Node.js": return }case "object": switch (this.getEnv()) { case "Surge": case "Stash": case "Shadowrocket": default: { const r = {}; let a = t.openUrl || t.url || t["open-url"] || e; a && Object.assign(r, { action: "open-url", url: a }); let n = t["update-pasteboard"] || t.updatePasteboard || s; if (n && Object.assign(r, { action: "clipboard", text: n }), i) { let t, e, s; if (i.startsWith("http")) t = i; else if (i.startsWith("data:")) { const [t] = i.split(";"), [, o] = i.split(","); e = o, s = t.replace("data:", "") } else { e = i, s = (t => { const e = { JVBERi0: "application/pdf", R0lGODdh: "image/gif", R0lGODlh: "image/gif", iVBORw0KGgo: "image/png", "/9j/": "image/jpg" }; for (var s in e) if (0 === t.indexOf(s)) return e[s]; return null })(i) } Object.assign(r, { "media-url": t, "media-base64": e, "media-base64-mime": o ?? s }) } return Object.assign(r, { "auto-dismiss": t["auto-dismiss"], sound: t.sound }), r } case "Loon": { const s = {}; let o = t.openUrl || t.url || t["open-url"] || e; o && Object.assign(s, { openUrl: o }); let r = t.mediaUrl || t["media-url"]; return i?.startsWith("http") && (r = i), r && Object.assign(s, { mediaUrl: r }), console.log(JSON.stringify(s)), s } case "Quantumult X": { const o = {}; let r = t["open-url"] || t.url || t.openUrl || e; r && Object.assign(o, { "open-url": r }); let a = t["media-url"] || t.mediaUrl; i?.startsWith("http") && (a = i), a && Object.assign(o, { "media-url": a }); let n = t["update-pasteboard"] || t.updatePasteboard || s; return n && Object.assign(o, { "update-pasteboard": n }), console.log(JSON.stringify(o)), o } case "Node.js": return }default: return } }; if (!this.isMute) switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: $notification.post(e, s, i, r(o)); break; case "Quantumult X": $notify(e, s, i, r(o)); break; case "Node.js": break }if (!this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } debug(...t) { this.logLevels[this.logLevel] <= this.logLevels.debug && (t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(`${this.logLevelPrefixs.debug}${t.map((t => t ?? String(t))).join(this.logSeparator)}`)) } info(...t) { this.logLevels[this.logLevel] <= this.logLevels.info && (t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(`${this.logLevelPrefixs.info}${t.map((t => t ?? String(t))).join(this.logSeparator)}`)) } warn(...t) { this.logLevels[this.logLevel] <= this.logLevels.warn && (t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(`${this.logLevelPrefixs.warn}${t.map((t => t ?? String(t))).join(this.logSeparator)}`)) } error(...t) { this.logLevels[this.logLevel] <= this.logLevels.error && (t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(`${this.logLevelPrefixs.error}${t.map((t => t ?? String(t))).join(this.logSeparator)}`)) } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.map((t => t ?? String(t))).join(this.logSeparator)) } logErr(t, e) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": case "Quantumult X": default: this.log("", `❗️${this.name}, 错误!`, e, t); break; case "Node.js": this.log("", `❗️${this.name}, 错误!`, e, void 0 !== t.message ? t.message : t, t.stack); break } } wait(t) { return new Promise((e => setTimeout(e, t))) } done(t = {}) { const e = ((new Date).getTime() - this.startTime) / 1e3; switch (this.log("", `🔔${this.name}, 结束! 🕛 ${e} 秒`), this.log(), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": case "Quantumult X": default: $done(t); break; case "Node.js": process.exit(1) } } }(t, e) }
