/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  BellRing, 
  Video, 
  FileText, 
  AreaChart, 
  Settings, 
  ChevronLeft, 
  Search, 
  Database, 
  RotateCw,
  Box,
  LayoutTemplate,
  ShieldCheck,
  UserCheck,
  HelpCircle,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import DiscoveryPage from './components/DiscoveryPage';
import ContractorControlPage from './components/ContractorControlPage';

// --- Types ---
interface StatItem {
  label: string;
  value: string | number;
  subValue?: string;
  color?: string;
}

interface CategoryItem {
  id: string;
  name: string;
  count: number;
  color: string;
}

// --- Components ---

const SidebarIcon = ({ icon: Icon, active, title, onClick }: { icon: any, active?: boolean, title?: string, onClick: () => void }) => (
  <div 
    onClick={onClick}
    title={title}
    className={`p-2 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:bg-white hover:text-gray-600'}`}
  >
    <Icon className="w-4 h-4" />
  </div>
);

const SubSidebarItem = ({ label, active, onClick }: { label: string, active?: boolean, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className={`px-4 py-2.5 flex items-center space-x-3 cursor-pointer transition-all rounded-r-full mr-4 ${active ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-500 hover:bg-white/60 hover:text-gray-800'}`}
  >
    {active ? <UserCheck className="w-4 h-4" /> : <Box className="w-4 h-4 opacity-50" />}
    <span className="text-sm tracking-tight">{label}</span>
  </div>
);

const Card = ({ title, children, extra, className = "", noPadding = false, bg = "bg-white" }: { title?: string, children: React.ReactNode, extra?: React.ReactNode, className?: string, noPadding?: boolean, bg?: string }) => (
  <div 
    className={`${bg} rounded-lg border border-gray-100 flex flex-col ${className}`} 
    id={`card-${title?.replace(/\s+/g, '-').toLowerCase()}`}
  >
    {title && (
      <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        {extra && <div className="text-xs text-gray-400 font-light">{extra}</div>}
      </div>
    )}
    <div className={`flex-1 ${noPadding ? '' : 'p-6'}`}>
      {children}
    </div>
  </div>
);

const StatsCard = ({ label, value, subValue, color = "blue" }: StatItem & { color?: string }) => (
  <div className="flex flex-col h-full justify-center">
    <div className="text-[11px] text-gray-400 font-light mb-2">{label}</div>
    <div className="text-4xl font-bold text-gray-800 leading-none mb-3">{value}</div>
    {subValue && <div className="text-[10px] text-gray-400 font-light uppercase tracking-wider">{subValue}</div>}
  </div>
);

const DoughnutChart = ({ data, totalLabel, isEmpty = false }: { data: CategoryItem[], totalLabel: string, isEmpty?: boolean }) => {
  const chartData = useMemo(() => data.map(item => ({ name: item.name, value: item.count })), [data]);
  const isActuallyEmpty = chartData.every(v => v.value === 0);
  
  const displayData = isActuallyEmpty ? [{ name: 'Empty', value: 1 }] : chartData;
  const colors = isActuallyEmpty ? ['#f5f7fa'] : data.map(i => i.color);

  return (
    <div className="flex items-center justify-between h-full">
      <div className="w-32 h-32 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={58}
              stroke="none"
              dataKey="value"
            >
              {displayData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-gray-300 font-light mb-0.5">?</span>
          <span className="text-base font-bold text-gray-700">{totalLabel}</span>
        </div>
      </div>
      <div className="flex-1 ml-8 space-y-2.5">
        {data.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[11px] text-gray-500 font-light">{item.name}</span>
            </div>
            <span className="text-xs font-semibold text-gray-600">{item.count}{item.id === 'normal' ? '' : ' 张'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [activePrimary, setActivePrimary] = useState('contractor');
  const [activeSecondary, setActiveSecondary] = useState('face');

  const archiveCategories = [
    { id: 'normal', name: '普通人脸', count: 1, color: '#3b82f6' },
    { id: 'black', name: '黑名单', count: 0, color: '#ef4444' },
    { id: 'white', name: '白名单', count: 0, color: '#22c55e' },
  ];

  const sampleCategories = [
    { id: 'normal', name: '普通人脸', count: 0, color: '#3b82f6' },
    { id: 'black', name: '黑名单', count: 0, color: '#ef4444' },
    { id: 'white', name: '白名单', count: 0, color: '#22c55e' },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FF] font-sans text-gray-900 overflow-hidden" id="app-root">
      {/* Primary Sidebar (Narrow) - Remains fixed to the left edge */}
      <aside className="w-[72px] bg-transparent flex flex-col items-center py-6 flex-shrink-0 z-40 border-r border-gray-200/50" id="p-sidebar">
        <div className="mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/10">V</div>
        </div>
        
        <div className="flex-1 flex flex-col items-center space-y-7">
          <SidebarIcon icon={Monitor} active={activePrimary === 'monitor'} title="区域综合态势" onClick={() => setActivePrimary('monitor')} />
          <SidebarIcon icon={ShieldCheck} active={activePrimary === 'shield'} title="资产管理" onClick={() => setActivePrimary('shield')} />
          <SidebarIcon icon={Database} active={activePrimary === 'contractor'} title="承包商链条管控" onClick={() => setActivePrimary('contractor')} />
          <SidebarIcon icon={AreaChart} active={activePrimary === 'chart'} title="全局安全分析" onClick={() => setActivePrimary('chart')} />
          <SidebarIcon icon={LayoutTemplate} active={activePrimary === 'template'} title="标准安全模板" onClick={() => setActivePrimary('template')} />
          <SidebarIcon icon={Settings} active={activePrimary === 'settings'} title="系统配置" onClick={() => setActivePrimary('settings')} />
        </div>
        
        <div className="mt-auto space-y-7 flex flex-col items-center">
          <div className="relative cursor-pointer">
             <div className="w-4 h-4 rounded-full bg-red-500 text-[9px] text-white flex items-center justify-center absolute -top-1.5 -right-1.5 border-2 border-[#F8F9FF]">3</div>
             <BellRing className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
          </div>
          <HelpCircle className="w-5 h-5 text-gray-400 cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-xs ring-1 ring-gray-100 shadow-sm cursor-pointer">T</div>
        </div>
      </aside>

      {/* Secondary Sidebar (Wider) - Now outside the sheet - Only show for 'shield' */}
      {activePrimary === 'shield' && (
        <aside className="w-52 bg-transparent pt-4 pb-6 flex flex-col flex-shrink-0 z-30 animate-in fade-in slide-in-from-left-4 duration-300" id="s-sidebar">
          <div className="px-8 py-2 mb-1 text-base font-bold text-gray-800 tracking-tight">资产管理</div>
          
          <div className="flex-1 overflow-y-auto">
            <SubSidebarItem label="设备管理" active={activeSecondary === 'device'} onClick={() => setActiveSecondary('device')} />
            <SubSidebarItem label="人脸管理" active={activeSecondary === 'face'} onClick={() => setActiveSecondary('face')} />
            <SubSidebarItem label="车牌管理" active={activeSecondary === 'plate'} onClick={() => setActiveSecondary('plate')} />
            <SubSidebarItem label="自定义资产库" active={activeSecondary === 'custom'} onClick={() => setActiveSecondary('custom')} />
          </div>
        </aside>
      )}

      {/* The "Big Floating White Box" Sheet - Now only contains content */}
      <div className={`flex-1 my-3 flex bg-white rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] overflow-hidden border border-white transition-all duration-300 ${activePrimary === 'shield' ? 'mr-3' : 'mx-3'}`} id="big-white-box">
        {activePrimary === 'monitor' ? (
          <DiscoveryPage />
        ) : activePrimary === 'contractor' ? (
          <ContractorControlPage />
        ) : (
          /* Interior Main Content Area */
          <main className="flex-1 flex flex-col overflow-hidden bg-white" id="main-content">
          {/* Navigation Breadcrumb Header */}
          <header className="h-[56px] bg-white border-b border-gray-50 px-10 flex items-center justify-start flex-shrink-0 z-10" id="header">
            <div className="flex items-center text-[11px] text-gray-400 space-x-2 font-light">
              <span className="hover:text-gray-800 cursor-pointer transition-colors font-medium">人脸库设置</span>
              <span className="text-gray-200">/</span>
              <span className="hover:text-gray-800 cursor-pointer transition-colors">资产管理</span>
              <span className="text-gray-200">/</span>
              <span className="hover:text-gray-800 cursor-pointer transition-colors">人脸管理</span>
              <span className="text-gray-200">/</span>
              <span className="text-gray-900 font-semibold tracking-tight">人脸库设置</span>
            </div>
          </header>

          {/* Scrollable Dashboard Body */}
          <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-white" id="dashboard-body">
            {/* Header Action Bar */}
            <div className="flex items-center justify-between" id="action-bar">
              <div className="flex flex-col">
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight mb-2.5">人脸库设置</h2>
                <div className="flex items-center space-x-12 text-[11px]">
                  <button className="flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1.5" />
                    返回人脸管理
                  </button>
                  <span className="text-gray-300 font-light">最后刷新：2026/4/29 10:14:33</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="bg-white border border-gray-100 px-5 py-2.5 rounded-xl text-xs text-gray-600 font-medium flex items-center hover:border-gray-300 transition-all">
                  <Search className="w-4 h-4 mr-2.5 text-gray-400" />
                  向量检索
                </button>
                <button className="bg-white border border-gray-100 px-5 py-2.5 rounded-xl text-xs text-gray-600 font-medium flex items-center hover:border-gray-300 transition-all">
                  <LayoutTemplate className="w-4 h-4 mr-2.5 text-gray-400" />
                  算法与向量配置
                </button>
                <button className="bg-white border border-gray-100 p-2.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors">
                  <RotateCw className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Top Level Summary Cards - Flat with accent borders */}
            <div className="grid grid-cols-4 gap-6" id="stats-summary">
              <Card noPadding className="h-32 bg-white">
                <div className="p-6 h-full border-t-4 border-blue-500 rounded-t-lg shadow-sm shadow-blue-500/5"><StatsCard label="人脸档案" value="1" subValue="当前有效档案" /></div>
              </Card>
              <Card noPadding className="h-32 bg-white">
                <div className="p-6 h-full border-t-4 border-green-500 rounded-t-lg shadow-sm shadow-green-500/5"><StatsCard label="照片样本" value="0" subValue="已通过检测质检" /></div>
              </Card>
              <Card noPadding className="h-32 bg-white">
                <div className="p-6 h-full border-t-4 border-purple-500 rounded-t-lg shadow-sm shadow-purple-500/5"><StatsCard label="向量入库" value="0" subValue="0%" /></div>
              </Card>
              <Card noPadding className="h-32 bg-white">
                <div className="p-6 h-full border-t-4 border-red-500 rounded-t-lg shadow-sm shadow-red-500/5"><StatsCard label="异常照片" value="0" subValue="需要重试或排查" /></div>
              </Card>
            </div>

          {/* Visualization Grid Layout */}
          <div className="grid grid-cols-2 gap-8" id="primary-visuals">
            <Card title="档案类别占比">
              <div className="h-44"><DoughnutChart data={archiveCategories} totalLabel="1" /></div>
            </Card>
            <Card title="样本类别占比">
              <div className="h-44"><DoughnutChart data={sampleCategories} totalLabel="0 张" /></div>
            </Card>
          </div>

          {/* Complex Distribution Grid */}
          <div className="grid grid-cols-4 gap-8" id="distribution-grid">
            <div className="col-span-3 space-y-8">
              <Card title="向量处理分布">
                <div className="py-2">
                  <div className="h-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center mb-6">
                    <span className="text-[10px] text-gray-300 font-light tracking-widest uppercase">暂无数据分布</span>
                  </div>
                  <div className="flex items-center space-x-8">
                    {[
                      { label: '已入库', color: '#52c41a' },
                      { label: '待索引', color: '#faad14' },
                      { label: '索引失败', color: '#f5222d' },
                      { label: '未启用', color: '#8c8c8c' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[11px] text-gray-400 font-light">{item.label} 0</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
              
              <div className="grid grid-cols-2 gap-8">
                <Card title="样本密度">
                  <div className="py-2">
                    <div className="text-4xl font-bold text-gray-800 tracking-tight">0.00</div>
                    <div className="text-[11px] text-gray-400 font-light mt-3 uppercase tracking-tighter">人均照片（档案维度）</div>
                  </div>
                </Card>
                <Card title="最近活动">
                  <div className="space-y-5 py-2">
                    <div className="flex justify-between items-center text-[11px] text-gray-500">
                      <span>最新样本入库</span>
                      <span className="text-gray-300">—</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-gray-500 border-t border-gray-50 pt-5">
                      <span>最近向量索引</span>
                      <span className="text-gray-300">—</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            
            <Card title="检测与质量">
              <div className="space-y-6 py-2">
                {[
                  { label: '平均质量分', value: '—' },
                  { label: '质量区间', value: '— ~ —' },
                  { label: '平均检测置信度', value: '—' },
                ].map((item, idx) => (
                  <div key={idx} className={`flex justify-between items-center text-[11px] ${idx > 0 ? 'border-t border-gray-50 pt-6' : ''}`}>
                    <span className="text-gray-500 font-light">{item.label}</span>
                    <span className="text-gray-400 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Indexing Status Cards Row */}
          <div className="space-y-6" id="indexing-row">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-700">向量索引状态</h3>
              <div className="text-[10px] text-gray-400 flex items-center">
                 <span className="text-gray-800 font-bold mr-1">0%</span> 已入库
              </div>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: '已入库', color: '#52c41a' },
                { label: '待索引', color: '#faad14' },
                { label: '索引失败', color: '#f5222d' },
                { label: '未启用', color: '#bfbfbf' },
              ].map(status => (
                <div key={status.label} className="bg-white rounded-lg p-5 border border-gray-100 flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.color }} />
                    <span className="text-[11px] text-gray-500 font-light">{status.label}</span>
                  </div>
                  <div className="text-3xl font-extrabold text-gray-800">0</div>
                </div>
              ))}
            </div>
          </div>

          {/* List Style Categories */}
          <Card title="类别分布" extra={<span className="font-light">照片 0 张</span>}>
            <div className="space-y-3 pt-2">
              {[
                { label: '普通人脸', id: 'normal', stats: '1 人 / 0 张', color: 'blue' },
                { label: '黑名单', id: 'black', stats: '0 人 / 0 张', color: 'red' },
                { label: '白名单', id: 'white', stats: '0 人 / 0 张', color: 'green' },
              ].map(cat => (
                <div key={cat.id} className="group cursor-pointer">
                  <div className="flex items-center h-8">
                    <span className={`px-4 h-6 flex items-center rounded-sm text-[10px] font-bold tracking-wider ${
                      cat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                      cat.color === 'red' ? 'bg-red-50 text-red-600' :
                      'bg-green-50 text-green-600'
                    }`}>
                      {cat.label}
                    </span>
                    <div className="flex-1 mx-8 h-[1px] bg-gray-100 group-hover:bg-gray-200 transition-colors" />
                    <span className="text-[11px] text-gray-400 font-light italic">{cat.stats}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
      )}
      </div>
    </div>
  );
}
