import { v2, v3, Vec2 } from "cc"
import { ElementType, MapData } from "./MapRoot"

export class AStarObj {
    x: number = 0
    y: number = 0
    g: number = 0
    h: number = 0
    f: number = 0
    parent: AStarObj
}

export class Util {
    static convertIndexToPos(i: number, j: number) {
        const x = 50 + 100 * j
        const y = 950 - 100 * i
        return v3(x, y, 0)
    }

    static aStarPathFind(mapData: MapData) {
        const inIndex = v2(mapData.in.x, mapData.in.y)
        const outIndex = v2(mapData.out.x, mapData.out.y)
        console.log(`in: ${inIndex}, out: ${outIndex}`)

        const map = mapData.data
        const open: AStarObj[] = []
        const close: AStarObj[] = []
        // 曼哈顿估价法, 传入当前点与目标点, 返回估值
        const manHattan = (nowPoint: Vec2, aimIndex: Vec2) => {
            let dx = Math.abs(nowPoint.x - aimIndex.x)
            let dy = Math.abs(nowPoint.y - aimIndex.y)
            return dx + dy
        }
       const isInOpen = (mx: number, my: number) => {
            for (let i = 0; i < open.length; i++) {
                if (open[i].x == mx && open[i].y == my) {
                    return true
                }
            }
            return false
        }
        const isInClose = (mx: number, my: number) => {
            for (let i = 0; i < close.length; i++) {
                if (close[i].x == mx && close[i].y == my) {
                    return true
                }
            }
            return false
        }
        const pushInOpen = (v: Vec2, parent: AStarObj) => {
            let obj = new AStarObj()
            obj.x = v.x
            obj.y = v.y
            obj.g = manHattan(v, inIndex)
            obj.h = manHattan(v, outIndex)
            obj.f = obj.g + obj.h
            obj.parent = parent
            open.push(obj)
        }
        const pushInClose = (obj: AStarObj) => {
            close.push(obj)
        }
        const aroundPos = (parent: AStarObj) => {
            let dir = [[0,1],[1,0],[0,-1],[-1,0]]
            for (let i = 0; i < 4; i++) {
                let mx = parent.x + dir[i][0]
                let my = parent.y + dir[i][1]
                // 是否出界
                if (mx < 0 || mx > 9 || my < 0 || my > 9) {
                    continue
                }
                // 是否为墙
                if (map[mx][my] == 0) {
                    continue
                }
                // 是否已经在 close 中了
                if (isInClose(mx, my)) {
                    continue
                }
                // 是否已经在 open 中了
                if (isInOpen(mx, my)) {
                    continue
                }
                // 装入 open
                pushInOpen(v2(mx, my), parent)
            }
        }
        const findMinInOpen = () => {
            let min = 999
            let index = null
            for (let i = 0; i < open.length; i++) {
                if (open[i].f <= min) {
                    min = open[i].f
                    index = i
                }
            }
            let obj = open.splice(index, 1)
            pushInClose(obj[0])
            return obj[0]
        }
        const startFunc = () => {
            // 限制次数 500；
            // 首先将小怪的位置装入 close 列表
            let time = 500
            let obj = new AStarObj()
            obj.x = inIndex.x
            obj.y = inIndex.y
            obj.g = manHattan(inIndex, inIndex)
            obj.h = manHattan(inIndex, outIndex)
            obj.f = obj.g + obj.h
            obj.parent = null
            pushInClose(obj)
            let temp = obj
            while (true) {
                time--
                // 周围一圈装入 open
                aroundPos(temp)
                // 在 open 中找到 f 最小的，装入 close 并返回该点；
                temp = findMinInOpen()
                if (temp.x == outIndex.x && temp.y == outIndex.y) {
                    break
                }
                if (time <= 0) {
                    console.log('寻找不到')
                    break
                }
            }
            // 根据 parent 最终确认路线
            let l = close.length - 1
            let p = close[l]
            const final: AStarObj[] = []
            while(p) {
                final.push(p)
                p = p.parent
            }
            // 翻转
            final.reverse()
            console.log(final)
            return final
        }

        return startFunc()
    }
}
