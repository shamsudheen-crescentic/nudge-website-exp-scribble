import { SCRIBBLE } from '@/lib/scribble';

// The tangled scribble that draws itself on load, stroke by stroke.
export default function Scribble() {
  return SCRIBBLE.map(([duration, delay, d, stroke], i) => (
    <path
      key={i}
      className="animate-draw-string"
      style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s`, animationTimingFunction: 'linear' }}
      pathLength="1"
      strokeDasharray="1"
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  ));
}
