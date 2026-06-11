import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, MapPin, Tag, User, Shield, AlertTriangle, 
  Play, Square, Camera, Maximize2, ShieldAlert, CheckCircle2, 
  Users, Activity, Wifi, RefreshCw, Layers, Sliders, ChevronDown, 
  Grid2X2, LayoutGrid, FileText, BellRing, Eye, AlertCircle,
  ChevronLeft, ChevronRight
} from 'lucide-react';

interface WorkTicket {
  id: string;
  plantId: string;
  plantName: string;
  type: string;
  workContent: string;
  riskLevel: string;
  riskColor?: string;
  signer: string;
  permitter: string;
  status: string;
  time: string;
  manager?: string;     // 负责人
  supervisor?: string;  // 监护人
  area?: string;        // 作业区域
}

interface TotalJobsSupervisionProps {
  tickets: WorkTicket[];
  onBack: () => void;
  onSelectTicketDetail?: (ticket: WorkTicket) => void;
}

export const TotalJobsSupervision: React.FC<TotalJobsSupervisionProps> = ({ 
  tickets = [], 
  onBack,
  onSelectTicketDetail
}) => {
  // Built-in high-fidelity dataset representing the 8 required power plants, each with BOTH a Major Risk and Significant Risk job.
  const plantsData = React.useMemo(() => [
    {
      plantName: '正宁电厂',
      majorTicket: {
        id: 'ZN-WT-01',
        plantId: 'zhengning',
        plantName: '正宁电厂',
        type: '动火特级工作票',
        workContent: '12号高炉出铁口主炉喷煤吹扫及焊接阀件悬臂加固',
        riskLevel: '重大风险',
        signer: '林国建',
        manager: '林国建',
        supervisor: '杨监华',
        area: '12号炉旁主厂房B区12米层',
        permitter: '姜伟同',
        status: '作业中',
        time: '本日连续执行'
      },
      largeTicket: {
        id: 'ZN-WT-02',
        plantId: 'zhengning',
        plantName: '正宁电厂',
        type: '受限空间二级工作票',
        workContent: '2#循环洗涤塔底部圆锥漏斗钢板气割除锈与积灰防堵排查',
        riskLevel: '较大风险',
        signer: '刘建业',
        manager: '刘建业',
        supervisor: '张瑞红',
        area: '集冷洗涤系统B段2号池',
        permitter: '周晓峰',
        status: '作业中',
        time: '本日连续执行'
      }
    },
    {
      plantName: '平凉发电公司',
      majorTicket: {
        id: 'PL-WT-01',
        plantId: 'pingliang',
        plantName: '平凉发电公司',
        type: '动火特级工作票',
        workContent: '5号炉温密闭连箱排污阀泄露打磨焊接与高空防坠作业',
        riskLevel: '重大风险',
        signer: '崔志强',
        manager: '崔志强',
        supervisor: '王利民',
        area: '主锅炉房架四层东侧区域',
        permitter: '常国良',
        status: '作业中',
        time: '本日连续执行'
      },
      largeTicket: {
        id: 'PL-WT-02',
        plantId: 'pingliang',
        plantName: '平凉发电公司',
        type: '热机第一种工作票',
        workContent: '3号锅炉侧风机主轴承传动稀油管道法兰泄油清洗',
        riskLevel: '较大风险',
        signer: '陈杰',
        manager: '陈杰',
        supervisor: '王利民',
        area: '辅机房风配通道B51',
        permitter: '王胜',
        status: '作业中',
        time: '本日连续执行'
      }
    },
    {
      plantName: '西固热电公司',
      majorTicket: {
        id: 'XG-WT-01',
        plantId: 'xigu',
        plantName: '西固热电公司',
        type: '高压第二种工作票',
        workContent: '220kV高母线分合闸高压互感跳线二次负荷回路改接调试',
        riskLevel: '重大风险',
        signer: '洪波',
        manager: '洪波',
        supervisor: '任志杰',
        area: '220kVGIS配电中继控制室',
        permitter: '段元生',
        status: '作业中',
        time: '本日连续执行'
      },
      largeTicket: {
        id: 'XG-WT-02',
        plantId: 'xigu',
        plantName: '西固热电公司',
        type: '防磨防爆特种工作票',
        workContent: '1#脱硫洗涤水池内壁局部防腐特涂与内衬剥融修复',
        riskLevel: '较大风险',
        signer: '韩晓锋',
        manager: '韩晓锋',
        supervisor: '董立国',
        area: '引风脱硫塔下池侧层',
        permitter: '石俊山',
        status: '作业中',
        time: '本日连续执行'
      }
    },
    {
      plantName: '靖远热电公司',
      majorTicket: {
        id: 'JY-WT-01',
        plantId: 'jingyuan',
        plantName: '靖远热电公司',
        type: '特重型吊装特种工作票',
        workContent: '5号汽轮机低转子超长吊装就位与偏心阀心轴找正复核',
        riskLevel: '重大风险',
        signer: '罗维新',
        manager: '罗维新',
        supervisor: '白树森',
        area: '集热汽轮发电A排主厂厅',
        permitter: '贺江波',
        status: '作业中',
        time: '本日连续执行'
      },
      largeTicket: {
        id: 'JY-WT-02',
        plantId: 'jingyuan',
        plantName: '靖远热电公司',
        type: '输煤输送机械工作票',
        workContent: '主配煤2B传动皮带电动滚筒自冷轴润滑加脂清洗',
        riskLevel: '较大风险',
        signer: '沈跃龙',
        manager: '沈跃龙',
        supervisor: '常向春',
        area: '主输煤连廊栈桥3号口',
        permitter: '廖金成',
        status: '作业中',
        time: '本日连续执行'
      }
    },
    {
      plantName: '景泰热电公司',
      majorTicket: {
        id: 'JT-WT-01',
        plantId: 'jingtai',
        plantName: '景泰热电公司',
        type: '高空攀爬特控工作票',
        workContent: '180米烟囱外覆航标及顶端排气嘴引雷金属网裂缝气割焊接',
        riskLevel: '重大风险',
        signer: '蒋维力',
        manager: '蒋维力',
        supervisor: '吴明达',
        area: '180米混凝土排烟塔尖顶',
        permitter: '徐振华',
        status: '作业中',
        time: '本日连续执行'
      },
      largeTicket: {
        id: 'JT-WT-02',
        plantId: 'jingtai',
        plantName: '景泰热电公司',
        type: '澄清池洗砂控制票',
        workContent: '冷却澄清水泵液压推移排泥机液面电驱板检查更换',
        riskLevel: '较大风险',
        signer: '冯朝晖',
        manager: '冯朝晖',
        supervisor: '曹志国',
        area: '集水澄沙池下泵房',
        permitter: '张建军',
        status: '作业中',
        time: '本日连续执行'
      }
    },
    {
      plantName: '兰州热电公司',
      majorTicket: {
        id: 'LZ-WT-04',
        plantId: 'lanzhou',
        plantName: '兰州热电公司',
        type: '特种动压水泵工作票',
        workContent: '3号冷却风机塔配水循环管路超大尼龙阀断裂补螺更换',
        riskLevel: '重大风险',
        signer: '杜广仁',
        manager: '杜广仁',
        supervisor: '金立伟',
        area: '3#超大引风水冷塔中部平台',
        permitter: '郝国胜',
        status: '作业中',
        time: '本日连续执行'
      },
      largeTicket: {
        id: 'LZ-WT-05',
        plantId: 'lanzhou',
        plantName: '兰州热电公司',
        type: '直流灰渣电泵检修票',
        workContent: '排尘渣旋流阀耐磨堆焊修复与电机高压传动齿轮更换',
        riskLevel: '较大风险',
        signer: '薛勇',
        manager: '薛勇',
        supervisor: '董安全',
        area: '锅炉房地排干渣储罐下',
        permitter: '黄建平',
        status: '作业中',
        time: '本日连续执行'
      }
    },
    {
      plantName: '连城发电公司',
      majorTicket: {
        id: 'LC-WT-01',
        plantId: 'liancheng',
        plantName: '连城发电公司',
        type: '高温压力容器工作票',
        workContent: '主汽包安全阀直排导向下降不锈钢厚环管缺陷坡口对焊',
        riskLevel: '重大风险',
        signer: '毛庆丰',
        manager: '毛庆丰',
        supervisor: '孙立新',
        area: '主厂房高层汽包操作大架',
        permitter: '孔繁荣',
        status: '作业中',
        time: '本日连续执行'
      },
      largeTicket: {
        id: 'LC-WT-02',
        plantId: 'liancheng',
        plantName: '连城发电公司',
        type: '水机综合泵配机械票',
        workContent: '机冷出水冷塔自洗阀门自控行程智能校订与标定',
        riskLevel: '较大风险',
        signer: '曾宪武',
        manager: '曾宪武',
        supervisor: '夏海东',
        area: '冷却钢架辅水回池1A',
        permitter: '姜伟平',
        status: '作业中',
        time: '本日连续执行'
      }
    },
    {
      plantName: '甘谷发电公司',
      majorTicket: {
        id: 'GG-WT-01',
        plantId: 'gangu',
        plantName: '甘谷发电公司',
        type: '剧毒易爆盲板特护票',
        workContent: '氨区液氨加热储气罐汇流高压连接管盲板防氨泄漏更换排漏',
        riskLevel: '重大风险',
        signer: '陆一鸣',
        manager: '陆一鸣',
        supervisor: '季明华',
        area: '易燃易爆氨储罐围堰西段',
        permitter: '彭定国',
        status: '作业中',
        time: '本日连续执行'
      },
      largeTicket: {
        id: 'GG-WT-02',
        plantId: 'gangu',
        plantName: '甘谷发电公司',
        type: '热调精细旁路阀配票',
        workContent: '主管道过热旁路电驱塞动调泄压控制滑阀断件修复',
        riskLevel: '较大风险',
        signer: '汪海涛',
        manager: '汪海涛',
        supervisor: '王利民',
        area: '机组旁特种调通蒸汽室',
        permitter: '乔德生',
        status: '作业中',
        time: '本日连续执行'
      }
    }
  ], []);

  // Set default initial tickets lists flattened
  const defaultTickets = React.useMemo(() => {
    const list: WorkTicket[] = [];
    plantsData.forEach(p => {
      list.push(p.majorTicket);
      list.push(p.largeTicket);
    });
    return list;
  }, [plantsData]);

  // Selected work ticket set to 正宁 (first one) by default
  const [selectedTicket, setSelectedTicket] = useState<WorkTicket>(plantsData[0].majorTicket);
  
  // Collapsible control state for the right sidebar panel
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);

  // Scrolling reference for company carousel
  const companyScrollRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check scroll boundary to toggle carousel arrows
  const checkCompanyArrows = () => {
    if (companyScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = companyScrollRef.current;
      setShowLeftArrow(scrollLeft > 6);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 6);
    }
  };

  // Bind scroll listeners
  useEffect(() => {
    const activeEl = companyScrollRef.current;
    if (activeEl) {
      activeEl.addEventListener('scroll', checkCompanyArrows, { passive: true });
      checkCompanyArrows();
      // Safe check delayed window loads
      const initialTimer = setTimeout(checkCompanyArrows, 500);
      window.addEventListener('resize', checkCompanyArrows);
      
      return () => {
        activeEl.removeEventListener('scroll', checkCompanyArrows);
        window.removeEventListener('resize', checkCompanyArrows);
        clearTimeout(initialTimer);
      };
    }
  }, []);

  const handleScrollCompanies = (dir: 'left' | 'right') => {
    if (companyScrollRef.current) {
      const distance = dir === 'left' ? -220 : 220;
      companyScrollRef.current.scrollBy({ left: distance, behavior: 'smooth' });
      setTimeout(checkCompanyArrows, 320);
    }
  };
  
  // Filter state for company choice
  const [companyFilter, setCompanyFilter] = useState<string>('全部公司');

  // Filter state for bottom ticket cards (全部, 重大风险, 较大风险)
  const [riskFilter, setRiskFilter] = useState<'全部' | '重大风险' | '较大风险'>('全部');

  const companiesList = [
    '全部公司',
    '正宁电厂',
    '平凉发电公司',
    '西固热电公司',
    '靖远热电公司',
    '景泰热电公司',
    '兰州热电公司',
    '连城发电公司',
    '甘谷发电公司'
  ];

  // Filtered list of tickets
  const filteredTickets = React.useMemo(() => {
    return defaultTickets.filter(ticket => {
      const matchCompany = companyFilter === '全部公司' || ticket.plantName === companyFilter;
      const matchRisk = riskFilter === '全部' || ticket.riskLevel === riskFilter;
      return matchCompany && matchRisk;
    });
  }, [defaultTickets, companyFilter, riskFilter]);

  // Keep selected ticket inside the filtered subset
  useEffect(() => {
    if (filteredTickets.length > 0) {
      const exists = filteredTickets.some(t => t.id === selectedTicket.id);
      if (!exists) {
        setSelectedTicket(filteredTickets[0]);
      }
    }
  }, [companyFilter, riskFilter, filteredTickets, selectedTicket]);
  
  // Video layout configuration ('1x1', '2x2', '4x4')
  const [videoGrid, setVideoGrid] = useState<'1x1' | '2x2' | '4x4'>('1x1');
  
  // Dropdown states
  const [showCamDropdown, setShowCamDropdown] = useState(false);
  const [activeCamIndex, setActiveCamIndex] = useState(0);
  
  // Toast notifications
  const [toast, setToast] = useState<string | null>(null);

  // Auto-rotating risk index carousel (上下轮播)
  const [riskOffset, setRiskOffset] = useState(0);

  // Alarm auto-scrolling index (上下轮播)
  const [alarmOffset, setAlarmOffset] = useState(0);

  // Play/pause and AI toggle
  const [isPlaying, setIsPlaying] = useState(true);
  const [aiDetection, setAiDetection] = useState(true);

  // Auto moving bounding box simulation positions
  const [trackerPos, setTrackerPos] = useState({ x: 30, y: 40 });
  const [trackerPos2, setTrackerPos2] = useState({ x: 60, y: 55 });

  // Risk auto-scrolling interval: 3 seconds (上下轮播)
  useEffect(() => {
    const timer = setInterval(() => {
      setRiskOffset(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Alarm auto-scrolling interval: 3.5 seconds (上下轮播)
  useEffect(() => {
    const timer = setInterval(() => {
      setAlarmOffset(prev => (prev + 1) % 8);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTrackerPos(prev => ({
        x: Math.min(48, Math.max(12, prev.x + (Math.random() - 0.5) * 2)),
        y: Math.min(55, Math.max(25, prev.y + (Math.random() - 0.5) * 1.5))
      }));
      setTrackerPos2(prev => ({
        x: Math.min(80, Math.max(50, prev.x + (Math.random() - 0.5) * 2.5)),
        y: Math.min(70, Math.max(40, prev.y + (Math.random() - 0.5) * 1.8))
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Video angles & feeds mapping
  const cameraFeeds = [
    { name: '1号机炉前主视频 A通道', location: '1号机组 / 0米层焊接区', code: 'CAM-A1' },
    { name: '氢能副舱隔离防爆球机 B通道', location: '氢站联络管线阀区', code: 'CAM-B2' },
    { name: '循环水前池深度球机 C通道', location: '受限水池深槽入口', code: 'CAM-C3' },
    { name: '全电厂脱排系统变频室 枪机', location: '高空排烟塔架一排', code: 'CAM-D4' }
  ];

  // Specific risk contents requested by user for auto-rotating list
  const requestedRisks = [
    { tag: '受控动火', desc: '焊接高温及易燃气体极易引发瞬间火灾事故', action: '防爆红外探头持续扫描中' },
    { tag: '受限空间', desc: '深度狭小舱体易产生二氧化碳及缺氧窒息风险', action: '智能防坠负氧检测仪持续在网' },
    { tag: '焊接探伤', desc: '焊接高温及易燃气体极易引发瞬间火灾事故', action: '红外光感侵入雷达警戒开启' }
  ];

  // High-fidelity alerts replica according to screenshots (未带安全帽 异常 / 正常)
  const replicaAlarms = [
    { 
      id: 'AL-122501', 
      title: '未带安全帽', 
      status: '异常', 
      camera: '4#升压站CAM03', 
      time: '12:25:33', 
      person: '赵铁柱', 
      phone: '138****1356',
      confidence: '98.7%',
      model: 'Helmet-PPE-v2.1',
      device: 'HW-IPC-402'
    },
    { 
      id: 'AL-122502', 
      title: '违规拨打电话', 
      status: '异常', 
      camera: '2#氢气瓶库CAM02', 
      time: '13:02:15', 
      person: '李常发', 
      phone: '139****5822',
      confidence: '96.4%',
      model: 'Phone-Detect-v1.8',
      device: 'HW-IPC-209'
    },
    { 
      id: 'AL-122503', 
      title: '受限空间缺氧', 
      status: '异常', 
      camera: '3#排水储罐CAM05', 
      time: '13:14:48', 
      person: '王晓强', 
      phone: '185****9923',
      confidence: '99.1%',
      model: 'Multi-Gas-Shield',
      device: 'IOT-SENS-05'
    },
    { 
      id: 'AL-122504', 
      title: '高空防护挂钩挂脱', 
      status: '异常', 
      camera: '1#烟道平台CAM08', 
      time: '13:25:01', 
      person: '周德华', 
      phone: '176****6612',
      confidence: '95.2%',
      model: 'Fall-Harness-v3.0',
      device: 'HW-IPC-108'
    },
    { 
      id: 'AL-122505', 
      title: '防护物资不合规', 
      status: '异常', 
      camera: '中继配电间CAM06', 
      time: '13:38:12', 
      person: '孙安全', 
      phone: '133****4411',
      confidence: '97.5%',
      model: 'PPE-Standard-v2.0',
      device: 'HW-IPC-606'
    },
    { 
      id: 'AL-122506', 
      title: '现场违规烟火探测', 
      status: '异常', 
      camera: '煤粉制备车间CAM12', 
      time: '13:45:50', 
      person: '郑大明', 
      phone: '159****2356',
      confidence: '98.9%',
      model: 'Flame-Smoke-v3.5',
      device: 'HW-IPC-912'
    },
    { 
      id: 'AL-122507', 
      title: '现场负责人脱岗', 
      status: '异常', 
      camera: '5#循环泵坑CAM09', 
      time: '14:01:22', 
      person: '钱护卫', 
      phone: '180****7788',
      confidence: '94.8%',
      model: 'Duty-Sentry-v1.5',
      device: 'HW-IPC-509'
    },
    { 
      id: 'AL-122508', 
      title: '安全阻碍堆物报警', 
      status: '正常', 
      camera: '主变压器辅区CAM10', 
      time: '14:10:05', 
      person: '吴仓管', 
      phone: '131****8899',
      confidence: '99.5%',
      model: 'Blockage-Pass-v2.2',
      device: 'HW-IPC-310'
    }
  ];

  // Custom helper to dynamically style the ticket card based on risk level and selection state
  const getCardStyle = (ticket: WorkTicket, isSelected: boolean) => {
    const isMajor = ticket.riskLevel === '重大风险';
    const isLarge = ticket.riskLevel === '较大风险';
    
    if (isMajor) {
      return isSelected
        ? 'border-red-500 ring-2 ring-red-100 bg-red-50/10 scale-102 shadow-sm'
        : 'border-red-200 hover:border-red-500 hover:bg-red-50/5 hover:scale-101 bg-white shadow-3xs';
    } else if (isLarge) {
      return isSelected
        ? 'border-amber-500 ring-2 ring-amber-150 bg-amber-50/15 scale-102 shadow-sm'
        : 'border-amber-200 hover:border-amber-500 hover:bg-amber-50/5 hover:scale-101 bg-white shadow-3xs';
    } else {
      return isSelected
        ? 'border-indigo-600 ring-2 ring-indigo-50 scale-102 shadow-sm'
        : 'border-slate-200 hover:border-indigo-300 hover:scale-101 bg-white shadow-3xs';
    }
  };

  const getRiskLabelColor = (level: string) => {
    if (level === '重大风险') return 'bg-rose-50 text-rose-700 border-rose-150';
    if (level === '较大风险') return 'bg-amber-50 text-amber-700 border-amber-150';
    return 'bg-blue-50 text-blue-700 border-blue-150';
  };

  return (
    <div className="flex flex-col space-y-4 flex-1 relative z-10 animate-fade-in" id="total-jobs-supervision-panel">
      {/* Toast Alert popups */}
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-800 text-teal-400 px-4 py-2.5 rounded-xl shadow-lg z-50 text-[11px] font-black tracking-wide flex items-center space-x-2">
          <Activity className="w-4 h-4 text-teal-500 animate-pulse" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Header Row with back button */}
      <div className="flex items-center justify-between border-b border-indigo-150 pb-3" id="supervision-dashboard-header">
        <div className="flex items-center space-x-2.5">
          <button 
            onClick={onBack}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-indigo-700 rounded-lg text-xs font-black transition-all cursor-pointer border border-indigo-100 shadow-3xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>返回安全日报</span>
          </button>
          
          <button
            onClick={() => {
              setIsSidebarExpanded(!isSidebarExpanded);
              triggerToast(isSidebarExpanded ? "已收缩右侧监管指标控制台" : "已展开右侧监管指标控制台");
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-755 hover:text-indigo-700 rounded-lg text-xs font-black transition-all cursor-pointer border border-slate-200 hover:border-indigo-200 shadow-3xs"
            title={isSidebarExpanded ? "点击收缩右侧指标栏" : "点击展开右侧指标栏"}
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-505" />
            <span>{isSidebarExpanded ? "收缩右侧指标" : "展开右侧指标"}</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-800 rounded-md text-[10.5px] font-black tracking-wide border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping mr-1" />
            <span>全电厂今日作业实时智能监管指挥舱</span>
          </span>
        </div>
      </div>

      {/* Grid Container for Layout of Screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" id="supervision-workspace-grid">
        
        {/* LEFT THREE-QUARTER COLUMN: Video Panel & Lower list */}
        <div className={`${isSidebarExpanded ? 'lg:col-span-3' : 'lg:col-span-4'} flex flex-col space-y-4 transition-all duration-300`} id="workspace-west-panel">
          
          {/* VIDEO CAMERA CORE SCREEN WITH CONTROLS */}
          <div className="border border-slate-950 rounded-2xl bg-slate-950 text-white p-1.5 flex flex-col relative" id="live-surveillance-container">
            
            {/* Top Toolbar overlay above mock video frame */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900/60 rounded-t-xl border-b border-slate-800" id="video-bar-head">
              <div className="flex items-center space-x-2 relative">
                <span className="text-[10px] text-slate-400 font-bold">信号通道切换:</span>
                <button
                  onClick={() => setShowCamDropdown(!showCamDropdown)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 hover:text-white px-2.5 py-1 rounded-md text-[10.5px] font-extrabold flex items-center space-x-1 hover:bg-slate-750 transition-colors"
                >
                  <span>{cameraFeeds[activeCamIndex]?.name || '加载首通道...'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                
                {/* Simulated dropdown */}
                <AnimatePresence>
                  {showCamDropdown && (
                    <motion.div 
                      className="absolute top-7 left-16 bg-slate-900 border border-slate-700 rounded-xl shadow-lg z-40 w-56 p-1.5"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                    >
                      {cameraFeeds.map((feed, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setActiveCamIndex(index);
                            setShowCamDropdown(false);
                            triggerToast(`已调阅「${feed.name}」`);
                          }}
                          className={`w-full text-left font-black p-2 rounded-lg text-[9.5px] transition-all flex items-center justify-between ${
                            activeCamIndex === index ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span>{feed.name}</span>
                          <span className="text-[8px] opacity-70 font-mono">{feed.code}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Layout controls (2*2 4*4, etc.) */}
              <div className="flex items-center space-x-1.5" id="layout-toggle-cluster">
                <span className="text-[9.5px] text-slate-400 font-bold mr-1">多画面矩阵:</span>
                {[
                  { keys: '1x1', icon: Eye, label: '全屏模式' },
                  { keys: '2x2', icon: Grid2X2, label: '2*2 画面' },
                  { keys: '4x4', icon: LayoutGrid, label: '4*4 全景' }
                ].map((gridOpt) => (
                  <button
                    key={gridOpt.keys}
                    onClick={() => {
                      setVideoGrid(gridOpt.keys as any);
                      triggerToast(`矩阵格局已重构至: ${gridOpt.label}`);
                    }}
                    className={`px-2 py-1 rounded-md text-[9.5px] font-black transition-all flex items-center space-x-1 ${
                      videoGrid === gridOpt.keys 
                        ? 'bg-blue-600 text-white border border-blue-500' 
                        : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750'
                    }`}
                    title={gridOpt.label}
                  >
                    <gridOpt.icon className="w-3.5 h-3.5" />
                    <span>{gridOpt.keys === '1x1' ? '单屏' : gridOpt.keys === '2x2' ? '2*2' : '4*4'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Live feeds stage */}
            <div className="relative w-full aspect-[2/1] md:aspect-[2.3/1] bg-slate-900 rounded-b-xl overflow-hidden" id="feed-canvas-grid shadow-inner">
              
              {videoGrid === '1x1' && (
                <div className="w-full h-full relative" id="canvas-1x1-view">
                  <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  {/* Outer security radar overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 text-blue-500" viewBox="0 0 800 320" fill="none">
                    <line x1="0" y1="40" x2="800" y2="40" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="400" y1="0" x2="400" y2="320" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="400" cy="160" r="120" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M 280,160 A 120,120 0 0 1 400,40" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" className="animate-pulse" />
                  </svg>

                  {/* Absolute bounding trackers */}
                  {isPlaying && aiDetection && (
                    <>
                      <motion.div 
                        className="absolute border border-cyan-500 bg-cyan-500/10 rounded-lg p-2 text-[8px] shadow-lg"
                        style={{ left: `${trackerPos.x}%`, top: `${trackerPos.y}%`, width: '135px' }}
                        layout
                      >
                        <div className="flex items-center justify-between text-cyan-300 font-extrabold">
                          <span className="truncate">负责人: {selectedTicket.manager}</span>
                          <span className="bg-cyan-600 text-white px-1 py-0.2 rounded scale-90">专人专防</span>
                        </div>
                        <div className="text-[7.5px] text-cyan-400 mt-1 leading-none font-mono">☑ 智能定位: 在位正常</div>
                        <div className="text-[7px] text-slate-300 font-semibold mt-0.5 font-sans">当前防护完好度 99%</div>
                        <div className="bg-cyan-500 h-1.5 w-1.5 rounded-full absolute -top-1 -left-1 animate-pulse" />
                      </motion.div>

                      <motion.div 
                        className="absolute border border-rose-500 bg-rose-500/10 rounded-lg p-2 text-[8px] shadow-lg"
                        style={{ left: `${trackerPos2.x}%`, top: `${trackerPos2.y}%`, width: '135px' }}
                        layout
                      >
                        <div className="flex items-center justify-between text-rose-300 font-extrabold">
                          <span>监护人: {selectedTicket.supervisor || '安全员'}</span>
                          <span className="bg-[#e11d48] text-white px-1 py-0.2 rounded scale-90">临空监控</span>
                        </div>
                        <div className="text-[7.5px] text-rose-400 mt-1 leading-none font-mono">⚠ 在岗履职: 测算中</div>
                        <div className="text-[7.5px] text-yellow-300 font-bold mt-1 animate-pulse">! AI主动保障监护状态</div>
                        <div className="bg-rose-500 h-1.5 w-1.5 rounded-full absolute -top-1 -left-1 animate-ping" />
                      </motion.div>
                    </>
                  )}

                  {/* Overlay central big graphic */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-white/10 font-black text-4xl uppercase tracking-[15px] select-none font-mono text-center">
                      AI 智能监控视频流 <br/>
                      <span className="text-xs tracking-[8px] font-bold text-blue-500/30 font-mono">Live Video Tunnel Stream</span>
                    </div>
                  </div>

                  {/* Header overlay info */}
                  <div className="absolute bottom-4 left-4 bg-slate-950/85 pointer-events-none px-3 py-1.5 border border-slate-800 rounded-xl text-[9px] text-slate-350 font-black space-y-0.5">
                    <div className="flex items-center space-x-1.5 text-teal-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                      <span className="text-white">在线监视主体: {selectedTicket.workContent}</span>
                    </div>
                    <div>安装源: {cameraFeeds[activeCamIndex]?.location} ({selectedTicket.plantName})</div>
                  </div>
                </div>
              )}

              {videoGrid === '2x2' && (
                <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1 bg-slate-950 p-1" id="canvas-2x2-view">
                  {[...Array(4)].map((_, index) => {
                    const matchedTicket = defaultTickets[index % defaultTickets.length] || selectedTicket;
                    return (
                      <div key={index} className="relative bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                        <svg className="absolute inset-0 w-full h-full opacity-10 text-indigo-400" viewBox="0 0 200 100">
                          <rect x="10" y="10" width="180" height="80" rx="4" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                        </svg>

                        {/* Top banner */}
                        <div className="absolute top-1 left-2 bg-black/70 px-1.5 py-0.2 rounded text-[7.5px] text-emerald-400 font-black flex items-center space-x-1">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                          <span>CH #{index + 1} - LNK_OK</span>
                        </div>

                        {/* Middle info text */}
                        <div className="text-center pointer-events-none p-1 shrink-0">
                          <p className="text-[9px] font-extrabold text-blue-300 truncate max-w-[150px]">{matchedTicket.plantName}</p>
                          <p className="text-[7.5px] text-slate-400 truncate max-w-[150px] mt-0.5">{matchedTicket.workContent}</p>
                        </div>

                        {/* Bounding box simulation in miniature */}
                        {isPlaying && aiDetection && (
                          <div 
                            className="absolute border border-emerald-500 bg-emerald-500/10 rounded px-1 text-[6.5px] font-mono text-emerald-300"
                            style={{ top: index === 0 ? '50%' : '20%', left: index === 1 ? '40%' : '50%' }}
                          >
                            <span>AI 穿配齐备</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {videoGrid === '4x4' && (
                <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1.5 bg-slate-980 p-1.5" id="canvas-4x4-view">
                  {[...Array(16)].map((_, index) => {
                    const matchedTicket = defaultTickets[index % defaultTickets.length] || selectedTicket;
                    return (
                      <div key={index} className="relative bg-slate-900 border border-slate-850 rounded-md flex items-center justify-center overflow-hidden">
                        <div className="absolute top-1 left-1 transform scale-90 origin-top-left text-[6px] bg-black/80 px-1 py-0.1 text-slate-400 font-mono">
                          #{index + 1}
                        </div>
                        {/* Tiny target frame */}
                        <div className="text-center p-0.5 scale-90">
                          <p className="text-[7.5px] font-black text-slate-350 truncate max-w-[90px]">{matchedTicket.signer}</p>
                          <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 animate-ping mt-0.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* Video Player overlay lower utility controls bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 py-2 bg-slate-900 text-[11px] text-slate-300 font-black rounded-b-xl border-t border-slate-800 gap-2" id="video-bar-foot">
              <div className="flex items-center space-x-3.5">
                <button 
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    triggerToast(isPlaying ? "三维作业全景安全流已离线挂起" : "三维流信号通道正常锁合");
                  }}
                  className="hover:text-white transition-colors flex items-center space-x-1 cursor-pointer text-slate-200"
                >
                  {isPlaying ? (
                    <>
                      <Square className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>挂断连线</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
                      <span>呼叫网线</span>
                    </>
                  )}
                </button>

                <button 
                  onClick={() => {
                    setAiDetection(!aiDetection);
                    triggerToast(aiDetection ? "5G AI边缘视频深度检测挂起" : "边缘分析模块重捕数据恢复");
                  }}
                  className={`hover:text-white transition-colors flex items-center space-x-1 cursor-pointer ${aiDetection ? 'text-teal-400' : 'text-slate-450'}`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{aiDetection ? '切断全网AI分析' : '加载中控视频AI核实'}</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-slate-500 font-mono text-[9px] hidden md:inline">中控推拉网卡延迟: 11ms</span>
                <button 
                  onClick={() => triggerToast("工作面状态抓图已存档并将指令发布至工作流")}
                  className="hover:text-white text-slate-200 flex items-center space-x-1 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>抓拍画幅</span>
                </button>
                <button 
                  onClick={() => triggerToast("此全网作业流已升级到大屏显示监控模式")}
                  className="hover:text-indigo-400 text-slate-200 cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* LOWER SECTION: Two levels of filters (Company & Risk Level), then corresponding actual work ticket cards below */}
          <div className="space-y-4" id="lower-cards-deck">
            
            {/* Row 1: Company selection list with elegant carousel (and left/right controls) */}
            <div className="bg-slate-50/40 p-2.5 border border-slate-200/60 rounded-xl space-y-2.5 shadow-3xs" id="deck-filter-bar">
              <div className="flex items-center space-x-1.5 relative w-full" id="company-filter-bar-carousel">
                <span className="text-[10.5px] text-slate-550 font-black mr-2 select-none border-r border-slate-200 pr-2 shrink-0">选择单位:</span>
                
                <div className="relative flex-1 overflow-hidden flex items-center pr-1">
                  {/* Left scroll gradient barrier & cursor */}
                  {showLeftArrow && (
                    <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none z-10" />
                  )}
                  {showLeftArrow && (
                    <button
                      onClick={() => handleScrollCompanies('left')}
                      className="absolute left-0.5 z-20 bg-white hover:bg-slate-50 border border-slate-200 p-0.5 rounded-full shadow-sm text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer flex items-center justify-center"
                      title="向左滚动单位"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  )}

                  {/* Horizontal Scroll Track */}
                  <div 
                    ref={companyScrollRef}
                    className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1 w-full"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                  >
                    {companiesList.map((company) => (
                      <button
                        key={company}
                        onClick={() => {
                          setCompanyFilter(company);
                          triggerToast(`已选择单位范围: ${company}`);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[10.5px] font-black tracking-wide border transition-all cursor-pointer shadow-3xs shrink-0 ${
                          companyFilter === company
                            ? 'bg-indigo-600 text-white border-indigo-600 font-extrabold shadow-sm'
                            : 'bg-white text-slate-650 hover:bg-slate-50 border-slate-200 hover:border-slate-350'
                        }`}
                      >
                        {company}
                      </button>
                    ))}
                  </div>

                  {/* Right scroll gradient barrier & cursor */}
                  {showRightArrow && (
                    <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none z-10" />
                  )}
                  {showRightArrow && (
                    <button
                      onClick={() => handleScrollCompanies('right')}
                      className="absolute right-0.5 z-20 bg-white hover:bg-slate-50 border border-slate-200 p-0.5 rounded-full shadow-sm text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer flex items-center justify-center"
                      title="向右滚动单位"
                    >
                      <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2: Risk category selection */}
              <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-200/50 pt-2" id="risk-filter-bar">
                <span className="text-[10.5px] text-slate-550 font-black mr-2 select-none border-r border-slate-200 pr-2">风险等级:</span>
                {[
                  { key: '全部', label: '全部等级' },
                  { key: '重大风险', label: '重大风险作业' },
                  { key: '较大风险', label: '较大风险作业' }
                ].map((btn) => (
                  <button
                    key={btn.key}
                    onClick={() => {
                      setRiskFilter(btn.key as any);
                      triggerToast(`已选择风险筛选: ${btn.label}`);
                    }}
                    className={`px-3 py-1.5 rounded-md text-[10.5px] font-black tracking-wide border transition-all cursor-pointer shadow-3xs flex items-center space-x-1.5 ${
                      riskFilter === btn.key
                        ? btn.key === '重大风险'
                          ? 'bg-rose-600 text-white border-rose-600 font-black'
                          : btn.key === '较大风险'
                          ? 'bg-amber-600 text-white border-amber-600 font-black'
                          : 'bg-slate-700 text-white border-slate-700 font-black'
                        : 'bg-white text-slate-650 hover:bg-slate-50 border-slate-200 hover:border-slate-350'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      btn.key === '重大风险' ? 'bg-rose-500 animate-pulse' : btn.key === '较大风险' ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'
                    }`} />
                    <span>{btn.label}</span>
                  </button>
                ))}

                <span className="ml-auto text-[10px] text-slate-500 font-bold bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md shadow-3xs">
                  当前符合筛选: <b className="text-indigo-650 font-black">{filteredTickets.length}</b> 项作业
                </span>
              </div>
            </div>

            {/* Grid of the actual task/work cards matching the filter options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5" id="filtered-work-tickets-container">
              {filteredTickets.map((ticket) => {
                const isSelected = selectedTicket?.id === ticket.id;
                const isMajor = ticket.riskLevel === '重大风险';
                
                return (
                  <div
                    key={ticket.id}
                    onClick={() => {
                      setSelectedTicket(ticket);
                      triggerToast(`已连线 [${ticket.plantName}] ${ticket.riskLevel} 监控流`);
                    }}
                    className={`rounded-xl p-3 border transition-all text-left flex flex-col justify-between cursor-pointer min-h-[145px] hover:shadow-sm ${
                      isSelected
                        ? isMajor
                          ? 'border-rose-500 bg-rose-50/15 ring-2 ring-rose-100/70 shadow font-extrabold scale-102'
                          : 'border-amber-500 bg-amber-50/15 ring-2 ring-amber-100/70 shadow font-extrabold scale-102'
                        : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:scale-101 shadow-3xs'
                    }`}
                  >
                    {/* Header: Plant Name */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-dashed border-slate-150 min-w-0">
                      <span className="text-[11px] font-black text-slate-800 truncate mr-1.5">
                        {ticket.plantName}
                      </span>
                      <span className="text-[7.5px] text-slate-400 font-mono font-bold shrink-0">
                        {ticket.id}
                      </span>
                    </div>

                    {/* Middle: Work details */}
                    <div className="py-2 flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-[8.5px] font-black text-indigo-505 bg-indigo-50 text-indigo-700 border border-indigo-100 px-1 py-0.2 rounded w-max uppercase truncate leading-none">
                        {ticket.type}
                      </p>
                      <p className="text-[10px] font-black text-slate-700 leading-snug line-clamp-2 mt-1.5" title={ticket.workContent}>
                        {ticket.workContent}
                      </p>
                    </div>

                    {/* Footer: Details & Risk Badge */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-sans">
                      <div className="text-[9.5px] text-slate-500 leading-none truncate mr-1.5">
                        <span className="bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded font-black text-slate-650">
                          👤 负责人:{ticket.manager}
                        </span>
                      </div>
                      
                      <span className={`shrink-0 text-[8px] font-black px-1.5 py-0.5 rounded border flex items-center space-x-1 ${
                        isMajor
                          ? 'bg-rose-50 text-rose-700 border-rose-150'
                          : 'bg-amber-50 text-amber-700 border-amber-150'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${isMajor ? 'bg-rose-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
                        <span>{isMajor ? '重大' : '较大'}</span>
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredTickets.length === 0 && (
                <div className="col-span-full py-8 text-center bg-slate-50 border border-slate-150 rounded-xl">
                  <p className="text-[11.5px] text-slate-450 font-bold">⚠️ 当前筛选条件下暂无在监作业</p>
                  <p className="text-[10px] text-slate-400 mt-1">请重置单位或风险筛选按钮</p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* RIGHT METRICS SIDEBAR COLUMN: Compact flat layout without nested cards */}
        {isSidebarExpanded && (
          <div className="lg:col-span-1" id="workspace-east-panel">
            <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col h-[660px] lg:h-[720px] shadow-sm text-slate-700 font-sans" id="job-metrics-unified-panel">
              <div className="flex flex-col h-full divide-y divide-slate-100 space-y-2.5">
                
                {/* SUB-SECTION 1: 作业信息 (Flat borderless container) */}
                <div className="flex flex-col justify-between overflow-hidden h-[145px] shrink-0 pb-2" id="job-meta-section">
                  <h4 className="text-[11px] font-black text-slate-900 flex items-center tracking-wide uppercase shrink-0 pb-1">
                    <FileText className="w-3.5 h-3.5 text-indigo-600 mr-1.5 shrink-0 animate-pulse" />
                    作业信息
                  </h4>

                  {selectedTicket?.id ? (
                    <div className="space-y-1.5 text-[10px] flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-400 font-bold">负责人:</span>
                        <span className="text-slate-800 font-black truncate max-w-[150px]">
                          {selectedTicket.manager}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-400 font-bold">监护人:</span>
                        <span className="text-indigo-600 font-black truncate max-w-[150px]">
                          {selectedTicket.supervisor || '李安全'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-400 font-bold">作业区域:</span>
                        <span className="text-indigo-700 font-black truncate max-w-[150px]">
                          {selectedTicket.area || '辅机作业段'}
                        </span>
                      </div>
                      <div className="flex flex-col mt-0.5">
                        <span className="text-slate-400 font-bold text-[9px] scale-95 origin-left">作业内容:</span>
                        <p className="text-slate-700 font-bold text-[9.5px] leading-tight line-clamp-2 mt-0.5" title={selectedTicket.workContent}>
                          {selectedTicket.workContent}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-450 italic pt-1 text-center my-auto">请选择电厂卡牌解锁监控流...</p>
                  )}
                </div>

                {/* SUB-SECTION 2: 作业风险提示 (Flat display) */}
                <div className="flex flex-col justify-between overflow-hidden h-[340px] py-1.5 shrink-0" id="job-risks-section">
                  <div className="flex items-center justify-between pb-1 shrink-0">
                    <h4 className="text-[11px] font-black text-slate-900 flex items-center tracking-wide uppercase">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mr-1.5 shrink-0 animate-pulse" />
                      作业风险提示
                    </h4>
                    <span className="text-[7.5px] bg-amber-50 text-amber-700 font-mono px-1.5 py-0.2 rounded border border-amber-100 font-bold">
                      重点防范
                    </span>
                  </div>

                  {/* Stacked list of risks: Light background box with scrollbar or fit */}
                  <div className="overflow-y-auto pr-0.5 space-y-2 mt-1 w-full flex-1 scrollbar-thin">
                    {requestedRisks.map((risk, index) => (
                      <div 
                        key={index} 
                        className="bg-slate-50 border border-slate-150/60 rounded-lg p-2.5 text-[9.5px] font-sans flex flex-col justify-between shadow-3xs"
                      >
                        <div className="flex items-center justify-between font-black pb-1">
                          <span className="px-1.5 py-0.2 bg-red-50 text-red-655 border border-red-150 rounded text-[7.5px] font-black scale-95 origin-left">
                            🔴 {risk.tag}
                          </span>
                          <span className="text-slate-400 text-[8px] font-mono scale-90">核阻 #0{index+1}</span>
                        </div>
                        <p className="text-[10px] font-black text-slate-755 leading-relaxed font-sans line-clamp-2">
                          {risk.desc}
                        </p>
                        <div className="text-[8.5px] text-emerald-700 font-black flex items-center space-x-1 border-t border-slate-150/40 pt-1.5 mt-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                          <span className="truncate">对策: {risk.action}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SUB-SECTION 3: 告警详情 (Compressed, divided flat items) */}
                <div className="flex-1 flex flex-col overflow-hidden pt-2 min-h-0" id="real-time-alarms-section">
                  <div className="flex items-center justify-between pb-1 shrink-0">
                    <h4 className="text-[11px] font-black text-slate-900 flex items-center tracking-wide uppercase">
                      <BellRing className="w-3.5 h-3.5 text-rose-500 mr-1.5 shrink-0 animate-pulse" />
                      告警详情
                    </h4>
                    <span className="text-[7px] bg-red-50 text-red-655 font-extrabold px-1.5 py-0.2 rounded border border-red-150 animate-pulse">
                      实时轮播捕获
                    </span>
                  </div>

                  {/* Grid holding the exact recreated alert list elements - flat design stretching to bottom */}
                  <div className="flex-1 h-0 overflow-hidden relative my-1 w-full bg-slate-50/20 rounded-lg px-1.5" id="real-time-alarms-carousel-wrapper">
                    <div 
                      className="transition-transform duration-500 ease-in-out divide-y divide-slate-100/50"
                      style={{ transform: `translateY(-${alarmOffset * 56}px)` }}
                    >
                      {[...replicaAlarms, ...replicaAlarms].map((alarm, idx) => {
                        const isAbnormal = alarm.status === '异常';
                        return (
                          <div 
                            key={`${alarm.id}-${idx}`} 
                            onClick={() => triggerToast(`已通过无线频段呼叫负责人「${alarm.person}」落实纠正`)}
                            className="flex h-[56px] py-1.5 hover:bg-slate-50/70 transition-all cursor-pointer min-w-0 items-center justify-between"
                          >
                            {/* Snapshot thumbnail view box mock */}
                            <div className="w-[52px] h-[38px] bg-slate-200 rounded relative flex items-center justify-center overflow-hidden mr-2 border border-slate-200/85 shrink-0 select-none">
                              <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-slate-200" />
                              <div className="absolute top-0.5 left-0.5 text-[4px] scale-90 font-mono text-slate-450 z-10 leading-none">CAM03</div>
                              
                              {isAbnormal ? (
                                <div className="absolute border border-red-500 bg-red-500/10 inset-0.5 rounded flex flex-col justify-between p-0.5 animate-pulse">
                                  <span className="text-[4px] scale-75 origin-left bg-red-650 text-white px-0.5 rounded leading-none w-max font-bold">
                                    异常
                                  </span>
                                  <span className="text-[5px] text-red-600 font-mono text-right leading-none font-bold">96%</span>
                                </div>
                              ) : (
                                <div className="absolute border border-emerald-500 bg-emerald-500/10 inset-0.5 rounded flex flex-col justify-between p-0.5">
                                  <span className="text-[4px] scale-75 origin-left bg-emerald-600 text-white px-0.5 rounded leading-none w-max font-bold">
                                    安全
                                  </span>
                                  <span className="text-[5px] text-emerald-600 font-mono text-right leading-none font-bold">99%</span>
                                </div>
                              )}
                            </div>

                            {/* Text detail description with high precision data & whitespace */}
                            <div className="flex-1 flex flex-col justify-between min-w-0 h-full py-0.5 pl-0.5">
                              <div className="flex items-center justify-between pb-0.5 leading-none font-sans">
                                <span className="text-[9.5px] font-black text-slate-800 leading-none truncate">{alarm.title}</span>
                                <span className={`px-1 py-0.2 rounded text-[7px] scale-85 origin-right font-black uppercase tracking-wide border leading-none ${
                                  isAbnormal 
                                    ? 'bg-red-50 border-red-200 text-red-655' 
                                    : 'bg-emerald-50 border-emerald-250 text-emerald-700'
                                }`}>
                                  {alarm.status}
                                </span>
                              </div>

                              {/* Data columns partitioned with high precision telemetry details */}
                              <div className="text-[7.5px] text-slate-400 font-semibold flex flex-wrap items-center gap-x-1 leading-none font-sans mt-0.5">
                                <span className="truncate max-w-[45px] font-black text-slate-700 bg-slate-100 px-1 rounded-sm scale-95 origin-left">{alarm.person}</span>
                                <span className="text-slate-205">|</span>
                                <span className="font-mono text-slate-500 font-bold text-[7px]">{alarm.time}</span>
                                <span className="text-slate-205 md:inline hidden">|</span>
                                <span className="font-black text-indigo-600 bg-indigo-50/70 border border-indigo-100/40 px-1 py-0.2 rounded-sm text-[6.5px] scale-95 origin-left md:inline hidden">
                                  {alarm.confidence || '98%'} AI
                                </span>
                                <span className="text-slate-205 leading-none">|</span>
                                <span className="font-mono text-slate-400 text-[6.5px] scale-90 origin-left truncate max-w-[40px]" title={alarm.model}>
                                  {alarm.model || 'Core-v2'}
                                </span>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* Dynamic Floating Sidebar Triggers when collapsed */}
      {!isSidebarExpanded && (
        <motion.button
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => {
            setIsSidebarExpanded(true);
            triggerToast("控制台已恢复展开");
          }}
          className="fixed right-3 top-1/2 -translate-y-1/2 z-40 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white p-2.5 rounded-l-xl shadow-lg flex flex-col items-center justify-center space-y-1.5 cursor-pointer border-l border-y border-indigo-400 group"
          title="展开监管控制台"
        >
          <ChevronLeft className="w-4 h-4 animate-pulse group-hover:-translate-x-0.5 transition-transform" strokeWidth={3} />
          <span className="text-[9px] font-black tracking-widest [writing-mode:vertical-lr] uppercase leading-none py-1 font-sans">
            展开侧栏
          </span>
        </motion.button>
      )}

    </div>
  );
};

