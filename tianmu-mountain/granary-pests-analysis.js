/**
 * 病虫害占比分析
 */
const granaryPestsAnalysis = {
    props: {
        // 每项数据
        option: {
            type: Object,
            default: {}
        }
    },
    template: `
            <div class="pests-analysis-content">
                <div id="pests-t-charts" v-show="chartsData.legendData.length && chartsData.seriesData.length">
                </div>
                <div class="no-data-t" v-show="!chartsData.legendData.length || !chartsData.seriesData.length">暂无数据</div>
            </div>
    `,
    data() {
        return {
            // 病虫害数据
            pestsDataList: [],
            // 图表数据
            chartsData: {
                legendData: [],
                seriesData: []
            }
        }
    },
    methods: {
        /**
         * 获取病虫害数据
         */
        getPestsData() {
            let date = timeFormatter(10)
            let params = { startDate: date[0], endDate: date[1] };
            if (this.option.queryParam && JSON.stringify(this.option.queryParam) != "{}") {
                Object.keys(this.option.queryParam).forEach(item => {
                    params[item] = this.option.queryParam[item]
                })
            }
            tpHttp.post(this, this.option.apiurl, { param: JSON.stringify(params) }, (data, code, message) => {
                if (code == 0 && data && data.length) {
                    this.pestsDataList = data;
                    let legendData = [], seriesData = []
                    data.forEach(item => {
                        legendData.push(item.insectName)
                        let obj = {
                            value: item.insectAmount,
                            name: item.insectName
                        }
                        seriesData.push(obj)
                    })
                    this.chartsData = {
                        legendData,
                        seriesData
                    }
                    this.$nextTick(() => {
                        this.initPestsAnalysisCharts();
                    })
                    
                } else {
                    this.pestsDataList = []
                }
            })
        },
        /**
         * 初始化图表
         */
        initPestsAnalysisCharts() {
            let legendData = this.chartsData.legendData,seriesData = this.chartsData.seriesData
            let mychart = echarts.init(document.getElementById("pests-t-charts"))
            let option = {
                color: ["#eb6f49","#00d98b","#fdb628","#0091f1","#00e4ec","#8256e8"],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    type: "scroll",
                    orient: 'vertical',
                    icon: "rect",
                    itemWidth: 13,
                    itemHeight: 13,
                    left: "37%",
                    itemGap: 15,
                    textStyle: {
                        color: "#",
                        padding: [3, 0, 0, 0]
                    },
                    pageIconColor: "rgba(2,181,255, 0.7)",
                    pageTextStyle: {
                        color: "#fff"
                    },
                    data: legendData,
                    formatter: function (name) {
                        var data = option.series[0].data;
                        var total = 0
                        var tarValue;
                        for (var i = 0, l = data.length; i < l; i++) {
                            total += data[i].value;
                            if (data[i].name == name) {
                                tarValue = data[i].value;
                            }
                        }
                        var p = ((tarValue / total) * 100).toFixed(2);
                        return name + " " + "\u3000\u3000" + tarValue + "只" + "\u3000\u3000" + p + "%";
                    }
                },
                series: [
                    {
                        name: '病虫害总览',
                        type: 'pie',
                        radius: ['60%', '90%'],
                        center: ["20%","50%"],
                        avoidLabelOverlap: false,
                        hoverAnimation: false,
                        label: {
                            show: false,
                            position: 'left'
                        },
                        emphasis: {
                            label: {
                                show: false,
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: seriesData
                    }
                ]
            }
            mychart.setOption(option, true)
            window.addEventListener("resize", function () {
                mychart.resize()
            })
        }
    },
    mounted() {
        // 获取病虫害数据
        this.getPestsData();
    }
}
Vue.component("granary-pests-analysis",granaryPestsAnalysis)