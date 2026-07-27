import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import pxtovw from "postcss-px-to-viewport-8-plugin";

const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir);
};

const alias: Record<string, string> = {
  "@": pathResolve("src"),
  "#": pathResolve("types"),
};

const root: string = process.cwd();

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log(command);
  const { VITE_PROXY1, VITE_PROXY2 } = loadEnv(mode, root);
  return {
    plugins: [
      vue(),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ["vue"],
        // resolvers: [VantResolver()],
        dts: pathResolve("types/auto-imports.d.ts"),
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${pathResolve("src/style/base.less")}";`,
          },
          javascriptEnabled: true,
        },
      },
      // https://github.com/vitejs/vite/issues/5833
      postcss: {
        plugins: [
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              },
            },
          },
          // 兼容750设计稿的viewport
          pxtovw({
            viewportWidth: 750,
            exclude: [/node_modules\/vant/],
          }),
          // 兼容vant
          pxtovw({
            viewportWidth: 375,
            exclude: [/^(?!.*node_modules\/vant)/],
          }),
        ],
      },
    },
    resolve: {
      alias,
    },
    server: {
      // 是否开启https
      https: false,
      port: 8080,
      host: "0.0.0.0",
      proxy: {
        "/loginApi": {
          target: VITE_PROXY1,
          changeOrigin: true,
          ws: false,
          rewrite: (path) => path.replace(/^\/loginApi/, ""),
        },
        "/api": {
          target: VITE_PROXY2,
          changeOrigin: true,
          ws: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false, // 在生产中不启用devtools
    },
  };
});
