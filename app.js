const state = {
  view: 'projects',
  sidebarCollapsed: false,
  mobileNavOpen: false,
  projectTab: 'independent',
  accountOpen: false,
  profile: { name:'管理员', email:'admin@example.com' },
  openGroups: new Set(['content', 'assessment', 'plans', 'relations']),
  activeCourseIndex: 0,
  activeProjectIndex: 0,
  scoreTab: 'segments',
  // 分页：每页 5 条；按 viewKey 存当前页码；刷新后恢复
  pageSize: 5,
  currentPage: {},
  projects: [
    {
      order: 1, name: '心理健康测评', description: '综合心理健康评估', type: '独立测评', questions: 1, status: '草稿', shelf: '已下架', date: '2024-11-15',
      questionItems: [{
        content: '你最近是否感到情绪低落？', type: '单选题', category: '情绪状态', weight: 1, required: true,
        options: [{ content: '从不', score: 0 }, { content: '偶尔', score: 1 }, { content: '经常', score: 2 }, { content: '总是', score: 3 }], branchRules: [],
      }],
      jumpRules: [],
      scoring: {
        segments: [
          { min: 0, max: 30, title: '低风险', description: '心理健康状况良好，继续保持' },
          { min: 31, max: 60, title: '中等风险', description: '存在一定心理压力，建议适当调节' },
          { min: 61, max: 100, title: '高风险', description: '建议及时寻求专业心理支持' },
        ],
        groups: [],
        script: 'return { title: totalScore >= 6 ? "高分" : "常规", score: totalScore };',
      },
    },
  ],
  jumpMode: 'visual',
  seriesItems: [
    { name: '综合心理健康评估', description: '包含心理健康、情绪管理和人际关系三个维度的综合评估', projects: ['心理健康测评','情绪管理测评','人际关系测评'], questions: 85, date: '2025-01-20', enabled: true, shelf: '已下架' },
    { name: '职业规划系列测评', description: '帮助学生了解职业兴趣和性格特点，进行职业规划', projects: ['职业兴趣测评','性格类型测评'], questions: 105, date: '2025-01-18', enabled: true, shelf: '已下架' },
  ],
  resultItems: [
    { name:'陈同学', id:'U005', test:'心理健康测评', type:'实名', group:'全校学生', score:'76', rawScore:76, normalizedScore:76, scoreScale:100, level:'中等风险', resultDescription:'存在一定心理压力，建议适当调节并持续观察。', dimensionScores:[['情绪稳定',71],['压力应对',62],['人际支持',84]], riskTags:['轻度压力'], recommendations:['保持规律作息，并记录一周内的情绪变化。','完成情绪调节训练后再次评估。'], time:'2025-04-18 10:20', status:'已完成' },
    { name:'张小明', id:'U001', test:'大五人格测试', type:'实名', group:'全体员工', score:'85', time:'2024-03-15 14:30', status:'已完成' },
    { name:'匿名用户001', id:'A001', test:'大五人格测试', type:'匿名', group:'新入职员工', score:'72', time:'2024-03-15 16:20', status:'已完成' },
    { name:'李小红', id:'U002', test:'职业压力测评', type:'实名', group:'中层管理', score:'58', time:'2024-03-16 10:15', status:'已完成' },
    { name:'王小刚', id:'U003', test:'职业压力测评', type:'实名', group:'一线员工', score:'-', time:'-', status:'进行中' },
    { name:'匿名用户002', id:'A002', test:'抑郁自评量表', type:'匿名', group:'全员', score:'42', time:'2024-03-14 09:30', status:'已完成' },
  ],
  planItems: [
    { name:'2025春季心理健康测评计划', description:'面向全校学生的春季心理健康状况评估', method:'关联测评', status:'已发布', tasks:['心理健康测评'], start:'2025-03-01', end:'2025-06-30', groups:['全校学生'], delivery:'按个人下发' },
    { name:'六年级毕业生职业规划测评', description:'帮助六年级学生了解自己的职业兴趣和性格特点', method:'关联测评', status:'进行中', tasks:['职业规划系列测评'], start:'2025-04-01', end:'2025-06-15', groups:['六年级全体学生'], delivery:'按个人下发' },
    { name:'一年级AI助手培训计划', description:'通过AI智能体帮助一年级学生适应学习环境', method:'直接选择任务', status:'草稿', tasks:['AI学习规划助手'], start:'', end:'', groups:['一年级全体学生'], delivery:'按个人下发' },
    { name:'春季学习能力测评（草稿）', description:'测评学生的学习能力和学习风格', method:'关联测评', status:'草稿', tasks:['学习能力综合测评'], start:'', end:'', groups:['四年级全体学生'], delivery:'按个人下发' },
    { name:'情商培养训练计划（草稿）', description:'通过AI助手和培训课程提升学生情商', method:'直接选择任务', status:'草稿', tasks:['情商培养AI导师'], start:'', end:'', groups:['五年级全体学生'], delivery:'按个人下发' },
  ],
  relationItems: [
    { project:'心理健康测评', type:'总分区间', trigger:'焦虑维度得分 60-80 分', tasks:['放松训练课程','正念冥想练习'], conditions:[{min:60,max:80}], date:'2025-01-15', enabled:true },
    { project:'心理健康测评', type:'维度得分', trigger:'抑郁维度得分 ≥ 70 分', tasks:['情绪管理课程','认知行为练习'], conditions:[{from:1,to:5,min:70,max:100}], date:'2025-01-10', enabled:true },
    { project:'职业兴趣测评', type:'选项匹配', trigger:'艺术型倾向', tasks:['艺术创作工作坊','美学欣赏课程'], conditions:[{question:'q1',option:'艺术型倾向'}], date:'2025-01-08', enabled:true },
    { project:'心理健康测评', type:'脚本导入', trigger:'通过脚本配置', tasks:['通过脚本配置'], date:'2025-01-20', enabled:true },
    { project:'综合心理健康评估', type:'按照测评项目任务关联', trigger:'自动应用项目关联规则', tasks:['放松训练课程','正念冥想练习','心理咨询预约','情绪日记'], date:'2025-01-22', enabled:true },
  ],
  courseItems: [
    { id:'course-emotion-101', name:'情绪管理基础课', category:'心理成长', description:'帮助学习者认识常见情绪，掌握日常调节方法。', mode:'随到随学', unlock:'顺序解锁', start:'', end:'', status:'已发布', shelf:'已上架', updated:'2026-08-28', chapters:[
      { id:'chapter-emotion-1', name:'第一章 认识情绪', lessons:[
        { id:'lesson-emotion-1', title:'情绪从哪里来', type:'视频', source:'情绪识别入门.mp4', required:true, completion:'观看完成', duration:'12分钟' },
        { id:'lesson-emotion-2', title:'我的情绪观察表', type:'文档', source:'情绪观察记录表.pdf', required:false, completion:'打开内容', duration:'5分钟' },
      ]},
      { id:'chapter-emotion-2', name:'第二章 调节方法', lessons:[
        { id:'lesson-emotion-3', title:'三分钟呼吸练习', type:'音频', source:'三分钟呼吸练习.mp3', required:true, completion:'播放完成', duration:'3分钟' },
      ]},
    ]},
    { id:'course-study-bootcamp', name:'高效学习训练营', category:'学习能力', description:'以知识讲解、练习和测评组合成系统化学习路径。', mode:'固定起止时间', unlock:'按日期解锁', start:'2026-09-15', end:'2026-10-15', status:'草稿', shelf:'已下架', updated:'2026-09-02', chapters:[
      { id:'chapter-study-1', name:'第一章 制定学习目标', lessons:[{ id:'lesson-study-1', title:'目标拆解方法', type:'图文', source:'课程图文内容', required:true, completion:'阅读完成', duration:'8分钟' }]},
    ]},
  ],
  videoItems: [
    { id:'video-breath-101', name:'三分钟呼吸放松', category:'心理成长', description:'通过一个短视频掌握基础呼吸放松方法。', detail:'适合日常压力调节的短视频练习。', cover:'三分钟呼吸放松封面', saleEnabled:true, saleType:'免费', price:'', accessCode:'', designatedGroup:'', validityType:'长期有效', validityDays:365, joinDeadlineType:'无限制', joinDeadline:'', productGroup:'心理成长', shelfMode:'立即上架', scheduledShelfAt:'', scheduledOff:false, scheduledOffAt:'', pauseSale:false, storeVisible:true, status:'已发布', shelf:'已上架', updated:'2026-09-03', video:{ id:'video-content-breath-101', title:'三分钟呼吸放松', source:'breathing-relax.mp4', duration:'3分钟', required:true, free:true, type:'视频', completion:'观看完成' } },
  ],
  articleItems: [
    { id:'article-emotion-101', name:'认识情绪的五个步骤', category:'心理成长', description:'用一篇图文快速了解情绪识别方法。', detail:'适合初次学习情绪管理的用户。', cover:'认识情绪封面', saleEnabled:true, saleType:'免费', price:'', accessCode:'', designatedGroup:'', validityType:'长期有效', validityDays:365, joinDeadlineType:'无限制', joinDeadline:'', productGroup:'心理成长', shelfMode:'立即上架', scheduledShelfAt:'', scheduledOff:false, scheduledOffAt:'', pauseSale:false, storeVisible:true, status:'已发布', shelf:'已上架', updated:'2026-09-04', article:{ id:'article-content-emotion-101', title:'认识情绪的五个步骤', body:'从识别身体信号开始，记录触发事件、情绪名称、强度和应对方式。', duration:'5分钟', free:true, type:'图文', completion:'阅读完成' } },
  ],
  productGroups: [
    { id:'group-default', name:'默认分组', enabled:true, order:1 },
    { id:'group-mental', name:'心理成长', enabled:true, order:2 },
    { id:'group-study', name:'学习能力', enabled:true, order:3 },
    { id:'group-quality', name:'综合素养', enabled:true, order:4 },
  ],
};

const persistentKeys = ['projects','seriesItems','resultItems','planItems','relationItems','courseItems','videoItems','articleItems','productGroups'];
// 会话状态：view / 侧边栏 / 当前选中项 / Tab —— 单独持久化（不是数组，写法不同）
const sessionStateKeys = ['view','sidebarCollapsed','projectTab','activeCourseIndex','activeProjectIndex','scoreTab','currentPage','projectRelationContext'];
let savedState = {};
try {
  savedState = JSON.parse(localStorage.getItem('assessment-admin-state') || '{}');
  persistentKeys.forEach((key) => { if (Array.isArray(savedState[key])) state[key] = savedState[key]; });
  sessionStateKeys.forEach((key) => { if (savedState[key] !== undefined) state[key] = savedState[key]; });
  if (Array.isArray(savedState.openGroups)) state.openGroups = new Set(savedState.openGroups);
  if (savedState.profile && typeof savedState.profile === 'object') state.profile = { ...state.profile,...savedState.profile };
  // 数据迁移：剔除已废弃的"选择关联任务规则"和"选择补充测评"创建方式的计划
  state.planItems = state.planItems.filter((item) => item.method !== '选择关联任务规则' && item.method !== '选择补充测评');
} catch (_) {
  localStorage.removeItem('assessment-admin-state');
}

const defaultSegments = () => [
  { min: 0, max: 30, title: '低风险', description: '心理健康状况良好，继续保持' },
  { min: 31, max: 60, title: '中等风险', description: '存在一定心理压力，建议适当调节' },
  { min: 61, max: 100, title: '高风险', description: '建议及时寻求专业心理支持' },
];

const reportRegistry = [
  { key:'generic-v1', name:'通用测评报告', version:'v1', family:'通用', description:'基础得分、结果等级和维度概览，作为未配置项目的兜底报告', required:'totalScore · level · dimensions' },
  { key:'mental-health-v1', name:'心理健康报告', version:'v1', family:'心理健康', description:'经典心理筛查报告，突出风险等级与维度得分', required:'totalScore · dimensions · riskTags' },
  { key:'mental-health-v2', name:'心理健康报告', version:'v2', family:'心理健康', description:'新版干预型心理报告，增加趋势说明和后续行动建议', required:'totalScore · dimensions · recommendations' },
  { key:'career-profile-v1', name:'职业画像报告', version:'v1', family:'职业发展', description:'职业类型画像、兴趣倾向与推荐方向', required:'dimensions · extensionData.careerCodes' },
  { key:'ability-radar-v1', name:'能力雷达报告', version:'v1', family:'能力测评', description:'能力分布、优势项和待提升项的可视化报告', required:'totalScore · dimensions' },
];
const reportDefinition = (key) => reportRegistry.find((item) => item.key===key) || reportRegistry[0];
const defaultReportKey = (project) => project.name?.includes('心理') ? 'mental-health-v2' : project.name?.includes('职业') ? 'career-profile-v1' : project.name?.includes('能力') ? 'ability-radar-v1' : 'generic-v1';
function ensureProjectReport(project) {
  if (!project.report || typeof project.report!=='object') project.report={ key:defaultReportKey(project),enabled:true,updatedAt:project.date || '' };
  if (!reportRegistry.some((item) => item.key===project.report.key)) project.report.key='generic-v1';
  if (typeof project.report.enabled!=='boolean') project.report.enabled=true;
}

function normalizeProjectData(project, index) {
  if (!Array.isArray(project.questionItems)) project.questionItems = index === 0 && Array.isArray(savedState.questions) ? savedState.questions : [];
  project.questionItems = project.questionItems.map((question) => {
    const { report:legacyReport, reportKey:legacyReportKey, reportTemplate:legacyReportTemplate, ...questionData } = question;
    return { ...questionData, options:Array.isArray(questionData.options) ? questionData.options : [], branchRules:Array.isArray(questionData.branchRules) ? questionData.branchRules : [], scale:questionData.scale || { min:1, max:5, minLabel:'非常不同意', maxLabel:'非常同意' } };
  });
  if (!Array.isArray(project.jumpRules)) project.jumpRules = index === 0 && Array.isArray(savedState.jumpRules) ? savedState.jumpRules : [];
  if (!project.scoring || typeof project.scoring !== 'object') project.scoring = {};
  if (!Array.isArray(project.scoring.segments)) project.scoring.segments = index === 0 ? defaultSegments() : [];
  if (!Array.isArray(project.scoring.groups)) project.scoring.groups = [];
  if (typeof project.scoring.script !== 'string') project.scoring.script = 'return { title: totalScore >= 60 ? "高分" : "常规", score: totalScore };';
  project.questions = project.questionItems.length;
  project.order = index + 1;
  ensureProjectReport(project);
  if (!['已上架','已下架'].includes(project.shelf)) {
    const legacy = savedState.publishItems?.find((item) => item.name === project.name && item.type === '单项');
    project.shelf = legacy?.status === '已上架' ? '已上架' : '已下架';
  }
}
state.projects.forEach(normalizeProjectData);
state.seriesItems.forEach((series) => {
  ensureProjectReport(series);
  if (!['已上架','已下架'].includes(series.shelf)) {
    const legacy = savedState.publishItems?.find((item) => item.name === series.name && item.type === '系列');
    series.shelf = legacy?.status === '已上架' ? '已上架' : '已下架';
  }
});
function normalizeProductShare(item) {
  const share=item.shareSettings || {};
  item.shareSettings={
    allowUserShare:share.allowUserShare !== false,
    titleCustom:Boolean(share.titleCustom),
    title:String(share.title || ''),
    descriptionCustom:Boolean(share.descriptionCustom),
    description:String(share.description || ''),
    imageCustom:Boolean(share.imageCustom),
    image:String(share.image || '')
  };
}
state.courseItems.forEach((course,index) => {
  course.id=course.id || `course-${Date.now()}-${index}`; course.category=course.category || '未分类'; course.description=course.description || '';
  course.detail=course.detail || ''; course.cover=course.cover || `${course.name || '课程'}封面`; course.saleEnabled=course.saleEnabled !== false; course.passwordEnabled=Boolean(course.passwordEnabled || course.saleType==='加密'); course.saleType=course.saleType==='加密'?'免费':course.saleType || '免费'; course.price=course.price || ''; course.accessCode=course.accessCode || ''; course.designatedGroup=course.designatedGroup || '';
  course.validityType=course.validityType || '长期有效'; course.validityDays=course.validityDays || 365; course.joinDeadlineType=course.joinDeadlineType || '无限制'; course.joinDeadline=course.joinDeadline || ''; course.productGroup=course.productGroup || '默认分组';
  course.shelfMode=course.shelfMode || (course.shelf==='已上架'?'立即上架':'暂不上架'); course.scheduledShelfAt=course.scheduledShelfAt || ''; course.scheduledOff=Boolean(course.scheduledOff); course.scheduledOffAt=course.scheduledOffAt || ''; course.pauseSale=Boolean(course.pauseSale); course.storeVisible=course.storeVisible !== false;
  course.mode=course.mode || '随到随学'; course.unlock=course.unlock || '顺序解锁'; course.start=course.start || ''; course.end=course.end || '';
  course.status=course.status || '草稿'; course.shelf=course.shelf || '已下架'; course.updated=course.updated || new Date().toISOString().slice(0,10);
  normalizeProductShare(course);
  course.chapters=(Array.isArray(course.chapters)?course.chapters:[]).flatMap((chapter,chapterIndex) => {
    const chapterId=chapter.id || `${course.id}-chapter-${chapterIndex+1}`;
    const lessons=(Array.isArray(chapter.lessons)?chapter.lessons:[]).map((lesson) => ({...lesson,type:'视频',completion:'观看完成',preview:Boolean(lesson.preview ?? lesson.free),free:Boolean(lesson.preview ?? lesson.free)}));
    if (lessons.length<=1) return [{...chapter,id:chapterId,lessons}];
    return lessons.map((lesson,lessonIndex) => ({...chapter,id:lessonIndex===0?chapterId:`${chapterId}-split-${lessonIndex+1}`,name:lessonIndex===0?chapter.name:`${chapter.name} · ${lesson.title}`,lessons:[lesson]}));
  });
});
state.videoItems.forEach((video,index) => {
  video.id=video.id || `video-${Date.now()}-${index}`; video.category=video.category || '未分类'; video.description=video.description || ''; video.detail=video.detail || ''; video.cover=video.cover || `${video.name || '视频'}封面`;
  video.saleEnabled=video.saleEnabled !== false; video.passwordEnabled=Boolean(video.passwordEnabled || video.saleType==='加密'); video.saleType=video.saleType==='加密'?'免费':video.saleType || '免费'; video.price=video.price || ''; video.accessCode=video.accessCode || ''; video.designatedGroup=video.designatedGroup || ''; video.validityType=video.validityType || '长期有效'; video.validityDays=video.validityDays || 365; video.joinDeadlineType=video.joinDeadlineType || '无限制'; video.joinDeadline=video.joinDeadline || ''; video.productGroup=video.productGroup || '默认分组'; video.shelfMode=video.shelfMode || (video.shelf==='已上架'?'立即上架':'暂不上架'); video.scheduledShelfAt=video.scheduledShelfAt || ''; video.scheduledOff=Boolean(video.scheduledOff); video.scheduledOffAt=video.scheduledOffAt || ''; video.pauseSale=Boolean(video.pauseSale); video.storeVisible=video.storeVisible !== false; video.status=video.status || '草稿'; video.shelf=video.shelf || '已下架'; video.updated=video.updated || new Date().toISOString().slice(0,10);
  normalizeProductShare(video);
  video.video={id:video.video?.id || `${video.id}-content`,title:video.video?.title || video.name || '',source:video.video?.source || '',duration:video.video?.duration || '',required:video.video?.required !== false,preview:Boolean(video.video?.preview ?? video.video?.free),free:Boolean(video.video?.preview ?? video.video?.free),type:'视频',completion:'观看完成'};
});
state.articleItems.forEach((article,index) => {
  article.id=article.id || `article-${Date.now()}-${index}`; article.category=article.category || '未分类'; article.description=article.description || ''; article.detail=article.detail || ''; article.cover=article.cover || `${article.name || '图文'}封面`;
  article.saleEnabled=article.saleEnabled !== false; article.passwordEnabled=Boolean(article.passwordEnabled || article.saleType==='加密'); article.saleType=article.saleType==='加密'?'免费':article.saleType || '免费'; article.price=article.price || ''; article.accessCode=article.accessCode || ''; article.designatedGroup=article.designatedGroup || ''; article.validityType=article.validityType || '长期有效'; article.validityDays=article.validityDays || 365; article.joinDeadlineType=article.joinDeadlineType || '无限制'; article.joinDeadline=article.joinDeadline || ''; article.productGroup=article.productGroup || '默认分组'; article.shelfMode=article.shelfMode || (article.shelf==='已上架'?'立即上架':'暂不上架'); article.scheduledShelfAt=article.scheduledShelfAt || ''; article.scheduledOff=Boolean(article.scheduledOff); article.scheduledOffAt=article.scheduledOffAt || ''; article.pauseSale=Boolean(article.pauseSale); article.storeVisible=article.storeVisible !== false; article.status=article.status || '草稿'; article.shelf=article.shelf || '已下架'; article.updated=article.updated || new Date().toISOString().slice(0,10);
  normalizeProductShare(article);
  article.article={id:article.article?.id || `${article.id}-content`,title:article.article?.title || article.name || '',body:article.article?.body || '',duration:article.article?.duration || '',preview:Boolean(article.article?.preview ?? article.article?.free),free:Boolean(article.article?.preview ?? article.article?.free),type:'图文',completion:'阅读完成'};
});
state.productGroups=state.productGroups.map((group,index) => ({id:group.id || `group-${index+1}`,name:group.name || `分组${index+1}`,enabled:group.enabled!==false,order:index+1}));

function currentProject() {
  if (!state.projects.length) return null;
  state.activeProjectIndex = Math.min(Math.max(0, state.activeProjectIndex), state.projects.length - 1);
  return state.projects[state.activeProjectIndex];
}
let scoringDraft = null;
let scoringDirty = false;
let scoringDeletedDimensions = [];
let jumpRulesDraft = null;
let jumpRulesDirty = false;
let modalDirty = false;
let suspendedModalHtml = '';
let suspendedModalNode = null;
const currentQuestions = () => currentProject()?.questionItems || [];
const currentJumpRules = () => jumpRulesDraft ?? currentProject()?.jumpRules ?? [];
const currentScoring = () => scoringDraft ?? currentProject()?.scoring ?? { segments:[], groups:[], script:'' };
const markScoringDirty = () => { scoringDirty = true; };
const markJumpRulesDirty = () => { jumpRulesDirty = true; };

function projectQuestionCount(name) {
  return state.projects.find((project) => project.name === name)?.questionItems?.length || 0;
}

function assessmentChoices(includeSupplementary = true) {
  const projects = state.projects.filter((project) => includeSupplementary || project.type !== '补充测评').map((project) => [project.name, project.type === '补充测评' ? '补充测评' : '单项测评', `${project.questionItems.length}题`]);
  const series = state.seriesItems.map((item) => [item.name, '系列测评', `包含${item.projects.length}个测评项目`]);
  return [...projects,...series].filter((item,index,all) => all.findIndex(([name]) => name === item[0]) === index);
}

function syncAssessmentMetadata() {
  state.projects.forEach((project) => {
    project.questions = project.questionItems.length;
    ensureProjectReport(project);
  });
  state.seriesItems.forEach((series) => {
    series.questions = series.projects.reduce((sum, name) => sum + projectQuestionCount(name), 0);
    if (!['已上架','已下架'].includes(series.shelf)) series.shelf = '已下架';
  });
}
syncAssessmentMetadata();

function persistState() {
  syncAssessmentMetadata();
  const savedState = Object.fromEntries(persistentKeys.map((key) => [key,state[key]]));
  sessionStateKeys.forEach((key) => { savedState[key] = state[key]; });
  savedState.openGroups = [...state.openGroups];
  savedState.profile = state.profile;
  localStorage.setItem('assessment-admin-state', JSON.stringify(savedState));
}

const icons = {
  user: '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M5 21a7 7 0 0 1 14 0"/>',
  clipboard: '<rect width="14" height="18" x="5" y="3" rx="2"/><path d="M9 3h6v4H9zM9 12h6M9 16h6"/>',
  calendar: '<rect width="18" height="17" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 9h18"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"/>',
  chevron: '<path d="m8 10 4 4 4-4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
  workflow: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 6h4a4 4 0 0 1 4 4v6M16 18h-4a4 4 0 0 1-4-4v-2"/>',
  power: '<path d="M12 2v10"/><path d="M18.4 6.6a8 8 0 1 1-12.8 0"/>',
  eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>',
  pencil: '<path d="m4 20 4.5-1 10-10a2 2 0 0 0-3-3l-10 10L4 20Z"/><path d="m13.5 7.5 3 3"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
  download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19v2h14v-2"/>',
  filter: '<path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z"/>', check: '<path d="m5 12 4 4L19 6"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  save: '<path d="M5 3h12l3 3v15H4V3h1Z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/>',
  arrow: '<path d="M19 12H5m6-6-6 6 6 6"/>', logout: '<path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>', layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  sidebar: '<path d="M4 4h16v16H4zM9 4v16"/>',
  play: '<path d="M8 5v14l11-7Z"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
};

