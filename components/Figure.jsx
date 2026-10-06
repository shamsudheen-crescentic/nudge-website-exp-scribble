// Floating nudge object with a speech-bubble label (behaviour wired up in lib/story.js).
export default function Figure({ label, size = 'sm', delay, floatClass = '' }) {
  return (
    <div className={`figure ${size}`} data-label={label}>
      <div className="shadow"></div>
      <div className={`float${floatClass ? ` ${floatClass}` : ''}`} style={delay === undefined ? undefined : { animationDelay: delay }}>
        <img src="https://ik.imagekit.io/kaxkoe34s/Rectangle_2301-removebg-preview.png" alt="nudge, a smiling teal blob" decoding="async" draggable="false" />
      </div>
      <div className="bubble" aria-hidden="true"><span></span><i>|</i></div>
    </div>
  );
}
