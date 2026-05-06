import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowDown } from 'lucide-react';

const swimlanes = [
  { id: 'contractor', name: '承\n包\n单\n位' },
  { id: 'pm', name: '项\n目\n管\n理\n部\n门\n/\n机\n构' },
  { id: 'issuing', name: '发\n包\n部\n门' },
  { id: 'safety', name: '安\n全\n监\n察\n部' },
];

const stages = ['招投标', '资质审核', '安全教育', '施工管理', '结束'];

const FlowBox = ({ 
  children, 
  color = 'white', 
  shape = 'rect', 
  className = '',
  style = {}
}: { 
  children: React.ReactNode, 
  color?: 'blue' | 'green' | 'white' | 'gray' | 'light-blue' | 'emerald', 
  shape?: 'rect' | 'circle' | 'diamond' | 'pill',
  className?: string,
  style?: React.CSSProperties
}) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-white border-blue-600',
    green: 'bg-emerald-500 text-white border-emerald-600',
    emerald: 'bg-emerald-400 text-white border-emerald-500',
    'light-blue': 'bg-blue-100 text-blue-700 border-blue-200',
    white: 'bg-white text-slate-700 border-slate-200/80 shadow-sm',
    gray: 'bg-slate-50 text-slate-400 border-slate-200',
  };
  
  const shapeClasses = {
    rect: 'rounded-lg',
    pill: 'rounded-full px-4',
    circle: 'rounded-full aspect-square flex items-center justify-center',
    diamond: 'rotate-45 flex items-center justify-center p-2',
  };

  return (
    <div 
      className={`p-2.5 text-[10px] font-bold text-center leading-tight border transition-all hover:shadow-md ${colorClasses[color]} ${shapeClasses[shape]} ${className}`}
      style={style}
    >
      <div className={shape === 'diamond' ? '-rotate-45' : ''}>
        {children}
      </div>
    </div>
  );
};

const ConnectorLine = ({ 
  type = 'h', 
  length = 20, 
  className = '', 
  hasArrow = true 
}: { 
  type?: 'h' | 'v', 
  length?: number | string, 
  className?: string, 
  hasArrow?: boolean 
}) => (
  <div className={`flex items-center ${type === 'v' ? 'flex-col' : ''} ${className}`} style={{ [type === 'h' ? 'width' : 'height']: length }}>
    <div className={`${type === 'h' ? 'h-[1px] w-full' : 'w-[1px] h-full'} bg-blue-400/50`} />
    {hasArrow && (
      type === 'h' ? 
      <ArrowRight className="w-3 h-3 text-blue-400 -ml-1.5 shrink-0" /> : 
      <ArrowDown className="w-3 h-3 text-blue-400 -mt-1.5 shrink-0" />
    )}
  </div>
);

