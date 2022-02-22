const pageConfig = {
    data() {
        return {
            // 头部大标题
            headTitle: BI_MODULES?.title || "“天目粮仓”数智大田",
            // 左侧组件
            leftComponents: BI_MODULES?.modules?.left,
            // 右侧组件
            rightComponents: BI_MODULES?.modules?.right,
            // 中间组件
            middleComponents: BI_MODULES?.modules?.middle,
            // 区域码
            areaCode: tpSaaSCore.getUserInfo().userDetails?.areaId,
            // 终端列表
            terminalList: []
        }
    },
    computed: {
    },
    watch: {
        
    },
    methods: {
        /**
         * 获取终端列表
         */
        getTerminalList() {
            return new Promise((resolve, reject) => {
                tpHttp.post(this, "action=com.top.regulate.bi.terminal.list", { param: JSON.stringify({}) }, (data, code, message) => {
                    // code = 0
                    // data = [{"id":11130,"latitude":30.160406,"longitude":119.302912,"staLat":30.162854,"staLng":119.297771,"stationId":1404,"terminalId":1589167,"terminalName":"太阳镇上庄村监测点气象站","terminalSerial":"1520001563073051","terminalType":52},{"id":11131,"latitude":30.162309,"longitude":119.301739,"staLat":30.164914,"staLng":119.296726,"stationId":1404,"terminalId":1591564,"terminalName":"太阳镇上庄村监测点测报灯","terminalSerial":"80AF96608355","terminalType":1},{"id":11176,"latitude":30.160385,"longitude":119.301557,"staLat":30.154381,"staLng":119.313551,"stationId":1404,"terminalId":1593443,"terminalName":"临安区上庄村基地监控","terminalSerial":"LASZCJD20210824","terminalType":33},{"id":11306,"latitude":30.176147,"longitude":119.31361,"staLat":30.171295,"staLng":119.317388,"stationId":1405,"terminalId":1593445,"terminalName":"临安区太阳米基地监控","terminalSerial":"LATYMJD20210824","terminalType":40}]
                    if (code == 0 && data && data.length) {
                        this.terminalList = data.filter(item => {
                            return item.terminalType != 40
                        });
                        resolve()
                    } else {
                        this.terminalList = [];
                        reject()
                    }
                })
            })
            
        },
        /**
         * 获取终端设备列表在线情况
         */
        getTerminalOnlineSituation() {
            return new Promise((resolve, reject) => {
                let params = { serialNums: this.terminalList.map(t => t.terminalSerial).join(",") }
                tpHttp.post(this, "action=com.top.regulate.bi.terminal.status", { param: JSON.stringify(params) }, (data, code, message) => {
                    // code = 0
                    // data = {"1520001563073051":false,"80AF96608355":true,"LASZCJD20210824":false}
                    if (code == 0 && data && JSON.stringify(data) != "{}") {
                        this.terminalList.map(item => {
                            if (data[item.terminalSerial]) {
                                item.online = true
                            } else {
                                item.online = false
                            }
                        })
                        resolve()
                    } else {
                        this.terminalList.map(item => {
                            item.online = false
                        })
                        reject()
                    }
                })
            })
        }
    },
    async mounted() {
        try {
            // 获取终端列表
            await this.getTerminalList()
            // 获取终端列表在线情况
            await this.getTerminalOnlineSituation();
            // 传递带在线情况的终端列表
            bus.$emit("terminals-t",this.terminalList)
        }catch {
            // 传递带在线情况的终端列表
            bus.$emit("terminals-t",this.terminalList)
        }
    }
}

/**
 * 计算时间
 * @param { Number } num  天数
 * @param { Date } date  开始时间 (不传值默认当天时间)
 */
function timeFormatter(num = 0, date) {
    const Dates = date ? new Date(date) : new Date();
    let nextDate = Dates.getFullYear() + "-" + (Dates.getMonth() + 1).toString().padStart(2,0) + "-" + Dates.getDate().toString().padStart(2,0);
    const Dates2 = date? new Date(date).getTime() - 3600*24*1000*num : new Date().getTime() - 3600*24*1000*num
    let curDate = new Date(Dates2).getFullYear() + "-" + (new Date(Dates2).getMonth() + 1).toString().padStart(2,0) + "-" + new Date(Dates2).getDate().toString().padStart(2,0);
    return [curDate,nextDate]
}