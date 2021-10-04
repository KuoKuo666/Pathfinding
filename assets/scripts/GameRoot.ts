
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
            const mapData: MapData = mapRoot.mapJson.json[mapRoot.mapIndex]
            // a 星寻路结果，让 boy 走一波
            const result = Util.aStarPathFind(mapData)
            this.goAstarPath(result, 0)
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
