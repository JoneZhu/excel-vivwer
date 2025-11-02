# 测试指南

## 快速开始

```bash
cd tests
npm install
npx playwright install
npm test
```

## 查看更多

- 📖 [中文快速指南](./QUICK_START.md)
- 📖 [English Quick Start](./README.md)
- 📖 [详细测试文档](../INTEGRATION_TESTS.md)
- 📖 [测试方案总结](../TEST_SUMMARY.md)

## 目录结构

```
tests/
├── specs/          # 测试用例（6个文件，42+测试）
├── package.json    # NPM 配置
└── playwright.config.js  # Playwright 配置
```

## 重要提示

⚠️ **所有测试命令必须在 `tests` 目录下运行**

```bash
cd tests        # 先进入 tests 目录
npm test        # 再运行测试
```
