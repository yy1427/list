# Node.js安装脚本
$nodeVersion = "20.11.1"
$installDir = "C:\Program Files\nodejs"

# 创建安装目录
if (!(Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force
}

# 下载Node.js二进制文件
$zipUrl = "https://nodejs.org/dist/v$nodeVersion/node-v$nodeVersion-win-x64.zip"
$zipPath = "$env:TEMP\node-v$nodeVersion-win-x64.zip"

Write-Host "正在下载Node.js v$nodeVersion..."
Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath

# 解压到安装目录
Write-Host "正在解压Node.js..."
Expand-Archive -Path $zipPath -DestinationPath "$env:TEMP"
Move-Item -Path "$env:TEMP\node-v$nodeVersion-win-x64\*" -Destination $installDir -Force

# 添加到环境变量
$envPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
if ($envPath -notlike "*$installDir*") {
    $newEnvPath = "$envPath;$installDir"
    [Environment]::SetEnvironmentVariable("PATH", $newEnvPath, "Machine")
    Write-Host "已将Node.js添加到系统环境变量"
}

# 清理临时文件
Remove-Item -Path $zipPath -Force
Remove-Item -Path "$env:TEMP\node-v$nodeVersion-win-x64" -Recurse -Force

Write-Host "Node.js安装完成！"
Write-Host "请重启终端后运行 node -v 验证安装"
