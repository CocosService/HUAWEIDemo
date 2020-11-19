cc.Class({
	extends: cc.Component,

	properties: {
		console: require('Console'),
	},


	start() {
		this.hasFunc = huawei && huawei.agc && huawei.agc.func && huawei.agc.func.funcService && huawei.agc.func.funcService.support ? true : false;
		if (this.hasFunc) this._func = huawei.agc.func.funcService;
	},

	callWithParam() {
		if (!this.hasFunc) return;
		this._func.wrap("func-$latest").call((err, data) => {
			if (err !== null)
				this.console.log("Cloud Function", `error: ${JSON.stringify(err)}`);
			this.console.log("Cloud Function", `result: ${JSON.stringify(data)}`);
		}, {
			data: "data",
			data2: {
				data3: "data3e",
				data4: 123
			}
		});
	},

	callWithoutParam() {
		if (!this.hasFunc) return;
		this._func.wrap("func-$latest").call((err, data) => {
			if (err !== null)
				this.console.log("Cloud Function", `error: ${JSON.stringify(err)}`);
			this.console.log("Cloud Function", `result: ${JSON.stringify(data)}`);
		});
	},


	returnClick() {
		cc.director.loadScene('list');
	},

	onDestroy() {},


	// update (dt) {},
});