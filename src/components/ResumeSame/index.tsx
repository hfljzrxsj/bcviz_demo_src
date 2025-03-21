import { Button } from "@mui/material";
import style from './_index.module.scss';

export default function ResumeSame () {
  return <Button variant="contained"
    className={style['ResumeSame'] ?? ''}
    size="large"
    onClick={async () => {
      //@ts-expect-error
      const DirectoryPicker = await window.showDirectoryPicker();
      const descriptor = { mode: "read" };
      while (true) {
        const PermissionState = await DirectoryPicker.queryPermission(descriptor);
        if (PermissionState === "granted") {
          break;
        } else {
          await DirectoryPicker.requestPermission(descriptor);
        }
      }
      const arr = new Set<string>();
      const sameStr = new Set<string>();
      for await (const [key, value] of DirectoryPicker.entries()) {
        if (typeof key !== "string" || !key.endsWith(".md")) {
          continue;
        }
        const h: FileSystemFileHandle = value;
        await h.getFile().then((file) => file.text()).then((text) => {
          const str = text.split("\n");
          for (const s of str) {
            if (/^#+ /.test(s)) {
              if (arr.has(s)) {
                sameStr.add(s);
              } else {
                arr.add(s);
              }
            }
          }
        });
      }
      const res = [...sameStr];
      res.sort();
      console.log(res.join('\n'));
    }}
  >相同面经</Button>;
}