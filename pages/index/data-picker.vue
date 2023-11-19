<template>
	<view class="container">
		<view class="title"><text>uni-data-picker 本地数据</text></view>
		<song-data-picker :openSearch="true" v-model="code" placeholder="请选择地址" popup-title="请选择所在地区"
			:localdata="dataTree" :searchFn="mySearchFn"></song-data-picker>
		<button @click="random">随机更换</button>
		<button @click="append">追加数据</button>
	</view>
</template>

<script>
	import region from './json/region.json';
	import areas from './json/area.json';

	export default {
		data() {
			return {
				code: '110102',
				dataTree: [],
				minLevel: []
			};
		},
		watch: {
			code(n, o) {
				console.log(n, o)
			}
		},
		methods: {
			append() {
				this.dataTree.push({
					value: new Date().valueOf(),
					text: new Date().valueOf() + ''
				})
			},
			onnodeclick(e) {
				console.log(e);
			},
			// 实现一：通常情况下使用返回值
			mySearchFn(searchList, searchWord) {
				return searchList.filter(x => x.searchText.includes(searchWord));
			},
			// 实现二：在函数内部通过callback设置查询结果，可在异步场景下使用
			mySearchFn2(searchList, searchWord, callback) {
				const result = searchList.filter(x => x.searchText.includes(searchWord));
				callback(result);
			},
			// 实现三：返回一个Promise，可在异步场景下使用
			mySearchFn3(searchList, searchWord, callback) {
				const result = searchList.filter(x => x.searchText.includes(searchWord));
				return Promise.resolve(result);
			},
			// 实现四：返回一个Promise，可在异步场景下使用（实现三的变体）
			async mySearchFn4(searchList, searchWord, callback) {
				const result = searchList.filter(x => x.searchText.includes(searchWord));
				return result;
			},
			random() {
				const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
				let index = genRandom(0, this.minLevel.length - 1);
				this.code = this.minLevel[index];
			},
			onchange(e) {},
			initDataTree() {
				const loop = rows => {
					return rows.map(x => {
						const newR = {
							value: x.code,
							text: x.name,
							children: x.child
						};
						if (newR.children) {
							newR.children = loop(newR.children);
						}
						return newR;
					});
				};
				this.dataTree = loop(region);
			},
			initMinLevel() {
				let values = Object.values(areas);
				let arr = [];
				values.forEach(x => {
					arr.push(...x);
				});
				this.minLevel = arr.map(x => {
					return x.code;
				});
			}
		},
		onLoad() {
			this.initDataTree();
			this.initMinLevel();
		}
	};
</script>

<style>
	.container {
		padding: 0 15px;
		display: flex;
		flex-direction: column;
		max-width: 500px;
	}

	.title {
		font-size: 14px;
		font-weight: bold;
		margin: 20px 0 5px 0;
	}

	.data-pickerview {
		height: 400px;
		border: 1px solid #e5e5e5;
	}
</style>