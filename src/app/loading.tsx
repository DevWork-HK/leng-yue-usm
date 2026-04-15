import SpinnerEmpty from '@/components/custom/SpinnerEmpty';

const loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <SpinnerEmpty />
    </div>
  );
};

export default loading;
