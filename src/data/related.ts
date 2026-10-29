// 글마다 '함께 읽으면 좋은 글' 두 편. 열쇠는 '컬렉션:원문(한국어) slug'이고, 번역 글도 원문의 짝을 따른다
import { getCollection } from 'astro:content';
import type { Lang } from '../i18n/ui';
import { isPublished, postUrl } from './blog';
import { articleUrl, articleSlug } from './articles';

interface Pick { to: string; emoji: string; label: Record<Lang, string> }
export interface ReadNext { href: string; title: string; emoji: string; label: string }

const PICKS: Record<string, Pick[]> = {
  "articles:dopamine-prediction": [
    { to: "articles:habit-66-days", emoji: "🧠", label: { ko: "습관 자동화의 실제 기간", en: "How long habits really take", ja: "習慣が自動化するまでの期間" } },
    { to: "blog:후회할-행동-자꾸-반복된다면-뇌가-이미-먼저-저질러-놓은-뒤였다", emoji: "⏪", label: { ko: "후회할 행동의 순서", en: "Why we repeat regrets", ja: "後悔する行動の順序" } },
  ],
  "articles:exercise-hippocampus": [
    { to: "blog:한-번에-오래-걷기-뇌의-방패-PLA2G2F-인지-회복탄력성과-연속-걷기", emoji: "🛡️", label: { ko: "이어 걷기와 PLA2G2F", en: "Continuous walking and PLA2G2F", ja: "続けて歩くこととPLA2G2F" } },
    { to: "blog:불안장애-겪은-뇌과학자가-찾아낸-운동법-운동의-뇌과학-실천법-총정리", emoji: "🏃", label: { ko: "운동의 뇌과학", en: "The neuroscience of exercise", ja: "運動の脳科学" } },
  ],
  "articles:habit-66-days": [
    { to: "blog:다이어트도-저축도-작심삼일로-끝나는-이유-의지력-탓이-아니었다", emoji: "🗓️", label: { ko: "작심삼일의 심리학", en: "Why plans last three days", ja: "三日坊主の心理学" } },
    { to: "blog:작심삼일-반복된다면-의지력보다-BDNF·aMCC-활용법부터-총정리", emoji: "🧩", label: { ko: "BDNF·aMCC로 작심삼일 넘기기", en: "BDNF, the aMCC and sticking with plans", ja: "BDNF・aMCCで三日坊主を越える" } },
  ],
  "articles:morning-light": [
    { to: "articles:sleep-memory", emoji: "😴", label: { ko: "수면과 기억 정리", en: "Sleep and memory", ja: "睡眠と記憶の整理" } },
    { to: "blog:일찍일어나는-새가-먹이를-먹는다-아니요-아침-30분으로-수면관성뇌가-가장-취약한-순간을-깨우자", emoji: "🌅", label: { ko: "아침 30분과 수면관성", en: "Morning minutes and sleep inertia", ja: "朝の30分と睡眠慣性" } },
  ],
  "articles:sleep-memory": [
    { to: "blog:나이-들어도-기억력이-버티는-뇌의-비상발전기-효소-PLA2G2F-해마-인지-회복탄력성", emoji: "🛡️", label: { ko: "해마의 비상 발전기 PLA2G2F", en: "PLA2G2F, the hippocampus's backup generator", ja: "海馬の非常用発電機PLA2G2F" } },
    { to: "articles:morning-light", emoji: "☀️", label: { ko: "아침빛과 생체시계", en: "Morning light and the body clock", ja: "朝の光と体内時計" } },
  ],
  "articles:ten-percent-myth": [
    { to: "blog:일생동안의-연계성-뇌가소성", emoji: "🌀", label: { ko: "일생 동안의 뇌가소성", en: "Lifelong neuroplasticity", ja: "一生続く脳の可塑性" } },
    { to: "blog:말-한마디가-뇌를-재설계한다-뇌가소성과-말버릇의-신경과학", emoji: "💬", label: { ko: "말버릇과 뇌가소성", en: "Words and neuroplasticity", ja: "口癖と脳の可塑性" } },
  ],
  "blog:10분만-뛰어도-뇌가-바뀐다는-BDNF-러닝-시작하는-방법까지-총정리": [
    { to: "blog:BDNF-늘리는-법-총정리-운동-음식-독서-명상-수면-실험-근거와-유지-기간", emoji: "🌱", label: { ko: "BDNF 늘리는 법", en: "Ways to raise BDNF", ja: "BDNFを増やす方法" } },
    { to: "blog:평발-요족-정상발-발아치별-러닝화-이렇게-선택하세요", emoji: "👟", label: { ko: "발아치별 러닝화", en: "Running shoes by arch type", ja: "土踏まず別のランニングシューズ" } },
  ],
  "blog:1분-고강도-운동HIIE이-뇌-건강을-바꾸는-과학적-근거와-메커니즘": [
    { to: "blog:10분만-뛰어도-뇌가-바뀐다는-BDNF-러닝-시작하는-방법까지-총정리", emoji: "🏃", label: { ko: "러닝과 BDNF", en: "Running and BDNF", ja: "ランニングとBDNF" } },
    { to: "blog:육체적으로-이미-지쳤는데-운동을-하면-더-피곤해지지-않을까요-뇌를-깨우는-메커니즘을-소개합니다", emoji: "🔋", label: { ko: "지쳤을 때의 운동", en: "Exercising when you're tired", ja: "疲れているときの運動" } },
  ],
  "blog:BDNF-뇌-유래-신경영양인자-너의-정체는-뭐니": [
    { to: "blog:BDNF-부족하게-되는-원인-뇌건강도-좋아지나", emoji: "🌱", label: { ko: "BDNF가 줄어드는 원인", en: "What lowers BDNF", ja: "BDNFが減る原因" } },
    { to: "blog:BDNF가-많이들어있는-음식은", emoji: "🥦", label: { ko: "BDNF를 돕는 식사", en: "Eating to support BDNF", ja: "BDNFを支える食事" } },
  ],
  "blog:BDNF-늘리는-법-총정리-운동-음식-독서-명상-수면-실험-근거와-유지-기간": [
    { to: "blog:10분만-뛰어도-뇌가-바뀐다는-BDNF-러닝-시작하는-방법까지-총정리", emoji: "🏃", label: { ko: "러닝과 BDNF", en: "Running and BDNF", ja: "ランニングとBDNF" } },
    { to: "blog:작심삼일-반복된다면-의지력보다-BDNF·aMCC-활용법부터-총정리", emoji: "🧩", label: { ko: "BDNF·aMCC로 작심삼일 넘기기", en: "BDNF, the aMCC and sticking with plans", ja: "BDNF・aMCCで三日坊主を越える" } },
  ],
  "blog:BDNF-부족하게-되는-원인-뇌건강도-좋아지나": [
    { to: "blog:BDNF-뇌-유래-신경영양인자-너의-정체는-뭐니", emoji: "🌱", label: { ko: "BDNF 기초", en: "BDNF basics", ja: "BDNFの基礎" } },
    { to: "blog:간헐적-단식-설-명절-확찐자들을-위한-비법", emoji: "⏱️", label: { ko: "간헐적 단식", en: "Intermittent fasting", ja: "間欠的断食" } },
  ],
  "blog:BDNF가-많이들어있는-음식은": [
    { to: "blog:BDNF-늘리는-법-총정리-운동-음식-독서-명상-수면-실험-근거와-유지-기간", emoji: "🌱", label: { ko: "BDNF 늘리는 법", en: "Ways to raise BDNF", ja: "BDNFを増やす方法" } },
    { to: "blog:마그네슘-유기염-무기염-킬레이트-흡수율-글루타치온-기억력", emoji: "💊", label: { ko: "마그네슘 흡수율", en: "Magnesium absorption", ja: "マグネシウムの吸収率" } },
  ],
  "blog:간헐적-단식-설-명절-확찐자들을-위한-비법": [
    { to: "blog:인슐린-역할은-영리하게-사용하는-비법은", emoji: "🍞", label: { ko: "인슐린 사용법", en: "Using insulin wisely", ja: "インスリンとの付き合い方" } },
    { to: "blog:BDNF가-많이들어있는-음식은", emoji: "🥦", label: { ko: "BDNF를 돕는 식사", en: "Eating to support BDNF", ja: "BDNFを支える食事" } },
  ],
  "blog:고기만-먹었는데-뇌가-달라졌다는-카니보어-식단-정체가-뭐길래": [
    { to: "blog:브레인포그-케톤체-카니보어-멘탈클래리티", emoji: "🧊", label: { ko: "브레인포그와 케톤", en: "Brain fog and ketones", ja: "ブレインフォグとケトン" } },
    { to: "blog:급진급빠-다이어트추석-명절-직후-카니보어-식단과-마그네슘-보충-가이드", emoji: "🥩", label: { ko: "명절 뒤 카니보어와 마그네슘", en: "Carnivore and magnesium after the holidays", ja: "連休明けのカーニボアとマグネシウム" } },
  ],
  "blog:급진급빠-다이어트추석-명절-직후-카니보어-식단과-마그네슘-보충-가이드": [
    { to: "blog:고기만-먹었는데-뇌가-달라졌다는-카니보어-식단-정체가-뭐길래", emoji: "🥩", label: { ko: "카니보어 식단과 뇌", en: "The carnivore diet and the brain", ja: "カーニボア食と脳" } },
    { to: "blog:브레인포그-케톤체-카니보어-멘탈클래리티", emoji: "🧊", label: { ko: "브레인포그와 케톤", en: "Brain fog and ketones", ja: "ブレインフォグとケトン" } },
  ],
  "blog:기억은-덜-진실하다-그러니-기록하자": [
    { to: "blog:내-하루를-관찰하기-시작했을-때-달라진-것-양자-얽힘Quantum-Entanglement", emoji: "👀", label: { ko: "하루를 관찰하는 힘", en: "Observing your day", ja: "一日を観察する力" } },
    { to: "blog:뇌가-변하고-있다", emoji: "🌀", label: { ko: "변화하는 뇌", en: "The changing brain", ja: "変わりつつある脳" } },
  ],
  "blog:나이-들어도-기억력이-버티는-뇌의-비상발전기-효소-PLA2G2F-해마-인지-회복탄력성": [
    { to: "articles:exercise-hippocampus", emoji: "🏃", label: { ko: "해마를 키우는 걷기", en: "Walking that grows the hippocampus", ja: "海馬を育てる歩行" } },
    { to: "blog:회복탄력성-뜻과-키우는-법-뇌과학으로-본-성취와-학습의-관계", emoji: "🌱", label: { ko: "회복탄력성 키우기", en: "Building resilience", ja: "レジリエンスを育てる" } },
  ],
  "blog:내-하루를-관찰하기-시작했을-때-달라진-것-양자-얽힘Quantum-Entanglement": [
    { to: "blog:생각은-내가-아니다-수용전념치료ACT와-뇌가-밝혀낸-인지적-탈융합의-힘", emoji: "☁️", label: { ko: "생각과 거리 두기(ACT)", en: "Stepping back from thoughts (ACT)", ja: "思考と距離をとる(ACT)" } },
    { to: "blog:목표-이루는-방법-3가지", emoji: "🎯", label: { ko: "목표 이루는 방법", en: "Reaching your goals", ja: "目標を叶える方法" } },
  ],
  "blog:뇌-건강-뇌-가소성-운동-습관-복리-효과": [
    { to: "articles:exercise-hippocampus", emoji: "🏃", label: { ko: "해마를 키우는 걷기", en: "Walking that grows the hippocampus", ja: "海馬を育てる歩行" } },
    { to: "blog:의지력이-약한-진짜-범인은-근육이었다-유산소-vs-근력-운동이-뇌를-다르게-바꾸는-뇌과학적-원리", emoji: "🏋️", label: { ko: "유산소 vs 근력 운동", en: "Aerobic vs. strength training", ja: "有酸素運動と筋トレ" } },
  ],
  "blog:뇌-건강에-좋은-러닝-초보-러너-무릎통증-발아치-안-맞는-러닝화가-원인일-수-있어요": [
    { to: "blog:러닝-전후-5분-준비운동-놓치면-뇌-효과-반토막-난대요", emoji: "🤸", label: { ko: "러닝 전후 준비운동", en: "Warming up around a run", ja: "ランニング前後の準備運動" } },
    { to: "blog:10분만-뛰어도-뇌가-바뀐다는-BDNF-러닝-시작하는-방법까지-총정리", emoji: "🏃", label: { ko: "러닝과 BDNF", en: "Running and BDNF", ja: "ランニングとBDNF" } },
  ],
  "blog:뇌-좌표계로-보는-운동과-학습-Mind-Muscle-신체화-학습-자기중심": [
    { to: "blog:의지력이-약한-진짜-범인은-근육이었다-유산소-vs-근력-운동이-뇌를-다르게-바꾸는-뇌과학적-원리", emoji: "🏋️", label: { ko: "유산소 vs 근력 운동", en: "Aerobic vs. strength training", ja: "有酸素運動と筋トレ" } },
    { to: "blog:뇌가소성을-깨워라", emoji: "🌀", label: { ko: "뇌 가소성을 깨우는 법", en: "Waking up neuroplasticity", ja: "脳の可塑性を目覚めさせる" } },
  ],
  "blog:뇌가-변하고-있다": [
    { to: "blog:기억은-덜-진실하다-그러니-기록하자", emoji: "📝", label: { ko: "기록이 기억을 지킨다", en: "Writing things down", ja: "記録が記憶を守る" } },
    { to: "blog:뇌가소성을-깨워라", emoji: "🌀", label: { ko: "뇌 가소성을 깨우는 법", en: "Waking up neuroplasticity", ja: "脳の可塑性を目覚めさせる" } },
  ],
  "blog:뇌가소성을-깨워라": [
    { to: "blog:일생동안의-연계성-뇌가소성", emoji: "🌀", label: { ko: "일생 동안의 뇌가소성", en: "Lifelong neuroplasticity", ja: "一生続く脳の可塑性" } },
    { to: "blog:성공의-비밀", emoji: "🔑", label: { ko: "성공의 비밀", en: "The secret of success", ja: "成功の秘密" } },
  ],
  "blog:뇌과학-나쁜-습관을-끊어내고-싶다면-뇌의-보상-회로를-땀방울로-리셋하라": [
    { to: "blog:후회할-행동-자꾸-반복된다면-뇌가-이미-먼저-저질러-놓은-뒤였다", emoji: "⏪", label: { ko: "후회할 행동의 순서", en: "Why we repeat regrets", ja: "後悔する行動の順序" } },
    { to: "blog:불안장애-겪은-뇌과학자가-찾아낸-운동법-운동의-뇌과학-실천법-총정리", emoji: "🏃", label: { ko: "운동의 뇌과학", en: "The neuroscience of exercise", ja: "運動の脳科学" } },
  ],
  "blog:뇌과학으로-배우는-자연-치유-15분-습관이-뇌를-재부팅하는-이유": [
    { to: "blog:의지로-버티다-번아웃-온-분들-보세요-뇌는-설득이-아니라-스위치를-켜는-겁니다", emoji: "🔌", label: { ko: "번아웃과 뇌의 스위치", en: "Burnout and the brain's switches", ja: "燃え尽きと脳のスイッチ" } },
    { to: "blog:햇볕과-집중력-그리고-뇌기능-생체리듬-인지기능-빛-노출", emoji: "☀️", label: { ko: "햇볕과 집중력", en: "Daylight and focus", ja: "日光と集中力" } },
  ],
  "blog:늙지-않는-뇌를-만드는-가장-즐거운-방법-두뇌-활력을-깨우는-3가지-즐거운-비밀-루틴": [
    { to: "blog:나이-들어도-기억력이-버티는-뇌의-비상발전기-효소-PLA2G2F-해마-인지-회복탄력성", emoji: "🛡️", label: { ko: "해마의 비상 발전기 PLA2G2F", en: "PLA2G2F, the hippocampus's backup generator", ja: "海馬の非常用発電機PLA2G2F" } },
    { to: "blog:래미안갤러리-A-Part-of-Home-몰입형-전시-뇌과학-강연-들으러가요-공간부터-나답게", emoji: "🖼️", label: { ko: "몰입과 공간", en: "Focus and space", ja: "没入と空間" } },
  ],
  "blog:다이어트도-미룬-일도-자꾸-포기하는-이유-의지-아니라-몸-에너지-20-쓰는-뇌-때문이었다": [
    { to: "blog:후회할-행동-자꾸-반복된다면-뇌가-이미-먼저-저질러-놓은-뒤였다", emoji: "⏪", label: { ko: "후회할 행동의 순서", en: "Why we repeat regrets", ja: "後悔する行動の順序" } },
    { to: "blog:의지로-버티다-번아웃-온-분들-보세요-뇌는-설득이-아니라-스위치를-켜는-겁니다", emoji: "🔌", label: { ko: "번아웃과 뇌의 스위치", en: "Burnout and the brain's switches", ja: "燃え尽きと脳のスイッチ" } },
  ],
  "blog:다이어트도-저축도-작심삼일로-끝나는-이유-의지력-탓이-아니었다": [
    { to: "articles:habit-66-days", emoji: "🧠", label: { ko: "습관 자동화의 실제 기간", en: "How long habits really take", ja: "習慣が自動化するまでの期間" } },
    { to: "blog:다이어트도-미룬-일도-자꾸-포기하는-이유-의지-아니라-몸-에너지-20-쓰는-뇌-때문이었다", emoji: "🔋", label: { ko: "에너지를 아끼는 뇌", en: "The energy-saving brain", ja: "エネルギーを節約する脳" } },
  ],
  "blog:단순한-피부-관리가-아니었던-얼굴·목-림프-마사지-최신-IBS-셀Cell-논문으로-밝혀진-뇌-배수구-지주막-소창의-비밀과-뇌-노폐물-배출을-돕는-일상-습관을-쉽게-풀어-설명해-드립니다": [
    { to: "blog:치매-치료-새-경로-뇌-면역세포-GAP-경로-호르메시스", emoji: "🧹", label: { ko: "뇌 면역세포와 치매", en: "Brain immune cells and dementia", ja: "脳の免疫細胞と認知症" } },
    { to: "articles:sleep-memory", emoji: "😴", label: { ko: "수면과 기억 정리", en: "Sleep and memory", ja: "睡眠と記憶の整理" } },
  ],
  "blog:두뇌활성이-필요한-중요한-날엔-직전에-뭘-먹을까": [
    { to: "blog:BDNF가-많이들어있는-음식은", emoji: "🥦", label: { ko: "BDNF를 돕는 식사", en: "Eating to support BDNF", ja: "BDNFを支える食事" } },
    { to: "blog:브레인포그-케톤체-카니보어-멘탈클래리티", emoji: "🧊", label: { ko: "브레인포그와 케톤", en: "Brain fog and ketones", ja: "ブレインフォグとケトン" } },
  ],
  "blog:래미안갤러리-A-Part-of-Home-몰입형-전시-뇌과학-강연-들으러가요-공간부터-나답게": [
    { to: "blog:늙지-않는-뇌를-만드는-가장-즐거운-방법-두뇌-활력을-깨우는-3가지-즐거운-비밀-루틴", emoji: "🎨", label: { ko: "늙지 않는 뇌 루틴", en: "Routines for a younger brain", ja: "老けない脳のルーティン" } },
    { to: "blog:뇌-좌표계로-보는-운동과-학습-Mind-Muscle-신체화-학습-자기중심", emoji: "🧭", label: { ko: "뇌 좌표계와 학습", en: "The brain's coordinate systems and learning", ja: "脳の座標系と学習" } },
  ],
  "blog:러닝-전후-5분-준비운동-놓치면-뇌-효과-반토막-난대요": [
    { to: "blog:뇌-건강에-좋은-러닝-초보-러너-무릎통증-발아치-안-맞는-러닝화가-원인일-수-있어요", emoji: "👟", label: { ko: "초보 러너 무릎 통증", en: "Knee pain for new runners", ja: "初心者ランナーの膝の痛み" } },
    { to: "blog:평발-요족-정상발-발아치별-러닝화-이렇게-선택하세요", emoji: "👟", label: { ko: "발아치별 러닝화", en: "Running shoes by arch type", ja: "土踏まず別のランニングシューズ" } },
  ],
  "blog:마그네슘-유기염-무기염-킬레이트-흡수율-글루타치온-기억력": [
    { to: "blog:BDNF가-많이들어있는-음식은", emoji: "🥦", label: { ko: "BDNF를 돕는 식사", en: "Eating to support BDNF", ja: "BDNFを支える食事" } },
    { to: "blog:멍한-머리와-만성-피로-문제는-뇌-면역이었다-신경아교세포와-장-뇌-축을-살리는-항염-영양소-식단-가이드", emoji: "🛡️", label: { ko: "뇌 면역과 장-뇌 축", en: "Brain immunity and the gut-brain axis", ja: "脳の免疫と腸脳相関" } },
  ],
  "blog:말-한마디가-뇌를-재설계한다-뇌가소성과-말버릇의-신경과학": [
    { to: "blog:반복된-감정-반응-말버릇-습관적인-태도까지도-결국-뇌가-학습해-놓은-일종의-반사-회로라면", emoji: "🔁", label: { ko: "감정 반응의 반사 회로", en: "Emotional reflex circuits", ja: "感情反応の反射回路" } },
    { to: "blog:생각은-내가-아니다-수용전념치료ACT와-뇌가-밝혀낸-인지적-탈융합의-힘", emoji: "☁️", label: { ko: "생각과 거리 두기(ACT)", en: "Stepping back from thoughts (ACT)", ja: "思考と距離をとる(ACT)" } },
  ],
  "blog:매일-5분-습관-뇌가-진짜로-바뀌는-이유-따로-있었다-신경가소성": [
    { to: "blog:뇌-건강-뇌-가소성-운동-습관-복리-효과", emoji: "📈", label: { ko: "운동 습관의 복리 효과", en: "The compounding of exercise habits", ja: "運動習慣の複利効果" } },
    { to: "blog:뇌가소성을-깨워라", emoji: "🌀", label: { ko: "뇌 가소성을 깨우는 법", en: "Waking up neuroplasticity", ja: "脳の可塑性を目覚めさせる" } },
  ],
  "blog:멍한-머리와-만성-피로-문제는-뇌-면역이었다-신경아교세포와-장-뇌-축을-살리는-항염-영양소-식단-가이드": [
    { to: "blog:단순한-피부-관리가-아니었던-얼굴·목-림프-마사지-최신-IBS-셀Cell-논문으로-밝혀진-뇌-배수구-지주막-소창의-비밀과-뇌-노폐물-배출을-돕는-일상-습관을-쉽게-풀어-설명해-드립니다", emoji: "💆", label: { ko: "뇌 배수구와 림프 마사지", en: "The brain's drain and lymphatic massage", ja: "脳の排水口とリンパマッサージ" } },
    { to: "blog:치매-치료-새-경로-뇌-면역세포-GAP-경로-호르메시스", emoji: "🧹", label: { ko: "뇌 면역세포와 치매", en: "Brain immune cells and dementia", ja: "脳の免疫細胞と認知症" } },
  ],
  "blog:몇-년째-안-풀리던-세라믹-난제-서울대-교수는-3주-만에-푼-이유": [
    { to: "blog:성공의-비밀", emoji: "🔑", label: { ko: "성공의 비밀", en: "The secret of success", ja: "成功の秘密" } },
    { to: "blog:뇌-좌표계로-보는-운동과-학습-Mind-Muscle-신체화-학습-자기중심", emoji: "🧭", label: { ko: "뇌 좌표계와 학습", en: "The brain's coordinate systems and learning", ja: "脳の座標系と学習" } },
  ],
  "blog:목표-이루는-방법-3가지": [
    { to: "blog:성공의-비밀", emoji: "🔑", label: { ko: "성공의 비밀", en: "The secret of success", ja: "成功の秘密" } },
    { to: "blog:다이어트도-저축도-작심삼일로-끝나는-이유-의지력-탓이-아니었다", emoji: "🗓️", label: { ko: "작심삼일의 심리학", en: "Why plans last three days", ja: "三日坊主の心理学" } },
  ],
  "blog:반복된-감정-반응-말버릇-습관적인-태도까지도-결국-뇌가-학습해-놓은-일종의-반사-회로라면": [
    { to: "blog:말-한마디가-뇌를-재설계한다-뇌가소성과-말버릇의-신경과학", emoji: "💬", label: { ko: "말버릇과 뇌가소성", en: "Words and neuroplasticity", ja: "口癖と脳の可塑性" } },
    { to: "blog:후회할-행동-자꾸-반복된다면-뇌가-이미-먼저-저질러-놓은-뒤였다", emoji: "⏪", label: { ko: "후회할 행동의 순서", en: "Why we repeat regrets", ja: "後悔する行動の順序" } },
  ],
  "blog:불안장애-겪은-뇌과학자가-찾아낸-운동법-운동의-뇌과학-실천법-총정리": [
    { to: "articles:exercise-hippocampus", emoji: "🏃", label: { ko: "해마를 키우는 걷기", en: "Walking that grows the hippocampus", ja: "海馬を育てる歩行" } },
    { to: "blog:의지력이-약한-진짜-범인은-근육이었다-유산소-vs-근력-운동이-뇌를-다르게-바꾸는-뇌과학적-원리", emoji: "🏋️", label: { ko: "유산소 vs 근력 운동", en: "Aerobic vs. strength training", ja: "有酸素運動と筋トレ" } },
  ],
  "blog:브레인포그-케톤체-카니보어-멘탈클래리티": [
    { to: "blog:고기만-먹었는데-뇌가-달라졌다는-카니보어-식단-정체가-뭐길래", emoji: "🥩", label: { ko: "카니보어 식단과 뇌", en: "The carnivore diet and the brain", ja: "カーニボア食と脳" } },
    { to: "blog:멍한-머리와-만성-피로-문제는-뇌-면역이었다-신경아교세포와-장-뇌-축을-살리는-항염-영양소-식단-가이드", emoji: "🛡️", label: { ko: "뇌 면역과 장-뇌 축", en: "Brain immunity and the gut-brain axis", ja: "脳の免疫と腸脳相関" } },
  ],
  "blog:생각은-내가-아니다-수용전념치료ACT와-뇌가-밝혀낸-인지적-탈융합의-힘": [
    { to: "blog:숨이-뇌의-스위치다-호흡-뇌과학-하루-5분-습관", emoji: "🌬️", label: { ko: "호흡과 뇌의 각성", en: "Breathing and arousal", ja: "呼吸と脳の覚醒" } },
    { to: "blog:내-하루를-관찰하기-시작했을-때-달라진-것-양자-얽힘Quantum-Entanglement", emoji: "👀", label: { ko: "하루를 관찰하는 힘", en: "Observing your day", ja: "一日を観察する力" } },
  ],
  "blog:성공의-비밀": [
    { to: "blog:목표-이루는-방법-3가지", emoji: "🎯", label: { ko: "목표 이루는 방법", en: "Reaching your goals", ja: "目標を叶える方法" } },
    { to: "blog:뇌가소성을-깨워라", emoji: "🌀", label: { ko: "뇌 가소성을 깨우는 법", en: "Waking up neuroplasticity", ja: "脳の可塑性を目覚めさせる" } },
  ],
  "blog:숨이-뇌의-스위치다-호흡-뇌과학-하루-5분-습관": [
    { to: "blog:불안장애-겪은-뇌과학자가-찾아낸-운동법-운동의-뇌과학-실천법-총정리", emoji: "🏃", label: { ko: "운동의 뇌과학", en: "The neuroscience of exercise", ja: "運動の脳科学" } },
    { to: "blog:뇌과학으로-배우는-자연-치유-15분-습관이-뇌를-재부팅하는-이유", emoji: "🌳", label: { ko: "자연 속 15분과 뇌 회복", en: "15 minutes in nature", ja: "自然の中の15分と脳の回復" } },
  ],
  "blog:육체적으로-이미-지쳤는데-운동을-하면-더-피곤해지지-않을까요-뇌를-깨우는-메커니즘을-소개합니다": [
    { to: "blog:1분-고강도-운동HIIE이-뇌-건강을-바꾸는-과학적-근거와-메커니즘", emoji: "⚡", label: { ko: "짧고 강한 운동", en: "Short, intense exercise", ja: "短く強い運動" } },
    { to: "blog:뇌과학으로-배우는-자연-치유-15분-습관이-뇌를-재부팅하는-이유", emoji: "🌳", label: { ko: "자연 속 15분과 뇌 회복", en: "15 minutes in nature", ja: "自然の中の15分と脳の回復" } },
  ],
  "blog:의지력이-약한-진짜-범인은-근육이었다-유산소-vs-근력-운동이-뇌를-다르게-바꾸는-뇌과학적-원리": [
    { to: "blog:불안장애-겪은-뇌과학자가-찾아낸-운동법-운동의-뇌과학-실천법-총정리", emoji: "🏃", label: { ko: "운동의 뇌과학", en: "The neuroscience of exercise", ja: "運動の脳科学" } },
    { to: "blog:뇌-건강-뇌-가소성-운동-습관-복리-효과", emoji: "📈", label: { ko: "운동 습관의 복리 효과", en: "The compounding of exercise habits", ja: "運動習慣の複利効果" } },
  ],
  "blog:의지로-버티다-번아웃-온-분들-보세요-뇌는-설득이-아니라-스위치를-켜는-겁니다": [
    { to: "blog:뇌과학으로-배우는-자연-치유-15분-습관이-뇌를-재부팅하는-이유", emoji: "🌳", label: { ko: "자연 속 15분과 뇌 회복", en: "15 minutes in nature", ja: "自然の中の15分と脳の回復" } },
    { to: "blog:숨이-뇌의-스위치다-호흡-뇌과학-하루-5분-습관", emoji: "🌬️", label: { ko: "호흡과 뇌의 각성", en: "Breathing and arousal", ja: "呼吸と脳の覚醒" } },
  ],
  "blog:인슐린-역할은-영리하게-사용하는-비법은": [
    { to: "blog:피-한-방울로-뇌-건강-신호까지-보인다는-혈당-체크기-집에서-재는-법-총정리", emoji: "🩸", label: { ko: "집에서 혈당 재기", en: "Checking blood sugar at home", ja: "自宅で血糖を測る" } },
    { to: "blog:간헐적-단식-설-명절-확찐자들을-위한-비법", emoji: "⏱️", label: { ko: "간헐적 단식", en: "Intermittent fasting", ja: "間欠的断食" } },
  ],
  "blog:일생동안의-연계성-뇌가소성": [
    { to: "blog:뇌가-변하고-있다", emoji: "🌀", label: { ko: "변화하는 뇌", en: "The changing brain", ja: "変わりつつある脳" } },
    { to: "articles:ten-percent-myth", emoji: "🧠", label: { ko: "신경가소성의 진짜 모습", en: "What neuroplasticity really is", ja: "神経可塑性の本当の姿" } },
  ],
  "blog:일찍일어나는-새가-먹이를-먹는다-아니요-아침-30분으로-수면관성뇌가-가장-취약한-순간을-깨우자": [
    { to: "blog:햇볕과-집중력-그리고-뇌기능-생체리듬-인지기능-빛-노출", emoji: "☀️", label: { ko: "햇볕과 집중력", en: "Daylight and focus", ja: "日光と集中力" } },
    { to: "articles:sleep-memory", emoji: "😴", label: { ko: "수면과 기억 정리", en: "Sleep and memory", ja: "睡眠と記憶の整理" } },
  ],
  "blog:작심삼일-반복되는-이유-전두엽-aMCC-훈련법-독서": [
    { to: "blog:다이어트도-저축도-작심삼일로-끝나는-이유-의지력-탓이-아니었다", emoji: "🗓️", label: { ko: "작심삼일의 심리학", en: "Why plans last three days", ja: "三日坊主の心理学" } },
    { to: "blog:BDNF-뇌-유래-신경영양인자-너의-정체는-뭐니", emoji: "🌱", label: { ko: "BDNF 기초", en: "BDNF basics", ja: "BDNFの基礎" } },
  ],
  "blog:작심삼일-반복된다면-의지력보다-BDNF·aMCC-활용법부터-총정리": [
    { to: "blog:BDNF-늘리는-법-총정리-운동-음식-독서-명상-수면-실험-근거와-유지-기간", emoji: "🌱", label: { ko: "BDNF 늘리는 법", en: "Ways to raise BDNF", ja: "BDNFを増やす方法" } },
    { to: "blog:매일-5분-습관-뇌가-진짜로-바뀌는-이유-따로-있었다-신경가소성", emoji: "⏳", label: { ko: "매일 5분 습관", en: "A 5-minute daily habit", ja: "毎日5分の習慣" } },
  ],
  "blog:장을-지키는-IgA-항체와-뇌의-연결고리-뇌-발달을-위한-장-관리의-신경과학": [
    { to: "blog:BDNF가-많이들어있는-음식은", emoji: "🥦", label: { ko: "BDNF를 돕는 식사", en: "Eating to support BDNF", ja: "BDNFを支える食事" } },
    { to: "blog:단순한-피부-관리가-아니었던-얼굴·목-림프-마사지-최신-IBS-셀Cell-논문으로-밝혀진-뇌-배수구-지주막-소창의-비밀과-뇌-노폐물-배출을-돕는-일상-습관을-쉽게-풀어-설명해-드립니다", emoji: "💆", label: { ko: "뇌 배수구와 림프 마사지", en: "The brain's drain and lymphatic massage", ja: "脳の排水口とリンパマッサージ" } },
  ],
  "blog:치매-치료-새-경로-뇌-면역세포-GAP-경로-호르메시스": [
    { to: "blog:멍한-머리와-만성-피로-문제는-뇌-면역이었다-신경아교세포와-장-뇌-축을-살리는-항염-영양소-식단-가이드", emoji: "🛡️", label: { ko: "뇌 면역과 장-뇌 축", en: "Brain immunity and the gut-brain axis", ja: "脳の免疫と腸脳相関" } },
    { to: "blog:한-번에-오래-걷기-뇌의-방패-PLA2G2F-인지-회복탄력성과-연속-걷기", emoji: "🛡️", label: { ko: "이어 걷기와 PLA2G2F", en: "Continuous walking and PLA2G2F", ja: "続けて歩くこととPLA2G2F" } },
  ],
  "blog:평발-요족-정상발-발아치별-러닝화-이렇게-선택하세요": [
    { to: "blog:러닝-전후-5분-준비운동-놓치면-뇌-효과-반토막-난대요", emoji: "🤸", label: { ko: "러닝 전후 준비운동", en: "Warming up around a run", ja: "ランニング前後の準備運動" } },
    { to: "blog:10분만-뛰어도-뇌가-바뀐다는-BDNF-러닝-시작하는-방법까지-총정리", emoji: "🏃", label: { ko: "러닝과 BDNF", en: "Running and BDNF", ja: "ランニングとBDNF" } },
  ],
  "blog:플라세보가-진짜-존재하는지-알아보기": [
    { to: "blog:성공의-비밀", emoji: "🔑", label: { ko: "성공의 비밀", en: "The secret of success", ja: "成功の秘密" } },
    { to: "blog:말-한마디가-뇌를-재설계한다-뇌가소성과-말버릇의-신경과학", emoji: "💬", label: { ko: "말버릇과 뇌가소성", en: "Words and neuroplasticity", ja: "口癖と脳の可塑性" } },
  ],
  "blog:피-한-방울로-뇌-건강-신호까지-보인다는-혈당-체크기-집에서-재는-법-총정리": [
    { to: "blog:인슐린-역할은-영리하게-사용하는-비법은", emoji: "🍞", label: { ko: "인슐린 사용법", en: "Using insulin wisely", ja: "インスリンとの付き合い方" } },
    { to: "blog:두뇌활성이-필요한-중요한-날엔-직전에-뭘-먹을까", emoji: "🍽️", label: { ko: "중요한 날 직전 식사", en: "What to eat before a big day", ja: "大事な日の直前の食事" } },
  ],
  "blog:하루-10시간-게임해도-뇌가-똑똑해진-진짜-이유-프로게이머-훈련되-뇌-MRI-충격-결과": [
    { to: "blog:몇-년째-안-풀리던-세라믹-난제-서울대-교수는-3주-만에-푼-이유", emoji: "💡", label: { ko: "생각하는 방식 바꾸기", en: "Changing how you think", ja: "考え方を変える" } },
    { to: "blog:의지력이-약한-진짜-범인은-근육이었다-유산소-vs-근력-운동이-뇌를-다르게-바꾸는-뇌과학적-원리", emoji: "🏋️", label: { ko: "유산소 vs 근력 운동", en: "Aerobic vs. strength training", ja: "有酸素運動と筋トレ" } },
  ],
  "blog:한-번에-오래-걷기-뇌의-방패-PLA2G2F-인지-회복탄력성과-연속-걷기": [
    { to: "articles:exercise-hippocampus", emoji: "🏃", label: { ko: "해마를 키우는 걷기", en: "Walking that grows the hippocampus", ja: "海馬を育てる歩行" } },
    { to: "articles:habit-66-days", emoji: "🧠", label: { ko: "습관 자동화의 실제 기간", en: "How long habits really take", ja: "習慣が自動化するまでの期間" } },
  ],
  "blog:햇볕과-집중력-그리고-뇌기능-생체리듬-인지기능-빛-노출": [
    { to: "blog:일찍일어나는-새가-먹이를-먹는다-아니요-아침-30분으로-수면관성뇌가-가장-취약한-순간을-깨우자", emoji: "🌅", label: { ko: "아침 30분과 수면관성", en: "Morning minutes and sleep inertia", ja: "朝の30分と睡眠慣性" } },
    { to: "blog:뇌과학으로-배우는-자연-치유-15분-습관이-뇌를-재부팅하는-이유", emoji: "🌳", label: { ko: "자연 속 15분과 뇌 회복", en: "15 minutes in nature", ja: "自然の中の15分と脳の回復" } },
  ],
  "blog:혈당-정상인데도-뇌는-늙는다…인슐린-저항성-자가체크-신호": [
    { to: "blog:인슐린-역할은-영리하게-사용하는-비법은", emoji: "🍞", label: { ko: "인슐린 사용법", en: "Using insulin wisely", ja: "インスリンとの付き合い方" } },
    { to: "blog:멍한-머리와-만성-피로-문제는-뇌-면역이었다-신경아교세포와-장-뇌-축을-살리는-항염-영양소-식단-가이드", emoji: "🛡️", label: { ko: "뇌 면역과 장-뇌 축", en: "Brain immunity and the gut-brain axis", ja: "脳の免疫と腸脳相関" } },
  ],
  "blog:확언-1000번-외쳐도-안-변하는-이유-뇌과학으로-총정리": [
    { to: "blog:플라세보가-진짜-존재하는지-알아보기", emoji: "🧪", label: { ko: "플라시보 효과", en: "The placebo effect", ja: "プラセボ効果" } },
    { to: "blog:매일-5분-습관-뇌가-진짜로-바뀌는-이유-따로-있었다-신경가소성", emoji: "⏳", label: { ko: "매일 5분 습관", en: "A 5-minute daily habit", ja: "毎日5分の習慣" } },
  ],
  "blog:회복탄력성-뜻과-키우는-법-뇌과학으로-본-성취와-학습의-관계": [
    { to: "blog:생각은-내가-아니다-수용전념치료ACT와-뇌가-밝혀낸-인지적-탈융합의-힘", emoji: "☁️", label: { ko: "생각과 거리 두기(ACT)", en: "Stepping back from thoughts (ACT)", ja: "思考と距離をとる(ACT)" } },
    { to: "blog:숨이-뇌의-스위치다-호흡-뇌과학-하루-5분-습관", emoji: "🌬️", label: { ko: "호흡과 뇌의 각성", en: "Breathing and arousal", ja: "呼吸と脳の覚醒" } },
  ],
  "blog:후회할-행동-자꾸-반복된다면-뇌가-이미-먼저-저질러-놓은-뒤였다": [
    { to: "blog:뇌과학-나쁜-습관을-끊어내고-싶다면-뇌의-보상-회로를-땀방울로-리셋하라", emoji: "💧", label: { ko: "운동으로 보상 회로 리셋", en: "Resetting reward circuits with exercise", ja: "運動で報酬回路をリセット" } },
    { to: "blog:반복된-감정-반응-말버릇-습관적인-태도까지도-결국-뇌가-학습해-놓은-일종의-반사-회로라면", emoji: "🔁", label: { ko: "감정 반응의 반사 회로", en: "Emotional reflex circuits", ja: "感情反応の反射回路" } },
  ],
};

export async function readNext(col: 'blog' | 'articles', originalSlug: string, lang: Lang): Promise<ReadNext[]> {
  const picks = PICKS[`${col}:${originalSlug}`] ?? [];
  const [blog, articles] = await Promise.all([
    getCollection('blog', (p) => isPublished(p) && p.data.lang === lang),
    getCollection('articles', (a) => a.data.lang === lang),
  ]);
  return picks.flatMap((pick) => {
    const [c, slug] = pick.to.split(/:(.*)/s);
    if (c === 'blog') {
      const p = blog.find((x) => (x.data.translationOf ?? x.data.slug) === slug);
      return p ? [{ href: postUrl(p), title: p.data.title, emoji: pick.emoji, label: pick.label[lang] }] : [];
    }
    const a = articles.find((x) => (x.data.translationOf ?? articleSlug(x)) === slug);
    return a ? [{ href: articleUrl(a), title: a.data.title, emoji: pick.emoji, label: pick.label[lang] }] : [];
  });
}
