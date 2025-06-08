const { exec } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')

// # 根据编译平台动态删除非目标平台依赖，编译完成后通过restore.js恢复
// # 执行 `pnpm upgrade` 后会升级 `uniapp` 相关依赖
// # 在升级完后，会自动添加很多无用依赖，这需要删除以减小依赖包体积

console.log(process.argv)
const args = process.argv.slice(2) // 获取完整命令行参数（如执行`node minimize.js custom myParam`时args为['custom', 'myParam']）

// 优先级：命令行参数 > UNI_PLATFORM环境变量 > npm生命周期事件解析
const platform = args[0]?.toLowerCase() // 第一个参数为平台名
const customArgs = args.slice(1) // 后续参数为用户自定义参数

console.log('接收到的平台名：', platform)
console.log('接收到的自定义参数：', customArgs)
const packageJsonPath = path.join(__dirname, '..', 'package.json')
const tempFilePath = path.join(__dirname, '.deleted-deps.json')

console.log('当前编译平台（通过npm事件获取）：', platform)

// 所有可能需要删除的平台依赖
const allPlatformDeps = [
  '@dcloudio/uni-app-harmony',
  '@dcloudio/uni-app-plus',
  '@dcloudio/uni-components',
  '@dcloudio/uni-h5',
  '@dcloudio/uni-mp-alipay',
  '@dcloudio/uni-mp-baidu',
  '@dcloudio/uni-mp-harmony',
  '@dcloudio/uni-mp-jd',
  '@dcloudio/uni-mp-kuaishou',
  '@dcloudio/uni-mp-lark',
  '@dcloudio/uni-mp-qq',
  '@dcloudio/uni-mp-toutiao',
  '@dcloudio/uni-mp-weixin',
  '@dcloudio/uni-mp-xhs',
  '@dcloudio/uni-quickapp-webview',
]

// 各平台需要保留的依赖映射
const platformKeepDeps = {
  'app-harmony': ['@dcloudio/uni-app-harmony'],
  'app-plus': ['@dcloudio/uni-app-plus'],
  'h5': ['@dcloudio/uni-h5'],
  'mp-alipay': ['@dcloudio/uni-mp-alipay'],
  'mp-baidu': ['@dcloudio/uni-mp-baidu'],
  'mp-harmony': ['@dcloudio/uni-mp-harmony'],
  'mp-jd': ['@dcloudio/uni-mp-jd'],
  'mp-kuaishou': ['@dcloudio/uni-mp-kuaishou'],
  'mp-lark': ['@dcloudio/uni-mp-lark'],
  'mp-qq': ['@dcloudio/uni-mp-qq'],
  'mp-toutiao': ['@dcloudio/uni-mp-toutiao'],
  'mp-weixin': ['@dcloudio/uni-mp-weixin'],
  'mp-xhs': ['@dcloudio/uni-mp-xhs'],
}

// 计算需要删除的依赖（排除当前平台需要保留的）
const keepDeps = platformKeepDeps[platform] || []
const depsToRemove = allPlatformDeps.filter(dep => !keepDeps.includes(dep))

// 记录被删除依赖的版本信息（用于恢复）
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const deletedDeps = {}

depsToRemove.forEach((dep) => {
  if (packageJson.dependencies[dep]) {
    deletedDeps[dep] = packageJson.dependencies[dep]
  }
})

// 保存临时文件记录被删除的依赖
if (Object.keys(deletedDeps).length > 0) {
  fs.writeFileSync(tempFilePath, JSON.stringify(deletedDeps, null, 2))
}

// 执行删除命令
if (depsToRemove.length > 0) {
  exec(`pnpm un ${depsToRemove.join(' ')}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行删除出错: ${error}`)
      return
    }
    console.log(`已删除以下依赖: ${depsToRemove.join(' ')}`)
    console.log(`stdout: ${stdout}`)
    console.error(`stderr: ${stderr}`)
  })
}
else {
  console.log('无需要删除的平台依赖')
}

// 使用exec执行命令
// 修正 'dependencies' 未定义的问题，使用 depsToRemove 变量
exec(`pnpm un ${depsToRemove.join(' ')}`, (error, stdout, stderr) => {
  if (error) {
    // 如果有错误，打印错误信息
    console.error(`执行出错: ${error}`)
    return
  }
  // 打印正常输出
  console.log(`stdout: ${stdout}`)
  // 如果有错误输出，也打印出来
  console.error(`stderr: ${stderr}`)
})
