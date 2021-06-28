import { _decorator, Component } from 'cc';
import { Console } from '../prefabs/console';
const { ccclass, property } = _decorator;

@ccclass('Storage')
export class Storage extends Component {
    @property({ type: Console })
    console: Console = null!;

    private rootReference!: huawei.agc.storage.AGCStorageReference;

    start() {
        const storage = huawei.agc.storage;
        storage.storageService.on(
            'error',
            (data: any) =>
                this.console.log(`error : ${data.errCode}:${data.errMsg}`),
            this
        );
        storage.storageService.on(
            'get-file-metadata',
            (data: any) => this.console.log('get-file-metadata:', data),
            this
        );
        storage.storageService.on(
            'update-file-metadata',
            (data: any) => this.console.log('update-file-metadata:', data),
            this
        );
        storage.storageService.on(
            'delete-file',
            (data: any) => this.console.log('delete-file:', data),
            this
        );
        storage.storageService.on(
            'list-file',
            (data: any) => this.console.log('list-file:', data),
            this
        );
        storage.storageService.on(
            'get-download-url',
            (data: any) => this.console.log('get-download-url:', data),
            this
        );
        storage.storageService.on(
            'task',
            (data: any) => {
                this.console.log('task:', data);
                if (
                    data.task instanceof storage.AGCDownloadTask &&
                    data.status === 'successful'
                ) {
                    // @ts-ignore
                    jsb.fileUtils.renameFile(
                        jsb.fileUtils.getWritablePath() + '/output.json',
                        jsb.fileUtils.getWritablePath() + '/output1.json'
                    );
                }
                this.console.log(data.reference.getPath());
            },
            this
        );
        // Create root reference
        this.rootReference = storage.storageService
            .getInstance()
            .getStorageReference();
        // test
        this.rootReference.child('output.json').updateFileMetadata({
            customMetadata: {
                a: 1,
            },
        });
        this.console.log(
            'Cloud Storage AutoTest: getExternalStorageDirectory() => ',
            storage.storageService.getExternalStorageDirectory()
        );
        this.console.log(
            'Cloud Storage AutoTest: toString() => ',
            this.rootReference.child('output.json').toString()
        );
        this.console.log(
            'Cloud Storage AutoTest: hashCode() => ',
            this.rootReference.child('output.json').hashCode()
        );
        this.console.log(
            'Cloud Storage AutoTest: compareTo() => ',
            this.rootReference
                .child('output.json')
                .compareTo(this.rootReference.child('output1.json'))
        );
        this.console.log(
            'Cloud Storage AutoTest: equals() => ',
            this.rootReference
                .child('output.json')
                .equals(this.rootReference.child('output1.json'))
        );
    }

    listAll() {
        this.rootReference.listAll();
    }

    download() {
        // Delete first to avoid download failure.
        jsb.fileUtils.removeFile(
            jsb.fileUtils.getWritablePath() + '/output.json'
        );
        this.rootReference
            .child('output.json')
            .getFile(jsb.fileUtils.getWritablePath() + '/output.json');
    }

    upload() {
        if (
            !jsb.fileUtils.isFileExist(
                jsb.fileUtils.getWritablePath() + '/output1.json'
            )
        ) {
            return this.console.log(
                'local file output1.json not exist, please click Download!'
            );
        }
        this.rootReference
            .child('output1.json')
            .putFile(jsb.fileUtils.getWritablePath() + '/output1.json');
    }

    delete() {
        this.rootReference.child('output1.json').delete();
        jsb.fileUtils.removeFile(
            jsb.fileUtils.getWritablePath() + '/output.json'
        );
        jsb.fileUtils.removeFile(
            jsb.fileUtils.getWritablePath() + '/output1.json'
        );
    }
}
