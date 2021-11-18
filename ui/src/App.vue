<template>
	<div id="app">
		<div class="page">
			<el-tabs v-model="activeTab" @tab-click="handleTabClick">
				<el-tab-pane label="自动化创建" name="first">
					<div class="item">
						<h3>1. 登录阿里妈妈</h3>
						<span>点击打开内置浏览器，完成扫码登录</span>
						<br />
						<el-button
							style="margin-top: 15px"
							type="primary"
							@click="login"
							:disabled="logined || bugTrigger"
						>{{ bugTrigger ? '请重启utools' : (logined ? '已登录' : '登录淘宝联盟') }}</el-button>
					</div>
					<div class="item">
						<h3>2. 配置</h3>
						<span>正确填写配置</span>
						<el-form
							style="margin-top: 15px;"
							ref="ruleForm"
							:model="configForm"
							status-icon
							label-width="120px"
							class="demo-ruleForm"
						>
							<el-form-item label="名称前缀" prop="prefix">
								<el-input v-model="configForm.prefix" type="text" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item label="媒体ID" prop="siteId">
								<el-input v-model="configForm.siteId"></el-input>
							</el-form-item>
							<el-form-item label="生成数量" prop="count">
								<el-input-number v-model="configForm.count" :min="1" :max="200" />
							</el-form-item>
							<el-form-item label="开始索引" prop="count">
								<el-input v-model.number="configForm.startIndex"></el-input>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="autoExec" :disabled="!browserOpened">立即执行</el-button>
							</el-form-item>
						</el-form>
						<br />
					</div>
				</el-tab-pane>
				<el-tab-pane label="手动执行脚本" name="second">
					<el-steps :space="200" :active="activeStep" simple>
						<el-step title="注入服务" @click="handleStepClick(1)"></el-step>
						<el-step title="修改配置" @click="handleStepClick(2)"></el-step>
						<el-step title="运行脚本" @click="handleStepClick(3)"></el-step>
					</el-steps>
					<div class="content">
						<div class="step1" style="padding: 15px" v-if="activeStep === 1">
							<div class="item">
								<h3>1. 在淘宝联盟页面按下F12</h3>
								<span>浏览器内会弹出一个开发者工具(dev tool)窗口，中文英文都没关系</span>
							</div>
							<div class="item">
								<h3>2. 点击到控制台(console)</h3>
								<el-image :src="srcList[0]" :preview-src-list="srcList" :initial-index="1"></el-image>
							</div>
							<div class="item">
								<h3>3. 复制代码</h3>
								<el-button style="margin-top: 15px" type="primary" @click="copyText(injectCode)">点击复制代码</el-button>
							</div>
							<div class="item">
								<h3>4. 执行代码</h3>点击控制台中空白的位置，使输入光标在控制台中，按下ctrl+v粘贴代码控制台。看到代码粘贴成功后按下回车键
							</div>
							<div class="item">
								<h3>5. 看到注入成功提示</h3>
								<el-image :src="srcList[1]" :preview-src-list="srcList" :initial-index="1"></el-image>
							</div>
							<el-button style="margin: 15px" @click="activeStep++">下一步</el-button>
						</div>
						<div class="step2" style="padding: 15px" v-if="activeStep === 2">
							<div class="item">
								<h3>1. 获取TOKEN</h3>
								<span>找到Cookie，复制_tb_token_的值</span>
								<el-image :src="srcList[2]" :preview-src-list="srcList" :initial-index="1"></el-image>
							</div>

							<div class="item">
								<h3>2. 生成脚本代码</h3>
								<span>填写配置，生成代码</span>
								<el-form
									style="margin-top: 15px;"
									ref="ruleForm"
									:model="configForm"
									status-icon
									label-width="120px"
									class="demo-ruleForm"
								>
									<el-form-item label="名称前缀" prop="prefix">
										<el-input v-model="configForm.prefix" type="text" autocomplete="off"></el-input>
									</el-form-item>
									<el-form-item label="TOKEN" prop="token">
										<el-input v-model="configForm.token" type="text" autocomplete="off" placeholder="可不填"></el-input>
									</el-form-item>
									<el-form-item label="媒体ID" prop="siteId">
										<el-input v-model="configForm.siteId"></el-input>
									</el-form-item>
									<el-form-item label="生成数量" prop="count">
										<el-input-number v-model="configForm.count" :min="1" :max="200" />
									</el-form-item>
									<el-form-item label="开始索引" prop="count">
										<el-input v-model.number="configForm.startIndex"></el-input>
									</el-form-item>
									<el-form-item>
										<el-button type="primary" @click="createExecCode">复制代码</el-button>
									</el-form-item>
								</el-form>
							</div>
							<el-button style="margin: 15px" @click="activeStep++">下一步</el-button>
						</div>
						<div class="step3" style="padding: 15px" v-if="activeStep === 3">
							<div class="item">
								<h3>1. 执行脚本</h3>
								<span>将脚本代码粘贴到控制台，按下回车运行</span>
								<br />
								<br />
								<el-image :src="srcList[3]" :preview-src-list="srcList" :initial-index="1"></el-image>
							</div>
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
		<!-- pid结果 -->
		<el-dialog v-model="state.show" width="60%" title="生成PID结果" :close-on-click-modal="false">
			<div v-if="state.message" style="margin: -15px 0 25px 0">{{ state.message }}</div>
			<el-button type="primary" @click="copyText(state.pids.map(o => o.content).join('\n'))">全部复制</el-button>
			<el-table :data="state.pids">
				<el-table-column property="content" label="内容"></el-table-column>
			</el-table>
		</el-dialog>
		<!-- bugTrigger -->
		<el-dialog v-model="bugTrigger" title="致命错误" width="60%" center>
			<el-result icon="error" title="警告" sub-title="触发了BUG，请在重启utools之前不要使用此插件功能，继续使用会直接出现不可预测后果">
				<template #extra>
					<el-button type="primary" @click="bugTrigger = false">我已知晓</el-button>
				</template>
			</el-result>
			<template #footer>
				<span class="dialog-footer"></span>
			</template>
		</el-dialog>
	</div>
