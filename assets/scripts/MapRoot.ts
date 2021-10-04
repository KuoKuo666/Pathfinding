
import { _decorator, Component, Node, Prefab, JsonAsset, instantiate, Vec3 } from 'cc'
import { Util } from './Util'
const { ccclass, property } = _decorator

export enum ElementType {
    Wall = 0,
    Road = 1,
    Door,
    Key
}

export interface MapData {
    in: {
        x: number
        y: number
    },
    out: {
        x: number
        y: number
    },
    data: ElementType[][]
}

@ccclass('MapRoot')
export class MapRoot extends Component {

    @property(Prefab)
    wallPrefab: Prefab = undefined

    @property(Prefab)
    doorPrefab: Prefab = undefined

    @property(Prefab)
    keyPrefab: Prefab = undefined

    @property(JsonAsset)
    mapJson: JsonAsset = undefined

    @property
    mapIndex: number = 0

    start() {
        if (this.mapJson) {
            const mapData: MapData = this.mapJson.json[this.mapIndex]
            this.createMap(mapData.data)
        }
    }

    createMap(data: ElementType[][]) {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                this.creataElement(data[i][j], Util.convertIndexToPos(i, j))
            }
        }
    }

    creataElement(type: ElementType, pos: Vec3) {
        switch (type) {
            case ElementType.Wall:
                const wall = instantiate(this.wallPrefab)
                this.node.addChild(wall)
                wall.setPosition(pos)
                break
            case ElementType.Door:
                const door = instantiate(this.doorPrefab)
                this.node.addChild(door)
                door.setPosition(pos)
                break
            case ElementType.Key:
                const key = instantiate(this.keyPrefab)
                this.node.addChild(key)
                key.setPosition(pos)
                break
        }
    }
}
