/** Generates motivational life-benefit forecasts based on consistency rate */
export function getLifeBenefits(rate: number): string[] {
  if (rate >= 0.9) return [
    "🧠 Strong neural pathways — habits become automatic",
    "💪 Significant physical/mental transformation visible",
    "🏆 Top 1% discipline — career & health breakthroughs",
    "🧘 Deep inner peace from mastered self-control",
  ];
  if (rate >= 0.7) return [
    "📈 Compounding growth — skills noticeably sharpen",
    "😊 Improved mood and reduced stress levels",
    "🎯 Clear focus and better decision-making",
    "🤝 Stronger relationships through reliability",
  ];
  if (rate >= 0.5) return [
    "🌱 Habit formation underway — keep building momentum",
    "⚡ More energy from consistent routines",
    "📊 Measurable progress in your chosen activities",
  ];
  if (rate >= 0.2) return [
    "🔑 Awareness is growing — you know what matters",
    "🌅 Each day you show up, you're ahead of yesterday",
  ];
  return [
    "⏳ Start small — even 5 minutes daily changes your year",
    "🚀 One consistent month can reshape your trajectory",
  ];
}
