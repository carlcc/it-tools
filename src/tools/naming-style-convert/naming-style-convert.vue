<script setup lang="ts">
import { ref, computed } from 'vue';
import { convertNamingStyle, isValidIdentifier, type NamingStyle } from './naming-style-convert.services';
import { withDefaultOnError } from '../../utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const inputText = ref('');
const targetStyle = ref<NamingStyle>('camelCase');
const prefix = ref('');
const suffix = ref('');
const removePrefixCount = ref(0);
const removeSuffixCount = ref(0);

// 所有可用的命名风格
const namingStyles: { value: NamingStyle; label: string }[] = [
  { value: 'camelCase', label: 'camelCase' },
  { value: 'PascalCase', label: 'PascalCase' },
  { value: 'snake_case', label: 'snake_case' },
  { value: 'kebab-case', label: 'kebab-case' },
  { value: 'CONSTANT_CASE', label: 'CONSTANT_CASE' },
  { value: 'Capital Case', label: 'Capital Case' },
  { value: 'Header-Case', label: 'Header-Case' },
];

// 多行转换函数
const transformLines = (text: string) => {
  if (text.trim() === '') {
    return [];
  }

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');

  return lines.map((line) => ({
    original: line,
    converted: withDefaultOnError(() => convertNamingStyle(line, targetStyle.value), '转换失败'),
  }));
};

// 验证规则（支持多行逐行验证）
const rules: UseValidationRule<string>[] = [
  {
    validator: (value: string) => {
      if (!value.trim()) {
        return true;
      }

      const lines = value
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line !== '');

      // 检查每一行是否有效
      return lines.every((line) => isValidIdentifier(line));
    },
    message: '输入包含无效字符，每行只允许字母、数字、下划线、连字符和空格',
  },
];

// 实时转换结果（多行）
const outputLines = computed(() => transformLines(inputText.value));

// 生成所有命名风格的预览（多行）
const allStylesPreview = computed(() => {
  if (!inputText.value.trim()) {
    return [];
  }

  const lines = inputText.value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');

  return namingStyles.map((style) => ({
    style: style.value,
    label: style.label,
    results: lines.map((line) => ({
      original: line,
      converted: withDefaultOnError(() => convertNamingStyle(line, style.value), '转换失败'),
    })),
  }));
});

// 应用前缀后缀处理的函数
const applyPrefixSuffix = (text: string) => {
  let result = text;

  // 删除前缀字符
  if (removePrefixCount.value > 0 && result.length > removePrefixCount.value) {
    result = result.substring(removePrefixCount.value);
  }

  // 删除后缀字符
  if (removeSuffixCount.value > 0 && result.length > removeSuffixCount.value) {
    result = result.substring(0, result.length - removeSuffixCount.value);
  }

  // 添加前缀
  if (prefix.value) {
    result = prefix.value + result;
  }

  // 添加后缀
  if (suffix.value) {
    result = result + suffix.value;
  }

  return result;
};

// 输出文本（便于复制）
const outputText = computed(() => {
  return outputLines.value.map((item) => applyPrefixSuffix(item.converted)).join('\n');
});
</script>

