# 单元测试文档

## 📋 概述

单元测试使用 **Jest** 框架，专注于测试 SQL 查询、数据处理和转换等核心逻辑功能，不依赖浏览器环境。

## 🎯 测试范围

### 1. 查询辅助函数测试 (`queryHelper.test.js`)
- ✅ 列名清理和规范化
- ✅ 表名消毒处理
- ✅ 数据转换和对象创建
- ✅ SQL 值转义
- ✅ SQL 语句构建
- ✅ SQL 查询验证
- ✅ CSV 转换和导出

### 2. SQL 查询执行测试 (`sqlExecution.test.js`)
- ✅ 基础 SELECT 查询
- ✅ WHERE 条件过滤
- ✅ ORDER BY 排序
- ✅ LIMIT 分页
- ✅ 聚合函数 (COUNT, SUM, AVG, MAX, MIN)
- ✅ GROUP BY 分组
- ✅ HAVING 条件
- ✅ JOIN 操作 (INNER JOIN)
- ✅ UNION 联合查询
- ✅ 子查询
- ✅ NULL 值处理
- ✅ 错误处理

### 3. 数据处理测试 (`dataProcessing.test.js`)
- ✅ 特殊字符处理
- ✅ 空值和 NULL 处理
- ✅ 行过滤（空行删除）
- ✅ 数据类型转换
- ✅ 大数据集处理
- ✅ Unicode 字符处理

## 📁 文件结构

```
tests/
├── unit/                          # 单元测试目录
│   ├── helpers/                   # 辅助函数
│   │   └── queryHelper.js         # SQL 和数据处理工具函数
│   ├── fixtures/                  # 测试数据
│   │   └── testData.js            # 测试用例数据
│   ├── queryHelper.test.js        # 查询辅助函数测试
│   ├── sqlExecution.test.js       # SQL 执行测试
│   └── dataProcessing.test.js     # 数据处理测试
├── jest.config.js                 # Jest 配置
└── package.json                   # NPM 配置
```

## 🚀 运行单元测试

### 基本命令

```bash
cd tests

# 运行所有单元测试
npm run test:unit

# 监听模式（开发时推荐）
npm run test:unit:watch

# 生成覆盖率报告
npm run test:unit:coverage
```

### 运行特定测试文件

```bash
# 只测试查询辅助函数
npx jest unit/queryHelper.test.js

# 只测试 SQL 执行
npx jest unit/sqlExecution.test.js

# 只测试数据处理
npx jest unit/dataProcessing.test.js
```

### 运行特定测试用例

```bash
# 使用 -t 参数匹配测试名称
npx jest -t "should clean column names"

# 运行包含特定关键词的测试
npx jest -t "SQL Query"
```

## 📊 测试统计

| 测试文件 | 测试套件 | 测试用例 | 覆盖范围 |
|---------|---------|---------|---------|
| queryHelper.test.js | 10 | 50+ | 辅助函数 |
| sqlExecution.test.js | 8 | 40+ | SQL 查询 |
| dataProcessing.test.js | 8 | 30+ | 数据处理 |
| **总计** | **26** | **120+** | **核心逻辑** |

## 🧪 测试示例

### 测试列名清理

```javascript
test('should clean column names with spaces', () => {
  expect(cleanColumnName('First Name', 0)).toBe('First_Name');
  expect(cleanColumnName('Last Name', 1)).toBe('Last_Name');
});
```

### 测试 SQL 查询执行

```javascript
test('should execute simple SELECT * query', () => {
  const results = alasql('SELECT * FROM Employees');

  expect(results).toHaveLength(5);
  expect(results[0].Name).toBe('John Doe');
});
```

### 测试数据过滤

```javascript
test('should filter completely empty rows', () => {
  const headers = ['A', 'B', 'C'];
  const rows = [
    ['1', '2', '3'],      // Valid
    ['', '', ''],          // Empty - filtered
    ['4', '', '']          // Partially filled - kept
  ];

  const tableData = createTableData(rows, headers);

  expect(tableData).toHaveLength(2);
});
```

## 📈 覆盖率报告

运行覆盖率测试后，会生成 HTML 报告：

```bash
npm run test:unit:coverage

# 打开覆盖率报告
open coverage/lcov-report/index.html
```

覆盖率报告包括：
- 语句覆盖率 (Statement Coverage)
- 分支覆盖率 (Branch Coverage)
- 函数覆盖率 (Function Coverage)
- 行覆盖率 (Line Coverage)

## 🔧 Jest 配置

`jest.config.js` 配置说明：

```javascript
module.exports = {
  testEnvironment: 'node',           // Node 环境
  testMatch: ['**/unit/**/*.test.js'], // 测试文件匹配模式
  coverageDirectory: 'coverage',      // 覆盖率输出目录
  verbose: true,                      // 详细输出
  testTimeout: 10000                  // 测试超时时间
};
```

## 📝 测试数据

### 测试 Fixtures

