interface AnswerCardProps {
  answer: string;
}

export function AnswerCard({ answer }: AnswerCardProps) {
  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">{answer}</p>
    </div>
  );
}
