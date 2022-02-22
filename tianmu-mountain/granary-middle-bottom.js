/**
 * 中间底部
 */
const granaryMiddleBottom = {
    props: {
        // 终端列表
        terminalList: {
            type: Array,
            default: []
        },
        // 每项数据
        option: {
            type: Object,
            default: {}
        },
    },
    template: `
            <div class="middle-bottom-content">
                <div id="map-t">

                </div>
                <div class="map-legend">
                    <div class="map-legend-title">
                        图例
                    </div>
                    <div class="legend-checked">
                        <div class="legend-box" :style="{color:checkValue == 1?'#02c6ff':'#fff'}" @click="legendCkick(1)">
                            <span>气象监控</span>
                            <div class="legend-img">
                                <img src="../../resources/img/tianmu-mountain/qxjk.png" alt="">
                            </div>
                        </div>
                        <div class="legend-box" :style="{color:checkValue == 2?'#02c6ff':'#fff'}" @click="legendCkick(2)">
                            <span>植保设备</span>
                            <div class="legend-img">
                                <img src="../../resources/img/tianmu-mountain/zbsb.png" alt="">
                            </div>
                        </div>
                        <div class="legend-box" :style="{color:checkValue == 3?'#02c6ff':'#fff'}" @click="legendCkick(3)">
                            <span>控制设备</span>
                            <div class="legend-img">
                                <img src="../../resources/img/tianmu-mountain/kzsb.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    `,
    data() {
        return {
            // 地图图例选中值
            checkValue: "0",

            terminalTypes: {    //终端分组
                "meteorology": [3, 20, 35, 37, 52],     //气象传感类 终端类型
                "plant": [1, 32, 34, 36, 39, 50, 51],   //植物保护类 终端类型
                "controll": [33]            //设备控制类 终端类型
            }
        }
    },
    watch: {
        "terminalList": function (value) {
            this.terminalListMap = this.terminalList;
            // 初始化地图
            this.initMap();
        }
    },
    methods: {
        /**
         * 初始化地图
         */
        initMap() {
            var map = new AMap.Map('map-t', {
                viewMode: '2D', // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D',
                layers: [new AMap.TileLayer.Satellite()],
                // zoom: 15, //初始化地图层级
                animateEnable: false
            });
            this.terminalListMap.forEach(item => {
                let icon = new AMap.Icon({
                    image: "../../resources/img/tianmu-mountain/" + this.getTerminalGroup(item.terminalType) + ".png",
                    anchor: 'bottom-center',
                    size: [25, 34]
                })
                var marker = new AMap.Marker({
                    position: new AMap.LngLat(item.longitude, item.latitude),
                    icon: icon,
                    anchor: 'bottom-center',
                });
                map.add(marker);
            })
            map.setFitView(null, false, [150, 60, 100, 60]);
        },
        /**
         * 获取图标颜色对应的css类
         * @param terminalType
         * @returns {*}
         */
        getTerminalGroup(terminalType) {
            if (this.terminalTypes.meteorology.indexOf(terminalType) > -1) {
                return "qxjk";
            }
            if (this.terminalTypes.plant.indexOf(terminalType) > -1) {
                return "zbsb";
            }
            if (this.terminalTypes.controll.indexOf(terminalType) > -1) {
                return "kzsb";
            }
            return "kzsb";
        },
        /**
         * 地图图例点击
         */
        legendCkick(val) {
            if (val == this.checkValue) {
                this.checkValue = 0;
            } else {
                this.checkValue = val;
            }
            let arr = []
            if (this.checkValue == 0) {
                arr = this.terminalList;
            } else if(this.checkValue == 1) {
                arr = this.terminalList.filter(item => {
                    return this.terminalTypes.meteorology.includes(item.terminalType)
                })
            } else if(this.checkValue == 2) {
                arr = this.terminalList.filter(item => {
                    return this.terminalTypes.plant.includes(item.terminalType)
                })
            } else if(this.checkValue == 3) {
                arr = this.terminalList.filter(item => {
                    return this.terminalTypes.controll.includes(item.terminalType)
                })
            }
            this.terminalListMap = arr;
            this.initMap();
            bus.$emit("terminals-t",arr)
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initMap();
        })
    }
}
Vue.component("granary-middle-bottom",granaryMiddleBottom)