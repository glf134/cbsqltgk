import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Search, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  LayoutGrid, 
  ExternalLink,
  Flame,
  ArrowUpCircle,
  Maximize,
  Briefcase,
  Layers,
  FileText,
  UserCheck,
  Calendar,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ContractItem {
  id: string;
  contractor: string;
  name: string;
  projectName: string;
  projectCategory: string;
  type: string; // 服务类型
  department: string;
  team: string;
  startTime: string;
  endTime: string;
  status: '已开工' | '未开工' | '已结束';
  // Contractor Attributes
  teamCount: number;
  entryCount: number;
  inPlantCount: number;
  exitCount: number;
  certCount: number;
  siteWorkerCount: number;
  workScope: string;
  assessmentAmount: string;
  issueCount: number;
  toolCount: number;
  // Others
  manager: string;
  monitor: string;
  riskLevel: '较低' | '一般' | '较大' | '重大';
  location: string;
  description: string;
}

const mockContracts: ContractItem[] = [
  { 
    id: 'CT-2024-001', 
    contractor: '中建电力有限公司', 
    name: '2024年1#锅炉房土建维修合同', 
    projectName: '锅炉房维护工程',
    projectCategory: '生产运维类',
    type: '土建工程', 
    department: '基建部', 
    team: '土建一班',
    startTime: '2024-03-01', 
    endTime: '2024-12-30', 
    status: '已开工',
    teamCount: 3,
    entryCount: 45,
    inPlantCount: 32,
    exitCount: 13,
    certCount: 42,
    siteWorkerCount: 28,
    workScope: '负责1#锅炉房内所有土建结构的周期性检查与日常加固维修。',
    assessmentAmount: '￥2,500.00',
    issueCount: 2,
    toolCount: 124,
    manager: '张志刚',
    monitor: '李安全',
    riskLevel: '较大',
    location: '1号机组 / 0米层 / A排',
    description: '1号机组磨煤机A侧润滑油站滤网清洗、油质采集化验及底部积泥清理作业'
  },
  { 
    id: 'CT-2024-002', 
    contractor: '西门子能源服务', 
    name: '6kV配电室设备年度检修协议', 
    projectName: '电气预防性维护',
    projectCategory: '设备检修类',
    type: '设备检修', 
    department: '电气车间', 
    team: '高压班组',
    startTime: '2024-04-15', 
    endTime: '2025-04-14', 
    status: '已开工',
    teamCount: 1,
    entryCount: 12,
    inPlantCount: 8,
    exitCount: 4,
    certCount: 12,
    siteWorkerCount: 6,
    workScope: '全厂6kV及以上电压等级配电柜、互感器、断路器年度预防性试验与维护。',
    assessmentAmount: '￥0.00',
    issueCount: 0,
    toolCount: 56,
    manager: '王建国',
    monitor: '赵铁柱',
    riskLevel: '一般',
    location: '6kV配电中心 / 2层',
    description: '年度配电柜清扫与继保校验'
  },
  { 
    id: 'CT-2024-003', 
    contractor: '科大讯飞技术', 
    name: '智慧化巡检系统技术服务合同', 
    projectName: '智能化工厂打造',
    projectCategory: '信息化建设',
    type: '技术服务', 
    department: '智数中心', 
    team: '软件支持组',
    startTime: '2024-01-10', 
    endTime: '2024-06-30', 
    status: '已结束',
    teamCount: 1,
    entryCount: 5,
    inPlantCount: 0,
    exitCount: 5,
    certCount: 5,
    siteWorkerCount: 0,
    workScope: '涵盖巡检机器人路径规划算法优化、后台数据中心维护及移动端APP技术支持。',
    assessmentAmount: '￥1,200.00',
    issueCount: 1,
    toolCount: 8,
    manager: '李明',
    monitor: '孙科技',
    riskLevel: '较低',
    location: '集控室 / 办公区',
    description: '巡检机器人算法调优与部署'
  },
  { 
    id: 'CT-2024-004', 
    contractor: '申嘉电梯维保', 
    name: '脱硫区域垂直升降梯维保合同', 
    projectName: '特种设备维保',
    projectCategory: '常规巡检类',
    type: '设备检修', 
    department: '生产管理部', 
    team: '维保二队',
    startTime: '2024-05-20', 
    endTime: '2025-05-19', 
    status: '未开工',
    teamCount: 1,
    entryCount: 4,
    inPlantCount: 0,
    exitCount: 0,
    certCount: 4,
    siteWorkerCount: 0,
    workScope: '脱硫区域所有货梯、人行梯及其控制系统的月度、季度及年度维保检测。',
    assessmentAmount: '￥0.00',
    issueCount: 0,
    toolCount: 22,
    manager: '赵敏',
    monitor: '马成功',
    riskLevel: '一般',
    location: '脱硫塔 / 5层',
    description: '垂直电梯月度安规检查与润滑'
  },
];

