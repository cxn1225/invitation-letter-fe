# ai_marketing Agent 开发指南

## 项目概述

本项目基于 Vue 3、TypeScript 和 Vite，包含两类业务：

1. 营销落地页：管理员提交主题需求，Cursor Cloud Agent 生成主题配置，人工预览并发布。
2. 活动运营：管理员创建活动，访客通过邀约函和现场签到页参与。

项目没有独立后端。开发环境的 `/api/*` 由 Vite 插件提供，数据保存为 `data/` 下的 JSON 文件。

## 技术栈与命令

- Vue 3 Composition API、TypeScript、Vue Router、Pinia、Vant
- Tailwind CSS 4
- Vite 4.4.4 与自定义开发服务器中间件
- Node.js `^22.17.0 || >=24.12.0`

```bash
npm run dev                       # 启动 Vite 与本地 API
npm run build                     # 类型检查并构建
npm run type-check                # 仅类型检查
npm run lint                      # 使用 oxlint 和 ESLint 自动修复
npm run format                    # 格式化 src/
npm run check:agent-branches      # 检查远端 Cursor Agent 分支
npm run sync:agent-branches       # 同步符合条件的 Agent 分支
```

功能改动完成后应运行 `npm run build`。除非任务明确要求，不要对用户已有的无关改动运行会自动修复的 `lint`。


## 编码规范

- 使用 `<script setup lang="ts">`、Composition API，并通过 `@/` 导入 `src` 内路径。
- 两空格缩进、LF 换行、单引号、无分号、单行最大 100 字符；以 `.editorconfig` 和 `.prettierrc.json` 为准。
- 领域类型放在 `src/types/`，请求客户端放在 `src/services/`，共享纯函数放在 `src/utils/`。
- 优先采用配置驱动的改动，避免复制页面组件。
- 中文文案必须以 UTF-8 保存；终端显示乱码时，改写前先确认文件编码。
- 除非任务必要，不要修改运行时数据、`.env.local` 或用户已有的无关工作区改动。

## 交付前检查

- [ ] 明确本次改动属于已发布主题、草稿流程、模板/布局，还是活动运营功能。
- [ ] 同步更新受影响的类型、注册表、API 与 UI 调用方。
- [ ] 保持主题需求和草稿的状态流转合法。
- [ ] 保持主题 ID、slug 和路由一致。
- [ ] 修改接口时，在 `npm run dev` 下验证相关本地 API。
- [ ] 交付前运行 `npm run build`。
