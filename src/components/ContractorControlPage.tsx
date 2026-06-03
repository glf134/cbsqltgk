import React, { useState, useRef, useMemo } from 'react';
import ContractorFlowView from './ContractorFlowView';
import ContractorDashboardView from './ContractorDashboardView';
import { 
  LayoutGrid, 
  ClipboardList, 
  AlertCircle, 
  Briefcase, 
  BarChart3, 
  Mic, 
  Send, 
  Sparkles,
  ChevronRight,
  ChevronDown,
  UserCheck,
  FileText,
  ShieldCheck,
  BookOpen,
  Hammer,
  Award,
  CircleDot,
  Search,
  MoreHorizontal,
  GraduationCap,
  Activity,
  HardHat,
  ZoomIn,
  ZoomOut,
  Maximize2,
  XCircle,
  Network,
  GitFork
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart as ReAreaChart, Area } from 'recharts';
import SummaryReportPage from './SummaryReportPage';

// --- Types & Data ---
interface TreeNode {
  id: string;
  label: string;
  icon: any;
  isAi?: boolean;
  children?: TreeNode[];
}

const contractorTree: TreeNode = {
  id: 'root',
  label: '承包商全链条管控',
  icon: ShieldCheck,
  children: [
    {
      id: 'admission',
      label: '准入阶段',
      icon: ShieldCheck,
      children: [
        { id: 'c1', label: '承包商信息', icon: FileText, isAi: true },
        { id: 'c2', label: '人员信息', icon: UserCheck, isAi: true },
        { id: 'c3', label: '合同信息', icon: FileText, isAi: true },
        { id: 'c4', label: '项目信息', icon: Briefcase },
      ]
    },
    {
      id: 'review',
      label: '审查阶段',
      icon: ClipboardList,
      children: [
        { id: 'c5', label: '工器具信息', icon: Hammer },
        { id: 'c6', label: '安措信息', icon: ShieldCheck },
      ]
    },
    {
      id: 'training',
      label: '培训考试阶段',
      icon: BookOpen,
      children: [
        { id: 'c7', label: '入场三级教育', icon: GraduationCap, isAi: true },
        { id: 'c8', label: '人员技能考试', icon: FileText, isAi: true },
        { id: 'c9', label: '三种人考试', icon: UserCheck },
      ]
    },
    {
      id: 'commencement',
      label: '开工阶段',
      icon: CircleDot,
      children: [
        { id: 'c10', label: '开工申请报告', icon: FileText },
        { id: 'c11', label: '开工前安全技术交底', icon: UserCheck },
      ]
    },
    {
      id: 'operation',
      label: '作业阶段',
      icon: HardHat,
      children: [
        { id: 'c12', label: '现场作业', icon: Activity },
      ]
    },
    {
      id: 'acceptance',
      label: '验收阶段',
      icon: Award,
      children: [
        { id: 'c13', label: '承包商企业评价', icon: FileText, isAi: true },
        { id: 'c14', label: '承包商人员评价', icon: UserCheck, isAi: true },
      ]
    }
  ]
};

// Helper for generating Bezier curves
const generateBezierPath = (sx: number, sy: number, tx: number, ty: number) => {
  return `M ${sx} ${sy} C ${(sx + tx) / 2} ${sy}, ${(sx + tx) / 2} ${ty}, ${tx} ${ty}`;
};

// --- Mock Data for Analysis ---
const admissionData = [
  { month: '1月', success: 400, total: 450 },
  { month: '2月', success: 300, total: 320 },
  { month: '3月', success: 500, total: 540 },
  { month: '4月', success: 450, total: 480 },
];

const safetyData = [
  { subject: '资质核查', A: 120, B: 110, fullMark: 150 },
  { subject: '工器具', A: 98, B: 130, fullMark: 150 },
  { subject: '作业环境', A: 86, B: 130, fullMark: 150 },
  { subject: '人员技能', A: 99, B: 100, fullMark: 150 },
  { subject: '历史评价', A: 85, B: 90, fullMark: 150 },
];

