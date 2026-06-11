import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, MapPin, Tag, User, Shield, AlertTriangle, 
  Play, Square, Camera, Maximize2, ShieldAlert, CheckCircle2, 
  Users, Activity, Wifi, RefreshCw, Layers
} from 'lucide-react';

interface WorkTicket {
  id: string;
  plantId: string;
  plantName: string;
  type: string;
  workContent: string;
  riskLevel: string;
  riskColor: string;
  signer: string;
  permitter: string;
  status: string;
  time: string;
}

interface WorkSupervisionDetailProps {
  ticket: WorkTicket;
  onBack: () => void;
}

export const WorkSupervisionDetail: React.FC<WorkSupervisionDetailProps> = ({ ticket, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [aiAnalysisActive, setAiAnalysisActive] = useState(true);
  const [activeCam, setActiveCam] = useState<'dome' | 'fixed' | 'wide'>('dome');
  const [toast, setToast] = useState<string | null>(null);
  
  // Simulated dynamic bounding box positions
  const [person1Pos, setPerson1Pos] = useState({ x: 32, y: 38 });
  const [person2Pos, setPerson2Pos] = useState({ x: 55, y: 44 });
  
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPerson1Pos(prev => ({
        x: Math.min(45, Math.max(25, prev.x + (Math.random() - 0.5) * 1.5)),
        y: Math.min(50, Math.max(30, prev.y + (Math.random() - 0.5) * 1.2))
      }));
      setPerson2Pos(prev => ({
        x: Math.min(70, Math.max(50, prev.x + (Math.random() - 0.5) * 1.8)),
        y: Math.min(60, Math.max(35, prev.y + (Math.random() - 0.5) * 1.4))
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Generate dynamic data based on work types
  const riskPromptList = [
    { id: 'R1', name: '受限空间坠落与机械挤压风险', rate: '极高风险', status: '正常受控' },
    { id: 'R2', name: '氢气极易燃易爆气体漏逸遇弧光瞬时爆燃风险', rate: '重大风险', status: 'AI严防中' },
    { id: 'R3', name: '高处作业安全绳挂靠不到位或失稳风险', rate: '中度风险', status: 'AI检测中' },
    { id: 'R4', name: '作业面交叉施工机械伤害与物件飞溅风险', rate: '低度风险', status: '正常受控' }
  ];

  const safetyMeasures = [
    { id: 'S1', text: '工作地段两端隔离阀已紧锁关闭，挂牌并上实体锁', verified: true },
    { id: 'S2', text: '作业现场防爆型气体探头标定完成，数值持续保持在0.00%VOL', verified: true },
    { id: 'S3', text: '工作现场手持式灭火器具已配备到位及应急拉锁锁定', verified: true },
    { id: 'S4', text: '作业人员特种防砸底绝缘防护鞋已100%全套穿戴规范', verified: true },
    { id: 'S5', text: '登高悬空绳吊挂重心及双环钩带锁定扣检查核验已闭环并监控', verified: true }
  ];

  const personnelList = [
    { name: ticket.signer, role: '作业负责人', status: '绿安全帽 / 定位穿戴OK', heartRate: '78次/分', active: true },
    { name: ticket.permitter, role: '工作许可人', status: '中控主操 / 远程线上同频', heartRate: null, active: true },
    { name: '李安全', role: '现场专职监护人', status: '红安全帽 / 首纠记录OK', heartRate: '82次/分', active: true },
    { name: '张工 (外协)', role: '特种持证焊工', status: '绿安全帽 / 进场三级教育', heartRate: '89次/分', active: true }
  ];

  return (
    <div className="flex flex-col space-y-4 flex-1 relative z-10" id="work-supervision-detail-root">
      
      {/* Toast Warning banner */}
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-800 text-teal-400 px-4 py-2.5 rounded-xl shadow-lg z-50 text-[11px] font-black tracking-wide flex items-center space-x-2 animate-fade-in">
          <Activity className="w-4 h-4 text-teal-500 animate-pulse" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header section with back button */}
      <div className="flex items-center justify-between border-b border-indigo-150 pb-3" id="supervision-header">
        <button 
          onClick={onBack}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-indigo-700 rounded-lg text-xs font-black transition-all cursor-pointer border border-indigo-100 shadow-3xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>返回作业云图</span>
        </button>
        
        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1 px-2.5 py-0.5 bg-blue-50 text-blue-800 rounded-md text-[9.5px] font-black tracking-wide border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>作业现场AI视频监督督办中</span>
          </span>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded-md text-[9px] font-black">
            机组编号: #{ticket.id.slice(0, 5)}
          </span>
        </div>
      </div>

      {/* Custom Bento stats grid matching screenshot header visual columns */}
      <div className="grid grid-cols-2 lg:grid-cols-8 gap-2.5" id="supervision-metrics-bar">
        {/* Left Side: 全网风险对标累计 */}
        {[
          { label: '重大风险', value: '2', sub: '全网高危作业', color: 'bg-rose-50 border-rose-200 text-rose-650' },
          { label: '较大风险', value: '2', sub: '全网偏重监督', color: 'bg-amber-50 border-amber-200 text-amber-655' },
          { label: '一般风险', value: '18', sub: '全网日常检查', color: 'bg-blue-50 border-blue-200 text-blue-650' },
          { label: '低风险', value: '32', sub: '全网备案管理', color: 'bg-emerald-50 border-emerald-200 text-emerald-650' }
        ].map((item, index) => (
          <div key={index} className={`rounded-xl border p-2 text-center flex flex-col justify-center transition-all hover:scale-102 ${item.color} shadow-3xs`}>
            <div className="text-[17px] font-black font-mono leading-none">{item.value}</div>
            <div className="text-[10px] font-black mt-1 leading-none">{item.label}</div>
            <div className="text-[7px] text-slate-400 font-bold mt-1 scale-95 leading-none">{item.sub}</div>
          </div>
        ))}

        {/* Right Side: 本厂风险对标累计 */}
        {[
          { label: '重大风险', value: '2', sub: '本电厂高危额', color: 'bg-rose-50/50 border-rose-150 text-rose-600/90' },
          { label: '较大风险', value: '2', sub: '本厂落实督办', color: 'bg-amber-50/50 border-amber-150 text-amber-600/90' },
          { label: '一般风险', value: '18', sub: '本厂备案分析', color: 'bg-blue-50/50 border-blue-150 text-blue-600/90' },
          { label: '低风险', value: '32', sub: '本厂全闭环率', color: 'bg-emerald-50/50 border-emerald-150 text-emerald-600/90' }
        ].map((item, index) => (
          <div key={index + 4} className={`rounded-xl border p-2 text-center flex flex-col justify-center transition-all hover:scale-102 ${item.color} shadow-3xs`}>
            <div className="text-[17px] font-black font-mono leading-none">{item.value}</div>
            <div className="text-[10px] font-black mt-1 leading-none">{item.label}</div>
            <div className="text-[7px] text-slate-400 font-bold mt-1 scale-95 leading-none">{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Info strip indicating work site, type, leader, permitter, guardian, risk level */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-[10.5px] font-black text-slate-700" id="supervision-info-strip">
        <div className="flex items-center space-x-1 text-slate-900">
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="text-slate-500 font-bold">现场定位:</span>
          <span>1号机组 / 0米层 / A排焊接区 ({ticket.plantName})</span>
        </div>

        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
          <div className="flex items-center space-x-1">
            <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500 font-bold">作业类型:</span>
            <span className="text-slate-800">{ticket.type}</span>
          </div>

          <div className="w-px h-3 bg-slate-300 hidden md:block" />

          <div className="flex items-center space-x-1">
            <User className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="text-slate-500 font-bold">负责人:</span>
            <span className="text-indigo-800">{ticket.signer}</span>
          </div>

          <div className="w-px h-3 bg-slate-300 hidden md:block" />

          <div className="flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="text-slate-500 font-bold">监护人:</span>
            <span className="text-emerald-800">李安全</span>
          </div>

          <div className="w-px h-3 bg-slate-300 hidden md:block" />

          <div className="flex items-center space-x-1">
            <span className="text-slate-500 font-bold">风险等级:</span>
            <span className={`px-2 py-0.2 rounded font-extrabold text-[9.5px] ${ticket.riskLevel === '重大风险' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
              {ticket.riskLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Major Simulated video visualizer with interactive controls */}
      <div className="border border-slate-950 rounded-2xl bg-slate-950 text-white p-1 relative overflow-hidden" id="supervision-video-panel">
        
        {/* Aspect Ratio bounding grid container */}
        <div className="relative w-full aspect-[21/9] md:aspect-[2.4/1] bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
          
          {/* Mock live dynamic SVG/CSS graphic representation for surveillance camera feeds */}
          {isPlaying ? (
            <div className="absolute inset-0 w-full h-full select-none" id="simulated-surveillance-feed">
              
              {/* Complex high-tech background pattern with grid wires */}
              <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
              
              {/* Dynamic decorative line overlays */}
              <div className="absolute top-1/2 left-0 w-full h-px bg-blue-500/10 pointer-events-none" />
              <div className="absolute top-0 left-1/2 w-px h-full bg-blue-500/10 pointer-events-none" />
              
              {/* Live moving high-tech target elements representing workers inside the steam boiler deck */}
              <div className="absolute inset-0 pointer-events-none">
                
                {/* Simulated Generator or Piping unit silhouette */}
                <svg className="absolute inset-0 w-full h-full opacity-20 text-indigo-400" viewBox="0 0 800 350" fill="none">
                  <rect x="50" y="100" width="300" height="180" rx="10" stroke="currentColor" strokeWidth="2" />
                  <circle cx="200" cy="190" r="40" stroke="currentColor" strokeWidth="2" />
                  <path d="M120,40 L120,100 M 280,40 L280,100 M200,280 L200,320" stroke="currentColor" strokeWidth="3" />
                  <rect x="500" y="80" width="220" height="200" rx="15" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
                  <line x1="120" y1="40" x2="280" y2="40" stroke="currentColor" strokeWidth="3" />
                </svg>

                {/* Safety Boundary polygon line to prevent accident */}
                <div className="absolute inset-x-[15%] bottom-[12%] h-[40%] border-2 border-dashed border-cyan-500/20 bg-cyan-500/5 rounded-t-3xl flex items-center justify-center">
                  <span className="text-cyan-500/40 text-[8px] tracking-widest font-black uppercase">AI SECURE BOUNDARY AREA 05</span>
                </div>

                {person1Pos && aiAnalysisActive && (
                  <motion.div 
                    className="absolute border border-green-500 bg-green-500/10 rounded p-1 text-[8px]"
                    style={{ left: `${person1Pos.x}%`, top: `${person1Pos.y}%`, width: '130px' }}
                    layout
                  >
                    <div className="flex items-center justify-between text-green-300 font-black">
                      <span>人员: {ticket.signer}</span>
                      <span className="bg-green-600 text-white px-1 rounded-sm scale-90">安全帽: Y</span>
                    </div>
                    <div className="text-[7.5px] text-green-400 mt-0.5 leading-none">作业反光衣: ☑ 符合规范</div>
                    <div className="bg-green-500 h-1.5 w-1.5 rounded-full animate-ping absolute -top-1 -left-1" />
                  </motion.div>
                )}

                {person2Pos && aiAnalysisActive && (
                  <motion.div 
                    className="absolute border border-emerald-500 bg-emerald-500/10 rounded p-1 text-[8px]"
                    style={{ left: `${person2Pos.x}%`, top: `${person2Pos.y}%`, width: '130px' }}
                    layout
                  >
                    <div className="flex items-center justify-between text-teal-300 font-black">
                      <span>专监人员: 李安全</span>
                      <span className="bg-teal-600 text-white px-1 rounded-sm scale-90">防坠钩: OK</span>
                    </div>
                    <div className="text-[7.5px] text-teal-400 mt-0.5 leading-none">现场就位: ☑ 专职监护中</div>
                    <div className="bg-teal-500 h-1.5 w-1.5 rounded-full animate-ping absolute -top-1 -left-1" />
                  </motion.div>
                )}

                {/* Target warning item: welding spark simulated zone */}
                <div className="absolute left-[38%] top-[55%] pointer-events-none flex flex-col items-center">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" />
                  <span className="text-[7.5px] text-yellow-300 font-extrabold mt-1 tracking-wider bg-black/60 px-1.5 py-0.2 rounded border border-yellow-500/40">氩弧焊接燃弧点 AI跟踪中</span>
                </div>

              </div>

            </div>
          ) : (
            <div className="text-slate-500 flex flex-col items-center space-y-2">
              <span className="w-3.5 h-3.5 border-4 border-slate-600 border-t-indigo-650 rounded-full animate-spin" />
              <span className="text-xs font-bold text-slate-400">视频播放已暂停 (监视流已挂起)</span>
            </div>
          )}

          {/* Glowing Head-Up Display (HUD) overlays to mimic high-end screen */}
          <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-xs border border-slate-800 p-2 rounded-lg pointer-events-none font-mono text-[8.5px] space-y-1 z-30">
            <div className="flex items-center space-x-1 text-teal-400">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="font-extrabold text-white">LIVE_CAMERA_FEED_FEED_#02_NORTH</span>
            </div>
            <div className="text-slate-400 font-bold truncate">电厂: {ticket.plantName} / {ticket.id}</div>
            <div className="text-indigo-400 font-bold">解析引擎: AI Edge Computer Vision v8.7</div>
          </div>

          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-xs border border-slate-800 px-2.5 py-1 rounded-md text-[8.5px] font-bold text-teal-400 flex items-center space-x-1.5 pointer-events-none z-30">
            <Wifi className="w-3 h-3 animate-pulse text-emerald-500" />
            <span>5G 连线网络延迟: 12ms</span>
          </div>

          {/* Overlay Warning sign when everything is green */}
          <div className="absolute bottom-3 left-3 bg-emerald-950/85 border border-emerald-800 text-emerald-400 px-2 py-1 rounded-md text-[8px] font-black tracking-widest flex items-center space-x-1 pointer-events-none z-35">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>AI智能识别：全套PPE齐备 · 现场无超限警戒</span>
          </div>

        </div>

        {/* Video Camera Player bar controls */}
        <div className="bg-slate-900 px-4 py-2 flex items-center justify-between text-[10.5px] text-slate-400 font-black" id="supervision-player-tools">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                setIsPlaying(!isPlaying);
                triggerToast(isPlaying ? "视频视频流已暂停监控" : "实时三维AI纠偏网络已重连");
              }}
              className="hover:text-white transition-colors flex items-center space-x-1 cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Square className="w-3.5 h-3.5 text-rose-500" />
                  <span>暂停监控</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-teal-500" />
                  <span>启动监控</span>
                </>
              )}
            </button>

            <button 
              onClick={() => {
                setAiAnalysisActive(!aiAnalysisActive);
                triggerToast(aiAnalysisActive ? "AI计算机视觉识别定位已关闭" : "AI视觉标识系统已全量重新捕捞");
              }}
              className={`hover:text-white transition-colors flex items-center space-x-1 cursor-pointer ${aiAnalysisActive ? 'text-teal-400' : 'text-slate-550'}`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{aiAnalysisActive ? '关闭AI识别' : '开启AI识别'}</span>
            </button>
          </div>

          {/* Multi-angle switches */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 text-[9.5px]">摄像头视角切换:</span>
            {[
              { id: 'dome', name: '全景球机' },
              { id: 'fixed', name: '2号固定枪机' },
              { id: 'wide', name: '厂房全景' }
            ].map((cam) => (
              <button
                key={cam.id}
                onClick={() => {
                  setActiveCam(cam.id as any);
                  triggerToast(`视频流已成功切换至：${cam.name}`);
                }}
                className={`px-2 py-0.5 rounded text-[9px] font-black transition-all cursor-pointer ${
                  activeCam === cam.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-800 text-slate-405 hover:bg-slate-700'
                }`}
              >
                {cam.name}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => triggerToast("工作面作业画面抓拍已缓存并同步至省级安监中心")}
              className="hover:text-white transition-colors cursor-pointer flex items-center space-x-1"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">远程抓拍</span>
            </button>
            <button 
              onClick={() => triggerToast("现场高清视频已置入全屏监管模式。若需高维处理，请打开控制台。")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Row with three columns: 风险提示列表, 安全措施列表, 人员列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" id="supervision-details-row-columns">
        
        {/* Left Column: 风险提示列表 (Risk Warnings) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between" id="risk-warnings-sub-panel">
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-black text-slate-900 flex items-center">
                <ShieldAlert className="w-4 h-4 text-rose-600 mr-1.5" />
                现场作业风险提示 ({riskPromptList.length})
              </span>
              <span className="text-[8px] bg-rose-100 text-rose-700 font-black px-1.5 py-0.2 rounded">
                管控中
              </span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {riskPromptList.map((risk) => (
                <div key={risk.id} className="bg-white border border-slate-150 rounded-xl p-2.5 hover:shadow-3xs transition-shadow">
                  <div className="flex items-center justify-between text-[10px] font-black text-slate-800">
                    <span className="truncate flex-1 pr-1">{risk.name}</span>
                    <span className="text-[8.5px] text-rose-600 font-bold bg-rose-50 px-1 border border-rose-100/65 rounded shrink-0">
                      {risk.rate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100/50 text-[9px] text-slate-400 font-bold">
                    <span>风险ID: {risk.id}</span>
                    <span className="text-teal-600 flex items-center space-x-1 font-black">
                      <span className="w-1 h-1 rounded-full bg-teal-500 animate-pulse inline-block" />
                      <span>{risk.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: 安全措施列表 (Safety Measures) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between" id="safety-measures-sub-panel">
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-black text-slate-900 flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
                安全落实防范措施 ({safetyMeasures.length})
              </span>
              <span className="text-[8.5px] bg-emerald-100 text-emerald-850 font-black px-1.5 py-0.2 rounded border border-emerald-200">
                100% 已核验
              </span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {safetyMeasures.map((measure) => (
                <div key={measure.id} className="bg-white border border-slate-205 py-2 px-2.5 rounded-xl flex items-start space-x-2.5">
                  <span className="w-4 h-4 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-700 text-[10px] font-black shrink-0 mt-0.5">
                    ✔
                  </span>
                  <div className="flex-1 text-[9.5px] font-bold text-slate-700 leading-snug">
                    <p className="font-extrabold text-slate-805">{measure.text}</p>
                    <span className="text-[8.5px] text-slate-400 font-semibold block mt-0.5 font-mono">
                      [5G AI球机现场视频智能比对通过]
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 人员列表 (Personnel list) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between" id="active-personnel-sub-panel">
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-black text-slate-900 flex items-center">
                <Users className="w-4 h-4 text-indigo-600 mr-1.5" />
                在场执守核心人员 ({personnelList.length})
              </span>
              <span className="text-[8px] bg-indigo-55 text-indigo-700 font-bold px-1.5 py-0.2 rounded">
                全员在线
              </span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {personnelList.map((person, personIndex) => (
                <div key={personIndex} className="bg-white border border-slate-150 rounded-xl p-2.5 flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2.5">
                    {/* Simulated elegant avatar */}
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black border border-slate-200 text-xs text-indigo-600 relative">
                      {person.name[0]}
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-black text-slate-805">{person.name}</span>
                        <span className="text-[8px] tracking-wider px-1 py-0.2 bg-indigo-50 border border-indigo-100 text-indigo-750 font-extrabold rounded-sm">
                          {person.role}
                        </span>
                      </div>
                      <span className="text-[8.5px] text-slate-450 font-semibold block mt-0.5">{person.status}</span>
                    </div>
                  </div>

                  {person.heartRate && (
                    <div className="text-right shrink-0">
                      <span className="text-[9.5px] font-bold text-slate-700 truncate block font-mono">
                        ♥ {person.heartRate}
                      </span>
                      <span className="text-[7.5px] text-slate-400 font-bold block scale-90 -mr-1 font-mono">智能手环定位中</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
