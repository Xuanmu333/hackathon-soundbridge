"""Local film preview with byte ranges so chapter buttons can seek immediately."""
import functools, http.server, re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]/'SoundBridge_Film'
class Handler(http.server.SimpleHTTPRequestHandler):
 def send_head(self):
  self.remaining=None
  value=self.headers.get('Range')
  path=Path(self.translate_path(self.path))
  if not value or not path.is_file():return super().send_head()
  match=re.fullmatch(r'bytes=(\d*)-(\d*)',value)
  if not match:return super().send_head()
  size=path.stat().st_size
  start=int(match[1]) if match[1] else max(0,size-int(match[2] or 0))
  end=min(size-1,int(match[2]) if match[1] and match[2] else size-1)
  if start>end or start>=size:
   self.send_response(416);self.send_header('Content-Range',f'bytes */{size}');self.end_headers();return None
  stream=path.open('rb');stream.seek(start);self.remaining=end-start+1
  self.send_response(206);self.send_header('Content-Type',self.guess_type(str(path)));self.send_header('Content-Range',f'bytes {start}-{end}/{size}');self.send_header('Content-Length',str(self.remaining));self.end_headers();return stream
 def end_headers(self):
  self.send_header('Accept-Ranges','bytes');super().end_headers()
 def copyfile(self,source,outputfile):
  try:
   if self.remaining is None:return super().copyfile(source,outputfile)
   while self.remaining:
    block=source.read(min(65536,self.remaining))
    if not block:break
    outputfile.write(block);self.remaining-=len(block)
  except (BrokenPipeError,ConnectionResetError):pass
if __name__=='__main__':http.server.ThreadingHTTPServer(('127.0.0.1',3013),functools.partial(Handler,directory=str(ROOT))).serve_forever()