const categoryDistribution = [
  { name: '电力工程', value: 400, color: '#4f46e5' },
  { name: '土建施工', value: 300, color: '#3b82f6' },
  { name: '设备检修', value: 300, color: '#10b981' },
  { name: '信息系统', value: 200, color: '#f59e0b' },
];

const trainingPerformance = [
  { name: '第1周', skills: 85, safety: 70 },
  { name: '第2周', skills: 78, safety: 82 },
  { name: '第3周', skills: 90, safety: 88 },
  { name: '第4周', skills: 82, safety: 91 },
];

const incidentTrend = [
  { name: 'M1', count: 12 },
  { name: 'M2', count: 19 },
  { name: 'M3', count: 8 },
  { name: 'M4', count: 15 },
  { name: 'M5', count: 22 },
  { name: 'M6', count: 10 },
];

const toolStatus = [
  { name: '合格', value: 850, color: '#10b981' },
  { name: '待检', value: 120, color: '#f59e0b' },
  { name: '报废', value: 30, color: '#ef4444' },
];

const contractors = [
  { id: '1', name: '中建电力建设有限公司' },
  { id: '2', name: '国网电力四川分公司' },
  { id: '3', name: '泰坦机电设备工程部' },
];

const contractData: Record<string, { id: string, name: string, stages: string[] }[]> = {
  '1': [
    { id: 'ct1', name: '2024电力线路扩容项目', stages: ['admission', 'review', 'training'] },
    { id: 'ct2', name: '基建三期土方合同', stages: ['admission', 'review', 'training', 'commencement', 'operation'] },
  ],
  '2': [
    { id: 'ct3', name: '变电站维护年度框架', stages: ['admission', 'review', 'training', 'commencement', 'operation', 'acceptance'] },
  ],
  '3': [
    { id: 'ct4', name: '精密仪标定服务合同', stages: ['admission', 'review'] },
  ]
};

const NavButton = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all duration-500 ${active ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl shadow-indigo-500/30' : 'text-slate-500 hover:bg-slate-50'}`}
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm font-bold">{label}</span>
  </button>
);

const AnalysisChartCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
    <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center">
      <div className="w-1.5 h-4 bg-indigo-500 rounded-full mr-2" />
      {title}
    </h3>
    <div className="h-64 w-full">
      {children}
    </div>
  </div>
);

