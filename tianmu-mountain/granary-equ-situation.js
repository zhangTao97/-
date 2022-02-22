/**
 * 设备在线情况
 */
const granaryEquSituation = {
    props: {
        // 每项数据
        option: {
            type: Object,
            default: {}
        }
    },
    template: `
            <div class="equ-online-situation">
                <div class="equ-situation-charts">
                    <div id="equ-charts"></div>
                </div>
                <div class="equ-situation-charts">
                    <div class="equ-situation-charts-legend">
                        <div class="charts-legend-box">
                            设备总计
                            <span style="color:#00edff">{{totalEquipment}}台</span>
                        </div>
                        <div class="charts-legend-box">
                            在线设备
                            <span style="color:#ffc600">{{onlineEquipment}}台</span>
                        </div>
                        <div class="charts-legend-box">
                            离线设备
                            <span style="color:#3dff01">{{offlineEquipment}}台</span>
                        </div>
                    </div>
                </div>
            </div>
    `,
    data() {
        return {
            // 终端设备列表
            terminals: []
        }
    },
    computed: {
        // 在线总数
        totalEquipment() {
            return this.terminals.length;
        },
        // 在线设备数量
        onlineEquipment() {
            return this.terminals.filter(t=>t.online).length;
        },
        // 离线设备数量
        offlineEquipment() {
            return this.terminals.filter(t=> !t.online).length;
        },
        // 在线率
        onlinePercent() {
            if(this.totalEquipment){
                return Math.round((this.onlineEquipment/this.totalEquipment)*100.0);
            }
            return 0;
        }
    },
    methods: {
        /**
         * 初始化图表
         */
        initEquCharts() {
            let that = this;
            let axisColor = [];
            let linearColor = new echarts.graphic.LinearGradient(
                0, 0, 1, 0,       //4个参数用于配置渐变色的起止位置, 这4个参数依次对应右/下/左/上四个方位. 而0 0 0 1则代表渐变色从正上方开始
                [
                    {
                        offset: 0.1,
                        color: "#2182EB"
                    },
                    {
                        offset: 0.6,
                        color: "#27DCB3"
                    },
                    {
                        offset: 1,
                        color: "#28E8AC"
                    }
                ]
            );
            if(this.totalEquipment){
                if(this.totalEquipment==this.onlineEquipment){    //100%
                    axisColor.push([1, linearColor]); //整条有色
                }else{
                    axisColor.push([this.onlineEquipment/this.totalEquipment, linearColor]); //this.landPlantingAcreage/this.totalLandAcreage 占比的颜色
                    axisColor.push([1, "#202D5E"]); //底色
                }
            }else{
                axisColor.push([1, "#051c48"]); //整条底色
            }
            let myCharts = echarts.init(document.getElementById("equ-charts"))
            let option = {
                tooltip: {
                    formatter: '{a} <br/>{b} : {c}%'
                },
                series: [
                    {
                        name: '设备在线率',
                        type: 'gauge',
                        detail: {
                            formatter: '{value}%',
                            offsetCenter: [0, "0%"],
                            color: "#fff",
                            fontSize: "20"
                        },
                        data: [
                            { value: that.onlinePercent, name: '在线率' }
                        ],
                        radius: "99%",
                        axisLine: {
                            show: true,
                            lineStyle: {
                                width: 25,
                                color: axisColor
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        },
                        pointer: {
                            show: false
                        },
                        title: {
                            show: true,
                            offsetCenter: [0, "73%"],
                            fontSize: 17,
                            color: "#20B4FF"
                        },
                    }
                ]
            }
            myCharts.setOption(option, true)
            
            window.addEventListener("resize", function () {
                myCharts.resize();
            })
        }
    },
    mounted() {
        // 初始化图表
        this.initEquCharts();
        let that = this
        bus.$on("terminals-t", function (data) {
            that.terminals = data;
            that.initEquCharts();
        })
    }
}
Vue.component("granary-equ-situation",granaryEquSituation)