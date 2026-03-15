## CSADI API 资源池使用指南（内部试行版）

### 一、门户网站基本使用

#### 1.api资源池的基本概念

CSADI API 资源池是基于开源项目 **New API** 搭建的内部中转与管理平台。

- **定位**：它是连接“下游用户”与“上游大模型供应商”的智能桥梁，目的是实现部门员工api资源的统一调度。
- **核心优点**：
  - **资源聚合**：一个接口通达全球主流模型，无需反复切换账号。
  - **稳定性极高**：集成多个渠道，当某个线路不稳定时，系统会自动秒级切换，保证业务不中断。
  - **成本透明**：实时查看个人 Token 消耗，部门可根据需求精准分配额度。
  - **灵活扩展**：我们已针对前端代码进行自定义修改，未来将上线更多符合部门业务的功能。
- **管理提示**：请妥善保管个人账号及生成的令牌，避免额度被他人冒用。

#### 2.登录访问门户网站

- **访问地址**：http://192.168.4.57:3000/login （建议收藏至浏览器书签）
- **登录账号**：
  - **账号**：员工真实姓名（如：张三）
  - **初始密码**：`csadi123456`
  - *注：首次登录后，请务必前往“个人设置”修改初始密码。*

- 模块功能速览：

1. **数据看板**：个人“仪表盘”，实时显示当前账户余额、历史消耗趋势及站内重要通知。
2. **令牌管理**：在这里生成用于连接 claude、代码或第三方工具的“钥匙”。
3. **使用日志**：记录每一笔 API 调用的时间、模型、消耗 Token 及产生的费用。
4. **钱包管理**：用于额度充值，查看账户的总资产状况。
5. **个人设置**：修改个人信息、重置登录密码及查看个人专属 ID。

#### 3.创建个人令牌

要在软件或代码中使用 AI，必须先生成一个令牌：

1. 点击左侧导航栏 **“令牌管理”**，点击 **“添加新的令牌”**。
2. **参数配置**：
   - **名称**：建议命名为用途（如：`Chatbox使用` 或 `项目A测试`）。
   - **令牌分组**：选**auto**分组，与token消耗计费有关
   - **过期时间**：建议选“永不过期”。
   - **额度设置**：默认“无限额度”是指该令牌可以使用您账户下的所有余额。若要控制某个工具的消耗，可手动设置额度。
3. 点击提交后，在列表点击 **“复制”**。您将得到一个以 `sk-` 开头的字符串，这就是您的个人专用 API Key。

![image-20260312143303143](images/image-20260312143303143.png)

![image-20260312143637731](images/image-20260312143637731.png)

#### 4.额度充值

(1)额度下发机制

出于部门财务管理规范，API 资源池不开放个人直接购买。

- **按月下发**：管理员会定期根据项目需求，向员工发放“兑换码”。
- **申请增额**：若当月基础额度耗尽，请向部门管理员（[管理员姓名]）提交简要申请，获批后将发放额外兑换码。

(2)额度充值操作

1. 进入 **“钱包管理”** 模块。
2. 找到 **“兑换码充值”** 区域。
3. 输入管理员发放的字符代码，点击 **“兑换”**。
4. 充值成功后，额度将立即更新，您可以在看板中查看。

![image-20260312143931151](images/image-20260312143931151.png)

#### 5.API调用

在常用的AI工具中 (如 claude code cli 、codex)中自定义服务基地址和apikey，目前系统只集成了claude模型和codex模型，后续会继续添加

- API 域名（base_url）：
  - claude：http://192.168.4.57:3000
  - codex：http://192.168.4.57:3000/v1
- apikey：在门户中申请的令牌（一般以sk开头）

如果你的电脑已经安装过claude或codex，可以参考以下方式进行修改（没有安装过参考`二、cli工具安装教程进行安装`）：

##### (1)claude配置修改

对于Windows电脑，会在用户根目录(例如`C:\Users\3787(你自己的用户名)`)下有一个`.claude`文件夹，进入文件夹，打开`settings.json`文件，即可修改baseURL和apikey

![image-20260312144903638](images/image-20260312144903638.png)

![image-20260312145004477](images/image-20260312145004477.png)



##### (2)codex配置修改

对于Windows电脑，会在用户根目录(例如`C:\Users\3787(你自己的用户名)`)下有一个`.codex`文件夹，进入文件夹，在`config.toml`文件中修改baseURL，在`auth.json`文件中修改令牌

![image-20260312145218915](images/image-20260312145218915.png)

![image-20260312145405985](images/image-20260312145405985.png)

![image-20260312145453469](images/image-20260312145453469.png)

