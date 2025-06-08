const { exec } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const tempFilePath = path.join(__dirname, '.deleted-deps.json')

// 检查临时文件是否存在
if (fs.existsSync(tempFilePath)) {
  const deletedDeps = JSON.parse(fs.readFileSync(tempFilePath, 'utf8'))
  const depsToRestore = Object.keys(deletedDeps)

  if (depsToRestore.length > 0) {
    // 重新安装被删除的依赖
    exec(`pnpm add ${depsToRestore.map(dep => `${dep}@${deletedDeps[dep]}`).join(' ')}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行恢复出错: ${error}`)
        return
      }
      console.log(`已恢复以下依赖: ${depsToRestore.join(' ')}`)
      console.log(`stdout: ${stdout}`)
      console.error(`stderr: ${stderr}`)

      // 清理临时文件
      fs.unlinkSync(tempFilePath)
      console.log('临时文件已清理')
    })
  }
  else {
    console.log('无需要恢复的依赖')
    fs.unlinkSync(tempFilePath)
  }
}
else {
  console.log('未找到需要恢复的依赖记录')
}
