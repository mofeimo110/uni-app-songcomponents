<template>
	<view class="uni-datetime-picker">
		<view @click="tiggerTimePicker">
			<slot>
				<view class="uni-datetime-picker-timebox uni-datetime-picker-flex">
					{{ time }}
					<view v-if="!time" class="uni-datetime-picker-time">{{ placeholder }}</view>
					<view class="uni-datetime-picker-down-arrow"></view>
				</view>
			</slot>
		</view>
		<view v-if="visible" class="uni-datetime-picker-mask" @click="initTimePicker"></view>
		<view v-if="visible" class="uni-datetime-picker-popup">
			<view class="uni-title">{{ popupTitle }}</view>
			<picker-view class="uni-datetime-picker-view" :indicator-style="indicatorStyle" :value="ymd" @change="bindDateChange">
				<picker-view-column class="uni-datetime-picker-hyphen">
					<view class="uni-datetime-picker-item" v-for="(item, index) in years" :key="index">{{ item }}</view>
				</picker-view-column>
				<picker-view-column class="uni-datetime-picker-hyphen">
					<view class="uni-datetime-picker-item" v-for="(item, index) in months" :key="index">{{ item < 10 ? '0' + item : item }}</view>
				</picker-view-column>
				<picker-view-column>
					<view class="uni-datetime-picker-item" v-for="(item, index) in days" :key="index">{{ item < 10 ? '0' + item : item }}</view>
				</picker-view-column>
			</picker-view>
			<picker-view class="uni-datetime-picker-view" :indicator-style="indicatorStyle" :value="hms" @change="bindTimeChange">
				<picker-view-column class="uni-datetime-picker-colon">
					<view class="uni-datetime-picker-item" v-for="(item, index) in hours" :key="index">{{ item < 10 ? '0' + item : item }}</view>
				</picker-view-column>
				<picker-view-column class="uni-datetime-picker-colon">
					<view class="uni-datetime-picker-item" v-for="(item, index) in minutes" :key="index">{{ item < 10 ? '0' + item : item }}</view>
				</picker-view-column>
				<picker-view-column>
					<view class="uni-datetime-picker-item" v-for="(item, index) in seconds" :key="index">{{ item < 10 ? '0' + item : item }}</view>
				</picker-view-column>
			</picker-view>
			<view class="uni-datetime-picker-btn">
				<view class="" @click="clearTime">重置</view>
				<view class="uni-datetime-picker-btn-group">
					<view class="uni-datetime-picker-cancel" @click="tiggerTimePicker">取消</view>
					<view class="" @click="setTime">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const $moment = require('moment');
