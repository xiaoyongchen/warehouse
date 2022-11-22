## 终端常见错误

* Executing task: npm run serve    *  Terminal will be reused by tasks, press any key to close it.
解决方式: 重启软件试试，我遇到的情况是，vscode升级

## brew install you-get 报错 fatal: not in a git directory Error: Command failed with exit 128: git

```bash
git config --global --add safe.directory /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core
git config --global --add safe.directory /usr/local/Homebrew/Library/Taps/homebrew/homebrew-cask

// you
```
### curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused

```bash
# hosts 添加
# sudo vim /etc/hosts :i :wq!
199.232.68.133 raw.githubusercontent.com
199.232.68.133 user-images.githubusercontent.com
199.232.68.133 avatars2.githubusercontent.com
199.232.68.133 avatars1.githubusercontent.com
# 原因github的一些域名DNS解析污染
```
## 下载brew 和重新安装
```bash
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/HomebrewUninstall.sh)"


```