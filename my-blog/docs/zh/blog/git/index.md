
## [git使用](https://www.liaoxuefeng.com/wiki/896043488029600/896827951938304)

  ### 初始化仓库
  ```javascript
    mkdir learngit
    cd learngit
    pwd
    # /Users/michael/learngit
    git init
  ```

  ### 提交代码

   ```javascript
    // 比如我想提交my-blog/docs/.vuepress/configs/sidebar/zh.ts文件 仓库需与myproject下
    // 一个文件
    git add my-blog/docs/.vuepress/configs/sidebar/zh.ts
    git commit -m "提交测试文件"

    // 多个文件
    git add my-blog/docs/zh/blog/git/index.md  my-blog/docs/zh/blog/git/terminal.md 
    git commit -m "提交2个文件"

    // 文件夹下的所有
    git add my-blog/docs/zh/blog/git/
    git commit -m "提交git个文件"
  ```
  :::tip
    git add xxx 把文件提交到暂缓区
    git commit -m "提交文件"  命令将暂存区内容添加到本地仓库中。并且本地仓库中有哈希值记录
    git status -s 可以查看提交的文件
    git commit -a —m "直接提交到本地仓库"
  :::

  ### 取消代码暂缓区代码

   ```javascript
    git reset HEAD^ 
  ```
 ### 取消本地仓库到暂缓区

  ```javascript
    git reset --soft HEAD^ 
  ```

