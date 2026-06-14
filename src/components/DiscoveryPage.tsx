import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, ShieldCheck, Users, HardHat, FileText, Activity, AlertTriangle, 
  MapPin, Clock, ArrowUpRight, CheckCircle2, ChevronRight, X, AlertCircle, 
  Search, Shield, Droplets, Wind, RefreshCw, BarChart2, TrendingUp, Sliders, 
  ChevronDown, ExternalLink, Download, Flame, Send, Award, Camera, Check, Filter, Share2,
  Wrench, Plus, ArrowLeft, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  ComposedChart
} from 'recharts';
import { WorkSupervisionDetail } from './WorkSupervisionDetail';
import { TotalJobsSupervision } from './TotalJobsSupervision';

// ================= CONSTANTS & TYPES =================
interface PowerPlantData {
  id: string;
  name: string;
  // Personnel
  totalOnDuty: number;
  outsourcingCount: number;
  specialWorkers: number;
  expiredCertsCount: number;
  expiredCertsList: { name: string; type: string; daysExpired: number; status: string }[];
  highRiskAreaDuty: { area: string; count: number; alert: boolean }[];
  outsourcingScore: number;
  // Equipment
  majorDefects: number;
  minorDefects: number;
  defectResolutionRate: number;
  unresolvedDefectsList: { id: string; desc: string; dept: string; limit: string; status: string }[];
  forcedShutdowns: number;
  forcedShutdownReasons: { category: string; value: number }[];
  // Environment
  envGases: { point: string; gas: string; value: string; limit: string; status: 'normal' | 'warn' }[];
  civilianIssues: number;
  civilianResolutionRate: number;
  weatherRisk: { level: string; desc: string; shutdownRequired: boolean };
  // AI summary
  aiDailyIndex: number;
  aiBrief: string;
  // Safety department items
  hiddenHazards: { id: string; level: '重大' | '较大' | '一般'; desc: string; plant: string; srcPhoto: string; reporter: string; time: string; status: '未整改' | '督办中' | '已闭环' }[];
  violations: { type: string; count: number; trends: string }[];
  tasks: { name: string; assigned: number; done: number; overdue: number }[];
}

