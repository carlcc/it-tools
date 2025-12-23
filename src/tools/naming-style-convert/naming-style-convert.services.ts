import { camelCase, pascalCase, snakeCase, paramCase, constantCase, capitalCase, headerCase } from 'change-case';
export { convertNamingStyle, isValidIdentifier };

/**
 * 命名风格类型
 */
export type NamingStyle =
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'kebab-case'
  | 'CONSTANT_CASE'
  | 'Capital Case'
  | 'Header-Case';

/**
 * 将字符串转换为不同的命名风格
 */
function convertNamingStyle(text: string, targetStyle: NamingStyle): string {
  if (!text.trim()) {
    return '';
  }

  try {
    switch (targetStyle) {
      case 'camelCase':
        return camelCase(text);
      case 'PascalCase':
        return pascalCase(text);
      case 'snake_case':
        return snakeCase(text);
      case 'kebab-case':
        return paramCase(text);
      case 'CONSTANT_CASE':
        return constantCase(text);
      case 'Capital Case':
        return capitalCase(text);
      case 'Header-Case':
        return headerCase(text);
      default:
        return text;
    }
  } catch (error) {
    return '转换失败：输入格式不正确';
  }
}

/**
 * 检查是否为有效的标识符（包含字母、数字、下划线、连字符等）
 */
function isValidIdentifier(text: string): boolean {
  if (!text.trim()) {
    return true;
  }

  // 允许字母、数字、下划线、连字符、空格（用于分隔）
  return /^[a-zA-Z0-9_\-\s]+$/.test(text);
}