### 二、cli工具安装

#### 1.claude code安装

##### (1)下载安装

推荐两种方式：powershell安装和node安装

**①node安装**

如果你的电脑上有node.js并且版本在18及以上，那么你就可以使用此方法安装：

- 验证node安装

~~~bash
node --version
~~~

如果出现下面的提示就说明 node 已经安装成功了

![image-20260312150034994](images/image-20260312150034994.png)

- 安装 Claude Code CLI

~~~bash
npm install -g @anthropic-ai/claude-code --registry=https://registry.npmmirror.com/
~~~

[^注意]: 如果遇到在此系统上禁止运行脚本，需要用管理员权限运行powershell，然后执行 `Set-ExecutionPolicy Unrestricted` 命令

**②powershell安装**

打开 **PowerShell**（建议以管理员身份运行）并执行

~~~bash
irm https://claude.ai/install.ps1 | iex
~~~

安装完成以后，在终端输入以下命令进行验证：

~~~bash
claude -version
~~~

![image-20260304191826698](images/image-20260304191826698.png)

如果显示版本号，说明安装成功!

##### (2)创建配置文件

###### 1️⃣windows配置文件

打开 **PowerShell**（建议以管理员身份运行）并执行（**注意替换apikey！！！**）：

~~~bash
# 目标目录：C:\Users\<you>\.claude
$dir = Join-Path $env:USERPROFILE ".claude"
$settingsFile = Join-Path $dir "settings.json"
$claudeJsonFile = Join-Path $env:USERPROFILE ".claude.json"

# 创建目录（存在不报错）
New-Item -ItemType Directory -Path $dir -Force | Out-Null

# 1. 写入 settings.json（API 配置）
$settingsJson = @'
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "！！！这里修改成你的令牌！！！",
    "ANTHROPIC_BASE_URL": "http://192.168.4.57:3000"
  }
}
'@
[System.IO.File]::WriteAllText($settingsFile, $settingsJson, (New-Object System.Text.UTF8Encoding($false)))

# 2. 写入 .claude.json（跳过登录）- 注意这个文件在用户根目录
$claudeJson = @'
{
  "hasCompletedOnboarding": true
}
'@
[System.IO.File]::WriteAllText($claudeJsonFile, $claudeJson, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "配置完成！"
Write-Host "  - settings.json: $settingsFile"
Write-Host "  - .claude.json: $claudeJsonFile"
~~~

###### 2️⃣Mac配置文件

> [!WARNING]
>
> 先复制下面的命令到本地，将其中的`这里修改成你的令牌`改成你自己的 API Key，然后再执行即可

~~~bash
# 目标目录：~/.claude
dir="$HOME/.claude"
settingsFile="$dir/settings.json"
claudeJsonFile="$HOME/.claude.json"

# 创建目录（存在不报错）
mkdir -p "$dir"

# 1. 写入 settings.json（API 配置）
cat > "$settingsFile" << 'EOF'
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "！！！这里修改成你的令牌！！！",
    "ANTHROPIC_BASE_URL": "http://192.168.4.57:3000"
  }
}
EOF

# 2. 写入 .claude.json（跳过登录）- 注意这个文件在用户根目录
cat > "$claudeJsonFile" << 'EOF'
{
  "hasCompletedOnboarding": true
}
EOF

echo "配置完成！"
echo "  - settings.json: $settingsFile"
echo "  - .claude.json: $claudeJsonFile"
~~~

##### (3)验证安装

重新打开 PowerShell 或者 IDE，运行：

~~~bash
claude
~~~

![image-20260312150609370](images/image-20260312150609370.png)

![image-20260312150627544](images/image-20260312150627544.png)

接下来就可以愉快的使用claude啦！！！

#### 2.codex安装

##### (1)下载安装

codeX需要node版本在20及以上，如果没有node，可以去官网下载一个（如果你要做前端开发，推荐使用nvm进行node版本管理）

- 验证node安装（注意版本要在20及以上）

~~~bash
node --version
~~~

如果出现下面的提示就说明 node 已经安装成功了

![image-20260312150034994](images/image-20260312150034994.png)

没有node访问 https://nodejs.org/ 进行下载

- 安装CodeX CLI

~~~bash
npm install -g @openai/codex --registry=https://registry.npmmirror.com/
~~~

[^注意]: 如果遇到在此系统上禁止运行脚本，需要用管理员权限运行powershell，然后执行 `Set-ExecutionPolicy Unrestricted` 命令

##### (2)创建配置文件

###### 1️⃣windows配置

