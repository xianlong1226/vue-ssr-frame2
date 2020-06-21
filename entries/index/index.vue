<template>
	<div id="app" class="app_index">
    <p>I am index</p>
		<p>{{ count1 }}</p>
    <button v-on:click="increment" class="app_index-add">add</button>
    <button v-on:click="decrement" class="app_index-dec">dec</button>
		<router-link to="/router1" exact>Go to router1</router-link>
		<router-link to="/router2">Go to router2</router-link>
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		data() {
			return { //初始化数据模型
				count1: 1
			}
		},
		computed: { //计算属性，当一个数据 需要计算 并实时根据data中数据不断变化时  使用。 
			count () {
				return 0 // this.$store.state.count
			}
		},
		created() {
			console.log('success')
		},
		mounted() { //生命周期函数 改函数下 可获取DOM
			
		},
		methods: { //所有的 交互操作 例如：click ，mouseover等 写在此对象下
			getData(){
				$.ajax({ 
					'url': '/test', 
					'method': 'get', 
					'success': function(result) {
						console.log(result)
					}
				})
      },
			increment () {
				// this.$store.commit('increment', 2)
				console.log($('.app_index').text())
        this.count1++;
			},
			decrement () {
				// this.$store.commit('decrement', 3)
        this.count1--;
			}
		},
		filters: {
			
		},
		components: { //注册组件 以便引用
		}
	}
</script>

<style lang="postcss">
	@import './index.postcss';

	@font-face {
		font-family: 'transformericon-font';
		src: url('../../fonts/transformericon.eot');
		src: url('../../fonts/transformericon.eot?#iefix') format('embedded-opentype'), url('../../fonts/transformericon.ttf') format('truetype'), url('../../fonts/transformericon.woff') format('woff'), url('../../fonts/transformericon.svg#icons-font') format('svg');
		font-weight: normal;
		font-style: normal;
	}
</style>