const icon = (name, size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.info}</svg>`;
const esc = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

const navGroups = [
  { id: 'content', label: '内容管理', icon: 'layers', items: [['courses','系列课管理'],['videos','视频管理'],['articles','图文管理'],['product-groups','商品分组']] },
  { id: 'assessment', label: '测评管理', icon: 'clipboard', items: [['projects','测试项目管理'], ['series','系列测评管理'], ['results','测评结果']] },
  { id: 'plans', label: '计划管理', icon: 'calendar', items: [['plans','计划列表']] },
];
let productDetailTarget=null;
let shareTarget=null;
let shareTab='link';

function layout() {
  const contentView=productDetailTarget?.kind==='video'?'videos':productDetailTarget?.kind==='article'?'articles':'courses';
  const navActive=(view) => state.view===view || (state.view==='stage-config'&&view==='plans') || (state.view==='course-outline'&&view==='courses') || (state.view==='product-detail'&&view===contentView) || (state.view==='course-edit'&&view===(courseDraft?.kind==='video'?'videos':courseDraft?.kind==='article'?'articles':'courses'));
  const sidebar = navGroups.map((group) => {
    const active = group.items.some(([view]) => navActive(view));
    return `<section class="nav-group ${state.openGroups.has(group.id) ? '' : 'collapsed'} ${active ? 'active' : ''}">
      <button class="nav-group-toggle" data-group="${group.id}" title="${group.label}" aria-expanded="${state.openGroups.has(group.id)}">${icon(group.icon,18)}<span>${group.label}</span><span class="chevron">${icon('chevron',14)}</span></button>
      <div class="nav-children">${group.items.map(([view,label]) => `<button class="nav-item ${navActive(view) ? 'active' : ''}" data-view="${view}"><span class="nav-dot"></span><span>${label}</span></button>`).join('')}</div>
    </section>`;
  }).join('');

  return `
    <header class="topbar">
      <div class="brand"><span class="brand-mark">测</span><span class="brand-copy"><b>内容中台</b><small>测评与计划管理</small></span></div>
      <button class="mobile-menu" data-action="toggle-mobile-nav" aria-label="打开导航">${icon('menu',19)}</button>
      <div class="topbar-tools"><div class="global-search" aria-hidden="true">${icon('search',16)}<span>搜索功能</span><kbd>⌘ K</kbd></div><button class="account-button" data-action="account" aria-expanded="${state.accountOpen}"><span class="avatar">${icon('user', 17)}</span><span class="account-name">${esc(state.profile.name)}</span>${icon('chevron',14)}</button></div>
    </header>
    ${state.accountOpen ? `<div class="account-menu"><div class="menu-title">我的账户</div><button data-action="account-settings">${icon('settings',16)}账户设置</button><button class="danger" data-action="logout">${icon('logout',16)}退出登录</button></div>` : ''}
    ${state.mobileNavOpen ? '<button class="nav-backdrop" data-action="toggle-mobile-nav" aria-label="关闭导航"></button>' : ''}
    <aside class="sidebar ${state.sidebarCollapsed ? 'is-collapsed' : ''} ${state.mobileNavOpen ? 'is-open' : ''}"><div class="sidebar-head"><span class="sidebar-domain"><b>功能菜单</b></span><button class="sidebar-toggle" data-action="toggle-sidebar" aria-label="${state.sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}">${icon('sidebar',17)}</button></div><nav class="sidebar-nav" aria-label="功能菜单">${sidebar}</nav></aside>
    <main class="main ${state.sidebarCollapsed ? 'sidebar-is-collapsed' : ''}" id="main-content" tabindex="-1"><div class="page">${renderView()}</div></main>`;
}

const head = (title, subtitle, action = '') => `<div class="page-head"><div><h1 class="page-title">${title}</h1><p class="page-subtitle">${subtitle}</p></div>${action}</div>`;
const search = (placeholder, id = '') => `<div class="search-wrap"><span>${icon('search',17)}</span><input class="search" ${id ? `id="${id}"` : ''} placeholder="${placeholder}" /></div>`;
const badge = (text, kind = '') => `<span class="badge ${kind ? `badge-${kind}` : ''}">${text}</span>`;
const actionButtons = (extra = '') => `<div class="actions"><button class="btn btn-icon btn-ghost" title="查看">${icon('eye',17)}</button><button class="btn btn-icon btn-ghost" title="编辑">${icon('pencil',17)}</button>${extra}<button class="btn btn-icon btn-ghost btn-danger" title="删除">${icon('trash',16)}</button></div>`;
// 分片：返回当前页的子数组，每项带原始索引；调用方用 ({item, originalIndex: index})
const pageSlice = (viewKey, array) => {
  const pageSize = state.pageSize || 5;
  const totalPages = Math.max(1, Math.ceil(array.length / pageSize));
  const current = Math.min(Math.max(1, Number(state.currentPage[viewKey]) || 1), totalPages);
  state.currentPage[viewKey] = current;
  const start = (current - 1) * pageSize;
  return array.slice(start, start + pageSize).map((item, originalIndex) => ({ item, originalIndex: start + originalIndex }));
};

const pagination = (viewKey, total) => {
  const pageSize = state.pageSize || 5;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, Number(state.currentPage[viewKey]) || 1), totalPages);
  state.currentPage[viewKey] = current; // 写入并规范化（防止越界）
  const prevDisabled = current <= 1;
  const nextDisabled = current >= totalPages;
  const pageButtons = [];
  // 简化：最多显示 5 个页码
  const windowSize = 5;
  let start = Math.max(1, current - Math.floor(windowSize / 2));
  let end = Math.min(totalPages, start + windowSize - 1);
  if (end - start + 1 < windowSize) start = Math.max(1, end - windowSize + 1);
  for (let p = start; p <= end; p++) {
    pageButtons.push(`<button class="page-button ${p === current ? 'active' : ''}" data-action="goto-page" data-page-key="${viewKey}" data-page="${p}" aria-current="${p === current ? 'page' : 'false'}">${p}</button>`);
  }
  return `<div class="pagination"><span>共 ${total} 条 · 第 ${current}/${totalPages} 页</span><div><button class="page-button" data-action="goto-page" data-page-key="${viewKey}" data-page="${current - 1}" ${prevDisabled ? 'disabled' : ''} aria-label="上一页">‹</button>${pageButtons.join('')}<button class="page-button" data-action="goto-page" data-page-key="${viewKey}" data-page="${current + 1}" ${nextDisabled ? 'disabled' : ''} aria-label="下一页">›</button></div></div>`;
};
const breadcrumb = (parent, current, action = 'back') => `<nav class="breadcrumb" aria-label="面包屑"><button data-action="${action}" aria-label="${action === 'stage-back' ? '返回计划列表' : ['course-back','course-edit-cancel'].includes(action) ? '返回课程列表' : action === 'back-relation-list' ? `返回${parent}` : '返回项目列表'}">${parent}</button><span>/</span><strong>${current}</strong></nav>`;

function renderView() {
  const views = { courses, videos, articles, 'product-groups':productGroups, 'product-detail':productDetail, 'course-edit':courseEditor, 'course-outline':courseOutline, projects, series, results, plans, relations, questions, scoring, 'stage-config':stageConfig, 'project-relations':projectRelations, 'series-relations':seriesRelations };
  return (views[state.view] || projects)();
}

const uid=(prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
function currentCourse() { if (!state.courseItems.length) return null; state.activeCourseIndex=Math.min(Math.max(0,state.activeCourseIndex),state.courseItems.length-1); return state.courseItems[state.activeCourseIndex]; }
const courseLessonCount=(course) => (course.chapters || []).reduce((sum,chapter) => sum+(chapter.lessons || []).length,0);
const courseTypeCounts=(course) => [...new Set((course.chapters || []).flatMap((chapter) => (chapter.lessons || []).map((lesson) => lesson.type)))];
function touchCourse(course=currentCourse()) { course.updated=today(); course.status='草稿'; }
function courseReadinessIssues(course) {
  const issues=[];
  if (!String(course.name || '').trim()) issues.push('课程名称不能为空');
  if (!String(course.cover || '').trim()) issues.push('请配置课程封面');
  if (!course.chapters?.length) issues.push('至少创建一个章节');
  if (course.chapters?.some((chapter) => !String(chapter.name || '').trim())) issues.push('存在未命名章节');
  if (course.chapters?.some((chapter) => !chapter.lessons?.length)) issues.push('每个章节至少需要一个视频');
  if (course.chapters?.some((chapter) => chapter.lessons?.length>1)) issues.push('每个章节只能配置一个视频');
  const lessons=course.chapters?.flatMap((chapter) => chapter.lessons || []) || [];
  if (lessons.some((lesson) => !String(lesson.title || '').trim() || !String(lesson.source || '').trim())) issues.push('存在标题或视频来源为空的内容');
  return issues;
}

function courses() {
  const counts={all:state.courseItems.length,up:state.courseItems.filter((item) => item.shelf==='已上架').length,draft:state.courseItems.filter((item) => contentStatusOf(item,'series')==='草稿').length};
  const categories=[...new Set(state.courseItems.map((item) => item.category))];
  return `${head('系列课管理','管理由多个章节视频组成的系列课程',`<button class="btn btn-primary" data-action="new-course">${icon('plus',17)}新建系列课</button>`)}
    <div class="toolbar-card"><div class="toolbar" style="margin:0">${search('搜索系列课名称或简介...','course-search')}<select class="select" id="course-category"><option>全部分类</option>${categories.map((value) => `<option>${esc(value)}</option>`).join('')}</select><select class="select" id="course-shelf"><option>全部上下架</option><option>已上架</option><option>已下架</option></select></div></div>
    <div class="stats">${stat('全部系列课',counts.all,'layers')}${stat('已上架',counts.up,'check','green')}${stat('草稿系列课',counts.draft,'clock','gray')}${stat('章节视频',state.courseItems.reduce((sum,item) => sum+courseLessonCount(item),0),'clipboard')}</div>
    <div class="panel"><div class="table-scroll"><table class="data-table"><thead><tr><th>系列课名称</th><th>分类</th><th>目录结构</th><th>内容类型</th><th>售卖设置</th><th>内容 / 售卖状态</th><th>更新时间</th><th style="text-align:right">操作</th></tr></thead><tbody id="course-rows">${state.courseItems.length?pageSlice('courses',state.courseItems).map(({item, originalIndex}) => courseRow(item, originalIndex)).join(''):'<tr><td colspan="8" class="empty">暂无系列课，点击“新建系列课”开始创建</td></tr>'}</tbody></table></div>${pagination('courses',state.courseItems.length)}</div>`;
}

function courseRow(course,index) {
  const lessonCount=courseLessonCount(course); const types=courseTypeCounts(course);
  const previewCount=course.chapters.flatMap((chapter) => chapter.lessons || []).filter((lesson) => lesson.preview).length;
  return `<tr data-filter-text="${esc(`${course.name} ${course.description} ${course.category}`)}" data-category="${esc(course.category)}" data-shelf="${course.shelf}"><td><div class="course-title-cell"><span class="course-cover-mini">${esc(course.name.slice(0,1))}</span><div><div class="cell-title">${esc(course.name)}</div><div class="cell-sub">${esc(course.description)}</div></div></div></td><td>${badge(esc(course.category))}</td><td><div class="cell-title">${course.chapters.length} 章 · ${lessonCount} 视频</div><div class="cell-sub">${lessonCount ? `${previewCount} 个试看章节` : '尚未添加视频'}</div></td><td><div class="stack-tags">${types.slice(0,3).map((type) => badge(type,'blue')).join('')}${types.length>3?badge(`+${types.length-3}`):''}</div></td><td>${esc(course.saleEnabled ? course.saleType : '内部内容')}<div class="cell-sub">${esc(course.productGroup)}</div></td><td>${badge(contentStatusOf(course,'series'),contentStatusOf(course,'series')==='已发布'?'green':'')}<div class="cell-sub">${saleStatusOf(course)}</div></td><td class="cell-sub">${course.updated}</td><td><div class="actions"><button class="btn" data-action="share-product" data-kind="series" data-index="${index}" ${course.shelf==='已上架'?'':'disabled title="商品上架后可分享"'}>${icon('link',16)}分享</button><button class="btn btn-icon btn-ghost" data-action="view-product" data-kind="series" data-index="${index}" aria-label="查看系列课">${icon('eye',17)}</button><button class="btn btn-primary" data-action="course-outline" data-index="${index}">${icon('layers',16)}目录管理</button>${course.shelf==='已下架'?`<button class="btn btn-icon btn-ghost" data-action="edit-course" data-index="${index}" aria-label="编辑系列课">${icon('pencil',17)}</button>`:''}<button class="btn btn-icon btn-ghost" data-action="duplicate-course" data-index="${index}" aria-label="复制系列课">${icon('clipboard',16)}</button><button class="btn ${course.shelf==='已上架'?'':'btn-green'}" data-action="toggle-course-shelf" data-index="${index}">${icon('power',16)}${course.shelf==='已上架'?'下架':'上架'}</button>${course.shelf==='已下架'?`<button class="btn btn-icon btn-ghost btn-danger" data-action="delete-course" data-index="${index}" aria-label="删除系列课">${icon('trash',16)}</button>`:''}</div></td></tr>`;
}

function videoReadinessIssues(item) {
  const issues=[];
  if (!String(item.name || '').trim()) issues.push('视频名称不能为空');
  if (!String(item.cover || '').trim()) issues.push('请配置视频封面');
  if (!String(item.video?.source || '').trim()) issues.push('请配置视频来源');
  return issues;
}

function videos() {
  const counts={all:state.videoItems.length,up:state.videoItems.filter((item) => item.shelf==='已上架').length,draft:state.videoItems.filter((item) => contentStatusOf(item,'video')==='草稿').length,free:state.videoItems.filter((item) => item.video.preview).length};
  const categories=[...new Set(state.videoItems.map((item) => item.category))];
  return `${head('视频管理','管理可独立展示和售卖的单一视频内容',`<button class="btn btn-primary" data-action="new-video">${icon('plus',17)}新增视频</button>`)}
    <div class="toolbar-card"><div class="toolbar" style="margin:0">${search('搜索视频名称或简介...','video-search')}<select class="select" id="video-category"><option>全部分类</option>${categories.map((value) => `<option>${esc(value)}</option>`).join('')}</select><select class="select" id="video-shelf"><option>全部上下架</option><option>已上架</option><option>已下架</option></select></div></div>
    <div class="stats">${stat('全部视频',counts.all,'layers')}${stat('已上架',counts.up,'check','green')}${stat('草稿视频',counts.draft,'clock','gray')}${stat('支持试看',counts.free,'eye')}</div>
    <div class="panel"><div class="table-scroll"><table class="data-table"><thead><tr><th>视频名称</th><th>分类</th><th>视频内容</th><th>观看权限</th><th>售卖设置</th><th>内容 / 售卖状态</th><th>更新时间</th><th style="text-align:right">操作</th></tr></thead><tbody id="video-rows">${state.videoItems.length?pageSlice('videos',state.videoItems).map(({item, originalIndex}) => videoRow(item, originalIndex)).join(''):'<tr><td colspan="8" class="empty">暂无视频，点击“新增视频”开始创建</td></tr>'}</tbody></table></div>${pagination('videos',state.videoItems.length)}</div>`;
}

function videoRow(item,index) {
  return `<tr data-filter-text="${esc(`${item.name} ${item.description} ${item.category}`)}" data-category="${esc(item.category)}" data-shelf="${item.shelf}"><td><div class="course-title-cell"><span class="course-cover-mini">${esc(item.name.slice(0,1))}</span><div><div class="cell-title">${esc(item.name)}</div><div class="cell-sub">${esc(item.description)}</div></div></div></td><td>${badge(esc(item.category))}</td><td><div class="cell-title">${esc(item.video.title)}</div><div class="cell-sub">${esc(item.video.source)}${item.video.duration?` · ${esc(item.video.duration)}`:''}</div></td><td>${item.saleType==='付费'&&item.video.preview?badge('支持试看','green'):badge(item.saleType==='免费'?'免费获取':'购买后观看')}</td><td>${esc(item.saleEnabled?item.saleType:'内部内容')}<div class="cell-sub">${esc(item.productGroup)}</div></td><td>${badge(contentStatusOf(item,'video'),contentStatusOf(item,'video')==='已发布'?'green':'')}<div class="cell-sub">${saleStatusOf(item)}</div></td><td class="cell-sub">${item.updated}</td><td><div class="actions"><button class="btn" data-action="share-product" data-kind="video" data-index="${index}" ${item.shelf==='已上架'?'':'disabled title="商品上架后可分享"'}>${icon('link',16)}分享</button><button class="btn btn-icon btn-ghost" data-action="view-product" data-kind="video" data-index="${index}" aria-label="查看视频">${icon('eye',17)}</button>${item.shelf==='已下架'?`<button class="btn btn-icon btn-ghost" data-action="edit-video" data-index="${index}" aria-label="编辑视频">${icon('pencil',17)}</button>`:''}<button class="btn btn-icon btn-ghost" data-action="duplicate-video" data-index="${index}" aria-label="复制视频">${icon('clipboard',16)}</button><button class="btn ${item.shelf==='已上架'?'':'btn-green'}" data-action="toggle-video-shelf" data-index="${index}">${icon('power',16)}${item.shelf==='已上架'?'下架':'上架'}</button>${item.shelf==='已下架'?`<button class="btn btn-icon btn-ghost btn-danger" data-action="delete-video" data-index="${index}" aria-label="删除视频">${icon('trash',16)}</button>`:''}</div></td></tr>`;
}

function applyVideoFilter() {
  const query=document.querySelector('#video-search')?.value.trim().toLowerCase() || ''; const category=document.querySelector('#video-category')?.value || '全部分类'; const shelf=document.querySelector('#video-shelf')?.value || '全部上下架';
  document.querySelectorAll('#video-rows tr[data-filter-text]').forEach((row) => { row.hidden=!row.dataset.filterText.toLowerCase().includes(query)||(category!=='全部分类'&&row.dataset.category!==category)||(shelf!=='全部上下架'&&row.dataset.shelf!==shelf); });
}

function articleReadinessIssues(item) {
  const issues=[];
  if (!String(item.name || '').trim()) issues.push('图文名称不能为空');
  if (!String(item.cover || '').trim()) issues.push('请配置图文封面');
  if (!String(item.article?.title || '').trim()) issues.push('请填写图文标题');
  if (!String(item.article?.body || '').trim()) issues.push('请填写图文正文');
  return issues;
}

function articles() {
  const counts={all:state.articleItems.length,up:state.articleItems.filter((item) => item.shelf==='已上架').length,draft:state.articleItems.filter((item) => contentStatusOf(item,'article')==='草稿').length,free:state.articleItems.filter((item) => item.article.preview).length};
  const categories=[...new Set(state.articleItems.map((item) => item.category))];
  return `${head('图文管理','管理可独立展示、阅读和售卖的图文内容',`<button class="btn btn-primary" data-action="new-article">${icon('plus',17)}新增图文</button>`)}
    <div class="toolbar-card"><div class="toolbar" style="margin:0">${search('搜索图文名称或简介...','article-search')}<select class="select" id="article-category"><option>全部分类</option>${categories.map((value) => `<option>${esc(value)}</option>`).join('')}</select><select class="select" id="article-shelf"><option>全部上下架</option><option>已上架</option><option>已下架</option></select></div></div>
    <div class="stats">${stat('全部图文',counts.all,'layers')}${stat('已上架',counts.up,'check','green')}${stat('草稿图文',counts.draft,'clock','gray')}${stat('支持试读',counts.free,'eye')}</div>
    <div class="panel"><div class="table-scroll"><table class="data-table"><thead><tr><th>图文名称</th><th>分类</th><th>图文内容</th><th>阅读权限</th><th>售卖设置</th><th>内容 / 售卖状态</th><th>更新时间</th><th style="text-align:right">操作</th></tr></thead><tbody id="article-rows">${state.articleItems.length?pageSlice('articles',state.articleItems).map(({item, originalIndex}) => articleRow(item, originalIndex)).join(''):'<tr><td colspan="8" class="empty">暂无图文，点击“新增图文”开始创建</td></tr>'}</tbody></table></div>${pagination('articles',state.articleItems.length)}</div>`;
}

function articleRow(item,index) {
  const summary=String(item.article.body || '').replace(/\s+/g,' ').slice(0,48);
  return `<tr data-filter-text="${esc(`${item.name} ${item.description} ${item.category} ${item.article.title}`)}" data-category="${esc(item.category)}" data-shelf="${item.shelf}"><td><div class="course-title-cell"><span class="course-cover-mini">${esc(item.name.slice(0,1))}</span><div><div class="cell-title">${esc(item.name)}</div><div class="cell-sub">${esc(item.description)}</div></div></div></td><td>${badge(esc(item.category))}</td><td><div class="cell-title">${esc(item.article.title)}</div><div class="cell-sub">${esc(summary)}${item.article.duration?` · ${esc(item.article.duration)}`:''}</div></td><td>${item.saleType==='付费'&&item.article.preview?badge('支持试读','green'):badge(item.saleType==='免费'?'免费获取':'购买后阅读')}</td><td>${esc(item.saleEnabled?item.saleType:'内部内容')}<div class="cell-sub">${esc(item.productGroup)}</div></td><td>${badge(contentStatusOf(item,'article'),contentStatusOf(item,'article')==='已发布'?'green':'')}<div class="cell-sub">${saleStatusOf(item)}</div></td><td class="cell-sub">${item.updated}</td><td><div class="actions"><button class="btn" data-action="share-product" data-kind="article" data-index="${index}" ${item.shelf==='已上架'?'':'disabled title="商品上架后可分享"'}>${icon('link',16)}分享</button><button class="btn btn-icon btn-ghost" data-action="view-product" data-kind="article" data-index="${index}" aria-label="查看图文">${icon('eye',17)}</button>${item.shelf==='已下架'?`<button class="btn btn-icon btn-ghost" data-action="edit-article" data-index="${index}" aria-label="编辑图文">${icon('pencil',17)}</button>`:''}<button class="btn btn-icon btn-ghost" data-action="duplicate-article" data-index="${index}" aria-label="复制图文">${icon('clipboard',16)}</button><button class="btn ${item.shelf==='已上架'?'':'btn-green'}" data-action="toggle-article-shelf" data-index="${index}">${icon('power',16)}${item.shelf==='已上架'?'下架':'上架'}</button>${item.shelf==='已下架'?`<button class="btn btn-icon btn-ghost btn-danger" data-action="delete-article" data-index="${index}" aria-label="删除图文">${icon('trash',16)}</button>`:''}</div></td></tr>`;
}

function applyArticleFilter() {
  const query=document.querySelector('#article-search')?.value.trim().toLowerCase() || ''; const category=document.querySelector('#article-category')?.value || '全部分类'; const shelf=document.querySelector('#article-shelf')?.value || '全部上下架';
  document.querySelectorAll('#article-rows tr[data-filter-text]').forEach((row) => { row.hidden=!row.dataset.filterText.toLowerCase().includes(query)||(category!=='全部分类'&&row.dataset.category!==category)||(shelf!=='全部上下架'&&row.dataset.shelf!==shelf); });
}

function itemReadiness(item,kind) { return kind==='video'?videoReadinessIssues(item):kind==='article'?articleReadinessIssues(item):courseReadinessIssues(item); }
function contentStatusOf(item,kind) { if (item.shelf==='已上架'||item.status==='已发布') return '已发布'; if (item.status==='草稿') return '草稿'; return itemReadiness(item,kind).length?'草稿':'已完善'; }
function saleStatusOf(item) { if (item.pauseSale) return '暂停销售'; if (item.shelf==='已上架') return '已上架'; if (item.status==='草稿') return '未上架'; if (item.shelfMode==='定时上架') return '待定时上架'; return item.status==='已发布'?'已下架':'未上架'; }

function productGroups() {
  const usage=(name) => [...state.courseItems,...state.videoItems,...state.articleItems].filter((item) => item.productGroup===name).length;
  return `${head('商品分组','维护店铺商品的运营分组与展示顺序',`<button class="btn btn-primary" data-action="new-product-group">${icon('plus',17)}新建分组</button>`)}<div class="panel"><div class="table-scroll"><table class="data-table"><thead><tr><th>排序</th><th>分组名称</th><th>使用商品</th><th>状态</th><th style="text-align:right">操作</th></tr></thead><tbody>${state.productGroups.map((group,index) => `<tr><td>${index+1}</td><td><div class="cell-title">${esc(group.name)}</div></td><td>${usage(group.name)} 个</td><td>${badge(group.enabled?'启用':'停用',group.enabled?'green':'')}</td><td><div class="actions"><button class="btn btn-icon" data-action="move-product-group" data-direction="up" data-index="${index}" aria-label="上移分组">↑</button><button class="btn btn-icon" data-action="move-product-group" data-direction="down" data-index="${index}" aria-label="下移分组">↓</button><button class="btn btn-icon btn-ghost" data-action="edit-product-group" data-index="${index}" aria-label="编辑分组">${icon('pencil',16)}</button><button class="btn" data-action="toggle-product-group" data-index="${index}">${group.enabled?'停用':'启用'}</button><button class="btn btn-icon btn-ghost btn-danger" data-action="delete-product-group" data-index="${index}" aria-label="删除分组">${icon('trash',16)}</button></div></td></tr>`).join('')}</tbody></table></div>${pagination(state.productGroups.length)}</div>`;
}

function openProductGroupModal(index=null) {
  const group=index===null?{name:'',enabled:true}:state.productGroups[index];
  document.querySelector('#overlay-root').innerHTML=modalShell(index===null?'新建商品分组':'编辑商品分组','用于店铺内组织商品',`<form id="product-group-form" data-index="${index ?? ''}"><div class="modal-body"><label class="field"><span>分组名称 *</span><input class="input" name="name" maxlength="30" value="${esc(group.name)}" placeholder="请输入分组名称" required></label><label class="check-row"><input type="checkbox" name="enabled" ${group.enabled?'checked':''}>启用该分组</label></div><div class="modal-foot"><button type="button" class="btn" data-action="close-modal">取消</button><button class="btn btn-primary" type="submit">保存分组</button></div></form>`);
}

function productDetail() {
  const kind=productDetailTarget?.kind || 'series'; const collection=kind==='video'?state.videoItems:kind==='article'?state.articleItems:state.courseItems; const item=collection[productDetailTarget?.index ?? -1];
  if (!item) { state.view=kind==='video'?'videos':kind==='article'?'articles':'courses'; return (kind==='video'?videos:kind==='article'?articles:courses)(); }
  const typeName=kind==='video'?'视频':kind==='article'?'图文':'系列课'; const content=kind==='video'?`${item.video.title} · ${item.video.source}${item.video.duration?` · ${item.video.duration}`:''}`:kind==='article'?`${item.article.title} · ${item.article.duration || '未设置阅读时长'}`:`${item.chapters.length} 章 · ${courseLessonCount(item)} 视频`;
  const detailActions=`<div class="actions">${item.shelf==='已上架'?`<button class="btn btn-primary" data-action="share-product" data-kind="${kind}" data-index="${productDetailTarget.index}">${icon('link',16)}分享</button>`:''}${item.shelf==='已下架'?`<button class="btn" data-action="edit-detail-product">${icon('pencil',16)}编辑</button>`:''}</div>`;
  return `${breadcrumb(`${typeName}管理`,`${typeName}详情`,'product-detail-back')}${head(item.name,`${typeName}商品详情`,detailActions)}<div class="detail-card course-summary"><div><span class="course-cover-large">${esc(item.name.slice(0,1))}</span><div><strong>${esc(item.name)}</strong><p>${esc(item.description)}</p></div></div><div class="course-summary-stats"><span>${badge(contentStatusOf(item,kind),contentStatusOf(item,kind)==='已发布'?'green':'')}</span><span>${badge(saleStatusOf(item),item.shelf==='已上架'?'green':'')}</span></div></div><div class="detail-card"><div class="form-section-label">内容信息</div><div class="detail-grid"><div><span class="cell-sub">内容类型</span><strong>${typeName}</strong></div><div><span class="cell-sub">分类</span><strong>${esc(item.category)}</strong></div><div><span class="cell-sub">内容摘要</span><strong>${esc(content)}</strong></div><div><span class="cell-sub">更新时间</span><strong>${esc(item.updated)}</strong></div></div></div><div class="detail-card"><div class="form-section-label">商品信息</div><div class="detail-grid"><div><span class="cell-sub">获取方式</span><strong>${item.saleEnabled?esc(item.saleType):'不允许独立获取'}</strong></div><div><span class="cell-sub">商品分组</span><strong>${esc(item.productGroup)}</strong></div><div><span class="cell-sub">有效期</span><strong>${item.validityType==='自定义'?`${item.validityDays} 天`:esc(item.validityType)}</strong></div><div><span class="cell-sub">店铺显示</span><strong>${item.storeVisible?'显示':'隐藏'}</strong></div></div></div>${kind==='series'?`<div class="detail-card"><div class="detail-summary"><strong>系列课目录</strong><button class="btn" data-action="detail-course-outline">查看目录</button></div></div>`:''}`;
}

function miniProgramShareData(kind,index) {
  const collection=kind==='video'?state.videoItems:kind==='article'?state.articleItems:state.courseItems; const item=collection[index]; if (!item) return null;
  const seed=`${kind}-${item.id || index}`; let hash=2166136261; for (const char of seed) { hash^=char.charCodeAt(0); hash=Math.imul(hash,16777619); }
  const code=Math.abs(hash>>>0).toString(36).padStart(7,'0').slice(0,8); const typeName=kind==='video'?'视频':kind==='article'?'图文':'系列课'; const shortLink=`https://wxaurl.cn/${code}`; const share=item.shareSettings || {};
  const shareTitle=share.titleCustom&&share.title.trim()?share.title.trim():item.name; const shareDescription=share.descriptionCustom&&share.description.trim()?share.description.trim():(item.description || `精选${typeName}，打开小程序立即查看`); const shareImage=share.imageCustom&&share.image.trim()?share.image.trim():item.cover;
  return {item,typeName,shortLink,shareTitle,shareDescription,shareImage,text:`${shareTitle}\n${shareDescription}\n打开小程序立即查看：${shortLink}`};
}

function editorSharePreviewData(form,kind) {
  const typeName=kind==='video'?'视频':kind==='article'?'图文':'系列课'; const name=form.querySelector('[name="name"]')?.value.trim() || `未命名${typeName}`; const description=form.querySelector('[name="description"]')?.value.trim() || `精选${typeName}，打开小程序立即查看`; const cover=form.querySelector('[name="cover"]')?.value.trim() || `默认${typeName}封面`;
  const titleCustom=form.querySelector('[name="shareTitleCustom"]')?.checked; const descriptionCustom=form.querySelector('[name="shareDescriptionCustom"]')?.checked; const imageCustom=form.querySelector('[name="shareImageCustom"]')?.checked; const shareTitle=titleCustom&&form.querySelector('[name="shareTitle"]')?.value.trim()?form.querySelector('[name="shareTitle"]').value.trim():name; const shareDescription=descriptionCustom&&form.querySelector('[name="shareDescription"]')?.value.trim()?form.querySelector('[name="shareDescription"]').value.trim():description; const shareImage=imageCustom&&form.querySelector('[name="shareImage"]')?.value.trim()?form.querySelector('[name="shareImage"]').value.trim():cover;
  const saleEnabled=form.querySelector('[name="saleEnabled"]')?.checked; const saleType=form.querySelector('[name="saleType"]:checked')?.value || '免费'; const price=form.querySelector('[name="price"]')?.value || '';
  return {item:{name,description,cover,saleEnabled,saleType,price},typeName,shortLink:'https://wxaurl.cn/preview',shareTitle,shareDescription,shareImage,text:`${shareTitle}\n${shareDescription}`};
}

function shareQrSvg(value,className='mini-qr',label='小程序二维码',attrs='') {
  let seed=0; for (const char of value) seed=(seed*31+char.charCodeAt(0))>>>0; const size=25; const modules=[];
  const finder=(x,y) => (x<7&&y<7)||(x>=size-7&&y<7)||(x<7&&y>=size-7);
  for (let y=0;y<size;y+=1) for (let x=0;x<size;x+=1) { let on=false; if (finder(x,y)) { const fx=x>=size-7?x-(size-7):x; const fy=y>=size-7?y-(size-7):y; on=fx===0||fy===0||fx===6||fy===6||(fx>=2&&fx<=4&&fy>=2&&fy<=4); } else { seed=(Math.imul(seed,1664525)+1013904223)>>>0; on=((seed>>>29)^(x+y))&1; } if (on) modules.push(`<rect x="${x+2}" y="${y+2}" width="1" height="1"/>`); }
  return `<svg class="${className}" ${attrs} viewBox="0 0 ${size+4} ${size+4}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}"><rect width="100%" height="100%" fill="#fff"/><g fill="#111827">${modules.join('')}</g></svg>`;
}

function sharePosterSvg(data) {
  const title=String(data.shareTitle || '').slice(0,24); const titleLines=[title.slice(0,12),title.slice(12,24)].filter(Boolean);
  const description=String(data.shareDescription || '精选内容，打开小程序立即查看').slice(0,38); const descriptionLines=[description.slice(0,19),description.slice(19,38)].filter(Boolean);
  const acquire=!data.item.saleEnabled?'仅限内部发放':data.item.saleType==='付费'?`¥${data.item.price || '--'}`:data.item.saleType || '免费';
  return `<svg class="share-poster" width="360" height="600" viewBox="0 0 360 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="小程序分享海报">
    <rect width="360" height="600" rx="18" fill="#f2f6ff"/>
    <rect x="18" y="18" width="324" height="564" rx="14" fill="#fff"/>
    <rect x="18" y="18" width="324" height="226" rx="14" fill="#165dff"/>
    <circle cx="180" cy="112" r="54" fill="#fff" fill-opacity=".16"/>
    <text x="180" y="132" text-anchor="middle" fill="#fff" font-size="54" font-family="Arial, sans-serif" font-weight="700">${esc(data.shareTitle.slice(0,1))}</text>
    <text x="180" y="205" text-anchor="middle" fill="#fff" fill-opacity=".82" font-size="12" font-family="Arial, sans-serif">${esc(String(data.shareImage || '默认课程封面').slice(0,28))}</text>
    <rect x="38" y="264" width="62" height="26" rx="13" fill="#e8f3ff"/>
    <text x="69" y="282" text-anchor="middle" fill="#165dff" font-size="13" font-family="Arial, sans-serif">${esc(data.typeName)}</text>
    <text x="322" y="282" text-anchor="end" fill="#f53f3f" font-size="15" font-family="Arial, sans-serif" font-weight="700">${esc(acquire)}</text>
    ${titleLines.map((line,index)=>`<text x="38" y="${326+index*30}" fill="#1d2129" font-size="22" font-family="Arial, sans-serif" font-weight="700">${esc(line)}</text>`).join('')}
    ${descriptionLines.map((line,index)=>`<text x="38" y="${398+index*22}" fill="#86909c" font-size="14" font-family="Arial, sans-serif">${esc(line)}</text>`).join('')}
    <line x1="38" y1="446" x2="322" y2="446" stroke="#e5e6eb"/>
    <text x="38" y="485" fill="#1d2129" font-size="16" font-family="Arial, sans-serif" font-weight="700">微信扫码查看</text>
    <text x="38" y="512" fill="#86909c" font-size="13" font-family="Arial, sans-serif">长按识别小程序码</text>
    <text x="38" y="555" fill="#165dff" font-size="13" font-family="Arial, sans-serif">内容学习中心</text>
    ${shareQrSvg(data.shortLink,'poster-mini-qr','海报内小程序二维码','x="226" y="466" width="96" height="96"')}
  </svg>`;
}

function svgToPngBlob(svg,scale=2) {
  return new Promise((resolve,reject) => { const source=new XMLSerializer().serializeToString(svg); const url=URL.createObjectURL(new Blob([source],{type:'image/svg+xml'})); const image=new Image(); image.onload=() => { const width=Number(svg.getAttribute('width')) || svg.viewBox.baseVal.width; const height=Number(svg.getAttribute('height')) || svg.viewBox.baseVal.height; const canvas=document.createElement('canvas'); canvas.width=width*scale; canvas.height=height*scale; const context=canvas.getContext('2d'); context.scale(scale,scale); context.drawImage(image,0,0,width,height); URL.revokeObjectURL(url); canvas.toBlob((blob)=>blob?resolve(blob):reject(new Error('海报生成失败')),'image/png'); }; image.onerror=() => { URL.revokeObjectURL(url); reject(new Error('海报生成失败')); }; image.src=url; });
}

function renderShareModal() {
  const data=shareTarget?miniProgramShareData(shareTarget.kind,shareTarget.index):null; if (!data) return;
  const tabs=`<div class="share-tabs"><button class="${shareTab==='poster'?'active':''}" data-action="share-tab" data-tab="poster">海报</button><button class="${shareTab==='link'?'active':''}" data-action="share-tab" data-tab="link">小程序短链</button><button class="${shareTab==='qrcode'?'active':''}" data-action="share-tab" data-tab="qrcode">小程序二维码</button></div>`;
  const posterBody=`<div class="modal-body share-poster-body"><div class="share-poster-preview">${sharePosterSvg(data)}</div><div class="share-poster-copy"><strong>分享海报</strong><p>海报包含内容信息和小程序二维码，适合转发到微信群、朋友圈或保存到相册。</p><span class="cell-sub">建议在微信内长按识别二维码后进入小程序</span></div></div><div class="modal-foot"><button class="btn" data-action="download-share-poster">下载海报</button><button class="btn btn-primary" data-action="copy-share-poster">复制海报</button></div>`;
  const linkBody=`<div class="modal-body"><div class="share-product"><span class="course-cover-large">${esc(data.shareTitle.slice(0,1))}</span><div><strong>${esc(data.shareTitle)}</strong><p>${esc(data.shareDescription)}</p>${badge(data.typeName,'blue')}</div></div><label class="field"><span>小程序短链</span><div class="share-link-row"><input class="input" id="mini-share-link" readonly value="${esc(data.shortLink)}"><button class="btn" data-action="copy-share-link">复制短链</button></div><small>短链用于微信会话、社群或其他支持打开小程序的场景</small></label><label class="field"><span>分享文案</span><textarea class="textarea" id="mini-share-text" readonly>${esc(data.text)}</textarea></label></div><div class="modal-foot"><button class="btn" data-action="copy-share-link">复制短链</button><button class="btn btn-primary" data-action="copy-share-text">复制分享文案</button></div>`;
  const qrBody=`<div class="modal-body"><div class="share-qr-panel">${shareQrSvg(data.shortLink)}<strong>${esc(data.item.name)}</strong><span class="cell-sub">微信扫码进入小程序查看${data.typeName}</span></div></div><div class="modal-foot"><button class="btn" data-action="share-tab" data-tab="link">查看短链</button><button class="btn btn-primary" data-action="download-share-qr">下载二维码</button></div>`;
  const body=shareTab==='poster'?posterBody:shareTab==='link'?linkBody:qrBody;
  document.querySelector('#overlay-root').innerHTML=modalShell('分享',`${data.typeName} · ${esc(data.item.name)}`,`${tabs}${body}`,'',true);
}

let courseDraft=null;
let courseEditDirty=false;
function openCourseModal(editIndex=null,kind='series') { courseDraft={editIndex,kind}; courseEditDirty=false; state.view='course-edit'; render(); }

function courseEditor() {
  const editIndex=courseDraft?.editIndex ?? null;
  const kind=['video','article'].includes(courseDraft?.kind)?courseDraft.kind:'series'; const collection=kind==='video'?state.videoItems:kind==='article'?state.articleItems:state.courseItems;
  const source=editIndex===null?{name:'',category:'未分类',description:'',detail:'',cover:'',saleEnabled:true,saleType:'免费',price:'',accessCode:'',designatedGroup:'',validityType:'长期有效',validityDays:365,joinDeadlineType:'无限制',joinDeadline:'',productGroup:'默认分组',shelfMode:'暂不上架',scheduledShelfAt:'',scheduledOff:false,scheduledOffAt:'',pauseSale:false,storeVisible:true,shareSettings:{allowUserShare:true,titleCustom:false,title:'',descriptionCustom:false,description:'',imageCustom:false,image:''},video:{title:'',source:'',duration:'',required:true,free:false},article:{title:'',body:'',duration:'',free:false}}:collection[editIndex];
  const typeName=kind==='video'?'视频':kind==='article'?'图文':'系列课'; const title=editIndex===null?`新建${typeName}`:`编辑${typeName}`;
  return `${breadcrumb(`${typeName}管理`,title,'course-edit-cancel')}<div class="course-editor-head"><div><h1 class="page-title">${title}</h1><p class="page-subtitle">${kind==='video'?'在同一页面完成视频内容、展示和商品规则配置':kind==='article'?'在同一页面完成图文正文、展示和商品规则配置':'配置系列课展示与商品规则，保存后继续维护章节目录'}</p></div><span class="badge badge-blue">基础配置</span></div>
    <form id="course-editor-form" data-edit-index="${editIndex ?? ''}" class="course-editor-layout">
      <aside class="course-editor-nav"><strong>配置导航</strong><button type="button" data-action="scroll-course-section" data-target="course-content-info" class="active">内容信息</button>${kind==='video'?'<button type="button" data-action="scroll-course-section" data-target="course-video-info">视频内容</button>':kind==='article'?'<button type="button" data-action="scroll-course-section" data-target="course-article-info">图文内容</button>':''}<button type="button" data-action="scroll-course-section" data-target="course-product-info">商品信息</button><button type="button" data-action="scroll-course-section" data-target="course-share-info">分享设置</button></aside>
      <div class="course-editor-main">
        <section class="course-config-card" id="course-content-info"><div class="course-config-title"><span>01</span><div><h2>内容信息</h2><p>配置学员在课程详情页看到的基础内容</p></div></div><div class="course-config-fields">
          <label class="field"><span><b class="required-star">*</b>${typeName}名称</span><div class="counted-input"><input class="input" name="name" maxlength="45" value="${esc(source.name)}" placeholder="建议14字内" required><small data-count-for="name">${String(source.name).length}/45</small></div></label>
          <label class="field"><span>课程分类</span><select class="select" name="category"><option ${source.category==='未分类'?'selected':''}>未分类</option><option ${source.category==='心理成长'?'selected':''}>心理成长</option><option ${source.category==='学习能力'?'selected':''}>学习能力</option><option ${source.category==='综合素养'?'selected':''}>综合素养</option></select></label>
          <div class="field"><span><b class="required-star">*</b>${typeName}封面</span><div class="course-cover-field"><div class="course-cover-preview" id="course-cover-preview">${source.cover?`<span>${esc(source.cover)}</span>`:`${icon('plus',24)}<span>上传封面</span>`}</div><div><label class="btn">选择图片<input type="file" id="course-cover-file" accept="image/png,image/jpeg" hidden></label><input class="input" name="cover" value="${esc(source.cover)}" placeholder="或填写素材名称/图片地址"><small>建议比例 16:9，jpg/png，不超过 5MB，推荐 750×422px</small></div></div></div>
          <label class="field"><span>${typeName}简介</span><div class="counted-input"><textarea class="textarea" name="description" maxlength="256" placeholder="建议256字内">${esc(source.description)}</textarea><small data-count-for="description">${String(source.description).length}/256</small></div></label>
          <label class="field"><span>${typeName}详情</span><div class="course-rich-editor"><div class="course-editor-toolbar"><span>⊕ 插入</span><span>↶</span><span>↷</span><span>正文</span><span>16px</span><b>B</b><i>I</i><u>U</u><span>≡</span><button type="button" class="btn" data-action="preview-course-detail">预览</button></div><textarea name="detail" placeholder="输入${typeName}详情，支持粘贴富文本内容">${esc(source.detail)}</textarea></div></label>
        </div></section>
        ${kind==='video'?`<section class="course-config-card" id="course-video-info"><div class="course-config-title"><span>02</span><div><h2>视频内容</h2><p>配置这个单一视频的播放来源与观看权限</p></div></div><div class="course-config-fields"><label class="field"><span><b class="required-star">*</b>视频名称</span><input class="input" name="videoTitle" value="${esc(source.video?.title || source.name)}" placeholder="请输入视频名称" required></label><div class="form-grid"><label class="field"><span><b class="required-star">*</b>视频来源</span><input class="input" name="videoSource" value="${esc(source.video?.source || '')}" placeholder="填写视频素材名称或播放地址" required></label><label class="field"><span>预计观看时长</span><input class="input" name="videoDuration" value="${esc(source.video?.duration || '')}" placeholder="如：15分钟"></label></div><div class="form-grid"><label class="check-row"><input type="checkbox" name="videoRequired" ${source.video?.required!==false?'checked':''}>设为必看视频</label><label class="check-row" data-preview-setting ${source.saleType==='付费'?'':'hidden'}><input type="checkbox" name="videoPreview" ${source.video?.preview?'checked':''}>允许付费前试看</label></div></div></section>`:kind==='article'?`<section class="course-config-card" id="course-article-info"><div class="course-config-title"><span>02</span><div><h2>图文内容</h2><p>配置这篇图文的正文与阅读权限</p></div></div><div class="course-config-fields"><label class="field"><span><b class="required-star">*</b>图文标题</span><input class="input" name="articleTitle" value="${esc(source.article?.title || source.name)}" placeholder="请输入图文标题" required></label><label class="field"><span><b class="required-star">*</b>图文正文</span><div class="course-rich-editor"><div class="course-editor-toolbar"><span>⊕ 插入</span><span>↶</span><span>↷</span><span>正文</span><span>16px</span><b>B</b><i>I</i><u>U</u><span>≡</span></div><textarea name="articleBody" placeholder="输入图文正文，支持粘贴富文本内容" required>${esc(source.article?.body || '')}</textarea></div></label><div class="form-grid"><label class="field"><span>预计阅读时长</span><input class="input" name="articleDuration" value="${esc(source.article?.duration || '')}" placeholder="如：5分钟"></label><label class="check-row" data-preview-setting ${source.saleType==='付费'?'':'hidden'}><input type="checkbox" name="articlePreview" ${source.article?.preview?'checked':''}>允许付费前试读</label></div></div></section>`:''}
        <section class="course-config-card" id="course-product-info"><div class="course-config-title"><span>${kind==='series'?'02':'03'}</span><div><h2>商品信息</h2><p>配置课程获取方式、有效期与店铺展示状态</p></div></div><div class="course-config-fields">
          <div class="course-setting-row"><span>获取方式</span><div><label class="check-row inline"><input type="checkbox" name="saleEnabled" ${source.saleEnabled?'checked':''}>允许在店铺或链接中独立获取</label><small>关闭后仅作为内部内容使用，不参与商品售卖</small><div data-acquisition-settings ${source.saleEnabled?'':'hidden'}><div class="inline-radios wrap course-radio-line">${['免费','付费','指定学员'].map((value) => `<label><input type="radio" name="saleType" value="${value}" ${source.saleType===value?'checked':''}>${value==='免费'?'免费获取':value==='付费'?'付费购买':'仅限指定用户'}</label>`).join('')}</div><div class="course-product-conditional" data-sale-panel="付费" ${source.saleType==='付费'?'':'hidden'}><label class="field"><span>销售价格（元）</span><input class="input" type="number" min="0" step="0.01" name="price" value="${esc(source.price)}" placeholder="0.00"></label></div><div class="course-product-conditional" data-sale-panel="指定学员" ${source.saleType==='指定学员'?'':'hidden'}><label class="field"><span>指定用户范围</span><input class="input" name="designatedGroup" value="${esc(source.designatedGroup)}" placeholder="填写用户分组或名单说明"></label></div><div class="course-more-settings"><strong>访问保护</strong><label class="check-row inline"><input type="checkbox" name="passwordEnabled" ${source.passwordEnabled?'checked':''}>启用访问密码</label><input class="input" name="accessCode" value="${esc(source.accessCode)}" placeholder="设置访问密码" data-access-code ${source.passwordEnabled?'':'hidden'}></div></div></div></div>
          <div class="course-setting-row"><span>有效期</span><div class="inline-radios wrap"><label><input type="radio" name="validityType" value="长期有效" ${source.validityType==='长期有效'?'checked':''}>长期有效</label><label><input type="radio" name="validityType" value="自定义" ${source.validityType==='自定义'?'checked':''}>自定义</label><div class="inline-number" data-validity-custom ${source.validityType==='自定义'?'':'hidden'}><input class="input" type="number" min="1" name="validityDays" value="${source.validityDays || 365}"><span>天</span></div></div></div>
          <div class="course-setting-row"><span><b class="required-star">*</b>加入截止时间</span><div class="inline-radios wrap"><label><input type="radio" name="joinDeadlineType" value="无限制" ${source.joinDeadlineType==='无限制'?'checked':''}>无限制</label><label><input type="radio" name="joinDeadlineType" value="自定义" ${source.joinDeadlineType==='自定义'?'checked':''}>自定义</label><input class="input compact-date" type="date" name="joinDeadline" value="${source.joinDeadline}" data-join-deadline ${source.joinDeadlineType==='自定义'?'':'hidden'}></div></div>
          <div class="course-setting-row" data-commerce-only ${source.saleEnabled?'':'hidden'}><span>商品分组</span><div><select class="select" name="productGroup">${state.productGroups.filter((group) => group.enabled || group.name===source.productGroup).map((group) => `<option ${source.productGroup===group.name?'selected':''}>${esc(group.name)}</option>`).join('')}</select><small>用于店铺内分类展示课程，可在“商品分组”中维护</small></div></div>
          <div class="course-setting-row" data-commerce-only ${source.saleEnabled?'':'hidden'}><span>上架设置</span><div><div class="inline-radios wrap">${['立即上架','定时上架','暂不上架'].map((value) => `<label><input type="radio" name="shelfMode" value="${value}" ${source.shelfMode===value?'checked':''}>${value}</label>`).join('')}</div><input class="input compact-date" type="datetime-local" name="scheduledShelfAt" value="${source.scheduledShelfAt}" data-scheduled-shelf ${source.shelfMode==='定时上架'?'':'hidden'}><div class="course-more-settings"><strong>更多设置</strong><label class="check-row inline"><input type="checkbox" name="scheduledOff" ${source.scheduledOff?'checked':''}>定时下架</label><input class="input compact-date" type="datetime-local" name="scheduledOffAt" value="${source.scheduledOffAt}" data-scheduled-off ${source.scheduledOff?'':'hidden'}><label class="check-row inline"><input type="checkbox" name="pauseSale" ${source.pauseSale?'checked':''}>暂停销售</label></div></div></div>
          <div class="course-setting-row" data-commerce-only ${source.saleEnabled?'':'hidden'}><span>在店铺内显示</span><div class="inline-radios"><label><input type="radio" name="storeVisible" value="true" ${source.storeVisible?'checked':''}>显示</label><label><input type="radio" name="storeVisible" value="false" ${source.storeVisible?'':'checked'}>隐藏</label></div></div>
        </div></section>
        <section class="course-config-card" id="course-share-info"><div class="course-config-title"><span>${kind==='series'?'03':'04'}</span><div><h2>分享设置</h2><p>配置小程序分享卡片和海报使用的商品级素材</p></div></div><div class="course-config-fields">
          <div class="course-setting-row"><span>用户端分享</span><div><label class="check-row inline"><input type="checkbox" name="allowUserShare" ${source.shareSettings?.allowUserShare!==false?'checked':''}>允许用户在小程序内分享</label><small>不影响后台运营人员生成和下载分享素材</small></div></div>
          <div class="course-setting-row"><span>分享标题</span><div><label class="check-row inline"><input type="checkbox" name="shareTitleCustom" ${source.shareSettings?.titleCustom?'checked':''}>自定义分享标题</label><small data-share-default-label="title">默认跟随${typeName}名称，名称修改后自动同步</small><div class="share-custom-field" data-share-custom="title" ${source.shareSettings?.titleCustom?'':'hidden'}><div class="counted-input"><input class="input" name="shareTitle" maxlength="30" value="${esc(source.shareSettings?.title || '')}" placeholder="请输入分享标题"><small data-count-for="shareTitle">${String(source.shareSettings?.title || '').length}/30</small></div></div></div></div>
          <div class="course-setting-row"><span>分享描述</span><div><label class="check-row inline"><input type="checkbox" name="shareDescriptionCustom" ${source.shareSettings?.descriptionCustom?'checked':''}>自定义分享描述</label><small data-share-default-label="description">默认跟随${typeName}简介，简介修改后自动同步</small><div class="share-custom-field" data-share-custom="description" ${source.shareSettings?.descriptionCustom?'':'hidden'}><div class="counted-input"><textarea class="textarea" name="shareDescription" maxlength="60" placeholder="请输入分享描述">${esc(source.shareSettings?.description || '')}</textarea><small data-count-for="shareDescription">${String(source.shareSettings?.description || '').length}/60</small></div></div></div></div>
          <div class="course-setting-row"><span>分享图片</span><div><label class="check-row inline"><input type="checkbox" name="shareImageCustom" ${source.shareSettings?.imageCustom?'checked':''}>使用独立分享图片</label><small data-share-default-label="image">默认使用${typeName}封面，封面修改后自动同步</small><div class="share-custom-field" data-share-custom="image" ${source.shareSettings?.imageCustom?'':'hidden'}><div class="share-image-input"><label class="btn">选择图片<input type="file" id="course-share-image-file" accept="image/png,image/jpeg" hidden></label><input class="input" name="shareImage" value="${esc(source.shareSettings?.image || '')}" placeholder="填写素材名称或图片地址"></div><small>建议使用 5:4 图片，jpg/png，不超过 5MB</small></div></div></div>
          <div class="share-config-preview"><div><strong>分享效果预览</strong><p>草稿阶段可预览素材；课程正式上架后生成可用短链和二维码。</p></div><button type="button" class="btn" data-action="preview-share-config">${icon('eye',16)}预览海报</button></div>
        </div></section>
        <div class="course-editor-actions"><button type="button" class="btn" data-action="course-edit-cancel">取消</button><button class="btn" type="submit" name="intent" value="draft" formnovalidate>${icon('save',16)}保存草稿</button><button type="button" class="btn" data-action="preview-product">${icon('eye',16)}用户端预览</button><button class="btn btn-primary" type="submit" name="intent" value="${kind==='series'?'continue':'publish'}" data-publish-submit>${icon('power',16)}${kind==='series'?'保存并进入目录':source.shelfMode==='定时上架'?'保存并定时上架':'保存并上架'}</button></div>
      </div>
    </form>`;
}