> [!WARNING]
>
> 打开 **PowerShell**（建议以管理员身份运行）并执行（**注意替换apikey！！！**）：

~~~bash
# 目标目录
$dir = Join-Path $env:USERPROFILE ".codex"

# 创建目录（存在不报错）
New-Item -ItemType Directory -Path $dir -Force | Out-Null

# 写 auth.json（UTF-8 无 BOM，覆盖）
$auth = @'
{
  "OPENAI_API_KEY": "！！！这里修改成你的令牌！！！"
}
'@
[System.IO.File]::WriteAllText(
  (Join-Path $dir "auth.json"),
  $auth,
  (New-Object System.Text.UTF8Encoding($false))
)

# 写 config.toml（UTF-8 无 BOM，覆盖）
$config = @'
model_provider = "aicodewith"
model = "gpt-5.3-codex"
model_reasoning_effort = "high"
disable_response_storage = true
preferred_auth_method = "apikey"
requires_openai_auth = true

enableRouteSelection = true

[model_providers.aicodewith]
name = "aicodewith"
base_url = "http://192.168.4.57:3000/v1"
wire_api = "responses"
'@
[System.IO.File]::WriteAllText(
  (Join-Path $dir "config.toml"),
  $config,
  (New-Object System.Text.UTF8Encoding($false))
)

~~~

验证是否设置成功：

~~~bash
Get-Content "$env:USERPROFILE\.codex\auth.json"
Get-Content "$env:USERPROFILE\.codex\config.toml"
~~~

![image-20260312163356411](images/image-20260312163356411.png)

###### 2️⃣Mac配置文件

> [!WARNING]
>
> 先复制下面的命令到本地，将其中的`这里修改成你的令牌`改成你自己的 API Key，然后再执行即可

~~~bash
# 目标目录
dir="$HOME/.codex"
mkdir -p "$dir"

# 写 auth.json（覆盖）
cat > "$dir/auth.json" << 'EOF'
{
  "OPENAI_API_KEY": "！！！这里修改成你的令牌！！！"
}
EOF

# 写 config.toml（覆盖）
cat > "$dir/config.toml" << 'EOF'
model_provider = "aicodewith"
model = "gpt-5.3-codex"
model_reasoning_effort = "high"
disable_response_storage = true
preferred_auth_method = "apikey"
requires_openai_auth = true

enableRouteSelection = true

[model_providers.aicodewith]
name = "aicodewith"
base_url = "http://192.168.4.57:3000/v1"
wire_api = "responses"
EOF

~~~

##### (3)验证安装

powershell 中输入 codex 启动

![image-20260312163513388](images/image-20260312163513388.png)

然后在对话框中，输入：您好！，跟他打个招呼，如果正常回复，并且在平台内看到调用记录，则安装成功

![image-20260312163555562](images/image-20260312163555562.png)

#### 3.Gemini安装

##### (1)下载安装

需要node版本在18及以上，如果没有node，可以去官网下载一个（如果你要做前端开发，推荐使用nvm进行node版本管理）

- 验证node安装（注意版本要在20及以上）

~~~bash
node --version
~~~

如果出现下面的提示就说明 node 已经安装成功了

![image-20260312150034994](images/image-20260312150034994.png)

没有node访问 https://nodejs.org/ 进行下载

- 安装CodeX CLI

~~~bash
npm install -g @google/gemini-cli --registry=https://registry.npmmirror.com/
~~~

[^注意]: 如果遇到在此系统上禁止运行脚本，需要用管理员权限运行powershell，然后执行 `Set-ExecutionPolicy Unrestricted` 命令

##### (2)创建配置文件

###### 1️⃣windows配置

> [!WARNING]
>
> 打开 **PowerShell**（建议以管理员身份运行）并执行（**注意替换apikey！！！**）：

~~~bash
# 创建 ~/.gemini 目录（存在不报错）
mkdir "$env:USERPROFILE\.gemini" -Force | Out-Null

# 写入 .env（UTF-8 无 BOM，覆盖）
$envText = @'
GEMINI_API_KEY="！！！这里修改成你的令牌！！！"
GOOGLE_GEMINI_BASE_URL=http://192.168.4.57:3000
GEMINI_MODEL=gemini-3-pro
'@
[System.IO.File]::WriteAllText("$env:USERPROFILE\.gemini\.env", $envText, (New-Object System.Text.UTF8Encoding($false)))

# 写入 settings.json（UTF-8 无 BOM，覆盖）
$json = @'
{
  "ide": {
    "enabled": true
  },
  "security": {
    "auth": {
      "selectedType": "gemini-api-key"
    }
  }
}
'@
[System.IO.File]::WriteAllText("$env:USERPROFILE\.gemini\settings.json", $json, (New-Object System.Text.UTF8Encoding($false)))
~~~

