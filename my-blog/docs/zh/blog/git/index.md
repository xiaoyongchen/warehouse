
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

    // 多个文件
    git add my-blog/docs/zh/blog/git/index.md  my-blog/docs/zh/blog/git/terminal.md 

    // 文件夹下的所有
    git add my-blog/docs/zh/blog/git/

    // 所有的提交
    git add .

    // 直接提交代码到本地仓库
    git commit --all --message "***"
    git commit -a -m "***" 
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
    // 2次HEAD^^ HEAD~20 
    git reset --soft HEAD^
    git reset --hard HEAD^
    
  ```

  :::tip
  **`--hard`**, **`--soft`** 区别

  --hard: 版本指针直接指向上一个记录位置,可以通过`git reflog --pretty=oneline` 查看版本历史

  --soft: 版本指针添加一个记录是上一个提交，他的上一个版本是刚才提交的版本

  :::


  ### 删除文件

  ```javascript
    git rm my-blog/docs/zh/blog/git/test.txt
  ```

  :::tip
  如果删除错误了

  :::


 ### 查看远程分支

  ```javascript
  git remote -v
  
  ```

  ### 关联远程分支

  ```javascript
    git remote add origin 分支链接

  ```
  ### 删除分支

  ```javascript
  git remote rm origin/develop

  ```

  ### 查看分支

  ```javascript
    git branch
  ```
  ### 切换分支

  ```javascript
    git checkout main
  ```

  ### 创建分支

  ```javascript
    // 从选择的分支创建并切换到当前分支
    git branch -b feature/development
  ```


