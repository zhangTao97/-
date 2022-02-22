/**
 * 中间顶部
 */
const granaryMiddleTop = {
    props: {
        // 每项数据
        option: {
            type: Object,
            default: {}
        }
    },
    template: `
            <div class="middle-top-content">
                <div class="middle-little-box" v-for="(item,index) in topList" :key="index + 'top'">
                    <div>
                        <span>{{item.name}}</span>
                        <span>{{item.value}} {{item.unit}}</span>
                    </div>
                </div>
            </div>
    `,
    computed: {
        topList() {
            return this.option?.queryParam?.list.length && this.option.queryParam.list || []
        }
    }
}
Vue.component("granary-middle-top",granaryMiddleTop)