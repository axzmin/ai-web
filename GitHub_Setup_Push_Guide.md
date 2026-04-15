# 📚 GitHub 仓库建立与代码推送完整指南

> 版本：v1.0 | 日期：2026-04-15

---

## 一、准备工作

### 1️⃣ 确认已安装 Git

打开终端，输入：

```bash
git --version
```

如果显示类似 `git version 2.x.x` 则已安装，否则先安装 Git。

### 2️⃣ 准备信息

在开始之前，准备好以下信息：

| 信息 | 示例 |
|------|------|
| **GitHub 用户名** | `axzmin` |
| **GitHub Token** | `ghp_xxxxxxxxxxxxxx` |
| **项目文件夹路径** | `~/ai-web` 或其他 |

---

## 二、基础配置（一次性）

### 1️⃣ 配置 Git 用户信息

```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的邮箱"
```

### 2️⃣ 配置凭据存储（自动保存 Token）

```bash
git config --global credential.helper store
```

---

## 三、建立仓库并推送代码

### 方式一：全新项目（推荐）

适用于：本地还没有 Git 仓库

#### Step 1: 创建项目文件夹

```bash
# 进入主目录
cd ~

# 创建项目文件夹
mkdir my-project
cd my-project
```

#### Step 2: 初始化 Git

```bash
git init
```

#### Step 3: 在 GitHub 创建仓库

1. 打开 https://github.com
2. 点击右上角 **+** → **New repository**
3. 填写：
   - **Repository name**: `my-project`（项目名）
   - **Description**: `项目描述`
   - **Public** 或 **Private**: 按需选择
4. **不要**勾选 "Initialize this repository with a README"
5. 点击 **Create repository**

#### Step 4: 连接远程仓库

把下方命令中的内容替换为实际值：

```bash
git remote add origin https://你的用户名:你的Token@github.com/你的用户名/仓库名.git
```

例如：

```bash
git remote add origin https://axzmin:ghp_xxxxxxxxxxxx@github.com/axzmin/ai-web.git
```

#### Step 5: 验证连接

```bash
git remote -v
```

应该显示：

```
origin  https://github.com/你的用户名/仓库名.git (fetch)
origin  https://github.com/你的用户名/仓库名.git (push)
```

#### Step 6: 添加文件并提交

```bash
# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"
```

#### Step 7: 推送代码

```bash
git push -u origin main
```

**成功！** 🎉

---

### 方式二：已有本地代码

适用于：本地已有项目文件夹，想推送到 GitHub

#### Step 1: 进入项目文件夹

```bash
cd ~/ai-web
```

#### Step 2: 如果已有 .git，运行

```bash
# 查看是否已是 git 仓库
ls -la | grep .git
```

如果有 `.git`，先移除旧的远程仓库：

```bash
git remote remove origin
```

#### Step 3: 连接远程仓库

```bash
git remote add origin https://你的用户名:你的Token@github.com/你的用户名/仓库名.git
```

#### Step 4: 创建 GitHub 仓库（同方式一 Step 3）

#### Step 5: 推送

```bash
git push -u origin main
```

---

### 方式三：克隆已有仓库

适用于：GitHub 上已有仓库，想在另一台电脑开发

#### Step 1: 克隆仓库

```bash
git clone https://你的用户名:你的Token@github.com/你的用户名/仓库名.git
```

#### Step 2: 进入项目目录

```bash
cd 仓库名
```

#### Step 3: 开始开发，修改代码

#### Step 4: 推送更新

```bash
git add .
git commit -m "描述你的修改"
git push
```

---

## 四、日常开发流程

### 1️⃣ 每天开始工作前：拉取最新代码

```bash
cd ~/ai-web
git pull origin main
```

### 2️⃣ 修改代码后：保存并推送

```bash
git add .
git commit -m "今天做了什么修改"
git push
```

### 3️⃣ 查看状态

```bash
git status
```

---

## 五、常用 Git 命令

| 命令 | 说明 |
|------|------|
| `git init` | 初始化新仓库 |
| `git clone URL` | 克隆仓库 |
| `git add .` | 添加所有修改 |
| `git commit -m "信息"` | 提交修改 |
| `git push` | 推送到 GitHub |
| `git pull` | 拉取最新代码 |
| `git status` | 查看状态 |
| `git remote -v` | 查看远程仓库 |
| `git log` | 查看提交历史 |
| `git diff` | 查看修改内容 |

---

## 六、常见问题

### Q1: 每次 push 都要输入 Token？

**不会！** 因为我们配置了 `credential.helper store`，第一次输入后会自动保存。

### Q2: error: remote origin already exists

说明已经添加过远程仓库，先移除再添加：

```bash
git remote remove origin
git remote add origin https://用户名:Token@github.com/用户名/仓库名.git
```

### Q3: Permission denied

- 检查 Token 是否正确
- 检查用户名是否正确
- Token 是否有 repo 权限

### Q4: SSL 错误

如果遇到 SSL 错误，尝试：

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

然后重新 push：

```bash
git push -u origin main
```

### Q5: 推送时报 "non-fast-forward"

先拉取合并：

```bash
git pull origin main --rebase
git push
```

---

## 七、Token 申请步骤（供参考）

如果需要新的 Token：

1. 打开 https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. 填写：
   - **Note**: `我的电脑`
   - **Expiration**: 建议 90 天
   - **Scopes**: 勾选 ✅ `repo` (完整仓库访问)
4. 点击 **Generate**
5. **立即复制保存**，关闭页面后无法查看

---

## 八、完整示例

### 场景：新建 ai-web 项目并推送

```bash
# 1. 进入主目录
cd ~

# 2. 创建项目文件夹
mkdir ai-web
cd ai-web

# 3. 初始化 Git
git init

# 4. 配置远程仓库（替换为你的信息）
git remote add origin https://axzmin:ghp_xxxxxxxxxxxx@github.com/axzmin/ai-web.git

# 5. 验证
git remote -v

# 6. 创建一些文件
echo "# AI Web" > README.md

# 7. 添加并提交
git add .
git commit -m "Initial commit"

# 8. 推送到 GitHub
git push -u origin main
```

---

## 九、一张图总结流程

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub 操作流程                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  本地                        GitHub                      │
│ ┌──────┐                    ┌──────────────┐            │
│ │ mkdir │ ──── 创建 ──── →   │ New Repository│            │
│ │  cd   │                    └──────┬───────┘            │
│ │ git  │                           │                     │
│ │ init │                           │                     │
│ └──────┘                           │                     │
│      │                             │                     │
│      ▼                             │                     │
│ ┌────────┐                          │                     │
│ │ 写代码 │                          │                     │
│ └────────┘                          │                     │
│      │                             │                     │
│      ▼                             │                     │
│ ┌────────┐                          │                     │
│ │ git add│                          │                     │
│ │git commit│                         │                     │
│ └────────┘                          │                     │
│      │                             │                     │
│      ▼                             │                     │
│ ┌────────────┐      push       ┌──────────────┐         │
│ │ git push   │ ──────────────→ │  代码已推送   │ ✅       │
│ └────────────┘                  └──────────────┘         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

**保存此文档，随时查阅！** 🚀