验证是否设置成功：

~~~bash
Get-Content "$env:USERPROFILE\.gemini\.env"
Get-Content "$env:USERPROFILE\.gemini\settings.json"
~~~

###### 2️⃣Mac配置文件

> [!WARNING]
>
> 先复制下面的命令到本地，将其中的`这里修改成你的令牌`改成你自己的 API Key，然后再执行即可

~~~bash
mkdir -p "$HOME/.gemini"

cat > "$HOME/.gemini/.env" << 'EOF'
GEMINI_API_KEY="！！！这里修改成你的令牌！！！"
GOOGLE_GEMINI_BASE_URL=http://192.168.4.57:3000
GEMINI_MODEL=gemini-3-pro
EOF

cat > "$HOME/.gemini/settings.json" << 'EOF'
{
  "ide": {
    "enabled": true
  },
  "security": {
    "auth": {
      "selectedType": "gemini-api-key"
    }
  }
}
EOF
~~~

验证是否设置成功：

~~~bash
cat "$HOME/.gemini/.env"
cat "$HOME/.gemini/settings.json"
~~~

##### (3)验证安装

powershell /终端 中输入Gemini启动

![image-20260315224909267](./images/image-20260315224909267.png)

### 三、使用说明

#### 1.模型选择

不同模型工具在不同应用场景下的表现不同，根据自己的使用场景合理切换或选择使用的工具可以事半功倍，并且节省大量的token消耗

##### (1)Claude code

Claude中即成了`claude-opus-4-6\claude-sonnet-4-6\claude-haiku-4-5-20251001`三种模型，其中`claude-opus-4-6`处理复杂任务时表现最强也最贵，因此在使用过程中可以采用如下方式：

- **复杂任务首选claude-opus-4-6模型**:模型具备极强的逻辑分析、全局把控和复杂问题拆解能力，适合处理高难度、高复杂度的开发相关任务，尤其推荐在项目架构设计阶段使用。使用时建议开启**plan mode**模式，规划好后再让AI动工
- **小场景业务任务使用claude-sonnet-4-6**：该模型兼顾效率与成本，性能介于Opus和Haiku之间，在单一功能模块的开发、简单代码的编写与调试、基础业务逻辑的梳理、小型工具的开发等，无需复杂的全局把控，追求高效、低成本完成基础开发工作时，优先选择该模型。

##### (2)Codex

codex模型的核心优势的是性价比高，且在各类小场景开发任务中表现均衡、稳定，当我们处理单一小应用场景、无需复杂逻辑拆解的开发任务时，可优先切换到Codex模型使用。

补充说明：Codex模型对基础代码的兼容性强，支持多种编程语言，尤其在前端基础开发、后端简单接口开发等场景中，响应速度快、代码准确率高，适合日常开发中的高频轻量任务。

##### (3)Gemini

Gemini模型的核心优势在于页面美观度相关的处理能力，其对UI设计的理解、视觉效果的优化、界面布局的合理性把控，远优于Cloudcode和Codex模型，尤其擅长将开发需求与视觉体验结合，生成符合审美、交互流畅的页面效果.

我们需要修改页面UI、优化UI设计、提升页面视觉体验时，可优先切换到Gemini模型使用。

##### 总结

复杂任务（架构设计、复杂流程）选Cloudcode-Opus；轻量开发、局部修改（组件修改、简单代码）选Codex或claude-sonnet-4-6；UI设计、页面优化选Gemini。合理切换模型，既能保证开发效率和成果质量，又能最大限度节省token消耗，降低使用成本。

#### 2.写好项目说明文档

在项目中使用cli工具时，AI会从项目根目录默认读取md说明文档，比如Claudecode会读取Claude.md，Gemini会读取gemini.md，Codex会读取codex.md，这些MD文件将作为模型理解项目需求、固定配置的核心依据，提前配置完善可大幅提升模型响应的精准度。

- 我们可以让模型先自动生成一份基础的项目说明文档，后续再结合自身项目需求，在生成的文档中补充固定配置和自定义要求（比如在使用Claude code模型时，我们可通过`/init`命令）
- 生成基础说明文档后，需及时补充自定义需求，确保配置信息完整，比如使用了哪些第三方库、指定types文件存放的文件夹路径、公共组件的存放目录、接口请求的统一配置、代码规范要求等。完成补充后，模型在后续开发过程中会自动读取这份说明文档，精准匹配自定义需求，避免重复沟通和配置，进一步提升开发效率。



