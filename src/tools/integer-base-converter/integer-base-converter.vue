<script setup lang="ts">
import { ref, computed } from 'vue';
import InputCopyable from '../../components/InputCopyable.vue';
import { convertBase, convertToBytes, convertToBytes2 } from './integer-base-converter.model';
import { getErrorMessageIfThrows } from '@/utils/error';

const inputProps = {
  labelPosition: 'left',
  labelWidth: '170px',
  labelAlign: 'right',
  readonly: true,
  'mb-2': '',
} as const;

const input = ref('42');
const inputBase = ref(10);
const outputBase = ref(42);

function errorlessConvert(...args: Parameters<typeof convertBase>) {
  try {
    return convertBase(...args);
  } catch (err) {
    return '';
  }
}

function errorlessConvertToBytes(...args: Parameters<typeof convertToBytes>) {
  try {
    return convertToBytes(...args);
  } catch (err) {
    return '';
  }
}

function errorlessConvertToBytes2(...args: Parameters<typeof convertToBytes>) {
  try {
    return convertToBytes2(...args);
  } catch (err) {
    return '';
  }
}

const error = computed(() =>
  getErrorMessageIfThrows(() =>
    convertBase({ value: input.value, fromBase: inputBase.value, toBase: outputBase.value }),
  ),
);
</script>

<template>
  <div>
    <c-card>
      <c-input-text
        v-model:value="input"
        label="Input number"
        placeholder="Put your number here (ex: 42)"
        label-position="left"
        label-width="110px"
        mb-2
        label-align="right"
      />

      <n-form-item label="Input base" label-placement="left" label-width="110" :show-feedback="false">
        <n-input-number
          v-model:value="inputBase"
          max="64"
          min="2"
          placeholder="Put your input base here (ex: 10)"
          w-full
        />
      </n-form-item>

      <n-alert v-if="error" style="margin-top: 25px" type="error">
        {{ error }}
      </n-alert>
      <n-divider />

      <InputCopyable
        label="Binary (2)"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 2 })"
        placeholder="Binary version will be here..."
      />

      <InputCopyable
        label="Octal (8)"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 8 })"
        placeholder="Octal version will be here..."
      />

      <InputCopyable
        label="Decimal (10)"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 10 })"
        placeholder="Decimal version will be here..."
      />

      <InputCopyable
        label="Hexadecimal (16)"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 16 })"
        placeholder="Hexadecimal version will be here..."
      />

      <InputCopyable
        label="Base64 (64)"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 64 })"
        placeholder="Base64 version will be here..."
      />

      <div flex items-baseline>
        <n-input-group style="width: 160px; margin-right: 10px">
          <n-input-group-label> Custom: </n-input-group-label>
          <n-input-number v-model:value="outputBase" max="64" min="2" />
        </n-input-group>

        <InputCopyable
          flex-1
          v-bind="inputProps"
          :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: outputBase })"
          :placeholder="`Base ${outputBase} will be here...`"
        />
      </div>

      <n-divider />
      <n-h2 style="margin-top: 20px">Bytes Representation (2's Complement)</n-h2>
      <!-- 1 Byte -->
      <InputCopyable
        label="Byte (8bit, 16)"
        v-bind="inputProps"
        :value="errorlessConvertToBytes({ value: input, fromBase: inputBase, byteSize: 1 })"
        placeholder="Byte version will be here..."
      />
      <InputCopyable
        label="Byte (8bit, 2)"
        v-bind="inputProps"
        :value="errorlessConvertToBytes2({ value: input, fromBase: inputBase, byteSize: 1 })"
        placeholder="Byte version will be here..."
      />

      <!-- 2 Byte -->
      <InputCopyable
        label="Word (16)"
        v-bind="inputProps"
        :value="errorlessConvertToBytes({ value: input, fromBase: inputBase, byteSize: 2 })"
        placeholder="Word version will be here..."
      />
      <InputCopyable
        label="Word (2)"
        v-bind="inputProps"
        :value="errorlessConvertToBytes2({ value: input, fromBase: inputBase, byteSize: 2 })"
        placeholder="Word version will be here..."
      />
      <!-- 4 Byte -->
      <InputCopyable
        label="DWord (32bit, 16)"
        v-bind="inputProps"
        :value="errorlessConvertToBytes({ value: input, fromBase: inputBase, byteSize: 4 })"
        placeholder="DWord version will be here..."
      />
      <InputCopyable
        label="DWord (32bit, 2)"
        v-bind="inputProps"
        :value="errorlessConvertToBytes2({ value: input, fromBase: inputBase, byteSize: 4 })"
        placeholder="DWord version will be here..."
      />
      <!-- 8 Byte -->
      <InputCopyable
        label="QWord (64bit, 16)"
        v-bind="inputProps"
        :value="errorlessConvertToBytes({ value: input, fromBase: inputBase, byteSize: 8 })"
        placeholder="QWord version will be here..."
      />
      <InputCopyable
        label="QWord (64bit, 16)"
        v-bind="inputProps"
        :value="errorlessConvertToBytes2({ value: input, fromBase: inputBase, byteSize: 8 })"
        placeholder="QWord version will be here..."
      />
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.n-input-group:not(:first-child) {
  margin-top: 5px;
}
</style>
