/**
 * 虫情趋势
 */
const granaryInsectTrend = {
    props: {
        // 每项数据
        option: {
            type: Object,
            default: {}
        }
    },
    template: `
        <div class="insect-trend-content">
            <div class="insect-trend-content" v-show="insectTrendData.length">
                <div id="insect-trend-chart"></div>
            </div>
            
            <div class="no-data-t" v-show="!insectTrendData.length">
                暂无数据
            </div>
        </div>
    `,
    data() {
        return {
            // 虫情趋势总数据
            insectTrendData: [],
            // 虫情趋势图表数据
            insectChartData: {
                xAxisData: [],
                xlegendData: [],
                seriesData: []
            }
        }
    },
    methods: {
        /**
         * 获取虫情趋势数据
         */
        getInsectTrendData() {
            let date = timeFormatter(10)
            let params = { startDate: date[0], endDate: date[1] };
            if (this.option.queryParam && JSON.stringify(this.option.queryParam) != "{}") {
                Object.keys(this.option.queryParam).forEach(item => {
                    params[item] = this.option.queryParam[item]
                })
            }
            tpHttp.post(this, this.option.apiurl, { param: JSON.stringify(params) }, (data, code, message) => {
                if (code == 0 && data && data.length) {
                    this.insectTrendData = data;
                    let dateArr = [],xAxisData = [],xlegendData = [],seriesData = []
                    data.forEach(t => {
                        if (t.insectName) {
                            xlegendData.push(t.insectName)
                        } else {
                            xlegendData.push(t.sporeName)
                        }
                        var amountList = t.dailyAmountList;
                        if (amountList && amountList.length > 0) {
                            t.data = [];
                            t.date = [];
                            amountList.forEach(a => {
                                t.data.push(a.amount);
                                dateArr.push(a.date)
                                t.date.push(a.date)
                            })
                        }
                    });
                    xAxisData = this.unique1(dateArr);
                    xAxisData = xAxisData.sort(function (a, b) {
                        return b < a ? 1 : -1
                    })
                    data.forEach(a => {
                        var sericesDate = [];
                        xAxisData.map((item) => {
                            sericesDate.push(0)
                        })
                        a.date.map((item2, index1) => {
                            xAxisData.map((item3, index) => {
                                if (item3 == item2) {
                                    sericesDate[index] = a.data[index1]
                                }
                            })
                        })
                        if (a.insectName) {
                            seriesData.push({
                                name: a.insectName,
                                type: 'line',
                                data: sericesDate,
                                showSymbol: false,
                                date: a.date
                            })
                        } else {
                            seriesData.push({
                                name: t.sporeName,
                                type: 'line',
                                data: sericesDate,
                                showSymbol: false,
                                date: a.date
                            })
                        }
                    })
                    this.insectChartData = {
                        xAxisData,
                        xlegendData,
                        seriesData
                    }
                    this.$nextTick(() => {
                        // 初始化图表
                        this.initInsectTrendChart();
                    })
                    
                } else {
                    this.insectChartData = {
                        xAxisData: [],
                        xlegendData: [],
                        seriesData: []
                    }
                }
            })
        },
        /**
         * 处理数据
         */
        unique1(arr) {
            var hash = [];
            for (var i = 0; i < arr.length; i++) {
                if (hash.indexOf(arr[i]) == -1) {
                    hash.push(arr[i]);
                }
            }
            return hash;
        },
        /**
         * 初始化图表
         */
        initInsectTrendChart() {
            let {xAxisData,xlegendData,seriesData } = this.insectChartData;
            let mychart = echarts.init(document.getElementById("insect-trend-chart"))
            let option = {
                color: ["#eb6f49", "#00d98b", "#fdb628", "#0091f1", "#00e4ec", "#8256e8"],
                tooltip: {
                    trigger: 'axis',
                    formatter: function (d) {
                        var res = `${d[0].name} <br/>`
                        for (const item of d) {
                            if (item.value != 0) {
                            res += `<span style="background: ${item.color}; height:10px; width: 10px; border-radius: 50%;display: inline-block;margin-right:10px;"></span> ${item.seriesName} ：${item.data}<br/>`
                            }
                        }
                        return res
                    }
                },
                legend: {
                    type: "scroll",
                    data: xlegendData,
                    icon: "rect",
                    itemHeight: 3,
                    itemWidth: 13,
                    textStyle: {
                        color: "#fff",
                        padding: [2, 0, 0, 0]
                    },
                    pageIconColor: "rgba(2,181,255, 0.7)",
                    pageTextStyle: {
                        color: "#fff"
                    }
                },
                grid: {
                    top: "30",
                    left: '10',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: xAxisData,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: "#fff",
                        formatter: function (d) {
                            return d.substr(5);
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "#5C708D"
                        }
                    }

                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: "#fff"
                    },
                    splitLine: {
                        lineStyle: {
                            color: "#132C54",
                            opacity: 0.5
                        }
                    },
                    minorSplitLine: {
                        show: true,
                        lineStyle: {
                            color: "#132C54"
                        }
                    }
                },
                series: seriesData
            }
            mychart.setOption(option, true)
            window.addEventListener("resize", function () {
                mychart.resize();
            })
        }
    },
    mounted() {
        // 获取虫情趋势数据
        this.getInsectTrendData();
    }
}
Vue.component("granary-insect-trend", granaryInsectTrend)