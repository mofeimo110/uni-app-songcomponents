export default {
	props: {
		openSearch: {
			type: Boolean,
			default: false
		},
		searchFn: {
			type: Function,
			default: null
		},
		openInputSearch: {
			type: [Boolean, Number],
			default: false
		}
	},
	data() {
		return {
			searchWord: '',
			showSearchResult: false,
			searchDatas: [],
			searchResult: []
		}
	},
	watch: {
		searchWord() {
			this.inputSearchBegin()
		}
	},
	methods: {
		closeSearchDom() {
			this.showSearchResult = false;
			this.searchWord = '';
			this.searchResult = [];
		},
		// 传入的是搜索时构建的对象，不会因为map改变键
		clickSearchResult(item) {
			this.closeSearchDom();
			const e = [];
			const valueField = this.map.value;
			const textField = this.map.text;
			const loop = (rows, ids) => {
				if (!ids.length) return
				let row = rows.find(x => x[valueField] == ids[0]);
				if (e.length) {
					row.parent_value = e[e.length - 1][valueField];
				}
				e.push({
					...row,
					value: row[valueField],
					text: row[textField]
				});
				if (!row.children && !row.children instanceof Array && !row.children.length) return;
				loop(row.children, ids.splice(1, ids.length - 1));
			};
			loop(this.localdata, (item.value + '').split(','));
			// 支持map

			this.onchange(e);
		},
		inputSearchBegin() {
			if (!this.openInputSearch || !this.searchWord) {
				return;
			}
			if (typeof this.openInputSearch === 'number') {
				if (this.searchWord.length >= this.openInputSearch) {
					this.searchBegin();
				}
			} else {
				this.searchBegin();
			}
		},
		searchBegin() {
			if (!this.searchWord) {
				this.showSearchResult = false;
				return;
			}
			const setResultFn = (r) => {
				this.searchResult = r
				this.showSearchResult = true;
			};
			if (this.searchFn && this.searchFn instanceof Function) {
				/**
				 * 提供一个callback用于调用者在内部调整显示数据
				 */
				let callbackFlag = false;
				const fnResult = this.searchFn(this.searchDatas, this.searchWord, (result) => {
					setResultFn(result);
					callbackFlag = true;
				});
				/**
				 * 如果返回了一个Promise，则获取resolve数据，当为array时，当做查询结果处理
				 */
				if (fnResult instanceof Promise) {
					fnResult.then((result) => {
						if (!result instanceof Array) return;
						setResultFn(result);
					})
				} else if (fnResult && !callbackFlag) {
					setResultFn(fnResult);
				}
			} else {
				// 默认实现
				setResultFn(this.searchDatas.filter(x =>
					x.searchText.includes(this.searchWord)
				));
			}
		},
		initSearchDatas() {
			if (this.openSearch && this.localdata && this.localdata.length > 0) {
				const valueField = this.map.value;
				const textField = this.map.text;
				const loop = (row, values, texts) => {
					let value = values ? `${values},${row[valueField]}` : row[valueField];
					let text = texts ? `${texts} ${row[textField]}` : row[textField];
					let searchText = text.split(' ').join('');
					if (row.children && row.children.length > 0) {
						row.children.forEach(x => {
							loop(x, value, text);
						});
					} else {
						this.searchDatas.push({
							value,
							text,
							searchText
						});
					}
				};
				this.searchDatas = [];
				this.localdata.forEach(x => {
					loop(x);
				});
			}
		},
	}
}
