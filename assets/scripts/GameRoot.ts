
import { _decorator, Component, Node, tween, v3 } from 'cc'
import { MapData, MapRoot } from './MapRoot'
import { AStarObj, Util } from './Util'
const { ccclass, property } = _decorator

@ccclass('GameRoot')
export class GameRoot extends Component {

    @property(Node)
    boy: Node = undefined

    @property(MapRoot)
    mapRoot: MapRoot = undefined

    start () {
        this.scheduleOnce(() => {
            const mapRoot = this.mapRoot
            // 根据地图数据区分下两个场景 one two
            const mapIndex = mapRoot.mapIndex
            const mapData: MapData = mapRoot.mapJson.json[mapIndex]
            if (mapIndex === 0) {
                // a 星寻路结果，让 boy 走一波，对应不带钥匙，门 的 one 场景
                const result = Util.aStarPathFind(mapData)
                this.goAstarPath(result, 0)
            } else {
                // 修改的 a 星，去寻找钥匙，对应 two 场景
                Util.aStarPathFindDoorKey(mapData)
                // 找钥匙是另一个搜索，做动画仅为示意用
                this.demoDoorKey()

                // 示意第二个动画，找到钥匙就先去开门
                // this.demoDoorKey2()
            }
        }, 1)
    }

    goAstarPath(arr: AStarObj[], index: number) {
        const pos = Util.convertIndexToPos(arr[index].x, arr[index].y)
        tween(this.boy)
            .to(0.5, { position: pos })
            .call(() => {
                if (index === arr.length - 1) return
                index++
                this.goAstarPath(arr, index)
            })
            .start()
    }

    demoDoorKey() {
        // a 星搜索到门的动画
        tween(this.boy)
            .to(2.0, { position: v3(150, 550, 0) })
            .to(0.5, { position: v3(250, 550, 0) })
            .to(0.5, { position: v3(250, 450, 0) })
            .to(0.5, { position: v3(250, 550, 0) })
            .to(1.5, { position: v3(550, 550, 0) })
            .to(1.0, { position: v3(550, 750, 0) })
            .to(0.5, { position: v3(650, 750, 0) })
            .to(0.5, { position: v3(650, 850, 0) })
            // 递归寻找的，嗖的一下就过去
            .to(0.2, { position: v3(150, 550, 0) })
            .to(2.0, { position: v3(150, 950, 0) })
            // 开门
            .to(0.2, { position: v3(250, 450, 0) })
            .to(1.5, { position: v3(250, 150, 0) })
            .to(3.5, { position: v3(950, 150, 0) })
            .start()
    }

    demoDoorKey2() {
        // a 星搜索到门的动画
        tween(this.boy)
            .to(2.0, { position: v3(150, 550, 0) })
            .to(0.5, { position: v3(250, 550, 0) })
            .to(0.5, { position: v3(250, 450, 0) })
            .to(0.5, { position: v3(250, 550, 0) })
            .to(1.5, { position: v3(550, 550, 0) })
            .to(1.0, { position: v3(550, 750, 0) })
            .to(0.5, { position: v3(650, 750, 0) })
            .to(0.5, { position: v3(650, 850, 0) })
            // 递归寻找的，嗖的一下就过去
            // .to(0.2, { position: v3(150, 550, 0) })
            // .to(2.0, { position: v3(150, 950, 0) })
            // 开门
            .to(0.2, { position: v3(250, 450, 0) })
            .to(1.5, { position: v3(250, 150, 0) })
            .to(3.5, { position: v3(950, 150, 0) })
            .start()
    }
}