// All real historical and real-time plants data linked to the state
const MOCK_PLANTS_DATA: Record<string, PowerPlantData> = {
  'all': {
    id: 'all',
    name: '全甘肃省汇总',
    totalOnDuty: 14250,
    outsourcingCount: 138,
    specialWorkers: 1240,
    expiredCertsCount: 14,
    expiredCertsList: [
      { name: '中建电力-王志刚', type: '高空作业证', daysExpired: 5, status: '宁县热电厂' },
      { name: '平凉一检-李德厚', type: '焊工特种操作证', daysExpired: 4, status: '平凉发电厂' },
      { name: '兰东运维-刘爱国', type: '起重机械操作证', daysExpired: 3, status: '兰州东热电厂' }
    ],
    highRiskAreaDuty: [
      { area: '1#锅炉房区域', count: 184, alert: true },
      { area: '尿素脱硝危化区', count: 42, alert: false },
      { area: '2#空冷塔内部', count: 18, alert: false },
      { area: '输煤皮带长廊', count: 76, alert: true }
    ],
    outsourcingScore: 91.2,
    majorDefects: 16,
    minorDefects: 124,
    defectResolutionRate: 92.4,
    unresolvedDefectsList: [
      { id: 'DF-0491', desc: '1号锅炉给水主管道防磨瓦磨损穿孔隐患', dept: '锅炉检修部', limit: '2026-06-10', status: '超期未闭环' },
      { id: 'DF-1033', desc: '尿素车间输气罐出口排污阀微量内漏', dept: '热控车间', limit: '2026-06-15', status: '处理中' },
      { id: 'DF-0824', desc: '液氢储罐压力表主控变送信号频发漂移', dept: '电气车间', limit: '2026-06-12', status: '未处理' }
    ],
    forcedShutdowns: 3,
    forcedShutdownReasons: [
      { category: '设备故障', value: 2 },
      { category: '人为异常', value: 0 },
      { category: '环境破坏', value: 1 }
    ],
    envGases: [
      { point: '1#制氢站主泵房', gas: 'H₂', value: '0.12%', limit: '1.0%', status: 'normal' },
      { point: '尿素直喷氨区旁路', gas: 'NH₃', value: '4.8 ppm', limit: '10.0 ppm', status: 'normal' },
      { point: '2#脱硫塔底部出口', gas: 'CO', value: '45 ppm', limit: '150 ppm', status: 'normal' }
    ],
    civilianIssues: 54,
    civilianResolutionRate: 94.4,
    weatherRisk: { level: '黄色雷电预警', desc: '平凉、宁县局部伴随7级阵风及突发冰雹', shutdownRequired: true },
    aiDailyIndex: 94,
    aiBrief: '今日全省并网机组运行安全度良好。外包高风险特种作业特种持证率 100%。一类缺陷未消缺 3 项均已发出二级督办，各生产现场高敏环境检测报警 0 项，未发生非计划停运。',
    hiddenHazards: [
      { id: 'HZ-2026-001', level: '重大', desc: '锅炉房0米磨煤机底部局部电网接地极脱落故障', plant: '宁县热电厂', srcPhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&q=80', reporter: '宁县安监-李安全', time: '2026-06-01 10:20', status: '未整改' },
      { id: 'HZ-2026-002', level: '较大', desc: '6kV配电室主直流后备蓄电池组漏液且欠压运行', plant: '兰州东热电厂', srcPhoto: 'https://images.unsplash.com/photo-1581092162384-8987c1796715?w=500&q=80', reporter: '兰东安监-张德', time: '2026-06-02 09:14', status: '督办中' },
      { id: 'HZ-2026-003', level: '一般', desc: '脱硫区域高空垂直升降梯限位保护开关触头锈死', plant: '平凉发电厂', srcPhoto: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80', reporter: '平凉安监-马奔跑', time: '2026-06-02 11:45', status: '未整改' }
    ],
    violations: [
      { type: '高空作业未系挂安全绳', count: 12, trends: '+2' },
      { type: '动火作业无派单私自施工', count: 1, trends: '-2' },
      { type: '特种车进入临电防溢盲区', count: 8, trends: '+1' },
      { type: '人员跨越隔油池防护栏杆', count: 14, trends: '0' }
    ],
    tasks: [
      { name: '全省春季安全大检查（春检）', assigned: 140, done: 128, overdue: 12 },
      { name: '警示三月行专项反三违整治', assigned: 90, done: 90, overdue: 0 },
      { name: '迎峰度夏高负荷保电治理', assigned: 45, done: 31, overdue: 14 }
    ]
  },
  'ningxian': {
    id: 'ningxian',
    name: '宁县第一热电厂（图中宁厂）',
    totalOnDuty: 3240,
    outsourcingCount: 14,
    specialWorkers: 280,
    expiredCertsCount: 6,
    expiredCertsList: [
      { name: '中建电力-王志刚', type: '高空作业证', daysExpired: 5, status: '宁县热电厂' }
    ],
    highRiskAreaDuty: [
      { area: '1#锅炉房区域', count: 114, alert: true },
      { area: '尿素脱硝危化区', count: 24, alert: false },
      { area: '2#空冷塔内部', count: 8, alert: false },
      { area: '输煤皮带长廊', count: 54, alert: true }
    ],
    outsourcingScore: 84.7,
    majorDefects: 4,
    minorDefects: 32,
    defectResolutionRate: 88.0,
    unresolvedDefectsList: [
      { id: 'DF-0491', desc: '1号锅炉给水主管道防磨瓦磨损穿孔隐患', dept: '锅炉检修部', limit: '2026-06-10', status: '超期未闭环' }
    ],
    forcedShutdowns: 1,
    forcedShutdownReasons: [
      { category: '设备故障', value: 1 },
      { category: '人为异常', value: 0 },
      { category: '环境破坏', value: 0 }
    ],
    envGases: [
      { point: '1#制氢站主泵房', gas: 'H₂', value: '1.24%', limit: '1.0%', status: 'warn' }, // Ultra critical abnormal gas leak!
      { point: '尿素直喷氨区旁路', gas: 'NH₃', value: '3.1 ppm', limit: '10.0 ppm', status: 'normal' },
      { point: '2#脱硫塔底部出口', gas: 'CO', value: '12 ppm', limit: '150 ppm', status: 'normal' }
    ],
    civilianIssues: 18,
    civilianResolutionRate: 90.0,
    weatherRisk: { level: '黄色雷电预警', desc: '本地区今日伴随过境短时狂风，室外架吊装禁行', shutdownRequired: true },
    aiDailyIndex: 86,
    aiBrief: '宁县一厂今日“人员健康得分”偏低，伴有1名高空特种人员证件逾期，及1#制氢站气体H₂实测高标溢出超规定限值，已于10分钟前全省自控台发起紧急警示，需安监督办。',
    hiddenHazards: [
      { id: 'HZ-2026-001', level: '重大', desc: '锅炉房0米磨煤机底部局部电网接地极脱落故障', plant: '宁县热电厂', srcPhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&q=80', reporter: '宁县安监-李安全', time: '2026-06-01 10:20', status: '未整改' }
    ],
    violations: [
      { type: '高空作业未系挂安全绳', count: 6, trends: '+2' },
      { type: '特种车进入临电防溢盲区', count: 3, trends: '+1' },
      { type: '人员跨越隔油池防护栏栏杆', count: 5, trends: '0' }
    ],
    tasks: [
      { name: '全省春季安全大检查（春检）', assigned: 30, done: 25, overdue: 5 },
      { name: '警示三月行专项反三违整治', assigned: 20, done: 20, overdue: 0 },
      { name: '迎峰度夏高负荷保电治理', assigned: 15, done: 9, overdue: 6 }
    ]
  },
  'lanzhou': {
    id: 'lanzhou',
    name: '兰州东热电厂',
    totalOnDuty: 4120,
    outsourcingCount: 42,
    specialWorkers: 390,
    expiredCertsCount: 3,
    expiredCertsList: [
      { name: '兰东运维-刘爱国', type: '起重机械操作证', daysExpired: 3, status: '兰州东热电厂' }
    ],
    highRiskAreaDuty: [
      { area: '1#锅炉房区域', count: 32, alert: false },
      { area: '尿素脱硝危化区', count: 18, alert: false },
      { area: '2#空冷塔内部', count: 6, alert: false },
      { area: '输煤皮带长廊', count: 12, alert: false }
    ],
    outsourcingScore: 94.1,
    majorDefects: 5,
    minorDefects: 44,
    defectResolutionRate: 95.1,
    unresolvedDefectsList: [
      { id: 'DF-1033', desc: '尿素车间输气罐出口排污阀微量内漏', dept: '热控车间', limit: '2026-06-15', status: '处理中' }
    ],
    forcedShutdowns: 1,
    forcedShutdownReasons: [
      { category: '设备故障', value: 0 },
      { category: '人为异常', value: 0 },
      { category: '环境破坏', value: 1 }
    ],
    envGases: [
      { point: '1#制氢站主泵房', gas: 'H₂', value: '0.04%', limit: '1.0%', status: 'normal' },
      { point: '尿素直喷氨区旁路', gas: 'NH₃', value: '8.4 ppm', limit: '10.0 ppm', status: 'normal' },
      { point: '2#脱硫塔底部出口', gas: 'CO', value: '18 ppm', limit: '150 ppm', status: 'normal' }
    ],
    civilianIssues: 16,
    civilianResolutionRate: 98.0,
    weatherRisk: { level: '无气象风险', desc: '微风温和，环保指标优。', shutdownRequired: false },
    aiDailyIndex: 96,
    aiBrief: '兰州东热电厂运行态势稳健。当前缺陷消缺率达 95.1% 领跑省网，设备后备电源蓄电池欠压已派工检修，目前现场作业监护链全闭环。',
    hiddenHazards: [
      { id: 'HZ-2026-002', level: '较大', desc: '6kV配电室主直流后备蓄电池组漏液且欠压运行', plant: '兰州东热电厂', srcPhoto: 'https://images.unsplash.com/photo-1581092162384-8987c1796715?w=500&q=80', reporter: '兰东安监-张德', time: '2026-06-02 09:14', status: '督办中' }
    ],
    violations: [
      { type: '高空作业未系挂安全绳', count: 2, trends: '-1' },
      { type: '特种车进入临电防溢盲区', count: 1, trends: '0' },
      { type: '人员跨越隔油池防护栏栏杆', count: 4, trends: '-1' }
    ],
    tasks: [
      { name: '全省春季安全大检查（春检）', assigned: 45, done: 43, overdue: 2 },
      { name: '警示三月行专项反三违整治', assigned: 30, done: 30, overdue: 0 },
      { name: '迎峰度夏高负荷保电治理', assigned: 15, done: 12, overdue: 3 }
    ]
  },
  'pingliang': {
    id: 'pingliang',
    name: '平凉发电厂',
    totalOnDuty: 6890,
    outsourcingCount: 82,
    specialWorkers: 570,
    expiredCertsCount: 5,
    expiredCertsList: [
      { name: '平凉一检-李德厚', type: '焊工特种操作证', daysExpired: 4, status: '平凉发电厂' }
    ],
    highRiskAreaDuty: [
      { area: '1#锅炉房区域', count: 38, alert: false },
      { area: '尿素脱硝危化区', count: 0, alert: false },
      { area: '2#空冷塔内部', count: 4, alert: false },
      { area: '输煤皮带长廊', count: 10, alert: false }
    ],
    outsourcingScore: 92.5,
    majorDefects: 7,
    minorDefects: 48,
    defectResolutionRate: 91.8,
    unresolvedDefectsList: [
      { id: 'DF-0824', desc: '液氢储罐压力表主控变送信号频发漂移', dept: '电气车间', limit: '2026-06-12', status: '未处理' }
    ],
    forcedShutdowns: 1,
    forcedShutdownReasons: [
      { category: '设备故障', value: 1 },
      { category: '人为异常', value: 0 },
      { category: '环境破坏', value: 0 }
    ],
    envGases: [
      { point: '1#制氢站主泵房', gas: 'H₂', value: '0.01%', limit: '1.0%', status: 'normal' },
      { point: '尿素直喷氨区旁路', gas: 'NH₃', value: '1.5 ppm', limit: '10.0 ppm', status: 'normal' },
      { point: '2#脱硫塔底部出口', gas: 'CO', value: '5 ppm', limit: '150 ppm', status: 'normal' }
    ],
    civilianIssues: 20,
    civilianResolutionRate: 95.0,
    weatherRisk: { level: '大风黄色预警', desc: '风雨交加中，停止一切露天粉尘散料输送，防风锚固已到位。', shutdownRequired: false },
    aiDailyIndex: 93,
    aiBrief: '平凉发电厂环保指标高品质维持。唯春检任务中有2项子检查稍微滞后，需注意按期推进，另高空电梯锈死缺陷已安排承包商今日入场维修。',
    hiddenHazards: [
      { id: 'HZ-2026-003', level: '一般', desc: '脱硫区域高空垂直升降梯限位保护开关触头锈死', plant: '平凉发电厂', srcPhoto: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80', reporter: '平凉安监-马奔跑', time: '2026-06-02 11:45', status: '未整改' }
    ],
    violations: [
      { type: '高空作业未系挂安全绳', count: 4, trends: '+1' },
      { type: '特种车进入临电防溢盲区', count: 4, trends: '0' },
      { type: '人员跨越隔油池防护栏栏杆', count: 5, trends: '+1' }
    ],
    tasks: [
      { name: '全省春季安全大检查（春检）', assigned: 65, done: 60, overdue: 5 },
      { name: '警示三月行专项反三违整治', assigned: 40, done: 40, overdue: 0 },
      { name: '迎峰度夏高负荷保电治理', assigned: 15, done: 10, overdue: 5 }
    ]
  }
};

const RED_BLACK_RATING = [
  { rank: 1, plant: '兰州东热电厂', type: '红榜', score: 96.8, complRate: '98.0%', defSol: '95.1%', safetyRate: '100%', envLevel: '优秀' },
  { rank: 2, plant: '平凉发电厂', type: '红榜', score: 93.4, complRate: '95.0%', defSol: '91.8%', safetyRate: '100%', envLevel: '优秀' },
  { rank: 3, plant: '宁县第一热电厂', type: '黑榜', score: 81.2, complRate: '84.0%', defSol: '88.0%', safetyRate: '92.4%', envLevel: '环保超标' }
];

const EXTRA_METRICS: Record<string, {
  longTermTeams: number;
  shortTermTeams: number;
  workTickets: number;
  yesterdayNewDefects: number;
  smartDevices: { type: string; value: number }[];
  weatherForecast: string;
  weatherDetails: string;
  aiStreams: string[];
  tasksMetrics: { total: number; issued: number; completed: number; overdue: number; running: number; overdueDone: number };
  todayJobs: { total: number; major: number; large: number; normal: number };
  smartAlerts: { behavior: number; equipment: number; environment: number };
}> = {
  all: {
    longTermTeams: 42,
    shortTermTeams: 96,
    workTickets: 327,
    yesterdayNewDefects: 5,
    smartDevices: [
      { type: '安全帽', value: 55 },
      { type: '安全带', value: 30 },
      { type: '训操机器人', value: 15 }
    ],
    weatherForecast: '黄色雷电与河西、陇东过境大风预警，全省户外高空吊装进行省级控制。',
    weatherDetails: '宁县:阵雨 12-24°C | 兰州:多云 19-30°C | 平凉:强大风 15-22°C',
    aiStreams: [
      '【AI安全警哨】15:28:10: 华能宁县第一热电厂1#制氢副主舱 H2 微溢 1.24% 触发强制防爆锁。',
      '【CV违章监控】15:20:05: 平凉发电厂2号送水钢架临时动火人因高空解开扣锁，已发起喇叭驱正。',
      '【环境遥控站】14:15:30: 兰州东热电厂外部受煤皮带由于震动产生1项风偏，派单限时调整扭拉索。'
    ],
    tasksMetrics: { total: 275, issued: 275, completed: 249, overdue: 26, running: 18, overdueDone: 12 },
    todayJobs: { total: 126, major: 8, large: 25, normal: 93 },
    smartAlerts: { behavior: 12, equipment: 3, environment: 1 }
  },
  ningxian: {
    longTermTeams: 5,
    shortTermTeams: 9,
    workTickets: 64,
    yesterdayNewDefects: 2,
    smartDevices: [
      { type: '安全帽', value: 60 },
      { type: '安全带', value: 25 },
      { type: '训操机器人', value: 15 }
    ],
    weatherForecast: '黄色雷电大风雨警告对挂，室外露天高空架、临边操作停工并硬锁机架。',
    weatherDetails: '宁县第一热电厂: 阵雷电大雨 12-24°C',
    aiStreams: [
      '【环境遥感端】15:28:10: 气敏传感器遥测 H2 实测达 1.24% 处于超标值，已向厂监部推送。',
      '【安全双防线】13:45:12: 核查有1名中建资质的高空特地作业人员证件超时，自动禁止门卡。'
    ],
    tasksMetrics: { total: 65, issued: 65, completed: 50, overdue: 15, running: 6, overdueDone: 4 },
    todayJobs: { total: 24, major: 1, large: 5, normal: 18 },
    smartAlerts: { behavior: 5, equipment: 1, environment: 1 }
  },
  lanzhou: {
    longTermTeams: 15,
    shortTermTeams: 27,
    workTickets: 112,
    yesterdayNewDefects: 1,
    smartDevices: [
      { type: '安全帽', value: 50 },
      { type: '安全带', value: 35 },
      { type: '训操机器人', value: 15 }
    ],
    weatherForecast: '无红线微气候大风灾情，环保参数维持全陇网绿色优秀值。',
    weatherDetails: '兰州东热电厂: 晴间多云 19-30°C',
    aiStreams: [
      '【设备自防线】14:15:30: 后备6kV配电室DC直流母线欠压漂移，主控已发出二级限时检卡。',
      '【巡检防漏扫】11:15:40: 监控提醒制粉段死角有漏扫轨迹，智能调低该班组本项周对标考核。'
    ],
    tasksMetrics: { total: 90, issued: 90, completed: 85, overdue: 5, running: 4, overdueDone: 3 },
    todayJobs: { total: 42, major: 3, large: 9, normal: 30 },
    smartAlerts: { behavior: 3, equipment: 1, environment: 0 }
  },
  pingliang: {
    longTermTeams: 22,
    shortTermTeams: 60,
    workTickets: 151,
    yesterdayNewDefects: 2,
    smartDevices: [
      { type: '安全帽', value: 53 },
      { type: '安全带', value: 32 },
      { type: '训操机器人', value: 15 }
    ],
    weatherForecast: '大风黄色警戒，平凉连带微阵风7级以上限制全部高层露天吊装。',
    weatherDetails: '平凉发电厂: 强阵风转阵雨 15-22°C',
    aiStreams: [
      '【特种机监控】11:32:15: 脱硫空升机电磁安全限速开关由于风潮微锈，自动断电锁闸挂牌。',
      '【CV违章识别】10:10:45: AI发现脱硝临电一侧有非配准班组人员靠近泄槽，喇叭联动发出驱离音。'
    ],
    tasksMetrics: { total: 120, issued: 120, completed: 114, overdue: 6, running: 8, overdueDone: 5 },
    todayJobs: { total: 60, major: 4, large: 11, normal: 45 },
    smartAlerts: { behavior: 4, equipment: 1, environment: 0 }
  }
};

export default function DiscoveryPage() {
  const [currentPlantId, setCurrentPlantId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'leader' | 'safety_dept'>('leader');
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState<boolean>(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState<boolean>(false);
  
  // Interactive Live states for supervising (Major Defects)
  const [supervisions, setSupervisions] = useState<Record<string, string>>({});
  const [activeSupervisingDefect, setActiveSupervisingDefect] = useState<any | null>(null);
  const [supervisionMemo, setSupervisionMemo] = useState('');
  const [supervisionSuccessMsg, setSupervisionSuccessMsg] = useState('');

  // Interactive states for inspecting Hazard Source photos (穿透溯源)
  const [activeInspectingHazard, setActiveInspectingHazard] = useState<any | null>(null);

  // Daily report generation dynamic modal state
  const [showDailyReportModal, setShowDailyReportModal] = useState(false);
  const [reportExporting, setReportExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Drilled down level viewer modal
  const [drillDownLevel, setDrillDownLevel] = useState<any | null>(null);

  // Selected management safety metric for middle column drilldown analysis
  const [drilldownManagementMetric, setDrilldownManagementMetric] = useState<string | null>(null);
  const [selectedSupervisionTicket, setSelectedSupervisionTicket] = useState<any | null>(null);
  const [managementSearchQuery, setManagementSearchQuery] = useState('');
  const [managementPlantFilter, setManagementPlantFilter] = useState('all');
  const [managementRiskFilter, setManagementRiskFilter] = useState('all');
  const [managementStatusFilter, setManagementStatusFilter] = useState('all');

  // Work tickets for various power plants (for Management Essential Safety drilldown)
  const managementWorkTickets = useMemo(() => {
    return [
      { id: 'NX-WT-20260608-01', plantId: 'ningxian', plantName: '宁县第一热电厂', type: '电电第一种工作票', workContent: '1#制氢副主舱气体 H2 微漏点排查及副密封圈更换', riskLevel: '重大风险', riskColor: 'bg-rose-50 text-rose-700 border-rose-150', signer: '孙明', permitter: '周超', status: '运行中', time: '06-08 08:30 ~ 17:30' },
      { id: 'NX-WT-20260608-02', plantId: 'ningxian', plantName: '宁县第一热电厂', type: '热机第一种工作票', workContent: '4号机组给水泵密封水冷却器高压水冲洗', riskLevel: '一般风险', riskColor: 'bg-slate-50 text-slate-700 border-slate-150', signer: '孙明', permitter: '郑伟', status: '已终结', time: '06-08 09:00 ~ 15:30' },
      { id: 'NX-WT-20260608-03', plantId: 'ningxian', plantName: '宁县第一热电厂', type: '一级动火工作票', workContent: '2#氢站汇流排联络管特种氩弧气化焊接', riskLevel: '重大风险', riskColor: 'bg-rose-50 text-rose-700 border-rose-150', signer: '高建国', permitter: '吴勇', status: '审签中', time: '06-08 14:00 ~ 18:00' },
      
      { id: 'PL-WT-20260608-01', plantId: 'pingliang', plantName: '平凉发电厂', type: '电气第一种工作票', workContent: '110kV 平正线1124隔离开关底座绝缘子更换', riskLevel: '重大风险', riskColor: 'bg-rose-50 text-rose-700 border-rose-150', signer: '张伟', permitter: '李强', status: '运行中', time: '06-08 06:00 ~ 14:00' },
      { id: 'PL-WT-20260608-02', plantId: 'pingliang', plantName: '平凉发电厂', type: '热机第一种工作票', workContent: '3号锅炉B磨煤机主轴承高压稀油站管道检修', riskLevel: '较大风险', riskColor: 'bg-amber-50 text-amber-700 border-amber-150', signer: '陈杰', permitter: '王胜', status: '运行中', time: '06-08 08:00 ~ 18:00' },
      { id: 'PL-WT-20260608-03', plantId: 'pingliang', plantName: '平凉发电厂', type: '受限空间特种工作票', workContent: '2#循环水泵进水前池内部泥沙高压水清理', riskLevel: '重大风险', riskColor: 'bg-rose-50 text-rose-700 border-rose-150', signer: '赵刚', permitter: '刘明', status: '运行中', time: '06-08 08:30 ~ 17:30' },
      { id: 'PL-WT-20260608-04', plantId: 'pingliang', plantName: '平凉发电厂', type: '二级动火工作票', workContent: '4#锅炉制粉管道落煤斗外部加强筋局部补强焊接', riskLevel: '一般风险', riskColor: 'bg-slate-50 text-slate-700 border-slate-150', signer: '刘新', permitter: '周兵', status: '已终结', time: '06-08 10:00 ~ 16:00' },
      
      { id: 'LZ-WT-20260608-01', plantId: 'lanzhou', plantName: '兰州东热电厂', type: '水力第二种工作票', workContent: '2#脱硫塔循环泵B出口电动调节阀控制线路改造', riskLevel: '较大风险', riskColor: 'bg-amber-50 text-amber-700 border-amber-150', signer: '钱磊', permitter: '郭鹏', status: '运行中', time: '06-08 09:00 ~ 17:00' },
      { id: 'LZ-WT-20260608-02', plantId: 'lanzhou', plantName: '兰州东热电厂', type: '热机第二种工作票', workContent: '5号低压给水加热器抽汽逆止门控制气缸自校检', riskLevel: '一般风险', riskColor: 'bg-slate-50 text-slate-700 border-slate-150', signer: '高峰', permitter: '马涛', status: '已终结', time: '06-08 08:30 ~ 12:00' },
      { id: 'LZ-WT-20260608-03', plantId: 'lanzhou', plantName: '兰州东热电厂', type: '高处作业特种工作票', workContent: '全厂主蒸汽输送支架5号塔架伸缩缝绝缘层修复', riskLevel: '重大风险', riskColor: 'bg-rose-50 text-rose-700 border-rose-150', signer: '钱磊', permitter: '马涛', status: '审签中', time: '06-08 13:30 ~ 18:00' },

      { id: 'JY-WT-20260608-01', plantId: 'jingyuan', plantName: '靖远热电厂', type: '电气第二种工作票', workContent: '厂用6kV一段母线避雷器及电压互感器预防性试验', riskLevel: '较大风险', riskColor: 'bg-amber-50 text-amber-700 border-amber-150', signer: '王林', permitter: '陈强', status: '已终结', time: '06-08 07:30 ~ 11:30' },
      { id: 'JY-WT-20260608-02', plantId: 'jingyuan', plantName: '靖远热电厂', type: '热机第一种工作票', workContent: '凝汽器机组循环管网反冲洗隔离门法兰密封更换', riskLevel: '重大风险', riskColor: 'bg-rose-50 text-rose-700 border-rose-150', signer: '胡海', permitter: '徐鹏', status: '运行中', time: '06-08 08:30 ~ 17:30' },

      { id: 'ZN-WT-20260608-01', plantId: 'zhengning', plantName: '正宁发电厂', type: '第一种工作票', workContent: '送粉管道给煤机法兰结合面防漏垫片批量更换', riskLevel: '较大风险', riskColor: 'bg-amber-50 text-amber-700 border-amber-150', signer: '李小文', permitter: '郭华', status: '运行中', time: '06-08 08:30 ~ 17:30' },
      { id: 'ZN-WT-20260608-02', plantId: 'zhengning', plantName: '正宁发电厂', type: '一级动火工作票', workContent: '5号油罐区泡沫发生器法兰腐蚀点特种切割补焊', riskLevel: '重大风险', riskColor: 'bg-rose-50 text-rose-700 border-rose-150', signer: '王强', permitter: '郭华', status: '运行中', time: '06-08 09:00 ~ 17:00' }
    ];
  }, []);

  const filteredManagementTickets = useMemo(() => {
    return managementWorkTickets.filter(ticket => {
      // 仅展示重大风险和较大风险
      const isCriticalRisk = ticket.riskLevel === '重大风险' || ticket.riskLevel === '较大风险';
      if (!isCriticalRisk) return false;

      const matchesSearch = 
        ticket.id.toLowerCase().includes(managementSearchQuery.toLowerCase()) ||
        ticket.workContent.toLowerCase().includes(managementSearchQuery.toLowerCase()) ||
        ticket.type.toLowerCase().includes(managementSearchQuery.toLowerCase()) ||
        ticket.signer.toLowerCase().includes(managementSearchQuery.toLowerCase()) ||
        ticket.permitter.toLowerCase().includes(managementSearchQuery.toLowerCase());
      
      const matchesPlant = managementPlantFilter === 'all' || ticket.plantId === managementPlantFilter;
      const matchesRisk = managementRiskFilter === 'all' || ticket.riskLevel === managementRiskFilter;
      const matchesStatus = managementStatusFilter === 'all' || ticket.status === managementStatusFilter;
      
      return matchesSearch && matchesPlant && matchesRisk && matchesStatus;
    });
  }, [managementWorkTickets, managementSearchQuery, managementPlantFilter, managementRiskFilter, managementStatusFilter]);

  const plantMajorRiskTickets = useMemo(() => {
    return managementWorkTickets.filter(t => 
      (managementPlantFilter === 'all' || t.plantId === managementPlantFilter) && t.riskLevel === '重大风险'
    );
  }, [managementWorkTickets, managementPlantFilter]);

  const plantLargeRiskTickets = useMemo(() => {
    return managementWorkTickets.filter(t => 
      (managementPlantFilter === 'all' || t.plantId === managementPlantFilter) && t.riskLevel === '较大风险'
    );
  }, [managementWorkTickets, managementPlantFilter]);

  const [violationTimeframe, setViolationTimeframe] = useState<'day' | 'month'>('day');

  const managementRiskData = useMemo(() => {
    const config: Record<string, {
      aiViolationText: string;
      violationsDay: { name: string; 违章数: number; 已整改: number; 整改率: number }[];
      violationsMonth: { name: string; 违章数: number; 已整改: number; 整改率: number }[];
      hiddenDangers: {
        problems: number;
        rectified: number;
        shouldRectification: number;
        ratio: number;
        barData: { label: string; count: number; maxCount: number; color: string }[];
      };
    }> = {
      all: {
        aiViolationText: '今日共查处违章 12 起（含管理类 10 项、行为类 2 项），其中厂领导发现查处 3 起，中层管理人员发现查处 7 起，即时整改率 95%。',
        violationsDay: [
          { name: '管理违章', 违章数: 12, 已整改: 10, 整改率: 83.3 },
          { name: '装置违章', 违章数: 8, 已整改: 8, 整改率: 100 },
          { name: '行为违章', 违章数: 5, 已整改: 4, 整改率: 80 },
          { name: '承包商违章', 违章数: 10, 已整改: 9, 整改率: 90 },
        ],
        violationsMonth: [
          { name: '管理违章', 违章数: 1200, 已整改: 1050, 整改率: 87.5 },
          { name: '装置违章', 违章数: 850, 已整改: 810, 整改率: 95.3 },
          { name: '行为违章', 违章数: 450, 已整改: 410, 整改率: 91.1 },
          { name: '承包商违章', 违章数: 980, 已整改: 920, 整改率: 93.8 },
        ],
        hiddenDangers: {
          problems: 13843,
          rectified: 1530,
          shouldRectification: 2246,
          ratio: 70,
          barData: [
            { label: '一般隐患', count: 4524, maxCount: 5000, color: 'bg-emerald-500' },
            { label: 'I级较大', count: 200, maxCount: 5000, color: 'bg-indigo-500' },
            { label: 'II级较大', count: 150, maxCount: 5000, color: 'bg-sky-500' },
            { label: '重大隐患', count: 50, maxCount: 5000, color: 'bg-rose-500' },
          ]
        }
      },
      ningxian: {
        aiViolationText: '今日共查处违章 4 起（含管理类 3 项、行为类 1 项），其中厂领导发现查处 1 起，中层管理人员发现查处 2 起，即时整改率 100%。',
        violationsDay: [
          { name: '管理违章', 违章数: 3, 已整改: 3, 整改率: 100 },
          { name: '装置违章', 违章数: 2, 已整改: 2, 整改率: 100 },
          { name: '行为违章', 违章数: 1, 已整改: 1, 整改率: 100 },
          { name: '承包商违章', 违章数: 3, 已整改: 3, 整改率: 100 },
        ],
        violationsMonth: [
          { name: '管理违章', 违章数: 250, 已整改: 210, 整改率: 84 },
          { name: '装置违章', 违章数: 180, 已整改: 175, 整改率: 97 },
          { name: '行为违章', 违章数: 90, 已整改: 85, 整改率: 94 },
          { name: '承包商违章', 违章数: 210, 已整改: 200, 整改率: 95 },
        ],
        hiddenDangers: {
          problems: 2854,
          rectified: 320,
          shouldRectification: 480,
          ratio: 66.7,
          barData: [
            { label: '一般隐患', count: 950, maxCount: 1000, color: 'bg-emerald-500' },
            { label: 'I级较大', count: 40, maxCount: 1000, color: 'bg-indigo-500' },
            { label: 'II级较大', count: 30, maxCount: 1000, color: 'bg-sky-500' },
            { label: '重大隐患', count: 10, maxCount: 1000, color: 'bg-rose-500' },
          ]
        }
      },
      pingliang: {
        aiViolationText: '今日共查处违章 3 起（含管理类 2 项、行为类 1 项），其中厂领导发现查处 1 起，中层管理人员发现查处 2 起，即时整改率 93%。',
        violationsDay: [
          { name: '管理违章', 违章数: 2, 已整改: 2, 整改率: 100 },
          { name: '装置违章', 违章数: 2, 已整改: 1, 整改率: 50 },
          { name: '行为违章', 违章数: 1, 已整改: 1, 整改率: 100 },
          { name: '承包商违章', 违章数: 3, 已整改: 3, 整改率: 100 },
        ],
        violationsMonth: [
          { name: '管理违章', 违章数: 310, 已整改: 280, 整改率: 90 },
          { name: '装置违章', 违章数: 220, 已整改: 210, 整改率: 95 },
          { name: '行为违章', 违章数: 120, 已整改: 110, 整改率: 91 },
          { name: '承包商违章', 违章数: 240, 已整改: 225, 整改率: 93 },
        ],
        hiddenDangers: {
          problems: 3422,
          rectified: 412,
          shouldRectification: 588,
          ratio: 70,
          barData: [
            { label: '一般隐患', count: 1150, maxCount: 1200, color: 'bg-emerald-500' },
            { label: 'I级较大', count: 55, maxCount: 1200, color: 'bg-indigo-500' },
            { label: 'II级较大', count: 42, maxCount: 1200, color: 'bg-sky-500' },
            { label: '重大隐患', count: 12, maxCount: 1200, color: 'bg-rose-500' },
          ]
        }
      },
      lanzhou: {
        aiViolationText: '今日共查处违章 2 起（含管理类 2 项、行为类 0 项），其中厂领导发现查处 0 起，中层管理人员发现查处 1 起，即时整改率 100%。',
        violationsDay: [
          { name: '管理违章', 违章数: 2, 已整改: 2, 整改率: 100 },
          { name: '装置违章', 违章数: 1, 已整改: 1, 整改率: 100 },
          { name: '行为违章', 违章数: 0, 已整改: 0, 整改率: 100 },
          { name: '承包商违章', 违章数: 2, 已整改: 2, 整改率: 100 },
        ],
        violationsMonth: [
          { name: '管理违章', 违章数: 180, 已整改: 160, 整改率: 88.8 },
          { name: '装置违章', 违章数: 140, 已整改: 135, 整改率: 96.4 },
          { name: '行为违章', 违章数: 70, 已整改: 62, 整改率: 88.5 },
          { name: '承包商违章', 违章数: 160, 已整改: 152, 整改率: 95 },
        ],
        hiddenDangers: {
          problems: 2130,
          rectified: 265,
          shouldRectification: 348,
          ratio: 76.1,
          barData: [
            { label: '一般隐患', count: 680, maxCount: 800, color: 'bg-emerald-500' },
            { label: 'I级较大', count: 30, maxCount: 800, color: 'bg-indigo-500' },
            { label: 'II级较大', count: 22, maxCount: 800, color: 'bg-sky-500' },
            { label: '重大隐患', count: 8, maxCount: 800, color: 'bg-rose-500' },
          ]
        }
      },
      jingyuan: {
        aiViolationText: '今日共查处违章 2 起（含管理类 2 项、行为类 0 项），其中厂领导发现查处 1 起，中层管理人员发现查处 1 起，即时整改率 90%。',
        violationsDay: [
          { name: '管理违章', 违章数: 2, 已整改: 1, 整改率: 50 },
          { name: '装置违章', 违章数: 1, 已整改: 1, 整改率: 100 },
          { name: '行为违章', 违章数: 1, 已整改: 1, 整改率: 100 },
          { name: '承包商违章', 违章数: 2, 已整改: 2, 整改率: 100 },
        ],
        violationsMonth: [
          { name: '管理违章', 违章数: 240, 已整改: 200, 整改率: 83.3 },
          { name: '装置违章', 违章数: 160, 已整改: 145, 整改率: 90.6 },
          { name: '行为违章', 违章数: 80, 已整改: 72, 整改率: 90 },
          { name: '承包商违章', 违章数: 190, 已整改: 178, 整改率: 93.6 },
        ],
        hiddenDangers: {
          problems: 2912,
          rectified: 288,
          shouldRectification: 430,
          ratio: 67,
          barData: [
            { label: '一般隐患', count: 844, maxCount: 1000, color: 'bg-emerald-500' },
            { label: 'I级较大', count: 35, maxCount: 1000, color: 'bg-indigo-500' },
            { label: 'II级较大', count: 26, maxCount: 1000, color: 'bg-sky-500' },
            { label: '重大隐患', count: 10, maxCount: 1000, color: 'bg-rose-500' },
          ]
        }
      },
      zhengning: {
        aiViolationText: '今日共查处违章 1 起（含管理类 1 项、行为类 0 项），其中厂领导发现查处 0 起，中层管理人员发现查处 1 起，即时整改率 100%。',
        violationsDay: [
          { name: '管理违章', 违章数: 1, 已整改: 1, 整改率: 100 },
          { name: '装置违章', 违章数: 1, 已整改: 1, 整改率: 100 },
          { name: '行为违章', 违章数: 1, 已整改: 1, 整改率: 100 },
          { name: '承包商违章', 违章数: 1, 已整改: 1, 整改率: 100 },
        ],
        violationsMonth: [
          { name: '管理违章', 违章数: 220, 已整改: 190, 整改率: 86.3 },
          { name: '装置违章', 违章数: 150, 已整改: 140, 整改率: 93.3 },
          { name: '行为违章', 违章数: 90, 已整改: 81, 整改率: 90 },
          { name: '承包商违章', 违章数: 180, 已整改: 165, 整改率: 91.6 },
        ],
        hiddenDangers: {
          problems: 2525,
          rectified: 245,
          shouldRectification: 400,
          ratio: 61.2,
          barData: [
            { label: '一般隐患', count: 700, maxCount: 900, color: 'bg-emerald-500' },
            { label: 'I级较大', count: 40, maxCount: 900, color: 'bg-indigo-500' },
            { label: 'II级较大', count: 30, maxCount: 900, color: 'bg-sky-500' },
            { label: '重大隐患', count: 12, maxCount: 900, color: 'bg-rose-500' },
          ]
        }
      }
    };

    return config[managementPlantFilter] || config.all;
  }, [managementPlantFilter]);

  // Selected personnel safety metric for middle column drilldown analysis
  const [drilldownPersonMetric, setDrilldownPersonMetric] = useState<string | null>(null);
  const [activeMetricInAll, setActiveMetricInAll] = useState<'totalOnDuty' | 'outsourcingCount' | 'workTickets' | 'longTermTeams' | 'shortTermTeams'>('totalOnDuty');

  const drilldownData = useMemo(() => {
    if (!drilldownPersonMetric) return [];
    
    const names = [
      '正宁发电公司',
      '平凉发电公司',
      '西固热电公司',
      '靖远热电公司',
      '景泰热电公司',
      '兰州热电公司',
      '连城发电公司',
      '甘谷发电公司'
    ];
    
    const valuesMap: Record<string, number[]> = {
      totalOnDuty: [2450, 2800, 1350, 1900, 1200, 1650, 1500, 1400],
      outsourcingCount: [24, 28, 12, 18, 11, 17, 15, 13],
      workTickets: [58, 65, 31, 44, 26, 40, 35, 28],
      longTermTeams: [8, 10, 4, 5, 3, 5, 4, 3],
      shortTermTeams: [17, 22, 8, 13, 7, 12, 10, 7]
    };
    
    const unitsMap: Record<string, string> = {
      totalOnDuty: '人',
      outsourcingCount: '家',
      workTickets: '张',
      longTermTeams: '支',
      shortTermTeams: '支'
    };
    
    const colorsMap: Record<string, string> = {
      totalOnDuty: '#3b82f6',
      outsourcingCount: '#eab308',
      workTickets: '#8b5cf6',
      longTermTeams: '#10b981',
      shortTermTeams: '#06b6d4'
    };
    
    const statuses = [
      '双轨基建与主变技改期',
      '春检机架消缺关键期',
      '热电负荷稳态保电期',
      '2#脱硫塔大修与环保倒查',
      '调频顶峰轻负荷平稳期',
      '省会中心高负荷保供电',
      '春检收尾消缺冲刺期',
      '低排放稳态监护期'
    ];

    const vals = valuesMap[drilldownPersonMetric] || [];
    const unit = unitsMap[drilldownPersonMetric] || '';
    const color = colorsMap[drilldownPersonMetric] || '#4f46e5';

    return names.map((name, i) => ({
      name,
      value: vals[i] || 0,
      unit,
      status: statuses[i] || '安全平稳运行',
      color
    }));
  }, [drilldownPersonMetric]);

  const drilldownTotalVal = useMemo(() => {
    return drilldownData.reduce((acc, d) => acc + d.value, 0);
  }, [drilldownData]);
  
  const drilldownMetricLabel = useMemo(() => {
    const labelsMap: Record<string, string> = {
      totalOnDuty: '在岗总人数',
      outsourcingCount: '承包商数量',
      workTickets: '工作票数量',
      longTermTeams: '长期队伍数量',
      shortTermTeams: '短期队伍数量'
    };
    return labelsMap[drilldownPersonMetric || ''] || '';
  }, [drilldownPersonMetric]);

  // Selected device safety metric for middle column drilldown analysis
  const [drilldownDeviceMetric, setDrilldownDeviceMetric] = useState<string | null>(null);
  const [activeDeviceMetricInAll, setActiveDeviceMetricInAll] = useState<'totalDefects' | 'majorDefects' | 'minorDefects' | 'yesterdayNewDefects' | 'defectResolutionRate'>('totalDefects');
  const [activeSmartMetricInAll, setActiveSmartMetricInAll] = useState<'smartHelmet' | 'smartBelt' | 'smartRobot'>('smartHelmet');

  const drilldownDeviceData = useMemo(() => {
    if (!drilldownDeviceMetric) return [];
    
    const names = [
      '正宁发电公司',
      '平凉发电公司',
      '西固热电公司',
      '靖远热电公司',
      '景泰热电公司',
      '兰州热电公司',
      '连城发电公司',
      '甘谷发电公司'
    ];
    
    const valuesMap: Record<string, number[]> = {
      totalDefects: [50, 68, 25, 42, 19, 36, 30, 24],
      majorDefects: [12, 18, 5, 8, 3, 6, 7, 4],
      minorDefects: [38, 50, 20, 34, 16, 30, 23, 20],
      yesterdayNewDefects: [4, 6, 2, 3, 1, 2, 2, 1],
      defectResolutionRate: [88, 92, 85, 90, 84, 89, 86, 85],
      smartHelmet: [142, 185, 96, 120, 58, 110, 85, 75],
      smartBelt: [85, 82, 90, 88, 86, 92, 84, 88],
      smartRobot: [4, 6, 2, 3, 1, 3, 2, 2]
    };
    
    const unitsMap: Record<string, string> = {
      totalDefects: '项',
      majorDefects: '项',
      minorDefects: '项',
      yesterdayNewDefects: '项',
      defectResolutionRate: '%',
      smartHelmet: '顶',
      smartBelt: '%',
      smartRobot: '台'
    };
    
    const colorsMap: Record<string, string> = {
      totalDefects: '#ef4444',
      majorDefects: '#dc2626',
      minorDefects: '#fbbf24',
      yesterdayNewDefects: '#0284c7',
      defectResolutionRate: '#059669',
      smartHelmet: '#4f46e5',
      smartBelt: '#06b6d4',
      smartRobot: '#10b981'
    };
    
    const statusesMap: Record<string, string[]> = {
      smartHelmet: [
        '登高作业安全佩戴率 100%，红外心率无线组网正常',
        '高处行走临空防滑姿态及声光定位告警通过自检',
        '巡检作业组信号完好，电池荷电状态（SOC）92%',
        '超高微电磁对讲系统信道测试正常，语音通畅',
        '高空下坠震荡缓冲评估系统电池容量优秀',
        '电厂现场实名定位模组在网侦测校验通过',
        '受限空间施工特种安全帽静电力警示运行中',
        '高空绝缘电阻防护检测定位频偏补偿在网'
      ],
      smartBelt: [
        '双防坠锁钩全状态监测，无线电磁反馈灵敏度良好',
        '百米级挂点位置无线指示告警设备正常闭环',
        '调峰二期平台双锁扣交替挂扣感应自检100%',
        '省公司抽查机组高空跨网拉力监测在网率100%',
        '特种临边钢架作业气垫缓冲及锁死机构正常',
        '汽机机壳检修面防护绳索悬吊感应完好',
        '灰场皮带传送廊架临边临空落物防护网架测试中',
        '柔性受拉力动态参数分析设备反馈标定达标'
      ],
      smartRobot: [
        '主厂房1F/2F特种轨道红外热点搜寻正常轮班巡视',
        '主变高压设备表面温差异常声音模式识别正常',
        '地下泵房及地沟危险溢流物动态激光雷达连续检测',
        '输煤走廊明火及有毒有害气体激光光谱浓度测定',
        '特高压输电走廊及配电屏智能红外温升读取良好',
        '脱硫脱硝系统气体巡检激光传感器遥测通过',
        '主备用送风机轴温振动频段声纹录入分析中',
        '储灰场及卸煤面明火光离子巡检终端正常'
      ]
    };

    const statuses = statusesMap[drilldownDeviceMetric] || [
      '炉侧磨煤机震动偏高，实施精密点检中',
      '在役主变温度微震监测异常整改阶段',
      '输煤二期卸煤机钢丝绳更换调试期',
      '3#闭式冷却水泵密封环渗漏消缺工单推进',
      '一期除灰空压机管道阀门防腐补漏中',
      '供热母管流量差调置闭环校准进行中',
      '250kV升压站隔离开关接触电阻调优',
      '脱硫真空泵皮带涨紧力偏高重设校准'
    ];

    const vals = valuesMap[drilldownDeviceMetric] || [];
    const unit = unitsMap[drilldownDeviceMetric] || '';
    const color = colorsMap[drilldownDeviceMetric] || '#ef4444';

    return names.map((name, i) => ({
      name,
      value: vals[i] || 0,
      unit,
      status: statuses[i] || '设备正常消缺',
      color
    }));
  }, [drilldownDeviceMetric]);

  const drilldownDeviceTotalVal = useMemo(() => {
    if (drilldownDeviceMetric === 'defectResolutionRate' || drilldownDeviceMetric === 'smartBelt') {
      const sum = drilldownDeviceData.reduce((acc, d) => acc + d.value, 0);
      return Math.round(sum / (drilldownDeviceData.length || 1));
    }
    return drilldownDeviceData.reduce((acc, d) => acc + d.value, 0);
  }, [drilldownDeviceData, drilldownDeviceMetric]);
  
  const drilldownDeviceMetricLabel = useMemo(() => {
    const labelsMap: Record<string, string> = {
      totalDefects: '缺陷总数量',
      majorDefects: '一类重大缺陷数',
      minorDefects: '二类一般缺陷数',
      yesterdayNewDefects: '昨日新增缺陷数',
      defectResolutionRate: '设备消缺治理率',
      smartHelmet: '智能安全帽在线总数',
      smartBelt: '安全带智能限位配置率',
      smartRobot: '巡检智能训操机器人部署数',
      all_smart_devices: '智能本质安全设备全景穿透对标'
    };
    return labelsMap[drilldownDeviceMetric || ''] || '';
  }, [drilldownDeviceMetric]);

  const maxValUnit = useMemo(() => {
    if (drilldownDeviceData.length === 0) return { name: '平凉发电公司', value: 0 };
    return drilldownDeviceData.reduce((max, d) => d.value > max.value ? d : max, drilldownDeviceData[0]);
  }, [drilldownDeviceData]);

  // Active dataset filtered by selected Power Plant
  const data = useMemo(() => {
    return MOCK_PLANTS_DATA[currentPlantId] || MOCK_PLANTS_DATA['all'];
  }, [currentPlantId]);

  const ext = useMemo(() => {
    return EXTRA_METRICS[currentPlantId] || EXTRA_METRICS['all'];
  }, [currentPlantId]);

  const defectsChartData = useMemo(() => [
    { name: '1月', '一类重大缺陷': data.id === 'all' ? 12 : 3, '二类缺陷': data.id === 'all' ? 80 : 20 },
    { name: '2月', '一类重大缺陷': data.id === 'all' ? 8 : 2, '二类缺陷': data.id === 'all' ? 65 : 15 },
    { name: '3月', '一类重大缺陷': data.id === 'all' ? 15 : 4, '二类缺陷': data.id === 'all' ? 95 : 25 },
    { name: '4月', '一类重大缺陷': data.id === 'all' ? 11 : 2, '二类缺陷': data.id === 'all' ? 88 : 22 },
    { name: '5月', '一类重大缺陷': data.id === 'all' ? 14 : 3, '二类缺陷': data.id === 'all' ? 110 : 28 },
    { name: '6月', '一类重大缺陷': data.majorDefects, '二类缺陷': data.minorDefects }
  ], [data]);

  const [violationsPeriod, setViolationsPeriod] = useState<'day' | 'month'>('day');

  const plantsJobsData = useMemo(() => {
    return [
      { name: '平凉发电', value: 60 },
      { name: '兰州热电', value: 42 },
      { name: '靖远热电', value: 35 },
      { name: '正宁发电', value: 24 },
      { name: '连城发电', value: 18 },
      { name: '西固热电', value: 15 },
      { name: '甘谷发电', value: 12 },
      { name: '景泰热电', value: 8 },
    ].sort((a, b) => b.value - a.value);
  }, []);

  const plantsAlertsData = useMemo(() => {
    return [
      { name: '正宁发电', value: 7 },
      { name: '平凉发电', value: 5 },
      { name: '兰州热电', value: 4 },
      { name: '靖远热电', value: 3 },
      { name: '连城发电', value: 2 },
      { name: '西固热电', value: 2 },
      { name: '甘谷发电', value: 1 },
      { name: '景泰热电', value: 1 },
    ].sort((a, b) => b.value - a.value);
  }, []);

  const violationsChartData = useMemo(() => {
    const isAll = currentPlantId === 'all';
    const isNing = currentPlantId === 'ningxian';
    const isLan = currentPlantId === 'lanzhou';
    
    // Scale factor: day (single units) vs month (hundreds)
    const scale = violationsPeriod === 'day' ? 1 : 40;
    const plantMultiplier = isAll ? 3.5 : isNing ? 1.0 : isLan ? 1.2 : 0.8;
    
    return [
      {
        category: '管理违章',
        '违章数': Math.round(12 * scale * plantMultiplier),
        '已整改': Math.round(11 * scale * plantMultiplier),
        '整改率': 91.6
      },
      {
        category: '装置违章',
        '违章数': Math.round(15 * scale * plantMultiplier),
        '已整改': Math.round(10 * scale * plantMultiplier),
        '整改率': 66.7
      },
      {
        category: '行为违章',
        '违章数': Math.round(9 * scale * plantMultiplier),
        '已整改': Math.round(6 * scale * plantMultiplier),
        '整改率': 66.7
      },
      {
        category: '承包商违章',
        '违章数': Math.round(13 * scale * plantMultiplier),
        '已整改': Math.round(8 * scale * plantMultiplier),
        '整改率': 61.5
      }
    ];
  }, [currentPlantId, violationsPeriod]);

  const handleBackToDailyReport = () => {
    setDrilldownPersonMetric(null);
    setDrilldownDeviceMetric(null);
    setDrilldownManagementMetric(null);
    setLeftPanelCollapsed(false);
    setRightPanelCollapsed(false);
  };

  const handleLaunchSupervision = (defect: any) => {
    setActiveSupervisingDefect(defect);
    setSupervisionMemo('');
    setSupervisionSuccessMsg('');
  };

  const submitSupervision = () => {
    if (!supervisionMemo.trim()) return;
    setSupervisions(prev => ({
      ...prev,
      [activeSupervisingDefect.id]: `【省公司已于此时间督办：${supervisionMemo}】`
    }));
    setSupervisionSuccessMsg('督办指令已实时下发，电厂基层端已实时收到弹窗并强锁流程。');
    setTimeout(() => {
      setActiveSupervisingDefect(null);
    }, 1800);
  };

  const handleExportDailyReport = () => {
    setReportExporting(true);
    setTimeout(() => {
      setReportExporting(false);
      setShowDailyReportModal(true);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f4f7fc] text-slate-800 overflow-hidden" id="provincial-supervision">
      
      {/* ================= TOP BRANDING & ACTION PANEL ================= */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between shrink-0 gap-4" id="provincial-header">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#0f172a] text-white flex items-center justify-center shadow-md">
            <ShieldCheck className="w-6 h-6 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center">
              华能甘肃能源智慧安全管控平台
              <span className="ml-2.5 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-black border border-indigo-100">省公司级监管大屏</span>
            </h1>
          </div>
        </div>
      </header>

      {/* ================= MAIN SCROLLABLE CONTAINER ================= */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar" id="provincial-main-scroll">
        
        {viewMode === 'leader' ? (
          <div className="flex flex-col xl:flex-row gap-5 h-[calc(100vh-140px)] overflow-hidden" id="leader-dashboard-viewport">
            
            {/* ================= LEFT COLUMN: 人的、设备的、环境的本质安全 ================= */}
            <div 
              className={`h-full overflow-y-auto space-y-4 pr-1 scrollbar-thin pb-6 transition-all duration-500 ease-in-out shrink-0 w-full ${
                leftPanelCollapsed ? 'xl:w-[16%]' : 'xl:w-[25%]'
              }`} 
              id="left-metrics-column"
            >
              
              {/* 统一的五防本质安全综合管控卡片 */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden animate-fade-in" id="intrinsic-safety-composite-card">
                
                <div className="p-4 space-y-5 divide-y divide-slate-100/80" id="intrinsic-safety-card-body">
                  
                  {/* SECTION 1: 人的本质安全 */}
                  <div className="space-y-3 pb-1" id="human-essential-section">
                    <h3 className="text-xs font-black text-slate-900 tracking-wider flex items-center justify-between border-b border-slate-100 pb-2">
                      <div 
                        onClick={() => { setDrilldownPersonMetric('all_personnel'); setDrilldownManagementMetric(null); setDrilldownDeviceMetric(null); }}
                        className="flex items-center cursor-pointer hover:text-indigo-600 transition-colors group"
                        title="点击查看人员本质安全综合大底座穿透视图"
                      >
                        <span className="w-1.5 h-3.5 bg-blue-500 rounded-full mr-2 group-hover:scale-y-125 transition-transform" />
                        <span className="underline decoration-dashed decoration-indigo-300 underline-offset-4 group-hover:text-indigo-700">人的本质安全</span>
                        <span className="ml-1 text-[7.5px] px-1 py-0.2 bg-indigo-50 text-indigo-600 rounded font-black font-sans shrink-0 border border-indigo-100/60 transition-all group-hover:bg-indigo-150">全景对标 &raquo;</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {drilldownPersonMetric && (
                          <button 
                            onClick={handleBackToDailyReport}
                            className="text-[9px] text-indigo-600 hover:text-indigo-800 font-extrabold cursor-pointer border-b border-dashed border-indigo-500 pb-0.5 mr-2"
                          >
                            返回
                          </button>
                        )}
                        <button 
                          onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
                          className="text-[9px] text-slate-400 hover:text-indigo-600 font-bold cursor-pointer transition-all flex items-center space-x-0.5"
                          title={leftPanelCollapsed ? "展开极简版指标区" : "收起指标区"}
                        >
                          <span className="border-b border-dashed border-slate-300 hover:border-indigo-500 tracking-tight">{leftPanelCollapsed ? "展开" : "收起"}</span>
                        </button>
                      </div>
                    </h3>

                    {leftPanelCollapsed ? (
                      /* Collapsed layout (identical to screenshot structure) */
                      <div className="space-y-3 pt-1">
                        <div 
                          onClick={() => { setDrilldownPersonMetric('totalOnDuty'); setDrilldownManagementMetric(null); setDrilldownDeviceMetric(null); }}
                          className={`flex items-center justify-between p-3.5 rounded-2xl transition-all border cursor-pointer group ${drilldownPersonMetric === 'totalOnDuty' ? 'bg-indigo-50/50 border-indigo-200 shadow-3xs ring-1 ring-indigo-100' : 'bg-slate-50/50 border-indigo-150/50 hover:bg-slate-50 hover:border-indigo-200'}`}
                        >
                          <div className="space-y-1">
                            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1 group-hover:text-indigo-500 transition-colors">
                              在岗总人数
                            </span>
                            <div className="flex items-baseline">
                              <span className="text-2xl font-black text-indigo-600 group-hover:text-indigo-750 transition-colors tracking-tight transform group-hover:scale-[1.02] origin-left duration-200">{data.totalOnDuty.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-1 bg-indigo-50 text-indigo-600 rounded-full w-6 h-6 shrink-0 font-sans font-black text-xs">
                            <span className="mx-auto">人</span>
                          </div>
                        </div>

                        <div 
                          onClick={() => { setDrilldownPersonMetric('outsourcingCount'); setDrilldownManagementMetric(null); setDrilldownDeviceMetric(null); }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between h-16 ${drilldownPersonMetric === 'outsourcingCount' ? 'bg-indigo-50/50 border-indigo-200 shadow-3xs ring-1 ring-indigo-100' : 'bg-slate-50/50 border-slate-100/60 hover:bg-indigo-50/20 hover:border-indigo-150/75'}`}
                        >
                          <span className="text-[11px] text-slate-400 font-bold block group-hover:text-indigo-500 transition-colors mb-1">
                            承包商数量
                          </span>
                          <span className="text-sm font-black text-indigo-600 group-hover:text-indigo-750 transition-colors duration-200">{data.outsourcingCount} 家</span>
                        </div>

                        <div 
                          onClick={() => { setDrilldownPersonMetric('longTermTeams'); setDrilldownManagementMetric(null); setDrilldownDeviceMetric(null); }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between h-16 ${drilldownPersonMetric === 'longTermTeams' ? 'bg-indigo-50/50 border-indigo-200 shadow-3xs ring-1 ring-indigo-100' : 'bg-slate-50/50 border-slate-100/60 hover:bg-indigo-50/20 hover:border-indigo-150/75'}`}
                        >
                          <span className="text-[11px] text-slate-400 font-bold block group-hover:text-indigo-500 transition-colors mb-1">
                            长期队伍数量
                          </span>
                          <span className="text-sm font-black text-indigo-600 group-hover:text-indigo-750 transition-colors duration-200">{ext.longTermTeams} 支</span>
                        </div>
                      </div>
                    ) : (
                      /* Original Full Layout */
                      <>
                        <div 
                          onClick={() => { setDrilldownPersonMetric('totalOnDuty'); setDrilldownManagementMetric(null); setDrilldownDeviceMetric(null); }}
                          className={`flex items-center justify-between p-2 rounded-xl transition-all border cursor-pointer group ${drilldownPersonMetric === 'totalOnDuty' ? 'bg-indigo-50/50 border-indigo-200 shadow-3xs ring-1 ring-indigo-100' : 'bg-slate-50/50 border-slate-100/70 hover:bg-indigo-50/30 hover:border-indigo-150'}`}
                        >
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 group-hover:text-indigo-500 transition-colors">
                              在岗总人数
                            </span>
                            <div className="flex items-baseline">
                              <span className="text-2xl font-black text-indigo-600 group-hover:text-indigo-750 transition-colors tracking-tight transform group-hover:scale-[1.02] origin-left duration-200">{data.totalOnDuty.toLocaleString()}</span>
                              <span className="text-xs text-indigo-400 font-semibold ml-1">人</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold flex items-center animate-pulse">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1" />
                            安全连网
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                          <div 
                            onClick={() => { setDrilldownPersonMetric('outsourcingCount'); setDrilldownManagementMetric(null); setDrilldownDeviceMetric(null); }}
                            className={`p-2 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between h-13.5 ${drilldownPersonMetric === 'outsourcingCount' ? 'bg-indigo-50/50 border-indigo-200 shadow-3xs ring-1 ring-indigo-100' : 'bg-slate-50 border-slate-100/60 hover:bg-indigo-50/20 hover:border-indigo-150/70'}`}
                          >
                            <span className="text-[9px] text-slate-400 font-bold block group-hover:text-indigo-500 transition-colors">
                              承包商数量
                            </span>
                            <span className="text-xs font-black text-indigo-600 group-hover:text-indigo-750 transition-colors duration-200">{data.outsourcingCount} 家</span>
                          </div>
                          
                          <div 
                            onClick={() => { setDrilldownPersonMetric('workTickets'); setDrilldownManagementMetric(null); setDrilldownDeviceMetric(null); }}
                            className={`p-2 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between h-13.5 ${drilldownPersonMetric === 'workTickets' ? 'bg-indigo-50/50 border-indigo-200 shadow-3xs ring-1 ring-indigo-100' : 'bg-slate-50 border-slate-100/60 hover:bg-indigo-50/20 hover:border-indigo-150/70'}`}
                          >
                            <span className="text-[9px] text-slate-400 font-bold block group-hover:text-indigo-500 transition-colors">
                              工作票数量
                            </span>
                            <span className="text-xs font-black text-indigo-600 group-hover:text-indigo-750 transition-colors duration-200">{ext.workTickets} 张</span>
                          </div>
                          
                          <div 
                            onClick={() => { setDrilldownPersonMetric('longTermTeams'); setDrilldownManagementMetric(null); setDrilldownDeviceMetric(null); }}
                            className={`p-2 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between h-13.5 ${drilldownPersonMetric === 'longTermTeams' ? 'bg-indigo-50/50 border-indigo-200 shadow-3xs ring-1 ring-indigo-100' : 'bg-slate-50 border-slate-100/60 hover:bg-indigo-50/20 hover:border-indigo-150/70'}`}
                          >
                            <span className="text-[9px] text-slate-400 font-bold block group-hover:text-indigo-500 transition-colors">
                              长期队伍数量
                            </span>
                            <span className="text-xs font-black text-indigo-600 group-hover:text-indigo-750 transition-colors duration-200">{ext.longTermTeams} 支</span>
                          </div>
                          
                          <div 
                            onClick={() => { setDrilldownPersonMetric('shortTermTeams'); setDrilldownManagementMetric(null); setDrilldownDeviceMetric(null); }}
                            className={`p-2 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between h-13.5 ${drilldownPersonMetric === 'shortTermTeams' ? 'bg-indigo-50/50 border-indigo-200 shadow-3xs ring-1 ring-indigo-100' : 'bg-slate-50 border-slate-100/60 hover:bg-indigo-50/20 hover:border-indigo-150/70'}`}
                          >
                            <span className="text-[9px] text-slate-400 font-bold block group-hover:text-indigo-500 transition-colors">
                              短期队伍数量
                            </span>
                            <span className="text-xs font-black text-indigo-600 group-hover:text-indigo-750 transition-colors duration-200">{ext.shortTermTeams} 支</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

              {/* SECTION 2: 设备的本质安全 */}
              <div className="space-y-3.5 pt-4" id="device-essential-section">
                <h3 className="text-xs font-black text-slate-900 tracking-wider flex items-center justify-between border-b border-slate-100 pb-2">
                  <div 
                    onClick={() => { setDrilldownDeviceMetric('all_devices'); setDrilldownPersonMetric(null); setDrilldownManagementMetric(null); }}
                    className="flex items-center cursor-pointer hover:text-rose-600 transition-colors group"
                    title="点击查看设备本质安全综合大底座穿透视图"
                  >
                    <span className="w-1.5 h-3.5 bg-rose-500 rounded-full mr-2 group-hover:scale-y-125 transition-transform" />
                    <span className="underline decoration-dashed decoration-rose-300 underline-offset-4 group-hover:text-rose-700">设备的本质安全</span>
                    <span className="ml-1 text-[7.5px] px-1 py-0.2 bg-rose-50 text-rose-600 rounded font-black font-sans shrink-0 border border-rose-100/60 transition-all group-hover:bg-rose-150">全景对标 &raquo;</span>
                  </div>
                  {drilldownDeviceMetric && (
                    <button 
                      onClick={handleBackToDailyReport}
                      className="text-[9px] text-rose-600 hover:text-rose-800 font-extrabold cursor-pointer border-b border-dashed border-rose-500 pb-0.5"
                    >
                      返回日报
                    </button>
                  )}
                </h3>
                
                {leftPanelCollapsed ? (
                  /* Collapsed layout (identical to screenshot structure) */
                  <div className="space-y-3 pt-1">
                    {/* 缺陷总数 */}
                    <div 
                      onClick={() => { setDrilldownDeviceMetric('totalDefects'); setDrilldownPersonMetric(null); setDrilldownManagementMetric(null); }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center py-4 h-32 ${drilldownDeviceMetric === 'totalDefects' ? 'bg-slate-100 border-rose-250 shadow-3xs ring-1 ring-rose-150' : 'bg-slate-50/50 border-slate-100/70 hover:bg-slate-100 hover:border-slate-200'}`}
                    >
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-1.5 shadow-sm">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] text-slate-400 font-bold mb-1">缺陷总数</span>
                      <span className="text-base font-black text-rose-600 font-mono">{data.majorDefects + data.minorDefects}</span>
                    </div>

                    {/* 一类重大 */}
                    <div 
                      onClick={() => { setDrilldownDeviceMetric('majorDefects'); setDrilldownPersonMetric(null); setDrilldownManagementMetric(null); }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center py-4 h-32 ${drilldownDeviceMetric === 'majorDefects' ? 'bg-rose-50/60 border-rose-250 shadow-3xs ring-1 ring-rose-150 animate-pulse' : 'bg-red-50/20 border-red-50 hover:bg-rose-50 hover:border-rose-150'}`}
                    >
                      <div className="w-9 h-9 rounded-full bg-rose-100 text-red-650 flex items-center justify-center mb-1.5 shadow-sm">
                        <ShieldAlert className="w-4 h-4 animate-pulse" />
                      </div>
                      <span className="text-[11px] text-rose-500 font-bold mb-1">一类重大</span>
                      <span className="text-base font-black text-red-600 font-mono">{data.majorDefects}</span>
                    </div>

                    {/* 二类缺陷 */}
                    <div 
                      onClick={() => { setDrilldownDeviceMetric('minorDefects'); setDrilldownPersonMetric(null); setDrilldownManagementMetric(null); }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center py-4 h-32 ${drilldownDeviceMetric === 'minorDefects' ? 'bg-amber-50 border-amber-250 shadow-3xs ring-1 ring-amber-150' : 'bg-amber-50/20 border-amber-50 hover:bg-amber-50 hover:border-amber-150'}`}
                    >
                      <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-1.5 shadow-sm">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] text-amber-600 font-bold mb-1">二类缺陷</span>
                      <span className="text-base font-black text-amber-700 font-mono">{data.minorDefects}</span>
                    </div>
                  </div>
                ) : (
                  /* Original Full Layout */
                  <>
                    {/* 3 Columns for main defect counters with styled icons */}
                    <div className="grid grid-cols-3 gap-2">
                      {/* 缺陷总数 */}
                      <div 
                        onClick={() => { setDrilldownDeviceMetric('totalDefects'); setDrilldownPersonMetric(null); setDrilldownManagementMetric(null); }}
                        className={`p-2 rounded-xl border transition-all cursor-pointer group flex flex-col items-center justify-between text-center ${drilldownDeviceMetric === 'totalDefects' ? 'bg-rose-50/50 border-rose-250 shadow-3xs ring-1 ring-rose-150' : 'bg-slate-50/80 border-slate-100/75 hover:bg-rose-50/20 hover:border-rose-150/50'}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 shadow-sm transition-all duration-250 ${drilldownDeviceMetric === 'totalDefects' ? 'bg-rose-200 text-rose-700 scale-105' : 'bg-slate-100 text-slate-500'}`}>
                          <Wrench className="w-4 h-4" />
                        </div>
                        <span className="text-[9.5px] text-slate-400 group-hover:text-rose-500 font-bold block leading-tight mb-1 transition-colors">缺陷总数</span>
                        <span className="text-base font-black text-rose-600 group-hover:text-rose-750 transition-colors font-mono">{data.majorDefects + data.minorDefects}</span>
                      </div>

                      {/* 一类重大 */}
                      <div 
                        onClick={() => { setDrilldownDeviceMetric('majorDefects'); setDrilldownPersonMetric(null); setDrilldownManagementMetric(null); }}
                        className={`p-2 rounded-xl border transition-all cursor-pointer group flex flex-col items-center justify-between text-center ${drilldownDeviceMetric === 'majorDefects' ? 'bg-rose-50/60 border-rose-250 shadow-3xs ring-1 ring-rose-150' : 'bg-rose-50/40 border-rose-100/50 hover:bg-rose-50/65 hover:border-rose-200'}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 shadow-sm animate-pulse transition-all duration-250 ${drilldownDeviceMetric === 'majorDefects' ? 'bg-red-200 text-red-700 scale-105' : 'bg-rose-100/60 text-red-600'}`}>
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <span className="text-[9.5px] text-rose-500 group-hover:text-red-700 font-black block leading-tight mb-1 transition-colors">一类重大</span>
                        <span className="text-base font-black text-red-600 group-hover:text-red-850 transition-colors font-mono">{data.majorDefects}</span>
                      </div>

                      {/* 二类缺陷 */}
                      <div 
                        onClick={() => { setDrilldownDeviceMetric('minorDefects'); setDrilldownPersonMetric(null); setDrilldownManagementMetric(null); }}
                        className={`p-2 rounded-xl border transition-all cursor-pointer group flex flex-col items-center justify-between text-center ${drilldownDeviceMetric === 'minorDefects' ? 'bg-amber-50 border-amber-200 shadow-3xs ring-1 ring-amber-100' : 'bg-amber-50/30 border-amber-100 hover:bg-amber-50 hover:border-amber-150/70'}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 shadow-sm transition-all duration-250 ${drilldownDeviceMetric === 'minorDefects' ? 'bg-amber-150 text-amber-700 scale-105' : 'bg-amber-100/60 text-amber-600'}`}>
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <span className="text-[9.5px] text-amber-600 group-hover:text-amber-750 font-black block leading-tight mb-1 transition-colors">二类缺陷</span>
                        <span className="text-base font-black text-amber-700 group-hover:text-amber-850 transition-colors font-mono">{data.minorDefects}</span>
                      </div>
                    </div>

                    {/* 2 Columns for yesterday and rate metrics */}
                    <div className="grid grid-cols-2 gap-2.5 pt-1.5">
                      {/* 昨日新增 */}
                      <div 
                        onClick={() => { setDrilldownDeviceMetric('yesterdayNewDefects'); setDrilldownPersonMetric(null); setDrilldownManagementMetric(null); }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer group flex items-center space-x-2.5 h-13.5 ${drilldownDeviceMetric === 'yesterdayNewDefects' ? 'bg-sky-50 border-sky-200 shadow-3xs ring-1 ring-sky-100' : 'bg-sky-50/40 border-sky-100/60 hover:bg-sky-50/70 hover:border-sky-150'}`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-all duration-250 ${drilldownDeviceMetric === 'yesterdayNewDefects' ? 'bg-sky-200 text-sky-700 scale-105' : 'bg-sky-100/60 text-sky-600'}`}>
                          <Plus className="w-4 h-4 stroke-[3]" />
                        </div>
                        <div>
                          <span className="text-[9.5px] text-slate-400 group-hover:text-sky-600 font-bold block mb-0.5 transition-colors">昨日新增</span>
                          <div className="flex items-baseline space-x-0.5">
                            <span className="text-sm font-black text-sky-600 group-hover:text-sky-750 font-mono">+{ext.yesterdayNewDefects}</span>
                            <span className="text-[8px] text-slate-400 font-bold">项</span>
                          </div>
                        </div>
                      </div>

                      {/* 消缺率 */}
                      <div 
                        onClick={() => { setDrilldownDeviceMetric('defectResolutionRate'); setDrilldownPersonMetric(null); setDrilldownManagementMetric(null); }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer group flex items-center space-x-2.5 h-13.5 ${drilldownDeviceMetric === 'defectResolutionRate' ? 'bg-emerald-50 border-emerald-200 shadow-3xs ring-1 ring-emerald-100' : 'bg-emerald-50/40 border-emerald-100/60 hover:bg-emerald-50/70 hover:border-emerald-150'}`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-all duration-250 ${drilldownDeviceMetric === 'defectResolutionRate' ? 'bg-emerald-200 text-emerald-700 scale-105' : 'bg-emerald-100/60 text-emerald-600'}`}>
                          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <div>
                          <span className="text-[9.5px] text-slate-400 group-hover:text-emerald-600 font-bold block mb-0.5 transition-colors">消缺治理率</span>
                          <span className="text-sm font-black text-emerald-600 group-hover:text-emerald-700 font-mono">{data.defectResolutionRate}%</span>
                        </div>
                      </div>
                    </div>

                    {/* 智能设备占比 */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100" id="smart-device-ratio">
                      <h4 
                        onClick={() => { setDrilldownDeviceMetric('all_smart_devices'); setDrilldownPersonMetric(null); setDrilldownManagementMetric(null); }}
                        className={`text-[9.5px] font-black uppercase tracking-wider flex items-center justify-between cursor-pointer transition-colors group/header ${drilldownDeviceMetric === 'all_smart_devices' ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}
                        title="点击查看智能设备本质安全综合全景图"
                      >
                        <span className="group-hover/header:underline group-hover/header:decoration-dashed group-hover/header:underline-offset-4 flex items-center">
                          <Cpu className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                          智能安全设备穿透分配比
                        </span>
                        <span className="text-[7.5px] px-1.5 py-0.2 bg-indigo-50 text-indigo-600 rounded font-black border border-indigo-100/60 group-hover/header:bg-indigo-100">全景对标 &raquo;</span>
                      </h4>
                      
                      <div className="space-y-1.5">
                        {ext.smartDevices.map((dev, idx) => {
                          const metricMap: Record<string, string> = {
                            '安全帽': 'smartHelmet',
                            '安全带': 'smartBelt',
                            '训操机器人': 'smartRobot'
                          };
                          const metricKey = metricMap[dev.type] || 'smartHelmet';
                          const isSelected = drilldownDeviceMetric === metricKey;
                          
                          return (
                            <div 
                              key={idx} 
                              onClick={() => { setDrilldownDeviceMetric(metricKey); setDrilldownPersonMetric(null); setDrilldownManagementMetric(null); }}
                              className={`space-y-0.5 p-1 rounded-lg transition-all cursor-pointer group/item border ${isSelected ? 'bg-indigo-50/50 border-indigo-200/80 shadow-2xs' : 'border-transparent hover:bg-slate-50'}`}
                            >
                              <div className="flex justify-between text-[10px] font-bold text-slate-600">
                                <span className="flex items-center group-hover/item:text-indigo-600 transition-colors">
                                  <span 
                                    className="w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse" 
                                    style={{ backgroundColor: dev.type === '安全帽' ? '#4F46E5' : dev.type === '安全带' ? '#06B6D4' : '#10B981' }} 
                                  />
                                  {dev.type}
                                </span>
                                <span className={`font-mono ${isSelected ? 'text-indigo-600 font-extrabold' : 'text-slate-500'}`}>{dev.value}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all duration-500" 
                                  style={{ 
                                    width: `${dev.value}%`, 
                                    backgroundColor: dev.type === '安全帽' ? '#4f46e5' : dev.type === '安全带' ? '#06b6d4' : '#10b981' 
                                  }} 
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* SECTION 3: 环境的本质安全 */}
              <div className="space-y-3 pt-4" id="env-essential-section">
                <h3 className="text-xs font-black text-slate-900 tracking-wider flex items-center border-b border-slate-100 pb-2">
                  <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full mr-2" />
                  环境的本质安全
                </h3>

                {leftPanelCollapsed ? (
                  /* Collapsed layout (identical to screenshot structure) */
                  <div className="space-y-2 pt-1">
                    {ext.weatherDetails.split(' | ').map((plantW, idx) => {
                      const parts = plantW.split(': ');
                      const plantName = parts[0] || '';
                      const weatherInfo = parts[1] || '';
                      return (
                        <div key={idx} className="bg-slate-50/70 border border-slate-100/60 rounded-xl px-4 py-2.5 text-xs font-black text-slate-700/80 flex items-center justify-between shadow-3xs hover:bg-slate-100/80 transition-colors">
                          <span>{plantName}</span>
                          <span className="text-slate-500 font-bold">{weatherInfo}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Original Full Layout */
                  <>
                    {/* AI流式风险提示终端 */}
                    <div className="bg-[#050B14] p-2.5 rounded-xl border border-slate-800 text-slate-300 font-mono text-[9px] space-y-1.5 relative overflow-hidden" id="ai-sentry-terminal">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-[8px] text-slate-500 font-bold">
                        <span className="flex items-center text-teal-400">
                          <span className="w-1.5 h-1.5 bg-teal-400 rounded-full mr-1 animate-ping" />
                          AI_本质安全监视终端
                        </span>
                        <span>ACTIVE</span>
                      </div>
                      <div className="space-y-1 max-h-[85px] overflow-y-auto scrollbar-none">
                        {ext.aiStreams.map((log, lIdx) => (
                          <div key={lIdx} className="text-teal-350/90 border-l border-teal-500/30 pl-1.5 py-0.5 leading-tight">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 气象局预告 */}
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100 text-[10px] text-amber-800 space-y-0.5">
                      <span className="font-black text-[9px] uppercase tracking-wider block text-amber-900">气象局官方气象预警联防</span>
                      <p className="font-semibold leading-relaxed">{ext.weatherForecast}</p>
                    </div>

                    {/* 各电厂气象一览 */}
                    <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
                      <span className="text-[9.5px] text-slate-400 font-black tracking-wider block">各电厂天气实测一览</span>
                      <div className="text-[9.5px] text-slate-600 space-y-1 font-bold">
                        {ext.weatherDetails.split(' | ').map((plantW, idx) => (
                          <div key={idx} className="flex justify-between p-1 px-1.5 bg-slate-50 rounded border border-slate-100/50">
                            <span>{plantW.split(': ')[0]}</span>
                            <span className="text-slate-500">{plantW.split(': ')[1]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div> {/* Close SECTION 3 */}
            </div> {/* Close intrinsic-safety-card-body */}
          </div> {/* Close intrinsic-safety-composite-card */}

            </div>

            {/* ================= CENTER COLUMN: AI安全日报 ================= */}
            <div 
              className="h-full overflow-y-auto pr-1 scrollbar-thin flex flex-col pb-6 transition-all duration-500 ease-in-out flex-1 min-w-0" 
              id="center-daily-report-column"
            >
              
              <div className="bg-white text-slate-800 border border-indigo-100/90 rounded-2xl shadow-sm p-5.5 space-y-5 flex flex-col relative overflow-hidden flex-1 justify-between" id="ai-daily-report-center">
                
                {/* Decorative horizontal gradient line at the top to highlight premium AI capabilities */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-50/30 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-50/30 rounded-full blur-3xl pointer-events-none" />

                {/* Inline Toast messages to replace jarring raw windows alert popup */}
                <AnimatePresence>
                  {toastMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      className="absolute top-3 left-3 right-3 z-50 bg-indigo-600 text-white rounded-xl shadow-lg border border-indigo-500/30 p-3 flex items-start justify-between text-xs font-semibold"
                    >
                      <div className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 bg-white/20 rounded-full p-0.5 shrink-0" />
                        <span>{toastMessage}</span>
                      </div>
                      <button 
                        onClick={() => setToastMessage(null)}
                        className="p-1 hover:bg-white/10 rounded transition-colors ml-2 shrink-0 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {drilldownManagementMetric ? (
                  drilldownManagementMetric === 'total_jobs_supervision' ? (
                    <TotalJobsSupervision 
                      tickets={managementWorkTickets} 
                      onBack={() => {
                        handleBackToDailyReport();
                        setSelectedSupervisionTicket(null);
                      }}
                    />
                  ) : selectedSupervisionTicket ? (
                    <WorkSupervisionDetail 
                      ticket={selectedSupervisionTicket} 
                      onBack={() => setSelectedSupervisionTicket(null)} 
                    />
                  ) : (
                    /* ================= REAL-TIME MANAGEMENT WORK TICKETS PORTAL ================= */
                    <div className="flex flex-col space-y-4 flex-1 relative z-10" id="unified-management-drilldown">
                    
                    {/* Header with Back button */}
                    <div className="flex items-center justify-between border-b border-indigo-100 pb-3" id="drilldown-header-management">
                      <button 
                        onClick={handleBackToDailyReport}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all cursor-pointer border border-indigo-100/50 shadow-2xs"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>返回 AI安全生产日报</span>
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-850 rounded-md text-[9px] font-black tracking-wide border border-indigo-200">
                          管理的本质安全 · 全网作业票穿透云图
                        </span>
                      </div>
                    </div>

                    {/* Stats boxes */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5" id="management-kpis-stat-cards">
                      {[
                        { label: '总运行作业票', count: managementWorkTickets.length, icon: FileText, colorText: 'text-indigo-600', colorBg: 'bg-indigo-50/50 hover:bg-indigo-50/80 border-indigo-100' },
                        { label: '当前运行中', count: managementWorkTickets.filter(t => t.status === '运行中').length, icon: Activity, colorText: 'text-emerald-600', colorBg: 'bg-emerald-50/50 hover:bg-emerald-50/80 border-emerald-100' },
                        { label: '流程审签中', count: managementWorkTickets.filter(t => t.status === '审签中').length, icon: Sliders, colorText: 'text-amber-600', colorBg: 'bg-amber-50/50 hover:bg-amber-50/85 border-amber-100' },
                        { label: '重大风险票', count: managementWorkTickets.filter(t => t.riskLevel === '重大风险').length, icon: AlertCircle, colorText: 'text-rose-600', colorBg: 'bg-rose-50/50 hover:bg-rose-50/80 border-rose-100' },
                      ].map((card, cIndex) => (
                        <div key={cIndex} className={`p-2.5 rounded-xl border flex flex-col justify-between ${card.colorBg} transition-all`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 font-bold">{card.label}</span>
                            <card.icon className={`w-3.5 h-3.5 ${card.colorText}`} />
                          </div>
                          <div className="flex items-baseline mt-2">
                            <span className={`text-xl font-black ${card.colorText} font-mono`}>{card.count}</span>
                            <span className="text-[9px] text-slate-400 font-bold ml-1">张</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Power Plant Navigation Tabs (全部 & 各电厂页签) */}
                    <div className="space-y-2" id="management-plants-tab-navigation">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-700 flex items-center">
                          <Cpu className="w-3.5 h-3.5 text-indigo-500 mr-1.5" />
                          甘肃公司下辖并网主体电厂
                        </span>
                        <span className="text-[8.5px] text-slate-400 font-bold">
                          点击页签可联动下方作业票对标数据库
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto scrollbar-none" id="management-plant-tabs-scroller">
                        {[
                          { id: 'all', shortName: '全部电厂', name: '全网' },
                          { id: 'ningxian', shortName: '宁县厂', name: '宁县热电' },
                          { id: 'pingliang', shortName: '平凉厂', name: '平凉发电' },
                          { id: 'lanzhou', shortName: '兰州厂', name: '兰州东热' },
                          { id: 'jingyuan', shortName: '靖远厂', name: '靖远热电' },
                          { id: 'zhengning', shortName: '正宁厂', name: '正宁发电' }
                        ].map((plantTab) => {
                          const isActive = managementPlantFilter === plantTab.id;
                          const tCount = managementWorkTickets.filter(t => plantTab.id === 'all' || t.plantId === plantTab.id).length;
                          return (
                            <button
                              key={plantTab.id}
                              onClick={() => setManagementPlantFilter(plantTab.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1 shrink-0 ${
                                isActive 
                                  ? 'bg-indigo-600 text-white shadow-sm' 
                                  : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/60'
                              }`}
                            >
                              <span>{plantTab.shortName}</span>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                                isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {tCount}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Risk Indicators Bento Row (违章风险 & 隐患风险 对标可视化板) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="risk-bento-cards-row">
                      
                      {/* Left: 违章风险 Violation Risk */}
                      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between hover:shadow-2xs transition-all relative" id="violation-risk-detail-card">
                        <div className="space-y-3 flex-1 flex flex-col justify-between">
                          
                          {/* Banner Header */}
                          <div className="flex items-center justify-between border-b border-slate-150 pb-1.5 shrink-0">
                            <div className="flex items-center space-x-2">
                              {/* Glowing high-tech indicator to mimic decoration */}
                              <span className="w-1.5 h-3.5 bg-yellow-500 rounded-sm shrink-0" />
                              <span className="text-xs font-black text-slate-900 flex items-center tracking-wide">
                                违章风险 (VIOLATION RISK)
                              </span>
                            </div>
                            
                            {/* Timeframe selector: 日累计/月累计 */}
                            <div className="flex items-center space-x-1 p-0.5 bg-slate-100/80 rounded-lg border border-slate-250/30" id="violation-timeframe-toggler">
                              <button
                                onClick={() => setViolationTimeframe('day')}
                                className={`px-2 py-0.5 rounded text-[8.5px] font-black transition-all ${
                                  violationTimeframe === 'day' 
                                    ? 'bg-white text-indigo-700 shadow-3xs border border-indigo-100' 
                                    : 'text-slate-500 hover:text-slate-800'
                                }`}
                              >
                                日累计
                              </button>
                              <button
                                onClick={() => setViolationTimeframe('month')}
                                className={`px-2 py-0.5 rounded text-[8.5px] font-black transition-all ${
                                  violationTimeframe === 'month' 
                                    ? 'bg-white text-indigo-700 shadow-3xs border border-indigo-100' 
                                    : 'text-slate-500 hover:text-slate-800'
                                }`}
                              >
                                月累计
                              </button>
                            </div>
                          </div>

                          {/* AI Copilot Description Box */}
                          <div className="bg-slate-900 text-slate-100 p-2.5 rounded-xl border border-slate-850 text-[10px] leading-relaxed relative overflow-hidden flex items-start space-x-2 shrink-0 shadow-2xs">
                            <div className="absolute right-0.5 -bottom-2 opacity-5 font-black font-sans text-3xl select-none uppercase">AI</div>
                            <div className="mt-0.5 px-1 py-0.1 bg-teal-500 text-slate-950 font-black rounded text-[8.5px] uppercase tracking-wider shrink-0 select-none">Ai</div>
                            <div>
                              今日共查处违章 <span className="text-yellow-400 font-extrabold font-mono text-xs">{managementPlantFilter === 'all' ? 12 : managementPlantFilter === 'ningxian' ? 4 : managementPlantFilter === 'pingliang' ? 3 : managementPlantFilter === 'lanzhou' ? 2 : managementPlantFilter === 'jingyuan' ? 2 : 1}</span> 起
                              （含管理类 <span className="text-yellow-400 font-bold font-mono">{managementPlantFilter === 'all' ? 10 : managementPlantFilter === 'ningxian' ? 3 : managementPlantFilter === 'pingliang' ? 2 : managementPlantFilter === 'lanzhou' ? 2 : managementPlantFilter === 'jingyuan' ? 2 : 1}</span> 项、
                              行为类 <span className="text-yellow-400 font-bold font-mono">{managementPlantFilter === 'all' ? 2 : managementPlantFilter === 'ningxian' ? 1 : managementPlantFilter === 'pingliang' ? 1 : 0}</span> 项）
                              ，其中厂领导首创纠偏 <span className="text-yellow-400 font-bold font-mono">{managementPlantFilter === 'all' ? 3 : managementPlantFilter === 'ningxian' ? 1 : managementPlantFilter === 'pingliang' ? 1 : 0}</span> 起
                              ，中层干部纠偏 <span className="text-yellow-400 font-bold font-mono">{managementPlantFilter === 'all' ? 7 : managementPlantFilter === 'ningxian' ? 2 : managementPlantFilter === 'pingliang' ? 2 : 1}</span> 起
                              ，即时闭环整改率达到 <span className="text-teal-400 font-extrabold font-mono text-xs">{managementPlantFilter === 'all' ? '95%' : managementPlantFilter === 'ningxian' ? '100%' : managementPlantFilter === 'pingliang' ? '93%' : managementPlantFilter === 'lanzhou' ? '100%' : managementPlantFilter === 'jingyuan' ? '90%' : '100%'}</span>。
                            </div>
                          </div>

                          {/* Dual-axis Chart (已整改 | 整改率 | 违章数) */}
                          <div className="flex-1 flex flex-col justify-end min-h-[165px]" id="violation-dynamic-com-chart">
                            <ResponsiveContainer width="100%" height={165}>
                              <ComposedChart 
                                data={violationTimeframe === 'day' ? managementRiskData.violationsDay : managementRiskData.violationsMonth} 
                                margin={{ top: 15, right: -5, left: -25, bottom: -5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fontSize: 9.5, fill: '#64748b', fontWeight: 'extrabold' }} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="left" tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 9, fill: '#0d9488', fontWeight: 'bold' }} axisLine={false} tickLine={false} unit="%" />
                                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px', zIndex: 100, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} />
                                <Legend verticalAlign="top" height={25} iconType="rect" iconSize={8} wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', paddingBottom: '4px' }} />
                                <Bar yAxisId="left" name="违章数" dataKey="违章数" fill="#eab308" radius={[3, 3, 0, 0]} barSize={14} />
                                <Bar yAxisId="left" name="已整改" dataKey="已整改" fill="#0ea5e9" radius={[3, 3, 0, 0]} barSize={14} />
                                <Line yAxisId="right" name="整改率" dataKey="整改率" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 1.5, fill: '#fff' }} activeDot={{ r: 5 }} />
                              </ComposedChart>
                            </ResponsiveContainer>
                          </div>

                        </div>
                      </div>

                      {/* Right: 隐患风险 Hidden Danger Risk */}
                      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between hover:shadow-2xs transition-all" id="hidden-danger-detail-card">
                        <div className="space-y-3.5 flex-1 flex flex-col justify-between">
                          
                          {/* Banner Header */}
                          <div className="flex items-center justify-between border-b border-slate-150 pb-1.5 shrink-0">
                            <div className="flex items-center space-x-2">
                              <span className="w-1.5 h-3.5 bg-teal-500 rounded-sm shrink-0" />
                              <span className="text-xs font-black text-slate-900 flex items-center tracking-wide">
                                隐患风险 (HAZARD RISK)
                              </span>
                            </div>
                            <span className="text-[8.5px] bg-slate-100 text-slate-550 border border-slate-200 px-1.5 py-0.2 rounded font-extrabold select-none">
                              实时治理大底座
                            </span>
                          </div>

                          {/* Row 1: KPI Statistics widgets */}
                          <div className="grid grid-cols-4 gap-2 shrink-0" id="hidden-danger-kpi-grid">
                            
                            {/* problems */}
                            <div className="border border-red-200/70 bg-red-50/15 hover:bg-red-50/25 p-2 rounded-xl text-center flex flex-col justify-between transition-all shadow-3xs">
                              <div className="text-[15px] font-black font-mono text-red-600 tracking-tight">
                                {managementRiskData.hiddenDangers.problems.toLocaleString()}
                              </div>
                              <div className="text-[8.5px] text-slate-550 font-extrabold flex items-center justify-center space-x-0.5 mt-0.5">
                                <span className="text-slate-500">问题数</span>
                                <span className="text-[8.5px] text-red-500 select-none">③</span>
                              </div>
                            </div>

                            {/* resolved */}
                            <div className="border border-sky-200/70 bg-sky-50/15 hover:bg-sky-50/25 p-2 rounded-xl text-center flex flex-col justify-between transition-all shadow-3xs">
                              <div className="text-[15px] font-black font-mono text-sky-600 tracking-tight">
                                {managementRiskData.hiddenDangers.rectified.toLocaleString()}
                              </div>
                              <div className="text-[8.5px] text-slate-550 font-extrabold flex items-center justify-center space-x-0.5 mt-0.5">
                                <span className="text-slate-500">已整改</span>
                                <span className="text-[8px] text-sky-500 select-none">✔</span>
                              </div>
                            </div>

                            {/* should be resolved */}
                            <div className="border border-amber-200/70 bg-amber-50/15 hover:bg-amber-50/25 p-2 rounded-xl text-center flex flex-col justify-between transition-all shadow-3xs">
                              <div className="text-[15px] font-black font-mono text-amber-600 tracking-tight">
                                {managementRiskData.hiddenDangers.shouldRectification.toLocaleString()}
                              </div>
                              <div className="text-[8.5px] text-slate-550 font-extrabold flex items-center justify-center space-x-0.5 mt-0.5">
                                <span className="text-slate-500">应整改</span>
                                <span className="text-[8px] text-amber-500 select-none">⚠</span>
                              </div>
                            </div>

                            {/* percentage ratio */}
                            <div className="border border-teal-200/70 bg-teal-50/15 hover:bg-teal-50/25 p-2 rounded-xl text-center flex flex-col justify-between transition-all shadow-3xs">
                              <div className="text-[15px] font-black font-mono text-teal-600 tracking-tight">
                                {managementRiskData.hiddenDangers.ratio}%
                              </div>
                              <div className="text-[8.5px] text-slate-550 font-extrabold flex items-center justify-center space-x-0.5 mt-0.5">
                                <span className="text-slate-500">整改率</span>
                                <span className="text-[8.5px] text-teal-600 select-none">🕒</span>
                              </div>
                            </div>

                          </div>

                          {/* Row 2: Level progress list */}
                          <div className="space-y-3 flex-1 flex flex-col justify-center max-h-[165px]" id="hidden-danger-bars">
                            {managementRiskData.hiddenDangers.barData.map((danger, index) => {
                              // Dynamic bar display calculation
                              const barPct = Math.min(100, Math.max(4, (danger.count / danger.maxCount) * 100));
                              return (
                                <div key={index} className="flex items-center text-[10px] font-bold text-slate-700">
                                  <span className="w-16 text-slate-500 font-extrabold shrink-0">{danger.label}</span>
                                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden mx-2 relative border border-slate-200/30">
                                    <div 
                                      className={`h-full rounded-full ${danger.color} transition-all duration-500`} 
                                      style={{ width: `${barPct}%` }}
                                    />
                                  </div>
                                  <span className="w-11 text-right font-mono font-black text-slate-800 shrink-0">
                                    {danger.count.toLocaleString()}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                        </div>
                      </div>

                    </div>

                    {/* Search and Filters Segment */}
                    <div className="bg-slate-50/50 border border-slate-200/80 p-3 rounded-xl space-y-2.5" id="management-tickets-filterbar">
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span className="text-[10px] font-black text-slate-700 flex items-center">
                          <Filter className="w-3 h-3 text-indigo-500 mr-1" />
                          作业详情
                        </span>
                        <span className="text-[8px] text-slate-400 font-bold">符合检索条件的记录: {filteredManagementTickets.length} 张</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2" id="management-filters-grid">
                        {/* Search Input */}
                        <div className="md:col-span-4 relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                          <input 
                            type="text"
                            placeholder="搜索工作内容/票号/负责人..."
                            value={managementSearchQuery}
                            onChange={(e) => setManagementSearchQuery(e.target.value)}
                            className="w-full text-[10px] bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-slate-800 placeholder-slate-400 font-bold focus:outline-none focus:border-indigo-500 transition-all font-sans"
                          />
                          {managementSearchQuery && (
                            <button 
                              onClick={() => setManagementSearchQuery('')}
                              className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600 font-bold text-xs"
                            >
                              &times;
                            </button>
                          )}
                        </div>

                        {/* Plant Filter */}
                        <div className="md:col-span-3">
                          <select
                            value={managementPlantFilter}
                            onChange={(e) => setManagementPlantFilter(e.target.value)}
                            className="w-full text-[10px] bg-white border border-slate-200 text-slate-705 font-bold py-2 px-2 rounded-lg cursor-pointer focus:outline-none focus:border-indigo-505"
                          >
                            <option value="all">🏢 所有并网电厂</option>
                            <option value="ningxian">宁县第一热电厂</option>
                            <option value="pingliang">平凉发电厂</option>
                            <option value="lanzhou">兰州东热电厂</option>
                            <option value="jingyuan">靖远热电厂</option>
                            <option value="zhengning">正宁发电厂</option>
                          </select>
                        </div>

                        {/* Risk level filter */}
                        <div className="md:col-span-2">
                          <select
                            value={managementRiskFilter}
                            onChange={(e) => setManagementRiskFilter(e.target.value)}
                            className="w-full text-[10px] bg-white border border-slate-200 text-slate-705 font-bold py-2 px-2 rounded-lg cursor-pointer focus:outline-none focus:border-indigo-505"
                          >
                            <option value="all">⚠️ 重点风险级别</option>
                            <option value="重大风险">🔴 重大风险</option>
                            <option value="较大风险">🟡 较大风险</option>
                          </select>
                        </div>

                        {/* Status filter */}
                        <div className="md:col-span-3">
                          <select
                            value={managementStatusFilter}
                            onChange={(e) => setManagementStatusFilter(e.target.value)}
                            className="w-full text-[10px] bg-white border border-slate-200 text-slate-705 font-bold py-2 px-2 rounded-lg cursor-pointer focus:outline-none focus:border-indigo-505"
                          >
                            <option value="all">⚡ 所有工作票状态</option>
                            <option value="运行中">运行中 (ACTIVE)</option>
                            <option value="审签中">审签中 (PENDING)</option>
                            <option value="已终结">已终结 (CLOSED)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Work ticket table container */}
                    <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-3xs flex-1 flex flex-col justify-between" id="management-tickets-table-card">
                      <div className="overflow-x-auto max-h-[285px] custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-150 text-[9.5px] font-black text-slate-505">
                              <th className="py-2.5 px-3">工作票号 / 电厂</th>
                              <th className="py-2.5 px-3">票种及具体工作内容</th>
                              <th className="py-2.5 px-3">风险控制</th>
                              <th className="py-2.5 px-3">负责人</th>
                              <th className="py-2.5 px-3">状态</th>
                              <th className="py-2.5 px-3 select-none text-right">操作</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-[10px] font-semibold text-slate-600">
                            {filteredManagementTickets.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="py-8 text-center text-slate-400 font-bold text-xs">
                                  没有找到符合当前检索条件的工作票
                                </td>
                              </tr>
                            ) : (
                              filteredManagementTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-indigo-50/15 transition-colors group">
                                  <td className="py-3 px-3">
                                    <div className="font-mono text-slate-900 font-black mb-0.5">{ticket.id}</div>
                                    <span className="text-[8.5px] font-bold text-slate-400 block">{ticket.plantName}</span>
                                  </td>
                                  <td className="py-3 px-3 max-w-[200px]">
                                    <span className="px-1.5 py-0.5 text-[8.5px] font-black text-indigo-700 bg-indigo-50 border border-indigo-150 rounded mr-1">
                                      {ticket.type}
                                    </span>
                                    <div className="text-[10px] text-slate-800 font-bold mt-1 line-clamp-1 group-hover:line-clamp-none transition-all" title={ticket.workContent}>
                                      {ticket.workContent}
                                    </div>
                                    <span className="text-[7.5px] text-slate-400 font-mono block mt-0.5 font-bold">{ticket.time}</span>
                                  </td>
                                  <td className="py-3 px-3">
                                    <span className={`px-2 py-0.5 text-[8px] font-black border rounded-md ${ticket.riskColor}`}>
                                      {ticket.riskLevel}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3">
                                    <div className="text-[9.5px]">
                                      <span className="text-slate-400">签发: </span>
                                      <span className="font-bold text-slate-700">{ticket.signer}</span>
                                    </div>
                                    <div className="text-[9.5px] mt-0.5">
                                      <span className="text-slate-400">许可: </span>
                                      <span className="font-bold text-slate-700">{ticket.permitter}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold ${
                                      ticket.status === '运行中' ? 'bg-emerald-100 text-emerald-805' :
                                      ticket.status === '审签中' ? 'bg-amber-100 text-amber-805' :
                                      'bg-slate-100 text-slate-705'
                                    }`}>
                                      {ticket.status}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3 text-right">
                                    <button
                                      onClick={() => {
                                        setSelectedSupervisionTicket(ticket);
                                        setToastMessage(`【全景AI连线】已成功调阅工作票 [${ticket.id}] (${ticket.plantName}) 实时视频流与5G智能识别信号。`);
                                        setTimeout(() => setToastMessage(null), 4000);
                                      }}
                                      className="px-2 py-1 text-[8.5px] bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 rounded-md font-black transition-all cursor-pointer shadow-3xs"
                                    >
                                      作业监管
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Summary alert line inside the work ticket board */}
                      <div className="p-2 bg-indigo-50/40 border-t border-slate-150 text-[8px] font-mono text-indigo-750 flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-indigo-605 rounded-full mr-2" />
                          <span>各电厂承包商准入机制、作业许可证及标准化作业规范度已 100% 纳入全景安全督办信道。</span>
                        </div>
                        <span className="font-bold">PROVINCE BROADCAST ONLINE</span>
                      </div>
                    </div>

                  </div>
                  )
                ) : drilldownPersonMetric ? (
                  drilldownPersonMetric === 'all_personnel' ? (
                    /* ================= UNIFIED ALL PERSONNEL PORTAL ================= */
                    <div className="flex flex-col space-y-4 flex-1 relative z-10" id="unified-personnel-drilldown">
                      
                      {/* Header with Back button */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3" id="drilldown-header-unified">
                        <button 
                          onClick={handleBackToDailyReport}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all cursor-pointer border border-indigo-100/50 shadow-2xs"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>返回 AI安全生产日报</span>
                        </button>
                        
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md text-[9px] font-black tracking-wide border border-indigo-200">
                            人员本质安全 · 全景穿透云图
                          </span>
                        </div>
                      </div>

                      {/* Top Selection cards */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2" id="unified-kpis-selection">
                        {[
                          { key: 'totalOnDuty', label: '在岗人员', total: '14,250 人', desc: '在岗实名监控', colorBg: 'bg-blue-50/50 hover:bg-blue-50/85 border-blue-105', activeRing: 'ring-2 ring-blue-500 border-blue-300 bg-blue-50/90', colorText: 'text-blue-700' },
                          { key: 'outsourcingCount', label: '参合承包商', total: '141 家', desc: '承包商入册数', colorBg: 'bg-cyan-50/50 hover:bg-cyan-50/85 border-cyan-105', activeRing: 'ring-2 ring-cyan-500 border-cyan-300 bg-cyan-50/90', colorText: 'text-cyan-700' },
                          { key: 'workTickets', label: '运行工作票', total: '287 张', desc: '活动作业票单', colorBg: 'bg-amber-50/50 hover:bg-amber-50/85 border-amber-105', activeRing: 'ring-2 ring-amber-500 border-amber-300 bg-amber-50/90', colorText: 'text-amber-700' },
                          { key: 'longTermTeams', label: '长期承包队伍', total: '42 支', desc: '常驻项目班组', colorBg: 'bg-emerald-50/50 hover:bg-emerald-50/85 border-emerald-105', activeRing: 'ring-2 ring-emerald-500 border-emerald-300 bg-emerald-50/90', colorText: 'text-emerald-700' },
                          { key: 'shortTermTeams', label: '短期检修队伍', total: '96 支', desc: '外协检修班组', colorBg: 'bg-pink-50/50 hover:bg-pink-50/85 border-pink-105', activeRing: 'ring-2 ring-pink-500 border-pink-300 bg-pink-50/90', colorText: 'text-pink-700' },
                        ].map((m) => {
                          const isActive = activeMetricInAll === m.key;
                          return (
                            <button
                              key={m.key}
                              onClick={() => setActiveMetricInAll(m.key as any)}
                              className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between relative ${isActive ? m.activeRing : m.colorBg} shadow-3xs`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="text-[9px] font-black text-slate-500">{m.label}</span>
                                {isActive && <span className="w-1.5 h-1.5 bg-indigo-650 rounded-full animate-ping absolute top-2 right-2" />}
                              </div>
                              <div className="mt-1">
                                <span className={`text-xs md:text-sm font-black ${m.colorText} block tracking-tight`}>{m.total}</span>
                                <span className="text-[7.5px] text-slate-400 font-bold block truncate">{m.desc}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Visualized Analysis Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                        {/* Interactive Compare Chart */}
                        <div className="lg:col-span-12 xl:col-span-7 bg-slate-50/50 border border-slate-150 p-2.5 rounded-xl flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9.5px] font-black text-slate-800 flex items-center">
                              <BarChart2 className="w-3.5 h-3.5 text-indigo-600 mr-1.5" />
                              根据所选指标「<b className="text-indigo-700">{
                                activeMetricInAll === 'totalOnDuty' ? '在岗人员总数' :
                                activeMetricInAll === 'outsourcingCount' ? '参合承包商数' :
                                activeMetricInAll === 'workTickets' ? '运行工作票数' :
                                activeMetricInAll === 'longTermTeams' ? '长期承包队伍' : '短期检修队伍'
                              }</b>」下的子公司横向对标
                            </span>
                            <span className="text-[8px] bg-indigo-100 text-indigo-700 font-black px-1.5 py-0.2 rounded">折算对比柱状图</span>
                          </div>

                          <div className="h-[135px] w-full mt-1">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={[
                                  { name: '正宁发电', value: activeMetricInAll === 'totalOnDuty' ? 2450 : activeMetricInAll === 'outsourcingCount' ? 24 : activeMetricInAll === 'workTickets' ? 58 : activeMetricInAll === 'longTermTeams' ? 8 : 17, color: '#3b82f6' },
                                  { name: '平凉发电', value: activeMetricInAll === 'totalOnDuty' ? 2800 : activeMetricInAll === 'outsourcingCount' ? 28 : activeMetricInAll === 'workTickets' ? 65 : activeMetricInAll === 'longTermTeams' ? 10 : 22, color: '#06b6d4' },
                                  { name: '西固热电', value: activeMetricInAll === 'totalOnDuty' ? 1350 : activeMetricInAll === 'outsourcingCount' ? 12 : activeMetricInAll === 'workTickets' ? 31 : activeMetricInAll === 'longTermTeams' ? 4 : 8, color: '#f59e0b' },
                                  { name: '靖远热电', value: activeMetricInAll === 'totalOnDuty' ? 1900 : activeMetricInAll === 'outsourcingCount' ? 18 : activeMetricInAll === 'workTickets' ? 44 : activeMetricInAll === 'longTermTeams' ? 5 : 13, color: '#10b981' },
                                  { name: '景泰热电', value: activeMetricInAll === 'totalOnDuty' ? 1200 : activeMetricInAll === 'outsourcingCount' ? 11 : activeMetricInAll === 'workTickets' ? 26 : activeMetricInAll === 'longTermTeams' ? 3 : 7, color: '#8b5cf6' },
                                  { name: '兰州热电', value: activeMetricInAll === 'totalOnDuty' ? 1650 : activeMetricInAll === 'outsourcingCount' ? 17 : activeMetricInAll === 'workTickets' ? 40 : activeMetricInAll === 'longTermTeams' ? 5 : 12, color: '#ec4899' },
                                  { name: '连城发电', value: activeMetricInAll === 'totalOnDuty' ? 1500 : activeMetricInAll === 'outsourcingCount' ? 15 : activeMetricInAll === 'workTickets' ? 35 : activeMetricInAll === 'longTermTeams' ? 4 : 10, color: '#14b8a6' },
                                  { name: '甘谷发电', value: activeMetricInAll === 'totalOnDuty' ? 1400 : activeMetricInAll === 'outsourcingCount' ? 13 : activeMetricInAll === 'workTickets' ? 28 : activeMetricInAll === 'longTermTeams' ? 3 : 7, color: '#64748b' }
                                ]}
                                margin={{ top: 10, right: 5, left: -25, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis 
                                  dataKey="name" 
                                  tick={{ fill: '#475569', fontSize: 8, fontWeight: 700 }} 
                                  axisLine={false} 
                                  tickLine={false} 
                                />
                                <YAxis tick={{ fill: '#475569', fontSize: 8, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#ffffff', 
                                    borderColor: '#e2e8f0', 
                                    borderRadius: '10px', 
                                    fontSize: 10, 
                                    fontWeight: 650 
                                  }} 
                                />
                                <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={16}>
                                  {[
                                    { fill: '#3b82f6' },
                                    { fill: '#06b6d4' },
                                    { fill: '#f59e0b' },
                                    { fill: '#10b981' },
                                    { fill: '#8b5cf6' },
                                    { fill: '#ec4899' },
                                    { fill: '#14b8a6' },
                                    { fill: '#64748b' },
                                  ].map((b, idx) => (
                                    <Cell key={`cell-${idx}`} fill={b.fill} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Interactive Insights Cards */}
                        <div className="lg:col-span-12 xl:col-span-5 bg-slate-50/50 border border-slate-150 p-2.5 rounded-xl flex flex-col justify-between">
                          <span className="text-[10px] font-black text-slate-800 block mb-1.5 border-b border-slate-200 pb-1 flex items-center">
                            <span className="w-1.5 h-3 bg-indigo-650 rounded-full mr-1.5 shrink-0" />
                            💡 人的本质安全 · 全网研判诊断报告
                          </span>
                          
                          <div className="space-y-2 text-[8.5px] leading-relaxed text-slate-650 font-semibold flex-1 flex flex-col justify-center">
                            <div className="flex items-start gap-1 p-1 bg-amber-50 border border-amber-100 rounded-lg">
                              <span className="text-[10.5px] shrink-0 mt-0.5">⚠️</span>
                              <p>
                                <b className="text-amber-800 font-extrabold">负荷倒差配比风险：</b>平凉、正宁发电处于深度检修与迎峰避开峰重合期，在岗总数（合计5,250人，占比全省约 <b>36.8%</b>）及工作票数高居全省前两位，管理层面临高风险。
                              </p>
                            </div>
                            <div className="flex items-start gap-1 p-1 bg-indigo-50 border border-indigo-150 rounded-lg">
                              <span className="text-[10.5px] shrink-0 mt-0.5">🛡️</span>
                              <p>
                                <b className="text-indigo-800 font-extrabold">对标安标建议：</b>今日全省活动工作票 <b>287张</b>，已激活全省实名布控对标，已联动下辖8家厂，开启远程实名交叉检验，落实“在册人一致、两票一致”。
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Unified Subsidiary Grid Matrix */}
                      <div className="space-y-1.5 pt-1 flex-1 overflow-y-auto scrollbar-thin rounded-xl">
                        <span className="text-[10.5px] font-black text-slate-800 block mb-1 flex items-center justify-between">
                          <span className="flex items-center">
                            <span className="w-1.5 h-3 bg-indigo-600 rounded-full mr-1.5" />
                            甘肃省公司下辖 8 家子公司本质安全要素融合比对对照矩阵
                          </span>
                          <span className="text-[8px] text-slate-400 font-normal">多维度实名数据合并核对</span>
                        </span>

                        <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs min-w-[500px]">
                          <table className="w-full text-left border-collapse bg-white">
                            <thead>
                              <tr className="bg-slate-100/80 text-[9.5px] font-black text-slate-700 border-b border-slate-200/60">
                                <th className="p-2 pl-3">子公司名称</th>
                                <th className="p-2">在岗人员 (人)</th>
                                <th className="p-2">核查承包商 (家)</th>
                                <th className="p-2">活动工作票 (张)</th>
                                <th className="p-2">长外协/短检修 (支)</th>
                                <th className="p-2 text-right pr-3">实时一键安监联动</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-[9px] font-semibold text-slate-600">
                              {[
                                { name: '正宁发电公司', totalOnDuty: 2450, outsourcingCount: 24, workTickets: 58, longTermTeams: 8, shortTermTeams: 17, isAlert: true },
                                { name: '平凉发电公司', totalOnDuty: 2800, outsourcingCount: 28, workTickets: 65, longTermTeams: 10, shortTermTeams: 22, isAlert: true },
                                { name: '西固热电公司', totalOnDuty: 1350, outsourcingCount: 12, workTickets: 31, longTermTeams: 4, shortTermTeams: 8, isAlert: false },
                                { name: '靖远热电公司', totalOnDuty: 1900, outsourcingCount: 18, workTickets: 44, longTermTeams: 5, shortTermTeams: 13, isAlert: false },
                                { name: '景泰热电公司', totalOnDuty: 1200, outsourcingCount: 11, workTickets: 26, longTermTeams: 3, shortTermTeams: 7, isAlert: false },
                                { name: '兰州热电公司', totalOnDuty: 1650, outsourcingCount: 17, workTickets: 40, longTermTeams: 5, shortTermTeams: 12, isAlert: false },
                                { name: '连城发电公司', totalOnDuty: 1500, outsourcingCount: 15, workTickets: 35, longTermTeams: 4, shortTermTeams: 10, isAlert: false },
                                { name: '甘谷发电公司', totalOnDuty: 1400, outsourcingCount: 13, workTickets: 28, longTermTeams: 3, shortTermTeams: 7, isAlert: false },
                              ].map((sub, idx) => (
                                <tr key={idx} className="hover:bg-indigo-50/20 transition-all">
                                  <td className="p-2 pl-3 font-bold text-slate-800 flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2" />
                                    {sub.name}
                                    {sub.isAlert && (
                                      <span className="ml-1.5 px-1 bg-amber-100 text-amber-850 rounded text-[7.5px] font-extrabold border border-amber-200">高风险期</span>
                                    )}
                                  </td>
                                  <td className="p-2 font-mono text-slate-700 font-bold">{sub.totalOnDuty.toLocaleString()} 人</td>
                                  <td className="p-2 font-mono text-slate-700 font-bold">{sub.outsourcingCount} 家</td>
                                  <td className="p-2 font-mono text-indigo-700 font-black">{sub.workTickets} 张</td>
                                  <td className="p-2 text-slate-500">
                                    <span className="font-mono text-emerald-700 font-bold">{sub.longTermTeams}</span> / <span className="font-mono text-pink-700 font-bold">{sub.shortTermTeams}</span>
                                  </td>
                                  <td className="p-2 text-right pr-3">
                                    <button
                                      onClick={() => {
                                        setToastMessage(`【本质安全网指令触发】已锁定「${sub.name}」，省安监中心一键启动该厂安警哨核验。远程5路高清布控球自动开机，确保外协实名制。`);
                                        setTimeout(() => setToastMessage(null), 5500);
                                      }}
                                      className="px-2 py-0.8 bg-indigo-50 hover:bg-indigo-650 text-indigo-700 hover:text-white rounded border border-indigo-200 hover:border-indigo-500 text-[8.5px] font-bold cursor-pointer transition-all active:scale-95 animate-pulse shrink-0"
                                    >
                                      联动核验警哨
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Unified footer diagnostics */}
                      <div className="bg-indigo-50/60 rounded-xl p-1 px-3 border border-indigo-100/70 text-[8.5px] text-indigo-700 font-mono flex items-center overflow-hidden h-7.5 shrink-0 shadow-3xs">
                        <div className="flex items-center mr-2 bg-indigo-100 text-indigo-700 rounded-md px-1.5 py-0.5 text-[8.5px] font-black border border-indigo-200/50 scale-95 origin-left shrink-0">
                          <Users className="w-2.5 h-2.5 text-indigo-600 mr-1" />
                          INTEGRATED STATUS
                        </div>
                        <div className="animate-pulse flex-1 truncate font-bold text-[8.5px] text-indigo-650">
                          甘肃省公司八大电厂的在岗总数、承包商队伍及高危工作票信道全数融合，全谱段本质安全穿透视板完成闭环监视。
                        </div>
                      </div>

                    </div>
                  ) : (
                    /* ================= ORIGINAL DRILLDOWN CHANNELS DETAIL CONTAINER ================= */
                    <div className="flex flex-col space-y-4 flex-1 relative z-10" id="drilldown-sub-view">
                    
                    {/* Header with Back button */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3" id="drilldown-header">
                      <button 
                        onClick={handleBackToDailyReport}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all cursor-pointer border border-indigo-100/50 shadow-2xs"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>返回 AI安全生产日报</span>
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md text-[9px] font-black tracking-wide border border-indigo-200">
                          人员本质安全 · 动态数据穿透
                        </span>
                      </div>
                    </div>

                    {/* Drilldown Heading & KPI Overview */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/60 p-3 rounded-xl border border-slate-150">
                      <div>
                        <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center mb-0.5 animate-pulse">
                          <Users className="w-4 h-4 text-indigo-600 mr-1.5 shrink-0" />
                          <span>全省子公司指标对标 — <b className="text-indigo-700 font-extrabold">{drilldownMetricLabel}</b></span>
                        </h2>
                        <p className="text-[10px] text-slate-500 font-bold leading-tight">联动甘肃省公司下属8大并网热电/发电厂，实施穿透式产品量化穿透</p>
                      </div>
                      
                      {/* Metric overall aggregation */}
                      <div className="flex items-baseline space-x-3 shrink-0">
                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 font-bold block">全省合并总计</span>
                          <span className="text-xs font-black text-slate-800 font-mono">{drilldownTotalVal.toLocaleString()} {drilldownData[0]?.unit}</span>
                        </div>
                        <div className="text-right border-l border-slate-250 pl-3">
                          <span className="text-[9px] text-slate-400 font-bold block">最高峰值厂</span>
                          <span className="text-xs font-black text-indigo-600">
                            平凉发电 ({drilldownData.find(d => d.name.includes('平凉'))?.value || 0})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Drilled down comparative bar chart and insight text */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                      {/* Comparation Chart */}
                      <div className="md:col-span-7 bg-slate-50/50 border border-slate-150 p-2.5 rounded-xl flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-black text-slate-700 flex items-center">
                            <BarChart2 className="w-3.5 h-3.5 text-indigo-500 mr-1" />
                            子公司对标数据对比 (直观对标)
                          </span>
                        </div>
                        
                        <div className="h-[145px] w-full mt-1.5">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={drilldownData}
                              margin={{ top: 10, right: 5, left: -25, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                              <XAxis 
                                dataKey="name" 
                                tickFormatter={(val) => val.replace('发电公司', '').replace('热电公司', '')}
                                tick={{ fill: '#64748b', fontSize: 8, fontWeight: 700 }} 
                                axisLine={false} 
                                tickLine={false} 
                              />
                              <YAxis tick={{ fill: '#64748b', fontSize: 8, fontWeight: 600 }} axisLine={false} tickLine={false} />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#ffffff', 
                                  borderColor: '#e2e8f0', 
                                  borderRadius: '10px', 
                                  fontSize: 10, 
                                  fontWeight: 600, 
                                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' 
                                }} 
                                labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                              />
                              <Bar dataKey="value" fill={drilldownData[0]?.color || '#4f46e5'} radius={[3, 3, 0, 0]} maxBarSize={16}>
                                {drilldownData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={index === 1 ? '#4f46e5' : index === 0 ? '#6366f1' : entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Side Insight card */}
                      <div className="md:col-span-5 bg-slate-50/50 border border-slate-150 p-2.5 rounded-xl flex flex-col justify-between">
                        <span className="text-[10px] font-black text-slate-750 block mb-1.5 border-b border-slate-200 pb-1 flex items-center">
                          <span className="w-1.5 h-3 bg-indigo-500 rounded-full mr-1.5 shrink-0" />
                          💡 AI 辅助深度分析
                        </span>
                        
                        <div className="space-y-2 text-[8.5px] leading-relaxed text-slate-650 font-semibold flex-1 flex flex-col justify-center">
                          <p className="border-l-2 border-indigo-400 pl-1.5">
                            本项人员安全对标表明：<b className="text-indigo-600 font-extrabold">平凉发电公司</b>与<b className="text-slate-800 font-extrabold">正宁发电公司</b>目前处于深度消缺与并网技测重合期，其指标（合计占比全省约 <b className="text-indigo-600 font-extrabold">{Math.round(((drilldownData[0]?.value + drilldownData[1]?.value) / (drilldownTotalVal || 1)) * 100)}%</b>）处于高荷风险期，建议安监部定向监督一票双签。
                          </p>
                          <p className="border-l-2 border-slate-400 pl-1.5">
                            西固、景泰、连城等热电厂本周处于热力稳态调峰期，在岗总数及队伍结构保持全标平稳，安全总体在可控范围。
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Subsidiaries Interactive Detail Grid */}
                    <div className="space-y-1.5 pt-1.5 border-t border-slate-100 flex-1 overflow-y-auto scrollbar-thin rounded-xl">
                      <span className="text-[10px] font-black text-slate-700 block mb-1 flex items-center justify-between">
                        <span>📢 甘肃公司下辖 8 家子公司穿透式明细 (点击任意项定向模拟一键联动核查)</span>
                        <span className="text-[8px] text-slate-400 font-normal">数据实时同步已开启</span>
                      </span>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {drilldownData.map((sub, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              setToastMessage(`【子公司联动发起成功】省公司已锁定「${sub.name}」，已定向向该厂下发安全通知：要求针对当前【${sub.value} ${sub.unit}】的 [${drilldownMetricLabel}] 落实人员在岗一致性及实名安全警哨验证，并于后台核实安全证书。`);
                              setTimeout(() => setToastMessage(null), 5500);
                            }}
                            className="bg-white hover:bg-indigo-50/40 hover:border-indigo-300 text-left p-2 rounded-xl text-slate-700 border border-slate-200 shadow-3xs transition-all cursor-pointer flex flex-col justify-between h-[75px]"
                          >
                            <div className="flex justify-between items-start w-full">
                              <span className="text-[8.5px] font-black text-slate-800 truncate max-w-[85%]">{sub.name}</span>
                              <ArrowUpRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                            </div>
                            <div className="mt-1">
                              <div className="flex items-baseline">
                                <span className="text-xs font-black text-indigo-700 font-mono">{sub.value}</span>
                                <span className="text-[8px] text-slate-400 ml-0.5">{sub.unit}</span>
                              </div>
                              <p className="text-[7.5px] text-slate-500 line-clamp-1 mt-0.5 font-bold tracking-tight">{sub.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer live status */}
                    <div className="bg-indigo-50/60 rounded-xl p-1 px-3 border border-indigo-100/70 text-[8.5px] text-indigo-700 font-mono flex items-center overflow-hidden h-7.5 shrink-0 shadow-3xs">
                      <div className="flex items-center mr-2 bg-indigo-100 text-indigo-700 rounded-md px-1.5 py-0.5 text-[8.5px] font-black border border-indigo-200/50 scale-95 origin-left shrink-0">
                        <Users className="w-2.5 h-2.5 text-indigo-600 mr-1" />
                        DRILL STATUS
                      </div>
                      <div className="animate-pulse flex-1 truncate font-bold text-[8.5px] text-indigo-650">
                        数据抓取信道畅通，已联动全省8大子公司指标，实施100%全参数真实并网穿透监控。
                      </div>
                    </div>

                  </div>
                )
              ) : drilldownDeviceMetric ? (
                drilldownDeviceMetric === 'all_devices' ? (
                  /* ================= UNIFIED ALL DEVICES PORTAL ================= */
                  <div className="flex flex-col space-y-4 flex-1 relative z-10" id="unified-devices-drilldown">
                    
                    {/* Header with Back button */}
                    <div className="flex items-center justify-between border-b border-rose-100 pb-3" id="drilldown-header-unified-devices">
                      <button 
                        onClick={handleBackToDailyReport}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-all cursor-pointer border border-rose-100/50 shadow-2xs"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>返回 AI安全生产日报</span>
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md text-[9px] font-black tracking-wide border border-rose-200">
                          设备本质安全 · 全景数据穿透
                        </span>
                      </div>
                    </div>

                    {/* Top Selection cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-2" id="unified-devices-kpis-selection">
                      {[
                        { key: 'totalDefects', label: '缺陷总数', total: '286 项', desc: '全网登记在册数', colorBg: 'bg-rose-50/50 hover:bg-rose-50/85 border-rose-105', activeRing: 'ring-2 ring-rose-500 border-rose-300 bg-rose-50/90', colorText: 'text-rose-700' },
                        { key: 'majorDefects', label: '一类重大缺陷', total: '63 项', desc: '紧急带病重危隐患', colorBg: 'bg-red-50/50 hover:bg-red-50/85 border-red-105', activeRing: 'ring-2 ring-red-500 border-red-300 bg-red-50/90', colorText: 'text-red-700' },
                        { key: 'minorDefects', label: '二类一般缺陷', total: '223 项', desc: '一般排查闭环中', colorBg: 'bg-amber-50/50 hover:bg-amber-50/85 border-amber-105', activeRing: 'ring-2 ring-amber-500 border-amber-300 bg-amber-50/90', colorText: 'text-amber-700' },
                        { key: 'yesterdayNewDefects', label: '昨日新增缺陷', total: '21 项', desc: '24小时内新确报', colorBg: 'bg-sky-50/50 hover:bg-sky-50/85 border-sky-105', activeRing: 'ring-2 ring-sky-500 border-sky-300 bg-sky-50/90', colorText: 'text-sky-700' },
                        { key: 'defectResolutionRate', label: '综合消缺率', total: '87.1 %', desc: '全季度治理指标比', colorBg: 'bg-emerald-50/50 hover:bg-emerald-50/85 border-emerald-105', activeRing: 'ring-2 ring-emerald-500 border-emerald-300 bg-emerald-50/90', colorText: 'text-emerald-700' },
                      ].map((card) => {
                        const isActive = activeDeviceMetricInAll === card.key;
                        return (
                          <div 
                            key={card.key}
                            onClick={() => setActiveDeviceMetricInAll(card.key as any)}
                            className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${isActive ? card.activeRing : `${card.colorBg} border-slate-100`}`}
                          >
                            <span className="text-[9.5px] font-black text-slate-500 block leading-tight mb-0.5">{card.label}</span>
                            <span className={`text-base font-black ${card.colorText} block font-mono`}>{card.total}</span>
                            <span className="text-[7.5px] text-slate-400 font-bold block truncate mt-0.5">{card.desc}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Chart & Insights panel */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5">
                      {/* Comparative Chart */}
                      <div className="xl:col-span-7 bg-slate-50/55 border border-slate-150 p-2.5 rounded-xl flex flex-col justify-between">
                        <span className="text-[10px] font-black text-slate-700 block mb-1.5 flex items-center">
                          <BarChart2 className="w-3.5 h-3.5 text-rose-500 mr-1" />
                          全省子公司对比 — {
                            activeDeviceMetricInAll === 'totalDefects' ? '缺陷总数对标' :
                            activeDeviceMetricInAll === 'majorDefects' ? '一类重大缺陷对标' :
                            activeDeviceMetricInAll === 'minorDefects' ? '二类一般缺陷对标' :
                            activeDeviceMetricInAll === 'yesterdayNewDefects' ? '昨日新增缺陷对标' : '消缺治理比率对标'
                          } (数据直观对标)
                        </span>
                        
                        <div className="h-[145px] w-full mt-1.5 animate-fade-in animate-duration-300">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                { name: '正宁发电', value: activeDeviceMetricInAll === 'totalDefects' ? 50 : activeDeviceMetricInAll === 'majorDefects' ? 12 : activeDeviceMetricInAll === 'minorDefects' ? 38 : activeDeviceMetricInAll === 'yesterdayNewDefects' ? 4 : 88, color: '#f43f5e' },
                                { name: '平凉发电', value: activeDeviceMetricInAll === 'totalDefects' ? 68 : activeDeviceMetricInAll === 'majorDefects' ? 18 : activeDeviceMetricInAll === 'minorDefects' ? 50 : activeDeviceMetricInAll === 'yesterdayNewDefects' ? 6 : 92, color: '#e11d48' },
                                { name: '西固热电', value: activeDeviceMetricInAll === 'totalDefects' ? 25 : activeDeviceMetricInAll === 'majorDefects' ? 5 : activeDeviceMetricInAll === 'minorDefects' ? 20 : activeDeviceMetricInAll === 'yesterdayNewDefects' ? 2 : 85, color: '#f59e0b' },
                                { name: '靖远热电', value: activeDeviceMetricInAll === 'totalDefects' ? 42 : activeDeviceMetricInAll === 'majorDefects' ? 8 : activeDeviceMetricInAll === 'minorDefects' ? 34 : activeDeviceMetricInAll === 'yesterdayNewDefects' ? 3 : 90, color: '#059669' },
                                { name: '景泰热电', value: activeDeviceMetricInAll === 'totalDefects' ? 19 : activeDeviceMetricInAll === 'majorDefects' ? 3 : activeDeviceMetricInAll === 'minorDefects' ? 16 : activeDeviceMetricInAll === 'yesterdayNewDefects' ? 1 : 84, color: '#0284c7' },
                                { name: '兰州热电', value: activeDeviceMetricInAll === 'totalDefects' ? 36 : activeDeviceMetricInAll === 'majorDefects' ? 6 : activeDeviceMetricInAll === 'minorDefects' ? 30 : activeDeviceMetricInAll === 'yesterdayNewDefects' ? 2 : 89, color: '#4f46e5' },
                                { name: '连城发电', value: activeDeviceMetricInAll === 'totalDefects' ? 30 : activeDeviceMetricInAll === 'majorDefects' ? 7 : activeDeviceMetricInAll === 'minorDefects' ? 23 : activeDeviceMetricInAll === 'yesterdayNewDefects' ? 2 : 86, color: '#7c3aed' },
                                { name: '甘谷发电', value: activeDeviceMetricInAll === 'totalDefects' ? 24 : activeDeviceMetricInAll === 'majorDefects' ? 4 : activeDeviceMetricInAll === 'minorDefects' ? 20 : activeDeviceMetricInAll === 'yesterdayNewDefects' ? 1 : 85, color: '#db2777' },
                              ]}
                              margin={{ top: 10, right: 5, left: -25, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                              <XAxis 
                                dataKey="name" 
                                tickFormatter={(val) => val.replace('发电', '').replace('热电', '')}
                                tick={{ fill: '#64748b', fontSize: 8, fontWeight: 700 }} 
                                axisLine={false} 
                                tickLine={false} 
                              />
                              <YAxis 
                                tick={{ fill: '#64748b', fontSize: 8, fontWeight: 650 }} 
                                axisLine={false} 
                                tickLine={false} 
                                domain={activeDeviceMetricInAll === 'defectResolutionRate' ? [60, 100] : [0, 'auto']}
                              />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#ffffff', 
                                  borderColor: '#e2e8f0', 
                                  borderRadius: '10px', 
                                  fontSize: 10, 
                                  fontWeight: 650, 
                                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' 
                                }} 
                                labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                              />
                              <Bar dataKey="value" fill="#ef4444" radius={[3, 3, 0, 0]} maxBarSize={16}>
                                {[
                                  { color: '#f43f5e' }, { color: '#dc2626' }, { color: '#d97706' }, { color: '#059669' },
                                  { color: '#0284c7' }, { color: '#4f46e5' }, { color: '#7c3aed' }, { color: '#db2777' }
                                ].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={activeDeviceMetricInAll === 'defectResolutionRate' ? '#10b981' : activeDeviceMetricInAll === 'majorDefects' ? '#ef4444' : entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Side Insight Card */}
                      <div className="xl:col-span-5 bg-rose-50/20 border border-rose-150 p-2.5 rounded-xl flex flex-col justify-between">
                        <span className="text-[10px] font-black text-slate-800 block mb-1.5 border-b border-slate-200 pb-1 flex items-center">
                          <span className="w-1.5 h-3 bg-rose-500 rounded-full mr-1.5 shrink-0" />
                          💡 设备的本质安全 · 设备链分析研判
                        </span>
                        
                        <div className="space-y-2 text-[8.5px] leading-relaxed text-slate-650 font-semibold flex-1 flex flex-col justify-center">
                          <div className="p-1.5 bg-rose-50/50 border border-rose-100/60 rounded-lg">
                            <span className="text-[10px] block font-black text-rose-700 mb-0.5">🔥 锅炉及特种承压管道预警</span>
                            <p>本期缺陷研判提示：平凉发电公司在役一类突出严重重大缺陷（<b>18项</b>）仍居全高，大多指向受热面微震及辅机轴承温升超程，急需于近期调峰低谷时段锁定派单闭环。</p>
                          </div>
                          <div className="p-1.5 bg-emerald-50/50 border border-emerald-100/60 rounded-lg">
                            <span className="text-[10px] block font-black text-emerald-700 mb-0.5">🌱 环保及消缺能级卓越</span>
                            <p>全省公司综合消缺治理水平保持稳健（<b>{activeDeviceMetricInAll === 'defectResolutionRate' ? '87.1' : '87'}%</b>）。正宁发电及兰州热电当前闭环排查指令执行率最优，无未超时消退缺陷。</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* All Subsidiaries Device Metric Detail Table */}
                    <div className="border border-slate-200/80 rounded-xl overflow-hidden flex flex-col flex-1 bg-white min-h-[170px]" id="unified-devices-table">
                      <div className="bg-slate-50 border-b border-slate-200/60 px-3 py-1.5 flex justify-between items-center shrink-0">
                        <span className="text-[10px] font-black text-slate-800 flex items-center">
                          <Activity className="w-3.5 h-3.5 text-indigo-500 mr-1.5" />
                          甘肃公司下辖 8 家发电/热电子公司设备对标穿透看板
                        </span>
                        <span className="text-[8.5px] text-slate-400 font-bold">数据同步精度 99.8%</span>
                      </div>
                      
                      <div className="overflow-y-auto scrollbar-thin flex-1 min-h-[105px]">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-100/80 text-[9.5px] font-black text-slate-700 border-b border-slate-200/60 sticky top-0 z-10">
                              <th className="p-2 pl-3">子公司名称</th>
                              <th className="p-2">缺陷总数 (项)</th>
                              <th className="p-2">一类重大 (项)</th>
                              <th className="p-2">二类缺陷 (项)</th>
                              <th className="p-2">昨日新增 (项)</th>
                              <th className="p-2">消缺治理比 (%)</th>
                              <th className="p-2 text-right pr-3">实名一键穿透联动</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-[9px] font-semibold text-slate-600">
                            {[
                              { name: '正宁发电公司', totalDefects: 50, majorDefects: 12, minorDefects: 38, yesterday: 4, rate: 88, isAlert: true },
                              { name: '平凉发电公司', totalDefects: 68, majorDefects: 18, minorDefects: 50, yesterday: 6, rate: 92, isAlert: true },
                              { name: '西固热电公司', totalDefects: 25, majorDefects: 5, minorDefects: 20, yesterday: 2, rate: 85, isAlert: false },
                              { name: '靖远热电公司', totalDefects: 42, majorDefects: 8, minorDefects: 34, yesterday: 3, rate: 90, isAlert: false },
                              { name: '景泰热电公司', totalDefects: 19, majorDefects: 3, minorDefects: 16, yesterday: 1, rate: 84, isAlert: false },
                              { name: '兰州热电公司', totalDefects: 36, majorDefects: 6, minorDefects: 30, yesterday: 2, rate: 89, isAlert: false },
                              { name: '连城发电公司', totalDefects: 30, majorDefects: 7, minorDefects: 23, yesterday: 2, rate: 86, isAlert: false },
                              { name: '甘谷发电公司', totalDefects: 24, majorDefects: 4, minorDefects: 20, yesterday: 1, rate: 85, isAlert: false },
                            ].map((sub, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="p-2 pl-3 font-extrabold text-slate-800">{sub.name}</td>
                                <td className="p-2 font-mono font-bold">{sub.totalDefects}</td>
                                <td className="p-2">
                                  <span className={`font-mono px-1.5 py-0.2 rounded font-bold ${sub.majorDefects > 10 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-600'}`}>
                                    {sub.majorDefects}
                                  </span>
                                </td>
                                <td className="p-2 font-mono">{sub.minorDefects}</td>
                                <td className="p-2 font-mono text-sky-600">+{sub.yesterday}</td>
                                <td className="p-2 font-mono text-emerald-600 font-bold">{sub.rate}%</td>
                                <td className="p-2 text-right pr-3">
                                  <button
                                    onClick={() => {
                                      setToastMessage(`【设备消缺督办工单触发】已针对 [${sub.name}] 发起缺陷专项督办，主设备安全中心锁控信道，已启动缺陷远程跟踪核查机制。`);
                                      setTimeout(() => setToastMessage(null), 5500);
                                    }}
                                    className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 rounded text-[8.5px] font-black cursor-pointer transition-all"
                                  >
                                    下发督办指令
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                ) : drilldownDeviceMetric === 'all_smart_devices' ? (
                  /* ================= UNIFIED ALL SMART DEVICES PORTAL ================= */
                  <div className="flex flex-col space-y-4 flex-1 relative z-10" id="unified-smart-devices-drilldown">
                    
                    {/* Header with Back button */}
                    <div className="flex items-center justify-between border-b border-indigo-105 pb-3" id="drilldown-header-unified-smart-devices">
                      <button 
                        onClick={handleBackToDailyReport}
                        className="flex items-center space-x-1.5 px-3 py-1.4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all cursor-pointer border border-indigo-100/50 shadow-2xs"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>返回 AI安全生产日报</span>
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md text-[9px] font-black tracking-wide border border-indigo-200">
                          智能设备本质安全 · 全景数据穿透
                        </span>
                      </div>
                    </div>

                    {/* Top Selection cards */}
                    <div className="grid grid-cols-3 gap-2" id="unified-smart-devices-kpis-selection">
                      {[
                        { key: 'smartHelmet', label: '智能安全帽在线', total: '946 顶', desc: '全省实时配发且在线', colorBg: 'bg-indigo-50/50 hover:bg-indigo-50/85', activeRing: 'ring-2 ring-indigo-500 border-indigo-300 bg-indigo-50/90', colorText: 'text-indigo-700' },
                        { key: 'smartBelt', label: '安全带智能配置', total: '87.2 %', desc: '临边防空挂点连贯在线', colorBg: 'bg-cyan-50/50 hover:bg-cyan-50/85', activeRing: 'ring-2 ring-cyan-500 border-cyan-300 bg-cyan-50/90', colorText: 'text-cyan-700' },
                        { key: 'smartRobot', label: '特巡训操机器人', total: '23 台', desc: '主变高压区自动巡视就位', colorBg: 'bg-emerald-50/50 hover:bg-emerald-50/85', activeRing: 'ring-2 ring-emerald-500 border-emerald-300 bg-emerald-50/90', colorText: 'text-emerald-700' },
                      ].map((card) => {
                        const isActive = activeSmartMetricInAll === card.key;
                        return (
                          <div 
                            key={card.key}
                            onClick={() => setActiveSmartMetricInAll(card.key as any)}
                            className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${isActive ? card.activeRing : `${card.colorBg} border-slate-100`}`}
                          >
                            <span className="text-[9.5px] font-black text-slate-500 block leading-tight mb-0.5">{card.label}</span>
                            <span className={`text-sm md:text-base font-black ${card.colorText} block font-mono`}>{card.total}</span>
                            <span className="text-[7.5px] text-slate-450 font-bold block truncate mt-0.5">{card.desc}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Chart & Insights panel */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                      {/* Comparative Chart */}
                      <div className="md:col-span-7 bg-slate-50/55 border border-slate-150 p-2.5 rounded-xl flex flex-col justify-between">
                        <span className="text-[10px] font-black text-slate-700 block mb-1.5 flex items-center">
                          <BarChart2 className="w-3.5 h-3.5 text-indigo-500 mr-1" />
                          全省子公司对标对比 — {
                            activeSmartMetricInAll === 'smartHelmet' ? '智能安全帽在线顶数' :
                            activeSmartMetricInAll === 'smartBelt' ? '双挂点智能安全带配备率' : '巡检巡视机器人部署部署数'
                          } 
                        </span>
                        
                        <div className="h-[145px] w-full mt-1.5">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                { name: '正宁发电', value: activeSmartMetricInAll === 'smartHelmet' ? 142 : activeSmartMetricInAll === 'smartBelt' ? 85 : 4 },
                                { name: '平凉发电', value: activeSmartMetricInAll === 'smartHelmet' ? 185 : activeSmartMetricInAll === 'smartBelt' ? 82 : 6 },
                                { name: '西固热电', value: activeSmartMetricInAll === 'smartHelmet' ? 96 : activeSmartMetricInAll === 'smartBelt' ? 90 : 2 },
                                { name: '靖远热电', value: activeSmartMetricInAll === 'smartHelmet' ? 120 : activeSmartMetricInAll === 'smartBelt' ? 88 : 3 },
                                { name: '景泰热电', value: activeSmartMetricInAll === 'smartHelmet' ? 58 : activeSmartMetricInAll === 'smartBelt' ? 86 : 1 },
                                { name: '兰州热电', value: activeSmartMetricInAll === 'smartHelmet' ? 110 : activeSmartMetricInAll === 'smartBelt' ? 92 : 3 },
                                { name: '连城发电', value: activeSmartMetricInAll === 'smartHelmet' ? 85 : activeSmartMetricInAll === 'smartBelt' ? 84 : 2 },
                                { name: '甘谷发电', value: activeSmartMetricInAll === 'smartHelmet' ? 75 : activeSmartMetricInAll === 'smartBelt' ? 88 : 2 },
                              ]}
                              margin={{ top: 10, right: 5, left: -25, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                              <XAxis 
                                dataKey="name" 
                                tickFormatter={(val) => val.replace('发电', '').replace('热电', '')}
                                tick={{ fill: '#64748b', fontSize: 8, fontWeight: 700 }} 
                                axisLine={false} 
                                tickLine={false} 
                              />
                              <YAxis 
                                tick={{ fill: '#64748b', fontSize: 8, fontWeight: 650 }} 
                                axisLine={false} 
                                tickLine={false} 
                                domain={activeSmartMetricInAll === 'smartBelt' ? [60, 100] : [0, 'auto']}
                              />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#ffffff', 
                                  borderColor: '#e2e8f0', 
                                  borderRadius: '10px', 
                                  fontSize: 10, 
                                  fontWeight: 650, 
                                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' 
                                }} 
                                labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                              />
                              <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={16}>
                                {[
                                  { color: '#4f46e5' }, { color: '#4338ca' }, { color: '#0891b2' }, { color: '#059669' },
                                  { color: '#0284c7' }, { color: '#312e81' }, { color: '#7c3aed' }, { color: '#db2777' }
                                ].map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={
                                      activeSmartMetricInAll === 'smartHelmet' ? '#4f46e5' : 
                                      activeSmartMetricInAll === 'smartBelt' ? '#06b6d4' : '#10b981'
                                    } 
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Side Insight Card */}
                      <div className="md:col-span-5 bg-indigo-50/20 border border-indigo-150 p-2.5 rounded-xl flex flex-col justify-between">
                        <span className="text-[10px] font-black text-indigo-950 block mb-1.5 border-b border-indigo-200 pb-1 flex items-center">
                          <span className="w-1.5 h-3 bg-indigo-500 rounded-full mr-1.5 shrink-0" />
                          💡 智能本质安全 · 三维联防屏障
                        </span>
                        
                        <div className="space-y-1.5 text-[8.5px] leading-relaxed text-slate-650 font-semibold flex-1 flex flex-col justify-center">
                          <div className="p-1 px-2 bg-indigo-50/50 border border-indigo-100/60 rounded-lg">
                            <span className="text-[10px] block font-black text-indigo-700 mb-0.5">Helmet & Belt 穿透监测</span>
                            <p>本期智能督查显示，高空作业双百米级双锁扣防坠电磁联动自锁配备妥善率高达 <b>99.1%</b>。平凉与正宁发电厂在大流量调峰期，智能物联设备在网数量处于季度最高位。</p>
                          </div>
                          <div className="p-1 px-2 bg-emerald-50/50 border border-emerald-100/60 rounded-lg">
                            <span className="text-[10px] block font-black text-emerald-700 mb-0.5">特种巡视机器人部署</span>
                            <p>全省公司部署的 <b>23台</b> 智脑级巡检机器人，正在针对主变高低压区温升以及输煤地道有毒有害有害气体进行高频巡回扫描，提供“激光＋声纹＋红外”综合自检自查能力。</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* All Subsidiaries Smart Safety Detail Table */}
                    <div className="border border-indigo-200/80 rounded-xl overflow-hidden flex flex-col flex-1 bg-white min-h-[170px]" id="unified-smart-devices-table">
                      <div className="bg-slate-50 border-b border-indigo-200/60 px-3 py-1.5 flex justify-between items-center shrink-0">
                        <span className="text-[10px] font-black text-slate-800 flex items-center">
                          <Cpu className="w-3.5 h-3.5 text-indigo-500 mr-1.5" />
                          甘肃公司下辖 8 家发电/热电子公司 智能安全配备对标看板
                        </span>
                        <span className="text-[8.5px] text-indigo-400 font-bold">信道联通精度 100%</span>
                      </div>
                      
                      <div className="overflow-y-auto scrollbar-thin flex-1 min-h-[105px]">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-100/80 text-[9.5px] font-black text-indigo-900 border-b border-indigo-200/60 sticky top-0 z-10">
                              <th className="p-2 pl-3 col-span-2">子公司名称</th>
                              <th className="p-2">智能安全帽 (顶)</th>
                              <th className="p-2">智能安全带限制率 (%)</th>
                              <th className="p-2">辅机巡视机器人 (台)</th>
                              <th className="p-2">双向是在线率 (%)</th>
                              <th className="p-2 text-right pr-3">对标联动</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-[9px] font-semibold text-slate-600">
                            {[
                              { name: '正宁发电公司', helmet: 142, beltRate: 85, robot: 4, onlineRate: 98.2 },
                              { name: '平凉发电公司', helmet: 185, beltRate: 82, robot: 6, onlineRate: 97.5 },
                              { name: '西固热电公司', helmet: 96, beltRate: 90, robot: 2, onlineRate: 99.1 },
                              { name: '靖远热电公司', helmet: 120, beltRate: 88, robot: 3, onlineRate: 98.5 },
                              { name: '景泰热电公司', helmet: 58, beltRate: 86, robot: 1, onlineRate: 97.8 },
                              { name: '兰州热电公司', helmet: 110, beltRate: 92, robot: 3, onlineRate: 99.4 },
                              { name: '连城发电公司', helmet: 85, beltRate: 84, robot: 2, onlineRate: 98.1 },
                              { name: '甘谷发电公司', helmet: 75, beltRate: 88, robot: 2, onlineRate: 98.3 },
                            ].map((sub, idx) => (
                              <tr key={idx} className="hover:bg-indigo-50/10 transition-colors">
                                <td className="p-2 pl-3 font-extrabold text-slate-800">{sub.name}</td>
                                <td className="p-2 font-mono font-bold text-indigo-700">{sub.helmet} 顶</td>
                                <td className="p-2 font-mono text-cyan-650 font-extrabold">{sub.beltRate}%</td>
                                <td className="p-2 font-mono">
                                  <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-100/60 rounded font-bold">
                                    {sub.robot} 台
                                  </span>
                                </td>
                                <td className="p-2 font-mono text-indigo-650 font-black">{sub.onlineRate}%</td>
                                <td className="p-2 text-right pr-3">
                                  <button
                                    onClick={() => {
                                      setToastMessage(`【双向交互正常】已自检并核对现场 [${sub.name}] 传感器及陀螺仪。在线信道读取完成，链路反馈延迟 &lt; 15ms。`);
                                      setTimeout(() => setToastMessage(null), 5000);
                                    }}
                                    className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded text-[8.5px] font-black cursor-pointer transition-all"
                                  >
                                    雷达自检
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                ) : (
                  /* ================= SPECIFIC DEVICE METRIC COMPARATIVE DRILLDOWN ================= */
                  <div className="flex flex-col space-y-4 flex-1 relative z-10" id="single-device-drilldown">
                    
                    {/* Header with Back button */}
                    <div className={`flex items-center justify-between border-b pb-3 ${['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? 'border-indigo-100' : 'border-rose-100'}`} id="drilldown-header-single-device">
                      <button 
                        onClick={handleBackToDailyReport}
                        className={`flex items-center space-x-1.5 px-3 py-1.4 rounded-lg text-xs font-bold transition-all cursor-pointer border shadow-2xs ${['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? 'bg-indigo-50/75 hover:bg-indigo-100 text-indigo-700 border-indigo-100/50' : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-100/50'}`}
                      >
                        <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>返回 AI安全生产日报</span>
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black tracking-wide border ${['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? 'bg-indigo-105 text-indigo-805 border-indigo-200' : 'bg-rose-100 text-rose-800 border-rose-200'}`}>
                          {['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? '智能安全设备 · 全景数据穿透' : '设备本质安全 · 动态数据穿透'}
                        </span>
                      </div>
                    </div>

                    {/* Drilldown Heading & KPI Overview */}
                    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl border ${['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? 'bg-indigo-50/20 border-indigo-150' : 'bg-slate-50/60 border-slate-150'}`}>
                      <div>
                        <h2 className="text-sm font-black tracking-tight flex items-center mb-0.5 animate-pulse text-slate-900">
                          {['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? (
                            <Cpu className="w-4 h-4 text-indigo-600 mr-1.5 shrink-0" />
                          ) : (
                            <Wrench className="w-4 h-4 text-rose-600 mr-1.5 shrink-0" />
                          )}
                          <span>全省子公司设备对标 — <b className={`${['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? 'text-indigo-700' : 'text-rose-700'} font-extrabold`}>{drilldownDeviceMetricLabel}</b></span>
                        </h2>
                        <p className="text-[10px] text-slate-500 font-bold leading-tight">
                          {['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) 
                            ? '联动甘肃省公司下属8大并网大厂，穿挂在线智能安全物联硬件分布' 
                            : '联动甘肃省公司下属8大并网热电/发电厂，实施穿透式设备缺陷参数检测'}
                        </p>
                      </div>
                      
                      {/* Metric overall aggregation */}
                      <div className="flex items-baseline space-x-3 shrink-0">
                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 font-bold block">
                            {drilldownDeviceMetric === 'defectResolutionRate' || drilldownDeviceMetric === 'smartBelt' ? '全省加权平均值' : '全省合并总计'}
                          </span>
                          <span className="text-xs font-black text-slate-800 font-mono">{drilldownDeviceTotalVal.toLocaleString()} {drilldownDeviceData[0]?.unit}</span>
                        </div>
                        <div className="text-right border-l border-slate-250 pl-3">
                          <span className="text-[9px] text-slate-400 font-bold block">
                            {drilldownDeviceMetric === 'defectResolutionRate' ? '消缺率最高单位' : 
                             ['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? '配备最高单位' : '最高贡献/单体'}
                          </span>
                          <span className={`text-xs font-black font-extrabold ${['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? 'text-indigo-600' : 'text-rose-600'}`}>
                            {maxValUnit.name.replace('公司', '')} ({maxValUnit.value} {drilldownDeviceData[0]?.unit})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Drilled down comparative bar chart and insight text */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                      {/* Comparation Chart */}
                      <div className="md:col-span-7 bg-slate-50/50 border border-slate-150 p-2.5 rounded-xl flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-black text-slate-700 flex items-center">
                            <BarChart2 className="w-3.5 h-3.5 text-indigo-500 mr-1" />
                            {['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? '智能设备配备对标数据对比 (直观对标)' : '子公司设备缺陷对标数据对比 (直观对标)'}
                          </span>
                        </div>
                        
                        <div className="h-[145px] w-full mt-1.5">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={drilldownDeviceData}
                              margin={{ top: 10, right: 5, left: -25, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                              <XAxis 
                                dataKey="name" 
                                tickFormatter={(val) => val.replace('发电公司', '').replace('热电公司', '')}
                                tick={{ fill: '#64748b', fontSize: 8, fontWeight: 700 }} 
                                axisLine={false} 
                                tickLine={false} 
                              />
                              <YAxis 
                                tick={{ fill: '#64748b', fontSize: 8, fontWeight: 650 }} 
                                axisLine={false} 
                                tickLine={false} 
                                domain={drilldownDeviceMetric === 'defectResolutionRate' || drilldownDeviceMetric === 'smartBelt' ? [60, 100] : [0, 'auto']}
                              />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#ffffff', 
                                  borderColor: '#e2e8f0', 
                                  borderRadius: '10px', 
                                  fontSize: 10, 
                                  fontWeight: 650, 
                                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' 
                                }} 
                                labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                              />
                              <Bar dataKey="value" fill={drilldownDeviceData[0]?.color || '#ef4444'} radius={[3, 3, 0, 0]} maxBarSize={16}>
                                {drilldownDeviceData.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={
                                      ['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric)
                                        ? entry.color
                                        : index === 1 ? '#dc2626' : index === 0 ? '#ef4444' : entry.color
                                    } 
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Side Insight card */}
                      <div className={`md:col-span-5 border p-2.5 rounded-xl flex flex-col justify-between ${['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? 'bg-indigo-50/20 border-indigo-150' : 'bg-slate-50/50 border-slate-150'}`}>
                        <span className={`text-[10px] font-black block mb-1.5 border-b pb-1 flex items-center ${['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? 'text-indigo-950 border-indigo-200' : 'text-rose-950 border-slate-200'}`}>
                          <span className={`w-1.5 h-3 rounded-full mr-1.5 shrink-0 ${['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? 'bg-indigo-500' : 'bg-rose-500'}`} />
                          {['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? '💡 AI 辅助智能穿手安全研判' : '💡 AI 辅助缺陷深度分析'}
                        </span>
                        
                        <div className="space-y-2 text-[8.5px] leading-relaxed text-slate-650 font-semibold flex-1 flex flex-col justify-center">
                          {['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? (
                            <>
                              <p className="border-l-2 border-indigo-400 pl-1.5">
                                本省公司智能安全防护穿透分析显示：该智能硬件在网连通率均达标（<b>98.5%</b> 以上）。其中，<b className="text-indigo-600 font-extrabold">{maxValUnit.name}</b> 在该方向领跑，软硬件协同率最优秀。
                              </p>
                              <p className="border-l-2 border-slate-400 pl-1.5">
                                以智能设备为联通大底座，支持全省大厂和重要危险施工面 100% 精细化监督，切实做到人员本质安全和设备本质安全的“双翼护航”。
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="border-l-2 border-rose-400 pl-1.5">
                                本项设备指标穿透表明：以<b className="text-rose-600 font-extrabold">平凉发电公司</b>（指标值为 <b className="text-rose-600 font-extrabold">{drilldownDeviceData.find(d => d.name.includes('平凉'))?.value} {drilldownDeviceData[0]?.unit}</b>）当前检修负荷为历史峰值。其一类重大缺陷占比也全省最大。
                              </p>
                              <p className="border-l-2 border-slate-400 pl-1.5">
                                兰州、西固、连城等热电和调峰机组本周处于安全平稳运行状态，虽然有微量新增排查缺陷，但整体消缺治理进度可控。
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Subsidiaries Interactive Detail Grid */}
                    <div className="space-y-1.5 pt-1.5 border-t border-slate-100 flex-1 overflow-y-auto scrollbar-thin rounded-xl">
                      <span className="text-[10px] font-black text-slate-700 block mb-1 flex items-center justify-between">
                        <span>
                          {['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric)
                            ? '📢 甘肃公司下辖 8 家子公司智能安全匹配明细 (点击进行智能雷达双向传感器在线交互状态点检)'
                            : '📢 甘肃公司下辖 8 家子公司设备穿透明细 (点击任意项一键联动下发缺陷防范与闭环整改警告)'}
                        </span>
                        <span className="text-[8px] text-slate-400 font-normal">设备智能点检实时联动已开启</span>
                      </span>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {drilldownDeviceData.map((sub, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              const isSmart = ['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric);
                              const msg = isSmart 
                                ? `【信号校验正常】已自检并读取现场 [${sub.name}] 物联网智能设备。当前该厂配备的 [${sub.value}${sub.unit}] 【${drilldownDeviceMetricLabel}】在网反馈良好，电池续航状态符合本季标准。`
                                : `【设备检修工单下发】省公司已锁定「${sub.name}」，已定向下发督办警告。针对当前 [${sub.value} ${sub.unit}] 的 [${drilldownDeviceMetricLabel}]，要求其迅速安排专工核对系统工单，并在设备安全台账中闭环消缺。`;
                              setToastMessage(msg);
                              setTimeout(() => setToastMessage(null), 5500);
                            }}
                            className={`text-left p-2 rounded-xl text-slate-705 border shadow-3xs transition-all cursor-pointer flex flex-col justify-between h-[75px] ${['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? 'bg-white hover:bg-indigo-50/40 hover:border-indigo-300 border-slate-200' : 'bg-white hover:bg-rose-50/40 hover:border-rose-300 border-slate-200'}`}
                          >
                            <div className="flex justify-between items-start w-full">
                              <span className="text-[8.5px] font-black text-slate-800 truncate max-w-[85%]">{sub.name}</span>
                              <ArrowUpRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                            </div>
                            <div className="mt-1">
                              <div className="flex items-baseline">
                                <span className={`text-xs font-black font-mono ${['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? 'text-indigo-700' : 'text-rose-700'}`}>{sub.value}</span>
                                <span className="text-[8px] text-slate-400 ml-0.5">{sub.unit}</span>
                              </div>
                              <p className="text-[7.5px] text-slate-500 line-clamp-1 mt-0.5 font-bold tracking-tight">{sub.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer live status */}
                    <div className={`rounded-xl p-1 px-3 border text-[8.5px] font-mono flex items-center overflow-hidden h-7.5 shrink-0 shadow-3xs ${['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? 'bg-indigo-50/60 border-indigo-100/70 text-indigo-700' : 'bg-rose-50/60 border-rose-100/70 text-rose-700'}`}>
                      <div className={`flex items-center mr-2 rounded-md px-1.5 py-0.5 text-[8.5px] font-black border scale-95 origin-left shrink-0 ${['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? 'bg-indigo-100 text-indigo-700 border-indigo-200/50' : 'bg-rose-100 text-rose-700 border-rose-200/50'}`}>
                        {['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? (
                          <Cpu className="w-2.5 h-2.5 text-indigo-600 mr-1" />
                        ) : (
                          <Wrench className="w-2.5 h-2.5 text-rose-600 mr-1" />
                        )}
                        {['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? 'SMART STATUS' : 'DEVICE STATUS'}
                      </div>
                      <div className={`animate-pulse flex-1 truncate font-bold text-[8.5px] ${['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) ? 'text-indigo-650' : 'text-rose-650'}`}>
                        {['smartHelmet', 'smartBelt', 'smartRobot'].includes(drilldownDeviceMetric) 
                          ? '智能安全物联信道联通正常，正在对本季大负荷调峰场景巡检状态进行实时反馈评估。'
                          : '设备热工状态抓取正常，全省8大电厂消缺信道通达，全系主辅机缺陷全天候智能对标中。'}
                      </div>
                    </div>

                  </div>
                )) : (
                  /* ORIGINAL REPORT CONTAINER (IF NO DRILLDOWN SELECTED) */
                  <>
                    {/* Card Header: Light-mode Premium Avatar wrapper */}
                    <div className="flex items-start justify-between border-b border-slate-100 pb-3.5 relative z-10">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-md relative shrink-0">
                          <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center">
                            <span className="text-sm text-indigo-600 font-black font-sans">AI</span>
                          </div>
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white animate-ping" />
                        </div>
                        <div>
                          <h2 className="text-sm font-black tracking-tight text-slate-900 flex items-center mb-0.5">
                            AI 安全生产日报
                            <span className="ml-1.5 px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[9px] font-black border border-indigo-100">自研算法生成</span>
                          </h2>
                          <p className="text-[10px] text-slate-500 font-bold leading-tight">基于全省并网电厂底座数据实时计算，一键直达，高效穿透监督</p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 font-mono text-[10px] font-bold rounded-lg border border-slate-200">
                          报告日期：2026-06-02
                        </span>
                      </div>
                    </div>

                    {/* Greetings greeting context */}
                    <div className="border-l-4 border-indigo-500 bg-indigo-50/40 p-3 rounded-r-xl text-xs text-slate-650 leading-normal font-semibold relative z-10">
                      <p className="font-extrabold text-slate-800 mb-0.5 text-xs">尊敬的领导：</p>
                      今日甘肃公司安全生产整体平稳可控，未发生人身伤害及突发环保超标事件。
                      全省并网累计开展高风险作业 <b className="text-amber-600">{ext.todayJobs.total}</b> 项，一票通核算隐患整改率 <b className="text-emerald-600">{data.id === 'ningxian' ? '84.0%' : data.id === 'lanzhou' ? '98.0%' : '81.6%'}</b>，设备平均消缺率 <b className="text-indigo-600">{data.defectResolutionRate}%</b>，环保零超标运行。以下为您自动研判的核心报告要素：
                    </div>

                    {/* 4 KPI cards with stylish light theme layouts */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10 border-b border-slate-100 pb-3.5">
                      <div className="bg-gradient-to-br from-slate-50/70 to-blue-50/20 border border-slate-150 p-2.5 rounded-xl flex flex-col justify-between hover:bg-slate-50 transition-colors">
                        <span className="text-[9.5px] text-slate-400 font-bold">整体风险等级</span>
                        <span className="text-sm font-black text-blue-600 my-1">{data.id === 'ningxian' ? '中级警示' : '低风险'}</span>
                        <span className={`text-[8.5px] font-bold ${data.id === 'ningxian' ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {data.id === 'ningxian' ? '同比昨日 ↑ 4.2%' : '同比昨日 ↓ 12.3%'}
                        </span>
                      </div>
                      <div className="bg-gradient-to-br from-slate-50/70 to-purple-50/20 border border-slate-150 p-2.5 rounded-xl flex flex-col justify-between hover:bg-slate-50 transition-colors">
                        <span className="text-[9.5px] text-slate-400 font-bold">高风险作业关注</span>
                        <span className="text-sm font-black text-purple-600 my-1">{ext.todayJobs.major} 项</span>
                        <span className="text-[8.5px] text-purple-500 font-bold">较昨日 ↑ 2项</span>
                      </div>
                      <div className="bg-gradient-to-br from-slate-50/70 to-orange-50/20 border border-slate-150 p-2.5 rounded-xl flex flex-col justify-between hover:bg-slate-50 transition-colors">
                        <span className="text-[9.5px] text-slate-400 font-bold">今日新增缺陷</span>
                        <span className="text-sm font-black text-orange-600 my-1">{ext.yesterdayNewDefects} 项</span>
                        <span className="text-[8.5px] text-emerald-600 font-bold">较昨日 ↓ 1项</span>
                      </div>
                      <div className="bg-gradient-to-br from-slate-50/70 to-emerald-50/20 border border-slate-150 p-2.5 rounded-xl flex flex-col justify-between hover:bg-slate-50 transition-colors">
                        <span className="text-[9.5px] text-slate-400 font-bold">隐患整改比率</span>
                        <span className="text-sm font-black text-emerald-600 my-1">{data.id === 'ningxian' ? '84.0%' : data.id === 'lanzhou' ? '98.0%' : '81.6%'}</span>
                        <span className="text-[8.5px] text-emerald-600 font-bold">较昨日 ↑ 3.2%</span>
                      </div>
                    </div>

                    {/* 7-day Line charts and AI bullets with Light-friendly colors */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 relative z-10 pt-1">
                      {/* Recharts Column */}
                      <div className="md:col-span-7 bg-slate-50/50 border border-slate-150 p-2.5 rounded-xl flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-black text-slate-700 flex items-center">
                            <BarChart2 className="w-3.5 h-3.5 text-indigo-500 mr-1" />
                            安全态势（近7天对位）
                          </span>
                          <div className="flex items-center space-x-2 text-[7.5px] font-black text-slate-450 scale-95 origin-right">
                            <span className="flex items-center"><span className="w-1.5 h-1.5 bg-[#4f46e5] rounded-full mr-1" /> 缺陷</span>
                            <span className="flex items-center"><span className="w-1.5 h-1.5 bg-[#06b6d4] rounded-full mr-1" /> 违章</span>
                            <span className="flex items-center"><span className="w-1.5 h-1.5 bg-[#eab308] rounded-full mr-1" /> 高风险</span>
                          </div>
                        </div>

                        <div className="flex-1 w-full min-h-[145px]">
                          <ResponsiveContainer width="100%" height={145}>
                            <LineChart 
                              data={[
                                { date: '05-28', '隐患数': 14, '违章数': 6, '高风险作业': 5 },
                                { date: '05-29', '隐患数': 20, '违章数': 9, '高风险作业': 6 },
                                { date: '05-30', '隐患数': 25, '违章数': 12, '高风险作业': 8 },
                                { date: '05-31', '隐患数': 18, '违章数': 8, '高风险作业': 7 },
                                { date: '06-01', '隐患数': 22, '违章数': 10, '高风险作业': 9 },
                                { date: '06-02', '隐患数': 15, '违章数': 7, '高风险作业': 8 },
                                { date: '06-03', '隐患数': data.id === 'ningxian' ? 9 : data.id === 'lanzhou' ? 12 : 18, '违章数': data.id === 'ningxian' ? 5 : 8, '高风险作业': data.id === 'ningxian' ? 1 : 8 }
                              ]} 
                              margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 8, fontWeight: 600 }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fill: '#64748b', fontSize: 8, fontWeight: 600 }} axisLine={false} tickLine={false} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '10px', fontSize: 8, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} 
                                labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                              />
                              <Line type="monotone" dataKey="隐患数" stroke="#4f46e5" strokeWidth={2.5} dot={false} />
                              <Line type="monotone" dataKey="违章数" stroke="#06b6d4" strokeWidth={2.5} dot={false} />
                              <Line type="monotone" dataKey="高风险作业" stroke="#eab308" strokeWidth={2.5} dot={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* AI Bullets */}
                      <div className="md:col-span-5 bg-slate-50/50 border border-slate-150 p-2.5 rounded-xl flex flex-col justify-between">
                        <span className="text-[10px] font-black text-slate-700 block mb-1 border-b border-slate-100 pb-1">
                          💡 AI 风险危害研判与警告
                        </span>
                        <div className="space-y-1.5 text-[8.5px] leading-relaxed text-slate-650 font-semibold">
                          <div className="flex items-start space-x-1.5">
                            <span className="w-3.5 h-3.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded flex items-center justify-center font-black text-[7.5px] mt-0.5 shrink-0">01</span>
                            <p>高空作业攀升，吊装及受限作业数增加，建议严格核准重票。</p>
                          </div>
                          <div className="flex items-start space-x-1.5">
                            <span className="w-3.5 h-3.5 bg-cyan-50 text-cyan-600 border border-cyan-100 rounded flex items-center justify-center font-black text-[7.5px] mt-0.5 shrink-0">02</span>
                            <p>外包违章偏高12.5%，涉及高空未挂扣，须重点考核整治。</p>
                          </div>
                          <div className="flex items-start space-x-1.5">
                            <span className="w-3.5 h-3.5 bg-amber-50 text-amber-600 border border-amber-100 rounded flex items-center justify-center font-black text-[7.5px] mt-0.5 shrink-0">03</span>
                            <p>河西厂站降水雷暴大风过境，部分临边不挂扣已发生警告。</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Horizontal Action Cards */}
                    <div className="space-y-1 pt-1.5 relative z-10 border-t border-slate-50">
                      <span className="text-[10px] font-black text-slate-700 block mb-1">📢 AI 纠偏建议与治理行动 (轻触发起联防等下下发)</span>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                        {[
                          { id: '01', title: '高危强监护', desc: '锁定视频双重审核，无保不行动。' },
                          { id: '02', title: '外包强对标', desc: '累计三期扣分自动限制省属门卡。' },
                          { id: '03', title: '气象强隔断', desc: '雷暴警告关联厂强制停止架空吊装。' },
                          { id: '04', title: '重大强攻坚', desc: '驻厂专班48小时闭环受热管道防磨。' },
                          { id: '05', title: '公文强穿透', desc: '在线下发红色整改督办单并视频佐证。' }
                        ].map((adv, idx) => (
                          <button 
                            key={idx}
                            onClick={() => {
                              setToastMessage(`【指令下达成功】省公司安监部已针对本项治理建议向 [${data.name}] 部署落地：要求基层全速落实 [${adv.title}] 行动的对标审核，并实施厂区联动监督。`);
                              setTimeout(() => setToastMessage(null), 5500);
                            }}
                            className="bg-white hover:bg-slate-50 text-left p-2 rounded-xl text-slate-700 border border-slate-200 shadow-3xs transition-all cursor-pointer flex flex-col justify-between h-[78px]"
                          >
                            <div className="flex justify-between items-start w-full mb-0.5">
                              <span className="text-[8.5px] font-black text-indigo-600">{adv.id}</span>
                              <ArrowUpRight className="w-2.5 h-2.5 text-slate-400" />
                            </div>
                            <div>
                              <h4 className="text-[8.5px] font-black text-slate-900 truncate">{adv.title}</h4>
                              <p className="text-[7.5px] text-slate-500 line-clamp-2 leading-tight mt-0.5 font-bold">{adv.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Warnings Ticket log */}
                    <div className="bg-rose-50/60 rounded-xl p-1 px-3 border border-rose-100 text-[8.5px] text-rose-700 font-mono flex items-center overflow-hidden h-7.5 shrink-0 relative z-10 shadow-3xs">
                      <div className="flex items-center mr-2 bg-rose-100 text-rose-700 rounded-md px-1.5 py-0.5 text-[8.5px] font-black border border-rose-200/50 scale-95 origin-left shrink-0">
                        <Flame className="w-2.5 h-2.5 text-red-500 mr-1 animate-pulse" />
                        LIVE ALERTS
                      </div>
                      <div className="animate-pulse flex-1 truncate font-bold text-[8.5px] text-rose-650">
                        {data.id === 'ningxian' 
                          ? '【异常警告】1#制氢副主舱气体 H2 实测达 1.24% 微漏超标，已生成红字督办并自动同步下达。' 
                          : '【省级提示】系统已捕获：宁县厂 H2 实测溢标(1.24%)、平凉厂大风过境(7级)，联动督办单整改中。'}
                      </div>
                    </div>
                  </>
                )}

              </div>

            </div>

            {/* ================= RIGHT COLUMN: 管理的本质安全 ================= */}
            <div 
              className={`h-full overflow-y-auto pr-1 scrollbar-thin flex flex-col pb-6 transition-all duration-500 ease-in-out shrink-0 w-full ${
                rightPanelCollapsed ? 'xl:w-[16%]' : 'xl:w-[25%]'
              }`} 
              id="right-metrics-column"
            >
              
              {/* COMPOSITE CARD: 管理的本质安全 (WITH REQUIRED SUB-SECTIONS) */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-5 flex-1 flex flex-col justify-between" id="management-essential-composite-card">
                
                {/* 1. 管理的本质安全 Header */}
                <div className="pb-1 flex items-center justify-between" id="management-essential-card-header">
                  <div 
                    onClick={() => {
                      setDrilldownManagementMetric(drilldownManagementMetric ? null : 'workTickets_management');
                      setDrilldownPersonMetric(null);
                      setDrilldownDeviceMetric(null);
                      setSelectedSupervisionTicket(null);
                    }}
                    className={`flex items-center cursor-pointer transition-colors group ${drilldownManagementMetric ? 'text-indigo-600' : 'text-slate-950 hover:text-indigo-650'}`}
                    title="点击查看管理本质安全及各电厂工作票列表"
                  >
                    <span className="w-1.5 h-4.5 bg-indigo-600 rounded-full mr-2.5 group-hover:scale-y-125 transition-transform" />
                    <span className="text-base font-black underline decoration-dashed decoration-indigo-300 underline-offset-4">管理的本质安全</span>
                    <span className="ml-1.5 text-[7.5px] px-1 py-0.2 bg-indigo-50 text-indigo-600 rounded font-black font-sans shrink-0 border border-indigo-100/60 transition-all group-hover:bg-indigo-150">全景对标 &raquo;</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {drilldownManagementMetric && (
                      <button 
                        onClick={() => {
                          handleBackToDailyReport();
                          setSelectedSupervisionTicket(null);
                        }}
                        className="text-[9.5px] text-indigo-600 hover:text-indigo-800 font-extrabold cursor-pointer border-b border-dashed border-indigo-500 pb-0.5 mr-2"
                      >
                        返回
                      </button>
                    )}
                    <button 
                      onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
                      className="text-[9px] text-slate-400 hover:text-indigo-600 font-bold cursor-pointer transition-all flex items-center space-x-0.5"
                      title={rightPanelCollapsed ? "展开极简版指标区" : "收起指标区"}
                    >
                      <span className="border-b border-dashed border-slate-300 hover:border-indigo-500 tracking-tight">{rightPanelCollapsed ? "展开" : "收起"}</span>
                    </button>
                  </div>
                </div>

                {/* 2. 今日作业 */}
                <div className="space-y-3.5" id="jobs-sub-section">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center">
                    <span className="w-1 h-3.5 bg-amber-500 rounded-full mr-2" />
                    今日作业
                  </h3>

                  {rightPanelCollapsed ? (
                    <div className="space-y-2.5 pt-1">
                      <div 
                        onClick={() => {
                          setDrilldownManagementMetric('total_jobs_supervision');
                          setDrilldownPersonMetric(null);
                          setDrilldownDeviceMetric(null);
                          setSelectedSupervisionTicket(null);
                          setLeftPanelCollapsed(true);
                          setRightPanelCollapsed(true);
                        }}
                        className="bg-[#f4f7fc]/70 border border-[#e4ecf7] rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-[#e8effd] hover:border-blue-300 transition-all shadow-3xs group"
                        title="点击展开作业实时智能监管指挥舱"
                      >
                        <span className="text-[11px] text-slate-400 font-bold group-hover:text-blue-600 transition-colors">作业总数</span>
                        <span className="text-sm font-mono font-black text-slate-800 group-hover:text-blue-700 transition-colors">{ext.todayJobs.total}</span>
                      </div>
                      
                      <div 
                        onClick={() => {
                          setDrilldownManagementMetric('total_jobs_supervision');
                          setDrilldownPersonMetric(null);
                          setDrilldownDeviceMetric(null);
                          setSelectedSupervisionTicket(null);
                          setLeftPanelCollapsed(true);
                          setRightPanelCollapsed(true);
                        }}
                        className="bg-rose-50/40 border border-rose-100/60 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-rose-50 hover:border-rose-300 transition-all shadow-3xs group"
                        title="点击展开重大风险智能监管流"
                      >
                        <span className="text-[11px] text-rose-550 font-bold group-hover:text-rose-650 transition-colors">重大风险</span>
                        <span className="text-sm font-mono font-black text-red-600 group-hover:text-red-700 transition-colors">{ext.todayJobs.major}</span>
                      </div>

                      <div 
                        onClick={() => {
                          setDrilldownManagementMetric('total_jobs_supervision');
                          setDrilldownPersonMetric(null);
                          setDrilldownDeviceMetric(null);
                          setSelectedSupervisionTicket(null);
                          setLeftPanelCollapsed(true);
                          setRightPanelCollapsed(true);
                        }}
                        className="bg-amber-50/40 border border-amber-100/60 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-amber-50 hover:border-amber-300 transition-all shadow-3xs group"
                        title="点击展开较大风险智能监管流"
                      >
                        <span className="text-[11px] text-amber-600 font-bold group-hover:text-amber-700 transition-colors">较大风险</span>
                        <span className="text-sm font-mono font-black text-[#f59e0b] group-hover:text-[#d97706] transition-colors">{ext.todayJobs.large}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                      <div 
                        onClick={() => {
                          setDrilldownManagementMetric('total_jobs_supervision');
                          setDrilldownPersonMetric(null);
                          setDrilldownDeviceMetric(null);
                          setSelectedSupervisionTicket(null);
                          setLeftPanelCollapsed(true);
                          setRightPanelCollapsed(true);
                        }}
                        className="bg-[#f4f7fc]/70 border border-[#e4ecf7] rounded-xl py-3 px-1.5 flex flex-col justify-center items-center cursor-pointer hover:bg-[#e8effd] hover:border-blue-300 transition-all shadow-3xs group"
                        title="点击调用作业实时智能监管指挥舱"
                      >
                        <span className="text-[11px] text-slate-400 font-bold mb-1 group-hover:text-blue-600">作业总数</span>
                        <span className="text-base font-black text-slate-800 font-mono group-hover:text-blue-700">{ext.todayJobs.total}</span>
                      </div>
                      
                      <div 
                        onClick={() => {
                          setDrilldownManagementMetric('total_jobs_supervision');
                          setDrilldownPersonMetric(null);
                          setDrilldownDeviceMetric(null);
                          setSelectedSupervisionTicket(null);
                          setLeftPanelCollapsed(true);
                          setRightPanelCollapsed(true);
                        }}
                        className="bg-rose-50/40 border border-rose-100/60 rounded-xl py-3 px-1.5 flex flex-col justify-center items-center cursor-pointer hover:bg-rose-50 hover:border-rose-300 transition-all shadow-3xs group"
                        title="点击调用重大风险智能监管流"
                      >
                        <span className="text-[10px] text-rose-500 font-black mb-1 group-hover:text-rose-600">重大风险</span>
                        <span className="text-base font-black text-red-600 font-mono group-hover:text-red-700">{ext.todayJobs.major}</span>
                      </div>
                      
                      <div 
                        onClick={() => {
                          setDrilldownManagementMetric('total_jobs_supervision');
                          setDrilldownPersonMetric(null);
                          setDrilldownDeviceMetric(null);
                          setSelectedSupervisionTicket(null);
                          setLeftPanelCollapsed(true);
                          setRightPanelCollapsed(true);
                        }}
                        className="bg-amber-50/40 border border-amber-100/60 rounded-xl py-3 px-1.5 flex flex-col justify-center items-center cursor-pointer hover:bg-amber-50 hover:border-amber-300 transition-all shadow-3xs group"
                        title="点击调用较大风险智能监管流"
                      >
                        <span className="text-[10px] text-amber-600 font-black mb-1 group-hover:text-amber-700">较大风险</span>
                        <span className="text-base font-black text-[#f59e0b] font-mono group-hover:text-[#d97706]">{ext.todayJobs.large}</span>
                      </div>
                    </div>
                  )}

                  {/* Horizontal Bar Chart for Today's Jobs by Power Plants (Sorted descending) */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-50">
                    <div className="text-[10px] text-slate-400 font-bold flex items-center justify-between">
                      <span>各电厂作业数排名 (倒序)</span>
                      <span className="text-amber-600 font-mono">（项）</span>
                    </div>
                    <div className="h-[140px] w-full pt-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={plantsJobsData}
                          layout="vertical"
                          margin={{ top: 0, right: 12, left: -25, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} vertical={true} />
                          <XAxis 
                            type="number" 
                            tick={{ fill: '#64748b', fontSize: 7.5, fontWeight: 600 }} 
                            axisLine={false} 
                            tickLine={false} 
                          />
                          <YAxis 
                            type="category" 
                            dataKey="name" 
                            tick={{ fill: '#475569', fontSize: 8.5, fontWeight: 700 }} 
                            axisLine={false} 
                            tickLine={false} 
                            width={55}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#ffffff',
                              borderColor: '#e2e8f0',
                              borderRadius: '8px',
                              fontSize: 9.5,
                              fontWeight: 650,
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
                            }}
                            labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                          />
                          <Bar 
                            dataKey="value" 
                            radius={[0, 4, 4, 0]} 
                            barSize={8}
                            fill="#f59e0b"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* 3. 智能预警 */}
                <div className="space-y-3.5 pt-3.5 border-t border-slate-100" id="alerts-sub-section">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center">
                    <span className="w-1 h-3.5 bg-violet-600 rounded-full mr-2" />
                    智能预警
                  </h3>

                  {rightPanelCollapsed ? (
                    <div className="space-y-2 pt-1 text-xs">
                      <div className="bg-slate-50/60 border border-slate-100 rounded-xl px-3 py-2 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-bold">人员行为</span>
                        <span className="text-sm font-black text-[#ef4444] font-mono">{ext.smartAlerts.behavior}</span>
                      </div>
                      <div className="bg-slate-50/60 border border-slate-100 rounded-xl px-3 py-2 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-bold">设备本体</span>
                        <span className="text-sm font-black text-slate-800 font-mono">{ext.smartAlerts.equipment}</span>
                      </div>
                      <div className="bg-slate-50/60 border border-slate-100 rounded-xl px-3 py-2 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-bold">作业环境</span>
                        <span className="text-sm font-black text-slate-800 font-mono">{ext.smartAlerts.environment}</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                        <div className="bg-slate-50/60 border border-slate-100 rounded-xl py-3 px-1.5 flex flex-col justify-center items-center">
                          <span className="text-[10px] text-slate-400 font-bold mb-1">人员行为</span>
                          <span className="text-base font-black text-[#ef4444] font-mono">{ext.smartAlerts.behavior}</span>
                        </div>
                        <div className="bg-slate-50/60 border border-slate-100 rounded-xl py-3 px-1.5 flex flex-col justify-center items-center">
                          <span className="text-[10px] text-slate-400 font-bold mb-1">设备本体</span>
                          <span className="text-base font-black text-slate-800 font-mono">{ext.smartAlerts.equipment}</span>
                        </div>
                        <div className="bg-slate-50/60 border border-slate-100 rounded-xl py-3 px-1.5 flex flex-col justify-center items-center">
                          <span className="text-[10px] text-slate-400 font-bold mb-1">作业环境</span>
                          <span className="text-base font-black text-slate-800 font-mono">{ext.smartAlerts.environment}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Horizontal Bar Chart for Smart Alerts by Power Plants (Sorted descending) */}
                  {!rightPanelCollapsed && (
                    <div className="space-y-1.5 pt-1 border-t border-slate-50">
                      <div className="text-[10px] text-slate-400 font-bold flex items-center justify-between">
                        <span>各电厂智能预警排名 (倒序)</span>
                        <span className="text-violet-600 font-mono">（次）</span>
                      </div>
                      <div className="h-[140px] w-full pt-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={plantsAlertsData}
                            layout="vertical"
                            margin={{ top: 0, right: 12, left: -25, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} vertical={true} />
                            <XAxis 
                              type="number" 
                              tick={{ fill: '#64748b', fontSize: 7.5, fontWeight: 600 }} 
                              axisLine={false} 
                              tickLine={false} 
                            />
                            <YAxis 
                              type="category" 
                              dataKey="name" 
                              tick={{ fill: '#475569', fontSize: 8.5, fontWeight: 700 }} 
                              axisLine={false} 
                              tickLine={false} 
                              width={55}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#ffffff',
                                borderColor: '#e2e8f0',
                                borderRadius: '8px',
                                fontSize: 9.5,
                                fontWeight: 650,
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
                              }}
                              labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                            />
                            <Bar 
                              dataKey="value" 
                              radius={[0, 4, 4, 0]} 
                              barSize={8}
                              fill="#8b5cf6"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. 违章整改态势 */}
                <div className="space-y-3 pt-3.5 border-t border-slate-100" id="violations-trend-subsection">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center">
                      <span className="w-1 h-3.5 bg-emerald-600 rounded-full mr-2" />
                      违章整改态势
                    </h3>
                    
                    {!rightPanelCollapsed && (
                      /* Period Switcher tabs */
                      <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold border border-slate-200/50">
                        <button
                          onClick={() => setViolationsPeriod('day')}
                          className={`px-2 py-0.5 rounded-md transition-all ${violationsPeriod === 'day' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                          日累计
                        </button>
                        <button
                          onClick={() => setViolationsPeriod('month')}
                          className={`px-2 py-0.5 rounded-md transition-all ${violationsPeriod === 'month' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                          月累计
                        </button>
                      </div>
                    )}
                  </div>

                  {rightPanelCollapsed ? (
                    <div className="space-y-2 pt-1">
                      <div className="bg-slate-50 border border-slate-100/60 rounded-xl px-3 py-2 text-xs font-bold text-slate-700/80 flex items-center justify-between shadow-3xs">
                        <span>每日违章数</span>
                        <span className="text-amber-600 font-bold font-mono text-[13px]">15 起</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-100/60 rounded-xl px-3 py-2 text-xs font-bold text-slate-700/80 flex items-center justify-between shadow-3xs">
                        <span>日已整改目</span>
                        <span className="text-sky-600 font-bold font-mono text-[13px]">14 起</span>
                      </div>
                      <div className="bg-emerald-50/45 border border-emerald-100/40 rounded-xl px-3 py-2 text-xs font-bold text-emerald-850 flex items-center justify-between shadow-3xs">
                        <span>整改闭环率</span>
                        <span className="text-emerald-600 font-bold font-mono text-[13px]">93.3%</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Legend matching screenshot */}
                      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[10px] font-bold text-slate-500 pt-0.5 px-0.5">
                        <div className="flex items-center space-x-1">
                          <span className="w-2.5 h-1.5 rounded-xs bg-[#3b82f6]" />
                          <span>已整改</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="w-2.5 h-1.5 rounded-xs bg-[#eab308]" />
                          <span>违章数</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="w-2   h-2 rounded-full border-2 border-[#14b8a6] bg-white shrink-0" />
                          <span>整改率</span>
                        </div>
                      </div>

                      {/* Responsive Chart Graphic */}
                      <div className="h-[155px] w-full bg-slate-50/40 rounded-xl p-2 border border-slate-100/50 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={violationsChartData}
                            margin={{ top: 12, right: -5, left: -25, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis 
                              dataKey="category" 
                              tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} 
                              axisLine={false} 
                              tickLine={false} 
                            />
                            {/* Left count axis */}
                            <YAxis 
                              yAxisId="left" 
                              tick={{ fontSize: 9, fontWeight: 600, fill: '#94a3b8' }} 
                              axisLine={false} 
                              tickLine={false} 
                              width={25}
                            />
                            {/* Right rate axis */}
                            <YAxis 
                              yAxisId="right" 
                              orientation="right" 
                              tick={{ fontSize: 9, fontWeight: 600, fill: '#94a3b8' }} 
                              axisLine={false} 
                              tickLine={false} 
                              tickFormatter={(val) => `${val}%`}
                              domain={[0, 100]}
                              width={25}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#ffffff', 
                                borderRadius: '12px', 
                                borderColor: '#e2e8f0', 
                                boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.08)' 
                              }}
                              itemStyle={{ fontSize: '10.5px', fontWeight: 600 }}
                              labelStyle={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}
                            />
                            {/* Bar charts side by side */}
                            <Bar yAxisId="left" dataKey="已整改" fill="#3b82f6" radius={[2.5, 2.5, 0, 0]} maxBarSize={11} />
                            <Bar yAxisId="left" dataKey="违章数" fill="#eab308" radius={[2.5, 2.5, 0, 0]} maxBarSize={11} />
                            {/* Rate represented by line */}
                            <Line
                              yAxisId="right"
                              type="monotone"
                              dataKey="整改率"
                              stroke="#14b8a6"
                              strokeWidth={2}
                              dot={{ r: 3.5, strokeWidth: 1.5, fill: '#fff' }}
                              activeDot={{ r: 4.5, strokeWidth: 2, fill: '#14b8a6' }}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </>
                  )}
                </div>

              </div>

            </div>

          </div>
        ) : (
          /* SAFETY DEPARTMENT VIEWPORTS */
          <div className="space-y-6 animate-in fade-in duration-300" id="safety-dept-viewport">
            
            {/* COMPACT DEPT KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl">
                <div className="text-slate-400 text-[11px] font-bold">正在督办公文</div>
                <div className="text-2xl font-black text-indigo-600 mt-1">4 份下发中</div>
                <div className="text-[10px] text-slate-400 mt-1.5">宁县、平凉、兰州已签收</div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl">
                <div className="text-slate-400 text-[11px] font-bold">历史红线违章库</div>
                <div className="text-2xl font-black text-rose-500 mt-1">36 项违章记录</div>
                <div className="text-[10px] text-indigo-600 font-bold mt-1.5">高空无安全挂钩为头号灾难违章</div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl">
                <div className="text-slate-400 text-[11px] font-bold">专项整治春检进度</div>
                <div className="text-2xl font-black text-slate-800 mt-1">91.4% 完成</div>
                <div className="text-[10px] text-amber-600 font-bold mt-1.5">超期卡片已派驻锁定督查</div>
              </div>
              <div className="bg-indigo-600 border border-indigo-700 p-5 rounded-2xl text-white shadow-xl shadow-indigo-600/10">
                <div className="text-white/70 text-[11px] font-bold">气体异常溯源专席</div>
                <div className="text-xl font-black mt-1 flex items-center">
                  <span>1 异常检测点</span>
                  <div className="w-2.5 h-2.5 bg-rose-400 rounded-full ml-2 animate-ping" />
                </div>
                <div className="text-[10px] text-indigo-200 mt-1.5">宁县1#制氢站处于高警示状态</div>
              </div>
            </div>

            {/* LEVEL 1: HAZARDS LEDGER & VERIFICATION CAPTURES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Filterable Hazard closed-loop area */}
              <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-sm lg:col-span-2 flex flex-col h-[460px]">
                <div className="flex flex-wrap items-center justify-between mb-5 gap-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xs font-black text-slate-900 tracking-wider uppercase flex items-center">
                      <span className="w-1.5 h-3.5 bg-indigo-500 rounded-full mr-2" />
                      省公司级隐患督办闭环专区
                    </h3>
                    <span className="text-[9px] bg-red-50 text-red-600 font-bold px-1.5 rounded">未督办隐患高亮封锁</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">全过程溯源原始证据</span>
                </div>

                <div className="overflow-x-auto flex-1 custom-scrollbar">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase">
                        <th className="py-2.5">电厂场站</th>
                        <th className="py-2.5">风险等级</th>
                        <th className="py-2.5">漏洞隐患描述</th>
                        <th className="py-2.5">发现人 / 上报渠道</th>
                        <th className="py-2.5">限期截止</th>
                        <th className="py-2.5 text-right">安全穿透验证</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.hiddenHazards.map((hz) => (
                        <tr key={hz.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 font-bold text-slate-800">{hz.plant}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                              hz.level === '重大' ? 'bg-red-50 text-red-500' :
                              hz.level === '较大' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-600'
                            }`}>{hz.level}</span>
                          </td>
                          <td className="py-3 pr-4 max-w-[220px] font-medium text-slate-600 line-clamp-1 truncate">{hz.desc}</td>
                          <td className="py-3 text-slate-500">{hz.reporter}</td>
                          <td className="py-3 text-slate-400 font-mono text-[10px]">{hz.time}</td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button 
                                onClick={() => setActiveInspectingHazard(hz)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-900 hover:text-white rounded text-[10px] font-black transition-colors cursor-pointer flex items-center space-x-1"
                              >
                                <Camera className="w-3 h-3 text-slate-400" />
                                <span>穿透看图</span>
                              </button>
                              <button 
                                onClick={() => {
                                  alert(`【省安监部督办函下派】督办函已被 【${hz.plant}】安监主要责任人一键签收，限24小时内整改并更新现场照片成果！`);
                                }}
                                className="px-2 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded text-[10px] font-black text-indigo-600 transition-all cursor-pointer"
                              >
                                一键下派
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-3 bg-amber-50/40 rounded-xl border border-amber-200/50 text-[11px] text-amber-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><b>隐患溯源穿透机制：</b>省级大屏支持一键调取任何一处基层电厂上传的<b>现场原始照片、检测雷达图及GPS坐标定位</b>，杜绝基层虚假上报和虚假闭环。</span>
                </div>
              </div>

              {/* Red line violation behaviors list */}
              <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-sm flex flex-col h-[460px]">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xs font-black text-slate-900 tracking-wider uppercase flex items-center">
                    <span className="w-1.5 h-3.5 bg-rose-500 rounded-full mr-2" />
                    高频违章提炼及专项整治任务
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold">反三违智能提炼</span>
                </div>

                <p className="text-xs text-slate-500 font-bold leading-normal mb-4">
                  智能平台分析各外包队伍过往违规雷达照片，高危作业期间 “高空作业未解防坠器、临电漏保故障” 发生频率最高。
                </p>

                <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
                  {data.violations.map((vi, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-xs font-black text-slate-400">0{idx+1}</span>
                        <div>
                          <div className="text-xs font-bold text-slate-800">{vi.type}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">历史监控事件：{vi.count}起</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded font-black">{vi.trends}趋势</span>
                        <div className="mt-1">
                          <button 
                            onClick={() => {
                              alert(`已定向向全公司涉及[${vi.type}]超标的基层责任单位下派专项警示教育闭环整治函，截止时间设定为 2026-06-15。`);
                            }}
                            className="text-[9px] text-indigo-600 font-black hover:underline cursor-pointer"
                          >
                            下发整治
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* LEVEL 2: INITIATIVES TRACKING & GAS HAZARDS EXPOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Campaign / Initiative progress tracking */}
              <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xs font-black text-slate-900 tracking-wider uppercase flex items-center">
                    <span className="w-1.5 h-3.5 bg-blue-500 rounded-full mr-2" />
                    专项安全任务及三大活动省级跟踪
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 font-bold rounded">春检、迎峰度夏</span>
                </div>

                <div className="space-y-4 flex-1">
                  {data.tasks.map((task, idx) => {
                    const rate = Math.round((task.done / task.assigned) * 100);
                    return (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-slate-800">{task.name}</span>
                          <span className="text-xs font-mono font-black text-indigo-600">{rate}% 完成</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3">
                          <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${rate}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>集团下达条数: <b>{task.assigned}项</b></span>
                          <span>已闭环核销: <b>{task.done}项</b></span>
                          <span>超期滞后待惩: {task.overdue > 0 ? (
                            <span className="text-red-500 font-black">{task.overdue}项超期</span>
                          ) : <span className="text-emerald-600 font-bold">无超期</span>}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 危化氨区、制氢重大源监控细节 */}
              <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xs font-black text-slate-900 tracking-wider uppercase flex items-center">
                    <span className="w-1.5 h-3.5 bg-cyan-500 rounded-full mr-2" />
                    制氢站、液氨/尿素危化源历史超标事件分析
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">24H 环路对位</span>
                </div>

                <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl font-mono text-[11px] space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-indigo-400">SYS_MONITOR_HEALTH</span>
                    <span className="text-emerald-400">● 实时遥测中</span>
                  </div>
                  <div className="space-y-1.5 overflow-y-auto max-h-[140px] px-1">
                    <div className="text-amber-400">[2026-06-02 12:44] 宁县1#制氢副泵房传感器 H2 瞬时达 1.24% 触发系统强闭作业联动指令。</div>
                    <div className="text-slate-400">[2026-06-02 08:12] 平凉液氨排空主截止阀压力测试恢复在控、排污回水达标。</div>
                    <div className="text-slate-400">[2026-06-01 17:33] 兰州东热电厂尿素氨超高警报完全核销，现场整改人已签章。</div>
                  </div>
                  <div className="border-t border-slate-800 pt-2 text-[10px] flex justify-between items-center text-slate-500">
                    <span>气体监测回溯频率: 3000ms</span>
                    <button 
                      onClick={() => {
                        alert('已根据5月份数据流自动导出省公司环境安全分析月度电子报表。');
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600 text-[10px] text-white rounded transition-colors"
                    >
                      生成月度分析报表 &gt;
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* ==================== INTERACTIVE MODALS ================= */}
      {/* ========================================================= */}
      
      {/* 1. Launch a Directive modal (重大缺陷督办) */}
      <AnimatePresence>
        {activeSupervisingDefect && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[99]" id="supervision-modal">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl p-6 border border-slate-100 shadow-2xl relative"
            >
              <button 
                onClick={() => setActiveSupervisingDefect(null)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2 text-rose-600 font-bold mb-4">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm">发起省级主要督办指令</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 mb-4 whitespace-pre-wrap">
                <div className="font-bold text-[10px] text-slate-400 uppercase mb-1">被督办一类隐患/缺陷</div>
                <div className="font-bold text-slate-800 mb-1">{activeSupervisingDefect.desc}</div>
                <div>责任部门: {activeSupervisingDefect.dept} | 原计划时限: {activeSupervisingDefect.limit}</div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-xs text-slate-400 font-bold mb-1.5">督办意见 / 限期整改指令（直达目标基层平台并锁屏）</label>
                  <textarea 
                    rows={4}
                    value={supervisionMemo}
                    onChange={(e) => setSupervisionMemo(e.target.value)}
                    placeholder="请输入强制限整要求，例如：省安监核查此条项目有进一步泄漏趋势，要求加派外包抢修一班在48小时内完工对调，安监全过程原图监督上传..."
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-indigo-500 focus:bg-white font-bold leading-normal transition-all"
                  />
                </div>

                {supervisionSuccessMsg && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{supervisionSuccessMsg}</span>
                  </div>
                )}

                <div className="flex space-x-3.5 justify-end">
                  <button 
                    onClick={() => setActiveSupervisingDefect(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                  >
                    取消
                  </button>
                  <button 
                    onClick={submitSupervision}
                    className="px-5 py-2 bg-indigo-600 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>派发督办公文</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Hazard inspection source photo (隐患溯源穿透专席 - 杜绝虚构闭环) */}
      <AnimatePresence>
        {activeInspectingHazard && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[99]" id="inspecting-hazard-modal">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-3xl p-6 border border-slate-100 shadow-2xl relative"
            >
              <button 
                onClick={() => setActiveInspectingHazard(null)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2 text-indigo-600 font-bold mb-4 font-mono">
                <Camera className="w-5 h-5" />
                <span className="text-sm">【四级数据穿透专区】现场隐患原始照片与GPS防伪核查</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Visual Image source */}
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 relative h-64 flex items-center justify-center">
                  <img 
                    src={activeInspectingHazard.srcPhoto} 
                    alt="现场问题照片" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-900/70 text-white font-mono text-[9px] px-2 py-1 rounded">
                    现场实测摄像终端在线 | 无伪造水印
                  </div>
                </div>

                {/* Tracking checklist metadata */}
                <div className="flex flex-col justify-between text-xs font-bold">
                  <div className="space-y-3">
                    <div className="border-b border-slate-100 pb-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">来源电厂/场站</span>
                      <span className="text-slate-800 text-sm font-black">{activeInspectingHazard.plant}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">缺陷隐患内容描述</span>
                      <span className="text-slate-700 leading-normal block italic">{activeInspectingHazard.desc}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">现场上报责任人</span>
                        <span className="text-slate-700">{activeInspectingHazard.reporter}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">时间节点</span>
                        <span className="text-slate-700 font-mono text-[10px]">{activeInspectingHazard.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 text-indigo-700 p-3 rounded-xl border border-indigo-100 block mt-4">
                    <div className="font-bold text-[10px]">安监督办跟踪记录 &gt;</div>
                    <div className="text-[10px] font-normal leading-normal mt-1 text-indigo-600">
                      省大屏已通过底层API，提取宁厂PLC传感器振荡频率佐证照片真实，避免两张皮填报。
                    </div>
                  </div>
                </div>

              </div>

              <div className="mt-6 flex space-x-2.5 justify-end">
                <button 
                  onClick={() => setActiveInspectingHazard(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  已核验原始凭据无误
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Formal Automated export report report Modal */}
      <AnimatePresence>
        {showDailyReportModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[99]" id="daily-report-model-view">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-3xl p-8 border border-indigo-50 shadow-2xl relative max-h-[85vh] flex flex-col"
            >
              <button 
                onClick={() => setShowDailyReportModal(false)}
                className="absolute top-5 right-5 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2.5 text-indigo-600 font-black mb-1">
                <Award className="w-6 h-6" />
                <h2 className="text-lg">华能甘肃能源 • 省级安全每日标准监管公报</h2>
              </div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-5">
                自动提取各主控厂运行底座原始数据 • 日志归口
              </p>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                
                <div className="border border-slate-200 rounded-2xl p-5 block space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-100 pb-2.5">
                    <span>文档编号: HGNY-2026-06-02-AI</span>
                    <span>签署机体: 华能甘肃能源智慧安全系统</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3.5 text-center py-2">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold mb-0.5">全省安全系数得分</div>
                      <div className="text-2xl font-black text-indigo-600">94 分</div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold mb-0.5">一类重大缺陷锁定</div>
                      <div className="text-2xl font-black text-rose-500">16 项</div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold mb-0.5">特种人合规率</div>
                      <div className="text-2xl font-black text-emerald-600">100%</div>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed font-bold">
                    <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                      <p className="font-black text-amber-800 mb-1">🔍 今日核心风险要害提示:</p>
                      <p className="font-normal text-slate-700 leading-normal">
                        全甘肃省共有3个厂处于中级降雨或阵风气象带，省平台已强制发出高空露天起重吊装停工联控。
                        宁县一热电厂存在制氢安全舱泄漏(1.24%)及1名外包重特种工无证上墙临边隐患，系统已下发一级警示，请督办部门现场复审。
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      <p className="text-[11px] text-slate-400 font-black">分电厂详细状态简报</p>
                      <div className="space-y-2 text-xs font-normal">
                        <div className="flex justify-between border-b pb-1">
                          <span>1. **兰州东热电厂**: 总体得分 96分 (健康级)。新增缺陷 1、闭环 1。设备消缺状态全网排头。</span>
                          <span className="text-emerald-600 font-bold">优秀</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span>2. **平凉发电厂**: 总体得分 93分 (优良级)。新增一般升降电梯微锈缺陷已委派抢修。</span>
                          <span className="text-indigo-600 font-bold">良好</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span>3. **宁县第一热电厂**: 总体得分 84分 (偏低需督战)。气体微超标准，证件过期。已进行强锁警示。</span>
                          <span className="text-rose-500 font-extrabold">重点追踪</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="mt-6 flex justify-end space-x-3.5 pt-4 border-t">
                <button 
                  onClick={() => setShowDailyReportModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  关闭
                </button>
                <button 
                  onClick={() => {
                    alert('安全日志报表已自动导出到本地(HGNY-Daily-Safety-Report.pdf)，已自动发送省公司总办。');
                    setShowDailyReportModal(false);
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>正式一键导出 PDF/Word 极速归账</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Drilled down level details level drilldown popup (联动全省基层数据一键下钻) */}
      <AnimatePresence>
        {drillDownLevel && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[99]" id="drill-down-modal">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-xl rounded-4xl p-6 border border-slate-100 shadow-2xl relative"
            >
              <button 
                onClick={() => setDrillDownLevel(null)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2.5 text-indigo-600 font-extrabold mb-4 font-mono">
                <Activity className="w-5 h-5" />
                <span className="text-sm">省-厂-班组-现场 四级穿透总验</span>
              </div>

              <div className="space-y-4">
                <div className="text-xs text-slate-500 font-bold">
                  省平台联动该场站数字底座，免去人员录入。以下为由该物理底座直连捕获的实时人员明细：
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl space-y-3 border border-slate-100 text-xs">
                  <div className="flex justify-between items-center bg-indigo-50/50 p-2 rounded text-[10px] text-indigo-700 font-bold uppercase tracking-wider">
                    <span>查询目标: {drillDownLevel.plant} &gt; {drillDownLevel.area}</span>
                    <span>检测状态: 正常同步中</span>
                  </div>

                  <div className="divide-y divide-slate-100 space-y-2">
                    <div className="flex justify-between font-bold text-slate-700 py-1">
                      <span>1级 (省属管辖)</span>
                      <span>华能甘肃能源省运营中心监控岗</span>
                    </div>
                    <div className="flex justify-between font-bold text-indigo-600 py-1">
                      <span>2级 (电厂管辖)</span>
                      <span>宁县第一热电厂主控制室</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-700 py-1">
                      <span>3级 (执行主班组)</span>
                      <span>锅炉钢架特种抢修施工一班 (12人在线)</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-700 py-1">
                      <span>4级 (真实现场网关)</span>
                      <span>1#锅炉房 35米平台第5支段电位 (网关IP: 10.124.32.1)</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-100 rounded-2xl text-[10px] text-slate-500 font-normal leading-normal">
                  无需担心基层手工改报，通过各测点、摄像设备、班组移动终端自动抓取。省级大厅点击直达最末梢，真正杜绝两张皮。
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    onClick={() => setDrillDownLevel(null)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    确认并关闭
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
