<template>
	<view class="uni-data-tree">
		<view class="uni-data-tree-input" @click="handleInput">
			<slot :options="options" :data="inputSelected" :error="errorMessage">
				<view class="input-value" :class="{ 'input-value-border': border }">
					<text v-if="errorMessage" class="selected-area error-text">{{ errorMessage }}</text>
					<view v-else-if="loading && !isOpened" class="selected-area"><uni-load-more class="load-more" :contentText="loadMore" status="loading"></uni-load-more></view>
					<scroll-view v-else-if="inputSelected.length" class="selected-area" scroll-x="true">
						<view class="selected-list">
							<view class="selected-item" v-for="(item, index) in inputSelected" :key="index">
								<text>{{ item.text }}</text>
								<text v-if="index < inputSelected.length - 1" class="input-split-line">{{ split }}</text>
							</view>
						</view>
					</scroll-view>
					<text v-else class="selected-area placeholder">{{ placeholder }}</text>
					<view class="arrow-area" v-if="!readonly"><view class="input-arrow"></view></view>
				</view>
			</slot>
		</view>
		<view class="uni-data-tree-cover" v-if="isOpened" @click="handleClose"></view>
		<view class="uni-data-tree-dialog" v-if="isOpened">
			<view class="dialog-caption">
				<view class="title-area">
					<text class="dialog-title">{{ popupTitle }}</text>
				</view>
				<view class="dialog-close" @click="handleClose">
					<view class="dialog-close-plus" data-id="close"></view>
					<view class="dialog-close-plus dialog-close-rotate" data-id="close"></view>
				</view>
			</view>
			<view class="dialog-caption" v-if="openSearch">
				<view style="width: 80%; margin: 10px 10%;">
					<uni-easyinput
						type="text"
						suffixIcon="search"
						v-model="searchWord"
						placeholder="输入关键字搜索"
						@iconClick="searchClick"
						@confirm="searchClick"
					></uni-easyinput>
				</view>
			</view>

			<view class="picker-view" style="overflow-y:auto" v-if="showSearchResult">
				<uni-list-item v-for="(item, index) in searchResult" :key="index" :title="item.text" clickable link @click="clickSearch(item)"></uni-list-item>
			</view>

			<data-picker-view
				v-if="!showSearchResult"
				class="picker-view"
				ref="pickerView"
				v-model="value"
				:localdata="localdata"
				:preload="preload"
				:collection="collection"
				:field="field"
				:orderby="orderby"
				:where="where"
				:step-searh="stepSearh"
				:self-field="selfField"
				:parent-field="parentField"
				:managed-mode="true"
				@change="onchange"
				@datachange="ondatachange"
			></data-picker-view>
		</view>
	</view>
</template>

<script>
import dataPicker from '../uni-data-pickerview/uni-data-picker.js';
import DataPickerView from '../uni-data-pickerview/uni-data-pickerview.vue';
import uniEasyinput from '../uni-easyinput/uni-easyinput.vue';
import uniListItem from '../uni-list-item/uni-list-item.vue';

/**
 * uni-data-picker
 * @description uni-data-picker
 * @tutorial https://uniapp.dcloud.net.cn/uniCloud/uni-data-picker
 * @property {String} popup-title 弹出窗口标题
 * @property {Array} localdata 本地数据，参考
 * @property {Boolean} border = [true|false] 是否有边框
 * @property {Boolean} readonly = [true|false] 是否仅读
 * @property {Boolean} preload = [true|false] 是否预加载数据
 * @value true 开启预加载数据，点击弹出窗口后显示已加载数据
 * @value false 关闭预加载数据，点击弹出窗口后开始加载数据
 * @property {Boolean} step-searh = [true|false] 是否分布查询
 * @value true 启用分布查询，仅查询当前选中节点
 * @value false 关闭分布查询，一次查询出所有数据
 * @property {String|DBFieldString} self-field 分布查询当前字段名称
 * @property {String|DBFieldString} parent-field 分布查询父字段名称
 * @property {String|DBCollectionString} collection 表名
 * @property {String|DBFieldString} field 查询字段，多个字段用 `,` 分割
 * @property {String} orderby 排序字段及正序倒叙设置
 * @property {String|JQLString} where 查询条件
 * @event {Function} onpopupshow 弹出的选择窗口打开时触发此事件
 * @event {Function} onpopuphide 弹出的选择窗口关闭时触发此事件
 */
