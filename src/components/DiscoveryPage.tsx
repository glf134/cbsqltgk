import React from 'react';
import { Plus, Flame, Pencil, Scan, Languages, GraduationCap, Code2, UserCircle2, BrainCircuit, Type, Image as ImageIcon, MessageSquareQuote, FileJson, Sparkles, BookOpenCheck, MousePointer2 } from 'lucide-react';

const CategoryButton = ({ label, active }: { label: string; active?: boolean }) => (
  <button className={`px-5 py-1.5 rounded-lg text-sm transition-all ${active ? 'bg-zinc-800 text-white font-medium' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}>
    {label}
  </button>
);

interface AgentCardProps {
  icon: any;
  title: string;
  description: string;
  stats: string;
  author: string;
  iconBg: string;
  key?: any;
}

const AgentCard = ({ 
  icon: Icon, 
  title, 
  description, 
  stats, 
  author,
  iconBg
}: AgentCardProps) => (
  <div className="bg-white border border-gray-100/80 rounded-2xl p-5 hover:shadow-lg hover:shadow-gray-200/40 transition-all cursor-pointer group">
    <div className="flex items-start space-x-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${iconBg} shadow-sm group-hover:scale-105 transition-transform`}>
        {typeof Icon === 'string' ? (
            <img src={Icon} alt="" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
        ) : (
            <Icon className="w-8 h-8 text-white/90" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-gray-900 font-bold text-base mb-1 truncate">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2 h-10">{description}</p>
        <div className="flex items-center space-x-3 text-[11px] text-gray-400">
          <div className="flex items-center">
            <Flame className="w-3 h-3 mr-1 text-gray-300" />
            <span>{stats} 人聊过</span>
          </div>
          <span>•</span>
          <span className="hover:text-gray-600 transition-colors">@{author}</span>
        </div>
      </div>
    </div>
  </div>
);

const DiscoveryPage = () => {
  const agents = [
    {
      title: "全能写作助手",
      description: "提供多种文案创作选择，轻松完成各种文案任务。",
      stats: "1344.9 万",
      author: "豆包官方",
      icon: Pencil,
      iconBg: "bg-amber-100 text-amber-500"
    },
    {
      title: "识图生成提示词",
      description: "上传图片，根据图片内容精准生成提示词，帮助你创作。",
      stats: "105.7 万",
      author: "豆包识图",
      icon: Scan,
      iconBg: "bg-blue-600 text-white"
    },
    {
      title: "英文写作润色",
      description: "An assistant dedicated to polishing English writing to perfection.",
      stats: "34.4 万",
      author: "豆包官方",
      icon: Type,
      iconBg: "bg-orange-50 text-orange-400"
    },
    {
      title: "高情商回复",
      description: "聊天时不知道怎么回复，我来帮你~",
      stats: "1260.4 万",
      author: "艾比斯之梦",
      icon: MessageSquareQuote,
      iconBg: "bg-red-400 text-white"
    },
    {
      title: "中英翻译",
      description: "专业翻译助手，精准转换中英内容，专注翻译不走神。",
      stats: "301.8 万",
      author: "Deja Le",
      icon: Languages,
      iconBg: "bg-white border border-gray-100"
    },
    {
      title: "EXCEL大全",
      description: "拥有卓越数据处理能力，助您解决 Excel 各类难题。",
      stats: "21.8 万",
      author: "春风十里oh~",
      icon: FileJson,
      iconBg: "bg-blue-50 text-blue-500"
    },
    {
      title: "论文助手",
      description: "能力精炼严谨详实论文的专业帮手。",
      stats: "44.8 万",
      author: "欧阳困困",
      icon: BookOpenCheck,
      iconBg: "bg-gray-100 text-gray-500"
    },
    {
      title: "爆款文案",
      description: "知名博主，善写爆款文案，精通电商带货，粉丝活跃。",
      stats: "79.6 万",
      author: "如顾",
      icon: Sparkles,
      iconBg: "bg-slate-800 text-white"
    },
    {
      title: "python编程",
      description: "能助您精通 Python 编程，涵盖知识全面的专业助手。",
      stats: "26.5 万",
      author: "老陆",
      icon: Code2,
      iconBg: "bg-black text-white"
    },
    {
      title: "公文写作",
      description: "一个神秘的智能体，专注于政府公文编写。",
      stats: "10.6 万",
      author: "多磨",
      icon: UserCircle2,
      iconBg: "bg-stone-800 text-white"
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden pb-10" id="discovery-page">
      {/* Search and Action Bar */}
      <div className="px-10 pt-10 pb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">发现 AI 智能体</h1>
        <div className="flex items-center space-x-3">
          <button className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100">
            我创建的
          </button>
          <button className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all flex items-center shadow-md shadow-blue-500/20">
            <Plus className="w-4 h-4 mr-1.5" strokeWidth={3} />
            创建 AI 智能体
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-10 mb-8 flex items-center space-x-2">
        <CategoryButton label="工作" active />
        <CategoryButton label="学习" />
        <CategoryButton label="创作" />
        <CategoryButton label="生活" />
      </div>

      {/* Agents Grid */}
      <div className="flex-1 overflow-y-auto px-10 custom-scrollbar">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          {agents.map((agent, index) => (
            <AgentCard key={index} {...agent} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoveryPage;
