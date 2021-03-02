<template>
	<view>
		<text>有默认值的picker</text>
		<song-datetime-picker name="picker1" value="2021-02-28 12:12:12" @change="change"></song-datetime-picker>
		<text>带有最大时间和最小时间的picker</text>
		<song-datetime-picker name="picker2" @change="change" minDateTime="2021-12-31 12:12:12" maxDateTime="2025-01-31 00:00:00"></song-datetime-picker>
		<text>返回时间戳的picker</text>
		<song-datetime-picker name="picker3" @change="change" minDateTime="2021-01-01 12:12:12" maxDateTime="2025-12-31 00:00:00" :timestamp="true"></song-datetime-picker>

		<text>带有placeholder的picker</text>
		<song-datetime-picker
			name="picker3"
			@change="change"
			minDateTime="2021-01-01 12:12:12"
			maxDateTime="2025-12-31 00:00:00"
			placeholder="请选择时间"
			popupTitle="请选择"
		></song-datetime-picker>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		change(value, name) {
			console.log(value, name);
		}
	}
};
</script>

<style></style>