export default {
	data() {
		return {
			visible: false,
			time: '',
			years: [],
			months: [],
			days: [],
			hours: [],
			minutes: [],
			seconds: [],
			year: 1900,
			month: 0,
			day: 0,
			hour: 0,
			minute: 0,
			second: 0,
			indicatorStyle: `height: 50px;`
		};
	},
	props: {
		timestamp: {
			type: Boolean,
			default: false
		},
		value: {
			type: [String, Number],
			default: ''
		},
		placeholder: {
			type: String,
			default: '请选择日期时间'
		},
		popupTitle: { type: String, default: '请选择日期时间' },
		name: {
			type: String,
			default: ''
		},
		minDateTime: {
			type: String,
			default: ''
		},
		maxDateTime: {
			type: String,
			default: ''
		}
	},
	computed: {
		ymd() {
			return [this.year - this.minYear, this.month - this.getMinMonth(), this.day - this.getMinDay()];
		},
		hms() {
			return [this.hour - this.getMinHour(), this.minute - this.getMinMinute(), this.second - this.getMinSecond()];
		},
		minFormat() {
			return this.minDateTime ? $moment(this.minDateTime) : $moment('1900-01-01');
		},
		maxFormat() {
			return this.maxDateTime ? $moment(this.maxDateTime) : $moment('2100-12-31');
		},
		minYear() {
			return this.minFormat.year();
		},
		maxYear() {
			return this.maxFormat.year();
		}
	},
	watch: {
		value(newValue) {
			this.parseValue(this.value);
			this.initTime();
		}
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
	},
	mounted() {
		this.parseValue(this.value);
		if (this.value) {
			this.initTime();
		}
		const date = new Date();
		this.initYears();
		this.initMonths();
		this.initDays();
		this.initHours();
		this.initMinutes();
		this.initSeconds();
	},
	methods: {
		initYears() {
			for (let i = this.minYear; i <= this.maxYear; i++) {
				this.years.push(i);
			}
			if (this.year <= this.minYear) {
				this.year = this.minYear;
			}
			if (this.year > this.maxYear) {
				this.year = this.maxYear;
			}
		},
		initMonths() {
			this.months = [];
			let min = this.getMinMonth();
			let max = this.getMaxMonth();
			for (let i = min; i <= max; i++) {
				this.months.push(i);
			}
			if (this.month <= min) {
				this.month = min;
			}
			if (this.month > max) {
				this.month = max;
			}
		},
		initDays() {
			this.days = [];
			let min = this.getMinDay();
			let max = this.getMaxDay();
			for (let i = min; i <= max; i++) {
				this.days.push(i);
			}
			if (this.day <= min) {
				this.day = min;
			}
			if (this.day > max) {
				this.day = max;
			}
		},
		initHours() {
			this.hours = [];
			let min = this.getMinHour();
			let max = this.getMaxHour();
			for (let i = min; i <= max; i++) {
				this.hours.push(i);
			}
			if (this.hour < min) {
				this.hour = min;
			}
			if (this.hour > max) {
				this.hour = max;
			}
		},
		initMinutes() {
			this.minutes = [];
			let min = this.getMinMinute();
			let max = this.getMaxMinute();
			for (let i = min; i <= max; i++) {
				this.minutes.push(i);
			}
			if (this.minute < min) {
				this.minute = min;
			}
			if (this.minute > max) {
				this.minute = max;
			}
		},
		initSeconds() {
			this.seconds = [];
			let min = this.getMinSecond();
			let max = this.getMaxSecond();
			for (let i = min; i <= max; i++) {
				this.seconds.push(i);
			}
			if (this.second < min) {
				this.second = min;
			}
			if (this.second > max) {
				this.second = max;
			}
		},
		/**
		 * 获取父元素实例
		 */
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
		parseDateTime(datetime) {
			let defaultDate = null;
			if (!datetime) {
				defaultDate = new Date();
			} else {
				defaultDate = $moment(datetime)._d;
			}
			this.year = defaultDate.getFullYear();
			if (this.year < this.minYear || this.year > this.maxYear) {
				const now = Date.now();
				this.parseDateTime(now);
				return;
			}
			this.month = defaultDate.getMonth() + 1;
			this.day = defaultDate.getDate();
			this.hour = defaultDate.getHours();
			this.minute = defaultDate.getMinutes();
			this.second = defaultDate.getSeconds();
		},
		parseValue(defaultTime) {
			if (Number(defaultTime)) {
				defaultTime = parseInt(defaultTime);
			}
			this.parseDateTime(defaultTime);
		},
		bindDateChange(e) {
			const val = e.detail.value;
			let year = this.years[val[0]];
			let month = this.months[val[1]];
			let day = this.days[val[2]];

			this.year = year;
			this.month = month;
			this.day = day;
			this.time = this.createDomSting();
			this.initMonths();
			this.initDays();
			this.initHours();
			this.initMinutes();
			this.initSeconds();
		},
		bindTimeChange(e) {
			const val = e.detail.value;
			let hour = this.hours[val[0]];
			let minute = this.minutes[val[1]];
			let second = this.seconds[val[2]];
			this.hour = hour;
			this.minute = minute;
			this.second = second;
			this.time = this.createDomSting();
			this.initHours();
			this.initMinutes();
			this.initSeconds();
		},
		initTimePicker() {
			// if (!this.time) {
			// 	this.parseValue()
			// }
			this.parseValue(this.value);
			this.visible = !this.visible;
		},
		tiggerTimePicker() {
			this.visible = !this.visible;
		},
		clearTime() {
			this.time = '';
			this.tiggerTimePicker();
		},
		initTime() {
			this.time = this.createDomSting();
			if (!this.timestamp) {
				this.formItem && this.formItem.setValue(this.time);
				this.$emit('change', this.time, this.name);
			} else {
				this.formItem && this.formItem.setValue(this.createTimeStamp(this.time));
				this.$emit('change', this.createTimeStamp(this.time), this.name);
			}
		},
		setTime() {
			this.initTime();
			this.tiggerTimePicker();
		},
		createTimeStamp(time) {
			return Date.parse($moment(time)._d);
		},
		createDomSting() {
			const yymmdd =
				this.year +
				'-' +
				(this.month < 10 ? '0' + this.month : this.month) +
				'-' +
				(this.day < 10 ? '0' + this.day : this.day) +
				' ' +
				(this.hour < 10 ? '0' + this.hour : this.hour) +
				':' +
				(this.minute < 10 ? '0' + this.minute : this.minute) +
				':' +
				(this.second < 10 ? '0' + this.second : this.second);

			return yymmdd;
		},
		getMinMonth() {
			return $moment(this.time).format('YYYY') == this.minFormat.format('YYYY') ? this.minFormat.month() + 1 : 1;
		},
		getMaxMonth() {
			return $moment(this.time).format('YYYY') == this.maxFormat.format('YYYY') ? this.maxFormat.month() + 1 : 12;
		},
		getMinDay() {
			return $moment(this.time).format('YYYY-MM') == this.minFormat.format('YYYY-MM') ? this.minFormat.date() : 1;
		},
		getMaxDay() {
			return $moment(this.time).format('YYYY-MM') == this.maxFormat.format('YYYY-MM')
				? this.maxFormat.date()
				: $moment(this.year + (this.month < 10 ? '0' : '') + this.month, 'YYYYMM').daysInMonth() || 31;
		},
		getMinHour() {
			return $moment(this.time).format('YYYY-MM-DD') == this.minFormat.format('YYYY-MM-DD') ? this.minFormat.hour() : 0;
		},
		getMaxHour() {
			return $moment(this.time).format('YYYY-MM-DD') == this.maxFormat.format('YYYY-MM-DD') ? this.maxFormat.hour() : 23;
		},
		getMinMinute() {
			return $moment(this.time).format('YYYY-MM-DD HH') == this.minFormat.format('YYYY-MM-DD HH') ? this.minFormat.minute() : 0;
		},
		getMaxMinute() {
			return $moment(this.time).format('YYYY-MM-DD HH') == this.maxFormat.format('YYYY-MM-DD HH') ? this.maxFormat.minute() : 59;
		},
		getMinSecond() {
			return $moment(this.time).format('YYYY-MM-DD HH:mm') == this.minFormat.format('YYYY-MM-DD HH:mm') ? this.minFormat.second() : 0;
		},
		getMaxSecond() {
			return $moment(this.time).format('YYYY-MM-DD HH:mm') == this.maxFormat.format('YYYY-MM-DD HH:mm') ? this.maxFormat.second() : 59;
		}
	}
};
</script>