export default {
	name: 'UniDataPicker',
	mixins: [dataPicker],
	components: {
		DataPickerView,
		uniEasyinput,
		uniListItem
	},
	props: {
		options: {
			type: [Object, Array],
			default() {
				return {};
			}
		},
		popupTitle: {
			type: String,
			default: '请选择'
		},
		placeholder: {
			type: String,
			default: '请选择'
		},
		heightMobile: {
			type: String,
			default: ''
		},
		readonly: {
			type: Boolean,
			default: false
		},
		border: {
			type: Boolean,
			default: true
		},
		split: {
			type: String,
			default: '/'
		},
		openSearch: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			isOpened: false,
			inputSelected: [],
			searchWord: '',
			showSearchResult: false,
			searchDatas: [],
			searchResult: []
		};
	},
	created() {
		this.form = this.getForm('uniForms');
		this.formItem = this.getForm('uniFormsItem');
		if (this.formItem) {
			if (this.formItem.name) {
				this.rename = this.formItem.name;
				this.form.inputChildrens.push(this);
			}
		}

		this.$nextTick(() => {
			this.load();
		});
	},
	methods: {
		closeSearchDom() {
			this.showSearchResult = false;
			this.searchWord = '';
			this.searchResult = [];
		},
		clickSearch(item) {
			this.closeSearchDom();
			const e = [];
			const loop = (rows, ids) => {
				let row = rows.find(x => x.value == ids[0]);
				e.push(row);
				if (!row.children) return;
				loop(row.children, ids.splice(1, ids.length - 1));
			};
			loop(this.localdata, item.value.split(','));
			this.onchange(e);
		},
		searchClick() {
			if (!this.searchWord) {
				return;
			}
			this.searchResult = this.searchDatas.filter(x => x.text.split(' ').join('').includes(this.searchWord));
			this.showSearchResult = true;
		},
		onPropsChange() {
			this._treeData = [];
			this.selectedIndex = 0;
			this.load();
		},
		load() {
			if (this.readonly) {
				this._processReadonly(this.localdata, this.value);
				return;
			}

			if (this.isLocaldata) {
				this.loadData();
				this.inputSelected = this.selected.slice(0);
				this.initSearchDatas();
			} else if (this.value.length) {
				this.getTreePath(() => {
					this.inputSelected = this.selected.slice(0);
				});
			}
		},
		initSearchDatas() {
			if (this.openSearch && this.localdata && this.localdata.length > 0) {
				const loop = (row, values, texts) => {
					let value = !!values ? `${values},${row.value}` : row.value;
					let text = !!texts ? `${texts} ${row.text}` : row.text;
					if (row.children && row.children.length > 0) {
						row.children.forEach(x => {
							loop(x, value, text);
						});
					} else {
						this.searchDatas.push({
							value,
							text
						});
					}
				};
				this.searchDatas = [];
				this.localdata.forEach(x => {
					loop(x);
				});
			}
		},
		getForm(name = 'uniForms') {
			let parent = this.$parent;
			let parentName = parent.$options.name;
			while (parentName !== name) {
				parent = parent.$parent;
				if (!parent) return false;
				parentName = parent.$options.name;
			}
			return parent;
		},
		show() {
			this.isOpened = true;
			this.$nextTick(() => {
				this.$refs.pickerView.updateData({
					treeData: this._treeData,
					selected: this.selected,
					selectedIndex: this.selectedIndex
				});
			});
		},
		hide() {
			this.isOpened = false;
			this.closeSearchDom();
		},
		handleInput() {
			if (this.readonly) {
				return;
			}
			this.show();
		},
		handleClose(e) {
			this.hide();
		},
		ondatachange(e) {
			this._treeData = this.$refs.pickerView._treeData;
		},
		onchange(e) {
			this.hide();
			this.inputSelected = e;
			this._dispatchEvent(e);
		},
		_processReadonly(dataList, valueArray) {
			var isTree = dataList.findIndex(item => {
				return item.children;
			});
			if (isTree > -1) {
				if (Array.isArray(valueArray)) {
					let inputValue = valueArray[valueArray.length - 1];
					if (typeof inputValue === 'object' && inputValue.value) {
						inputValue = inputValue.value;
					}
				}
				this.inputSelected = this._findNodePath(inputValue, this.localdata);
				return;
			}

			let result = [];
			for (let i = 0; i < valueArray.length; i++) {
				var value = valueArray[i];
				var item = dataList.find(v => {
					return v.value == value;
				});
				if (item) {
					result.push(item);
				}
			}
			if (result.length) {
				this.inputSelected = result;
			}
		},
		_filterForArray(data, valueArray) {
			var result = [];
			for (let i = 0; i < valueArray.length; i++) {
				var value = valueArray[i];
				var found = data.find(item => {
					return item.value == value;
				});
				if (found) {
					result.push(found);
				}
			}
			return result;
		},
		_dispatchEvent(selected) {
			var value = new Array(selected.length);
			for (var i = 0; i < selected.length; i++) {
				value[i] = selected[i].value;
			}

			if (this.formItem) {
				const item = selected[selected.length - 1];
				this.formItem.setValue(item.value);
			}

			this.$emit('change', {
				detail: {
					value: selected
				}
			});
		}
	}
};
</script>

