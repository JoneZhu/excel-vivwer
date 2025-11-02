# 单元测试快速指南

## 🚀 快速开始（3步）

### 1. 安装依赖
```bash
cd tests
npm install
```

### 2. 运行单元测试
```bash
npm run test:unit
```

### 3. 查看覆盖率
```bash
npm run test:unit:coverage
open coverage/lcov-report/index.html
```

## 📁 测试文件

```
unit/
├── helpers/
│   └── queryHelper.js              # 可测试的辅助函数
├── fixtures/
│   └── testData.js                 # 测试数据
├── queryHelper.test.js             # 辅助函数测试（50+用例）
├── sqlExecution.test.js            # SQL查询测试（40+用例）
├── dataProcessing.test.js          # 数据处理测试（30+用例）
└── README.md                       # 本文件
```

## 🎯 测试内容

### queryHelper.test.js
- 列名清理和规范化
- 表名消毒处理
- SQL 值转义
- SQL 语句构建
- CSV 转换

### sqlExecution.test.js
- SELECT 查询
- WHERE, ORDER BY, LIMIT
- 聚合函数 (COUNT, SUM, AVG)
- GROUP BY, HAVING
- JOIN, UNION
- 错误处理

### dataProcessing.test.js
- 特殊字符处理
- NULL 值处理
- 空行过滤
- 数据类型转换
- 大数据集处理

## 💻 常用命令

```bash
# 运行所有单元测试
npm run test:unit

# 监听模式（自动重新运行）
npm run test:unit:watch

# 生成覆盖率报告
npm run test:unit:coverage

# 运行特定测试文件
npx jest unit/queryHelper.test.js

# 运行特定测试用例
npx jest -t "should clean column names"
```

## 📊 测试示例

### 测试函数输出
```javascript
test('should clean column names with spaces', () => {
  expect(cleanColumnName('First Name', 0)).toBe('First_Name');
});
```

### 测试 SQL 查询
```javascript
test('should execute simple SELECT query', () => {
  const results = alasql('SELECT * FROM Employees');
  expect(results).toHaveLength(5);
});
```

## 📈 覆盖率目标

- ✅ 语句覆盖率: > 80%
- ✅ 分支覆盖率: > 75%
- ✅ 函数覆盖率: > 90%

## 🔍 调试技巧

### 只运行一个测试
```javascript
test.only('should test this one', () => {
  // 只运行这个测试
});
```

### 跳过测试
```javascript
test.skip('should skip this', () => {
  // 跳过这个测试
});
```

### 查看详细输出
```bash
npx jest --verbose
```

## 📚 详细文档

查看完整文档：[../UNIT_TESTS.md](../UNIT_TESTS.md)

## 🎨 测试覆盖的功能

✅ 列名和表名清理
✅ SQL 查询构建
✅ SELECT, WHERE, JOIN
✅ 聚合函数和分组
✅ 数据过滤和转换
✅ CSV 导出
✅ NULL 值处理
✅ 错误处理

## 💡 提示

- 单元测试运行速度快（< 5秒）
- 不依赖浏览器环境
- 专注于测试核心逻辑
- 适合 TDD 开发模式

---

**立即开始**: `npm run test:unit` 🚀