</template>
<script lang="ts">
import { onMounted, reactive, ref } from 'vue';
import QrcodeVue from 'qrcode.vue';
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/index'
export default {
	components: {
		QrcodeVue,
	},
};
</script>
<script lang="ts" setup>
declare global {
	interface Window {
		api?: {};
		pid_generate?: any;
		startServer?: any;
		utools?: {
			onPluginReady: any;
			setExpendHeight: any;
			copyText: any;
			shellShowItemInFolder: any;
			onPluginEnter: any;
			ubrowser?: any;
			getIdleUBrowsers?: any;
			showMainWindow?: any;
			showNotification?: any;
		};
	}
}
const activeTab = ref('first')
const handleTabClick = (e: any) => {
	console.log(e)
}
// step点击
const activeStep = ref(1)
const handleStepClick = (step: number) => {
	activeStep.value = step
}
// 二维码
const dialogVisible = ref(false);
const sharingUrl = ref('');
const generateQrcode = (str: string) => {
	sharingUrl.value = str;
	console.log(str);
	dialogVisible.value = true;
};
const ready = ref(false);
const utoolInit = async () => {
	if (!window.utools) {
		setTimeout(() => utoolInit, 500)
		return
	}
	window.utools.onPluginEnter(({ type, payload }: any) => {
		console.log('进入插件参数', type, payload)
		if (type === 'window') activeTab.value = 'second'
	});
	window.utools.onPluginReady(() => {
		ready.value = true;
		console.log('插件初始化')
	});
	const port = await window.startServer()
	const message = '服务已启动, 端口 ' + port
	console.log(message)
	window.utools.showNotification(message)
}
// 代码
const injectCode = `
tblm_pid_helper_element = document.createElement("script");
tblm_pid_helper_element.setAttribute("type", "text/javascript");
tblm_pid_helper_element.setAttribute("src", "http://127.0.0.1:7899/tblm_pid_generate.min.js");
document.body.appendChild(tblm_pid_helper_element);
`
const configForm = reactive({
	prefix: '',
	token: '',
	siteId: '',
	count: 1,
	startIndex: 0
})
const createExecCode = () => {
	if (!configForm.siteId) {
		ElMessage.error('媒体id不能为空')
		return
	}
	const execCode = `pid_generate("${configForm.prefix || ''}", "${configForm.token || ''}", "${configForm.siteId}", ${configForm.count || 1}, ${configForm.startIndex || 0})`
	copyText(execCode)
}
// 复制
const copyText = (text: string) => {
	window.utools.copyText(text)
	ElMessage.success('复制成功')
}
// 图片
const srcList = reactive([
	'http://localhost:7899/public/img/console.png',
	'http://localhost:7899/public/img/inject.png',
	'http://localhost:7899/public/img/token.png',
	'http://localhost:7899/public/img/result.png'
])
// 自动执行
const logined = ref(false)
const bugTrigger = ref(false)
const checkLogined = async (id: number) => {
	try {
		await window.utools.ubrowser.wait('#nickDrop', 3000).run(id)
		logined.value = true;
		await window.utools.showMainWindow()
	} catch (error: any) {
		console.error(error)
		if (error.message.includes('ms timeout')) {
			setTimeout(() => {
				checkLogined(id)
			}, 3000)
			return
		} else if (error.message.includes('Object has been destroyed')) {
			await window.utools.showMainWindow()
			ElMessage.error('窗口已关闭')
			bugTrigger.value = true
			return
		}
		await window.utools.showMainWindow()
		ElMessage.error('窗口已关闭')
	}
}
const alimamaUrl = 'https://pub.alimama.com/third/manage/record/site.htm'
const browserOpened = ref(false)
const login = async () => {
	const options: any = { width: 1000, height: 600 };
	let browsers = await window.utools.getIdleUBrowsers()
	if (browsers[0]) {
		await window.utools.ubrowser.goto(alimamaUrl).run(browsers[0].id, options)
	} else {
		await window.utools.ubrowser.goto(alimamaUrl).run(options)
	}
	browserOpened.value = true
	browsers = await window.utools.getIdleUBrowsers()
	checkLogined(browsers[0].id)
}
const pids: Array<any> = [];
const state = reactive({
	pids,
	show: false,
	message: '',
})
const autoExec = async () => {
	const browsers = await window.utools.getIdleUBrowsers()
	if (!browsers.length) {
		ElMessage.error('未检测到已登录窗口')
		return
	}
	if (!configForm.siteId) {
		ElMessage.error('媒体id不能为空')
		return
	}
	// 获取token
	try {
		configForm.token = (await window.utools.ubrowser.cookies('_tb_token_').run(browsers[0].id))[0].value
		console.log(configForm.token)
	} catch (error) {
		console.log(error)
	}
	if (!configForm.token) {
		ElMessage.error('账号未登录')
		return
	}
	const result = await window.utools.ubrowser.goto(alimamaUrl).evaluate(async (config: any) => {
		let tblm_pid_helper_element = document.createElement("script");
		tblm_pid_helper_element.setAttribute("type", "text/javascript");
		tblm_pid_helper_element.setAttribute("src", "http://127.0.0.1:7899/tblm_pid_generate.min.js");
		document.body.appendChild(tblm_pid_helper_element);
		while (!window.pid_generate) {
			await new Promise(resolve => setTimeout(resolve, 500))
		}
		return window.pid_generate(config.prefix || '', config.token || '', config.siteId, config.count || 1, config.startIndex || 0)
	}, JSON.parse(JSON.stringify(configForm))).hide().run(browsers[0].id)
	await window.utools.showMainWindow()
	console.log('result', result)
	if (!result || !result.length) {
		ElMessage.error('未知错误')
		return
	}
	const { success, message, data } = result[0];
	state.show = true;
	state.message = message;
	if (success) {
		if (data) state.pids = data.map((o: string) => ({ content: o }))
	} else {
		if (data) state.pids = data.map((o: string) => ({ content: o }))
		ElMessage.error({
			duration: 10 * 1000,
			message
		})
	}
}
onMounted(async () => {
	// 读取进入参数
	utoolInit()
});
</script>

<style>
* {
	padding: 0;
	margin: 0;
}
#app {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
}
.page {
	height: 100%;
	overflow-y: scroll;
	padding: 15px;
}
.item {
	padding: 15px;
}
</style>