function courseOutline() {
  const course=currentCourse(); if (!course) { state.view='courses'; return courses(); }
  const locked=course.shelf==='已上架'; const lessonCount=courseLessonCount(course);
  return `${breadcrumb('系列课管理','目录管理','course-back')}${head(course.name,`${course.category} · 系列视频课程`,locked?'':`<div class="actions"><button class="btn" data-action="add-course-chapter">${icon('plus',16)}新建章节</button><button class="btn btn-primary" data-action="finish-course-publish">${icon('power',16)}完成并上架</button></div>`)}
    <div class="detail-card course-summary"><div><span class="course-cover-large">${esc(course.name.slice(0,1))}</span><div><strong>${esc(course.name)}</strong><p>${esc(course.description)}</p></div></div><div class="course-summary-stats"><span><b>${course.chapters.length}</b>章节</span><span><b>${lessonCount}</b>视频</span><span>${badge(course.shelf,course.shelf==='已上架'?'green':'')}</span></div></div>
    ${locked?'<div class="stage-warning">课程已上架，目录处于只读状态。如需调整内容，请先返回课程列表下架课程。</div>':''}
    <div class="course-outline-list">${course.chapters.length?course.chapters.map((chapter,index) => courseChapterCard(chapter,index,locked)).join(''):'<div class="detail-card empty">暂无章节，点击“新建章节”搭建课程目录</div>'}</div>`;
}

function courseChapterCard(chapter,chapterIndex,locked) {
  return `<section class="detail-card course-chapter"><div class="course-chapter-head"><div><span class="segment-number">${chapterIndex+1}</span><strong>${esc(chapter.name)}</strong><small>${chapter.lessons.length?'已配置视频':'配置不完整'}</small></div>${locked?'':`<div class="actions"><button class="btn btn-icon" data-action="move-course-chapter" data-direction="up" data-index="${chapterIndex}" aria-label="上移章节">↑</button><button class="btn btn-icon" data-action="move-course-chapter" data-direction="down" data-index="${chapterIndex}" aria-label="下移章节">↓</button><button class="btn btn-icon btn-ghost" data-action="edit-course-chapter" data-index="${chapterIndex}" aria-label="编辑章节和视频">${icon('pencil',16)}</button><button class="btn btn-icon btn-ghost btn-danger" data-action="delete-course-chapter" data-index="${chapterIndex}" aria-label="删除章节">${icon('trash',16)}</button></div>`}</div><div class="course-lesson-list">${chapter.lessons.length?courseLessonRow(chapter.lessons[0],chapterIndex):'<div class="score-empty compact">请编辑章节并补充视频信息</div>'}</div></section>`;
}

function courseLessonRow(lesson,chapterIndex) {
  return `<div class="course-lesson"><span class="course-lesson-order">${chapterIndex+1}</span><span class="course-type-icon">${icon('layers',17)}</span><div><div class="cell-title">${esc(lesson.title)} ${lesson.required?'<span class="required-mark">必修</span>':''}</div><div class="cell-sub">${esc(lesson.source)} · 观看完成${lesson.duration?` · ${esc(lesson.duration)}`:''}</div></div>${badge('视频','blue')}${lesson.preview?badge('可试看','green'):''}</div>`;
}

function openCourseChapterModal(chapterIndex=null) {
  const chapter=chapterIndex===null?{name:'',lessons:[]}:currentCourse().chapters[chapterIndex];
  const video=chapter.lessons[0] || {title:'',source:'',required:true,duration:'',free:false};
  document.querySelector('#overlay-root').innerHTML=modalShell(chapterIndex===null?'新建章节和视频':'编辑章节和视频',currentCourse().name,`<form id="course-chapter-form" data-index="${chapterIndex ?? ''}"><div class="modal-body"><div class="form-section-label">章节信息</div><label class="field"><span>章节名称 *</span><input class="input" name="name" value="${esc(chapter.name)}" placeholder="如：第一章 认识情绪" required></label><div class="form-section-label">视频内容</div><label class="field"><span>视频名称 *</span><input class="input" name="title" value="${esc(video.title)}" placeholder="请输入视频名称" required></label><div class="form-grid"><div class="field"><span>内容类型</span><div class="static-field">${badge('视频','blue')} 每个章节配置一个视频</div></div><label class="field"><span>预计学习时长</span><input class="input" name="duration" value="${esc(video.duration || '')}" placeholder="如：15分钟"></label></div><label class="field"><span>视频来源 *</span><input class="input" name="source" value="${esc(video.source)}" placeholder="填写视频素材名称或播放地址" required><small>当前版本记录视频引用，不上传或复制实际文件</small></label><div class="form-grid"><label class="check-row"><input type="checkbox" name="required" ${video.required?'checked':''}>设为必修视频</label><label class="check-row"><input type="checkbox" name="preview" ${video.preview?'checked':''}>设为免费试看章节</label></div></div><div class="modal-foot"><button type="button" class="btn" data-action="close-modal">取消</button><button class="btn btn-primary" type="submit">保存章节和视频</button></div></form>`,'',true);
}

function applyCourseFilter() {
  const query=document.querySelector('#course-search')?.value.trim().toLowerCase() || ''; const category=document.querySelector('#course-category')?.value || '全部分类'; const shelf=document.querySelector('#course-shelf')?.value || '全部上下架';
  document.querySelectorAll('#course-rows tr[data-filter-text]').forEach((row) => { row.hidden=!row.dataset.filterText.toLowerCase().includes(query)||(category!=='全部分类'&&row.dataset.category!==category)||(shelf!=='全部上下架'&&row.dataset.shelf!==shelf); });
}

function projects() {
  const tabType = state.projectTab === 'independent' ? '独立测评' : '补充测评';
  const rows = state.projects.filter((project) => project.type === tabType);
  const counts = { all:rows.length, up:rows.filter((project) => project.shelf === '已上架').length, down:rows.filter((project) => project.shelf !== '已上架').length };
  const tabLabel = tabType === '独立测评' ? '独立测评' : '补充测评';
  return `${head('测试项目管理', `创建和管理${tabLabel}项目，配置题目、评分规则及上下架状态`)}
    <div class="toolbar"><div class="search-wrap narrow"><span>${icon('search',17)}</span><input class="search" id="project-search" placeholder="搜索项目名称、类型..." /></div><select class="select" id="project-shelf"><option>全部上下架</option><option>已上架</option><option>已下架</option></select><span style="flex:1"></span><button class="btn btn-primary" data-action="new-project">${icon('plus',17)}新建项目</button></div>
    <div class="tabs" style="--tabs:2"><button class="tab ${state.projectTab === 'independent' ? 'active' : ''}" data-project-tab="independent">独立测评</button><button class="tab ${state.projectTab === 'supplementary' ? 'active' : ''}" data-project-tab="supplementary">补充测评</button></div>
    <div class="stats">${stat(`${tabLabel}项目`,counts.all,'filter')}${stat('已上架',counts.up,'check','green')}${stat('已下架',counts.down,'x','gray')}</div>
    <div class="panel"><div class="table-scroll"><table class="data-table compact"><thead><tr><th class="sort-cell">排序</th><th>项目名称</th><th>类型</th><th>题目数</th><th>状态</th><th>上下架</th><th>项目级报告</th><th>创建时间</th><th style="text-align:right">操作</th></tr></thead><tbody id="project-rows">${projectRows(pageSlice('projects', rows).map(({item}) => item))}</tbody></table></div>${pagination('projects', rows.length)}</div>`;
}

function projectRows(rows) {
  if (!rows.length) return `<tr><td colspan="9" class="empty">暂无${state.projectTab === 'independent' ? '独立' : '补充'}测评项目</td></tr>`;
  return rows.map((p, index) => { const projectIndex = state.projects.indexOf(p); const report=reportDefinition(p.report.key); const relationCount=state.relationItems.filter((item) => item.project === p.name).length; return `<tr data-project-name="${esc(p.name)}" data-project-type="${esc(p.type)}" data-project-shelf="${p.shelf}"><td class="sort-cell"><div class="sort-controls"><button data-action="move-project" data-direction="up" data-index="${projectIndex}" aria-label="上移项目">⌃</button><span>${index + 1}</span><button data-action="move-project" data-direction="down" data-index="${projectIndex}" aria-label="下移项目">⌄</button></div></td><td><div class="cell-title">${esc(p.name)}</div><div class="cell-sub">${esc(p.description)}</div></td><td>${esc(p.type)}</td><td>${p.questionItems.length}</td><td>${badge(p.status, p.status === '已发布' ? 'green' : '')}</td><td>${badge(p.shelf, p.shelf === '已上架' ? 'green' : '')}</td><td><div class="cell-title">${p.report.enabled?esc(report.name):'未启用'}</div><div class="cell-sub">${p.report.enabled?`${report.version} · ${report.family}`:'使用通用兜底报告'}</div></td><td class="cell-sub">${p.date}</td><td><div class="actions"><button class="btn btn-primary" data-action="questions" data-index="${projectIndex}">${icon('settings',16)}配置题目</button><button class="btn" data-action="scoring" data-index="${projectIndex}">${icon('workflow',16)}评分规则</button><button class="btn" data-action="open-project-relations" data-project="${esc(p.name)}">${icon('link',16)}关联规则${relationCount?` (${relationCount})`:''}</button><button class="btn" data-action="report-config" data-index="${projectIndex}">${icon('eye',16)}报告配置</button><button class="btn ${p.shelf === '已上架' ? '' : 'btn-green'}" data-action="toggle-shelf" data-index="${projectIndex}">${icon('power',16)}${p.shelf === '已上架' ? '下架' : '上架'}</button></div></td></tr>`; }).join('');
}

function series() {
  return `${head('系列测评管理', '组合多个测评项目为系列，统一管理答题顺序', `<button class="btn btn-primary" data-action="new-series">${icon('plus',17)}新建系列</button>`)}
    <div class="toolbar-card"><div class="toolbar" style="margin:0">${search('搜索系列名称或描述...', 'series-search')}<select class="select" id="series-shelf"><option>全部上下架</option><option>已上架</option><option>已下架</option></select></div></div>
    <div class="panel"><div class="table-scroll"><table class="data-table"><thead><tr><th class="sort-cell">排序</th><th>系列名称</th><th>包含项目</th><th>总题数</th><th>系列报告</th><th>创建时间</th><th>启用状态</th><th>上下架</th><th style="text-align:right">操作</th></tr></thead><tbody id="series-rows">${pageSlice('series',state.seriesItems).map(({item, originalIndex}) => seriesRow(item, originalIndex)).join('')}</tbody></table></div>${pagination('series',state.seriesItems.length)}</div>`;
}
const seriesRow = (item, index) => { ensureProjectReport(item); const report=reportDefinition(item.report.key); const relationCount=state.relationItems.filter((r) => r.project === item.name).length; return `<tr data-filter-text="${esc(`${item.name} ${item.description}`)}" data-shelf="${item.shelf}"><td class="sort-cell"><div class="sort-controls"><button data-action="move-series" data-direction="up" data-index="${index}" aria-label="上移系列">⌃</button><span>${index + 1}</span><button data-action="move-series" data-direction="down" data-index="${index}" aria-label="下移系列">⌄</button></div></td><td><div class="cell-title">${esc(item.name)}</div><div class="cell-sub">${esc(item.description)}</div></td><td><div class="stack-tags">${item.projects.slice(0,2).map((t) => badge(esc(t))).join('')}${item.projects.length > 2 ? badge(`+${item.projects.length - 2}`) : ''}</div></td><td>${item.questions} 道题</td><td><div class="cell-title">${item.report.enabled?esc(report.name):'未启用'}</div><div class="cell-sub">${item.report.enabled?`${report.version} · ${report.family}`:'使用通用兜底报告'}</div></td><td class="cell-sub">${item.date}</td><td><button class="status-button ${item.enabled ? 'enabled' : ''}" data-action="toggle-series" data-index="${index}">${item.enabled ? '已启用' : '已停用'}</button></td><td>${badge(item.shelf,item.shelf === '已上架' ? 'green' : '')}</td><td><div class="actions"><button class="btn" data-action="series-report-config" data-index="${index}">${icon('eye',16)}报告配置</button><button class="btn" data-action="open-series-relations" data-project="${esc(item.name)}">${icon('link',16)}关联规则${relationCount?` (${relationCount})`:''}</button><button class="btn ${item.shelf === '已上架' ? '' : 'btn-green'}" data-action="toggle-series-shelf" data-index="${index}">${icon('power',16)}${item.shelf === '已上架' ? '下架' : '上架'}</button><button class="btn btn-icon btn-ghost" data-action="view-series" data-index="${index}" aria-label="查看系列">${icon('eye',17)}</button><button class="btn btn-icon btn-ghost" data-action="edit-series" data-index="${index}" aria-label="编辑系列">${icon('pencil',17)}</button><button class="btn btn-icon btn-ghost btn-danger" data-action="delete-series" data-index="${index}" aria-label="删除系列">${icon('trash',16)}</button></div></td></tr>`; };

function stat(label, value, glyph, kind = '') { return `<div class="stat"><div><div class="stat-label">${label}</div><div class="stat-value">${value}</div></div><span class="stat-icon ${kind}">${icon(glyph,24)}</span></div>`; }

function results() {
  return `${head('测评结果', '查看和管理测评参与者的测评记录与报告', `<button class="btn btn-primary" data-action="export-results">${icon('download',17)}导出数据</button>`)}
    <div class="panel"><div class="toolbar" style="padding:12px 16px;margin:0;border-bottom:1px solid var(--line)">${search('搜索用户名、测试名称、人群...', 'result-search')}<span>${icon('filter',18)}</span><select class="select" id="result-type"><option>全部类型</option><option>实名</option><option>匿名</option></select><select class="select" id="result-status"><option>全部状态</option><option>已完成</option><option>进行中</option><option>已放弃</option></select></div><div class="table-scroll"><table class="data-table"><thead><tr><th>用户信息</th><th>测试项目</th><th>用户类型</th><th>用户群体</th><th>得分</th><th>完成时间</th><th>状态</th><th style="text-align:right">操作</th></tr></thead><tbody id="result-rows">${pageSlice('results',state.resultItems).map(({item, originalIndex:index}) => `<tr data-result-index="${index}" data-filter-text="${esc(`${item.name} ${item.test} ${item.group}`)}" data-type="${item.type}" data-status="${item.status}"><td><div>${esc(item.name)}</div><div class="cell-sub">ID: ${item.id}</div></td><td>${item.test}</td><td>${badge(item.type,item.type === '实名' ? 'dark' : '')}</td><td>${item.group}</td><td>${item.score}</td><td>${item.time}</td><td>${badge(item.status,item.status === '已完成' ? 'green' : '')}</td><td>${item.status === '已完成' ? `<button class="btn" style="float:right" data-action="view-result" data-index="${index}">${icon('eye',16)}查看</button>` : ''}</td></tr>`).join('')}</tbody></table></div>${pagination(state.resultItems.length)}</div>`;
}

function plans() {
  return `${head('计划管理', '创建和管理测评计划', `<button class="btn btn-blue" data-action="new-plan">${icon('plus',17)}新建计划</button>`)}
    <div class="panel"><div class="toolbar" style="padding:12px 16px;margin:0;border-bottom:1px solid var(--line)">${search('搜索计划名称或描述...', 'plan-search')}<select class="select" id="plan-status"><option>全部状态</option><option>草稿</option><option>已发布</option><option>进行中</option><option>已完成</option><option>已终止</option></select></div><div class="table-scroll"><table class="data-table"><thead><tr><th>计划名称</th><th>计划描述</th><th>创建方式</th><th>状态</th><th>操作</th></tr></thead><tbody id="plan-rows">${pageSlice('plans',state.planItems).map(({item, originalIndex}) => planRow(item, originalIndex)).join('')}</tbody></table></div>${pagination('plans',state.planItems.length)}</div>`;
}
function planRow(item,index) {
  const draft = item.status === '草稿'; const active = ['已发布','进行中'].includes(item.status); const editable = draft;
  const stages = draft ? `<button class="btn btn-icon btn-ghost" data-action="configure-stages" data-index="${index}" aria-label="配置关卡">${icon('layers',17)}</button>` : '';
  return `<tr data-filter-text="${esc(`${item.name} ${item.description}`)}" data-status="${item.status}"><td>${esc(item.name)}</td><td class="cell-sub">${esc(item.description)}</td><td>${item.method}</td><td>${badge(item.status,item.status === '已发布' ? 'blue' : item.status === '进行中' ? 'green' : '')}</td><td><div class="actions"><button class="btn btn-icon btn-ghost" data-action="view-plan" data-index="${index}" aria-label="查看计划">${icon('eye',17)}</button>${stages}${editable ? `<button class="btn btn-icon btn-ghost" data-action="edit-plan" data-index="${index}" aria-label="编辑计划">${icon('pencil',17)}</button>` : ''}${draft ? `<button class="btn btn-icon btn-ghost" data-action="publish-plan" data-index="${index}" aria-label="发布计划">${icon('arrow',17)}</button><button class="btn btn-icon btn-ghost btn-danger" data-action="delete-plan" data-index="${index}" aria-label="删除计划">${icon('trash',16)}</button>` : active ? `<button class="btn btn-icon btn-ghost btn-danger" data-action="terminate-plan" data-index="${index}" aria-label="终止计划">${icon('x',17)}</button>` : ''}</div></td></tr>`;
}

function relations() {
  // 兼容层：侧栏已下线关联规则菜单，但 hash 重定向可能暂时到达此 view（极短窗口）。返回引导页。
  state.view = 'projects';
  return projects();
}
function relationRow(item,index) { return `<tr data-filter-text="${esc(`${item.project} ${item.tasks.join(' ')}`)}" data-project="${esc(item.project)}"><td>${esc(item.project)}</td><td>${badge(item.type,'blue')}</td><td class="cell-sub">${esc(item.trigger)}</td><td><strong>${Number(item.priority ?? 100)}</strong></td><td><div class="stack-tags">${item.tasks.slice(0,2).map((t) => badge(esc(t))).join('')}${item.tasks.length > 2 ? badge(`+${item.tasks.length-2}`) : ''}</div></td><td class="cell-sub">${item.date}</td><td><button class="status-button ${item.enabled ? 'enabled' : ''}" data-action="toggle-relation" data-index="${index}">${item.enabled ? '已启用' : '已停用'}</button></td><td><div class="actions"><button class="btn btn-icon btn-ghost" data-action="view-relation" data-index="${index}" aria-label="查看规则">${icon('eye',17)}</button><button class="btn btn-icon btn-ghost" data-action="edit-relation" data-index="${index}" aria-label="编辑规则">${icon('pencil',17)}</button><button class="btn btn-icon btn-ghost" data-action="simulate-relation" data-index="${index}" aria-label="试运行规则" title="用现有测评结果试运行">${icon('play',15)}</button><button class="btn btn-icon btn-ghost btn-danger" data-action="delete-relation" data-index="${index}" aria-label="删除规则">${icon('trash',16)}</button></div></td></tr>`; }

// === 项目内 / 系列内 关联规则视图（方案①） ===
// 上下文：state.projectRelationContext = { targetName, isSeries }
// 从项目/系列详情入口进入，关联规则作为"项目子能力"展示

function scopedRelationRows(targetName, isSeries) {
  // 严格按 project 字段过滤；series 项目名称可能带"系列"后缀，按 state.seriesItems 实际名字匹配
  const matched = state.relationItems.map((item, index) => ({ item, originalIndex: index })).filter(({ item }) => {
    if (isSeries) return item.project === targetName && state.seriesItems.some((series) => series.name === targetName);
    return item.project === targetName;
  });
  // 按 priority 排序
  matched.sort((a, b) => Number(a.item.priority ?? 100) - Number(b.item.priority ?? 100));
  if (!matched.length) return `<tr><td colspan="7" class="empty">该项目还没有关联规则。点击"新建关联规则"开始配置。</td></tr>`;
  return matched.map(({ item, originalIndex }) => scopedRelationRow(item, originalIndex, targetName)).join('');
}

function scopedRelationRow(item, index, targetName) {
  return `<tr data-filter-text="${esc(`${item.project} ${item.tasks.join(' ')}`)}" data-project="${esc(item.project)}"><td>${badge(item.type, 'blue')}</td><td class="cell-sub">${esc(item.trigger)}</td><td><strong>${Number(item.priority ?? 100)}</strong></td><td><div class="stack-tags">${item.tasks.slice(0,3).map((t) => badge(esc(t))).join('')}${item.tasks.length > 3 ? badge(`+${item.tasks.length - 3}`) : ''}</div></td><td class="cell-sub">${item.date}</td><td><button class="status-button ${item.enabled ? 'enabled' : ''}" data-action="toggle-relation" data-index="${index}">${item.enabled ? '已启用' : '已停用'}</button></td><td><div class="actions"><button class="btn btn-icon btn-ghost" data-action="view-relation" data-index="${index}" aria-label="查看规则">${icon('eye',17)}</button><button class="btn btn-icon btn-ghost" data-action="edit-relation" data-index="${index}" aria-label="编辑规则">${icon('pencil',17)}</button><button class="btn btn-icon btn-ghost" data-action="simulate-relation" data-index="${index}" aria-label="试运行规则" title="用该项目测评结果试运行">${icon('play',15)}</button><button class="btn btn-icon btn-ghost btn-danger" data-action="delete-relation" data-index="${index}" aria-label="删除规则">${icon('trash',16)}</button></div></td></tr>`;
}

function ensureRelationContext() {
  if (!state.projectRelationContext || !state.projectRelationContext.targetName) {
    // 兼容旧 hash / 直接访问：跳转到项目列表
    state.view = 'projects';
    state.projectRelationContext = null;
    return false;
  }
  return true;
}

function projectRelations() {
  if (!ensureRelationContext()) return projects();
  const { targetName } = state.projectRelationContext;
  return scopedRelationView(targetName, false);
}

function seriesRelations() {
  if (!ensureRelationContext()) return series();
  const { targetName } = state.projectRelationContext;
  return scopedRelationView(targetName, true);
}

function scopedRelationView(targetName, isSeries) {
  // 列表严格按 targetName 过滤
  const matched = state.relationItems.filter((item) => item.project === targetName);
  const enabled = matched.filter((item) => item.enabled).length;
  const backView = isSeries ? 'series' : 'projects';
  const backLabel = isSeries ? '系列测评管理' : '测试项目管理';
  const newBtn = `<button class="btn btn-blue" data-action="new-relation">${icon('plus',17)}新建关联规则</button>`;
  return `${breadcrumb(backLabel, '关联规则', 'back-relation-list')}<div class="page-head"><div><h1 class="page-title">${esc(targetName)} · 关联规则</h1><p class="page-subtitle">${isSeries?'配置系列测评完成后的任务关联规则':'配置该测评结果到任务的下发规则'}</p></div><div class="actions" style="display:flex;gap:8px">${newBtn}</div></div>
    <div class="stats">${stat('本'+(isSeries?'系列':'项目')+'规则数', matched.length, 'link')}${stat('启用中', enabled, 'info', 'green')}${stat('已停用', matched.length - enabled, 'info', 'gray')}${stat('关联任务数', matched.reduce((sum, item) => sum + item.tasks.length, 0), 'link')}</div>
    <div class="panel"><div class="table-scroll"><table class="data-table"><thead><tr><th>关联类型</th><th>触发条件</th><th>优先级</th><th>关联任务</th><th>创建时间</th><th>状态</th><th>操作</th></tr></thead><tbody id="relation-rows">${scopedRelationRows(targetName, isSeries)}</tbody></table></div></div>`;
}

// === 关联规则试运行 / 模拟器（P0） ===
// 5 种 evaluator + 统一入口 + Modal 渲染
// 数据源：state.resultItems（已存在的测评结果作为"测试答题数据"）

function evalTotalRangeCondition(answer, condition) {
  // answer 需含 rawScore 或 normalizedScore
  const score = Number(answer.rawScore ?? answer.normalizedScore ?? answer.score);
  if (!Number.isFinite(score)) return { matched: false, reason: '缺少总分' };
  const min = Number(condition.min);
  const max = Number(condition.max);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return { matched: false, reason: '区间无效' };
  return { matched: score >= min && score <= max, reason: `总分 ${score} ${score >= min && score <= max ? '在' : '不在'} [${min}, ${max}]` };
}

function evalDimensionCondition(answer, condition, rule) {
  // 兼容：condition.dimension 可能为空，需要从 rule.trigger 字符串里抽取
  const inferredDim = String(condition.dimension || '').trim() || String(rule?.trigger || '').split('得分')[0].trim();
  const dims = answer.dimensionScores || [];
  const dim = dims.find((row) => String(row[0]).trim() === inferredDim);
  if (!dim) return { matched: false, reason: `维度「${inferredDim || '未指定'}」缺失` };
  const score = Number(dim[1]);
  const min = Number(condition.min);
  const max = Number(condition.max);
  if (!Number.isFinite(score)) return { matched: false, reason: '维度分无效' };
  if (!Number.isFinite(min) || !Number.isFinite(max)) return { matched: false, reason: '区间无效' };
  return { matched: score >= min && score <= max, reason: `维度「${inferredDim}」= ${score} ${score >= min && score <= max ? '在' : '不在'} [${min}, ${max}]` };
}

function evalOptionCondition(answer, condition) {
  const answers = answer.questionAnswers || {};
  const qid = condition.question;
  if (!answers[qid]) return { matched: false, reason: `题目 ${qid} 答案缺失` };
  const ans = String(answers[qid]);
  const opt = String(condition.option);
  return { matched: ans === opt, reason: `题目 ${qid} 答案「${ans}」${ans === opt ? '=' : '≠'}「${opt}」` };
}

function evaluateRule(rule, answer) {
  // 统一入口：按 rule.type 分发；返回 { matched, reason, tasks, evaluable }
  if (!answer) return { matched: false, reason: '无答题数据', evaluable: false, tasks: [] };

  if (rule.type === '总分区间' || rule.type === '分数区间') {
    const conds = rule.conditions || [];
    if (!conds.length) return { matched: false, reason: '未配置条件', evaluable: true, tasks: [] };
    const results = conds.map((c) => evalTotalRangeCondition(answer, c));
    const matched = rule.logic === 'ANY' ? results.some((r) => r.matched) : results.every((r) => r.matched);
    const reason = results.map((r) => r.reason).join(' | ');
    return { matched, reason, evaluable: true, tasks: matched ? rule.tasks : [] };
  }

  if (rule.type === '维度得分') {
    const conds = rule.conditions || [];
    if (!conds.length) return { matched: false, reason: '未配置条件', evaluable: true, tasks: [] };
    const results = conds.map((c) => evalDimensionCondition(answer, c, rule));
    const matched = rule.logic === 'ANY' ? results.some((r) => r.matched) : results.every((r) => r.matched);
    const reason = results.map((r) => r.reason).join(' | ');
    return { matched, reason, evaluable: true, tasks: matched ? rule.tasks : [] };
  }

  if (rule.type === '选项匹配') {
    const conds = rule.conditions || [];
    if (!conds.length) return { matched: false, reason: '未配置条件', evaluable: true, tasks: [] };
    const results = conds.map((c) => evalOptionCondition(answer, c));
    const matched = rule.logic === 'ANY' ? results.some((r) => r.matched) : results.every((r) => r.matched);
    const reason = results.map((r) => r.reason).join(' | ');
    return { matched, reason, evaluable: true, tasks: matched ? rule.tasks : [] };
  }

  if (rule.type === '按照测评项目任务关联') {
    // 聚合 series 子项目已启用规则
    const series = state.seriesItems.find((s) => s.name === rule.project);
    if (!series) return { matched: false, reason: '找不到系列', evaluable: true, tasks: [] };
    const subRules = state.relationItems.filter((r) => series.projects.includes(r.project) && r.enabled);
    if (!subRules.length) return { matched: false, reason: '系列下无启用规则', evaluable: true, tasks: [] };
    let matchedAny = false;
    const reasons = [];
    const taskSet = new Set();
    subRules.forEach((sub) => {
      const res = evaluateRule(sub, answer);
      if (res.matched) {
        matchedAny = true;
        reasons.push(`${sub.project} ✓`);
        res.tasks.forEach((t) => taskSet.add(t));
      } else {
        reasons.push(`${sub.project} ✗`);
      }
    });
    return { matched: matchedAny, reason: reasons.join(' | '), evaluable: true, tasks: [...taskSet] };
  }

  if (rule.type === '脚本导入') {
    if (!rule.script) return { matched: false, reason: '脚本为空', evaluable: true, tasks: [] };
    let parsed;
    try {
      parsed = parseAndValidateRelationScript(rule.script);
    } catch (err) {
      return { matched: false, reason: `脚本错误：${err.message}`, evaluable: false, tasks: [] };
    }
    let matchedAny = false;
    const reasons = [];
    const taskSet = new Set();
    parsed.forEach((sub, idx) => {
      const subRule = {
        type: sub.type === 'score_range' ? '总分区间' : sub.type === 'dimension' ? '维度得分' : '选项匹配',
        tasks: sub.tasks.map((t) => typeof t === 'string' ? t : t.name),
        conditions: sub.type === 'score_range'
          ? [{ min: sub.minScore, max: sub.maxScore }]
          : sub.type === 'dimension'
          ? [{ dimension: sub.dimension, min: sub.minScore, max: sub.maxScore ?? 100 }]
          : [{ question: 'q1', option: sub.optionContent }],
        logic: 'ALL',
      };
      const res = evaluateRule(subRule, answer);
      if (res.matched) {
        matchedAny = true;
        reasons.push(`#${idx + 1} ✓`);
        res.tasks.forEach((t) => taskSet.add(t));
      } else {
        reasons.push(`#${idx + 1} ✗`);
      }
    });
    return { matched: matchedAny, reason: reasons.join(' | '), evaluable: true, tasks: [...taskSet] };
  }

  return { matched: false, reason: `未知类型：${rule.type}`, evaluable: false, tasks: [] };
}

// 试运行 Modal
function openRelationSimulator(ruleIndex) {
  const rule = state.relationItems[ruleIndex];
  if (!rule) return;
  const allAnswers = state.resultItems;

  const renderResult = () => {
    const rows = allAnswers.map((answer) => {
      const compatible = answer.test === rule.project || rule.type === '按照测评项目任务关联';
      const res = compatible ? evaluateRule(rule, answer) : { matched: false, reason: `测评项目不匹配（${answer.test} ≠ ${rule.project}）`, evaluable: false, tasks: [] };
      return { answer, res, compatible };
    });
    const matched = rows.filter((r) => r.res.matched);
    const totalTasks = new Set();
    matched.forEach((m) => m.res.tasks.forEach((t) => totalTasks.add(t)));

    const stats = `
      <div class="simulator-stats">
        <div class="sim-stat"><span class="sim-stat-label">命中数</span><span class="sim-stat-value">${matched.length}<small> / ${rows.length}</small></span></div>
        <div class="sim-stat"><span class="sim-stat-label">派单任务（去重）</span><span class="sim-stat-value">${totalTasks.size}</span></div>
        <div class="sim-stat"><span class="sim-stat-label">数据兼容</span><span class="sim-stat-value">${rows.filter((r) => r.compatible).length}<small> / ${rows.length}</small></span></div>
      </div>`;

    const matchedList = matched.length ? `<ul class="sim-list matched">${matched.map((m) => `<li><strong>${esc(m.answer.name)}</strong> · ${esc(m.answer.test)} · ${esc(String(m.answer.score))} 分<div class="cell-sub">${esc(m.res.reason)}</div><div class="sim-tasks">→ ${m.res.tasks.map((t) => `<span class="selected-task-chip">${esc(t)}</span>`).join(' ')}</div></li>`).join('')}</ul>` : '<p class="cell-sub">暂无命中</p>';

    const unmatchedList = rows.filter((r) => !r.res.matched).map((m) => `<li><strong>${esc(m.answer.name)}</strong> · ${esc(m.answer.test)} · ${esc(String(m.answer.score))} 分<div class="cell-sub">${esc(m.res.reason)}</div></li>`).join('');
    const unmatchedBlock = unmatchedList ? `<h4 style="margin-top:16px">未命中（${rows.length - matched.length}）</h4><ul class="sim-list unmatched">${unmatchedList}</ul>` : '';

    return `${stats}<h4 style="margin:0 0 8px">命中（${matched.length}）</h4>${matchedList}${unmatchedBlock}`;
  };

  const ruleInfo = `
    <div class="simulator-rule">
      <div><strong>${esc(rule.project)}</strong> · ${badge(rule.type, 'blue')}</div>
      <div class="cell-sub">${esc(rule.trigger || '—')}</div>
      <div class="sim-rule-tasks">${rule.tasks.map((t) => `<span class="selected-task-chip">${esc(t)}</span>`).join(' ')}</div>
    </div>`;

  const helpText = `
    <div class="simulator-help">
      <strong>试运行说明</strong>
      <p>数据源：<code>state.resultItems</code>（${state.resultItems.length} 条历史测评结果）。仅当答题的测评项目与规则关联测评匹配时才参与判定，否则标记"测评项目不匹配"。</p>
      <p>5 种触发器均已实现：总分区间 / 维度得分 / 选项匹配 / 按项目任务关联（递归）/ 脚本导入（JSON 解析）。</p>
    </div>`;

  const body = `<div class="simulator-body">${ruleInfo}${helpText}<div class="simulator-result">${renderResult()}</div></div>`;
  const footer = `<div class="modal-foot"><button type="button" class="btn" data-action="close-modal">关闭</button><button type="button" class="btn btn-blue" data-action="rerun-simulator" data-index="${ruleIndex}">${icon('refresh',15)}重新运行</button></div>`;
  document.querySelector('#overlay-root').innerHTML = modalShell(`关联规则试运行 · ${esc(rule.project)}`, `用现有测评结果模拟规则命中情况`, body, footer, true);
}

