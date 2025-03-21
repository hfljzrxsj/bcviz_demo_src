import { Button, Divider, Link, Paper } from "@mui/material";
import type { FileInfoType } from "../FileUploadSimple";
import style from '../FileUpload/_index.module.scss';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import filesize from 'filesize';

export default function FileInfo (props: {
  readonly fileInfo: FileInfoType;
}) {
  const { fileInfo } = props;

  const { name, size, lastModified, type, downloadUrl } = fileInfo;
  if (!name) {
    return null;
  }
  return (
    <>
      <Divider />
      <Paper elevation={24}
        className={style['Paper'] ?? ''}
      >
        <fieldset>
          {name ? <legend><Link href={downloadUrl} title="preview" target="_blank" underline="hover">{name}</Link></legend> : null}
          {(name && size) ? <p> Content Length: {filesize(size)}</p> : null}
          {lastModified ? <p> Last Modified: {new Date(lastModified).toJSON()}</p> : null}
          {type ? <p> Content Type: {type}</p> : null}
          <Paper
            elevation={0}
            className={style['FileInfo-Button'] ?? ''}
          >
            <Link
              href={downloadUrl}
              target="_blank"
              underline="hover"
            ><Button variant="outlined"><VisibilityIcon />preview</Button></Link>
            <Button variant="outlined" onClick={() => {
              const link = document.createElement('a');
              link.href = downloadUrl ?? '';
              link.download = name;
              link.click();
            }}><DownloadIcon />download</Button>
          </Paper>
        </fieldset>
      </Paper>
    </>
  );
};