<template>
  <div class="naming-style-converter">
    <div class="options-section">
      <div class="style-selector">
        <label for="target-style">目标命名风格：</label>
        <select id="target-style" v-model="targetStyle">
          <option v-for="style in namingStyles" :key="style.value" :value="style.value">
            {{ style.label }}
          </option>
        </select>
      </div>

      <div class="prefix-suffix-options">
        <div class="option-group">
          <label for="remove-prefix">删除前缀字符数：</label>
          <input
            id="remove-prefix"
            v-model.number="removePrefixCount"
            type="number"
            min="0"
            placeholder="0"
            class="option-input number-input"
          />
        </div>

        <div class="option-group">
          <label for="remove-suffix">删除后缀字符数：</label>
          <input
            id="remove-suffix"
            v-model.number="removeSuffixCount"
            type="number"
            min="0"
            placeholder="0"
            class="option-input number-input"
          />
        </div>
        <div class="option-group">
          <label for="prefix">添加前缀：</label>
          <input id="prefix" v-model="prefix" type="text" placeholder="例如：prefix_" class="option-input" />
        </div>

        <div class="option-group">
          <label for="suffix">添加后缀：</label>
          <input id="suffix" v-model="suffix" type="text" placeholder="例如：_suffix" class="option-input" />
        </div>
      </div>
    </div>
    <div class="main-section">
      <div class="input-section">
        <c-input-text
          v-model:value="inputText"
          placeholder="输入变量名、函数名或标识符..."
          label="输入文本"
          rows="8"
          autosize
          raw-text
          multiline
          :validation-rules="rules"
          monospace
        />
      </div>

      <div class="output-section">
        <c-input-text
          :value="outputText"
          placeholder="转换结果将显示在这里..."
          label="输出文本"
          rows="8"
          autosize
          raw-text
          multiline
          readonly
          monospace
        />
      </div>
    </div>

    <div class="preview-section" v-if="inputText.trim()">
      <h3>所有命名风格预览</h3>
      <div class="preview-grid">
        <div v-for="preview in allStylesPreview" :key="preview.style" class="preview-item">
          <div class="style-label">{{ preview.label }}</div>
          <div class="preview-results">
            <div v-for="(result, index) in preview.results" :key="index" class="preview-line">
              <span class="line-number">#{{ index + 1 }}</span>
              <span class="preview-result">{{ applyPrefixSuffix(result.converted) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.naming-style-converter {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-section {
  display: flex;
  gap: 20px;
  align-items: flex-start;

  .input-section,
  .output-section {
    flex: 1;

    .c-input-text {
      height: 100%;

      :deep(textarea) {
        height: 100%;
        min-height: 200px;
      }
    }
  }

  .output-section {
    .c-input-text {
      :deep(textarea) {
        background-color: #f8f9fa;
        border-color: #007bff;

        &:focus {
          background-color: #fff;
          border-color: #0056b3;
        }
      }
    }
  }
}

.options-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;

  .style-selector {
    display: flex;
    align-items: center;
    gap: 10px;

    label {
      font-weight: 600;
      color: #495057;
      min-width: 120px;
    }

    select {
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      background: white;
      font-size: 14px;
      min-width: 150px;

      &:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
      }
    }
  }

  .prefix-suffix-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;

    .option-group {
      display: flex;
      align-items: center;
      gap: 10px;

      label {
        font-weight: 500;
        color: #495057;
        min-width: 140px;
        font-size: 14px;
      }

      .option-input {
        padding: 8px 12px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        background: white;
        font-size: 14px;
        flex: 1;
        min-width: 120px;

        &:focus {
          border-color: #007bff;
          outline: none;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        &.number-input {
          min-width: 80px;
        }

        &::placeholder {
          color: #6c757d;
          opacity: 0.7;
        }
      }
    }
  }
}

.preview-section {
  h3 {
    margin-bottom: 15px;
    color: #333;
    font-size: 18px;
    font-weight: 600;
  }

  .preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
  }

  .preview-item {
    padding: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    background: #fafafa;
    transition: all 0.2s ease;

    &:hover {
      border-color: #007bff;
      box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
    }

    &.active {
      border-color: #007bff;
      background: #f0f8ff;
    }

    .style-label {
      font-weight: bold;
      margin-bottom: 8px;
      color: #555;
      font-size: 14px;
    }

    .preview-results {
      .preview-line {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 13px;

        .line-number {
          background: #e9ecef;
          color: #6c757d;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.75em;
          margin-right: 8px;
          min-width: 25px;
          text-align: center;
          font-weight: 600;
        }

        .preview-result {
          background: white;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #ddd;
          flex: 1;
          word-break: break-all;
          color: #007bff;
          font-weight: 500;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .main-section {
    flex-direction: column;

    .input-section,
    .output-section {
      width: 100%;
    }
  }

  .prefix-suffix-options {
    grid-template-columns: 1fr;
  }

  .preview-grid {
    grid-template-columns: 1fr;
  }
}
</style>
