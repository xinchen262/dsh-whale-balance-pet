# 小鲸余额桌宠（Whale Balance Pet）

一个 DeepSeek Harness Web UI 插件：在页面右下角放一只可拖动的小鲸桌宠，实时显示 DeepSeek 账户余额，并根据当前会话的 token 消耗速度估算每分钟花费。

![小鲸余额桌宠](./icon.webp)

## 功能

- **实时余额**：读取 DeepSeek 账户的充值余额和赠送余额；每 30 秒刷新一次，token 消耗变化时也会触发刷新（15 秒节流）。点击详情里的「刷新余额」可立即刷新。
- **消耗速度**：对当前会话的 `tokenUsage` 投影做滑动窗口采样，按缓存命中、缓存未命中、输出三类 token 的单价，换算出 ¥/分钟（或 $/分钟）和 tok/分钟。
- **本次会话花费**：累计 token × 当前时段单价，显示约数；同时显示缓存命中率和当前计价时段。
- **小鲸桌宠**：可拖动、点击展开详情、双击/复位按钮回到默认位置；运行中会加快浮动并亮起状态点。位置和展开状态保存在浏览器 `localStorage`。
- **中英双语**：跟随 Harness 的语言设置。

## 安装

### 从插件市场安装

在 Harness 的 **Plugins → Discover** 里搜索「小鲸余额桌宠」或「Whale Balance Pet」，确认来源后安装。

### 手动安装

```sh
dsh plugin --profile <profile> add github:xinchen262/dsh-whale-balance-pet
```

或在 Harness 的插件管理器里安装 `dsh-whale-balance-pet`。

## 数据来源与隐私

- **余额**：使用 Harness 提供的 `account` Remote 命名空间 `getBalance(client)`。只有 Harness Host 能取得账户凭证；浏览器不会接触 token。
- **token**：读取当前会话的 `tokenUsage` 会话投影（`ctx.sessionProjections` 的 `tokenUsage` 单元），由 `@deepseek-ai/dsh-token-meter` 从 `assistant/message` 的 provider usage 折叠而来。
- **当前会话**：`retainedBy.mainView` 标记的会话；找不到时回退到正在运行的会话，再回退到最近更新的会话。
- 插件不包含 API key，不向第三方发送数据，只在浏览器里显示本机会话和账户信息。

## 价格

`client.js` 顶部的 `PRICES` 表使用 DeepSeek 官方 2026-11-05 公布的人民币/美元单价（每 1M tokens，空闲时段基准价）：

| 模型 | 缓存命中输入 | 缓存未命中输入 | 输出 |
|---|---:|---:|---:|
| deepseek-flash | ¥0.02 / $0.003 | ¥1 / $0.15 | ¥4 / $0.60 |
| deepseek-v4-pro | ¥0.15 / $0.022 | ¥4.5 / $0.66 | ¥13.5 / $1.98 |

高峰时段（北京时间周一至周五 9:00–12:00、14:00–18:00）按上表的两倍计价。中国法定节假日没有单独建模，会按空闲时段计算；如官方调价，直接修改 `PRICES`。

## 说明

- 花费是**估算值**：显示的是当前时段单价 × 投影总量；如果一次会话跨越高峰/空闲切换，历史部分的单价可能略有偏差。
- 余额显示的是充值余额 + 赠送余额的总和；赠送余额会单独标注。
- 如果账户未登录，桌宠会显示「未登录」，但 token 速度仍可正常显示。
- 这是轻量版：只读取 Harness 会话与账户数据，不读取 QQ 小鲸、shenge-bot 等外部数据库。

## 开发

- `index.js`：Host 空入口，仅用于让 bundle 行加载 client。
- `client.js`：浏览器端桌宠、余额、速度与详情面板。
- `locale/en.json`、`locale/zh.json`：显示标题和描述。
- `icon.webp`：插件市场图标，同时也是桌宠头像。

## License

MIT
