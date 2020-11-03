cc.Class({
	extends: cc.Component,

	properties: {
		console: require('Console')
	},


	start() {
		this.hasStorage = huawei && huawei.agc && huawei.agc.storage && huawei.agc.storage.storageService && huawei.agc.storage.storageService.support ? true : false;
		if (this.hasStorage) this._storage = huawei.agc.storage;
		this._storage.storageService.on("error", data => this.console.log("Cloud Storage", `error : ${data.errCode}:${data.errMsg}`), this);
		this._storage.storageService.on("get-file-metadata", data => this.console.log("Cloud Storage", JSON.stringify(data)), this);
		this._storage.storageService.on("update-file-metadata", data => this.console.log("Cloud Storage", JSON.stringify(data)), this);
		this._storage.storageService.on("delete-file", data => this.console.log("Cloud Storage", JSON.stringify(data)), this);
		this._storage.storageService.on("list-file", data => this.console.log("Cloud Storage", JSON.stringify(data)), this);
		this._storage.storageService.on("get-download-url", data => this.console.log("Cloud Storage", JSON.stringify(data)), this);
		this._storage.storageService.on("task", data => {
			this.console.log("Cloud Storage", JSON.stringify(data));
			if (data.task instanceof this._storage.AGCDownloadTask && data.status === 'successful') {
				jsb.fileUtils.renameFile(jsb.fileUtils.getWritablePath() + "/output.json", jsb.fileUtils.getWritablePath() + "/output1.json");
			}

		}, this);
		// 创建根目录的引用
		this.rootReference = huawei.agc.storage.storageService.getInstance().getStorageReference();
	},

	listAll() {
		if (!this.hasStorage) return;
		this.rootReference.listAll();
	},

	download() {
		if (!this.hasStorage) return;
		if (typeof jsb === 'undefined') return;
		// 先 delete 文件，避免文件已存在导致下载失败
		jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + "/output.json");
		this.rootReference.child("output.json").getFile(jsb.fileUtils.getWritablePath() + "/output.json");
	},

	upload() {
		if (!this.hasStorage) return;
		if (typeof jsb === 'undefined') return;
		if (!jsb.fileUtils.isFileExist(jsb.fileUtils.getWritablePath() + "/output1.json")) {
			return this.console.log('Cloud Storage', 'local file output1.json not exist, please click Download!')
		}
		this.rootReference.child("output1.json").putFile(jsb.fileUtils.getWritablePath() + "/output1.json");
	},

	delete() {
		if (!this.hasStorage) return;
		this.rootReference.child("output1.json").delete();
		jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + "/output.json");
		jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + "/output1.json");
	},


	returnClick() {
		cc.director.loadScene('list');
	},

	onDestroy() {},


	// update (dt) {},
});