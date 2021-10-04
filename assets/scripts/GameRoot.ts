
import { _decorator, Component, Node } from 'cc'
import { MapData, MapRoot } from './MapRoot'
import { Util } from './Util'
const { ccclass, property } = _decorator

@ccclass('GameRoot')
export class GameRoot extends Component {

    @property(MapRoot)
    mapRoot: MapRoot = undefined

    start () {
        this.scheduleOnce(() => {
            const mapRoot = this.mapRoot
            const mapData: MapData = mapRoot.mapJson.json[mapRoot.mapIndex]
            Util.aStarPathFind(mapData)
        }, 1)
    }
}
