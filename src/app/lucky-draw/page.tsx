import { PartyPopper } from 'lucide-react';
import LuckyDrawEvent from './components/LuckyDrawEvent';
import LuckyDrawHistory from './components/LuckyDrawHistory';

const LuckyDraw = () => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-x-4">
        <PartyPopper className='stroke-violet-600'/> Lucky Draw
      </h2>
      <LuckyDrawEvent />
      <LuckyDrawHistory className="mt-7" />
    </div>
  );
};

export default LuckyDraw;
