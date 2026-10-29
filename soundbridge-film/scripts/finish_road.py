"""Normalize the completed road film and verify the entire deliverable."""
import json,re,subprocess,sys
from pathlib import Path
out=Path(__file__).resolve().parents[2]/'SoundBridge_Film'
src=out/'qa/road-render.mp4';dst=out/(sys.argv[1] if len(sys.argv)>1 else 'SoundBridge_Road_Safety_150s.mp4')
measure=subprocess.run(['ffmpeg','-hide_banner','-i',str(src),'-af','loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
stats=json.loads(re.findall(r'\{[^{}]*"input_i"[^{}]*\}',measure.stderr)[-1])
flt=f'loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={stats["input_i"]}:measured_TP={stats["input_tp"]}:measured_LRA={stats["input_lra"]}:measured_thresh={stats["input_thresh"]}:offset={stats["target_offset"]}:linear=true'
subprocess.run(['ffmpeg','-y','-v','error','-i',str(src),'-c:v','copy','-af',flt,'-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-movflags','+faststart',str(dst)],check=True)
subprocess.run(['ffmpeg','-v','error','-i',str(dst),'-f','null','-'],check=True)
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(dst)]))
v=next(s for s in probe['streams'] if s['codec_type']=='video');a=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert v['width']==1920 and v['height']==1080 and int(v['nb_frames'])==4500
assert abs(float(probe['format']['duration'])-150)<.1
report={'video':dst.name,'duration':float(probe['format']['duration']),'frames':int(v['nb_frames']),'width':v['width'],'height':v['height'],'fps':v['r_frame_rate'],'audio_rate':a['sample_rate'],'channels':a['channels'],'full_decode':'passed','audio_target_lufs':-16,'audio_target_true_peak_db':-1.5}
(out/(dst.stem+'.validation.json')).write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
