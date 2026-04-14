import LuckyDrawEvent from './components/LuckyDrawEvent';
import LuckyDrawHistory from './components/LuckyDrawHistory';

const LuckyDraw = () => {
  return (
    <div>
      <LuckyDrawEvent />
      <LuckyDrawHistory className="mt-7"/>
    </div>
  );
};

export default LuckyDraw;
