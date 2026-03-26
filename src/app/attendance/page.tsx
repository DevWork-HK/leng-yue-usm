import AddEvent from './components/AddEvent';
import AttendanceStat from './components/AttendanceStat';
import EventList from './components/EventList';

const AttendancePage = () => {
  return (
    <div className="mt-5">
      <div className="mb-6">
        <div className="flex flex-nowrap justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Attendance</h2>
          <AddEvent />
        </div>
        <AttendanceStat />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">History</h2>
        <EventList />
      </div>
    </div>
  );
};

export default AttendancePage;
