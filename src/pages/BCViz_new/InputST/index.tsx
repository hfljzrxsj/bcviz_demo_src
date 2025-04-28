import FormControl from '@mui/material/FormControl';
import { TextField, type TextFieldProps } from "@mui/material";
import FormHelperText from '@mui/material/FormHelperText';
import type { SetState } from 'ahooks/lib/useSetState';
import { useMemoizedFn } from 'ahooks';

import type { UseSetInputST } from '../TabPanelInput/TabPanelInput';
import { allEqual } from '../hooks/useGestureFullScreen.mjs';
const { isSafeInteger } = Number;
export interface InputSTSetState {
  readonly s: string;
  readonly t: string;
}
type keyofInputSTSetState = keyof InputSTSetState;
type setInputSTParameter = Parameters<SetState<InputSTSetState>>[0];
export default function InputST ({
  useSetInputST: [inputST, setInputST],
  k,
  label = ''
}: {
  readonly useSetInputST: UseSetInputST;
  readonly k: keyofInputSTSetState;
  readonly label: TextFieldProps['placeholder'];
}) {
  const setInputSTCompose = useMemoizedFn((v: string) => setInputST({
    [k]: v
  } as setInputSTParameter));
  return <FormControl fullWidth>
    {/* <InputLabel>{`Please enter ${k}`}</InputLabel> */}
    <TextField
      fullWidth
      placeholder={label}
      label={label}
      //Minimum vertex count in U
      type="number"
      title={k}
      value={inputST[k]}
      required
      onChange={(e) => {
        const { value } = e.target;
        // debugger;
        if (!value) {
          setInputSTCompose(value);
          return;
        }
        const numParseInt = parseInt(value);
        const numNumber = Number(value);
        const numPlus = +value;
        if (allEqual(numParseInt, numNumber, numPlus) && isSafeInteger(numParseInt) && numParseInt >= 0) {
          setInputSTCompose(numParseInt.toString());
        }
      }}
      inputProps={{
        min: 0,
        inputMode: 'numeric',
        pattern: '^(0|[1-9]\d*)$'
      }}
      // defaultChecked
      // suppressContentEditableWarning
      // suppressHydrationWarning
      // autoFocus
      // contentEditable
      // draggable
      // hidden
      spellCheck
      // itemScope

      /*
      用途：控制移动端键盘的自动大写行为​（如输入框的首字母是否自动大写）。
      "off"/"none"：禁用自动大写。
      "on"：启用自动大写（具体行为由浏览器决定）。
      "sentences"：每个句子的首字母大写。
      "words"：每个单词的首字母大写。
      "characters"：所有字母大写。
      */
      autoCapitalize='on'
      /*
          用途：控制移动端键盘的 ​Enter 键显示文本，优化用户输入体验。
      可选值：
          "enter"：默认显示“换行”或 ↵。
          "done"：显示“完成”。
          "go"：显示“前往”。
          "next"：显示“下一步”。
          "search"：显示“搜索”。
          "send"：显示“发送”。
      */
      enterKeyHint='next'
      translate='yes' //控制元素内容是否应被浏览器自动翻译。
      /*
            用途：控制元素内容是否允许被用户选中。
      可选值：
      
          "on"：禁止选中内容。
          "off"：允许选中内容。
      */
      unselectable='on'
      /*
      用途：控制虚拟键盘类型，优化不同输入场景的体验。
      可选值：
          "none"：无虚拟键盘（需手动触发）。
          "text"：默认文本键盘。
          "tel"：电话号码键盘（含数字和符号）。
          "url"：URL 键盘（含 / 和 .com）。
          "email"：邮箱键盘（含 @ 和 .com）。
          "numeric"：纯数字键盘。
          "decimal"：带小数点的数字键盘。
          "search"：搜索优化键盘（含“搜索”按钮）。
          */
      inputMode='numeric'
    />
    <FormHelperText></FormHelperText>
  </FormControl>;
}

/*
属性	核心作用	典型场景	注意事项
autoCapitalize	控制键盘自动大写	姓名、句子输入	移动端专用，部分值兼容性差
contentEditable	使元素可编辑	富文本编辑器	避免与 React 状态冲突
enterKeyHint	优化 Enter 键显示文本	表单提交、搜索框	移动端专用
translate	禁止内容翻译	品牌名、代码片段	依赖浏览器翻译功能
unselectable	禁止文本选中	UI 控件提示文字	非标准属性，推荐用 CSS 替代
inputMode	指定虚拟键盘类型	电话、邮箱、数字输入	移动端体验优化关键属性

*/

