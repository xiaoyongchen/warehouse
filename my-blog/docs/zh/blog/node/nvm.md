## nvm 每次都要source ～/.bash_profile 才生效
`解决方法是在这个文件夹下新建或者编辑.zshrc文件`
 ```bash
 cd ～/
 touch .zshrc
 open .zshrc
 export NVM_DIR="$HOME/.nvm"
  [ s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm

 source .zshrc
 ```