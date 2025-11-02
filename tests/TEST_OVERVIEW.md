# 测试方案全览

## 🎯 测试架构

本项目采用**双层测试策略**：

1. **单元测试 (Unit Tests)** - 使用 Jest
   - 快速、独立、不依赖浏览器
   - 测试核心逻辑和函数
   - 120+ 测试用例

2. **E2E 测试 (End-to-End Tests)** - 使用 Playwright
   - 完整用户流程测试
   - 跨浏览器兼容性
   - 42+ 测试用例

## 📊 测试统计

| 测试类型 | 框架 | 文件数 | 测试套件 | 测试用例 | 运行时间 |
|---------|------|--------|---------|---------|---------|
| 单元测试 | Jest | 3 | 26 | 120+ | < 5秒 |
| E2E 测试 | Playwright | 6 | 6 | 42+ | 2-3分钟 |
| **总计** | - | **9** | **32** | **160+** | **< 4分钟** |

## 📁 完整目录结构

```
tests/
├── unit/                           # 单元测试
│   ├── helpers/                    # 可测试的辅助函数
│   │   └── queryHelper.js          # SQL 和数据处理工具
│   ├── fixtures/                   # 测试数据
│   │   └── testData.js             # 测试用例数据
│   ├── queryHelper.test.js         # 辅助函数测试
│   ├── sqlExecution.test.js        # SQL 执行测试
│   ├── dataProcessing.test.js      # 数据处理测试
│   └── README.md                   # 单元测试指南
│
├── specs/                          # E2E 测试
│   ├── file-upload.spec.js         # 文件上传测试
│   ├── sql-queries.spec.js         # SQL 查询测试
│   ├── sheet-switching.spec.js     # Sheet 切换测试
│   ├── export-functions.spec.js    # 导出功能测试
│   ├── ui-interactions.spec.js     # UI 交互测试
│   └── multi-sheet-queries.spec.js # 多表查询测试
│
├── package.json                    # NPM 配置
├── jest.config.js                  # Jest 配置
├── playwright.config.js            # Playwright 配置
│
├── README.md                       # 英文快速指南
├── QUICK_START.md                  # 中文快速指南
├── UNIT_TESTS.md                   # 单元测试详细文档
├── TESTING_GUIDE.md                # 测试导航
└── TEST_OVERVIEW.md                # 本文件
```

## 🚀 快速开始

### 一键运行所有测试

```bash
cd tests
npm install
npx playwright install
npm test
```

### 分别运行测试

```bash
# 单元测试（快速）
npm run test:unit

# E2E 测试
npm run test:e2e

# 单元测试 + 覆盖率
npm run test:unit:coverage
```

## 📋 测试覆盖详情

### 单元测试覆盖

#### 1. queryHelper.test.js (50+ 测试)
- ✅ cleanColumnName - 列名清理
- ✅ sanitizeTableName - 表名消毒
- ✅ createTableData - 数据对象创建
- ✅ escapeSQLValue - SQL 值转义
- ✅ buildCreateTableSQL - CREATE TABLE 语句
- ✅ buildInsertSQL - INSERT 语句
- ✅ validateSQL - SQL 验证
- ✅ parseSheetData - Sheet 数据解析
- ✅ escapeCSV - CSV 转义
- ✅ convertToCSV - CSV 转换

#### 2. sqlExecution.test.js (40+ 测试)
- ✅ SELECT 基础查询
- ✅ WHERE 条件过滤
- ✅ ORDER BY 排序
- ✅ LIMIT 限制
- ✅ COUNT, SUM, AVG, MAX, MIN 聚合
- ✅ GROUP BY 分组
- ✅ HAVING 条件
- ✅ INNER JOIN 连接
- ✅ UNION 联合
- ✅ 子查询
- ✅ DISTINCT, LIKE, IN, BETWEEN
- ✅ NULL 处理
- ✅ 错误处理

#### 3. dataProcessing.test.js (30+ 测试)
- ✅ 特殊字符列名处理
- ✅ 数字开头列名处理
- ✅ 空值和 NULL 处理
- ✅ 空行过滤
- ✅ 数据类型转换
- ✅ Unicode 字符处理
- ✅ 大数据集处理

### E2E 测试覆盖

