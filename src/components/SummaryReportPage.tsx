import React from 'react';
import { 
  FileText, 
  UserCheck, 
  ShieldCheck, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  X
} from 'lucide-react';
import { motion } from 'motion/react';

interface SummaryReportPageProps {
  onClose: () => void;
  data: {
    contractorName: string;
    contractName: string;
    completionRate: number;
    status: string;
    startDate: string;
    endDate: string;
    complianceScore: number;
    stages: { name: string; status: 'completed' | 'ongoing' | 'pending'; date: string }[];
  } | null;
}

const StatCard = ({ label, value, icon: Icon, trend }: { label: string, value: string | number, icon: any, trend?: string }) => (
  <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 flex items-start justify-between">
    <div>
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className="text-2xl font-black text-slate-800 mt-1">{value}</div>
      {trend && (
        <div className="flex items-center space-x-1 mt-2 text-emerald-500 font-bold text-[10px]">
          <TrendingUp className="w-3 h-3" />
          <span>{trend}</span>
        </div>
      )}
    </div>
    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-500 border border-slate-100">
      <Icon className="w-5 h-5" />
    </div>
  </div>
);

const SummaryReportPage: React.FC<SummaryReportPageProps> = ({ onClose, data }) => {
  if (!data) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-5xl h-[85vh] rounded-[40px] shadow-2xl shadow-indigo-900/20 overflow-hidden flex flex-col relative"
      >
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-200">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-black text-slate-800">{data.contractorName}</h2>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold ring-1 ring-emerald-200 uppercase tracking-wider">
                  {data.status}
                </span>
              </div>
              <p className="text-slate-400 font-medium text-sm mt-1">{data.contractName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full border border-slate-100 hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {/* Key Stats */}
          <div className="grid grid-cols-4 gap-6 mb-10">
            <StatCard label="总体进度" value={`${data.completionRate}%`} icon={ArrowUpRight} trend="+12% Since last month" />
            <StatCard label="合规评分" value={data.complianceScore} icon={ShieldCheck} />
            <StatCard label="进场人数" value="128" icon={UserCheck} />
            <StatCard label="安全告警" value="0" icon={AlertCircle} />
          </div>

          <div className="grid grid-cols-12 gap-10">
            {/* Left: Progress Timeline */}
            <div className="col-span-12 lg:col-span-8">
              <h3 className="text-lg font-black text-slate-800 mb-6 font-sans">阶段进展轨迹</h3>
              <div className="space-y-4">
                {data.stages.map((stage, i) => (
                  <div key={i} className="group relative pl-10 pb-8 last:pb-0">
                    {/* Line */}
                    {i !== data.stages.length - 1 && (
                      <div className="absolute left-[15px] top-[30px] bottom-0 w-0.5 bg-slate-100 group-hover:bg-indigo-100 transition-colors" />
                    )}
                    {/* Circle */}
                    <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${
                      stage.status === 'completed' ? 'bg-emerald-500' : 
                      stage.status === 'ongoing' ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}>
                      {stage.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-white" />}
                      {stage.status === 'ongoing' && <Clock className="w-4 h-4 text-white animate-pulse" />}
                    </div>
                    
                    <div className={`p-6 rounded-3xl border transition-all ${
                      stage.status === 'ongoing' ? 'bg-indigo-50/30 border-indigo-100 shadow-sm' : 'bg-white border-slate-100'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-black tracking-tight ${stage.status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>
                          {stage.name}
                        </span>
                        <span className="text-xs font-bold text-slate-400">{stage.date}</span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {stage.status === 'completed' ? '该阶段管控措施已通过审核并确认归档。' : 
                         stage.status === 'ongoing' ? '人员资质与工器具正在进行实时动态审查中...' : '等待前置阶段完成后开启。'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Info & Details */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-slate-50/50 p-8 rounded-[32px] border border-slate-100">
                <h3 className="text-sm font-black text-slate-800 mb-6 uppercase tracking-widest">合同基础信息</h3>
                <div className="space-y-5">
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-5 h-5 text-indigo-500" />
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold">履约期间</div>
                      <div className="text-sm font-bold text-slate-700">{data.startDate} ~ {data.endDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <MapPin className="w-5 h-5 text-indigo-500" />
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold">作业地点</div>
                      <div className="text-sm font-bold text-slate-700">四川省成都市高新区102号高压站</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold">项目负责人</div>
                      <div className="text-sm font-bold text-slate-700">张德智 (138****0091)</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-600 p-8 rounded-[32px] text-white overflow-hidden relative group">
                <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-bold mb-4 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>AI 风险研判</span>
                </h3>
                <p className="text-sm leading-relaxed text-indigo-100 font-medium">
                  当前承包商在“准入阶段”表现优异，合规率达到100%。但需注意其“工器具”校验期临近，建议按计划启动预警。
                </p>
                <button className="mt-6 w-full py-3 bg-white text-indigo-600 rounded-2xl font-bold text-xs hover:bg-indigo-50 transition-colors">
                  查看详细预警信息
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-10 py-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-4">
          <button className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-white/50">
            打印报告
          </button>
          <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200">
            下载 PDF
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SummaryReportPage;
