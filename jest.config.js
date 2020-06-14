module.exports = {
  roots: ['<rootDir>/test'],  // 表示测试用例文件所在的目录
  testRegex: 'test/(.+)\\.spec\\.(jsx?|tsx?)$',  // 表示要执行的测试用例文件，按照给定的规则匹配文件名
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],  // 模块使用的文件扩展名，Jest将按从左到右的顺序查找的扩展名
}
