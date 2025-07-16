import type { Log } from "../types";

export const TEST_LOGS_DATA: Omit<Log, "id" | "date">[] = [
	{
		situation: "上司からのメールで急な会議を要求された",
		autoThought: "またダメ出しされるんだろう。自分の仕事は評価されていない",
		beforeMoods: [
			{ name: "不安", level: 4 },
			{ name: "イライラ", level: 3 },
		],
		afterMoods: [
			{ name: "不安", level: 2 },
			{ name: "イライラ", level: 1 },
		],
		evidence: "前回の会議で指摘されたことがある、最近忙しくてミスが増えている",
		counterEvidence:
			"過去にも褒められたことがある、今回は緊急性の高い案件かもしれない",
		newThought: "会議の目的を確認してから判断しよう。必ずしも批判とは限らない",
		isFavorite: false,
	},
	{
		situation: "友人からのLINEの返信が遅い",
		autoThought: "嫌われているのかもしれない。何か気に障ることをしたのかな",
		beforeMoods: [
			{ name: "不安", level: 5 },
			{ name: "ゆううつ", level: 3 },
		],
		afterMoods: [
			{ name: "不安", level: 2 },
			{ name: "ゆううつ", level: 1 },
		],
		evidence: "いつもよりレスポンスが遅い、絵文字が少ない",
		counterEvidence: "友人も忙しい時期、体調不良かもしれない、普段は優しい人",
		newThought: "相手にも事情があるかもしれない。心配なら直接聞いてみよう",
		isFavorite: true,
	},
	{
		situation: "プレゼンテーションで質問に答えられなかった",
		autoThought: "準備不足だった。みんなに能力不足だと思われた",
		beforeMoods: [
			{ name: "焦り", level: 5 },
			{ name: "虚しさ", level: 4 },
		],
		afterMoods: [
			{ name: "焦り", level: 2 },
			{ name: "虚しさ", level: 2 },
		],
		evidence: "その場で答えられなかった、準備時間が足りなかった",
		counterEvidence:
			"他の質問には答えられた、内容自体は評価された、次回に活かせる",
		newThought:
			"完璧でなくても価値のあるプレゼンだった。学習の機会として捉えよう",
		isFavorite: false,
	},
	{
		situation: "SNSで他人の成功投稿を見た",
		autoThought: "自分だけが取り残されている。努力が足りないのかもしれない",
		beforeMoods: [
			{ name: "ゆううつ", level: 4 },
			{ name: "無気力", level: 3 },
		],
		afterMoods: [
			{ name: "ゆううつ", level: 2 },
			{ name: "無気力", level: 1 },
		],
		evidence: "周りが充実して見える、自分の進歩が感じられない",
		counterEvidence:
			"SNSは良い面だけ見せがち、自分なりのペースで成長している、比較する必要はない",
		newThought: "他人と比較せず、自分の成長に焦点を当てよう。小さな進歩も大切",
		isFavorite: false,
	},
	{
		situation: "電車で席を譲らなかった時のこと",
		autoThought: "周りの人に冷たい人だと思われたかもしれない",
		beforeMoods: [
			{ name: "虚しさ", level: 3 },
			{ name: "不安", level: 2 },
		],
		afterMoods: [
			{ name: "虚しさ", level: 1 },
			{ name: "不安", level: 1 },
		],
		evidence: "疲れていて座っていたかった、他にも座っている人がいた",
		counterEvidence:
			"体調が悪かったのは事実、誰も批判していない、次回は譲ればよい",
		newThought: "その時の状況を考慮すれば仕方なかった。次回気をつければよい",
		isFavorite: true,
	},
];