#### 1. file-upload.spec.js (6 测试)
- ✅ 初始界面显示
- ✅ 浏览器兼容性
- ✅ 文件加载成功
- ✅ 数据表格渲染
- ✅ 加载指示器
- ✅ SQL 编辑器初始化

#### 2. sql-queries.spec.js (7 测试)
- ✅ 简单 SELECT 查询
- ✅ WHERE 子句
- ✅ COUNT 聚合
- ✅ 无效 SQL 错误
- ✅ 空查询错误
- ✅ 无结果查询
- ✅ ORDER BY 排序

#### 3. sheet-switching.spec.js (5 测试)
- ✅ Sheet 列表显示
- ✅ Sheet 切换
- ✅ 数据更新
- ✅ 状态保持
- ✅ 特殊字符处理

#### 4. export-functions.spec.js (6 测试)
- ✅ 导出按钮存在
- ✅ 导出菜单显示
- ✅ 导出单表 CSV
- ✅ 导出查询结果 CSV
- ✅ 导出所有表 ZIP
- ✅ 错误处理

#### 5. ui-interactions.spec.js (13 测试)
- ✅ 页面标题和头部
- ✅ 展开/折叠功能
- ✅ ACE 编辑器
- ✅ Select2 下拉框
- ✅ 执行按钮
- ✅ 错误消息清理
- ✅ 等等...

#### 6. multi-sheet-queries.spec.js (5 测试)
- ✅ JOIN 多表查询
- ✅ UNION 查询
- ✅ 表名查询
- ✅ 跨表聚合
- ✅ 数据隔离

## 🔄 CI/CD 集成

### GitHub Actions 工作流

```yaml
test:
  - 安装依赖
  - 运行单元测试 + 覆盖率
  - 运行 E2E 测试（3个浏览器并行）
  - 上传测试报告和覆盖率
```

### 触发条件
- Push 到 main 分支
- Pull Request
- 手动触发

## 💡 测试最佳实践

### 何时使用单元测试
- ✅ 测试纯函数和工具函数
- ✅ 测试数据转换逻辑
- ✅ 测试 SQL 查询构建
- ✅ 快速反馈循环（TDD）

### 何时使用 E2E 测试
- ✅ 测试完整用户流程
- ✅ 测试浏览器交互
- ✅ 测试文件上传
- ✅ 测试跨浏览器兼容性

## 📈 覆盖率目标

| 指标 | 单元测试目标 | 当前状态 |
|------|-------------|---------|
| 语句覆盖率 | > 80% | ✅ 达标 |
| 分支覆盖率 | > 75% | ✅ 达标 |
| 函数覆盖率 | > 90% | ✅ 达标 |

## 🎓 学习路径

### 新手入门
1. 阅读 [QUICK_START.md](QUICK_START.md)
2. 运行 `npm run test:unit`
3. 运行 `npm run test:e2e:ui`
4. 查看测试代码学习

### 进阶使用
1. 阅读 [UNIT_TESTS.md](UNIT_TESTS.md)
2. 使用 `npm run test:unit:watch` 开发
3. 查看覆盖率报告
4. 添加新测试用例

### 专家级别
1. 修改 Jest/Playwright 配置
2. 添加自定义 fixtures
3. 集成性能测试
4. 优化测试执行速度

## 📚 相关资源

### 官方文档
- [Jest 文档](https://jestjs.io/)
- [Playwright 文档](https://playwright.dev/)
- [AlaSQL 文档](https://github.com/alasql/alasql)

### 项目文档
- [单元测试文档](UNIT_TESTS.md)
- [E2E 测试文档](../INTEGRATION_TESTS.md)
- [快速开始](QUICK_START.md)

## 🎯 下一步行动

### 立即开始
```bash
cd tests
npm install
npm run test:unit          # 先跑单元测试（快速）
npm run test:unit:coverage # 查看覆盖率
npm run test:e2e:ui        # 可视化 E2E 测试
```

### 开发工作流
```bash
# 终端 1: 单元测试监听模式
npm run test:unit:watch

# 终端 2: 开发代码
# 保存文件时自动运行测试

# 提交前运行完整测试
npm test
```

---

**完整测试方案：160+ 测试用例，覆盖所有核心功能！** 🎉