<style scoped>
.uni-data-tree {
	position: relative;
	font-size: 14px;
}

.error-text {
	color: #dd524d;
}

.input-value {
	display: flex;
	flex-direction: row;
	align-items: center;
	flex-wrap: nowrap;
	font-size: 14px;
	line-height: 38px;
	padding: 0 5px;
	overflow: hidden;
	/* #ifdef APP-NVUE */
	height: 40px;
	/* #endif */
}

.input-value-border {
	border: 1px solid #e5e5e5;
	border-radius: 5px;
}

.selected-area {
	flex: 1;
	overflow: hidden;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
}

.load-more {
	margin-right: auto;
	/* #ifdef APP-NVUE */
	width: 40px;
	/* #endif */
}

.selected-list {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	padding: 0 5px;
}

.selected-item {
	flex-direction: row;
	padding: 0 1px;
	white-space: nowrap;
}

.placeholder {
	color: grey;
}

.input-split-line {
	opacity: 0.5;
}

.arrow-area {
	position: relative;
	margin-left: auto;
	width: 20px;
	display: flex;
	justify-content: center;
	transform: rotate(-45deg);
	transform-origin: center;
}

.input-arrow {
	width: 7px;
	height: 7px;
	border-left: 1px solid #999;
	border-bottom: 1px solid #999;
}

.uni-data-tree-cover {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.4);
	display: flex;
	flex-direction: column;
	z-index: 100;
}

.uni-data-tree-dialog {
	position: fixed;
	left: 0;
	top: 20%;
	right: 0;
	bottom: 0;
	background-color: #ffffff;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	display: flex;
	flex-direction: column;
	z-index: 102;
	overflow: hidden;
	/* #ifdef APP-NVUE */
	width: 750rpx;
	/* #endif */
}

.dialog-caption {
	position: relative;
	display: flex;
	flex-direction: row;
	border-bottom: 1px solid #f0f0f0;
}

.title-area {
	display: flex;
	align-items: center;
	margin: auto;
	padding: 0 10px;
}

.dialog-title {
	font-weight: bold;
	line-height: 44px;
}

.dialog-close {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0 15px;
}

.dialog-close-plus {
	width: 16px;
	height: 2px;
	background-color: #666;
	border-radius: 2px;
	transform: rotate(45deg);
}

.dialog-close-rotate {
	position: absolute;
	transform: rotate(-45deg);
}

.picker-view {
	flex: 1;
	overflow: hidden;
}

/* #ifdef H5 */
@media all and (min-width: 768px) {
	.uni-data-tree-cover {
		background-color: transparent;
	}

	.uni-data-tree-dialog {
		position: absolute;
		top: 100%;
		height: auto;
		min-height: 400px;
		max-height: 50vh;
		background-color: #fff;
		border-radius: 5px;
		box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.3);
	}

	.dialog-caption {
		display: none;
	}
}

/* #endif */
</style>
