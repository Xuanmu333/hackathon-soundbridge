import {ThreeCanvas} from '@remotion/three';
import {Environment, Watch, cameraPosition} from '../studio3d/WatchWorld';
import {ViewState} from '../studio3d/state';

export const SlateWatch = ({s}:{s:ViewState}) => <ThreeCanvas width={620} height={537} dpr={1.5}
 camera={{position:cameraPosition(s.orbit,s.faceView),fov:36,near:.1,far:100}}
 gl={{alpha:true,antialias:true,preserveDrawingBuffer:true}}>
 <Environment orbit={s.orbit} faceView={s.faceView} violet/>
 <ambientLight intensity={.44}/>
 <directionalLight position={[-4,6,4]} intensity={2.4} color="#faf9ff"/>
 <directionalLight position={[4,3,-3]} intensity={1.4} color="#d2cbff"/>
 <pointLight position={[-3,2,0]} intensity={8} color="#8f84ea"/>
 <Watch s={s} violet/>
</ThreeCanvas>;
