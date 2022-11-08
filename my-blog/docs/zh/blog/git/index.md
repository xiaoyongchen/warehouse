
## [git使用](https://www.liaoxuefeng.com/wiki/896043488029600/896827951938304)

  ### 初始化仓库
  ```javascript
    ...
    pwd
    # /Users/老王/testDir
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

  ### 查看日志 **git log**
  ```javascript
    git log --pretty=oneline
    git log origin/feature/development --pretty=oneline
    // 查看最近几条提交 --graph 图形化
    git log -3  --graph --pretty=oneline 
    // 通过log查看修改的位置
    git log -3  --pretty=oneline
  ```

  ### 删除文件

  ```javascript
    git rm my-blog/docs/zh/blog/git/test.txt
  ```

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
  // 删除本地分支
  git branch -d feature/1.0.0
  // 删除远程分支
  git push origin  -d feature/1.0.0 <=>  git push origin :feature/1.0.0

  ```

  :::warning
  需要切换到其他分支才能删除
  :::

  ### 查看分支

  ```javascript
    git branch
  ```

  ### 创建|切换分支

  ```javascript
    git checkout main
    git switch main
    // 从选择的分支创建并切换到当前分支
    git checkout -b feature/development <=> git branch feature/development git checkout feature/development 

    // 因为git checkout -- <文件> 区别
    git switch -c feature/development

    // 从已有的远程分支切换到本地
    git checkout -b feature/2.7.0 origin/feature/2.7.0
  ```
  ### 推送分支

  ```javascript
    git push origin feature/1.0.0

    // 已经有feature文件夹
    git push --force origin :feature
  ```

  :::tip
  ! [remote rejected] feature/development -> feature/development (cannot lock ref 'refs/heads/feature/development': 'refs/heads/feature' exists; cannot create 'refs/heads/feature/development')

  因为远程已经有了，文件夹已经被lock了
  :::

  ### 推送代码到远程分支并合并 
  格式**git push <远程主机名> <本地分支名>:<远程分支名>**
  ```javascript
    git push origin main
  ```

  :::tip
  **`git push origin main:main`** **`git push origin main`** **`git push origin`** **`git push`** **`git push -u origin main`**
  * 本地分支远程分支同名 git push origin main:main <=> git push origin main
  * 当前分支与远程分支存在追踪关系(远程有) git push origin main <=> git push origin
  * 当只有一个主机时候 3者等价
  * 只有一个主机时候 git push -u origin <=> git push origin main
  :::


  ### 合并代码

  ```javascript
    git checkout main
    git merge feature/development
  ```

  ### git cherry-pick

  ```javascript
   git cherry-pick <commitHash>
  ```

  :::tip
  **`git merge`** 合并所有的提交

  **`git cherry-pick`** 可以指定commit

  共同点：都需要在当前分支进行
  :::
