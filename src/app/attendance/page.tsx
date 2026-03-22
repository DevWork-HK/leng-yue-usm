import AddEvent from './components/AddEvent';

const AttendancePage = () => {
  return (
    <div className="mt-5">
      <div>
        <div className="flex flex-nowrap justify-between items-center">
          <h2 className="text-2xl font-bold">Attendance</h2>
          <AddEvent />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold">History</h2>
      </div>
    </div>
  );
};

export default AttendancePage;