function detailHead(title, subtitle, save = '') { return `${breadcrumb('测试项目管理',title)}${head(title, subtitle, save)}`; }
function questions() {
  const project = currentProject();
  const questions = currentQuestions();
  if (!project) return `${detailHead('测试项目管理','暂无可配置项目')}<div class="empty">请先创建测评项目</div>`;
  return `${detailHead('测试项目管理','创建和管理测评项目，配置题目和评分规则')}
    <div class="detail-card detail-summary" style="margin-top:16px"><div><div class="section-title">${esc(project.name)}</div><div class="cell-sub">${esc(project.description)} · ${questions.length} 道题目</div></div>${badge(project.status,project.status === '已发布' ? 'green' : '')}</div>
    <div class="detail-card"><div class="detail-summary" style="margin-bottom:28px"><h2 class="section-title">题目列表</h2><div class="head-actions"><button class="btn" data-action="jump-rules">${icon('workflow',17)}整体跳转规则配置</button><button class="btn btn-primary" data-action="new-question">${icon('plus',17)}新建题目</button></div></div>
    <div class="question-list">${questions.length ? questions.map(questionRow).join('') : '<div class="empty">暂无题目，点击“新建题目”开始配置</div>'}</div></div>`;
}

function questionRow(question, index) {
  const typeLabel = question.type.replace('题', '');
  const options = question.type === '文本题' ? '文本作答' : question.type === '量表题' ? `量表：${question.scale?.min ?? 1}–${question.scale?.max ?? 5}（${esc(question.scale?.minLabel || '最低')} → ${esc(question.scale?.maxLabel || '最高')}）` : `选项：${question.options.map((option) => `${esc(option.content)}(${option.score}分)`).join(' / ')}`;
  const branchCount = question.branchRules?.length || 0;
  return `<div class="question-row"><div class="question-index"><button data-action="move-question" data-direction="up" data-index="${index}" aria-label="上移题目">⌃</button><span class="number">${index + 1}</span><button data-action="move-question" data-direction="down" data-index="${index}" aria-label="下移题目">⌄</button></div><div><div class="question-text">${esc(question.content)}</div><div class="question-meta">${badge(typeLabel,'blue')}${question.required ? '<span class="tag" style="color:#ef4444">必答</span>' : ''}${question.category ? badge(esc(question.category)) : ''}<span class="tag" style="color:#075cff;background:#eff6ff">权重: ${question.weight}</span>${branchCount ? badge(`${branchCount} 条跳转`,'purple') : ''}</div><div class="cell-sub">${options}</div></div><div class="actions"><button class="btn btn-icon" data-action="question-branch" data-index="${index}" aria-label="配置题目跳转">${icon('workflow',16)}</button><button class="btn btn-icon" data-action="edit-question" data-index="${index}" aria-label="编辑题目">${icon('pencil',17)}</button><button class="btn btn-icon btn-ghost btn-danger" data-action="delete-question" data-index="${index}" aria-label="删除题目">${icon('trash',16)}</button></div></div>`;
}

function questionMaxScore(question) {
  if (question.type === '文本题') return 0;
  if (question.type === '量表题') return Number(question.scale?.max || 5) * Number(question.weight || 1);
  const scores = question.options.map((option) => Number(option.score || 0));
  const raw = question.type === '多选题' ? scores.filter((score) => score > 0).reduce((sum,score) => sum + score,0) : Math.max(0,...scores);
  return raw * Number(question.weight || 1);
}

function scoring() {
  const project = currentProject();
  const questions = currentQuestions();
  const maxScore = questions.reduce((sum,question) => sum + questionMaxScore(question),0);
  if (!project) return `${detailHead('评分规则配置','暂无可配置项目')}<div class="empty">请先创建测评项目</div>`;
  return `${breadcrumb('测试项目管理','评分规则配置')}${head('评分规则配置',`为 ${esc(project.name)} 配置评分规则和结果判定`, `<button class="btn btn-primary" data-action="save-scoring">${icon('save',17)}保存配置</button>`)}
    <div class="detail-card score-top" style="margin-top:16px"><div><div class="section-title">${esc(project.name)}</div><div class="cell-sub">${esc(project.description)} · ${questions.length} 道题目</div></div><div></div><div class="score-total"><span class="cell-sub">理论最高分</span><strong>${maxScore.toFixed(1)}</strong></div></div>
    <div class="tabs" style="--tabs:3"><button class="tab ${state.scoreTab === 'segments' ? 'active' : ''}" data-score-tab="segments">⌁ 整体分值分段</button><button class="tab ${state.scoreTab === 'questions' ? 'active' : ''}" data-score-tab="questions">▥ 题目组合评分</button><button class="tab ${state.scoreTab === 'script' ? 'active' : ''}" data-score-tab="script">‹› 自定义脚本</button></div>
    ${renderScoringTab(maxScore)}`;
}

function renderScoringTab(maxScore) {
  const scoring = currentScoring();
  if (state.scoreTab === 'questions') return `<div class="panel"><div class="detail-summary score-panel-head"><div><h2 class="section-title">题目组合评分</h2><p class="page-subtitle" style="margin-top:6px">将特定题目组合成维度，并为每个维度配置独立的分段结果</p></div><button class="btn btn-primary" data-action="add-score-group">${icon('plus',17)}添加分组</button></div><div class="score-groups">${scoring.groups.length ? scoring.groups.map(scoreGroup).join('') : '<div class="score-empty">暂无题目组合，点击“添加分组”创建维度评分</div>'}</div></div>`;
  if (state.scoreTab === 'script') return `<div class="panel"><div class="score-panel-head"><h2 class="section-title">自定义评分脚本</h2><p class="page-subtitle" style="margin-top:6px">脚本可读取 answers、totalScore 和 questions，需返回一个结果对象</p></div><div class="script-config score-script"><label class="field"><span>JavaScript 脚本</span><textarea class="textarea code-area" id="score-script" spellcheck="false">${esc(scoring.script)}</textarea></label><div class="script-actions"><button class="btn" data-action="load-score-script">加载示例</button><button class="btn btn-primary" data-action="test-score-script">测试脚本</button></div><div id="score-script-result" class="script-test-result">尚未运行测试</div></div></div>`;
  return `<div class="panel"><div class="detail-summary score-panel-head"><div><h2 class="section-title">整体测评累计分值分段结果</h2><p class="page-subtitle" style="margin-top:6px">根据测评总分设置不同分数段的评估结果</p></div><button class="btn btn-primary" data-action="add-score-segment" data-scope="overall">${icon('plus',17)}添加分段</button></div><div class="segments">${scoring.segments.length ? scoring.segments.map((item,index) => scoreSegment(item,index,'overall')).join('') : '<div class="score-empty">暂无分段，请添加至少一条评分结果</div>'}<div class="hint"><strong>配置提示：</strong><br>• 分段范围应覆盖所有可能的分数，避免遗漏<br>• 确保分段之间没有重叠<br>• 理论最高分为: ${maxScore.toFixed(1)} 分</div></div></div>`;
}

function scoreSegment(item,index,scope,groupIndex = '') {
  return `<div class="segment"><div class="segment-number">${index + 1}</div><div><div class="form-grid"><label class="field"><span>最小分值</span><input class="input" type="number" data-score-field="min" data-scope="${scope}" data-index="${index}" data-group-index="${groupIndex}" value="${item.min}"></label><label class="field"><span>最大分值</span><input class="input" type="number" data-score-field="max" data-scope="${scope}" data-index="${index}" data-group-index="${groupIndex}" value="${item.max}"></label><label class="field full"><span>结果标题</span><input class="input" data-score-field="title" data-scope="${scope}" data-index="${index}" data-group-index="${groupIndex}" value="${esc(item.title)}"></label><label class="field full"><span>结果描述</span><textarea class="textarea" data-score-field="description" data-scope="${scope}" data-index="${index}" data-group-index="${groupIndex}">${esc(item.description)}</textarea></label></div><div class="segment-foot"><span>分数范围: <b data-score-range>${item.min} - ${item.max}</b></span><button class="btn btn-icon btn-ghost btn-danger" data-action="delete-score-segment" data-scope="${scope}" data-index="${index}" data-group-index="${groupIndex}" aria-label="删除分段">${icon('trash',16)}</button></div></div></div>`;
}

function scoreGroup(group,groupIndex) {
  const questionNames = group.questionIndexes.map((index) => currentQuestions()[index]?.content).filter(Boolean);
  return `<section class="score-group"><div class="score-group-head"><span class="segment-number">${groupIndex + 1}</span><input class="input" data-score-field="groupName" data-scope="group" data-group-index="${groupIndex}" value="${esc(group.name)}" aria-label="分组名称"><button class="rule-switch ${group.enabled ? 'on' : ''}" data-action="toggle-score-group" data-group-index="${groupIndex}">${group.enabled ? '已启用' : '已停用'}</button><button class="btn btn-icon btn-ghost btn-danger" data-action="delete-score-group" data-group-index="${groupIndex}" aria-label="删除分组">${icon('trash',16)}</button></div><div class="score-group-questions"><div><strong>包含题目</strong><div class="cell-sub">${questionNames.length ? questionNames.map((name) => esc(name)).join(' · ') : '尚未选择题目'}</div></div><button class="btn" data-action="pick-score-questions" data-group-index="${groupIndex}">选择题目 (${group.questionIndexes.length})</button></div><div class="detail-summary"><strong>分组分段</strong><button class="btn" data-action="add-score-segment" data-scope="group" data-group-index="${groupIndex}">${icon('plus',16)}添加分段</button></div><div>${group.segments.length ? group.segments.map((item,index) => scoreSegment(item,index,'group',groupIndex)).join('') : '<div class="score-empty compact">请添加分组分段</div>'}</div></section>`;
}

let scoreQuestionPickerDraft = null;
function openScoreQuestionPicker(groupIndex) {
  const group = currentScoring().groups[groupIndex];
  scoreQuestionPickerDraft = { groupIndex, selected:[...group.questionIndexes] };
  const choices = currentQuestions().map((question,index) => `<label class="choice-card"><input type="checkbox" name="scoreQuestion" value="${index}" ${scoreQuestionPickerDraft.selected.includes(index) ? 'checked' : ''}><span><strong>第 ${index + 1} 题</strong><small>${esc(question.content)} · ${question.type}</small></span></label>`).join('');
  document.querySelector('#overlay-root').innerHTML = modalShell('选择分组题目',group.name,`<div class="modal-body"><div class="cell-sub">同一题目可用于不同分组，分组得分按题目权重累计</div><div class="choice-grid score-question-picker">${choices || '<div class="empty">当前项目还没有题目</div>'}</div></div>`,`<div class="modal-foot"><button class="btn" data-action="close-modal">取消</button><button class="btn btn-primary" data-action="save-score-questions">确认选择</button></div>`,true);
}

function validateScoring() {
  const scoring = currentScoring();
  const invalid = [...scoring.segments,...scoring.groups.flatMap((group) => group.segments)].find((segment) => Number(segment.min) > Number(segment.max) || !String(segment.title || '').trim());
  if (invalid) return '分段的最小分不能高于最大分，且结果标题不能为空';
  if (scoring.groups.some((group) => !group.name.trim() || !group.questionIndexes.length)) return '每个题目分组都需要名称并至少选择一道题';
  return '';
}

function runScoreScript() {
  const scoring = currentScoring();
  scoring.script = document.querySelector('#score-script')?.value || scoring.script;
  const resultBox = document.querySelector('#score-script-result');
  try {
    const questions = currentQuestions();
    const answers = questions.map((question) => question.type === '文本题' ? '测试文本' : question.type === '量表题' ? Number(question.scale?.max || 5) : question.options.at(-1)?.content || null);
    const totalScore = questions.reduce((sum,question) => sum + questionMaxScore(question),0);
    const execute = new Function('answers','totalScore','questions',`"use strict";\n${scoring.script}`);
    const result = execute(answers,totalScore,questions.map((question) => ({ content:question.content, type:question.type, weight:question.weight })));
    if (result === undefined) throw new Error('脚本未返回结果');
    resultBox.className = 'script-test-result success';
    resultBox.textContent = `测试通过：${JSON.stringify(result)}`;
  } catch (error) {
    resultBox.className = 'script-test-result error';
    resultBox.textContent = `测试失败：${error.message}`;
  }
}

function openProjectModal() {
  document.querySelector('#overlay-root').innerHTML = `<div class="modal-backdrop" data-action="close-modal"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><h2 class="modal-title" id="modal-title">新建测评项目</h2><p class="modal-subtitle">填写项目基本信息，创建后可添加题目</p></div><button class="modal-close" data-action="close-modal">${icon('x',18)}</button></div><form id="project-form"><div class="modal-body"><label class="field"><span>项目名称 *</span><input class="input" name="name" placeholder="如：心理健康测评" required autofocus></label><label class="field"><span>项目描述</span><textarea class="textarea" name="description" placeholder="简要描述测评项目的内容"></textarea></label></div><div class="modal-foot"><button type="button" class="btn" data-action="close-modal">取消</button><button type="submit" class="btn btn-primary">${icon('save',16)}创建项目</button></div></form></div></div>`;
}

let questionDraft = null;
function openQuestionModal(editIndex = null) {
  const existing = editIndex === null ? null : currentQuestions()[editIndex];
  questionDraft = {
    editIndex,
    content: existing?.content || '', type: existing?.type || '单选题', category: existing?.category || '',
    weight: existing?.weight ?? 1, required: existing?.required ?? true,
    options: existing ? existing.options.map((option) => ({ ...option })) : [{ content: '选项1', score: 0 }, { content: '选项2', score: 1 }],
    scale: existing?.scale ? { ...existing.scale } : { min:1, max:5, minLabel:'非常不同意', maxLabel:'非常同意' },
    branchRules: existing?.branchRules ? existing.branchRules.map((rule) => ({ ...rule })) : [],
  };
  document.querySelector('#overlay-root').innerHTML = `<div class="modal-backdrop" data-action="close-modal"><div class="modal question-modal" role="dialog" aria-modal="true" aria-labelledby="question-modal-title"><div class="modal-head"><div><h2 class="modal-title" id="question-modal-title">${editIndex === null ? '新建题目' : '编辑题目'}</h2><p class="modal-subtitle">配置题目内容、权重和评分方式</p></div><button class="modal-close" data-action="close-modal">${icon('x',18)}</button></div><form id="question-form"><div class="modal-body"><label class="field"><span>题目内容 *</span><textarea class="textarea question-content" name="content" placeholder="请输入题目内容" required>${esc(questionDraft.content)}</textarea></label><div class="question-fields"><label class="field"><span>题目类型 *</span><select class="select" name="questionType"><option ${questionDraft.type === '单选题' ? 'selected' : ''}>单选题</option><option ${questionDraft.type === '多选题' ? 'selected' : ''}>多选题</option><option ${questionDraft.type === '量表题' ? 'selected' : ''}>量表题</option><option ${questionDraft.type === '文本题' ? 'selected' : ''}>文本题</option></select></label><label class="field"><span>题目分类</span><input class="input" name="category" placeholder="如：情绪状态" value="${esc(questionDraft.category)}"></label><label class="field"><span>题目权重 *</span><input class="input" name="weight" type="number" min="0" step="0.1" value="${questionDraft.weight}" required></label></div><label class="check-row"><input type="checkbox" name="required" ${questionDraft.required ? 'checked' : ''}><span>此题为必答题</span></label><div class="options-head"><span>选项列表（选项内容 + 分数）*</span><button type="button" class="btn" data-action="add-option">${icon('plus',17)}添加选项</button></div><div id="question-options"></div><div id="question-scale"></div><div class="cell-sub" id="question-type-hint"></div></div><div class="modal-foot"><button type="button" class="btn" data-action="close-modal">取消</button><button type="submit" class="btn btn-primary">${icon('save',16)}保存</button></div></form></div></div>`;
  renderQuestionOptions();
}

function syncQuestionOptions() {
  const rows = [...document.querySelectorAll('.option-row')];
  if (!rows.length || !questionDraft) return;
  questionDraft.options = rows.map((row) => ({
    content: row.querySelector('[data-option-content]').value,
    score: Number(row.querySelector('[data-option-score]').value || 0),
  }));
}

function renderQuestionOptions() {
  const container = document.querySelector('#question-options');
  if (!container || !questionDraft) return;
  const type = document.querySelector('#question-form [name="questionType"]')?.value || questionDraft.type;
  questionDraft.type = type;
  const hideOptions = ['文本题','量表题'].includes(type);
  container.parentElement.querySelector('.options-head').hidden = hideOptions;
  container.hidden = hideOptions;
  const scale = document.querySelector('#question-scale');
  const hint = document.querySelector('#question-type-hint');
  scale.hidden = type !== '量表题';
  if (type === '量表题') {
    scale.innerHTML = `<div class="scale-config"><div class="form-grid"><label class="field"><span>最小值 *</span><input class="input" type="number" name="scaleMin" min="0" value="${questionDraft.scale.min}" required></label><label class="field"><span>最大值 *</span><input class="input" type="number" name="scaleMax" min="1" value="${questionDraft.scale.max}" required></label><label class="field"><span>最小值标签</span><input class="input" name="scaleMinLabel" value="${esc(questionDraft.scale.minLabel)}" placeholder="如：非常不同意"></label><label class="field"><span>最大值标签</span><input class="input" name="scaleMaxLabel" value="${esc(questionDraft.scale.maxLabel)}" placeholder="如：非常同意"></label></div><div class="scale-preview"><span>${esc(questionDraft.scale.minLabel)}</span><div>${Array.from({length:Math.min(10,Math.max(2,questionDraft.scale.max-questionDraft.scale.min+1))},(_,index) => `<i>${questionDraft.scale.min + index}</i>`).join('')}</div><span>${esc(questionDraft.scale.maxLabel)}</span></div></div>`;
    hint.textContent = '提示：量表题使用连续数值范围，最大值参与理论最高分计算';
    return;
  }
  scale.innerHTML = '';
  if (type === '文本题') { hint.textContent = '提示：文本题不计分，可用于收集补充说明'; return; }
  const deletable = questionDraft.options.length > 2;
  container.innerHTML = questionDraft.options.map((option, index) => `<div class="option-row ${deletable ? 'deletable' : ''}"><span class="option-letter">${String.fromCharCode(65 + index)}</span><input class="input" data-option-content value="${esc(option.content)}" placeholder="选项内容" required><input class="input option-score" data-option-score type="number" value="${option.score}" placeholder="分数">${deletable ? `<button type="button" class="btn btn-icon btn-ghost btn-danger" data-action="remove-option" data-index="${index}" aria-label="删除选项">${icon('x',17)}</button>` : ''}</div>`).join('');
  hint.textContent = '提示：为每个选项设置对应分数，用于评分计算';
}

let branchDraft = null;
function openQuestionBranchModal(questionIndex) {
  const question = currentQuestions()[questionIndex];
  branchDraft = { questionIndex, rules:(question.branchRules || []).map((rule) => ({ ...rule })) };
  renderQuestionBranchModal();
}

function branchConditionFields(question,rule,index) {
  if (question.type === '文本题') return '<span class="condition-box">当用户已填写本题</span>';
  if (question.type === '量表题') return `<span>当分值在</span><input class="input mini" type="number" data-branch-field="min" data-index="${index}" value="${rule.min ?? question.scale.min}"><span>至</span><input class="input mini" type="number" data-branch-field="max" data-index="${index}" value="${rule.max ?? question.scale.max}">`;
  return `<span>当选择</span><select class="select" data-branch-field="option" data-index="${index}">${question.options.map((option) => `<option value="${esc(option.content)}" ${rule.option === option.content ? 'selected' : ''}>${esc(option.content)}</option>`).join('')}</select>`;
}

function renderQuestionBranchModal() {
  const question = currentQuestions()[branchDraft.questionIndex];
  const targets = currentQuestions().map((item,index) => index > branchDraft.questionIndex ? `<option value="${index}" ${Number(item.order) === index ? 'selected' : ''}>第 ${index + 1} 题 · ${esc(item.content.slice(0,22))}</option>` : '').join('');
  const cards = branchDraft.rules.length ? branchDraft.rules.map((rule,index) => `<div class="branch-rule-card"><div class="branch-rule-head"><span class="badge badge-dark">规则 ${index + 1}</span><span class="cell-sub">按顺序执行</span><button class="btn btn-icon btn-ghost btn-danger" data-action="remove-branch-rule" data-index="${index}">${icon('trash',16)}</button></div><div class="rule-line">${branchConditionFields(question,rule,index)}</div><div class="rule-line"><span>则</span><select class="select" data-branch-field="action" data-index="${index}"><option value="skip_to" ${rule.action === 'skip_to' ? 'selected' : ''}>跳转到题目</option><option value="finish" ${rule.action === 'finish' ? 'selected' : ''}>结束问卷</option></select><select class="select" data-branch-field="target" data-index="${index}" ${rule.action === 'finish' ? 'disabled' : ''}><option value="">选择目标题</option>${targets.replace(`value="${rule.target}"`,`value="${rule.target}" selected`)}</select></div></div>`).join('') : '<div class="jump-empty"><div class="jump-empty-icon">'+icon('workflow',42)+'</div><div>暂无本题跳转规则</div><div class="cell-sub">可按选项或分值跳转到后续题目，或直接结束问卷</div></div>';
  document.querySelector('#overlay-root').innerHTML = modalShell('配置跳转规则',`第 ${branchDraft.questionIndex + 1} 题 · ${question.content}`,`<div class="modal-body"><div class="detail-summary"><div><strong>题目内跳转</strong><div class="cell-sub">多条规则按从上到下的顺序匹配</div></div><button class="btn btn-primary" data-action="add-branch-rule">${icon('plus',16)}添加规则</button></div><div class="branch-rule-list">${cards}</div></div>`,`<div class="modal-foot"><button class="btn" data-action="close-modal">取消</button><button class="btn btn-primary" data-action="save-branch-rules">${icon('save',16)}保存规则</button></div>`,true);
}

function syncBranchDraft() {
  if (!branchDraft) return;
  document.querySelectorAll('[data-branch-field]').forEach((field) => {
    const rule = branchDraft.rules[Number(field.dataset.index)];
    const key = field.dataset.branchField;
    rule[key] = ['min','max','target'].includes(key) && field.value !== '' ? Number(field.value) : field.value;
  });
}

function jumpRuleCard(rule, index) {
  const questionOptions = currentQuestions().map((question, questionIndex) => `<option value="${questionIndex + 1}" ${Number(rule.target) === questionIndex + 1 ? 'selected' : ''}>第 ${questionIndex + 1} 题 · ${esc(question.content.slice(0,18))}</option>`).join('');
  return `<div class="jump-card" data-rule-index="${index}"><div class="jump-card-head"><span class="badge badge-dark">规则 ${index + 1}</span><input class="input" data-rule-field="name" value="${esc(rule.name)}"><button class="rule-switch ${rule.enabled ? 'on' : ''}" data-action="toggle-rule" data-index="${index}">${rule.enabled ? '已启用' : '已停用'}</button><button class="btn btn-icon btn-ghost btn-danger" data-action="remove-rule" data-index="${index}">${icon('x',17)}</button></div><div class="rule-line"><span class="radio-dot"></span><span>题目范围</span><span>第</span><input class="input mini" data-rule-field="from" type="number" min="1" value="${rule.from}"><span>题到第</span><input class="input mini" data-rule-field="to" type="number" min="1" value="${rule.to}"><span>题</span></div><div class="rule-line"><span class="radio-dot"></span><span>累计分数</span><input class="input mini" data-rule-field="scoreMin" type="number" value="${rule.scoreMin}"><span>到</span><input class="input mini" data-rule-field="scoreMax" type="number" value="${rule.scoreMax}"></div><div class="rule-line"><span style="color:#00a63e">→</span><span>跳转动作</span><select class="select" data-rule-field="action"><option value="skip_to" ${rule.action !== 'finish' ? 'selected' : ''}>跳转到</option><option value="finish" ${rule.action === 'finish' ? 'selected' : ''}>直接结束测评</option></select><select class="select target-select" data-rule-field="target" ${rule.action === 'finish' ? 'disabled' : ''}><option value="">选择目标题目</option>${questionOptions}</select></div><div class="rule-preview">规则预览：第 ${rule.from}-${rule.to} 题累计分数在 ${rule.scoreMin}-${rule.scoreMax} 之间　→　${rule.action === 'finish' ? '直接结束测评' : rule.target ? `跳转至第 ${rule.target} 题` : '未设置目标题目'}</div></div>`;
}

function jumpRulesBody() {
  const rules = currentJumpRules();
  if (state.jumpMode === 'script') {
    return `<div class="script-config"><label class="field"><span>规则脚本（JSON格式）</span><textarea id="jump-script" class="textarea code-area" placeholder="粘贴或编辑JSON格式的跳转规则...">${esc(JSON.stringify(rules, null, 2))}</textarea></label><div class="script-actions"><button class="btn btn-primary" data-action="import-script">${icon('save',16)}导入脚本</button><button class="btn" data-action="export-rules">${icon('download',16)}导出到文件</button></div><div class="code-example"><div>‹› 脚本格式示例</div><pre>[
  {
    "id": "global-rule-1",
    "name": "低风险人群跳转",
    "condition": {
      "type": "cumulative_score",
      "questionRange": { "from": 1, "to": 5 },
      "scoreMin": 0,
      "scoreMax": 10
    },
    "action": "skip_to",
    "targetQuestionOrder": 20,
    "enabled": true
  }
]</pre></div></div>`;
  }
  return `<div class="jump-toolbar"><span>全局跳转规则</span><div><button class="btn" data-action="export-rules">${icon('download',16)}导出规则</button><button class="btn" data-action="add-rule">${icon('plus',16)}添加规则</button></div></div><div id="jump-rule-list">${rules.length ? rules.map(jumpRuleCard).join('') : `<div class="jump-empty"><div class="jump-empty-icon">${icon('workflow',46)}</div><div>暂无全局跳转规则</div><div class="cell-sub">点击“添加规则”创建基于累计分数的跳转逻辑</div></div>`}</div><div class="jump-hint">💡 <strong>提示</strong><br>• 全局规则在每次用户回答题目后都会被检查<br>• 规则按顺序执行，第一个匹配的规则会被触发<br>• 可以临时禁用规则而不删除，方便测试<br>• 适用于“前N题累计分数超过X分则跳转”的场景</div>`;
}

function openJumpRulesModal(mode = state.jumpMode) {
  state.jumpMode = mode;
  document.querySelector('#overlay-root').innerHTML = `<div class="modal-backdrop" data-action="close-modal"><div class="modal jump-modal" role="dialog" aria-modal="true" aria-labelledby="jump-modal-title"><div class="modal-head"><div><h2 class="modal-title" id="jump-modal-title">${icon('workflow',20)} 整体跳转规则配置</h2><p class="modal-subtitle">配置基于多题累计分数的全局跳转规则，支持可视化配置和脚本导入</p></div><button class="modal-close" data-action="close-modal">${icon('x',18)}</button></div><div class="modal-body jump-body"><div class="tabs" style="--tabs:2;margin:0"><button class="tab ${state.jumpMode === 'visual' ? 'active' : ''}" data-action="jump-mode" data-mode="visual">可视化配置</button><button class="tab ${state.jumpMode === 'script' ? 'active' : ''}" data-action="jump-mode" data-mode="script">脚本配置</button></div><div id="jump-content">${jumpRulesBody()}</div></div><div class="modal-foot"><button class="btn" data-action="close-modal">取消</button><button class="btn btn-primary" data-action="save-jump-rules">${icon('workflow',16)}保存配置</button></div></div></div>`;
}

function syncJumpRules() {
  document.querySelectorAll('.jump-card').forEach((card) => {
    const rule = currentJumpRules()[Number(card.dataset.ruleIndex)];
    card.querySelectorAll('[data-rule-field]').forEach((field) => {
      const key = field.dataset.ruleField;
      rule[key] = ['from','to','scoreMin','scoreMax','target'].includes(key) && field.value !== '' ? Number(field.value) : field.value;
    });
  });
}

function validateJumpRules() {
  const count=currentQuestions().length;
  for (const [index,rule] of currentJumpRules().entries()) {
    if (!String(rule.name || '').trim()) return `规则 ${index+1} 需要填写名称`;
    if (!Number.isInteger(Number(rule.from)) || !Number.isInteger(Number(rule.to)) || rule.from < 1 || rule.to < rule.from || rule.to > count) return `规则 ${index+1} 的题目范围无效`;
    if (!Number.isFinite(Number(rule.scoreMin)) || !Number.isFinite(Number(rule.scoreMax)) || Number(rule.scoreMin) > Number(rule.scoreMax)) return `规则 ${index+1} 的分数区间无效`;
    if (rule.action !== 'finish' && (!Number.isInteger(Number(rule.target)) || Number(rule.target) <= Number(rule.to) || Number(rule.target) > count)) return `规则 ${index+1} 只能跳转到题目范围之后的有效题目`;
  }
  return '';
}

