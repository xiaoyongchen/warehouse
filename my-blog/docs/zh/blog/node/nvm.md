## nvm 每次都要source ～/.bash_profile 才生效
 ```bash
 cd ～/
 touch .zshrc
 open .zshrc
 export NVM_DIR="$HOME/.nvm"
  [ s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm

 source .zshrc
 ```