const categoryData = [
  { name: '土建工程', value: 35, color: '#4f46e5' },
  { name: '设备检修', value: 45, color: '#10b981' },
  { name: '技术服务', value: 20, color: '#f59e0b' },
];

const StatCard = ({ label, value, color }: { label: string, value: string | number, color: string }) => (
  <div className={`p-4 rounded-2xl ${color} flex flex-col items-center justify-center space-y-1 min-w-[100px] border border-white/20 shadow-sm`}>
    <div className="text-2xl font-black flex items-baseline">
      {value}
    </div>
    <div className="text-[10px] opacity-80 font-black tracking-widest">{label}</div>
  </div>
);

const TimelineStep = ({ icon: Icon, label, active, color }: { icon: any, label: string, active?: boolean, color: string }) => (
  <div className="flex flex-col items-center space-y-2 relative">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg z-10 ${active ? color : 'bg-slate-200'}`}>
      <Icon className="w-5 h-5" />
    </div>
    <span className={`text-[10px] font-bold whitespace-nowrap ${active ? 'text-slate-600' : 'text-slate-400'}`}>{label}</span>
  </div>
);

const ContractorDashboardView = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(mockContracts[0].id);

  const selectedContract = useMemo(() => 
    mockContracts.find(c => c.id === selectedId) || null,
  [selectedId]);

  return (
    <div className="flex w-full h-full bg-[#f0f4f8] p-4 overflow-hidden" id="contractor-dashboard">
      {/* Left Sidebar - Collapsible Dashboard */}
      <motion.div 
        animate={{ width: isSidebarOpen ? 460 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="h-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col relative"
      >
        <div className="flex-1 overflow-y-auto custom-scrollbar pt-6 px-6 pb-4">
          {/* Section 1: Contract Classification */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-indigo-50 rounded-lg">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <h2 className="text-base font-black text-slate-800 tracking-tight">合同分类统计</h2>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <StatCard label="已开工" value="42" color="bg-emerald-50 text-emerald-600" />
            <StatCard label="未开工" value="18" color="bg-blue-50 text-blue-600" />
            <StatCard label="已结束" value="12" color="bg-slate-50 text-slate-400" />
          </div>

          {/* Pie Chart for Categories */}
          <div className="h-48 w-full mb-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-slate-800">72</span>
              <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">总合同数</span>
            </div>
          </div>

          {/* Legend for Categories */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {categoryData.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="flex items-center space-x-1.5 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[9px] font-black text-slate-500 whitespace-nowrap">{item.name}</span>
                </div>
                <span className="text-xs font-black text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>

          <div className="h-px bg-slate-100 my-4" />

          {/* Section 2: Contract List */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-4 bg-indigo-600 rounded-full" />
              <h2 className="text-base font-black text-slate-800 tracking-tight">合同清单</h2>
            </div>
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-full tracking-wider">TOTAL: 72</span>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="relative">
              <select className="w-full bg-slate-50 border-none rounded-xl py-2 px-3 pr-8 text-[10px] font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500/10">
                <option>承包商: 全部</option>
                <option>中建电力</option>
                <option>西门子能源</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="w-full bg-slate-50 border-none rounded-xl py-2 px-3 pr-8 text-[10px] font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500/10">
                <option>合同状态: 全部</option>
                <option>已开工</option>
                <option>未开工</option>
                <option>已结束</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="relative mb-4">
            <input 
              type="text" 
              placeholder="搜索合同名称、编号..." 
              className="w-full bg-slate-50 border-none rounded-xl py-2 px-10 text-[10px] font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Table List */}
          <div className="space-y-3">
            <div className="grid grid-cols-6 text-[9px] font-black text-slate-400 px-2 uppercase tracking-[0.1em]">
              <div className="col-span-2">承包商/合同名称</div>
              <div className="col-span-1">编号/类型</div>
              <div className="col-span-1">部门</div>
              <div className="col-span-1">计划周期</div>
              <div className="col-span-1 text-right">状态</div>
            </div>

            {mockContracts.map((contract) => (
              <div 
                key={contract.id} 
                onClick={() => setSelectedId(contract.id)}
                className={`bg-slate-50/70 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 rounded-2xl p-4 transition-all group cursor-pointer border ${selectedId === contract.id ? 'border-indigo-500 bg-white shadow-lg ring-1 ring-indigo-100' : 'border-transparent hover:border-indigo-100'}`}
              >
                <div className="grid grid-cols-6 items-center gap-2">
                  <div className="col-span-2">
                    <div className="text-[10px] font-black text-indigo-600 mb-0.5 truncate">{contract.contractor}</div>
                    <div className="text-[11px] font-bold text-slate-800 line-clamp-1">{contract.name}</div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-[10px] font-black text-slate-700">{contract.id.split('-').pop()}</div>
                    <div className="text-[9px] text-slate-400 font-medium">{contract.type}</div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-[10px] font-black text-slate-600">{contract.department}</div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-[9px] text-slate-500 font-medium">{contract.startTime}</div>
                    <div className="text-[9px] text-slate-300">至 {contract.endTime}</div>
                  </div>
                  <div className="col-span-1 text-right">
                    <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${
                      contract.status === '已开工' ? 'bg-emerald-50 text-emerald-600' : 
                      contract.status === '已结束' ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {contract.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Collapse Toggle Button */}
      <div className="flex flex-col items-center justify-center px-1">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-10 h-24 bg-white border border-slate-100 rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-50 transition-colors group cursor-pointer ring-4 ring-[#f0f4f8]"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
          )}
        </button>
      </div>

      {/* Right Content Area - Detailed View */}
      <div className="flex-1 flex flex-col pt-6 px-10 pb-8 bg-white/40 backdrop-blur-md rounded-[48px] border border-white shadow-inner relative overflow-y-auto custom-scrollbar">
        {selectedContract ? (
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedContract.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Header Meta Info - Horizontal Bar */}
              <div className="flex items-center space-x-6 bg-white/80 p-4 rounded-[28px] border border-indigo-50/50 shadow-sm overflow-x-auto custom-scrollbar no-scrollbar whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">项目名称</span>
                  <span className="text-[11px] font-black text-slate-800">{selectedContract.projectName}</span>
                </div>
                <div className="h-8 w-px bg-slate-100 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">合同名称</span>
                  <span className="text-[11px] font-black text-slate-800">{selectedContract.name}</span>
                </div>
                <div className="h-8 w-px bg-slate-100 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">合同编号</span>
                  <span className="text-[11px] font-black text-indigo-600">{selectedContract.id}</span>
                </div>
                <div className="h-8 w-px bg-slate-100 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">项目分类</span>
                  <span className="text-[11px] font-black text-slate-800">{selectedContract.projectCategory}</span>
                </div>
                <div className="h-8 w-px bg-slate-100 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">服务类型</span>
                  <span className="text-[11px] font-black text-slate-800">{selectedContract.type}</span>
                </div>
                <div className="h-8 w-px bg-slate-100 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">用工部门</span>
                  <span className="text-[11px] font-black text-slate-800">{selectedContract.department}</span>
                </div>
                <div className="h-8 w-px bg-slate-100 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">用工班组</span>
                  <span className="text-[11px] font-black text-slate-800">{selectedContract.team}</span>
                </div>
                <div className="h-8 w-px bg-slate-100 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">状态</span>
                  <span className={`text-[10px] font-black px-2 rounded ${
                    selectedContract.status === '已开工' ? 'bg-emerald-50 text-emerald-600' : 
                    selectedContract.status === '已结束' ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {selectedContract.status}
                  </span>
                </div>
                <div className="ml-auto flex items-center space-x-2 text-indigo-500">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">计划周期</span>
                    <span className="text-[10px] font-black">{selectedContract.startTime} 至 {selectedContract.endTime}</span>
                  </div>
                </div>
              </div>

              {/* Three Attribute Cards */}
              <div className="grid grid-cols-3 gap-6">
                {/* 1. Contractor Attributes */}
                <div className="bg-white/90 rounded-[32px] p-6 border border-white shadow-xl shadow-indigo-500/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Briefcase className="w-20 h-20" />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center">
                    <div className="w-1.5 h-4 bg-indigo-500 rounded-full mr-2" />
                    承包商各种属性信息展示
                  </h3>
                  <div className="space-y-3">
                    <div className="flex flex-col mb-4">
                      <span className="text-[10px] text-slate-400 font-bold mb-0.5">承包商全称</span>
                      <span className="text-xs font-black text-indigo-700">{selectedContract.contractor}</span>
                    </div>
                    {[
                      { label: '项目分类', value: selectedContract.projectCategory },
                      { label: '服务类型', value: selectedContract.type },
                      { label: '合同队伍数', value: `${selectedContract.teamCount} 支` },
                      { label: '入厂人数', value: `${selectedContract.entryCount} 人` },
                      { label: '在厂人数', value: `${selectedContract.inPlantCount} 人`, special: true },
                      { label: '出厂人数', value: `${selectedContract.exitCount} 人` },
                      { label: '制证人数', value: `${selectedContract.certCount} 人` },
                      { label: '现场作业人数', value: `${selectedContract.siteWorkerCount} 人`, highlight: true },
                      { label: '工作范围', value: selectedContract.workScope, full: true },
                      { label: '考核金额', value: selectedContract.assessmentAmount, alert: true },
                      { label: '整改通知问题数', value: `${selectedContract.issueCount} 项`, alert: selectedContract.issueCount > 0 },
                      { label: '工器具数', value: `${selectedContract.toolCount} 件` },
                    ].map((item, idx) => (
                      <div key={idx} className={`flex ${item.full ? 'flex-col' : 'items-center justify-between'}`}>
                        <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap mr-4">{item.label}</span>
                        <div className={`text-[10px] font-black text-right ${
                          item.special ? 'text-blue-600' : 
                          item.highlight ? 'text-emerald-600' : 
                          item.alert ? 'text-rose-500' : 'text-slate-800'
                        } ${item.full ? 'text-left mt-1 text-[9px] leading-relaxed opacity-80' : ''}`}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Personnel & Qualifications */}
                <div className="bg-white/90 rounded-[32px] p-8 border border-white shadow-xl shadow-indigo-500/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <UserCheck className="w-20 h-20" />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center">
                    <div className="w-1.5 h-4 bg-blue-500 rounded-full mr-2" />
                    合同人员信息及资质展示
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['焊工特种作业证', '班组长教育记录', '体检合格证明', '保险购买凭证', '入场教育合格证', '技能等级证书'].map((skill, idx) => (
                       <div key={idx} className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center space-x-2">
                         <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                         <span className="text-[10px] font-bold text-slate-600">{skill}</span>
                       </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
                    <p className="text-[10px] text-indigo-700 font-bold">查看所有参与人员 (12人)</p>
                  </div>
                </div>

                {/* 3. Attachments */}
                <div className="bg-white/90 rounded-[32px] p-8 border border-white shadow-xl shadow-indigo-500/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <FileText className="w-20 h-20" />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center">
                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full mr-2" />
                    相关附件及资质卡片
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: '总承包施工合同.pdf', size: '2.4MB' },
                      { name: '安全生产协议书.pdf', size: '1.1MB' },
                      { name: '承包商资质文件包.zip', size: '15.8MB' },
                      { name: '施工方案审核表.docx', size: '42KB' },
                    ].map((file, idx) => (
                       <div key={idx} className="flex items-center p-3 bg-slate-50/50 rounded-2xl border border-slate-100 group/file cursor-pointer hover:bg-white transition-all">
                         <div className="p-2 bg-white rounded-xl shadow-sm text-slate-400 group-hover/file:text-emerald-500 group-hover/file:bg-emerald-50 transition-colors">
                           <FileText className="w-4 h-4" />
                         </div>
                         <div className="flex-1 ml-3">
                           <div className="text-[10px] font-bold text-slate-700 group-hover/file:text-indigo-600">{file.name}</div>
                           <div className="text-[8px] text-slate-400 uppercase tracking-tighter">{file.size}</div>
                         </div>
                         <ExternalLink className="w-3 h-3 text-slate-300 opacity-0 group-hover/file:opacity-100" />
                       </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lifecycle Progress Timeline */}
              <div className="bg-white/90 rounded-[32px] p-10 border border-white shadow-xl shadow-indigo-500/5 mt-6 px-16 relative">
                 {/* Progress Bar Background */}
                 <div className="absolute top-[60px] left-20 right-20 h-0.5 bg-slate-100" />
                 {/* Current Progress Fill */}
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '80%' }}
                   className="absolute top-[60px] left-20 h-0.5 bg-blue-500"
                 />
                 
                 <div className="flex justify-between items-start relative">
                   <TimelineStep icon={UserCheck} label="准入阶段" active color="bg-blue-500" />
                   <TimelineStep icon={CheckCircle2} label="审查阶段" active color="bg-indigo-500" />
                   <TimelineStep icon={LayoutGrid} label="培训考试阶段" active color="bg-purple-500" />
                   <TimelineStep icon={ArrowUpCircle} label="开工阶段" active color="bg-emerald-500" />
                   <TimelineStep icon={Calendar} label="作业阶段" active color="bg-orange-500" />
                   <TimelineStep icon={FileText} label="验收阶段" color="bg-pink-500" />
                 </div>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 relative z-10">
            <div className="p-8 bg-white/80 rounded-[40px] shadow-2xl shadow-indigo-500/10 flex flex-col items-center space-y-4 border border-indigo-50">
              <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-400">
                <FileText className="w-10 h-10" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-black text-slate-800 mb-1">合同详情概览</h3>
                <p className="text-xs text-slate-400 font-medium">请从左侧列表选择一笔合同以查看全生命周期追溯信息</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractorDashboardView;
