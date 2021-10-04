
import { _decorator, Component, Node, tween } from 'cc'
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
}