`tests/unit/fixtures/testData.js` 包含：

#### 员工数据
```javascript
employeeData = {
  headers: ['Name', 'Department', 'Salary', 'Hire Date'],
  rows: [
    ['John Doe', 'Engineering', '85000', '2020-01-15'],
    ['Jane Smith', 'Sales', '72000', '2021-03-20'],
    // ...
  ]
}
```

#### 部门数据
```javascript
departmentData = {
  headers: ['DepartmentName', 'Manager', 'Budget'],
  rows: [
    ['Engineering', 'Alice Wong', '500000'],
    // ...
  ]
}
```

#### 特殊情况数据
- `specialColumnsData` - 包含特殊字符的列名
- `sparseData` - 包含 NULL 和空值
- `numericColumnsData` - 数字开头的列名

## 🎨 测试覆盖的 SQL 功能

### 基础查询
- `SELECT *`
- `SELECT column1, column2`
- `WHERE` 条件
- `ORDER BY` 排序
- `LIMIT` 限制

### 聚合函数
- `COUNT(*)`
- `SUM(column)`
- `AVG(column)`
- `MAX(column)`
- `MIN(column)`

### 分组和过滤
- `GROUP BY`
- `HAVING`

### 多表操作
- `INNER JOIN`
- `LEFT JOIN`
- `UNION`
- `UNION ALL`

### 高级功能
- 子查询
- `DISTINCT`
- `LIKE` 模糊匹配
- `IN` 条件
- `BETWEEN` 范围
- `IS NULL` / `IS NOT NULL`

## ⚠️ 注意事项

### 测试隔离
每个测试套件都会在 `beforeEach` 中重新创建数据库：

```javascript
beforeEach(() => {
  alasql.tables = {};  // 清空所有表
  setupTestDatabase(); // 重新创建测试数据
});
```

### 数据类型
所有数据在测试中都以字符串存储，需要用 `CAST` 进行类型转换：

```sql
SELECT AVG(CAST(Salary AS INT)) FROM Employees
```

### 异步测试
如果需要测试异步操作，使用 `async/await`：

```javascript
test('should handle async operation', async () => {
  const result = await someAsyncFunction();
  expect(result).toBe(expected);
});
```

## 🐛 调试测试

### 运行单个测试
```bash
npx jest -t "test name"
```

### 查看详细输出
```bash
npx jest --verbose
```

### 不捕获 console 输出
```bash
npx jest --silent=false
```

### 使用 Node debugger
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 📚 扩展测试

### 添加新测试用例

1. 在 `fixtures/testData.js` 中添加测试数据
2. 在相应的测试文件中添加测试
3. 运行测试确保通过

```javascript
describe('New Feature Tests', () => {
  test('should do something', () => {
    // Arrange
    const input = setupTestData();

    // Act
    const result = functionUnderTest(input);

    // Assert
    expect(result).toBe(expected);
  });
});
```

### 最佳实践

1. **AAA 模式**: Arrange (准备), Act (执行), Assert (断言)
2. **独立性**: 每个测试应该独立运行
3. **清晰命名**: 测试名称应清楚描述测试内容
4. **单一职责**: 每个测试只测试一个功能点
5. **有意义的断言**: 使用清晰的期望值

## 🔄 CI/CD 集成

单元测试已集成到 CI/CD 流程中：

```json
{
  "scripts": {
    "test:ci": "npm run test:unit:coverage && playwright test --reporter=github"
  }
}
```

在 GitHub Actions 中会：
1. 运行单元测试
2. 生成覆盖率报告
3. 运行 E2E 测试
4. 上传测试结果

## 📖 相关文档

- [Jest 官方文档](https://jestjs.io/)
- [AlaSQL 文档](https://github.com/alasql/alasql)
- [E2E 测试文档](./README.md)
- [测试指南](./QUICK_START.md)

## 💡 常见问题

### Q: 单元测试和 E2E 测试有什么区别？

A:
- **单元测试**: 测试独立的函数和逻辑，不依赖浏览器，运行快速
- **E2E 测试**: 测试完整的用户流程，在真实浏览器中运行

### Q: 如何只运行单元测试？

A:
```bash
npm run test:unit
```

### Q: 如何查看测试覆盖率？

A:
```bash
npm run test:unit:coverage
open coverage/lcov-report/index.html
```

### Q: 测试失败怎么办？

A:
1. 查看错误信息
2. 使用 `console.log` 调试
3. 使用 `test.only()` 只运行失败的测试
4. 检查测试数据和期望值

### Q: 如何模拟（Mock）依赖？

A: Jest 提供了强大的 Mock 功能：
```javascript
jest.mock('./module');
```

## 🎯 下一步

1. 运行单元测试: `npm run test:unit`
2. 查看覆盖率: `npm run test:unit:coverage`
3. 添加新的测试用例
4. 提高测试覆盖率到 90%+

---

**开始测试**: `cd tests && npm run test:unit` 🚀
