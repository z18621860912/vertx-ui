# UI0003 - 基本开发规范

本章节介绍Zero UI的基本开发规范，主要用于描述Zero UI的一些系统生成的连接文件，配合生成器生成对应组件文件，但是这些文件都遵循一定的命名规范，所以需要**开发者注意**。

## 1. 路由文件

### 1.1. 布局模板文件

文件路径：

```shell
src/container/index.js
```

该文件会在启动zero时自动生成，以**二级目录**中扫描到的路径为主，Console中输出如下：

```shell
[SUC] Successfully to write data to src/container/index.js
```

**示例**：

```javascript
import _hotel_admin from './hotel/admin/UI';
import _login_index from './login/index/UI';

export default {
    _hotel_admin,
    _login_index,
}
```

上述文件为系统自动生成，生成规则如下：

* 只扫描二级目录文件，如`container/login/index`下为`login`模块中的`index`页面；
* 扫描的文件名为固定JS文件名：`UI.js`，该文件名必须遵循后边的开发规范，不可变更；

> 由于是系统自动生成，所以不可能重名！

### 1.2. 页面文件

文件路径：

```shell
src/components/index.js
```

该文件会在启动zero时自动生成，以**二级目录**中扫描到的路径为主，Console中输出如下：

```shell
[SUC] Successfully to write data to src/components/index.js
```

系统生成规则和布局模板文件一致，同样不可能重名；

### 1.3. 路由编连

在Zero UI中，基本使用了`Layout + Page`的页面结构，且启动时系统会自动扫描开发目录中对应的`Layout, Page, Action, Epic`等组件自动追加到环境中，以保证一下原则：

* 路由地址自动生成，不需要开发者管理，遵循基本命名规范即可；
* `Action、Epic`等核心组件也由系统自动生成，遵循命名规则即可；
* 对于特殊需求使用路由编连，为一次性配置；

路由编连文件位于：

```shell
src/route.json
```

该文件内容如下：

```json
{
    "defined":"_hotel_admin",
    "special":{
        "_login_index":[
            "_login_index"
        ]
    }
}
```

相关属性说明：

* `defined`：默认使用模板，没有出现于`special`部分的所有页面将统一使用该模板；
* `special`：指定模板，指定规则为：模板名 = 页面名称组；

此处的名称遵循下边的路由基本生成规则，该配置文件可以在后续版本中进行升级，方便多模板多页面的自动扫描。

### 1.4. 路由生成规则

路由名称和模板名称的基本规则很简单，以下划线代替原始目录中的`/`目录分隔符，如：

**示例**：

若有一个模板位于`container`的路径下：

```shell
src/container/user/admin/UI.js        
# 该模板的名称为_user_admin
```

**示例**：

若有一个页面位于`components`的路径下：

```shell
src/components/user/password/UI.js
# 该页面的名称为_user_password
# 页面的最终路径地址为：/{APP_ROUTE}/user/password
# APP_ROUTE为当前应用使用的路由环境变量
```

## 2. 资源文件

资源文件为Zero UI中处理国际化版本专用，资源入口文件位于目录：

```shell
src/cab/index.js
src/cab/cn/*            # 中文资源目录
src/cab/en/*            # 英文资源目录
```

资源目录中的文件会通过zero引用到环境中，使用哪个目录的文件取决于环境变量：`APP_LANGUAGE`

## 3. Epic和Action文件

Epic和Action文件主要为`Redux/Redux.Observable`专用的Action处理文件，这两个文件位于每个组件/模板的目录中，且文件名固定，如：

```shell
src/components/user/password/UI.js
src/components/user/password/Act.Epic.js        # Epic专用文件
src/components/user/password/Act.Types.js       # Types专用文件
```

资源链接文件为系统自动生成，会将您写好的Epic和Types打包生成到环境中，该文件路径为：

```shell
src/environment/datum.js
```

除开每个组件专用的文件以外，您还可以写一些全局共享的Epic和Types，该文件位于：

```shell
{UX_SHARED}/action/Epic.js
{UX_SHARED}/action/Types.js
# US_SHARED为环境变量
```

> Epic和Action文件本身不可重名，重名会导致Redux不生效。

## 4. Summary

上述文件除开资源文件以外，其他所有的文件在添加和删除后都需要重启框架，否则不会生效，环境变量可根据不同的“租户”或“用户”进行指定，不同租户除了路由根地址不一致，其他所有内容都是一致的，所以可执行docker环境中的隔离部署，为不同的用户部署完全不同的应用，但访问的是同一个后端。

