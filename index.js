/**
 * Native DSH plugin: 小鲸余额桌宠 (Whale Balance Pet).
 *
 * The visible half is a Web client plugin (./client) that adds a floating
 * whale-girl pet to `shell.overlay`. It reads the current Session's durable
 * `tokenUsage` projection and the DeepSeek account balance through the
 * generated `account` Remote namespace.
 *
 * This Host half intentionally has no services of its own; the bundle row
 * exists so the client half is discovered and loaded.
 */
export function apply() {}