const ContractorControlPage = () => {
  const [scale, setScale] = useState(1);
  const [activeTab, setActiveTab] = useState<'overall' | 'contractor-overview' | 'analysis'>('overall');
  const [viewMode, setViewMode] = useState<'tree' | 'flow'>('tree');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<string>('');
  const [selectedContract, setSelectedContract] = useState<string>('');
  const [highlightedStages, setHighlightedStages] = useState<string[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showAiDetail, setShowAiDetail] = useState(false);
  const [currentSummaryData, setCurrentSummaryData] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const availableContracts = useMemo(() => {
    return selectedContractor ? contractData[selectedContractor] || [] : [];
  }, [selectedContractor]);

  const handleSearch = () => {
    if (!selectedContract) {
      setHighlightedStages([]);
      setAiSummary(null);
      return;
    }
    const contract = availableContracts.find(c => c.id === selectedContract);
    if (contract) {
      setHighlightedStages(contract.stages);
      setAiSummary(`已为您定位到 [${contract.name}]，当前正处于 [${contractorTree.children?.find(s => s.id === contract.stages[contract.stages.length - 1])?.label}] 实施中。`);
    }
  };

  const generateReportData = (contractName: string, contractorName: string, stages: string[]) => {
    return {
      contractorName,
      contractName,
      completionRate: Math.round((stages.length / 6) * 100),
      status: stages.length === 6 ? '已归档' : '履约中',
      startDate: '2024-01-10',
      endDate: '2024-12-30',
      complianceScore: 98.5,
      stages: [
        { name: '准入阶段', status: stages.includes('admission') ? 'completed' : 'pending', date: '2024-01-15' },
        { name: '审查阶段', status: stages.includes('review') ? (stages.length > 2 ? 'completed' : 'ongoing') : 'pending', date: '2024-02-02' },
        { name: '培训考试阶段', status: stages.includes('training') ? (stages.length > 3 ? 'completed' : 'ongoing') : 'pending', date: '2024-02-28' },
        { name: '开工阶段', status: stages.includes('commencement') ? (stages.length > 4 ? 'completed' : 'ongoing') : 'pending', date: '2024-03-12' },
        { name: '作业阶段', status: stages.includes('operation') ? (stages.length > 5 ? 'completed' : 'ongoing') : 'pending', date: '2024-03-25' },
        { name: '验收阶段', status: stages.includes('acceptance') ? 'completed' : (stages.length === 6 ? 'ongoing' : 'pending'), date: '2024-11-20' },
      ]
    };
  };

  const handleSummary = () => {
    if (selectedContract) {
      const contract = availableContracts.find(c => c.id === selectedContract);
      const contractor = contractors.find(c => c.id === selectedContractor);
      if (contract && contractor) {
        setCurrentSummaryData(generateReportData(contract.name, contractor.name, contract.stages));
        setShowSummaryModal(true);
      }
    } else {
      alert('请先选择一个合同以生成报告');
    }
  };

  const handleAiAction = () => {
    if (!aiInput.trim()) return;

    // Simulate AI parsing
    let matchFound = false;
    
    // Look for keywords
    Object.entries(contractData).forEach(([cId, contractsList]) => {
      contractsList.forEach(ct => {
        const contractor = contractors.find(c => c.id === cId);
        if (aiInput.includes(ct.name) || (contractor && aiInput.includes(contractor.name))) {
          matchFound = true;
          setSelectedContractor(cId);
          setSelectedContract(ct.id);
          setHighlightedStages(ct.stages);

          if (aiInput.includes('查看') || aiInput.includes('信息')) {
            setCurrentSummaryData(generateReportData(ct.name, contractor?.name || '', ct.stages));
            setShowSummaryModal(true);
            setAiSummary(null);
          } else {
            setAiSummary(`智能分析：[${ct.name}] 履约平稳，目前处于 ${contractorTree.children?.find(s => s.id === ct.stages[ct.stages.length - 1])?.label} 阶段，各项指标均正常。`);
          }
        }
      });
    });

    if (!matchFound) {
      setAiSummary("未找到相关合同或承包商，请核对输入信息。");
    }
    
    setAiInput('');
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handleReset = () => setScale(1);

  // Layout calculation (Static D3-like layout)
  const layout = useMemo(() => {
    const nodes: any[] = [];
    const links: any[] = [];
    
    const levelWidth = 420;
    // Positioning root at the absolute physical center of the 3000px SVG space
    const rootPos = { x: 1500, y: 1500 }; 
    nodes.push({ ...contractorTree, x: rootPos.x, y: rootPos.y, level: 0 });

    // Level 1 (Stages)
    const l1Count = contractorTree.children?.length || 0;
    const l1FullHeight = (l1Count - 1) * 250; // Increased from 220 for better breathing room
    const l1StartY = rootPos.y - l1FullHeight / 2;

    contractorTree.children?.forEach((stage, sIdx) => {
      const stagePos = { 
        x: rootPos.x + levelWidth, 
        y: l1StartY + sIdx * 250 
      };
      nodes.push({ ...stage, x: stagePos.x, y: stagePos.y, level: 1 });
      links.push({ sx: rootPos.x, sy: rootPos.y, tx: stagePos.x, ty: stagePos.y, level: 0 });

      // Level 2 (Details) - Further spread out as requested
      const l2Count = stage.children?.length || 0;
      const l2FullHeight = (l2Count - 1) * 90; // Increased from 75
      const l2StartY = stagePos.y - l2FullHeight / 2;

      stage.children?.forEach((child, cIdx) => {
        const childPos = { 
          x: stagePos.x + levelWidth, 
          y: l2StartY + cIdx * 90 // Increased from 75
        };
        nodes.push({ ...child, x: childPos.x, y: childPos.y, level: 2 });
        links.push({ sx: stagePos.x, sy: stagePos.y, tx: childPos.x, ty: childPos.y, level: 1 });
      });
    });

    return { nodes, links };
  }, []);

  const handleNodeClick = (label: string) => {
    alert(`💡 核心管控提示：正在进入 [${label}] 功能专区...`);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fbff] overflow-hidden relative" id="contractor-control-page">
      {/* Top Header Region - Aligned Title & Centered Navigation */}
      <div className="absolute top-0 left-0 right-0 px-10 pt-8 pb-6 z-40 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none">
        <div className="max-w-[1600px] mx-auto flex items-center relative">
          {/* Left Title Area */}
          <div className="flex items-center space-x-4 pointer-events-auto shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 ring-1 ring-white/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 font-sans tracking-tight leading-none">
                承包商全链条管控
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-indigo-500/60 mt-1 pl-0.5">
                Contractor Management System
              </span>
            </div>
          </div>

          {/* Centered Navigation Bar */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-full p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] ring-4 ring-white/50 pointer-events-auto">
            <NavButton 
              icon={LayoutGrid} 
              label="AI概览" 
              active={activeTab === 'overall'} 
              onClick={() => setActiveTab('overall')}
            />
            <div className="w-4" /> 
            <NavButton 
              icon={UserCheck} 
              label="承包商概览" 
              active={activeTab === 'contractor-overview'} 
              onClick={() => setActiveTab('contractor-overview')}
            />
            <div className="w-4" /> 
            <NavButton 
              icon={BarChart3} 
              label="分析" 
              active={activeTab === 'analysis'} 
              onClick={() => setActiveTab('analysis')}
            />

            {/* Manual Toggle for Search */}
            {activeTab === 'overall' && (
              <>
                <div className="w-px h-4 bg-slate-200 mx-2" />
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all duration-300 group ${isSearchOpen ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                  title={isSearchOpen ? "隐藏查询" : "显示查询"}
                >
                  <Search className={`w-4 h-4 transition-transform duration-300 ${isSearchOpen ? 'rotate-0' : 'group-hover:scale-110'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{isSearchOpen ? '收起' : '搜索'}</span>
                </button>
              </>
            )}
          </div>

          {/* Right Area: View Mode Toggle */}
          {activeTab === 'overall' ? (
            <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-2xl p-1 shadow-2xl ring-4 ring-white/50 pointer-events-auto ml-auto">
              <button 
                onClick={() => setViewMode('tree')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${viewMode === 'tree' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                <Network className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">结构树</span>
              </button>
              <button 
                onClick={() => setViewMode('flow')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${viewMode === 'flow' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                <GitFork className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">流程图</span>
              </button>
            </div>
          ) : (
            <div className="w-12 h-12 invisible shrink-0" />
          )}
        </div>

        {/* Search Row - Toggleable for Overall tab */}
        <AnimatePresence>
          {activeTab === 'overall' && isSearchOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="max-w-[1600px] mx-auto mt-6 flex items-center space-x-4 pointer-events-auto"
            >
              <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-xl border border-indigo-100/50 p-1.5 rounded-2xl shadow-[0_15px_40px_rgba(79,70,229,0.08)]">
                <div className="flex items-center px-4 space-x-2">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter whitespace-nowrap">承包商</span>
                  <select 
                    value={selectedContractor}
                    onChange={(e) => {
                      setSelectedContractor(e.target.value);
                      setSelectedContract('');
                      setHighlightedStages([]);
                    }}
                    className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer min-w-[160px] hover:text-indigo-600 transition-colors"
                  >
                    <option value="">请选择承包商...</option>
                    {contractors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="w-px h-6 bg-slate-100" />
                <div className="flex items-center px-4 space-x-2">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter whitespace-nowrap">合同条款</span>
                  <select 
                    value={selectedContract}
                    onChange={(e) => setSelectedContract(e.target.value)}
                    className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer min-w-[180px] hover:text-indigo-600 transition-colors"
                    disabled={!selectedContractor}
                  >
                    <option value="">请选择项目合同...</option>
                    {availableContracts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <button 
                onClick={handleSearch}
                className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 hover:bg-black text-white rounded-xl shadow-lg shadow-indigo-500/10 transition-all font-bold text-sm"
              >
                <Search className="w-4 h-4" />
                <span>查询</span>
              </button>

              <button 
                onClick={handleSummary}
                className="flex items-center space-x-2 px-6 py-2.5 bg-white border border-slate-200 hover:border-indigo-400 text-slate-500 hover:text-indigo-600 rounded-xl shadow-sm transition-all font-bold text-sm"
              >
                <Activity className="w-4 h-4" />
                <span>汇总</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Toggle */}
      {activeTab === 'overall' ? (
        <>
          {/* Interactive Floating Control Stack */}
          <div className="absolute right-10 top-32 z-30 flex flex-col space-y-3">
            <div className="bg-white/90 backdrop-blur-xl border border-indigo-50 rounded-2xl p-2 shadow-2xl flex flex-col space-y-1 ring-1 ring-black/5 items-center">
              <button 
                onClick={handleZoomIn} 
                className="p-3 bg-white hover:bg-indigo-600 hover:text-white rounded-xl transition-all text-indigo-600 cursor-pointer group shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ZoomIn className="w-6 h-6" />
              </button>
              <button 
                onClick={handleZoomOut} 
                className="p-3 bg-white hover:bg-indigo-600 hover:text-white rounded-xl transition-all text-indigo-600 cursor-pointer group shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ZoomOut className="w-6 h-6" />
              </button>
              <div className="h-px w-6 bg-slate-100 my-1" />
              <button 
                onClick={handleReset} 
                className="p-3 bg-white hover:bg-indigo-600 hover:text-white rounded-xl transition-all text-indigo-600 cursor-pointer group shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Maximize2 className="w-6 h-6" />
              </button>
            </div>
          </div>


          {viewMode === 'tree' ? (
            <div 
              ref={containerRef}
              className="flex-1 relative overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] cursor-grab active:cursor-grabbing"
              id="canvas-container"
            >
              {/* AI Summary Bubble Overlay */}
              <AnimatePresence>
                {aiSummary && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 30, x: '-50%' }}
                    className="absolute bottom-24 left-1/2 z-[45] bg-white/90 backdrop-blur-xl border border-indigo-100 p-4 rounded-2xl shadow-2xl shadow-indigo-500/10 flex items-center space-x-4 max-w-2xl w-full mx-auto ring-4 ring-white/50"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-800 leading-tight">
                        {aiSummary}
                      </p>
                    </div>
                    <button 
                      onClick={() => setAiSummary(null)}
                      className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div 
                className="absolute inset-0 origin-center"
                initial={{ scale: 0.8, x: -150 }}
                animate={{ scale }}
                drag
                dragMomentum={false}
                id="canvas-box"
              >
                <svg className="w-[3000px] h-[3000px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible">
                  <g>
                    {layout.links.map((link, i) => (
                      <path
                        key={`link-${i}`}
                        d={generateBezierPath(link.sx, link.sy, link.tx, link.ty)}
                        fill="none"
                        stroke={link.level === 0 ? "#4f46e5" : "#94a3b8"} 
                        strokeWidth={link.level === 0 ? "3.5" : "2"}
                        strokeOpacity={link.level === 0 ? "0.6" : "0.3"}
                        className="transition-all duration-700"
                      />
                    ))}
                  </g>

                  <g>
                    {layout.nodes.map((node) => {
                      const Icon = node.icon;
                      // Check if this node or its parent stage is highlighted
                      const isRoot = node.level === 0;
                      const isStage = node.level === 1;
                      const isSubItem = node.level === 2;
                      
                      const isHighlighted = isRoot || 
                                           (isStage && highlightedStages.includes(node.id)) ||
                                           (isSubItem && highlightedStages.some(sid => contractorTree.children?.find(s => s.id === sid)?.children?.some(c => c.id === node.id)));

                      const hasSearch = highlightedStages.length > 0;
                      const dimStyle = hasSearch && !isHighlighted ? 'opacity-30 grayscale-[0.5]' : 'opacity-100';

                      return (
                        <foreignObject
                          key={node.id}
                          x={node.x - 20}
                          y={node.y - 35}
                          width="300"
                          height="120"
                          className="overflow-visible"
                        >
                          <motion.div 
                            onClick={() => handleNodeClick(node.label)}
                            whileHover={{ scale: 1.05, y: -5, zIndex: 100 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center space-x-5 p-4 rounded-3xl transition-all duration-500 cursor-pointer group relative overflow-visible ${dimStyle} ${
                              node.level === 0 ? 'bg-indigo-600 text-white shadow-[0_25px_60px_rgba(79,70,229,0.4)] ring-8 ring-indigo-500/10' : 
                              node.level === 1 ? (isHighlighted ? 'bg-indigo-50 color-indigo-600 border-2 border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.2)]' : 'bg-white border-2 border-indigo-100 shadow-xl shadow-indigo-500/5') : 
                              (isHighlighted ? 'bg-white border border-indigo-600 shadow-lg' : 'bg-white border border-slate-100 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/10')
                            }`}
                            style={{ width: 'fit-content', minWidth: node.level === 2 ? '160px' : '220px' }}
                          >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                              node.level === 0 ? 'bg-white/10 backdrop-blur-md' : 
                              (isHighlighted ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-50 text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white shadow-sm')
                            }`}>
                              <Icon className={`${node.level === 0 ? 'w-7 h-7' : 'w-5.5 h-5.5'}`} />
                            </div>
                            <div className="flex flex-col pr-6">
                              <span className={`text-[15px] font-black tracking-tight whitespace-nowrap ${node.level === 0 ? 'text-white' : (isHighlighted ? 'text-indigo-700' : 'text-slate-800')}`}>
                                {node.label}
                              </span>
                              {node.level < 2 && (
                                <div className="flex items-center space-x-1.5 mt-1.5">
                                  <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-lg ${node.level === 0 ? 'bg-white/20 text-white' : (isHighlighted ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-500')}`}>
                                    {node.children?.length || 0} SUB-ITEMS
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* AI Feature Icon */}
                            {node.isAi && (
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowAiDetail(true);
                                }}
                                whileHover={{ scale: 1.2, rotate: 12 }}
                                className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-500 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/30 flex items-center justify-center shrink-0 ml-auto group/ai"
                              >
                                <div className="w-full h-full bg-white rounded-[6px] flex items-center justify-center">
                                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 group-hover/ai:text-indigo-600 transition-colors" />
                                </div>
                              </motion.button>
                            )}

                            {node.children && (
                              <div className={`absolute -right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm animate-pulse ${node.level === 0 ? 'bg-blue-400' : (isHighlighted ? 'bg-indigo-600 scale-125' : 'bg-indigo-500')}`} />
                            )}
                          </motion.div>
                        </foreignObject>
                      );
                    })}
                  </g>
                </svg>
              </motion.div>
            </div>
          ) : (
            <div className="flex-1 relative overflow-hidden bg-white">
              <ContractorFlowView scale={scale} />
            </div>
          )}
        </>
      ) : activeTab === 'contractor-overview' ? (
        <div className="flex-1 overflow-hidden pt-28">
          <ContractorDashboardView />
        </div>
      ) : (
        /* Analysis View */
        <div className="flex-1 overflow-y-auto px-10 pt-48 pb-32 custom-scrollbar bg-slate-50/30">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Admission Success Trend */}
            <AnalysisChartCard title="准入阶段：资质审定趋势">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={admissionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="申请总数" />
                  <Bar dataKey="success" fill="#4f46e5" radius={[4, 4, 0, 0]} name="通过总数" />
                </BarChart>
              </ResponsiveContainer>
            </AnalysisChartCard>

            {/* 2. Safety Evaluation Radar */}
            <AnalysisChartCard title="核心承包商安全健康度 (AB对比)">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={safetyData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fill: '#64748b'}} />
                  <Radar name="承包商 A" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                  <Radar name="承包商 B" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{fontSize: 10}} />
                </RadarChart>
              </ResponsiveContainer>
            </AnalysisChartCard>

            {/* 3. Category Distribution */}
            <AnalysisChartCard title="承包商业务领域分布">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" verticalAlign="middle" align="right" layout="vertical" wrapperStyle={{fontSize: 10}} />
                </PieChart>
              </ResponsiveContainer>
            </AnalysisChartCard>

            {/* 4. Training Pass Rates */}
            <AnalysisChartCard title="培训考试：技能与安全双向走势">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trainingPerformance}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="skills" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} name="技能考试" />
                  <Line type="monotone" dataKey="safety" stroke="#f59e0b" strokeWidth={3} dot={{r: 4}} name="安全意识" />
                </LineChart>
              </ResponsiveContainer>
            </AnalysisChartCard>

            {/* 5. Incident Frequency */}
            <AnalysisChartCard title="作业监控：安全告警频次">
              <ResponsiveContainer width="100%" height="100%">
                <ReAreaChart data={incidentTrend}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="step" dataKey="count" stroke="#ef4444" fillOpacity={1} fill="url(#colorCount)" name="告警数" />
                </ReAreaChart>
              </ResponsiveContainer>
            </AnalysisChartCard>

            {/* 6. Equipment Status */}
            <AnalysisChartCard title="工器具审查：运行健康状态">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={toolStatus}
                    cx="50%"
                    cy="50%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {toolStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{fontSize: 10, paddingTop: 20}} />
                </PieChart>
              </ResponsiveContainer>
            </AnalysisChartCard>
          </div>
        </div>
      )}

      {/* AI Dialogue Box - Bottom Fixed */}
      {activeTab !== 'overall' && (
        <div className="absolute bottom-6 left-10 right-10 flex justify-center pointer-events-none z-30">
          <div className="w-full max-w-4xl pointer-events-auto">
            <div className="relative p-[2.5px] rounded-2xl overflow-hidden bg-gradient-to-r from-blue-400 via-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-500/20">
              <div className="bg-white rounded-2xl h-14 flex items-center px-4 space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 flex items-center justify-center text-indigo-600 border border-indigo-100/50">
                  <Sparkles className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiAction()}
                  placeholder={activeTab === 'analysis' ? "咨询关于指标异常的AI分析结论..." : "输入“查看XXX合同信息”或“XXX项目进展”..."}
                  className="flex-1 bg-transparent border-none outline-none text-sm text-gray-600 placeholder:text-gray-400 font-bold"
                />
                <div className="flex items-center space-x-2 text-gray-400 pr-2">
                  <button className="p-2 hover:bg-gray-50 rounded-xl transition-all cursor-pointer group">
                    <Mic className="w-5 h-5 group-hover:text-cyan-500" />
                  </button>
                  <div className="h-6 w-[1px] bg-gray-100 mx-1" />
                  <button 
                    onClick={handleAiAction}
                    className="p-2 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer group"
                  >
                    <Send className="w-5 h-5 group-hover:text-indigo-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Report Modal */}
      <AnimatePresence>
        {showSummaryModal && (
          <SummaryReportPage 
            data={currentSummaryData} 
            onClose={() => setShowSummaryModal(false)} 
          />
        )}
      </AnimatePresence>

      {/* AI Feature Detail Mock Modal */}
      <AnimatePresence>
        {showAiDetail && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6"
            onClick={() => setShowAiDetail(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white/90 w-full max-w-2xl h-[60vh] rounded-[48px] shadow-2xl flex flex-col items-center justify-center p-12 text-center overflow-hidden relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400" />
              <div className="w-24 h-24 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-8 relative">
                <Sparkles className="w-12 h-12" />
                <div className="absolute inset-0 bg-indigo-400/20 blur-2xl rounded-full" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-4 font-sans tracking-tight">AI 智能赋能专区</h2>
              <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                正在加载 AI 核心算法库...<br />
                该功能节点已深度集成多模态大模型，支持自动审核、智能对标与风险预测。
              </p>
              
              <div className="mt-12 flex space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-indigo-200 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>

              <button 
                onClick={() => setShowAiDetail(false)}
                className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-full transition-colors"
                id="close-ai-modal"
              >
                <XCircle className="w-6 h-6 text-slate-300" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default ContractorControlPage;