<style>
.uni-datetime-picker-view {
	width: 100%;
	height: 130px;
	margin-top: 30px;
}

.uni-datetime-picker-item {
	line-height: 50px;
	text-align: center;
}

.uni-datetime-picker-btn {
	margin-top: 60px;
	display: flex;
	justify-content: space-between;
	color: blue;
	cursor: pointer;
}

.uni-datetime-picker-btn-group {
	display: flex;
}

.uni-datetime-picker-cancel {
	margin-right: 30px;
}

.uni-datetime-picker-mask {
	position: fixed;
	bottom: 0px;
	top: 0px;
	left: 0px;
	right: 0px;
	background-color: rgba(0, 0, 0, 0.4);
	transition-duration: 0.3s;
	z-index: 998;
}

.uni-datetime-picker-popup {
	border-radius: 8px;
	padding: 30px;
	width: 270px;
	background-color: #fff;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	transition-duration: 0.3s;
	z-index: 999;
}

.uni-datetime-picker-time {
	color: grey;
}

.uni-datetime-picker-colon::after {
	content: ':';
	position: absolute;
	top: 53px;
	right: 0;
}

.uni-datetime-picker-hyphen::after {
	content: '-';
	position: absolute;
	top: 53px;
	right: -2px;
}

.uni-datetime-picker-timebox {
	border: 1px solid #e5e5e5;
	border-radius: 5px;
	padding: 7px 10px;
	box-sizing: border-box;
	cursor: pointer;
}

// 下箭头
.uni-datetime-picker-down-arrow {
	display: inline-block;
	position: relative;
	width: 20px;
	height: 15px;
}

.uni-datetime-picker-down-arrow::after {
	display: inline-block;
	content: ' ';
	height: 9px;
	width: 9px;
	border-width: 0 1px 1px 0;
	border-color: #e5e5e5;
	border-style: solid;
	transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
	transform-origin: center;
	transition: transform 0.3s;
	position: absolute;
	top: 50%;
	right: 5px;
	margin-top: -5px;
}
.uni-datetime-picker-flex {
	display: flex;
	justify-content: space-between;
}
</style>
