# Installation

```
nvm install v16.14.0
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install --no-install-recommends yarn
```

# Adding typscript

``` 
 yarn init
 yarn add typescript --dev
 yarn tsc --init
```

# Bit

```
 bit init
 bit import bit.envs/compilers/typescript --compiler
 yarn add @bit/juki-team.juki.commons
 
 bit add src/base-back && bit tag --all && bit export juki-team.juki
```

```
yarn add @types/node -S
yarn add ts-node-dev -D
```