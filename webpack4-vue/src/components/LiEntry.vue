<template>
	<transition>
		<keep-alive>
			<div v-bind="$attrs">
				<div class="label">
					{{ label }}
				</div>
				<div class="value">
					<slot />
				</div>
			</div>
		</keep-alive>
	</transition>
</template>
<script>
export default {
	props: {
		label: {
			type: String,
			default: "",
		},
	},
};
</script>