function downloadRules() {
  syncJumpRules();
  const blob = new Blob([JSON.stringify(currentJumpRules(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = 'global-jump-rules.json'; anchor.click();
  URL.revokeObjectURL(url);
  toast('跳转规则已导出');
}

const today = () => new Date().toISOString().slice(0,10);
const modalShell = (title, subtitle, body, footer = '', wide = false) => `<div class="modal-backdrop" data-action="close-modal"><div class="modal ${wide ? 'modal-wide' : ''}" role="dialog" aria-modal="true"><div class="modal-head"><div><h2 class="modal-title">${title}</h2><p class="modal-subtitle">${subtitle}</p></div><button class="modal-close" data-action="close-modal">${icon('x',18)}</button></div>${body}${footer}</div></div>`;

let seriesDraft = null;
function openSeriesModal(editIndex = null) {
  const item = editIndex === null ? { name:'', description:'', projects:[], enabled:true } : state.seriesItems[editIndex];
  seriesDraft = { editIndex, name:item.name, description:item.description, projects:[...item.projects], enabled:item.enabled };
  renderSeriesModal();
}

function syncSeriesDraft() {
  if (!seriesDraft) return;
  const form = document.querySelector('#series-form'); if (!form) return;
  seriesDraft.name = form.elements.name.value; seriesDraft.description = form.elements.description.value; seriesDraft.enabled = form.elements.enabled.checked;
}

function renderSeriesModal() {
  const candidateNames = [...new Set([...state.projects.map((project) => project.name),...seriesDraft.projects])];
  const candidates = candidateNames.map((name) => state.projects.find((project) => project.name === name) || { name, type:'测评项目', questionItems:[] });
  const available = candidates.filter((project) => !seriesDraft.projects.includes(project.name)).map((project) => `<div class="series-candidate" data-filter-text="${esc(`${project.name} ${project.type}`)}"><div><strong>${esc(project.name)}</strong><small>${esc(project.type)} · ${project.questionItems.length}题</small></div><button type="button" class="btn" data-action="add-series-project" data-name="${esc(project.name)}">添加</button></div>`).join('');
  const selected = seriesDraft.projects.map((name,index) => { const exists=state.projects.some((project) => project.name===name); return `<div class="series-selected"><span class="segment-number">${index+1}</span><div><strong>${esc(name)}</strong><small>${exists?`答题顺序第 ${index+1} 个`:'引用缺失，请移除后重新选择'}</small></div><input type="hidden" name="projects" value="${esc(name)}"><button type="button" class="btn btn-icon" data-action="move-series-project" data-direction="up" data-index="${index}" aria-label="上移系列项目">↑</button><button type="button" class="btn btn-icon" data-action="move-series-project" data-direction="down" data-index="${index}" aria-label="下移系列项目">↓</button><button type="button" class="btn btn-icon btn-ghost btn-danger" data-action="remove-series-project" data-index="${index}" aria-label="移除系列项目">${icon('trash',16)}</button></div>`; }).join('');
  document.querySelector('#overlay-root').innerHTML = modalShell(seriesDraft.editIndex === null ? '新建系列测评' : '编辑系列测评','组合多个测评项目为系列测评，并设置答题顺序',`<form id="series-form" data-edit-index="${seriesDraft.editIndex ?? ''}"><div class="modal-body"><div class="form-section-title">基本信息</div><label class="field"><span>系列名称 *</span><input class="input" name="name" value="${esc(seriesDraft.name)}" placeholder="如：综合心理健康评估" required></label><label class="field"><span>系列描述</span><textarea class="textarea" name="description" placeholder="简要描述该系列测评的内容和目的">${esc(seriesDraft.description)}</textarea></label><div class="detail-summary"><div><div class="form-section-title">已选项目（${seriesDraft.projects.length}）</div><div class="cell-sub">拖动替代为上下移按钮，顺序即答题顺序</div></div></div><div class="series-selected-list">${selected || '<div class="score-empty compact">尚未添加测评项目</div>'}</div><div class="form-section-title">添加项目</div>${search('搜索项目名称...','series-project-search')}<div class="series-candidate-list">${available || '<div class="score-empty compact">所有项目已添加</div>'}</div><label class="check-row"><input type="checkbox" name="enabled" ${seriesDraft.enabled ? 'checked' : ''}><span>创建后立即启用</span></label></div><div class="modal-foot"><button type="button" class="btn" data-action="close-modal">取消</button><button class="btn btn-primary" type="submit">${icon('save',16)}保存</button></div></form>`,'',true);
}

function openSeriesDetail(index) {
  const item = state.seriesItems[index];
  ensureProjectReport(item); const report=reportDefinition(item.report.key);
  document.querySelector('#overlay-root').innerHTML = modalShell('系列测评详情',item.name,`<div class="modal-body"><div class="detail-grid"><span>启用状态</span><strong>${item.enabled ? '已启用' : '已停用'}</strong><span>上下架状态</span><strong>${item.shelf}</strong><span>题目总数</span><strong>${item.questions} 道</strong><span>系列报告</span><strong>${item.report.enabled?`${esc(report.name)} ${report.version}`:'通用兜底报告'}</strong><span>创建时间</span><strong>${item.date}</strong></div><div class="form-section-title">系列说明</div><p class="detail-copy">${esc(item.description)}</p><div class="form-section-title">包含项目</div><ol class="ordered-list">${item.projects.map((project) => `<li>${esc(project)}</li>`).join('')}</ol></div>`,`<div class="modal-foot"><button class="btn" data-action="close-modal">关闭</button><button class="btn" data-action="series-report-config" data-index="${index}">${icon('eye',16)}报告配置</button><button class="btn btn-primary" data-action="edit-series" data-index="${index}">${icon('pencil',16)}编辑</button></div>`,true);
}

let reportConfigDraft = null;
let reportPreviewContext = null;

function reportConfigTarget() { return reportConfigDraft?.targetType==='series' ? state.seriesItems[reportConfigDraft.targetIndex] : state.projects[reportConfigDraft.targetIndex]; }
function openReportConfig(targetIndex,targetType='project') {
  const target=targetType==='series'?state.seriesItems[targetIndex]:state.projects[targetIndex]; ensureProjectReport(target);
  reportConfigDraft={ targetIndex,targetType,key:target.report.key,enabled:target.report.enabled };
  renderReportConfigModal();
}

function syncReportConfigDraft() {
  const form=document.querySelector('#report-config-form'); if (!form || !reportConfigDraft) return;
  reportConfigDraft.key=form.elements.reportKey.value; reportConfigDraft.enabled=form.elements.enabled.checked;
}

function reportDefinitionCard(key) {
  const report=reportDefinition(key);
  return `<div class="report-definition-card"><div><span class="badge badge-blue">${esc(report.family)}</span><strong>${esc(report.name)} · ${report.version}</strong><p>${esc(report.description)}</p></div><div><span>组件标识</span><code>${esc(report.key)}</code><span>数据要求</span><code>${esc(report.required)}</code></div></div>`;
}

function renderReportConfigModal() {
  const target=reportConfigTarget(); const isSeries=reportConfigDraft.targetType==='series'; const hasRealResult=state.resultItems.some((item) => item.test===target.name&&item.status==='已完成');
  const activeKey=reportConfigDraft.enabled ? reportConfigDraft.key : 'generic-v1';
  const definition=reportDefinition(activeKey);
  // 用真实结果优先，没有就用 sample
  const sampleAnswer=state.resultItems.find((item) => item.test===target.name&&item.status==='已完成') || { name:'示例学员', test:target.name, rawScore:75, normalizedScore:75, scoreScale:100, level:'中等风险', dimensionScores:[['维度一',68],['维度二',75],['维度三',82]], riskTags:['轻度风险'], recommendations:['保持当前节奏','两周后复测'] };
  const previewData=buildReportData(sampleAnswer, target);
  const previewHtml=renderRegisteredReport(activeKey, previewData);
  const left = `<form id="report-config-form" class="report-config-form"><div class="report-code-notice"><strong>${isSeries?'一系列一报告':'一项目一报告'}</strong><span>${isSeries?'该报告在用户完成整个系列后生成，汇总系列内各测评项目的数据；不会覆盖子项目各自的报告。':'该配置作用于整个测评项目。单道题目只提供计分和维度数据，不配置、也不生成独立报告。'}</span></div><label class="field"><span>前端报告组件 *</span><select class="select" name="reportKey" id="report-config-key">${reportRegistry.map((item) => `<option value="${item.key}" ${item.key===reportConfigDraft.key?'selected':''}>${esc(item.name)} · ${item.version} · ${esc(item.family)}</option>`).join('')}</select></label><div id="report-definition-info">${reportDefinitionCard(reportConfigDraft.key)}</div><label class="check-row"><input type="checkbox" name="enabled" ${reportConfigDraft.enabled?'checked':''}><span>启用该${isSeries?'系列':'测评项目'}的专属报告</span></label><div class="preview-advice">关闭后，该${isSeries?'系列':'项目'}的测评结果仍可使用“通用测评报告 v1”兜底展示。</div></form>`;
  const right = `<aside class="report-config-preview"><h4>实时预览 <small>${esc(definition.name)} ${esc(definition.version)} · ${sampleAnswer.name}</small></h4><div class="report-preview coded-report">${previewHtml}</div><div class="cell-sub" style="margin-top:8px">${hasRealResult?'当前展示真实结果预览，下方按钮可切换模拟数据。':'该项目暂无已完成学员结果，当前为模拟数据。'}</div></aside>`;
  const body = `<div class="report-config-layout">${left}${right}</div>`;
  const foot = `<div class="modal-foot"><button type="button" class="btn" data-action="close-modal">取消</button><button type="button" class="btn" data-action="preview-project-report" data-source="sample">${icon('eye',16)}模拟预览</button><button type="button" class="btn" data-action="preview-project-report" data-source="real" ${hasRealResult?'':'disabled'}>${icon('user',16)}真实结果预览</button><button class="btn btn-primary" data-action="save-report-config">保存${isSeries?'系列':'项目'}报告</button></div>`;
  document.querySelector('#overlay-root').innerHTML=modalShell(isSeries?'系列级报告配置':'项目级报告配置', target.name, body, foot, true);
}

function buildReportData(item,project) {
  const score=Number(item?.normalizedScore ?? item?.score); const totalScore=Number.isFinite(score)?score:76;
  const rawScore=Number(item?.rawScore ?? item?.score); const scoreScale=Number(item?.scoreScale || 100);
  const effectiveRawScore=Number.isFinite(rawScore)?rawScore:totalScore;
  const segments=project?.scoring?.segments || defaultSegments(); const matched=segments.find((segment) => effectiveRawScore>=segment.min&&effectiveRawScore<=segment.max) || segments.at(-1);
  const sampleDimensions=[['情绪稳定',71],['压力应对',62],['人际支持',84]];
  const dimensions=item ? (Array.isArray(item.dimensionScores) ? item.dimensionScores : []) : sampleDimensions;
  const level=item?.level || matched?.title || (totalScore>=70?'表现良好':'需关注');
  const description=item?.resultDescription || matched?.description || '该结果由项目评分规则生成。';
  const riskTags=item ? (Array.isArray(item.riskTags)?item.riskTags:[]) : ['轻度压力'];
  const recommendations=item ? (Array.isArray(item.recommendations)?item.recommendations:[]) : ['保持规律作息，并持续关注优势维度。'];
  const extensionData=item?.extensionData || (item ? {} : {careerCodes:['I','A','S']});
  return { participant:item?.name || '模拟用户',id:item?.id || 'DEMO-001',group:item?.group || '模拟群体',project:project?.name || item?.test || '示例测评',completedAt:item?.time || today(),totalScore,rawScore:effectiveRawScore,scoreScale,level,description,dimensions,riskTags,recommendations,matchedTasks:Array.isArray(item?.matchedTasks)?item.matchedTasks:[],extensionData,source:item?'真实测评结果':'模拟数据',dataComplete:!item || dimensions.length>0 };
}

function reportIdentity(data,definition) {
  return `<div class="coded-report-meta"><span>${esc(data.source)}</span><code>${esc(definition.key)}</code></div>`;
}

function renderGenericReport(data,definition) {
  return `${reportIdentity(data,definition)}${reportDataNotice(data)}<div class="report-cover"><span>测评结果报告</span><h2>${esc(data.project)}</h2><p>${esc(data.participant)} · ${esc(data.completedAt)}</p></div><div class="score-hero"><span>综合得分</span><strong>${data.totalScore}</strong><small>/ ${data.scoreScale} · ${esc(data.level)}</small></div><section class="report-section"><h3>维度概览</h3>${data.dimensions.length?data.dimensions.map(([name,value]) => `<div class="dimension-row"><span>${esc(name)}</span><progress value="${value}" max="100"></progress><strong>${value}</strong></div>`).join(''):'<div class="score-empty compact">该结果没有维度得分数据</div>'}</section><div class="preview-advice">${esc(data.description)}</div>`;
}

function reportDataNotice(data) { return data.dataComplete ? '' : '<div class="report-fallback-notice">这条真实结果缺少维度得分，报告仅展示已保存的真实字段，不生成推测数据。</div>'; }

function renderMentalHealthReport(data,definition) {
  const modern=definition.version==='v2';
  return `${reportIdentity(data,definition)}${reportDataNotice(data)}<div class="mental-report-hero ${modern?'modern':''}"><div><span>心理健康测评</span><h2>${esc(data.level)}</h2><p>${esc(data.participant)} · ${esc(data.group)}</p></div><strong>${data.totalScore}<small>/${data.scoreScale}</small></strong></div>${data.riskTags.length?`<div class="risk-preview"><strong>关注提示</strong>${data.riskTags.map((tag) => badge(esc(tag),'yellow')).join('')}</div>`:'<div class="wellness-banner">当前结果未记录需重点关注的风险标签。</div>'}<section class="report-section"><h3>${modern?'核心状态画像':'维度得分'}</h3>${data.dimensions.length?`<div class="mental-dimension-grid">${data.dimensions.map(([name,value]) => `<div><span>${esc(name)}</span><strong>${value}</strong><progress value="${value}" max="100"></progress></div>`).join('')}</div>`:'<div class="score-empty compact">该结果没有维度得分数据</div>'}</section><section class="report-section"><h3>${modern?'下一步行动':'专业建议'}</h3>${data.recommendations.length?data.recommendations.map((text,index) => `<div class="action-step"><span>${index+1}</span><p>${esc(text)}</p></div>`).join(''):'<div class="score-empty compact">该结果没有保存行动建议</div>'}</section>`;
}

function renderCareerReport(data,definition) {
  const codes=Array.isArray(data.extensionData?.careerCodes)?data.extensionData.careerCodes:[];
  return `${reportIdentity(data,definition)}${reportDataNotice(data)}<div class="career-report-hero"><span>职业兴趣画像</span><h2>${esc(data.participant)}的职业兴趣画像</h2><div>${codes.length?codes.map((code) => `<strong>${esc(code)}</strong>`).join(''):'<span>暂无职业类型编码</span>'}</div></div><section class="report-section"><h3>兴趣倾向</h3>${data.dimensions.length?data.dimensions.map(([name,value]) => `<div class="career-row"><span>${esc(name)}</span><strong>${value}%</strong></div>`).join(''):'<div class="score-empty compact">该结果没有兴趣维度数据</div>'}</section>`;
}

function renderAbilityReport(data,definition) {
  const sorted=[...data.dimensions].sort((a,b) => b[1]-a[1]);
  return `${reportIdentity(data,definition)}${reportDataNotice(data)}<div class="ability-report-hero"><div><span>综合能力指数</span><strong>${data.totalScore}</strong></div><p>${sorted.length?`已记录的优势维度为 <b>${esc(sorted[0][0])}</b>。`:'当前结果尚未保存能力维度数据。'}</p></div><section class="report-section"><h3>能力雷达数据</h3>${sorted.length?sorted.map(([name,value],index) => `<div class="ability-bar"><span>${index+1}</span><label>${esc(name)}</label><i style="--value:${value}%"></i><strong>${value}</strong></div>`).join(''):'<div class="score-empty compact">该结果没有能力维度数据</div>'}</section>`;
}

const reportRenderers={ 'generic-v1':renderGenericReport,'mental-health-v1':renderMentalHealthReport,'mental-health-v2':renderMentalHealthReport,'career-profile-v1':renderCareerReport,'ability-radar-v1':renderAbilityReport };
function renderRegisteredReport(key,data) { const definition=reportDefinition(key); return (reportRenderers[definition.key] || renderGenericReport)(data,definition); }

function openProjectReportPreview(source='sample') {
  syncReportConfigDraft(); const project=reportConfigTarget(); const real=source==='real'?state.resultItems.find((item) => item.test===project.name&&item.status==='已完成'):null;
  if (source==='real'&&!real) { toast('当前项目还没有可预览的真实结果'); return; }
  reportPreviewContext={source}; const key=reportConfigDraft.enabled?reportConfigDraft.key:'generic-v1'; const data=buildReportData(real,project); const definition=reportDefinition(key);
  document.querySelector('#overlay-root').innerHTML=modalShell('报告预览',`${project.name} · ${definition.name} ${definition.version}`,`<div class="modal-body report-preview coded-report">${renderRegisteredReport(key,data)}</div>`,`<div class="modal-foot"><button class="btn" data-action="back-report-config">返回配置</button></div>`,true);
}

function openResultDetail(index) {
  const item=state.resultItems[index]; if (!item) { toast('未找到这条测评结果'); return; }
  const project=state.projects.find((projectItem) => projectItem.name===item.test) || state.seriesItems.find((series) => series.name===item.test); const configured=Boolean(project?.report?.enabled); const key=configured?project.report.key:'generic-v1'; const definition=reportDefinition(key); const data=buildReportData(item,project || {name:item.test,scoring:{segments:defaultSegments(),groups:[]}});
  document.querySelector('#overlay-root').innerHTML=modalShell('测评结果详情',`${item.name} · ${item.test}`,`<div class="modal-body report-preview coded-report">${!project?'<div class="report-fallback-notice">该测评未绑定专属前端报告，当前使用通用兜底报告。</div>':''}${renderRegisteredReport(key,data)}</div>`,`<div class="modal-foot"><span class="report-component-label">${esc(definition.name)} ${definition.version}</span><button class="btn" data-action="close-modal">关闭</button><button class="btn btn-primary" data-action="print-result">${icon('download',16)}导出报告</button></div>`,true);
}

function exportResults() {
  const header = ['用户名称','用户ID','测试项目','用户类型','用户群体','得分','完成时间','状态'];
  const visibleIndexes = [...document.querySelectorAll('#result-rows tr[data-result-index]')].filter((row) => !row.hidden).map((row) => Number(row.dataset.resultIndex));
  const source = visibleIndexes.length || document.querySelector('#result-search')?.value || document.querySelector('#result-type')?.value !== '全部类型' || document.querySelector('#result-status')?.value !== '全部状态' ? visibleIndexes.map((index) => state.resultItems[index]) : state.resultItems;
  const rows = source.map((item) => [item.name,item.id,item.test,item.type,item.group,item.score,item.time,item.status]);
  const csv = '\ufeff' + [header,...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"','""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type:'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'assessment-results.csv'; anchor.click(); URL.revokeObjectURL(url);
  toast('测评结果已导出');
}

let planDraft = null;
const planTaskOptions = [
  ['AI情绪管理助手','智能体','基于AI的情绪识别与调节指导'], ['AI学习规划助手','智能体','智能制定个性化学习计划'], ['情商培养AI导师','智能体','AI情商训练与提升'],
  ['心理健康知识讲座','线上课','在线心理健康教育课程'], ['情绪管理技巧培训','线上课','线上情绪调节方法学习'], ['团队协作训练营','线下课','线下团队建设活动'],
  ['户外素质拓展','线下课','户外团队协作与挑战'], ['个人成长工作坊','其他','个人能力提升工作坊'],
];
const legacyPlanAssociationRules = [['焦虑倾向干预规则','ar1','AI情绪管理助手','3'],['抑郁倾向关怀规则','ar2','AI情绪管理助手','2'],['艺术型职业引导规则','ar3','个人成长工作坊','1'],['团队协作能力培养规则','ar4','AI学习规划助手','4']];
const planGroups = [['一年级全体学生','一年级','120人'],['二年级全体学生','二年级','115人'],['三年级1-3班','三年级 · 1班、2班、3班','90人'],['四年级全体学生','四年级','108人'],['五年级全体学生','五年级','105人'],['六年级全体学生','六年级','98人']];
const profileTags = [
  ['焦虑倾向','心理健康','86人'],['抑郁倾向','心理健康','42人'],['情绪波动大','心理健康','73人'],['社交困难','社交能力','65人'],['团队协作能力弱','社交能力','51人'],
  ['学习压力大','学业状况','128人'],['学习动力不足','学业状况','97人'],['注意力不集中','学业状况','112人'],['自信心不足','性格特征','89人'],['完美主义倾向','性格特征','44人'],
];
const planMethodDescriptions = { '直接选择任务':'选择智能体、线上课、线下课等任务，支持多选', '关联测评':'可选择单项测评或系列测评，仅能单选' };

function openPlanModal(editIndex = null) {
  const item = editIndex === null ? { name:'', description:'', method:'直接选择任务', tasks:[], start:'', end:'', groups:[], delivery:'按个人下发', targetMethod:'手动添加' } : state.planItems[editIndex];
  // 兼容老数据：已废弃的 method（选择关联任务规则 / 选择补充测评）回退为"直接选择任务"
  const fallbackMethod = planMethodDescriptions[item.method] ? item.method : '直接选择任务';
  planDraft = { method:fallbackMethod, selections:[...(item.tasks || [])], start:item.start || '', end:item.end || '', groups:[...(item.groups || [])], delivery:item.delivery || '按个人下发', targetMethod:item.targetMethod || '手动添加', profileMode:item.profileMode || '并集', profileCategory:item.profileCategory || '全部类别', profileTags:[...(item.profileTags || [])], taskFilter:'全部' };
  document.querySelector('#overlay-root').innerHTML = modalShell(editIndex === null ? '新建计划' : '编辑计划','创建新的测评计划',`<form id="plan-form" data-edit-index="${editIndex ?? ''}"><div class="modal-body"><label class="field"><span>计划名称 *</span><input class="input" name="name" value="${esc(item.name)}" placeholder="请输入计划名称" required></label><label class="field"><span>计划描述</span><textarea class="textarea" name="description" placeholder="请输入计划描述">${esc(item.description)}</textarea></label><div class="form-section-title">创建方式 *</div><div class="radio-cards plan-methods">${Object.entries(planMethodDescriptions).map(([value,description]) => `<label><input type="radio" name="method" value="${value}" data-plan-method ${planDraft.method === value ? 'checked' : ''}><span><strong>${value}</strong><small>${description}</small></span></label>`).join('')}</div><div id="plan-mode-fields"></div></div><div class="modal-foot"><button type="button" class="btn" data-action="close-modal">取消</button><button class="btn btn-blue" type="submit">${icon('save',16)}保存计划</button></div></form>`,'',true);
  renderPlanModeFields();
}

function planChoice(name,meta,description,inputType='checkbox') {
  return `<label class="choice-card plan-choice" data-filter-text="${esc(`${name} ${meta} ${description || ''}`)}" data-kind="${esc(meta)}"><input type="${inputType}" name="planSelection" value="${esc(name)}" ${planDraft.selections.includes(name) ? 'checked' : ''}><span><strong>${esc(name)}</strong><small>${esc(meta)}${description ? ` · ${esc(description)}` : ''}</small></span></label>`;
}

function missingPlanChoices(knownNames,inputType='checkbox') {
  return planDraft.selections.filter((name) => !knownNames.includes(name)).map((name) => planChoice(name,'已保存内容','',inputType)).join('');
}

function renderPlanModeFields() {
  const container = document.querySelector('#plan-mode-fields'); if (!container || !planDraft) return;
  if (planDraft.method === '关联测评') {
    const choices = assessmentChoices(false);
    container.innerHTML = `<section class="plan-mode-section"><div class="form-section-title">测评内容 *</div><p class="cell-sub">${planMethodDescriptions[planDraft.method]}</p>${search('搜索测评名称...','plan-content-search')}<div class="filter-chips"><button type="button" class="active" data-action="plan-content-filter" data-filter="全部">全部</button><button type="button" data-action="plan-content-filter" data-filter="单项测评">单项测评</button><button type="button" data-action="plan-content-filter" data-filter="系列测评">系列测评</button></div><div class="choice-grid plan-choice-list">${choices.map(([name,type,meta]) => planChoice(name,type,meta,'radio')).join('')}${missingPlanChoices(choices.map(([name]) => name),'radio')}</div>${renderPlanDeliveryFields()}</section>`; return;
  }
  container.innerHTML = `<section class="plan-mode-section"><div class="form-section-title">任务选择 *</div><p class="cell-sub">选择智能体、线上课、线下课等任务，支持多选</p>${search('搜索任务名称或描述...','plan-content-search')}<div class="filter-chips"><span>任务类型：</span>${['全部','智能体','线上课','线下课','其他'].map((kind) => `<button type="button" class="${planDraft.taskFilter === kind ? 'active' : ''}" data-action="plan-content-filter" data-filter="${kind}">${kind}</button>`).join('')}</div><div class="choice-grid compact-choices plan-choice-list">${planTaskOptions.map(([name,type,description]) => planChoice(name,type,description)).join('')}${missingPlanChoices(planTaskOptions.map(([name]) => name))}</div>${renderPlanDeliveryFields()}</section>`;
}

function renderPlanDeliveryFields() {
  return `<div class="form-section-title">执行范围</div><div class="form-grid plan-schedule"><label class="field"><span>开始时间</span><input class="input" type="date" name="start" value="${planDraft.start}"></label><label class="field"><span>结束时间</span><input class="input" type="date" name="end" value="${planDraft.end}"></label></div><div class="form-section-title">目标人群 *</div><div class="inline-radios"><label><input type="radio" name="targetMethod" value="画像标签" ${planDraft.targetMethod === '画像标签' ? 'checked' : ''}>画像标签</label><label><input type="radio" name="targetMethod" value="手动添加" ${planDraft.targetMethod === '手动添加' ? 'checked' : ''}>手动选择人群</label></div><div id="plan-target-fields">${renderPlanTargetFields()}</div><div class="form-section-title">下发方式</div><div class="inline-radios"><label><input type="radio" name="delivery" value="按个人下发" ${planDraft.delivery === '按个人下发' ? 'checked' : ''}>按个人下发</label><label><input type="radio" name="delivery" value="按家庭下发" ${planDraft.delivery === '按家庭下发' ? 'checked' : ''}>按家庭下发</label></div>`;
}

function renderPlanTargetFields() {
  if (planDraft.targetMethod === '画像标签') return `<div class="target-profile"><div class="inline-radios"><span>标签关系：</span><label><input type="radio" name="profileMode" value="并集" ${planDraft.profileMode === '并集' ? 'checked' : ''}>并集（满足任一标签）</label><label><input type="radio" name="profileMode" value="交集" ${planDraft.profileMode === '交集' ? 'checked' : ''}>交集（满足所有标签）</label></div><div class="form-grid"><label class="field"><span>搜索画像标签</span><input class="input" id="profile-tag-search" placeholder="搜索标签名称..."></label><label class="field"><span>标签类别</span><select class="select" id="profile-tag-category" name="profileCategory">${['全部类别','心理健康','社交能力','学业状况','性格特征'].map((value) => `<option ${planDraft.profileCategory === value ? 'selected' : ''}>${value}</option>`).join('')}</select></label></div><div class="profile-tag-grid">${profileTags.map(([name,category,count]) => `<label class="profile-tag" data-filter-text="${esc(name)}" data-category="${category}"><input type="checkbox" name="profileTags" value="${name}" ${planDraft.profileTags.includes(name) ? 'checked' : ''}><span><strong>${name}</strong><small>${category} · ${count}</small></span></label>`).join('')}</div><div class="cell-sub">已选择 ${planDraft.profileTags.length} 个标签</div></div>`;
  const known=planGroups.map(([name]) => name); const saved=planDraft.groups.filter((name) => !known.includes(name));
  return `${search('搜索群体名称、年级、班级...','plan-group-search')}<div class="choice-grid compact-choices plan-group-list">${planGroups.map(([name,grade,count]) => `<label class="choice-card" data-filter-text="${esc(`${name} ${grade}`)}"><input type="checkbox" name="groups" value="${esc(name)}" ${planDraft.groups.includes(name) ? 'checked' : ''}><span><strong>${esc(name)}</strong><small>${esc(grade)} · ${count}</small></span></label>`).join('')}${saved.map((name) => `<label class="choice-card" data-filter-text="${esc(name)}"><input type="checkbox" name="groups" value="${esc(name)}" checked><span><strong>${esc(name)}</strong><small>已保存人群</small></span></label>`).join('')}</div>`;
}

function syncPlanModeDraft() {
  if (!planDraft) return;
  planDraft.selections = [...document.querySelectorAll('#plan-mode-fields input[name="planSelection"]:checked')].map((input) => input.value);
  const start = document.querySelector('#plan-mode-fields [name="start"]'); const end = document.querySelector('#plan-mode-fields [name="end"]'); if (start) planDraft.start = start.value; if (end) planDraft.end = end.value;
  const groups = [...document.querySelectorAll('#plan-mode-fields input[name="groups"]:checked')].map((input) => input.value); if (document.querySelector('#plan-mode-fields input[name="groups"]')) planDraft.groups = groups;
  const delivery = document.querySelector('#plan-mode-fields input[name="delivery"]:checked'); if (delivery) planDraft.delivery = delivery.value;
  const targetMethod = document.querySelector('#plan-mode-fields input[name="targetMethod"]:checked'); if (targetMethod) planDraft.targetMethod = targetMethod.value;
  const profileMode = document.querySelector('#plan-mode-fields input[name="profileMode"]:checked'); if (profileMode) planDraft.profileMode = profileMode.value;
  const profileCategory = document.querySelector('#profile-tag-category'); if (profileCategory) planDraft.profileCategory = profileCategory.value;
  if (document.querySelector('#plan-mode-fields input[name="profileTags"]')) planDraft.profileTags = [...document.querySelectorAll('#plan-mode-fields input[name="profileTags"]:checked')].map((input) => input.value);
}

function applyPlanContentFilter() {
  const query = document.querySelector('#plan-content-search')?.value.trim().toLowerCase() || '';
  document.querySelectorAll('.plan-choice-list .plan-choice').forEach((item) => {
    const matchesText = item.dataset.filterText.toLowerCase().includes(query);
    const matchesKind = !planDraft.taskFilter || planDraft.taskFilter === '全部' || item.dataset.kind === planDraft.taskFilter;
    item.hidden = !(matchesText && matchesKind);
  });
}

function openPlanDetail(index) {
  const item = state.planItems[index];
  const directDetails = item.method === '直接选择任务' ? `<span>计划时间</span><strong>${item.start || '未设置'} 至 ${item.end || '未设置'}</strong><span>下发方式</span><strong>${item.delivery || '按个人下发'}</strong>` : '';
  const contentTitle = item.method === '关联测评' ? '关联测评' : item.method === '选择关联任务规则' ? '关联规则' : item.method === '选择补充测评' ? '补充测评' : '任务内容';
  const groups = item.method === '直接选择任务' ? `<div class="form-section-title">目标群体</div><div class="stack-tags">${item.groups.map((group) => badge(esc(group))).join('')}</div>` : '';
  const stageItems=item.stageConfig?.stages || item.stages?.map((stage) => ({ name:stage.name,items:stage.tasks || [] })) || [];
  const stages = stageItems.length ? `<div class="form-section-title">关卡配置</div><div class="stage-detail-summary"><span>${esc(stageDivisionLabel(item.stageConfig?.divisionMethod || 'manual-task-assignment'))}</span><span>${esc(stageUnlockSummary(item.stageConfig?.unlockRule || {type:'task-count',value:1}))}</span></div><ol class="ordered-list">${stageItems.map((stage,index) => `<li><strong>${index+1}. ${esc(stage.name)}</strong> · ${stage.items.length} 个内容<br><small>${stage.items.map(esc).join('、') || '暂无内容'}</small></li>`).join('')}</ol>` : '';
  const editButton = item.status === '草稿' ? `<button class="btn btn-blue" data-action="edit-plan" data-index="${index}">${icon('pencil',16)}编辑计划</button>` : '';
  document.querySelector('#overlay-root').innerHTML = modalShell('计划详情',item.name,`<div class="modal-body"><div class="detail-grid"><span>当前状态</span><strong>${item.status}</strong><span>创建方式</span><strong>${item.method}</strong>${directDetails}</div><div class="form-section-title">计划说明</div><p class="detail-copy">${esc(item.description)}</p><div class="form-section-title">${contentTitle}</div><div class="stack-tags">${item.tasks.map((task) => badge(esc(task),'blue')).join('')}</div>${groups}${stages}</div>`,`<div class="modal-foot"><button class="btn" data-action="close-modal">关闭</button>${editButton}</div>`,true);
}

let stageDraft = null;
const stageUnlockRules = [
  ['task-count','完成任务数量','完成指定数量的任务后解锁下一关',2,'需要完成的任务数量','个'],
  ['point-value','完成积分值','累计达到指定积分后解锁下一关',100,'需要达到的积分值','分'],
  ['task-ratio','完成任务占比','完成指定比例的任务后解锁下一关',80,'需要完成的任务占比','%'],
  ['point-ratio','完成积分占比','获得指定比例的积分后解锁下一关',70,'需要获得的积分占比','%'],
  ['question-count','完成题目数量','完成本关指定数量的题目后解锁下一关',10,'需要完成的题目数量','题'],
  ['question-ratio','完成题目占比','完成本关指定比例的题目后解锁下一关',100,'需要完成的题目占比','%'],
];
const stageDivisionLabel = (method) => ({ 'manual-task-assignment':'手动分配任务到关卡','by-question':'按照测评题目划分','by-association-rule':'按照任务关联规则划分','custom':'自定义导入规则' }[method] || '未配置');
function stageUnlockSummary(rule) { const definition=stageUnlockRules.find(([value]) => value===rule.type) || stageUnlockRules[0]; return `${definition[1]}：${rule.value}${definition[5]}`; }
function taskMeta(name) { const option=planTaskOptions.find(([task]) => task===name); return option ? {type:option[1],description:option[2]} : {type:'任务',description:'来自外部任务模块'}; }
function planRuleNames() {
  const derived=state.relationItems.map((item) => `${item.project} · ${item.type}规则`);
  return [...new Set([...derived,...legacyPlanAssociationRules.map(([name]) => name)])];
}
function assessmentQuestionCount(name) {
  const project=state.projects.find((item) => item.name===name); if (project) return project.questionItems.length;
  const series=state.seriesItems.find((item) => item.name===name); if (series) return series.questions;
  return ({'学习能力综合测评':30,'心理健康测评':30,'职业兴趣测评':45,'学习风格测评':25,'职业规划系列测评':105}[name] || 30);
}
function defaultStageMethod(plan) { return plan.method==='关联测评'?'by-question':plan.method==='选择关联任务规则'?'by-association-rule':'manual-task-assignment'; }
function makeEmptyStages(count=3) { return Array.from({length:count},(_,index) => ({name:`关卡 ${index+1}`,items:[]})); }
function normalizeStageConfig(plan) {
  const saved=plan.stageConfig;
  const defaultUnlockType=plan.method==='关联测评'?'question-count':'task-count';
  if (saved?.stages?.length) return {
    divisionMethod:saved.divisionMethod || defaultStageMethod(plan), unlockRule:{type:plan.method==='关联测评'&&['task-count','task-ratio'].includes(saved.unlockRule?.type)?saved.unlockRule.type.replace('task','question'):(saved.unlockRule?.type || defaultUnlockType),value:Number(saved.unlockRule?.value || 2)},
    questionPerStage:Number(saved.questionPerStage || 10), selectedRules:[...(saved.selectedRules || [])], customFileName:saved.customFileName || '',customText:saved.customText || '',
    taskFilter:'全部',taskSearch:'',stages:saved.stages.map((stage) => ({name:stage.name,items:[...(stage.items || stage.tasks || [])]})),
  };
  if (plan.stages?.length) return { divisionMethod:defaultStageMethod(plan),unlockRule:{type:defaultUnlockType,value:2},questionPerStage:10,selectedRules:[],customFileName:'',customText:'',taskFilter:'全部',taskSearch:'',stages:plan.stages.map((stage) => ({name:stage.name,items:[...(stage.tasks || [])]})) };
  const method=defaultStageMethod(plan); const selectedRules=plan.method==='选择关联任务规则'?[...plan.tasks]:[]; const initialStageCount=method==='by-association-rule'?Math.max(1,Math.min(3,selectedRules.length)):method==='manual-task-assignment'?Math.max(1,Math.min(3,plan.tasks.length)):3;
  const draft={divisionMethod:method,unlockRule:{type:defaultUnlockType,value:plan.method==='关联测评'?10:2},questionPerStage:10,selectedRules,customFileName:'',customText:'',taskFilter:'全部',taskSearch:'',stages:makeEmptyStages(initialStageCount)};
  if (method==='by-question') rebuildQuestionStages(draft,plan);
  if (method==='by-association-rule' && draft.selectedRules.length) draft.stages[0].items=[...draft.selectedRules];
  return draft;
}
function rebuildQuestionStages(draft=stageDraft,plan=state.planItems[stageDraft?.planIndex]) {
  const total=assessmentQuestionCount(plan?.tasks?.[0]); const size=Math.max(1,Number(draft.questionPerStage || 10)); const count=Math.max(1,Math.ceil(total/size)); const previous=draft.stages || [];
  draft.stages=Array.from({length:count},(_,index) => { const from=index*size+1; const to=Math.min(total,(index+1)*size); return {name:previous[index]?.name || `关卡 ${index+1}`,items:[`第 ${from}-${to} 题`]}; });
}
function openStageModal(planIndex) {
  const plan=state.planItems[planIndex]; if (!plan || plan.method==='选择补充测评') { toast('补充测评计划无需配置关卡'); return; }
  stageDraft={planIndex,...normalizeStageConfig(plan)}; state.view='stage-config'; render();
}
function syncStageDraft() {
  if (!stageDraft) return;
  document.querySelectorAll('[data-stage-name]').forEach((input) => { const stage=stageDraft.stages[Number(input.dataset.stageIndex)]; if (stage) stage.name=input.value; });
  const unlock=document.querySelector('input[name="stageUnlockRule"]:checked'); if (unlock) stageDraft.unlockRule.type=unlock.value;
  const unlockValue=document.querySelector('#stage-unlock-value'); if (unlockValue) stageDraft.unlockRule.value=Number(unlockValue.value || 0);
  const questionSize=document.querySelector('#stage-question-size'); if (questionSize) stageDraft.questionPerStage=Math.max(1,Number(questionSize.value || 1));
  const customText=document.querySelector('#stage-custom-json'); if (customText) stageDraft.customText=customText.value;
}
function stageEditorCards() {
  return `<div class="stage-editor-list">${stageDraft.stages.map((stage,index) => `<section class="stage-editor-card" data-stage-index="${index}"><div class="stage-editor-head"><span class="stage-index">${index+1}</span><div><strong>关卡 ${index+1}</strong><small>${stage.items.length} 个内容</small></div><button class="btn btn-icon" data-action="move-stage" data-direction="up" data-index="${index}" aria-label="上移关卡">↑</button><button class="btn btn-icon" data-action="move-stage" data-direction="down" data-index="${index}" aria-label="下移关卡">↓</button></div><input class="input" data-stage-name data-stage-index="${index}" value="${esc(stage.name)}" aria-label="关卡${index+1}名称"><div class="stage-item-list">${stage.items.map((item) => `<span>${esc(item)}${stageDraft.divisionMethod==='by-question'?'':`<button data-action="remove-stage-item" data-index="${index}" data-item="${esc(item)}" aria-label="移除${esc(item)}">×</button>`}</span>`).join('') || '<small>暂无内容</small>'}</div></section>`).join('')}</div>`;
}
function stageDirectDivision(plan) {
  const assignments=new Map(); stageDraft.stages.forEach((stage,index) => stage.items.forEach((item) => assignments.set(item,index)));
  const pool=plan.tasks.map((task) => { const meta=taskMeta(task); const assigned=assignments.get(task); return `<div class="stage-pool-item" data-stage-pool data-filter-text="${esc(`${task} ${meta.type} ${meta.description}`)}" data-kind="${esc(meta.type)}"><div><strong>${esc(task)}</strong><small>${esc(meta.type)} · ${esc(meta.description)}</small></div>${assigned===undefined?`<select class="select compact-select" data-stage-task-assignment data-item="${esc(task)}"><option value="">分配</option>${stageDraft.stages.map((stage,index) => `<option value="${index}">${esc(stage.name)}</option>`).join('')}</select>`:`<span class="assigned-label">已分配到关卡 ${assigned+1}</span>`}</div>`; }).join('');
  return `<label class="stage-method-card active"><input type="radio" checked><span><strong>手动分配任务到关卡</strong><small>将计划已选择的任务分配到不同关卡；任务数据来自外部任务模块</small></span></label><div class="stage-count-bar"><span>关卡数量：<strong>${stageDraft.stages.length}</strong></span><div><button class="btn" data-action="add-stage">+ 添加关卡</button><button class="btn" data-action="remove-last-stage" ${stageDraft.stages.length<=1?'disabled':''}>− 删除关卡</button></div></div><div class="stage-manual-grid"><div><div class="form-section-title">任务池（${plan.tasks.filter((task) => !assignments.has(task)).length} 个未分配）</div><input class="input" id="stage-task-search" placeholder="搜索任务名称..."><div class="filter-chips stage-task-filters"><span>类型：</span>${['全部','智能体','线上课','线下课','其他','任务'].map((kind) => `<button class="${stageDraft.taskFilter===kind?'active':''}" data-action="stage-task-filter" data-filter="${kind}">${kind}</button>`).join('')}</div><div class="stage-pool">${pool || '<div class="score-empty compact">计划中暂无任务</div>'}</div></div><div><div class="form-section-title">关卡列表</div>${stageEditorCards()}</div></div>`;
}
function stageAssessmentDivision(plan) {
  const assessment=plan.tasks[0] || ''; const total=assessmentQuestionCount(assessment);
  return `<div class="stage-method-options"><label class="stage-method-card ${stageDraft.divisionMethod==='by-question'?'active':''}"><input type="radio" name="stageDivisionMethod" value="by-question" ${stageDraft.divisionMethod==='by-question'?'checked':''}><span><strong>按照测评题目划分</strong><small>根据测评项目的题目数量自动生成连续关卡</small></span></label>${stageDraft.divisionMethod==='by-question'?`<div class="stage-method-detail"><div class="form-grid"><label class="field"><span>当前测评项目</span><input class="input" value="${esc(assessment || '未选择')}" disabled></label><label class="field"><span>题目总数</span><input class="input" value="${total} 题" disabled></label></div><label class="field"><span>每个关卡包含题目数量</span><input class="input" id="stage-question-size" type="number" min="1" value="${stageDraft.questionPerStage}"></label>${stageEditorCards()}</div>`:''}${stageCustomMethodCard()}</div>`;
}
function stageRelationDivision() {
  const rules=planRuleNames(); const assigned=new Map(); stageDraft.stages.forEach((stage,index) => stage.items.forEach((item) => assigned.set(item,index)));
  return `<div class="stage-method-options"><label class="stage-method-card ${stageDraft.divisionMethod==='by-association-rule'?'active':''}"><input type="radio" name="stageDivisionMethod" value="by-association-rule" ${stageDraft.divisionMethod==='by-association-rule'?'checked':''}><span><strong>按照任务关联规则划分</strong><small>选择关联规则并分组，可以将多个规则组合为一个关卡</small></span></label>${stageDraft.divisionMethod==='by-association-rule'?`<div class="stage-method-detail"><div class="stage-count-bar"><span>选择和分配关联规则</span><button class="btn" data-action="add-stage">+ 添加关卡</button></div><div class="stage-rule-list">${rules.map((rule) => { const selected=stageDraft.selectedRules.includes(rule); return `<div class="stage-rule-item"><label><input type="checkbox" data-stage-rule value="${esc(rule)}" ${selected?'checked':''}><span>${esc(rule)}</span></label>${selected?`<select class="select compact-select" data-stage-rule-assignment data-item="${esc(rule)}"><option value="">选择关卡</option>${stageDraft.stages.map((stage,index) => `<option value="${index}" ${assigned.get(rule)===index?'selected':''}>${esc(stage.name)}</option>`).join('')}</select>`:''}</div>`; }).join('')}</div>${stageEditorCards()}</div>`:''}${stageCustomMethodCard()}</div>`;
}
function stageCustomMethodCard() {
  const active=stageDraft.divisionMethod==='custom';
  return `<label class="stage-method-card ${active?'active':''}"><input type="radio" name="stageDivisionMethod" value="custom" ${active?'checked':''}><span><strong>自定义导入规则</strong><small>上传 JSON、CSV 文件，或粘贴规则结构生成关卡</small></span></label>${active?`<div class="stage-method-detail stage-import"><div class="stage-import-actions"><label class="btn">${icon('download',16)}选择规则文件<input id="stage-rule-file" type="file" accept=".json,.csv,application/json,text/csv" hidden></label><button class="btn" data-action="load-stage-example">加载示例</button><span>${esc(stageDraft.customFileName || '尚未选择文件')}</span></div><textarea class="textarea stage-json" id="stage-custom-json" placeholder='{"stages":[{"name":"基础关","items":["任务A"]}]}'>${esc(stageDraft.customText)}</textarea><button class="btn btn-blue" data-action="import-stage-json">解析并生成关卡</button>${stageDraft.stages.length?stageEditorCards():''}</div>`:''}`;
}
function stageUnlockCards() {
  const allowed=state.planItems[stageDraft.planIndex]?.method==='关联测评'?new Set(['question-count','question-ratio']):new Set(['task-count','point-value','task-ratio','point-ratio']);
  return `<div class="stage-unlock-list">${stageUnlockRules.filter(([value]) => allowed.has(value)).map(([value,label,description,defaultValue,inputLabel,unit]) => { const active=stageDraft.unlockRule.type===value; return `<label class="stage-unlock-card ${active?'active':''}"><div><input type="radio" name="stageUnlockRule" value="${value}" ${active?'checked':''}><span><strong>${label}</strong><small>${description}</small></span></div>${active?`<label class="field"><span>${inputLabel}</span><div class="stage-value-input"><input class="input" id="stage-unlock-value" type="number" min="1" ${unit==='%'?'max="100"':''} value="${stageDraft.unlockRule.value || defaultValue}"><b>${unit}</b></div></label>`:''}</label>`; }).join('')}</div>`;
}

function stageItemCapacity(stage,divisionMethod) {
  if (divisionMethod!=='by-question') return stage.items.length;
  return stage.items.reduce((sum,item) => { const match=String(item).match(/第\s*(\d+)\s*-\s*(\d+)\s*题/); return sum+(match?Math.max(0,Number(match[2])-Number(match[1])+1):0); },0);
}

function stageConfigIssues(plan,config) {
  const issues=[]; const stages=config?.stages || [];
  if (!stages.length) return ['尚未配置关卡'];
  if (stages.some((stage) => !String(stage.name || '').trim())) issues.push('存在未命名的关卡');
  if (stages.some((stage) => !stage.items?.length)) issues.push('每个关卡至少需要包含一个内容');
  const allItems=stages.flatMap((stage) => stage.items || []); const duplicates=allItems.filter((item,index) => allItems.indexOf(item)!==index);
  if (duplicates.length) issues.push(`内容被重复分配：${[...new Set(duplicates)].join('、')}`);
  const required=config.divisionMethod==='manual-task-assignment'?plan.tasks:config.divisionMethod==='by-association-rule'?(config.selectedRules || []):[];
  const missing=required.filter((item) => !allItems.includes(item)); if (missing.length) issues.push(`还有 ${missing.length} 个内容未分配到关卡`);
  const rule=config.unlockRule || {}; const definition=stageUnlockRules.find(([value]) => value===rule.type);
  if (!definition || Number(rule.value)<=0) issues.push('解锁条件数值无效');
  if (String(rule.type).endsWith('ratio') && Number(rule.value)>100) issues.push('解锁比例不能超过 100%');
  if (['task-count','question-count'].includes(rule.type)) {
    const blocked=stages.slice(0,-1).find((stage) => stageItemCapacity(stage,config.divisionMethod)<Number(rule.value));
    if (blocked) issues.push(`“${blocked.name}”最多可完成 ${stageItemCapacity(blocked,config.divisionMethod)} ${rule.type==='question-count'?'题':'个任务'}，无法达到当前解锁条件`);
  }
  return issues;
}

function projectPublishIssues(project) {
  const issues=[]; const questions=project.questionItems || [];
  if (!questions.length) issues.push('至少配置一道题目');
  if (questions.some((question) => !question.content?.trim())) issues.push('存在题目内容为空');
  if (questions.some((question) => ['单选题','多选题'].includes(question.type) && (question.options || []).length<2)) issues.push('选择题至少需要两个有效选项');
  const scoring=project.scoring || {}; const hasScoring=(scoring.segments || []).length||(scoring.groups || []).length||String(scoring.script || '').trim();
  if (questions.some((question) => question.type!=='文本题') && !hasScoring) issues.push('至少配置一种评分方式');
  if (scoring.segments?.some((segment) => Number(segment.min)>Number(segment.max) || !String(segment.title || '').trim())) issues.push('评分分段存在无效范围或空标题');
  if (project.report?.enabled && !reportRegistry.some((report) => report.key===project.report.key)) issues.push('项目绑定的报告组件不存在');
  const count=questions.length;
  if ((project.jumpRules || []).some((rule) => Number(rule.from)<1||Number(rule.to)>count||Number(rule.from)>Number(rule.to)||Number(rule.scoreMin)>Number(rule.scoreMax)||(rule.action!=='finish'&&(!rule.target||Number(rule.target)>count)))) issues.push('整体跳转规则存在越界或无效条件');
  return issues;
}

function seriesPublishIssues(series) {
  const issues=[]; if (!series.enabled) issues.push('系列测评尚未启用'); if (!series.projects.length) issues.push('至少添加一个测评项目');
  if (series.report?.enabled && !reportRegistry.some((report) => report.key===series.report.key)) issues.push('系列绑定的报告组件不存在');
  const sources=series.projects.map((name) => state.projects.find((project) => project.name===name));
  const missing=series.projects.filter((name,index) => !sources[index]); if (missing.length) issues.push(`引用的项目不存在：${missing.join('、')}`);
  const unavailable=sources.filter(Boolean).filter((project) => project.shelf!=='已上架'); if (unavailable.length) issues.push(`项目尚未上架：${unavailable.map((project) => project.name).join('、')}`);
  if (sources.filter(Boolean).reduce((sum,project) => sum+project.questionItems.length,0)<=0) issues.push('系列中没有可作答题目');
  return issues;
}

function planPublishIssues(plan) {
  const issues=[]; if (!plan.name?.trim()) issues.push('计划名称不能为空'); if (!plan.tasks?.length) issues.push('至少选择一个计划内容');
  if (!plan.groups?.length) issues.push('至少配置一个目标人群'); if (plan.start&&plan.end&&plan.start>plan.end) issues.push('结束时间不能早于开始时间');
  if (plan.method==='关联测评') {
    const ref=state.projects.find((project) => project.name===plan.tasks[0]) || state.seriesItems.find((series) => series.name===plan.tasks[0]);
    if (!ref) issues.push(`关联的测评内容不存在：${plan.tasks[0] || '未选择'}`); else if (ref.shelf!=='已上架') issues.push(`关联的测评内容尚未上架：${ref.name}`);
  }
  if (plan.method==='选择补充测评') {
    const invalid=plan.tasks.filter((name) => { const project=state.projects.find((item) => item.name===name); return !project||project.type!=='补充测评'||project.shelf!=='已上架'; });
    if (invalid.length) issues.push(`补充测评不存在或尚未上架：${invalid.join('、')}`);
  }
  if (plan.method==='选择关联任务规则') {
    const activeNames=state.relationItems.filter((item) => item.enabled).map((item) => `${item.project} · ${item.type}规则`);
    const invalid=plan.tasks.filter((name) => !activeNames.includes(name)); if (invalid.length) issues.push(`关联规则不存在或已停用：${invalid.join('、')}`);
  }
  if (plan.method!=='选择补充测评') issues.push(...stageConfigIssues(plan,plan.stageConfig || (plan.stages?.length?normalizeStageConfig(plan):null)));
  return [...new Set(issues)];
}

function showReadinessIssues(title,issues) {
  document.querySelector('#overlay-root').innerHTML=modalShell(title,'以下问题处理完成后才能继续',`<div class="modal-body"><div class="readiness-summary">发现 ${issues.length} 个阻塞项</div><ol class="readiness-list">${issues.map((issue) => `<li>${esc(issue)}</li>`).join('')}</ol></div>`,`<div class="modal-foot"><button class="btn btn-primary" data-action="close-modal">我知道了</button></div>`);
}

function projectOfflineIssues(project) {
  const series=state.seriesItems.filter((item) => item.shelf==='已上架'&&item.projects.includes(project.name)).map((item) => item.name);
  const plans=state.planItems.filter((item) => ['已发布','进行中'].includes(item.status)&&item.tasks.includes(project.name)).map((item) => item.name);
  return [...(series.length?[`被已上架系列引用：${series.join('、')}`]:[]),...(plans.length?[`被生效中的计划引用：${plans.join('、')}`]:[])];
}

function seriesOfflineIssues(series) {
  const plans=state.planItems.filter((item) => ['已发布','进行中'].includes(item.status)&&item.tasks.includes(series.name)).map((item) => item.name);
  return plans.length?[`被生效中的计划引用：${plans.join('、')}`]:[];
}
function stagePreviewHTML() {
  const plan = state.planItems[stageDraft?.planIndex];
  if (!stageDraft || !plan) return '<div class="cell-sub">stageDraft 或 plan 不存在</div>';
  // 修复 P2-⑦: 重写预览函数，确保所有阶段节点可见
  const assigned = new Set((stageDraft.stages||[]).flatMap((stage) => stage.items || []));
  const source = stageDraft.divisionMethod==='manual-task-assignment' ? plan.tasks : (stageDraft.divisionMethod==='by-association-rule' ? stageDraft.selectedRules : []);
  const missing = (source||[]).filter((item) => !assigned.has(item));
  const stages = stageDraft.stages || [];
  const summary = `<div class="stage-preview-summary"><span>划分方式</span><strong>${esc(stageDivisionLabel(stageDraft.divisionMethod))}</strong><span>解锁规则</span><strong>${esc(stageUnlockSummary(stageDraft.unlockRule))}</strong></div>`;
  const warning = missing.length ? `<div class="stage-warning">⚠ 还有 ${missing.length} 个内容未分配到关卡：${missing.map(esc).join('、')}</div>` : '';
  // 每个关卡用清晰的卡片展示，背景白色边线统一
  const flow = stages.length ? `<div class="stage-preview-list">${stages.map((stage,index) => `
    <div class="stage-preview-card">
      <div class="stage-preview-card-head">
        <span class="stage-preview-card-tag ${index===0?'tag-first':''}">${index===0?'关卡 '+(index+1)+'（默认解锁）':'关卡 '+(index+1)}</span>
      </div>
      <div class="stage-preview-card-name">${esc(stage.name || `关卡 ${index+1}`)}</div>
      <div class="stage-preview-card-body">
        ${stage.items.length ? stage.items.map((item) => `<span class="stage-preview-task-chip">${esc(item)}</span>`).join('') : '<span class="stage-preview-empty">（尚未分配任务）</span>'}
      </div>
    </div>
  `).join('')}</div>` : '<div class="score-empty compact">尚未生成关卡</div>';
  return summary + warning + flow;
}
function stageConfig() {
  if (!stageDraft || !state.planItems[stageDraft.planIndex]) { state.view='plans'; return plans(); }
  const plan=state.planItems[stageDraft.planIndex]; const division=plan.method==='直接选择任务'?stageDirectDivision(plan):plan.method==='关联测评'?stageAssessmentDivision(plan):stageRelationDivision(plan);
  return `${breadcrumb('计划列表','关卡配置','stage-back')}<div class="stage-page-head"><div><h1 class="page-title">配置关卡</h1><p class="page-subtitle">${esc(plan.name)} · ${esc(plan.method)}</p></div><button class="btn btn-blue" data-action="save-stages">${icon('save',16)}保存配置</button></div><div class="stage-config-layout"><div class="stage-config-main"><section class="stage-config-section"><h2>1. 划分方式</h2><p>根据计划创建方式配置关卡内容</p>${division}</section><section class="stage-config-section"><h2>2. 解锁规则</h2><p>任务完成数据由外部执行模块提供，这里只定义下一关的判断条件</p>${stageUnlockCards()}</section></div><aside class="stage-config-aside"><section><h2>配置预览</h2><p>根据当前配置生成的关卡结构</p><div id="stage-preview">${stagePreviewHTML()}</div></section><section class="stage-help"><strong>配置说明</strong><p>• 第一关默认解锁，其他关卡依次判断</p><p>• 关卡按顺序解锁，不允许跳关</p><p>• 人群标签和任务完成数据来自其他模块</p><p>• 保存后仍可在计划发布前继续调整</p></section></aside></div>`;
}
function parseStageImport(text,fileName='自定义规则') {
  let stages=[];
  if (fileName.toLowerCase().endsWith('.csv')) {
    const groups=new Map(); text.trim().split(/\r?\n/).slice(1).forEach((line) => { const [name,item]=line.split(',').map((value) => value?.trim()); if (name&&item) groups.set(name,[...(groups.get(name)||[]),item]); });
    stages=[...groups].map(([name,items]) => ({name,items}));
  } else {
    const parsed=JSON.parse(text); const source=Array.isArray(parsed)?parsed:parsed.stages;
    if (!Array.isArray(source)) throw new Error('JSON 中需要包含 stages 数组');
    stages=source.map((stage,index) => ({name:String(stage.name || `关卡 ${index+1}`),items:[...(stage.items || stage.tasks || stage.rules || [])].map(String)}));
  }
  if (!stages.length || stages.some((stage) => !stage.items.length)) throw new Error('每个关卡都必须包含至少一个内容');
  stageDraft.stages=stages; stageDraft.customText=text; stageDraft.customFileName=fileName;
}
function updateStagePreview() { const preview=document.querySelector('#stage-preview'); if (preview) preview.innerHTML=stagePreviewHTML(); }
function applyStageTaskFilter() {
  const query=document.querySelector('#stage-task-search')?.value.trim().toLowerCase() || '';
  document.querySelectorAll('[data-stage-pool]').forEach((item) => { const text=item.dataset.filterText.toLowerCase(); const kind=item.dataset.kind; item.hidden=!text.includes(query) || (stageDraft.taskFilter!=='全部'&&kind!==stageDraft.taskFilter); });
}

let relationPickerSnapshot = [];
let relationDraft = null;
const fallbackRelationQuestions = {
  q1: { label:'第1题：您最近是否感到焦虑不安？', options:['A. 完全没有','B. 偶尔有','C. 经常有','D. 总是如此'] },
  q2: { label:'第2题：您的睡眠质量如何？', options:['A. 非常好','B. 较好','C. 一般','D. 很差'] },
  q3: { label:'第3题：您是否感到情绪低落？', options:['A. 从不','B. 偶尔','C. 经常','D. 总是'] },
  q4: { label:'第4题：您的压力水平如何？', options:['A. 很低','B. 较低','C. 较高','D. 很高'] },
  q5: { label:'第5题：您是否对日常活动失去兴趣？', options:['A. 完全没有','B. 偶尔','C. 经常','D. 总是如此'] },
};

function relationQuestionsFor(projectName = relationDraft?.project) {
  const project = state.projects.find((item) => item.name === projectName);
  if (!project?.questionItems?.length) return fallbackRelationQuestions;
  return Object.fromEntries(project.questionItems.filter((question) => question.type !== '文本题').map((question,index) => {
    let options = question.options.map((option) => option.content);
    if (question.type === '量表题') options = Array.from({ length:Math.max(0,Number(question.scale.max) - Number(question.scale.min) + 1) },(_,offset) => String(Number(question.scale.min) + offset));
    return [`q${index + 1}`,{ label:`第${index + 1}题：${question.content}`, options }];
  }));
}
function relationDimensionsFor(projectName = relationDraft?.project) {
  const project = state.projects.find((item) => item.name === projectName);
  const configured = (project?.scoring?.groups || []).filter((group) => group.enabled && String(group.name || '').trim()).map((group) => group.name.trim());
  const existing = relationDraft?.conditions?.map((condition) => condition.dimension).filter(Boolean) || [];
  return [...new Set([...configured,...existing])];
}
const relationScriptTemplate = [
  { type:'score_range', dimension:'焦虑维度', minScore:60, maxScore:80, tasks:[{id:'t1',name:'放松训练课程'},{id:'t2',name:'正念冥想练习'}], description:'焦虑维度60-80分时关联放松任务' },
  { type:'dimension', dimension:'抑郁维度', minScore:70, tasks:[{id:'t3',name:'情绪管理课程'}], description:'抑郁维度≥70分时关联情绪管理任务' },
  { type:'option', questionContent:'您的职业兴趣类型是？', optionContent:'艺术型', tasks:[{id:'t5',name:'艺术创作工作坊'},{id:'t6',name:'美学欣赏课程'}], description:'选择艺术型时关联艺术相关任务' },
];

function initialRelationConditions(item,type) {
  if (item.conditions?.length) return item.conditions.map((condition) => type === '维度得分' && !condition.dimension ? { dimension:String(item.trigger || '').split('得分')[0].trim() || `历史题目范围 ${condition.from || 1}–${condition.to || 1}`,min:condition.min,max:condition.max } : ({ ...condition }));
  const numbers = String(item.trigger || '').match(/\d+/g)?.map(Number) || [];
  if (type === '总分区间' && numbers.length >= 2) return [{ min:numbers[0], max:numbers[1] }];
  if (type === '维度得分' && numbers.length >= 2) return [{ dimension:String(item.trigger || '').split('得分')[0].trim() || '历史维度', min:numbers.at(-2), max:numbers.at(-1) }];
  if (type === '维度得分' && numbers.length === 1) return [{ dimension:String(item.trigger || '').split('得分')[0].trim() || '历史维度', min:numbers[0], max:100 }];
  if (type === '选项匹配' && item.trigger) return [{ question:'q1', option:item.trigger }];
  return [];
}

function openRelationModal(editIndex = null) {
  // 方案①：从项目/系列详情进入时，project 字段被 context 锁定
  const ctx = state.projectRelationContext;
  const lockedProject = ctx?.targetName || '';
  const isSeriesContext = !!ctx?.isSeries;
  const item = editIndex === null ? { project: lockedProject, type:'总分区间', trigger:'', tasks:[], enabled:true } : state.relationItems[editIndex];
  const type = item.type === '分数区间' ? '总分区间' : item.type;
  relationDraft = { project:item.project, type, conditions:initialRelationConditions(item,type), pendingQuestion:'', script:item.script || (type === '脚本导入' ? JSON.stringify(relationScriptTemplate,null,2) : ''), logic:item.logic || 'ALL', priority:Number(item.priority ?? 100), locked: !!lockedProject };
  const taskOptions = [
    ['放松训练课程','专业课'], ['正念冥想练习','AI练'], ['情绪管理课程','专业课'], ['认知行为练习','知行合一'],
    ['艺术创作工作坊','线下课'], ['美学欣赏课程','陪学营'], ['社交技能训练','知行合一'], ['压力管理工作坊','个性读'],
    ...item.tasks.filter((task) => !['放松训练课程','正念冥想练习','情绪管理课程','认知行为练习','艺术创作工作坊','美学欣赏课程','社交技能训练','压力管理工作坊'].includes(task)).map((task) => [task,'已关联任务']),
  ];
  const assessmentNames = [...new Set([...assessmentChoices().map(([name]) => name),'学习能力测评','综合心理健康评估系列',item.project].filter(Boolean))];
  const selectedIsSeries = state.seriesItems.some((series) => series.name === item.project) || item.type === '按照测评项目任务关联';
  const relationTypes = ['总分区间','维度得分','选项匹配','按照测评项目任务关联','脚本导入'];
  const typeChoices = relationTypes.map((value) => {
    const allowed = selectedIsSeries ? ['按照测评项目任务关联','脚本导入'].includes(value) : value !== '按照测评项目任务关联';
    return `<label data-relation-type-label="${value}" ${allowed ? '' : 'hidden'}><input type="radio" name="type" value="${value}" data-relation-type ${type === value ? 'checked' : ''}>${value}</label>`;
  }).join('');
  // 锁定时把 project 字段改成 readonly 提示框（带"返回"链接到列表）
  const projectField = relationDraft.locked
    ? `<div class="field"><span>测评项目</span><div class="locked-project-field">${icon('lock',14)} <strong>${esc(item.project)}</strong><small>${isSeriesContext?'关联规则归属当前系列':'关联规则归属当前项目'}，保存后仍可在该项目的关联规则列表中查看</small></div><input type="hidden" name="project" value="${esc(item.project)}"></div>`
    : `<label class="field"><span>测评项目 *</span><select class="select" id="relation-form-project" name="project" required><option value="">请选择测评项目</option>${assessmentNames.map((value) => `<option ${item.project === value ? 'selected' : ''}>${esc(value)}</option>`).join('')}</select></label>`;
  const subtitleText = relationDraft.locked
    ? `为「${esc(item.project)}」配置关联规则 —— 此规则仅属于该项目/系列`
    : '配置测评结果与任务的关联规则，支持多种匹配方式';
  document.querySelector('#overlay-root').innerHTML = modalShell(editIndex === null ? '新建关联规则' : '编辑关联规则', subtitleText,`<form id="relation-form" data-edit-index="${editIndex ?? ''}"><div class="modal-body">${projectField}<div class="form-section-title">关联类型 *</div><div class="inline-radios wrap" id="relation-type-options">${typeChoices}</div><div class="relation-type-info">${relationTypeDescription(type)}</div><div id="relation-condition-editor"></div><div class="relation-task-section" id="relation-visual-tasks"><div class="relation-task-head"><div><strong>关联任务</strong><div class="cell-sub">已选择 <span id="relation-task-count">${item.tasks.length}</span> 个任务</div></div><button type="button" class="btn" data-action="open-task-picker">${icon('plus',16)}选择任务</button></div><div id="relation-selected-tasks" class="selected-task-list">${item.tasks.length ? item.tasks.map((task) => `<span class="selected-task-chip">${esc(task)}</span>`).join('') : '<span class="cell-sub">暂未选择关联任务</span>'}</div></div><div class="form-grid"><label class="field"><span>执行优先级</span><input class="input" type="number" name="priority" min="1" max="9999" value="${relationDraft.priority}"><small>数字越小越先执行</small></label><label class="check-row"><input type="checkbox" name="enabled" ${item.enabled ? 'checked' : ''}>保存后启用规则</label></div></div><div class="modal-foot"><button type="button" class="btn" data-action="close-modal">取消</button><button class="btn btn-blue" type="submit">${icon('save',16)}保存规则</button></div><div class="task-picker-backdrop" id="relation-task-picker" hidden><section class="task-picker-panel" aria-label="选择关联任务"><div class="task-picker-head"><div><h3>选择关联任务</h3><p>已选择 <strong id="picker-selected-count">${item.tasks.length}</strong> 个任务</p></div><button type="button" class="modal-close" data-action="cancel-task-picker">${icon('x',18)}</button></div><div class="task-picker-search">${search('搜索任务名称...', 'relation-task-search')}</div><div class="task-picker-list">${taskOptions.map(([name,taskType]) => `<label class="task-option" data-filter-text="${esc(`${name} ${taskType}`)}"><input type="checkbox" name="tasks" value="${esc(name)}" ${item.tasks.includes(name) ? 'checked' : ''}><span><strong>${esc(name)}</strong><small>· ${esc(taskType)}</small></span></label>`).join('')}</div><div class="task-picker-foot"><button type="button" class="btn" data-action="cancel-task-picker">取消</button><button type="button" class="btn btn-blue" data-action="confirm-task-picker">确认选择 (<span id="picker-confirm-count">${item.tasks.length}</span>)</button></div></section></div></form>`,'',true);
  renderRelationConditionEditor();
}

function relationTypeDescription(type) {
  return ({ '总分区间':'根据测评总分区间分配任务，如总分 60–80 分。', '维度得分':'根据评分规则中已启用的真实维度分配任务。', '选项匹配':'根据特定题目的选项答案分配任务，如选择“艺术型倾向”。', '按照测评项目任务关联':'系列自动汇总并应用子项目中已启用的任务关联规则。', '脚本导入':'通过 JSON 脚本批量配置复杂关联规则，关联任务包含在脚本中。' })[type];
}

function relationConditionSummary(condition,type) {
  if (type === '总分区间') return `总分 ${condition.min}–${condition.max} 分`;
  if (type === '维度得分') return `${condition.dimension || '未指定维度'}得分 ${condition.min}–${condition.max} 分`;
  if (type === '选项匹配') return `${relationQuestionsFor()[condition.question]?.label || condition.question} → ${condition.option}`;
  return '';
}

function renderRelationConditionEditor() {
  const container = document.querySelector('#relation-condition-editor');
  if (!container || !relationDraft) return;
  const taskSection = document.querySelector('#relation-visual-tasks');
  taskSection.hidden = ['脚本导入','按照测评项目任务关联'].includes(relationDraft.type);
  const descriptions = document.querySelector('.relation-type-info');
  if (descriptions) descriptions.textContent = relationTypeDescription(relationDraft.type);
  if (relationDraft.type === '按照测评项目任务关联') {
    const series = state.seriesItems.find((item) => item.name === relationDraft.project);
    const applied = series?.projects.map((name) => ({ name, count:state.relationItems.filter((rule) => rule.project === name && rule.enabled).length })) || [];
    const derivedTasks = [...new Set((series?.projects || []).flatMap((name) => state.relationItems.filter((rule) => rule.project === name && rule.enabled).flatMap((rule) => rule.tasks)))];
    container.innerHTML = `<div class="condition-editor"><strong>项目规则自动应用</strong><p class="cell-sub">无需重复选择任务。保存时会自动汇总系列内各项目已启用规则的任务。</p><div class="series-rule-summary">${applied.length ? applied.map((item) => `<div><span>${esc(item.name)}</span><strong>${item.count} 条启用规则</strong></div>`).join('') : '<div class="cell-sub">当前系列没有可用项目</div>'}</div><div class="cell-sub" style="margin-top:10px">将自动关联 ${derivedTasks.length} 个任务${derivedTasks.length ? `：${derivedTasks.map(esc).join('、')}` : '；请先为子项目配置并启用关联规则'}</div></div>`;
    return;
  }
  if (relationDraft.type === '脚本导入') {
    container.innerHTML = `<div class="condition-editor"><div class="condition-editor-head"><div><strong>脚本配置</strong></div><button type="button" class="btn" data-action="load-relation-template">加载模板</button></div><label class="field"><span>规则脚本（JSON格式）</span><textarea class="textarea relation-script-area" id="relation-script" placeholder="粘贴或编辑JSON格式的规则脚本">${esc(relationDraft.script)}</textarea></label><div class="script-actions relation-script-actions"><button type="button" class="btn" data-action="clear-relation-script">清空</button><button type="button" class="btn btn-blue" data-action="validate-relation-script">验证脚本</button></div><div class="script-help"><strong>📘 脚本格式说明</strong><br>• 脚本为 JSON 数组，每个元素代表一条关联规则<br>• type: score_range | dimension | option<br>• tasks: 关联任务数组，每个任务包含 id 和 name<br>• 支持 dimension、minScore、maxScore、questionContent、optionContent 字段</div></div>`;
    return;
  }
  const logic = relationDraft.conditions.length > 1 ? `<label class="field relation-logic"><span>多条件执行逻辑</span><select class="select" id="relation-logic"><option value="ALL" ${relationDraft.logic === 'ALL' ? 'selected' : ''}>全部满足（AND）</option><option value="ANY" ${relationDraft.logic === 'ANY' ? 'selected' : ''}>任一满足（OR）</option></select></label>` : '';
  const list = relationDraft.conditions.length ? `<div class="condition-list">${relationDraft.conditions.map((condition,index) => `<div class="condition-item"><span class="condition-number">${index+1}</span><span>${esc(relationConditionSummary(condition,relationDraft.type))}</span><button type="button" class="btn btn-icon btn-ghost btn-danger" data-action="remove-relation-condition" data-index="${index}">${icon('trash',15)}</button></div>`).join('')}</div>${logic}` : '';
  let fields = '';
  if (relationDraft.type === '总分区间') fields = `<div class="form-grid"><label class="field"><span>最低分 *</span><input class="input" id="condition-min" type="number" placeholder="60"></label><label class="field"><span>最高分 *</span><input class="input" id="condition-max" type="number" placeholder="80"></label></div>`;
  if (relationDraft.type === '维度得分') {
    const dimensions = relationDimensionsFor();
    fields = dimensions.length ? `<div class="form-grid"><label class="field full"><span>评分维度 *</span><select class="select" id="condition-dimension"><option value="">请选择评分维度</option>${dimensions.map((dimension) => `<option>${esc(dimension)}</option>`).join('')}</select></label><label class="field"><span>最低分 *</span><input class="input" id="condition-min" type="number" placeholder="60"></label><label class="field"><span>最高分 *</span><input class="input" id="condition-max" type="number" placeholder="80"></label></div>` : '<div class="stage-warning">当前项目还没有已启用的评分维度。请先到“评分规则 → 题目组合评分”配置维度。</div>';
  }
  if (relationDraft.type === '选项匹配') {
    const selected = relationDraft.pendingQuestion;
    const questions = relationQuestionsFor();
    fields = `<div class="form-grid"><label class="field"><span>选择题目 *</span><select class="select" id="condition-question"><option value="">请选择题目</option>${Object.entries(questions).map(([id,question]) => `<option value="${id}" ${selected === id ? 'selected' : ''}>${esc(question.label)}</option>`).join('')}</select></label><label class="field"><span>选择选项 *</span><select class="select" id="condition-option" ${selected ? '' : 'disabled'}><option value="">请选择选项</option>${selected && questions[selected] ? questions[selected].options.map((option) => `<option>${esc(option)}</option>`).join('') : ''}</select></label></div>`;
  }
  const canAdd = relationDraft.type !== '维度得分' || relationDimensionsFor().length;
  container.innerHTML = `<div class="condition-editor"><div class="condition-editor-head"><div><strong>触发条件配置</strong><div class="cell-sub">已添加 ${relationDraft.conditions.length} 个条件</div></div></div>${list}${fields}<button type="button" class="btn condition-add" data-action="add-relation-condition" ${canAdd ? '' : 'disabled'}>${icon('plus',16)}添加条件</button></div>`;
}

function parseAndValidateRelationScript(text) {
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed) || !parsed.length) throw new Error('脚本必须是非空数组');
  parsed.forEach((rule,index) => {
    const label = `第 ${index + 1} 条规则`;
    if (!['score_range','dimension','option'].includes(rule.type)) throw new Error(`${label}的 type 不受支持`);
    if (!Array.isArray(rule.tasks) || !rule.tasks.length) throw new Error(`${label}至少需要一个任务`);
    if (rule.tasks.some((task) => !String(typeof task === 'string' ? task : task?.name || '').trim())) throw new Error(`${label}存在无效任务`);
    if (rule.type === 'score_range' && (!Number.isFinite(Number(rule.minScore)) || !Number.isFinite(Number(rule.maxScore)) || Number(rule.minScore) > Number(rule.maxScore))) throw new Error(`${label}需要有效的总分区间`);
    if (rule.type === 'dimension' && (!String(rule.dimension || '').trim() || !Number.isFinite(Number(rule.minScore)) || (rule.maxScore !== undefined && (!Number.isFinite(Number(rule.maxScore)) || Number(rule.minScore) > Number(rule.maxScore))))) throw new Error(`${label}需要维度名称和有效分数区间`);
    if (rule.type === 'option' && (!String(rule.questionContent || '').trim() || !String(rule.optionContent || '').trim())) throw new Error(`${label}需要题目和选项内容`);
  });
  return parsed;
}

function relationConditionsConflict(left,right) {
  if (left.type !== right.type) return false;
  const pairs=(left.conditions || []).flatMap((a) => (right.conditions || []).map((b) => [a,b]));
  if (left.type === '总分区间') return pairs.some(([a,b]) => Number(a.min) <= Number(b.max) && Number(b.min) <= Number(a.max));
  if (left.type === '维度得分') return pairs.some(([a,b]) => a.dimension === b.dimension && Number(a.min) <= Number(b.max) && Number(b.min) <= Number(a.max));
  if (left.type === '选项匹配') return pairs.some(([a,b]) => a.question === b.question && a.option === b.option);
  return false;
}

function updateRelationTaskSelection() {
  const checked = [...document.querySelectorAll('#relation-task-picker input[name="tasks"]:checked')].map((input) => input.value);
  const count = checked.length;
  const pickerCount = document.querySelector('#picker-selected-count');
  const confirmCount = document.querySelector('#picker-confirm-count');
  const mainCount = document.querySelector('#relation-task-count');
  if (pickerCount) pickerCount.textContent = count;
  if (confirmCount) confirmCount.textContent = count;
  if (mainCount) mainCount.textContent = count;
  const selected = document.querySelector('#relation-selected-tasks');
  if (selected) selected.innerHTML = count ? checked.map((task) => `<span class="selected-task-chip">${esc(task)}</span>`).join('') : '<span class="cell-sub">暂未选择关联任务</span>';
}

function openRelationDetail(index) {
  const item = state.relationItems[index];
  document.querySelector('#overlay-root').innerHTML = modalShell('关联规则详情',item.project,`<div class="modal-body"><div class="detail-grid"><span>关联类型</span><strong>${item.type}</strong><span>规则状态</span><strong>${item.enabled ? '已启用' : '已停用'}</strong><span>执行优先级</span><strong>${Number(item.priority ?? 100)}</strong><span>多条件逻辑</span><strong>${(item.logic || 'ALL') === 'ALL' ? '全部满足（AND）' : '任一满足（OR）'}</strong><span>创建时间</span><strong>${item.date}</strong></div><div class="form-section-title">触发条件</div><div class="condition-box">${esc(item.trigger)}</div><div class="form-section-title">关联任务</div><ol class="ordered-list">${item.tasks.map((task) => `<li>${esc(task)}</li>`).join('')}</ol></div>`,`<div class="modal-foot"><button class="btn" data-action="close-modal">关闭</button><button class="btn btn-blue" data-action="edit-relation" data-index="${index}">${icon('pencil',16)}编辑</button></div>`);
}

function applyRowFilter(prefix) {
  const searchValue = document.querySelector(`#${prefix}-search`)?.value.trim().toLowerCase() || '';
  document.querySelectorAll(`#${prefix}-rows tr[data-filter-text]`).forEach((row) => {
    let visible = row.dataset.filterText.toLowerCase().includes(searchValue);
    if (prefix === 'series') visible &&= document.querySelector('#series-shelf').value === '全部上下架' || row.dataset.shelf === document.querySelector('#series-shelf').value;
    if (prefix === 'result') visible &&= (document.querySelector('#result-type').value === '全部类型' || row.dataset.type === document.querySelector('#result-type').value) && (document.querySelector('#result-status').value === '全部状态' || row.dataset.status === document.querySelector('#result-status').value);
    if (prefix === 'plan') visible &&= document.querySelector('#plan-status').value === '全部状态' || row.dataset.status === document.querySelector('#plan-status').value;
    if (prefix === 'relation') visible &&= document.querySelector('#relation-project').value === '全部测评项目' || row.dataset.project === document.querySelector('#relation-project').value;
    row.hidden = !visible;
  });
}

function applyProjectFilter() {
  const query = document.querySelector('#project-search')?.value.trim().toLowerCase() || '';
  const shelf = document.querySelector('#project-shelf')?.value || '全部上下架';
  document.querySelectorAll('#project-rows tr[data-project-name]').forEach((row) => {
    const matchesText = `${row.dataset.projectName} ${row.dataset.projectType}`.toLowerCase().includes(query);
    row.hidden = !matchesText || (shelf !== '全部上下架' && row.dataset.projectShelf !== shelf);
  });
}

function closeModal() { document.querySelector('#overlay-root').innerHTML = ''; modalDirty = false; suspendedModalHtml = ''; suspendedModalNode=null; }
function toast(message) { const root = document.querySelector('#overlay-root'); root.insertAdjacentHTML('beforeend', `<div class="toast">${esc(message)}</div>`); setTimeout(() => root.querySelector('.toast')?.remove(), 1800); }
let pendingConfirm = null;
function openConfirm(title,message,kind,index,meta = {}) { pendingConfirm={ kind,index,...meta }; document.querySelector('#overlay-root').innerHTML=modalShell(title,message,'',`<div class="modal-foot"><button class="btn" data-action="cancel-confirm">取消</button><button class="btn btn-danger" data-action="confirm-action">确认</button></div>`); }
function requestModalClose() {
  if (!modalDirty && !jumpRulesDirty) { jumpRulesDraft=null; closeModal(); return; }
  const root=document.querySelector('#overlay-root'); suspendedModalNode=root.firstElementChild; suspendedModalHtml='';
  openConfirm('放弃未保存修改','当前配置尚未保存，关闭后修改将丢失。','discard-modal',0,{ discardJump:jumpRulesDirty });
}
function navigateTo(view) {
  if (state.view === 'scoring' && scoringDirty) { openConfirm('放弃评分规则修改','当前评分规则尚未保存，离开后修改将丢失。','discard-scoring',0,{ view }); return; }
  if (state.view === 'course-edit' && courseEditDirty) { openConfirm('放弃课程修改','课程基础配置尚未保存，离开后修改将丢失。','discard-course-edit',0,{ view }); return; }
  scoringDraft=null; scoringDirty=false; scoringDeletedDimensions=[]; state.view=view; state.mobileNavOpen=false; state.accountOpen=false;
  render();
}

function isKnownView(view) {
  return ['courses','videos','articles','product-groups','product-detail','course-edit','course-outline','projects','series','results','plans','relations','questions','scoring','stage-config','project-relations','series-relations'].includes(view);
}

// 兼容老 hash：旧"关联规则配置"菜单的 URL 是 #relations —— 重定向到项目页
function migrateLegacyRelationsHash(hash) {
  if (hash === 'relations') {
    // 用 replaceState 替换 hash，不污染 history
    try { history.replaceState(null, '', '#projects'); } catch (_) {}
    return 'projects';
  }
  return hash;
}

// 启动时从 hash 恢复 view
(function initRoute() {
  let hash = (location.hash || '').replace(/^#/, '').split('&')[0];
  hash = migrateLegacyRelationsHash(hash);
  if (hash && isKnownView(hash)) state.view = hash;
})();

// 监听 hashchange，从 URL 同步到 state.view（支持浏览器前进/后退）
window.addEventListener('hashchange', () => {
  let hash = (location.hash || '').replace(/^#/, '').split('&')[0];
  hash = migrateLegacyRelationsHash(hash);
  if (hash && hash !== state.view && isKnownView(hash)) {
    state.view = hash;
    state.mobileNavOpen = false;
    state.accountOpen = false;
    render();
  }
});
function deleteQuestion(index) {
  const questions = currentQuestions(); questions.splice(index, 1);
  currentProject().scoring.groups.forEach((group) => { group.questionIndexes = group.questionIndexes.filter((questionIndex) => questionIndex !== index).map((questionIndex) => questionIndex > index ? questionIndex - 1 : questionIndex); });
  questions.forEach((question) => { question.branchRules = (question.branchRules || []).map((rule) => ({ ...rule, target:rule.target === index ? '' : rule.target > index ? rule.target - 1 : rule.target })); });
  currentProject().jumpRules.forEach((rule) => { if (rule.target === index + 1) rule.target = ''; else if (rule.target > index + 1) rule.target -= 1; rule.from = Math.min(rule.from,Math.max(1,questions.length)); rule.to = Math.min(rule.to,Math.max(1,questions.length)); });
  state.relationItems.filter((item) => item.project===currentProject().name&&item.type==='选项匹配').forEach((item) => {
    item.conditions=(item.conditions || []).filter((condition) => Number(String(condition.question).replace('q',''))!==index+1).map((condition) => { const order=Number(String(condition.question).replace('q','')); return order>index+1?{...condition,question:`q${order-1}`}:{...condition}; });
    if (!item.conditions.length) { item.enabled=false; item.trigger='引用题目已删除，请重新配置'; }
  });
  currentProject().questions = questions.length;
}
function openAccountSettings() { state.accountOpen=false; document.querySelector('#overlay-root').innerHTML=modalShell('账户设置','修改当前演示管理员信息',`<form id="account-form"><div class="modal-body"><label class="field"><span>显示名称 *</span><input class="input" name="name" value="${esc(state.profile.name)}" required></label><label class="field"><span>邮箱</span><input class="input" type="email" name="email" value="${esc(state.profile.email)}"></label></div><div class="modal-foot"><button type="button" class="btn" data-action="close-modal">取消</button><button class="btn btn-primary" type="submit">保存账户设置</button></div></form>`); }
let lastRenderedView = null;
function render() {
  persistState();
  document.querySelector('#app').innerHTML = layout();
  // 路由：view 改变时同步 hash
  if (state.view !== lastRenderedView) {
    lastRenderedView = state.view;
    const targetHash = `#${state.view}`;
    if (location.hash !== targetHash) {
      try { history.replaceState(null, '', targetHash); } catch (_) {}
    }
  }
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('button,[data-action],[data-view],[data-group],[data-project-tab]');
  if (!button) return;
  if (button.dataset.action === 'toggle-sidebar') { state.sidebarCollapsed = !state.sidebarCollapsed; render(); return; }
  if (button.dataset.action === 'toggle-mobile-nav') { state.mobileNavOpen = !state.mobileNavOpen; render(); return; }
  if (button.dataset.group) { if (state.sidebarCollapsed) { state.sidebarCollapsed=false; state.openGroups.add(button.dataset.group); } else { state.openGroups.has(button.dataset.group) ? state.openGroups.delete(button.dataset.group) : state.openGroups.add(button.dataset.group); } render(); return; }
  if (button.dataset.action === 'goto-page') { state.currentPage[button.dataset.pageKey] = Number(button.dataset.page); render(); return; }
  if (button.dataset.view) { navigateTo(button.dataset.view); return; }
  if (button.dataset.projectTab) { state.projectTab = button.dataset.projectTab; delete state.currentPage['projects']; render(); return; }
  if (button.dataset.scoreTab) { state.scoreTab = button.dataset.scoreTab; render(); return; }
  const action = button.dataset.action;
  if (action === 'account') { state.accountOpen = !state.accountOpen; render(); }
  if (action === 'account-settings') openAccountSettings();
  if (action === 'logout') openConfirm('退出登录','确定退出当前演示账户吗？','logout',0);
  if (action === 'confirm-action') {
    const collections = { 'delete-course':['courseItems','系列课'], 'delete-video':['videoItems','视频'], 'delete-article':['articleItems','图文'], 'delete-series':['seriesItems','系列测评'], 'delete-plan':['planItems','计划'], 'delete-relation':['relationItems','关联规则'] };
    if (collections[pendingConfirm?.kind]) { const [key,label]=collections[pendingConfirm.kind]; const [item]=state[key].splice(pendingConfirm.index,1); closeModal(); render(); toast(`“${item.name || item.project}”${label}已删除`); }
    if (pendingConfirm?.kind === 'logout') { closeModal(); state.accountOpen=false; render(); toast('已退出演示账户'); }
    if (pendingConfirm?.kind === 'terminate-plan') { const item=state.planItems[pendingConfirm.index]; item.status='已终止'; closeModal(); render(); toast(`“${item.name}”已终止`); }
    if (pendingConfirm?.kind === 'delete-question') { deleteQuestion(pendingConfirm.index); closeModal(); render(); toast('题目已删除'); }
    if (pendingConfirm?.kind === 'delete-score-segment') { const { scope,groupIndex,index }=pendingConfirm; const list=scope === 'group' ? currentScoring().groups[groupIndex].segments : currentScoring().segments; list.splice(index,1); markScoringDirty(); closeModal(); render(); }
    if (pendingConfirm?.kind === 'delete-score-group') { const [group]=currentScoring().groups.splice(pendingConfirm.groupIndex,1); scoringDeletedDimensions.push(group.name); markScoringDirty(); closeModal(); render(); toast('评分维度已删除；保存后会停用引用它的关联规则'); }
    if (pendingConfirm?.kind === 'delete-course-chapter') { currentCourse().chapters.splice(pendingConfirm.index,1); touchCourse(); closeModal(); render(); toast('章节已删除'); }
    if (pendingConfirm?.kind === 'delete-product-group') { state.productGroups.splice(pendingConfirm.index,1); closeModal(); render(); toast('商品分组已删除'); }
    if (pendingConfirm?.kind === 'remove-jump-rule') { currentJumpRules().splice(pendingConfirm.index,1); markJumpRulesDirty(); pendingConfirm=null; openJumpRulesModal('visual'); return; }
    if (pendingConfirm?.kind === 'discard-scoring') { const view=pendingConfirm.view; scoringDraft=null; scoringDirty=false; scoringDeletedDimensions=[]; closeModal(); state.view=view; render(); }
    if (pendingConfirm?.kind === 'discard-course-edit') { const view=pendingConfirm.view; courseDraft=null; courseEditDirty=false; closeModal(); state.view=view; render(); }
    if (pendingConfirm?.kind === 'discard-modal') { if (pendingConfirm.discardJump) { jumpRulesDraft=null; jumpRulesDirty=false; } closeModal(); }
    pendingConfirm=null;
  }
  if (action === 'cancel-confirm') { const restoreNode=suspendedModalNode; const restore=suspendedModalHtml; pendingConfirm=null; if (restoreNode) { document.querySelector('#overlay-root').replaceChildren(restoreNode); suspendedModalNode=null; } else if (restore) { document.querySelector('#overlay-root').innerHTML=restore; suspendedModalHtml=''; } else closeModal(); }
  if (action === 'new-project') openProjectModal();
  if (action === 'new-course') openCourseModal();
  if (action === 'new-video') openCourseModal(null,'video');
  if (action === 'new-article') openCourseModal(null,'article');
  if (action === 'course-edit-cancel') navigateTo(courseDraft?.kind==='video'?'videos':courseDraft?.kind==='article'?'articles':'courses');
  if (action === 'scroll-course-section') { document.querySelector(`#${button.dataset.target}`)?.scrollIntoView({behavior:'smooth',block:'start'}); document.querySelectorAll('.course-editor-nav button').forEach((item) => item.classList.toggle('active',item===button)); }
  if (action === 'preview-course-detail') { const detail=document.querySelector('#course-editor-form [name="detail"]')?.value.trim(); document.querySelector('#overlay-root').innerHTML=modalShell('课程详情预览',document.querySelector('#course-editor-form [name="name"]')?.value || '未命名课程',`<div class="modal-body"><div class="course-detail-preview">${detail?esc(detail).replaceAll('\n','<br>'):'<span class="cell-sub">尚未填写课程详情</span>'}</div></div>`,`<div class="modal-foot"><button class="btn" data-action="close-modal">关闭</button></div>`,true); }
  if (action === 'preview-product') { const form=document.querySelector('#course-editor-form'); const name=form?.querySelector('[name="name"]')?.value || '未命名内容'; const description=form?.querySelector('[name="description"]')?.value || '尚未填写简介'; const kind=courseDraft?.kind || 'series'; const body=kind==='video'?`<div class="product-user-preview"><div class="preview-media">${icon('play',28)}<span>${esc(form.querySelector('[name="videoTitle"]')?.value || '尚未配置视频')}</span></div><h3>${esc(name)}</h3><p>${esc(description)}</p><button class="btn btn-primary">${form.querySelector('[name="saleType"]:checked')?.value==='付费'?'立即购买':'立即学习'}</button></div>`:kind==='article'?`<div class="product-user-preview"><h3>${esc(form.querySelector('[name="articleTitle"]')?.value || name)}</h3><p>${esc(description)}</p><div class="course-detail-preview">${esc(form.querySelector('[name="articleBody"]')?.value || '尚未填写图文正文').replaceAll('\n','<br>')}</div></div>`:`<div class="product-user-preview"><h3>${esc(name)}</h3><p>${esc(description)}</p><div class="score-empty compact">系列课目录将在完成基础配置后展示</div></div>`; document.querySelector('#overlay-root').innerHTML=modalShell('用户端预览','模拟未购买用户看到的商品效果',`<div class="modal-body">${body}</div><div class="modal-foot"><button class="btn" data-action="close-modal">关闭预览</button></div>`,'',true); }
  if (action === 'preview-share-config') { const form=document.querySelector('#course-editor-form'); const data=editorSharePreviewData(form,courseDraft?.kind || 'series'); document.querySelector('#overlay-root').innerHTML=modalShell('分享效果预览','当前为草稿预览，正式短链和二维码将在上架后生成',`<div class="modal-body share-draft-preview"><div class="share-poster-preview">${sharePosterSvg(data)}</div><div><strong>${esc(data.shareTitle)}</strong><p>${esc(data.shareDescription)}</p><span class="cell-sub">分享图片：${esc(data.shareImage)}</span></div></div><div class="modal-foot"><button class="btn btn-primary" data-action="close-modal">关闭预览</button></div>`,'',true); }
  if (action === 'share-product') { const kind=button.dataset.kind; const index=Number(button.dataset.index); const data=miniProgramShareData(kind,index); if (!data||data.item.shelf!=='已上架') { toast('商品上架后才能生成小程序分享入口'); return; } shareTarget={kind,index}; shareTab='poster'; renderShareModal(); }
  if (action === 'share-tab') { shareTab=button.dataset.tab; renderShareModal(); }
  if (action === 'copy-share-link') { const data=miniProgramShareData(shareTarget.kind,shareTarget.index); navigator.clipboard?.writeText(data.shortLink).catch(() => {}); toast('小程序短链已复制'); }
  if (action === 'copy-share-text') { const data=miniProgramShareData(shareTarget.kind,shareTarget.index); navigator.clipboard?.writeText(data.text).catch(() => {}); toast('分享文案已复制'); }
  if (action === 'download-share-poster') { const data=miniProgramShareData(shareTarget.kind,shareTarget.index); const svg=document.querySelector('.share-poster'); if (!svg) return; svgToPngBlob(svg).then((blob) => { const url=URL.createObjectURL(blob); const link=document.createElement('a'); link.href=url; link.download=`${data.item.name}-分享海报.png`; link.click(); setTimeout(() => URL.revokeObjectURL(url),0); toast('分享海报已下载'); }).catch(() => toast('海报生成失败，请重试')); }
  if (action === 'copy-share-poster') { const svg=document.querySelector('.share-poster'); if (!svg) return; svgToPngBlob(svg).then(async (blob) => { if (!navigator.clipboard?.write||typeof ClipboardItem==='undefined') throw new Error('unsupported'); await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]); toast('分享海报已复制'); }).catch(() => toast('当前浏览器不支持复制图片，请下载海报')); }
  if (action === 'download-share-qr') { const data=miniProgramShareData(shareTarget.kind,shareTarget.index); const svg=document.querySelector('.mini-qr')?.outerHTML; if (!svg) return; const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'})); const link=document.createElement('a'); link.href=url; link.download=`${data.item.name}-小程序二维码.svg`; link.click(); setTimeout(() => URL.revokeObjectURL(url),0); toast('小程序二维码已下载'); }
  if (action === 'view-product') { productDetailTarget={kind:button.dataset.kind,index:Number(button.dataset.index)}; state.view='product-detail'; render(); }
  if (action === 'product-detail-back') { state.view=productDetailTarget?.kind==='video'?'videos':productDetailTarget?.kind==='article'?'articles':'courses'; render(); }
  if (action === 'edit-detail-product') openCourseModal(productDetailTarget.index,productDetailTarget.kind);
  if (action === 'detail-course-outline') { state.activeCourseIndex=productDetailTarget.index; state.view='course-outline'; render(); }
  if (action === 'new-product-group') openProductGroupModal();
  if (action === 'edit-product-group') openProductGroupModal(Number(button.dataset.index));
  if (action === 'toggle-product-group') { const group=state.productGroups[Number(button.dataset.index)]; group.enabled=!group.enabled; render(); toast(`分组已${group.enabled?'启用':'停用'}`); }
  if (action === 'move-product-group') { const index=Number(button.dataset.index); const target=button.dataset.direction==='up'?index-1:index+1; if (target>=0&&target<state.productGroups.length) { [state.productGroups[index],state.productGroups[target]]=[state.productGroups[target],state.productGroups[index]]; state.productGroups.forEach((group,i) => group.order=i+1); render(); } }
  if (action === 'delete-product-group') { const index=Number(button.dataset.index); const group=state.productGroups[index]; const used=[...state.courseItems,...state.videoItems,...state.articleItems].some((item) => item.productGroup===group.name); if (used) { toast('该分组仍有商品使用，不能删除'); return; } openConfirm('删除商品分组',`确定删除“${group.name}”吗？`,'delete-product-group',index); }
  if (action === 'course-outline') { state.activeCourseIndex=Number(button.dataset.index); state.view='course-outline'; render(); }
  if (action === 'course-back') { state.view='courses'; render(); }
  if (action === 'edit-course') openCourseModal(Number(button.dataset.index));
  if (action === 'edit-video') openCourseModal(Number(button.dataset.index),'video');
  if (action === 'edit-article') openCourseModal(Number(button.dataset.index),'article');
  if (action === 'duplicate-course') { const source=state.courseItems[Number(button.dataset.index)]; const copy=structuredClone(source); copy.id=uid('course'); copy.name=`${source.name}（副本）`; copy.status='草稿'; copy.shelf='已下架'; copy.updated=today(); copy.chapters.forEach((chapter) => { chapter.id=uid('chapter'); chapter.lessons.forEach((lesson) => { lesson.id=uid('lesson'); }); }); state.courseItems.push(copy); render(); toast('课程已复制为草稿'); }
  if (action === 'toggle-course-shelf') { const course=state.courseItems[Number(button.dataset.index)]; if (course.shelf==='已下架') { const issues=courseReadinessIssues(course); if (issues.length) { showReadinessIssues('课程暂不能上架',issues); return; } course.shelf='已上架'; course.status='已发布'; course.shelfMode='立即上架'; } else { course.shelf='已下架'; course.shelfMode='暂不上架'; } course.updated=today(); render(); toast(`“${course.name}”已${course.shelf==='已上架'?'上架':'下架'}`); }
  if (action === 'delete-course') { const index=Number(button.dataset.index); openConfirm('删除课程',`确定删除“${state.courseItems[index].name}”吗？课程目录和小节将一并删除。`,'delete-course',index); }
  if (action === 'duplicate-video') { const source=state.videoItems[Number(button.dataset.index)]; const copy=structuredClone(source); copy.id=uid('video'); copy.video.id=uid('video-content'); copy.name=`${source.name}（副本）`; copy.status='草稿'; copy.shelf='已下架'; copy.updated=today(); state.videoItems.push(copy); render(); toast('视频已复制为草稿'); }
  if (action === 'toggle-video-shelf') { const item=state.videoItems[Number(button.dataset.index)]; if (item.shelf==='已下架') { const issues=videoReadinessIssues(item); if (issues.length) { showReadinessIssues('视频暂不能上架',issues); return; } item.shelf='已上架'; item.status='已发布'; item.shelfMode='立即上架'; } else { item.shelf='已下架'; item.shelfMode='暂不上架'; } item.updated=today(); render(); toast(`“${item.name}”已${item.shelf==='已上架'?'上架':'下架'}`); }
  if (action === 'delete-video') { const index=Number(button.dataset.index); openConfirm('删除视频',`确定删除“${state.videoItems[index].name}”吗？`,'delete-video',index); }
  if (action === 'duplicate-article') { const source=state.articleItems[Number(button.dataset.index)]; const copy=structuredClone(source); copy.id=uid('article'); copy.article.id=uid('article-content'); copy.name=`${source.name}（副本）`; copy.status='草稿'; copy.shelf='已下架'; copy.updated=today(); state.articleItems.push(copy); render(); toast('图文已复制为草稿'); }
  if (action === 'toggle-article-shelf') { const item=state.articleItems[Number(button.dataset.index)]; if (item.shelf==='已下架') { const issues=articleReadinessIssues(item); if (issues.length) { showReadinessIssues('图文暂不能上架',issues); return; } item.shelf='已上架'; item.status='已发布'; item.shelfMode='立即上架'; } else { item.shelf='已下架'; item.shelfMode='暂不上架'; } item.updated=today(); render(); toast(`“${item.name}”已${item.shelf==='已上架'?'上架':'下架'}`); }
  if (action === 'delete-article') { const index=Number(button.dataset.index); openConfirm('删除图文',`确定删除“${state.articleItems[index].name}”吗？`,'delete-article',index); }
  if (action === 'add-course-chapter') openCourseChapterModal();
  if (action === 'edit-course-chapter') openCourseChapterModal(Number(button.dataset.index));
  if (action === 'delete-course-chapter') { const index=Number(button.dataset.index); const chapter=currentCourse().chapters[index]; openConfirm('删除章节和视频',`确定删除“${chapter.name}”及其视频内容吗？`,'delete-course-chapter',index); }
  if (action === 'move-course-chapter') { const list=currentCourse().chapters; const index=Number(button.dataset.index); const target=button.dataset.direction==='up'?index-1:index+1; if (target>=0&&target<list.length) { [list[index],list[target]]=[list[target],list[index]]; touchCourse(); render(); } }
  if (action === 'finish-course-publish') { const course=currentCourse(); const issues=courseReadinessIssues(course); if (issues.length) { showReadinessIssues('系列课暂不能上架',issues); return; } course.shelf='已上架'; course.status='已发布'; course.shelfMode='立即上架'; course.updated=today(); render(); toast('系列课已完成并上架'); }
  if (action === 'report-config') openReportConfig(Number(button.dataset.index),'project');
  if (action === 'series-report-config') openReportConfig(Number(button.dataset.index),'series');
  if (action === 'preview-project-report') openProjectReportPreview(button.dataset.source);
  if (action === 'save-report-config') { syncReportConfigDraft(); const project=reportConfigTarget(); project.report={key:reportConfigDraft.key,enabled:reportConfigDraft.enabled,updatedAt:today()}; closeModal(); render(); toast('报告配置已保存'); }
  if (action === 'back-report-config') renderReportConfigModal();
  if (action === 'move-project') {
    const index = Number(button.dataset.index);
    const type = state.projects[index]?.type;
    const visible = state.projects.map((project,projectIndex) => project.type === type ? projectIndex : -1).filter((projectIndex) => projectIndex >= 0);
    const position = visible.indexOf(index);
    const target = visible[button.dataset.direction === 'up' ? position - 1 : position + 1];
    if (target !== undefined) { [state.projects[index],state.projects[target]] = [state.projects[target],state.projects[index]]; state.projects.forEach((project,projectIndex) => { project.order = projectIndex + 1; }); render(); }
  }
  if (action === 'new-series') openSeriesModal();
  if (action === 'add-series-project') { syncSeriesDraft(); if (!seriesDraft.projects.includes(button.dataset.name)) seriesDraft.projects.push(button.dataset.name); modalDirty=true; renderSeriesModal(); }
  if (action === 'remove-series-project') { syncSeriesDraft(); seriesDraft.projects.splice(Number(button.dataset.index),1); modalDirty=true; renderSeriesModal(); }
  if (action === 'move-series-project') { syncSeriesDraft(); const index=Number(button.dataset.index); const target=button.dataset.direction === 'up' ? index-1 : index+1; if (target>=0 && target<seriesDraft.projects.length) [seriesDraft.projects[index],seriesDraft.projects[target]]=[seriesDraft.projects[target],seriesDraft.projects[index]]; modalDirty=true; renderSeriesModal(); }
  if (action === 'view-series') openSeriesDetail(Number(button.dataset.index));
  if (action === 'edit-series') openSeriesModal(Number(button.dataset.index));
  if (action === 'toggle-series') { const item = state.seriesItems[Number(button.dataset.index)]; if (item.enabled&&item.shelf==='已上架') { showReadinessIssues('暂时不能停用系列测评',['请先下架该系列测评']); return; } item.enabled = !item.enabled; render(); toast(`系列已${item.enabled ? '启用' : '停用'}`); }
  if (action === 'move-series') { const index=Number(button.dataset.index); const target=button.dataset.direction === 'up' ? index-1 : index+1; if (target>=0 && target<state.seriesItems.length) { [state.seriesItems[index],state.seriesItems[target]]=[state.seriesItems[target],state.seriesItems[index]]; render(); } }
  if (action === 'toggle-series-shelf') {
    const item = state.seriesItems[Number(button.dataset.index)];
    if (item.shelf !== '已上架') {
      const issues=seriesPublishIssues(item); if (issues.length) { showReadinessIssues('系列测评暂不能上架',issues); return; }
    } else { const issues=seriesOfflineIssues(item); if (issues.length) { showReadinessIssues('系列测评暂不能下架',issues); return; } }
    item.shelf = item.shelf === '已上架' ? '已下架' : '已上架'; render(); toast(`“${item.name}”已${item.shelf === '已上架' ? '上架' : '下架'}`);
  }
  if (action === 'delete-series') { const item=state.seriesItems[Number(button.dataset.index)]; openConfirm('删除系列测评',`确定删除“${item.name}”吗？`,'delete-series',Number(button.dataset.index)); }
  if (action === 'view-result') openResultDetail(Number(button.dataset.index));
  if (action === 'export-results') exportResults();
  if (action === 'print-result') { window.print(); toast('报告已发送至打印/保存窗口'); }
  if (action === 'new-plan') openPlanModal();
  if (action === 'view-plan') openPlanDetail(Number(button.dataset.index));
  if (action === 'edit-plan') { const index=Number(button.dataset.index); if (state.planItems[index]?.status !== '草稿') { toast('已发布或执行中的计划不可编辑'); return; } openPlanModal(index); }
  if (action === 'configure-stages') openStageModal(Number(button.dataset.index));
  if (action === 'stage-back') { stageDraft=null; state.view='plans'; render(); }
  if (action === 'add-stage') { syncStageDraft(); stageDraft.stages.push({ name:`关卡 ${stageDraft.stages.length+1}`,items:[] }); render(); }
  if (action === 'remove-last-stage') { syncStageDraft(); if (stageDraft.stages.length>1) stageDraft.stages.pop(); render(); }
  if (action === 'remove-stage') { syncStageDraft(); if (stageDraft.stages.length>1) stageDraft.stages.splice(Number(button.dataset.index),1); render(); }
  if (action === 'move-stage') { syncStageDraft(); const index=Number(button.dataset.index); const target=button.dataset.direction === 'up' ? index-1 : index+1; if (target>=0 && target<stageDraft.stages.length) [stageDraft.stages[index],stageDraft.stages[target]]=[stageDraft.stages[target],stageDraft.stages[index]]; render(); }
  if (action === 'remove-stage-item') { syncStageDraft(); const stage=stageDraft.stages[Number(button.dataset.index)]; stage.items=stage.items.filter((item) => item!==button.dataset.item); render(); }
  if (action === 'stage-task-filter') { stageDraft.taskFilter=button.dataset.filter; document.querySelectorAll('[data-action="stage-task-filter"]').forEach((item) => item.classList.toggle('active',item===button)); applyStageTaskFilter(); }
  if (action === 'load-stage-example') { const example=JSON.stringify({stages:[{name:'基础关',items:['任务A','任务B']},{name:'进阶关',items:['任务C']},{name:'实践关',items:['任务D']}]},null,2); parseStageImport(example,'示例规则.json'); render(); }
  if (action === 'import-stage-json') { syncStageDraft(); try { parseStageImport(stageDraft.customText,stageDraft.customFileName || '粘贴规则.json'); render(); toast('规则解析成功'); } catch (error) { toast(`规则解析失败：${error.message}`); } }
  if (action === 'save-stages') {
    syncStageDraft(); const plan=state.planItems[stageDraft.planIndex];
    const issues=stageConfigIssues(plan,stageDraft); if (issues.length) { showReadinessIssues('关卡配置暂不能保存',issues); return; }
    plan.stageConfig={divisionMethod:stageDraft.divisionMethod,unlockRule:{...stageDraft.unlockRule},questionPerStage:stageDraft.questionPerStage,selectedRules:[...stageDraft.selectedRules],customFileName:stageDraft.customFileName,customText:stageDraft.customText,stages:stageDraft.stages.map((stage) => ({name:stage.name.trim(),items:[...stage.items]}))};
    plan.stages=plan.stageConfig.stages.map((stage) => ({name:stage.name,tasks:[...stage.items],unlockDays:0})); stageDraft=null; state.view='plans'; render(); toast('关卡配置已保存');
  }
  if (action === 'plan-content-filter') { planDraft.taskFilter = button.dataset.filter; button.parentElement.querySelectorAll('button').forEach((item) => item.classList.toggle('active',item === button)); applyPlanContentFilter(); }
  if (action === 'publish-plan') { const item = state.planItems[Number(button.dataset.index)]; const issues=planPublishIssues(item); if (issues.length) { showReadinessIssues('计划暂不能发布',issues); return; } item.status = '已发布'; render(); toast('计划已发布'); }
  if (action === 'terminate-plan') { const index=Number(button.dataset.index); const item=state.planItems[index]; openConfirm('终止计划',`终止“${item.name}”后将不能继续下发或编辑，确定继续吗？`,'terminate-plan',index); }
  if (action === 'delete-plan') { const item=state.planItems[Number(button.dataset.index)]; openConfirm('删除计划',`确定删除“${item.name}”吗？`,'delete-plan',Number(button.dataset.index)); }
  if (action === 'new-relation') openRelationModal();
  if (action === 'view-relation') openRelationDetail(Number(button.dataset.index));
  if (action === 'edit-relation') openRelationModal(Number(button.dataset.index));
  if (action === 'simulate-relation') openRelationSimulator(Number(button.dataset.index));
  if (action === 'rerun-simulator') openRelationSimulator(Number(button.dataset.index));
  // 方案①：项目内 / 系列内 关联规则入口
  if (action === 'open-project-relations') { state.projectRelationContext = { targetName: button.dataset.project, isSeries: false }; state.view = 'project-relations'; render(); return; }
  if (action === 'open-series-relations') { state.projectRelationContext = { targetName: button.dataset.project, isSeries: true }; state.view = 'series-relations'; render(); return; }
  if (action === 'back-relation-list') { const isSeries = state.projectRelationContext?.isSeries; state.projectRelationContext = null; state.view = isSeries ? 'series' : 'projects'; render(); return; }
  if (action === 'open-task-picker') { relationPickerSnapshot = [...document.querySelectorAll('#relation-task-picker input[name="tasks"]:checked')].map((input) => input.value); document.querySelector('#relation-task-picker').hidden = false; document.querySelector('#relation-task-search').focus(); }
  if (action === 'cancel-task-picker') { document.querySelectorAll('#relation-task-picker input[name="tasks"]').forEach((input) => { input.checked = relationPickerSnapshot.includes(input.value); }); updateRelationTaskSelection(); document.querySelector('#relation-task-picker').hidden = true; }
  if (action === 'confirm-task-picker') { updateRelationTaskSelection(); document.querySelector('#relation-task-picker').hidden = true; }
  if (action === 'add-relation-condition') {
    if (relationDraft.type === '选项匹配') {
      const question = document.querySelector('#condition-question').value; const option = document.querySelector('#condition-option').value;
      if (!question || !option) { toast('请选择题目和匹配选项'); return; }
      relationDraft.conditions.push({ question, option }); relationDraft.pendingQuestion = '';
    } else {
      const minInput = document.querySelector('#condition-min'); const maxInput = document.querySelector('#condition-max');
      if (minInput.value === '' || maxInput.value === '') { toast('请填写完整的分数区间'); return; }
      const min = Number(minInput.value); const max = Number(maxInput.value); if (min > max) { toast('最低分不能高于最高分'); return; }
      if (relationDraft.type === '维度得分') {
        const dimension = document.querySelector('#condition-dimension')?.value;
        if (!dimension) { toast('请选择评分维度'); return; }
        relationDraft.conditions.push({ dimension,min,max });
      } else relationDraft.conditions.push({ min,max });
    }
    modalDirty=true;
    renderRelationConditionEditor();
  }
  if (action === 'remove-relation-condition') { relationDraft.conditions.splice(Number(button.dataset.index),1); modalDirty=true; renderRelationConditionEditor(); }
  if (action === 'load-relation-template') { relationDraft.script = JSON.stringify(relationScriptTemplate,null,2); modalDirty=true; renderRelationConditionEditor(); toast('示例模板已加载'); }
  if (action === 'clear-relation-script') { relationDraft.script = ''; modalDirty=true; renderRelationConditionEditor(); }
  if (action === 'validate-relation-script') { try { const value = document.querySelector('#relation-script').value; const parsed = parseAndValidateRelationScript(value); relationDraft.script = value; toast(`脚本验证通过，共 ${parsed.length} 条规则`); } catch (error) { toast(`脚本验证失败：${error.message}`); } }
  if (action === 'toggle-relation') { const item = state.relationItems[Number(button.dataset.index)]; item.enabled = !item.enabled; render(); toast(`关联规则已${item.enabled ? '启用' : '停用'}`); }
  if (action === 'delete-relation') { const item=state.relationItems[Number(button.dataset.index)]; openConfirm('删除关联规则',`确定删除“${item.project} · ${item.type}”吗？`,'delete-relation',Number(button.dataset.index)); }
  if (action === 'new-question') openQuestionModal();
  if (action === 'edit-question') openQuestionModal(Number(button.dataset.index));
  if (action === 'question-branch') openQuestionBranchModal(Number(button.dataset.index));
  if (action === 'add-branch-rule') {
    syncBranchDraft();
    const question = currentQuestions()[branchDraft.questionIndex];
    branchDraft.rules.push({ option:question.options?.[0]?.content || '', min:question.scale?.min ?? 0, max:question.scale?.max ?? 0, action:'skip_to', target:'' });
    modalDirty=true; renderQuestionBranchModal();
  }
  if (action === 'remove-branch-rule') { syncBranchDraft(); branchDraft.rules.splice(Number(button.dataset.index),1); modalDirty=true; renderQuestionBranchModal(); }
  if (action === 'save-branch-rules') { syncBranchDraft(); currentQuestions()[branchDraft.questionIndex].branchRules = branchDraft.rules.map((rule) => ({ ...rule })); closeModal(); render(); toast('题目跳转规则已保存'); }
  if (action === 'add-option') { syncQuestionOptions(); questionDraft.options.push({ content: `选项${questionDraft.options.length + 1}`, score: 0 }); modalDirty=true; renderQuestionOptions(); }
  if (action === 'remove-option') { syncQuestionOptions(); if (questionDraft.options.length <= 2) { toast('至少保留两个选项'); return; } questionDraft.options.splice(Number(button.dataset.index), 1); modalDirty=true; renderQuestionOptions(); }
  if (action === 'delete-question') { const index=Number(button.dataset.index); openConfirm('删除题目',`确定删除第 ${index+1} 题吗？相关评分维度和跳转目标会同步调整。`,'delete-question',index); }
  if (action === 'move-question') {
    const questions = currentQuestions(); const index = Number(button.dataset.index); const target = button.dataset.direction === 'up' ? index - 1 : index + 1;
    if (target >= 0 && target < questions.length) {
      [questions[index], questions[target]] = [questions[target], questions[index]];
      const swapIndex = (value) => value === index ? target : value === target ? index : value;
      currentScoring().groups.forEach((group) => { group.questionIndexes = group.questionIndexes.map(swapIndex).sort((a,b) => a-b); });
      questions.forEach((question) => { question.branchRules = (question.branchRules || []).map((rule) => ({ ...rule, target:rule.target === '' ? '' : swapIndex(Number(rule.target)) })); });
      render();
    }
  }
  if (action === 'jump-rules') { jumpRulesDraft=structuredClone(currentProject().jumpRules); jumpRulesDirty=false; openJumpRulesModal('visual'); }
  if (action === 'jump-mode') { if (state.jumpMode === 'visual') syncJumpRules(); openJumpRulesModal(button.dataset.mode); }
  if (action === 'add-rule') { syncJumpRules(); const rules = currentJumpRules(); rules.push({ id: `global-rule-${Date.now()}`, name: `规则 ${rules.length + 1}`, from: 1, to: Math.max(1, currentQuestions().length), scoreMin: 0, scoreMax: 10, action: 'skip_to', target: '', enabled: true }); markJumpRulesDirty(); openJumpRulesModal('visual'); }
  if (action === 'remove-rule') { syncJumpRules(); suspendedModalNode=document.querySelector('#overlay-root').firstElementChild; openConfirm('删除跳转规则',`确定删除规则 ${Number(button.dataset.index)+1} 吗？`,'remove-jump-rule',Number(button.dataset.index)); }
  if (action === 'toggle-rule') { syncJumpRules(); const rule = currentJumpRules()[Number(button.dataset.index)]; rule.enabled = !rule.enabled; markJumpRulesDirty(); openJumpRulesModal('visual'); }
  if (action === 'export-rules') downloadRules();
  if (action === 'import-script') { try { const parsed = JSON.parse(document.querySelector('#jump-script').value); if (!Array.isArray(parsed)) throw new Error('规则必须是数组'); jumpRulesDraft = parsed.map((rule, index) => ({ id: rule.id || `global-rule-${index + 1}`, name: rule.name || `规则 ${index + 1}`, from: rule.from ?? rule.condition?.questionRange?.from ?? 1, to: rule.to ?? rule.condition?.questionRange?.to ?? 1, scoreMin: rule.scoreMin ?? rule.condition?.scoreMin ?? 0, scoreMax: rule.scoreMax ?? rule.condition?.scoreMax ?? 10, action: rule.action || 'skip_to', target: rule.target ?? rule.targetQuestionOrder ?? '', enabled: rule.enabled !== false })); markJumpRulesDirty(); openJumpRulesModal('visual'); toast('脚本导入成功'); } catch (error) { toast(`JSON格式错误：${error.message}`); } }
  if (action === 'save-jump-rules') { if (state.jumpMode === 'visual') syncJumpRules(); const error=validateJumpRules(); if (error) { toast(error); return; } currentProject().jumpRules=structuredClone(currentJumpRules()); jumpRulesDraft=null; jumpRulesDirty=false; closeModal(); persistState(); toast('整体跳转规则已保存'); }
  if (action === 'add-score-segment') {
    const segment = { min:0, max:0, title:'新结果', description:'' };
    if (button.dataset.scope === 'group') currentScoring().groups[Number(button.dataset.groupIndex)].segments.push(segment); else currentScoring().segments.push(segment);
    markScoringDirty(); render();
  }
  if (action === 'delete-score-segment') {
    openConfirm('删除评分分段','删除后该分数区间将不再产生结果，确定继续吗？','delete-score-segment',Number(button.dataset.index),{ scope:button.dataset.scope,groupIndex:Number(button.dataset.groupIndex),index:Number(button.dataset.index) });
  }
  if (action === 'add-score-group') { currentScoring().groups.push({ name:`维度 ${currentScoring().groups.length + 1}`, enabled:true, questionIndexes:[], segments:[] }); markScoringDirty(); render(); }
  if (action === 'delete-score-group') { const groupIndex=Number(button.dataset.groupIndex); openConfirm('删除评分维度',`确定删除“${currentScoring().groups[groupIndex].name}”吗？引用该维度的关联规则需要重新配置。`,'delete-score-group',0,{ groupIndex }); }
  if (action === 'toggle-score-group') { const group = currentScoring().groups[Number(button.dataset.groupIndex)]; group.enabled = !group.enabled; markScoringDirty(); render(); }
  if (action === 'pick-score-questions') openScoreQuestionPicker(Number(button.dataset.groupIndex));
  if (action === 'save-score-questions') { const group = currentScoring().groups[scoreQuestionPickerDraft.groupIndex]; group.questionIndexes = [...document.querySelectorAll('input[name="scoreQuestion"]:checked')].map((input) => Number(input.value)); markScoringDirty(); closeModal(); render(); toast('分组题目已更新'); }
  if (action === 'load-score-script') { currentScoring().script = 'const level = totalScore >= 60 ? "高分" : totalScore >= 30 ? "中等" : "低分";\nreturn { title: level, score: totalScore, answered: answers.length };'; markScoringDirty(); render(); toast('示例脚本已加载'); }
  if (action === 'test-score-script') runScoreScript();
  if (action === 'save-scoring') { if (document.querySelector('#score-script')) currentScoring().script = document.querySelector('#score-script').value; const error = validateScoring(); if (error) { toast(error); return; } currentProject().scoring=structuredClone(currentScoring()); state.relationItems.filter((item) => item.project===currentProject().name&&item.type==='维度得分'&&(item.conditions || []).some((condition) => scoringDeletedDimensions.includes(condition.dimension))).forEach((item) => { item.enabled=false; item.trigger='引用维度已删除，请重新配置'; }); scoringDraft=structuredClone(currentProject().scoring); scoringDirty=false; scoringDeletedDimensions=[]; persistState(); toast('评分规则已保存'); }
  if (action === 'close-modal') { if (event.target === button || button.tagName === 'BUTTON') { if (pendingConfirm) document.querySelector('[data-action="cancel-confirm"]')?.click(); else requestModalClose(); } }
  if (action === 'questions') { scoringDraft=null; scoringDirty=false; scoringDeletedDimensions=[]; state.activeProjectIndex = Number(button.dataset.index); state.view = 'questions'; render(); }
  if (action === 'scoring') { state.activeProjectIndex = Number(button.dataset.index); scoringDraft=structuredClone(currentProject().scoring); scoringDirty=false; scoringDeletedDimensions=[]; state.scoreTab = 'segments'; state.view = 'scoring'; render(); }
  if (action === 'back') navigateTo('projects');
  if (action === 'toast') toast(button.dataset.message || '操作完成');
  if (action === 'toggle-shelf') { const p = state.projects[Number(button.dataset.index)]; if (p.shelf !== '已上架') { const issues=projectPublishIssues(p); if (issues.length) { showReadinessIssues('测评项目暂不能上架',issues); return; } p.shelf='已上架'; p.status='已发布'; } else { const issues=projectOfflineIssues(p); if (issues.length) { showReadinessIssues('测评项目暂不能下架',issues); return; } p.shelf='已下架'; } render(); toast(`“${p.name}”已${p.shelf === '已上架' ? '上架' : '下架'}`); }
});

document.addEventListener('input', (event) => {
  if (event.target.closest('#course-editor-form')) { courseEditDirty=true; const counter=document.querySelector(`[data-count-for="${event.target.name}"]`); if (counter) counter.textContent=`${event.target.value.length}/${event.target.maxLength}`; }
  if (event.target.closest('#overlay-root form') && !event.target.closest('.task-picker-backdrop') && !event.target.matches('input[name="scoreQuestion"]')) modalDirty=true;
  if (event.target.id === 'project-search') applyProjectFilter();
  if (event.target.id === 'course-search') applyCourseFilter();
  if (event.target.id === 'video-search') applyVideoFilter();
  if (event.target.id === 'article-search') applyArticleFilter();
  if (event.target.matches('[data-rule-field]')) {
    syncJumpRules();
    markJumpRulesDirty();
    const card = event.target.closest('.jump-card');
    const rule = currentJumpRules()[Number(card.dataset.ruleIndex)];
    card.querySelector('.rule-preview').textContent = `规则预览：第 ${rule.from}-${rule.to} 题累计分数在 ${rule.scoreMin}-${rule.scoreMax} 之间　→　${rule.action === 'finish' ? '直接结束测评' : rule.target ? `跳转至第 ${rule.target} 题` : '未设置目标题目'}`;
  }
  const filterPrefix = { 'series-search':'series', 'result-search':'result', 'plan-search':'plan', 'relation-search':'relation' }[event.target.id];
  if (filterPrefix) applyRowFilter(filterPrefix);
  if (event.target.id === 'relation-task-search') {
    const query = event.target.value.trim().toLowerCase();
    document.querySelectorAll('.task-picker-list .task-option').forEach((item) => { item.hidden = !item.dataset.filterText.toLowerCase().includes(query); });
  }
  if (event.target.id === 'plan-content-search') applyPlanContentFilter();
  if (event.target.id === 'stage-task-search') applyStageTaskFilter();
  if (event.target.matches('[data-stage-name],#stage-unlock-value')) { syncStageDraft(); updateStagePreview(); }
  if (event.target.id === 'stage-custom-json' && stageDraft) stageDraft.customText=event.target.value;
  if (event.target.id === 'plan-group-search') { const query = event.target.value.trim().toLowerCase(); document.querySelectorAll('.plan-group-list [data-filter-text]').forEach((item) => { item.hidden = !item.dataset.filterText.toLowerCase().includes(query); }); }
  if (event.target.id === 'profile-tag-search') { const query = event.target.value.trim().toLowerCase(); const category = document.querySelector('#profile-tag-category')?.value || '全部类别'; document.querySelectorAll('.profile-tag').forEach((item) => { item.hidden = !item.dataset.filterText.toLowerCase().includes(query) || (category !== '全部类别' && item.dataset.category !== category); }); }
  if (event.target.id === 'relation-script' && relationDraft) relationDraft.script = event.target.value;
  if (event.target.id === 'series-project-search') { const query=event.target.value.trim().toLowerCase(); document.querySelectorAll('.series-candidate').forEach((item) => { item.hidden=!item.dataset.filterText.toLowerCase().includes(query); }); }
  if (event.target.id === 'score-script') { currentScoring().script = event.target.value; markScoringDirty(); }
  if (event.target.matches('[data-score-field]')) {
    const field = event.target;
    if (field.dataset.scoreField === 'groupName') currentScoring().groups[Number(field.dataset.groupIndex)].name = field.value;
    else {
      const list = field.dataset.scope === 'group' ? currentScoring().groups[Number(field.dataset.groupIndex)].segments : currentScoring().segments;
      const segment = list[Number(field.dataset.index)];
      segment[field.dataset.scoreField] = ['min','max'].includes(field.dataset.scoreField) ? Number(field.value || 0) : field.value;
      const card = field.closest('.segment'); if (card) card.querySelector('[data-score-range]').textContent = `${segment.min} - ${segment.max}`;
    }
    markScoringDirty();
  }
});

document.addEventListener('change', (event) => {
  if (event.target.closest('#course-editor-form')) courseEditDirty=true;
  if (event.target.id==='course-cover-file'&&event.target.files?.[0]) { const file=event.target.files[0]; if (file.size>5*1024*1024) { toast('封面图片不能超过 5MB'); event.target.value=''; return; } const cover=document.querySelector('#course-editor-form [name="cover"]'); cover.value=file.name; document.querySelector('#course-cover-preview').innerHTML=`<span>${esc(file.name)}</span>`; courseEditDirty=true; }
  if (event.target.id==='course-share-image-file'&&event.target.files?.[0]) { const file=event.target.files[0]; if (file.size>5*1024*1024) { toast('分享图片不能超过 5MB'); event.target.value=''; return; } document.querySelector('#course-editor-form [name="shareImage"]').value=file.name; courseEditDirty=true; }
  if (event.target.matches('#course-editor-form [name="shareTitleCustom"],#course-editor-form [name="shareDescriptionCustom"],#course-editor-form [name="shareImageCustom"]')) { const target=event.target.name==='shareTitleCustom'?'title':event.target.name==='shareDescriptionCustom'?'description':'image'; document.querySelector(`[data-share-custom="${target}"]`).hidden=!event.target.checked; }
  if (event.target.matches('#course-editor-form [name="saleType"]')) { document.querySelectorAll('[data-sale-panel]').forEach((panel) => { panel.hidden=panel.dataset.salePanel!==event.target.value; }); document.querySelectorAll('[data-preview-setting]').forEach((item) => { item.hidden=event.target.value!=='付费'; if (item.hidden) item.querySelector('input').checked=false; }); }
  if (event.target.matches('#course-editor-form [name="saleEnabled"]')) { document.querySelector('[data-acquisition-settings]').hidden=!event.target.checked; document.querySelectorAll('[data-commerce-only]').forEach((item) => { item.hidden=!event.target.checked; }); }
  if (event.target.matches('#course-editor-form [name="passwordEnabled"]')) document.querySelector('[data-access-code]').hidden=!event.target.checked;
  if (event.target.matches('#course-editor-form [name="validityType"]')) document.querySelector('[data-validity-custom]').hidden=event.target.value!=='自定义';
  if (event.target.matches('#course-editor-form [name="joinDeadlineType"]')) document.querySelector('[data-join-deadline]').hidden=event.target.value!=='自定义';
  if (event.target.matches('#course-editor-form [name="shelfMode"]')) { document.querySelector('[data-scheduled-shelf]').hidden=event.target.value!=='定时上架'; const publish=document.querySelector('[data-publish-submit]'); if (publish&&courseDraft?.kind!=='series') publish.textContent=event.target.value==='定时上架'?'保存并定时上架':'保存并上架'; }
  if (event.target.matches('#course-editor-form [name="scheduledOff"]')) document.querySelector('[data-scheduled-off]').hidden=!event.target.checked;
  if (event.target.closest('#overlay-root form') && !event.target.closest('.task-picker-backdrop') && !event.target.matches('input[name="scoreQuestion"]')) modalDirty=true;
  if (event.target.matches('input[name="stageDivisionMethod"]')) {
    syncStageDraft(); stageDraft.divisionMethod=event.target.value;
    if (stageDraft.divisionMethod==='by-question') rebuildQuestionStages();
    if (stageDraft.divisionMethod==='by-association-rule') { stageDraft.stages=makeEmptyStages(Math.max(2,Math.min(3,stageDraft.selectedRules.length || 2))); stageDraft.selectedRules.forEach((rule,index) => stageDraft.stages[Math.min(index,stageDraft.stages.length-1)].items.push(rule)); }
    render();
  }
  if (event.target.matches('input[name="stageUnlockRule"]')) { const definition=stageUnlockRules.find(([value]) => value===event.target.value); stageDraft.unlockRule={type:event.target.value,value:definition[3]}; render(); }
  if (event.target.id === 'stage-question-size') { syncStageDraft(); rebuildQuestionStages(); render(); }
  if (event.target.matches('[data-stage-task-assignment]')) { syncStageDraft(); const item=event.target.dataset.item; stageDraft.stages.forEach((stage) => { stage.items=stage.items.filter((value) => value!==item); }); if (event.target.value!=='') stageDraft.stages[Number(event.target.value)].items.push(item); render(); }
  if (event.target.matches('[data-stage-rule]')) { syncStageDraft(); const rule=event.target.value; if (event.target.checked) { if (!stageDraft.selectedRules.includes(rule)) stageDraft.selectedRules.push(rule); if (!stageDraft.stages.some((stage) => stage.items.includes(rule))) stageDraft.stages[0]?.items.push(rule); } else { stageDraft.selectedRules=stageDraft.selectedRules.filter((item) => item!==rule); stageDraft.stages.forEach((stage) => { stage.items=stage.items.filter((item) => item!==rule); }); } render(); }
  if (event.target.matches('[data-stage-rule-assignment]')) { syncStageDraft(); const rule=event.target.dataset.item; stageDraft.stages.forEach((stage) => { stage.items=stage.items.filter((item) => item!==rule); }); if (event.target.value!=='') stageDraft.stages[Number(event.target.value)].items.push(rule); render(); }
  if (event.target.id === 'stage-rule-file' && event.target.files?.[0]) { const file=event.target.files[0]; file.text().then((text) => { try { parseStageImport(text,file.name); render(); toast('规则文件导入成功'); } catch (error) { toast(`规则文件解析失败：${error.message}`); } }); }
  if (event.target.id === 'report-config-key') { reportConfigDraft.key=event.target.value; document.querySelector('#report-definition-info').innerHTML=reportDefinitionCard(reportConfigDraft.key); }
  if (event.target.matches('#question-form [name="questionType"]')) { syncQuestionOptions(); renderQuestionOptions(); }
  if (event.target.matches('[data-branch-field]')) { syncBranchDraft(); modalDirty=true; if (event.target.dataset.branchField === 'action') renderQuestionBranchModal(); }
  if (event.target.matches('[data-rule-field]')) {
    if (event.target.dataset.ruleField === 'action') { const target = event.target.closest('.jump-card').querySelector('[data-rule-field="target"]'); target.disabled = event.target.value === 'finish'; if (target.disabled) target.value = ''; }
    event.target.dispatchEvent(new Event('input', { bubbles: true }));
  }
  if (event.target.id === 'project-shelf') applyProjectFilter();
  if (['course-category','course-shelf'].includes(event.target.id)) applyCourseFilter();
  if (['video-category','video-shelf'].includes(event.target.id)) applyVideoFilter();
  if (['article-category','article-shelf'].includes(event.target.id)) applyArticleFilter();
  if (event.target.id === 'series-shelf') applyRowFilter('series');
  if (['result-type','result-status'].includes(event.target.id)) applyRowFilter('result');
  if (event.target.id === 'plan-status') applyRowFilter('plan');
  if (event.target.id === 'report-config-key' || event.target.name === 'enabled') { syncReportConfigDraft(); document.querySelector('.report-config-preview').innerHTML = `<h4>实时预览 <small>${esc(reportDefinition(reportConfigDraft.enabled?reportConfigDraft.key:'generic-v1').name)} ${esc(reportDefinition(reportConfigDraft.enabled?reportConfigDraft.key:'generic-v1').version)}</small></h4><div class="report-preview coded-report">${renderRegisteredReport(reportConfigDraft.enabled?reportConfigDraft.key:'generic-v1', buildReportData(state.resultItems.find((item) => item.test===reportConfigTarget().name&&item.status==='已完成')||{name:'示例学员',test:reportConfigTarget().name,rawScore:75,normalizedScore:75,scoreScale:100,level:'中等风险',dimensionScores:[['维度一',68],['维度二',75],['维度三',82]],riskTags:['轻度风险'],recommendations:['保持当前节奏','两周后复测']}, reportConfigTarget()))}</div>`; }
  if (event.target.id === 'report-config-key') syncReportConfigDraft(), document.querySelector('#report-definition-info').innerHTML = reportDefinitionCard(reportConfigDraft.key);
  if (event.target.id === 'relation-project') applyRowFilter('relation');
  if (event.target.matches('#relation-task-picker input[name="tasks"]')) updateRelationTaskSelection();
  if (event.target.matches('[data-relation-type]')) { if (document.querySelector('#relation-script')) relationDraft.script = document.querySelector('#relation-script').value; relationDraft.type = event.target.value; if (relationDraft.type === '脚本导入' && !relationDraft.script.trim()) relationDraft.script = JSON.stringify(relationScriptTemplate,null,2); relationDraft.conditions = []; relationDraft.pendingQuestion = ''; renderRelationConditionEditor(); }
  if (event.target.id === 'relation-logic') relationDraft.logic=event.target.value;
  if (event.target.id === 'condition-question') { relationDraft.pendingQuestion = event.target.value; renderRelationConditionEditor(); }
  if (event.target.id === 'relation-form-project') {
    relationDraft.project = event.target.value; relationDraft.conditions = []; relationDraft.pendingQuestion = '';
    const isSeries = state.seriesItems.some((series) => series.name === relationDraft.project);
    document.querySelectorAll('[data-relation-type-label]').forEach((label) => { const value=label.dataset.relationTypeLabel; label.hidden = isSeries ? !['按照测评项目任务关联','脚本导入'].includes(value) : value === '按照测评项目任务关联'; });
    relationDraft.type = isSeries ? (['按照测评项目任务关联','脚本导入'].includes(relationDraft.type) ? relationDraft.type : '按照测评项目任务关联') : (relationDraft.type === '按照测评项目任务关联' ? '总分区间' : relationDraft.type);
    const radio=document.querySelector(`[data-relation-type][value="${relationDraft.type}"]`); if (radio) radio.checked=true;
    renderRelationConditionEditor();
  }
  if (event.target.matches('[data-plan-method]')) { syncPlanModeDraft(); planDraft.method = event.target.value; planDraft.selections = []; planDraft.taskFilter = '全部'; renderPlanModeFields(); }
  if (event.target.matches('#plan-mode-fields input[name="targetMethod"]')) { syncPlanModeDraft(); document.querySelector('#plan-target-fields').innerHTML = renderPlanTargetFields(); }
  if (event.target.id === 'profile-tag-category') { syncPlanModeDraft(); document.querySelector('#profile-tag-search')?.dispatchEvent(new Event('input',{ bubbles:true })); }
  if (event.target.matches('#plan-mode-fields input[name="planSelection"],#plan-mode-fields input[name="groups"],#plan-mode-fields input[name="delivery"],#plan-mode-fields input[name="profileTags"],#plan-mode-fields input[name="profileMode"]')) syncPlanModeDraft();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const picker=document.querySelector('#relation-task-picker:not([hidden])');
  if (picker) { picker.querySelector('[data-action="cancel-task-picker"]')?.click(); return; }
  if (pendingConfirm) { document.querySelector('[data-action="cancel-confirm"]')?.click(); return; }
  if (document.querySelector('#overlay-root .modal')) { event.preventDefault(); requestModalClose(); }
});

window.addEventListener('beforeunload',(event) => {
  if (!scoringDirty && !jumpRulesDirty && !modalDirty && !courseEditDirty) return;
  event.preventDefault(); event.returnValue='';
});

document.addEventListener('submit', (event) => {
  if (event.target.id === 'account-form') { event.preventDefault(); const data=new FormData(event.target); state.profile={ name:String(data.get('name')).trim(), email:String(data.get('email')).trim() }; closeModal(); render(); toast('账户设置已保存'); return; }
  if (event.target.id === 'course-editor-form') {
    event.preventDefault(); const data=new FormData(event.target); const intent=event.submitter?.value || (courseDraft?.kind==='series'?'continue':'publish'); const editIndex=event.target.dataset.editIndex; const kind=['video','article'].includes(courseDraft?.kind)?courseDraft.kind:'series'; const collection=kind==='video'?state.videoItems:kind==='article'?state.articleItems:state.courseItems; const existing=editIndex===''?null:collection[Number(editIndex)]; const saleEnabled=data.get('saleEnabled')==='on'; const saleType=String(data.get('saleType')); const requestedShelfMode=String(data.get('shelfMode')); const shelfMode=intent==='publish'&&requestedShelfMode==='暂不上架'?'立即上架':requestedShelfMode;
    if (!String(data.get('name')).trim()) { toast('请先填写内容名称'); return; }
    if (intent!=='draft') {
      if (!String(data.get('cover')).trim()) { toast('请上传或填写内容封面'); return; }
      if (kind==='video'&&(!String(data.get('videoTitle')).trim()||!String(data.get('videoSource')).trim())) { toast('请填写视频名称和视频来源'); return; }
      if (kind==='article'&&(!String(data.get('articleTitle')).trim()||!String(data.get('articleBody')).trim())) { toast('请填写图文标题和图文正文'); return; }
      if (saleEnabled&&saleType==='付费'&&Number(data.get('price'))<=0) { toast('请填写有效的销售价格'); return; }
      if (saleEnabled&&saleType==='指定学员'&&!String(data.get('designatedGroup')).trim()) { toast('请填写指定用户范围'); return; }
      if (saleEnabled&&data.get('passwordEnabled')==='on'&&!String(data.get('accessCode')).trim()) { toast('请设置访问密码'); return; }
      if (data.get('validityType')==='自定义'&&Number(data.get('validityDays'))<1) { toast('请填写有效的课程有效期'); return; }
      if (data.get('joinDeadlineType')==='自定义'&&!data.get('joinDeadline')) { toast('请设置加入截止时间'); return; }
      if (shelfMode==='定时上架'&&!data.get('scheduledShelfAt')) { toast('请设置定时上架时间'); return; }
      if (data.get('scheduledOff')==='on'&&!data.get('scheduledOffAt')) { toast('请设置定时下架时间'); return; }
      if (data.get('scheduledShelfAt')&&new Date(String(data.get('scheduledShelfAt'))).getTime()<=Date.now()) { toast('定时上架时间必须晚于当前时间'); return; }
      if (data.get('scheduledOffAt')&&new Date(String(data.get('scheduledOffAt'))).getTime()<=Date.now()) { toast('定时下架时间必须晚于当前时间'); return; }
      if (data.get('scheduledShelfAt')&&data.get('scheduledOffAt')&&String(data.get('scheduledShelfAt'))>=String(data.get('scheduledOffAt'))) { toast('定时下架时间必须晚于上架时间'); return; }
    }
    const item={ id:existing?.id || uid(kind==='video'?'video':kind==='article'?'article':'course'),name:String(data.get('name')).trim(),category:String(data.get('category')).trim() || '未分类',description:String(data.get('description')).trim() || '',detail:String(data.get('detail')).trim(),cover:String(data.get('cover')).trim(),saleEnabled,saleType,price:String(data.get('price')),passwordEnabled:data.get('passwordEnabled')==='on',accessCode:String(data.get('accessCode')).trim(),designatedGroup:String(data.get('designatedGroup')).trim(),validityType:String(data.get('validityType')),validityDays:Number(data.get('validityDays') || 365),joinDeadlineType:String(data.get('joinDeadlineType')),joinDeadline:String(data.get('joinDeadline')),productGroup:String(data.get('productGroup')),shelfMode,scheduledShelfAt:String(data.get('scheduledShelfAt')),scheduledOff:data.get('scheduledOff')==='on',scheduledOffAt:String(data.get('scheduledOffAt')),pauseSale:data.get('pauseSale')==='on',storeVisible:data.get('storeVisible')==='true',shareSettings:{allowUserShare:data.get('allowUserShare')==='on',titleCustom:data.get('shareTitleCustom')==='on',title:String(data.get('shareTitle') || '').trim(),descriptionCustom:data.get('shareDescriptionCustom')==='on',description:String(data.get('shareDescription') || '').trim(),imageCustom:data.get('shareImageCustom')==='on',image:String(data.get('shareImage') || '').trim()},status:intent==='draft'?'草稿':shelfMode==='定时上架'?'待发布':'已完善',shelf:'已下架',updated:today() };
    if (kind==='video') { const preview=data.get('videoPreview')==='on'; item.video={id:existing?.video?.id || uid('video-content'),title:String(data.get('videoTitle')).trim(),source:String(data.get('videoSource')).trim(),duration:String(data.get('videoDuration')).trim(),required:data.get('videoRequired')==='on',preview,free:preview,type:'视频',completion:'观看完成'}; } else if (kind==='article') { const preview=data.get('articlePreview')==='on'; item.article={id:existing?.article?.id || uid('article-content'),title:String(data.get('articleTitle')).trim(),body:String(data.get('articleBody')).trim(),duration:String(data.get('articleDuration')).trim(),preview,free:preview,type:'图文',completion:'阅读完成'}; } else item.chapters=existing?.chapters || [];
    const readiness=kind==='video'?videoReadinessIssues(item):kind==='article'?articleReadinessIssues(item):courseReadinessIssues(item); if (intent!=='draft'&&shelfMode==='立即上架'&&!readiness.length) { item.shelf='已上架'; item.status='已发布'; }
    if (editIndex==='') collection.push(item); else collection[Number(editIndex)]=item;
    if (kind==='series') state.activeCourseIndex=editIndex===''?collection.length-1:Number(editIndex);
    const pendingPublish=shelfMode==='立即上架'&&item.shelf!=='已上架'; courseEditDirty=false; courseDraft=null; closeModal(); state.view=intent==='draft'?(kind==='video'?'videos':kind==='article'?'articles':'courses'):(kind==='video'?'videos':kind==='article'?'articles':'course-outline'); render(); toast(intent==='draft'?'草稿已保存':kind==='video'?(editIndex===''?'视频创建并上架':'视频修改并上架'):kind==='article'?(editIndex===''?'图文创建并上架':'图文修改并上架'):(pendingPublish?'基础配置已保存，请完善系列课目录后上架':editIndex===''?'系列课创建成功':'系列课修改成功')); return;
  }
  if (event.target.id === 'course-chapter-form') {
    event.preventDefault(); const data=new FormData(event.target); const index=event.target.dataset.index; const name=String(data.get('name')).trim(); const title=String(data.get('title')).trim(); const source=String(data.get('source')).trim();
    if (!name||!title||!source) { toast('请完整填写章节名称、视频名称和视频来源'); return; }
    const existing=index===''?null:currentCourse().chapters[Number(index)];
    const preview=data.get('preview')==='on'; const video={id:existing?.lessons?.[0]?.id || uid('lesson'),title,type:'视频',source,required:data.get('required')==='on',completion:'观看完成',duration:String(data.get('duration')).trim(),preview,free:preview};
    const chapter={id:existing?.id || uid('chapter'),name,lessons:[video]};
    if (index==='') currentCourse().chapters.push(chapter); else currentCourse().chapters[Number(index)]=chapter;
    touchCourse(); closeModal(); render(); toast(index===''?'章节和视频创建成功':'章节和视频修改成功'); return;
  }
  if (event.target.id === 'product-group-form') {
    event.preventDefault(); const data=new FormData(event.target); const index=event.target.dataset.index; const name=String(data.get('name')).trim(); if (!name) { toast('请输入分组名称'); return; }
    if (state.productGroups.some((group,i) => group.name===name&&(index===''||i!==Number(index)))) { toast('分组名称不能重复'); return; }
    if (index==='') state.productGroups.push({id:uid('group'),name,enabled:data.get('enabled')==='on',order:state.productGroups.length+1}); else { const oldName=state.productGroups[Number(index)].name; state.productGroups[Number(index)]={...state.productGroups[Number(index)],name,enabled:data.get('enabled')==='on'}; [...state.courseItems,...state.videoItems,...state.articleItems].forEach((item) => { if (item.productGroup===oldName) item.productGroup=name; }); }
    closeModal(); render(); toast(index===''?'商品分组创建成功':'商品分组修改成功'); return;
  }
  if (event.target.id === 'series-form') {
    event.preventDefault(); const data = new FormData(event.target); const editIndex = event.target.dataset.editIndex;
    const projects = data.getAll('projects').map(String); if (!projects.length) { toast('请至少选择一个测评项目'); return; }
    const existing = editIndex === '' ? null : state.seriesItems[Number(editIndex)];
    const item = { name:String(data.get('name')).trim(), description:String(data.get('description')).trim() || '暂无系列描述', projects, questions:projects.reduce((sum,name) => sum + projectQuestionCount(name),0), date: existing?.date || today(), enabled:data.get('enabled') === 'on', shelf:existing?.shelf || '已下架', report:existing?.report ? structuredClone(existing.report) : undefined };
    ensureProjectReport(item);
    if (editIndex === '') state.seriesItems.push(item); else state.seriesItems[Number(editIndex)] = item;
    closeModal(); render(); toast(editIndex === '' ? '系列测评创建成功' : '系列测评修改成功'); return;
  }
  if (event.target.id === 'report-config-form') {
    event.preventDefault(); syncReportConfigDraft(); const project=reportConfigTarget();
    project.report={key:reportConfigDraft.key,enabled:reportConfigDraft.enabled,updatedAt:today()};
    closeModal(); render(); toast('报告配置已保存'); return;
  }
  if (event.target.id === 'plan-form') {
    event.preventDefault(); syncPlanModeDraft(); const data = new FormData(event.target); const editIndex = event.target.dataset.editIndex; const tasks = [...planDraft.selections]; let groups = [...planDraft.groups];
    if (!tasks.length) { toast(planDraft.method === '关联测评' ? '请选择一个测评内容' : planDraft.method === '选择关联任务规则' ? '请至少选择一个关联规则' : planDraft.method === '选择补充测评' ? '请至少选择一个补充测评' : '请至少选择一个任务'); return; }
    const start = planDraft.start; const end = planDraft.end; const delivery = planDraft.delivery; const targetMethod = planDraft.targetMethod;
    if (targetMethod === '手动添加' && !groups.length) { toast('请至少选择一个目标人群'); return; }
    if (targetMethod === '画像标签') { if (!planDraft.profileTags.length) { toast('请至少选择一个画像标签'); return; } groups = [`画像标签（${planDraft.profileMode}）：${planDraft.profileTags.join('、')}`]; }
    if (start && end && start > end) { toast('结束时间不能早于开始时间'); return; }
    const existing = editIndex === '' ? null : state.planItems[Number(editIndex)];
    const sameMethod=!existing || existing.method===planDraft.method;
    const item = { name:String(data.get('name')).trim(), description:String(data.get('description')).trim() || '暂无计划描述', method:planDraft.method, status:existing?.status || '草稿', tasks, start, end, groups, delivery, targetMethod, profileMode:planDraft.profileMode, profileCategory:planDraft.profileCategory, profileTags:[...planDraft.profileTags], stages:sameMethod?(existing?.stages || []):[], ...(sameMethod&&existing?.stageConfig?{stageConfig:structuredClone(existing.stageConfig)}:{}) };
    if (editIndex === '') state.planItems.push(item); else state.planItems[Number(editIndex)] = item;
    closeModal(); render(); toast(editIndex === '' ? '计划创建成功' : '计划修改成功'); return;
  }
  if (event.target.id === 'relation-form') {
    event.preventDefault(); const data = new FormData(event.target); const editIndex = event.target.dataset.editIndex; const existing = editIndex === '' ? null : state.relationItems[Number(editIndex)];
    let tasks = data.getAll('tasks').map(String); let trigger = ''; let script = ''; const project=String(data.get('project')); const priority=Number(data.get('priority') || 100);
    if (!Number.isInteger(priority) || priority < 1 || priority > 9999) { toast('优先级需要是 1–9999 的整数'); return; }
    if (relationDraft.type === '脚本导入') {
      try { script = document.querySelector('#relation-script').value; const parsed = parseAndValidateRelationScript(script); tasks = [...new Set(parsed.flatMap((rule) => rule.tasks.map((task) => typeof task === 'string' ? task : task.name).filter(Boolean)))]; trigger = `已导入 ${parsed.length} 条脚本规则`; } catch (error) { toast(`脚本格式错误：${error.message}`); return; }
    } else if (relationDraft.type === '按照测评项目任务关联') {
      const series=state.seriesItems.find((item) => item.name === project);
      tasks=[...new Set((series?.projects || []).flatMap((name) => state.relationItems.filter((rule) => rule.project === name && rule.enabled).flatMap((rule) => rule.tasks)))];
      if (!tasks.length) { toast('系列子项目暂无已启用的关联规则，请先完成子项目配置'); return; }
      trigger=`自动汇总 ${series.projects.length} 个子项目的启用规则`;
    } else {
      if (!relationDraft.conditions.length) { toast('请至少添加一个触发条件'); return; }
      if (!tasks.length) { toast('请至少选择一个关联任务'); return; }
      const prefix=relationDraft.conditions.length > 1 ? (relationDraft.logic === 'ALL' ? '全部满足：' : '任一满足：') : '';
      trigger = prefix + relationConditionSummary(relationDraft.conditions[0],relationDraft.type) + (relationDraft.conditions.length > 1 ? ` 等 ${relationDraft.conditions.length} 个条件` : '');
    }
    const conditionPayload=relationDraft.type === '脚本导入' ? script : relationDraft.conditions;
    const signature=JSON.stringify({project,type:relationDraft.type,logic:relationDraft.logic,payload:conditionPayload});
    const duplicate=state.relationItems.some((item,index) => String(index)!==editIndex && item.enabled && data.get('enabled') === 'on' && JSON.stringify({project:item.project,type:item.type,logic:item.logic || 'ALL',payload:item.type === '脚本导入' ? item.script || '' : item.conditions || []})===signature);
    if (duplicate) { toast('存在相同的启用规则，请调整条件或停用原规则'); return; }
    const item = { project, type:relationDraft.type, trigger, tasks, conditions:relationDraft.conditions.map((condition) => ({ ...condition })), logic:relationDraft.logic, priority, script, date:existing?.date || today(), enabled:data.get('enabled') === 'on' };
    const conflict=state.relationItems.some((rule,index) => String(index)!==editIndex && rule.enabled && item.enabled && rule.project===item.project && Number(rule.priority ?? 100)===item.priority && relationConditionsConflict(rule,item));
    if (conflict) { toast('同一优先级下存在重叠条件，请调整优先级或条件范围'); return; }
    if (editIndex === '') state.relationItems.push(item); else state.relationItems[Number(editIndex)] = item;
    closeModal(); render(); toast(editIndex === '' ? '关联规则创建成功' : '关联规则修改成功'); return;
  }
  if (event.target.id === 'question-form') {
    event.preventDefault();
    syncQuestionOptions();
    const data = new FormData(event.target);
    const type = String(data.get('questionType'));
    const scale = type === '量表题' ? { min:Number(data.get('scaleMin')), max:Number(data.get('scaleMax')), minLabel:String(data.get('scaleMinLabel') || '').trim(), maxLabel:String(data.get('scaleMaxLabel') || '').trim() } : questionDraft.scale;
    const question = { content: String(data.get('content')).trim(), type, category: String(data.get('category')).trim(), weight: Number(data.get('weight') || 1), required: data.get('required') === 'on', options: ['文本题','量表题'].includes(type) ? [] : questionDraft.options.filter((option) => option.content.trim()), scale, branchRules:questionDraft.branchRules };
    if (!question.content) { toast('请输入题目内容'); return; }
    if (['单选题','多选题'].includes(type) && question.options.length < 2) { toast('至少需要两个有效选项'); return; }
    if (type === '量表题' && (!Number.isFinite(scale.min) || !Number.isFinite(scale.max) || scale.min >= scale.max)) { toast('量表最大值必须高于最小值'); return; }
    const questions = currentQuestions();
    if (questionDraft.editIndex === null) questions.push(question); else questions[questionDraft.editIndex] = question;
    currentProject().questions = questions.length;
    const created = questionDraft.editIndex === null;
    closeModal(); render(); toast(created ? '题目创建成功' : '题目修改成功');
    return;
  }
  if (event.target.id === 'project-form') {
    event.preventDefault();
    const data = new FormData(event.target);
    state.projects.push({ order: state.projects.length + 1, name: String(data.get('name')).trim(), description: String(data.get('description')).trim() || '暂无项目描述', type: '独立测评', questions: 0, status: '草稿', shelf: '已下架', date: today(), questionItems:[], jumpRules:[], scoring:{ segments:[], groups:[], script:'return { title: totalScore >= 60 ? "高分" : "常规", score: totalScore };' } });
    state.projectTab = 'independent';
    closeModal(); render(); toast('测评项目创建成功');
  }
});

render();
