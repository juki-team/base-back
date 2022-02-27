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

https://docs.bit.dev/docs/ts-guidelines#global-types

### Global Types
Bit is adding dependencies as defined in the code files, both source and tests. For that reason global types for typescript are not interfered by default. If you are using global styles, such as @types/node or @types/jest, you should add them as devDependencies using the overrides option:

```json
{
  "bit": {
    "overrides": {
      "*": {
        "devDependencies": {
          "@types/node": "+"
        }
      }
    }
  }
}
```

### ts-node

```
yarn add @types/node -S
yarn add ts-node-dev -D
```