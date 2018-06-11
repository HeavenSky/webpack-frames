<template>
	<div>
		<router-link to="/">index</router-link>
		<router-link to="/content">content</router-link>
		<router-link to="/user">user</router-link>
		<router-link to="/user/2">user/2</router-link>
		<router-link to="/user/3">user/3</router-link>
		<el-button type="primary">随便一个按键</el-button>
		这是测试主路由:
		<router-view />
	</div>
</template>
<script type="text/javascript">
export default {};
</script>