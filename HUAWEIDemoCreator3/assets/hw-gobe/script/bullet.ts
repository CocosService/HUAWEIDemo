import { _decorator, Component, Node } from 'cc';
import { GameSceneType, CollideTag, Direction, CmdType } from './frame_sync';
import { BulletData } from './gobe_util';
import { global } from './hw_gobe_global_data';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {

    bulletId: number = 0;

    playerId: string = "";

    // 子弹飞行任务
    private flyTask = null;
    // 子弹飞行时的bullet信息
    private bulletData: BulletData;

    start () {
        global.room.onStopFrameSync(() => this.onStopFrameSync());
    }

    public onStopFrameSync () {
        clearInterval(this.flyTask);
    }

    public initBullet (bullet: BulletData) {
        this.node.name = bullet.bulletId.toString();
        this.bulletId = bullet.bulletId;
        this.playerId = bullet.playerId;
        this.node.setPosition(bullet.x, bullet.y, 0);

        this.bulletData = bullet;
        if (global.gameSceneType == GameSceneType.FOR_GAME && !global.isRequestFrameStatus && bullet.playerId == global.playerId) {
            this.flyTask = setInterval(() => {
                this.updateBulletPos(this.bulletData);
            }, 200);
        }
    }

    updatePos (bullet: BulletData) {

        this.node.setPosition(bullet.x, bullet.y, 0);
    }

    destroyBullet () {
        clearInterval(this.flyTask);
        this.node.destroy();
    }

    /**
     * 碰撞检测
     * @param other
     */
    onCollisionEnter (other, self) {
        // 子弹碰到发射自己的飞机，不销毁
        if (other.tag == CollideTag.plane && other.node.name != this.playerId) {
            console.log(`Bullet onCollisionEnter bulletId: ${this.bulletId}, selfTag: ${self.tag}, otherTag: ${other.tag}`);
            clearInterval(this.flyTask);
            this.node.destroy();
        }
    }


    // 更新子弹位置
    updateBulletPos (bullet: BulletData) {
        if (!bullet) {
            return;
        }
        // 计算移动后的 x、y
        let x: number = bullet.x;
        let y: number = bullet.y;
        switch (bullet.direction) {
            case Direction.up:
                y = Math.min(global.bulletMaxY, bullet.y + global.bulletStepPixel);
                break;
            case Direction.down:
                y = Math.max(global.bulletSize, bullet.y - global.bulletStepPixel);
                break;
            case Direction.left:
                x = Math.max(global.bulletSize, bullet.x - global.bulletStepPixel);
                break;
            case Direction.right:
                x = Math.min(global.bulletMaxX, bullet.x + global.bulletStepPixel);
                break;
            // no default
        }
        // 子弹销毁
        if ((bullet.direction == Direction.up && y == global.bulletMaxY) ||
            (bullet.direction == Direction.down && y == global.bulletSize) ||
            (bullet.direction == Direction.left && x == global.bulletSize) ||
            (bullet.direction == Direction.right && x == global.bulletMaxX)) {
            let frameData: string = JSON.stringify({
                cmd: CmdType.bulletDestroy,
                playerId: bullet.playerId,
                bulletId: bullet.bulletId,
            });
            console.log('----sendBulletDestroyFrame---' + frameData);
            this.bulletData.x = x;
            this.bulletData.y = y;
            this.bulletData.needDestroy = true;
            global.room.sendFrame(frameData);
            clearInterval(this.flyTask);
        }
        // 子弹继续飞行
        else {
            let frameData: string = JSON.stringify({
                cmd: CmdType.bulletFly,
                playerId: bullet.playerId,
                bulletId: bullet.bulletId,
                x,
                y,
                direction: bullet.direction
            });
            console.log('----sendBulletFlyFrame---' + frameData);

            this.bulletData.x = x;
            this.bulletData.y = y;
            global.room.sendFrame(frameData);
        }
    }
}