const ContractorFlowView = ({ scale = 1 }: { scale?: number }) => {
  return (
    <div className="w-full h-full bg-[#f8fbff] overflow-hidden p-4 custom-scrollbar relative">
      <motion.div 
        drag
        dragMomentum={false}
        animate={{ scale }}
        className="origin-top-left"
      >
        <div className="min-w-[2200px] flex flex-col relative bg-white rounded-3xl border border-blue-100/50 shadow-sm overflow-hidden">
        {/* Header Stages */}
        <div className="flex ml-14 bg-blue-50/50 border-b border-blue-100">
          {stages.map((stage) => (
            <div key={stage} className="flex-1 text-center py-4 font-black text-indigo-600 text-xs tracking-[0.3em] uppercase">
              {stage}
            </div>
          ))}
        </div>

        {/* Lanes Container */}
        <div className="relative flex flex-col">
          {swimlanes.map((lane, laneIdx) => (
            <div key={lane.id} className="flex min-h-[180px] relative border-b border-blue-50 last:border-b-0">
              {/* Lane Title */}
              <div className="w-14 bg-white flex items-center justify-center border-r border-blue-100 whitespace-pre-wrap text-center font-black text-[10px] text-blue-500/70 leading-relaxed tracking-tighter">
                {lane.name}
              </div>
              
              {/* Columns for this lane */}
              <div className="flex-1 flex">
                {stages.map((stage, stageIdx) => (
                  <div key={`${lane.id}-${stage}`} className={`flex-1 relative ${stageIdx % 2 === 0 ? 'bg-blue-50/10' : 'bg-white'}`}>
                    {/* Content Logic Layered per Lane and Stage */}
                    {laneIdx === 0 && stageIdx === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center space-x-12 px-6">
                        <FlowBox className="w-44 h-28 flex items-center p-3" color="light-blue">提供资质业绩、安全绩效、人员配置及资格、机械器具等材料</FlowBox>
                        <ConnectorLine length={25} />
                        <FlowBox className="w-32 h-20 flex items-center p-2" color="light-blue">签订合同，出具无资质挂靠承诺书</FlowBox>
                      </div>
                    )}
                    
                    {laneIdx === 1 && stageIdx === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FlowBox color="blue" shape="pill" className="w-16 py-8 px-2 flex items-center h-40">发包单位成立项目部</FlowBox>
                      </div>
                    )}

                    {laneIdx === 2 && stageIdx === 0 && (
                      <div className="absolute inset-0 flex items-center justify-start space-x-4 px-4">
                        <FlowBox color="green" className="w-12 h-28 flex items-center [writing-mode:vertical-rl]">招投标</FlowBox>
                        <ConnectorLine length={15} />
                        <FlowBox color="blue" shape="pill" className="w-10 h-32 flex items-center justify-center px-1 py-4 text-[9px] [writing-mode:vertical-rl]">承包单位中标</FlowBox>
                        <ConnectorLine length={15} />
                        <FlowBox className="w-10 h-32 flex items-center justify-center px-1 py-4 text-[9px] [writing-mode:vertical-rl]" color="light-blue">项目经理面试</FlowBox>
                        <ConnectorLine length={15} />
                        <FlowBox className="w-32 h-32 flex items-center p-3" color="light-blue">组织签订承包合同及安全管理协议</FlowBox>
                      </div>
                    )}

                    {laneIdx === 2 && stageIdx === 1 && (
                      <div className="absolute inset-0 flex items-center justify-center px-4">
                        <FlowBox color="light-blue" className="w-full h-32 flex items-center p-3 text-[10px]">审核承办单位及人员资质、身份证、劳动合同、特种作业证、体检、保险、成绩单</FlowBox>
                      </div>
                    )}

                    {/* Stage 2: 安全教育 */}
                    {laneIdx === 0 && stageIdx === 2 && (
                      <div className="absolute inset-0 flex items-center justify-between px-4">
                        <FlowBox color="blue" shape="circle" className="w-16 h-16 text-[9px] translate-x-4">对拟入场人员进行培训</FlowBox>
                        <FlowBox color="light-blue" className="w-20 h-24 flex items-center translate-x-[-10px]">三种人考试申请</FlowBox>
                      </div>
                    )}

                    {laneIdx === 1 && stageIdx === 2 && (
                      <div className="absolute inset-0 flex items-center space-x-2 px-2">
                        <div className="flex bg-white px-1 py-0.5 border border-blue-100 rounded text-[9px] font-bold z-10">合格</div>
                        <FlowBox color="gray" className="w-12 h-32 flex items-center [writing-mode:vertical-rl]">全过程监护</FlowBox>
                        <FlowBox color="light-blue" className="w-14 h-32 flex items-center p-1 text-[9px]">部门级、班组级安全教育培训档案</FlowBox>
                        <FlowBox color="light-blue" className="w-10 h-32 flex items-center [writing-mode:vertical-rl]">办理入场门禁</FlowBox>
                        <FlowBox color="light-blue" className="w-14 h-32 flex items-center p-1 text-[9px] flex items-center justify-center">三种人技能考核</FlowBox>
                      </div>
                    )}

                    {laneIdx === 2 && stageIdx === 2 && (
                      <div className="absolute inset-0 flex items-center justify-between px-6">
                        <FlowBox color="light-blue" className="w-16 h-32 flex items-center p-1 text-[9px] flex items-center justify-center">对拟入场施工人员进行安全技术考核</FlowBox>
                        <FlowBox color="gray" className="w-10 h-32 flex items-center [writing-mode:vertical-rl] pr-2">交底性培训</FlowBox>
                      </div>
                    )}

                    {laneIdx === 3 && stageIdx === 2 && (
                      <div className="absolute inset-0 flex items-center space-x-6 px-2">
                        <div className="relative">
                          <FlowBox shape="diamond" className="w-16 h-16 text-[8px] flex items-center justify-center ml-2">是否一月内临时工作</FlowBox>
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-500">是</div>
                          <div className="absolute top-1/2 -right-6 -translate-y-1/2 text-[10px] font-bold text-blue-500">否</div>
                        </div>
                        <FlowBox color="light-blue" className="w-14 h-32 flex items-center p-1 text-[9px] flex items-center justify-center">厂级安全教育培训档案</FlowBox>
                        <FlowBox color="light-blue" className="w-14 h-32 flex items-center p-1 text-[9px] flex items-center justify-center">三种人安全考试</FlowBox>
                      </div>
                    )}

                    {/* Stage 3: 施工管理 */}
                    {laneIdx === 0 && stageIdx === 3 && (
                      <div className="absolute inset-0 flex items-center justify-start px-2 space-x-1">
                        <FlowBox color="green" className="w-12 h-24 flex items-center [writing-mode:vertical-rl]">承包单位建立项目部</FlowBox>
                        <ConnectorLine length={10} />
                        <FlowBox color="blue" className="w-10 h-24 flex items-center [writing-mode:vertical-rl]">编制“三措两案”</FlowBox>
                        <ConnectorLine length={10} />
                        <FlowBox color="light-blue" className="w-10 h-24 flex items-center [writing-mode:vertical-rl]">开工申请</FlowBox>
                        <ConnectorLine length={20} />
                        <FlowBox color="light-blue" className="w-28 h-24 flex items-center justify-center text-sm p-4">开展现场作业</FlowBox>
                        <ConnectorLine length={15} hasArrow={false} />
                        <div className="flex flex-col space-y-1 scale-90">
                          <div className="flex space-x-1">
                            <FlowBox className="w-14 h-10 flex items-center" color="light-blue">停复工管理</FlowBox>
                            <FlowBox className="w-14 h-10 flex items-center" color="light-blue">安全监管</FlowBox>
                          </div>
                          <div className="flex space-x-1">
                            <FlowBox className="w-14 h-10 flex items-center" color="light-blue">外包人员增补</FlowBox>
                            <FlowBox className="w-14 h-10 flex items-center" color="light-blue">外包工器具增补</FlowBox>
                          </div>
                        </div>
                        <ConnectorLine length={10} />
                        <FlowBox color="light-blue" className="w-10 h-24 flex items-center [writing-mode:vertical-rl]">申请验收</FlowBox>
                      </div>
                    )}

                    {laneIdx === 1 && stageIdx === 3 && (
                      <div className="absolute inset-0 flex items-center px-4 space-x-4">
                        <FlowBox color="light-blue" className="w-18 h-32 flex items-center p-2 text-[9px]">作业前进行承包单位及人员资质等核查</FlowBox>
                        <ConnectorLine length={15} />
                        <FlowBox color="light-blue" className="w-24 h-32 flex items-center p-2 text-[9px]">机械、器具、安全防护设施、高风险作业安全防护装备等核查</FlowBox>
                        <div className="w-4" />
                        <FlowBox color="light-blue" className="w-10 h-32 flex items-center [writing-mode:vertical-rl]">工作联系人</FlowBox>
                        <ConnectorLine length={10} />
                        <FlowBox color="light-blue" className="w-12 h-32 flex items-center p-1 text-[9px]">安全监管、旁站监护</FlowBox>
                        <div className="flex-1" />
                        <FlowBox color="light-blue" className="w-16 h-32 flex items-center p-1 text-[9px]">组织验收，办理竣工验收单</FlowBox>
                      </div>
                    )}

                    {laneIdx === 2 && stageIdx === 3 && (
                      <div className="absolute inset-0 flex items-center justify-between px-32">
                        <FlowBox color="light-blue" className="w-14 h-32 flex items-center p-2 text-[9px]">开工前安全技术交底</FlowBox>
                        <FlowBox color="green" className="w-10 h-32 flex items-center [writing-mode:vertical-rl]">安全监管</FlowBox>
                      </div>
                    )}

                    {laneIdx === 3 && stageIdx === 3 && (
                      <div className="absolute inset-0 flex items-center justify-end px-32">
                        <FlowBox color="light-blue" className="w-10 h-32 flex items-center [writing-mode:vertical-rl]">安全监管</FlowBox>
                      </div>
                    )}
                    {/* Stage 5: End */}
                    {laneIdx === 1 && stageIdx === 4 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FlowBox color="gray" className="w-8 h-20 flex items-center justify-center">资料归档</FlowBox>
                      </div>
                    )}

                    {laneIdx === 2 && stageIdx === 4 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                        <FlowBox color="light-blue" className="w-16">项目评价</FlowBox>
                        <FlowBox color="light-blue" className="w-16">人员评价</FlowBox>
                      </div>
                    )}

                    {laneIdx === 3 && stageIdx === 4 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                        <FlowBox color="light-blue" className="w-16">项目评价</FlowBox>
                        <FlowBox color="light-blue" className="w-16">人员评价</FlowBox>
                      </div>
                    )}

                    {stageIdx === 4 && laneIdx === 2 && (
                       <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                          <ConnectorLine length={20} />
                          <FlowBox color="blue" shape="pill" className="w-16 py-3">结 束</FlowBox>
                       </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* SVG Overlay for complex connectors */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-blue-300 fill-none" style={{ zIndex: 5 }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
              </marker>
            </defs>
            
            {/* Stage 0: 招投标 */}
            {/* 中标 (Col 0, Lane 2, ~X: 200) -> 资质材料 (Col 0, Lane 0, ~X: 200) */}
            <path d="M 215 400 L 215 170" markerEnd="url(#arrowhead)" /> 
            
            {/* 成立项目部 (Col 0, Lane 1, ~X: 270) -> 资质材料 (Col 0, Lane 0, ~X: 270) */}
            <path d="M 270 240 L 270 170" markerEnd="url(#arrowhead)" />
            
            {/* 成立项目部 (Col 0, Lane 1, ~X: 270) -> 项目经理面试 (Col 0, Lane 2, ~X: 270) */}
            <path d="M 270 340 L 270 410" markerEnd="url(#arrowhead)" />

            {/* 签订合同承诺书 (Col 0, Lane 0, ~X: 430) -> 组织签订 (Col 0, Lane 2, ~X: 430) */}
            <path d="M 420 170 L 420 400" markerEnd="url(#arrowhead)" />

            {/* Stage 1: 资质审核 */}
            {/* 审核资质 (Col 1, Lane 2) -> 合格 (Col 2, Lane 1/2 boundary) */}
            <path d="M 900 500 L 980 500 L 980 340" markerEnd="url(#arrowhead)" />

            {/* Stage 2: 安全教育 */}
            {/* 合格 -> 对拟入场人员培训 (Lane 0) */}
            <path d="M 1000 320 L 1050 320 L 1050 160" markerEnd="url(#arrowhead)" />
            
            {/* 对拟入场人员培训 -> 拟入场考核 (Lane 2) */}
            <path d="M 1080 160 L 1080 400" markerEnd="url(#arrowhead)" />

            {/* 审核资质 (Col 1) -> 拟入场考核 (Col 2) */}
            <path d="M 913 500 L 1020 500" markerEnd="url(#arrowhead)" />

            {/* 拟入场考核 -> 是否一月内工作 (Lane 3) */}
            <path d="M 1080 520 L 1080 580" markerEnd="url(#arrowhead)" />

            {/* Diamond logic */}
            <path d="M 1080 680 L 1080 700 L 1260 700 L 1260 520" markerEnd="url(#arrowhead)" /> {/* Diamond YES -> 交底性培训 */}
            <path d="M 1160 620 L 1200 620" markerEnd="url(#arrowhead)" /> {/* Diamond NO -> 厂级 */}

            <path d="M 1250 620 L 1250 520" markerEnd="url(#arrowhead)" /> {/* 厂级 -> 部门/班组 (UP) */}
            <path d="M 1300 320 L 1340 320" markerEnd="url(#arrowhead)" /> {/* 部门档案 -> 办理门禁 */}
            
            <path d="M 1360 320 L 1360 200" markerEnd="url(#arrowhead)" /> {/* 办理门禁 -> 考试申请 */}
            <path d="M 1360 160 L 1360 320" markerEnd="url(#arrowhead)" /> {/* 考试申请 -> 技能考核 */}
            <path d="M 1360 380 L 1360 600" markerEnd="url(#arrowhead)" /> {/* 技能考核 -> 安全考试 */}

            {/* Stage 3: 施工管理 */}
            <path d="M 1360 680 L 1400 680 L 1400 140 L 1450 140" markerEnd="url(#arrowhead)" /> {/* 安全考试 -> 建立项目部 */}
            
            <path d="M 1520 320 L 1520 160" markerEnd="url(#arrowhead)" /> {/* PM核查 -> 编制开工申请 (UP) */}
            <path d="M 1700 160 L 1700 400" markerEnd="url(#arrowhead)" /> {/* 开工申请 -> 开工前安全交底 (DOWN) */}
            <path d="M 1750 450 L 1800 450 L 1800 170" markerEnd="url(#arrowhead)" /> {/* 安全交底 -> 开展现场作业 (UP) */}
            
            <path d="M 2100 320 L 2100 480" markerEnd="url(#arrowhead)" /> {/* PM监管 -> 发包监管 */}
            <path d="M 2100 520 L 2100 680" markerEnd="url(#arrowhead)" /> {/* 发包监管 -> 安全监管 */}
            
            <path d="M 1950 140 L 2050 140" markerEnd="url(#arrowhead)" /> {/* 开展作业 -> 申请验收 */}
            <path d="M 2080 140 L 2080 320" markerEnd="url(#arrowhead)" /> {/* 申请验收 -> 组织验收 */}

            {/* Stage 4: 结束 */}
            <path d="M 1880 320 L 1940 320" markerEnd="url(#arrowhead)" /> {/* 组织验收 -> 资料归档 */}
            <path d="M 1960 340 L 1960 500 L 2000 500" markerEnd="url(#arrowhead)" /> {/* 资料归档 -> 结束 (DOWN) */}
            <path d="M 1970 500 L 2000 500" markerEnd="url(#arrowhead)" /> {/* 评价 -> 结束 */}
          </svg>
        </div>
      </div>
      
      {/* Legend / Info Footer */}
      <div className="mt-8 flex items-center justify-center space-x-12">
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-emerald-500 rounded shadow-sm" />
          <span className="text-xs font-bold text-slate-500">关键控制节点</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-blue-500 rounded shadow-sm" />
          <span className="text-xs font-bold text-slate-500">主流程环节</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-white border border-slate-200 rounded shadow-sm" />
          <span className="text-xs font-bold text-slate-500">基础操作节点</span>
        </div>
      </div>
      </motion.div>
    </div>
  );
};

export default ContractorFlowView;
